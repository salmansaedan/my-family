// تطبيق آل سعيدان - نسخة Netlify مع بيانات محاكاة وحفظ محلي



// البيانات الأصلية للعائلة (للاستخدام عند الإعادة التعيين)
const mockFamilyDataOriginal = [
  {
    id: 1,
    full_name: "الشيخ محمد بن عبدالله بن سعيدان",
    father_id: null,
    generation: 1,
    phone: null,
    email: null,
    field_of_excellence: "قيادي ومؤسس",
    achievements: "مؤسس العائلة وراعي التقاليد العائلية الأصيلة",
    relationship_level: "family",
    membership_type: "founder", // مؤسس
    membership_status: "active",
    created_at: "2024-01-01"
  },
  {
    id: 2,
    full_name: "عبدالله محمد آل سعيدان",
    father_id: 1,
    generation: 2,
    phone: null,
    email: null,
    field_of_excellence: "أعمال",
    achievements: "رجل أعمال وأحد أبناء المؤسس",
    relationship_level: "family",
    membership_type: "board_member", // عضو مجلس إدارة
    membership_status: "active",
    created_at: "2024-01-01"
  },
  {
    id: 3,
    full_name: "فهد محمد آل سعيدان",
    father_id: 1,
    generation: 2,
    phone: null,
    email: null,
    field_of_excellence: "تجاري",
    achievements: "تاجر متميز وأحد أبناء المؤسس",
    relationship_level: "family",
    membership_type: "general_assembly", // عضو جمعية عمومية
    membership_status: "active",
    created_at: "2024-01-01"
  },
  {
    id: 4,
    full_name: "حمد محمد آل سعيدان",
    father_id: 1,
    generation: 2,
    phone: null,
    email: null,
    field_of_excellence: "إداري",
    achievements: "إداري قيادي وأحد أبناء المؤسس",
    relationship_level: "family",
    membership_type: "board_member", // عضو مجلس إدارة
    membership_status: "active",
    created_at: "2024-01-01"
  },
  {
    id: 5,
    full_name: "إبراهيم محمد آل سعيدان",
    father_id: 1,
    generation: 2,
    phone: null,
    email: null,
    field_of_excellence: "مهني",
    achievements: "مهني متخصص وأحد أبناء المؤسس",
    relationship_level: "family",
    membership_type: "general_assembly", // عضو جمعية عمومية
    membership_status: "active",
    created_at: "2024-01-01"
  },
  {
    id: 6,
    full_name: "سلمان عبدالله آل سعيدان",
    father_id: 2,
    generation: 3,
    phone: "0533361154",
    email: "info@salmansaedan.com",
    field_of_excellence: "تطوير عقاري",
    achievements: "مطور عقاري متميز ورائد أعمال - رئيس مجلس الأسرة الحالي",
    relationship_level: "family",
    membership_type: "chairman", // رئيس مجلس الإدارة
    membership_status: "active",
    created_at: "2024-01-01"
  },
  {
    id: 7,
    full_name: "خالد فهد آل سعيدان",
    father_id: 3,
    generation: 3,
    phone: null,
    email: null,
    field_of_excellence: "أعمال",
    achievements: "رجل أعمال وعضو مجلس الأسرة الحالي",
    relationship_level: "family",
    membership_type: "board_member", // عضو مجلس إدارة
    membership_status: "active",
    created_at: "2024-01-01"
  },
  {
    id: 8,
    full_name: "هشام حمد آل سعيدان",
    father_id: 4,
    generation: 3,
    phone: null,
    email: null,
    field_of_excellence: "إداري",
    achievements: "إداري متميز وعضو مجلس الأسرة الحالي",
    relationship_level: "family",
    membership_type: "board_member", // عضو مجلس إدارة
    membership_status: "active",
    created_at: "2024-01-01"
  },
  {
    id: 9,
    full_name: "بدر إبراهيم آل سعيدان",
    father_id: 5,
    generation: 3,
    phone: null,
    email: null,
    field_of_excellence: "قيادي",
    achievements: "قيادي عائلي وعضو مجلس الأسرة الحالي",
    relationship_level: "family",
    membership_type: "board_member", // عضو مجلس إدارة
    membership_status: "active",
    created_at: "2024-01-01"
  }
];

