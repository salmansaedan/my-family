#!/usr/bin/env node

/**
 * سكريبت استيراد البيانات الأصلية لعائلة بن سعيدان
 * يحول البيانات من family-seed-data.js إلى قاعدة البيانات D1 الجديدة
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// استيراد البيانات الأصلية
const familySeedData = {
    familyMembers: [
        // المؤسس - الجيل الأول
        {
            id: 'founder_muhammad',
            full_name: 'محمد بن سعيدان',
            father_id: null,
            generation: 1,
            membership_type: 'founder',
            birth_date: '1920-01-01',
            location: 'نجد',
            phone: '',
            email: '',
            notes: 'مؤسس عائلة بن سعيدان',
            created_at: new Date().toISOString()
        },
        
        // الجيل الثاني - أبناء وبنات المؤسس محمد
        {
            id: 'abdullah_muhammad',
            full_name: 'عبدالله محمد بن سعيدان',
            father_id: 'founder_muhammad',
            generation: 2,
            membership_type: 'chairman',
            birth_date: '1950-01-01',
            location: 'الرياض',
            phone: '',
            email: '',
            gender: 'male',
            created_at: new Date().toISOString()
        },
        {
            id: 'munira_muhammad',
            full_name: 'منيرة محمد بن سعيدان',
            father_id: 'founder_muhammad',
            generation: 2,
            membership_type: 'board_member',
            birth_date: '1952-01-01',
            location: 'الرياض',
            phone: '',
            email: '',
            gender: 'female',
            created_at: new Date().toISOString()
        },
        {
            id: 'fahd_muhammad',
            full_name: 'فهد محمد بن سعيدان',
            father_id: 'founder_muhammad',
            generation: 2,
            membership_type: 'board_member',
            birth_date: '1954-01-01',
            location: 'الدمام',
            phone: '',
            email: '',
            gender: 'male',
            created_at: new Date().toISOString()
        },
        {
            id: 'hamd_muhammad',
            full_name: 'حمد محمد بن سعيدان',
            father_id: 'founder_muhammad',
            generation: 2,
            membership_type: 'board_member',
            birth_date: '1956-01-01',
            location: 'جدة',
            phone: '',
            email: '',
            gender: 'male',
            created_at: new Date().toISOString()
        },
        {
            id: 'ibrahim_muhammad',
            full_name: 'ابراهيم محمد بن سعيدان',
            father_id: 'founder_muhammad',
            generation: 2,
            membership_type: 'assembly_member',
            birth_date: '1958-01-01',
            location: 'المدينة المنورة',
            phone: '',
            email: '',
            gender: 'male',
            created_at: new Date().toISOString()
        },
        {
            id: 'sarah_muhammad',
            full_name: 'سارة محمد بن سعيدان',
            father_id: 'founder_muhammad',
            generation: 2,
            membership_type: 'family_member',
            birth_date: '1960-01-01',
            location: 'الرياض',
            phone: '',
            email: '',
            gender: 'female',
            created_at: new Date().toISOString()
        },
        {
            id: 'abdulrahman_muhammad',
            full_name: 'عبدالرحمن محمد بن سعيدان',
            father_id: 'founder_muhammad',
            generation: 2,
            membership_type: 'assembly_member',
            birth_date: '1962-01-01',
            location: 'الأحساء',
            phone: '',
            email: '',
            gender: 'male',
            created_at: new Date().toISOString()
        },
        {
            id: 'nasser_muhammad',
            full_name: 'ناصر محمد بن سعيدان',
            father_id: 'founder_muhammad',
            generation: 2,
            membership_type: 'assembly_member',
            birth_date: '1964-01-01',
            location: 'الطائف',
            phone: '',
            email: '',
            gender: 'male',
            created_at: new Date().toISOString()
        },
        {
            id: 'saad_muhammad',
            full_name: 'سعد محمد بن سعيدان',
            father_id: 'founder_muhammad',
            generation: 2,
            membership_type: 'family_member',
            birth_date: '1966-01-01',
            location: 'بريدة',
            phone: '',
            email: '',
            gender: 'male',
            created_at: new Date().toISOString()
        },
        {
            id: 'nora_muhammad',
            full_name: 'نورة محمد بن سعيدان',
            father_id: 'founder_muhammad',
            generation: 2,
            membership_type: 'family_member',
            birth_date: '1968-01-01',
            location: 'الخبر',
            phone: '',
            email: '',
            gender: 'female',
            created_at: new Date().toISOString()
        },
        {
            id: 'abdulmohsen_muhammad',
            full_name: 'عبدالمحسن محمد بن سعيدان',
            father_id: 'founder_muhammad',
            generation: 2,
            membership_type: 'family_member',
            birth_date: '1970-01-01',
            location: 'الرياض',
            phone: '',
            email: '',
            gender: 'male',
            created_at: new Date().toISOString()
        },
        {
            id: 'abdulaziz_muhammad',
            full_name: 'عبدالعزيز محمد بن سعيدان',
            father_id: 'founder_muhammad',
            generation: 2,
            membership_type: 'family_member',
            birth_date: '1972-01-01',
            location: 'مكة المكرمة',
            phone: '',
            email: '',
            gender: 'male',
            created_at: new Date().toISOString()
        },
        {
            id: 'alanoud_muhammad',
            full_name: 'العنود محمد بن سعيدان',
            father_id: 'founder_muhammad',
            generation: 2,
            membership_type: 'family_member',
            birth_date: '1974-01-01',
            location: 'الدمام',
            phone: '',
            email: '',
            gender: 'female',
            created_at: new Date().toISOString()
        },
        {
            id: 'mutaib_muhammad',
            full_name: 'متعب محمد بن سعيدان',
            father_id: 'founder_muhammad',
            generation: 2,
            membership_type: 'family_member',
            birth_date: '1976-01-01',
            location: 'القصيم',
            phone: '',
            email: '',
            gender: 'male',
            created_at: new Date().toISOString()
        },
        {
            id: 'wasmiah_muhammad',
            full_name: 'وسمية محمد بن سعيدان',
            father_id: 'founder_muhammad',
            generation: 2,
            membership_type: 'family_member',
            birth_date: '1978-01-01',
            location: 'الرياض',
            phone: '',
            email: '',
            gender: 'female',
            created_at: new Date().toISOString()
        },
        {
            id: 'bandar_muhammad',
            full_name: 'بندر محمد بن سعيدان',
            father_id: 'founder_muhammad',
            generation: 2,
            membership_type: 'family_member',
            birth_date: '1980-01-01',
            location: 'جدة',
            phone: '',
            email: '',
            gender: 'male',
            created_at: new Date().toISOString()
        }
    ]
};

/**
 * دالة تحويل البيانات إلى تنسيق قاعدة البيانات الجديدة
 */
