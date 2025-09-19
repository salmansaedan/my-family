// تطبيق آل سعيدان - JavaScript الرئيسي

// إعداد العامة
const API_BASE_URL = '/api';

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

  // API وظائف
  async fetchFamilyMembers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/family-members`);
      return response.data;
    } catch (error) {
      console.error('Error fetching family members:', error);
      throw error;
    }
  }

  async fetchEvents() {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  async fetchSuggestions() {
    try {
      const response = await axios.get(`${API_BASE_URL}/suggestions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      throw error;
    }
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

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  const app = new AlSaedanApp();
  app.exportUtils();
  
  // تحديد نوع الصفحة وتحميل البيانات المناسبة
  const currentPath = window.location.pathname;
  
  if (currentPath === '/family') {
    loadFamilyTree();
  } else if (currentPath === '/events') {
    loadEvents();
  } else if (currentPath === '/suggestions') {
    loadSuggestions();
    setupSuggestionForm();
  }
});

// تحميل شجرة العائلة
async function loadFamilyTree() {
  try {
    const response = await axios.get('/api/family-members');
    const members = response.data.data;
    
    displayFamilyTree(members);
    document.getElementById('family-loading').classList.add('hidden');
    document.getElementById('family-tree').classList.remove('hidden');
  } catch (error) {
    console.error('Error loading family tree:', error);
    document.getElementById('family-loading').innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <p class="text-red-600">حدث خطأ في تحميل شجرة العائلة</p>
      </div>
    `;
  }
}

// عرض شجرة العائلة
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
        <h3 class="text-xl font-bold text-gray-800 mb-4 text-center">
          ${generation == 1 ? 'الجيل الأول - المؤسس' : `الجيل ${generation}`}
        </h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    `;
    
    membersByGeneration[generation].forEach(member => {
      html += `
        <div class="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div class="flex items-start space-x-4 space-x-reverse">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-white"></i>
              </div>
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-gray-800 mb-1">${member.full_name}</h4>
              ${member.field_of_excellence ? `<p class="text-sm text-blue-600 mb-1">${member.field_of_excellence}</p>` : ''}
              ${member.phone ? `<p class="text-sm text-gray-600"><i class="fas fa-phone ml-1"></i> ${member.phone}</p>` : ''}
              ${member.email ? `<p class="text-sm text-gray-600"><i class="fas fa-envelope ml-1"></i> ${member.email}</p>` : ''}
              ${member.achievements ? `<p class="text-xs text-gray-500 mt-2">${member.achievements}</p>` : ''}
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

// تحميل الفعاليات
async function loadEvents() {
  try {
    const response = await axios.get('/api/events');
    const events = response.data.data;
    
    displayEvents(events);
    document.getElementById('events-loading').classList.add('hidden');
    document.getElementById('events-list').classList.remove('hidden');
  } catch (error) {
    console.error('Error loading events:', error);
    document.getElementById('events-loading').innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <p class="text-red-600">حدث خطأ في تحميل الفعاليات</p>
      </div>
    `;
  }
}

// عرض الفعاليات
function displayEvents(events) {
  const container = document.getElementById('events-list');
  
  if (events.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-calendar-times text-gray-400 text-4xl mb-4"></i>
        <p class="text-gray-600">لا توجد فعاليات محددة حالياً</p>
        <p class="text-sm text-gray-500">تابعونا لمعرفة الفعاليات القادمة</p>
      </div>
    `;
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
      <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-gray-200">
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
        
        <div class="grid md:grid-cols-3 gap-4 text-sm">
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
        
        <div class="mt-4 pt-4 border-t border-gray-200">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(event.status)}">
            ${getStatusText(event.status)}
          </span>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

// تحميل المقترحات
async function loadSuggestions() {
  try {
    const response = await axios.get('/api/suggestions');
    const suggestions = response.data.data;
    
    displaySuggestions(suggestions);
    document.getElementById('suggestions-loading').classList.add('hidden');
    document.getElementById('suggestions-list').classList.remove('hidden');
  } catch (error) {
    console.error('Error loading suggestions:', error);
    document.getElementById('suggestions-loading').innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <p class="text-red-600">حدث خطأ في تحميل المقترحات</p>
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
      
      const response = await axios.post('/api/suggestions', data);
      
      if (response.data.success) {
        AlSaedanUtils.showAlert('success', 'تم إرسال مقترحك بنجاح! شكراً لمساهمتك');
        form.reset();
        // إعادة تحميل المقترحات
        setTimeout(() => {
          loadSuggestions();
        }, 1000);
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

// تحديث الوقت كل دقيقة
setInterval(updateDateTime, 60000);
updateDateTime(); // تحديث فوري