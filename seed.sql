-- بيانات تطبيق آل سعيدان - التسلسل العائلي الدقيق والنهائي

-- إدراج الجد المؤسس: الشيخ محمد بن عبدالله بن سعيدان (الجيل الأول)
INSERT OR IGNORE INTO family_members (
  id, full_name, father_id, generation, field_of_excellence, 
  achievements, relationship_level, is_active
) VALUES (
  1, 'الشيخ محمد بن عبدالله بن سعيدان', NULL, 1, 'قيادي ومؤسس',
  'مؤسس العائلة وراعي التقاليد العائلية الأصيلة', 'family', TRUE
);

-- إدراج الجيل الثاني: أبناء الشيخ محمد الأربعة
INSERT OR IGNORE INTO family_members (
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
 'مهني متخصص وأحد أبناء المؤسس', 'family', TRUE);

-- إدراج الجيل الثالث: أبناء الجيل الثاني (مجلس الأسرة الحالي)
-- سلمان (ابن عبدالله)
INSERT OR IGNORE INTO family_members (
  full_name, father_id, generation, phone, email, field_of_excellence, 
  achievements, relationship_level, is_active
) 
SELECT 
  'سلمان عبدالله آل سعيدان',
  id, 3, '0533361154', 'info@salmansaedan.com', 'تطوير عقاري',
  'مطور عقاري متميز ورائد أعمال - رئيس مجلس الأسرة الحالي', 'family', TRUE
FROM family_members WHERE full_name = 'عبدالله محمد آل سعيدان';

-- خالد (ابن فهد)
INSERT OR IGNORE INTO family_members (
  full_name, father_id, generation, field_of_excellence, 
  achievements, relationship_level, is_active
) 
SELECT 
  'خالد فهد آل سعيدان',
  id, 3, 'أعمال',
  'رجل أعمال وعضو مجلس الأسرة الحالي', 'family', TRUE
FROM family_members WHERE full_name = 'فهد محمد آل سعيدان';

-- هشام (ابن حمد)
INSERT OR IGNORE INTO family_members (
  full_name, father_id, generation, field_of_excellence, 
  achievements, relationship_level, is_active
) 
SELECT 
  'هشام حمد آل سعيدان',
  id, 3, 'إداري',
  'إداري متميز وعضو مجلس الأسرة الحالي', 'family', TRUE
FROM family_members WHERE full_name = 'حمد محمد آل سعيدان';

-- بدر (ابن إبراهيم)
INSERT OR IGNORE INTO family_members (
  full_name, father_id, generation, field_of_excellence, 
  achievements, relationship_level, is_active
) 
SELECT 
  'بدر إبراهيم آل سعيدان',
  id, 3, 'قيادي',
  'قيادي عائلي وعضو مجلس الأسرة الحالي', 'family', TRUE
FROM family_members WHERE full_name = 'إبراهيم محمد آل سعيدان';

-- إنشاء مجلس الأسرة الحالي (أعضاء الجيل الثالث)
INSERT OR IGNORE INTO family_council (member_id, position, start_date, is_active)
SELECT id, 'عضو', date('2024-01-01'), TRUE 
FROM family_members 
WHERE generation = 3 AND full_name IN (
  'سلمان عبدالله آل سعيدان',
  'خالد فهد آل سعيدان', 
  'هشام حمد آل سعيدان',
  'بدر إبراهيم آل سعيدان'
);

-- تحديد رئيس مجلس الأسرة (سلمان عبدالله)
INSERT OR IGNORE INTO family_council (member_id, position, start_date, is_active)
SELECT id, 'رئيس المجلس', date('2024-01-01'), TRUE 
FROM family_members 
WHERE full_name = 'سلمان عبدالله آل سعيدان';

-- إنشاء جوائز العائلة
INSERT OR IGNORE INTO awards (name, description, category, year, criteria, is_active) VALUES 
('جائزة الشيخ محمد بن سعيدان للتميز العائلي', 
 'جائزة سنوية تكرم المتميزين من أفراد العائلة في مختلف المجالات',
 'تميز عائلي', 2024,
 'التميز في المجال المهني أو العلمي أو الاجتماعي مع خدمة العائلة والمجتمع',
 TRUE),

('جائزة رواد الأسرة للإبداع',
 'جائزة لتشجيع الإبداع والابتكار بين أفراد العائلة',
 'إبداع', 2024,
 'تقديم مبادرة أو مشروع إبداعي يخدم العائلة أو المجتمع',
 TRUE),

('جائزة خدمة المجتمع',
 'تكريم من يقدم خدمات متميزة للمجتمع',
 'خدمة المجتمع', 2024,
 'العمل التطوعي والمساهمة في خدمة المجتمع',
 TRUE);

-- إضافة فعاليات تجريبية
INSERT OR IGNORE INTO events (
  title, description, event_date, location, event_type, target_audience, 
  organizer_id, status
) VALUES
('اجتماع مجلس الأسرة الشهري',
 'الاجتماع الشهري لأعضاء مجلس أسرة آل سعيدان لمناقشة الخطط والمشاريع العائلية',
 datetime('2024-10-15 19:00:00'),
 'مجلس العائلة', 'meeting', 'council_only',
 (SELECT id FROM family_members WHERE full_name = 'سلمان عبدالله آل سعيدان'),
 'planned'),

('لقاء العائلة السنوي',
 'اللقاء السنوي الكبير لجميع أفراد عائلة آل سعيدان من مختلف الأجيال',
 datetime('2024-12-20 16:00:00'),
 'قاعة الاحتفالات الكبرى', 'celebration', 'all',
 (SELECT id FROM family_members WHERE full_name = 'بدر إبراهيم آل سعيدان'),
 'planned');

