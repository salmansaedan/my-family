# إرشادات ربط الدومين مع GitHub Pages

## المعلومات المطلوبة:
- **الدومين المقترح**: `family.salmansaedan.com`
- **أو أي دومين فرعي آخر من**: `salmansaedan.com`

## خطوات الإعداد:

### 1. إعدادات DNS في مزود الدومين:

أضف السجلات التالية في إعدادات DNS الخاصة بدومين `salmansaedan.com`:

#### **لدومين فرعي (مثل family.salmansaedan.com):**
```
Type: CNAME
Name: family
Value: salmansaedan.github.io
TTL: 300 (أو أقل قيمة متاحة)
```

#### **أو للدومين الرئيسي (إذا كنت تريد salmansaedan.com مباشرة):**
```
Type: A
Name: @ (or root)
Value: 185.199.108.153
TTL: 300

Type: A  
Name: @ (or root)
Value: 185.199.109.153
TTL: 300

Type: A
Name: @ (or root) 
Value: 185.199.110.153
TTL: 300

Type: A
Name: @ (or root)
Value: 185.199.111.153
TTL: 300
```

### 2. تفعيل GitHub Pages مع الدومين الخاص:

1. **اذهب إلى GitHub Repository:**
   - https://github.com/salmansaedan/my-family

2. **اذهب إلى Settings > Pages:**
   - انقر على "Settings" في أعلى الصفحة
   - اسحب لأسفل واختر "Pages"

3. **أدخل الدومين الخاص:**
   - في قسم "Custom domain"
   - أدخل: `family.salmansaedan.com` (أو الدومين الذي تريده)
   - انقر "Save"

4. **فعّل HTTPS:**
   - بعد التحقق من الدومين (قد يستغرق بضع دقائق)
   - ستظهر خانة "Enforce HTTPS"
   - فعّلها للحصول على شهادة SSL مجانية

### 3. التحقق من الربط:

بعد 5-15 دقيقة من إعداد DNS:

1. **اختبر الدومين:**
   ```
   nslookup family.salmansaedan.com
   ```

2. **تحقق من الوصول:**
   - ادخل إلى: `https://family.salmansaedan.com`
   - يجب أن يعمل التطبيق بشكل طبيعي

### 4. الروابط الجديدة بعد الربط:

- **الرابط الرئيسي**: `https://family.salmansaedan.com/`
- **التطبيق الكامل**: `https://family.salmansaedan.com/app-complete.html`
- **شجرة العائلة**: `https://family.salmansaedan.com/family.html`

## مزودي خدمة DNS الشائعين:

### **Cloudflare:**
1. Login to Cloudflare Dashboard
2. Select your domain: `salmansaedan.com`
3. Go to "DNS" tab
4. Add CNAME record: `family` → `salmansaedan.github.io`

### **GoDaddy:**
1. Login to GoDaddy account
2. Go to "My Products" > "DNS"
3. Select domain: `salmansaedan.com`
4. Add record: CNAME | family | salmansaedan.github.io

### **Namecheap:**
1. Login to Namecheap
2. Go to "Domain List" 
3. Click "Manage" next to `salmansaedan.com`
4. Go to "Advanced DNS" tab
5. Add CNAME Record: family → salmansaedan.github.io

## ملاحظات مهمة:

- **وقت التفعيل**: قد يستغرق حتى 24 ساعة لانتشار DNS عالمياً
- **التحقق**: GitHub سيتحقق من ملكية الدومين تلقائياً
- **SSL**: شهادة SSL ستصدر تلقائياً بعد التحقق من الدومين
- **إعادة التوجيه**: الروابط القديمة ستعمل بشكل طبيعي

## الدعم الفني:
- **المطور**: سلمان آل سعدان
- **البريد الإلكتروني**: info@salmansaedan.com  
- **الهاتف**: 0533361154