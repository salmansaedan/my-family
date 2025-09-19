-- بيانات محدثة لتطبيق آل سعيدان
-- التسلسل الصحيح للأجيال في عائلة آل سعيدان

-- حذف البيانات الموجودة لإعادة الإدراج
DELETE FROM family_council;
DELETE FROM suggestions;
DELETE FROM family_members;

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
  full_name, father_id, generation, phone, email, field_of_excellence, 
  achievements, relationship_level, is_active
) VALUES 
-- عبدالله
('عبدالله محمد آل سعيدان', 1, 2, NULL, NULL, 'أعمال',
 'رجل أعمال وأحد أبناء المؤسس', 'family', TRUE),

-- فهد  
('فهد محمد آل سعيدان', 1, 2, NULL, NULL, 'تجاري',
 'تاجر متميز وأحد أبناء المؤسس', 'family', TRUE),

-- حمد
('حمد محمد آل سعيدان', 1, 2, NULL, NULL, 'إداري', 
 'إداري قيادي وأحد أبناء المؤسس', 'family', TRUE),

-- إبراهيم
('إبراهيم محمد آل سعيدان', 1, 2, NULL, NULL, 'مهني',
 'مهني متخصص وأحد أبناء المؤسس', 'family', TRUE),

-- سلمان (والد سلمان عبدالعزيز)
('سلمان محمد آل سعيدان', 1, 2, NULL, NULL, 'عقاري',
 'مطور عقاري وأحد أبناء المؤسس', 'family', TRUE),

-- خالد
('خالد محمد آل سعيدان', 1, 2, NULL, NULL, 'أعمال',
 'رجل أعمال وأحد أبناء المؤسس', 'family', TRUE),

-- هشام
('هشام محمد آل سعيدان', 1, 2, NULL, NULL, 'إداري',
 'إداري متميز وأحد أبناء المؤسس', 'family', TRUE),

-- بدر
('بدر محمد آل سعيدان', 1, 2, NULL, NULL, 'قيادي',
 'قيادي عائلي وأحد أبناء المؤسس', 'family', TRUE);

-- إدراج الجيل الثالث: أعضاء مجلس الأسرة الحالي (أبناء الجيل الثاني)
INSERT INTO family_members (
  full_name, father_id, generation, phone, email, field_of_excellence, 
  achievements, relationship_level, is_active
) VALUES 
-- سلمان عبدالعزيز (ابن سلمان محمد - صاحب الهاتف المذكور)
('سلمان عبدالعزيز آل سعيدان', 
 (SELECT id FROM family_members WHERE full_name = 'سلمان محمد آل سعيدان'), 
 3, '0533361154', 'info@salmansaedan.com', 'تطوير عقاري',
 'مطور عقاري متميز ورائد أعمال - عضو مجلس الأسرة', 'family', TRUE),
 
-- خالد (ابن خالد محمد)
('خالد خالد آل سعيدان', 
 (SELECT id FROM family_members WHERE full_name = 'خالد محمد آل سعيدان'), 
 3, NULL, NULL, 'أعمال',
 'رجل أعمال وعضو مجلس الأسرة', 'family', TRUE),
 
-- هشام (ابن هشام محمد)
('هشام هشام آل سعيدان', 
 (SELECT id FROM family_members WHERE full_name = 'هشام محمد آل سعيدان'), 
 3, NULL, NULL, 'إداري',
 'إداري متميز وعضو مجلس الأسرة', 'family', TRUE),
 
-- بدر (ابن بدر محمد)
('بدر بدر آل سعيدان', 
 (SELECT id FROM family_members WHERE full_name = 'بدر محمد آل سعيدان'), 
 3, NULL, NULL, 'قيادي',
 'قيادي عائلي وعضو مجلس الأسرة', 'family', TRUE);

-- إنشاء مجلس الأسرة الحالي (أعضاء الجيل الثالث)
INSERT INTO family_council (member_id, position, start_date, is_active)
SELECT id, 'عضو', date('2024-01-01'), TRUE 
FROM family_members 
WHERE full_name IN (
  'سلمان عبدالعزيز آل سعيدان',
  'خالد خالد آل سعيدان', 
  'هشام هشام آل سعيدان',
  'بدر بدر آل سعيدان'
);

-- تحديد رئيس مجلس الأسرة (سلمان كونه صاحب التطبيق)
UPDATE family_council 
SET position = 'رئيس المجلس' 
WHERE member_id = (SELECT id FROM family_members WHERE full_name = 'سلمان عبدالعزيز آل سعيدان');

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