// البيانات الأصلية للفعاليات
const mockEventsDataOriginal = [
  {
    id: 1,
    title: "اجتماع مجلس الأسرة الشهري",
    description: "الاجتماع الشهري لأعضاء مجلس أسرة آل سعيدان لمناقشة الخطط والمشاريع العائلية",
    event_date: "2024-10-15T19:00:00",
    location: "مجلس العائلة",
    event_type: "meeting",
    target_audience: "council_only",
    status: "planned",
    organizer_name: "سلمان عبدالله آل سعيدان"
  },
  {
    id: 2,
    title: "لقاء العائلة السنوي",
    description: "اللقاء السنوي الكبير لجميع أفراد عائلة آل سعيدان من مختلف الأجيال",
    event_date: "2024-12-20T16:00:00",
    location: "قاعة الاحتفالات الكبرى",
    event_type: "celebration",
    target_audience: "all",
    status: "planned",
    organizer_name: "بدر إبراهيم آل سعيدان"
  }
];

// البيانات الأصلية للاقتراحات
const mockSuggestionsDataOriginal = [
  {
    id: 1,
    title: "إنشاء صندوق استثماري عائلي",
    description: "اقتراح لإنشاء صندوق استثماري يساهم فيه أفراد العائلة لتحقيق عوائد جماعية وتوسيع الأعمال العائلية",
    content: "اقتراح لإنشاء صندوق استثماري يساهم فيه أفراد العائلة لتحقيق عوائد جماعية وتوسيع الأعمال العائلية",
    category: "الاستثمار",
    priority: "عالية",
    status: "قيد المراجعة",
    member_name: "خالد فهد آل سعيدان",
    author_name: "خالد فهد آل سعيدان",
    rating: 4,
    created_at: "2024-09-01"
  },
  {
    id: 2,
    title: "برنامج منح دراسية للجيل القادم",
    description: "إنشاء برنامج منح دراسية لدعم تعليم الأجيال الجديدة في الجامعات المتميزة داخلياً وخارجياً",
    content: "إنشاء برنامج منح دراسية لدعم تعليم الأجيال الجديدة في الجامعات المتميزة داخلياً وخارجياً",
    category: "التعليم",
    priority: "عالية",
    status: "تم التنفيذ",
    member_name: "هشام حمد آل سعيدان", 
    author_name: "هشام حمد آل سعيدان",
    rating: 5,
    created_at: "2024-08-15"
  },
  {
    id: 3,
    title: "تطوير موقع العائلة الإلكتروني",
    description: "تطوير موقع إلكتروني متقدم للعائلة مع قاعدة بيانات شاملة وتطبيق جوال",
    content: "تطوير موقع إلكتروني متقدم للعائلة مع قاعدة بيانات شاملة وتطبيق جوال مصاحب لتحسين التواصل",
    category: "تطوير التطبيق",
    priority: "متوسطة",
    status: "جديد",
    member_name: "سلمان عبدالله آل سعيدان",
    author_name: "سلمان عبدالله آل سعيدان",
    rating: null,
    created_at: "2024-09-20"
  },
  {
    id: 4,
    title: "مشروع توثيق تاريخ العائلة",
    description: "مشروع شامل لتوثيق تاريخ العائلة وإنجازاتها عبر الأجيال بوسائل متعددة",
    content: "مشروع شامل لتوثيق تاريخ العائلة وإنجازاتها عبر الأجيال باستخدام المقابلات والصور والوثائق التاريخية",
    category: "التوثيق",
    priority: "متوسطة",
    status: "قيد المراجعة",
    member_name: "بدر إبراهيم آل سعيدان",
    author_name: "بدر إبراهيم آل سعيدان",
    rating: 3,
    created_at: "2024-08-30"
  }
];

// البيانات الأصلية لمكتبة التجارب
const mockLibraryDataOriginal = [
  {
    id: 1,
    title: "تجربتي في التطوير العقاري",
    description: "نصائح وخبرات عملية في مجال التطوير العقاري والاستثمار",
    content_type: "article",
    category: "business",
    views: 150,
    is_featured: true,
    author_name: "سلمان عبدالله آل سعيدان",
    published_at: "2024-08-01"
  },
  {
    id: 2,
    title: "القيادة والإدارة في الأعمال العائلية",
    description: "كيفية إدارة الأعمال العائلية والتوفيق بين المصالح الشخصية والعامة",
    content_type: "video",
    category: "leadership",
    views: 89,
    is_featured: false,
    author_name: "خالد فهد آل سعيدان",
    published_at: "2024-07-20"
  }
];

// نظام إدارة البيانات المحلية
class DataManager {
  constructor() {
    this.storageKey = 'alsaedan-app-data';
    this.initializeData();
  }

