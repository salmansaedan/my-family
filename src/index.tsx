import { Hono } from 'hono'
import { cors } from 'hono/cors'
// import { serveStatic } from 'hono/cloudflare-workers' - معطل لتجنب مشاكل __STATIC_CONTENT_MANIFEST

// تعريف أنواع البيانات
type Bindings = {
  DB: D1Database;
}

type DBUser = {
  id: string;
  national_id?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  full_name: string;
  email: string;
  phone?: string;
  password_hash: string;
  role: string;
  status: string;
  birth_date?: string;
  birth_place?: string;
  profession?: string;
  specialization?: string;
  hobbies?: string;
  father_id?: string;
  generation: number;
  city?: string;
  district?: string;
  country?: string;
  gender?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string;
  last_login?: string;
}

type DBFamilyMember = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  full_name: string;
  birth_date?: string;
  birth_place?: string;
  death_date?: string;
  death_place?: string;
  gender: string;
  member_type: string;
  father_id?: string;
  spouse_id?: string;
  generation: number;
  profession?: string;
  specialization?: string;
  phone?: string;
  email?: string;
  hobbies?: string;
  bio?: string;
  notes?: string;
  is_alive: boolean;
  profile_image?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

// إنشاء تطبيق Hono
const app = new Hono<{ Bindings: Bindings }>()

// إعداد CORS للسماح بالوصول من الواجهة الأمامية
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

// === Authentication Middleware ===

// Middleware للتحقق من صحة المصادقة
const authMiddleware = async (c: any, next: any) => {
  try {
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        status: 'error',
        message: 'رمز المصادقة مطلوب'
      }, 401)
    }
    
    const token = authHeader.substring(7)
    const { env } = c
    
    // البحث عن الجلسة النشطة
    const session = await env.DB.prepare(`
      SELECT s.*, u.* FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ? AND s.is_active = true AND s.expires_at > datetime('now')
    `).bind(token).first()
    
    if (!session) {
      return c.json({
        status: 'error',
        message: 'جلسة غير صالحة أو منتهية الصلاحية'
      }, 401)
    }
    
    // تحديث آخر نشاط
    await env.DB.prepare(
      'UPDATE user_sessions SET last_activity = CURRENT_TIMESTAMP WHERE session_token = ?'
    ).bind(token).run()
    
    // إضافة معلومات المستخدم للسياق
    c.set('user', session)
    
    await next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في التحقق من المصادقة'
    }, 500)
  }
}

// Middleware للتحقق من الصلاحيات
const permissionMiddleware = (requiredPermission: string) => {
  return async (c: any, next: any) => {
    try {
      const user = c.get('user')
      if (!user) {
        return c.json({
          status: 'error',
          message: 'يجب تسجيل الدخول أولاً'
        }, 401)
      }
      
      const { env } = c
      
      // التحقق من صلاحيات المدير الأعلى
      if (user.role === 'super_admin') {
        await next()
        return
      }
      
      // التحقق من صلاحيات الدور
      const rolePermission = await env.DB.prepare(`
        SELECT 1 FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        JOIN roles r ON rp.role_id = r.id
        WHERE r.name = ? AND p.name = ? AND r.is_active = true
        LIMIT 1
      `).bind(user.role, requiredPermission).first()
      
      if (rolePermission) {
        await next()
        return
      }
      
      // التحقق من الصلاحيات المخصصة للمستخدم
      const userPermission = await env.DB.prepare(`
        SELECT up.granted FROM permissions p
        JOIN user_permissions up ON p.id = up.permission_id
        WHERE up.user_id = ? AND p.name = ? 
        AND (up.expires_at IS NULL OR up.expires_at > datetime('now'))
        LIMIT 1
      `).bind(user.id, requiredPermission).first()
      
      if (userPermission && userPermission.granted) {
        await next()
        return
      }
      
      return c.json({
        status: 'error',
        message: 'ليس لديك صلاحية للوصول لهذه الخاصية'
      }, 403)
    } catch (error) {
      console.error('Permission middleware error:', error)
      return c.json({
        status: 'error',
        message: 'خطأ في التحقق من الصلاحيات'
      }, 500)
    }
  }
}

// خدمة الملفات الثابتة - معطلة لتجنب مشاكل __STATIC_CONTENT_MANIFEST
// app.use('/static/*', serveStatic({ root: './public' }))

// صفحة تسجيل الدخول
app.get('/login', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تسجيل الدخول - تطبيق آل سعيدان</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        
        <style>
            body { font-family: 'Noto Sans Arabic', Arial, sans-serif; }
            .login-container {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
        </style>
    </head>
    <body class="login-container">
        <div class="min-h-screen flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <!-- Header -->
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
                    <i class="fas fa-users text-4xl mb-3"></i>
                    <h1 class="text-2xl font-bold">تطبيق آل سعيدان</h1>
                    <p class="text-blue-100 mt-1">تسجيل الدخول للنظام</p>
                </div>
                
                <!-- Login Form -->
                <div class="p-6">
                    <form id="loginForm" class="space-y-4">
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">البريد الإلكتروني</label>
                            <input type="email" id="email" name="email" required
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">كلمة المرور</label>
                            <input type="password" id="password" name="password" required
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        
                        <div id="errorMessage" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"></div>
                        
                        <button type="submit" id="loginBtn" 
                                class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                            <i class="fas fa-sign-in-alt ml-2"></i>
                            <span id="loginText">تسجيل الدخول</span>
                            <div id="loginSpinner" class="hidden inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        </button>
                    </form>
                    
                    <!-- Quick Login Buttons -->
                    <div class="mt-6 pt-6 border-t border-gray-200">
                        <p class="text-gray-600 text-sm text-center mb-4">تسجيل دخول سريع للاختبار:</p>
                        <div class="space-y-2">
                            <button onclick="quickLogin('admin@salmansaedan.com', 'admin123')" 
                                    class="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm transition-colors">
                                <i class="fas fa-user-shield ml-1"></i> مدير النظام
                            </button>
                            <button onclick="quickLogin('info@salmansaedan.com', 'saedan123')" 
                                    class="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm transition-colors">
                                <i class="fas fa-user ml-1"></i> سلمان السعيدان
                            </button>
                            <button onclick="quickLogin('test@salmansaedan.com', 'test123')" 
                                    class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg text-sm transition-colors">
                                <i class="fas fa-user ml-1"></i> مستخدم تجريبي (معلق)
                            </button>
                        </div>
                    </div>
                    
                    <!-- Register Link -->
                    <div class="text-center mt-6 pt-4 border-t border-gray-200">
                        <a href="/register" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            <i class="fas fa-user-plus ml-1"></i>
                            إنشاء حساب جديد
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <script>
            // Quick login function
            function quickLogin(email, password) {
                document.getElementById('email').value = email;
                document.getElementById('password').value = password;
                document.getElementById('loginForm').dispatchEvent(new Event('submit'));
            }
            
            // Login form handler
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const loginBtn = document.getElementById('loginBtn');
                const loginText = document.getElementById('loginText');
                const loginSpinner = document.getElementById('loginSpinner');
                const errorMessage = document.getElementById('errorMessage');
                
                // Show loading state
                loginBtn.disabled = true;
                loginText.textContent = 'جاري تسجيل الدخول...';
                loginSpinner.classList.remove('hidden');
                errorMessage.classList.add('hidden');
                
                try {
                    const formData = new FormData(e.target);
                    const response = await axios.post('/api/auth/login', {
                        email: formData.get('email'),
                        password: formData.get('password')
                    });
                    
                    if (response.data.status === 'success') {
                        // Save session data
                        localStorage.setItem('authToken', response.data.data.session.token);
                        localStorage.setItem('user', JSON.stringify(response.data.data.user));
                        
                        // Redirect to main app
                        window.location.href = '/app';
                    } else {
                        throw new Error(response.data.message);
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    errorMessage.textContent = error.response?.data?.message || 'خطأ في تسجيل الدخول';
                    errorMessage.classList.remove('hidden');
                } finally {
                    // Hide loading state
                    loginBtn.disabled = false;
                    loginText.textContent = 'تسجيل الدخول';
                    loginSpinner.classList.add('hidden');
                }
            });
        </script>
    </body>
    </html>
  `)
})

// صفحة التسجيل
app.get('/register', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>إنشاء حساب جديد - تطبيق آل سعيدان</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        
        <style>
            body { font-family: 'Noto Sans Arabic', Arial, sans-serif; }
        </style>
    </head>
    <body class="bg-gradient-to-br from-blue-900 to-purple-900 min-h-screen">
        <div class="min-h-screen flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <!-- Header -->
                <div class="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white text-center">
                    <i class="fas fa-user-plus text-4xl mb-3"></i>
                    <h1 class="text-2xl font-bold">إنشاء حساب جديد</h1>
                    <p class="text-green-100 mt-1">انضم لشبكة آل سعيدان</p>
                </div>
                
                <!-- Register Form -->
                <div class="p-6">
                    <form id="registerForm" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-semibold mb-2">الاسم الأول *</label>
                                <input type="text" name="first_name" required
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-semibold mb-2">الاسم الأخير *</label>
                                <input type="text" name="last_name" required
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">الاسم الأوسط</label>
                            <input type="text" name="middle_name"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">البريد الإلكتروني *</label>
                            <input type="email" name="email" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">كلمة المرور *</label>
                            <input type="password" name="password" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-semibold mb-2">رقم الهاتف</label>
                                <input type="tel" name="phone"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-semibold mb-2">الجنس</label>
                                <select name="gender" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="">اختر...</option>
                                    <option value="male">ذكر</option>
                                    <option value="female">أنثى</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-semibold mb-2">المدينة</label>
                                <input type="text" name="city"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-semibold mb-2">الدولة</label>
                                <input type="text" name="country"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>
                        
                        <div id="errorMessage" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"></div>
                        <div id="successMessage" class="hidden bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg"></div>
                        
                        <button type="submit" id="registerBtn" 
                                class="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                            <i class="fas fa-user-plus ml-2"></i>
                            <span id="registerText">إنشاء الحساب</span>
                            <div id="registerSpinner" class="hidden inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        </button>
                    </form>
                    
                    <!-- Login Link -->
                    <div class="text-center mt-6 pt-4 border-t border-gray-200">
                        <a href="/login" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            <i class="fas fa-sign-in-alt ml-1"></i>
                            لديك حساب؟ تسجيل الدخول
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <script>
            document.getElementById('registerForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const registerBtn = document.getElementById('registerBtn');
                const registerText = document.getElementById('registerText');
                const registerSpinner = document.getElementById('registerSpinner');
                const errorMessage = document.getElementById('errorMessage');
                const successMessage = document.getElementById('successMessage');
                
                // Show loading state
                registerBtn.disabled = true;
                registerText.textContent = 'جاري إنشاء الحساب...';
                registerSpinner.classList.remove('hidden');
                errorMessage.classList.add('hidden');
                successMessage.classList.add('hidden');
                
                try {
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData.entries());
                    
                    const response = await axios.post('/api/auth/register', data);
                    
                    if (response.data.status === 'success') {
                        successMessage.textContent = response.data.message;
                        successMessage.classList.remove('hidden');
                        e.target.reset();
                        
                        // Redirect to login after 3 seconds
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 3000);
                    } else {
                        throw new Error(response.data.message);
                    }
                } catch (error) {
                    console.error('Registration error:', error);
                    errorMessage.textContent = error.response?.data?.message || 'خطأ في إنشاء الحساب';
                    errorMessage.classList.remove('hidden');
                } finally {
                    // Hide loading state
                    registerBtn.disabled = false;
                    registerText.textContent = 'إنشاء الحساب';
                    registerSpinner.classList.add('hidden');
                }
            });
        </script>
    </body>
    </html>
  `)
})

