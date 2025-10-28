// تطبيق آل سعيدان - JavaScript الرئيسي

// إعداد العامة
const API_BASE_URL = '/api';

// ================== نظام إدارة قاعدة البيانات مع المزامنة الفورية ==================

class DatabaseManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.lastSyncTime = Date.now();
    this.eventListeners = new Map();
    
    // مراقبة حالة الاتصال
    this.setupConnectionMonitoring();
    
    // تحديث تلقائي كل 30 ثانية
    this.setupPeriodicSync();
    
    console.log('📡 DatabaseManager - تم تهيئة نظام المزامنة الفورية');
  }
  
  // ================= مراقبة الاتصال والمزامنة =================
  
  setupConnectionMonitoring() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🟢 DatabaseManager - تم استعادة الاتصال');
      this.syncPendingOperations();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('🔴 DatabaseManager - انقطع الاتصال - سيتم المزامنة عند العودة');
    });
  }
  
  setupPeriodicSync() {
    setInterval(() => {
      if (this.isOnline) {
        this.syncLatestChanges();
      }
    }, 30000); // كل 30 ثانية
  }
  
  // ================= إدارة المستمعين للتحديثات الفورية =================
  
  addEventListener(eventType, callback) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType).push(callback);
  }
  
  removeEventListener(eventType, callback) {
    if (this.eventListeners.has(eventType)) {
      const listeners = this.eventListeners.get(eventType);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
  
  notifyListeners(eventType, data) {
    if (this.eventListeners.has(eventType)) {
      this.eventListeners.get(eventType).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('خطأ في تنفيذ مستمع الحدث:', error);
        }
      });
    }
  }
  
  // ================= العمليات الأساسية على API =================
  
  async apiCall(method, endpoint, data = null, options = {}) {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      config.body = JSON.stringify(data);
    }
    
    try {
      console.log(`🌐 API ${method.toUpperCase()}: ${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }
      
      console.log(`✅ API Success: ${endpoint}`);
      
      // إشعار بالنجاح
      this.notifyListeners('api_success', { method, endpoint, data: result });
      
      return result;
    } catch (error) {
      console.error(`❌ API Error ${method} ${endpoint}:`, error);
      
      // إضافة للقائمة في حالة فقدان الاتصال
      if (!this.isOnline || error.message.includes('fetch')) {
        this.queueOperation(method, endpoint, data);
      }
      
      // إشعار بالخطأ
      this.notifyListeners('api_error', { method, endpoint, error: error.message });
      
      throw error;
    }
  }
  
  queueOperation(method, endpoint, data) {
    this.syncQueue.push({ method, endpoint, data, timestamp: Date.now() });
    console.log('📥 تمت إضافة عملية للقائمة المؤجلة:', { method, endpoint });
  }
  
  async syncPendingOperations() {
    if (this.syncQueue.length === 0) return;
    
    console.log(`🔄 مزامنة ${this.syncQueue.length} عمليات مؤجلة...`);
    
    const operations = [...this.syncQueue];
    this.syncQueue = [];
    
    for (const operation of operations) {
      try {
        await this.apiCall(operation.method, operation.endpoint, operation.data);
        console.log('✅ تمت مزامنة العملية:', operation);
      } catch (error) {
        console.error('❌ فشلت مزامنة العملية:', operation, error);
        // إعادة إضافة للقائمة
        this.syncQueue.push(operation);
      }
    }
  }
  
  // ================= مزامنة التحديثات الجديدة =================
  
  async syncLatestChanges() {
    try {
      const response = await this.apiCall('GET', `/activity?since=${this.lastSyncTime}`);
      
      if (response.success && response.data.length > 0) {
        console.log(`🔄 تم اكتشاف ${response.data.length} تحديث جديد`);
        
        // إشعار بالتحديثات الجديدة
        this.notifyListeners('data_updated', response.data);
        
        // تحديث آخر وقت مزامنة
        this.lastSyncTime = Date.now();
      }
    } catch (error) {
      console.error('❌ خطأ في مزامنة التحديثات:', error);
    }
  }
  
  // ================= إدارة أعضاء العائلة =================
  
  async getFamilyMembers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/family-members${queryParams ? '?' + queryParams : ''}`;
    
    const result = await this.apiCall('GET', endpoint);
    return result.data || [];
  }
  
  async getFamilyMember(memberId) {
    const result = await this.apiCall('GET', `/family-members/${memberId}`);
    return result.data;
  }
  
  async createFamilyMember(memberData) {
    const result = await this.apiCall('POST', '/family-members', memberData);
    
    // إشعار بإضافة عضو جديد
    this.notifyListeners('member_added', result.data);
    
    return result;
  }
  
  async updateFamilyMember(memberId, memberData) {
    const result = await this.apiCall('PUT', `/family-members/${memberId}`, memberData);
    
    // إشعار بتحديث العضو
    this.notifyListeners('member_updated', { id: memberId, data: result.data });
    
    return result;
  }
  
  async deleteFamilyMember(memberId) {
    const result = await this.apiCall('DELETE', `/family-members/${memberId}`);
    
    // إشعار بحذف العضو
    this.notifyListeners('member_deleted', { id: memberId });
    
    return result;
  }
  
  // ================= إدارة الفعاليات =================
  
  async getEvents(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/events${queryParams ? '?' + queryParams : ''}`;
    
    const result = await this.apiCall('GET', endpoint);
    return result.data || [];
  }
  
  async getEvent(eventId) {
    const result = await this.apiCall('GET', `/events/${eventId}`);
    return result.data;
  }
  
  async createEvent(eventData) {
    const result = await this.apiCall('POST', '/events', eventData);
    
    // إشعار بإضافة فعالية جديدة
    this.notifyListeners('event_added', result.data);
    
    return result;
  }
  
  async updateEvent(eventId, eventData) {
    const result = await this.apiCall('PUT', `/events/${eventId}`, eventData);
    
    // إشعار بتحديث الفعالية
    this.notifyListeners('event_updated', { id: eventId, data: result.data });
    
    return result;
  }
  
  async deleteEvent(eventId) {
    const result = await this.apiCall('DELETE', `/events/${eventId}`);
    
    // إشعار بحذف الفعالية
    this.notifyListeners('event_deleted', { id: eventId });
    
    return result;
  }
  
  // ================= إدارة دعوات الفعاليات =================
  
  async getEventInvitations(eventId) {
    const result = await this.apiCall('GET', `/events/${eventId}/invitations`);
    return result.data || [];
  }
  
  async sendEventInvitations(eventId, invitationData) {
    const result = await this.apiCall('POST', `/events/${eventId}/send-invitations`, invitationData);
    
    // إشعار بإرسال الدعوات
    this.notifyListeners('invitations_sent', { eventId, data: result.data });
    
    return result;
  }
  
  async getInvitationStats(eventId) {
    const result = await this.apiCall('GET', `/events/${eventId}/invitation-stats`);
    return result.data;
  }
  
  // ================= إدارة المقترحات =================
  
  async getSuggestions(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/suggestions${queryParams ? '?' + queryParams : ''}`;
    
    const result = await this.apiCall('GET', endpoint);
    return result.data || [];
  }
  
  async createSuggestion(suggestionData) {
    const result = await this.apiCall('POST', '/suggestions', suggestionData);
    
    // إشعار بإضافة مقترح جديد
    this.notifyListeners('suggestion_added', result.data);
    
    return result;
  }
  
  async updateSuggestion(suggestionId, suggestionData) {
    const result = await this.apiCall('PUT', `/suggestions/${suggestionId}`, suggestionData);
    
    // إشعار بتحديث المقترح
    this.notifyListeners('suggestion_updated', { id: suggestionId, data: result.data });
    
    return result;
  }
  
  // ================= إدارة مكتبة التجارب =================
  
  async getLibraryItems(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/library${queryParams ? '?' + queryParams : ''}`;
    
    const result = await this.apiCall('GET', endpoint);
    return result.data || [];
  }
  
  async getFeaturedLibraryItems() {
    const result = await this.apiCall('GET', '/library/featured');
    return result.data || [];
  }
  
  async getLibraryCategories() {
    const result = await this.apiCall('GET', '/library/categories');
    return result.data || [];
  }
  
  async viewLibraryItem(itemId) {
    const result = await this.apiCall('POST', `/library/view/${itemId}`);
    
    // إشعار بمشاهدة المحتوى
    this.notifyListeners('content_viewed', { id: itemId });
    
    return result;
  }
  
  // ================= إدارة سجل الأنشطة =================
  
  async getActivityLog(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/activity${queryParams ? '?' + queryParams : ''}`;
    
    const result = await this.apiCall('GET', endpoint);
    return result.data || [];
  }
  
  // ================= اختبار الاتصال =================
  
  async testConnection() {
    try {
      const result = await this.apiCall('GET', '/test');
      console.log('✅ اختبار الاتصال ناجح:', result);
      return true;
    } catch (error) {
      console.error('❌ فشل اختبار الاتصال:', error);
      return false;
    }
  }
  
  // ================= وظائف المساعدة =================
  
  // إزالة جميع المستمعين
  clearAllListeners() {
    this.eventListeners.clear();
  }
  
  // إحصائيات المزامنة
  getSyncStats() {
    return {
      isOnline: this.isOnline,
      pendingOperations: this.syncQueue.length,
      lastSyncTime: this.lastSyncTime,
      listeners: Array.from(this.eventListeners.keys())
    };
  }
  
  // فرض المزامنة الفورية
  async forcSync() {
    console.log('🔄 فرض المزامنة الفورية...');
    
    await this.syncPendingOperations();
    await this.syncLatestChanges();
    
    console.log('✅ تمت المزامنة الفورية');
  }
}