function convertMemberData(memberData) {
    const nameParts = (memberData.full_name || '').split(' ');
    const firstName = nameParts[0] || 'غير محدد';
    const lastName = nameParts.slice(1).join(' ') || 'غير محدد';
    
    // تحديد الجنس بناءً على الاسم إذا لم يكن محدد
    let gender = memberData.gender || 'male';
    if (!memberData.gender) {
        const femaleNames = ['منيرة', 'سارة', 'نورة', 'العنود', 'وسمية'];
        const nameToCheck = firstName.toLowerCase();
        for (const femaleName of femaleNames) {
            if (nameToCheck.includes(femaleName.toLowerCase())) {
                gender = 'female';
                break;
            }
        }
    }
    
    // تحديد المهنة بناءً على نوع العضوية
    let profession = '';
    switch (memberData.membership_type) {
        case 'founder':
            profession = 'مؤسس العائلة';
            break;
        case 'chairman':
            profession = 'رئيس مجلس الإدارة';
            break;
        case 'board_member':
            profession = 'عضو مجلس إدارة';
            break;
        case 'assembly_member':
            profession = 'عضو جمعية عمومية';
            break;
        default:
            profession = 'عضو عائلة';
    }
    
    return {
        id: memberData.id,
        first_name: firstName,
        last_name: lastName,
        full_name: memberData.full_name || '',
        generation: memberData.generation || 1,
        phone: memberData.phone || '',
        email: memberData.email || '',
        profession: profession,
        bio: memberData.notes || `عضو في الجيل ${memberData.generation}`,
        birth_date: memberData.birth_date || null,
        father_id: memberData.father_id || null,
        is_alive: 1, // افتراض أن الجميع أحياء
        gender: gender,
        member_type: memberData.membership_type || 'family_member',
        location: memberData.location || '',
        created_at: new Date().toISOString()
    };
}

/**
 * إنشاء ملف SQL للاستيراد
 */