// الصفحة الرئيسية
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تطبيق آل سعيدان - نسخة المزامنة الفورية</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gradient-to-br from-blue-900 to-purple-900 min-h-screen flex items-center justify-center text-white">
        <div class="text-center max-w-2xl mx-auto p-8">
            <div class="mb-8">
                <i class="fas fa-database text-6xl text-blue-300 mb-4"></i>
                <h1 class="text-4xl font-bold mb-2">🚀 تطبيق آل سعيدان</h1>
                <h2 class="text-2xl text-blue-200 mb-4">نسخة المزامنة الفورية مع قاعدة البيانات</h2>
                <p class="text-lg text-gray-300">قاعدة بيانات حقيقية • مزامنة فورية • تحديثات مباشرة</p>
            </div>
            
            <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
                <h3 class="text-xl font-semibold mb-4 text-yellow-300">
                    <i class="fas fa-sparkles ml-2"></i>
                    🆕 الميزات الجديدة
                </h3>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <h4 class="font-semibold text-blue-200 mb-2">🔐 نظام المصادقة والصلاحيات</h4>
                        <ul class="text-right space-y-1 text-sm">
                            <li class="flex items-center justify-end"><i class="fas fa-user-lock text-green-400 ml-2"></i> تسجيل دخول آمن</li>
                            <li class="flex items-center justify-end"><i class="fas fa-user-shield text-blue-400 ml-2"></i> 7 أدوار مختلفة</li>
                            <li class="flex items-center justify-end"><i class="fas fa-key text-yellow-400 ml-2"></i> 24 صلاحية مفصلة</li>
                            <li class="flex items-center justify-end"><i class="fas fa-users-cog text-purple-400 ml-2"></i> لوحة إدارة المستخدمين</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold text-green-200 mb-2">💾 قاعدة البيانات والمزامنة</h4>
                        <ul class="text-right space-y-1 text-sm">
                            <li class="flex items-center justify-end"><i class="fas fa-database text-green-400 ml-2"></i> قاعدة بيانات Cloudflare D1</li>
                            <li class="flex items-center justify-end"><i class="fas fa-sync text-blue-400 ml-2"></i> مزامنة فورية</li>
                            <li class="flex items-center justify-end"><i class="fas fa-bolt text-yellow-400 ml-2"></i> تحديثات مباشرة</li>
                            <li class="flex items-center justify-end"><i class="fas fa-users text-purple-400 ml-2"></i> إدارة شاملة للعائلة</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="bg-green-500/20 border border-green-400 rounded-lg p-4 mb-6">
                <p class="text-green-200"><i class="fas fa-check-circle ml-2"></i>الخادم يعمل بنجاح!</p>
                <p class="text-sm text-green-300 mt-1">قاعدة البيانات وجميع الأنظمة جاهزة للاستخدام</p>
            </div>
            
            <!-- Demo Accounts Info -->
            <div class="bg-blue-500/10 border border-blue-300 rounded-lg p-4 mb-6">
                <h3 class="text-lg font-semibold text-blue-200 mb-3 text-center">
                    <i class="fas fa-key ml-2"></i>
                    حسابات جاهزة للاختبار
                </h3>
                <div class="grid md:grid-cols-3 gap-4 text-sm">
                    <div class="bg-white/5 rounded-lg p-3">
                        <h4 class="font-semibold text-red-300 mb-2">
                            <i class="fas fa-crown ml-1"></i>
                            مدير النظام الأعلى
                        </h4>
                        <p class="text-gray-300">admin@salmansaedan.com</p>
                        <p class="text-gray-300">كلمة المرور: admin123</p>
                        <p class="text-xs text-red-200 mt-1">صلاحيات كاملة</p>
                    </div>
                    <div class="bg-white/5 rounded-lg p-3">
                        <h4 class="font-semibold text-green-300 mb-2">
                            <i class="fas fa-user-tie ml-1"></i>
                            سلمان السعيدان
                        </h4>
                        <p class="text-gray-300">info@salmansaedan.com</p>
                        <p class="text-gray-300">كلمة المرور: saedan123</p>
                        <p class="text-xs text-green-200 mt-1">مدير - هاتف: 0533361154</p>
                    </div>
                    <div class="bg-white/5 rounded-lg p-3">
                        <h4 class="font-semibold text-gray-300 mb-2">
                            <i class="fas fa-flask ml-1"></i>
                            مستخدم تجريبي
                        </h4>
                        <p class="text-gray-300">test@salmansaedan.com</p>
                        <p class="text-gray-300">كلمة المرور: test123</p>
                        <p class="text-xs text-yellow-200 mt-1">حالة: معلق (يحتاج موافقة)</p>
                    </div>
                </div>
            </div>
            
            <!-- Authentication Section -->
            <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
                <h3 class="text-xl font-semibold mb-4 text-blue-200 text-center">
                    <i class="fas fa-user-lock ml-2"></i>
                    تسجيل الدخول والانضمام
                </h3>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/login" 
                       class="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 text-center transform hover:scale-105 shadow-lg">
                        <i class="fas fa-sign-in-alt ml-2"></i>
                        تسجيل الدخول
                    </a>
                    <a href="/register" 
                       class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 text-center transform hover:scale-105 shadow-lg">
                        <i class="fas fa-user-plus ml-2"></i>
                        إنشاء حساب جديد
                    </a>
                </div>
                
                <!-- Quick Login Demo -->
                <div class="mt-4 pt-4 border-t border-white/20">
                    <p class="text-center text-blue-200 text-sm mb-3">
                        <i class="fas fa-rocket ml-1"></i>
                        جرب النظام فوراً - تسجيل دخول سريع:
                    </p>
                    <div class="flex flex-wrap gap-2 justify-center">
                        <a href="/login" 
                           class="bg-red-500/80 hover:bg-red-500 text-white px-3 py-2 rounded text-xs transition-colors">
                            <i class="fas fa-user-shield ml-1"></i> مدير النظام
                        </a>
                        <a href="/login" 
                           class="bg-green-500/80 hover:bg-green-500 text-white px-3 py-2 rounded text-xs transition-colors">
                            <i class="fas fa-user ml-1"></i> سلمان السعيدان
                        </a>
                        <a href="/login" 
                           class="bg-gray-500/80 hover:bg-gray-500 text-white px-3 py-2 rounded text-xs transition-colors">
                            <i class="fas fa-user ml-1"></i> مستخدم تجريبي
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="space-y-3">
                <a href="/app" 
                   class="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg">
                    <i class="fas fa-home ml-2"></i>دخول التطبيق الكامل
                </a>
                <br>
                <a href="/api/test" 
                   class="inline-block bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-sm transition-colors">
                    <i class="fas fa-vial ml-2"></i>اختبار قاعدة البيانات
                </a>
            </div>
        </div>
    </body>
    </html>
  `)
})

// خدمة التطبيق الرئيسي - النسخة الكاملة مع جميع الأقسام
app.get('/dist/index.html', (c) => {
  return c.redirect('/static/app.html')
})

// خدمة التطبيق الكامل مع جميع الأقسام
app.get('/app', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>تطبيق آل سعيدان الشامل - مع المزامنة الفورية</title>
        
        <!-- CSS Libraries -->
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        
        <!-- Arabic Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        <!-- Chart.js for Statistics -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        
        <style>
            body { 
                font-family: 'Noto Sans Arabic', Arial, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            
            .loading-spinner {
                border: 3px solid #f3f4f6;
                border-top: 3px solid #3b82f6;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .nav-item.active {
                background: linear-gradient(135deg, #3b82f6, #10b981);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
            }

            /* Mobile Navigation Styles */
            .nav-item-mobile.active {
                background: linear-gradient(135deg, #3b82f6, #10b981);
                color: white !important;
                font-weight: 600;
            }
            
            .nav-item-mobile {
                border: 1px solid transparent;
                font-weight: 500;
            }
            
            .nav-item-mobile:hover {
                background: #f3f4f6;
                border-color: #e5e7eb;
            }
            
            /* Enhanced Cards */
            .feature-card {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: all 0.3s ease;
            }
            
            .feature-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
            
            .sync-indicator {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                padding: 8px 16px;
                border-radius: 25px;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
            }
            
            .sync-indicator.online {
                background: linear-gradient(45deg, #10b981, #34d399);
                color: white;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            }
            
            .sync-indicator.offline {
                background: linear-gradient(45deg, #ef4444, #f87171);
                color: white;
                box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
            }
            
            /* Enhanced Mobile-Responsive Design */
            @media (max-width: 768px) {
                body { padding: 0; margin: 0; }
                .container { padding-left: 8px; padding-right: 8px; }
                .feature-card { margin: 6px 0; padding: 12px !important; }
                .grid { grid-template-columns: 1fr !important; gap: 8px !important; }
            }
            
            .section { display: none; }
            .section.active { display: block; }
        </style>
    </head>

    <body class="text-gray-800">
        <!-- Sync Status Indicator -->
        <div id="sync-status" class="sync-indicator offline">
            <i class="fas fa-wifi mr-2"></i>
            <span id="sync-text">جاري الاتصال...</span>
        </div>

        <!-- Navigation -->
        <nav class="bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <!-- Logo -->
                    <div class="flex items-center space-x-4 space-x-reverse">
                        <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <i class="fas fa-users text-white text-lg"></i>
                        </div>
                        <div>
                            <h1 class="text-xl font-bold text-gray-800">تطبيق آل سعيدان</h1>
                            <p class="text-xs text-blue-600">مع المزامنة الفورية</p>
                        </div>
                    </div>

                    <!-- Desktop Navigation -->
                    <div class="hidden md:flex items-center space-x-6 space-x-reverse">
                        <a href="#dashboard" class="nav-item px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-100 active" onclick="showSection('dashboard')">
                            <i class="fas fa-tachometer-alt ml-2"></i>لوحة التحكم
                        </a>
                        <a href="#family" class="nav-item px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-100" onclick="showSection('family')">
                            <i class="fas fa-users ml-2"></i>شجرة العائلة
                        </a>
                        <a href="#events" class="nav-item px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-100" onclick="showSection('events')">
                            <i class="fas fa-calendar-alt ml-2"></i>الأحداث
                        </a>
                        <a href="#suggestions" class="nav-item px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-100" onclick="showSection('suggestions')">
                            <i class="fas fa-lightbulb ml-2"></i>الاقتراحات
                        </a>
                        <a href="#library" class="nav-item px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-100" onclick="showSection('library')">
                            <i class="fas fa-book ml-2"></i>المكتبة الرقمية
                        </a>
                        <a href="#users" class="nav-item px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-100" onclick="showSection('users')">
                            <i class="fas fa-user-cog ml-2"></i>إدارة المستخدمين
                        </a>
                        <a href="#sync-test" class="nav-item px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-100" onclick="showSection('sync-test')">
                            <i class="fas fa-sync-alt ml-2"></i>اختبار المزامنة
                        </a>
                        
                        <!-- زر الخروج -->
                        <button class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all" onclick="logout()">
                            <i class="fas fa-sign-out-alt ml-2"></i>تسجيل الخروج
                        </button>
                    </div>

                    <!-- Mobile menu button -->
                    <button id="mobile-menu-button" class="md:hidden p-2 rounded-lg hover:bg-gray-100">
                        <i class="fas fa-bars text-gray-600"></i>
                    </button>
                </div>

                <!-- Mobile Navigation -->
                <div id="mobile-menu" class="hidden md:hidden py-4 border-t border-gray-200">
                    <div class="space-y-2">
                        <a href="#dashboard" class="nav-item-mobile block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 active" onclick="showSection('dashboard')">
                            <i class="fas fa-tachometer-alt ml-2"></i>لوحة التحكم
                        </a>
                        <a href="#family" class="nav-item-mobile block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100" onclick="showSection('family')">
                            <i class="fas fa-users ml-2"></i>شجرة العائلة
                        </a>
                        <a href="#events" class="nav-item-mobile block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100" onclick="showSection('events')">
                            <i class="fas fa-calendar-alt ml-2"></i>الأحداث
                        </a>
                        <a href="#suggestions" class="nav-item-mobile block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100" onclick="showSection('suggestions')">
                            <i class="fas fa-lightbulb ml-2"></i>الاقتراحات
                        </a>
                        <a href="#library" class="nav-item-mobile block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100" onclick="showSection('library')">
                            <i class="fas fa-book ml-2"></i>المكتبة الرقمية
                        </a>
                        <a href="#users" class="nav-item-mobile block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100" onclick="showSection('users')">
                            <i class="fas fa-user-cog ml-2"></i>إدارة المستخدمين
                        </a>
                        <a href="#sync-test" class="nav-item-mobile block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100" onclick="showSection('sync-test')">
                            <i class="fas fa-sync-alt ml-2"></i>اختبار المزامنة
                        </a>
                        
                        <!-- زر الخروج للموبايل -->
                        <button class="w-full text-left px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all mt-2" onclick="logout()">
                            <i class="fas fa-sign-out-alt ml-2"></i>تسجيل الخروج
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="container mx-auto px-4 py-8">
            
            <!-- Dashboard Section -->
            <section id="dashboard-section" class="section active">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-white mb-4">🚀 مرحباً بك في تطبيق آل سعيدان</h2>
                    <p class="text-xl text-gray-200">إدارة شاملة للعائلة مع المزامنة الفورية</p>
                </div>

                <!-- Quick Stats -->
                <div class="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                    <div class="feature-card rounded-xl p-6 text-center">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-users text-blue-600 text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">
                            <span id="family-count">17</span>
                        </h3>
                        <p class="text-gray-600">أعضاء العائلة</p>
                    </div>
                    
                    <div class="feature-card rounded-xl p-6 text-center">
                        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-calendar-alt text-green-600 text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">
                            <span id="events-count">0</span>
                        </h3>
                        <p class="text-gray-600">الأحداث</p>
                    </div>
                    
                    <div class="feature-card rounded-xl p-6 text-center">
                        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-lightbulb text-yellow-600 text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">
                            <span id="suggestions-count">0</span>
                        </h3>
                        <p class="text-gray-600">الاقتراحات</p>
                    </div>
                    
                    <div class="feature-card rounded-xl p-6 text-center">
                        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-book text-purple-600 text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">
                            <span id="library-count">0</span>
                        </h3>
                        <p class="text-gray-600">المكتبة</p>
                    </div>
                    
                    <div class="feature-card rounded-xl p-6 text-center">
                        <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-sync-alt text-indigo-600 text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">فوري</h3>
                        <p class="text-gray-600">المزامنة</p>
                    </div>
                    
                    <div class="feature-card rounded-xl p-6 text-center">
                        <div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-database text-pink-600 text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">D1</h3>
                        <p class="text-gray-600">قاعدة البيانات</p>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="feature-card rounded-xl p-8">
                        <h3 class="text-2xl font-bold mb-4 text-gray-800">
                            <i class="fas fa-user-plus text-blue-600 ml-2"></i>
                            إدارة أعضاء العائلة
                        </h3>
                        <p class="text-gray-600 mb-6">إضافة وتعديل وإدارة بيانات أعضاء العائلة مع المزامنة الفورية</p>
                        <button onclick="showSection('family')" class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all">
                            <i class="fas fa-arrow-left ml-2"></i>
                            إدارة العائلة
                        </button>
                    </div>

                    <div class="feature-card rounded-xl p-8">
                        <h3 class="text-2xl font-bold mb-4 text-gray-800">
                            <i class="fas fa-calendar-plus text-green-600 ml-2"></i>
                            إدارة الأحداث
                        </h3>
                        <p class="text-gray-600 mb-6">تنظيم الفعاليات والمناسبات العائلية ومتابعة الحضور</p>
                        <button onclick="showSection('events')" class="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all">
                            <i class="fas fa-arrow-left ml-2"></i>
                            إدارة الأحداث
                        </button>
                    </div>

                    <div class="feature-card rounded-xl p-8">
                        <h3 class="text-2xl font-bold mb-4 text-gray-800">
                            <i class="fas fa-vote-yea text-yellow-600 ml-2"></i>
                            الاقتراحات والتصويت
                        </h3>
                        <p class="text-gray-600 mb-6">تقديم الاقتراحات والتصويت على القرارات المهمة للعائلة</p>
                        <button onclick="showSection('suggestions')" class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all">
                            <i class="fas fa-arrow-left ml-2"></i>
                            عرض الاقتراحات
                        </button>
                    </div>

                    <div class="feature-card rounded-xl p-8">
                        <h3 class="text-2xl font-bold mb-4 text-gray-800">
                            <i class="fas fa-folder-open text-purple-600 ml-2"></i>
                            المكتبة الرقمية
                        </h3>
                        <p class="text-gray-600 mb-6">حفظ وإدارة الوثائق والصور والملفات المهمة للعائلة</p>
                        <button onclick="showSection('library')" class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-all">
                            <i class="fas fa-arrow-left ml-2"></i>
                            المكتبة الرقمية
                        </button>
                    </div>

                    <div class="feature-card rounded-xl p-8">
                        <h3 class="text-2xl font-bold mb-4 text-gray-800">
                            <i class="fas fa-vial text-indigo-600 ml-2"></i>
                            اختبار المزامنة
                        </h3>
                        <p class="text-gray-600 mb-6">تجربة وفحص نظام المزامنة الفورية وقاعدة البيانات</p>
                        <button onclick="showSection('sync-test')" class="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-blue-600 transition-all">
                            <i class="fas fa-arrow-left ml-2"></i>
                            اختبار النظام
                        </button>
                    </div>
                </div>
            </section>

            <!-- Family Section -->
            <section id="family-section" class="section">
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-3xl font-bold text-gray-800">
                            <i class="fas fa-users text-blue-600 ml-2"></i>
                            شجرة العائلة
                        </h2>
                        <div class="flex space-x-2 space-x-reverse">
                            <button onclick="addTestMember()" class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all">
                                <i class="fas fa-user-plus ml-2"></i>إضافة عضو
                            </button>
                            <button onclick="refreshFamilyData()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all">
                                <i class="fas fa-sync-alt ml-2"></i>تحديث
                            </button>
                        </div>
                    </div>

                    <!-- Loading -->
                    <div id="family-loading" class="text-center py-12">
                        <div class="loading-spinner mx-auto mb-4"></div>
                        <p class="text-gray-600">جاري تحميل شجرة العائلة...</p>
                    </div>

                    <!-- Family Tree -->
                    <div id="family-tree" class="hidden">
                        <div id="family-content">
                            <!-- سيتم ملء هذا القسم ديناميكياً -->
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div id="family-empty" class="hidden text-center py-12">
                        <i class="fas fa-users text-gray-400 text-6xl mb-4"></i>
                        <h3 class="text-xl font-bold text-gray-600 mb-2">لا توجد أعضاء في العائلة</h3>
                        <p class="text-gray-500 mb-6">ابدأ بإضافة أول عضو في شجرة العائلة</p>
                        <button onclick="addTestMember()" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all">
                            <i class="fas fa-plus ml-2"></i>إضافة عضو تجريبي
                        </button>
                    </div>
                </div>
            </section>

            <!-- Events Section -->
            <section id="events-section" class="section">
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-3xl font-bold text-gray-800">
                            <i class="fas fa-calendar-alt text-green-600 ml-2"></i>
                            الأحداث والفعاليات
                        </h2>
                        <button onclick="addTestEvent()" class="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all">
                            <i class="fas fa-plus ml-2"></i>إضافة حدث
                        </button>
                    </div>
                    
                    <!-- Events Display Area -->
                    <div id="events-container">
                        <!-- Loading State -->
                        <div id="events-loading" class="text-center py-12">
                            <div class="loading-spinner mx-auto mb-4"></div>
                            <p class="text-gray-500">جاري تحميل الأحداث...</p>
                        </div>
                        
                        <!-- Events List -->
                        <div id="events-list" class="hidden space-y-4"></div>
                        
                        <!-- Empty State -->
                        <div id="events-empty" class="hidden text-center py-12">
                            <i class="fas fa-calendar-plus text-gray-400 text-6xl mb-4"></i>
                            <h3 class="text-xl font-bold text-gray-600 mb-2">لا توجد أحداث حالياً</h3>
                            <p class="text-gray-500 mb-6">ابدأ بإضافة أول حدث للعائلة</p>
                            <button onclick="addTestEvent()" class="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all">
                                <i class="fas fa-plus ml-2"></i>إضافة حدث جديد
                            </button>
                        </div>
                    </div>
                    
                    <!-- Events Statistics -->
                    <div id="events-stats" class="hidden mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-blue-600" id="total-events">0</div>
                            <div class="text-sm text-blue-700">إجمالي الأحداث</div>
                        </div>
                        <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-green-600" id="upcoming-events">0</div>
                            <div class="text-sm text-green-700">أحداث قادمة</div>
                        </div>
                        <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-yellow-600" id="this-month-events">0</div>
                            <div class="text-sm text-yellow-700">هذا الشهر</div>
                        </div>
                        <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-purple-600" id="high-priority-events">0</div>
                            <div class="text-sm text-purple-700">أولوية عالية</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Suggestions Section -->
            <section id="suggestions-section" class="section">
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-3xl font-bold text-gray-800">
                            <i class="fas fa-lightbulb text-yellow-600 ml-2"></i>
                            الاقتراحات والتصويت
                        </h2>
                        <button onclick="addTestSuggestion()" class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all">
                            <i class="fas fa-plus ml-2"></i>إضافة اقتراح
                        </button>
                    </div>
                    
                    <!-- Suggestions Display Area -->
                    <div id="suggestions-container">
                        <!-- Loading State -->
                        <div id="suggestions-loading" class="text-center py-12">
                            <div class="loading-spinner mx-auto mb-4"></div>
                            <p class="text-gray-500">جاري تحميل الاقتراحات...</p>
                        </div>
                        
                        <!-- Suggestions List -->
                        <div id="suggestions-list" class="hidden space-y-4"></div>
                        
                        <!-- Empty State -->
                        <div id="suggestions-empty" class="hidden text-center py-12">
                            <i class="fas fa-vote-yea text-gray-400 text-6xl mb-4"></i>
                            <h3 class="text-xl font-bold text-gray-600 mb-2">لا توجد اقتراحات حالياً</h3>
                            <p class="text-gray-500 mb-6">ابدأ بتقديم أول اقتراح للعائلة</p>
                            <button onclick="addTestSuggestion()" class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all">
                                <i class="fas fa-plus ml-2"></i>إضافة اقتراح جديد
                            </button>
                        </div>
                    </div>
                    
                    <!-- Suggestions Statistics -->
                    <div id="suggestions-stats" class="hidden mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-yellow-600" id="total-suggestions">0</div>
                            <div class="text-sm text-yellow-700">إجمالي الاقتراحات</div>
                        </div>
                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-blue-600" id="pending-suggestions">0</div>
                            <div class="text-sm text-blue-700">معلقة</div>
                        </div>
                        <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-green-600" id="approved-suggestions">0</div>
                            <div class="text-sm text-green-700">موافق عليها</div>
                        </div>
                        <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-orange-600" id="high-priority-suggestions">0</div>
                            <div class="text-sm text-orange-700">أولوية عالية</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Library Section -->
            <section id="library-section" class="section">
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-3xl font-bold text-gray-800">
                            <i class="fas fa-book text-purple-600 ml-2"></i>
                            المكتبة الرقمية
                        </h2>
                        <button onclick="addTestLibraryItem()" class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all">
                            <i class="fas fa-plus ml-2"></i>إضافة وثيقة
                        </button>
                    </div>
                    
                    <!-- Library Display Area -->
                    <div id="library-container">
                        <!-- Loading State -->
                        <div id="library-loading" class="text-center py-12">
                            <div class="loading-spinner mx-auto mb-4"></div>
                            <p class="text-gray-500">جاري تحميل المكتبة الرقمية...</p>
                        </div>
                        
                        <!-- Library List -->
                        <div id="library-list" class="hidden space-y-4"></div>
                        
                        <!-- Empty State -->
                        <div id="library-empty" class="hidden text-center py-12">
                            <i class="fas fa-folder-open text-gray-400 text-6xl mb-4"></i>
                            <h3 class="text-xl font-bold text-gray-600 mb-2">المكتبة فارغة حالياً</h3>
                            <p class="text-gray-500 mb-6">ابدأ بإضافة أول وثيقة للمكتبة</p>
                            <button onclick="addTestLibraryItem()" class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all">
                                <i class="fas fa-plus ml-2"></i>إضافة وثيقة جديدة
                            </button>
                        </div>
                    </div>
                    
                    <!-- Library Statistics -->
                    <div id="library-stats" class="hidden mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-purple-600" id="total-library">0</div>
                            <div class="text-sm text-purple-700">إجمالي العناصر</div>
                        </div>
                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-blue-600" id="documents-count">0</div>
                            <div class="text-sm text-blue-700">وثائق</div>
                        </div>
                        <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-green-600" id="images-count">0</div>
                            <div class="text-sm text-green-700">صور</div>
                        </div>
                        <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-yellow-600" id="featured-count">0</div>
                            <div class="text-sm text-yellow-700">مميزة</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Sync Test Section -->
            <section id="sync-test-section" class="section">
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <h2 class="text-3xl font-bold mb-6 text-gray-800">
                        <i class="fas fa-vial text-green-600 ml-2"></i>
                        اختبار نظام المزامنة الفورية
                    </h2>
                    
                    <div class="grid md:grid-cols-2 gap-6 mb-8">
                        <!-- Test Controls -->
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold text-gray-700 mb-4">عمليات الاختبار</h3>
                            
                            <button onclick="testDatabase()" class="w-full bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-all text-right">
                                <i class="fas fa-database ml-2"></i>
                                اختبار قاعدة البيانات
                            </button>
                            
                            <button onclick="testFamilyMembers()" class="w-full bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-all text-right">
                                <i class="fas fa-users ml-2"></i>
                                اختبار أعضاء العائلة
                            </button>
                            
                            <button onclick="testSync()" class="w-full bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-all text-right">
                                <i class="fas fa-sync-alt ml-2"></i>
                                اختبار المزامنة
                            </button>
                            
                            <button onclick="showSyncStats()" class="w-full bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 transition-all text-right">
                                <i class="fas fa-chart-line ml-2"></i>
                                إحصائيات المزامنة
                            </button>
                            
                            <button onclick="clearTestResults()" class="w-full bg-gray-500 text-white p-4 rounded-lg hover:bg-gray-600 transition-all text-right">
                                <i class="fas fa-eraser ml-2"></i>
                                مسح النتائج
                            </button>
                        </div>
                        
                        <!-- Sync Status -->
                        <div class="bg-gray-50 p-6 rounded-lg">
                            <h3 class="text-xl font-bold text-gray-700 mb-4">حالة المزامنة</h3>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">حالة الاتصال:</span>
                                    <span id="connection-status-text" class="font-medium text-red-600">غير متصل</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">آخر مزامنة:</span>
                                    <span id="last-sync-time" class="font-medium text-gray-800">لم تتم بعد</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">عمليات مؤجلة:</span>
                                    <span id="pending-operations" class="font-medium text-gray-800">0</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Test Results -->
                    <div class="bg-gray-50 rounded-lg p-6">
                        <h3 class="text-xl font-bold mb-4 text-gray-700">نتائج الاختبار</h3>
                        <div id="test-output" class="bg-black text-green-400 p-4 rounded-lg text-sm font-mono h-64 overflow-y-auto">
                            [النظام] انقر على أحد الأزرار أعلاه لبدء الاختبار...
                        </div>
                    </div>
                </div>
            </section>

            <!-- Users Management Section -->
            <section id="users-section" class="section">
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <div class="flex items-center justify-between mb-8">
                        <h2 class="text-3xl font-bold text-gray-800">
                            <i class="fas fa-user-cog text-blue-600 ml-2"></i>
                            إدارة المستخدمين والصلاحيات
                        </h2>
                        
                        <!-- User Controls -->
                        <div class="flex space-x-3 space-x-reverse">
                            <button onclick="refreshUsers()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                <i class="fas fa-sync-alt ml-1"></i> تحديث
                            </button>
                            <button onclick="exportUsers()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                                <i class="fas fa-download ml-1"></i> تصدير
                            </button>
                        </div>
                    </div>
                    
                    <!-- User Stats -->
                    <div class="grid md:grid-cols-4 gap-6 mb-8">
                        <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-blue-600 text-sm font-medium">إجمالي المستخدمين</p>
                                    <p class="text-2xl font-bold text-blue-800" id="total-users">0</p>
                                </div>
                                <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                    <i class="fas fa-users text-white"></i>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-green-600 text-sm font-medium">المستخدمين النشطين</p>
                                    <p class="text-2xl font-bold text-green-800" id="active-users">0</p>
                                </div>
                                <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                    <i class="fas fa-user-check text-white"></i>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-yellow-600 text-sm font-medium">طلبات الانضمام</p>
                                    <p class="text-2xl font-bold text-yellow-800" id="pending-users">0</p>
                                </div>
                                <div class="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                                    <i class="fas fa-user-clock text-white"></i>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-purple-600 text-sm font-medium">المديرين</p>
                                    <p class="text-2xl font-bold text-purple-800" id="admin-users">0</p>
                                </div>
                                <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                                    <i class="fas fa-user-shield text-white"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Users Table -->
                    <div class="bg-gray-50 rounded-lg overflow-hidden">
                        <div class="p-4 bg-gray-100 border-b">
                            <h3 class="text-lg font-semibold text-gray-800">قائمة المستخدمين</h3>
                        </div>
                        
                        <!-- Loading State -->
                        <div id="users-loading" class="p-8 text-center">
                            <div class="loading-spinner mx-auto mb-4"></div>
                            <p class="text-gray-600">جاري تحميل المستخدمين...</p>
                        </div>
                        
                        <!-- Users Table -->
                        <div id="users-table" class="hidden">
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead class="bg-gray-200">
                                        <tr class="text-right">
                                            <th class="px-4 py-3 text-sm font-semibold text-gray-700">الاسم الكامل</th>
                                            <th class="px-4 py-3 text-sm font-semibold text-gray-700">البريد الإلكتروني</th>
                                            <th class="px-4 py-3 text-sm font-semibold text-gray-700">الدور</th>
                                            <th class="px-4 py-3 text-sm font-semibold text-gray-700">الحالة</th>
                                            <th class="px-4 py-3 text-sm font-semibold text-gray-700">تاريخ التسجيل</th>
                                            <th class="px-4 py-3 text-sm font-semibold text-gray-700">إجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody id="users-tbody" class="divide-y divide-gray-200">
                                        <!-- Users will be loaded here -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <!-- Empty State -->
                        <div id="users-empty" class="hidden p-8 text-center">
                            <i class="fas fa-users text-4xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600">لا توجد مستخدمين مسجلين بعد</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Scripts -->
        <script src="/static/app.js"></script>
        
        <script>
            // ================= إدارة الأقسام =================
            
            function showSection(sectionName) {
                // إخفاء جميع الأقسام
                document.querySelectorAll('.section').forEach(section => {
                    section.classList.remove('active');
                });
                
                // إظهار القسم المطلوب
                const targetSection = document.getElementById(sectionName + '-section');
                if (targetSection) {
                    targetSection.classList.add('active');
                }
                
                // تحديث التنقل
                updateNavigation(sectionName);
                
                // تحميل بيانات القسم
                if (sectionName === 'family') {
                    loadFamilyData();
                } else if (sectionName === 'dashboard') {
                    loadDashboardStats();
                } else if (sectionName === 'users') {
                    loadUsersData();
                } else if (sectionName === 'events') {
                    loadEventsData();
                } else if (sectionName === 'suggestions') {
                    loadSuggestionsData();
                } else if (sectionName === 'library') {
                    loadLibraryData();
                }
            }
            
            function updateNavigation(activeSection) {
                document.querySelectorAll('.nav-item, .nav-item-mobile').forEach(item => {
                    item.classList.remove('active');
                });
                
                document.querySelectorAll('[href="#' + activeSection + '"]').forEach(item => {
                    item.classList.add('active');
                });
                
                // إخفاء القائمة المحمولة
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            }

            // ================= إدارة البيانات =================
            
            async function loadDashboardStats() {
                try {
                    if (typeof dbManager !== 'undefined') {
                        const members = await dbManager.getFamilyMembers();
                        const familyCountEl = document.getElementById('family-count');
                        if (familyCountEl) {
                            familyCountEl.textContent = members.length;
                        }
                    }
                } catch (error) {
                    console.error('خطأ في تحميل الإحصائيات:', error);
                    const familyCountEl = document.getElementById('family-count');
                    if (familyCountEl) {
                        familyCountEl.textContent = '؟';
                    }
                }
            }
            
            // وظيفة loadFamilyData محددة في JavaScript الخارجي
            
            function displayFamilyMembers(members) {
                const content = document.getElementById('family-content');
                if (!content) return;
                
                let html = '<div class="grid gap-4">';
                
                members.forEach(member => {
                    html += \`
                        <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                            <div class="flex items-center justify-between">
                                <div class="flex-1">
                                    <h4 class="text-lg font-bold text-gray-800">\${member.full_name}</h4>
                                    <p class="text-gray-600">الجيل \${member.generation}</p>
                                    \${member.profession ? '<p class="text-blue-600 text-sm mt-1"><i class="fas fa-star mr-1"></i>' + member.profession + '</p>' : ''}
                                    \${member.phone ? '<p class="text-gray-500 text-sm"><i class="fas fa-phone mr-1"></i>' + member.phone + '</p>' : ''}
                                    \${member.email ? '<p class="text-gray-500 text-sm"><i class="fas fa-envelope mr-1"></i>' + member.email + '</p>' : ''}
                                </div>
                                <div class="text-center">
                                    <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                        عضو عائلة
                                    </span>
                                </div>
                            </div>
                        </div>
                    \`;
                });
                
                html += '</div>';
                content.innerHTML = html;
            }
            
            async function addTestMember() {
                try {
                    if (typeof dbManager !== 'undefined') {
                        const testMember = {
                            full_name: 'عضو تجريبي ' + Math.floor(Math.random() * 1000),
                            generation: Math.floor(Math.random() * 3) + 1,
                            phone: '05' + Math.floor(Math.random() * 100000000),
                            email: 'test' + Math.floor(Math.random() * 1000) + '@example.com'
                        };
                        
                        await dbManager.createFamilyMember(testMember);
                        showNotification('تم إضافة عضو تجريبي بنجاح!', 'success');
                        
                        // إعادة تحميل البيانات
                        setTimeout(loadFamilyData, 1000);
                        setTimeout(loadDashboardStats, 1000);
                    }
                } catch (error) {
                    console.error('خطأ في إضافة العضو التجريبي:', error);
                    showNotification('خطأ في إضافة العضو: ' + error.message, 'error');
                }
            }
            
            // نافذة إضافة حدث متكاملة محسنة
            function addTestEvent() {
                console.log('🎯 تم النقر على زر إضافة حدث');
                createAdvancedEventModal();
            }
            
            function openAdvancedEventModal() {
                console.log('🎯 فتح النافذة المتقدمة');
                createAdvancedEventModal();
            }
            
            // نافذة إضافة الحدث التفاعلية الجديدة
            function createAdvancedEventModal() {
                showSimpleAlert('فتح نافذة إضافة الحدث...', 'info');
                
                // إنشاء النافذة المنبثقة
                const modalHtml = \`
                    <div id="eventModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="direction: rtl;">
                        <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div class="flex justify-between items-center mb-6">
                                <h2 class="text-2xl font-bold text-gray-800">
                                    <i class="fas fa-calendar-plus ml-2 text-green-600"></i>
                                    إضافة حدث جديد
                                </h2>
                                <button onclick="closeEventModal()" class="text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-times text-xl"></i>
                                </button>
                            </div>
                            
                            <form id="eventForm" class="space-y-4">
                                <!-- معلومات الحدث الأساسية -->
                                <div class="bg-blue-50 p-4 rounded-lg">
                                    <h3 class="font-semibold text-blue-800 mb-3">
                                        <i class="fas fa-info-circle ml-1"></i>
                                        المعلومات الأساسية
                                    </h3>
                                    
                                    <div class="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">اسم الحدث *</label>
                                            <input type="text" id="eventTitle" required 
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                                   placeholder="مثال: اجتماع العائلة الشهري">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">نوع الحدث *</label>
                                            <select id="eventType" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                                <option value="">اختر نوع الحدث</option>
                                                <option value="meeting">اجتماع عائلي</option>
                                                <option value="celebration">احتفال ومناسبة</option>
                                                <option value="educational">فعالية تعليمية</option>
                                                <option value="recreational">فعالية ترفيهية</option>
                                                <option value="business">فعالية تجارية</option>
                                                <option value="religious">مناسبة دينية</option>
                                                <option value="general">عام</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="grid md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">تاريخ الحدث *</label>
                                            <input type="date" id="eventDate" required 
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">وقت الحدث</label>
                                            <input type="time" id="eventTime" value="19:00" 
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                        </div>
                                    </div>
                                    
                                    <div class="mt-4">
                                        <label class="block text-gray-700 font-medium mb-1">موقع الحدث</label>
                                        <input type="text" id="eventLocation" 
                                               class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                               placeholder="مثال: مجلس الرياض، قاعة الملتقى">
                                    </div>
                                    
                                    <div class="mt-4">
                                        <label class="block text-gray-700 font-medium mb-1">وصف الحدث</label>
                                        <textarea id="eventDescription" rows="3" 
                                                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                                  placeholder="اكتب تفاصيل الحدث وأهدافه..."></textarea>
                                    </div>
                                </div>
                                
                                <!-- تفاصيل التنظيم -->
                                <div class="bg-green-50 p-4 rounded-lg">
                                    <h3 class="font-semibold text-green-800 mb-3">
                                        <i class="fas fa-user-cog ml-1"></i>
                                        تفاصيل التنظيم
                                    </h3>
                                    
                                    <div class="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">منظم الحدث</label>
                                            <input type="text" id="organizerName" value="سلمان السعيدان" 
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">هاتف المنظم</label>
                                            <input type="tel" id="organizerPhone" value="0533361154" 
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                        </div>
                                    </div>
                                    
                                    <div class="grid md:grid-cols-3 gap-4 mt-4">
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">الحد الأقصى للحضور</label>
                                            <input type="number" id="maxAttendees" 
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                                   placeholder="مثال: 100">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">العدد المتوقع</label>
                                            <input type="number" id="expectedAttendees" 
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                                   placeholder="مثال: 50">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">التكلفة المتوقعة (ريال)</label>
                                            <input type="number" id="estimatedCost" step="0.01" 
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                                   placeholder="مثال: 5000">
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- إعدادات إضافية -->
                                <div class="bg-yellow-50 p-4 rounded-lg">
                                    <h3 class="font-semibold text-yellow-800 mb-3">
                                        <i class="fas fa-cogs ml-1"></i>
                                        إعدادات إضافية
                                    </h3>
                                    
                                    <div class="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">أولوية الحدث</label>
                                            <select id="eventPriority" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                                <option value="low">منخفضة</option>
                                                <option value="medium" selected>متوسطة</option>
                                                <option value="high">عالية</option>
                                                <option value="urgent">عاجلة</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">متطلبات التسجيل</label>
                                            <select id="registrationRequired" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                                <option value="no">لا يتطلب</option>
                                                <option value="optional">اختياري</option>
                                                <option value="yes">مطلوب</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="mt-4">
                                        <label class="block text-gray-700 font-medium mb-1">ملاحظات إضافية</label>
                                        <textarea id="additionalNotes" rows="2" 
                                                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                                  placeholder="أي معلومات إضافية مهمة..."></textarea>
                                    </div>
                                </div>
                                
                                <!-- أزرار التحكم -->
                                <div class="flex justify-end space-x-3 space-x-reverse pt-4">
                                    <button type="button" onclick="closeEventModal()" 
                                            class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                                        <i class="fas fa-times ml-1"></i>
                                        إلغاء
                                    </button>
                                    <button type="submit" 
                                            class="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all">
                                        <i class="fas fa-plus ml-1"></i>
                                        إنشاء الحدث
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                \`;
                
                // إضافة النافذة للصفحة
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                
                // تعيين التاريخ الافتراضي لغداً
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                document.getElementById('eventDate').value = tomorrow.toISOString().split('T')[0];
                
                // معالج إرسال النموذج
                document.getElementById('eventForm').addEventListener('submit', submitEventForm);
            }
            
            // إغلاق نافذة الحدث
            function closeEventModal() {
                const modal = document.getElementById('eventModal');
                if (modal) {
                    modal.remove();
                }
            }
            
            // إرسال بيانات الحدث
            async function submitEventForm(e) {
                e.preventDefault();
                
                const submitBtn = e.target.querySelector('button[type=\"submit\"]');
                const originalText = submitBtn.innerHTML;
                
                // إظهار حالة التحميل
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class=\"fas fa-spinner fa-spin ml-1\"></i> جاري الحفظ...';
                
                try {
                    // جمع بيانات النموذج
                    const eventData = {
                        title: document.getElementById('eventTitle').value,
                        description: document.getElementById('eventDescription').value,
                        event_type: document.getElementById('eventType').value,
                        event_date: document.getElementById('eventDate').value + 'T' + document.getElementById('eventTime').value,
                        location: document.getElementById('eventLocation').value,
                        organizer_id: 'user_admin_001',
                        organizer_name: document.getElementById('organizerName').value,
                        organizer_phone: document.getElementById('organizerPhone').value,
                        max_attendees: document.getElementById('maxAttendees').value ? parseInt(document.getElementById('maxAttendees').value) : null,
                        expected_attendees: document.getElementById('expectedAttendees').value ? parseInt(document.getElementById('expectedAttendees').value) : null,
                        estimated_cost: document.getElementById('estimatedCost').value ? parseFloat(document.getElementById('estimatedCost').value) : null,
                        priority: document.getElementById('eventPriority').value,
                        registration_required: document.getElementById('registrationRequired').value,
                        additional_notes: document.getElementById('additionalNotes').value,
                        status: 'planned'
                    };
                    
                    // إرسال البيانات
                    const response = await fetch('/api/events', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(eventData)
                    });
                    
                    const result = await response.json();
                    
                    if (result.status === 'success') {
                        showSimpleAlert('✅ تم إنشاء الحدث بنجاح! 🎉', 'success');
                        closeEventModal();
                        
                        // إعادة تحميل البيانات
                        if (typeof loadEventsData === 'function') {
                            setTimeout(loadEventsData, 500);
                        }
                        if (typeof loadFamilyData === 'function') {
                            setTimeout(loadFamilyData, 1000);
                        }
                        if (typeof loadDashboardStats === 'function') {
                            setTimeout(loadDashboardStats, 1000);
                        }
                    } else {
                        showSimpleAlert('❌ حدث خطأ: ' + (result.message || result.error || 'خطأ غير معروف'), 'error');
                    }
                } catch (error) {
                    console.error('خطأ في إنشاء الحدث:', error);
                    showSimpleAlert('❌ خطأ في الاتصال: ' + error.message, 'error');
                } finally {
                    // إعادة تعيين الزر
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }
            
            // تحميل وعرض الأحداث
            async function loadEventsData() {
                try {
                    // إظهار حالة التحميل
                    const loadingEl = document.getElementById('events-loading');
                    const listEl = document.getElementById('events-list');
                    const emptyEl = document.getElementById('events-empty');
                    const statsEl = document.getElementById('events-stats');
                    
                    if (loadingEl) loadingEl.classList.remove('hidden');
                    if (listEl) listEl.classList.add('hidden');
                    if (emptyEl) emptyEl.classList.add('hidden');
                    if (statsEl) statsEl.classList.add('hidden');
                    
                    // جلب البيانات من API
                    const response = await fetch('/api/events');
                    const result = await response.json();
                    
                    if (result.status === 'success' && result.data) {
                        const events = result.data;
                        
                        // إخفاء حالة التحميل
                        if (loadingEl) loadingEl.classList.add('hidden');
                        
                        if (events.length === 0) {
                            // عرض حالة فارغة
                            if (emptyEl) emptyEl.classList.remove('hidden');
                        } else {
                            // عرض قائمة الأحداث
                            if (listEl) {
                                listEl.innerHTML = '';
                                events.forEach(event => {
                                    listEl.appendChild(createEventCard(event));
                                });
                                listEl.classList.remove('hidden');
                            }
                            
                            // تحديث الإحصائيات
                            updateEventsStats(events);
                            if (statsEl) statsEl.classList.remove('hidden');
                        }
                    } else {
                        throw new Error(result.message || 'خطأ في جلب البيانات');
                    }
                } catch (error) {
                    console.error('خطأ في تحميل الأحداث:', error);
                    
                    // إخفاء التحميل وإظهار رسالة خطأ
                    const loadingEl = document.getElementById('events-loading');
                    if (loadingEl) {
                        loadingEl.innerHTML = \`
                            <div class="text-center py-12">
                                <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                                <p class="text-red-600 font-semibold">خطأ في تحميل الأحداث</p>
                                <p class="text-gray-500 text-sm mt-1">\${error.message}</p>
                                <button onclick="loadEventsData()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                    <i class="fas fa-redo ml-1"></i>إعادة المحاولة
                                </button>
                            </div>
                        \`;
                    }
                }
            }
            
            // إنشاء بطاقة حدث
            function createEventCard(event) {
                const card = document.createElement('div');
                card.className = 'bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all';
                
                // تحديد لون الأولوية
                const priorityColors = {
                    'low': 'text-gray-500 bg-gray-100',
                    'medium': 'text-blue-600 bg-blue-100', 
                    'high': 'text-orange-600 bg-orange-100',
                    'urgent': 'text-red-600 bg-red-100'
                };
                
                const priorityLabels = {
                    'low': 'منخفضة',
                    'medium': 'متوسطة',
                    'high': 'عالية', 
                    'urgent': 'عاجلة'
                };
                
                // تحديد أيقونة النوع
                const typeIcons = {
                    'meeting': 'fas fa-users',
                    'celebration': 'fas fa-birthday-cake',
                    'educational': 'fas fa-graduation-cap',
                    'recreational': 'fas fa-gamepad',
                    'business': 'fas fa-briefcase',
                    'religious': 'fas fa-mosque',
                    'general': 'fas fa-calendar'
                };
                
                const typeLabels = {
                    'meeting': 'اجتماع عائلي',
                    'celebration': 'احتفال ومناسبة',
                    'educational': 'فعالية تعليمية',
                    'recreational': 'فعالية ترفيهية',
                    'business': 'فعالية تجارية',
                    'religious': 'مناسبة دينية',
                    'general': 'عام'
                };
                
                // تنسيق التاريخ
                const eventDate = new Date(event.event_date);
                const formattedDate = eventDate.toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                });
                const formattedTime = eventDate.toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                card.innerHTML = \`
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-gray-800 mb-2">
                                <i class="\${typeIcons[event.event_type] || 'fas fa-calendar'} text-green-600 ml-2"></i>
                                \${event.title || 'حدث بدون عنوان'}
                            </h3>
                            <p class="text-gray-600 text-sm">\${typeLabels[event.event_type] || 'نوع غير محدد'}</p>
                        </div>
                        <div class="text-left">
                            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold \${priorityColors[event.priority] || priorityColors['medium']}">
                                \${priorityLabels[event.priority] || 'متوسطة'}
                            </span>
                        </div>
                    </div>
                    
                    <div class="space-y-3 mb-4">
                        <div class="flex items-center text-gray-600">
                            <i class="fas fa-calendar-day text-blue-500 ml-3 w-5"></i>
                            <span class="font-medium">\${formattedDate}</span>
                        </div>
                        <div class="flex items-center text-gray-600">
                            <i class="fas fa-clock text-green-500 ml-3 w-5"></i>
                            <span>\${formattedTime}</span>
                        </div>
                        \${event.location ? \`
                            <div class="flex items-center text-gray-600">
                                <i class="fas fa-map-marker-alt text-red-500 ml-3 w-5"></i>
                                <span>\${event.location}</span>
                            </div>
                        \` : ''}
                        \${event.organizer_name ? \`
                            <div class="flex items-center text-gray-600">
                                <i class="fas fa-user-tie text-purple-500 ml-3 w-5"></i>
                                <span>المنظم: \${event.organizer_name}</span>
                                \${event.organizer_phone ? \`<span class="text-gray-500 mr-2">(\${event.organizer_phone})</span>\` : ''}
                            </div>
                        \` : ''}
                    </div>
                    
                    \${event.description ? \`
                        <div class="bg-gray-50 rounded-lg p-3 mb-4">
                            <p class="text-gray-700 text-sm">\${event.description}</p>
                        </div>
                    \` : ''}
                    
                    <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div class="flex space-x-2 space-x-reverse">
                            \${event.max_attendees ? \`
                                <span class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                    <i class="fas fa-users ml-1"></i>
                                    حد أقصى: \${event.max_attendees}
                                </span>
                            \` : ''}
                            \${event.estimated_cost ? \`
                                <span class="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                    <i class="fas fa-money-bill ml-1"></i>
                                    \${event.estimated_cost} ريال
                                </span>
                            \` : ''}
                        </div>
                        <div class="flex space-x-2 space-x-reverse">
                            <button onclick="editEvent('\${event.id}')" class="text-blue-600 hover:text-blue-800 p-2 rounded">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteEvent('\${event.id}', '\${event.title}')" class="text-red-600 hover:text-red-800 p-2 rounded">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                \`;
                
                return card;
            }
            
            // تحديث إحصائيات الأحداث
            function updateEventsStats(events) {
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                
                // إجمالي الأحداث
                const totalEvents = events.length;
                
                // الأحداث القادمة
                const upcomingEvents = events.filter(event => {
                    const eventDate = new Date(event.event_date);
                    return eventDate > now;
                }).length;
                
                // أحداث هذا الشهر
                const thisMonthEvents = events.filter(event => {
                    const eventDate = new Date(event.event_date);
                    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
                }).length;
                
                // أحداث بأولوية عالية
                const highPriorityEvents = events.filter(event => 
                    event.priority === 'high' || event.priority === 'urgent'
                ).length;
                
                // تحديث العناصر
                const totalEl = document.getElementById('total-events');
                const upcomingEl = document.getElementById('upcoming-events');
                const thisMonthEl = document.getElementById('this-month-events');
                const highPriorityEl = document.getElementById('high-priority-events');
                
                if (totalEl) totalEl.textContent = totalEvents;
                if (upcomingEl) upcomingEl.textContent = upcomingEvents;
                if (thisMonthEl) thisMonthEl.textContent = thisMonthEvents;
                if (highPriorityEl) highPriorityEl.textContent = highPriorityEvents;
            }
            
            // حذف حدث
            async function deleteEvent(eventId, eventTitle) {
                if (!confirm(\`هل أنت متأكد من حذف الحدث "\${eventTitle}"؟\`)) {
                    return;
                }
                
                try {
                    const response = await fetch(\`/api/events/\${eventId}\`, {
                        method: 'DELETE'
                    });
                    
                    const result = await response.json();
                    
                    if (result.status === 'success') {
                        showSimpleAlert('تم حذف الحدث بنجاح', 'success');
                        loadEventsData();
                    } else {
                        showSimpleAlert('خطأ في حذف الحدث: ' + result.message, 'error');
                    }
                } catch (error) {
                    showSimpleAlert('خطأ في الاتصال: ' + error.message, 'error');
                }
            }
            
            // تعديل حدث (للمستقبل)
            function editEvent(eventId) {
                showSimpleAlert('وظيفة التعديل ستُضاف قريباً', 'info');
            }

            
            async function createSimpleEventForm() {
                // نموذج تفاعلي متقدم لإضافة الأحداث
                showSimpleAlert('بدء إنشاء حدث جديد...', 'info');
                
                // === معلومات الحدث الأساسية ===
                const title = prompt('🎯 اسم الحدث *:');
                if (!title) return;
                
                let eventType = prompt('📋 نوع الحدث *\\n\\n1. meeting (اجتماع عائلي)\\n2. celebration (احتفال ومناسبة)\\n3. educational (فعالية تعليمية)\\n4. recreational (فعالية ترفيهية)\\n5. business (فعالية تجارية)\\n6. religious (مناسبة دينية)\\n7. general (عام)\\n\\nاكتب الرقم أو النوع:');
                
                // تحويل الأرقام إلى أنواع
                const typeMapping = {
                    '1': 'meeting', '2': 'celebration', '3': 'educational',
                    '4': 'recreational', '5': 'business', '6': 'religious', '7': 'general'
                };
                eventType = typeMapping[eventType] || eventType || 'general';
                
                const eventDate = prompt('📅 تاريخ الحدث * (YYYY-MM-DD)\\nمثال: 2024-12-25:');
                if (!eventDate) {
                    showSimpleAlert('يجب إدخال تاريخ الحدث', 'error');
                    return;
                }
                
                const eventTime = prompt('🕐 وقت الحدث (HH:MM)\\nمثال: 19:00:') || '10:00';
                const location = prompt('📍 موقع الحدث:\\nمثال: مجلس الرياض، قاعة الملتقى:') || '';
                const description = prompt('📝 وصف الحدث:\\nاكتب تفاصيل الحدث وأهدافه:') || '';
                
                // === تفاصيل التنظيم والحضور ===
                const organizerName = prompt('👤 منظم الحدث:\\nاكتب اسم المنظم:') || '';
                const organizerPhone = prompt('📞 هاتف المنظم:\\nمثال: 0533361154:') || '';
                
                const maxAttendeesInput = prompt('👥 الحد الأقصى للحضور:\\nاكتب رقم أو اتركه فارغاً:');
                const maxAttendees = maxAttendeesInput ? parseInt(maxAttendeesInput) : null;
                
                const expectedAttendeesInput = prompt('📊 العدد المتوقع للحضور:\\nاكتب رقم أو اتركه فارغاً:');
                const expectedAttendees = expectedAttendeesInput ? parseInt(expectedAttendeesInput) : null;
                
                const estimatedCostInput = prompt('💰 التكلفة المتوقعة (ريال):\\nمثال: 1000 أو اتركه فارغاً:');
                const estimatedCost = estimatedCostInput ? parseFloat(estimatedCostInput) : null;
                
                let priority = prompt('🚩 أولوية الحدث:\\n\\n1. low (منخفضة)\\n2. medium (متوسطة)\\n3. high (عالية)\\n4. urgent (عاجلة)\\n\\nاكتب الرقم أو النوع:');
                const priorityMapping = {'1': 'low', '2': 'medium', '3': 'high', '4': 'urgent'};
                priority = priorityMapping[priority] || priority || 'medium';
                
                let registrationRequired = prompt('✅ متطلبات التسجيل:\\n\\n1. no (لا يتطلب)\\n2. yes (مطلوب)\\n3. optional (اختياري)\\n\\nاكتب الرقم أو النوع:');
                const regMapping = {'1': 'no', '2': 'yes', '3': 'optional'};
                registrationRequired = regMapping[registrationRequired] || registrationRequired || 'no';
                
                const additionalNotes = prompt('📋 ملاحظات إضافية:\\nأي معلومات إضافية مهمة:') || '';
                
                try {
                    const eventData = {
                        title: title,
                        description: description,
                        event_date: eventDate + 'T' + eventTime,
                        location: location,
                        event_type: eventType,
                        organizer_id: 'user_admin_001',
                        organizer_name: organizerName,
                        organizer_phone: organizerPhone,
                        expected_attendees: expectedAttendees,
                        max_attendees: maxAttendees,
                        estimated_cost: estimatedCost,
                        priority: priority,
                        status: 'planned',
                        registration_required: registrationRequired,
                        additional_notes: additionalNotes
                    };
                    
                    showSimpleAlert('جاري حفظ الحدث...', 'info');
                    
                    const response = await fetch('/api/events', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(eventData)
                    });
                    
                    const result = await response.json();
                    
                    if (result.status === 'success') {
                        showSimpleAlert('✅ تم إنشاء الحدث بنجاح! 🎉\\n\\nاسم الحدث: ' + title + '\\nالتاريخ: ' + eventDate + ' ' + eventTime + '\\nالموقع: ' + location, 'success');
                        // إعادة تحميل البيانات
                        if (typeof loadFamilyData === 'function') {
                            setTimeout(loadFamilyData, 1000);
                        }
                    } else {
                        showSimpleAlert('❌ حدث خطأ: ' + (result.message || result.error || 'خطأ غير معروف'), 'error');
                    }
                } catch (error) {
                    console.error('خطأ في إنشاء الحدث:', error);
                    showSimpleAlert('❌ خطأ في الاتصال: ' + error.message, 'error');
                }
            }

            
            function addTestSuggestion() {
                console.log('🎯 تم النقر على زر إضافة اقتراح');
                createAdvancedSuggestionModal();
            }
            
            // نافذة إضافة الاقتراح التفاعلية الجديدة
            function createAdvancedSuggestionModal() {
                showSimpleAlert('فتح نافذة إضافة الاقتراح...', 'info');
                
                // إنشاء النافذة المنبثقة
                const modalHtml = \`
                    <div id="suggestionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="direction: rtl;">
                        <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div class="flex justify-between items-center mb-6">
                                <h2 class="text-2xl font-bold text-gray-800">
                                    <i class="fas fa-lightbulb ml-2 text-yellow-600"></i>
                                    إضافة اقتراح جديد
                                </h2>
                                <button onclick="closeSuggestionModal()" class="text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-times text-xl"></i>
                                </button>
                            </div>
                            
                            <form id="suggestionForm" class="space-y-4">
                                <!-- معلومات الاقتراح الأساسية -->
                                <div class="bg-yellow-50 p-4 rounded-lg">
                                    <h3 class="font-semibold text-yellow-800 mb-3">
                                        <i class="fas fa-info-circle ml-1"></i>
                                        المعلومات الأساسية
                                    </h3>
                                    
                                    <div class="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">عنوان الاقتراح *</label>
                                            <input type="text" id="suggestionTitle" required 
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" 
                                                   placeholder="مثال: تطوير نظام التواصل العائلي">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">فئة الاقتراح *</label>
                                            <select id="suggestionCategory" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500">
                                                <option value="">اختر فئة الاقتراح</option>
                                                <option value="general">عام</option>
                                                <option value="events">الأحداث والفعاليات</option>
                                                <option value="communication">التواصل</option>
                                                <option value="technology">التكنولوجيا</option>
                                                <option value="education">التعليم</option>
                                                <option value="health">الصحة</option>
                                                <option value="finance">الأمور المالية</option>
                                                <option value="family_tree">شجرة العائلة</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="mt-4">
                                        <label class="block text-gray-700 font-medium mb-1">وصف الاقتراح *</label>
                                        <textarea id="suggestionDescription" rows="4" required
                                                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" 
                                                  placeholder="اشرح فكرة الاقتراح بالتفصيل وكيف يمكن أن يفيد العائلة..."></textarea>
                                    </div>
                                </div>
                                
                                <!-- الفوائد وتفاصيل التنفيذ -->
                                <div class="bg-green-50 p-4 rounded-lg">
                                    <h3 class="font-semibold text-green-800 mb-3">
                                        <i class="fas fa-star ml-1"></i>
                                        الفوائد والتنفيذ
                                    </h3>
                                    
                                    <div class="grid md:grid-cols-1 gap-4">
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">الفوائد المتوقعة</label>
                                            <textarea id="suggestionBenefits" rows="3"
                                                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" 
                                                      placeholder="ما هي الفوائد التي ستعود على العائلة من هذا الاقتراح؟"></textarea>
                                        </div>
                                        
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">تفاصيل التنفيذ</label>
                                            <textarea id="implementationDetails" rows="3"
                                                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" 
                                                      placeholder="كيف يمكن تنفيذ هذا الاقتراح؟ ما هي الخطوات المطلوبة؟"></textarea>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- التكاليف والموارد -->
                                <div class="bg-blue-50 p-4 rounded-lg">
                                    <h3 class="font-semibold text-blue-800 mb-3">
                                        <i class="fas fa-calculator ml-1"></i>
                                        التكاليف والموارد
                                    </h3>
                                    
                                    <div class="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">تقدير التكلفة (ريال)</label>
                                            <input type="number" id="budgetEstimate" step="0.01" 
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" 
                                                   placeholder="0">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">الوقت المتوقع</label>
                                            <input type="text" id="timelineEstimate" 
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" 
                                                   placeholder="مثال: 3 أشهر">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">الأولوية</label>
                                            <select id="suggestionPriority" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500">
                                                <option value="low">منخفضة</option>
                                                <option value="medium" selected>متوسطة</option>
                                                <option value="high">عالية</option>
                                                <option value="urgent">عاجلة</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="mt-4">
                                        <label class="block text-gray-700 font-medium mb-1">الموارد المطلوبة</label>
                                        <textarea id="requiredResources" rows="2"
                                                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" 
                                                  placeholder="ما هي الموارد البشرية أو المادية المطلوبة؟"></textarea>
                                    </div>
                                </div>
                                
                                <!-- أزرار التحكم -->
                                <div class="flex justify-end space-x-3 space-x-reverse pt-4">
                                    <button type="button" onclick="closeSuggestionModal()" 
                                            class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                                        <i class="fas fa-times ml-1"></i>
                                        إلغاء
                                    </button>
                                    <button type="submit" 
                                            class="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all">
                                        <i class="fas fa-lightbulb ml-1"></i>
                                        إضافة الاقتراح
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                \`;
                
                // إضافة النافذة للصفحة
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                
                // معالج إرسال النموذج
                document.getElementById('suggestionForm').addEventListener('submit', submitSuggestionForm);
            }
            
            // إغلاق نافذة الاقتراح
            function closeSuggestionModal() {
                const modal = document.getElementById('suggestionModal');
                if (modal) {
                    modal.remove();
                }
            }
            
            // إرسال بيانات الاقتراح
            async function submitSuggestionForm(e) {
                e.preventDefault();
                
                const submitBtn = e.target.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                // إظهار حالة التحميل
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin ml-1"></i> جاري الحفظ...';
                
                try {
                    // جمع بيانات النموذج
                    const suggestionData = {
                        title: document.getElementById('suggestionTitle').value,
                        description: document.getElementById('suggestionDescription').value,
                        category: document.getElementById('suggestionCategory').value,
                        priority: document.getElementById('suggestionPriority').value,
                        benefits: document.getElementById('suggestionBenefits').value,
                        implementation_details: document.getElementById('implementationDetails').value,
                        budget_estimate: document.getElementById('budgetEstimate').value ? parseFloat(document.getElementById('budgetEstimate').value) : null,
                        timeline_estimate: document.getElementById('timelineEstimate').value,
                        required_resources: document.getElementById('requiredResources').value,
                        submitted_by: 'سلمان السعيدان',
                        status: 'pending'
                    };
                    
                    // إرسال البيانات
                    const response = await fetch('/api/suggestions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(suggestionData)
                    });
                    
                    const result = await response.json();
                    
                    if (result.status === 'success') {
                        showSimpleAlert('✅ تم إضافة الاقتراح بنجاح! 💡', 'success');
                        closeSuggestionModal();
                        
                        // إعادة تحميل البيانات
                        if (typeof loadSuggestionsData === 'function') {
                            setTimeout(loadSuggestionsData, 500);
                        }
                        if (typeof loadDashboardStats === 'function') {
                            setTimeout(loadDashboardStats, 1000);
                        }
                    } else {
                        showSimpleAlert('❌ حدث خطأ: ' + (result.message || result.error || 'خطأ غير معروف'), 'error');
                    }
                } catch (error) {
                    console.error('خطأ في إضافة الاقتراح:', error);
                    showSimpleAlert('❌ خطأ في الاتصال: ' + error.message, 'error');
                } finally {
                    // إعادة تعيين الزر
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }
            
            function addTestLibraryItem() {
                console.log('🎯 تم النقر على زر إضافة وثيقة');
                createAdvancedLibraryModal();
            }
            
            // نافذة إضافة عنصر للمكتبة الرقمية
            function createAdvancedLibraryModal() {
                showSimpleAlert('فتح نافذة إضافة وثيقة...', 'info');
                
                // إنشاء النافذة المنبثقة
                const modalHtml = \`
                    <div id="libraryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="direction: rtl;">
                        <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div class="flex justify-between items-center mb-6">
                                <h2 class="text-2xl font-bold text-gray-800">
                                    <i class="fas fa-book ml-2 text-purple-600"></i>
                                    إضافة وثيقة للمكتبة الرقمية
                                </h2>
                                <button onclick="closeLibraryModal()" class="text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-times text-xl"></i>
                                </button>
                            </div>
                            
                            <form id="libraryForm" class="space-y-4">
                                <!-- معلومات الوثيقة الأساسية -->
                                <div class="bg-purple-50 p-4 rounded-lg">
                                    <h3 class="font-semibold text-purple-800 mb-3">
                                        <i class="fas fa-info-circle ml-1"></i>
                                        معلومات الوثيقة
                                    </h3>
                                    
                                    <div class="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">عنوان الوثيقة *</label>
                                            <input type="text" id="libraryTitle" required 
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" 
                                                   placeholder="مثال: تاريخ العائلة">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">نوع المحتوى *</label>
                                            <select id="libraryContentType" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                                                <option value="">اختر نوع المحتوى</option>
                                                <option value="document">وثيقة</option>
                                                <option value="image">صورة</option>
                                                <option value="video">فيديو</option>
                                                <option value="audio">تسجيل صوتي</option>
                                                <option value="article">مقال</option>
                                                <option value="book">كتاب</option>
                                                <option value="research">بحث</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="grid md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">التصنيف *</label>
                                            <select id="libraryCategory" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                                                <option value="">اختر التصنيف</option>
                                                <option value="general">عام</option>
                                                <option value="family_history">تاريخ العائلة</option>
                                                <option value="genealogy">الأنساب</option>
                                                <option value="documents">الوثائق الرسمية</option>
                                                <option value="photos">الصور والذكريات</option>
                                                <option value="education">التعليم</option>
                                                <option value="achievements">الإنجازات</option>
                                                <option value="traditions">التقاليد والعادات</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">مستوى الوصول *</label>
                                            <select id="libraryAccessLevel" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                                                <option value="family">العائلة فقط</option>
                                                <option value="public">عام للجميع</option>
                                                <option value="restricted">مقيد للمشرفين</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="mt-4">
                                        <label class="block text-gray-700 font-medium mb-1">وصف المحتوى *</label>
                                        <textarea id="libraryDescription" rows="4" required
                                                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" 
                                                  placeholder="اكتب وصفاً مفصلاً للوثيقة ومحتوياتها..."></textarea>
                                    </div>
                                </div>
                                
                                <!-- معلومات التأليف والمصدر -->
                                <div class="bg-blue-50 p-4 rounded-lg">
                                    <h3 class="font-semibold text-blue-800 mb-3">
                                        <i class="fas fa-user-edit ml-1"></i>
                                        المؤلف والمصدر
                                    </h3>
                                    
                                    <div class="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">المؤلف</label>
                                            <input type="text" id="libraryAuthor" value="سلمان السعيدان"
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" 
                                                   placeholder="اسم المؤلف أو المصدر">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">الكلمات المفتاحية</label>
                                            <input type="text" id="libraryKeywords"
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" 
                                                   placeholder="كلمات مفصولة بفاصلة">
                                        </div>
                                    </div>
                                    
                                    <div class="grid md:grid-cols-3 gap-4 mt-4">
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">رابط الملف</label>
                                            <input type="url" id="libraryFileUrl"
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" 
                                                   placeholder="https://example.com/file.pdf">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">حجم الملف (MB)</label>
                                            <input type="number" id="libraryFileSize" step="0.1"
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" 
                                                   placeholder="2.5">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-gray-700 font-medium mb-1">نوع الملف</label>
                                            <input type="text" id="libraryFileType" 
                                                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" 
                                                   placeholder="PDF, JPG, MP4">
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- إعدادات إضافية -->
                                <div class="bg-green-50 p-4 rounded-lg">
                                    <h3 class="font-semibold text-green-800 mb-3">
                                        <i class="fas fa-cogs ml-1"></i>
                                        إعدادات إضافية
                                    </h3>
                                    
                                    <div class="flex items-center space-x-4 space-x-reverse">
                                        <label class="flex items-center">
                                            <input type="checkbox" id="libraryFeatured" 
                                                   class="rounded border-gray-300 text-purple-600 focus:ring-purple-500 ml-2">
                                            <span class="text-gray-700">عنصر مميز</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <!-- أزرار التحكم -->
                                <div class="flex justify-end space-x-3 space-x-reverse pt-4">
                                    <button type="button" onclick="closeLibraryModal()" 
                                            class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                                        <i class="fas fa-times ml-1"></i>
                                        إلغاء
                                    </button>
                                    <button type="submit" 
                                            class="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all">
                                        <i class="fas fa-plus ml-1"></i>
                                        إضافة للمكتبة
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                \`;
                
                // إضافة النافذة للصفحة
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                
                // معالج إرسال النموذج
                document.getElementById('libraryForm').addEventListener('submit', submitLibraryForm);
            }
            
            // إغلاق نافذة المكتبة
            function closeLibraryModal() {
                const modal = document.getElementById('libraryModal');
                if (modal) {
                    modal.remove();
                }
            }
            
            // إرسال بيانات الوثيقة للمكتبة
            async function submitLibraryForm(e) {
                e.preventDefault();
                
                const submitBtn = e.target.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                // إظهار حالة التحميل
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin ml-1"></i> جاري الحفظ...';
                
                try {
                    // جمع بيانات النموذج
                    const libraryData = {
                        title: document.getElementById('libraryTitle').value,
                        description: document.getElementById('libraryDescription').value,
                        content_type: document.getElementById('libraryContentType').value,
                        category: document.getElementById('libraryCategory').value,
                        access_level: document.getElementById('libraryAccessLevel').value,
                        author: document.getElementById('libraryAuthor').value,
                        keywords: document.getElementById('libraryKeywords').value,
                        file_url: document.getElementById('libraryFileUrl').value,
                        file_size: document.getElementById('libraryFileSize').value ? parseFloat(document.getElementById('libraryFileSize').value) : null,
                        file_type: document.getElementById('libraryFileType').value,
                        featured: document.getElementById('libraryFeatured').checked,
                        uploaded_by: 'سلمان السعيدان'
                    };
                    
                    // إرسال البيانات
                    const response = await fetch('/api/library', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(libraryData)
                    });
                    
                    const result = await response.json();
                    
                    if (result.status === 'success') {
                        showSimpleAlert('✅ تم إضافة الوثيقة للمكتبة بنجاح! 📚', 'success');
                        closeLibraryModal();
                        
                        // إعادة تحميل البيانات
                        if (typeof loadLibraryData === 'function') {
                            setTimeout(loadLibraryData, 500);
                        }
                        if (typeof loadDashboardStats === 'function') {
                            setTimeout(loadDashboardStats, 1000);
                        }
                    } else {
                        showSimpleAlert('❌ حدث خطأ: ' + (result.message || result.error || 'خطأ غير معروف'), 'error');
                    }
                } catch (error) {
                    console.error('خطأ في إضافة الوثيقة:', error);
                    showSimpleAlert('❌ خطأ في الاتصال: ' + error.message, 'error');
                } finally {
                    // إعادة تعيين الزر
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }
            
            async function refreshFamilyData() {
                showNotification('جاري تحديث البيانات...', 'info');
                await loadFamilyData();
                await loadDashboardStats();
                showNotification('تم تحديث البيانات بنجاح!', 'success');
            }

            // ================= إدارة المستخدمين =================
            
            async function loadUsersData() {
                const loadingEl = document.getElementById('users-loading');
                const tableEl = document.getElementById('users-table');
                const emptyEl = document.getElementById('users-empty');
                
                // إظهار حالة التحميل
                if (loadingEl) loadingEl.style.display = 'block';
                if (tableEl) tableEl.classList.add('hidden');
                if (emptyEl) emptyEl.classList.add('hidden');
                
                try {
                    const response = await fetch('/api/users');
                    const data = await response.json();
                    
                    if (data.status === 'success' && data.data) {
                        const users = data.data;
                        
                        if (users.length === 0) {
                            if (loadingEl) loadingEl.style.display = 'none';
                            if (emptyEl) emptyEl.classList.remove('hidden');
                            return;
                        }
                        
                        // تحديث الإحصائيات
                        updateUserStats(users);
                        
                        // إنشاء جدول المستخدمين
                        renderUsersTable(users);
                        
                        // إظهار الجدول
                        if (loadingEl) loadingEl.style.display = 'none';
                        if (tableEl) tableEl.classList.remove('hidden');
                    } else {
                        throw new Error(data.message || 'خطأ في تحميل المستخدمين');
                    }
                } catch (error) {
                    console.error('خطأ في تحميل المستخدمين:', error);
                    if (loadingEl) loadingEl.style.display = 'none';
                    if (emptyEl) {
                        emptyEl.innerHTML = '<i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i><p class="text-red-600">خطأ في تحميل المستخدمين</p>';
                        emptyEl.classList.remove('hidden');
                    }
                }
            }
            
            function updateUserStats(users) {
                const totalUsers = users.length;
                const activeUsers = users.filter(u => u.status === 'active').length;
                const pendingUsers = users.filter(u => u.status === 'pending').length;
                const adminUsers = users.filter(u => u.role === 'admin' || u.role === 'super_admin').length;
                
                document.getElementById('total-users').textContent = totalUsers;
                document.getElementById('active-users').textContent = activeUsers;
                document.getElementById('pending-users').textContent = pendingUsers;
                document.getElementById('admin-users').textContent = adminUsers;
            }
            
            function renderUsersTable(users) {
                const tbody = document.getElementById('users-tbody');
                if (!tbody) return;
                
                tbody.innerHTML = '';
                
                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.className = 'hover:bg-gray-50';
                    
                    const statusBadge = getStatusBadge(user.status);
                    const roleBadge = getRoleBadge(user.role);
                    const actionButtons = getActionButtons(user);
                    
                    row.innerHTML = \`
                        <td class="px-4 py-3">
                            <div class="flex items-center">
                                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                    \${user.first_name.charAt(0)}
                                </div>
                                <div class="mr-3">
                                    <p class="font-medium text-gray-900">\${user.full_name}</p>
                                    \${user.phone ? '<p class="text-gray-500 text-sm">' + user.phone + '</p>' : ''}
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-900">\${user.email}</td>
                        <td class="px-4 py-3">\${roleBadge}</td>
                        <td class="px-4 py-3">\${statusBadge}</td>
                        <td class="px-4 py-3 text-sm text-gray-500">\${formatDate(user.created_at)}</td>
                        <td class="px-4 py-3">\${actionButtons}</td>
                    \`;
                    
                    tbody.appendChild(row);
                });
            }
            
            function getStatusBadge(status) {
                const statusMap = {
                    'active': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">نشط</span>',
                    'pending': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">معلق</span>',
                    'suspended': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">معلق</span>',
                    'rejected': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">مرفوض</span>'
                };
                return statusMap[status] || status;
            }
            
            function getRoleBadge(role) {
                const roleMap = {
                    'super_admin': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">مدير أعلى</span>',
                    'admin': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">مدير</span>',
                    'moderator': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">مشرف</span>',
                    'family_manager': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">مدير عائلة</span>',
                    'event_manager': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">منظم أحداث</span>',
                    'member': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">عضو</span>',
                    'guest': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">ضيف</span>'
                };
                return roleMap[role] || role;
            }
            
            function getActionButtons(user) {
                let buttons = '';
                
                if (user.status === 'pending') {
                    buttons += \`
                        <button onclick="approveUser('\${user.id}')" class="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 ml-1">
                            <i class="fas fa-check"></i> قبول
                        </button>
                        <button onclick="rejectUser('\${user.id}')" class="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 ml-1">
                            <i class="fas fa-times"></i> رفض
                        </button>
                    \`;
                }
                
                if (user.status === 'active') {
                    buttons += \`
                        <button onclick="editUserRole('\${user.id}', '\${user.role}')" class="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 ml-1">
                            <i class="fas fa-edit"></i> تعديل الدور
                        </button>
                    \`;
                }
                
                return buttons || '<span class="text-gray-400 text-sm">لا توجد إجراءات</span>';
            }
            
            function formatDate(dateStr) {
                try {
                    const date = new Date(dateStr);
                    return date.toLocaleDateString('ar-SA');
                } catch (error) {
                    return dateStr;
                }
            }
            
            async function refreshUsers() {
                await loadUsersData();
                showNotification('تم تحديث قائمة المستخدمين بنجاح!', 'success');
            }
            
            async function approveUser(userId) {
                try {
                    const response = await fetch(\`/api/users/\${userId}/approve\`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ approved_by: 'user_admin_001' })
                    });
                    
                    const data = await response.json();
                    
                    if (data.status === 'success') {
                        showNotification('تم قبول المستخدم بنجاح!', 'success');
                        await refreshUsers();
                    } else {
                        throw new Error(data.message);
                    }
                } catch (error) {
                    console.error('خطأ في قبول المستخدم:', error);
                    showNotification('خطأ في قبول المستخدم: ' + error.message, 'error');
                }
            }
            
            async function rejectUser(userId) {
                if (!confirm('هل أنت متأكد من رفض هذا المستخدم؟')) return;
                
                try {
                    const response = await fetch(\`/api/users/\${userId}/reject\`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (data.status === 'success') {
                        showNotification('تم رفض المستخدم', 'info');
                        await refreshUsers();
                    } else {
                        throw new Error(data.message);
                    }
                } catch (error) {
                    console.error('خطأ في رفض المستخدم:', error);
                    showNotification('خطأ في رفض المستخدم: ' + error.message, 'error');
                }
            }
            
            function editUserRole(userId, currentRole) {
                const roles = [
                    { value: 'member', label: 'عضو' },
                    { value: 'moderator', label: 'مشرف' },
                    { value: 'family_manager', label: 'مدير عائلة' },
                    { value: 'event_manager', label: 'منظم أحداث' },
                    { value: 'admin', label: 'مدير' },
                    { value: 'super_admin', label: 'مدير أعلى' }
                ];
                
                const roleOptions = roles.map(role => 
                    \`<option value="\${role.value}" \${role.value === currentRole ? 'selected' : ''}>\${role.label}</option>\`
                ).join('');
                
                const modalHtml = \`
                    <div id="roleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div class="bg-white rounded-lg p-6 w-96">
                            <h3 class="text-lg font-bold mb-4">تعديل دور المستخدم</h3>
                            <select id="newRole" class="w-full p-2 border rounded-lg mb-4">
                                \${roleOptions}
                            </select>
                            <div class="flex space-x-2 space-x-reverse">
                                <button onclick="saveUserRole('\${userId}')" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">حفظ</button>
                                <button onclick="closeRoleModal()" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">إلغاء</button>
                            </div>
                        </div>
                    </div>
                \`;
                
                document.body.insertAdjacentHTML('beforeend', modalHtml);
            }
            
            async function saveUserRole(userId) {
                const newRole = document.getElementById('newRole').value;
                
                try {
                    const response = await fetch(\`/api/users/\${userId}/role\`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ role: newRole })
                    });
                    
                    const data = await response.json();
                    
                    if (data.status === 'success') {
                        showNotification('تم تحديث دور المستخدم بنجاح!', 'success');
                        closeRoleModal();
                        await refreshUsers();
                    } else {
                        throw new Error(data.message);
                    }
                } catch (error) {
                    console.error('خطأ في تحديث الدور:', error);
                    showNotification('خطأ في تحديث الدور: ' + error.message, 'error');
                }
            }
            
            function closeRoleModal() {
                const modal = document.getElementById('roleModal');
                if (modal) {
                    modal.remove();
                }
            }
            
            function exportUsers() {
                // استخراج بيانات المستخدمين كملف CSV
                fetch('/api/users')
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success' && data.data) {
                            const csvContent = convertUsersToCSV(data.data);
                            downloadCSV(csvContent, 'users_export.csv');
                            showNotification('تم تصدير بيانات المستخدمين بنجاح!', 'success');
                        }
                    })
                    .catch(error => {
                        console.error('خطأ في التصدير:', error);
                        showNotification('خطأ في تصدير البيانات', 'error');
                    });
            }
            
            function convertUsersToCSV(users) {
                const headers = ['الاسم الكامل', 'البريد الإلكتروني', 'الهاتف', 'الدور', 'الحالة', 'تاريخ التسجيل'];
                const csvContent = [
                    headers.join(','),
                    ...users.map(user => [
                        user.full_name,
                        user.email,
                        user.phone || '',
                        user.role,
                        user.status,
                        new Date(user.created_at).toLocaleDateString('ar-SA')
                    ].join(','))
                ].join('\\n');
                
                return csvContent;
            }
            
            function downloadCSV(csvContent, filename) {
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                if (link.download !== undefined) {
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }

            // ================= اختبار المزامنة =================
            
            async function testDatabase() {
                addTestOutput('🔍 اختبار اتصال قاعدة البيانات...');
                try {
                    if (typeof dbManager !== 'undefined') {
                        const result = await dbManager.testConnection();
                        addTestOutput('✅ قاعدة البيانات: ' + (result ? 'متصلة' : 'غير متصلة'));
                        updateSyncStatus();
                    }
                } catch (error) {
                    addTestOutput('❌ خطأ في قاعدة البيانات: ' + error.message);
                }
            }
            
            async function testFamilyMembers() {
                addTestOutput('👥 اختبار أعضاء العائلة...');
                try {
                    if (typeof dbManager !== 'undefined') {
                        const members = await dbManager.getFamilyMembers();
                        addTestOutput('✅ تم العثور على ' + members.length + ' عضو');
                        
                        if (members.length === 0) {
                            addTestOutput('➕ إضافة عضو تجريبي...');
                            await addTestMember();
                            addTestOutput('✅ تم إضافة العضو التجريبي');
                        }
                    }
                } catch (error) {
                    addTestOutput('❌ خطأ في اختبار الأعضاء: ' + error.message);
                }
            }
            
            async function testSync() {
                addTestOutput('🔄 اختبار المزامنة الفورية...');
                try {
                    if (typeof dbManager !== 'undefined') {
                        await dbManager.forcSync();
                        addTestOutput('✅ تمت المزامنة بنجاح');
                        updateSyncStatus();
                    }
                } catch (error) {
                    addTestOutput('❌ خطأ في المزامنة: ' + error.message);
                }
            }
            
            function showSyncStats() {
                addTestOutput('📊 إحصائيات المزامنة:');
                if (typeof dbManager !== 'undefined') {
                    const stats = dbManager.getSyncStats();
                    addTestOutput('   حالة الاتصال: ' + (stats.isOnline ? 'متصل' : 'غير متصل'));
                    addTestOutput('   عمليات مؤجلة: ' + stats.pendingOperations);
                    addTestOutput('   آخر مزامنة: ' + new Date(stats.lastSyncTime).toLocaleTimeString('ar-SA'));
                    updateSyncStatus();
                }
            }
            
            function addTestOutput(text) {
                const output = document.getElementById('test-output');
                if (output) {
                    const timestamp = new Date().toLocaleTimeString('ar-SA');
                    output.innerHTML += '[' + timestamp + '] ' + text + '\\n';
                    output.scrollTop = output.scrollHeight;
                }
            }
            
            function clearTestResults() {
                const output = document.getElementById('test-output');
                if (output) {
                    output.innerHTML = '[النظام] تم مسح النتائج...\\n';
                }
            }
            
            function updateSyncStatus() {
                if (typeof dbManager !== 'undefined') {
                    const stats = dbManager.getSyncStats();
                    
                    const statusEl = document.getElementById('connection-status-text');
                    if (statusEl) {
                        statusEl.textContent = stats.isOnline ? 'متصل' : 'غير متصل';
                        statusEl.className = 'font-medium ' + (stats.isOnline ? 'text-green-600' : 'text-red-600');
                    }
                    
                    const timeEl = document.getElementById('last-sync-time');
                    if (timeEl) {
                        timeEl.textContent = new Date(stats.lastSyncTime).toLocaleTimeString('ar-SA');
                    }
                    
                    const opsEl = document.getElementById('pending-operations');
                    if (opsEl) {
                        opsEl.textContent = stats.pendingOperations;
                    }
                    
                    // تحديث مؤشر المزامنة العلوي
                    const syncIndicator = document.getElementById('sync-status');
                    const syncText = document.getElementById('sync-text');
                    
                    if (syncIndicator && syncText) {
                        if (stats.isOnline) {
                            syncIndicator.className = 'sync-indicator online';
                            syncText.innerHTML = '<i class="fas fa-check-circle mr-1"></i>متصل ومتزامن';
                        } else {
                            syncIndicator.className = 'sync-indicator offline';
                            syncText.innerHTML = '<i class="fas fa-exclamation-triangle mr-1"></i>غير متصل';
                        }
                    }
                }
            }

            // ================= الإشعارات =================
            
            function showNotification(message, type = 'info') {
                const notification = document.createElement('div');
                notification.className = 'fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full';
                
                const colors = {
                    'success': 'bg-green-500 text-white',
                    'error': 'bg-red-500 text-white',
                    'info': 'bg-blue-500 text-white',
                    'warning': 'bg-yellow-500 text-white'
                };
                
                notification.className += ' ' + colors[type];
                notification.innerHTML = message;
                
                document.body.appendChild(notification);
                
                // Animation
                setTimeout(() => notification.classList.remove('translate-x-full'), 100);
                setTimeout(() => {
                    notification.classList.add('translate-x-full');
                    setTimeout(() => notification.remove(), 300);
                }, 3000);
            }

            // ================= التهيئة =================
            
            document.addEventListener('DOMContentLoaded', async () => {
                console.log('🚀 تطبيق آل سعيدان - تم التحميل');
                
                // تهيئة التنقل المحمول
                const mobileMenuButton = document.getElementById('mobile-menu-button');
                if (mobileMenuButton) {
                    mobileMenuButton.addEventListener('click', () => {
                        const mobileMenu = document.getElementById('mobile-menu');
                        if (mobileMenu) {
                            mobileMenu.classList.toggle('hidden');
                        }
                    });
                }
                
                // إظهار القسم الافتراضي
                showSection('dashboard');
                
                // اختبار الاتصال
                try {
                    if (typeof dbManager !== 'undefined') {
                        const isConnected = await dbManager.testConnection();
                        updateSyncStatus();
                        
                        if (isConnected) {
                            showNotification('تم الاتصال بقاعدة البيانات بنجاح!', 'success');
                        } else {
                            showNotification('فشل الاتصال بقاعدة البيانات', 'error');
                        }
                    }
                } catch (error) {
                    console.error('خطأ في اختبار الاتصال:', error);
                    showNotification('خطأ في الاتصال: ' + error.message, 'error');
                }
            });
            
            // تحديث دوري لحالة المزامنة
            setInterval(updateSyncStatus, 5000);
            

            
            // وظائف مساعدة للنوافذ المنبثقة
            function showSimpleAlert(message, type) {
                const alertClass = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
                const alertDiv = document.createElement('div');
                alertDiv.className = 'fixed top-4 right-4 ' + alertClass + ' text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md';
                alertDiv.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle') + ' ml-2"></i>' + message;
                document.body.appendChild(alertDiv);
                
                setTimeout(() => {
                    if (alertDiv.parentElement) {
                        alertDiv.style.opacity = '0';
                        alertDiv.style.transform = 'translateY(-20px)';
                        alertDiv.style.transition = 'all 0.3s ease';
                        setTimeout(() => alertDiv.remove(), 300);
                    }
                }, 4000);
            }
            

            
            console.log('✅ تم تحميل تطبيق آل سعيدان مع جميع الأقسام والمزامنة الفورية بنجاح');
        </script>
    </body>
    </html>
  `)
})