  initializeData() {
    const savedData = localStorage.getItem(this.storageKey);
    if (!savedData) {
      // حفظ البيانات الأولية إذا لم تكن موجودة
      this.saveInitialData();
    }
  }

  saveInitialData() {
    const initialData = {
      familyMembers: [...mockFamilyDataOriginal],
      events: [...mockEventsDataOriginal], 
      suggestions: [...mockSuggestionsDataOriginal],
      library: [...mockLibraryDataOriginal],
      lastUpdate: new Date().toISOString()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(initialData));
  }

  getData(type) {
    const savedData = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    return savedData[type] || [];
  }

  saveData(type, data) {
    const savedData = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    savedData[type] = data;
    savedData.lastUpdate = new Date().toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(savedData));
  }

  addItem(type, item) {
    const currentData = this.getData(type);
    const newId = Math.max(...currentData.map(item => item.id), 0) + 1;
    item.id = newId;
    item.created_at = new Date().toISOString();
    currentData.push(item);
    this.saveData(type, currentData);
    return item;
  }

  updateItem(type, id, updatedItem) {
    const currentData = this.getData(type);
    const index = currentData.findIndex(item => item.id === id);
    if (index !== -1) {
      currentData[index] = { ...currentData[index], ...updatedItem };
      this.saveData(type, currentData);
      return currentData[index];
    }
    return null;
  }

  deleteItem(type, id) {
    const currentData = this.getData(type);
    const filteredData = currentData.filter(item => item.id !== id);
    this.saveData(type, filteredData);
    return true;
  }

  resetData() {
    localStorage.removeItem(this.storageKey);
    this.saveInitialData();
  }
}

// إنشاء مدير البيانات
const dataManager = new DataManager();

// متغيرات عامة
let isEditMode = false;
let familyMembers = [...mockFamilyDataOriginal];

// فئة التطبيق الرئيسية
class AlSaedanNetlifyApp {
  constructor() {
    // ربط مع مدير البيانات
    this.dataManager = dataManager;
    this.init();
  }

  // خصائص البيانات التي تستخدم مدير البيانات
  get mockFamilyData() {
    return this.dataManager.getData('familyMembers');
  }

  get mockEventsData() {
    return this.dataManager.getData('events');
  }

  get mockSuggestionsData() {
    return this.dataManager.getData('suggestions');
  }

  get mockLibraryData() {
    return this.dataManager.getData('library');
  }

  init() {
    console.log('تطبيق آل سعيدان Netlify - تم التحميل بنجاح');
    this.setupEventListeners();
    this.loadPageContent();
  }

  setupEventListeners() {
    // تحسين التنقل للهواتف المحمولة
    this.setupMobileNavigation();
    
    // تحديد نوع الصفحة وتحميل المحتوى المناسب
    this.loadPageContent();
  }

