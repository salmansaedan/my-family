import { Hono } from 'hono'
import { renderer } from './renderer'
import { serveStatic } from 'hono/cloudflare-workers'
import { cors } from 'hono/cors'

// تعريف أنواع البيانات للـ TypeScript
type Bindings = {
  DB: D1Database;
}

type Variables = {
  message: string;
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Middleware
app.use(renderer)
app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './public' }))

// API Routes
app.get('/api/family-members', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT id, full_name, father_id, generation, phone, email, 
             field_of_excellence, achievements, relationship_level, 
             created_at
      FROM family_members 
      WHERE is_active = 1 
      ORDER BY generation ASC, full_name ASC
    `).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'فشل في جلب بيانات أعضاء العائلة' }, 500);
  }
});

app.get('/api/events', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT e.*, fm.full_name as organizer_name
      FROM events e
      LEFT JOIN family_members fm ON e.organizer_id = fm.id
      WHERE e.status != 'cancelled'
      ORDER BY e.event_date DESC
      LIMIT 20
    `).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'فشل في جلب بيانات الفعاليات' }, 500);
  }
});

app.get('/api/suggestions', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT s.*, fm.full_name as member_name
      FROM suggestions s
      LEFT JOIN family_members fm ON s.member_id = fm.id
      ORDER BY s.created_at DESC
      LIMIT 20
    `).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'فشل في جلب المقترحات' }, 500);
  }
});

app.post('/api/suggestions', async (c) => {
  try {
    const { title, description, category, member_id } = await c.req.json();
    
    const { success } = await c.env.DB.prepare(`
      INSERT INTO suggestions (title, description, category, member_id)
      VALUES (?, ?, ?, ?)
    `).bind(title, description, category || 'general', member_id).run();

    if (success) {
      return c.json({ success: true, message: 'تم إضافة المقترح بنجاح' });
    } else {
      return c.json({ success: false, error: 'فشل في إضافة المقترح' }, 500);
    }
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في إضافة المقترح' }, 500);
  }
});

// API لمكتبة التجارب والخبرات
app.get('/api/library', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT lc.*, fm.full_name as author_name
      FROM library_content lc
      LEFT JOIN family_members fm ON lc.created_by = fm.id
      WHERE lc.published_at IS NOT NULL
      ORDER BY lc.is_featured DESC, lc.published_at DESC
      LIMIT 50
    `).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'فشل في جلب محتوى المكتبة' }, 500);
  }
});

app.get('/api/library/categories', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT category, COUNT(*) as count
      FROM library_content 
      WHERE published_at IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'فشل في جلب فئات المحتوى' }, 500);
  }
});