// إعادة توجيه من static/app.html
app.get('/static/app.html', (c) => {
  return c.redirect('/app')
})

// خدمة ملف JavaScript الرئيسي - نسخة مبسطة لحل مشكلة شجرة العائلة
app.get('/static/app.js', (c) => {
  const appJsContent = `
// تطبيق آل سعيدان - JavaScript مبسط
const API_BASE_URL = '/api';

// تحميل إحصائيات لوحة التحكم
// تحميل وعرض الأحداث - النسخة الخارجية
async function loadEventsData() {
  console.log('🔄 جاري تحميل الأحداث...');
  
  try {
    // إظهار حالة التحميل
    const loadingEl = document.getElementById('events-loading');
    const listEl = document.getElementById('events-list');
    const emptyEl = document.getElementById('events-empty');
    const statsEl = document.getElementById('events-stats');
    
    if (loadingEl) loadingEl.classList.remove('hidden');
    if (listEl) listEl.classList.add('hidden');
    if (emptyEl) emptyEl.classList.add('hidden');
    if (statsEl) statsEl.classList.add('hidden');
    
    // جلب البيانات من API
    const response = await fetch('/api/events');
    const result = await response.json();
    
    if (result.status === 'success' && result.data) {
      const events = result.data;
      console.log(\`✅ تم تحميل \${events.length} حدث\`);
      
      // إخفاء حالة التحميل
      if (loadingEl) loadingEl.classList.add('hidden');
      
      if (events.length === 0) {
        // عرض حالة فارغة
        if (emptyEl) emptyEl.classList.remove('hidden');
      } else {
        // عرض قائمة الأحداث
        if (listEl) {
          listEl.innerHTML = '';
          events.forEach(event => {
            listEl.appendChild(createEventCard(event));
          });
          listEl.classList.remove('hidden');
        }
        
        // تحديث الإحصائيات
        updateEventsStats(events);
        if (statsEl) statsEl.classList.remove('hidden');
      }
    } else {
      throw new Error(result.message || 'خطأ في جلب البيانات');
    }
  } catch (error) {
    console.error('❌ خطأ في تحميل الأحداث:', error);
    
    // إخفاء التحميل وإظهار رسالة خطأ
    const loadingEl = document.getElementById('events-loading');
    if (loadingEl) {
      loadingEl.innerHTML = \`
        <div class="text-center py-12">
          <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <p class="text-red-600 font-semibold">خطأ في تحميل الأحداث</p>
          <p class="text-gray-500 text-sm mt-1">\${error.message}</p>
          <button onclick="loadEventsData()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            <i class="fas fa-redo ml-1"></i>إعادة المحاولة
          </button>
        </div>
      \`;
    }
  }
}

// إنشاء بطاقة حدث
function createEventCard(event) {
  const card = document.createElement('div');
  card.className = 'bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all';
  
  // تحديد لون الأولوية
  const priorityColors = {
    'low': 'text-gray-500 bg-gray-100',
    'medium': 'text-blue-600 bg-blue-100', 
    'high': 'text-orange-600 bg-orange-100',
    'urgent': 'text-red-600 bg-red-100'
  };
  
  const priorityLabels = {
    'low': 'منخفضة',
    'medium': 'متوسطة',
    'high': 'عالية', 
    'urgent': 'عاجلة'
  };
  
  // تحديد أيقونة النوع
  const typeIcons = {
    'meeting': 'fas fa-users',
    'celebration': 'fas fa-birthday-cake',
    'educational': 'fas fa-graduation-cap',
    'recreational': 'fas fa-gamepad',
    'business': 'fas fa-briefcase',
    'religious': 'fas fa-mosque',
    'general': 'fas fa-calendar'
  };
  
  const typeLabels = {
    'meeting': 'اجتماع عائلي',
    'celebration': 'احتفال ومناسبة',
    'educational': 'فعالية تعليمية',
    'recreational': 'فعالية ترفيهية',
    'business': 'فعالية تجارية',
    'religious': 'مناسبة دينية',
    'general': 'عام'
  };
  
  // تنسيق التاريخ
  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  });
  const formattedTime = eventDate.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  card.innerHTML = \`
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h3 class="text-xl font-bold text-gray-800 mb-2">
          <i class="\${typeIcons[event.event_type] || 'fas fa-calendar'} text-green-600 ml-2"></i>
          \${event.title || 'حدث بدون عنوان'}
        </h3>
        <p class="text-gray-600 text-sm">\${typeLabels[event.event_type] || 'نوع غير محدد'}</p>
      </div>
      <div class="text-left">
        <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold \${priorityColors[event.priority] || priorityColors['medium']}">
          \${priorityLabels[event.priority] || 'متوسطة'}
        </span>
      </div>
    </div>
    
    <div class="space-y-3 mb-4">
      <div class="flex items-center text-gray-600">
        <i class="fas fa-calendar-day text-blue-500 ml-3 w-5"></i>
        <span class="font-medium">\${formattedDate}</span>
      </div>
      <div class="flex items-center text-gray-600">
        <i class="fas fa-clock text-green-500 ml-3 w-5"></i>
        <span>\${formattedTime}</span>
      </div>
      \${event.location ? \`
        <div class="flex items-center text-gray-600">
          <i class="fas fa-map-marker-alt text-red-500 ml-3 w-5"></i>
          <span>\${event.location}</span>
        </div>
      \` : ''}
      \${event.organizer_name ? \`
        <div class="flex items-center text-gray-600">
          <i class="fas fa-user-tie text-purple-500 ml-3 w-5"></i>
          <span>المنظم: \${event.organizer_name}</span>
          \${event.organizer_phone ? \`<span class="text-gray-500 mr-2">(\${event.organizer_phone})</span>\` : ''}
        </div>
      \` : ''}
    </div>
    
    \${event.description ? \`
      <div class="bg-gray-50 rounded-lg p-3 mb-4">
        <p class="text-gray-700 text-sm">\${event.description}</p>
      </div>
    \` : ''}
    
    <div class="flex justify-between items-center pt-4 border-t border-gray-200">
      <div class="flex space-x-2 space-x-reverse">
        \${event.max_attendees ? \`
          <span class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
            <i class="fas fa-users ml-1"></i>
            حد أقصى: \${event.max_attendees}
          </span>
        \` : ''}
        \${event.estimated_cost ? \`
          <span class="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
            <i class="fas fa-money-bill ml-1"></i>
            \${event.estimated_cost} ريال
          </span>
        \` : ''}
      </div>
      <div class="flex space-x-2 space-x-reverse">
        <button onclick="editEvent('\${event.id}')" class="text-blue-600 hover:text-blue-800 p-2 rounded" title="تعديل">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="deleteEventExternal('\${event.id}', '\${event.title}')" class="text-red-600 hover:text-red-800 p-2 rounded" title="حذف">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  \`;
  
  return card;
}

// تحميل وعرض الاقتراحات - النسخة الخارجية
async function loadSuggestionsData() {
  console.log('🔄 جاري تحميل الاقتراحات...');
  
  try {
    // إظهار حالة التحميل
    const loadingEl = document.getElementById('suggestions-loading');
    const listEl = document.getElementById('suggestions-list');
    const emptyEl = document.getElementById('suggestions-empty');
    const statsEl = document.getElementById('suggestions-stats');
    
    if (loadingEl) loadingEl.classList.remove('hidden');
    if (listEl) listEl.classList.add('hidden');
    if (emptyEl) emptyEl.classList.add('hidden');
    if (statsEl) statsEl.classList.add('hidden');
    
    // جلب البيانات من API
    const response = await fetch('/api/suggestions');
    const result = await response.json();
    
    if (result.status === 'success' && result.data) {
      const suggestions = result.data;
      console.log(\`✅ تم تحميل \${suggestions.length} اقتراح\`);
      
      // إخفاء حالة التحميل
      if (loadingEl) loadingEl.classList.add('hidden');
      
      if (suggestions.length === 0) {
        // عرض حالة فارغة
        if (emptyEl) emptyEl.classList.remove('hidden');
      } else {
        // عرض قائمة الاقتراحات
        if (listEl) {
          listEl.innerHTML = '';
          suggestions.forEach(suggestion => {
            listEl.appendChild(createSuggestionCard(suggestion));
          });
          listEl.classList.remove('hidden');
        }
        
        // تحديث الإحصائيات
        updateSuggestionsStats(suggestions);
        if (statsEl) statsEl.classList.remove('hidden');
      }
    } else {
      throw new Error(result.message || 'خطأ في جلب البيانات');
    }
  } catch (error) {
    console.error('❌ خطأ في تحميل الاقتراحات:', error);
    
    // إخفاء التحميل وإظهار رسالة خطأ
    const loadingEl = document.getElementById('suggestions-loading');
    if (loadingEl) {
      loadingEl.innerHTML = \`
        <div class="text-center py-12">
          <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <p class="text-red-600 font-semibold">خطأ في تحميل الاقتراحات</p>
          <p class="text-gray-500 text-sm mt-1">\${error.message}</p>
          <button onclick="loadSuggestionsData()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            <i class="fas fa-redo ml-1"></i>إعادة المحاولة
          </button>
        </div>
      \`;
    }
  }
}

// إنشاء بطاقة اقتراح
function createSuggestionCard(suggestion) {
  const card = document.createElement('div');
  card.className = 'bg-gradient-to-r from-white to-yellow-50 border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all';
  
  // تحديد لون الأولوية
  const priorityColors = {
    'low': 'text-gray-500 bg-gray-100',
    'medium': 'text-blue-600 bg-blue-100', 
    'high': 'text-orange-600 bg-orange-100',
    'urgent': 'text-red-600 bg-red-100'
  };
  
  const priorityLabels = {
    'low': 'منخفضة',
    'medium': 'متوسطة',
    'high': 'عالية', 
    'urgent': 'عاجلة'
  };
  
  // تحديد لون الحالة
  const statusColors = {
    'pending': 'text-yellow-600 bg-yellow-100',
    'approved': 'text-green-600 bg-green-100',
    'rejected': 'text-red-600 bg-red-100',
    'implemented': 'text-blue-600 bg-blue-100'
  };
  
  const statusLabels = {
    'pending': 'معلق',
    'approved': 'موافق عليه',
    'rejected': 'مرفوض',
    'implemented': 'تم التنفيذ'
  };
  
  // تنسيق التاريخ
  const createdDate = new Date(suggestion.created_at);
  const formattedDate = createdDate.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });
  
  card.innerHTML = \`
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h3 class="text-xl font-bold text-gray-800 mb-2">
          <i class="fas fa-lightbulb text-yellow-600 ml-2"></i>
          \${suggestion.title || 'اقتراح بدون عنوان'}
        </h3>
        <p class="text-gray-600 text-sm">\${suggestion.category || 'عام'}</p>
      </div>
      <div class="text-left space-y-2">
        <span class="block px-3 py-1 rounded-full text-xs font-semibold \${statusColors[suggestion.status] || statusColors['pending']}">
          \${statusLabels[suggestion.status] || 'معلق'}
        </span>
        <span class="block px-3 py-1 rounded-full text-xs font-semibold \${priorityColors[suggestion.priority] || priorityColors['medium']}">
          \${priorityLabels[suggestion.priority] || 'متوسطة'}
        </span>
      </div>
    </div>
    
    <div class="space-y-3 mb-4">
      <div class="flex items-center text-gray-600">
        <i class="fas fa-calendar text-blue-500 ml-3 w-5"></i>
        <span>تاريخ الإضافة: \${formattedDate}</span>
      </div>
      \${suggestion.submitted_by ? \`
        <div class="flex items-center text-gray-600">
          <i class="fas fa-user text-purple-500 ml-3 w-5"></i>
          <span>مقدم من: \${suggestion.submitted_by}</span>
        </div>
      \` : ''}
    </div>
    
    \${suggestion.description ? \`
      <div class="bg-gray-50 rounded-lg p-3 mb-4">
        <p class="text-gray-700 text-sm">\${suggestion.description}</p>
      </div>
    \` : ''}
    
    \${suggestion.benefits ? \`
      <div class="bg-green-50 rounded-lg p-3 mb-4">
        <h4 class="font-semibold text-green-800 text-sm mb-1">الفوائد المتوقعة:</h4>
        <p class="text-green-700 text-sm">\${suggestion.benefits}</p>
      </div>
    \` : ''}
    
    <div class="flex justify-between items-center pt-4 border-t border-gray-200">
      <div class="flex space-x-2 space-x-reverse">
        \${suggestion.budget_estimate ? \`
          <span class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
            <i class="fas fa-money-bill ml-1"></i>
            \${suggestion.budget_estimate} ريال
          </span>
        \` : ''}
        \${suggestion.timeline_estimate ? \`
          <span class="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
            <i class="fas fa-clock ml-1"></i>
            \${suggestion.timeline_estimate}
          </span>
        \` : ''}
      </div>
      <div class="flex space-x-2 space-x-reverse">
        <button onclick="editSuggestion('\${suggestion.id}')" class="text-blue-600 hover:text-blue-800 p-2 rounded" title="تعديل">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="deleteSuggestionExternal('\${suggestion.id}', '\${suggestion.title}')" class="text-red-600 hover:text-red-800 p-2 rounded" title="حذف">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  \`;
  
  return card;
}

// تحديث إحصائيات الاقتراحات
function updateSuggestionsStats(suggestions) {
  // إجمالي الاقتراحات
  const totalSuggestions = suggestions.length;
  
  // الاقتراحات المعلقة
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending').length;
  
  // الاقتراحات الموافق عليها
  const approvedSuggestions = suggestions.filter(s => s.status === 'approved' || s.status === 'implemented').length;
  
  // اقتراحات بأولوية عالية
  const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high' || s.priority === 'urgent').length;
  
  // تحديث العناصر
  const totalEl = document.getElementById('total-suggestions');
  const pendingEl = document.getElementById('pending-suggestions');
  const approvedEl = document.getElementById('approved-suggestions');
  const highPriorityEl = document.getElementById('high-priority-suggestions');
  
  if (totalEl) totalEl.textContent = totalSuggestions;
  if (pendingEl) pendingEl.textContent = pendingSuggestions;
  if (approvedEl) approvedEl.textContent = approvedSuggestions;
  if (highPriorityEl) highPriorityEl.textContent = highPrioritySuggestions;
}

// حذف اقتراح - النسخة الخارجية
async function deleteSuggestionExternal(suggestionId, suggestionTitle) {
  if (!confirm(\`هل أنت متأكد من حذف الاقتراح "\${suggestionTitle}"؟\`)) {
    return;
  }
  
  try {
    const response = await fetch(\`/api/suggestions/\${suggestionId}\`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log(\`✅ تم حذف الاقتراح: \${suggestionTitle}\`);
      // إعادة تحميل الاقتراحات
      loadSuggestionsData();
    } else {
      console.error('❌ خطأ في حذف الاقتراح:', result.message);
      alert('خطأ في حذف الاقتراح: ' + result.message);
    }
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error);
    alert('خطأ في الاتصال: ' + error.message);
  }
}

// تحميل وعرض المكتبة الرقمية - النسخة الخارجية
async function loadLibraryData() {
  console.log('🔄 جاري تحميل المكتبة الرقمية...');
  
  try {
    // إظهار حالة التحميل
    const loadingEl = document.getElementById('library-loading');
    const listEl = document.getElementById('library-list');
    const emptyEl = document.getElementById('library-empty');
    const statsEl = document.getElementById('library-stats');
    
    if (loadingEl) loadingEl.classList.remove('hidden');
    if (listEl) listEl.classList.add('hidden');
    if (emptyEl) emptyEl.classList.add('hidden');
    if (statsEl) statsEl.classList.add('hidden');
    
    // جلب البيانات من API
    const response = await fetch('/api/library');
    const result = await response.json();
    
    if (result.status === 'success' && result.data) {
      const libraryItems = result.data;
      console.log(\`✅ تم تحميل \${libraryItems.length} عنصر\`);
      
      // إخفاء حالة التحميل
      if (loadingEl) loadingEl.classList.add('hidden');
      
      if (libraryItems.length === 0) {
        // عرض حالة فارغة
        if (emptyEl) emptyEl.classList.remove('hidden');
      } else {
        // عرض قائمة المكتبة
        if (listEl) {
          listEl.innerHTML = '';
          libraryItems.forEach(item => {
            listEl.appendChild(createLibraryCard(item));
          });
          listEl.classList.remove('hidden');
        }
        
        // تحديث الإحصائيات
        updateLibraryStats(libraryItems);
        if (statsEl) statsEl.classList.remove('hidden');
      }
    } else {
      throw new Error(result.message || 'خطأ في جلب البيانات');
    }
  } catch (error) {
    console.error('❌ خطأ في تحميل المكتبة:', error);
    
    // إخفاء التحميل وإظهار رسالة خطأ
    const loadingEl = document.getElementById('library-loading');
    if (loadingEl) {
      loadingEl.innerHTML = \`
        <div class="text-center py-12">
          <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <p class="text-red-600 font-semibold">خطأ في تحميل المكتبة</p>
          <p class="text-gray-500 text-sm mt-1">\${error.message}</p>
          <button onclick="loadLibraryData()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            <i class="fas fa-redo ml-1"></i>إعادة المحاولة
          </button>
        </div>
      \`;
    }
  }
}

// إنشاء بطاقة عنصر مكتبة
function createLibraryCard(item) {
  const card = document.createElement('div');
  card.className = 'bg-gradient-to-r from-white to-purple-50 border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all';
  
  // تحديد أيقونة نوع المحتوى
  const contentTypeIcons = {
    'document': 'fas fa-file-alt',
    'image': 'fas fa-image',
    'video': 'fas fa-video',
    'audio': 'fas fa-music',
    'article': 'fas fa-newspaper',
    'book': 'fas fa-book',
    'research': 'fas fa-microscope'
  };
  
  const contentTypeLabels = {
    'document': 'وثيقة',
    'image': 'صورة',
    'video': 'فيديو',
    'audio': 'تسجيل صوتي',
    'article': 'مقال',
    'book': 'كتاب',
    'research': 'بحث'
  };
  
  // تنسيق التاريخ
  const createdDate = new Date(item.created_at);
  const formattedDate = createdDate.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });
  
  card.innerHTML = \`
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h3 class="text-xl font-bold text-gray-800 mb-2">
          <i class="\${contentTypeIcons[item.content_type] || 'fas fa-file'} text-purple-600 ml-2"></i>
          \${item.title || 'عنصر بدون عنوان'}
          \${item.featured ? '<i class="fas fa-star text-yellow-500 mr-2" title="مميز"></i>' : ''}
        </h3>
        <p class="text-gray-600 text-sm">\${contentTypeLabels[item.content_type] || 'غير محدد'} • \${item.category || 'عام'}</p>
      </div>
      <div class="text-left">
        <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold text-purple-600 bg-purple-100">
          \${item.access_level === 'family' ? 'العائلة' : item.access_level === 'public' ? 'عام' : 'مقيد'}
        </span>
      </div>
    </div>
    
    <div class="space-y-3 mb-4">
      <div class="flex items-center text-gray-600">
        <i class="fas fa-calendar text-blue-500 ml-3 w-5"></i>
        <span>تاريخ الإضافة: \${formattedDate}</span>
      </div>
      \${item.author ? \`
        <div class="flex items-center text-gray-600">
          <i class="fas fa-user-edit text-purple-500 ml-3 w-5"></i>
          <span>المؤلف: \${item.author}</span>
        </div>
      \` : ''}
      \${item.file_url ? \`
        <div class="flex items-center text-gray-600">
          <i class="fas fa-link text-green-500 ml-3 w-5"></i>
          <a href="\${item.file_url}" target="_blank" class="text-blue-600 hover:underline">رابط الملف</a>
        </div>
      \` : ''}
    </div>
    
    \${item.description ? \`
      <div class="bg-gray-50 rounded-lg p-3 mb-4">
        <p class="text-gray-700 text-sm">\${item.description}</p>
      </div>
    \` : ''}
    
    <div class="flex justify-between items-center pt-4 border-t border-gray-200">
      <div class="flex space-x-2 space-x-reverse">
        \${item.file_size ? \`
          <span class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
            <i class="fas fa-hdd ml-1"></i>
            \${item.file_size} MB
          </span>
        \` : ''}
        \${item.file_type ? \`
          <span class="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
            \${item.file_type}
          </span>
        \` : ''}
        <span class="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
          <i class="fas fa-eye ml-1"></i>
          \${item.view_count || 0} مشاهدة
        </span>
      </div>
      <div class="flex space-x-2 space-x-reverse">
        <button onclick="editLibraryItem('\${item.id}')" class="text-blue-600 hover:text-blue-800 p-2 rounded" title="تعديل">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="deleteLibraryExternal('\${item.id}', '\${item.title}')" class="text-red-600 hover:text-red-800 p-2 rounded" title="حذف">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  \`;
  
  return card;
}

// تحديث إحصائيات المكتبة
function updateLibraryStats(libraryItems) {
  // إجمالي العناصر
  const totalLibrary = libraryItems.length;
  
  // عدد الوثائق
  const documentsCount = libraryItems.filter(item => 
    item.content_type === 'document' || item.content_type === 'article' || item.content_type === 'book'
  ).length;
  
  // عدد الصور
  const imagesCount = libraryItems.filter(item => 
    item.content_type === 'image'
  ).length;
  
  // العناصر المميزة
  const featuredCount = libraryItems.filter(item => item.featured).length;
  
  // تحديث العناصر
  const totalEl = document.getElementById('total-library');
  const documentsEl = document.getElementById('documents-count');
  const imagesEl = document.getElementById('images-count');
  const featuredEl = document.getElementById('featured-count');
  
  if (totalEl) totalEl.textContent = totalLibrary;
  if (documentsEl) documentsEl.textContent = documentsCount;
  if (imagesEl) imagesEl.textContent = imagesCount;
  if (featuredEl) featuredEl.textContent = featuredCount;
}

// حذف عنصر من المكتبة - النسخة الخارجية
async function deleteLibraryExternal(itemId, itemTitle) {
  if (!confirm(\`هل أنت متأكد من حذف "\${itemTitle}" من المكتبة؟\`)) {
    return;
  }
  
  try {
    const response = await fetch(\`/api/library/\${itemId}\`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log(\`✅ تم حذف العنصر: \${itemTitle}\`);
      // إعادة تحميل المكتبة
      loadLibraryData();
    } else {
      console.error('❌ خطأ في حذف العنصر:', result.message);
      alert('خطأ في حذف العنصر: ' + result.message);
    }
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error);
    alert('خطأ في الاتصال: ' + error.message);
  }
}

// تعديل اقتراح (للمستقبل)
function editSuggestion(suggestionId) {
  alert('وظيفة التعديل ستُضاف قريباً');
}

// تعديل عنصر مكتبة (للمستقبل)
function editLibraryItem(itemId) {
  alert('وظيفة التعديل ستُضاف قريباً');
}

// تحديث إحصائيات الأحداث
function updateEventsStats(events) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // إجمالي الأحداث
  const totalEvents = events.length;
  
  // الأحداث القادمة
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.event_date);
    return eventDate > now;
  }).length;
  
  // أحداث هذا الشهر
  const thisMonthEvents = events.filter(event => {
    const eventDate = new Date(event.event_date);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  }).length;
  
  // أحداث بأولوية عالية
  const highPriorityEvents = events.filter(event => 
    event.priority === 'high' || event.priority === 'urgent'
  ).length;
  
  // تحديث العناصر
  const totalEl = document.getElementById('total-events');
  const upcomingEl = document.getElementById('upcoming-events');
  const thisMonthEl = document.getElementById('this-month-events');
  const highPriorityEl = document.getElementById('high-priority-events');
  
  if (totalEl) totalEl.textContent = totalEvents;
  if (upcomingEl) upcomingEl.textContent = upcomingEvents;
  if (thisMonthEl) thisMonthEl.textContent = thisMonthEvents;
  if (highPriorityEl) highPriorityEl.textContent = highPriorityEvents;
}

// حذف حدث - النسخة الخارجية
async function deleteEventExternal(eventId, eventTitle) {
  if (!confirm(\`هل أنت متأكد من حذف الحدث "\${eventTitle}"؟\`)) {
    return;
  }
  
  try {
    const response = await fetch(\`/api/events/\${eventId}\`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log(\`✅ تم حذف الحدث: \${eventTitle}\`);
      // إعادة تحميل الأحداث
      loadEventsData();
    } else {
      console.error('❌ خطأ في حذف الحدث:', result.message);
      alert('خطأ في حذف الحدث: ' + result.message);
    }
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error);
    alert('خطأ في الاتصال: ' + error.message);
  }
}

async function loadDashboardStats() {
  console.log('🔄 جاري تحميل إحصائيات لوحة التحكم...');
  
  try {
    // تحميل عدد أعضاء العائلة
    const membersResponse = await fetch('/api/family-members');
    const membersResult = await membersResponse.json();
    const membersCount = membersResult.status === 'success' ? membersResult.count : 0;
    
    // تحميل عدد الأحداث
    const eventsResponse = await fetch('/api/events');
    const eventsResult = await eventsResponse.json();
    const eventsCount = eventsResult.status === 'success' ? eventsResult.count : 0;
    
    // تحميل عدد الاقتراحات
    const suggestionsResponse = await fetch('/api/suggestions');
    const suggestionsResult = await suggestionsResponse.json();
    const suggestionsCount = suggestionsResult.status === 'success' ? suggestionsResult.count : 0;
    
    // تحميل عدد عناصر المكتبة
    const libraryResponse = await fetch('/api/library');
    const libraryResult = await libraryResponse.json();
    const libraryCount = libraryResult.status === 'success' ? libraryResult.count : 0;
    
    // تحديث الواجهة
    const familyCountEl = document.getElementById('family-count');
    const eventsCountEl = document.getElementById('events-count');
    const suggestionsCountEl = document.getElementById('suggestions-count');
    const libraryCountEl = document.getElementById('library-count');
    
    if (familyCountEl) familyCountEl.textContent = membersCount;
    if (eventsCountEl) eventsCountEl.textContent = eventsCount;
    if (suggestionsCountEl) suggestionsCountEl.textContent = suggestionsCount;
    if (libraryCountEl) libraryCountEl.textContent = libraryCount;
    
    console.log('✅ تم تحميل الإحصائيات بنجاح');
    return {
      members: membersCount,
      events: eventsCount,
      suggestions: suggestionsCount,
      library: libraryCount
    };
  } catch (error) {
    console.error('❌ خطأ في تحميل الإحصائيات:', error);
    return null;
  }
}

// تحميل بيانات العائلة
async function loadFamilyData() {
  console.log('🔄 جاري تحميل بيانات العائلة...');
  
  const loadingEl = document.getElementById('family-loading');
  const treeEl = document.getElementById('family-tree');
  const emptyEl = document.getElementById('family-empty');
  
  try {
    if (loadingEl) loadingEl.style.display = 'block';
    if (treeEl) treeEl.classList.add('hidden');
    if (emptyEl) emptyEl.classList.add('hidden');
    
    const response = await fetch('/api/family-members');
    const result = await response.json();
    
    if (result.status === 'success' && result.data) {
      const members = result.data;
      console.log('✅ تم تحميل', members.length, 'عضو');
      
      if (members.length === 0) {
        if (loadingEl) loadingEl.style.display = 'none';
        if (emptyEl) emptyEl.classList.remove('hidden');
        return;
      }
      
      // عرض الأعضاء
      const treeContainer = document.getElementById('family-tree-container');
      if (treeContainer) {
        let htmlContent = '<div class="grid gap-4">';
        
        members.forEach(member => {
          htmlContent += \`
            <div class="bg-white rounded-lg p-4 shadow-sm border">
              <div class="flex items-center space-x-3 space-x-reverse">
                <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  \${member.first_name.charAt(0)}
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">\${member.full_name}</h4>
                  <p class="text-sm text-gray-600">الجيل \${member.generation}</p>
                  \${member.profession ? '<p class="text-xs text-blue-600">' + member.profession + '</p>' : ''}
                </div>
              </div>
            </div>
          \`;
        });
        
        htmlContent += '</div>';
        treeContainer.innerHTML = htmlContent;
      }
      
      if (loadingEl) loadingEl.style.display = 'none';
      if (treeEl) treeEl.classList.remove('hidden');
      
      // تحديث العدد في لوحة التحكم
      const familyCountEl = document.getElementById('family-count');
      if (familyCountEl) familyCountEl.textContent = members.length;
      
    } else {
      throw new Error('خطأ في تحميل البيانات');
    }
  } catch (error) {
    console.error('❌ خطأ في تحميل العائلة:', error);
    if (loadingEl) loadingEl.style.display = 'none';
    if (emptyEl) {
      emptyEl.innerHTML = '<div class="text-center p-8"><i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i><p class="text-red-600">خطأ في تحميل بيانات العائلة</p></div>';
      emptyEl.classList.remove('hidden');
    }
  }
}

// تحميل بيانات لوحة التحكم
async function loadDashboardStats() {
  try {
    const response = await fetch('/api/family-members');
    const result = await response.json();
    
    if (result.status === 'success') {
      const familyCountEl = document.getElementById('family-count');
      if (familyCountEl) familyCountEl.textContent = result.count || result.data?.length || 0;
    }
  } catch (error) {
    console.error('خطأ في تحميل إحصائيات لوحة التحكم:', error);
  }
}

// DatabaseManager بسيط
class DatabaseManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.eventListeners = new Map();
    this.lastSyncTime = Date.now();
    console.log('📡 DatabaseManager - تم التهيئة');
    
    this.setupConnectionMonitoring();
    this.setupPeriodicSync();
  }
  
  // ================= إدارة أعضاء العائلة =================
  
  async getFamilyMembers() {
    try {
      const response = await fetch('/api/family-members');
      const result = await response.json();
      return result.status === 'success' ? result.data : [];
    } catch (error) {
      console.error('خطأ في جلب أعضاء العائلة:', error);
      return [];
    }
  }
  
  async getFamilyMember(memberId) {
    const result = await this.apiCall('GET', '/family-members/' + memberId);
    return result.data;
  }
  
  async createFamilyMember(memberData) {
    const result = await this.apiCall('POST', '/family-members', memberData);
    this.notifyListeners('member_added', result.data);
    return result;
  }
  
  async updateFamilyMember(memberId, memberData) {
    const result = await this.apiCall('PUT', '/family-members/' + memberId, memberData);
    this.notifyListeners('member_updated', { id: memberId, data: result.data });
    return result;
  }
  
  async deleteFamilyMember(memberId) {
    const result = await this.apiCall('DELETE', '/family-members/' + memberId);
    this.notifyListeners('member_deleted', { id: memberId });
    return result;
  }
  
  // ================= إدارة الفعاليات =================
  
  async getEvents(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = '/events' + (queryParams ? '?' + queryParams : '');
    
    const result = await this.apiCall('GET', endpoint);
    return result.data || [];
  }
  
  async createEvent(eventData) {
    const result = await this.apiCall('POST', '/events', eventData);
    this.notifyListeners('event_added', result.data);
    return result;
  }
  
  // ================= إدارة المقترحات =================
  
  async getSuggestions(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = '/suggestions' + (queryParams ? '?' + queryParams : '');
    
    const result = await this.apiCall('GET', endpoint);
    return result.data || [];
  }
  
  async createSuggestion(suggestionData) {
    const result = await this.apiCall('POST', '/suggestions', suggestionData);
    this.notifyListeners('suggestion_added', result.data);
    return result;
  }
  
  // ================= مراقبة الاتصال والمزامنة =================
  
  setupConnectionMonitoring() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🟢 DatabaseManager - تم استعادة الاتصال');
      this.syncPendingOperations();
      this.notifyListeners('connection_restored', true);
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('🔴 DatabaseManager - انقطع الاتصال - سيتم المزامنة عند العودة');
      this.notifyListeners('connection_lost', false);
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
      console.log('🌐 API Request:', method.toUpperCase(), endpoint);
      
      const response = await fetch('/api' + endpoint, config);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'HTTP ' + response.status);
      }
      
      console.log('✅ API Success:', endpoint);
      this.notifyListeners('api_success', { method, endpoint, data: result });
      
      return result;
    } catch (error) {
      console.error('❌ API Error', method, endpoint + ':', error);
      
      // إضافة للقائمة في حالة فقدان الاتصال
      if (!this.isOnline || error.message.includes('fetch')) {
        this.queueOperation(method, endpoint, data);
      }
      
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
    
    console.log('🔄 مزامنة', this.syncQueue.length, 'عمليات مؤجلة...');
    
    const operations = [...this.syncQueue];
    this.syncQueue = [];
    
    for (const operation of operations) {
      try {
        await this.apiCall(operation.method, operation.endpoint, operation.data);
        console.log('✅ تمت مزامنة العملية:', operation);
      } catch (error) {
        console.error('❌ فشلت مزامنة العملية:', operation, error);
        this.syncQueue.push(operation);
      }
    }
  }
  
  // ================= مزامنة التحديثات الجديدة =================
  
  async syncLatestChanges() {
    try {
      const response = await this.apiCall('GET', '/activity?since=' + this.lastSyncTime);
      
      if (response.success && response.data.length > 0) {
        console.log('🔄 تم اكتشاف', response.data.length, 'تحديث جديد');
        this.notifyListeners('data_updated', response.data);
        this.lastSyncTime = Date.now();
      }
    } catch (error) {
      console.error('❌ خطأ في مزامنة التحديثات:', error);
    }
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
  
  getSyncStats() {
    return {
      isOnline: this.isOnline,
      pendingOperations: this.syncQueue.length,
      lastSyncTime: this.lastSyncTime,
      listeners: Array.from(this.eventListeners.keys())
    };
  }
  
  async forceSync() {
    console.log('🔄 فرض المزامنة الفورية...');
    await this.syncPendingOperations();
    await this.syncLatestChanges();
    console.log('✅ تمت المزامنة الفورية');
  }
  
  clearAllListeners() {
    this.eventListeners.clear();
  }
}

// وظيفة تسجيل الخروج
async function logout() {
  try {
    // استدعاء API تسجيل الخروج
    const token = localStorage.getItem('auth_token');
    if (token) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
    }
    
    // مسح بيانات المصادقة من localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // إعادة توجيه لصفحة تسجيل الدخول أو إعادة تحميل الصفحة
    window.location.reload();
    
    console.log('✅ تم تسجيل الخروج بنجاح');
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
    // حتى لو فشل الطلب، امسح البيانات المحلية
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.reload();
  }
}

// وظائف إدارة أعضاء العائلة
async function addFamilyMember(memberData) {
  try {
    console.log('🔄 إضافة عضو جديد:', memberData);
    
    const response = await fetch('/api/family-members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(memberData)
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('✅ تم إضافة العضو بنجاح');
      // إعادة تحميل البيانات
      loadFamilyData();
      return true;
    } else {
      console.error('❌ خطأ في إضافة العضو:', result.message);
      alert('خطأ: ' + result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ خطأ في إضافة العضو:', error);
    alert('حدث خطأ في إضافة العضو');
    return false;
  }
}

async function editFamilyMember(memberId, memberData) {
  try {
    console.log('🔄 تحديث العضو:', memberId, memberData);
    
    const response = await fetch('/api/family-members/' + memberId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(memberData)
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('✅ تم تحديث العضو بنجاح');
      loadFamilyData();
      return true;
    } else {
      console.error('❌ خطأ في تحديث العضو:', result.message);
      alert('خطأ: ' + result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ خطأ في تحديث العضو:', error);
    alert('حدث خطأ في تحديث العضو');
    return false;
  }
}

async function deleteFamilyMember(memberId) {
  try {
    if (!confirm('هل أنت متأكد من حذف هذا العضو؟')) {
      return false;
    }
    
    console.log('🔄 حذف العضو:', memberId);
    
    const response = await fetch('/api/family-members/' + memberId, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('✅ تم حذف العضو بنجاح');
      loadFamilyData();
      return true;
    } else {
      console.error('❌ خطأ في حذف العضو:', result.message);
      alert('خطأ: ' + result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ خطأ في حذف العضو:', error);
    alert('حدث خطأ في حذف العضو');
    return false;
  }
}

// وظائف إدارة الأحداث
async function addEvent(eventData) {
  try {
    console.log('🔄 إضافة حدث جديد:', eventData);
    
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('✅ تم إضافة الحدث بنجاح');
      return true;
    } else {
      console.error('❌ خطأ في إضافة الحدث:', result.message);
      alert('خطأ: ' + result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ خطأ في إضافة الحدث:', error);
    alert('حدث خطأ في إضافة الحدث');
    return false;
  }
}

async function editEvent(eventId, eventData) {
  try {
    const response = await fetch('/api/events/' + eventId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('✅ تم تحديث الحدث بنجاح');
      return true;
    } else {
      alert('خطأ: ' + result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ خطأ في تحديث الحدث:', error);
    alert('حدث خطأ في تحديث الحدث');
    return false;
  }
}

async function deleteEvent(eventId) {
  try {
    if (!confirm('هل أنت متأكد من حذف هذا الحدث؟')) {
      return false;
    }
    
    const response = await fetch('/api/events/' + eventId, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('✅ تم حذف الحدث بنجاح');
      return true;
    } else {
      alert('خطأ: ' + result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ خطأ في حذف الحدث:', error);
    alert('حدث خطأ في حذف الحدث');
    return false;
  }
}

// وظائف إدارة الاقتراحات
async function addSuggestion(suggestionData) {
  try {
    const response = await fetch('/api/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(suggestionData)
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('✅ تم إضافة الاقتراح بنجاح');
      return true;
    } else {
      alert('خطأ: ' + result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ خطأ في إضافة الاقتراح:', error);
    alert('حدث خطأ في إضافة الاقتراح');
    return false;
  }
}

async function editSuggestion(suggestionId, suggestionData) {
  try {
    const response = await fetch('/api/suggestions/' + suggestionId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(suggestionData)
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('✅ تم تحديث الاقتراح بنجاح');
      return true;
    } else {
      alert('خطأ: ' + result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ خطأ في تحديث الاقتراح:', error);
    alert('حدث خطأ في تحديث الاقتراح');
    return false;
  }
}

async function deleteSuggestion(suggestionId) {
  try {
    if (!confirm('هل أنت متأكد من حذف هذا الاقتراح؟')) {
      return false;
    }
    
    const response = await fetch('/api/suggestions/' + suggestionId, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('✅ تم حذف الاقتراح بنجاح');
      return true;
    } else {
      alert('خطأ: ' + result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ خطأ في حذف الاقتراح:', error);
    alert('حدث خطأ في حذف الاقتراح');
    return false;
  }
}

// وظائف إدارة المكتبة
async function addLibraryItem(itemData) {
  try {
    const response = await fetch('/api/library', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itemData)
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('✅ تم إضافة العنصر للمكتبة بنجاح');
      return true;
    } else {
      alert('خطأ: ' + result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ خطأ في إضافة العنصر:', error);
    alert('حدث خطأ في إضافة العنصر');
    return false;
  }
}

async function editLibraryItem(itemId, itemData) {
  try {
    const response = await fetch('/api/library/' + itemId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itemData)
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('✅ تم تحديث العنصر بنجاح');
      return true;
    } else {
      alert('خطأ: ' + result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ خطأ في تحديث العنصر:', error);
    alert('حدث خطأ في تحديث العنصر');
    return false;
  }
}

async function deleteLibraryItem(itemId) {
  try {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      return false;
    }
    
    const response = await fetch('/api/library/' + itemId, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('✅ تم حذف العنصر بنجاح');
      return true;
    } else {
      alert('خطأ: ' + result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ خطأ في حذف العنصر:', error);
    alert('حدث خطأ في حذف العنصر');
    return false;
  }
}

// تصدير الدوال للاستخدام العام
window.loadFamilyData = loadFamilyData;
window.loadDashboardStats = loadDashboardStats;
window.loadEventsData = loadEventsData;
window.loadSuggestionsData = loadSuggestionsData;
window.loadLibraryData = loadLibraryData;
window.dbManager = new DatabaseManager();
window.logout = logout;
window.addFamilyMember = addFamilyMember;
window.editFamilyMember = editFamilyMember;
window.deleteFamilyMember = deleteFamilyMember;
window.addEvent = addEvent;
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;
window.addSuggestion = addSuggestion;
window.editSuggestion = editSuggestion;
window.deleteSuggestion = deleteSuggestion;
window.addLibraryItem = addLibraryItem;
window.editLibraryItem = editLibraryItem;
window.deleteLibraryItem = deleteLibraryItem;

console.log('🚀 تم تحميل JavaScript بنجاح');
`;
  
  return c.text(appJsContent, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache'
    }
  })
})

