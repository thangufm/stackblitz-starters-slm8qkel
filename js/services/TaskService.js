import { Task } from '../models/Task.js';

export class TaskService {
    constructor() {
        // Dữ liệu mẫu kiểm thử công việc tuần của 2 phòng
        this.tasks = [
            new Task(1, 'Báo cáo kiểm kê tài sản & hạ tầng CNTT Quý 3/2026', 'HC-TV', 'Hành chính - Tài vụ', 'Phạm Ngọc Thắng', '30/09/2026', 'LATE'),
            new Task(2, 'Triển khai bảo trì hệ thống mạng máy tính phòng họp', 'HC-TV', 'Hành chính - Tài vụ', 'Phạm Ngọc Thắng', '02/10/2026', 'DOING'),
            new Task(3, 'Thanh toán chi phí điện nước tháng 9', 'HC-TV', 'Hành chính - Tài vụ', 'Lê Văn B', '29/09/2026', 'DONE'),
            new Task(4, 'Lập danh sách sinh viên xét học bổng học kỳ 1', 'DT-QLSV', 'Đào tạo - KH & QLSV', 'Nguyễn Văn A', '03/10/2026', 'DOING'),
            new Task(5, 'Cập nhật thời khóa biểu bổ sung cho các lớp', 'DT-QLSV', 'Đào tạo - KH & QLSV', 'Trần Thị C', '01/10/2026', 'DONE'),
            new Task(6, 'Tổng hợp đề xuất đề tài NCKH cấp cơ sở', 'DT-QLSV', 'Đào tạo - KH & QLSV', 'Nguyễn Văn A', '28/09/2026', 'LATE')
        ];
    }

    // Lọc công việc theo phòng ban
    getTasksByDepartment(deptCode) {
        if (deptCode === 'ALL') return this.tasks;
        return this.tasks.filter(task => task.dept === deptCode);
    }

    // Thêm chỉ đạo của BGĐ
    addDirective(taskId, directiveText) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.setDirective(directiveText);
            return true;
        }
        return false;
    }
}