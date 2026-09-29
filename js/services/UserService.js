import { User } from '../models/User.js';

export class UserService {
    constructor() {
        // Dữ liệu nhân sự chuẩn theo phân công của Phân hiệu UFM Quảng Ngãi
        this.users = [
            // --- BAN GIÁM ĐỐC ---
            new User('yenlinhbt@ufm.edu.vn', 'Bùi Thị Yến Linh', 'Giám đốc Phân hiệu', 'BGD', 'ADMIN_BGD'),
            new User('lexuanlam@ufm.edu.vn', 'Lê Xuân Lãm', 'Phó Giám đốc Phân hiệu', 'BGD', 'ADMIN_BGD'),
            
            // --- PHÒNG HÀNH CHÍNH - TÀI VỤ ---
            new User('tranthibichlien@ufm.edu.vn', 'Trần Thị Bích Liên', 'Trưởng Phòng', 'HC-TV', 'MANAGER'),
            new User('nguyenthiphuongthao@ufm.edu.vn', 'Nguyễn Thị Phương Thảo', 'Phó Trưởng phòng', 'HC-TV', 'MANAGER'),
            new User('tranthitam@ufm.edu.vn', 'Trần Thị Tâm', 'Nhân viên văn thư', 'HC-TV', 'STAFF'),
            new User('huynhthianhtung@ufm.edu.vn', 'Huỳnh Thị Anh Tùng', 'Kế toán viên hạng III', 'HC-TV', 'STAFF'),
            new User('nguyenthikimdung@ufm.edu.vn', 'Nguyễn Thị Kim Dung', 'Chuyên viên', 'HC-TV', 'STAFF'),
            new User('phamngocthang@ufm.edu.vn', 'Phạm Ngọc Thắng', 'Chuyên viên chính', 'HC-TV', 'SUPER_ADMIN'),
            new User('dinhthanhha@ufm.edu.vn', 'Đinh Thanh Hà', 'Kỹ sư', 'HC-TV', 'STAFF'),
            new User('tranthang@ufm.edu.vn', 'Bùi Trần Quyết Thắng', 'Kỹ sư', 'HC-TV', 'STAFF'),

            // --- PHÒNG ĐÀO TẠO - KHOA HỌC VÀ QUẢN LÝ SINH VIÊN ---
            new User('phamhoainam@ufm.edu.vn', 'Phạm Hoài Nam', 'Trưởng phòng', 'DT-QLSV', 'MANAGER'),
            new User('huynhngocnghiem@ufm.edu.vn', 'Huỳnh Ngọc Nghiêm', 'Phó trưởng phòng', 'DT-QLSV', 'MANAGER'),
            new User('tranquanghai@ufm.edu.vn', 'Trần Quang Hải', 'Phó trưởng phòng', 'DT-QLSV', 'MANAGER'),
            new User('phamthuhao@ufm.edu.vn', 'Phạm Thị Thu Hảo', 'Điều dưỡng trung cấp', 'DT-QLSV', 'STAFF'),
            new User('tathiquynhngoc@ufm.edu.vn', 'Tạ Thị Quỳnh Ngọc', 'Chuyên viên chính', 'DT-QLSV', 'STAFF'),
            new User('huynhthithanhri@ufm.edu.vn', 'Huỳnh Thị Thanh Ri', 'Giảng viên', 'DT-QLSV', 'STAFF'),
            new User('vovanthao@ufm.edu.vn', 'Võ Văn Thảo', 'Chuyên viên', 'DT-QLSV', 'STAFF'),
            new User('nguyenthithuthuy@ufm.edu.vn', 'Nguyễn Thị Thu Thủy', 'Thư viện viên', 'DT-QLSV', 'STAFF'),
            new User('diepquynhtram@ufm.edu.vn', 'Diệp Quỳnh Trâm', 'Chuyên viên chính', 'DT-QLSV', 'STAFF'),
            new User('tuyetdung.le@ufm.edu.vn', 'Lê Thị Tuyết Dung', 'Giảng viên chính', 'DT-QLSV', 'STAFF'),
            new User('nguyenquynhduyen@ufm.edu.vn', 'Nguyễn Thị Quỳnh Duyên', 'Giảng viên chính', 'DT-QLSV', 'STAFF'),
            new User('dangduythanhhuong@ufm.edu.vn', 'Đặng Duy Thanh Hương', 'Giảng viên', 'DT-QLSV', 'STAFF')
        ];
    }

    // Lấy danh sách nhân viên theo Phòng ban
    getUsersByDept(deptId) {
        if (deptId === 'ALL') return this.users;
        return this.users.filter(u => u.deptId === deptId);
    }

    // Lấy thông tin 1 user theo email
    getUserByEmail(email) {
        return this.users.find(u => u.email === email);
    }
}