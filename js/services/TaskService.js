import { Task } from '../models/Task.js';

export class TaskService {
    constructor() {
        this.tasks = [];
        this.initDefaultTasks();
    }

    initDefaultTasks() {
        const savedTasks = localStorage.getItem('app_tasks');
        if (savedTasks) {
            const rawData = JSON.parse(savedTasks);
            this.tasks = rawData.map(t => Object.assign(new Task(), t));
        } else {
            this.tasks = [
                new Task(1, 'Lập kế hoạch tuyển dụng Q3', 'DEPT_TCNS', 'Phòng Tổ chức - Nhân sự', 'nv_tcns@ufm.edu.vn', '2026-10-15', 'DOING', 'Ưu tiên triển khai sớm', 'Báo cáo kế hoạch'),
                new Task(2, 'Cập nhật hạ tầng CNTT', 'DEPT_IT', 'Phòng CNTT', '', '2026-10-20', 'WAITING_ASSIGN', '', 'Đề xuất trang thiết bị')
            ];
            this.saveTasks();
        }
    }

    saveTasks() {
        localStorage.setItem('app_tasks', JSON.stringify(this.tasks));
    }

    getAllTasks() {
        return this.tasks;
    }

    getTaskById(id) {
        return this.tasks.find(t => t.id === Number(id));
    }

    addTask(taskData) {
        const newId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
        const newTask = new Task(
            newId,
            taskData.title,
            taskData.dept,
            taskData.deptName,
            taskData.assignee || '',
            taskData.deadline,
            taskData.status || 'WAITING_ASSIGN',
            taskData.directive || '',
            taskData.expectedProduct || ''
        );
        this.tasks.push(newTask);
        this.saveTasks();
        return newTask;
    }

    updateTask(id, updatedData) {
        const task = this.getTaskById(id);
        if (task) {
            Object.assign(task, updatedData);
            this.saveTasks();
            return task;
        }
        return null;
    }
}