
        // بيانات العائلة الأساسية
        const SAMPLE_FAMILY_DATA = {
            familyMembers: [
                // الجيل المؤسس (الجيل الأول)
                {
                    id: 'founder_001',
                    full_name: 'محمد بن سعيدان',
                    first_name: 'محمد',
                    middle_name: '',
                    last_name: 'بن سعيدان',
                    membership_type: 'founder',
                    gender: 'male',
                    father_id: null,
                    generation: 1,
                    birth_date: '1950-01-01',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: 'رجل أعمال',
                    specialization: 'التطوير العقاري',
                    phone: '0533361154',
                    email: 'info@salmansaedan.com',
                    hobbies: 'القراءة، الاستثمار العقاري، الأعمال الخيرية',
                    created_at: '2024-01-01'
                },
                
                // الجيل الثاني - أبناء محمد بن سعيدان
                {
                    id: 'gen2_001',
                    full_name: 'سلمان محمد بن سعيدان',
                    first_name: 'سلمان',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'chairman',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1975-05-15',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: 'مطور عقاري',
                    specialization: 'إدارة المشاريع العقارية',
                    phone: '0533361156',
                    email: 'salman@salmansaedan.com',
                    hobbies: 'السفر، التصوير، الرياضة، تطوير الأعمال',
                    created_at: '2024-01-02'
                },
                {
                    id: 'gen2_002',
                    full_name: 'عبدالله محمد بن سعيدان',
                    first_name: 'عبدالله',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1970-03-10',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-03'
                },
                {
                    id: 'gen2_003',
                    full_name: 'فهد محمد بن سعيدان',
                    first_name: 'فهد',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1972-07-22',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-04'
                },
                {
                    id: 'gen2_004',
                    full_name: 'حمد محمد بن سعيدان',
                    first_name: 'حمد',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1974-11-05',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-05'
                },
                {
                    id: 'gen2_005',
                    full_name: 'إبراهيم محمد بن سعيدان',
                    first_name: 'إبراهيم',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1976-09-18',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-06'
                },
                {
                    id: 'gen2_006',
                    full_name: 'عبدالرحمن محمد بن سعيدان',
                    first_name: 'عبدالرحمن',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1978-12-30',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-07'
                },
                {
                    id: 'gen2_007',
                    full_name: 'ناصر محمد بن سعيدان',
                    first_name: 'ناصر',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1980-04-12',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-08'
                },
                {
                    id: 'gen2_008',
                    full_name: 'سعد محمد بن سعيدان',
                    first_name: 'سعد',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1982-08-25',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-09'
                },
                {
                    id: 'gen2_009',
                    full_name: 'عبدالمحسن محمد بن سعيدان',
                    first_name: 'عبدالمحسن',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1984-02-14',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-10'
                },
                {
                    id: 'gen2_010',
                    full_name: 'عبدالعزيز محمد بن سعيدان',
                    first_name: 'عبدالعزيز',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1986-06-08',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-11'
                },
                {
                    id: 'gen2_011',
                    full_name: 'متعب محمد بن سعيدان',
                    first_name: 'متعب',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1988-10-20',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-12'
                },
                {
                    id: 'gen2_012',
                    full_name: 'بندر محمد بن سعيدان',
                    first_name: 'بندر',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1990-01-15',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-13'
                },
                
                // بنات محمد بن سعيدان (الجيل الثاني)
                {
                    id: 'gen2_013',
                    full_name: 'منيرة محمد بن سعيدان',
                    first_name: 'منيرة',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'family_member',
                    gender: 'female',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1973-05-12',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-14'
                },
                {
                    id: 'gen2_014',
                    full_name: 'سارة محمد بن سعيدان',
                    first_name: 'سارة',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'family_member',
                    gender: 'female',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1977-08-03',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-15'
                },
                {
                    id: 'gen2_015',
                    full_name: 'نورة محمد بن سعيدان',
                    first_name: 'نورة',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'family_member',
                    gender: 'female',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1981-11-26',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-16'
                },
                {
                    id: 'gen2_016',
                    full_name: 'العنود محمد بن سعيدان',
                    first_name: 'العنود',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'family_member',
                    gender: 'female',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1985-03-17',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-17'
                },
                {
                    id: 'gen2_017',
                    full_name: 'وسمية محمد بن سعيدان',
                    first_name: 'وسمية',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'family_member',
                    gender: 'female',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1987-09-09',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-18'
                }
            ],
            events: [
                {
                    id: 'event_001',
                    title: 'اجتماع العائلة السنوي',
                    description: 'الاجتماع السنوي لجميع أفراد العائلة',
                    date: '2024-12-15',
                    time: '18:00',
                    location: 'قاعة الملك فهد',
                    type: 'family',
                    status: 'upcoming',
                    attendees: 45
                }
            ],
            suggestions: [
                {
                    id: 'sugg_001',
                    title: 'تطوير تطبيق الجوال للعائلة',
                    category: 'technology',
                    priority: 'high',
                    description: 'إنشاء تطبيق جوال متقدم لإدارة شؤون العائلة والتواصل بين الأعضاء',
                    benefits: 'تسهيل التواصل، إدارة الأحداث، مشاركة الصور والذكريات',
                    budget: '75,000 ريال',
                    timeline: '6 أشهر',
                    resources: 'فريق تطوير، مصمم واجهات، مطور تطبيقات',
                    status: 'pending',
                    submitted_by: 'سلمان محمد بن سعيدان',
                    submitted_date: '2024-01-15',
                    votes: {
                        up: 18,
                        down: 2
                    },
                    comments: []
                },
                {
                    id: 'sugg_002',
                    title: 'تنظيم لقاء عائلي سنوي',
                    category: 'events',
                    priority: 'medium',
                    description: 'تنظيم لقاء عائلي سنوي يجمع جميع أفراد العائلة للتواصل وتقوية الروابط',
                    benefits: 'تقوية الروابط العائلية، تبادل الخبرات، إحياء التقاليد',
                    budget: '25,000 ريال',
                    timeline: '3 أشهر للتحضير',
                    resources: 'قاعة مناسبة، تنسيق الطعام، برنامج ترفيهي',
                    status: 'approved',
                    submitted_by: 'محمد بن سعيدان',
                    submitted_date: '2024-02-01',
                    votes: {
                        up: 24,
                        down: 1
                    },
                    comments: []
                },
                {
                    id: 'sugg_003',
                    title: 'إنشاء صندوق تعاوني للعائلة',
                    category: 'business',
                    priority: 'high',
                    description: 'تأسيس صندوق تعاوني لدعم أفراد العائلة في المشاريع والطوارئ',
                    benefits: 'الدعم المالي، تطوير المشاريع، التضامن العائلي',
                    budget: '500,000 ريال رأس مال أولي',
                    timeline: '4 أشهر للإجراءات القانونية',
                    resources: 'محامي متخصص، محاسب قانوني، مدير الصندوق',
                    status: 'under_review',
                    submitted_by: 'سلمان محمد بن سعيدان',
                    submitted_date: '2024-01-20',
                    votes: {
                        up: 12,
                        down: 5
                    },
                    comments: []
                }
            ],
            library: [
                {
                    id: 'lib_001',
                    title: 'تاريخ وأصول عائلة آل سعيدان',
                    author: 'محمد بن سعيدان',
                    type: 'document',
                    category: 'family_history',
                    description: 'وثيقة شاملة عن تاريخ العائلة وأصولها التي تمتد لقرون من الزمن',
                    keywords: ['تاريخ', 'نسب', 'عائلة', 'أصول', 'تراث'],
                    created_date: '2023-12-01',
                    language: 'arabic',
                    access_level: 'family',
                    featured: true,
                    url: '#',
                    views: 45,
                    downloads: 12
                },
                {
                    id: 'lib_002',
                    title: 'شجرة النسب الكاملة للعائلة',
                    author: 'نسابة متخصص',
                    type: 'document',
                    category: 'genealogy',
                    description: 'مخطط تفصيلي لشجرة النسب يوضح العلاقات العائلية عبر الأجيال',
                    keywords: ['نسب', 'شجرة', 'أجيال', 'علاقات عائلية'],
                    created_date: '2024-01-10',
                    language: 'arabic',
                    access_level: 'family',
                    featured: true,
                    url: '#',
                    views: 67,
                    downloads: 23
                },
                {
                    id: 'lib_003',
                    title: 'الوثائق الرسمية والسجلات',
                    author: 'إدارة الأرشيف العائلي',
                    type: 'document',
                    category: 'documents',
                    description: 'مجموعة الوثائق الرسمية والسجلات المهمة للعائلة',
                    keywords: ['وثائق', 'سجلات', 'رسمي', 'أرشيف'],
                    created_date: '2024-01-05',
                    language: 'arabic',
                    access_level: 'admin',
                    featured: false,
                    url: '#',
                    views: 28,
                    downloads: 8
                },
                {
                    id: 'lib_004',
                    title: 'صور وذكريات العائلة عبر التاريخ',
                    author: 'أرشيف العائلة',
                    type: 'image',
                    category: 'photos',
                    description: 'مجموعة نادرة من الصور التاريخية والذكريات العائلية الثمينة',
                    keywords: ['صور', 'ذكريات', 'تاريخ', 'عائلة', 'تراث'],
                    created_date: '2024-02-01',
                    language: 'arabic',
                    access_level: 'public',
                    featured: true,
                    url: '#',
                    views: 89,
                    downloads: 34
                },
                {
                    id: 'lib_005',
                    title: 'إنجازات العائلة في مجال الأعمال',
                    author: 'سلمان محمد بن سعيدان',
                    type: 'presentation',
                    category: 'achievements',
                    description: 'عرض تقديمي يبرز الإنجازات التجارية والاستثمارية للعائلة',
                    keywords: ['إنجازات', 'أعمال', 'استثمار', 'نجاح', 'تجارة'],
                    created_date: '2024-01-25',
                    language: 'arabic',
                    access_level: 'family',
                    featured: true,
                    url: '#',
                    views: 52,
                    downloads: 19
                },
                {
                    id: 'lib_006',
                    title: 'حكايات وقصص من التراث العائلي',
                    author: 'رواة العائلة',
                    type: 'audio',
                    category: 'stories',
                    description: 'مجموعة من القصص والحكايات المتوارثة التي تحكي تاريخ العائلة',
                    keywords: ['حكايات', 'قصص', 'تراث', 'موروث', 'شفهي'],
                    created_date: '2024-02-10',
                    language: 'arabic',
                    access_level: 'family',
                    featured: false,
                    url: '#',
                    views: 31,
                    downloads: 7
                }
            ]
        };

        // نظام إدارة المستخدمين والمصادقة
        class UserManager {
            constructor() {
                this.usersStorageKey = 'al_saedan_users_v1';
                this.currentUserKey = 'al_saedan_current_user';
                this.users = this.loadUsers();
                this.currentUser = this.loadCurrentUser();
                this.initializeDefaultAdmin();
            }

            loadUsers() {
                try {
                    const stored = localStorage.getItem(this.usersStorageKey);
                    return stored ? JSON.parse(stored) : [];
                } catch (error) {
                    console.error('خطأ في تحميل المستخدمين:', error);
                    return [];
                }
            }

            saveUsers() {
                try {
                    localStorage.setItem(this.usersStorageKey, JSON.stringify(this.users));
                    return true;
                } catch (error) {
                    console.error('خطأ في حفظ المستخدمين:', error);
                    return false;
                }
            }

            loadCurrentUser() {
                try {
                    const stored = localStorage.getItem(this.currentUserKey);
                    return stored ? JSON.parse(stored) : null;
                } catch (error) {
                    return null;
                }
            }

            saveCurrentUser(user) {
                try {
                    if (user) {
                        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
                    } else {
                        localStorage.removeItem(this.currentUserKey);
                    }
                    this.currentUser = user;
                    return true;
                } catch (error) {
                    console.error('خطأ في حفظ المستخدم الحالي:', error);
                    return false;
                }
            }

            initializeDefaultAdmin() {
                // التأكد من وجود حساب المدير الافتراضي الصحيح
                const defaultAdminEmail = 'admin@salmansaedan.com';
                let adminUser = this.users.find(u => u.email === defaultAdminEmail);
                
                if (!adminUser) {
                    // إنشاء المدير الافتراضي إذا لم يكن موجوداً
                    const defaultAdmin = {
                        id: 'admin_default',
                        national_id: '1000000000',
                        first_name: 'مدير',
                        middle_name: 'النظام',
                        last_name: 'الافتراضي',
                        full_name: 'مدير النظام الافتراضي',
                        email: defaultAdminEmail,
                        phone: '0533361154',
                        password: this.hashPassword('admin123'),
                        role: 'admin',
                        status: 'active',
                        birth_date: '1970-01-01',
                        birth_place: 'الرياض',
                        profession: 'إدارة النظام',
                        specialization: 'إدارة تقنية المعلومات',
                        hobbies: 'إدارة الأنظمة، التطوير التقني',
                        father_id: null,
                        generation: 1,
                        created_at: new Date().toISOString(),
                        approved_at: new Date().toISOString(),
                        approved_by: 'system'
                    };
                    this.users.push(defaultAdmin);
                    this.saveUsers();
                    console.log('✅ تم إنشاء حساب المدير الافتراضي');
                } else {
                    // التأكد من أن كلمة المرور صحيحة للمدير الموجود
                    if (adminUser.role !== 'admin' || adminUser.status !== 'active') {
                        adminUser.role = 'admin';
                        adminUser.status = 'active';
                        adminUser.password = this.hashPassword('admin123');
                        this.saveUsers();
                        console.log('✅ تم تحديث صلاحيات المدير الافتراضي');
                    }
                }
                
                // طباعة معلومات المدير للتأكيد
                const admin = this.users.find(u => u.email === defaultAdminEmail);
                if (admin) {
                    console.log('🔐 معلومات المدير الافتراضي:');
                    console.log('   البريد الإلكتروني:', admin.email);
                    console.log('   كلمة المرور: admin123');
                    console.log('   الحالة:', admin.status);
                    console.log('   الدور:', admin.role);
                }
            }

            hashPassword(password) {
                // تشفير بسيط - في التطبيق الحقيقي استخدم تشفير أقوى
                return btoa(password + 'salt_key_2024');
            }

            verifyPassword(inputPassword, hashedPassword) {
                return this.hashPassword(inputPassword) === hashedPassword;
            }

            generateId() {
                return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
            }

            // تسجيل مستخدم جديد
            registerUser(userData) {
                // التحقق من عدم وجود المستخدم
                const existingUser = this.users.find(u => 
                    u.national_id === userData.national_id || u.email === userData.email
                );
                
                if (existingUser) {
                    throw new Error('المستخدم موجود بالفعل بنفس رقم الهوية أو البريد الإلكتروني');
                }

                const newUser = {
                    id: this.generateId(),
                    ...userData,
                    password: this.hashPassword(userData.password),
                    role: 'user',
                    status: 'pending', // في انتظار الموافقة
                    created_at: new Date().toISOString(),
                    approved_at: null,
                    approved_by: null
                };

                this.users.push(newUser);
                this.saveUsers();
                return newUser;
            }

            // تسجيل دخول
            login(identifier, password) {
                console.log('🔍 محاولة تسجيل دخول:');
                console.log('   المعرف:', identifier);
                console.log('   عدد المستخدمين المحفوظين:', this.users.length);
                
                // البحث عن المستخدم
                const user = this.users.find(u => 
                    u.national_id === identifier || u.email === identifier
                );

                if (!user) {
                    console.log('❌ لم يتم العثور على المستخدم');
                    console.log('المستخدمون المتاحون:');
                    this.users.forEach(u => console.log(`   - ${u.email} (${u.national_id})`));
                    throw new Error('المستخدم غير موجود');
                }

                console.log('✅ تم العثور على المستخدم:', user.email);
                console.log('   حالة المستخدم:', user.status);
                console.log('   دور المستخدم:', user.role);

                if (user.status !== 'active') {
                    throw new Error('الحساب غير مفعل. يرجى انتظار موافقة الإدارة.');
                }

                // التحقق من كلمة المرور
                const passwordHash = this.hashPassword(password);
                console.log('🔐 التحقق من كلمة المرور...');
                console.log('   كلمة المرور المدخلة (مشفرة):', passwordHash);
                console.log('   كلمة المرور المحفوظة:', user.password);

                if (!this.verifyPassword(password, user.password)) {
                    console.log('❌ كلمة المرور غير صحيحة');
                    throw new Error('كلمة المرور غير صحيحة');
                }

                console.log('✅ تم تسجيل الدخول بنجاح');
                this.saveCurrentUser(user);
                return user;
            }

            // تسجيل خروج
            logout() {
                this.saveCurrentUser(null);
                return true;
            }

            // الحصول على المستخدمين المعلقين
            getPendingUsers() {
                return this.users.filter(u => u.status === 'pending');
            }

            // الحصول على المستخدمين المفعلين
            getActiveUsers() {
                return this.users.filter(u => u.status === 'active');
            }

            // تفعيل مستخدم (للإدمن فقط)
            approveUser(userId, adminId) {
                const userIndex = this.users.findIndex(u => u.id === userId);
                const admin = this.users.find(u => u.id === adminId && u.role === 'admin');

                if (userIndex === -1) {
                    throw new Error('المستخدم غير موجود');
                }

                if (!admin) {
                    throw new Error('ليس لديك صلاحية لتفعيل المستخدمين');
                }

                this.users[userIndex].status = 'active';
                this.users[userIndex].approved_at = new Date().toISOString();
                this.users[userIndex].approved_by = adminId;

                this.saveUsers();
                return this.users[userIndex];
            }

            // رفض مستخدم (للإدمن فقط)
            rejectUser(userId, adminId) {
                const userIndex = this.users.findIndex(u => u.id === userId);
                const admin = this.users.find(u => u.id === adminId && u.role === 'admin');

                if (userIndex === -1) {
                    throw new Error('المستخدم غير موجود');
                }

                if (!admin) {
                    throw new Error('ليس لديك صلاحية لرفض المستخدمين');
                }

                this.users.splice(userIndex, 1);
                this.saveUsers();
                return true;
            }

            // التحقق من الصلاحيات
            hasPermission(action) {
                if (!this.currentUser || this.currentUser.status !== 'active') {
                    return false;
                }

                const permissions = {
                    admin: ['view_all', 'edit_all', 'delete_all', 'approve_users', 'manage_system'],
                    user: ['view_own', 'edit_own', 'comment_only']
                };

                return permissions[this.currentUser.role]?.includes(action) || false;
            }

            // تحديث بيانات المستخدم
            updateUser(userId, updateData) {
                const userIndex = this.users.findIndex(u => u.id === userId);
                
                if (userIndex === -1) {
                    throw new Error('المستخدم غير موجود');
                }

                // التحقق من الصلاحيات
                if (this.currentUser.id !== userId && this.currentUser.role !== 'admin') {
                    throw new Error('ليس لديك صلاحية لتعديل هذا المستخدم');
                }

                // منع تغيير بيانات حساسة للمستخدمين العاديين
                const restrictedFields = ['role', 'status', 'approved_at', 'approved_by'];
                if (this.currentUser.role !== 'admin') {
                    restrictedFields.forEach(field => delete updateData[field]);
                }

                this.users[userIndex] = {
                    ...this.users[userIndex],
                    ...updateData,
                    updated_at: new Date().toISOString()
                };

                this.saveUsers();
                
                // تحديث المستخدم الحالي إذا كان هو نفسه
                if (this.currentUser.id === userId) {
                    this.saveCurrentUser(this.users[userIndex]);
                }

                return this.users[userIndex];
            }

            // دالة لإعادة تعيين المدير الافتراضي (للاستخدام في وحدة التحكم)
            resetDefaultAdmin() {
                // حذف المدير الحالي
                this.users = this.users.filter(u => u.email !== 'admin@salmansaedan.com');
                
                // إضافة المدير الجديد
                const defaultAdmin = {
                    id: 'admin_default_' + Date.now(),
                    national_id: '1000000000',
                    first_name: 'مدير',
                    middle_name: 'النظام',
                    last_name: 'الافتراضي',
                    full_name: 'مدير النظام الافتراضي',
                    email: 'admin@salmansaedan.com',
                    phone: '0533361154',
                    password: this.hashPassword('admin123'),
                    role: 'admin',
                    status: 'active',
                    birth_date: '1970-01-01',
                    birth_place: 'الرياض',
                    profession: 'إدارة النظام',
                    specialization: 'إدارة تقنية المعلومات',
                    hobbies: 'إدارة الأنظمة، التطوير التقني',
                    father_id: null,
                    generation: 1,
                    created_at: new Date().toISOString(),
                    approved_at: new Date().toISOString(),
                    approved_by: 'system'
                };
                
                this.users.push(defaultAdmin);
                this.saveUsers();
                
                console.log('✅ تم إعادة تعيين المدير الافتراضي:');
                console.log('   البريد الإلكتروني: admin@salmansaedan.com');
                console.log('   كلمة المرور: admin123');
                
                return defaultAdmin;
            }
        }

        // نظام إدارة البيانات المحسن
        class EnhancedDataManager {
            constructor() {
                this.storageKey = 'al_saedan_app_v2';
                this.data = this.loadData();
                this.initializeDefaultData();
                this.setupStorageSync();
            }

            loadData() {
                try {
                    const stored = localStorage.getItem(this.storageKey);
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        return {
                            familyMembers: parsed.familyMembers || [],
                            events: parsed.events || [],
                            suggestions: parsed.suggestions || [],
                            library: parsed.library || [],
                            lastUpdated: parsed.lastUpdated || new Date().toISOString(),
                            version: parsed.version || 1
                        };
                    }
                    return {
                        familyMembers: [],
                        events: [],
                        suggestions: [],
                        library: [],
                        lastUpdated: new Date().toISOString(),
                        version: 1
                    };
                } catch (error) {
                    console.error('خطأ في تحميل البيانات:', error);
                    return {
                        familyMembers: [],
                        events: [],
                        suggestions: [],
                        library: [],
                        lastUpdated: new Date().toISOString(),
                        version: 1
                    };
                }
            }

            saveData() {
                try {
                    this.data.lastUpdated = new Date().toISOString();
                    this.data.version = (this.data.version || 0) + 1;
                    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
                    
                    // إشعال حدث تحديث البيانات
                    window.dispatchEvent(new CustomEvent('dataUpdated', { detail: this.data }));
                    
                    return true;
                } catch (error) {
                    console.error('خطأ في حفظ البيانات:', error);
                    return false;
                }
            }

            initializeDefaultData() {
                // تحميل البيانات الأساسية إذا كانت فارغة
                // ✅ FIXED 2024-09-28: إضافة this.loadSampleData() لحل مشكلة عدم عرض البيانات
                if (this.data.familyMembers.length === 0) {
                    console.log('📊 لا توجد بيانات عائلية - تحميل البيانات الأساسية تلقائياً');
                    this.loadSampleData(); // ← الإصلاح الرئيسي لمشكلة عدم عرض البيانات
                } else {
                    console.log(`✅ تم العثور على ${this.data.familyMembers.length} عضو في العائلة`);
                    // التحقق من استرجاع بيانات الجيل الثاني
                    const secondGenMembers = this.data.familyMembers.filter(m => m.generation === 2);
                    console.log(`🌳 الجيل الثاني: ${secondGenMembers.length} أعضاء`);
                    secondGenMembers.forEach(member => {
                        console.log(`   - ${member.full_name} (الوالد: ${member.father_id || 'غير محدد'})`);
                    });
                    
                    // تحديث مراجع الأطفال للأعضاء الموجودين
                    this.updateChildrenReferences();
                }
            }

            // إعادة تعيين كاملة للبيانات
            resetToEmpty() {
                this.data = {
                    familyMembers: [],
                    events: [],
                    suggestions: [],
                    library: [],
                    lastUpdated: new Date().toISOString(),
                    version: 1
                };
                
                // مسح LocalStorage
                localStorage.removeItem(this.storageKey);
                
                console.log('🔄 تم إعادة تعيين جميع البيانات إلى حالة فارغة');
            }

            // تحديث مراجع الأطفال لكل عضو
            updateChildrenReferences() {
                this.data.familyMembers.forEach(member => {
                    member.children = this.data.familyMembers
                        .filter(child => child.father_id === member.id)
                        .map(child => child.id);
                });
            }

            generateId() {
                return Date.now().toString(36) + Math.random().toString(36).substr(2);
            }

            getData(category) {
                return this.data[category] || [];
            }

            addItem(category, item) {
                if (!this.data[category]) {
                    this.data[category] = [];
                }
                
                // حساب الجيل للأعضاء الجدد
                if (category === 'familyMembers') {
                    item.generation = this.calculateGeneration(item.father_id);
                    item.id = item.id || this.generateId();
                    item.created_at = item.created_at || new Date().toISOString();
                }
                
                const newItem = {
                    ...item,
                    id: item.id || this.generateId(),
                    created_at: item.created_at || new Date().toISOString()
                };
                
                this.data[category].push(newItem);
                
                // تحديث مراجع الأطفال للعائلة
                if (category === 'familyMembers') {
                    this.updateChildrenReferences();
                }
                
                this.saveData();
                return newItem;
            }

            // حساب الجيل بناءً على الوالد
            calculateGeneration(fatherId) {
                if (!fatherId) return 1; // المؤسس
                
                const father = this.data.familyMembers.find(m => m.id === fatherId);
                return father ? (father.generation + 1) : 1;
            }

            updateItem(category, id, updates) {
                const items = this.data[category];
                const index = items.findIndex(item => item.id === id);
                
                if (index !== -1) {
                    // إذا تم تحديث الوالد، إعادة حساب الجيل
                    if (category === 'familyMembers' && updates.father_id !== undefined) {
                        updates.generation = this.calculateGeneration(updates.father_id);
                    }
                    
                    items[index] = { 
                        ...items[index], 
                        ...updates,
                        updated_at: new Date().toISOString()
                    };
                    
                    // تحديث مراجع الأطفال للعائلة
                    if (category === 'familyMembers') {
                        this.updateChildrenReferences();
                    }
                    
                    this.saveData();
                    return items[index];
                }
                return null;
            }

            deleteItem(category, id) {
                const items = this.data[category];
                const index = items.findIndex(item => item.id === id);
                
                if (index !== -1) {
                    // للعائلة: التحقق من وجود أطفال
                    if (category === 'familyMembers') {
                        const hasChildren = this.data.familyMembers.some(m => m.father_id === id);
                        if (hasChildren) {
                            throw new Error('لا يمكن حذف عضو لديه أطفال. احذف الأطفال أولاً.');
                        }
                    }
                    
                    const deletedItem = items.splice(index, 1)[0];
                    
                    // تحديث مراجع الأطفال للعائلة
                    if (category === 'familyMembers') {
                        this.updateChildrenReferences();
                    }
                    
                    this.saveData();
                    return deletedItem;
                }
                return null;
            }

            // تحميل البيانات النموذجية
            loadSampleData() {
                // استبدال البيانات بالكامل بالبيانات الجديدة
                this.data = {
                    familyMembers: [...SAMPLE_FAMILY_DATA.familyMembers],
                    events: [...SAMPLE_FAMILY_DATA.events],
                    suggestions: [...SAMPLE_FAMILY_DATA.suggestions],
                    library: [...SAMPLE_FAMILY_DATA.library]
                };
                
                this.updateChildrenReferences();
                this.saveData();
                
                // تأكيد استرجاع بيانات الجيل الثاني
                const secondGenMembers = this.data.familyMembers.filter(m => m.generation === 2);
                console.log('📊 تحميل البيانات النموذجية مكتمل:');
                console.log(`   - إجمالي الأعضاء: ${this.data.familyMembers.length}`);
                console.log(`   - الجيل الأول: ${this.data.familyMembers.filter(m => m.generation === 1).length} أعضاء`);
                console.log(`   - الجيل الثاني: ${secondGenMembers.length} أعضاء`);
                console.log('✅ تم تحميل البيانات النموذجية بنجاح مع ربط الأجيال');
                
                // عرض أسماء الجيل الثاني للتأكيد
                console.log('👥 أعضاء الجيل الثاني:');
                secondGenMembers.forEach((member, index) => {
                    console.log(`   ${index + 1}. ${member.full_name}`);
                });
                
                // إشعال حدث تحديث البيانات
                window.dispatchEvent(new CustomEvent('sampleDataLoaded', { 
                    detail: { 
                        totalMembers: this.data.familyMembers.length,
                        secondGeneration: secondGenMembers.length
                    } 
                }));
            }

            // مزامنة مع النوافذ الأخرى
            setupStorageSync() {
                window.addEventListener('storage', (e) => {
                    if (e.key === this.storageKey) {
                        this.data = this.loadData();
                        window.dispatchEvent(new CustomEvent('dataUpdated', { detail: this.data }));
                    }
                });
            }

            // البحث والفلترة
            searchItems(category, query, filters = {}) {
                let items = this.getData(category);

                // البحث النصي
                if (query) {
                    const searchTerms = query.toLowerCase().split(' ');
                    items = items.filter(item => 
                        searchTerms.every(term =>
                            Object.values(item).some(value =>
                                value && value.toString().toLowerCase().includes(term)
                            )
                        )
                    );
                }

                // تطبيق الفلاتر
                Object.keys(filters).forEach(key => {
                    if (filters[key]) {
                        items = items.filter(item => item[key] === filters[key]);
                    }
                });

                return items;
            }
        }

        // التطبيق الرئيسي المحسن
        class EnhancedAlSaedanApp {
            constructor() {
                this.dataManager = new EnhancedDataManager();
                this.userManager = new UserManager();
                this.charts = {};
                this.init();
            }

            init() {
                this.updateAuthUI();
                this.createModals();
                this.displayHomeStatistics();
                this.displayFamilyTree();
                this.displayEvents();
                this.displaySuggestions();
                this.displayLibrary();
                this.displayProfile();
                this.displayAdminPanel();
                this.initializeCharts();
                this.setupEventListeners();
                console.log('تم تحميل التطبيق الشامل المحسن بنجاح');
            }

            // تحديث واجهة المصادقة
            updateAuthUI() {
                const isLoggedIn = this.userManager.currentUser !== null;
                const isAdmin = this.userManager.currentUser?.role === 'admin';

                // عناصر سطح المكتب
                const mainNavigation = document.getElementById('mainNavigation');
                const userProfileMenu = document.getElementById('userProfileMenuDesktop');
                const authButtons = document.getElementById('authButtonsDesktop');
                const adminButton = document.getElementById('nav-admin-desktop');
                const currentUserName = document.getElementById('currentUserNameDesktop');

                // عناصر الجوال
                const mainNavigationMobile = document.getElementById('mainNavigationMobile');
                const userMenuMobile = document.getElementById('userMenuMobile');
                const authButtonsMobile = document.getElementById('authButtonsMobile');
                const adminButtonMobile = document.getElementById('nav-admin-mobile');
                const currentUserNameMobile = document.getElementById('currentUserNameMobile');

                if (isLoggedIn) {
                    // سطح المكتب
                    if (mainNavigation) mainNavigation.classList.remove('hidden');
                    if (userProfileMenu) userProfileMenu.classList.remove('hidden');
                    if (authButtons) authButtons.classList.add('hidden');
                    
                    // الجوال
                    if (mainNavigationMobile) mainNavigationMobile.classList.remove('hidden');
                    if (userMenuMobile) userMenuMobile.classList.remove('hidden');
                    if (authButtonsMobile) authButtonsMobile.classList.add('hidden');
                    
                    // تحديث أسماء المستخدمين
                    const userName = this.userManager.currentUser.first_name;
                    if (currentUserName) {
                        currentUserName.textContent = userName;
                    }
                    if (currentUserNameMobile) {
                        currentUserNameMobile.textContent = `${userName} - الملف الشخصي`;
                    }
                    
                    // إظهار لوحة الإدارة للمديرين
                    if (isAdmin) {
                        if (adminButton) adminButton.classList.remove('hidden');
                        if (adminButtonMobile) adminButtonMobile.classList.remove('hidden');
                        
                        // تحديث شارات الإشعارات
                        this.updatePendingBadges();
                    } else {
                        if (adminButton) adminButton.classList.add('hidden');
                        if (adminButtonMobile) adminButtonMobile.classList.add('hidden');
                    }
                } else {
                    // المستخدم غير مسجل دخول - إخفاء عناصر المستخدمين
                    // سطح المكتب
                    if (mainNavigation) mainNavigation.classList.add('hidden');
                    if (userProfileMenu) userProfileMenu.classList.add('hidden');
                    if (authButtons) authButtons.classList.remove('hidden');
                    if (adminButton) adminButton.classList.add('hidden');
                    
                    // الجوال
                    if (mainNavigationMobile) mainNavigationMobile.classList.add('hidden');
                    if (userMenuMobile) userMenuMobile.classList.add('hidden');
                    if (authButtonsMobile) authButtonsMobile.classList.remove('hidden');
                    if (adminButtonMobile) adminButtonMobile.classList.add('hidden');
                }
            }

            // عرض الملف الشخصي
            displayProfile() {
                const container = document.getElementById('profileContent');
                if (!container) return;

                const user = this.userManager.currentUser;
                if (!user) {
                    container.innerHTML = `
                        <div class="text-center py-12">
                            <div class="text-6xl text-white mb-4 opacity-50">
                                <i class="fas fa-user-slash"></i>
                            </div>
                            <p class="text-white text-xl mb-4">يرجى تسجيل الدخول أولاً</p>
                        </div>
                    `;
                    return;
                }

                const statusBadge = user.status === 'active' ? 
                    '<span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">مفعل</span>' :
                    '<span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">في انتظار التفعيل</span>';

                const roleBadge = user.role === 'admin' ?
                    '<span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">👑 مدير</span>' :
                    '<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">👤 عضو</span>';

                container.innerHTML = `
                    <div class="bg-white rounded-lg shadow-lg p-6">
                        <div class="flex items-center justify-between mb-6">
                            <div class="flex items-center space-x-4 rtl:space-x-reverse">
                                <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    ${user.first_name.charAt(0)}${user.last_name.charAt(0)}
                                </div>
                                <div>
                                    <h3 class="text-2xl font-bold text-gray-800">${user.full_name}</h3>
                                    <div class="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                                        ${statusBadge}
                                        ${roleBadge}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- المعلومات الشخصية -->
                            <div class="space-y-4">
                                <h4 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                    <i class="fas fa-user ml-2 text-blue-600"></i>المعلومات الشخصية
                                </h4>
                                <div class="space-y-3 text-sm">
                                    <div class="flex justify-between">
                                        <span class="font-medium text-gray-600">رقم الهوية:</span>
                                        <span class="text-gray-800">${user.national_id}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="font-medium text-gray-600">تاريخ الميلاد:</span>
                                        <span class="text-gray-800">${user.birth_date ? new Date(user.birth_date).toLocaleDateString('ar-SA') : 'غير محدد'}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="font-medium text-gray-600">مكان الميلاد:</span>
                                        <span class="text-gray-800">${user.birth_place || 'غير محدد'}</span>
                                    </div>
                                    ${user.generation ? `
                                        <div class="flex justify-between">
                                            <span class="font-medium text-gray-600">الجيل:</span>
                                            <span class="text-gray-800">الجيل ${user.generation}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <!-- المعلومات المهنية -->
                            <div class="space-y-4">
                                <h4 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                    <i class="fas fa-briefcase ml-2 text-green-600"></i>المعلومات المهنية
                                </h4>
                                <div class="space-y-3 text-sm">
                                    <div class="flex justify-between">
                                        <span class="font-medium text-gray-600">المهنة:</span>
                                        <span class="text-gray-800">${user.profession || 'غير محدد'}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="font-medium text-gray-600">التخصص:</span>
                                        <span class="text-gray-800">${user.specialization || 'غير محدد'}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- معلومات التواصل -->
                            <div class="space-y-4">
                                <h4 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                    <i class="fas fa-phone ml-2 text-teal-600"></i>معلومات التواصل
                                </h4>
                                <div class="space-y-3 text-sm">
                                    <div class="flex justify-between">
                                        <span class="font-medium text-gray-600">الجوال:</span>
                                        <span class="text-gray-800">${user.phone || 'غير محدد'}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="font-medium text-gray-600">الإيميل:</span>
                                        <span class="text-gray-800">${user.email || 'غير محدد'}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- الهوايات -->
                            <div class="space-y-4">
                                <h4 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                    <i class="fas fa-heart ml-2 text-rose-600"></i>الهوايات والاهتمامات
                                </h4>
                                <p class="text-sm text-gray-700">${user.hobbies || 'لم يتم تحديد هوايات'}</p>
                            </div>
                        </div>

                        <!-- تواريخ مهمة -->
                        <div class="mt-6 pt-6 border-t border-gray-200">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                                <div>تاريخ التسجيل: ${new Date(user.created_at).toLocaleDateString('ar-SA')}</div>
                                ${user.approved_at ? `<div>تاريخ التفعيل: ${new Date(user.approved_at).toLocaleDateString('ar-SA')}</div>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }

            // عرض لوحة الإدارة
            displayAdminPanel() {
                if (!this.userManager.currentUser || this.userManager.currentUser.role !== 'admin') {
                    return;
                }

                const pendingContainer = document.getElementById('pendingUsersGrid');
                const activeUsersCount = document.getElementById('activeUsersCount');
                const pendingUsersCount = document.getElementById('pendingUsersCount');
                const totalUsersCount = document.getElementById('totalUsersCount');

                if (!pendingContainer) return;

                const pendingUsers = this.userManager.getPendingUsers();
                const activeUsers = this.userManager.getActiveUsers();
                const totalUsers = this.userManager.users.length;

                // تحديث الإحصائيات
                if (activeUsersCount) activeUsersCount.textContent = activeUsers.length;
                if (pendingUsersCount) pendingUsersCount.textContent = pendingUsers.length;
                if (totalUsersCount) totalUsersCount.textContent = totalUsers;

                // عرض المستخدمين المعلقين
                if (pendingUsers.length === 0) {
                    pendingContainer.innerHTML = `
                        <div class="text-center py-8 text-gray-500">
                            <i class="fas fa-check-circle text-4xl mb-2"></i>
                            <p>لا توجد طلبات تسجيل معلقة</p>
                        </div>
                    `;
                    return;
                }

                pendingContainer.innerHTML = pendingUsers.map(user => `
                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <h4 class="font-semibold text-gray-800">${user.full_name}</h4>
                                <div class="mt-2 space-y-1 text-sm text-gray-600">
                                    <div>📧 ${user.email}</div>
                                    <div>📱 ${user.phone}</div>
                                    <div>🆔 ${user.national_id}</div>
                                    <div>💼 ${user.profession} - ${user.specialization}</div>
                                    <div>📅 ${new Date(user.created_at).toLocaleDateString('ar-SA')}</div>
                                </div>
                                ${user.hobbies ? `
                                    <div class="mt-2 p-2 bg-blue-50 rounded text-xs">
                                        <strong>الهوايات:</strong> ${user.hobbies}
                                    </div>
                                ` : ''}
                            </div>
                            <div class="flex flex-col space-y-2 mr-4">
                                <button onclick="approveUser('${user.id}')" class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                                    <i class="fas fa-check ml-1"></i>موافقة
                                </button>
                                <button onclick="rejectUser('${user.id}')" class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                                    <i class="fas fa-times ml-1"></i>رفض
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            setupEventListeners() {
                // مستمع تحديث البيانات
                window.addEventListener('dataUpdated', () => {
                    this.refreshAllSections();
                });

                // مستمع تحميل البيانات النموذجية
                window.addEventListener('sampleDataLoaded', (event) => {
                    const { totalMembers, secondGeneration } = event.detail;
                    console.log(`🎉 البيانات النموذجية محملة: ${totalMembers} أعضاء، ${secondGeneration} في الجيل الثاني`);
                    
                    // التحقق من استرجاع بيانات الجيل الثاني
                    const members = this.dataManager.getData('familyMembers');
                    const secondGenData = members.filter(m => m.generation === 2);
                    console.log('📋 تفاصيل الجيل الثاني المسترجع:');
                    secondGenData.forEach(member => {
                        console.log(`   ✓ ${member.full_name} - جيل ${member.generation} - والد: ${member.father_id}`);
                    });
                });

                // مستمع نموذج العائلة
                const familyForm = document.getElementById('familyForm');
                if (familyForm) {
                    familyForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.saveFamilyMember();
                    });
                }

                // مستمع نموذج تسجيل الدخول
                const loginForm = document.getElementById('loginForm');
                if (loginForm) {
                    loginForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.handleLogin();
                    });
                }

                // مستمع نموذج التسجيل
                const registerForm = document.getElementById('registerForm');
                if (registerForm) {
                    registerForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.handleRegister();
                    });
                }

                // مستمعات حقول النموذج المحسن
                this.setupFormFieldListeners();
                this.setupRegisterFormListeners();
            }

            setupFormFieldListeners() {
                // تحديث معاينة الاسم الكامل
                const nameFields = ['familyFirstName', 'familyMiddleName', 'familyLastName'];
                nameFields.forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (field) {
                        field.addEventListener('input', this.updateFullNamePreview.bind(this));
                    }
                });

                // تحديث الجيل عند اختيار الوالد
                const fatherSelect = document.getElementById('familyFatherId');
                if (fatherSelect) {
                    fatherSelect.addEventListener('change', this.updateGenerationDisplay.bind(this));
                }
            }

            updateFullNamePreview() {
                const firstName = document.getElementById('familyFirstName')?.value.trim() || '';
                const middleName = document.getElementById('familyMiddleName')?.value.trim() || '';
                const lastName = document.getElementById('familyLastName')?.value.trim() || '';
                
                let fullName = firstName;
                if (middleName) fullName += ` ${middleName}`;
                if (lastName) fullName += ` ${lastName}`;
                
                const preview = document.getElementById('fullNamePreview');
                if (preview) {
                    preview.textContent = fullName || 'سيتم تكوين الاسم تلقائياً...';
                }
            }

            updateGenerationDisplay() {
                const fatherSelect = document.getElementById('familyFatherId');
                const generationDisplay = document.getElementById('familyCurrentGeneration');
                
                if (!fatherSelect || !generationDisplay) return;

                const fatherId = fatherSelect.value;
                let generation = 1; // افتراضي للمؤسس

                if (fatherId) {
                    const father = this.dataManager.getData('familyMembers').find(m => m.id === fatherId);
                    generation = father ? (father.generation + 1) : 1;
                }

                generationDisplay.value = `الجيل ${generation} ${generation === 1 ? '(مؤسس)' : generation === 2 ? '(أطفال المؤسس)' : '(أحفاد)'}`;
            }

            // إعداد مستمعات نموذج التسجيل
            setupRegisterFormListeners() {
                // تحديث معاينة الاسم الكامل
                const nameFields = ['registerFirstName', 'registerMiddleName', 'registerLastName'];
                nameFields.forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (field) {
                        field.addEventListener('input', updateRegisterFullNamePreview);
                    }
                });

                // تحديث الجيل المتوقع عند اختيار الوالد
                const fatherSelect = document.getElementById('registerFatherId');
                if (fatherSelect) {
                    fatherSelect.addEventListener('change', this.updateRegisterGeneration.bind(this));
                }
            }

            updateRegisterGeneration() {
                const fatherSelect = document.getElementById('registerFatherId');
                const generationDisplay = document.getElementById('registerExpectedGeneration');
                
                if (!fatherSelect || !generationDisplay) return;

                const fatherId = fatherSelect.value;
                let generation = 1; // افتراضي للمؤسس

                if (fatherId) {
                    const father = this.dataManager.getData('familyMembers').find(m => m.id === fatherId);
                    generation = father ? (father.generation + 1) : 1;
                }

                generationDisplay.value = `الجيل ${generation} ${generation === 1 ? '(مؤسس)' : generation === 2 ? '(أطفال المؤسس)' : '(أحفاد)'}`;
            }

            populateRegisterParentSelect() {
                const select = document.getElementById('registerFatherId');
                if (!select) return;

                select.innerHTML = '<option value="">-- اختر الوالد (اختياري) --</option>';
                
                const maleMembers = this.dataManager.getData('familyMembers').filter(m => m.gender === 'male');
                
                // تجميع حسب الأجيال
                const generations = {};
                maleMembers.forEach(member => {
                    const gen = member.generation || 1;
                    if (!generations[gen]) generations[gen] = [];
                    generations[gen].push(member);
                });
                
                // إضافة الخيارات مجموعة حسب الأجيال
                Object.keys(generations).sort((a, b) => parseInt(a) - parseInt(b)).forEach(genNum => {
                    const genGroup = document.createElement('optgroup');
                    genGroup.label = `${genNum == '1' ? 'الجيل المؤسس' : 'الجيل ' + genNum}`;
                    
                    generations[genNum].forEach(member => {
                        const option = document.createElement('option');
                        option.value = member.id;
                        option.textContent = member.full_name;
                        genGroup.appendChild(option);
                    });
                    
                    select.appendChild(genGroup);
                });
            }

            // معالجة تسجيل الدخول
            handleLogin() {
                const identifier = document.getElementById('loginIdentifier').value.trim();
                const password = document.getElementById('loginPassword').value.trim();

                if (!identifier || !password) {
                    this.showToast('يرجى ملء جميع الحقول', 'error');
                    return;
                }

                try {
                    const user = this.userManager.login(identifier, password);
                    this.showToast(`مرحباً ${user.first_name}! تم تسجيل الدخول بنجاح`, 'success');
                    
                    // إخفاء النموذج بطريقة محسنة
                    const loginModal = document.getElementById('loginModal');
                    if (loginModal) {
                        loginModal.classList.add('hidden');
                        document.getElementById('loginForm').reset();
                    }
                    
                    // تحديث الواجهة وتحديث البيانات
                    this.updateAuthUI();
                    this.refreshAllSections(); // إضافة تحديث شامل
                    showSection('home');
                } catch (error) {
                    this.showToast('خطأ في تسجيل الدخول: ' + error.message, 'error');
                }
            }

            // معالجة التسجيل الجديد
            handleRegister() {
                // جمع البيانات
                const firstName = document.getElementById('registerFirstName').value.trim();
                const middleName = document.getElementById('registerMiddleName').value.trim();
                const lastName = document.getElementById('registerLastName').value.trim();
                const nationalId = document.getElementById('registerNationalId').value.trim();
                const birthDate = document.getElementById('registerBirthDate').value;
                const birthPlace = document.getElementById('registerBirthPlace').value.trim();
                const fatherId = document.getElementById('registerFatherId').value || null;
                const profession = document.getElementById('registerProfession').value.trim();
                const specialization = document.getElementById('registerSpecialization').value.trim();
                const phone = document.getElementById('registerPhone').value.trim();
                const email = document.getElementById('registerEmail').value.trim();
                const hobbies = document.getElementById('registerHobbies').value.trim();
                const password = document.getElementById('registerPassword').value.trim();
                const passwordConfirm = document.getElementById('registerPasswordConfirm').value.trim();
                const agree = document.getElementById('registerAgree').checked;

                // التحقق من البيانات المطلوبة
                if (!firstName || !middleName || !lastName || !nationalId || !birthDate || !birthPlace || 
                    !profession || !specialization || !phone || !email || !hobbies || !password || !passwordConfirm) {
                    this.showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
                    return;
                }

                // التحقق من تطابق كلمات المرور
                if (password !== passwordConfirm) {
                    this.showToast('كلمات المرور غير متطابقة', 'error');
                    return;
                }

                // التحقق من طول كلمة المرور
                if (password.length < 8) {
                    this.showToast('كلمة المرور يجب أن تكون 8 أحرف على الأقل', 'error');
                    return;
                }

                // التحقق من رقم الهوية
                if (!/^[1-2][0-9]{9}$/.test(nationalId)) {
                    this.showToast('يرجى إدخال رقم هوية صحيح (10 أرقام)', 'error');
                    return;
                }

                // التحقق من رقم الجوال
                if (!/^05\d{8}$/.test(phone)) {
                    this.showToast('يرجى إدخال رقم جوال صحيح بصيغة 05xxxxxxxx', 'error');
                    return;
                }

                // التحقق من البريد الإلكتروني
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    this.showToast('يرجى إدخال بريد إلكتروني صحيح', 'error');
                    return;
                }

                // التحقق من الموافقة على الشروط
                if (!agree) {
                    this.showToast('يرجى الموافقة على الشروط والأحكام', 'error');
                    return;
                }

                // إنشاء كائن البيانات
                const userData = {
                    first_name: firstName,
                    middle_name: middleName,
                    last_name: lastName,
                    full_name: `${firstName} ${middleName} ${lastName}`,
                    national_id: nationalId,
                    birth_date: birthDate,
                    birth_place: birthPlace,
                    father_id: fatherId,
                    generation: fatherId ? this.dataManager.calculateGeneration(fatherId) : 1,
                    profession: profession,
                    specialization: specialization,
                    phone: phone,
                    email: email,
                    hobbies: hobbies,
                    password: password
                };

                try {
                    const newUser = this.userManager.registerUser(userData);
                    this.showToast(`تم إرسال طلب التسجيل بنجاح! سيتم مراجعة طلبك من قبل الإدارة.`, 'success');
                    
                    // إخفاء النموذج بطريقة محسنة
                    const registerModal = document.getElementById('registerModal');
                    if (registerModal) {
                        registerModal.classList.add('hidden');
                        document.getElementById('registerForm').reset();
                        updateRegisterFullNamePreview();
                    }
                    
                    // تحديث لوحة التحكم إذا كان المستخدم الحالي أدمن
                    if (this.userManager.currentUser && this.userManager.currentUser.role === 'admin') {
                        this.displayAdminPanel(); // تحديث لوحة التحكم لإظهار المستخدم الجديد
                        this.refreshAllSections();
                    }
                    
                } catch (error) {
                    this.showToast('خطأ في التسجيل: ' + error.message, 'error');
                }
            }

            refreshAllSections() {
                this.displayHomeStatistics();
                this.displayFamilyTree();
                this.displayEvents();
                this.displaySuggestions();
                this.displayLibrary();
                this.updateCharts();
            }

            // عرض الإحصائيات
            displayHomeStatistics() {
                const stats = {
                    members: this.dataManager.getData('familyMembers').length,
                    events: this.dataManager.getData('events').length,
                    suggestions: this.dataManager.getData('suggestions').length,
                    library: this.dataManager.getData('library').length
                };

                // إحصائيات إضافية
                const familyMembers = this.dataManager.getData('familyMembers');
                const generations = new Set(familyMembers.map(m => m.generation || 1)).size;
                const boardMembers = familyMembers.filter(m => 
                    ['founder', 'chairman', 'board_member'].includes(m.membership_type)
                ).length;
                
                const events = this.dataManager.getData('events');
                const activeEvents = events.filter(e => e.status === 'upcoming').length;
                
                const suggestions = this.dataManager.getData('suggestions');
                const approvedSuggestions = suggestions.filter(s => s.status === 'approved').length;

                // تحديث العدادات
                this.updateCounter('total-members', stats.members);
                this.updateCounter('total-events', stats.events);
                this.updateCounter('total-suggestions', stats.suggestions);
                this.updateCounter('total-library', stats.library);
                this.updateCounter('total-generations', generations);
                this.updateCounter('board-members', boardMembers);
                this.updateCounter('active-events', activeEvents);
                this.updateCounter('approved-suggestions', approvedSuggestions);
            }

            updateCounter(id, value) {
                const element = document.getElementById(id);
                if (element) {
                    // تأثير العد التصاعدي
                    const current = parseInt(element.textContent) || 0;
                    const increment = Math.ceil((value - current) / 10);
                    let counter = current;
                    
                    const timer = setInterval(() => {
                        counter += increment;
                        if (counter >= value) {
                            counter = value;
                            clearInterval(timer);
                        }
                        element.textContent = counter;
                    }, 50);
                }
            }

            // عرض الشجرة العائلية المحسنة
            displayFamilyTree() {
                const familyMembers = this.dataManager.getData('familyMembers');
                const container = document.getElementById('family-tree');
                if (!container) return;

                // تحديث حالة البيانات
                this.updateDataStatus(familyMembers);

                if (familyMembers.length === 0) {
                    container.innerHTML = `
                        <div class="text-center py-12">
                            <div class="text-6xl text-white mb-4 opacity-50">
                                <i class="fas fa-sitemap"></i>
                            </div>
                            <p class="text-white text-xl mb-6">لا توجد شجرة عائلية</p>
                            <button onclick="loadSampleData()" class="bg-amber-600 text-white px-8 py-4 rounded-lg hover:bg-amber-700 text-lg">
                                <i class="fas fa-database ml-2"></i>تحميل البيانات الأساسية
                            </button>
                        </div>
                    `;
                    return;
                }

                // تجميع حسب الأجيال
                const generations = {};
                familyMembers.forEach(member => {
                    const gen = member.generation || 1;
                    if (!generations[gen]) generations[gen] = [];
                    generations[gen].push(member);
                });

                // عرض الأجيال
                container.innerHTML = Object.keys(generations)
                    .sort((a, b) => parseInt(a) - parseInt(b))
                    .map(gen => {
                        const genMembers = generations[gen];
                        const isFounderGen = gen == '1';
                        
                        return `
                            <div class="generation">
                                <div class="generation-header">
                                    <i class="fas ${isFounderGen ? 'fa-crown' : 'fa-users'} ml-2"></i>
                                    ${isFounderGen ? 'الجيل المؤسس' : `الجيل ${this.getGenerationName(gen)}`}
                                    <span class="bg-white text-blue-600 px-3 py-1 rounded-full mr-3 font-bold">
                                        ${genMembers.length} ${genMembers.length === 1 ? 'فرد' : 'أفراد'}
                                    </span>
                                </div>
                                
                                ${genMembers.map(member => this.renderMemberCard(member, !isFounderGen)).join('')}
                            </div>
                        `;
                    }).join('');
            }

            renderMemberCard(member, showConnection = false) {
                const father = member.father_id ? 
                    this.dataManager.getData('familyMembers').find(m => m.id === member.father_id) : null;
                const spouse = member.spouse_id ? 
                    this.dataManager.getData('familyMembers').find(m => m.id === member.spouse_id) : null;
                const childrenCount = member.children ? member.children.length : 0;
                
                return `
                    <div class="member-card ${member.membership_type === 'founder' ? 'founder-card' : ''} ${showConnection ? 'connection-line' : ''}">
                        <div class="card p-6 relative group">
                            <div class="member-actions">
                                <button onclick="editFamilyMember('${member.id}')" class="edit-btn" title="تعديل">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteFamilyMember('${member.id}')" class="delete-btn" title="حذف">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="w-16 h-16 bg-gradient-to-br ${member.membership_type === 'founder' ? 'from-amber-400 to-orange-500' : 'from-blue-400 to-blue-600'} rounded-full flex items-center justify-center text-white text-xl font-bold mr-4 shadow-lg">
                                    ${member.full_name.charAt(0)}
                                </div>
                                <div class="flex-1">
                                    <h4 class="text-lg font-bold text-gray-800 mb-2">
                                        ${member.full_name}
                                        <span class="text-sm ${member.gender === 'male' ? 'text-blue-500' : 'text-pink-500'} mr-2">
                                            <i class="fas ${member.gender === 'male' ? 'fa-mars' : 'fa-venus'}"></i>
                                        </span>
                                    </h4>
                                    
                                    ${father ? `
                                        <p class="text-gray-600 text-sm mb-2">
                                            <i class="fas fa-arrow-up ml-2 text-blue-500"></i>
                                            ${member.gender === 'male' ? 'ابن' : 'ابنة'} ${father.full_name}
                                        </p>
                                    ` : ''}
                                    
                                    ${spouse ? `
                                        <p class="text-purple-600 text-sm mb-2">
                                            <i class="fas fa-ring ml-2 text-purple-500"></i>
                                            ${member.gender === 'male' ? 'متزوج من' : 'متزوجة من'} ${spouse.full_name}
                                        </p>
                                    ` : ''}
                                    
                                    <span class="inline-block px-3 py-1 text-xs rounded-full ${this.getMembershipTypeColor(member.membership_type)} mb-2">
                                        ${this.getMembershipTypeText(member.membership_type)}
                                    </span>
                                    
                                    ${childrenCount > 0 ? `
                                        <p class="text-green-600 text-sm mb-2">
                                            <i class="fas fa-arrow-down ml-2"></i>
                                            ${childrenCount} ${childrenCount === 1 ? 'طفل' : 'أطفال'}
                                        </p>
                                    ` : ''}
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500 mt-3">
                                        ${member.birth_date ? `<div><i class="fas fa-birthday-cake ml-2 text-pink-500"></i>${new Date(member.birth_date).toLocaleDateString('ar-SA')}</div>` : ''}
                                        ${member.birth_place ? `<div><i class="fas fa-map-marker-alt ml-2 text-red-500"></i>${member.birth_place}</div>` : ''}
                                        ${member.profession ? `<div><i class="fas fa-briefcase ml-2 text-blue-500"></i>${member.profession}</div>` : ''}
                                        ${member.specialization ? `<div><i class="fas fa-graduation-cap ml-2 text-green-500"></i>${member.specialization}</div>` : ''}
                                        ${member.phone ? `<div><i class="fas fa-phone ml-2 text-indigo-500"></i>${member.phone}</div>` : ''}
                                        ${member.email ? `<div><i class="fas fa-envelope ml-2 text-purple-500"></i>${member.email}</div>` : ''}
                                    </div>
                                    ${member.hobbies ? `
                                        <div class="mt-3 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                                            <div class="text-xs text-amber-700">
                                                <i class="fas fa-heart ml-2"></i>
                                                <strong>الهوايات:</strong> ${member.hobbies}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }

            getGenerationName(genNum) {
                const names = {
                    '2': 'الثاني (الأطفال)',
                    '3': 'الثالث (الأحفاد)', 
                    '4': 'الرابع (أطفال الأحفاد)',
                    '5': 'الخامس'
                };
                return names[genNum] || `رقم ${genNum}`;
            }

            // مساعد للعائلة
            getMembershipTypeColor(type) {
                const colors = {
                    'founder': 'bg-amber-100 text-amber-700 border border-amber-200',
                    'chairman': 'bg-red-100 text-red-700 border border-red-200',
                    'board_member': 'bg-blue-100 text-blue-700 border border-blue-200',
                    'general_assembly': 'bg-green-100 text-green-700 border border-green-200',
                    'family_member': 'bg-gray-100 text-gray-700 border border-gray-200',
                    'honorary': 'bg-purple-100 text-purple-700 border border-purple-200'
                };
                return colors[type] || 'bg-gray-100 text-gray-700';
            }

            getMembershipTypeText(type) {
                const texts = {
                    'founder': '👑 المؤسس',
                    'chairman': '🎖️ رئيس مجلس الإدارة',
                    'board_member': '👔 عضو مجلس الإدارة',
                    'general_assembly': '👥 عضو الجمعية العمومية',
                    'family_member': '👨‍👩‍👧‍👦 عضو عائلة',
                    'honorary': '🏅 عضو شرفي'
                };
                return texts[type] || type;
            }

            // تحديث حالة البيانات
            updateDataStatus(familyMembers) {
                const memberCountDisplay = document.getElementById('member-count-display');
                const generationCountDisplay = document.getElementById('generation-count-display');
                
                if (memberCountDisplay && generationCountDisplay) {
                    const totalMembers = familyMembers.length;
                    const generations = new Set(familyMembers.map(m => m.generation || 1));
                    const secondGenCount = familyMembers.filter(m => m.generation === 2).length;
                    
                    memberCountDisplay.textContent = `📊 إجمالي الأعضاء: ${totalMembers}`;
                    generationCountDisplay.innerHTML = `🌳 الأجيال: ${generations.size} <span class="text-green-600 mr-2">| الجيل الثاني: ${secondGenCount} أعضاء</span>`;
                    
                    // تسجيل تفصيلي في الكونسول
                    if (secondGenCount > 0) {
                        console.log(`✅ تأكيد استرجاع الجيل الثاني: ${secondGenCount} أعضاء من أصل ${totalMembers}`);
                    }
                }
            }

            // نموذج العائلة
            showFamilyModal(memberId = null) {
                const modal = document.getElementById('familyModal');
                const title = document.getElementById('familyModalTitle');
                const form = document.getElementById('familyForm');
                
                if (memberId) {
                    // تعديل عضو موجود
                    const member = this.dataManager.getData('familyMembers').find(m => m.id === memberId);
                    if (member) {
                        title.textContent = 'تعديل بيانات العضو';
                        this.fillFamilyForm(member);
                    }
                } else {
                    // إضافة عضو جديد
                    title.textContent = 'إضافة عضو جديد للعائلة';
                    form.reset();
                }
                
                this.populateParentSelect();
                modal.classList.remove('hidden');
                
                // التركيز على أول حقل
                setTimeout(() => {
                    document.getElementById('familyFullName').focus();
                }, 100);
            }

            populateParentSelect() {
                // قائمة الوالدين (الذكور فقط)
                const fatherSelect = document.getElementById('familyFatherId');
                fatherSelect.innerHTML = '<option value="">-- اختر الوالد --</option>';
                
                const maleMembers = this.dataManager.getData('familyMembers').filter(m => m.gender === 'male');
                
                // تجميع حسب الأجيال
                const generations = {};
                maleMembers.forEach(member => {
                    const gen = member.generation || 1;
                    if (!generations[gen]) generations[gen] = [];
                    generations[gen].push(member);
                });
                
                // إضافة الخيارات مجموعة حسب الأجيال
                Object.keys(generations).sort((a, b) => parseInt(a) - parseInt(b)).forEach(genNum => {
                    const genGroup = document.createElement('optgroup');
                    genGroup.label = `${genNum == '1' ? 'الجيل المؤسس' : 'الجيل ' + genNum}`;
                    
                    generations[genNum].forEach(member => {
                        const option = document.createElement('option');
                        option.value = member.id;
                        option.textContent = `${member.full_name} (${this.getMembershipTypeText(member.membership_type).replace(/[🎖️👔👥👨‍👩‍👧‍👦🏅👑]/g, '').trim()})`;
                        genGroup.appendChild(option);
                    });
                    
                    fatherSelect.appendChild(genGroup);
                });

                // قائمة الأزواج (جميع الأعضاء)
                this.populateSpouseSelect();
            }

            populateSpouseSelect() {
                const spouseSelect = document.getElementById('familySpouseId');
                if (!spouseSelect) return;
                
                spouseSelect.innerHTML = '<option value="">-- اختر الزوج/الزوجة --</option>';
                
                const allMembers = this.dataManager.getData('familyMembers');
                
                // تجميع حسب الأجيال
                const generations = {};
                allMembers.forEach(member => {
                    const gen = member.generation || 1;
                    if (!generations[gen]) generations[gen] = [];
                    generations[gen].push(member);
                });
                
                // إضافة الخيارات مجموعة حسب الأجيال
                Object.keys(generations).sort((a, b) => parseInt(a) - parseInt(b)).forEach(genNum => {
                    const genGroup = document.createElement('optgroup');
                    genGroup.label = `${genNum == '1' ? 'الجيل المؤسس' : 'الجيل ' + genNum}`;
                    
                    generations[genNum].forEach(member => {
                        const option = document.createElement('option');
                        option.value = member.id;
                        const genderIcon = member.gender === 'male' ? '♂️' : '♀️';
                        option.textContent = `${genderIcon} ${member.full_name}`;
                        genGroup.appendChild(option);
                    });
                    
                    spouseSelect.appendChild(genGroup);
                });
            }

            fillFamilyForm(member) {
                // تحليل الاسم الكامل
                const nameParts = (member.full_name || '').split(' ');
                document.getElementById('familyFirstName').value = nameParts[0] || '';
                document.getElementById('familyMiddleName').value = nameParts[1] || '';
                document.getElementById('familyLastName').value = nameParts.slice(2).join(' ') || '';
                
                // باقي البيانات
                document.getElementById('familyFatherId').value = member.father_id || '';
                document.getElementById('familySpouseId').value = member.spouse_id || '';
                document.getElementById('familyMembershipType').value = member.membership_type || '';
                document.getElementById('familyGender').value = member.gender || '';
                document.getElementById('familyBirthDate').value = member.birth_date || '';
                document.getElementById('familyBirthPlace').value = member.birth_place || '';
                document.getElementById('familyProfession').value = member.profession || '';
                document.getElementById('familySpecialization').value = member.specialization || '';
                document.getElementById('familyPhone').value = member.phone || '';
                document.getElementById('familyEmail').value = member.email || '';
                document.getElementById('familyHobbies').value = member.hobbies || '';
                
                // تحديث المعاينة والجيل
                this.updateFullNamePreview();
                this.updateGenerationDisplay();
                
                // حفظ ID للتعديل
                document.getElementById('familyForm').dataset.editId = member.id;
            }

            saveFamilyMember() {
                const form = document.getElementById('familyForm');
                const editId = form.dataset.editId;
                
                // تجميع بيانات الاسم
                const firstName = document.getElementById('familyFirstName').value.trim();
                const middleName = document.getElementById('familyMiddleName').value.trim();
                const lastName = document.getElementById('familyLastName').value.trim();
                
                let fullName = firstName;
                if (middleName) fullName += ` ${middleName}`;
                if (lastName) fullName += ` ${lastName}`;
                
                const memberData = {
                    full_name: fullName,
                    first_name: firstName,
                    middle_name: middleName,
                    last_name: lastName,
                    father_id: document.getElementById('familyFatherId').value || null,
                    spouse_id: document.getElementById('familySpouseId').value || null,
                    membership_type: document.getElementById('familyMembershipType').value,
                    gender: document.getElementById('familyGender').value,
                    birth_date: document.getElementById('familyBirthDate').value || null,
                    birth_place: document.getElementById('familyBirthPlace').value.trim(),
                    profession: document.getElementById('familyProfession').value.trim(),
                    specialization: document.getElementById('familySpecialization').value.trim(),
                    phone: document.getElementById('familyPhone').value.trim(),
                    email: document.getElementById('familyEmail').value.trim(),
                    hobbies: document.getElementById('familyHobbies').value.trim()
                };
                
                // التحقق من البيانات المطلوبة
                if (!firstName || !lastName || !memberData.membership_type || !memberData.gender) {
                    this.showToast('يرجى ملء جميع الحقول المطلوبة: الاسم الأول، اسم العائلة، نوع العضوية، والجنس', 'error');
                    return;
                }

                // التحقق من صحة رقم الجوال (إذا تم إدخاله)
                if (memberData.phone && !/^05\d{8}$/.test(memberData.phone)) {
                    this.showToast('يرجى إدخال رقم جوال صحيح بصيغة 05xxxxxxxx', 'error');
                    return;
                }

                // التحقق من صحة البريد الإلكتروني (إذا تم إدخاله)
                if (memberData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberData.email)) {
                    this.showToast('يرجى إدخال بريد إلكتروني صحيح', 'error');
                    return;
                }
                
                try {
                    if (editId) {
                        // تعديل عضو موجود
                        this.dataManager.updateItem('familyMembers', editId, memberData);
                        this.showToast('تم تحديث بيانات العضو بنجاح', 'success');
                    } else {
                        // إضافة عضو جديد
                        const newMember = this.dataManager.addItem('familyMembers', memberData);
                        this.showToast(`تم إضافة ${memberData.full_name} للجيل ${newMember.generation} بنجاح!`, 'success');
                    }
                    
                    this.hideFamilyModal();
                    delete form.dataset.editId;
                    
                } catch (error) {
                    this.showToast('حدث خطأ: ' + error.message, 'error');
                }
            }

            hideFamilyModal() {
                document.getElementById('familyModal').classList.add('hidden');
                document.getElementById('familyForm').reset();
                this.updateFullNamePreview();
                this.updateGenerationDisplay();
            }

            resetFamilyForm() {
                if (confirm('هل أنت متأكد من إعادة تعيين جميع البيانات؟')) {
                    document.getElementById('familyForm').reset();
                    delete document.getElementById('familyForm').dataset.editId;
                    this.updateFullNamePreview();
                    this.updateGenerationDisplay();
                    this.showToast('تم إعادة تعيين النموذج', 'warning');
                }
            }

            // وظائف الأحداث والأقسام الأخرى (مطورة)
            displayEvents() {
                this.renderEvents();
            }

            renderEvents(filterType = 'all') {
                const events = this.dataManager.getData('events');
                const container = document.getElementById('events-grid');
                if (!container) return;

                // فلترة الأحداث حسب النوع
                let filteredEvents = events;
                if (filterType !== 'all') {
                    filteredEvents = events.filter(event => event.type === filterType);
                }

                // فرز الأحداث: الأحداث القادمة أولاً، ثم حسب التاريخ
                const sortedEvents = filteredEvents.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA; // الأحدث أولاً
                });

                if (sortedEvents.length === 0) {
                    const emptyMessages = {
                        'all': 'لا توجد أحداث مسجلة',
                        'family_gathering': 'لا توجد تجمعات عائلية مسجلة',
                        'wedding': 'لا توجد أفراح مسجلة',
                        'graduation': 'لا توجد حفلات تخرج مسجلة',
                        'birthday': 'لا توجد أعياد ميلاد مسجلة',
                        'religious': 'لا توجد مناسبات دينية مسجلة',
                        'celebration': 'لا توجد احتفالات مسجلة',
                        'travel': 'لا توجد رحلات مسجلة'
                    };

                    container.innerHTML = `
                        <div class="col-span-full text-center py-12">
                            <div class="text-6xl text-white mb-4 opacity-50">
                                <i class="fas fa-calendar-alt"></i>
                            </div>
                            <p class="text-white text-xl mb-4">${emptyMessages[filterType] || emptyMessages['all']}</p>
                            ${filterType === 'all' ? `
                                <button onclick="loadSampleData()" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 ml-2">
                                    تحميل بيانات نموذجية
                                </button>
                            ` : ''}
                            <button onclick="showEventModal()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                                إضافة حدث جديد
                            </button>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = sortedEvents.map(event => this.renderEventCard(event)).join('');
                this.updateEventsStats();
            }

            renderEventCard(event) {
                const typeIcons = {
                    'family_gathering': '👨‍👩‍👧‍👦',
                    'wedding': '💍',
                    'graduation': '🎓', 
                    'birthday': '🎂',
                    'religious': '🕌',
                    'celebration': '🎉',
                    'travel': '✈️',
                    'other': '📅'
                };

                const typeTexts = {
                    'family_gathering': 'تجمع عائلي',
                    'wedding': 'زفاف',
                    'graduation': 'تخرج',
                    'birthday': 'عيد ميلاد',
                    'religious': 'مناسبة دينية',
                    'celebration': 'احتفال',
                    'travel': 'رحلة',
                    'other': 'مناسبة أخرى'
                };

                const statusBadges = {
                    'upcoming': '<span class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">📅 قادم</span>',
                    'active': '<span class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">🔴 جاري الآن</span>',
                    'completed': '<span class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">✅ مكتمل</span>',
                    'cancelled': '<span class="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">❌ ملغي</span>'
                };

                // تحديد حالة الحدث بناءً على التاريخ
                const eventDate = new Date(event.date);
                const now = new Date();
                let status = event.status;
                
                if (!status) {
                    if (eventDate > now) {
                        status = 'upcoming';
                    } else if (eventDate.toDateString() === now.toDateString()) {
                        status = 'active';
                    } else {
                        status = 'completed';
                    }
                }

                const isAdmin = this.userManager.currentUser && this.userManager.currentUser.role === 'admin';
                const canEdit = isAdmin || (this.userManager.currentUser && event.created_by === (this.userManager.currentUser.first_name + ' ' + this.userManager.currentUser.last_name));

                return `
                    <div class="card p-6 hover:shadow-lg transition-shadow ${status === 'active' ? 'ring-2 ring-green-400' : ''}">
                        <!-- Header -->
                        <div class="flex justify-between items-start mb-4">
                            <div class="flex items-center gap-3">
                                <div class="text-3xl">${typeIcons[event.type] || '📅'}</div>
                                <div>
                                    <h3 class="text-xl font-bold text-gray-800 mb-1">${event.title}</h3>
                                    <p class="text-sm text-gray-600">${typeTexts[event.type] || event.type}</p>
                                </div>
                            </div>
                            ${statusBadges[status] || ''}
                        </div>

                        <!-- Event Details -->
                        <div class="space-y-3 mb-4">
                            <div class="flex items-center text-gray-700">
                                <i class="fas fa-calendar-alt w-5 ml-2 text-blue-600"></i>
                                <span>${new Date(event.date).toLocaleDateString('ar-SA')}</span>
                            </div>
                            
                            ${event.time ? `
                                <div class="flex items-center text-gray-700">
                                    <i class="fas fa-clock w-5 ml-2 text-green-600"></i>
                                    <span>${event.time}</span>
                                </div>
                            ` : ''}
                            
                            ${event.location ? `
                                <div class="flex items-center text-gray-700">
                                    <i class="fas fa-map-marker-alt w-5 ml-2 text-red-600"></i>
                                    <span>${event.location}</span>
                                </div>
                            ` : ''}
                            
                            ${event.organizer ? `
                                <div class="flex items-center text-gray-700">
                                    <i class="fas fa-user-tie w-5 ml-2 text-purple-600"></i>
                                    <span>منظم الحدث: ${event.organizer}</span>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Description -->
                        ${event.description ? `
                            <p class="text-gray-700 mb-4 line-clamp-2">${event.description}</p>
                        ` : ''}

                        <!-- Attendees and Capacity -->
                        <div class="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center space-x-4 rtl:space-x-reverse text-sm">
                                <span class="flex items-center text-blue-600">
                                    <i class="fas fa-users ml-1"></i>
                                    ${(event.attendees || []).length} مشارك
                                </span>
                                ${event.capacity ? `
                                    <span class="text-gray-500">من أصل ${event.capacity}</span>
                                ` : ''}
                                <span class="flex items-center text-gray-500">
                                    <i class="fas fa-eye ml-1"></i>
                                    ${event.views || 0}
                                </span>
                            </div>
                            
                            ${event.rsvp_required ? `
                                <span class="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                                    📝 يتطلب تأكيد الحضور
                                </span>
                            ` : ''}
                        </div>

                        <!-- Actions -->
                        <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                            <div class="flex gap-2">
                                ${this.userManager.currentUser ? `
                                    ${status === 'upcoming' && event.rsvp_required ? `
                                        <button onclick="rsvpEvent('${event.id}', true)" class="px-4 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">
                                            <i class="fas fa-check ml-1"></i>سأحضر
                                        </button>
                                        <button onclick="rsvpEvent('${event.id}', false)" class="px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                                            <i class="fas fa-times ml-1"></i>لن أحضر
                                        </button>
                                    ` : ''}
                                    <button onclick="shareEvent('${event.id}')" class="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                                        <i class="fas fa-share ml-1"></i>مشاركة
                                    </button>
                                ` : ''}
                            </div>

                            <!-- Admin/Creator Actions -->
                            ${canEdit ? `
                                <div class="flex gap-2">
                                    <button onclick="editEvent('${event.id}')" class="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200">
                                        <i class="fas fa-edit ml-1"></i>تعديل
                                    </button>
                                    ${isAdmin ? `
                                        <button onclick="deleteEvent('${event.id}')" class="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">
                                            <i class="fas fa-trash ml-1"></i>حذف
                                        </button>
                                    ` : ''}
                                </div>
                            ` : ''}
                        </div>

                        <!-- Event Creator Info -->
                        <div class="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                            أضيف بواسطة ${event.created_by || 'غير محدد'} • ${event.created_at || ''}
                        </div>
                    </div>
                `;
            }

            updateEventsStats() {
                const events = this.dataManager.getData('events');
                const now = new Date();
                
                const stats = {
                    total: events.length,
                    upcoming: events.filter(e => new Date(e.date) > now).length,
                    thisMonth: events.filter(e => {
                        const eventDate = new Date(e.date);
                        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                    }).length
                };

                // تحديث إحصائيات في واجهة الأحداث إذا كان هناك عنصر إحصائيات
                const statsContainer = document.getElementById('events-stats');
                if (statsContainer) {
                    statsContainer.innerHTML = `
                        <div class="grid grid-cols-3 gap-4 mb-6">
                            <div class="text-center p-4 bg-white bg-opacity-20 rounded-lg">
                                <div class="text-2xl font-bold text-white">${stats.total}</div>
                                <div class="text-sm text-white opacity-80">إجمالي الأحداث</div>
                            </div>
                            <div class="text-center p-4 bg-white bg-opacity-20 rounded-lg">
                                <div class="text-2xl font-bold text-white">${stats.upcoming}</div>
                                <div class="text-sm text-white opacity-80">أحداث قادمة</div>
                            </div>
                            <div class="text-center p-4 bg-white bg-opacity-20 rounded-lg">
                                <div class="text-2xl font-bold text-white">${stats.thisMonth}</div>
                                <div class="text-sm text-white opacity-80">هذا الشهر</div>
                            </div>
                        </div>
                    `;
                }
            }

            renderSuggestions() {
                const suggestions = this.dataManager.getData('suggestions');
                const container = document.getElementById('suggestions-grid');
                if (!container) return;

                if (suggestions.length === 0) {
                    container.innerHTML = `
                        <div class="col-span-full text-center py-12">
                            <div class="text-6xl text-white mb-4 opacity-50">
                                <i class="fas fa-lightbulb"></i>
                            </div>
                            <p class="text-white text-xl mb-4">لا توجد اقتراحات</p>
                            <button onclick="loadSampleData()" class="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700">
                                تحميل بيانات نموذجية
                            </button>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = suggestions.map(suggestion => this.renderSuggestionCard(suggestion)).join('');
                this.updateSuggestionsStats();
            }

            renderSuggestionCard(suggestion) {
                const statusBadges = {
                    'pending': '<span class="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">⏳ قيد المراجعة</span>',
                    'approved': '<span class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">✅ مقبول</span>',
                    'rejected': '<span class="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">❌ مرفوض</span>',
                    'under_review': '<span class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">🔍 تحت المراجعة</span>'
                };

                const priorityColors = {
                    'low': 'text-green-600',
                    'medium': 'text-yellow-600', 
                    'high': 'text-red-600',
                    'urgent': 'text-red-800'
                };

                const categoryIcons = {
                    'technology': '🔧',
                    'events': '🎉',
                    'services': '🛎️',
                    'education': '📚',
                    'social': '👥',
                    'business': '💼',
                    'other': '📝'
                };

                const isAdmin = this.userManager.currentUser && this.userManager.currentUser.role === 'admin';

                return `
                    <div class="card p-6 hover:shadow-lg transition-shadow">
                        <!-- Header -->
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-xl font-bold text-gray-800 mb-2">${suggestion.title}</h3>
                                <div class="flex items-center gap-2 text-sm text-gray-600">
                                    <span class="${priorityColors[suggestion.priority]}">
                                        ${categoryIcons[suggestion.category]} ${this.getCategoryText(suggestion.category)}
                                    </span>
                                    • 
                                    <span>بواسطة ${suggestion.submitted_by}</span>
                                    • 
                                    <span>${suggestion.submitted_date}</span>
                                </div>
                            </div>
                            ${statusBadges[suggestion.status] || ''}
                        </div>

                        <!-- Description -->
                        <p class="text-gray-700 mb-4 line-clamp-3">${suggestion.description}</p>

                        <!-- Benefits -->
                        ${suggestion.benefits ? `
                            <div class="mb-4">
                                <h5 class="text-sm font-semibold text-gray-800 mb-2">الفوائد المتوقعة:</h5>
                                <p class="text-sm text-gray-600">${suggestion.benefits}</p>
                            </div>
                        ` : ''}

                        <!-- Budget and Timeline -->
                        ${suggestion.budget || suggestion.timeline ? `
                            <div class="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                                ${suggestion.budget ? `<div><span class="text-sm font-medium">الميزانية:</span> <span class="text-sm text-gray-600">${suggestion.budget}</span></div>` : ''}
                                ${suggestion.timeline ? `<div><span class="text-sm font-medium">المدة:</span> <span class="text-sm text-gray-600">${suggestion.timeline}</span></div>` : ''}
                            </div>
                        ` : ''}

                        <!-- Voting and Actions -->
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-4 rtl:space-x-reverse">
                                <button onclick="voteSuggestion('${suggestion.id}', 'up')" class="flex items-center text-green-600 hover:text-green-700 transition">
                                    <i class="fas fa-thumbs-up ml-1"></i>
                                    <span>${suggestion.votes.up}</span>
                                </button>
                                <button onclick="voteSuggestion('${suggestion.id}', 'down')" class="flex items-center text-red-600 hover:text-red-700 transition">
                                    <i class="fas fa-thumbs-down ml-1"></i>
                                    <span>${suggestion.votes.down}</span>
                                </button>
                                <span class="text-gray-500">
                                    <i class="fas fa-comments ml-1"></i>
                                    ${suggestion.comments.length}
                                </span>
                            </div>

                            <!-- Admin Actions -->
                            ${isAdmin ? `
                                <div class="flex gap-2">
                                    ${suggestion.status === 'pending' ? `
                                        <button onclick="updateSuggestionStatus('${suggestion.id}', 'approved')" class="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">
                                            قبول
                                        </button>
                                        <button onclick="updateSuggestionStatus('${suggestion.id}', 'rejected')" class="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">
                                            رفض
                                        </button>
                                    ` : ''}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }

            getCategoryText(category) {
                const categories = {
                    'technology': 'تقني',
                    'events': 'فعاليات',
                    'services': 'خدمات',
                    'education': 'تعليمي',
                    'social': 'اجتماعي',
                    'business': 'تجاري',
                    'other': 'أخرى'
                };
                return categories[category] || category;
            }

            renderLibrary(filter = 'all') {
                const library = this.dataManager.getData('library');
                const container = document.getElementById('library-grid');
                if (!container) return;

                // فلترة المحتوى حسب النوع
                let filteredLibrary = library;
                if (filter === 'videos') {
                    filteredLibrary = library.filter(item => item.type === 'video');
                } else if (filter === 'photos') {
                    filteredLibrary = library.filter(item => item.category === 'photos' || item.type === 'image');
                } else if (filter === 'documents') {
                    filteredLibrary = library.filter(item => item.category === 'documents' || item.type === 'document');
                }

                if (filteredLibrary.length === 0) {
                    const emptyMessages = {
                        'all': 'لا توجد محتويات في المكتبة',
                        'videos': 'لا توجد فيديوهات مرفوعة',
                        'photos': 'لا توجد صور مرفوعة',
                        'documents': 'لا توجد وثائق مرفوعة'
                    };
                    
                    const emptyIcons = {
                        'all': 'fas fa-book',
                        'videos': 'fas fa-video',
                        'photos': 'fas fa-image',
                        'documents': 'fas fa-file-alt'
                    };

                    container.innerHTML = `
                        <div class="col-span-full text-center py-12">
                            <div class="text-6xl text-white mb-4 opacity-50">
                                <i class="${emptyIcons[filter]}"></i>
                            </div>
                            <p class="text-white text-xl mb-4">${emptyMessages[filter]}</p>
                            ${filter === 'all' ? `
                                <button onclick="loadSampleData()" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
                                    تحميل بيانات نموذجية
                                </button>
                            ` : `
                                <button onclick="showLibraryModal()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 ml-2">
                                    إضافة محتوى
                                </button>
                                ${filter === 'videos' ? `
                                    <button onclick="showVideoUploadModal()" class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
                                        رفع فيديو
                                    </button>
                                ` : ''}
                            `}
                        </div>
                    `;
                    return;
                }

                // فرز المحتوى: المميز أولاً، ثم حسب التاريخ
                const sortedLibrary = filteredLibrary.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return new Date(b.created_date || b.uploaded_at) - new Date(a.created_date || a.uploaded_at);
                });

                container.innerHTML = sortedLibrary.map(item => this.renderLibraryCard(item)).join('');
                this.updateLibraryStats();
                
                // تحديث إحصائيات الفيديو
                setTimeout(() => {
                    if (typeof updateVideoStats === 'function') {
                        updateVideoStats();
                    }
                }, 100);
            }

            renderLibraryCard(item) {
                const typeIcons = {
                    'document': '📄',
                    'book': '📚',
                    'article': '📝',
                    'video': '🎥',
                    'audio': '🎵',
                    'image': '🖼️',
                    'presentation': '📊',
                    'research': '🔬'
                };

                const categoryTexts = {
                    'family_history': 'تاريخ العائلة',
                    'genealogy': 'الأنساب',
                    'documents': 'الوثائق الرسمية',
                    'photos': 'الصور والذكريات',
                    'achievements': 'الإنجازات',
                    'stories': 'القصص والحكايات',
                    'education': 'التعليم والمهارات',
                    'business': 'الأعمال والتجارة',
                    'family_gathering': 'تجمع عائلي',
                    'wedding': 'زفاف',
                    'celebration': 'احتفال',
                    'graduation': 'تخرج',
                    'birthday': 'عيد ميلاد',
                    'religious': 'مناسبة دينية',
                    'travel': 'سفر ورحلات',
                    'other': 'أخرى'
                };

                const accessBadges = {
                    'public': '<span class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">🌍 عام</span>',
                    'family': '<span class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">👨‍👩‍👧‍👦 عائلي</span>',
                    'close_family': '<span class="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">👥 العائلة المقربة</span>',
                    'admin': '<span class="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">🔒 إداري</span>'
                };

                const canAccess = this.checkLibraryAccess(item);

                return `
                    <div class="card p-6 hover:shadow-lg transition-shadow ${item.featured ? 'ring-2 ring-yellow-400' : ''}">
                        <!-- Featured Badge -->
                        ${item.featured ? '<div class="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">⭐ مميز</div>' : ''}
                        
                        <!-- Header -->
                        <!-- Video Thumbnail for videos -->
                        ${item.type === 'video' ? `
                            <div class="mb-4 relative">
                                <div class="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition" onclick="playVideo('${item.id}')">
                                    <div class="text-center">
                                        <i class="fas fa-play-circle text-4xl text-blue-600 mb-2"></i>
                                        <p class="text-sm text-gray-600">انقر لتشغيل الفيديو</p>
                                    </div>
                                </div>
                                ${item.featured ? '<div class="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">⭐ مميز</div>' : ''}
                                <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                    ${item.duration ? formatDuration(item.duration) : ''}
                                </div>
                            </div>
                        ` : ''}
                        
                        <!-- Header -->
                        <div class="flex items-start gap-3 mb-4">
                            <div class="text-3xl">${typeIcons[item.type] || '📄'}</div>
                            <div class="flex-1">
                                <h3 class="text-xl font-bold text-gray-800 mb-1">${item.title}</h3>
                                <p class="text-sm text-gray-600">${item.type === 'video' ? `رفع بواسطة: ${item.uploaded_by || item.author}` : `بقلم: ${item.author}`}</p>
                                <p class="text-xs text-gray-500">${item.date || item.created_date || item.uploaded_at}</p>
                            </div>
                        </div>

                        <!-- Description -->
                        <p class="text-gray-700 mb-4 line-clamp-3">${item.description}</p>

                        <!-- Keywords -->
                        ${item.keywords && item.keywords.length > 0 ? `
                            <div class="flex flex-wrap gap-1 mb-4">
                                ${item.keywords.map(keyword => `
                                    <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">${keyword}</span>
                                `).join('')}
                            </div>
                        ` : ''}

                        <!-- Category and Access -->
                        <div class="flex justify-between items-center mb-4">
                            <span class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                                ${categoryTexts[item.category] || item.category}
                            </span>
                            ${accessBadges[item.access_level] || ''}
                        </div>

                        <!-- Stats and Actions -->
                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-4 text-sm text-gray-500">
                                <span><i class="fas fa-eye ml-1"></i>${item.views || 0}</span>
                                ${item.type === 'video' ? `
                                    <span><i class="fas fa-heart ml-1"></i>${item.likes || 0}</span>
                                    ${item.file_size ? `<span><i class="fas fa-file ml-1"></i>${(item.file_size / 1024 / 1024).toFixed(1)}MB</span>` : ''}
                                ` : `
                                    <span><i class="fas fa-download ml-1"></i>${item.downloads || 0}</span>
                                    <span><i class="fas fa-globe ml-1"></i>${item.language === 'arabic' ? 'العربية' : item.language || 'العربية'}</span>
                                `}
                            </div>

                            <div class="flex gap-2">
                                ${canAccess ? `
                                    ${item.type === 'video' ? `
                                        <button onclick="playVideo('${item.id}')" class="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
                                            <i class="fas fa-play ml-1"></i>تشغيل
                                        </button>
                                    ` : `
                                        ${item.url && item.url !== '#' ? `
                                            <button onclick="openLibraryItem('${item.id}')" class="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                                                <i class="fas fa-external-link-alt ml-1"></i>فتح
                                            </button>
                                        ` : ''}
                                        <button onclick="downloadLibraryItem('${item.id}')" class="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
                                            <i class="fas fa-download ml-1"></i>تحميل
                                        </button>
                                    `}
                                ` : `
                                    <span class="px-3 py-1 text-xs bg-gray-100 text-gray-500 rounded">غير متاح</span>
                                `}
                            </div>
                        </div>
                    </div>
                `;
            }

            checkLibraryAccess(item) {
                if (item.access_level === 'public') return true;
                if (!this.userManager.currentUser) return false;
                if (item.access_level === 'family') return true;
                if (item.access_level === 'admin') return this.userManager.currentUser.role === 'admin';
                return false;
            }

            updateLibraryStats() {
                const library = this.dataManager.getData('library');
                
                // حساب الإحصائيات
                const totalItems = library.length;
                const featuredItems = library.filter(item => item.featured).length;
                const totalViews = library.reduce((sum, item) => sum + (item.views || 0), 0);
                const totalDownloads = library.reduce((sum, item) => sum + (item.downloads || 0), 0);

                // تحديث العناصر في الواجهة
                const totalElement = document.getElementById('library-total-items');
                const featuredElement = document.getElementById('library-featured-items');
                const viewsElement = document.getElementById('library-total-views');
                const downloadsElement = document.getElementById('library-total-downloads');

                if (totalElement) totalElement.textContent = totalItems;
                if (featuredElement) featuredElement.textContent = featuredItems;
                if (viewsElement) viewsElement.textContent = totalViews;
                if (downloadsElement) downloadsElement.textContent = totalDownloads;
            }

            updateSuggestionsStats() {
                const suggestions = this.dataManager.getData('suggestions');
                
                // حساب الإحصائيات
                const totalSuggestions = suggestions.length;
                const pendingSuggestions = suggestions.filter(item => item.status === 'pending').length;
                const approvedSuggestions = suggestions.filter(item => item.status === 'approved').length;
                const highPrioritySuggestions = suggestions.filter(item => item.priority === 'high' || item.priority === 'urgent').length;

                // تحديث العناصر في الواجهة
                const totalElement = document.getElementById('suggestions-total');
                const pendingElement = document.getElementById('suggestions-pending');
                const approvedElement = document.getElementById('suggestions-approved');
                const highPriorityElement = document.getElementById('suggestions-high-priority');

                if (totalElement) totalElement.textContent = totalSuggestions;
                if (pendingElement) pendingElement.textContent = pendingSuggestions;
                if (approvedElement) approvedElement.textContent = approvedSuggestions;
                if (highPriorityElement) highPriorityElement.textContent = highPrioritySuggestions;
            }

            // الرسوم البيانية
            initializeCharts() {
                this.createMembershipChart();
                this.createActivityChart();
            }

            createMembershipChart() {
                const ctx = document.getElementById('membershipChart');
                if (!ctx) return;

                const familyMembers = this.dataManager.getData('familyMembers');
                const membershipData = {};
                
                familyMembers.forEach(member => {
                    const type = this.getMembershipTypeText(member.membership_type).replace(/[🎖️👔👥👨‍👩‍👧‍👦🏅👑]/g, '').trim();
                    membershipData[type] = (membershipData[type] || 0) + 1;
                });

                if (this.charts.membership) {
                    this.charts.membership.destroy();
                }

                this.charts.membership = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(membershipData),
                        datasets: [{
                            data: Object.values(membershipData),
                            backgroundColor: [
                                '#fbbf24', // amber
                                '#ef4444', // red
                                '#3b82f6', // blue
                                '#10b981', // green
                                '#6b7280', // gray
                                '#8b5cf6'  // purple
                            ]
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        aspectRatio: 1.2,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
            }

            createActivityChart() {
                const ctx = document.getElementById('activityChart');
                if (!ctx) return;

                // بيانات نموذجية للنشاط الشهري
                const monthlyData = [12, 19, 15, 22, 28, 18, 25, 20, 16, 24, 30, 22];
                const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                              'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

                if (this.charts.activity) {
                    this.charts.activity.destroy();
                }

                this.charts.activity = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: [{
                            label: 'النشاط الشهري',
                            data: monthlyData,
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        aspectRatio: 1.8,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top'
                            }
                        }
                    }
                });
            }

            updateCharts() {
                this.createMembershipChart();
                // لا حاجة لتحديث رسم النشاط لأنه يحتوي على بيانات ثابتة
            }

            // وظائف مساعدة
            getMembershipTypeText(type) {
                const types = {
                    'founder': '👑 مؤسس',
                    'chairman': '🎖️ رئيس مجلس الإدارة',
                    'board_member': '👔 عضو مجلس الإدارة',
                    'general_assembly': '👥 عضو الجمعية العمومية',
                    'family_member': '👨‍👩‍👧‍👦 عضو عائلة',
                    'honorary': '🏅 عضو شرفي'
                };
                return types[type] || type;
            }

            checkLibraryAccess(item) {
                // لوجيك التحقق من صلاحيات الوصول للمكتبة
                return true; // مبسط الآن
            }

            showToast(message, type = 'success') {
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.textContent = message;
                document.body.appendChild(toast);
                
                setTimeout(() => toast.classList.add('show'), 100);
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => {
                        if (document.body.contains(toast)) {
                            document.body.removeChild(toast);
                        }
                    }, 300);
                }, 4000);
            }

            // إنشاء النماذج (مبسط)
            createModals() {
                // تتم إضافة النماذج في HTML
            }

            // عرض الاقتراحات
            displaySuggestions() {
                this.renderSuggestions();
            }

            // عرض المكتبة
            displayLibrary() {
                this.renderLibrary();
            }

            // عرض الملف الشخصي
            displayProfile() {
                const user = this.userManager.currentUser;
                if (!user) return;

                const profileContainer = document.getElementById('profile-info');
                if (profileContainer) {
                    profileContainer.innerHTML = `
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="card p-6">
                                <h3 class="text-xl font-bold text-gray-800 mb-4">معلومات شخصية</h3>
                                <div class="space-y-3">
                                    <div><strong>الاسم:</strong> ${user.full_name}</div>
                                    <div><strong>البريد الإلكتروني:</strong> ${user.email}</div>
                                    <div><strong>رقم الجوال:</strong> ${user.phone}</div>
                                    <div><strong>المهنة:</strong> ${user.profession || 'غير محدد'}</div>
                                    <div><strong>التخصص:</strong> ${user.specialization || 'غير محدد'}</div>
                                    <div><strong>تاريخ الميلاد:</strong> ${user.birth_date || 'غير محدد'}</div>
                                </div>
                            </div>
                            <div class="card p-6">
                                <h3 class="text-xl font-bold text-gray-800 mb-4">معلومات العضوية</h3>
                                <div class="space-y-3">
                                    <div><strong>نوع العضوية:</strong> ${this.getMembershipTypeText(user.membership_type)}</div>
                                    <div><strong>تاريخ التسجيل:</strong> ${user.created_at || 'غير محدد'}</div>
                                    <div><strong>الحالة:</strong> <span class="text-green-600">نشط</span></div>
                                    <div><strong>الجيل:</strong> ${user.generation || 'غير محدد'}</div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }

            // عرض لوحة الإدارة
            displayAdminPanel() {
                if (!this.userManager.currentUser || this.userManager.currentUser.role !== 'admin') {
                    return;
                }

                const pendingUsers = this.userManager.getPendingUsers();
                const allUsers = this.userManager.getActiveUsers();
                const adminContainer = document.getElementById('admin-content');
                
                if (adminContainer) {
                    adminContainer.innerHTML = `
                        <div class="space-y-6">
                            <!-- طلبات العضوية المعلقة -->
                            <div class="card p-6">
                                <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <i class="fas fa-clock text-yellow-600 ml-2"></i>
                                    طلبات العضوية المعلقة (${pendingUsers.length})
                                </h3>
                                ${pendingUsers.length === 0 ? 
                                    '<p class="text-gray-500">✅ لا توجد طلبات معلقة</p>' :
                                    '<div id="pending-users-list">' + this.renderPendingUsers() + '</div>'
                                }
                            </div>
                            
                            <!-- الأعضاء النشطين -->
                            <div class="card p-6">
                                <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <i class="fas fa-users text-green-600 ml-2"></i>
                                    الأعضاء النشطين (${allUsers.length})
                                </h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    ${allUsers.map(user => `
                                        <div class="p-3 border border-gray-200 rounded-lg">
                                            <h4 class="font-semibold text-gray-800">${user.full_name}</h4>
                                            <p class="text-sm text-gray-600">${user.email}</p>
                                            <p class="text-xs text-gray-500">انضم: ${new Date(user.created_at).toLocaleDateString('ar-SA')}</p>
                                            <span class="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                                ${user.role === 'admin' ? '👑 مدير' : '👤 عضو'}
                                            </span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                    
                    // تحديث شارات الإشعارات
                    this.updatePendingBadges();
                }
            }

            // تحميل البيانات النموذجية
            loadSampleData() {
                try {
                    this.dataManager.loadSampleData();
                    
                    // التحقق من البيانات المحملة
                    const totalMembers = this.dataManager.getData('familyMembers').length;
                    const secondGen = this.dataManager.getData('familyMembers').filter(m => m.generation === 2);
                    
                    this.showToast(
                        `✅ تم تحميل البيانات النموذجية بنجاح!\n🌳 إجمالي الأعضاء: ${totalMembers}\n👥 الجيل الثاني: ${secondGen.length} أعضاء`, 
                        'success'
                    );
                    
                    this.refreshAllSections();
                    
                    // التبديل إلى قسم الشجرة العائلية لإظهار النتائج
                    setTimeout(() => {
                        showSection('family');
                    }, 1500);
                    
                } catch (error) {
                    this.showToast('حدث خطأ أثناء تحميل البيانات: ' + error.message, 'error');
                }
            }

            // === نظام إدارة الموافقة على التسجيل ===

            // عرض الطلبات المعلقة
            renderPendingUsers() {
                try {
                    const pendingUsers = this.userManager.users.filter(u => u.status === 'pending');
                    
                    if (pendingUsers.length === 0) {
                        return `
                            <div class="text-center py-8 text-gray-500">
                                <i class="fas fa-check-circle text-4xl mb-4"></i>
                                <p>لا توجد طلبات انتظار حالياً</p>
                            </div>
                        `;
                    }

                    return `
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${pendingUsers.map(user => `
                                <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <div class="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 class="font-semibold text-gray-800">${user.full_name}</h4>
                                            <p class="text-sm text-gray-600">${user.email}</p>
                                            <p class="text-xs text-gray-500">رقم الهوية: ${user.national_id}</p>
                                            <p class="text-xs text-gray-500">الهاتف: ${user.phone}</p>
                                        </div>
                                        <span class="bg-amber-100 text-amber-800 px-2 py-1 text-xs rounded-full">
                                            في الانتظار
                                        </span>
                                    </div>
                                    
                                    <div class="text-xs text-gray-500 mb-3">
                                        <p>تاريخ الميلاد: ${new Date(user.birth_date).toLocaleDateString('ar-SA')}</p>
                                        <p>مكان الميلاد: ${user.birth_place}</p>
                                        <p>المهنة: ${user.profession}</p>
                                        <p>تاريخ الطلب: ${new Date(user.created_at).toLocaleDateString('ar-SA')}</p>
                                    </div>

                                    <div class="flex gap-2">
                                        <button onclick="app.approveUser('` + user.id + `')" 
                                                class="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                                            <i class="fas fa-check ml-1"></i>
                                            موافقة
                                        </button>
                                        <button onclick="app.rejectUser('` + user.id + `')" 
                                                class="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors">
                                            <i class="fas fa-times ml-1"></i>
                                            رفض
                                        </button>
                                        <button onclick="app.viewUserDetails('` + user.id + `')" 
                                                class="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;
                } catch (error) {
                    console.error('خطأ في عرض الطلبات المعلقة:', error);
                    return '<div class="text-red-600 p-4">حدث خطأ في تحميل الطلبات المعلقة</div>';
                }
            }

            // موافقة على مستخدم
            approveUser(userId) {
                try {
                    const user = this.userManager.users.find(u => u.id === userId);
                    if (!user) {
                        this.showToast('المستخدم غير موجود', 'error');
                        return;
                    }

                    if (user.status !== 'pending') {
                        this.showToast('هذا الطلب تم البت فيه مسبقاً', 'warning');
                        return;
                    }

                    // تحديث حالة المستخدم
                    user.status = 'active';
                    user.approved_at = new Date().toISOString();
                    user.approved_by = this.userManager.currentUser.id;

                    // حفظ التغييرات
                    if (this.userManager.saveUsers()) {
                        this.showToast(`✅ تم قبول طلب ${user.full_name} بنجاح!`, 'success');
                        
                        // إرسال إيميل موافقة
                        this.sendApprovalEmail(user, true);
                        
                        // تحديث العرض
                        this.displayAdminPanel();
                        
                        // إضافة المستخدم كعضو في العائلة إذا لم يكن موجوداً
                        this.addUserToFamily(user);
                        
                    } else {
                        this.showToast('حدث خطأ في حفظ البيانات', 'error');
                    }
                } catch (error) {
                    console.error('خطأ في الموافقة على المستخدم:', error);
                    this.showToast('حدث خطأ في الموافقة على الطلب', 'error');
                }
            }

            // رفض مستخدم
            rejectUser(userId) {
                try {
                    const user = this.userManager.users.find(u => u.id === userId);
                    if (!user) {
                        this.showToast('المستخدم غير موجود', 'error');
                        return;
                    }

                    if (user.status !== 'pending') {
                        this.showToast('هذا الطلب تم البت فيه مسبقاً', 'warning');
                        return;
                    }

                    // تأكيد الرفض
                    if (confirm(`هل أنت متأكد من رفض طلب ${user.full_name}؟\nسيتم حذف الطلب نهائياً.`)) {
                        // إرسال إيميل رفض قبل الحذف
                        this.sendApprovalEmail(user, false);
                        
                        // حذف المستخدم من القائمة
                        const userIndex = this.userManager.users.findIndex(u => u.id === userId);
                        if (userIndex > -1) {
                            this.userManager.users.splice(userIndex, 1);
                            
                            if (this.userManager.saveUsers()) {
                                this.showToast(`❌ تم رفض طلب ${user.full_name}`, 'info');
                                this.displayAdminPanel();
                            } else {
                                this.showToast('حدث خطأ في حفظ البيانات', 'error');
                            }
                        }
                    }
                } catch (error) {
                    console.error('خطأ في رفض المستخدم:', error);
                    this.showToast('حدث خطأ في رفض الطلب', 'error');
                }
            }

            // عرض تفاصيل المستخدم
            viewUserDetails(userId) {
                try {
                    const user = this.userManager.users.find(u => u.id === userId);
                    if (!user) {
                        this.showToast('المستخدم غير موجود', 'error');
                        return;
                    }

                    const modalHTML = `
                        <div class="modal-overlay" onclick="closeModal('userDetailsModal')">
                            <div class="modal-content max-w-2xl" onclick="event.stopPropagation()">
                                <div class="modal-header">
                                    <h2 class="text-xl font-bold">تفاصيل طلب التسجيل</h2>
                                    <button onclick="closeModal('userDetailsModal')" class="modal-close">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                
                                <div class="modal-body max-h-96 overflow-y-auto">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div class="space-y-3">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-600">الاسم الكامل</label>
                                                <p class="text-gray-800">${user.full_name}</p>
                                            </div>
                                            
                                            <div>
                                                <label class="block text-sm font-medium text-gray-600">البريد الإلكتروني</label>
                                                <p class="text-gray-800">${user.email}</p>
                                            </div>
                                            
                                            <div>
                                                <label class="block text-sm font-medium text-gray-600">رقم الهوية</label>
                                                <p class="text-gray-800">${user.national_id}</p>
                                            </div>
                                            
                                            <div>
                                                <label class="block text-sm font-medium text-gray-600">رقم الهاتف</label>
                                                <p class="text-gray-800">${user.phone}</p>
                                            </div>
                                            
                                            <div>
                                                <label class="block text-sm font-medium text-gray-600">تاريخ الميلاد</label>
                                                <p class="text-gray-800">${new Date(user.birth_date).toLocaleDateString('ar-SA')}</p>
                                            </div>
                                        </div>
                                        
                                        <div class="space-y-3">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-600">مكان الميلاد</label>
                                                <p class="text-gray-800">${user.birth_place}</p>
                                            </div>
                                            
                                            <div>
                                                <label class="block text-sm font-medium text-gray-600">المهنة</label>
                                                <p class="text-gray-800">${user.profession}</p>
                                            </div>
                                            
                                            <div>
                                                <label class="block text-sm font-medium text-gray-600">التخصص</label>
                                                <p class="text-gray-800">${user.specialization || 'غير محدد'}</p>
                                            </div>
                                            
                                            <div>
                                                <label class="block text-sm font-medium text-gray-600">الهوايات</label>
                                                <p class="text-gray-800">${user.hobbies || 'غير محدد'}</p>
                                            </div>
                                            
                                            <div>
                                                <label class="block text-sm font-medium text-gray-600">تاريخ الطلب</label>
                                                <p class="text-gray-800">${new Date(user.created_at).toLocaleDateString('ar-SA', { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="modal-footer">
                                    <button onclick="app.approveUser('` + user.id + `'); closeModal('userDetailsModal')" 
                                            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                                        <i class="fas fa-check ml-1"></i>
                                        موافقة
                                    </button>
                                    <button onclick="app.rejectUser('` + user.id + `'); closeModal('userDetailsModal')" 
                                            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                                        <i class="fas fa-times ml-1"></i>
                                        رفض
                                    </button>
                                    <button onclick="closeModal('userDetailsModal')" 
                                            class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                                        إغلاق
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;

                    // إضافة النافذة المنبثقة
                    const existingModal = document.getElementById('userDetailsModal');
                    if (existingModal) {
                        existingModal.remove();
                    }

                    const modalDiv = document.createElement('div');
                    modalDiv.id = 'userDetailsModal';
                    modalDiv.innerHTML = modalHTML;
                    document.body.appendChild(modalDiv);

                } catch (error) {
                    console.error('خطأ في عرض تفاصيل المستخدم:', error);
                    this.showToast('حدث خطأ في عرض التفاصيل', 'error');
                }
            }

            // إرسال إيميل الموافقة/الرفض (محاكاة)
            sendApprovalEmail(user, approved) {
                try {
                    const emailData = {
                        to: user.email,
                        subject: approved ? 'تم قبول طلب انضمامك لموقع عائلة السعدان' : 'لم يتم قبول طلب الانضمام',
                        body: approved 
                            ? `مرحباً ${user.full_name},\n\nنحن سعداء لإبلاغك بأنه تم قبول طلب انضمامك لموقع عائلة السعدان.\n\nيمكنك الآن تسجيل الدخول واستكشاف الموقع.\n\nأهلاً وسهلاً بك في العائلة!\n\nإدارة موقع عائلة السعدان`
                            : `مرحباً ${user.full_name},\n\nنعتذر لإبلاغك بأنه لم يتم قبول طلب انضمامك لموقع عائلة السعدان في الوقت الحالي.\n\nيمكنك المحاولة مرة أخرى أو التواصل مع الإدارة للاستفسار.\n\nشكراً لاهتمامك\n\nإدارة موقع عائلة السعدان`,
                        timestamp: new Date().toISOString()
                    };

                    // حفظ السجل محلياً (محاكاة)
                    const emailLogs = JSON.parse(localStorage.getItem('email_logs') || '[]');
                    emailLogs.push(emailData);
                    localStorage.setItem('email_logs', JSON.stringify(emailLogs));

                    console.log('📧 تم إرسال إيميل:', approved ? 'موافقة' : 'رفض', 'إلى:', user.email);
                    
                } catch (error) {
                    console.error('خطأ في إرسال الإيميل:', error);
                }
            }

            // إضافة المستخدم المقبول كعضو في العائلة
            addUserToFamily(user) {
                try {
                    const familyMembers = this.dataManager.getData('familyMembers');
                    
                    // التحقق من عدم وجود العضو مسبقاً
                    const existingMember = familyMembers.find(m => 
                        m.national_id === user.national_id || 
                        m.email === user.email
                    );
                    
                    if (!existingMember) {
                        const newFamilyMember = {
                            id: user.id,
                            name: user.full_name,
                            email: user.email,
                            phone: user.phone,
                            national_id: user.national_id,
                            birth_date: user.birth_date,
                            birth_place: user.birth_place,
                            profession: user.profession,
                            specialization: user.specialization || '',
                            hobbies: user.hobbies || '',
                            father_id: user.father_id,
                            generation: user.generation || 3, // افتراضياً الجيل الثالث للأعضاء الجدد
                            created_at: new Date().toISOString()
                        };
                        
                        familyMembers.push(newFamilyMember);
                        this.dataManager.saveData('familyMembers', familyMembers);
                        
                        console.log('✅ تم إضافة المستخدم كعضو في العائلة:', user.full_name);
                    }
                } catch (error) {
                    console.error('خطأ في إضافة المستخدم للعائلة:', error);
                }
            }

            // الحصول على عدد الطلبات المعلقة للشارة
            getPendingUsersCount() {
                try {
                    return this.userManager.users.filter(u => u.status === 'pending').length;
                } catch (error) {
                    console.error('خطأ في حساب الطلبات المعلقة:', error);
                    return 0;
                }
            }

            // تحديث شارات الإشعارات
            updatePendingBadges() {
                try {
                    const pendingCount = this.getPendingUsersCount();
                    const badgeDesktop = document.getElementById('pending-badge-desktop');
                    const badgeMobile = document.getElementById('pending-badge-mobile');

                    if (pendingCount > 0) {
                        // إظهار الشارات مع العدد
                        if (badgeDesktop) {
                            badgeDesktop.textContent = pendingCount;
                            badgeDesktop.classList.remove('hidden');
                        }
                        if (badgeMobile) {
                            badgeMobile.textContent = pendingCount;
                            badgeMobile.classList.remove('hidden');
                        }
                    } else {
                        // إخفاء الشارات
                        if (badgeDesktop) {
                            badgeDesktop.classList.add('hidden');
                        }
                        if (badgeMobile) {
                            badgeMobile.classList.add('hidden');
                        }
                    }
                } catch (error) {
                    console.error('خطأ في تحديث شارات الإشعارات:', error);
                }
            }
        }

        // المتغيرات العامة
        let app;

        // تهيئة التطبيق
        document.addEventListener('DOMContentLoaded', function() {
            try {
                app = new EnhancedAlSaedanApp();
                console.log('✅ تم تحميل التطبيق الشامل المحسن بنجاح');
            } catch (error) {
                console.error('❌ خطأ في تهيئة التطبيق:', error);
            }
        });

        // وظائف إدارة القائمة المتنقلة
        function toggleMobileMenu() {
            const mobileNav = document.getElementById('mobileNavigation');
            const menuIcon = document.getElementById('mobileMenuIcon');
            
            if (mobileNav.classList.contains('hidden')) {
                mobileNav.classList.remove('hidden');
                menuIcon.className = 'fas fa-times text-xl';
            } else {
                mobileNav.classList.add('hidden');
                menuIcon.className = 'fas fa-bars text-xl';
            }
        }

        // إغلاق القائمة المتنقلة عند النقر خارجها
        document.addEventListener('click', function(event) {
            const mobileNav = document.getElementById('mobileNavigation');
            const menuButton = document.getElementById('mobileMenuButton');
            
            if (!mobileNav.contains(event.target) && !menuButton.contains(event.target)) {
                mobileNav.classList.add('hidden');
                document.getElementById('mobileMenuIcon').className = 'fas fa-bars text-xl';
            }
        });

        // وظائف التنقل
        function showSection(sectionName) {
            // إزالة الفئة النشطة من جميع الأقسام
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            // إزالة الفئة النشطة من جميع أزرار التنقل (سطح المكتب والجوال)
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            document.querySelectorAll('.nav-item-mobile').forEach(item => {
                item.classList.remove('active');
            });
            
            // إظهار القسم المطلوب
            const targetSection = document.getElementById(`${sectionName}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // تفعيل زر التنقل في سطح المكتب
            const navButton = document.getElementById(`nav-${sectionName}`);
            if (navButton) {
                navButton.classList.add('active');
            }
            
            // تفعيل زر التنقل في الجوال
            const mobileNavButtons = document.querySelectorAll('.nav-item-mobile');
            mobileNavButtons.forEach(btn => {
                const onclick = btn.getAttribute('onclick');
                if (onclick && onclick.includes(`showSection('${sectionName}')`)) {
                    btn.classList.add('active');
                }
            });

            // تحديث المحتوى حسب القسم
            if (app) {
                switch(sectionName) {
                    case 'home':
                        setTimeout(() => {
                            if (app.updateCharts) app.updateCharts();
                            if (app.displayHomeStatistics) app.displayHomeStatistics();
                        }, 100);
                        break;
                    case 'family':
                        app.displayFamilyTree();
                        break;
                    case 'events':
                        app.displayEvents();
                        break;
                    case 'suggestions':
                        app.renderSuggestions();
                        break;
                    case 'library':
                        app.renderLibrary();
                        break;
                    case 'profile':
                        app.displayUserProfile();
                        break;
                    case 'admin':
                        if (app.userManager.currentUser && app.userManager.currentUser.role === 'admin') {
                            app.displayAdminPanel();
                        }
                        break;
                }
            }
        }

        // وظائف العائلة
        function loadFounderFamily() {
            if (app) {
                app.loadSampleData();
            }
        }

        function resetAndReloadFamily() {
            if (confirm('هل أنت متأكد من إعادة تعيين جميع البيانات وتحميل العائلة الحقيقية؟\nسيتم حذف جميع البيانات الموجودة.')) {
                if (app) {
                    try {
                        console.log('🔄 بدء عملية إعادة التعيين...');
                        
                        // مسح جميع مفاتيح LocalStorage المتعلقة بالتطبيق
                        const keysToRemove = [];
                        for (let i = 0; i < localStorage.length; i++) {
                            const key = localStorage.key(i);
                            if (key && (key.includes('al_saedan') || key.includes('family') || key.includes('saedan'))) {
                                keysToRemove.push(key);
                            }
                        }
                        
                        keysToRemove.forEach(key => {
                            localStorage.removeItem(key);
                            console.log(`🗑️ تم حذف مفتاح: ${key}`);
                        });
                        
                        // إعادة تعيين البيانات بالكامل
                        app.dataManager.resetToEmpty();
                        
                        console.log('📊 البيانات النموذجية تحتوي على:');
                        console.log(`   - أعضاء العائلة: ${SAMPLE_FAMILY_DATA.familyMembers.length}`);
                        console.log(`   - الجيل الثاني: ${SAMPLE_FAMILY_DATA.familyMembers.filter(m => m.generation === 2).length}`);
                        
                        // تحميل البيانات الجديدة مباشرة
                        app.dataManager.loadSampleData();
                        
                        // التحقق من النتيجة
                        const currentMembers = app.dataManager.getData('familyMembers');
                        const gen2Members = currentMembers.filter(m => m.generation === 2);
                        
                        console.log('✅ النتيجة بعد التحميل:');
                        console.log(`   - إجمالي الأعضاء: ${currentMembers.length}`);
                        console.log(`   - الجيل الثاني: ${gen2Members.length}`);
                        
                        if (gen2Members.length > 0) {
                            console.log('👥 أعضاء الجيل الثاني المحملين:');
                            gen2Members.forEach((member, index) => {
                                console.log(`   ${index + 1}. ${member.full_name}`);
                            });
                        }
                        
                        // تحديث العرض
                        app.displayFamilyTree();
                        app.updateStats();
                        
                        app.showToast(`✅ تم التحميل! العدد: ${currentMembers.length} أعضاء (الجيل الثاني: ${gen2Members.length})`, 'success');
                        
                        // إعادة توجيه للشجرة العائلية لرؤية النتيجة
                        setTimeout(() => {
                            showSection('family');
                        }, 1000);
                        
                    } catch (error) {
                        console.error('❌ خطأ في إعادة التعيين:', error);
                        app.showToast('حدث خطأ في إعادة التعيين: ' + error.message, 'error');
                    }
                }
            }
        }

        // وظيفة لحقن البيانات الحقيقية مباشرة
        function forceLoadRealFamily() {
            if (!app) return;
            
            console.log('🚀 بدء حقن البيانات الحقيقية مباشرة...');
            
            // البيانات الحقيقية الكاملة
            const realFamilyData = [
                // الجيل المؤسس
                {
                    id: 'founder_001',
                    full_name: 'محمد بن سعيدان',
                    first_name: 'محمد',
                    middle_name: '',
                    last_name: 'بن سعيدان',
                    membership_type: 'founder',
                    gender: 'male',
                    father_id: null,
                    generation: 1,
                    birth_date: '1950-01-01',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: 'رجل أعمال',
                    specialization: 'التطوير العقاري',
                    phone: '0533361154',
                    email: 'info@salmansaedan.com',
                    hobbies: 'القراءة، الاستثمار العقاري، الأعمال الخيرية',
                    created_at: '2024-01-01',
                    children: []
                },
                // الجيل الثاني - الأبناء
                {
                    id: 'gen2_001',
                    full_name: 'سلمان محمد بن سعيدان',
                    first_name: 'سلمان',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'chairman',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1975-05-15',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: 'مطور عقاري',
                    specialization: 'إدارة المشاريع العقارية',
                    phone: '0533361156',
                    email: 'salman@salmansaedan.com',
                    hobbies: 'السفر، التصوير، الرياضة، تطوير الأعمال',
                    created_at: '2024-01-02',
                    children: []
                },
                {
                    id: 'gen2_002',
                    full_name: 'عبدالله محمد بن سعيدان',
                    first_name: 'عبدالله',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1970-03-10',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-03',
                    children: []
                },
                {
                    id: 'gen2_003',
                    full_name: 'فهد محمد بن سعيدان',
                    first_name: 'فهد',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1972-07-22',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-04',
                    children: []
                },
                {
                    id: 'gen2_004',
                    full_name: 'حمد محمد بن سعيدان',
                    first_name: 'حمد',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1974-11-05',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-05',
                    children: []
                },
                {
                    id: 'gen2_005',
                    full_name: 'إبراهيم محمد بن سعيدان',
                    first_name: 'إبراهيم',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1976-09-18',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-06',
                    children: []
                },
                {
                    id: 'gen2_006',
                    full_name: 'عبدالرحمن محمد بن سعيدان',
                    first_name: 'عبدالرحمن',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1978-12-30',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-07',
                    children: []
                },
                {
                    id: 'gen2_007',
                    full_name: 'ناصر محمد بن سعيدان',
                    first_name: 'ناصر',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1980-04-12',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-08',
                    children: []
                },
                {
                    id: 'gen2_008',
                    full_name: 'سعد محمد بن سعيدان',
                    first_name: 'سعد',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1982-08-25',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-09',
                    children: []
                },
                {
                    id: 'gen2_009',
                    full_name: 'عبدالمحسن محمد بن سعيدان',
                    first_name: 'عبدالمحسن',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1984-02-14',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-10',
                    children: []
                },
                {
                    id: 'gen2_010',
                    full_name: 'عبدالعزيز محمد بن سعيدان',
                    first_name: 'عبدالعزيز',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1986-06-08',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-11',
                    children: []
                },
                {
                    id: 'gen2_011',
                    full_name: 'متعب محمد بن سعيدان',
                    first_name: 'متعب',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1988-10-20',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-12',
                    children: []
                },
                {
                    id: 'gen2_012',
                    full_name: 'بندر محمد بن سعيدان',
                    first_name: 'بندر',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'board_member',
                    gender: 'male',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1990-01-15',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-13',
                    children: []
                },
                // البنات
                {
                    id: 'gen2_013',
                    full_name: 'منيرة محمد بن سعيدان',
                    first_name: 'منيرة',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'family_member',
                    gender: 'female',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1973-05-12',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-14',
                    children: []
                },
                {
                    id: 'gen2_014',
                    full_name: 'سارة محمد بن سعيدان',
                    first_name: 'سارة',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'family_member',
                    gender: 'female',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1977-08-03',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-15',
                    children: []
                },
                {
                    id: 'gen2_015',
                    full_name: 'نورة محمد بن سعيدان',
                    first_name: 'نورة',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'family_member',
                    gender: 'female',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1981-11-26',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-16',
                    children: []
                },
                {
                    id: 'gen2_016',
                    full_name: 'العنود محمد بن سعيدان',
                    first_name: 'العنود',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'family_member',
                    gender: 'female',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1985-03-17',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-17',
                    children: []
                },
                {
                    id: 'gen2_017',
                    full_name: 'وسمية محمد بن سعيدان',
                    first_name: 'وسمية',
                    middle_name: 'محمد',
                    last_name: 'بن سعيدان',
                    membership_type: 'family_member',
                    gender: 'female',
                    father_id: 'founder_001',
                    generation: 2,
                    birth_date: '1987-09-09',
                    birth_place: 'الرياض، المملكة العربية السعودية',
                    profession: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    hobbies: '',
                    created_at: '2024-01-18',
                    children: []
                }
            ];
            
            // حقن البيانات مباشرة
            app.dataManager.data.familyMembers = realFamilyData;
            
            // تحديث مراجع الأطفال
            app.dataManager.updateChildrenReferences();
            
            // حفظ البيانات
            app.dataManager.saveData();
            
            console.log(`✅ تم حقن البيانات! العدد: ${realFamilyData.length} أعضاء`);
            console.log(`   - الجيل الأول: ${realFamilyData.filter(m => m.generation === 1).length} أعضاء`);
            console.log(`   - الجيل الثاني: ${realFamilyData.filter(m => m.generation === 2).length} أعضاء`);
            
            // تحديث العرض
            app.displayFamilyTree();
            app.updateStats();
            
            app.showToast(`✅ تم حقن البيانات بنجاح! العدد: ${realFamilyData.length} أعضاء`, 'success');
            
            // الانتقال للشجرة العائلية
            setTimeout(() => {
                showSection('family');
            }, 500);
        }

        // وظيفة دخول سريع كمدير
        function quickLogin() {
            if (app && app.userManager) {
                try {
                    console.log('🚀 محاولة دخول سريع كمدير...');
                    
                    // تسجيل دخول مباشر بالحساب الافتراضي
                    const loginResult = app.userManager.login('admin@salmansaedan.com', 'admin123');
                    
                    if (loginResult.success) {
                        console.log('✅ نجح الدخول كمدير');
                        app.showToast('✅ تم تسجيل الدخول كمدير بنجاح!', 'success');
                        
                        // تحديث الواجهة
                        app.updateUserInterface();
                        
                        // الانتقال للصفحة الرئيسية
                        showSection('home');
                        
                    } else {
                        console.error('❌ فشل في تسجيل الدخول:', loginResult.message);
                        app.showToast('❌ فشل في تسجيل الدخول: ' + loginResult.message, 'error');
                    }
                } catch (error) {
                    console.error('❌ خطأ في الدخول السريع:', error);
                    app.showToast('❌ خطأ في تسجيل الدخول: ' + error.message, 'error');
                }
            } else {
                console.error('❌ التطبيق غير جاهز');
                app.showToast('❌ التطبيق غير جاهز، جرب مرة أخرى', 'error');
            }
        }

        // وظيفة للتحقق من عدد الأعضاء في console
        function checkMemberCount() {
            if (app) {
                const familyMembers = app.dataManager.getData('familyMembers');
                const gen1 = familyMembers.filter(m => m.generation === 1);
                const gen2 = familyMembers.filter(m => m.generation === 2);
                
                console.log('📊 إحصائيات العائلة الحالية:');
                console.log(`   - إجمالي الأعضاء: ${familyMembers.length}`);
                console.log(`   - الجيل الأول: ${gen1.length} أعضاء`);
                console.log(`   - الجيل الثاني: ${gen2.length} أعضاء`);
                
                if (gen2.length > 0) {
                    console.log('👥 أعضاء الجيل الثاني:');
                    gen2.forEach((member, index) => {
                        console.log(`   ${index + 1}. ${member.full_name}`);
                    });
                } else {
                    console.log('⚠️ لا يوجد أعضاء في الجيل الثاني');
                }
                
                // فحص البيانات الأساسية
                console.log('🔍 فحص البيانات الأساسية:');
                console.log(`   - أعضاء في SAMPLE_FAMILY_DATA: ${SAMPLE_FAMILY_DATA.familyMembers.length}`);
                console.log(`   - الجيل الثاني في البيانات الأساسية: ${SAMPLE_FAMILY_DATA.familyMembers.filter(m => m.generation === 2).length}`);
                
                // فحص LocalStorage
                const stored = localStorage.getItem('al_saedan_app_v2');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    console.log(`   - أعضاء في LocalStorage: ${parsed.familyMembers ? parsed.familyMembers.length : 0}`);
                } else {
                    console.log('   - لا توجد بيانات في LocalStorage');
                }
                
                app.showToast(`العدد الحالي: ${familyMembers.length} أعضاء (الجيل الثاني: ${gen2.length})`, gen2.length === 17 ? 'success' : 'error');
            }
        }

        function loadSampleData() {
            if (app) {
                app.loadSampleData();
            }
        }

        function showFamilyModal(memberId = null) {
            if (app) {
                app.showFamilyModal(memberId);
            }
        }

        function hideFamilyModal() {
            if (app) {
                app.hideFamilyModal();
            }
        }

        function resetFamilyForm() {
            if (app) {
                app.resetFamilyForm();
            }
        }

        function editFamilyMember(id) {
            if (app) {
                app.showFamilyModal(id);
            }
        }

        function deleteFamilyMember(id) {
            if (!app) return;
            
            if (confirm('هل أنت متأكد من حذف هذا العضو؟')) {
                try {
                    app.dataManager.deleteItem('familyMembers', id);
                    app.showToast('تم حذف العضو بنجاح', 'success');
                } catch (error) {
                    app.showToast('حدث خطأ: ' + error.message, 'error');
                }
            }
        }

        // وظائف النماذج الأخرى (مبسطة)
        // وظائف إدارة الأحداث
        function showEventModal() {
            document.getElementById('eventModal').classList.remove('hidden');
            document.getElementById('eventTitle').focus();
            
            // تعيين التاريخ الحالي كافتراضي
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('eventDate').value = today;
        }

        function hideEventModal() {
            document.getElementById('eventModal').classList.add('hidden');
            document.getElementById('eventForm').reset();
        }

        function resetEventForm() {
            document.getElementById('eventForm').reset();
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('eventDate').value = today;
            document.getElementById('eventTitle').focus();
        }



        function filterEventsByType(type) {
            app.renderEvents(type);
        }

        // وظائف إضافية لإدارة الأحداث
        function rsvpEvent(eventId, attending) {
            if (!app.userManager.currentUser) {
                app.showToast('يجب تسجيل الدخول أولاً', 'error');
                return;
            }

            const events = app.dataManager.getData('events');
            const eventIndex = events.findIndex(e => e.id === eventId);
            
            if (eventIndex === -1) {
                app.showToast('الحدث غير موجود', 'error');
                return;
            }

            const event = events[eventIndex];
            if (!event.attendees) event.attendees = [];

            const userId = app.userManager.currentUser.id;
            const existingRSVP = event.attendees.findIndex(a => a.userId === userId);

            if (attending) {
                if (existingRSVP === -1) {
                    event.attendees.push({
                        userId: userId,
                        name: app.userManager.currentUser.first_name + ' ' + app.userManager.currentUser.last_name,
                        status: 'attending',
                        rsvp_date: new Date().toISOString()
                    });
                    app.showToast('تم تأكيد حضورك للحدث', 'success');
                } else {
                    event.attendees[existingRSVP].status = 'attending';
                    app.showToast('تم تحديث حضورك للحدث', 'success');
                }
            } else {
                if (existingRSVP !== -1) {
                    event.attendees[existingRSVP].status = 'not_attending';
                    app.showToast('تم تسجيل عدم حضورك للحدث', 'warning');
                }
            }

            app.dataManager.setData('events', events);
            app.renderEvents();
        }

        function shareEvent(eventId) {
            const events = app.dataManager.getData('events');
            const event = events.find(e => e.id === eventId);
            
            if (!event) {
                app.showToast('الحدث غير موجود', 'error');
                return;
            }

            const shareText = `🎉 ${event.title}\n📅 ${new Date(event.date).toLocaleDateString('ar-SA')}\n📍 ${event.location || ''}\n\n${event.description || ''}`;
            
            if (navigator.share) {
                navigator.share({
                    title: event.title,
                    text: shareText,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(shareText).then(() => {
                    app.showToast('تم نسخ تفاصيل الحدث', 'success');
                });
            }
        }

        function editEvent(eventId) {
            const events = app.dataManager.getData('events');
            const event = events.find(e => e.id === eventId);
            
            if (!event) {
                app.showToast('الحدث غير موجود', 'error');
                return;
            }

            // ملء النموذج بالبيانات الحالية
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('eventType').value = event.type;
            document.getElementById('eventDate').value = event.date;
            document.getElementById('eventTime').value = event.time || '';
            document.getElementById('eventLocation').value = event.location || '';
            document.getElementById('eventDescription').value = event.description || '';
            document.getElementById('eventOrganizer').value = event.organizer || '';
            document.getElementById('eventCapacity').value = event.capacity || '';
            document.getElementById('eventContact').value = event.contact || '';
            document.getElementById('eventRSVP').checked = event.rsvp_required || false;
            document.getElementById('eventPublic').checked = event.is_public || false;
            document.getElementById('eventReminder').checked = event.reminder_enabled || false;

            // تعيين ID للتعديل
            document.getElementById('eventForm').dataset.editId = eventId;
            
            // عرض النموذج
            showEventModal();
        }

        function deleteEvent(eventId) {
            if (!app.userManager.currentUser || app.userManager.currentUser.role !== 'admin') {
                app.showToast('ليس لديك صلاحية لحذف الأحداث', 'error');
                return;
            }

            if (confirm('هل أنت متأكد من حذف هذا الحدث؟')) {
                const events = app.dataManager.getData('events');
                const filteredEvents = events.filter(e => e.id !== eventId);
                app.dataManager.setData('events', filteredEvents);
                app.showToast('تم حذف الحدث بنجاح', 'success');
                app.renderEvents();
            }
        }

        // تحديث معالج إرسال الحدث للدعم التعديل
        function handleEventSubmit(event) {
            event.preventDefault();
            
            if (!app.userManager.currentUser) {
                app.showToast('يجب تسجيل الدخول أولاً لإضافة حدث', 'error');
                return;
            }

            const form = document.getElementById('eventForm');
            const editId = form.dataset.editId;

            const formData = {
                title: document.getElementById('eventTitle').value,
                type: document.getElementById('eventType').value,
                date: document.getElementById('eventDate').value,
                time: document.getElementById('eventTime').value,
                location: document.getElementById('eventLocation').value,
                description: document.getElementById('eventDescription').value,
                organizer: document.getElementById('eventOrganizer').value,
                capacity: document.getElementById('eventCapacity').value,
                contact: document.getElementById('eventContact').value,
                rsvp_required: document.getElementById('eventRSVP').checked,
                is_public: document.getElementById('eventPublic').checked,
                reminder_enabled: document.getElementById('eventReminder').checked
            };

            const events = app.dataManager.getData('events');

            if (editId) {
                // تعديل حدث موجود
                const eventIndex = events.findIndex(e => e.id === editId);
                if (eventIndex !== -1) {
                    events[eventIndex] = {
                        ...events[eventIndex],
                        ...formData,
                        updated_at: new Date().toISOString().split('T')[0],
                        updated_by: app.userManager.currentUser.first_name + ' ' + app.userManager.currentUser.last_name
                    };
                    app.showToast('تم تحديث الحدث بنجاح!', 'success');
                }
                delete form.dataset.editId;
            } else {
                // إضافة حدث جديد
                const newEvent = {
                    id: 'event_' + Date.now(),
                    ...formData,
                    created_by: app.userManager.currentUser.first_name + ' ' + app.userManager.currentUser.last_name,
                    created_at: new Date().toISOString().split('T')[0],
                    status: 'upcoming',
                    attendees: [],
                    views: 0
                };
                events.push(newEvent);
                app.showToast('تم إضافة الحدث بنجاح!', 'success');
            }

            app.dataManager.setData('events', events);
            hideEventModal();
            app.renderEvents();
        }

        // وظائف إدارة مكتبة الفيديو
        function showVideoUploadModal() {
            if (!app.userManager.currentUser) {
                app.showToast('يجب تسجيل الدخول أولاً لرفع فيديو', 'error');
                return;
            }
            document.getElementById('videoUploadModal').classList.remove('hidden');
        }

        function hideVideoUploadModal() {
            document.getElementById('videoUploadModal').classList.add('hidden');
            document.getElementById('videoUploadForm').reset();
        }

        function handleVideoUpload(event) {
            event.preventDefault();
            
            if (!app.userManager.currentUser) {
                app.showToast('يجب تسجيل الدخول أولاً لرفع فيديو', 'error');
                return;
            }

            const formData = new FormData(event.target);
            const videoFile = formData.get('videoFile');
            
            if (!videoFile || videoFile.size === 0) {
                app.showToast('يرجى اختيار ملف فيديو', 'error');
                return;
            }

            // التحقق من نوع الملف
            const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
            if (!allowedTypes.includes(videoFile.type)) {
                app.showToast('نوع الملف غير مدعوم. يرجى اختيار ملف فيديو صالح', 'error');
                return;
            }

            // التحقق من حجم الملف (حد أقصى 100MB)
            const maxSize = 100 * 1024 * 1024; // 100MB
            if (videoFile.size > maxSize) {
                app.showToast('حجم الملف كبير جداً. الحد الأقصى 100MB', 'error');
                return;
            }

            // محاكاة رفع الفيديو (في التطبيق الحقيقي سيتم رفعه للخادم)
            const videoData = {
                id: 'video_' + Date.now(),
                type: 'video',
                title: document.getElementById('videoTitle').value,
                description: document.getElementById('videoDescription').value,
                category: document.getElementById('videoCategory').value,
                access_level: document.getElementById('videoAccess').value,
                keywords: document.getElementById('videoKeywords').value.split(',').map(k => k.trim()).filter(k => k),
                file_name: videoFile.name,
                file_size: videoFile.size,
                file_type: videoFile.type,
                duration: null, // سيتم حسابها لاحقاً
                thumbnail: null, // سيتم إنشاؤها لاحقاً
                uploaded_by: app.userManager.currentUser.first_name + ' ' + app.userManager.currentUser.last_name,
                uploaded_at: new Date().toISOString().split('T')[0],
                views: 0,
                likes: 0,
                featured: false,
                url: URL.createObjectURL(videoFile) // رابط مؤقت للمعاينة
            };

            const library = app.dataManager.getData('library');
            library.push(videoData);
            app.dataManager.setData('library', library);

            app.showToast('تم رفع الفيديو بنجاح!', 'success');
            hideVideoUploadModal();
            app.renderLibrary('videos');
            
            // تحديث إحصائيات الفيديو
            updateVideoStats();
        }

        function playVideo(videoId) {
            const library = app.dataManager.getData('library');
            const video = library.find(v => v.id === videoId);
            
            if (!video || video.type !== 'video') {
                app.showToast('الفيديو غير موجود', 'error');
                return;
            }

            // زيادة عدد المشاهدات
            video.views = (video.views || 0) + 1;
            app.dataManager.setData('library', library);

            // إنشاء مشغل فيديو منبثق
            const videoPlayer = document.createElement('div');
            videoPlayer.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
            videoPlayer.innerHTML = `
                <div class="relative max-w-4xl w-full mx-4">
                    <button onclick="this.parentElement.parentElement.remove()" class="absolute -top-10 right-0 text-white text-2xl hover:text-red-400">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="bg-white rounded-lg p-4">
                        <h3 class="text-xl font-bold mb-4">${video.title}</h3>
                        ${video.url ? `
                            <video controls class="w-full max-h-96 rounded">
                                <source src="${video.url}" type="${video.file_type}">
                                المتصفح لا يدعم تشغيل الفيديو
                            </video>
                        ` : `
                            <div class="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
                                <div class="text-center">
                                    <i class="fas fa-play-circle text-6xl text-gray-400 mb-4"></i>
                                    <p class="text-gray-600">معاينة الفيديو غير متاحة</p>
                                    <p class="text-sm text-gray-500 mt-2">اسم الملف: ${video.file_name}</p>
                                </div>
                            </div>
                        `}
                        <div class="mt-4 flex justify-between items-center">
                            <div class="text-sm text-gray-600">
                                <span><i class="fas fa-eye ml-1"></i>${video.views}</span>
                                <span class="mr-4"><i class="fas fa-heart ml-1"></i>${video.likes || 0}</span>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="likeVideo('${video.id}')" class="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">
                                    <i class="fas fa-heart ml-1"></i>إعجاب
                                </button>
                                <button onclick="shareVideo('${video.id}')" class="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                                    <i class="fas fa-share ml-1"></i>مشاركة
                                </button>
                            </div>
                        </div>
                        ${video.description ? `<p class="mt-4 text-gray-700">${video.description}</p>` : ''}
                    </div>
                </div>
            `;
            
            document.body.appendChild(videoPlayer);
            
            // إغلاق عند النقر على الخلفية
            videoPlayer.addEventListener('click', (e) => {
                if (e.target === videoPlayer) {
                    videoPlayer.remove();
                }
            });
        }

        function likeVideo(videoId) {
            if (!app.userManager.currentUser) {
                app.showToast('يجب تسجيل الدخول أولاً', 'error');
                return;
            }

            const library = app.dataManager.getData('library');
            const video = library.find(v => v.id === videoId);
            
            if (video) {
                video.likes = (video.likes || 0) + 1;
                app.dataManager.setData('library', library);
                app.showToast('تم إضافة إعجابك!', 'success');
                
                // تحديث العرض
                const likeButton = document.querySelector(`[onclick="likeVideo('${videoId}')"]`);
                if (likeButton) {
                    likeButton.innerHTML = `<i class="fas fa-heart ml-1"></i>${video.likes}`;
                }
            }
        }

        function shareVideo(videoId) {
            const library = app.dataManager.getData('library');
            const video = library.find(v => v.id === videoId);
            
            if (!video) {
                app.showToast('الفيديو غير موجود', 'error');
                return;
            }

            const shareText = `🎥 ${video.title}\n👤 رفع بواسطة: ${video.uploaded_by}\n📅 ${video.uploaded_at}\n\n${video.description || ''}`;
            
            if (navigator.share) {
                navigator.share({
                    title: video.title,
                    text: shareText,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(shareText).then(() => {
                    app.showToast('تم نسخ معلومات الفيديو', 'success');
                });
            }
        }

        function formatDuration(seconds) {
            if (!seconds) return '';
            
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        function updateVideoStats() {
            if (!app || !app.dataManager) return; // التحقق من وجود التطبيق أولاً
            
            const library = app.dataManager.getData('library');
            const videos = library.filter(item => item.type === 'video');
            
            const stats = {
                total: videos.length,
                totalViews: videos.reduce((sum, v) => sum + (v.views || 0), 0),
                totalLikes: videos.reduce((sum, v) => sum + (v.likes || 0), 0),
                totalSize: videos.reduce((sum, v) => sum + (v.file_size || 0), 0)
            };

            // تحديث إحصائيات في واجهة المكتبة
            const videoStatsContainer = document.getElementById('video-stats');
            if (videoStatsContainer) {
                videoStatsContainer.innerHTML = `
                    <div class="grid grid-cols-4 gap-4 mb-6">
                        <div class="text-center p-4 bg-white bg-opacity-20 rounded-lg">
                            <div class="text-2xl font-bold text-white">${stats.total}</div>
                            <div class="text-sm text-white opacity-80">مقاطع فيديو</div>
                        </div>
                        <div class="text-center p-4 bg-white bg-opacity-20 rounded-lg">
                            <div class="text-2xl font-bold text-white">${stats.totalViews}</div>
                            <div class="text-sm text-white opacity-80">مشاهدة</div>
                        </div>
                        <div class="text-center p-4 bg-white bg-opacity-20 rounded-lg">
                            <div class="text-2xl font-bold text-white">${stats.totalLikes}</div>
                            <div class="text-sm text-white opacity-80">إعجاب</div>
                        </div>
                        <div class="text-center p-4 bg-white bg-opacity-20 rounded-lg">
                            <div class="text-2xl font-bold text-white">${(stats.totalSize / 1024 / 1024).toFixed(1)}MB</div>
                            <div class="text-sm text-white opacity-80">حجم المحتوى</div>
                        </div>
                    </div>
                `;
            }
        }

        // وظائف إدارة الاقتراحات
        function showSuggestionModal() {
            document.getElementById('suggestionModal').classList.remove('hidden');
            document.getElementById('suggestionTitle').focus();
        }

        function hideSuggestionModal() {
            document.getElementById('suggestionModal').classList.add('hidden');
            document.getElementById('suggestionForm').reset();
        }

        // وظائف إدارة المكتبة العامة
        function showLibraryModal() {
            if (!app.userManager.currentUser) {
                app.showToast('يجب تسجيل الدخول أولاً لإضافة محتوى', 'error');
                return;
            }
            document.getElementById('libraryModal').classList.remove('hidden');
        }

        function hideLibraryModal() {
            document.getElementById('libraryModal').classList.add('hidden');
            document.getElementById('libraryForm').reset();
        }

        function filterLibraryByType(type) {
            app.renderLibrary(type);
            
            // تحديث الأزرار النشطة
            document.querySelectorAll('[data-filter]').forEach(btn => {
                btn.classList.remove('bg-white', 'text-blue-600');
                btn.classList.add('bg-white', 'bg-opacity-20', 'text-white');
            });
            
            const activeBtn = document.querySelector(`[data-filter="${type}"]`);
            if (activeBtn) {
                activeBtn.classList.remove('bg-opacity-20', 'text-white');
                activeBtn.classList.add('bg-white', 'text-blue-600');
            }
        }

        function resetSuggestionForm() {
            document.getElementById('suggestionForm').reset();
            document.getElementById('suggestionTitle').focus();
        }

        function handleSuggestionSubmit(event) {
            event.preventDefault();
            
            if (!app.userManager.currentUser) {
                app.showToast('يجب تسجيل الدخول أولاً لإضافة اقتراح', 'error');
                return;
            }

            const formData = {
                title: document.getElementById('suggestionTitle').value,
                category: document.getElementById('suggestionCategory').value,
                priority: document.getElementById('suggestionPriority').value,
                description: document.getElementById('suggestionDescription').value,
                benefits: document.getElementById('suggestionBenefits').value,
                budget: document.getElementById('suggestionBudget').value,
                timeline: document.getElementById('suggestionTimeline').value,
                resources: document.getElementById('suggestionResources').value
            };

            const suggestion = {
                id: 'sugg_' + Date.now(),
                ...formData,
                status: 'pending',
                submitted_by: app.userManager.currentUser.first_name + ' ' + app.userManager.currentUser.last_name,
                submitted_date: new Date().toISOString().split('T')[0],
                votes: { up: 0, down: 0 },
                comments: []
            };

            const suggestions = app.dataManager.getData('suggestions');
            suggestions.push(suggestion);
            app.dataManager.setData('suggestions', suggestions);
            
            app.showToast('تم إرسال الاقتراح بنجاح!', 'success');
            hideSuggestionModal();
            app.renderSuggestions();
            app.updateStats();
        }

        // وظائف إدارة المكتبة الرقمية
        function showLibraryModal() {
            document.getElementById('libraryModal').classList.remove('hidden');
            document.getElementById('libraryTitle').focus();
        }

        function hideLibraryModal() {
            document.getElementById('libraryModal').classList.add('hidden');
            document.getElementById('libraryForm').reset();
        }

        function resetLibraryForm() {
            document.getElementById('libraryForm').reset();
            document.getElementById('libraryTitle').focus();
        }

        function handleLibrarySubmit(event) {
            event.preventDefault();
            
            if (!app.userManager.currentUser) {
                app.showToast('يجب تسجيل الدخول أولاً لإضافة محتوى للمكتبة', 'error');
                return;
            }

            const formData = {
                title: document.getElementById('libraryTitle').value,
                type: document.getElementById('libraryType').value,
                category: document.getElementById('libraryCategory').value,
                author: document.getElementById('libraryAuthor').value || (app.userManager.currentUser.first_name + ' ' + app.userManager.currentUser.last_name),
                description: document.getElementById('libraryDescription').value,
                keywords: document.getElementById('libraryKeywords').value.split(',').map(k => k.trim()).filter(k => k),
                created_date: document.getElementById('libraryDate').value || new Date().toISOString().split('T')[0],
                language: document.getElementById('libraryLanguage').value,
                url: document.getElementById('libraryUrl').value,
                access_level: document.getElementById('libraryAccess').value,
                featured: document.getElementById('libraryFeatured').checked
            };

            const libraryItem = {
                id: 'lib_' + Date.now(),
                ...formData,
                views: 0,
                downloads: 0,
                added_by: app.userManager.currentUser.email,
                added_date: new Date().toISOString().split('T')[0]
            };

            const library = app.dataManager.getData('library');
            library.push(libraryItem);
            app.dataManager.setData('library', library);
            
            app.showToast('تم إضافة المحتوى للمكتبة بنجاح!', 'success');
            hideLibraryModal();
            app.renderLibrary();
            app.updateStats();
        }

        // وظائف التفاعل مع الاقتراحات
        function voteSuggestion(suggestionId, voteType) {
            if (!app.userManager.currentUser) {
                app.showToast('يجب تسجيل الدخول للتصويت', 'error');
                return;
            }

            const suggestions = app.dataManager.getData('suggestions');
            const suggestion = suggestions.find(s => s.id === suggestionId);
            
            if (suggestion) {
                if (voteType === 'up') {
                    suggestion.votes.up++;
                    app.showToast('تم تسجيل صوتك مع الاقتراح', 'success');
                } else {
                    suggestion.votes.down++;
                    app.showToast('تم تسجيل صوتك ضد الاقتراح', 'warning');
                }
                
                app.dataManager.setData('suggestions', suggestions);
                app.renderSuggestions();
            }
        }

        function updateSuggestionStatus(suggestionId, newStatus) {
            if (!app.userManager.currentUser || app.userManager.currentUser.role !== 'admin') {
                app.showToast('غير مخول لتحديث حالة الاقتراحات', 'error');
                return;
            }

            const suggestions = app.dataManager.getData('suggestions');
            const suggestion = suggestions.find(s => s.id === suggestionId);
            
            if (suggestion) {
                suggestion.status = newStatus;
                app.dataManager.setData('suggestions', suggestions);
                app.renderSuggestions();
                app.showToast(`تم تحديث حالة الاقتراح إلى: ${newStatus}`, 'success');
            }
        }

        // وظائف التفاعل مع المكتبة الرقمية
        function openLibraryItem(itemId) {
            const library = app.dataManager.getData('library');
            const item = library.find(i => i.id === itemId);
            
            if (!item) return;

            // تسجيل المشاهدة
            item.views = (item.views || 0) + 1;
            app.dataManager.setData('library', library);
            
            if (item.url && item.url !== '#') {
                window.open(item.url, '_blank');
                app.showToast(`تم فتح: ${item.title}`, 'success');
                app.renderLibrary();
            } else {
                app.showToast('الرابط غير متوفر حالياً', 'warning');
            }
        }

        function downloadLibraryItem(itemId) {
            const library = app.dataManager.getData('library');
            const item = library.find(i => i.id === itemId);
            
            if (!item) return;

            // التحقق من صلاحية الوصول
            if (!app.checkLibraryAccess(item)) {
                app.showToast('ليس لديك صلاحية للوصول لهذا المحتوى', 'error');
                return;
            }

            // تسجيل التحميل
            item.downloads = (item.downloads || 0) + 1;
            app.dataManager.setData('library', library);
            
            if (item.url && item.url !== '#') {
                // محاولة تحميل الملف
                const link = document.createElement('a');
                link.href = item.url;
                link.download = item.title;
                link.click();
                
                app.showToast(`تم بدء تحميل: ${item.title}`, 'success');
                app.renderLibrary();
            } else {
                app.showToast('ملف التحميل غير متوفر حالياً', 'warning');
            }
        }

        // وظائف مكتبة الفيديو
        function showVideoUploadModal() {
            if (!app.userManager.currentUser) {
                app.showToast('يجب تسجيل الدخول أولاً لرفع الفيديوهات', 'error');
                return;
            }
            
            document.getElementById('videoUploadModal').classList.remove('hidden');
            document.getElementById('videoTitle').focus();
            
            // تعيين التاريخ الحالي كافتراضي
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('videoDate').value = today;
        }

        function hideVideoUploadModal() {
            document.getElementById('videoUploadModal').classList.add('hidden');
            document.getElementById('videoUploadForm').reset();
            
            // إخفاء معاينة الفيديو
            document.getElementById('videoPreview').classList.add('hidden');
        }

        function resetVideoForm() {
            document.getElementById('videoUploadForm').reset();
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('videoDate').value = today;
            document.getElementById('videoPreview').classList.add('hidden');
            document.getElementById('videoTitle').focus();
        }

        function handleVideoFileSelect(input) {
            const file = input.files[0];
            if (!file) return;

            // التحقق من نوع الملف
            if (!file.type.startsWith('video/')) {
                app.showToast('يرجى اختيار ملف فيديو صحيح', 'error');
                return;
            }

            // التحقق من حجم الملف (100MB)
            const maxSize = 100 * 1024 * 1024;
            if (file.size > maxSize) {
                app.showToast('حجم الملف كبير جداً. الحد الأقصى 100MB', 'error');
                return;
            }

            // عرض معاينة الفيديو
            const videoPreview = document.getElementById('videoPreview');
            const previewVideo = document.getElementById('previewVideo');
            const videoSource = document.getElementById('videoSource');
            const fileName = document.getElementById('videoFileName');

            const fileURL = URL.createObjectURL(file);
            videoSource.src = fileURL;
            previewVideo.load();
            fileName.textContent = `الملف: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            
            videoPreview.classList.remove('hidden');
        }

        function handleVideoUpload(event) {
            event.preventDefault();
            
            const fileInput = document.getElementById('videoFile');
            const file = fileInput.files[0];
            
            if (!file) {
                app.showToast('يرجى اختيار ملف فيديو أولاً', 'error');
                return;
            }

            const formData = {
                title: document.getElementById('videoTitle').value,
                date: document.getElementById('videoDate').value,
                description: document.getElementById('videoDescription').value,
                category: document.getElementById('videoCategory').value,
                privacy: document.getElementById('videoPrivacy').value,
                tags: document.getElementById('videoTags').value,
                featured: document.getElementById('videoFeatured').checked
            };

            // محاكاة رفع الفيديو (في التطبيق الحقيقي سيتم رفعه لخدمة سحابية)
            const videoItem = {
                id: 'video_' + Date.now(),
                type: 'video',
                ...formData,
                file_name: file.name,
                file_size: file.size,
                file_type: file.type,
                url: URL.createObjectURL(file), // مؤقت - في الإنتاج سيكون رابط السحابة
                thumbnail: '', // سيتم إنشاؤه تلقائياً
                duration: 0, // سيتم حسابه
                views: 0,
                likes: 0,
                uploaded_by: app.userManager.currentUser.first_name + ' ' + app.userManager.currentUser.last_name,
                uploaded_at: new Date().toISOString().split('T')[0],
                status: 'active'
            };

            // إضافة الفيديو للمكتبة
            const library = app.dataManager.getData('library');
            library.push(videoItem);
            app.dataManager.setData('library', library);
            
            app.showToast('تم رفع الفيديو بنجاح!', 'success');
            hideVideoUploadModal();
            app.renderLibrary();
            
            // تحديث إحصائيات الفيديو
            updateVideoStats();
        }

        function switchLibraryTab(tab) {
            // إزالة التأكيد من جميع التابات
            document.querySelectorAll('.library-tab').forEach(btn => {
                btn.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600');
                btn.classList.add('text-gray-600');
            });
            
            // تأكيد التاب الحالي
            const activeTab = document.getElementById(`tab-${tab}`);
            activeTab.classList.remove('text-gray-600');
            activeTab.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
            
            // عرض المحتوى المناسب
            app.renderLibrary(tab);
        }

        function updateVideoStats() {
            if (!app || !app.dataManager) return; // التحقق من وجود التطبيق أولاً
            
            const library = app.dataManager.getData('library');
            const videos = library.filter(item => item.type === 'video');
            
            const totalVideos = videos.length;
            const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
            const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
            const recentUploads = videos.filter(video => video.uploaded_at?.startsWith(thisMonth)).length;
            const featuredVideos = videos.filter(video => video.featured).length;
            
            document.getElementById('total-videos').textContent = totalVideos;
            document.getElementById('total-views').textContent = totalViews;
            document.getElementById('recent-uploads').textContent = recentUploads;
            document.getElementById('featured-videos').textContent = featuredVideos;
        }

        function playVideo(videoId) {
            const library = app.dataManager.getData('library');
            const video = library.find(item => item.id === videoId && item.type === 'video');
            
            if (!video) return;
            
            // تسجيل المشاهدة
            video.views = (video.views || 0) + 1;
            app.dataManager.setData('library', library);
            
            // فتح مشغل الفيديو (مودال)
            showVideoPlayer(video);
            
            // تحديث الإحصائيات
            updateVideoStats();
        }

        function showVideoPlayer(video) {
            // إنشاء مودال مشغل الفيديو
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                    <div class="flex justify-between items-center p-4 border-b border-gray-200">
                        <h3 class="text-xl font-bold text-gray-800">${video.title}</h3>
                        <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="p-4">
                        <video controls class="w-full rounded-lg mb-4" autoplay>
                            <source src="${video.url}" type="${video.file_type}">
                            متصفحك لا يدعم تشغيل الفيديو.
                        </video>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div><strong>التاريخ:</strong> ${video.date}</div>
                            <div><strong>المشاهدات:</strong> ${video.views}</div>
                            <div><strong>الفئة:</strong> ${getVideoCategoryText(video.category)}</div>
                            <div><strong>رفع بواسطة:</strong> ${video.uploaded_by}</div>
                        </div>
                        ${video.description ? `<div class="mt-4"><strong>الوصف:</strong><p class="text-gray-700 mt-2">${video.description}</p></div>` : ''}
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // إغلاق عند النقر خارج المودال
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }

        function getVideoCategoryText(category) {
            const categories = {
                'family_gathering': 'تجمع عائلي',
                'wedding': 'زفاف',
                'celebration': 'احتفال',
                'graduation': 'تخرج',
                'birthday': 'عيد ميلاد',
                'religious': 'مناسبة دينية',
                'travel': 'سفر ورحلات',
                'other': 'أخرى'
            };
            return categories[category] || category;
        }

        function formatDuration(seconds) {
            if (!seconds) return '';
            
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            
            if (minutes < 60) {
                return `${minutes}:${secs.toString().padStart(2, '0')}`;
            } else {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
        }

        function searchLibrary(query) {
            const library = app.dataManager.getData('library');
            const container = document.getElementById('library-grid');
            
            if (!query.trim()) {
                app.renderLibrary();
                return;
            }

            const filteredLibrary = library.filter(item => 
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase()) ||
                item.author.toLowerCase().includes(query.toLowerCase()) ||
                (item.keywords && item.keywords.some(keyword => 
                    keyword.toLowerCase().includes(query.toLowerCase())
                ))
            );

            if (filteredLibrary.length === 0) {
                container.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <div class="text-6xl text-white mb-4 opacity-50">
                            <i class="fas fa-search"></i>
                        </div>
                        <p class="text-white text-xl mb-4">لم يتم العثور على نتائج للبحث: "${query}"</p>
                        <button onclick="app.renderLibrary()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                            عرض جميع المحتويات
                        </button>
                    </div>
                `;
            } else {
                container.innerHTML = filteredLibrary.map(item => app.renderLibraryCard(item)).join('');
            }
        }

        function filterLibraryByCategory(category) {
            const library = app.dataManager.getData('library');
            const container = document.getElementById('library-grid');
            
            if (!category || category === 'all') {
                app.renderLibrary();
                return;
            }

            const filteredLibrary = library.filter(item => item.category === category);
            container.innerHTML = filteredLibrary.map(item => app.renderLibraryCard(item)).join('');
        }

        // وظائف فلترة الاقتراحات
        function filterSuggestionsByStatus(status) {
            const suggestions = app.dataManager.getData('suggestions');
            const container = document.getElementById('suggestions-grid');
            
            if (!status || status === 'all') {
                app.renderSuggestions();
                return;
            }

            const filteredSuggestions = suggestions.filter(item => item.status === status);
            container.innerHTML = filteredSuggestions.map(item => app.renderSuggestionCard(item)).join('');
        }

        function filterSuggestionsByCategory(category) {
            const suggestions = app.dataManager.getData('suggestions');
            const container = document.getElementById('suggestions-grid');
            
            if (!category || category === 'all') {
                app.renderSuggestions();
                return;
            }

            const filteredSuggestions = suggestions.filter(item => item.category === category);
            container.innerHTML = filteredSuggestions.map(item => app.renderSuggestionCard(item)).join('');
        }

        function filterSuggestionsByPriority(priority) {
            const suggestions = app.dataManager.getData('suggestions');
            const container = document.getElementById('suggestions-grid');
            
            if (!priority || priority === 'all') {
                app.renderSuggestions();
                return;
            }

            const filteredSuggestions = suggestions.filter(item => item.priority === priority);
            container.innerHTML = filteredSuggestions.map(item => app.renderSuggestionCard(item)).join('');
        }

        // وظائف المصادقة والتسجيل
        function showLoginModal() {
            console.log('🔍 محاولة فتح نموذج الدخول...');
            
            // منع أي event listeners من التدخل مؤقتاً (إذا كان هناك event)
            if (typeof event !== 'undefined' && event.stopPropagation) {
                event.stopPropagation();
            }
            
            // إغلاق جميع النماذج الأخرى أولاً
            hideAllModals();
            
            const modal = document.getElementById('loginModal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.style.display = 'flex';
                
                setTimeout(() => {
                    document.getElementById('loginIdentifier').focus();
                }, 100);
                console.log('✅ تم عرض نموذج تسجيل الدخول بنجاح');
            }
        }

        function showRegisterModal() {
            console.log('🔍 محاولة فتح نموذج التسجيل...');
            
            // منع أي event listeners من التدخل مؤقتاً
            if (typeof event !== 'undefined' && event.stopPropagation) {
                event.stopPropagation();
            }
            
            // إغلاق جميع النماذج الأخرى أولاً
            hideAllModals();
            
            const modal = document.getElementById('registerModal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.style.display = 'flex';
                
                setTimeout(() => {
                    document.getElementById('registerFirstName').focus();
                }, 100);
                console.log('✅ تم عرض نموذج التسجيل بنجاح');
            }
        }

        // إغلاق جميع النماذج المنبثقة
        function hideAllModals() {
            const modals = ['loginModal', 'registerModal', 'familyModal', 'eventModal', 'suggestionModal', 'videoUploadModal'];
            modals.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (modal && !modal.classList.contains('hidden')) {
                    modal.classList.add('hidden');
                    modal.style.display = 'none';
                }
            });
        }

        function hideLoginModal() {
            console.log('🚪 إخفاء نموذج تسجيل الدخول...');
            const modal = document.getElementById('loginModal');
            const form = document.getElementById('loginForm');
            
            if (modal) {
                // إزالة النموذج فوراً
                modal.classList.add('hidden');
                modal.style.display = 'none'; // إضافة حماية إضافية
                
                // إعادة تعيين النموذج
                if (form) {
                    form.reset();
                }
                
                console.log('✅ تم إخفاء نموذج تسجيل الدخول بنجاح');
            } else {
                console.error('❌ لم يتم العثور على نموذج تسجيل الدخول');
            }
        }

        // تشخيص شامل للمشكلة
        function diagnoseModalProblem() {
            console.log('🔍 بدء التشخيص الشامل...');
            
            const modal = document.getElementById('registerModal');
            if (!modal) {
                console.error('❌ النموذج غير موجود!');
                return;
            }
            
            console.log('📊 حالة النموذج الحالية:');
            console.log('   - classList:', modal.classList.toString());
            console.log('   - style.display:', modal.style.display);
            console.log('   - style.visibility:', modal.style.visibility);
            console.log('   - offsetWidth:', modal.offsetWidth);
            console.log('   - offsetHeight:', modal.offsetHeight);
            
            // تسجيل جميع event listeners
            console.log('📋 فحص Event Listeners...');
            
            // محاولة فتح بدون أي event listeners
            console.log('🚀 محاولة فتح النموذج...');
            
            // إزالة جميع classes
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal';
            
            // تعيين مباشر للـ styles
            modal.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                background: rgba(0, 0, 0, 0.5) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 9999 !important;
                visibility: visible !important;
                opacity: 1 !important;
            `;
            
            // مراقبة تغييرات النموذج
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes') {
                        console.log('🔄 تغيير مكتشف:', mutation.attributeName, '→', mutation.target[mutation.attributeName]);
                        
                        // منع أي تغيير يخفي النموذج
                        if (mutation.attributeName === 'class' && modal.classList.contains('hidden')) {
                            console.warn('⚠️ محاولة إخفاء بـ hidden class - منع!');
                            modal.classList.remove('hidden');
                        }
                        
                        if (mutation.attributeName === 'style' && modal.style.display === 'none') {
                            console.warn('⚠️ محاولة إخفاء بـ display none - منع!');
                            modal.style.display = 'flex';
                        }
                    }
                });
            });
            
            observer.observe(modal, {
                attributes: true,
                attributeOldValue: true
            });
            
            // إيقاف المراقب بعد 10 ثوان
            setTimeout(() => {
                observer.disconnect();
                console.log('🔚 انتهت المراقبة');
            }, 10000);
            
            console.log('✅ تم فتح النموذج مع المراقبة النشطة');
        }

        // دالة قوية بديلة لفتح نموذج التسجيل
        function forceShowRegisterModal() {
            // استدعاء التشخيص الشامل
            diagnoseModalProblem();
        }
        
        // إنشاء نموذج اختبار بسيط
        function createTestModal() {
            console.log('🧪 إنشاء نموذج اختبار بسيط...');
            
            // إزالة أي نموذج اختبار سابق
            const existingTest = document.getElementById('testModal');
            if (existingTest) {
                existingTest.remove();
            }
            
            // إنشاء نموذج جديد
            const testModal = document.createElement('div');
            testModal.id = 'testModal';
            testModal.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 99999;
                ">
                    <div style="
                        background: white;
                        padding: 40px;
                        border-radius: 10px;
                        max-width: 500px;
                        width: 90%;
                        text-align: center;
                    ">
                        <h2 style="color: #333; margin-bottom: 20px;">نموذج اختبار بسيط</h2>
                        <p style="margin-bottom: 20px;">هذا نموذج اختبار لا يستخدم أي JavaScript معقد</p>
                        <input type="text" placeholder="اختبار النص" style="
                            width: 100%;
                            padding: 10px;
                            margin: 10px 0;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                        ">
                        <br>
                        <button onclick="closeTestModal()" style="
                            background: #ef4444;
                            color: white;
                            padding: 10px 20px;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            margin: 10px;
                        ">إغلاق</button>
                        <button onclick="alert('النموذج يعمل!')" style="
                            background: #10b981;
                            color: white;
                            padding: 10px 20px;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            margin: 10px;
                        ">اختبار</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(testModal);
            console.log('✅ تم إنشاء نموذج اختبار بسيط');
        }
        
        function closeTestModal() {
            const testModal = document.getElementById('testModal');
            if (testModal) {
                testModal.remove();
                console.log('✅ تم إغلاق نموذج الاختبار');
            }
        }

        function showRegisterModal() {
            console.log('🔍 بدء تشخيص مشكلة النموذج...');
            console.trace('📍 استدعاء الدالة من:');
            
            try {
                // تسجيل حالة Event
                if (typeof event !== 'undefined') {
                    console.log('📱 Event متوفر:', event.type, event.target);
                    event.stopPropagation();
                    event.preventDefault();
                } else {
                    console.log('📱 لا يوجد Event');
                }
                
                const modal = document.getElementById('registerModal');
                if (!modal) {
                    console.error('❌ لم يتم العثور على registerModal');
                    alert('خطأ: نموذج التسجيل غير موجود');
                    return;
                }
                
                console.log('📊 حالة النموذج قبل الفتح:');
                console.log('   - classList:', modal.classList.toString());
                console.log('   - display:', modal.style.display);
                console.log('   - visibility:', modal.style.visibility);
                console.log('   - opacity:', modal.style.opacity);
                
                // محاولة الفتح مع تسجيل كل خطوة
                console.log('🔓 إزالة hidden...');
                modal.classList.remove('hidden');
                console.log('   ✓ بعد إزالة hidden:', modal.classList.toString());
                
                console.log('👁️ تعيين display...');
                modal.style.display = 'flex';
                console.log('   ✓ بعد تعيين display:', modal.style.display);
                
                console.log('📊 حالة النموذج بعد الفتح:');
                console.log('   - classList:', modal.classList.toString());
                console.log('   - display:', modal.style.display);
                console.log('   - offsetWidth:', modal.offsetWidth);
                console.log('   - offsetHeight:', modal.offsetHeight);
                
                // فحص سريع بعد 1ms
                setTimeout(() => {
                    console.log('🚨 فحص فوري (1ms):');
                    console.log('   - classList:', modal.classList.toString());
                    console.log('   - display:', modal.style.display);
                    console.log('   - مرئي؟:', modal.offsetWidth > 0);
                }, 1);
                
                // فحص بعد 10ms
                setTimeout(() => {
                    console.log('🚨 فحص سريع (10ms):');
                    console.log('   - classList:', modal.classList.toString());
                    console.log('   - display:', modal.style.display);
                    console.log('   - مرئي؟:', modal.offsetWidth > 0);
                    
                    if (modal.classList.contains('hidden') || modal.style.display === 'none') {
                        console.error('❌ النموذج اختفى في 10ms!');
                        // محاولة إعادة الفتح
                        modal.classList.remove('hidden');
                        modal.style.display = 'flex';
                    }
                }, 10);
                
                // فحص بعد 50ms
                setTimeout(() => {
                    console.log('🚨 فحص متوسط (50ms):');
                    console.log('   - classList:', modal.classList.toString());
                    console.log('   - display:', modal.style.display);
                    console.log('   - مرئي؟:', modal.offsetWidth > 0);
                    
                    if (modal.classList.contains('hidden') || modal.style.display === 'none') {
                        console.error('❌ النموذج اختفى في 50ms!');
                    }
                }, 50);
                
                console.log('✅ انتهت محاولة فتح النموذج');
                
            } catch (error) {
                console.error('❌ خطأ في فتح نموذج التسجيل:', error);
                console.error('Stack:', error.stack);
            }
        }

        function hideRegisterModal() {
            console.log('🚪 إخفاء نموذج التسجيل...');
            const modal = document.getElementById('registerModal');
            const form = document.getElementById('registerForm');
            
            if (modal) {
                // إزالة النموذج فوراً
                modal.classList.add('hidden');
                modal.style.display = 'none'; // إضافة حماية إضافية
                
                // إعادة تعيين النموذج
                if (form) {
                    form.reset();
                    updateRegisterFullNamePreview();
                }
                
                console.log('✅ تم إخفاء نموذج التسجيل بنجاح');
            } else {
                console.error('❌ لم يتم العثور على نموذج التسجيل');
            }
        }

        function resetRegisterForm() {
            if (confirm('هل أنت متأكد من إعادة تعيين جميع البيانات؟')) {
                document.getElementById('registerForm').reset();
                updateRegisterFullNamePreview();
                app?.showToast('تم إعادة تعيين النموذج', 'warning');
            }
        }

        // تحديث معاينة الاسم في نموذج التسجيل
        function updateRegisterFullNamePreview() {
            const firstName = document.getElementById('registerFirstName')?.value.trim() || '';
            const middleName = document.getElementById('registerMiddleName')?.value.trim() || '';
            const lastName = document.getElementById('registerLastName')?.value.trim() || '';
            
            let fullName = firstName;
            if (middleName) fullName += ` ${middleName}`;
            if (lastName) fullName += ` ${lastName}`;
            
            const preview = document.getElementById('registerFullNamePreview');
            if (preview) {
                preview.textContent = fullName || 'سيتم تكوين الاسم تلقائياً...';
            }
        }

        // وظائف الإدارة
        function approveUser(userId) {
            if (!app || !app.userManager.currentUser || app.userManager.currentUser.role !== 'admin') {
                alert('ليس لديك صلاحية لهذا الإجراء');
                return;
            }

            if (confirm('هل أنت متأكد من الموافقة على هذا المستخدم؟')) {
                try {
                    app.userManager.approveUser(userId, app.userManager.currentUser.id);
                    app.displayAdminPanel();
                    app.showToast('تم تفعيل المستخدم بنجاح', 'success');
                } catch (error) {
                    app.showToast('حدث خطأ: ' + error.message, 'error');
                }
            }
        }

        function rejectUser(userId) {
            if (!app || !app.userManager.currentUser || app.userManager.currentUser.role !== 'admin') {
                alert('ليس لديك صلاحية لهذا الإجراء');
                return;
            }

            if (confirm('هل أنت متأكد من رفض هذا المستخدم؟ سيتم حذف طلبه نهائياً.')) {
                try {
                    app.userManager.rejectUser(userId, app.userManager.currentUser.id);
                    app.displayAdminPanel();
                    app.showToast('تم رفض طلب التسجيل', 'warning');
                } catch (error) {
                    app.showToast('حدث خطأ: ' + error.message, 'error');
                }
            }
        }

        function refreshPendingUsers() {
            if (app) {
                app.displayAdminPanel();
                app.showToast('تم تحديث قائمة الطلبات', 'success');
            }
        }

        function editProfile() {
            if (app && app.userManager.currentUser) {
                // يمكن إضافة نموذج تعديل منفصل لاحقاً
                app.showToast('ميزة تعديل الملف الشخصي ستكون متاحة قريباً', 'warning');
            }
        }

        function logout() {
            if (app && confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                app.userManager.logout();
                app.updateAuthUI();
                showSection('home');
                app.showToast('تم تسجيل الخروج بنجاح', 'success');
            }
        }

        // دالة لإعادة تعيين المدير الافتراضي (للاستخدام في الكونسول)
        function resetDefaultAdmin() {
            if (app && app.userManager) {
                const admin = app.userManager.resetDefaultAdmin();
                console.log('تم إعادة تعيين المدير الافتراضي');
                app.showToast('تم إعادة تعيين المدير الافتراضي بنجاح', 'success');
                return admin;
            }
        }

        // دالة لعرض جميع المستخدمين (للتشخيص)
        function showAllUsers() {
            if (app && app.userManager) {
                console.log('📋 جميع المستخدمين:');
                app.userManager.users.forEach(u => {
                    console.log(`- ${u.full_name} (${u.email}) - ${u.role} - ${u.status}`);
                });
                return app.userManager.users;
            }
        }

        // وظيفة اختبار استرجاع بيانات الجيل الثاني
        function testSecondGenerationRetrieval() {
            if (!app) {
                alert('التطبيق غير مهيأ بعد');
                return;
            }

            try {
                console.log('🧪 اختبار استرجاع بيانات الجيل الثاني...');
                
                const allMembers = app.dataManager.getData('familyMembers');
                const firstGeneration = allMembers.filter(m => m.generation === 1);
                const secondGeneration = allMembers.filter(m => m.generation === 2);
                const thirdGeneration = allMembers.filter(m => m.generation === 3);

                let testResults = `🔍 نتائج اختبار استرجاع البيانات:\n\n`;
                testResults += `📊 إجمالي الأعضاء: ${allMembers.length}\n`;
                testResults += `👑 الجيل الأول (المؤسسين): ${firstGeneration.length}\n`;
                testResults += `👥 الجيل الثاني: ${secondGeneration.length}\n`;
                testResults += `👶 الجيل الثالث: ${thirdGeneration.length}\n\n`;

                if (secondGeneration.length > 0) {
                    testResults += `✅ تم العثور على الجيل الثاني بنجاح:\n`;
                    secondGeneration.forEach((member, index) => {
                        const father = allMembers.find(m => m.id === member.father_id);
                        testResults += `${index + 1}. ${member.full_name}\n`;
                        testResults += `   - الجيل: ${member.generation}\n`;
                        testResults += `   - الوالد: ${father ? father.full_name : 'غير محدد'}\n`;
                        testResults += `   - العضوية: ${app.getMembershipTypeText(member.membership_type)}\n\n`;
                    });
                    
                    // اختبار الروابط العائلية
                    testResults += `🔗 اختبار الروابط العائلية:\n`;
                    firstGeneration.forEach(founder => {
                        const children = allMembers.filter(m => m.father_id === founder.id);
                        testResults += `- ${founder.full_name}: ${children.length} من الأطفال\n`;
                    });

                    app.showToast('✅ اختبار الجيل الثاني نجح! راجع وحدة التحكم للتفاصيل.', 'success');
                } else {
                    testResults += `❌ لم يتم العثور على أعضاء في الجيل الثاني\n`;
                    testResults += `💡 تأكد من تحميل البيانات الأساسية أولاً`;
                    
                    app.showToast('⚠️ لم يتم العثور على الجيل الثاني. حمّل البيانات الأساسية أولاً.', 'warning');
                }

                console.log(testResults);
                alert(testResults);

            } catch (error) {
                const errorMsg = `❌ خطأ في اختبار استرجاع البيانات: ${error.message}`;
                console.error(errorMsg);
                app.showToast(errorMsg, 'error');
            }
        }

        // تعطيل مؤقت لمستمعي الإغلاق للاختبار
        console.log('⚠️ تم تعطيل event listeners للاختبار');
        
        // رمز مؤقت للاختبار - سيتم تفعيل المستمعي لاحقاً
        /*
        setTimeout(() => {
            console.log('🔧 تفعيل مستمعي إغلاق النماذج بعد التأخير');
            
            document.addEventListener('click', function(e) {
                console.log('🔍 نقرة مكتشفة على:', e.target.id, 'الكلاسات:', e.target.className);
                
                // تأخير إضافي قصير قبل معالجة الإغلاق
                setTimeout(() => {
                    // التأكد من النقر المباشر على النموذج (الخلفية) وليس على المحتوى
                    if (e.target.id === 'familyModal') {
                        console.log('🚪 إغلاق نموذج العائلة');
                        hideFamilyModal();
                    }
                    if (e.target.id === 'loginModal') {
                        console.log('🚪 إغلاق نموذج الدخول');
                        hideLoginModal();
                    }
                    if (e.target.id === 'registerModal') {
                        console.log('🚪 إغلاق نموذج التسجيل');
                        hideRegisterModal();
                    }
                }, 50); // تأخير 50ms لضمان عدم التداخل
            });
        }, 1000); // تأخير ثانية واحدة لتفعيل المستمعي
        */
    