import { Task } from '../models/Task.js';

export class TaskService {
    constructor() {
        // Dữ liệu công việc cập nhật chuẩn theo chức danh Trưởng phòng và nhân sự thực tế[cite: 6, 7]
        this.tasks = [
            // --- CÔNG VIỆC PHÒNG HÀNH CHÍNH - TÀI VỤ ---
            new Task(
                1, 
                'Báo cáo kiểm kê tài sản & hạ tầng CNTT Quý 3/2026', 
                'HC-TV', 
                'Hành chính - Tài vụ', 
                'Trần Thị Bích Liên (Trưởng phòng)', //[cite: 6]
                '30/09/2026', 
                'LATE'
            ),
            new Task(
                2, 
                'Triển khai bảo trì hệ thống mạng máy tính phòng họp', 
                'HC-TV', 
                'Hành chính - Tài vụ', 
                'Trần Thị Bích Liên (Trưởng phòng)', //[cite: 6]
                '02/10/2026', 
                'DOING'
            ),
            new Task(
                3, 
                'Thanh toán chi phí điện nước và dịch vụ vệ sinh tháng 9', 
                'HC-TV', 
                'Hành chính - Tài vụ', 
                'Huỳnh Thị Anh Tùng (Kế toán viên)', //[cite: 6]
                '29/09/2026', 
                'DONE'
            ),

            // --- CÔNG VIỆC PHÒNG ĐÀO TẠO - KHOA HỌC & QLSV ---
            new Task(
                4, 
                'Lập danh sách sinh viên xét học bổng học kỳ 1', 
                'DT-QLSV', 
                'Đào tạo - KH & QLSV', 
                'Phạm Hoài Nam (Trưởng phòng)', //[cite: 7]
                '03/10/2026', 
                'DOING'
            ),
            new Task(
                5, 
                'Cập nhật thời khóa biểu bổ sung cho các lớp buổi tối', 
                'DT-QLSV', 
                'Đào tạo - KH & QLSV', 
                'Phạm Hoài Nam (Trưởng phòng)', //[cite: 7]
                '01/10/2026', 
                'DONE'
            ),
            new Task(
                6, 
                'Tổng hợp đề xuất đề tài nghiên cứu khoa học cấp cơ sở', 
                'DT-QLSV', 
                'Đào tạo - KH & QLSV', 
                'Huỳnh Ngọc Nghiêm (Phó Trưởng phòng)', //[cite: 7]
                '28/09/2026', 
                'LATE'
            )
        ];
    }

    // Lấy công việc theo phòng ban
    getTasksByDepartment(deptCode) {
        if (deptCode === 'ALL') return this.tasks;
        return this.tasks.filter(task => task.dept === deptCode);
    }

    // Cập nhật ý kiến chỉ đạo của Ban Giám đốc
    addDirective(taskId, directiveText) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.setDirective(directiveText);
            return true;
        }
        return false;
    }
}