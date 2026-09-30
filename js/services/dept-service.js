//Logic Danh mục Phòng ban & Nhân sự
import { db, ref, get } from '../config/firebase-config.js';

// Danh mục phòng ban mặc định của Phân hiệu UFM
const DEFAULT_DEPTS = [
    { id: 'HC-TV', name: 'Phòng Hành chính - Tài vụ' },
    { id: 'DT-QLSV', name: 'Phòng Đào tạo - KH & QLSV' },
    { id: 'BGD', name: 'Ban Giám Đốc Phân hiệu' }
];

export const DeptService = {
    // Lấy danh sách phòng ban
    getDepartments() {
        return DEFAULT_DEPTS;
    },

    // Lấy tên phòng ban theo ID
    getDeptName(deptId) {
        const dept = DEFAULT_DEPTS.find(d => d.id === deptId);
        return dept ? dept.name : deptId;
    },

    // Lấy tất cả người dùng thuộc một phòng ban
    async getUsersByDept(deptId) {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        const users = [];

        if (snapshot.exists()) {
            snapshot.forEach((child) => {
                const u = child.val();
                if (!deptId || u.deptId === deptId) {
                    users.push({ id: child.key, ...u });
                }
            });
        }
        return users;
    }
};