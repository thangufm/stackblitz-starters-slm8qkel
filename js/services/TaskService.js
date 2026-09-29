import { Task } from '../models/Task.js';

export class TaskService {
    constructor() {
        // Khởi tạo công việc kiểm thử với tên nhân sự chuẩn từ bảng
        this.tasks = [
            new Task(1, 'Báo cáo kiểm kê tài sản & hạ tầng CNTT Quý 3/2026', 'HC-TV', 'Hành chính - Tài vụ', 'Phạm Ngọc Thắng', '30/09/2026', 'LATE'),[cite: 6]
            new Task(2, 'Triển khai bảo trì hệ thống mạng máy tính phòng họp', 'HC-TV', 'Hành chính - Tài vụ', 'Đinh Thanh Hà', '02/10/2026', 'DOING'),[cite: 6]
            new Task(3, 'Thanh toán chi phí điện nước và dịch vụ vệ sinh tháng 9', 'HC-TV', 'Hành chính - Tài vụ', 'Huỳnh Thị Anh Tùng', '29/09/2026', 'DONE'),[cite: 6]
            new Task(4, 'Lập danh sách sinh viên xét học bổng học kỳ 1', 'DT-QLSV', 'Đào tạo - KH & QLSV', 'Võ Văn Thảo', '03/10/2026', 'DOING'),[cite: 7]
            new Task(5, 'Cập nhật thời khóa biểu bổ sung cho các lớp buổi tối', 'DT-QLSV', 'Đào tạo - KH & QLSV', 'Tạ Thị Quỳnh Ngọc', '01/10/2026', 'DONE'),[cite: 7]
            new Task(6, 'Tổng hợp đề xuất đề tài nghiên cứu khoa học cấp cơ sở', 'DT-QLSV', 'Đào tạo - KH & QLSV', 'Huỳnh Ngọc Nghiêm', '28/09/2026', 'LATE')[cite: 7]
        ];
    }

    getTasksByDepartment(deptCode) {
        if (deptCode === 'ALL') return this.tasks;
        return this.tasks.filter(task => task.dept === deptCode);
    }

    addDirective(taskId, directiveText) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.setDirective(directiveText);
            return true;
        }
        return false;
    }
}