// إنشاء instance عامة لـ DatabaseManager
const dbManager = new DatabaseManager();

// وظائف مساعدة
class AlSaedanApp {
  constructor() {
    this.init();
  }

  init() {
    console.log('تطبيق آل سعيدان - تم التحميل بنجاح');
    this.setupEventListeners();
    this.setupAnimations();
  }

  // إعداد مستمعي الأحداث
  setupEventListeners() {
    // تحسين التنقل للهواتف المحمولة
    this.setupMobileNavigation();
    
    // إعداد النماذج
    this.setupForms();
    
    // إعداد التنقل السلس
    this.setupSmoothScrolling();
  }

  // إعداد التنقل للهواتف المحمولة
  setupMobileNavigation() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }

  // إعداد النماذج
  setupForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', this.handleFormSubmit.bind(this));
    });
  }

  // التعامل مع إرسال النماذج
  async handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      this.showLoading(true);
      
      const response = await axios.post(form.action, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        this.showAlert('success', 'تم الإرسال بنجاح!');
        form.reset();
      } else {
        this.showAlert('error', 'حدث خطأ، يرجى المحاولة مرة أخرى');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showAlert('error', 'حدث خطأ في الاتصال، يرجى المحاولة لاحقاً');
    } finally {
      this.showLoading(false);
    }
  }

  // إعداد التنقل السلس
  setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // إعداد الحركات
  setupAnimations() {
    // تحريك العناصر عند الظهور في الشاشة
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    // مراقبة البطاقات والعناصر القابلة للتحريك
    const animatedElements = document.querySelectorAll('.card, .feature-item');
    animatedElements.forEach(el => observer.observe(el));
  }

  // عرض التنبيهات
  showAlert(type, message) {
    const alertContainer = document.getElementById('alert-container') || this.createAlertContainer();
    
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} animate-fade-in-up`;
    alertElement.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'} ml-2"></i>
      ${message}
      <button class="float-left bg-transparent border-none text-lg cursor-pointer" onclick="this.parentElement.remove()">×</button>
    `;
    
    alertContainer.appendChild(alertElement);

    // إزالة التنبيه تلقائياً بعد 5 ثوان
    setTimeout(() => {
      if (alertElement.parentElement) {
        alertElement.remove();
      }
    }, 5000);
  }

  // إنشاء حاوي التنبيهات
  createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.className = 'fixed top-4 right-4 z-50 max-w-md';
    document.body.appendChild(container);
    return container;
  }

  // عرض/إخفاء اللودنغ
  showLoading(show) {
    let loadingElement = document.getElementById('loading-spinner');
    
    if (show && !loadingElement) {
      loadingElement = document.createElement('div');
      loadingElement.id = 'loading-spinner';
      loadingElement.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      loadingElement.innerHTML = `
        <div class="bg-white rounded-lg p-6 text-center">
          <div class="loading-spinner mx-auto mb-4"></div>
          <p class="text-gray-700">يرجى الانتظار...</p>
        </div>
      `;
      document.body.appendChild(loadingElement);
    } else if (!show && loadingElement) {
      loadingElement.remove();
    }
  }

  // API وظائف - تم استبدالها بـ DatabaseManager
  async fetchFamilyMembers() {
    return await dbManager.getFamilyMembers();
  }

  async fetchEvents() {
    return await dbManager.getEvents();
  }

  async fetchSuggestions() {
    return await dbManager.getSuggestions();
  }

  // وظائف إضافية للتطبيق
  formatDate(dateString) {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      calendar: 'islamic-umalqura' 
    };
    return new Intl.DateTimeFormat('ar-SA', options).format(new Date(dateString));
  }

  formatPhoneNumber(phone) {
    if (!phone) return '';
    return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  }

  // تصدير دوال للاستخدام العام
  exportUtils() {
    window.AlSaedanUtils = {
      formatDate: this.formatDate,
      formatPhoneNumber: this.formatPhoneNumber,
      showAlert: this.showAlert.bind(this),
      showLoading: this.showLoading.bind(this)
    };
  }
}

// تهيئة التطبيق عند تحميل الصفحة - محدّث مع DatabaseManager
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 تهيئة تطبيق آل سعيدان مع المزامنة الفورية...');
  
  const app = new AlSaedanApp();
  app.exportUtils();
  
  // إعداد مراقبة التحديثات العامة
  setupGlobalNotifications();
  
  // اختبار الاتصال بقاعدة البيانات
  try {
    const isConnected = await dbManager.testConnection();
    if (isConnected) {
      console.log('✅ الاتصال بقاعدة البيانات ناجح');
      showConnectionStatus(true);
    } else {
      console.log('❌ فشل الاتصال بقاعدة البيانات');
      showConnectionStatus(false);
    }
  } catch (error) {
    console.error('❌ خطأ في اختبار الاتصال:', error);
    showConnectionStatus(false);
  }
  
  // تحديد نوع الصفحة وتحميل البيانات المناسبة
  const currentPath = window.location.pathname;
  
  console.log(`📍 تحميل صفحة: ${currentPath}`);
  
  if (currentPath === '/family') {
    loadFamilyTree();
  } else if (currentPath === '/events') {
    loadEvents();
  } else if (currentPath === '/suggestions') {
    loadSuggestions();
    setupSuggestionForm();
  } else if (currentPath === '/library') {
    loadLibraryContent();
    setupLibraryFilters();
  }
  
  console.log('✅ تم تهيئة التطبيق بنجاح');
});

// ================= نظام الإشعارات الفورية =================

