import { AuthService } from './services/auth-service.js';
import { DeptService } from './services/dept-service.js';
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

    async init() {
        // Tự động đẩy danh sách phòng ban và nhân sự lên Firebase nếu chưa có
        DeptService.initDefaultData().catch(err => {
            console.warn("Không thể đồng bộ dữ liệu ban đầu:", err);
        });

        this.currentUser = AuthService.getCurrentUser();
        this.renderNavbar();

        if (this.currentUser) {
            this.loadDashboard();
        } else {
            this.loadAuthView();
        }
    }

    renderNavbar() {
        // Tự động tìm thẻ chứa Navbar hoặc tự tạo nếu trong index.html chưa có
        let navbarContainer = document.getElementById('navbar') || document.getElementById('navbar-container');
        
        if (!navbarContainer) {
            navbarContainer = document.createElement('div');
            navbarContainer.id = 'navbar';
            document.body.insertBefore(navbarContainer, document.body.firstChild);
        }
    
        NavbarComponent.render(navbarContainer, this.currentUser, () => this.handleLogout());
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
        AuthService.logout();
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