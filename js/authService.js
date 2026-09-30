export class AuthService {
    constructor() {
        this.STORAGE_USERS_KEY = 'ufm_users';
        this.STORAGE_CURRENT_KEY = 'ufm_current_user';
        this.initUsers();
    }

    // Danh sách tài khoản mặc định nếu localStorage trống
    initUsers() {
        if (!localStorage.getItem(this.STORAGE_USERS_KEY)) {
            const defaultUsers = [
                {
                    email: 'bgd@ufm.edu.vn',
                    password: '123',
                    fullName: 'Ban Giám Đốc',
                    position: 'Giám đốc Phân hiệu',
                    role: 'ADMIN_BGD',
                    deptId: 'BGD'
                },
                {
                    email: 'yenlinhbt@ufm.edu.vn',
                    password: '123',
                    fullName: 'Bùi Thị Yến Linh',
                    position: 'Trưởng phòng',
                    role: 'MANAGER',
                    deptId: 'HC-TV'
                },
                {
                    email: 'ngocthang@ufm.edu.vn',
                    password: '123',
                    fullName: 'Phạm Ngọc Thắng',
                    position: 'Nhân viên',
                    role: 'STAFF',
                    deptId: 'HC-TV'
                },
                {
                    email: 'daotao@ufm.edu.vn',
                    password: '123',
                    fullName: 'Nguyễn Văn A',
                    position: 'Trưởng phòng',
                    role: 'MANAGER',
                    deptId: 'DT-QLSV'
                },
                {
                    email: 'nvdaotao@ufm.edu.vn',
                    password: '123',
                    fullName: 'Trần Thị B',
                    position: 'Nhân viên',
                    role: 'STAFF',
                    deptId: 'DT-QLSV'
                }
            ];
            localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(defaultUsers));
        }
    }

    getUsers() {
        return JSON.parse(localStorage.getItem(this.STORAGE_USERS_KEY)) || [];
    }

    getUsersByDept(deptId) {
        const users = this.getUsers();
        if (deptId === 'ALL') return users;
        return users.filter(u => u.deptId === deptId);
    }

    getCurrentUser() {
        const userStr = localStorage.getItem(this.STORAGE_CURRENT_KEY);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    }

    login(email, password) {
        const users = this.getUsers();
        const foundUser = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password);

        if (foundUser) {
            localStorage.setItem(this.STORAGE_CURRENT_KEY, JSON.stringify(foundUser));
            return { success: true, user: foundUser };
        } else {
            return { success: false, message: 'Email hoặc mật khẩu không chính xác!' };
        }
    }

    logout() {
        localStorage.removeItem(this.STORAGE_CURRENT_KEY);
    }

    changePassword(email, oldPassword, newPassword) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());

        if (userIndex === -1) {
            return { success: false, message: 'Tài khoản không tồn tại!' };
        }

        if (users[userIndex].password !== oldPassword) {
            return { success: false, message: 'Mật khẩu hiện tại không đúng!' };
        }

        users[userIndex].password = newPassword;
        localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(users));

        // Cập nhật lại thông tin đăng nhập hiện tại
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.email === email) {
            currentUser.password = newPassword;
            localStorage.setItem(this.STORAGE_CURRENT_KEY, JSON.stringify(currentUser));
        }

        return { success: true, message: 'Đổi mật khẩu thành công!' };
    }
}