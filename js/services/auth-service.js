import { db, ref, get } from '../config/firebase-config.js';

export const AuthService = {
    async login(email, password) {
        try {
            const snapshot = await get(ref(db, 'users'));
            if (!snapshot.exists()) {
                throw new Error("Dữ liệu người dùng chưa được khởi tạo!");
            }

            const users = snapshot.val();
            const user = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                throw new Error("Email đăng nhập không tồn tại!");
            }

            if (user.password !== password) {
                throw new Error("Mật khẩu không chính xác!");
            }

            // Lưu phiên làm việc
            const sessionUser = {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                deptId: user.deptId,
                position: user.position || '',
                role: user.role || 'user'
            };

            localStorage.setItem('currentUser', JSON.stringify(sessionUser));
            return sessionUser;
        } catch (error) {
            throw error;
        }
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    logout() {
        localStorage.removeItem('currentUser');
    }
};