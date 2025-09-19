import { Hono } from 'hono'
import { renderer } from './renderer'
import { serveStatic } from 'hono/cloudflare-workers'
import { cors } from 'hono/cors'

// تعريف أنواع البيانات للـ TypeScript
type Bindings = {
  DB: D1Database;
}

type Variables = {
  message: string;
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Middleware
app.use(renderer)
app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './public' }))

// API Routes
app.get('/api/family-members', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT id, full_name, father_id, generation, phone, email, 
             field_of_excellence, achievements, relationship_level, 
             created_at
      FROM family_members 
      WHERE is_active = 1 
      ORDER BY generation ASC, full_name ASC
    `).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'فشل في جلب بيانات أعضاء العائلة' }, 500);
  }
});

app.get('/api/events', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT e.*, fm.full_name as organizer_name
      FROM events e
      LEFT JOIN family_members fm ON e.organizer_id = fm.id
      WHERE e.status != 'cancelled'
      ORDER BY e.event_date DESC
      LIMIT 20
    `).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'فشل في جلب بيانات الفعاليات' }, 500);
  }
});

app.get('/api/suggestions', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT s.*, fm.full_name as member_name
      FROM suggestions s
      LEFT JOIN family_members fm ON s.member_id = fm.id
      ORDER BY s.created_at DESC
      LIMIT 20
    `).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'فشل في جلب المقترحات' }, 500);
  }
});

app.post('/api/suggestions', async (c) => {
  try {
    const { title, description, category, member_id } = await c.req.json();
    
    const { success } = await c.env.DB.prepare(`
      INSERT INTO suggestions (title, description, category, member_id)
      VALUES (?, ?, ?, ?)
    `).bind(title, description, category || 'general', member_id).run();

    if (success) {
      return c.json({ success: true, message: 'تم إضافة المقترح بنجاح' });
    } else {
      return c.json({ success: false, error: 'فشل في إضافة المقترح' }, 500);
    }
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في إضافة المقترح' }, 500);
  }
});

// === API Routes لإدارة أفراد العائلة ===

// إضافة عضو جديد في العائلة
app.post('/api/family-members', async (c) => {
  try {
    const { full_name, father_id, generation, birth_date, phone, national_id, email, achievements, field_of_excellence, relationship_level } = await c.req.json();
    
    const { success, meta } = await c.env.DB.prepare(`
      INSERT INTO family_members 
      (full_name, father_id, generation, birth_date, phone, national_id, email, achievements, field_of_excellence, relationship_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      full_name, 
      father_id || null, 
      generation || 1, 
      birth_date || null, 
      phone || null, 
      national_id || null, 
      email || null, 
      achievements || null, 
      field_of_excellence || null, 
      relationship_level || 'family'
    ).run();

    if (success) {
      return c.json({ success: true, message: 'تم إضافة العضو بنجاح', member_id: meta.last_row_id });
    } else {
      return c.json({ success: false, error: 'فشل في إضافة العضو' }, 500);
    }
  } catch (error) {
    console.error('Error adding family member:', error);
    return c.json({ success: false, error: 'خطأ في إضافة العضو: ' + error.message }, 500);
  }
});

// تعديل عضو في العائلة
app.put('/api/family-members/:id', async (c) => {
  try {
    const memberId = c.req.param('id');
    const { full_name, father_id, generation, birth_date, phone, national_id, email, achievements, field_of_excellence, relationship_level } = await c.req.json();
    
    const { success } = await c.env.DB.prepare(`
      UPDATE family_members SET 
        full_name = ?, father_id = ?, generation = ?, birth_date = ?, phone = ?, 
        national_id = ?, email = ?, achievements = ?, field_of_excellence = ?, 
        relationship_level = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      full_name, 
      father_id || null, 
      generation, 
      birth_date || null, 
      phone || null, 
      national_id || null, 
      email || null, 
      achievements || null, 
      field_of_excellence || null, 
      relationship_level, 
      memberId
    ).run();

    if (success) {
      return c.json({ success: true, message: 'تم تحديث بيانات العضو بنجاح' });
    } else {
      return c.json({ success: false, error: 'فشل في تحديث العضو' }, 500);
    }
  } catch (error) {
    console.error('Error updating family member:', error);
    return c.json({ success: false, error: 'خطأ في تحديث العضو: ' + error.message }, 500);
  }
});

// حذف عضو من العائلة (إلغاء تفعيل وليس حذف نهائي)
app.delete('/api/family-members/:id', async (c) => {
  try {
    const memberId = c.req.param('id');
    
    // تحقق إذا كان هذا العضو له أبناء (في هذه الحالة لا يمكن حذفه)
    const { results: children } = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM family_members WHERE father_id = ? AND is_active = 1
    `).bind(memberId).all();
    
    if (children[0].count > 0) {
      return c.json({ success: false, error: 'لا يمكن حذف هلذا العضو لأنه لديه أبناء في شجرة العائلة' }, 400);
    }
    
    // إلغاء تفعيل العضو بدلاً من الحذف النهائي
    const { success } = await c.env.DB.prepare(`
      UPDATE family_members SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(memberId).run();

    if (success) {
      return c.json({ success: true, message: 'تم إلغاء تفعيل العضو بنجاح' });
    } else {
      return c.json({ success: false, error: 'فشل في إلغاء تفعيل العضو' }, 500);
    }
  } catch (error) {
    console.error('Error deleting family member:', error);
    return c.json({ success: false, error: 'خطأ في حذف العضو: ' + error.message }, 500);
  }
});

// الحصول على بيانات عضو محدد
app.get('/api/family-members/:id', async (c) => {
  try {
    const memberId = c.req.param('id');
    
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM family_members WHERE id = ? AND is_active = 1
    `).bind(memberId).all();
    
    if (results.length > 0) {
      return c.json({ success: true, data: results[0] });
    } else {
      return c.json({ success: false, error: 'لم يتم العثور على العضو' }, 404);
    }
  } catch (error) {
    console.error('Error fetching family member:', error);
    return c.json({ success: false, error: 'خطأ في جلب بيانات العضو' }, 500);
  }
});

