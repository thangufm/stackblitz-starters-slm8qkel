import { db, ref, get, set } from '../config/firebase-config.js';

export const DeptService = {
    departments: [
        { id: "dept_bgd", name: "Ban Giám đốc" },
        { id: "dept_hctv", name: "Phòng Hành chính – Tài vụ" },
        { id: "dept_dtkhqlsv", name: "Phòng Đào tạo - Khoa học và QLSV" }
    ],

    initialUsers: [
        // Super Admin
        { id: "user_super_admin", fullName: "Super Admin", email: "thangtcnb@gmail.com", password: "147852369", deptId: "dept_bgd", position: "Quản trị hệ thống", role: "admin" },
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

    // 6 công việc mẫu (mỗi phòng 2 việc)
    initialTasks: [
        // Ban Giám đốc
        {
            id: "task_bgd_1",
            title: "Chỉ đạo rà soát quy hoạch hạ tầng CNTT năm 2026",
            description: "Chỉ đạo các đơn vị phối hợp đánh giá lại toàn bộ hạ tầng mạng, máy tính và phần mềm quản lý của Phân hiệu.",
            deptId: "dept_bgd",
            assigneeId: "u_lexuanlam",
            assigneeName: "Lê Xuân Lãm",
            createdByName: "Bùi Thị Yến Linh (Giám đốc)",
            priority: "KHAN", // KHAN, CAO, TRUNGBINH, THAP
            status: "DANG_THUC_HIEN", // CHO_XU_LY, DANG_THUC_HIEN, CHO_DUYET, HOAN_THANH
            progress: 40,
            dueDate: "2026-10-15"
        },
        {
            id: "task_bgd_2",
            title: "Duyệt kế hoạch tuyển sinh đợt bổ sung Phân hiệu Quảng Ngãi",
            description: "Chỉ đạo Phòng Đào tạo hoàn thiện các tiêu chí tuyển sinh và phương án truyền thông tại địa phương.",
            deptId: "dept_bgd",
            assigneeId: "u_yenlinhbt",
            assigneeName: "Bùi Thị Yến Linh",
            createdByName: "Bùi Thị Yến Linh (Giám đốc)",
            priority: "CAO",
            status: "CHO_XU_LY",
            progress: 0,
            dueDate: "2026-10-10"
        },
        // Phòng Hành chính – Tài vụ
        {
            id: "task_hctv_1",
            title: "Bảo trì nâng cấp hệ thống máy chủ và hạ tầng mạng",
            description: "Thực hiện kiểm tra định kỳ hệ thống máy chủ, tối ưu tốc độ kết nối cho các phòng làm việc.",
            deptId: "dept_hctv",
            assigneeId: "u_phamngocthang",
            assigneeName: "Phạm Ngọc Thắng",
            createdByName: "Trần Thị Bích Liên (Trưởng phòng)",
            priority: "CAO",
            status: "DANG_THUC_HIEN",
            progress: 60,
            dueDate: "2026-10-08"
        },
        {
            id: "task_hctv_2",
            title: "Rà soát hồ sơ quyết toán tài chính Quý III",
            description: "Tổng hợp toàn bộ chứng từ thu chi, lập báo cáo quyết toán tài chính gửi về Trụ sở chính.",
            deptId: "dept_hctv",
            assigneeId: "u_huynhthianhtung",
            assigneeName: "Huỳnh Thị Anh Tùng",
            createdByName: "Trần Thị Bích Liên (Trưởng phòng)",
            priority: "TRUNGBINH",
            status: "CHO_DUYET",
            progress: 90,
            dueDate: "2026-10-05"
        },
        // Phòng Đào tạo - Khoa học và QLSV
        {
            id: "task_dtkh_1",
            title: "Lập thời khóa học kỳ I cho sinh viên khóa mới",
            description: "Xây dựng lịch học chi tiết, phân công giảng viên giảng dạy và xếp phòng học lý thuyết.",
            deptId: "dept_dtkhqlsv",
            assigneeId: "u_tathiquynhngoc",
            assigneeName: "Tạ Thị Quỳnh Ngọc",
            createdByName: "Phạm Hoài Nam (Trưởng phòng)",
            priority: "KHAN",
            status: "DANG_THUC_HIEN",
            progress: 75,
            dueDate: "2026-10-03"
        },
        {
            id: "task_dtkh_2",
            title: "Tổ chức khám sức khỏe đầu khóa cho tân sinh viên",
            description: "Phối hợp với Y tế địa phương chuẩn bị địa điểm, lập danh sách và thông báo lịch khám sức khỏe cho sinh viên.",
            deptId: "dept_dtkhqlsv",
            assigneeId: "u_phamthuhao",
            assigneeName: "Phạm Thị Thu Hảo",
            createdByName: "Phạm Hoài Nam (Trưởng phòng)",
            priority: "TRUNGBINH",
            status: "CHO_XU_LY",
            progress: 10,
            dueDate: "2026-10-20"
        }
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

            // 3. Khởi tạo 6 công việc mẫu
            const taskSnap = await get(ref(db, 'tasks'));
            if (!taskSnap.exists()) {
                const tasksObj = {};
                this.initialTasks.forEach(t => tasksObj[t.id] = t);
                await set(ref(db, 'tasks'), tasksObj);
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