function generateImportSQL() {
    console.log('🔄 إنشاء ملف SQL لاستيراد البيانات...');
    
    let sql = `-- استيراد البيانات الأصلية لعائلة بن سعيدان
-- تاريخ الإنشاء: ${new Date().toISOString()}

-- حذف البيانات الاختبارية السابقة
DELETE FROM family_members WHERE id LIKE 'test_%' OR id = 'salman_founder';

-- إدراج سجل النشاط للاستيراد
INSERT OR IGNORE INTO activity_log (id, action, table_name, record_id, changes, timestamp)
VALUES ('import_' || datetime('now'), 'import', 'family_members', 'bulk', 'استيراد البيانات الأصلية للعائلة', datetime('now'));

`;

    // إضافة بيانات الأعضاء
    familySeedData.familyMembers.forEach(member => {
        const convertedMember = convertMemberData(member);
        
        sql += `
-- ${convertedMember.full_name}
INSERT OR REPLACE INTO family_members (
    id, first_name, last_name, full_name, generation, phone, email, profession,
    bio, birth_date, father_id, is_alive, gender, member_type, created_at
) VALUES (
    '${convertedMember.id}',
    '${convertedMember.first_name}',
    '${convertedMember.last_name}',
    '${convertedMember.full_name}',
    ${convertedMember.generation},
    '${convertedMember.phone}',
    '${convertedMember.email}',
    '${convertedMember.profession}',
    '${convertedMember.bio}',
    '${convertedMember.birth_date}',
    ${convertedMember.father_id ? `'${convertedMember.father_id}'` : 'NULL'},
    ${convertedMember.is_alive},
    '${convertedMember.gender}',
    '${convertedMember.member_type}',
    '${convertedMember.created_at}'
);
`;

        // إضافة سجل النشاط لكل عضو
        sql += `
INSERT OR IGNORE INTO activity_log (id, action, table_name, record_id, changes, timestamp)
VALUES ('${convertedMember.id}_import', 'create', 'family_members', '${convertedMember.id}', 'استيراد عضو: ${convertedMember.full_name}', datetime('now'));
`;
    });

    return sql;
}

/**
 * تشغيل عملية الاستيراد
 */
async function runImport() {
    try {
        console.log('📊 بدء عملية استيراد البيانات...');
        console.log(`📈 عدد الأعضاء المراد استيرادها: ${familySeedData.familyMembers.length}`);
        
        // إنشاء ملف SQL
        const importSQL = generateImportSQL();
        const sqlFilePath = path.join(process.cwd(), 'family-import.sql');
        
        fs.writeFileSync(sqlFilePath, importSQL, 'utf8');
        console.log('✅ تم إنشاء ملف SQL:', sqlFilePath);
        
        // تشغيل ملف SQL على قاعدة البيانات المحلية
        console.log('🔄 تشغيل الاستيراد على قاعدة البيانات المحلية...');
        const command = `npx wrangler d1 execute saedan-family-realtime --local --file=./family-import.sql`;
        
        const result = execSync(command, { encoding: 'utf8', cwd: process.cwd() });
        console.log('✅ تم تشغيل الاستيراد بنجاح');
        console.log('📋 نتيجة التشغيل:', result);
        
        // التحقق من نجاح الاستيراد
        console.log('🔍 التحقق من البيانات المستوردة...');
        const checkCommand = `npx wrangler d1 execute saedan-family-realtime --local --command="SELECT COUNT(*) as total, generation FROM family_members GROUP BY generation ORDER BY generation"`;
        
        const checkResult = execSync(checkCommand, { encoding: 'utf8', cwd: process.cwd() });
        console.log('📊 إحصائيات البيانات المستوردة:');
        console.log(checkResult);
        
        // حذف ملف SQL المؤقت
        fs.unlinkSync(sqlFilePath);
        console.log('🗑️  تم حذف ملف SQL المؤقت');
        
        console.log('\n🎉 تمت عملية استيراد البيانات بنجاح!');
        console.log('💡 يمكنك الآن تشغيل التطبيق لرؤية البيانات المسترجعة');
        
    } catch (error) {
        console.error('❌ خطأ في عملية الاستيراد:', error.message);
        process.exit(1);
    }
}

// تشغيل السكريبت
if (import.meta.url === `file://${process.argv[1]}`) {
    runImport();
}

export { familySeedData, convertMemberData, generateImportSQL, runImport };