// إعداد مراقبة التحديثات العامة
function setupGlobalNotifications() {
  // إشعارات النجاح
  dbManager.addEventListener('api_success', (data) => {
    console.log('✨ API Success:', data.endpoint);
    updateLastSyncTime();
  });
  
  // إشعارات الخطأ
  dbManager.addEventListener('api_error', (data) => {
    console.error('❌ API Error:', data.endpoint, data.error);
    showConnectionStatus(false);
  });
  
  // إشعارات التحديثات الجديدة
  dbManager.addEventListener('data_updated', (activities) => {
    console.log(`🔄 تحديثات جديدة: ${activities.length}`);
    
    // إظهار إشعار للمستخدم
    activities.forEach(activity => {
      showUpdateNotification(activity);
    });
    
    updateLastSyncTime();
  });
  
  // مراقبة حالة الاتصال
  window.addEventListener('online', () => {
    console.log('🟢 عودة الاتصال');
    showConnectionStatus(true);
    AlSaedanUtils.showAlert('success', 'تم استعادة الاتصال بقاعدة البيانات');
  });
  
  window.addEventListener('offline', () => {
    console.log('🔴 انقطاع الاتصال');
    showConnectionStatus(false);
    AlSaedanUtils.showAlert('warning', 'انقطع الاتصال - سيتم المزامنة عند العودة');
  });
}

// عرض إشعار تحديث
function showUpdateNotification(activity) {
  const messages = {
    'family_members': 'تم تحديث بيانات العائلة',
    'events': 'تم تحديث الفعاليات',
    'suggestions': 'تم تحديث المقترحات',
    'library_items': 'تم تحديث مكتبة التجارب'
  };
  
  const message = messages[activity.table_name] || `تحديث جديد: ${activity.action}`;
  
  // إظهار إشعار بسيط
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-all duration-300';
  notification.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-sync-alt animate-spin mr-2"></i>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // إزالة تلقائية بعد 5 ثوان
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// عرض حالة الاتصال
function showConnectionStatus(isConnected) {
  let statusIndicator = document.getElementById('connection-status');
  
  if (!statusIndicator) {
    statusIndicator = document.createElement('div');
    statusIndicator.id = 'connection-status';
    statusIndicator.className = 'fixed bottom-4 right-4 px-3 py-2 rounded-full text-sm font-medium z-40 transition-all duration-300';
    document.body.appendChild(statusIndicator);
  }
  
  if (isConnected) {
    statusIndicator.className = statusIndicator.className.replace(/bg-\w+-\d+/, '') + ' bg-green-500 text-white';
    statusIndicator.innerHTML = '<i class="fas fa-check-circle mr-1"></i>متصل';
  } else {
    statusIndicator.className = statusIndicator.className.replace(/bg-\w+-\d+/, '') + ' bg-red-500 text-white';
    statusIndicator.innerHTML = '<i class="fas fa-exclamation-triangle mr-1"></i>غير متصل';
  }
}

// تحديث آخر وقت مزامنة
function updateLastSyncTime() {
  const syncTimeElement = document.getElementById('last-sync-time');
  if (syncTimeElement) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
    syncTimeElement.textContent = `آخر مزامنة: ${timeString}`;
  }
}

// ================= وظائف مساعدة للمزامنة اليدوية =================

// فرض مزامنة فورية
async function forceRefresh() {
  try {
    console.log('🔄 فرض المزامنة الفورية...');
    AlSaedanUtils.showLoading(true);
    
    await dbManager.forcSync();
    
    // إعادة تحميل الصفحة الحالية
    const currentPath = window.location.pathname;
    if (currentPath === '/family') {
      await loadFamilyTree();
    } else if (currentPath === '/events') {
      await loadEvents();
    } else if (currentPath === '/suggestions') {
      await loadSuggestions();
    } else if (currentPath === '/library') {
      await loadLibraryContent();
    }
    
    AlSaedanUtils.showAlert('success', 'تمت المزامنة بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في المزامنة:', error);
    AlSaedanUtils.showAlert('error', 'حدث خطأ في المزامنة');
  } finally {
    AlSaedanUtils.showLoading(false);
  }
}

// عرض إحصائيات المزامنة
function showSyncStats() {
  const stats = dbManager.getSyncStats();
  const statsHtml = `
    <div class="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
      <h3 class="text-lg font-bold mb-4">إحصائيات المزامنة</h3>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span>حالة الاتصال:</span>
          <span class="${stats.isOnline ? 'text-green-600' : 'text-red-600'}">
            ${stats.isOnline ? 'متصل' : 'غير متصل'}
          </span>
        </div>
        <div class="flex justify-between">
          <span>عمليات مؤجلة:</span>
          <span>${stats.pendingOperations}</span>
        </div>
        <div class="flex justify-between">
          <span>آخر مزامنة:</span>
          <span>${new Date(stats.lastSyncTime).toLocaleTimeString('ar-SA')}</span>
        </div>
        <div class="flex justify-between">
          <span>مراقبي نشطين:</span>
          <span>${stats.listeners.length}</span>
        </div>
      </div>
      <button onclick="forceRefresh()" class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
        فرض مزامنة فورية
      </button>
    </div>
  `;
  
  AlSaedanUtils.showAlert('info', statsHtml);
}

// إتاحة الوظائف عبر window للوصول إليها من HTML
window.forceRefresh = forceRefresh;
window.showSyncStats = showSyncStats;
window.dbManager = dbManager; // للتطوير والاختبار

// متغيرات عامة لإدارة العائلة
let isEditMode = false;
let familyMembers = [];
let memberToDelete = null;