// === API Routes لنظام الدعوات ===

// إنشاء فعالية جديدة
app.post('/api/events', async (c) => {
  try {
    const { title, description, event_date, location, event_type, target_audience, max_attendees, organizer_id } = await c.req.json();
    
    console.log('Creating event:', { title, description, event_date, location, event_type, target_audience, max_attendees, organizer_id });
    
    const { success, meta } = await c.env.DB.prepare(`
      INSERT INTO events (title, description, event_date, location, event_type, target_audience, max_attendees, organizer_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      title, 
      description, 
      event_date, 
      location || null, 
      event_type || 'general', 
      target_audience || 'all', 
      max_attendees || null, 
      organizer_id
    ).run();

    console.log('DB Result:', { success, meta });

    if (success) {
      const eventId = meta.last_row_id;
      return c.json({ success: true, message: 'تم إنشاء الفعالية بنجاح', event_id: eventId });
    } else {
      return c.json({ success: false, error: 'فشل في إنشاء الفعالية' }, 500);
    }
  } catch (error) {
    console.error('Error creating event:', error);
    return c.json({ success: false, error: 'خطأ في إنشاء الفعالية: ' + error.message }, 500);
  }
});

// إرسال دعوات للفعالية
app.post('/api/events/:id/send-invitations', async (c) => {
  try {
    const eventId = c.req.param('id');
    const { target_levels, member_ids, custom_message } = await c.req.json();
    
    let invitedMembers = [];
    
    // إذا تم تحديد مستويات القرابة
    if (target_levels && target_levels.length > 0) {
      const placeholders = target_levels.map(() => '?').join(',');
      const { results } = await c.env.DB.prepare(`
        SELECT id, full_name, relationship_level, phone, email
        FROM family_members 
        WHERE relationship_level IN (${placeholders}) AND is_active = 1
      `).bind(...target_levels).all();
      invitedMembers = results;
    }
    
    // إذا تم تحديد أعضاء محددين
    if (member_ids && member_ids.length > 0) {
      const placeholders = member_ids.map(() => '?').join(',');
      const { results } = await c.env.DB.prepare(`
        SELECT id, full_name, relationship_level, phone, email
        FROM family_members 
        WHERE id IN (${placeholders}) AND is_active = 1
      `).bind(...member_ids).all();
      // دمج مع المجموعة السابقة إذا وجدت
      const existingIds = new Set(invitedMembers.map(m => m.id));
      invitedMembers = [...invitedMembers, ...results.filter(m => !existingIds.has(m.id))];
    }
    
    // إرسال الدعوات
    let sentCount = 0;
    for (const member of invitedMembers) {
      try {
        const { success } = await c.env.DB.prepare(`
          INSERT OR IGNORE INTO event_invitations (event_id, member_id, notes)
          VALUES (?, ?, ?)
        `).bind(eventId, member.id, custom_message || '').run();
        
        if (success) sentCount++;
      } catch (err) {
        // تجاهل الأخطاء المتعلقة بالدعوات المكررة
        console.log(`فشل في إرسال دعوة للعضو ${member.full_name}:`, err);
      }
    }
    
    return c.json({
      success: true,
      message: `تم إرسال ${sentCount} دعوة من أصل ${invitedMembers.length} عضو`,
      invited_count: sentCount,
      total_members: invitedMembers.length
    });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في إرسال الدعوات' }, 500);
  }
});

// الحصول على دعوات فعالية محددة
app.get('/api/events/:id/invitations', async (c) => {
  try {
    const eventId = c.req.param('id');
    
    const { results } = await c.env.DB.prepare(`
      SELECT ei.*, fm.full_name, fm.phone, fm.email, fm.relationship_level
      FROM event_invitations ei
      JOIN family_members fm ON ei.member_id = fm.id
      WHERE ei.event_id = ?
      ORDER BY ei.invited_at DESC
    `).bind(eventId).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'فشل في جلب دعوات الفعالية' }, 500);
  }
});

// الرد على دعوة (قبول/رفض/ربما)
app.post('/api/invitations/:id/respond', async (c) => {
  try {
    const invitationId = c.req.param('id');
    const { response, notes } = await c.req.json();
    
    if (!['accepted', 'declined', 'maybe'].includes(response)) {
      return c.json({ success: false, error: 'رد غير صحيح' }, 400);
    }
    
    const { success } = await c.env.DB.prepare(`
      UPDATE event_invitations 
      SET invitation_status = ?, responded_at = CURRENT_TIMESTAMP, notes = ?
      WHERE id = ?
    `).bind(response, notes || '', invitationId).run();
    
    if (success) {
      return c.json({ success: true, message: 'تم تحديث رد الدعوة بنجاح' });
    } else {
      return c.json({ success: false, error: 'فشل في تحديث رد الدعوة' }, 500);
    }
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في تحديث رد الدعوة' }, 500);
  }
});

// الحصول على إحصائيات الدعوات لفعالية
app.get('/api/events/:id/invitation-stats', async (c) => {
  try {
    const eventId = c.req.param('id');
    
    const { results } = await c.env.DB.prepare(`
      SELECT 
        invitation_status,
        COUNT(*) as count
      FROM event_invitations 
      WHERE event_id = ?
      GROUP BY invitation_status
    `).bind(eventId).all();
    
    const stats = {
      pending: 0,
      accepted: 0,
      declined: 0,
      maybe: 0,
      total: 0
    };
    
    results.forEach(row => {
      stats[row.invitation_status] = row.count;
      stats.total += row.count;
    });
    
    return c.json({ success: true, data: stats });
  } catch (error) {
    return c.json({ success: false, error: 'فشل في جلب إحصائيات الدعوات' }, 500);
  }
});

// API لمكتبة التجارب والخبرات
app.get('/api/library', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT lc.*, fm.full_name as author_name
      FROM library_content lc
      LEFT JOIN family_members fm ON lc.created_by = fm.id
      WHERE lc.published_at IS NOT NULL
      ORDER BY lc.is_featured DESC, lc.published_at DESC
      LIMIT 50
    `).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'فشل في جلب محتوى المكتبة' }, 500);
  }
});

