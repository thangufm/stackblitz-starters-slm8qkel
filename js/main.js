import { AuthService } from './services/auth-service.js';
import { DeptService } from './services/dept-service.js'; // <-- Thêm dòng này
import { TaskService } from './services/task-service.js';
import { NavbarComponent } from './components/navbar.js';
import { AuthViewComponent } from './components/auth-view.js';
import { TaskListComponent } from './components/task-list.js';
import { TaskFormComponent } from './components/task-form.js';

class App {
    async init() {
        // Tự động khởi tạo danh sách 3 phòng ban nếu Firebase chưa có
        try {
            await DeptService.initDefaultDepartments();
        } catch (err) {
            console.error("Chưa khởi tạo được phòng ban:", err);
        }

        // Kiểm tra phiên đăng nhập hiện tại từ LocalStorage
        this.currentUser = AuthService.getCurrentUser();

        // Render Navbar
        this.renderNavbar();

        // Chuyển hướng giao diện
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

        appContainer.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 py-6 space-y-6">
                <div id="task-list-container"></div>
            </div>
        `;

        const taskListContainer = document.getElementById('task-list-container');

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
        TaskFormComponent.render(this.currentUser, taskData, () => {});
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

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});