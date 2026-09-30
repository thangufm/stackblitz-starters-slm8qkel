//Điều phối hệ thống (Entry point)
import { AuthService } from '/js/services/auth-service.js';
import { TaskService } from '/js/services/task-service.js';
import { NavbarComponent } from '/js/components/navbar.js';
import { AuthViewComponent } from '/js/components/auth-view.js';
import { TaskListComponent } from '/js/components/task-list.js';
import { TaskFormComponent } from '/js/components/task-form.js';

class App {
    constructor() {
        this.currentUser = null;
        this.unsubscribeTasks = null;
        this.tasks = [];
    }

    async init() {
        // 1. Tự động kiểm tra & tạo phòng ban mẫu nếu Firebase chưa có
        try {
            await DeptService.initDefaultDepartments();
        } catch (err) {
            console.error("Chưa khởi tạo được phòng ban:", err);
        }
    
        // 2. Kiểm tra phiên đăng nhập hiện tại từ LocalStorage
        this.currentUser = AuthService.getCurrentUser();
    
        // 3. Render Navbar & Chuyển giao diện
        this.renderNavbar();
    
        if (this.currentUser) {
            this.loadDashboard();
        } else {
            this.loadAuthView();
        }
    }

    renderNavbar() {
        NavbarComponent.render(
            this.currentUser,
            () => this.handleLogout(),
            (view) => this.handleNavigate(view)
        );
    }

    loadAuthView() {
        // Hủy đăng ký lắng nghe Firebase Realtime nếu có
        if (this.unsubscribeTasks) {
            this.unsubscribeTasks();
            this.unsubscribeTasks = null;
        }

        const appContainer = document.getElementById('app-container');
        if (appContainer) {
            AuthViewComponent.render(appContainer, (user) => {
                this.currentUser = user;
                this.renderNavbar();
                this.loadDashboard();
            });
        }
    }

    loadDashboard() {
        const appContainer = document.getElementById('app-container');
        if (!appContainer) return;

        // Đặt layout cho trang Dashboard
        appContainer.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 py-6 space-y-6">
                <!-- Chứa danh sách công việc -->
                <div id="task-list-container"></div>
            </div>
        `;

        const taskListContainer = document.getElementById('task-list-container');

        // Lắng nghe dữ liệu công việc thời gian thực từ Firebase Realtime DB
        this.unsubscribeTasks = TaskService.subscribeTasks((taskList) => {
            this.tasks = taskList;
            TaskListComponent.render(
                taskListContainer,
                this.tasks,
                this.currentUser,
                (taskData) => this.openTaskModal(taskData)
            );
        });
    }

    openTaskModal(taskData = null) {
        TaskFormComponent.render(this.currentUser, taskData, () => {
            // Khi lưu thành công, Firebase onValue sẽ tự động cập nhật giao diện
        });
    }

    handleLogout() {
        this.currentUser = null;
        this.renderNavbar();
        this.loadAuthView();
    }

    handleNavigate(view) {
        if (view === 'tasks' && this.currentUser) {
            this.loadDashboard();
        }
    }
}

// Khởi tạo ứng dụng khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});