// === API Routes ===

// === Authentication & Authorization APIs ===

// تسجيل دخول المستخدم
app.post('/api/auth/login', async (c) => {
  try {
    const { env } = c
    const { email, password } = await c.req.json()
    
    if (!email || !password) {
      return c.json({
        status: 'error',
        message: 'البريد الإلكتروني وكلمة المرور مطلوبان'
      }, 400)
    }
    
    // البحث عن المستخدم
    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE email = ? AND status = "active"'
    ).bind(email).first() as DBUser | null
    
    if (!user) {
      return c.json({
        status: 'error',
        message: 'بيانات المصادقة غير صحيحة'
      }, 401)
    }
    
    // التحقق من كلمة المرور (بسيط لأغراض التطوير)
    // في الإنتاج، استخدم bcrypt للتحقق الآمن
    const passwordHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
    
    if (user.password_hash !== passwordHash) {
      return c.json({
        status: 'error',
        message: 'بيانات المصادقة غير صحيحة'
      }, 401)
    }
    
    // إنشاء جلسة جديدة
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
    const sessionToken = 'token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 20)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 ساعة
    
    await env.DB.prepare(`
      INSERT INTO user_sessions (id, user_id, session_token, expires_at, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      sessionId,
      user.id,
      sessionToken,
      expiresAt,
      c.req.header('cf-connecting-ip') || 'unknown',
      c.req.header('user-agent') || 'unknown'
    ).run()
    
    // تحديث آخر تسجيل دخول
    await env.DB.prepare(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(user.id).run()
    
    // إخفاء كلمة المرور من الاستجابة
    const { password_hash, ...userWithoutPassword } = user
    
    return c.json({
      status: 'success',
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        user: userWithoutPassword,
        session: {
          token: sessionToken,
          expires_at: expiresAt
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في تسجيل الدخول',
      error: error.message
    }, 500)
  }
})

// تسجيل مستخدم جديد
app.post('/api/auth/register', async (c) => {
  try {
    const { env } = c
    const data = await c.req.json()
    
    const { 
      email, 
      password, 
      first_name, 
      middle_name,
      last_name, 
      phone,
      city,
      country,
      gender,
      birth_date,
      profession 
    } = data
    
    if (!email || !password || !first_name || !last_name) {
      return c.json({
        status: 'error',
        message: 'البيانات المطلوبة: البريد الإلكتروني، كلمة المرور، الاسم الأول، الاسم الأخير'
      }, 400)
    }
    
    // التحقق من عدم وجود المستخدم مسبقاً
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first()
    
    if (existingUser) {
      return c.json({
        status: 'error',
        message: 'البريد الإلكتروني مسجل مسبقاً'
      }, 400)
    }
    
    // إنشاء المستخدم الجديد
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
    const fullName = `${first_name}${middle_name ? ' ' + middle_name : ''} ${last_name}`
    const passwordHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // مؤقتاً للتطوير
    
    await env.DB.prepare(`
      INSERT INTO users (
        id, email, first_name, middle_name, last_name, full_name, 
        password_hash, role, status, phone, city, country, gender, 
        birth_date, profession, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      userId,
      email,
      first_name,
      middle_name || null,
      last_name,
      fullName,
      passwordHash,
      'member', // الدور الافتراضي
      'pending', // يحتاج موافقة المدير
      phone || null,
      city || null,
      country || null,
      gender || null,
      birth_date || null,
      profession || null
    ).run()
    
    return c.json({
      status: 'success',
      message: 'تم إنشاء الحساب بنجاح. سيتم مراجعة طلبك من قبل الإدارة.',
      data: { id: userId, email, full_name: fullName, status: 'pending' }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في إنشاء الحساب',
      error: error.message
    }, 500)
  }
})

