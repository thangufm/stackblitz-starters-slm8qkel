export class TaskService {
    constructor() {
        this.STORAGE_TASKS_KEY = 'ufm_tasks';
        this.initTasks();
    }

    initTasks() {
        if (!localStorage.getItem(this.STORAGE_TASKS_KEY)) {
            const defaultTasks = [
                {
                    id: 1,
                    title: 'Lập kế hoạch công tác tuần mới',
                    expectedProduct: 'Bản kế hoạch PDF',
                    deadline: '2026-10-05',
                    dept: 'HC-TV',
                    deptName: 'Hành chính - Tài vụ',
                    assignee: 'Bùi Thị Yến Linh (Trưởng phòng)',
                    coWorkers: ['Phạm Ngọc Thắng'],
                    status: 'DOING',
                    proofUrl: '',
                    proofNote: '',
                    directive: ''
                },
                {
                    id: 2,
                    title: 'Báo cáo tình hình quản lý thiết bị CNTT',
                    expectedProduct: 'Tờ trình & Bảng thống kê',
                    deadline: '2026-10-10',
                    dept: 'HC-TV',
                    deptName: 'Hành chính - Tài vụ',
                    assignee: 'Phạm Ngọc Thắng (Nhân viên)',
                    coWorkers: [],
                    status: 'WAITING_ASSIGN',
                    proofUrl: '',
                    proofNote: '',
                    directive: ''
                }
            ];
            localStorage.setItem(this.STORAGE_TASKS_KEY, JSON.stringify(defaultTasks));
        }
    }

    getTasks(dept = 'ALL', startDate = '', endDate = '', currentUserName = '', selectedStaff = 'ALL') {
        let tasks = JSON.parse(localStorage.getItem(this.STORAGE_TASKS_KEY)) || [];

        // Lọc theo phòng ban
        if (dept === 'MY_TASKS') {
            tasks = tasks.filter(t => 
                (t.assignee && t.assignee.includes(currentUserName)) || 
                (t.coWorkers && t.coWorkers.some(cw => cw.includes(currentUserName)))
            );
        } else if (dept !== 'ALL') {
            tasks = tasks.filter(t => t.dept === dept);
        }

        // Lọc theo nhân viên được chọn
        if (selectedStaff && selectedStaff !== 'ALL') {
            tasks = tasks.filter(t => 
                (t.assignee && t.assignee.includes(selectedStaff)) || 
                (t.coWorkers && t.coWorkers.some(cw => cw.includes(selectedStaff)))
            );
        }

        // Lọc theo ngày
        if (startDate) {
            tasks = tasks.filter(t => t.deadline >= startDate);
        }
        if (endDate) {
            tasks = tasks.filter(t => t.deadline <= endDate);
        }

        // Cập nhật tự động trạng thái trễ hạn (LATE)
        const today = new Date().toISOString().split('T')[0];
        tasks.forEach(t => {
            if (t.status !== 'DONE' && t.deadline < today) {
                t.status = 'LATE';
            }
        });

        return tasks;
    }

    getUnassignedCountByDept(deptCode) {
        const tasks = JSON.parse(localStorage.getItem(this.STORAGE_TASKS_KEY)) || [];
        if (deptCode === 'ALL') {
            return tasks.filter(t => t.status === 'WAITING_ASSIGN').length;
        }
        return tasks.filter(t => t.dept === deptCode && t.status === 'WAITING_ASSIGN').length;
    }

    addMultipleTasks(tasksArray, isStaff = false) {
        const tasks = JSON.parse(localStorage.getItem(this.STORAGE_TASKS_KEY)) || [];
        let maxId = tasks.reduce((max, t) => t.id > max ? t.id : max, 0);

        tasksArray.forEach(t => {
            maxId++;
            tasks.push({
                id: maxId,
                title: t.title,
                expectedProduct: t.expectedProduct || '',
                deadline: t.deadline,
                dept: t.dept,
                deptName: t.deptName,
                assignee: t.assignee || 'Chưa phân công',
                coWorkers: [],
                status: isStaff ? 'WAITING_ASSIGN' : 'DOING',
                proofUrl: '',
                proofNote: '',
                directive: ''
            });
        });

        localStorage.setItem(this.STORAGE_TASKS_KEY, JSON.stringify(tasks));
    }

    assignTask(taskId, mainUser, coWorkers) {
        const tasks = JSON.parse(localStorage.getItem(this.STORAGE_TASKS_KEY)) || [];
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.assignee = mainUser;
            task.coWorkers = coWorkers;
            if (task.status === 'WAITING_ASSIGN') {
                task.status = 'DOING';
            }
            localStorage.setItem(this.STORAGE_TASKS_KEY, JSON.stringify(tasks));
        }
    }

    updateTaskStatusAndProof(taskId, status, proofUrl, proofNote) {
        const tasks = JSON.parse(localStorage.getItem(this.STORAGE_TASKS_KEY)) || [];
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = status;
            task.proofUrl = proofUrl;
            task.proofNote = proofNote;
            localStorage.setItem(this.STORAGE_TASKS_KEY, JSON.stringify(tasks));
        }
    }

    addDirective(taskId, directive) {
        const tasks = JSON.parse(localStorage.getItem(this.STORAGE_TASKS_KEY)) || [];
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.directive = directive;
            localStorage.setItem(this.STORAGE_TASKS_KEY, JSON.stringify(tasks));
        }
    }
}