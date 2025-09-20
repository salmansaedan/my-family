#!/bin/bash

# إعداد ملفات Netlify للنشر
echo "🚀 تحضير التطبيق للنشر على Netlify..."

# إنشاء مجلد netlify-dist للملفات المطلوبة فقط
mkdir -p netlify-dist

# نسخ الملفات الأساسية
echo "📁 نسخ الملفات الأساسية..."
cp index.html netlify-dist/
cp app-complete.html netlify-dist/
cp family.html netlify-dist/
cp 404.html netlify-dist/

# نسخ ملفات الإعداد
echo "⚙️ نسخ ملفات الإعداد..."
cp netlify.toml netlify-dist/
cp robots.txt netlify-dist/
cp sitemap.xml netlify-dist/
cp -r _netlify netlify-dist/ 2>/dev/null || true

# نسخ package.json للنشر
cp package-netlify.json netlify-dist/package.json

# إنشاء ملف README للنشر
cat > netlify-dist/README.md << 'EOF'
# تطبيق إدارة عائلة آل سعدان - Netlify

## الملفات المنشورة:
- `index.html` - الصفحة الرئيسية
- `app-complete.html` - التطبيق الكامل  
- `family.html` - شجرة العائلة
- `404.html` - صفحة خطأ مخصصة
- `netlify.toml` - إعدادات النشر

## الروابط:
- الرئيسي: https://family.salmansaedan.com
- Netlify: https://family-alsaedan.netlify.app

## المطور:
سلمان آل سعدان - info@salmansaedan.com - 0533361154
EOF

# إنشاء أرشيف للرفع اليدوي
echo "📦 إنشاء أرشيف للرفع..."
cd netlify-dist
zip -r ../netlify-deploy.zip . -x "*.DS_Store" "*Thumbs.db"
cd ..

# إحصائيات
echo "📊 إحصائيات النشر:"
echo "عدد الملفات: $(find netlify-dist -type f | wc -l)"
echo "حجم المجلد: $(du -sh netlify-dist | cut -f1)"
echo "حجم الأرشيف: $(du -sh netlify-deploy.zip | cut -f1)"

echo ""
echo "✅ تم تحضير التطبيق بنجاح!"
echo "📁 الملفات في: netlify-dist/"
echo "📦 الأرشيف: netlify-deploy.zip"
echo ""
echo "🌐 للنشر على Netlify:"
echo "1. ادخل إلى: https://app.netlify.com"
echo "2. اسحب وأسقط مجلد netlify-dist أو ملف netlify-deploy.zip"
echo "3. أو اربط مع GitHub Repository: salmansaedan/my-family"