// التحقق من صحة الجلسة
app.get('/api/auth/verify', async (c) => {
  try {
    const { env } = c
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        status: 'error',
        message: 'رمز المصادقة مطلوب'
      }, 401)
    }
    
    const token = authHeader.substring(7)
    
    // البحث عن الجلسة
    const session = await env.DB.prepare(`
      SELECT s.*, u.* FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ? AND s.is_active = true AND s.expires_at > datetime('now')
    `).bind(token).first()
    
    if (!session) {
      return c.json({
        status: 'error',
        message: 'جلسة غير صالحة أو منتهية الصلاحية'
      }, 401)
    }
    
    // تحديث آخر نشاط
    await env.DB.prepare(
      'UPDATE user_sessions SET last_activity = CURRENT_TIMESTAMP WHERE session_token = ?'
    ).bind(token).run()
    
    // إخفاء كلمة المرور
    const { password_hash, ...userWithoutPassword } = session as any
    
    return c.json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        session: {
          token: session.session_token,
          expires_at: session.expires_at
        }
      }
    })
  } catch (error) {
    console.error('Verify session error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في التحقق من الجلسة',
      error: error.message
    }, 500)
  }
})

// تسجيل الخروج
app.post('/api/auth/logout', async (c) => {
  try {
    const { env } = c
    const authHeader = c.req.header('Authorization')
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      
      // إلغاء تفعيل الجلسة
      await env.DB.prepare(
        'UPDATE user_sessions SET is_active = false WHERE session_token = ?'
      ).bind(token).run()
    }
    
    return c.json({
      status: 'success',
      message: 'تم تسجيل الخروج بنجاح'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في تسجيل الخروج',
      error: error.message
    }, 500)
  }
})

