//Logic Danh mục Phòng ban & Nhân sự
import { db, ref, get, set } from '../config/firebase-config.js';

export const DeptService = {
    // Danh sách phòng ban cố định của Phân hiệu
    departments: [
        { id: "dept_bgd", name: "Ban Giám đốc" },
        { id: "dept_hctv", name: "Phòng Hành chính - Tài vụ" },
        { id: "dept_dtkhqlsv", name: "Phòng Đào tạo - Khoa học và QLSV" }
    ],

    // Khởi tạo danh sách phòng ban lên Firebase Realtime Database nếu chưa có
    async initDefaultDepartments() {
        try {
            const snapshot = await get(ref(db, 'departments'));
            if (!snapshot.exists()) {
                const defaultDepts = {
                    "dept_bgd": { id: "dept_bgd", name: "Ban Giám đốc" },
                    "dept_hctv": { id: "dept_hctv", name: "Phòng Hành chính - Tài vụ" },
                    "dept_dtkhqlsv": { id: "dept_dtkhqlsv", name: "Phòng Đào tạo - Khoa học và QLSV" }
                };
                await set(ref(db, 'departments'), defaultDepts);
            }
        } catch (error) {
            console.error("Lỗi khởi tạo phòng ban:", error);
        }
    },

    getDepartments() {
        return this.departments;
    },

    getDeptName(deptId) {
        const dept = this.departments.find(d => d.id === deptId);
        return dept ? dept.name : 'Chưa xác định';
    }
};