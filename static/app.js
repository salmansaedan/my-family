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
  } else if (currentPath === '/library') {
    loadLibraryContent();
    setupLibraryFilters();
  }
});

// متغيرات عامة لإدارة العائلة
let isEditMode = false;
let familyMembers = [];
let memberToDelete = null;

// تحميل شجرة العائلة مع إدارة الأعضاء
async function loadFamilyTree() {
  try {
    const response = await axios.get('/api/family-members');
    familyMembers = response.data.data;
    
    displayFamilyTree(familyMembers);
    setupFamilyManagement();
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

// تحميل الفعاليات
async function loadEvents() {
  try {
    const response = await axios.get('/api/events');
    const events = response.data.data;
    
    displayEvents(events);
    setupEventManagement();
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

// =================== مكتبة التجارب والخبرات ===================

// تحميل محتوى المكتبة
async function loadLibraryContent() {
  try {
    // تحميل المحتوى المميز
    const featuredResponse = await axios.get('/api/library/featured');
    if (featuredResponse.data.success) {
      displayFeaturedContent(featuredResponse.data.data);
      document.getElementById('featured-loading').classList.add('hidden');
      document.getElementById('featured-content').classList.remove('hidden');
    }

    // تحميل جميع المحتوى
    const allResponse = await axios.get('/api/library');
    if (allResponse.data.success) {
      displayLibraryContent(allResponse.data.data);
      document.getElementById('content-loading').classList.add('hidden');
      document.getElementById('content-list').classList.remove('hidden');
    }

    // تحميل إحصائيات الفئات
    const categoriesResponse = await axios.get('/api/library/categories');
    if (categoriesResponse.data.success) {
      displayCategoryStats(categoriesResponse.data.data);
    }

  } catch (error) {
    console.error('Error loading library content:', error);
    document.getElementById('featured-loading').innerHTML = `
      <div class="text-center py-8">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <p class="text-red-600">حدث خطأ في تحميل محتوى المكتبة</p>
      </div>
    `;
    document.getElementById('content-loading').innerHTML = `
      <div class="text-center py-8">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <p class="text-red-600">حدث خطأ في تحميل المحتوى</p>
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
    
    const response = await axios.get(url);
    
    if (response.data.success) {
      displayLibraryContent(response.data.data);
    }
    
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
    // تحديث عدد المشاهدات
    await axios.post(`/api/library/view/${contentId}`);
    
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
    
    const response = await axios.post('/api/events', eventData);
    
    if (response.data.success) {
      AlSaedanUtils.showAlert('success', 'تم إنشاء الفعالية بنجاح!');
      document.getElementById('event-modal').classList.add('hidden');
      e.target.reset();
      
      // إعادة تحميل الفعاليات
      setTimeout(() => {
        loadEvents();
      }, 1000);
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

// تحميل الفعاليات لقائمة الدعوات
async function loadEventsForInvitation() {
  try {
    const response = await axios.get('/api/events');
    const events = response.data.data;
    
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

// تحميل الأعضاء للاختيار الفردي
async function loadMembersForSelection() {
  try {
    const response = await axios.get('/api/family-members');
    const members = response.data.data;
    
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

// تحميل إحصائيات الدعوات
async function loadInvitationStats(eventId) {
  try {
    const response = await axios.get(`/api/events/${eventId}/invitation-stats`);
    
    if (response.data.success) {
      const stats = response.data.data;
      displayInvitationStats(stats);
      document.getElementById('invitation-stats').classList.remove('hidden');
    }
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
    
    const response = await axios.post(`/api/events/${eventId}/send-invitations`, invitationData);
    
    if (response.data.success) {
      AlSaedanUtils.showAlert('success', response.data.message);
      
      // تنظيف النموذج
      document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
      document.getElementById('custom-message').value = '';
      
      // إعادة تحميل الإحصائيات
      await loadInvitationStats(eventId);
    } else {
      AlSaedanUtils.showAlert('error', response.data.error || 'حدث خطأ في إرسال الدعوات');
    }
  } catch (error) {
    console.error('Error sending invitations:', error);
    AlSaedanUtils.showAlert('error', 'حدث خطأ في الإرسال، يرجى المحاولة لاحقاً');
  } finally {
    AlSaedanUtils.showLoading(false);
  }
}

// عرض دعوات فعالية معينة
async function viewEventInvitations(eventId) {
  try {
    const response = await axios.get(`/api/events/${eventId}/invitations`);
    
    if (response.data.success) {
      const invitations = response.data.data;
      displayInvitationsModal(invitations, eventId);
    }
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
      response = await axios.put(`/api/family-members/${memberId}`, memberData);
    } else {
      response = await axios.post('/api/family-members', memberData);
    }
    
    if (response.data.success) {
      AlSaedanUtils.showAlert('success', response.data.message);
      closeMemberModalHandler();
      
      // إعادة تحميل شجرة العائلة
      setTimeout(() => {
        loadFamilyTree();
      }, 1000);
    } else {
      AlSaedanUtils.showAlert('error', response.data.error);
    }
  } catch (error) {
    console.error('Error saving member:', error);
    AlSaedanUtils.showAlert('error', 'حدث خطأ في الحفظ، يرجى المحاولة لاحقاً');
  } finally {
    AlSaedanUtils.showLoading(false);
  }
}

// تعديل عضو
async function editMember(memberId) {
  try {
    const response = await axios.get(`/api/family-members/${memberId}`);
    
    if (response.data.success) {
      openMemberModal(response.data.data);
    } else {
      AlSaedanUtils.showAlert('error', 'لم يتم العثور على بيانات العضو');
    }
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
    
    const response = await axios.delete(`/api/family-members/${memberToDelete}`);
    
    if (response.data.success) {
      AlSaedanUtils.showAlert('success', response.data.message);
      
      // إعادة تحميل شجرة العائلة
      setTimeout(() => {
        loadFamilyTree();
      }, 1000);
    } else {
      AlSaedanUtils.showAlert('error', response.data.error);
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