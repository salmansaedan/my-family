-- بيانات محدثة لتطبيق آل سعيدان - التسلسل الصحيح للأجيال

-- حذف البيانات الموجودة بترتيب آمن
DELETE FROM suggestion_votes;
DELETE FROM suggestions;
DELETE FROM award_winners;
DELETE FROM family_council;
DELETE FROM event_invitations;
DELETE FROM events;
DELETE FROM library_content;
DELETE FROM family_members WHERE generation > 1;
DELETE FROM family_members WHERE generation = 1;

-- إدراج الجد المؤسس: الشيخ محمد بن عبدالله بن سعيدان (الجيل الأول)
INSERT INTO family_members (
  id, full_name, father_id, generation, field_of_excellence, 
  achievements, relationship_level, is_active
) VALUES (
  1, 'الشيخ محمد بن عبدالله بن سعيدان', NULL, 1, 'قيادي ومؤسس',
  'مؤسس العائلة وراعي التقاليد العائلية الأصيلة', 'family', TRUE
);

-- إدراج الجيل الثاني: أبناء الشيخ محمد بن عبدالله
INSERT INTO family_members (
  full_name, father_id, generation, field_of_excellence, 
  achievements, relationship_level, is_active
) VALUES 
-- عبدالله
('عبدالله محمد آل سعيدان', 1, 2, 'أعمال',
 'رجل أعمال وأحد أبناء المؤسس', 'family', TRUE),

-- فهد  
('فهد محمد آل سعيدان', 1, 2, 'تجاري',
 'تاجر متميز وأحد أبناء المؤسس', 'family', TRUE),

-- حمد
('حمد محمد آل سعيدان', 1, 2, 'إداري', 
 'إداري قيادي وأحد أبناء المؤسس', 'family', TRUE),

-- إبراهيم
('إبراهيم محمد آل سعيدان', 1, 2, 'مهني',
 'مهني متخصص وأحد أبناء المؤسس', 'family', TRUE),

-- سلمان (والد سلمان عبدالعزيز)
('سلمان محمد آل سعيدان', 1, 2, 'عقاري',
 'مطور عقاري وأحد أبناء المؤسس', 'family', TRUE),

-- خالد
('خالد محمد آل سعيدان', 1, 2, 'أعمال',
 'رجل أعمال وأحد أبناء المؤسس', 'family', TRUE),

-- هشام
('هشام محمد آل سعيدان', 1, 2, 'إداري',
 'إداري متميز وأحد أبناء المؤسس', 'family', TRUE),

-- بدر
('بدر محمد آل سعيدان', 1, 2, 'قيادي',
 'قيادي عائلي وأحد أبناء المؤسس', 'family', TRUE);

-- الحصول على IDs للجيل الثاني لاستخدامها في الجيل الثالث
-- سلمان عبدالعزيز (الجيل الثالث - ابن سلمان محمد)
INSERT INTO family_members (
  full_name, father_id, generation, phone, email, field_of_excellence, 
  achievements, relationship_level, is_active
) 
SELECT 
  'سلمان عبدالعزيز آل سعيدان',
  id, 3, '0533361154', 'info@salmansaedan.com', 'تطوير عقاري',
  'مطور عقاري متميز ورائد أعمال - رئيس مجلس الأسرة الحالي', 'family', TRUE
FROM family_members WHERE full_name = 'سلمان محمد آل سعيدان';

-- خالد (الجيل الثالث - ابن خالد محمد)
INSERT INTO family_members (
  full_name, father_id, generation, field_of_excellence, 
  achievements, relationship_level, is_active
) 
SELECT 
  'خالد خالد آل سعيدان',
  id, 3, 'أعمال',
  'رجل أعمال وعضو مجلس الأسرة الحالي', 'family', TRUE
FROM family_members WHERE full_name = 'خالد محمد آل سعيدان';

-- هشام (الجيل الثالث - ابن هشام محمد)
INSERT INTO family_members (
  full_name, father_id, generation, field_of_excellence, 
  achievements, relationship_level, is_active
) 
SELECT 
  'هشام هشام آل سعيدان',
  id, 3, 'إداري',
  'إداري متميز وعضو مجلس الأسرة الحالي', 'family', TRUE
