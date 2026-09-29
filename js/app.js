import { TaskService } from './services/TaskService.js';
import { AdminDashboardView } from './views/AdminDashboardView.js';

class App {
    constructor() {
        this.taskService = new TaskService();
        this.view = new AdminDashboardView();
        this.currentDept = 'ALL';

        this.initEvents();
        this.updateView();
    }

    initEvents() {
        document.querySelectorAll('.dept-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.dept-btn').forEach(b => {
                    b.className = "dept-btn px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition";
                });
                
                const targetBtn = e.currentTarget;
                targetBtn.className = "dept-btn px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-sm transition";
                
                this.currentDept = targetBtn.getAttribute('data-dept');
                this.updateView();
            });
        });
    }

    updateView() {
        const tasks = this.taskService.getTasksByDepartment(this.currentDept);
        this.view.render(tasks, (task) => this.handleDirective(task));
    }

    handleDirective(task) {
        const directive = prompt(`Nhập ý kiến chỉ đạo của Ban Giám đốc cho:\n"${task.title}"`);
        if (directive) {
            this.taskService.addDirective(task.id, directive);
            this.updateView();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});