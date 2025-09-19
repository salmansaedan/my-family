-- تطبيق آل سعيدان - إعداد قاعدة البيانات الأولية

-- جدول أعضاء العائلة
CREATE TABLE IF NOT EXISTS family_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  father_id INTEGER NULL, -- ID والد العضو في شجرة العائلة
  generation INTEGER NOT NULL DEFAULT 1, -- رقم الجيل
  birth_date DATE,
  phone TEXT,
  national_id TEXT UNIQUE,
  email TEXT,
  achievements TEXT, -- الإنجازات والتميز
  field_of_excellence TEXT, -- مجال التميز (علمي، اجتماعي، تجاري)
  photo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  relationship_level TEXT DEFAULT 'family', -- family, close, extended
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (father_id) REFERENCES family_members(id)
);

-- جدول الفعاليات
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATETIME NOT NULL,
  location TEXT,
  event_type TEXT DEFAULT 'general', -- general, meeting, celebration, educational
  target_audience TEXT DEFAULT 'all', -- all, close_family, extended_family, council_only
  max_attendees INTEGER,
  organizer_id INTEGER,
  status TEXT DEFAULT 'planned', -- planned, active, completed, cancelled
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES family_members(id)
);

-- جدول دعوات الفعاليات
CREATE TABLE IF NOT EXISTS event_invitations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL,
  invitation_status TEXT DEFAULT 'pending', -- pending, accepted, declined, maybe
  invited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  responded_at DATETIME,
  notes TEXT,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (member_id) REFERENCES family_members(id),
  UNIQUE(event_id, member_id)
);

-- جدول المقترحات "شاركنا أفكارك"
CREATE TABLE IF NOT EXISTS suggestions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- event, improvement, program, other
  priority TEXT DEFAULT 'medium', -- low, medium, high
  status TEXT DEFAULT 'pending', -- pending, under_review, approved, implemented, rejected
  votes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME,
  reviewed_by INTEGER,
  notes TEXT,
  FOREIGN KEY (member_id) REFERENCES family_members(id),
  FOREIGN KEY (reviewed_by) REFERENCES family_members(id)
);

-- جدول تصويت على المقترحات
CREATE TABLE IF NOT EXISTS suggestion_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  suggestion_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL,
  vote_type TEXT DEFAULT 'up', -- up, down
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (suggestion_id) REFERENCES suggestions(id),
  FOREIGN KEY (member_id) REFERENCES family_members(id),
  UNIQUE(suggestion_id, member_id)
);

-- جدول مجلس الأسرة
CREATE TABLE IF NOT EXISTS family_council (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  position TEXT NOT NULL, -- chairman, member
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES family_members(id)
);

-- جدول الجوائز والتحفيز
CREATE TABLE IF NOT EXISTS awards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- excellence, leadership, innovation, community_service
  year INTEGER,
  criteria TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول الفائزين بالجوائز
CREATE TABLE IF NOT EXISTS award_winners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  award_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL,
  year INTEGER NOT NULL,
  reason TEXT,
  prize_description TEXT,
  ceremony_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (award_id) REFERENCES awards(id),
  FOREIGN KEY (member_id) REFERENCES family_members(id)
);

-- جدول المكتبة والتجارب
CREATE TABLE IF NOT EXISTS library_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT DEFAULT 'article', -- article, video, audio, document
  speaker_name TEXT,
  speaker_bio TEXT,
  content_url TEXT,
  file_path TEXT,
  duration INTEGER, -- للفيديوهات والصوتيات بالدقائق
  tags TEXT, -- مفصولة بفواصل
  category TEXT DEFAULT 'general', -- business, education, personal_development, family_values
  views INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published_at DATETIME,
  created_by INTEGER,
  FOREIGN KEY (created_by) REFERENCES family_members(id)
);

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_family_members_father_id ON family_members(father_id);
CREATE INDEX IF NOT EXISTS idx_family_members_generation ON family_members(generation);
CREATE INDEX IF NOT EXISTS idx_family_members_relationship_level ON family_members(relationship_level);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_event_invitations_event_id ON event_invitations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_invitations_member_id ON event_invitations(member_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_member_id ON suggestions(member_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions(status);
CREATE INDEX IF NOT EXISTS idx_library_content_category ON library_content(category);
CREATE INDEX IF NOT EXISTS idx_library_content_published_at ON library_content(published_at);