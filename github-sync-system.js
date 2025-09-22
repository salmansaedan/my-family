// نظام التزامن المركزي باستخدام GitHub كقاعدة بيانات
class GitHubSyncManager {
    constructor() {
        this.owner = 'salmansaedan';
        this.repo = 'my-family';
        this.dataPath = 'family-data.json';
        this.apiBase = 'https://api.github.com';
        
        // Fallback to localStorage if GitHub fails
        this.localStorageKey = 'saedan_family_data_enhanced';
        
        this.isOnline = navigator.onLine;
        this.syncInProgress = false;
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncWithGitHub();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }
    
    // قراءة البيانات من GitHub
    async loadFromGitHub() {
        try {
            console.log('Loading data from GitHub...');
            
            const url = `${this.apiBase}/repos/${this.owner}/${this.repo}/contents/${this.dataPath}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const fileData = await response.json();
                const content = JSON.parse(atob(fileData.content));
                
                console.log('Data loaded from GitHub successfully:', content);
                
                // حفظ في localStorage كنسخة احتياطية
                localStorage.setItem(this.localStorageKey, JSON.stringify(content));
                
                return content;
            } else if (response.status === 404) {
                // الملف غير موجود - إنشاء ملف جديد
                console.log('Data file not found, creating new one...');
                const defaultData = this.getDefaultData();
                await this.saveToGitHub(defaultData, 'إنشاء ملف البيانات الأولي');
                return defaultData;
            } else {
                throw new Error(`GitHub API error: ${response.status}`);
            }
        } catch (error) {
            console.error('Error loading from GitHub:', error);
            
            // Fallback to localStorage
            const localData = localStorage.getItem(this.localStorageKey);
            if (localData) {
                console.log('Using local data as fallback');
                return JSON.parse(localData);
            }
            
            // Last resort: default data
            return this.getDefaultData();
        }
    }
    
    // حفظ البيانات إلى GitHub
    async saveToGitHub(data, commitMessage = 'تحديث بيانات العائلة') {
        if (!this.isOnline) {
            console.log('Offline mode - saving to localStorage only');
            localStorage.setItem(this.localStorageKey, JSON.stringify(data));
            return { success: true, offline: true };
        }
        
        try {
            console.log('Saving data to GitHub...');
            this.syncInProgress = true;
            
            // أولاً احصل على SHA الحالي للملف
            const getUrl = `${this.apiBase}/repos/${this.owner}/${this.repo}/contents/${this.dataPath}`;
            let sha = null;
            
            try {
                const getResponse = await fetch(getUrl);
                if (getResponse.ok) {
                    const fileInfo = await getResponse.json();
                    sha = fileInfo.sha;
                }
            } catch (e) {
                console.log('File may not exist yet, will create new');
            }
            
            // إنشاء محتوى الملف
            const content = btoa(JSON.stringify(data, null, 2));
            
            // إعداد البيانات للـ API
            const updateData = {
                message: commitMessage,
                content: content,
                branch: 'main'
            };
            
            if (sha) {
                updateData.sha = sha;
            }
            
            // حفظ الملف
            const putUrl = `${this.apiBase}/repos/${this.owner}/${this.repo}/contents/${this.dataPath}`;
            const putResponse = await fetch(putUrl, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            
            if (putResponse.ok) {
                console.log('Data saved to GitHub successfully');
                
                // حفظ في localStorage أيضاً
                localStorage.setItem(this.localStorageKey, JSON.stringify(data));
                
                return { success: true, github: true };
            } else {
                throw new Error(`GitHub save failed: ${putResponse.status}`);
            }
            
        } catch (error) {
            console.error('Error saving to GitHub:', error);
            
            // Fallback to localStorage
            localStorage.setItem(this.localStorageKey, JSON.stringify(data));
            
            return { success: true, fallback: true, error: error.message };
        } finally {
            this.syncInProgress = false;
        }
    }
    
    // مزامنة البيانات (قراءة من GitHub)
    async syncWithGitHub() {
        if (!this.isOnline || this.syncInProgress) {
            return null;
        }
        
        try {
            const githubData = await this.loadFromGitHub();
            
            // مقارنة مع البيانات المحلية
            const localData = localStorage.getItem(this.localStorageKey);
            const localParsed = localData ? JSON.parse(localData) : null;
            
            if (localParsed && githubData) {
                // التحقق من التحديثات
                const githubCount = githubData.familyMembers?.length || 0;
                const localCount = localParsed.familyMembers?.length || 0;
                
                if (githubCount !== localCount) {
                    console.log(`Data sync: GitHub has ${githubCount}, local has ${localCount}`);
                    return githubData;
                }
            }
            
            return githubData;
            
        } catch (error) {
            console.error('Sync error:', error);
            return null;
        }
    }
    
    // البيانات الافتراضية
    getDefaultData() {
        return {
            familyMembers: [
                // المؤسس
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
                // يمكن إضافة باقي الأعضاء هنا...
            ],
            events: [],
            suggestions: [],
            library: [],
            lastUpdated: new Date().toISOString(),
            version: '1.0'
        };
    }
    
    // إضافة عضو جديد مع المزامنة
    async addFamilyMember(memberData) {
        try {
            // قراءة آخر البيانات
            const currentData = await this.loadFromGitHub();
            
            // إضافة العضو الجديد
            const newMember = {
                ...memberData,
                id: this.generateId(),
                created_at: new Date().toISOString()
            };
            
            currentData.familyMembers.push(newMember);
            currentData.lastUpdated = new Date().toISOString();
            
            // حفظ البيانات المحدثة
            const saveResult = await this.saveToGitHub(
                currentData, 
                `إضافة عضو جديد: ${memberData.full_name}`
            );
            
            if (saveResult.success) {
                console.log('Member added and synced successfully');
                return { success: true, member: newMember, sync: saveResult };
            }
            
            return { success: false, error: 'Save failed' };
            
        } catch (error) {
            console.error('Error adding member:', error);
            return { success: false, error: error.message };
        }
    }
    
    // إنشاء ID فريد
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // التحقق من حالة الاتصال والمزامنة
    getConnectionStatus() {
        return {
            online: this.isOnline,
            syncing: this.syncInProgress,
            lastSync: localStorage.getItem(this.localStorageKey + '_last_sync')
        };
    }
}

// تصدير للاستخدام العام
window.GitHubSyncManager = GitHubSyncManager;