// تحميل شجرة العائلة مع إدارة الأعضاء - محدّث لـ DatabaseManager
async function loadFamilyTree() {
  try {
    console.log('🌳 تحميل شجرة العائلة...');
    
    // استخدام DatabaseManager لاسترجاع البيانات
    familyMembers = await dbManager.getFamilyMembers();
    
    console.log(`✅ تم تحميل ${familyMembers.length} عضو`);
    
    displayFamilyTree(familyMembers);
    setupFamilyManagement();
    
    // إعداد مستمع التحديثات الفورية
    dbManager.addEventListener('member_added', () => {
      console.log('🆕 تم إضافة عضو جديد - إعادة تحميل الشجرة');
      setTimeout(() => loadFamilyTree(), 1000);
    });
    
    dbManager.addEventListener('member_updated', () => {
      console.log('🔄 تم تحديث عضو - إعادة تحميل الشجرة');
      setTimeout(() => loadFamilyTree(), 1000);
    });
    
    dbManager.addEventListener('member_deleted', () => {
      console.log('🗑️ تم حذف عضو - إعادة تحميل الشجرة');
      setTimeout(() => loadFamilyTree(), 1000);
    });
    
    document.getElementById('family-loading').classList.add('hidden');
    document.getElementById('family-tree').classList.remove('hidden');
  } catch (error) {
    console.error('❌ خطأ في تحميل شجرة العائلة:', error);
    document.getElementById('family-loading').innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <p class="text-red-600">حدث خطأ في تحميل شجرة العائلة</p>
        <button onclick="loadFamilyTree()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          إعادة المحاولة
        </button>
      </div>
    `;
  }
}

// عرض شجرة العائلة مع أيقونات الإدارة
function displayFamilyTree(members) {
  const container = document.getElementById('family-tree');
  
  // تجميع الأعضاء حسب الجيل
  const membersByGeneration = {};
  members.forEach(member => {
    if (!membersByGeneration[member.generation]) {
      membersByGeneration[member.generation] = [];
    }
    membersByGeneration[member.generation].push(member);
  });
  
  let html = '';
  
  // عرض كل جيل
  Object.keys(membersByGeneration).sort().forEach(generation => {
    html += `
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800">
            ${generation == 1 ? 'الجيل الأول - المؤسس' : `الجيل ${generation}`}
          </h3>
          <span class="text-sm text-gray-500">${membersByGeneration[generation].length} أعضاء</span>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    `;
    
    membersByGeneration[generation].forEach(member => {
      const editButtonsHtml = isEditMode ? `
        <div class="mt-3 pt-3 border-t border-gray-200 flex justify-end space-x-2 space-x-reverse">
          <button onclick="editMember(${member.id})" 
                  class="text-blue-600 hover:text-blue-800 text-sm transition-colors" 
                  title="تعديل">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deleteMember(${member.id})" 
                  class="text-red-600 hover:text-red-800 text-sm transition-colors" 
                  title="حذف">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      ` : '';
      
      html += `
        <div class="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow relative">
          <div class="flex items-start space-x-4 space-x-reverse">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-white"></i>
              </div>
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-gray-800 mb-1">${member.full_name}</h4>
              ${member.field_of_excellence ? `<p class="text-sm text-blue-600 mb-1"><i class="fas fa-star ml-1"></i> ${member.field_of_excellence}</p>` : ''}
              ${member.phone ? `<p class="text-sm text-gray-600"><i class="fas fa-phone ml-1"></i> ${member.phone}</p>` : ''}
              ${member.email ? `<p class="text-sm text-gray-600"><i class="fas fa-envelope ml-1"></i> ${member.email}</p>` : ''}
              ${member.achievements ? `<p class="text-xs text-gray-500 mt-2">${member.achievements}</p>` : ''}
              
              <div class="flex items-center space-x-3 space-x-reverse mt-2">
                <span class="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  <i class="fas fa-layer-group ml-1"></i>
                  ${getRelationshipLevelText(member.relationship_level)}
                </span>
                ${member.birth_date ? `
                  <span class="text-xs text-gray-500">
                    <i class="fas fa-birthday-cake ml-1"></i>
                    ${formatDate(member.birth_date)}
                  </span>
                ` : ''}
              </div>
              
              ${editButtonsHtml}
            </div>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// تحميل الفعاليات - محدّث لـ DatabaseManager
async function loadEvents() {
  try {
    console.log('🎉 تحميل الفعاليات...');
    
    // استخدام DatabaseManager
    const events = await dbManager.getEvents();
    
    console.log(`✅ تم تحميل ${events.length} فعالية`);
    
    displayEvents(events);
    setupEventManagement();
    
    // إعداد مستمع التحديثات الفورية
    dbManager.addEventListener('event_added', () => {
      console.log('🆕 تم إضافة فعالية جديدة - إعادة تحميل الفعاليات');
      setTimeout(() => loadEvents(), 1000);
    });
    
    dbManager.addEventListener('event_updated', () => {
      console.log('🔄 تم تحديث فعالية - إعادة تحميل الفعاليات');
      setTimeout(() => loadEvents(), 1000);
    });
    
    document.getElementById('events-loading').classList.add('hidden');
    document.getElementById('events-list').classList.remove('hidden');
  } catch (error) {
    console.error('❌ خطأ في تحميل الفعاليات:', error);
    document.getElementById('events-loading').innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <p class="text-red-600">حدث خطأ في تحميل الفعاليات</p>
        <button onclick="loadEvents()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          إعادة المحاولة
        </button>
      </div>
    `;
  }
}

// عرض الفعاليات مع نظام الدعوات
function displayEvents(events) {
  const container = document.getElementById('events-list');
  
  if (events.length === 0) {
    document.getElementById('events-list').classList.add('hidden');
    document.getElementById('events-empty').classList.remove('hidden');
    return;
  }
  
  let html = '<div class="grid gap-6">';
  
  events.forEach(event => {
    const eventDate = new Date(event.event_date);
    const formattedDate = eventDate.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    html += `
      <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h4 class="text-xl font-semibold text-gray-800 mb-2">${event.title}</h4>
            <p class="text-gray-600 mb-3">${event.description || 'لا يوجد وصف'}</p>
          </div>
          <div class="flex-shrink-0 text-center">
            <div class="bg-white rounded-lg p-3 shadow-sm">
              <i class="fas fa-calendar text-blue-600 text-lg mb-1"></i>
              <div class="text-xs text-gray-600">${formattedDate}</div>
            </div>
          </div>
        </div>
        
        <div class="grid md:grid-cols-3 gap-4 text-sm mb-4">
          ${event.location ? `
            <div class="flex items-center">
              <i class="fas fa-map-marker-alt text-red-500 ml-2"></i>
              <span>${event.location}</span>
            </div>
          ` : ''}
          
          ${event.organizer_name ? `
            <div class="flex items-center">
              <i class="fas fa-user-tie text-blue-500 ml-2"></i>
              <span>${event.organizer_name}</span>
            </div>
          ` : ''}
          
          <div class="flex items-center">
            <i class="fas fa-tag text-green-500 ml-2"></i>
            <span>${getEventTypeText(event.event_type)}</span>
          </div>
        </div>
        
        <div class="flex justify-between items-center pt-4 border-t border-gray-200">
          <div class="flex items-center space-x-3 space-x-reverse">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(event.status)}">
              ${getStatusText(event.status)}
            </span>
            ${event.target_audience ? `
              <span class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                <i class="fas fa-users ml-1"></i>
                ${getTargetAudienceText(event.target_audience)}
              </span>
            ` : ''}
          </div>
          
          <div class="flex items-center space-x-2 space-x-reverse">
            <button onclick="viewEventInvitations(${event.id})" 
                    class="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors flex items-center">
              <i class="fas fa-envelope ml-1"></i>
              الدعوات
            </button>
            <button onclick="manageEventInvitations(${event.id})" 
                    class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all flex items-center">
              <i class="fas fa-paper-plane ml-1"></i>
              إدارة الدعوات
            </button>
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

// تحميل المقترحات - محدّث لـ DatabaseManager
async function loadSuggestions() {
  try {
    console.log('💡 تحميل المقترحات...');
    
    // استخدام DatabaseManager
    const suggestions = await dbManager.getSuggestions();
    
    console.log(`✅ تم تحميل ${suggestions.length} مقترح`);
    
    displaySuggestions(suggestions);
    
    // إعداد مستمع التحديثات الفورية
    dbManager.addEventListener('suggestion_added', () => {
      console.log('🆕 تم إضافة مقترح جديد - إعادة تحميل المقترحات');
      setTimeout(() => loadSuggestions(), 1000);
    });
    
    dbManager.addEventListener('suggestion_updated', () => {
      console.log('🔄 تم تحديث مقترح - إعادة تحميل المقترحات');
      setTimeout(() => loadSuggestions(), 1000);
    });
    
    document.getElementById('suggestions-loading').classList.add('hidden');
    document.getElementById('suggestions-list').classList.remove('hidden');
  } catch (error) {
    console.error('❌ خطأ في تحميل المقترحات:', error);
    document.getElementById('suggestions-loading').innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <p class="text-red-600">حدث خطأ في تحميل المقترحات</p>
        <button onclick="loadSuggestions()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          إعادة المحاولة
        </button>
      </div>
    `;
  }
}

// عرض المقترحات
function displaySuggestions(suggestions) {
  const container = document.getElementById('suggestions-list');
  
  if (suggestions.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-lightbulb text-gray-400 text-4xl mb-4"></i>
        <p class="text-gray-600">لا توجد مقترحات حالياً</p>
        <p class="text-sm text-gray-500">كن أول من يضع مقترحاً</p>
      </div>
    `;
    return;
  }
  
  let html = '<div class="grid gap-6">';
  
  suggestions.forEach(suggestion => {
    const createdDate = new Date(suggestion.created_at);
    const formattedDate = createdDate.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    html += `
      <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-gray-200">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h4 class="text-lg font-semibold text-gray-800 mb-2">${suggestion.title}</h4>
            <p class="text-gray-600 mb-3">${suggestion.description}</p>
          </div>
          <div class="flex-shrink-0">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadgeClass(suggestion.priority)}">
              ${getPriorityText(suggestion.priority)}
            </span>
          </div>
        </div>
        
        <div class="flex justify-between items-center text-sm text-gray-600">
          <div class="flex items-center space-x-4 space-x-reverse">
            <span><i class="fas fa-user ml-1"></i> ${suggestion.member_name || 'غير محدد'}</span>
            <span><i class="fas fa-calendar ml-1"></i> ${formattedDate}</span>
          </div>
          <div class="flex items-center">
            <span class="inline-flex items-center px-2 py-1 rounded text-xs ${getStatusBadgeClass(suggestion.status)}">
              ${getStatusText(suggestion.status)}
            </span>
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

// إعداد نموذج المقترحات
function setupSuggestionForm() {
  const form = document.getElementById('suggestion-form');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      member_id: 1 // سيتم تحديثه عند إضافة نظام المصادقة
    };
    
    try {
      AlSaedanUtils.showLoading(true);
      
      // استخدام DatabaseManager بدلاً من axios
      const response = await dbManager.createSuggestion(data);
      
      if (response.success) {
        AlSaedanUtils.showAlert('success', 'تم إرسال مقترحك بنجاح! شكراً لمساهمتك');
        form.reset();
        // المزامنة التلقائية عبر مستمع الأحداث - لا حاجة لإعادة التحميل يدوياً
      } else {
        AlSaedanUtils.showAlert('error', 'حدث خطأ في إرسال المقترح');
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      AlSaedanUtils.showAlert('error', 'حدث خطأ في الإرسال، يرجى المحاولة لاحقاً');
    } finally {
      AlSaedanUtils.showLoading(false);
    }
  });
}

// دوال مساعدة للنصوص والألوان
function getEventTypeText(type) {
  const types = {
    'general': 'عام',
    'meeting': 'اجتماع',
    'celebration': 'احتفال', 
    'educational': 'تعليمي'
  };
  return types[type] || type;
}

function getStatusText(status) {
  const statuses = {
    'pending': 'قيد المراجعة',
    'under_review': 'تحت الدراسة',
    'approved': 'معتمد',
    'implemented': 'منفذ',
    'rejected': 'مرفوض',
    'planned': 'مخطط',
    'active': 'نشط',
    'completed': 'مكتمل',
    'cancelled': 'ملغي'
  };
  return statuses[status] || status;
}

function getPriorityText(priority) {
  const priorities = {
    'low': 'منخفضة',
    'medium': 'متوسطة',
    'high': 'عالية'
  };
  return priorities[priority] || priority;
}

function getStatusBadgeClass(status) {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'under_review': 'bg-blue-100 text-blue-800',
    'approved': 'bg-green-100 text-green-800',
    'implemented': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'planned': 'bg-blue-100 text-blue-800',
    'active': 'bg-green-100 text-green-800',
    'completed': 'bg-gray-100 text-gray-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
}

function getPriorityBadgeClass(priority) {
  const classes = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-red-100 text-red-800'
  };
  return classes[priority] || 'bg-gray-100 text-gray-800';
}

// =================== مكتبة التجارب والخبرات ===================

// تحميل محتوى المكتبة - محدّث لـ DatabaseManager
async function loadLibraryContent() {
  try {
    console.log('📚 تحميل محتوى المكتبة...');
    
    // تحميل المحتوى المميز باستخدام DatabaseManager
    const featuredContent = await dbManager.getFeaturedLibraryItems();
    displayFeaturedContent(featuredContent);
    document.getElementById('featured-loading').classList.add('hidden');
    document.getElementById('featured-content').classList.remove('hidden');

    // تحميل جميع المحتوى
    const allContent = await dbManager.getLibraryItems();
    displayLibraryContent(allContent);
    document.getElementById('content-loading').classList.add('hidden');
    document.getElementById('content-list').classList.remove('hidden');

    // تحميل إحصائيات الفئات
    const categories = await dbManager.getLibraryCategories();
    displayCategoryStats(categories);
    
    console.log('✅ تم تحميل محتوى المكتبة بنجاح');
    
    // إعداد مستمع التحديثات الفورية
    dbManager.addEventListener('content_viewed', () => {
      console.log('👁️ تمت مشاهدة محتوى - تحديث العدادات');
    });

  } catch (error) {
    console.error('❌ خطأ في تحميل محتوى المكتبة:', error);
    document.getElementById('featured-loading').innerHTML = `
      <div class="text-center py-8">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <p class="text-red-600">حدث خطأ في تحميل محتوى المكتبة</p>
        <button onclick="loadLibraryContent()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          إعادة المحاولة
        </button>
      </div>
    `;
    document.getElementById('content-loading').innerHTML = `
      <div class="text-center py-8">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <p class="text-red-600">حدث خطأ في تحميل المحتوى</p>
        <button onclick="loadLibraryContent()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          إعادة المحاولة
        </button>
      </div>
    `;
  }
}

// عرض المحتوى المميز
function displayFeaturedContent(content) {
  const container = document.getElementById('featured-content');
  
  if (content.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-8">
        <i class="fas fa-star text-gray-400 text-4xl mb-4"></i>
        <p class="text-gray-600">لا يوجد محتوى مميز حالياً</p>
      </div>
    `;
    return;
  }

  let html = '';
  
  content.forEach(item => {
    html += `
      <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 hover:shadow-lg transition-all cursor-pointer" onclick="viewContent(${item.id})">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center ml-3">
              <i class="fas ${getContentIcon(item.content_type)} text-white"></i>
            </div>
            <div>
              <span class="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full mb-1">
                ${getCategoryText(item.category)}
              </span>
            </div>
          </div>
          <div class="flex items-center text-xs text-gray-500">
            <i class="fas fa-eye ml-1"></i>
            <span>${item.views || 0}</span>
          </div>
        </div>
        
        <h4 class="text-lg font-semibold text-gray-800 mb-2 leading-tight">${item.title}</h4>
        <p class="text-gray-600 text-sm mb-4 line-clamp-3">${item.description}</p>
        
        <div class="flex items-center justify-between text-xs text-gray-500">
          <div class="flex items-center">
            <i class="fas fa-user ml-1"></i>
            <span>${item.author_name || 'مجهول'}</span>
          </div>
          <div class="flex items-center">
            <i class="fas fa-calendar ml-1"></i>
            <span>${formatDate(item.published_at)}</span>
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// عرض جميع المحتوى
function displayLibraryContent(content) {
  const container = document.getElementById('content-list');
  
  if (content.length === 0) {
    document.getElementById('content-list').classList.add('hidden');
    document.getElementById('empty-state').classList.remove('hidden');
    return;
  }

  let html = '';
  
  content.forEach(item => {
    html += `
      <div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer" onclick="viewContent(${item.id})">
        <div class="flex items-start space-x-4 space-x-reverse">
          <div class="flex-shrink-0">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <i class="fas ${getContentIcon(item.content_type)} text-white text-xl"></i>
            </div>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2 space-x-reverse">
                <span class="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  ${getCategoryText(item.category)}
                </span>
                <span class="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  ${getContentTypeText(item.content_type)}
                </span>
                ${item.is_featured ? '<span class="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"><i class="fas fa-star mr-1"></i>مميز</span>' : ''}
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <i class="fas fa-eye ml-1"></i>
                <span>${item.views || 0}</span>
              </div>
            </div>
            
            <h3 class="text-xl font-semibold text-gray-800 mb-2">${item.title}</h3>
            <p class="text-gray-600 mb-4 line-clamp-2">${item.description}</p>
            
            <div class="flex items-center justify-between text-sm text-gray-500">
              <div class="flex items-center space-x-4 space-x-reverse">
                <div class="flex items-center">
                  <i class="fas fa-user ml-1"></i>
                  <span>${item.author_name || 'مجهول'}</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-calendar ml-1"></i>
                  <span>${formatDate(item.published_at)}</span>
                </div>
                ${item.duration ? `
                  <div class="flex items-center">
                    <i class="fas fa-clock ml-1"></i>
                    <span>${item.duration} دقيقة</span>
                  </div>
                ` : ''}
              </div>
              
              <button class="text-purple-600 hover:text-purple-800 font-medium transition-colors">
                ${item.content_type === 'video' ? 'مشاهدة' : item.content_type === 'audio' ? 'استماع' : 'قراءة'}
                <i class="fas fa-arrow-left mr-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// عرض إحصائيات الفئات
function displayCategoryStats(stats) {
  const container = document.getElementById('category-stats');
  
  let html = '';
  
  stats.forEach(stat => {
    html += `
      <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div class="text-2xl font-bold text-blue-600 mb-1">${stat.count}</div>
        <div class="text-sm text-gray-600">${getCategoryText(stat.category)}</div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// إعداد فلاتر المكتبة
function setupLibraryFilters() {
  const categoryFilter = document.getElementById('category-filter');
  const contentTypeFilter = document.getElementById('content-type-filter');

  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterLibraryContent);
  }
  
  if (contentTypeFilter) {
    contentTypeFilter.addEventListener('change', filterLibraryContent);
  }
}

// فلترة محتوى المكتبة
async function filterLibraryContent() {
  const category = document.getElementById('category-filter').value;
  const contentType = document.getElementById('content-type-filter').value;
  
  try {
    AlSaedanUtils.showLoading(true);
    
    let url = '/api/library';
    const params = new URLSearchParams();
    
    if (category !== 'all') params.append('category', category);
    if (contentType !== 'all') params.append('content_type', contentType);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const content = await dbManager.getLibraryItems(Object.fromEntries(params));
    displayLibraryContent(content);
    
  } catch (error) {
    console.error('Error filtering content:', error);
    AlSaedanUtils.showAlert('error', 'حدث خطأ في تطبيق الفلتر');
  } finally {
    AlSaedanUtils.showLoading(false);
  }
}

// عرض محتوى معين
async function viewContent(contentId) {
  try {
    // تحديث عدد المشاهدات باستخدام DatabaseManager
    await dbManager.viewLibraryItem(contentId);
    
    // في التطبيق الحقيقي، هنا سنفتح صفحة المحتوى أو modal
    AlSaedanUtils.showAlert('info', 'سيتم فتح المحتوى قريباً...');
    
  } catch (error) {
    console.error('Error viewing content:', error);
  }
}

// دوال مساعدة لمكتبة التجارب
function getContentIcon(contentType) {
  const icons = {
    'article': 'fa-file-alt',
    'video': 'fa-play-circle',
    'audio': 'fa-headphones',
    'document': 'fa-file-pdf'
  };
  return icons[contentType] || 'fa-file';
}

function getCategoryText(category) {
  const categories = {
    'business': 'الأعمال والتجارة',
    'education': 'التعليم والتطوير',
    'personal_development': 'التطوير الشخصي',
    'family_values': 'القيم العائلية',
    'leadership': 'القيادة والإدارة',
    'general': 'عام'
  };
  return categories[category] || category;
}

function getContentTypeText(contentType) {
  const types = {
    'article': 'مقال',
    'video': 'فيديو',
    'audio': 'صوتي',
    'document': 'وثيقة'
  };
  return types[contentType] || contentType;
}

function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  };
  return date.toLocaleDateString('ar-SA', options);
}

// وظائف مساعدة إضافية
function navigateToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// إعداد التحديث التلقائي للوقت
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  const arabicDate = now.toLocaleDateString('ar-SA', options);
  const dateElement = document.getElementById('current-date');
  if (dateElement) {
    dateElement.textContent = arabicDate;
  }
}

// ================= نظام الدعوات =================

// إعداد إدارة الفعاليات والدعوات
function setupEventManagement() {
  // أزرار إنشاء فعالية جديدة
  const createEventBtn = document.getElementById('create-event-btn');
  const manageInvitationsBtn = document.getElementById('manage-invitations-btn');
  
  // مودال إنشاء الفعالية
  const eventModal = document.getElementById('event-modal');
  const closeEventModal = document.getElementById('close-event-modal');
  const createEventForm = document.getElementById('create-event-form');
  
  // مودال إدارة الدعوات
  const invitationModal = document.getElementById('invitation-modal');
  const closeInvitationModal = document.getElementById('close-invitation-modal');
  const selectedEventSelect = document.getElementById('selected-event');
  const sendInvitationsBtn = document.getElementById('send-invitations-btn');
  
  // إعداد أحداث المودال
  if (createEventBtn) {
    createEventBtn.addEventListener('click', () => {
      eventModal.classList.remove('hidden');
    });
  }
  
  if (manageInvitationsBtn) {
    manageInvitationsBtn.addEventListener('click', () => {
      loadEventsForInvitation();
      invitationModal.classList.remove('hidden');
    });
  }
  
  if (closeEventModal) {
    closeEventModal.addEventListener('click', () => {
      eventModal.classList.add('hidden');
    });
  }
  
  if (closeInvitationModal) {
    closeInvitationModal.addEventListener('click', () => {
      invitationModal.classList.add('hidden');
    });
  }
  
  // إغلاق المودال عند النقر خارجه
  eventModal?.addEventListener('click', (e) => {
    if (e.target === eventModal) {
      eventModal.classList.add('hidden');
    }
  });
  
  invitationModal?.addEventListener('click', (e) => {
    if (e.target === invitationModal) {
      invitationModal.classList.add('hidden');
    }
  });
  
  // إعداد نموذج إنشاء الفعالية
  if (createEventForm) {
    createEventForm.addEventListener('submit', handleCreateEvent);
  }
  
  // إعداد تحديد الفعالية للدعوات
  if (selectedEventSelect) {
    selectedEventSelect.addEventListener('change', handleEventSelection);
  }
  
  // إعداد إرسال الدعوات
  if (sendInvitationsBtn) {
    sendInvitationsBtn.addEventListener('click', handleSendInvitations);
  }
}

// إنشاء فعالية جديدة
async function handleCreateEvent(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const eventData = {
    title: formData.get('title'),
    description: formData.get('description'),
    event_date: formData.get('event_date'),
    location: formData.get('location'),
    event_type: formData.get('event_type'),
    max_attendees: formData.get('max_attendees') ? parseInt(formData.get('max_attendees')) : null,
    organizer_id: 1 // سيتم تحديثه عند إضافة نظام المصادقة
  };
  
  try {
    AlSaedanUtils.showLoading(true);
    
    // استخدام DatabaseManager بدلاً من axios
    const response = await dbManager.createEvent(eventData);
    
    if (response.success) {
      AlSaedanUtils.showAlert('success', 'تم إنشاء الفعالية بنجاح!');
      document.getElementById('event-modal').classList.add('hidden');
      e.target.reset();
      
      // المزامنة التلقائية عبر مستمع الأحداث - لا حاجة لإعادة التحميل يدوياً
    } else {
      AlSaedanUtils.showAlert('error', 'حدث خطأ في إنشاء الفعالية');
    }
  } catch (error) {
    console.error('Error creating event:', error);
    AlSaedanUtils.showAlert('error', 'حدث خطأ في الإرسال، يرجى المحاولة لاحقاً');
  } finally {
    AlSaedanUtils.showLoading(false);
  }
}

// تحميل الفعاليات لقائمة الدعوات - محدّث لـ DatabaseManager
async function loadEventsForInvitation() {
  try {
    const events = await dbManager.getEvents();
    
    const select = document.getElementById('selected-event');
    select.innerHTML = '<option value="">اختر الفعالية للدعوة...</option>';
    
    events.forEach(event => {
      const eventDate = new Date(event.event_date).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      select.innerHTML += `
        <option value="${event.id}">${event.title} - ${eventDate}</option>
      `;
    });
    
  } catch (error) {
    console.error('Error loading events for invitation:', error);
  }
}

// التعامل مع تحديد الفعالية
async function handleEventSelection() {
  const eventId = document.getElementById('selected-event').value;
  const targetingDiv = document.getElementById('invitation-targeting');
  const statsDiv = document.getElementById('invitation-stats');
  
  if (!eventId) {
    targetingDiv.classList.add('hidden');
    statsDiv.classList.add('hidden');
    return;
  }
  
  targetingDiv.classList.remove('hidden');
  
  // تحميل الأعضاء للاختيار الفردي
  await loadMembersForSelection();
  
  // تحميل إحصائيات الدعوات إن وجدت
  await loadInvitationStats(eventId);
}

// تحميل الأعضاء للاختيار الفردي - محدّث لـ DatabaseManager
async function loadMembersForSelection() {
  try {
    const members = await dbManager.getFamilyMembers();
    
    const container = document.getElementById('individual-members');
    container.innerHTML = '';
    
    members.forEach(member => {
      container.innerHTML += `
        <label class="flex items-center text-sm">
          <input type="checkbox" name="individual_member" value="${member.id}" class="form-checkbox ml-2" />
          ${member.full_name}
        </label>
      `;
    });
    
  } catch (error) {
    console.error('Error loading members:', error);
  }
}

// تحميل إحصائيات الدعوات - محدّث لـ DatabaseManager
async function loadInvitationStats(eventId) {
  try {
    const stats = await dbManager.getInvitationStats(eventId);
    displayInvitationStats(stats);
    document.getElementById('invitation-stats').classList.remove('hidden');
  } catch (error) {
    console.error('Error loading invitation stats:', error);
  }
}

// عرض إحصائيات الدعوات
function displayInvitationStats(stats) {
  const container = document.getElementById('stats-content');
  
  container.innerHTML = `
    <div class="bg-blue-100 rounded-lg p-4 text-center">
      <div class="text-2xl font-bold text-blue-600">${stats.total}</div>
      <div class="text-sm text-blue-800">إجمالي الدعوات</div>
    </div>
    <div class="bg-yellow-100 rounded-lg p-4 text-center">
      <div class="text-2xl font-bold text-yellow-600">${stats.pending}</div>
      <div class="text-sm text-yellow-800">في الانتظار</div>
    </div>
    <div class="bg-green-100 rounded-lg p-4 text-center">
      <div class="text-2xl font-bold text-green-600">${stats.accepted}</div>
      <div class="text-sm text-green-800">مقبولة</div>
    </div>
    <div class="bg-red-100 rounded-lg p-4 text-center">
      <div class="text-2xl font-bold text-red-600">${stats.declined}</div>
      <div class="text-sm text-red-800">مرفوضة</div>
    </div>
  `;
}

// إرسال الدعوات
async function handleSendInvitations() {
  const eventId = document.getElementById('selected-event').value;
  const customMessage = document.getElementById('custom-message').value;
  
  if (!eventId) {
    AlSaedanUtils.showAlert('error', 'يرجى اختيار الفعالية أولاً');
    return;
  }
  
  // جمع مستويات القرابة المحددة
  const relationshipLevels = Array.from(document.querySelectorAll('input[name="relationship_level"]:checked'))
    .map(input => input.value);
  
  // جمع الأجيال المحددة  
  const generations = Array.from(document.querySelectorAll('input[name="generation"]:checked'))
    .map(input => parseInt(input.value));
  
  // جمع الأعضاء المحددين فردياً
  const individualMembers = Array.from(document.querySelectorAll('input[name="individual_member"]:checked'))
    .map(input => parseInt(input.value));
  
  if (relationshipLevels.length === 0 && generations.length === 0 && individualMembers.length === 0) {
    AlSaedanUtils.showAlert('error', 'يرجى اختيار من سيتم دعوتهم');
    return;
  }
  
  const invitationData = {
    target_levels: relationshipLevels,
    generations: generations,
    member_ids: individualMembers,
    custom_message: customMessage
  };
  
  try {
    AlSaedanUtils.showLoading(true);
    
    // استخدام DatabaseManager بدلاً من axios
    const response = await dbManager.sendEventInvitations(eventId, invitationData);
    
    if (response.success) {
      AlSaedanUtils.showAlert('success', response.message || 'تم إرسال الدعوات بنجاح');
      
      // تنظيف النموذج
      document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
      document.getElementById('custom-message').value = '';
      
      // إعادة تحميل الإحصائيات
      await loadInvitationStats(eventId);
    } else {
      AlSaedanUtils.showAlert('error', response.error || 'حدث خطأ في إرسال الدعوات');
    }
  } catch (error) {
    console.error('Error sending invitations:', error);
    AlSaedanUtils.showAlert('error', 'حدث خطأ في الإرسال، يرجى المحاولة لاحقاً');
  } finally {
    AlSaedanUtils.showLoading(false);
  }
}

// عرض دعوات فعالية معينة - محدّث لـ DatabaseManager
async function viewEventInvitations(eventId) {
  try {
    const invitations = await dbManager.getEventInvitations(eventId);
    displayInvitationsModal(invitations, eventId);
  } catch (error) {
    console.error('Error loading event invitations:', error);
    AlSaedanUtils.showAlert('error', 'حدث خطأ في تحميل الدعوات');
  }
}

// عرض مودال دعوات الفعالية
function displayInvitationsModal(invitations, eventId) {
  const modalHtml = `
    <div id="invitations-view-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-800">دعوات الفعالية</h3>
            <button onclick="document.getElementById('invitations-view-modal').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            ${invitations.length === 0 ? `
              <div class="text-center py-8">
                <i class="fas fa-envelope-open text-gray-400 text-4xl mb-4"></i>
                <p class="text-gray-600">لم يتم إرسال دعوات لهذه الفعالية بعد</p>
              </div>
            ` : invitations.map(invitation => `
              <div class="bg-gray-50 rounded-lg p-4 border">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-800">${invitation.full_name}</h4>
                    <div class="text-sm text-gray-600 mt-1">
                      <span class="ml-4"><i class="fas fa-phone ml-1"></i> ${invitation.phone || 'غير متوفر'}</span>
                      <span><i class="fas fa-envelope ml-1"></i> ${invitation.email || 'غير متوفر'}</span>
                    </div>
                    ${invitation.notes ? `<p class="text-sm text-gray-600 mt-2">${invitation.notes}</p>` : ''}
                  </div>
                  <div class="text-center">
                    <span class="inline-block px-3 py-1 rounded-full text-xs font-medium ${getInvitationStatusClass(invitation.invitation_status)}">
                      ${getInvitationStatusText(invitation.invitation_status)}
                    </span>
                    <div class="text-xs text-gray-500 mt-1">
                      دُعي: ${formatDate(invitation.invited_at)}
                    </div>
                    ${invitation.responded_at ? `
                      <div class="text-xs text-gray-500">
                        رد: ${formatDate(invitation.responded_at)}
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// إدارة دعوات فعالية معينة (فتح مودال الإدارة مع الفعالية محددة)
function manageEventInvitations(eventId) {
  // فتح مودال إدارة الدعوات
  const modal = document.getElementById('invitation-modal');
  modal.classList.remove('hidden');
  
  // تحديد الفعالية المحددة
  const select = document.getElementById('selected-event');
  
  // تحميل الفعاليات ثم تحديد الفعالية المطلوبة
  loadEventsForInvitation().then(() => {
    select.value = eventId;
    handleEventSelection();
  });
}

// دوال مساعدة للدعوات
function getTargetAudienceText(audience) {
  const audiences = {
    'all': 'جميع الأعضاء',
    'close_family': 'الأسرة المباشرة',
    'extended_family': 'الأقارب',
    'council_only': 'مجلس الأسرة فقط'
  };
  return audiences[audience] || audience;
}

function getInvitationStatusText(status) {
  const statuses = {
    'pending': 'في الانتظار',
    'accepted': 'مقبول',
    'declined': 'مرفوض',
    'maybe': 'ربما'
  };
  return statuses[status] || status;
}

function getInvitationStatusClass(status) {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'accepted': 'bg-green-100 text-green-800',
    'declined': 'bg-red-100 text-red-800',
    'maybe': 'bg-blue-100 text-blue-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
}

// ================= نظام إدارة أفراد العائلة =================

// إعداد نظام إدارة العائلة
function setupFamilyManagement() {
  const addMemberBtn = document.getElementById('add-member-btn');
  const toggleEditModeBtn = document.getElementById('toggle-edit-mode');
  const memberModal = document.getElementById('member-modal');
  const closeMemberModal = document.getElementById('close-member-modal');
  const memberForm = document.getElementById('member-form');
  const cancelMemberBtn = document.getElementById('cancel-member-btn');
  const confirmModal = document.getElementById('confirm-modal');
  const confirmDeleteBtn = document.getElementById('confirm-delete');
  const cancelDeleteBtn = document.getElementById('cancel-delete');
  
  // أحداث فتح وإغلاق المودال
  if (addMemberBtn) {
    addMemberBtn.addEventListener('click', () => {
      openMemberModal();
    });
  }
  
  if (toggleEditModeBtn) {
    toggleEditModeBtn.addEventListener('click', toggleEditMode);
  }
  
  if (closeMemberModal) {
    closeMemberModal.addEventListener('click', closeMemberModalHandler);
  }
  
  if (cancelMemberBtn) {
    cancelMemberBtn.addEventListener('click', closeMemberModalHandler);
  }
  
  if (memberForm) {
    memberForm.addEventListener('submit', handleMemberFormSubmit);
  }
  
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', confirmDeleteMember);
  }
  
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', () => {
      confirmModal.classList.add('hidden');
      memberToDelete = null;
    });
  }
  
  // إغلاق المودال عند النقر خارجه
  memberModal?.addEventListener('click', (e) => {
    if (e.target === memberModal) {
      closeMemberModalHandler();
    }
  });
  
  confirmModal?.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
      confirmModal.classList.add('hidden');
      memberToDelete = null;
    }
  });
  
  // تحميل قائمة الآباء في النموذج
  loadFathersForSelect();
}

// تبديل وضع التعديل
function toggleEditMode() {
  isEditMode = !isEditMode;
  const editModeText = document.getElementById('edit-mode-text');
  
  if (isEditMode) {
    editModeText.textContent = 'إنهاء التعديل';
    document.getElementById('toggle-edit-mode').classList.add('bg-yellow-500');
    document.getElementById('toggle-edit-mode').classList.remove('bg-white');
  } else {
    editModeText.textContent = 'وضع التعديل';
    document.getElementById('toggle-edit-mode').classList.remove('bg-yellow-500');
    document.getElementById('toggle-edit-mode').classList.add('bg-white');
  }
  
  // إعادة عرض شجرة العائلة
  displayFamilyTree(familyMembers);
}

// فتح مودال إضافة/تعديل عضو
function openMemberModal(member = null) {
  const modal = document.getElementById('member-modal');
  const modalTitle = document.getElementById('modal-title');
  const memberForm = document.getElementById('member-form');
  
  if (member) {
    modalTitle.textContent = 'تعديل بيانات العضو';
    populateFormWithMember(member);
  } else {
    modalTitle.textContent = 'إضافة عضو جديد';
    memberForm.reset();
    document.getElementById('member-id').value = '';
  }
  
  modal.classList.remove('hidden');
}

// إغلاق مودال العضو
function closeMemberModalHandler() {
  const modal = document.getElementById('member-modal');
  modal.classList.add('hidden');
}

// تحميل قائمة الآباء في النموذج
function loadFathersForSelect() {
  const fatherSelect = document.querySelector('select[name="father_id"]');
  if (!fatherSelect) return;
  
  // تنظيف وإعادة إضافة الخيار الافتراضي
  fatherSelect.innerHTML = '<option value="">بدون والد (للمؤسس)</option>';
  
  // إضافة جميع الأعضاء كخيارات للوالد
  familyMembers.forEach(member => {
    fatherSelect.innerHTML += `
      <option value="${member.id}">${member.full_name} (الجيل ${member.generation})</option>
    `;
  });
}

// ملء النموذج ببيانات العضو للتعديل
function populateFormWithMember(member) {
  document.getElementById('member-id').value = member.id;
  document.querySelector('input[name="full_name"]').value = member.full_name || '';
  document.querySelector('select[name="father_id"]').value = member.father_id || '';
  document.querySelector('select[name="generation"]').value = member.generation || 3;
  document.querySelector('select[name="relationship_level"]').value = member.relationship_level || 'family';
  document.querySelector('input[name="birth_date"]').value = member.birth_date || '';
  document.querySelector('input[name="national_id"]').value = member.national_id || '';
  document.querySelector('input[name="phone"]').value = member.phone || '';
  document.querySelector('input[name="email"]').value = member.email || '';
  document.querySelector('input[name="field_of_excellence"]').value = member.field_of_excellence || '';
  document.querySelector('textarea[name="achievements"]').value = member.achievements || '';
}

// معالجة إرسال نموذج العضو
async function handleMemberFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const memberId = formData.get('member_id');
  const isEditing = memberId && memberId !== '';
  
  const memberData = {
    full_name: formData.get('full_name'),
    father_id: formData.get('father_id') || null,
    generation: parseInt(formData.get('generation')),
    relationship_level: formData.get('relationship_level'),
    birth_date: formData.get('birth_date') || null,
    national_id: formData.get('national_id') || null,
    phone: formData.get('phone') || null,
    email: formData.get('email') || null,
    field_of_excellence: formData.get('field_of_excellence') || null,
    achievements: formData.get('achievements') || null
  };
  
  try {
    AlSaedanUtils.showLoading(true);
    
    let response;
    if (isEditing) {
      response = await dbManager.updateFamilyMember(memberId, memberData);
    } else {
      response = await dbManager.createFamilyMember(memberData);
    }
    
    if (response.success) {
      AlSaedanUtils.showAlert('success', response.message || 'تم حفظ بيانات العضو بنجاح');
      closeMemberModalHandler();
      
      // المزامنة التلقائية عبر مستمع الأحداث - لا حاجة لإعادة التحميل يدوياً
    } else {
      AlSaedanUtils.showAlert('error', response.error || 'حدث خطأ في الحفظ');
    }
  } catch (error) {
    console.error('Error saving member:', error);
    AlSaedanUtils.showAlert('error', 'حدث خطأ في الحفظ، يرجى المحاولة لاحقاً');
  } finally {
    AlSaedanUtils.showLoading(false);
  }
}

// تعديل عضو - محدّث لـ DatabaseManager
async function editMember(memberId) {
  try {
    const member = await dbManager.getFamilyMember(memberId);
    openMemberModal(member);
  } catch (error) {
    console.error('Error loading member for editing:', error);
    AlSaedanUtils.showAlert('error', 'حدث خطأ في تحميل بيانات العضو');
  }
}

// حذف عضو
function deleteMember(memberId) {
  memberToDelete = memberId;
  const confirmModal = document.getElementById('confirm-modal');
  confirmModal.classList.remove('hidden');
}

// تأكيد حذف العضو
async function confirmDeleteMember() {
  if (!memberToDelete) return;
  
  try {
    AlSaedanUtils.showLoading(true);
    
    const response = await dbManager.deleteFamilyMember(memberToDelete);
    
    if (response.success) {
      AlSaedanUtils.showAlert('success', response.message || 'تم حذف العضو بنجاح');
      
      // المزامنة التلقائية عبر مستمع الأحداث - لا حاجة لإعادة التحميل يدوياً
    } else {
      AlSaedanUtils.showAlert('error', response.error || 'حدث خطأ في الحذف');
    }
  } catch (error) {
    console.error('Error deleting member:', error);
    AlSaedanUtils.showAlert('error', 'حدث خطأ في حذف العضو، يرجى المحاولة لاحقاً');
  } finally {
    AlSaedanUtils.showLoading(false);
    document.getElementById('confirm-modal').classList.add('hidden');
    memberToDelete = null;
  }
}

// دوال مساعدة لإدارة العائلة
function getRelationshipLevelText(level) {
  const levels = {
    'family': 'عائلة مباشرة',
    'close': 'قرابة قريبة',
    'extended': 'قرابة بعيدة'
  };
  return levels[level] || level;
}

// تحديث الوقت كل دقيقة
setInterval(updateDateTime, 60000);
updateDateTime(); // تحديث فوري