-- بيانات أولية لتطبيق آل سعيدان
-- إدراج الجد المؤسس والأعضاء الأساسيين

-- إدراج الجد المؤسس: الشيخ محمد بن عبدالله بن سعيدان
INSERT OR IGNORE INTO family_members (
  id, full_name, father_id, generation, field_of_excellence, 
  achievements, relationship_level, is_active
) VALUES (
  1, 'الشيخ محمد بن عبدالله بن سعيدان', NULL, 1, 'قيادي ومؤسس',
  'مؤسس العائلة وراعي التقاليد العائلية الأصيلة', 'family', TRUE
);

-- إدراج أعضاء مجلس الأسرة
INSERT OR IGNORE INTO family_members (
  full_name, father_id, generation, phone, email, field_of_excellence, 
  achievements, relationship_level, is_active
) VALUES 
-- سلمان (صاحب الهاتف المذكور)
('سلمان عبدالعزيز آل سعيدان', 1, 2, '0533361154', 'info@salmansaedan.com', 'تطوير عقاري',
 'مطور عقاري متميز ورائد أعمال', 'family', TRUE),
 
-- خالد
('خالد آل سعيدان', 1, 2, NULL, NULL, 'أعمال',
 'رجل أعمال وعضو مجلس الأسرة', 'family', TRUE),
 
-- هشام  
('هشام آل سعيدان', 1, 2, NULL, NULL, 'إداري',
 'إداري متميز وعضو مجلس الأسرة', 'family', TRUE),
 
-- بدر
('بدر آل سعيدان', 1, 2, NULL, NULL, 'قيادي',
 'قيادي عائلي وعضو مجلس الأسرة', 'family', TRUE);

-- إنشاء مجلس الأسرة الحالي
INSERT OR IGNORE INTO family_council (member_id, position, start_date, is_active)
SELECT id, 'عضو', date('2024-01-01'), TRUE 
FROM family_members 
WHERE full_name IN (
  'سلمان عبدالعزيز آل سعيدان',
  'خالد آل سعيدان', 
  'هشام آل سعيدان',
  'بدر آل سعيدان'
);

-- إنشاء جائزة الشيخ محمد بن سعيدان للتميز العائلي
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

-- إضافة محتوى تعريفي للمكتبة
INSERT OR IGNORE INTO library_content (
  title, description, content_type, category, is_featured, 
  published_at, created_by
) VALUES 
('مرحباً بكم في تطبيق آل سعيدان',
 'تطبيق تفاعلي لربط أفراد عائلة آل سعيدان وتنظيم الفعاليات العائلية',
 'article', 'family_values', TRUE, datetime('now'),
 (SELECT id FROM family_members WHERE full_name = 'سلمان عبدالعزيز آل سعيدان')),

('رؤية مجلس الأسرة',
 'رؤيتنا هي بناء عائلة متماسكة ومترابطة تحافظ على التقاليد وتواكب العصر',
 'article', 'family_values', TRUE, datetime('now'),
 (SELECT id FROM family_members WHERE full_name = 'سلمان عبدالعزيز آل سعيدان'));

-- إضافة مقترحات تجريبية
INSERT OR IGNORE INTO suggestions (
  member_id, title, description, category, priority, status
) VALUES 
((SELECT id FROM family_members WHERE full_name = 'سلمان عبدالعزيز آل سعيدان'),
 'لقاء شهري لأعضاء العائلة',
 'تنظيم لقاء شهري لتعزيز التواصل والترابط بين أفراد العائلة',
 'event', 'high', 'approved'),

((SELECT id FROM family_members WHERE full_name = 'خالد آل سعيدان'),
 'برنامج تطوير المهارات للشباب',
 'إقامة ورش تدريبية لتطوير مهارات الشباب في العائلة',
 'program', 'medium', 'under_review');