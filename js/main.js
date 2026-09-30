//Điều phối hệ thống (Entry point)
import { AuthService } from './services/auth-service.js';
import { TaskService } from './services/task-service.js';
import { NavbarComponent } from './components/navbar.js';
import { AuthViewComponent } from './components/auth-view.js';
import { TaskListComponent } from './components/task-list.js';
import { TaskFormComponent } from './components/task-form.js';

class App {
    constructor() {
        this.currentUser = null;
        this.unsubscribeTasks = null;
        this.tasks = [];
    }

    init() {
        // Kiểm tra phiên đăng nhập hiện tại từ LocalStorage
        this.currentUser = AuthService.getCurrentUser();

        // Render Navbar ban đầu
        this.renderNavbar();

        // Kiểm tra điều hướng
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