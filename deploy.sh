#!/bin/bash

# سكريبت النشر التلقائي لتطبيق آل سعيدان
# Auto Deployment Script for Al-Saedan Family App

set -e  # توقف عند أي خطأ

echo "🚀 بدء عملية النشر التلقائي..."
echo "📅 التاريخ: $(date)"
echo "📂 المشروع: saedan-family-tree"
echo "🌐 الموقع: https://saedan-familyapp.com/"

# التحقق من وجود الملفات المطلوبة
echo "📋 التحقق من الملفات..."
if [ ! -f "saedan-familyapp-fixed.html" ]; then
    echo "❌ خطأ: ملف saedan-familyapp-fixed.html غير موجود"
    exit 1
fi

if [ ! -f "wrangler.toml" ]; then
    echo "❌ خطأ: ملف wrangler.toml غير موجود"
    exit 1
fi

# إنشاء مجلد النشر
echo "📦 إعداد ملفات النشر..."
rm -rf dist
mkdir -p dist

# نسخ الملف الأساسي كـ index.html
cp saedan-familyapp-fixed.html dist/index.html

# نسخ ملفات التكوين
cp _routes.json dist/
cp wrangler.toml dist/

echo "✅ تم إعداد الملفات بنجاح"

# عرض محتوى مجلد النشر
echo "📁 محتوى مجلد النشر:"
ls -la dist/

# التحقق من مفتاح Cloudflare API
echo "🔑 التحقق من مصادقة Cloudflare..."

# محاولة النشر
echo "🚀 بدء النشر إلى Cloudflare Pages..."
echo "📡 رفع إلى: saedan-family-tree"

# الأمر الفعلي للنشر (سيتم تشغيله بعد إعداد API Key)
echo "npx wrangler pages deploy dist --project-name saedan-family-tree --compatibility-date 2024-09-01"

echo "✅ سكريبت النشر جاهز!"
echo "⚠️  لتنفيذ النشر الفعلي، يجب إعداد Cloudflare API Key أولاً"