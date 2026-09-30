//Logic Đăng ký, Đăng nhập, Phân quyền
import { db, ref, set, push, get, query, orderByChild, equalTo } from 'js/config/firebase-config.js';

const CURRENT_USER_KEY = 'ufm_task_user';

export const AuthService = {
    // Lấy thông tin user đang đăng nhập từ LocalStorage
    getCurrentUser() {
        const userJson = localStorage.getItem(CURRENT_USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    },

    // Lưu thông tin phiên đăng nhập
    setCurrentUser(userData) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    },

    // Đăng xuất
    logout() {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    // Đăng ký tài khoản mới vào Firebase Realtime DB
    async register({ fullName, email, password, deptId, role = 'staff' }) {
        // Kiểm tra xem email đã tồn tại chưa
        const usersRef = ref(db, 'users');
        const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));
        const snapshot = await get(emailQuery);

        if (snapshot.exists()) {
            throw new Error('Email này đã được đăng ký trên hệ thống!');
        }

        // Tạo tài khoản mới
        const newUserRef = push(usersRef);
        const userId = newUserRef.key;
        const userData = {
            id: userId,
            fullName,
            email,
            password, // Trong thực tế nên dùng Firebase Auth, ở đây lưu trực tiếp theo cấu trúc test
            deptId,
            role, // 'admin' (BGĐ), 'manager' (Trưởng phòng), 'staff' (Nhân viên)
            createdAt: new Date().toISOString()
        };

        await set(newUserRef, userData);
        return userData;
    },

    // Đăng nhập
    async login(email, password) {
        const usersRef = ref(db, 'users');
        const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));
        const snapshot = await get(emailQuery);

        if (!snapshot.exists()) {
            throw new Error('Tài khoản email không tồn tại!');
        }

        let matchedUser = null;
        snapshot.forEach((child) => {
            const user = child.val();
            if (user.password === password) {
                matchedUser = { ...user, id: child.key };
            }
        });

        if (!matchedUser) {
            throw new Error('Mật khẩu không chính xác!');
        }

        this.setCurrentUser(matchedUser);
        return matchedUser;
    }
};