  setupMobileNavigation() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }

  loadPageContent() {
    const currentPage = this.getCurrentPage();
    
    switch(currentPage) {
      case 'family':
        this.loadFamilyPage();
        break;
      case 'events':
        this.loadEventsPage();
        break;
      case 'suggestions':
        this.loadSuggestionsPage();
        break;
      case 'library':
        this.loadLibraryPage();
        break;
      default:
        // الصفحة الرئيسية
        break;
    }
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('family')) return 'family';
    if (path.includes('events')) return 'events';
    if (path.includes('suggestions')) return 'suggestions';
    if (path.includes('library')) return 'library';
    return 'home';
  }

  loadFamilyPage() {
    if (document.getElementById('family-tree')) {
      this.displayFamilyTree(familyMembers);
      document.getElementById('family-loading')?.classList.add('hidden');
      document.getElementById('family-tree')?.classList.remove('hidden');
    }
  }

  loadEventsPage() {
    if (document.getElementById('events-list')) {
      this.displayEvents(mockEventsData);
      document.getElementById('events-loading')?.classList.add('hidden');
      document.getElementById('events-list')?.classList.remove('hidden');
    }
  }

  loadSuggestionsPage() {
    if (document.getElementById('suggestions-list')) {
      this.displaySuggestions(mockSuggestionsData);
      document.getElementById('suggestions-loading')?.classList.add('hidden');
      document.getElementById('suggestions-list')?.classList.remove('hidden');
    }
  }

  loadLibraryPage() {
    if (document.getElementById('content-list')) {
      this.displayLibraryContent(mockLibraryData);
      document.getElementById('content-loading')?.classList.add('hidden');
      document.getElementById('content-list')?.classList.remove('hidden');
    }
  }

  displayFamilyTree(members) {
    const container = document.getElementById('family-tree');
    if (!container) return;
    
    // استخدام البيانات من مدير البيانات إذا لم يتم تمرير members
    const familyData = members || this.mockFamilyData;
    
    // تجميع الأعضاء حسب الجيل
    const membersByGeneration = {};
    familyData.forEach(member => {
      if (!membersByGeneration[member.generation]) {
        membersByGeneration[member.generation] = [];
      }
      membersByGeneration[member.generation].push(member);
    });
    
    // تحديد وضع التحرير (من متغير عام إذا كان متاحاً)
    const editMode = (typeof isEditMode !== 'undefined') ? isEditMode : false;
    
    let html = '';
    
    // إضافة CSS للتحكم بوضع التحرير
    if (editMode) {
      html += '<div class="edit-mode">';
    }
    
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
        html += `
          <div class="member-card bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow relative">
            ${editMode ? `
            <div class="member-actions">
              <button onclick="showEditMemberForm(${member.id})" class="edit-btn" title="تحرير">
                <i class="fas fa-edit"></i>
              </button>
              <button onclick="showDeleteMemberModal(${member.id})" class="delete-btn" title="حذف">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            ` : ''}
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
                
                <div class="flex items-center flex-wrap gap-2 mt-3">
                  <span class="inline-flex items-center px-2 py-1 ${this.getMembershipTypeBadgeClass(member.membership_type)} text-xs rounded-full font-medium">
                    <i class="fas fa-user-tie ml-1"></i>
                    ${this.getMembershipTypeText(member.membership_type)}
                  </span>
                  <span class="inline-flex items-center px-2 py-1 ${this.getMembershipStatusBadgeClass(member.membership_status)} text-xs rounded-full">
                    <i class="fas fa-circle ml-1 text-xs"></i>
                    ${this.getMembershipStatusText(member.membership_status)}
                  </span>
                  <span class="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    <i class="fas fa-layer-group ml-1"></i>
                    ${this.getRelationshipLevelText(member.relationship_level)}
                  </span>
                </div>
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
    
    if (editMode) {
      html += '</div>';
    }
    
    container.innerHTML = html;
  }

  displayEvents(events) {
    const container = document.getElementById('events-list');
    if (!container) return;
    
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
              <span>${this.getEventTypeText(event.event_type)}</span>
            </div>
          </div>
          
          <div class="flex justify-between items-center pt-4 border-t border-gray-200">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${this.getStatusBadgeClass(event.status)}">
              ${this.getStatusText(event.status)}
            </span>
            
            <div class="text-sm text-gray-500">
              <i class="fas fa-users ml-1"></i>
              ${this.getTargetAudienceText(event.target_audience)}
            </div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    container.innerHTML = html;
  }

  displaySuggestions(suggestions) {
    const container = document.getElementById('suggestions-list');
    if (!container) return;
    
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
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${this.getPriorityBadgeClass(suggestion.priority)}">
                ${this.getPriorityText(suggestion.priority)}
              </span>
            </div>
          </div>
          
          <div class="flex justify-between items-center text-sm text-gray-600">
            <div class="flex items-center space-x-4 space-x-reverse">
              <span><i class="fas fa-user ml-1"></i> ${suggestion.member_name || 'غير محدد'}</span>
              <span><i class="fas fa-calendar ml-1"></i> ${formattedDate}</span>
            </div>
            <div class="flex items-center">
              <span class="inline-flex items-center px-2 py-1 rounded text-xs ${this.getStatusBadgeClass(suggestion.status)}">
                ${this.getStatusText(suggestion.status)}
              </span>
            </div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    container.innerHTML = html;
  }

  displayLibraryContent(content) {
    const container = document.getElementById('content-list');
    if (!container) return;
    
    if (content.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-book-open text-gray-400 text-4xl mb-4"></i>
          <p class="text-gray-600">لا يوجد محتوى متاح حالياً</p>
          <p class="text-sm text-gray-500">تابعونا لإضافة المزيد من التجارب والخبرات</p>
        </div>
      `;
      return;
    }

    let html = '';
    
    content.forEach(item => {
      html += `
        <div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div class="flex items-start space-x-4 space-x-reverse">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <i class="fas ${this.getContentIcon(item.content_type)} text-white text-xl"></i>
              </div>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2 space-x-reverse">
                  <span class="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    ${this.getCategoryText(item.category)}
                  </span>
                  <span class="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    ${this.getContentTypeText(item.content_type)}
                  </span>
                  ${item.is_featured ? '<span class="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"><i class="fas fa-star mr-1"></i>مميز</span>' : ''}
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <i class="fas fa-eye ml-1"></i>
                  <span>${item.views || 0}</span>
                </div>
              </div>
              
              <h3 class="text-xl font-semibold text-gray-800 mb-2">${item.title}</h3>
              <p class="text-gray-600 mb-4">${item.description}</p>
              
              <div class="flex items-center justify-between text-sm text-gray-500">
                <div class="flex items-center space-x-4 space-x-reverse">
                  <div class="flex items-center">
                    <i class="fas fa-user ml-1"></i>
                    <span>${item.author_name || 'مجهول'}</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-calendar ml-1"></i>
                    <span>${this.formatDate(item.published_at)}</span>
                  </div>
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

  // دوال مساعدة
  getRelationshipLevelText(level) {
    const levels = {
      'family': 'عائلة مباشرة',
      'close': 'قرابة قريبة',
      'extended': 'قرابة بعيدة'
    };
    return levels[level] || level;
  }

  getEventTypeText(type) {
    const types = {
      'general': 'عام',
      'meeting': 'اجتماع',
      'celebration': 'احتفال',
      'educational': 'تعليمي'
    };
    return types[type] || type;
  }

  getStatusText(status) {
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

  getPriorityText(priority) {
    const priorities = {
      'low': 'منخفضة',
      'medium': 'متوسطة',
      'high': 'عالية'
    };
    return priorities[priority] || priority;
  }

  getStatusBadgeClass(status) {
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

  getPriorityBadgeClass(priority) {
    const classes = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return classes[priority] || 'bg-gray-100 text-gray-800';
  }

  getTargetAudienceText(audience) {
    const audiences = {
      'all': 'جميع الأعضاء',
      'close_family': 'الأسرة المباشرة',
      'extended_family': 'الأقارب',
      'council_only': 'مجلس الأسرة فقط'
    };
    return audiences[audience] || audience;
  }

  getContentIcon(contentType) {
    const icons = {
      'article': 'fa-file-alt',
      'video': 'fa-play-circle',
      'audio': 'fa-headphones',
      'document': 'fa-file-pdf'
    };
    return icons[contentType] || 'fa-file';
  }

  getCategoryText(category) {
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

  getContentTypeText(contentType) {
    const types = {
      'article': 'مقال',
      'video': 'فيديو',
      'audio': 'صوتي',
      'document': 'وثيقة'
    };
    return types[contentType] || contentType;
  }

  formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return date.toLocaleDateString('ar-SA', options);
  }

  // دوال مساعدة لأنواع العضوية
  getMembershipTypeText(membershipType) {
    const types = {
      'founder': 'مؤسس العائلة',
      'chairman': 'رئيس مجلس الإدارة',
      'board_member': 'عضو مجلس إدارة',
      'general_assembly': 'عضو جمعية عمومية',
      'family_member': 'عضو العائلة',
      'honorary': 'عضو شرف'
    };
    return types[membershipType] || 'عضو العائلة';
  }

  getMembershipTypeBadgeClass(membershipType) {
    const classes = {
      'founder': 'bg-purple-100 text-purple-800 border border-purple-200',
      'chairman': 'bg-red-100 text-red-800 border border-red-200',
      'board_member': 'bg-blue-100 text-blue-800 border border-blue-200',
      'general_assembly': 'bg-green-100 text-green-800 border border-green-200',
      'family_member': 'bg-gray-100 text-gray-800 border border-gray-200',
      'honorary': 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    };
    return classes[membershipType] || 'bg-gray-100 text-gray-800 border border-gray-200';
  }

  getMembershipStatusText(membershipStatus) {
    const statuses = {
      'active': 'نشط',
      'inactive': 'غير نشط',
      'pending': 'قيد المراجعة',
      'suspended': 'موقوف'
    };
    return statuses[membershipStatus] || 'نشط';
  }

  getMembershipStatusBadgeClass(membershipStatus) {
    const classes = {
      'active': 'bg-green-100 text-green-700',
      'inactive': 'bg-gray-100 text-gray-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'suspended': 'bg-red-100 text-red-700'
    };
    return classes[membershipStatus] || 'bg-green-100 text-green-700';
  }

  // الحصول على إحصائيات أنواع العضوية
  getMembershipStatistics() {
    const familyData = this.mockFamilyData;
    const stats = {
      total: familyData.length,
      founder: 0,
      chairman: 0,
      board_members: 0,
      general_assembly: 0,
      family_members: 0,
      honorary: 0,
      active: 0,
      inactive: 0
    };

    familyData.forEach(member => {
      // إحصائيات أنواع العضوية
      switch(member.membership_type) {
        case 'founder': stats.founder++; break;
        case 'chairman': stats.chairman++; break;
        case 'board_member': stats.board_members++; break;
        case 'general_assembly': stats.general_assembly++; break;
        case 'honorary': stats.honorary++; break;
        default: stats.family_members++; break;
      }

      // إحصائيات حالة العضوية
      if (member.membership_status === 'active') {
        stats.active++;
      } else {
        stats.inactive++;
      }
    });

    return stats;
  }

  // دوال إضافة البيانات الجديدة
  addFamilyMember(memberData) {
    const newMember = this.dataManager.addItem('familyMembers', memberData);
    this.displayFamilyTree(); // إعادة عرض الشجرة
    return newMember;
  }

  updateFamilyMember(id, memberData) {
    const updatedMember = this.dataManager.updateItem('familyMembers', id, memberData);
    this.displayFamilyTree(); // إعادة عرض الشجرة
    return updatedMember;
  }

  deleteFamilyMember(id) {
    this.dataManager.deleteItem('familyMembers', id);
    this.displayFamilyTree(); // إعادة عرض الشجرة
  }

  addEvent(eventData) {
    const newEvent = this.dataManager.addItem('events', eventData);
    // إعادة تحميل صفحة الفعاليات إذا كانت مفتوحة
    if (window.loadEvents) window.loadEvents();
    return newEvent;
  }

  addSuggestion(suggestionData) {
    const newSuggestion = this.dataManager.addItem('suggestions', suggestionData);
    // إعادة تحميل صفحة الاقتراحات إذا كانت مفتوحة
    if (window.loadSuggestions) window.loadSuggestions();
    if (window.updateStatistics) window.updateStatistics();
    return newSuggestion;
  }

  updateSuggestion(id, suggestionData) {
    const updatedSuggestion = this.dataManager.updateItem('suggestions', id, suggestionData);
    // إعادة تحميل صفحة الاقتراحات إذا كانت مفتوحة
    if (window.loadSuggestions) window.loadSuggestions();
    if (window.updateStatistics) window.updateStatistics();
    return updatedSuggestion;
  }

  deleteSuggestion(id) {
    this.dataManager.deleteItem('suggestions', id);
    // إعادة تحميل صفحة الاقتراحات إذا كانت مفتوحة
    if (window.loadSuggestions) window.loadSuggestions();
    if (window.updateStatistics) window.updateStatistics();
  }

  getSuggestionById(id) {
    return this.mockSuggestionsData.find(suggestion => suggestion.id === id);
  }

  addLibraryContent(contentData) {
    const newContent = this.dataManager.addItem('library', contentData);
    // إعادة تحميل صفحة المكتبة إذا كانت مفتوحة
    if (window.loadContent) window.loadContent();
    if (window.updateStatistics) window.updateStatistics();
    return newContent;
  }

  // دالة إعادة تعيين البيانات للافتراضية
  resetAllData() {
    this.dataManager.resetData();
    // إعادة تحميل جميع الصفحات
    this.displayFamilyTree();
    if (window.loadEvents) window.loadEvents();
    if (window.loadSuggestions) window.loadSuggestions();
    if (window.loadContent) window.loadContent();
    if (window.updateStatistics) window.updateStatistics();
    alert('تم إعادة تعيين جميع البيانات إلى الحالة الافتراضية');
  }

  // دالة تصدير البيانات
  exportData() {
    const data = {
      familyMembers: this.mockFamilyData,
      events: this.mockEventsData,
      suggestions: this.mockSuggestionsData,
      library: this.mockLibraryData,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alsaedan-family-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  new AlSaedanNetlifyApp();
});

// إضافة alert utility للتوافق
window.AlSaedanUtils = {
  showAlert: (type, message) => {
    alert(message);
  },
  showLoading: (show) => {
    // يمكن تحسينه لاحقاً
    console.log('Loading:', show);
  }
};

// جعل الفئات متاحة عالمياً
window.AlSaedanNetlifyApp = AlSaedanNetlifyApp;
window.dataManager = dataManager;