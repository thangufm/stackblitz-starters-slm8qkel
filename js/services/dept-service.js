import { db, ref, get, set } from '../config/firebase-config.js';

export const DeptService = {
    departments: [
        { id: "dept_bgd", name: "Ban Giám đốc" },
        { id: "dept_hctv", name: "Phòng Hành chính – Tài vụ" },
        { id: "dept_dtkhqlsv", name: "Phòng Đào tạo - Khoa học và QLSV" }
    ],

    // Danh sách nhân sự mặc định khởi tạo lên Firebase
    initialUsers: [
        // Super Admin
        {
            id: "user_super_admin",
            fullName: "Super Admin",
            email: "thangtcnb@gmail.com",
            password: "147852369",
            deptId: "dept_bgd",
            position: "Quản trị hệ thống",
            role: "admin"
        },
        // Ban Giám đốc
        { id: "u_yenlinhbt", fullName: "Bùi Thị Yến Linh", email: "yenlinhbt@ufm.edu.vn", password: "123", deptId: "dept_bgd", position: "Giám đốc Phân hiệu", role: "user" },
        { id: "u_lexuanlam", fullName: "Lê Xuân Lãm", email: "lexuanlam@ufm.edu.vn", password: "123", deptId: "dept_bgd", position: "Phó Giám đốc Phân hiệu", role: "user" },

        // Phòng Hành chính – Tài vụ
        { id: "u_tranthibichlien", fullName: "Trần Thị Bích Liên", email: "tranthibichlien@ufm.edu.vn", password: "123", deptId: "dept_hctv", position: "Trưởng Phòng", role: "user" },
        { id: "u_nguyenthiphuongthao", fullName: "Nguyễn Thị Phương Thảo", email: "nguyenthiphuongthao@ufm.edu.vn", password: "123", deptId: "dept_hctv", position: "Phó Trưởng phòng", role: "user" },
        { id: "u_tranthitam", fullName: "Trần Thị Tâm", email: "tranthitam@ufm.edu.vn", password: "123", deptId: "dept_hctv", position: "Nhân viên văn thư", role: "user" },
        { id: "u_huynhthianhtung", fullName: "Huỳnh Thị Anh Tùng", email: "huynhthianhtung@ufm.edu.vn", password: "123", deptId: "dept_hctv", position: "Kế toán viên", role: "user" },
        { id: "u_nguyenthikimdung", fullName: "Nguyễn Thị Kim Dung", email: "nguyenthikimdung@ufm.edu.vn", password: "123", deptId: "dept_hctv", position: "Chuyên viên", role: "user" },
        { id: "u_phamngocthang", fullName: "Phạm Ngọc Thắng", email: "phamngocthang@ufm.edu.vn", password: "123", deptId: "dept_hctv", position: "Chuyên viên chính", role: "user" },
        { id: "u_dinhthanhha", fullName: "Đinh Thanh Hà", email: "dinhthanhha@ufm.edu.vn", password: "123", deptId: "dept_hctv", position: "Kỹ sư", role: "user" },
        { id: "u_tranthang", fullName: "Bùi Trần Quyết Thắng", email: "tranthang@ufm.edu.vn", password: "123", deptId: "dept_hctv", position: "Kỹ sư", role: "user" },

        // Phòng Đào tạo - Khoa học và QLSV
        { id: "u_phamhoainam", fullName: "Phạm Hoài Nam", email: "phamhoainam@ufm.edu.vn", password: "123", deptId: "dept_dtkhqlsv", position: "Trưởng phòng", role: "user" },
        { id: "u_huynhngocnghiem", fullName: "Huỳnh Ngọc Nghiêm", email: "huynhngocnghiem@ufm.edu.vn", password: "123", deptId: "dept_dtkhqlsv", position: "Phó trưởng phòng", role: "user" },
        { id: "u_tranquanghai", fullName: "Trần Quang Hải", email: "tranquanghai@ufm.edu.vn", password: "123", deptId: "dept_dtkhqlsv", position: "Phó trưởng phòng", role: "user" },
        { id: "u_phamthuhao", fullName: "Phạm Thị Thu Hảo", email: "phamthuhao@ufm.edu.vn", password: "123", deptId: "dept_dtkhqlsv", position: "Điều dưỡng", role: "user" },
        { id: "u_tathiquynhngoc", fullName: "Tạ Thị Quỳnh Ngọc", email: "tathiquynhngoc@ufm.edu.vn", password: "123", deptId: "dept_dtkhqlsv", position: "Chuyên viên chính", role: "user" },
        { id: "u_huynhthithanhri", fullName: "Huỳnh Thị Thanh Ri", email: "huynhthithanhri@ufm.edu.vn", password: "123", deptId: "dept_dtkhqlsv", position: "Chuyên viên", role: "user" },
        { id: "u_vovanthao", fullName: "Võ Văn Thảo", email: "vovanthao@ufm.edu.vn", password: "123", deptId: "dept_dtkhqlsv", position: "Chuyên viên", role: "user" },
        { id: "u_nguyenthithuthuy", fullName: "Nguyễn Thị Thu Thủy", email: "nguyenthithuthuy@ufm.edu.vn", password: "123", deptId: "dept_dtkhqlsv", position: "Thư viện viên", role: "user" },
        { id: "u_diepquynhtram", fullName: "Diệp Quỳnh Trâm", email: "diepquynhtram@ufm.edu.vn", password: "123", deptId: "dept_dtkhqlsv", position: "Chuyên viên chính", role: "user" },
        { id: "u_tuyetdungle", fullName: "Lê Thị Tuyết Dung", email: "tuyetdung.le@ufm.edu.vn", password: "123", deptId: "dept_dtkhqlsv", position: "Chuyên viên chính", role: "user" },
        { id: "u_nguyenquynhduyen", fullName: "Nguyễn Thị Quỳnh Duyên", email: "nguyenquynhduyen@ufm.edu.vn", password: "123", deptId: "dept_dtkhqlsv", position: "Chuyên viên chính", role: "user" },
        { id: "u_dangduythanhhuong", fullName: "Đặng Duy Thanh Hương", email: "dangduythanhhuong@ufm.edu.vn", password: "123", deptId: "dept_dtkhqlsv", position: "Giảng viên", role: "user" }
    ],

    async initDefaultData() {
        try {
            // 1. Khởi tạo danh sách Phòng ban
            const deptSnap = await get(ref(db, 'departments'));
            if (!deptSnap.exists()) {
                const deptsObj = {};
                this.departments.forEach(d => deptsObj[d.id] = d);
                await set(ref(db, 'departments'), deptsObj);
            }

            // 2. Khởi tạo danh sách Nhân sự
            const userSnap = await get(ref(db, 'users'));
            if (!userSnap.exists()) {
                const usersObj = {};
                this.initialUsers.forEach(u => usersObj[u.id] = u);
                await set(ref(db, 'users'), usersObj);
            }
        } catch (error) {
            console.error("Lỗi khởi tạo dữ liệu mẫu:", error);
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