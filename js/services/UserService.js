import { User } from '../models/User.js';

export class UserService {
    constructor() {
        this.users = [];
        this.currentUser = null;
        this.initDefaultUsers();
    }

    initDefaultUsers() {
        const savedUsers = localStorage.getItem('app_users');
        if (savedUsers) {
            this.users = JSON.parse(savedUsers);
        } else {
            this.users = [
                new User('admin@ufm.edu.vn', 'Quản trị hệ thống', 'Chuyên viên IT', 'DEPT_IT', 'SUPER_ADMIN', '123'),
                new User('bgd@ufm.edu.vn', 'Ban Giám Đốc', 'Giám đốc', 'DEPT_BGD', 'ADMIN_BGD', '123'),
                new User('tp_tcns@ufm.edu.vn', 'Trưởng phòng TCNS', 'Trưởng phòng', 'DEPT_TCNS', 'MANAGER', '123'),
                new User('nv_tcns@ufm.edu.vn', 'Nhân viên TCNS', 'Chuyên viên', 'DEPT_TCNS', 'STAFF', '123')
            ];
            this.saveUsers();
        }
    }

    saveUsers() {
        localStorage.setItem('app_users', JSON.stringify(this.users));
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('app_current_user', JSON.stringify(user));
            return user;
        }
        return null;
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const saved = localStorage.getItem('app_current_user');
            if (saved) this.currentUser = JSON.parse(saved);
        }
        return this.currentUser;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('app_current_user');
    }
}