// الحصول على صلاحيات المستخدم
app.get('/api/auth/permissions/:userId', async (c) => {
  try {
    const { env } = c
    const userId = c.req.param('userId')
    
    // الحصول على صلاحيات الدور
    const rolePermissions = await env.DB.prepare(`
      SELECT p.* FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN roles r ON rp.role_id = r.id
      JOIN users u ON u.role = r.name
      WHERE u.id = ? AND r.is_active = true
    `).bind(userId).all()
    
    // الحصول على الصلاحيات المخصصة للمستخدم
    const userPermissions = await env.DB.prepare(`
      SELECT p.*, up.granted FROM permissions p
      JOIN user_permissions up ON p.id = up.permission_id
      WHERE up.user_id = ? AND (up.expires_at IS NULL OR up.expires_at > datetime('now'))
    `).bind(userId).all()
    
    return c.json({
      status: 'success',
      data: {
        role_permissions: rolePermissions.results || [],
        user_permissions: userPermissions.results || []
      }
    })
  } catch (error) {
    console.error('Get permissions error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في جلب الصلاحيات',
      error: error.message
    }, 500)
  }
})

// === User Management APIs ===

// الموافقة على مستخدم معلق
app.post('/api/users/:id/approve', async (c) => {
  try {
    const { env } = c
    const userId = c.req.param('id')
    const { approved_by } = await c.req.json()
    
    await env.DB.prepare(`
      UPDATE users 
      SET status = 'active', approved_at = CURRENT_TIMESTAMP, approved_by = ? 
      WHERE id = ? AND status = 'pending'
    `).bind(approved_by, userId).run()
    
    return c.json({
      status: 'success',
      message: 'تم قبول المستخدم بنجاح'
    })
  } catch (error) {
    console.error('Approve user error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في قبول المستخدم',
      error: error.message
    }, 500)
  }
})

