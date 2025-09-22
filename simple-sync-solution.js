// حل بسيط للمزامنة باستخدام JSONBin.io (مجاني)
class SimpleSyncManager {
    constructor() {
        // استخدام JSONBin.io كقاعدة بيانات مؤقتة
        this.binId = '676eb8efad19ca34f8d8e5ff'; // مثال - يحتاج إنشاء
        this.apiKey = '$2a$10$Pm8ov.YjBQBEVoBEgLWvceXsKxE5kUphf7cNk3NkNgCvjJ7FJA2L.'; // مثال
        this.baseUrl = 'https://api.jsonbin.io/v3/b';
        
        this.lastSyncTime = localStorage.getItem('lastSyncTime');
        this.syncInterval = null;
        
        // بدء المزامنة التلقائية كل 30 ثانية
        this.startAutoSync();
    }
    
    // قراءة البيانات من الخادم
    async loadFromServer() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, {
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Data loaded from server:', result.record);
                return result.record;
            }
            
            return null;
        } catch (error) {
            console.error('❌ Server load error:', error);
            return null;
        }
    }
    
    // حفظ البيانات إلى الخادم
    async saveToServer(data) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('lastSyncTime', new Date().toISOString());
                console.log('✅ Data saved to server successfully');
                return { success: true, result };
            }
            
            return { success: false, error: 'Save failed' };
        } catch (error) {
            console.error('❌ Server save error:', error);
            return { success: false, error };
        }
    }
    
    // مزامنة البيانات
    async syncData(localData) {
        try {
            // قراءة البيانات من الخادم
            const serverData = await this.loadFromServer();
            
            if (serverData) {
                // مقارنة الإصدارات
                const serverVersion = serverData.version || 0;
                const localVersion = localData.version || 0;
                
                if (serverVersion > localVersion) {
                    // الخادم أحدث - استخدم بيانات الخادم
                    console.log('🔄 Server data is newer, updating local data');
                    return { action: 'update_local', data: serverData };
                } else if (localVersion > serverVersion) {
                    // البيانات المحلية أحدث - ارفع للخادم
                    console.log('📤 Local data is newer, uploading to server');
                    const result = await this.saveToServer(localData);
                    return { action: 'uploaded', success: result.success };
                } else {
                    // البيانات متطابقة
                    console.log('✅ Data is in sync');
                    return { action: 'synced' };
                }
            } else {
                // لا توجد بيانات على الخادم - ارفع البيانات المحلية
                console.log('📤 No server data found, uploading local data');
                const result = await this.saveToServer(localData);
                return { action: 'first_upload', success: result.success };
            }
        } catch (error) {
            console.error('❌ Sync error:', error);
            return { action: 'error', error };
        }
    }
    
    // بدء المزامنة التلقائية
    startAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        // مزامنة كل 30 ثانية
        this.syncInterval = setInterval(() => {
            if (navigator.onLine && window.app) {
                console.log('⏰ Auto sync triggered');
                this.performSync();
            }
        }, 30000);
    }
    
    // تنفيذ المزامنة
    async performSync() {
        if (window.app && window.app.dataManager) {
            const localData = window.app.dataManager.data;
            const syncResult = await this.syncData(localData);
            
            if (syncResult.action === 'update_local') {
                // تحديث البيانات المحلية
                window.app.dataManager.data = syncResult.data;
                window.app.dataManager.saveData();
                
                // إعادة تحميل الواجهة
                window.app.displayFamilyMembers();
                window.app.initializeCharts();
                
                // إشعار المستخدم
                window.app.showToast('تم تحديث البيانات من الخادم المركزي');
            }
        }
    }
    
    // إيقاف المزامنة التلقائية
    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }
}

// إنشاء مدير المزامنة العام
window.syncManager = new SimpleSyncManager();