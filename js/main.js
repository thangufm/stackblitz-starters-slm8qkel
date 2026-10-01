import { DeptService } from './services/dept-service.js';
import { NavbarComponent } from './components/navbar.js';
import { TaskListComponent } from './components/task-list.js';
import { db, ref, get } from './config/firebase-config.js';

class App {
    constructor() {
        this.currentUser = null;
    }

    async init() {
        const loadingEl = document.getElementById('loading');

        try {
            // 1. Khởi tạo dữ liệu mồi
            await DeptService.initDefaultData();

            // 2. Lấy thông tin user đăng nhập từ localStorage
            const userStr = localStorage.getItem('user');
            if (userStr) {
                this.currentUser = JSON.parse(userStr);
            }

            // 3. Render Navbar
            this.renderNavbar();

            // 4. Lấy dữ liệu công việc từ Firebase
            const taskSnap = await get(ref(db, 'tasks'));
            let tasks = [];
            if (taskSnap.exists()) {
                tasks = Object.values(taskSnap.val());
            }

            // 5. Render danh sách công việc
            const mainContainer = document.getElementById('main-content');
            if (mainContainer) {
                TaskListComponent.render(mainContainer, tasks, this.currentUser, null, () => {
                    this.init(); // Reload danh sách khi giao việc mới
                });
            }

        } catch (error) {
            console.error("Lỗi khởi tạo App:", error);
        } finally {
            // ĐẢM BẢO ẨN MÀN HÌNH LOADING
            if (loadingEl) {
                loadingEl.classList.add('hidden');
                loadingEl.style.display = 'none';
            }
        }
    }

    renderNavbar() {
        let navbarContainer = document.getElementById('navbar') || document.getElementById('navbar-container');
        
        if (!navbarContainer) {
            navbarContainer = document.createElement('div');
            navbarContainer.id = 'navbar';
            document.body.insertBefore(navbarContainer, document.body.firstChild);
        }

        NavbarComponent.render(navbarContainer, this.currentUser, () => this.handleLogout());
    }

    handleLogout() {
        localStorage.removeItem('user');
        window.location.reload();
    }
}

// Khởi chạy ứng dụng khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});