// رفض مستخدم معلق
app.post('/api/users/:id/reject', async (c) => {
  try {
    const { env } = c
    const userId = c.req.param('id')
    
    await env.DB.prepare(
      'UPDATE users SET status = "rejected" WHERE id = ? AND status = "pending"'
    ).bind(userId).run()
    
    return c.json({
      status: 'success',
      message: 'تم رفض المستخدم'
    })
  } catch (error) {
    console.error('Reject user error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في رفض المستخدم',
      error: error.message
    }, 500)
  }
})

// تحديث دور المستخدم
app.put('/api/users/:id/role', async (c) => {
  try {
    const { env } = c
    const userId = c.req.param('id')
    const { role } = await c.req.json()
    
    await env.DB.prepare(
      'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(role, userId).run()
    
    return c.json({
      status: 'success',
      message: 'تم تحديث الدور بنجاح'
    })
  } catch (error) {
    console.error('Update role error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في تحديث الدور',
      error: error.message
    }, 500)
  }
})

// صفحة اختبار الدوال
app.get('/test-functions', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>اختبار دوال إضافة الأحداث</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="p-8 bg-gray-100">
        <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h1 class="text-2xl font-bold mb-4">اختبار دوال الأحداث</h1>
            
            <button id="testBtn" onclick="testAddEvent()" 
                    class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all mb-4">
                اختبار إضافة حدث
            </button>
            
            <div id="result" class="hidden p-4 rounded-lg"></div>
        </div>
        
        <script>
            // نسخة مبسطة من دالة إضافة الحدث للاختبار
            function testAddEvent() {
                console.log('🧪 بدء اختبار إضافة الحدث...');
                
                try {
                    // تجربة دالة showSimpleAlert
                    showSimpleAlert('اختبار التنبيهات يعمل!', 'success');
                    
                    // تجربة النموذج المبسط
                    const title = prompt('اسم الحدث (اختبار):') || 'حدث تجريبي';
                    
                    if (title) {
                        // إرسال البيانات للـ API
                        fetch('/api/events', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                title: title,
                                description: 'حدث تجريبي من صفحة الاختبار',
                                event_type: 'general',
                                event_date: '2024-12-31T10:00',
                                location: 'موقع تجريبي',
                                organizer_id: 'test_user'
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            const resultDiv = document.getElementById('result');
                            resultDiv.classList.remove('hidden');
                            
                            if (data.status === 'success') {
                                resultDiv.className = 'p-4 rounded-lg bg-green-100 border border-green-400 text-green-800';
                                resultDiv.innerHTML = '✅ تم إنشاء الحدث بنجاح!<br>الاسم: ' + data.data.title;
                            } else {
                                resultDiv.className = 'p-4 rounded-lg bg-red-100 border border-red-400 text-red-800';
                                resultDiv.innerHTML = '❌ فشل في إنشاء الحدث: ' + data.message;
                            }
                        })
                        .catch(error => {
                            console.error('خطأ في الاختبار:', error);
                            const resultDiv = document.getElementById('result');
                            resultDiv.classList.remove('hidden');
                            resultDiv.className = 'p-4 rounded-lg bg-red-100 border border-red-400 text-red-800';
                            resultDiv.innerHTML = '❌ خطأ في الشبكة: ' + error.message;
                        });
                    }
                } catch (error) {
                    console.error('خطأ في تنفيذ الاختبار:', error);
                    alert('خطأ: ' + error.message);
                }
            }
            
            // دالة showSimpleAlert للاختبار
            function showSimpleAlert(message, type) {
                const alertClass = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
                const alertDiv = document.createElement('div');
                alertDiv.className = 'fixed top-4 right-4 ' + alertClass + ' text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md';
                alertDiv.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle') + ' ml-2"></i>' + message;
                document.body.appendChild(alertDiv);
                
                setTimeout(() => {
                    if (alertDiv.parentElement) {
                        alertDiv.style.opacity = '0';
                        alertDiv.style.transform = 'translateY(-20px)';
                        alertDiv.style.transition = 'all 0.3s ease';
                        setTimeout(() => alertDiv.remove(), 300);
                    }
                }, 3000);
            }
            
            console.log('✅ صفحة اختبار الدوال جاهزة');
        </script>
    </body>
    </html>
  `)
})

// اختبار قاعدة البيانات
app.get('/api/test', async (c) => {
  try {
    const { env } = c
    
    // اختبار الاتصال بقاعدة البيانات
    const result = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first()
    
    return c.json({
      status: 'success',
      message: 'قاعدة البيانات تعمل بنجاح!',
      users_count: result?.count || 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database test error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في الاتصال بقاعدة البيانات',
      error: error.message
    }, 500)
  }
})

// === Users API ===

// الحصول على جميع المستخدمين
app.get('/api/users', async (c) => {
  try {
    const { env } = c
    const { results } = await env.DB.prepare('SELECT * FROM users ORDER BY created_at DESC').all()
    
    return c.json({
      status: 'success',
      data: results,
      count: results.length
    })
  } catch (error) {
    console.error('Get users error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في جلب المستخدمين',
      error: error.message
    }, 500)
  }
})

// الحصول على المستخدمين النشطين
app.get('/api/users/active', async (c) => {
  try {
    const { env } = c
    const { results } = await env.DB.prepare(
      "SELECT * FROM users WHERE status = 'active' ORDER BY created_at DESC"
    ).all()
    
    return c.json({
      status: 'success',
      data: results,
      count: results.length
    })
  } catch (error) {
    console.error('Get active users error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في جلب المستخدمين النشطين',
      error: error.message
    }, 500)
  }
})

// الحصول على المستخدمين المعلقين
app.get('/api/users/pending', async (c) => {
  try {
    const { env } = c
    const { results } = await env.DB.prepare(
      "SELECT * FROM users WHERE status = 'pending' ORDER BY created_at DESC"
    ).all()
    
    return c.json({
      status: 'success',
      data: results,
      count: results.length
    })
  } catch (error) {
    console.error('Get pending users error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في جلب المستخدمين المعلقين',
      error: error.message
    }, 500)
  }
})

// الحصول على مستخدم بواسطة المعرف
app.get('/api/users/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')
    
    const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first()
    
    if (!user) {
      return c.json({
        status: 'error',
        message: 'المستخدم غير موجود'
      }, 404)
    }
    
    return c.json({
      status: 'success',
      data: user
    })
  } catch (error) {
    console.error('Get user error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في جلب المستخدم',
      error: error.message
    }, 500)
  }
})

// إضافة مستخدم جديد
app.post('/api/users', async (c) => {
  try {
    const { env } = c
    const userData = await c.req.json()
    
    // إنشاء معرف فريد
    const id = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
    
    // إدراج المستخدم
    await env.DB.prepare(`
      INSERT INTO users (
        id, national_id, first_name, middle_name, last_name, full_name,
        email, phone, password_hash, role, status, birth_date, birth_place,
        profession, specialization, hobbies, father_id, generation,
        city, district, country, gender, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, userData.national_id, userData.first_name, userData.middle_name,
      userData.last_name, userData.full_name, userData.email, userData.phone,
      userData.password_hash, userData.role || 'user', userData.status || 'pending',
      userData.birth_date, userData.birth_place, userData.profession,
      userData.specialization, userData.hobbies, userData.father_id,
      userData.generation || 1, userData.city, userData.district,
      userData.country, userData.gender, userData.notes
    ).run()
    
    // تسجيل النشاط
    await logActivity(env.DB, 'users', id, 'insert', null, userData)
    
    return c.json({
      status: 'success',
      message: 'تم إضافة المستخدم بنجاح',
      data: { id, ...userData }
    })
  } catch (error) {
    console.error('Create user error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في إضافة المستخدم',
      error: error.message
    }, 500)
  }
})

// تحديث مستخدم
app.put('/api/users/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')
    const userData = await c.req.json()
    
    // التحقق من وجود المستخدم
    const existingUser = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first()
    if (!existingUser) {
      return c.json({
        status: 'error',
        message: 'المستخدم غير موجود'
      }, 404)
    }
    
    // تحديث المستخدم
    await env.DB.prepare(`
      UPDATE users SET
        national_id = ?, first_name = ?, middle_name = ?, last_name = ?,
        full_name = ?, email = ?, phone = ?, role = ?, status = ?,
        birth_date = ?, birth_place = ?, profession = ?, specialization = ?,
        hobbies = ?, father_id = ?, generation = ?, city = ?, district = ?,
        country = ?, gender = ?, notes = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      userData.national_id, userData.first_name, userData.middle_name,
      userData.last_name, userData.full_name, userData.email, userData.phone,
      userData.role, userData.status, userData.birth_date, userData.birth_place,
      userData.profession, userData.specialization, userData.hobbies,
      userData.father_id, userData.generation, userData.city, userData.district,
      userData.country, userData.gender, userData.notes, id
    ).run()
    
    // تسجيل النشاط
    await logActivity(env.DB, 'users', id, 'update', null, userData)
    
    return c.json({
      status: 'success',
      message: 'تم تحديث المستخدم بنجاح'
    })
  } catch (error) {
    console.error('Update user error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في تحديث المستخدم',
      error: error.message
    }, 500)
  }
})

// حذف مستخدم
app.delete('/api/users/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')
    
    // التحقق من وجود المستخدم
    const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first()
    if (!user) {
      return c.json({
        status: 'error',
        message: 'المستخدم غير موجود'
      }, 404)
    }
    
    // حذف المستخدم
    await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run()
    
    // تسجيل النشاط
    await logActivity(env.DB, 'users', id, 'delete', null, user)
    
    return c.json({
      status: 'success',
      message: 'تم حذف المستخدم بنجاح'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في حذف المستخدم',
      error: error.message
    }, 500)
  }
})

// === Family Members API ===

// الحصول على جميع أعضاء العائلة
app.get('/api/family-members', async (c) => {
  try {
    const { env } = c
    const { results } = await env.DB.prepare('SELECT * FROM family_members ORDER BY generation, created_at').all()
    
    return c.json({
      status: 'success',
      data: results,
      count: results.length
    })
  } catch (error) {
    console.error('Get family members error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في جلب أعضاء العائلة',
      error: error.message
    }, 500)
  }
})

// إضافة عضو عائلة جديد
app.post('/api/family-members', async (c) => {
  try {
    const { env } = c
    const memberData = await c.req.json()
    
    // إنشاء معرف فريد
    const id = 'family_member_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
    
    // تقسيم الاسم الكامل إلى first_name و last_name
    const nameParts = (memberData.full_name || '').split(' ')
    const firstName = nameParts[0] || 'غير محدد'
    const lastName = nameParts.slice(1).join(' ') || 'غير محدد'
    
    // إدراج عضو العائلة - استخدام الأعمدة الموجودة فقط
    await env.DB.prepare(`
      INSERT INTO family_members (
        id, first_name, last_name, full_name, generation, phone, email, profession,
        bio, birth_date, father_id, is_alive, gender, member_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, 
      firstName,
      lastName,
      memberData.full_name || '',
      memberData.generation || 1,
      memberData.phone || null,
      memberData.email || null,
      memberData.field_of_excellence || null, // سيُحفظ في profession
      memberData.achievements || null, // سيُحفظ في bio
      memberData.birth_date || null,
      memberData.father_id || null,
      true,
      memberData.gender || 'male',
      memberData.member_type || 'founder'
    ).run()
    
    // تسجيل النشاط
    await logActivity(env.DB, 'family_members', id, 'insert', null, memberData)
    
    return c.json({
      status: 'success',
      message: 'تم إضافة عضو العائلة بنجاح',
      data: { id, ...memberData }
    })
  } catch (error) {
    console.error('Create family member error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في إضافة عضو العائلة',
      error: error.message
    }, 500)
  }
})

// الحصول على عضو عائلة واحد
app.get('/api/family-members/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')
    
    const member = await env.DB.prepare('SELECT * FROM family_members WHERE id = ?').bind(id).first()
    
    if (!member) {
      return c.json({
        status: 'error',
        message: 'العضو غير موجود'
      }, 404)
    }
    
    return c.json({
      status: 'success',
      data: member
    })
  } catch (error) {
    console.error('Get family member error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في جلب بيانات العضو',
      error: error.message
    }, 500)
  }
})

// تحديث عضو عائلة
app.put('/api/family-members/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')
    const memberData = await c.req.json()
    
    // التحقق من وجود العضو
    const existingMember = await env.DB.prepare('SELECT * FROM family_members WHERE id = ?').bind(id).first()
    if (!existingMember) {
      return c.json({
        status: 'error',
        message: 'العضو غير موجود'
      }, 404)
    }
    
    // تقسيم الاسم الكامل
    const nameParts = (memberData.full_name || '').split(' ')
    const firstName = nameParts[0] || existingMember.first_name
    const lastName = nameParts.slice(1).join(' ') || existingMember.last_name
    
    // تحديث العضو
    await env.DB.prepare(`
      UPDATE family_members SET
        first_name = ?, last_name = ?, full_name = ?, generation = ?,
        phone = ?, email = ?, profession = ?, bio = ?, birth_date = ?,
        father_id = ?, gender = ?, member_type = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      firstName,
      lastName,
      memberData.full_name || existingMember.full_name,
      memberData.generation || existingMember.generation,
      memberData.phone || existingMember.phone,
      memberData.email || existingMember.email,
      memberData.profession || existingMember.profession,
      memberData.bio || existingMember.bio,
      memberData.birth_date || existingMember.birth_date,
      memberData.father_id || existingMember.father_id,
      memberData.gender || existingMember.gender,
      memberData.member_type || existingMember.member_type,
      id
    ).run()
    
    // تسجيل النشاط
    await logActivity(env.DB, 'family_members', id, 'update', null, memberData)
    
    return c.json({
      status: 'success',
      message: 'تم تحديث العضو بنجاح'
    })
  } catch (error) {
    console.error('Update family member error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في تحديث العضو',
      error: error.message
    }, 500)
  }
})

// حذف عضو عائلة
app.delete('/api/family-members/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')
    
    // التحقق من وجود العضو
    const member = await env.DB.prepare('SELECT * FROM family_members WHERE id = ?').bind(id).first()
    if (!member) {
      return c.json({
        status: 'error',
        message: 'العضو غير موجود'
      }, 404)
    }
    
    // التحقق من وجود أطفال مرتبطين
    const childrenCount = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM family_members WHERE father_id = ?'
    ).bind(id).first()
    
    if (childrenCount && childrenCount.count > 0) {
      return c.json({
        status: 'error',
        message: 'لا يمكن حذف العضو لوجود أعضاء مرتبطين به'
      }, 400)
    }
    
    // حذف العضو
    await env.DB.prepare('DELETE FROM family_members WHERE id = ?').bind(id).run()
    
    // تسجيل النشاط
    await logActivity(env.DB, 'family_members', id, 'delete', null, member)
    
    return c.json({
      status: 'success',
      message: 'تم حذف العضو بنجاح'
    })
  } catch (error) {
    console.error('Delete family member error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في حذف العضو',
      error: error.message
    }, 500)
  }
})

// === Events API ===

// الحصول على جميع الأحداث
app.get('/api/events', async (c) => {
  try {
    const { env } = c
    const { results } = await env.DB.prepare('SELECT * FROM events ORDER BY event_date DESC').all()
    
    return c.json({
      status: 'success',
      data: results,
      count: results.length
    })
  } catch (error) {
    console.error('Get events error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في جلب الأحداث',
      error: error.message
    }, 500)
  }
})

// إضافة حدث جديد
app.post('/api/events', async (c) => {
  try {
    const { env } = c
    const eventData = await c.req.json()
    
    // إنشاء معرف فريد
    const id = 'event_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
    
    // إدراج الحدث مع جميع الحقول المتقدمة
    await env.DB.prepare(`
      INSERT INTO events (
        id, title, description, event_type, event_date, location, 
        organizer_id, attendees_count, max_attendees, is_public, status,
        organizer_name, organizer_phone, expected_attendees, estimated_cost,
        registration_required, priority, additional_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      eventData.title || '',
      eventData.description || '',
      eventData.event_type || 'general',
      eventData.event_date || null,
      eventData.location || null,
      eventData.organizer_id || eventData.created_by || 'user_admin_001',
      eventData.attendees_count || 0,
      eventData.max_attendees || null,
      eventData.is_public !== false, // افتراضي true
      eventData.status || 'active',
      eventData.organizer_name || null,
      eventData.organizer_phone || null,
      eventData.expected_attendees || null,
      eventData.estimated_cost || null,
      eventData.registration_required || 'no',
      eventData.priority || 'medium',
      eventData.additional_notes || null
    ).run()
    
    // تسجيل النشاط - معطل مؤقتاً لحل مشكلة الخطأ
    // await logActivity(env.DB, 'events', id, 'insert', null, eventData)
    
    return c.json({
      status: 'success',
      message: 'تم إضافة الحدث بنجاح',
      data: { id, ...eventData }
    })
  } catch (error) {
    console.error('Create event error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في إضافة الحدث',
      error: error.message
    }, 500)
  }
})

// الحصول على حدث واحد
app.get('/api/events/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')
    
    const event = await env.DB.prepare('SELECT * FROM events WHERE id = ?').bind(id).first()
    
    if (!event) {
      return c.json({
        status: 'error',
        message: 'الحدث غير موجود'
      }, 404)
    }
    
    return c.json({
      status: 'success',
      data: event
    })
  } catch (error) {
    console.error('Get event error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في جلب بيانات الحدث',
      error: error.message
    }, 500)
  }
})