app.get('/api/library/categories', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT category, COUNT(*) as count
      FROM library_content 
      WHERE published_at IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'فشل في جلب فئات المحتوى' }, 500);
  }
});

app.get('/api/library/featured', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT lc.*, fm.full_name as author_name
      FROM library_content lc
      LEFT JOIN family_members fm ON lc.created_by = fm.id
      WHERE lc.is_featured = TRUE AND lc.published_at IS NOT NULL
      ORDER BY lc.published_at DESC
      LIMIT 6
    `).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    return c.json({ success: false, error: 'فشل في جلب المحتوى المميز' }, 500);
  }
});

app.post('/api/library/view/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { success } = await c.env.DB.prepare(`
      UPDATE library_content 
      SET views = views + 1 
      WHERE id = ?
    `).bind(id).run();

    if (success) {
      return c.json({ success: true });
    } else {
      return c.json({ success: false, error: 'فشل في تحديث عدد المشاهدات' }, 500);
    }
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في تحديث المشاهدات' }, 500);
  }
});

// صفحة شجرة العائلة مع إدارة الأعضاء
app.get('/family', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full p-3">
                <i class="fas fa-sitemap text-2xl"></i>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">شجرة العائلة</h1>
                <p class="text-gray-600">أفراد عائلة آل سعيدان وإدارتها</p>
              </div>
            </div>
            <nav class="hidden md:flex items-center space-x-6 space-x-reverse">
              <a href="/" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الرئيسية</a>
              <a href="/family" class="text-blue-600 font-semibold">شجرة العائلة</a>
              <a href="/events" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الفعاليات</a>
              <a href="/suggestions" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">شاركنا أفكارك</a>
              <a href="/library" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">مكتبة التجارب</a>
            </nav>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar for Family Management */}
        <div class="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div class="flex flex-wrap items-center justify-between">
            <div class="flex items-center mb-4 md:mb-0">
              <i class="fas fa-users-cog text-2xl ml-3 opacity-90"></i>
              <div>
                <h3 class="text-xl font-bold">إدارة أفراد العائلة</h3>
                <p class="text-sm opacity-90">إضافة وتعديل وإدارة أعضاء العائلة</p>
              </div>
            </div>
            <div class="flex space-x-3 space-x-reverse">
              <button id="add-member-btn" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all flex items-center">
                <i class="fas fa-user-plus ml-2"></i>
                عضو جديد
              </button>
              <button id="toggle-edit-mode" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all flex items-center">
                <i class="fas fa-edit ml-2"></i>
                <span id="edit-mode-text">وضع التعديل</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Member Modal */}
        <div id="member-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
          <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 id="modal-title" class="text-2xl font-bold text-gray-800">إضافة عضو جديد</h3>
                <button id="close-member-modal" class="text-gray-500 hover:text-gray-700 text-2xl">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <form id="member-form">
                <input type="hidden" id="member-id" name="member_id" />
                
                <div class="grid gap-6">
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-gray-700 font-semibold mb-2">الاسم الكامل *</label>
                      <input type="text" name="full_name" required class="form-input" placeholder="مثال: محمد عبدالله آل سعيدان" />
                    </div>
                    <div>
                      <label class="block text-gray-700 font-semibold mb-2">الوالد</label>
                      <select name="father_id" class="form-input">
                        <option value="">بدون والد (للمؤسس)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-gray-700 font-semibold mb-2">رقم الجيل</label>
                      <select name="generation" class="form-input">
                        <option value="1">الجيل الأول (المؤسس)</option>
                        <option value="2">الجيل الثاني</option>
                        <option value="3" selected>الجيل الثالث</option>
                        <option value="4">الجيل الرابع</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-gray-700 font-semibold mb-2">مستوى القرابة</label>
                      <select name="relationship_level" class="form-input">
                        <option value="family">العائلة المباشرة</option>
                        <option value="close">قرابة قريبة</option>
                        <option value="extended">قرابة بعيدة</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-gray-700 font-semibold mb-2">تاريخ الميلاد</label>
                      <input type="date" name="birth_date" class="form-input" />
                    </div>
                    <div>
                      <label class="block text-gray-700 font-semibold mb-2">رقم الهوية</label>
                      <input type="text" name="national_id" class="form-input" placeholder="1234567890" />
                    </div>
                  </div>
                  
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-gray-700 font-semibold mb-2">رقم الجوال</label>
                      <input type="tel" name="phone" class="form-input" placeholder="0501234567" />
                    </div>
                    <div>
                      <label class="block text-gray-700 font-semibold mb-2">البريد الإلكتروني</label>
                      <input type="email" name="email" class="form-input" placeholder="example@example.com" />
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 font-semibold mb-2">مجال التميز</label>
                    <input type="text" name="field_of_excellence" class="form-input" placeholder="مثال: الأعمال، العلوم، الطب..." />
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 font-semibold mb-2">الإنجازات والتميز</label>
                    <textarea name="achievements" rows="3" class="form-input" placeholder="وصف مختصر للإنجازات والتميز..."></textarea>
                  </div>
                  
                  <div class="flex justify-center space-x-4 space-x-reverse">
                    <button type="submit" id="save-member-btn" class="btn-primary">
                      <i class="fas fa-save ml-2"></i>
                      حفظ
                    </button>
                    <button type="button" id="cancel-member-btn" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all">
                      <i class="fas fa-times ml-2"></i>
                      إلغاء
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <div id="confirm-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div class="p-6 text-center">
              <div class="mb-4">
                <i class="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-4">تأكيد الحذف</h3>
              <p class="text-gray-600 mb-6">هل أنت متأكد من إلغاء تفعيل هذا العضو؟</p>
              <div class="flex justify-center space-x-4 space-x-reverse">
                <button id="confirm-delete" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all">
                  <i class="fas fa-trash ml-2"></i>
                  حذف
                </button>
                <button id="cancel-delete" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all">
                  <i class="fas fa-times ml-2"></i>
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Family Tree Container */}
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="mb-8 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-4">
              <i class="fas fa-crown text-2xl text-white"></i>
            </div>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">شجرة عائلة آل سعيدان</h2>
            <p class="text-gray-600">نسب وأجيال العائلة الكريمة</p>
          </div>

          {/* Loading State */}
          <div id="family-loading" class="text-center py-12">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-600">جاري تحميل شجرة العائلة...</p>
          </div>

          {/* Family Tree Content */}
          <div id="family-tree" class="hidden">
            {/* Will be populated by JavaScript */}
          </div>
        </div>
      </main>
    </div>,
    { title: 'شجرة العائلة وإدارتها - تطبيق آل سعيدان' }
  )
});

// صفحة الفعاليات ونظام الدعوات
app.get('/events', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full p-3">
                <i class="fas fa-calendar-alt text-2xl"></i>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">الفعاليات</h1>
                <p class="text-gray-600">فعاليات ولقاءات العائلة ونظام الدعوات</p>
              </div>
            </div>
            <nav class="hidden md:flex items-center space-x-6 space-x-reverse">
              <a href="/" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الرئيسية</a>
              <a href="/family" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">شجرة العائلة</a>
              <a href="/events" class="text-blue-600 font-semibold">الفعاليات</a>
              <a href="/suggestions" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">شاركنا أفكارك</a>
              <a href="/library" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">مكتبة التجارب</a>
            </nav>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar for Council Members */}
        <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div class="flex flex-wrap items-center justify-between">
            <div class="flex items-center mb-4 md:mb-0">
              <i class="fas fa-crown text-2xl ml-3 opacity-90"></i>
              <div>
                <h3 class="text-xl font-bold">لوحة تحكم مجلس الأسرة</h3>
                <p class="text-sm opacity-90">إدارة الفعاليات وإرسال الدعوات</p>
              </div>
            </div>
            <div class="flex space-x-3 space-x-reverse">
              <button id="create-event-btn" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all flex items-center">
                <i class="fas fa-plus ml-2"></i>
                فعالية جديدة
              </button>
              <button id="manage-invitations-btn" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all flex items-center">
                <i class="fas fa-envelope ml-2"></i>
                إدارة الدعوات
              </button>
            </div>
          </div>
        </div>

        {/* Create New Event Modal */}
        <div id="event-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
          <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-gray-800">إنشاء فعالية جديدة</h3>
                <button id="close-event-modal" class="text-gray-500 hover:text-gray-700 text-2xl">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <form id="create-event-form">
                <div class="grid gap-6">
                  <div>
                    <label class="block text-gray-700 font-semibold mb-2">اسم الفعالية</label>
                    <input type="text" name="title" required class="form-input" placeholder="مثال: اجتماع العائلة السنوي..." />
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 font-semibold mb-2">وصف الفعالية</label>
                    <textarea name="description" rows="3" class="form-input" placeholder="وصف مفصل للفعالية وأهدافها..."></textarea>
                  </div>
                  
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-gray-700 font-semibold mb-2">تاريخ ووقت الفعالية</label>
                      <input type="datetime-local" name="event_date" required class="form-input" />
                    </div>
                    <div>
                      <label class="block text-gray-700 font-semibold mb-2">المكان</label>
                      <input type="text" name="location" class="form-input" placeholder="مكان إقامة الفعالية..." />
                    </div>
                  </div>
                  
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-gray-700 font-semibold mb-2">نوع الفعالية</label>
                      <select name="event_type" class="form-input">
                        <option value="general">عامة</option>
                        <option value="meeting">اجتماع</option>
                        <option value="celebration">احتفالية</option>
                        <option value="educational">تعليمية</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-gray-700 font-semibold mb-2">العدد الأقصى للحضور</label>
                      <input type="number" name="max_attendees" class="form-input" placeholder="اختياري..." />
                    </div>
                  </div>
                  
                  <div class="text-center">
                    <button type="submit" class="btn-primary">
                      <i class="fas fa-calendar-plus ml-2"></i>
                      إنشاء الفعالية
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Invitation Management Modal */}
        <div id="invitation-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
          <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-gray-800">إدارة دعوات الفعالية</h3>
                <button id="close-invitation-modal" class="text-gray-500 hover:text-gray-700 text-2xl">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              {/* Event Selection */}
              <div class="mb-6">
                <label class="block text-gray-700 font-semibold mb-2">اختر الفعالية</label>
                <select id="selected-event" class="form-input">
                  <option value="">اختر الفعالية للدعوة...</option>
                  {/* Will be populated by JavaScript */}
                </select>
              </div>
              
              {/* Invitation Targeting */}
              <div id="invitation-targeting" class="hidden">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h4 class="text-lg font-bold text-blue-800 mb-4">
                    <i class="fas fa-bullseye ml-2"></i>
                    تحديد المدعوين
                  </h4>
                  
                  <div class="grid md:grid-cols-3 gap-4">
                    {/* Quick Selection by Relationship Level */}
                    <div class="bg-white rounded-lg p-4 border">
                      <h5 class="font-semibold text-gray-800 mb-3">حسب مستوى القرابة</h5>
                      <div class="space-y-2">
                        <label class="flex items-center">
                          <input type="checkbox" name="relationship_level" value="family" class="form-checkbox ml-2" />
                          الأسرة المباشرة (صغير)
                        </label>
                        <label class="flex items-center">
                          <input type="checkbox" name="relationship_level" value="close" class="form-checkbox ml-2" />
                          القرابة القريبة (متوسط)
                        </label>
                        <label class="flex items-center">
                          <input type="checkbox" name="relationship_level" value="extended" class="form-checkbox ml-2" />
                          القرابة البعيدة (كبير)
                        </label>
                      </div>
                    </div>
                    
                    {/* Quick Selection by Generation */}
                    <div class="bg-white rounded-lg p-4 border">
                      <h5 class="font-semibold text-gray-800 mb-3">حسب الجيل</h5>
                      <div class="space-y-2">
                        <label class="flex items-center">
                          <input type="checkbox" name="generation" value="1" class="form-checkbox ml-2" />
                          الجيل الأول
                        </label>
                        <label class="flex items-center">
                          <input type="checkbox" name="generation" value="2" class="form-checkbox ml-2" />
                          الجيل الثاني
                        </label>
                        <label class="flex items-center">
                          <input type="checkbox" name="generation" value="3" class="form-checkbox ml-2" />
                          الجيل الثالث
                        </label>
                      </div>
                    </div>
                    
                    {/* Individual Selection */}
                    <div class="bg-white rounded-lg p-4 border">
                      <h5 class="font-semibold text-gray-800 mb-3">اختيار فردي</h5>
                      <div id="individual-members" class="space-y-2 max-h-32 overflow-y-auto">
                        {/* Will be populated by JavaScript */}
                      </div>
                    </div>
                  </div>
                  
                  {/* Custom Message */}
                  <div class="mt-4">
                    <label class="block text-gray-700 font-semibold mb-2">رسالة مخصصة (اختياري)</label>
                    <textarea id="custom-message" class="form-input" rows="2" placeholder="رسالة خاصة مع الدعوة..."></textarea>
                  </div>
                  
                  <div class="mt-6 flex justify-center">
                    <button id="send-invitations-btn" class="btn-primary">
                      <i class="fas fa-paper-plane ml-2"></i>
                      إرسال الدعوات
                    </button>
                  </div>
                </div>
                
                {/* Invitation Statistics */}
                <div id="invitation-stats" class="hidden bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 class="text-lg font-bold text-green-800 mb-4">
                    <i class="fas fa-chart-pie ml-2"></i>
                    إحصائيات الدعوات
                  </h4>
                  <div id="stats-content" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Will be populated by JavaScript */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="mb-8 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mb-4">
              <i class="fas fa-calendar-check text-2xl text-white"></i>
            </div>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">فعاليات العائلة</h2>
            <p class="text-gray-600">اللقاءات والمناسبات العائلية القادمة والسابقة</p>
          </div>

          {/* Loading State */}
          <div id="events-loading" class="text-center py-12">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-600">جاري تحميل الفعاليات...</p>
          </div>

          {/* Events Content */}
          <div id="events-list" class="hidden">
            {/* Will be populated by JavaScript */}
          </div>
          
          {/* Empty State */}
          <div id="events-empty" class="hidden text-center py-12">
            <i class="fas fa-calendar-times text-gray-400 text-4xl mb-4"></i>
            <p class="text-gray-600 text-lg mb-2">لا توجد فعاليات مجدولة حالياً</p>
            <p class="text-gray-500">ابدأ بإنشاء فعالية جديدة من خلال لوحة التحكم أعلاه</p>
          </div>
        </div>
      </main>
    </div>,
    { title: 'الفعاليات ونظام الدعوات - تطبيق آل سعيدان' }
  )
});

// صفحة مكتبة التجارب والخبرات
app.get('/library', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-3">
                <i class="fas fa-book-open text-2xl"></i>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">مكتبة التجارب</h1>
                <p class="text-gray-600">خبرات وتجارب أعضاء العائلة المتميزين</p>
              </div>
            </div>
            <nav class="hidden md:flex items-center space-x-6 space-x-reverse">
              <a href="/" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الرئيسية</a>
              <a href="/family" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">شجرة العائلة</a>
              <a href="/events" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الفعاليات</a>
              <a href="/suggestions" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">شاركنا أفكارك</a>
              <a href="/library" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">مكتبة التجارب</a>
              <a href="/library" class="text-purple-600 font-semibold">مكتبة التجارب</a>
            </nav>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white text-center">
          <div class="mb-6">
            <i class="fas fa-lightbulb text-4xl mb-4 opacity-90"></i>
          </div>
          <h2 class="text-3xl font-bold mb-4">مكتبة تجارب وخبرات آل سعيدان</h2>
          <p class="text-xl opacity-90 mb-6">نستلهم من تجارب الماضي لنبني مستقبلاً أفضل</p>
          <div class="bg-white bg-opacity-20 rounded-lg p-4 max-w-2xl mx-auto">
            <p class="text-lg">"المعرفة تزداد بالمشاركة، والحكمة تنمو بالتجربة، والنجاح يتحقق بالتعلم من الآخرين"</p>
          </div>
        </div>

        {/* Filter and Categories */}
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div class="flex flex-wrap items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-800">تصفح حسب الفئة</h3>
            <div class="flex items-center space-x-4 space-x-reverse">
              <select id="category-filter" class="form-input text-sm">
                <option value="all">جميع الفئات</option>
                <option value="business">الأعمال والتجارة</option>
                <option value="education">التعليم والتطوير</option>
                <option value="personal_development">التطوير الشخصي</option>
                <option value="family_values">القيم العائلية</option>
                <option value="leadership">القيادة والإدارة</option>
              </select>
              <select id="content-type-filter" class="form-input text-sm">
                <option value="all">جميع الأنواع</option>
                <option value="article">مقالات</option>
                <option value="video">فيديوهات</option>
                <option value="audio">صوتيات</option>
                <option value="document">وثائق</option>
              </select>
            </div>
          </div>

          {/* Category Statistics */}
          <div id="category-stats" class="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Will be populated by JavaScript */}
          </div>
        </div>

        {/* Featured Content */}
        <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-2 ml-3">
                <i class="fas fa-star text-white"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-800">المحتوى المميز</h3>
            </div>
          </div>

          {/* Featured Content Loading */}
          <div id="featured-loading" class="text-center py-8">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-600">جاري تحميل المحتوى المميز...</p>
          </div>

          {/* Featured Content Grid */}
          <div id="featured-content" class="hidden grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Will be populated by JavaScript */}
          </div>
        </div>

        {/* All Content */}
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-2 ml-3">
                <i class="fas fa-archive text-white"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-800">جميع التجارب والخبرات</h3>
            </div>
            <div class="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <i class="fas fa-sort"></i>
              <span>مرتبة حسب الأحدث</span>
            </div>
          </div>

          {/* Content Loading */}
          <div id="content-loading" class="text-center py-12">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-600">جاري تحميل محتوى المكتبة...</p>
          </div>

          {/* Content List */}
          <div id="content-list" class="hidden space-y-6">
            {/* Will be populated by JavaScript */}
          </div>

          {/* Empty State */}
          <div id="empty-state" class="hidden text-center py-12">
            <i class="fas fa-book-open text-gray-400 text-4xl mb-4"></i>
            <p class="text-gray-600">لا يوجد محتوى متاح حالياً</p>
            <p class="text-sm text-gray-500">تابعونا لإضافة المزيد من التجارب والخبرات</p>
          </div>
        </div>

        {/* Call to Action */}
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mt-8 text-white text-center">
          <div class="mb-4">
            <i class="fas fa-handshake text-3xl mb-4 opacity-90"></i>
          </div>
          <h3 class="text-2xl font-bold mb-4">شارك تجربتك مع العائلة</h3>
          <p class="text-lg opacity-90 mb-6">هل لديك تجربة أو خبرة تود مشاركتها؟ ساهم في إثراء مكتبة العائلة</p>
          <div class="bg-white bg-opacity-20 rounded-lg p-4">
            <p class="text-sm">للمساهمة بمحتوى جديد، يرجى التواصل مع مجلس الأسرة</p>
            <div class="mt-3">
              <a href="tel:0533361154" class="text-yellow-300 hover:text-yellow-100 font-medium">
                <i class="fas fa-phone ml-1"></i>
                0533361154
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>,
    { title: 'مكتبة التجارب - تطبيق آل سعيدان' }
  )
});

// صفحة المقترحات
app.get('/suggestions', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full p-3">
                <i class="fas fa-lightbulb text-2xl"></i>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">شاركنا أفكارك</h1>
                <p class="text-gray-600">مقترحات لتطوير العائلة</p>
              </div>
            </div>
            <nav class="hidden md:flex items-center space-x-6 space-x-reverse">
              <a href="/" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الرئيسية</a>
              <a href="/family" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">شجرة العائلة</a>
              <a href="/events" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الفعاليات</a>
              <a href="/suggestions" class="text-blue-600 font-semibold">شاركنا أفكارك</a>
            </nav>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Suggestions Form */}
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div class="mb-6 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4">
              <i class="fas fa-plus-circle text-2xl text-white"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">شارك مقترحك الجديد</h2>
            <p class="text-gray-600">ساهم في تطوير العائلة بأفكارك المبدعة</p>
          </div>

          <form id="suggestion-form" class="max-w-2xl mx-auto">
            <div class="grid gap-6">
              <div>
                <label class="block text-gray-700 font-semibold mb-2">عنوان المقترح</label>
                <input type="text" name="title" required class="form-input" placeholder="اكتب عنوان مقترحك هنا..." />
              </div>
              
              <div>
                <label class="block text-gray-700 font-semibold mb-2">وصف المقترح</label>
                <textarea name="description" required rows="4" class="form-input" placeholder="اشرح مقترحك بالتفصيل..."></textarea>
              </div>

              <div>
                <label class="block text-gray-700 font-semibold mb-2">فئة المقترح</label>
                <select name="category" class="form-input">
                  <option value="event">فعالية أو مناسبة</option>
                  <option value="improvement">تحسين أو تطوير</option>
                  <option value="program">برنامج أو ورشة</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div class="text-center">
                <button type="submit" class="btn-primary">
                  <i class="fas fa-paper-plane ml-2"></i>
                  إرسال المقترح
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Existing Suggestions */}
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="mb-6 text-center">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">المقترحات الحالية</h3>
            <p class="text-gray-600">تصفح المقترحات المقدمة من أعضاء العائلة</p>
          </div>

          {/* Loading State */}
          <div id="suggestions-loading" class="text-center py-12">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-600">جاري تحميل المقترحات...</p>
          </div>

          {/* Suggestions List */}
          <div id="suggestions-list" class="hidden">
            {/* Will be populated by JavaScript */}
          </div>
        </div>
      </main>
    </div>,
    { title: 'شاركنا أفكارك - تطبيق آل سعيدان' }
  )
});

// الصفحة الرئيسية
app.get('/', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full p-3">
                <i class="fas fa-users text-2xl"></i>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">تطبيق آل سعيدان</h1>
                <p class="text-gray-600">منصة التواصل العائلي</p>
              </div>
            </div>
            <nav class="hidden md:flex items-center space-x-6 space-x-reverse">
              <a href="/" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الرئيسية</a>
              <a href="/family" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">شجرة العائلة</a>
              <a href="/events" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">الفعاليات</a>
              <a href="/suggestions" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">شاركنا أفكارك</a>
              <a href="/library" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">مكتبة التجارب</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Card */}
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-12 text-center">
          <div class="mb-6">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-4">
              <i class="fas fa-hand-peace text-3xl text-white"></i>
            </div>
          </div>
          <h2 class="text-4xl font-bold text-gray-800 mb-4">أهلاً وسهلاً بعائلة آل سعيدان</h2>
          <p class="text-xl text-gray-600 mb-6">منصة تفاعلية لربط أفراد العائلة الكريمة وتنظيم الفعاليات العائلية</p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p class="text-blue-800 mb-2"><i class="fas fa-info-circle ml-2"></i> <strong>مجلس الأسرة الحالي (الجيل الثالث):</strong></p>
            <p class="text-blue-700 text-sm">رئيس المجلس: سلمان عبدالله آل سعيدان (ابن عبدالله)</p>
            <p class="text-blue-700 text-sm">الأعضاء: خالد فهد، هشام حمد، بدر إبراهيم آل سعيدان</p>
          </div>
        </div>

        {/* Features Grid */}
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* شجرة العائلة */}
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" onclick="window.location.href='/family'">
            <div class="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <i class="fas fa-sitemap text-blue-600 text-xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">شجرة العائلة</h3>
            <p class="text-gray-600 text-sm">تصفح أفراد العائلة والأجيال المختلفة</p>
            <div class="mt-4 text-blue-600 text-sm font-medium">استكشف الآن →</div>
          </div>

          {/* الفعاليات */}
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" onclick="window.location.href='/events'">
            <div class="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <i class="fas fa-calendar-alt text-green-600 text-xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">الفعاليات</h3>
            <p class="text-gray-600 text-sm">تصفح الفعاليات القادمة والسابقة</p>
            <div class="mt-4 text-green-600 text-sm font-medium">شاهد المزيد →</div>
          </div>

          {/* المقترحات */}
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" onclick="window.location.href='/suggestions'">
            <div class="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <i class="fas fa-lightbulb text-yellow-600 text-xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">شاركنا أفكارك</h3>
            <p class="text-gray-600 text-sm">قدم مقترحاتك لتطوير العائلة</p>
            <div class="mt-4 text-yellow-600 text-sm font-medium">شارك الآن →</div>
          </div>

          {/* مكتبة التجارب */}
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" onclick="window.location.href='/library'">
            <div class="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <i class="fas fa-book-open text-purple-600 text-xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">مكتبة التجارب</h3>
            <p class="text-gray-600 text-sm">تجارب وخبرات الأعضاء المميزين</p>
            <div class="mt-4 text-purple-600 text-sm font-medium">تصفح المكتبة →</div>
          </div>
        </div>

        {/* Legacy Section */}
        <div class="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <div class="mb-6">
            <i class="fas fa-crown text-4xl mb-4 opacity-90"></i>
          </div>
          <h2 class="text-3xl font-bold mb-4">تراث الشيخ محمد بن عبدالله بن سعيدان</h2>
          <p class="text-xl opacity-90 mb-6">نحافظ على تراث أجدادنا ونبني مستقبلاً مشرقاً للأجيال القادمة</p>
          <div class="bg-white bg-opacity-20 rounded-lg p-4 max-w-2xl mx-auto">
            <p class="text-lg">"العائلة المتماسكة قوة، والتراث المحفوظ هوية، والمستقبل المشترك أمل"</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer class="bg-gray-800 text-white py-8 mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <div class="flex justify-center items-center mb-4">
              <div class="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full p-2 ml-3">
                <i class="fas fa-users"></i>
              </div>
              <span class="text-xl font-semibold">تطبيق آل سعيدان</span>
            </div>
            <p class="text-gray-400 mb-4">منصة تجمع العائلة وتحافظ على التراث</p>
            <div class="border-t border-gray-700 pt-4">
              <p class="text-sm text-gray-500">
                للتواصل: <a href="tel:0533361154" class="text-blue-400 hover:text-blue-300">0533361154</a> | 
                <a href="mailto:info@salmansaedan.com" class="text-blue-400 hover:text-blue-300">info@salmansaedan.com</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>,
    { title: 'تطبيق آل سعيدان - منصة التواصل العائلي' }
  )
})

export default app
