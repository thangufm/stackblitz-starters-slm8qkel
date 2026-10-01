import { DeptService } from './services/dept-service.js';
import { NavbarComponent } from './components/navbar.js';
import { TaskListComponent } from './components/task-list.js';
import { AuthViewComponent } from './components/auth-view.js'; // Chuẩn xác tệp auth-view.js trong dự án
import { db, ref, get } from './config/firebase-config.js';

class App {
    constructor() {
        this.currentUser = null;
    }

    async init() {
        const loadingEl = document.getElementById('loading');

        try {
            // 1. Khởi tạo dữ liệu phòng ban & nhân sự
            await DeptService.initDefaultData();

            // 2. Lấy thông tin user từ localStorage
            const userStr = localStorage.getItem('user');
            if (userStr) {
                this.currentUser = JSON.parse(userStr);
            }

            // 3. KIỂM TRA BẢO MẬT: Nếu CHƯA ĐĂNG NHẬP -> Gọi Form Đăng nhập (AuthView)
            if (!this.currentUser) {
                this.renderLogin();
                return;
            }

            // 4. ĐÃ ĐĂNG NHẬP -> Hiển thị Navbar & Banner thông tin User
            this.renderNavbar();

            // 5. Lấy danh sách công việc từ Firebase
            const taskSnap = await get(ref(db, 'tasks'));
            let tasks = [];
            if (taskSnap.exists()) {
                tasks = Object.values(taskSnap.val());
            }

            // 6. Render Danh sách công việc dạng Bảng Excel
            const mainContainer = document.getElementById('main-content');
            if (mainContainer) {
                TaskListComponent.render(mainContainer, tasks, this.currentUser, null, () => {
                    this.init(); // Reload lại trang khi Ban Giám đốc tạo công việc mới
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

    // Hiển thị Form Đăng nhập chuẩn từ auth-view.js
    renderLogin() {
        const navbarContainer = document.getElementById('navbar') || document.getElementById('navbar-container');
        if (navbarContainer) navbarContainer.innerHTML = '';

        const mainContainer = document.getElementById('main-content');
        if (mainContainer) {
            // Sửa AuthView.render -> AuthViewComponent.render
            AuthViewComponent.render(mainContainer, (user) => {
                this.currentUser = user;
                localStorage.setItem('user', JSON.stringify(user));
                this.init();
            });
        }
    }

    // Hiển thị Thanh Navbar Header
    renderNavbar() {
        let navbarContainer = document.getElementById('navbar') || document.getElementById('navbar-container');
        
        if (!navbarContainer) {
            navbarContainer = document.createElement('div');
            navbarContainer.id = 'navbar';
            document.body.insertBefore(navbarContainer, document.body.firstChild);
        }

        NavbarComponent.render(navbarContainer, this.currentUser, () => this.handleLogout());
    }

    // Xử lý Đăng xuất
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