app.get('/api/library/featured', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT lc.*, fm.full_name as author_name
      FROM library_content lc
      LEFT JOIN family_members fm ON lc.created_by = fm.id
      WHERE lc.is_featured = TRUE AND lc.published_at IS NOT NULL
      ORDER BY lc.published_at DESC
      LIMIT 6
    `).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'فشل في جلب المحتوى المميز' }, 500);
  }
});

app.post('/api/library/view/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { success } = await c.env.DB.prepare(`
      UPDATE library_content 
      SET views = views + 1 
      WHERE id = ?
    `).bind(id).run();

    if (success) {
      return c.json({ success: true });
    } else {
      return c.json({ success: false, error: 'فشل في تحديث عدد المشاهدات' }, 500);
    }
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في تحديث المشاهدات' }, 500);
  }
});

// صفحة شجرة العائلة
app.get('/family', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full p-3">
                <i class="fas fa-sitemap text-2xl"></i>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">شجرة العائلة</h1>
                <p class="text-gray-600">أفراد عائلة آل سعيدان</p>
              </div>
            </div>
            <nav class="hidden md:flex items-center space-x-6 space-x-reverse">
              <a href="/" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الرئيسية</a>
              <a href="/family" class="text-blue-600 font-semibold">شجرة العائلة</a>
              <a href="/events" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الفعاليات</a>
              <a href="/suggestions" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">شاركنا أفكارك</a>
              <a href="/library" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">مكتبة التجارب</a>
            </nav>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Family Tree Container */}
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="mb-8 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-4">
              <i class="fas fa-crown text-2xl text-white"></i>
            </div>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">شجرة عائلة آل سعيدان</h2>
            <p class="text-gray-600">نسب وأجيال العائلة الكريمة</p>
          </div>

          {/* Loading State */}
          <div id="family-loading" class="text-center py-12">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-600">جاري تحميل شجرة العائلة...</p>
          </div>

          {/* Family Tree Content */}
          <div id="family-tree" class="hidden">
            {/* Will be populated by JavaScript */}
          </div>
        </div>
      </main>
    </div>,
    { title: 'شجرة العائلة - تطبيق آل سعيدان' }
  )
});

// صفحة الفعاليات
app.get('/events', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full p-3">
                <i class="fas fa-calendar-alt text-2xl"></i>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">الفعاليات</h1>
                <p class="text-gray-600">فعاليات ولقاءات العائلة</p>
              </div>
            </div>
            <nav class="hidden md:flex items-center space-x-6 space-x-reverse">
              <a href="/" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الرئيسية</a>
              <a href="/family" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">شجرة العائلة</a>
              <a href="/events" class="text-blue-600 font-semibold">الفعاليات</a>
              <a href="/suggestions" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">شاركنا أفكارك</a>
            </nav>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Events Container */}
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="mb-8 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mb-4">
              <i class="fas fa-calendar-check text-2xl text-white"></i>
            </div>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">فعاليات العائلة</h2>
            <p class="text-gray-600">اللقاءات والمناسبات العائلية</p>
          </div>

          {/* Loading State */}
          <div id="events-loading" class="text-center py-12">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-600">جاري تحميل الفعاليات...</p>
          </div>

          {/* Events Content */}
          <div id="events-list" class="hidden">
            {/* Will be populated by JavaScript */}
          </div>
        </div>
      </main>
    </div>,
    { title: 'الفعاليات - تطبيق آل سعيدان' }
  )
});

// صفحة مكتبة التجارب والخبرات
app.get('/library', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-3">
                <i class="fas fa-book-open text-2xl"></i>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">مكتبة التجارب</h1>
                <p class="text-gray-600">خبرات وتجارب أعضاء العائلة المتميزين</p>
              </div>
            </div>
            <nav class="hidden md:flex items-center space-x-6 space-x-reverse">
              <a href="/" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الرئيسية</a>
              <a href="/family" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">شجرة العائلة</a>
              <a href="/events" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الفعاليات</a>
              <a href="/suggestions" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">شاركنا أفكارك</a>
              <a href="/library" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">مكتبة التجارب</a>
              <a href="/library" class="text-purple-600 font-semibold">مكتبة التجارب</a>
            </nav>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white text-center">
          <div class="mb-6">
            <i class="fas fa-lightbulb text-4xl mb-4 opacity-90"></i>
          </div>
          <h2 class="text-3xl font-bold mb-4">مكتبة تجارب وخبرات آل سعيدان</h2>
          <p class="text-xl opacity-90 mb-6">نستلهم من تجارب الماضي لنبني مستقبلاً أفضل</p>
          <div class="bg-white bg-opacity-20 rounded-lg p-4 max-w-2xl mx-auto">
            <p class="text-lg">"المعرفة تزداد بالمشاركة، والحكمة تنمو بالتجربة، والنجاح يتحقق بالتعلم من الآخرين"</p>
          </div>
        </div>

        {/* Filter and Categories */}
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div class="flex flex-wrap items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-800">تصفح حسب الفئة</h3>
            <div class="flex items-center space-x-4 space-x-reverse">
              <select id="category-filter" class="form-input text-sm">
                <option value="all">جميع الفئات</option>
                <option value="business">الأعمال والتجارة</option>
                <option value="education">التعليم والتطوير</option>
                <option value="personal_development">التطوير الشخصي</option>
                <option value="family_values">القيم العائلية</option>
                <option value="leadership">القيادة والإدارة</option>
              </select>
              <select id="content-type-filter" class="form-input text-sm">
                <option value="all">جميع الأنواع</option>
                <option value="article">مقالات</option>
                <option value="video">فيديوهات</option>
                <option value="audio">صوتيات</option>
                <option value="document">وثائق</option>
              </select>
            </div>
          </div>

          {/* Category Statistics */}
          <div id="category-stats" class="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Will be populated by JavaScript */}
          </div>
        </div>

        {/* Featured Content */}
        <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-2 ml-3">
                <i class="fas fa-star text-white"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-800">المحتوى المميز</h3>
            </div>
          </div>

          {/* Featured Content Loading */}
          <div id="featured-loading" class="text-center py-8">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-600">جاري تحميل المحتوى المميز...</p>
          </div>

          {/* Featured Content Grid */}
          <div id="featured-content" class="hidden grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Will be populated by JavaScript */}
          </div>
        </div>

        {/* All Content */}
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-2 ml-3">
                <i class="fas fa-archive text-white"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-800">جميع التجارب والخبرات</h3>
            </div>
            <div class="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <i class="fas fa-sort"></i>
              <span>مرتبة حسب الأحدث</span>
            </div>
          </div>

          {/* Content Loading */}
          <div id="content-loading" class="text-center py-12">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-600">جاري تحميل محتوى المكتبة...</p>
          </div>

          {/* Content List */}
          <div id="content-list" class="hidden space-y-6">
            {/* Will be populated by JavaScript */}
          </div>

          {/* Empty State */}
          <div id="empty-state" class="hidden text-center py-12">
            <i class="fas fa-book-open text-gray-400 text-4xl mb-4"></i>
            <p class="text-gray-600">لا يوجد محتوى متاح حالياً</p>
            <p class="text-sm text-gray-500">تابعونا لإضافة المزيد من التجارب والخبرات</p>
          </div>
        </div>

        {/* Call to Action */}
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mt-8 text-white text-center">
          <div class="mb-4">
            <i class="fas fa-handshake text-3xl mb-4 opacity-90"></i>
          </div>
          <h3 class="text-2xl font-bold mb-4">شارك تجربتك مع العائلة</h3>
          <p class="text-lg opacity-90 mb-6">هل لديك تجربة أو خبرة تود مشاركتها؟ ساهم في إثراء مكتبة العائلة</p>
          <div class="bg-white bg-opacity-20 rounded-lg p-4">
            <p class="text-sm">للمساهمة بمحتوى جديد، يرجى التواصل مع مجلس الأسرة</p>
            <div class="mt-3">
              <a href="tel:0533361154" class="text-yellow-300 hover:text-yellow-100 font-medium">
                <i class="fas fa-phone ml-1"></i>
                0533361154
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>,
    { title: 'مكتبة التجارب - تطبيق آل سعيدان' }
  )
});

// صفحة المقترحات
app.get('/suggestions', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full p-3">
                <i class="fas fa-lightbulb text-2xl"></i>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">شاركنا أفكارك</h1>
                <p class="text-gray-600">مقترحات لتطوير العائلة</p>
              </div>
            </div>
            <nav class="hidden md:flex items-center space-x-6 space-x-reverse">
              <a href="/" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الرئيسية</a>
              <a href="/family" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">شجرة العائلة</a>
              <a href="/events" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الفعاليات</a>
              <a href="/suggestions" class="text-blue-600 font-semibold">شاركنا أفكارك</a>
            </nav>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Suggestions Form */}
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div class="mb-6 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4">
              <i class="fas fa-plus-circle text-2xl text-white"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">شارك مقترحك الجديد</h2>
            <p class="text-gray-600">ساهم في تطوير العائلة بأفكارك المبدعة</p>
          </div>

          <form id="suggestion-form" class="max-w-2xl mx-auto">
            <div class="grid gap-6">
              <div>
                <label class="block text-gray-700 font-semibold mb-2">عنوان المقترح</label>
                <input type="text" name="title" required class="form-input" placeholder="اكتب عنوان مقترحك هنا..." />
              </div>
              
              <div>
                <label class="block text-gray-700 font-semibold mb-2">وصف المقترح</label>
                <textarea name="description" required rows="4" class="form-input" placeholder="اشرح مقترحك بالتفصيل..."></textarea>
              </div>

              <div>
                <label class="block text-gray-700 font-semibold mb-2">فئة المقترح</label>
                <select name="category" class="form-input">
                  <option value="event">فعالية أو مناسبة</option>
                  <option value="improvement">تحسين أو تطوير</option>
                  <option value="program">برنامج أو ورشة</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div class="text-center">
                <button type="submit" class="btn-primary">
                  <i class="fas fa-paper-plane ml-2"></i>
                  إرسال المقترح
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Existing Suggestions */}
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="mb-6 text-center">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">المقترحات الحالية</h3>
            <p class="text-gray-600">تصفح المقترحات المقدمة من أعضاء العائلة</p>
          </div>

          {/* Loading State */}
          <div id="suggestions-loading" class="text-center py-12">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-600">جاري تحميل المقترحات...</p>
          </div>

          {/* Suggestions List */}
          <div id="suggestions-list" class="hidden">
            {/* Will be populated by JavaScript */}
          </div>
        </div>
      </main>
    </div>,
    { title: 'شاركنا أفكارك - تطبيق آل سعيدان' }
  )
});

// الصفحة الرئيسية
app.get('/', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full p-3">
                <i class="fas fa-users text-2xl"></i>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">تطبيق آل سعيدان</h1>
                <p class="text-gray-600">منصة التواصل العائلي</p>
              </div>
            </div>
            <nav class="hidden md:flex items-center space-x-6 space-x-reverse">
              <a href="/" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الرئيسية</a>
              <a href="/family" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">شجرة العائلة</a>
              <a href="/events" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الفعاليات</a>
              <a href="/suggestions" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">شاركنا أفكارك</a>
              <a href="/library" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">مكتبة التجارب</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Card */}
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-12 text-center">
          <div class="mb-6">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-4">
              <i class="fas fa-hand-peace text-3xl text-white"></i>
            </div>
          </div>
          <h2 class="text-4xl font-bold text-gray-800 mb-4">أهلاً وسهلاً بعائلة آل سعيدان</h2>
          <p class="text-xl text-gray-600 mb-6">منصة تفاعلية لربط أفراد العائلة الكريمة وتنظيم الفعاليات العائلية</p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p class="text-blue-800 mb-2"><i class="fas fa-info-circle ml-2"></i> <strong>مجلس الأسرة الحالي (الجيل الثالث):</strong></p>
            <p class="text-blue-700 text-sm">رئيس المجلس: سلمان عبدالله آل سعيدان (ابن عبدالله)</p>
            <p class="text-blue-700 text-sm">الأعضاء: خالد فهد، هشام حمد، بدر إبراهيم آل سعيدان</p>
          </div>
        </div>

        {/* Features Grid */}
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* شجرة العائلة */}
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" onclick="window.location.href='/family'">
            <div class="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <i class="fas fa-sitemap text-blue-600 text-xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">شجرة العائلة</h3>
            <p class="text-gray-600 text-sm">تصفح أفراد العائلة والأجيال المختلفة</p>
            <div class="mt-4 text-blue-600 text-sm font-medium">استكشف الآن →</div>
          </div>

          {/* الفعاليات */}
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" onclick="window.location.href='/events'">
            <div class="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <i class="fas fa-calendar-alt text-green-600 text-xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">الفعاليات</h3>
            <p class="text-gray-600 text-sm">تصفح الفعاليات القادمة والسابقة</p>
            <div class="mt-4 text-green-600 text-sm font-medium">شاهد المزيد →</div>
          </div>

          {/* المقترحات */}
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" onclick="window.location.href='/suggestions'">
            <div class="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <i class="fas fa-lightbulb text-yellow-600 text-xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">شاركنا أفكارك</h3>
            <p class="text-gray-600 text-sm">قدم مقترحاتك لتطوير العائلة</p>
            <div class="mt-4 text-yellow-600 text-sm font-medium">شارك الآن →</div>
          </div>

          {/* مكتبة التجارب */}
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" onclick="window.location.href='/library'">
            <div class="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <i class="fas fa-book-open text-purple-600 text-xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">مكتبة التجارب</h3>
            <p class="text-gray-600 text-sm">تجارب وخبرات الأعضاء المميزين</p>
            <div class="mt-4 text-purple-600 text-sm font-medium">تصفح المكتبة →</div>
          </div>
        </div>

        {/* Legacy Section */}
        <div class="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <div class="mb-6">
            <i class="fas fa-crown text-4xl mb-4 opacity-90"></i>
          </div>
          <h2 class="text-3xl font-bold mb-4">تراث الشيخ محمد بن عبدالله بن سعيدان</h2>
          <p class="text-xl opacity-90 mb-6">نحافظ على تراث أجدادنا ونبني مستقبلاً مشرقاً للأجيال القادمة</p>
          <div class="bg-white bg-opacity-20 rounded-lg p-4 max-w-2xl mx-auto">
            <p class="text-lg">"العائلة المتماسكة قوة، والتراث المحفوظ هوية، والمستقبل المشترك أمل"</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer class="bg-gray-800 text-white py-8 mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <div class="flex justify-center items-center mb-4">
              <div class="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full p-2 ml-3">
                <i class="fas fa-users"></i>
              </div>
              <span class="text-xl font-semibold">تطبيق آل سعيدان</span>
            </div>
            <p class="text-gray-400 mb-4">منصة تجمع العائلة وتحافظ على التراث</p>
            <div class="border-t border-gray-700 pt-4">
              <p class="text-sm text-gray-500">
                للتواصل: <a href="tel:0533361154" class="text-blue-400 hover:text-blue-300">0533361154</a> | 
                <a href="mailto:info@salmansaedan.com" class="text-blue-400 hover:text-blue-300">info@salmansaedan.com</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>,
    { title: 'تطبيق آل سعيدان - منصة التواصل العائلي' }
  )
})

export default app
