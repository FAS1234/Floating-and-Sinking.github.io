// 权限管理模块
const AuthManager = {
    // 初始化
    init() {
        this.checkLoginStatus();
    },
    
    // 检查登录状态
    checkLoginStatus() {
        const token = localStorage.getItem('adminToken');
        const expiresAt = localStorage.getItem('adminTokenExpires');
        const userData = localStorage.getItem('currentAdminUser');
        
        if (token && expiresAt && userData) {
            const now = new Date();
            const expiryDate = new Date(expiresAt);
            
            if (now < expiryDate) {
                // 验证token有效性（模拟后端验证）
                if (this.validateToken(token)) {
                    return {
                        isLoggedIn: true,
                        user: JSON.parse(userData),
                        token: token
                    };
                }
            }
        }
        
        // 清理过期或无效的登录状态
        this.logout();
        return {
            isLoggedIn: false,
            user: null,
            token: null
        };
    },
    
    // 验证token（模拟后端验证逻辑）
    validateToken(token) {
        // 在真实环境中，这里应该发送请求到后端验证token
        // 这里我们简单检查token格式是否正确
        return token && token.length === 32;
    },
    
    // 登录
    login(username, password) {
        // 验证账号密码（模拟后端验证）
        const account = this.validateAdminAccount(username, password);
        if (account) {
            // 生成登录凭证
            const token = this.generateToken();
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小时过期
            
            // 存储登录状态
            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminTokenExpires', expiresAt.toISOString());
            localStorage.setItem('currentAdminUser', JSON.stringify(account));
            
            // 更新UI
            this.updateAdminUI(true);
            
            return {
                success: true,
                user: account,
                token: token
            };
        } else {
            return {
                success: false,
                message: '账号或密码错误'
            };
        }
    },
    
    // 退出登录
    logout() {
        // 清除登录状态
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenExpires');
        localStorage.removeItem('currentAdminUser');
        
        // 更新UI
        this.updateAdminUI(false);
    },
    
    // 更新管理员UI元素
    updateAdminUI(isLoggedIn) {
        // 显示/隐藏所有管理功能按钮
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(element => {
            element.style.display = isLoggedIn ? 'inline-block' : 'none';
        });
        
        // 切换登录/退出按钮文本
        const loginBtn = document.getElementById('adminLoginBtn');
        if (loginBtn) {
            loginBtn.textContent = isLoggedIn ? '退出登录' : '管理员登录';
        }
        
        // 显示/隐藏账号管理按钮
        const manageBtn = document.getElementById('adminManageBtn');
        if (manageBtn) {
            manageBtn.style.display = isLoggedIn ? 'inline-block' : 'none';
        }
    },
    
    // 检查用户是否有管理员权限
    hasPermission() {
        const status = this.checkLoginStatus();
        return status.isLoggedIn;
    },
    
    // 验证管理员账号
    validateAdminAccount(username, password) {
        const accounts = this.getAdminAccounts();
        return accounts.find(account => account.username === username && account.password === password);
    },
    
    // 获取所有管理员账号
    getAdminAccounts() {
        return JSON.parse(localStorage.getItem('adminAccounts')) || [];
    },
    
    // 生成随机Token
    generateToken() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < 32; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    },
    
    // 初始化管理员账号存储（如果不存在）
    initAdminAccounts() {
        const accounts = this.getAdminAccounts();
        if (!accounts || accounts.length === 0) {
            // 创建默认管理员账号
            const defaultAccounts = [
                { username: 'admin', password: 'admin123456', createdAt: new Date().toISOString() }
            ];
            localStorage.setItem('adminAccounts', JSON.stringify(defaultAccounts));
        }
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    AuthManager.init();
});