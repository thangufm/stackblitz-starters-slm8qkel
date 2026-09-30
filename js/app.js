import { UserService } from './services/UserService.js';
import { TaskService } from './services/TaskService.js';
import { AdminDashboardView } from './views/AdminDashboardView.js';

class App {
    constructor() {
        this.userService = new UserService();
        this.taskService = new TaskService();
        this.adminView = new AdminDashboardView('app-content'); 
    }

    init() {
        console.log('Ứng dụng đã khởi tạo thành công với cấu trúc Modular!');
        
        // Kiểm tra người dùng hiện tại
        const currentUser = this.userService.getCurrentUser();
        
        // Render giao diện danh sách công việc
        const allTasks = this.taskService.getAllTasks();
        this.adminView.render(allTasks);
    }
}

// Khởi chạy ứng dụng khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});