// تحديث حدث
app.put('/api/events/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')
    const eventData = await c.req.json()
    
    // التحقق من وجود الحدث
    const existingEvent = await env.DB.prepare('SELECT * FROM events WHERE id = ?').bind(id).first()
    if (!existingEvent) {
      return c.json({
        status: 'error',
        message: 'الحدث غير موجود'
      }, 404)
    }
    
    // تحديث الحدث
    await env.DB.prepare(`
      UPDATE events SET
        title = ?, description = ?, event_type = ?, event_date = ?,
        location = ?, organizer_id = ?, attendees_count = ?, max_attendees = ?,
        is_public = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      eventData.title || existingEvent.title,
      eventData.description || existingEvent.description,
      eventData.event_type || existingEvent.event_type,
      eventData.event_date || existingEvent.event_date,
      eventData.location || existingEvent.location,
      eventData.organizer_id || existingEvent.organizer_id,
      eventData.attendees_count || existingEvent.attendees_count,
      eventData.max_attendees || existingEvent.max_attendees,
      eventData.is_public !== undefined ? eventData.is_public : existingEvent.is_public,
      eventData.status || existingEvent.status,
      id
    ).run()
    
    // تسجيل النشاط - معطل مؤقتاً لحل مشكلة الخطأ
    // await logActivity(env.DB, 'events', id, 'update', null, eventData)
    
    return c.json({
      status: 'success',
      message: 'تم تحديث الحدث بنجاح'
    })
  } catch (error) {
    console.error('Update event error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في تحديث الحدث',
      error: error.message
    }, 500)
  }
})

// حذف حدث
app.delete('/api/events/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')
    
    // التحقق من وجود الحدث
    const event = await env.DB.prepare('SELECT * FROM events WHERE id = ?').bind(id).first()
    if (!event) {
      return c.json({
        status: 'error',
        message: 'الحدث غير موجود'
      }, 404)
    }
    
    // حذف الحدث
    await env.DB.prepare('DELETE FROM events WHERE id = ?').bind(id).run()
    
    // تسجيل النشاط - معطل مؤقتاً لحل مشكلة الخطأ
    // await logActivity(env.DB, 'events', id, 'delete', null, event)
    
    return c.json({
      status: 'success',
      message: 'تم حذف الحدث بنجاح'
    })
  } catch (error) {
    console.error('Delete event error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في حذف الحدث',
      error: error.message
    }, 500)
  }
})

// === Suggestions API ===

// الحصول على جميع الاقتراحات
app.get('/api/suggestions', async (c) => {
  try {
    const { env } = c
    const { results } = await env.DB.prepare('SELECT * FROM suggestions ORDER BY created_at DESC').all()
    
    return c.json({
      status: 'success',
      data: results,
      count: results.length
    })
  } catch (error) {
    console.error('Get suggestions error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في جلب الاقتراحات',
      error: error.message
    }, 500)
  }
})

// إضافة اقتراح جديد
app.post('/api/suggestions', async (c) => {
  try {
    const { env } = c
    const suggestionData = await c.req.json()
    
    // إنشاء معرف فريد
    const id = 'suggestion_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
    
    // إدراج الاقتراح
    await env.DB.prepare(`
      INSERT INTO suggestions (
        id, title, description, category, priority, status,
        benefits, implementation_details, budget_estimate, timeline_estimate,
        required_resources, votes_for, votes_against, submitted_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      suggestionData.title || '',
      suggestionData.description || '',
      suggestionData.category || 'general',
      suggestionData.priority || 'medium',
      suggestionData.status || 'pending',
      suggestionData.benefits || null,
      suggestionData.implementation_details || null,
      suggestionData.budget_estimate || null,
      suggestionData.timeline_estimate || null,
      suggestionData.required_resources || null,
      0, // votes_for
      0, // votes_against
      suggestionData.submitted_by || 'anonymous'
    ).run()
    
    // تسجيل النشاط - معطل مؤقتاً لحل مشكلة الخطأ
    // await logActivity(env.DB, 'suggestions', id, 'insert', null, suggestionData)
    
    return c.json({
      status: 'success',
      message: 'تم إضافة الاقتراح بنجاح',
      data: { id, ...suggestionData }
    })
  } catch (error) {
    console.error('Create suggestion error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في إضافة الاقتراح',
      error: error.message
    }, 500)
  }
})

// الحصول على اقتراح واحد
app.get('/api/suggestions/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')
    
    const suggestion = await env.DB.prepare('SELECT * FROM suggestions WHERE id = ?').bind(id).first()
    
    if (!suggestion) {
      return c.json({
        status: 'error',
        message: 'الاقتراح غير موجود'
      }, 404)
    }
    
    return c.json({
      status: 'success',
      data: suggestion
    })
  } catch (error) {
    console.error('Get suggestion error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في جلب بيانات الاقتراح',
      error: error.message
    }, 500)
  }
})

// تحديث اقتراح
app.put('/api/suggestions/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')
    const suggestionData = await c.req.json()
    
    // التحقق من وجود الاقتراح
    const existingSuggestion = await env.DB.prepare('SELECT * FROM suggestions WHERE id = ?').bind(id).first()
    if (!existingSuggestion) {
      return c.json({
        status: 'error',
        message: 'الاقتراح غير موجود'
      }, 404)
    }
    
    // تحديث الاقتراح
    await env.DB.prepare(`
      UPDATE suggestions SET
        title = ?, description = ?, category = ?, priority = ?, status = ?,
        benefits = ?, implementation_details = ?, budget_estimate = ?,
        timeline_estimate = ?, required_resources = ?, reviewed_by = ?,
        reviewed_at = CASE WHEN ? IS NOT NULL THEN CURRENT_TIMESTAMP ELSE reviewed_at END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      suggestionData.title || existingSuggestion.title,
      suggestionData.description || existingSuggestion.description,
      suggestionData.category || existingSuggestion.category,
      suggestionData.priority || existingSuggestion.priority,
      suggestionData.status || existingSuggestion.status,
      suggestionData.benefits || existingSuggestion.benefits,
      suggestionData.implementation_details || existingSuggestion.implementation_details,
      suggestionData.budget_estimate || existingSuggestion.budget_estimate,
      suggestionData.timeline_estimate || existingSuggestion.timeline_estimate,
      suggestionData.required_resources || existingSuggestion.required_resources,
      suggestionData.reviewed_by || existingSuggestion.reviewed_by,
      suggestionData.reviewed_by, // للشرط
      id
    ).run()
    
    // تسجيل النشاط
    // await logActivity(env.DB, 'suggestions', id, 'update', null, suggestionData)
    
    return c.json({
      status: 'success',
      message: 'تم تحديث الاقتراح بنجاح'
    })
  } catch (error) {
    console.error('Update suggestion error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في تحديث الاقتراح',
      error: error.message
    }, 500)
  }
})

// حذف اقتراح
app.delete('/api/suggestions/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')
    
    // التحقق من وجود الاقتراح
    const suggestion = await env.DB.prepare('SELECT * FROM suggestions WHERE id = ?').bind(id).first()
    if (!suggestion) {
      return c.json({
        status: 'error',
        message: 'الاقتراح غير موجود'
      }, 404)
    }
    
    // حذف الاقتراح
    await env.DB.prepare('DELETE FROM suggestions WHERE id = ?').bind(id).run()
    
    // تسجيل النشاط
    // await logActivity(env.DB, 'suggestions', id, 'delete', null, suggestion)
    
    return c.json({
      status: 'success',
      message: 'تم حذف الاقتراح بنجاح'
    })
  } catch (error) {
    console.error('Delete suggestion error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في حذف الاقتراح',
      error: error.message
    }, 500)
  }
})

// === Library API ===

// الحصول على جميع عناصر المكتبة
app.get('/api/library', async (c) => {
  try {
    const { env } = c
    const { results } = await env.DB.prepare('SELECT * FROM library_items ORDER BY created_at DESC').all()
    
    return c.json({
      status: 'success',
      data: results,
      count: results.length
    })
  } catch (error) {
    console.error('Get library items error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في جلب عناصر المكتبة',
      error: error.message
    }, 500)
  }
})

// إضافة عنصر جديد للمكتبة الرقمية
app.post('/api/library', async (c) => {
  try {
    const { env } = c
    const libraryData = await c.req.json()
    
    // إنشاء معرف فريد
    const id = 'library_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
    
    // إدراج عنصر المكتبة
    await env.DB.prepare(`
      INSERT INTO library_items (
        id, title, description, content_type, category, access_level,
        file_url, file_size, file_type, author, keywords, 
        featured, view_count, download_count, uploaded_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      libraryData.title || '',
      libraryData.description || '',
      libraryData.content_type || 'document',
      libraryData.category || 'general',
      libraryData.access_level || 'family',
      libraryData.file_url || null,
      libraryData.file_size || null,
      libraryData.file_type || null,
      libraryData.author || null,
      libraryData.keywords || null,
      libraryData.featured || false,
      0, // view_count
      0, // download_count
      libraryData.uploaded_by || 'anonymous'
    ).run()
    
    // تسجيل النشاط - معطل مؤقتاً لحل مشكلة الخطأ
    // await logActivity(env.DB, 'library_items', id, 'insert', null, libraryData)
    
    return c.json({
      status: 'success',
      message: 'تم إضافة العنصر للمكتبة بنجاح',
      data: { id, ...libraryData }
    })
  } catch (error) {
    console.error('Create library item error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في إضافة عنصر للمكتبة',
      error: error.message
    }, 500)
  }
})

// الحصول على عنصر واحد من المكتبة
app.get('/api/library/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')
    
    const item = await env.DB.prepare('SELECT * FROM library_items WHERE id = ?').bind(id).first()
    
    if (!item) {
      return c.json({
        status: 'error',
        message: 'العنصر غير موجود'
      }, 404)
    }
    
    return c.json({
      status: 'success',
      data: item
    })
  } catch (error) {
    console.error('Get library item error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في جلب بيانات العنصر',
      error: error.message
    }, 500)
  }
})

// تحديث عنصر في المكتبة
app.put('/api/library/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')
    const libraryData = await c.req.json()
    
    // التحقق من وجود العنصر
    const existingItem = await env.DB.prepare('SELECT * FROM library_items WHERE id = ?').bind(id).first()
    if (!existingItem) {
      return c.json({
        status: 'error',
        message: 'العنصر غير موجود'
      }, 404)
    }
    
    // تحديث العنصر
    await env.DB.prepare(`
      UPDATE library_items SET
        title = ?, description = ?, content_type = ?, category = ?,
        access_level = ?, file_url = ?, file_size = ?, file_type = ?,
        author = ?, keywords = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      libraryData.title || existingItem.title,
      libraryData.description || existingItem.description,
      libraryData.content_type || existingItem.content_type,
      libraryData.category || existingItem.category,
      libraryData.access_level || existingItem.access_level,
      libraryData.file_url || existingItem.file_url,
      libraryData.file_size || existingItem.file_size,
      libraryData.file_type || existingItem.file_type,
      libraryData.author || existingItem.author,
      libraryData.keywords || existingItem.keywords,
      libraryData.featured !== undefined ? libraryData.featured : existingItem.featured,
      id
    ).run()
    
    // تسجيل النشاط
    // await logActivity(env.DB, 'library_items', id, 'update', null, libraryData)
    
    return c.json({
      status: 'success',
      message: 'تم تحديث العنصر بنجاح'
    })
  } catch (error) {
    console.error('Update library item error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في تحديث العنصر',
      error: error.message
    }, 500)
  }
})

// حذف عنصر من المكتبة
app.delete('/api/library/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')
    
    // التحقق من وجود العنصر
    const item = await env.DB.prepare('SELECT * FROM library_items WHERE id = ?').bind(id).first()
    if (!item) {
      return c.json({
        status: 'error',
        message: 'العنصر غير موجود'
      }, 404)
    }
    
    // حذف العنصر
    await env.DB.prepare('DELETE FROM library_items WHERE id = ?').bind(id).run()
    
    // تسجيل النشاط
    // await logActivity(env.DB, 'library_items', id, 'delete', null, item)
    
    return c.json({
      status: 'success',
      message: 'تم حذف العنصر بنجاح'
    })
  } catch (error) {
    console.error('Delete library item error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في حذف العنصر',
      error: error.message
    }, 500)
  }
})

// === Activity Log API (للمزامنة) ===

// الحصول على آخر الأنشطة
app.get('/api/activity', async (c) => {
  try {
    const { env } = c
    const since = c.req.query('since') || '1970-01-01T00:00:00.000Z'
    
    const { results } = await env.DB.prepare(`
      SELECT * FROM activity_log 
      WHERE timestamp > ? 
      ORDER BY timestamp DESC 
      LIMIT 100
    `).bind(since).all()
    
    return c.json({
      status: 'success',
      data: results,
      count: results.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Get activity error:', error)
    return c.json({
      status: 'error',
      message: 'خطأ في جلب سجل النشاط',
      error: error.message
    }, 500)
  }
})

// === Helper Functions ===

// تسجيل النشاط لتتبع التغييرات
async function logActivity(
  db: D1Database, 
  tableName: string, 
  recordId: string, 
  action: string, 
  userId: string | null, 
  changes: any
) {
  try {
    const id = 'activity_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
    
    await db.prepare(`
      INSERT INTO activity_log (id, table_name, record_id, action, user_id, changes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      tableName,
      recordId,
      action,
      userId,
      JSON.stringify(changes)
    ).run()
    
    console.log(`Activity logged: ${action} on ${tableName}:${recordId}`)
  } catch (error) {
    console.error('Error logging activity:', error)
  }
}

// === Test Events Display Route ===
app.get('/test-events', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>اختبار عرض الأحداث</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100 p-8">
        <div class="max-w-6xl mx-auto">
            <div class="bg-white rounded-xl shadow-lg p-8">
                <h1 class="text-3xl font-bold text-center mb-8">
                    <i class="fas fa-calendar-alt text-green-600 ml-2"></i>
                    اختبار عرض الأحداث النهائي
                </h1>
                
                <div class="text-center mb-6">
                    <button onclick="loadEventsTest()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        <i class="fas fa-sync ml-2"></i>تحميل الأحداث
                    </button>
                    <a href="/app#events" class="ml-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block">
                        <i class="fas fa-arrow-left ml-2"></i>التطبيق الكامل
                    </a>
                </div>
                
                <!-- Events Display Area -->
                <div id="events-container">
                    <!-- Loading State -->
                    <div id="events-loading" class="text-center py-12">
                        <div class="loading-spinner mx-auto mb-4"></div>
                        <p class="text-gray-500">جاري تحميل الأحداث...</p>
                    </div>
                    
                    <!-- Events List -->
                    <div id="events-list" class="hidden space-y-4"></div>
                    
                    <!-- Empty State -->
                    <div id="events-empty" class="hidden text-center py-12">
                        <i class="fas fa-calendar-plus text-gray-400 text-6xl mb-4"></i>
                        <h3 class="text-xl font-bold text-gray-600 mb-2">لا توجد أحداث حالياً</h3>
                        <p class="text-gray-500 mb-6">ابدأ بإضافة أول حدث للعائلة</p>
                    </div>
                </div>
                
                <!-- Events Statistics -->
                <div id="events-stats" class="hidden mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold text-blue-600" id="total-events">0</div>
                        <div class="text-sm text-blue-700">إجمالي الأحداث</div>
                    </div>
                    <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold text-green-600" id="upcoming-events">0</div>
                        <div class="text-sm text-green-700">أحداث قادمة</div>
                    </div>
                    <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold text-yellow-600" id="this-month-events">0</div>
                        <div class="text-sm text-yellow-700">هذا الشهر</div>
                    </div>
                    <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold text-purple-600" id="high-priority-events">0</div>
                        <div class="text-sm text-purple-700">أولوية عالية</div>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .loading-spinner {
                border: 3px solid #f3f4f6;
                border-top: 3px solid #3b82f6;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>

        <script>
            // تحميل وعرض الأحداث
            async function loadEventsTest() {
                console.log('🔄 بدء تحميل الأحداث...');
                
                try {
                    // إظهار حالة التحميل
                    const loadingEl = document.getElementById('events-loading');
                    const listEl = document.getElementById('events-list');
                    const emptyEl = document.getElementById('events-empty');
                    const statsEl = document.getElementById('events-stats');
                    
                    if (loadingEl) loadingEl.classList.remove('hidden');
                    if (listEl) listEl.classList.add('hidden');
                    if (emptyEl) emptyEl.classList.add('hidden');
                    if (statsEl) statsEl.classList.add('hidden');
                    
                    // جلب البيانات من API
                    const response = await fetch('/api/events');
                    const result = await response.json();
                    
                    console.log('📊 نتيجة API:', result);
                    
                    if (result.status === 'success' && result.data) {
                        const events = result.data;
                        console.log(\`✅ تم تحميل \${events.length} حدث\`);
                        
                        // إخفاء حالة التحميل
                        if (loadingEl) loadingEl.classList.add('hidden');
                        
                        if (events.length === 0) {
                            // عرض حالة فارغة
                            if (emptyEl) emptyEl.classList.remove('hidden');
                        } else {
                            // عرض قائمة الأحداث
                            if (listEl) {
                                listEl.innerHTML = '';
                                events.forEach(event => {
                                    listEl.appendChild(createEventCard(event));
                                });
                                listEl.classList.remove('hidden');
                            }
                            
                            // تحديث الإحصائيات
                            updateEventsStats(events);
                            if (statsEl) statsEl.classList.remove('hidden');
                        }
                    } else {
                        throw new Error(result.message || 'خطأ في جلب البيانات');
                    }
                } catch (error) {
                    console.error('❌ خطأ في تحميل الأحداث:', error);
                    
                    // إخفاء التحميل وإظهار رسالة خطأ
                    const loadingEl = document.getElementById('events-loading');
                    if (loadingEl) {
                        loadingEl.innerHTML = \`
                            <div class="text-center py-12">
                                <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                                <p class="text-red-600 font-semibold">خطأ في تحميل الأحداث</p>
                                <p class="text-gray-500 text-sm mt-1">\${error.message}</p>
                                <button onclick="loadEventsTest()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                    <i class="fas fa-redo ml-1"></i>إعادة المحاولة
                                </button>
                            </div>
                        \`;
                    }
                }
            }

            // إنشاء بطاقة حدث
            function createEventCard(event) {
                console.log('🎯 إنشاء بطاقة للحدث:', event.title);
                
                const card = document.createElement('div');
                card.className = 'bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all';
                
                // تحديد لون الأولوية
                const priorityColors = {
                    'low': 'text-gray-500 bg-gray-100',
                    'medium': 'text-blue-600 bg-blue-100', 
                    'high': 'text-orange-600 bg-orange-100',
                    'urgent': 'text-red-600 bg-red-100'
                };
                
                const priorityLabels = {
                    'low': 'منخفضة',
                    'medium': 'متوسطة',
                    'high': 'عالية', 
                    'urgent': 'عاجلة'
                };
                
                // تحديد أيقونة النوع
                const typeIcons = {
                    'meeting': 'fas fa-users',
                    'celebration': 'fas fa-birthday-cake',
                    'educational': 'fas fa-graduation-cap',
                    'recreational': 'fas fa-gamepad',
                    'business': 'fas fa-briefcase',
                    'religious': 'fas fa-mosque',
                    'general': 'fas fa-calendar'
                };
                
                const typeLabels = {
                    'meeting': 'اجتماع عائلي',
                    'celebration': 'احتفال ومناسبة',
                    'educational': 'فعالية تعليمية',
                    'recreational': 'فعالية ترفيهية',
                    'business': 'فعالية تجارية',
                    'religious': 'مناسبة دينية',
                    'general': 'عام'
                };
                
                // تنسيق التاريخ
                const eventDate = new Date(event.event_date);
                const formattedDate = eventDate.toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                });
                const formattedTime = eventDate.toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                card.innerHTML = \`
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-gray-800 mb-2">
                                <i class="\${typeIcons[event.event_type] || 'fas fa-calendar'} text-green-600 ml-2"></i>
                                \${event.title || 'حدث بدون عنوان'}
                            </h3>
                            <p class="text-gray-600 text-sm">\${typeLabels[event.event_type] || 'نوع غير محدد'}</p>
                        </div>
                        <div class="text-left">
                            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold \${priorityColors[event.priority] || priorityColors['medium']}">
                                \${priorityLabels[event.priority] || 'متوسطة'}
                            </span>
                        </div>
                    </div>
                    
                    <div class="space-y-3 mb-4">
                        <div class="flex items-center text-gray-600">
                            <i class="fas fa-calendar-day text-blue-500 ml-3 w-5"></i>
                            <span class="font-medium">\${formattedDate}</span>
                        </div>
                        <div class="flex items-center text-gray-600">
                            <i class="fas fa-clock text-green-500 ml-3 w-5"></i>
                            <span>\${formattedTime}</span>
                        </div>
                        \${event.location ? \`
                            <div class="flex items-center text-gray-600">
                                <i class="fas fa-map-marker-alt text-red-500 ml-3 w-5"></i>
                                <span>\${event.location}</span>
                            </div>
                        \` : ''}
                        \${event.organizer_name ? \`
                            <div class="flex items-center text-gray-600">
                                <i class="fas fa-user-tie text-purple-500 ml-3 w-5"></i>
                                <span>المنظم: \${event.organizer_name}</span>
                                \${event.organizer_phone ? \`<span class="text-gray-500 mr-2">(\${event.organizer_phone})</span>\` : ''}
                            </div>
                        \` : ''}
                    </div>
                    
                    \${event.description ? \`
                        <div class="bg-gray-50 rounded-lg p-3 mb-4">
                            <p class="text-gray-700 text-sm">\${event.description}</p>
                        </div>
                    \` : ''}
                    
                    <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div class="flex space-x-2 space-x-reverse">
                            \${event.max_attendees ? \`
                                <span class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                    <i class="fas fa-users ml-1"></i>
                                    حد أقصى: \${event.max_attendees}
                                </span>
                            \` : ''}
                            \${event.estimated_cost ? \`
                                <span class="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                    <i class="fas fa-money-bill ml-1"></i>
                                    \${event.estimated_cost} ريال
                                </span>
                            \` : ''}
                        </div>
                        <div class="flex space-x-2 space-x-reverse">
                            <button onclick="alert('تعديل الحدث: ' + '\${event.title}')" class="text-blue-600 hover:text-blue-800 p-2 rounded" title="تعديل">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="alert('حذف الحدث: ' + '\${event.title}')" class="text-red-600 hover:text-red-800 p-2 rounded" title="حذف">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                \`;
                
                return card;
            }

            // تحديث إحصائيات الأحداث
            function updateEventsStats(events) {
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                
                // إجمالي الأحداث
                const totalEvents = events.length;
                
                // الأحداث القادمة
                const upcomingEvents = events.filter(event => {
                    const eventDate = new Date(event.event_date);
                    return eventDate > now;
                }).length;
                
                // أحداث هذا الشهر
                const thisMonthEvents = events.filter(event => {
                    const eventDate = new Date(event.event_date);
                    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
                }).length;
                
                // أحداث بأولوية عالية
                const highPriorityEvents = events.filter(event => 
                    event.priority === 'high' || event.priority === 'urgent'
                ).length;
                
                console.log(\`📊 الإحصائيات: المجموع=\${totalEvents}, القادمة=\${upcomingEvents}, هذا الشهر=\${thisMonthEvents}, عالية الأولوية=\${highPriorityEvents}\`);
                
                // تحديث العناصر
                const totalEl = document.getElementById('total-events');
                const upcomingEl = document.getElementById('upcoming-events');
                const thisMonthEl = document.getElementById('this-month-events');
                const highPriorityEl = document.getElementById('high-priority-events');
                
                if (totalEl) totalEl.textContent = totalEvents;
                if (upcomingEl) upcomingEl.textContent = upcomingEvents;
                if (thisMonthEl) thisMonthEl.textContent = thisMonthEvents;
                if (highPriorityEl) highPriorityEl.textContent = highPriorityEvents;
            }
            
            // تحميل الأحداث عند تحميل الصفحة
            window.onload = function() {
                console.log('🚀 تم تحميل صفحة اختبار الأحداث');
                loadEventsTest();
            };
        </script>
    </body>
    </html>
  `)
})

// === Favicon Route ===
app.get('/favicon.ico', (c) => {
  // إرجاع استجابة فارغة لتجنب خطأ 404
  return new Response('', {
    headers: {
      'Content-Type': 'image/x-icon',
      'Content-Length': '0'
    }
  })
})

export default app