FROM family_members WHERE full_name = 'هشام محمد آل سعيدان';

-- بدر (الجيل الثالث - ابن بدر محمد)
INSERT INTO family_members (
  full_name, father_id, generation, field_of_excellence, 
  achievements, relationship_level, is_active
) 
SELECT 
  'بدر بدر آل سعيدان',
  id, 3, 'قيادي',
  'قيادي عائلي وعضو مجلس الأسرة الحالي', 'family', TRUE
FROM family_members WHERE full_name = 'بدر محمد آل سعيدان';

-- إنشاء مجلس الأسرة الحالي (أعضاء الجيل الثالث)
INSERT INTO family_council (member_id, position, start_date, is_active)
SELECT id, 'عضو', date('2024-01-01'), TRUE 
FROM family_members 
WHERE generation = 3 AND full_name IN (
  'سلمان عبدالعزيز آل سعيدان',
  'خالد خالد آل سعيدان', 
  'هشام هشام آل سعيدان',
  'بدر بدر آل سعيدان'
);

-- تحديد رئيس مجلس الأسرة
UPDATE family_council 
SET position = 'رئيس المجلس' 
WHERE member_id = (SELECT id FROM family_members WHERE full_name = 'سلمان عبدالعزيز آل سعيدان');

-- إضافة فعاليات تجريبية
INSERT INTO events (
  title, description, event_date, location, event_type, target_audience, 
  organizer_id, status
) VALUES
('اجتماع مجلس الأسرة الشهري',
 'الاجتماع الشهري لأعضاء مجلس أسرة آل سعيدان لمناقشة الخطط والمشاريع العائلية',
 datetime('2024-10-15 19:00:00'),
 'مجلس العائلة', 'meeting', 'council_only',
 (SELECT id FROM family_members WHERE full_name = 'سلمان عبدالعزيز آل سعيدان'),
 'planned'),

('لقاء العائلة السنوي',
 'اللقاء السنوي الكبير لجميع أفراد عائلة آل سعيدان من مختلف الأجيال',
 datetime('2024-12-20 16:00:00'),
 'قاعة الاحتفالات الكبرى', 'celebration', 'all',
 (SELECT id FROM family_members WHERE full_name = 'بدر بدر آل سعيدان'),
 'planned');

-- إضافة مقترحات تجريبية محدثة
INSERT INTO suggestions (
  member_id, title, description, category, priority, status
) VALUES 
((SELECT id FROM family_members WHERE full_name = 'سلمان عبدالعزيز آل سعيدان'),
 'لقاء شهري لأعضاء العائلة',
 'تنظيم لقاء شهري لتعزيز التواصل والترابط بين أفراد العائلة من جميع الأجيال',
 'event', 'high', 'approved'),

((SELECT id FROM family_members WHERE full_name = 'خالد خالد آل سعيدان'),
 'برنامج تطوير المهارات للشباب',
 'إقامة ورش تدريبية لتطوير مهارات الشباب في العائلة وتأهيلهم لسوق العمل',
 'program', 'medium', 'under_review'),

((SELECT id FROM family_members WHERE full_name = 'هشام هشام آل سعيدان'),
 'أرشيف تاريخ العائلة',
 'إنشاء أرشيف رقمي لحفظ تاريخ وتراث عائلة آل سعيدان للأجيال القادمة',
 'improvement', 'high', 'approved');

-- إضافة محتوى تعريفي للمكتبة
INSERT INTO library_content (
  title, description, content_type, category, is_featured, 
  published_at, created_by
) VALUES 
('مرحباً بكم في تطبيق آل سعيدان',
 'تطبيق تفاعلي لربط أفراد عائلة آل سعيدان وتنظيم الفعاليات العائلية - بإشراف مجلس الأسرة',
 'article', 'family_values', TRUE, datetime('now'),
 (SELECT id FROM family_members WHERE full_name = 'سلمان عبدالعزيز آل سعيدان')),

('تراث الشيخ محمد بن عبدالله بن سعيدان',
 'رحلة عبر تاريخ العائلة العريق وإنجازات الأجيال المتعاقبة',
 'article', 'family_values', TRUE, datetime('now'),
 (SELECT id FROM family_members WHERE full_name = 'سلمان عبدالعزيز آل سعيدان'));