-- إضافة محتوى مكتبة التجارب والخبرات
INSERT OR IGNORE INTO library_content (
  title, description, content_type, category, is_featured, 
  published_at, created_by, duration, views
) VALUES 
-- محتوى عن القيم العائلية والتراث
('مرحباً بكم في تطبيق آل سعيدان',
 'تطبيق تفاعلي لربط أفراد عائلة آل سعيدان وتنظيم الفعاليات العائلية - بإشراف مجلس الأسرة الحالي من الجيل الثالث',
 'article', 'family_values', TRUE, datetime('now'),
 (SELECT id FROM family_members WHERE full_name = 'سلمان عبدالله آل سعيدان'), NULL, 156),

('تراث الشيخ محمد بن عبدالله بن سعيدان',
 'رحلة عبر تاريخ العائلة العريق وإنجازات الأجيال المتعاقبة الثلاثة - من تأسيس العائلة وحتى مجلس الأسرة الحالي',
 'article', 'family_values', TRUE, datetime('now', '-7 days'),
 (SELECT id FROM family_members WHERE full_name = 'سلمان عبدالله آل سعيدان'), NULL, 234),

-- تجارب في الأعمال والتجارة
('رحلة النجاح في التطوير العقاري',
 'تجربة شخصية في عالم التطوير العقاري من البداية حتى النجاح - دروس مستفادة ونصائح عملية للشباب الطموح',
 'article', 'business', TRUE, datetime('now', '-14 days'),
 (SELECT id FROM family_members WHERE full_name = 'سلمان عبدالله آل سعيدان'), NULL, 189),

('أسرار النجاح في التجارة',
 'خبرات متراكمة في عالم التجارة والأعمال - كيفية بناء علاقات تجارية ناجحة وإدارة المخاطر',
 'video', 'business', TRUE, datetime('now', '-21 days'),
 (SELECT id FROM family_members WHERE full_name = 'خالد فهد آل سعيدان'), 45, 98),

-- تجارب في القيادة والإدارة
('فن الإدارة الحديثة',
 'مبادئ الإدارة الفعالة والقيادة الناجحة - تجربة في قيادة الفرق وإدارة المشاريع الكبيرة',
 'document', 'leadership', FALSE, datetime('now', '-30 days'),
 (SELECT id FROM family_members WHERE full_name = 'هشام حمد آل سعيدان'), NULL, 67),

('القيادة العائلية والمجتمعية',
 'كيفية الموازنة بين القيادة في الأسرة والمجتمع - دروس من الخبرة العملية في إدارة المسؤوليات المختلفة',
 'audio', 'leadership', TRUE, datetime('now', '-35 days'),
 (SELECT id FROM family_members WHERE full_name = 'بدر إبراهيم آل سعيدان'), 30, 123),

-- محتوى تعليمي وتطوير شخصي  
('التعلم المستمر طريق النجاح',
 'أهمية التعلم مدى الحياة والتطوير المستمر للمهارات - قصص وتجارب عملية في رحلة التعلم',
 'article', 'education', FALSE, datetime('now', '-42 days'),
 (SELECT id FROM family_members WHERE full_name = 'عبدالله محمد آل سعيدان'), NULL, 45),

('بناء الشخصية القيادية',
 'خطوات عملية لتطوير الشخصية القيادية والمهارات الاجتماعية - تجربة شخصية في التطوير الذاتي',
 'video', 'personal_development', FALSE, datetime('now', '-49 days'),
 (SELECT id FROM family_members WHERE full_name = 'فهد محمد آل سعيدان'), 38, 78),

('حكم وتجارب من الحياة',
 'مجموعة من الحكم والدروس المستفادة من تجارب الحياة - نصائح من جيل الآباء للأجيال الجديدة',
 'audio', 'personal_development', TRUE, datetime('now', '-56 days'),
 (SELECT id FROM family_members WHERE full_name = 'حمد محمد آل سعيدان'), 25, 167),

-- محتوى عن قيم الأسرة
('قيم آل سعيدان عبر الأجيال',
 'القيم الأساسية التي تميز عائلة آل سعيدان وكيف تنتقل من جيل إلى جيل - أهمية الحفاظ على التراث',
 'article', 'family_values', FALSE, datetime('now', '-63 days'),
 (SELECT id FROM family_members WHERE full_name = 'إبراهيم محمد آل سعيدان'), NULL, 201);

-- إضافة مقترحات تجريبية محدثة
INSERT OR IGNORE INTO suggestions (
  member_id, title, description, category, priority, status
) VALUES 
((SELECT id FROM family_members WHERE full_name = 'سلمان عبدالله آل سعيدان'),
 'لقاء شهري لأعضاء العائلة',
 'تنظيم لقاء شهري لتعزيز التواصل والترابط بين أفراد العائلة من جميع الأجيال',
 'event', 'high', 'approved'),

((SELECT id FROM family_members WHERE full_name = 'خالد فهد آل سعيدان'),
 'برنامج تطوير المهارات للشباب',
 'إقامة ورش تدريبية لتطوير مهارات الشباب في العائلة وتأهيلهم لسوق العمل',
 'program', 'medium', 'under_review'),

((SELECT id FROM family_members WHERE full_name = 'هشام حمد آل سعيدان'),
 'أرشيف تاريخ العائلة',
 'إنشاء أرشيف رقمي لحفظ تاريخ وتراث عائلة آل سعيدان للأجيال القادمة',
 'improvement', 'high', 'approved');