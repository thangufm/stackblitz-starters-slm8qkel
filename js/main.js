import { DeptService } from './services/dept-service.js';
import { NavbarComponent } from './components/navbar.js';
import { TaskListComponent } from './components/task-list.js';
import { LoginComponent } from './components/login.js'; // Nhập component Đăng nhập
import { db, ref, get } from './config/firebase-config.js';

class App {
    constructor() {
        this.currentUser = null;
    }

    async init() {
        const loadingEl = document.getElementById('loading');

        try {
            // 1. Khởi tạo dữ liệu mặc định (Phòng ban, Nhân sự, Công việc mẫu)
            await DeptService.initDefaultData();

            // 2. Kiểm tra thông tin người dùng đã đăng nhập chưa
            const userStr = localStorage.getItem('user');
            if (userStr) {
                this.currentUser = JSON.parse(userStr);
            }

            // 3. KIỂM TRA BẢO MẬT: Nếu CHƯA ĐĂNG NHẬP -> Hiển thị Form Đăng nhập
            if (!this.currentUser) {
                this.renderLogin();
                return;
            }

            // 4. Nếu ĐÃ ĐĂNG NHẬP -> Hiển thị Thanh Tiêu đề Navbar
            this.renderNavbar();

            // 5. Lấy danh sách công việc từ Firebase Realtime Database
            const taskSnap = await get(ref(db, 'tasks'));
            let tasks = [];
            if (taskSnap.exists()) {
                tasks = Object.values(taskSnap.val());
            }

            // 6. Hiển thị danh sách công việc dạng Bảng
            const mainContainer = document.getElementById('main-content');
            if (mainContainer) {
                TaskListComponent.render(mainContainer, tasks, this.currentUser, null, () => {
                    this.init(); // Tải lại danh sách sau khi Ban Giám đốc tạo công việc mới
                });
            }

        } catch (error) {
            console.error("Lỗi khởi tạo ứng dụng:", error);
        } finally {
            // Đảm bảo luôn ẩn màn hình Chờ kết nối (Loading)
            if (loadingEl) {
                loadingEl.classList.add('hidden');
                loadingEl.style.display = 'none';
            }
        }
    }

    // Hàm hiển thị Form Đăng Nhập
    renderLogin() {
        // Xóa thanh Navbar nếu có
        const navbarContainer = document.getElementById('navbar') || document.getElementById('navbar-container');
        if (navbarContainer) navbarContainer.innerHTML = '';

        const mainContainer = document.getElementById('main-content');
        if (mainContainer) {
            LoginComponent.render(mainContainer, (user) => {
                // Khi đăng nhập thành công: Lưu thông tin vào localStorage và chạy lại ứng dụng
                this.currentUser = user;
                localStorage.setItem('user', JSON.stringify(user));
                this.init();
            });
        }
    }

    // Hàm hiển thị Navbar Header
    renderNavbar() {
        let navbarContainer = document.getElementById('navbar') || document.getElementById('navbar-container');
        
        if (!navbarContainer) {
            navbarContainer = document.createElement('div');
            navbarContainer.id = 'navbar';
            document.body.insertBefore(navbarContainer, document.body.firstChild);
        }

        NavbarComponent.render(navbarContainer, this.currentUser, () => this.handleLogout());
    }

    // Hàm Xử lý Đăng xuất
    handleLogout() {
        localStorage.removeItem('user');
        window.location.reload();
    }
}

// Chạy ứng dụng khi DOM hoàn tất
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});