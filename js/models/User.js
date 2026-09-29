export class User {
    constructor(email, fullName, position, deptId, role) {
        this.email = email;
        this.fullName = fullName;
        this.position = position; // Giám đốc, Trưởng phòng, Chuyên viên chính,...
        this.deptId = deptId;     // 'BGD', 'HC-TV', 'DT-QLSV'
        this.role = role;         // 'SUPER_ADMIN', 'ADMIN_BGD', 'MANAGER', 'STAFF'
    }

    // Kiểm tra có thuộc Ban Giám đốc hoặc Super Admin không
    isAdmin() {
        return this.role === 'SUPER_ADMIN' || this.role === 'ADMIN_BGD';
    }

    // Kiểm tra có phải Trưởng/Phó phòng không
    isManager() {
        return this.role === 'MANAGER' || this.isAdmin();
    }
}