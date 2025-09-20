# حل مشاكل Netlify - دليل استكشاف الأخطاء 🔧

## مشكلة "main@head failed" ✅ الحل

### السبب:
Netlify يحاول بناء المشروع كـ Node.js بينما هو static HTML site.

### الحل السريع:

#### 1️⃣ إعدادات Build في Netlify Dashboard:
```
Build command: (اتركها فارغة)
Publish directory: .
Node version: 18
```

#### 2️⃣ أو استخدم هذه الإعدادات:
```
Build command: echo "Static site ready"
Publish directory: .
```

#### 3️⃣ إعدادات Build المتقدمة:
في Netlify Dashboard > Site Settings > Build & deploy:
- **Base directory**: (فارغ)
- **Build command**: (فارغ أو `echo "No build needed"`)
- **Publish directory**: `.`
- **Functions directory**: (فارغ)

### طرق بديلة للنشر:

#### الطريقة 1: رفع مباشر (الأسهل)
1. حمل ملف `netlify-deploy.zip`
2. اذهب إلى https://app.netlify.com
3. اسحب وأسقط الملف
4. سينشر فوراً بدون مشاكل

#### الطريقة 2: GitHub مع إعدادات صحيحة
1. في Netlify Dashboard اختر "Import from Git"
2. اختر GitHub > salmansaedan/my-family
3. **في إعدادات Build**:
   - Build command: (اتركها فارغة)
   - Publish directory: `.`
4. انقر "Deploy site"

#### الطريقة 3: تعديل netlify.toml
الملف محدث بالفعل، لكن تأكد من:
```toml
[build]
  command = ""
  publish = "."
```

## مشاكل أخرى وحلولها:

### خطأ "Build failed"
**الحل**: 
- احذف `node_modules/` من المستودع
- استخدم رفع مباشر بدلاً من GitHub

### خطأ "Page not found"  
**الحل**:
- تأكد أن `index.html` في المجلد الجذر
- تحقق من إعداد Publish directory

### خطأ CSS/JS لا يعمل
**الحل**:
- تأكد من الروابط النسبية في HTML
- استخدم CDN للمكتبات الخارجية

### خطأ "Deploy timeout"
**الحل**:
- استخدم الرفع المباشر
- قلل حجم الملفات

## إعدادات Netlify الموصى بها:

```toml
[build]
  command = ""
  publish = "."
  
[build.environment]
  NODE_VERSION = "18"
```

## اختبار سريع بعد النشر:

```bash
# تحقق من الاستجابة
curl -I https://your-site.netlify.app

# تحقق من المحتوى
curl https://your-site.netlify.app
```

## إعادة النشر إذا فشل:

1. **في Netlify Dashboard**:
   - اذهب إلى Deploys
   - انقر "Trigger deploy"
   - اختر "Deploy site"

2. **أو غير الإعدادات**:
   - Site Settings > Build & deploy
   - Build Settings > Edit settings
   - غير إلى:
     - Build command: (فارغ)
     - Publish directory: `.`

## الملفات المطلوبة فقط:

الملفات الأساسية في المجلد الجذر:
- `index.html` ✅
- `app-complete.html` ✅  
- `family.html` ✅
- `404.html` ✅
- `netlify.toml` ✅
- `robots.txt` ✅
- `sitemap.xml` ✅

## روابط مفيدة:

- **Netlify Docs**: https://docs.netlify.com/
- **Build troubleshooting**: https://docs.netlify.com/configure-builds/troubleshooting-tips/
- **Deploy notifications**: https://docs.netlify.com/site-deploys/notifications/

---

**💡 نصيحة**: إذا استمرت المشاكل، استخدم الرفع المباشر. أسهل وأسرع!

**🆘 الدعم**: info@salmansaedan.com | 0533361154