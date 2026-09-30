// ==========================================
// 1. AUTH SERVICE (Quản lý đăng nhập/Tài khoản)
// ==========================================
class AuthService {
    constructor() {
        this.STORAGE_USERS_KEY = 'ufm_users';
        this.STORAGE_CURRENT_KEY = 'ufm_current_user';
        this.initUsers();
    }

    initUsers() {
        if (!localStorage.getItem(this.STORAGE_USERS_KEY)) {
            const defaultUsers = [
                {
                    email: 'bgd@ufm.edu.vn',
                    password: '123',
                    fullName: 'Ban Giám Đốc',
                    position: 'Giám đốc Phân hiệu',
                    role: 'ADMIN_BGD',
                    deptId: 'BGD'
                },
                {
                    email: 'yenlinhbt@ufm.edu.vn',
                    password: '123',
                    fullName: 'Bùi Thị Yến Linh',
                    position: 'Trưởng phòng',
                    role: 'MANAGER',
                    deptId: 'HC-TV'
                },
                {
                    email: 'ngocthang@ufm.edu.vn',
                    password: '123',
                    fullName: 'Phạm Ngọc Thắng',
                    position: 'Nhân viên',
                    role: 'STAFF',
                    deptId: 'HC-TV'
                },
                {
                    email: 'daotao@ufm.edu.vn',
                    password: '123',
                    fullName: 'Nguyễn Văn A',
                    position: 'Trưởng phòng',
                    role: 'MANAGER',
                    deptId: 'DT-QLSV'
                },
                {
                    email: 'nvdaotao@ufm.edu.vn',
                    password: '123',
                    fullName: 'Trần Thị B',
                    position: 'Nhân viên',
                    role: 'STAFF',
                    deptId: 'DT-QLSV'
                }
            ];
            localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(defaultUsers));
        }
    }

    getUsers() {
        return JSON.parse(localStorage.getItem(this.STORAGE_USERS_KEY)) || [];
    }

    getUsersByDept(deptId) {
        const users = this.getUsers();
        if (deptId === 'ALL') return users;
        return users.filter(u => u.deptId === deptId);
    }

    getCurrentUser() {
        const userStr = localStorage.getItem(this.STORAGE_CURRENT_KEY);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    }

    login(email, password) {
        const users = this.getUsers();
        const foundUser = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password);

        if (foundUser) {
            localStorage.setItem(this.STORAGE_CURRENT_KEY, JSON.stringify(foundUser));
            return { success: true, user: foundUser };
        } else {
            return { success: false, message: 'Email hoặc mật khẩu không chính xác!' };
        }
    }

    logout() {
        localStorage.removeItem(this.STORAGE_CURRENT_KEY);
    }

    changePassword(email, oldPassword, newPassword) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());

        if (userIndex === -1) {
            return { success: false, message: 'Tài khoản không tồn tại!' };
        }

        if (users[userIndex].password !== oldPassword) {
            return { success: false, message: 'Mật khẩu hiện tại không đúng!' };
        }

        users[userIndex].password = newPassword;
        localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(users));

        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.email === email) {
            currentUser.password = newPassword;
            localStorage.setItem(this.STORAGE_CURRENT_KEY, JSON.stringify(currentUser));
        }

        return { success: true, message: 'Đổi mật khẩu thành công!' };
    }
}

// ==========================================
// 2. TASK SERVICE (Quản lý dữ liệu Công việc)
// ==========================================
class TaskService {
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

        if (dept === 'MY_TASKS') {
            tasks = tasks.filter(t => 
                (t.assignee && t.assignee.includes(currentUserName)) || 
                (t.coWorkers && t.coWorkers.some(cw => cw.includes(currentUserName)))
            );
        } else if (dept !== 'ALL') {
            tasks = tasks.filter(t => t.dept === dept);
        }

        if (selectedStaff && selectedStaff !== 'ALL') {
            tasks = tasks.filter(t => 
                (t.assignee && t.assignee.includes(selectedStaff)) || 
                (t.coWorkers && t.coWorkers.some(cw => cw.includes(selectedStaff)))
            );
        }

        if (startDate) {
            tasks = tasks.filter(t => t.deadline >= startDate);
        }
        if (endDate) {
            tasks = tasks.filter(t => t.deadline <= endDate);
        }

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

// ==========================================
// 3. MAIN APP CONTROLLER (Giao diện chính)
// ==========================================
class App {
    constructor() {
        this.authService = new AuthService();
        this.taskService = new TaskService();
        this.currentDept = 'ALL';
        this.startDate = '';
        this.endDate = '';
        this.selectedStaff = 'ALL';

        this.initUI();
    }

    formatDateShort(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const yearShort = parts[0].substring(2);
            return `${parts[2]}/${parts[1]}/${yearShort}`;
        }
        return dateStr;
    }

    initUI() {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            this.renderLoginView();
        } else {
            this.renderDashboardView(currentUser);
        }
    }

    renderLoginView() {
        const appContainer = document.getElementById('app-root') || document.body;
        appContainer.innerHTML = `
            <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl shadow-xl border border-slate-200/80 max-w-md w-full p-8">
                    <div class="text-center mb-8">
                        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-200">
                            <i class="fa-solid fa-layer-group text-2xl"></i>
                        </div>
                        <h1 class="text-2xl font-bold text-slate-800">QUẢN LÝ CÔNG VIỆC</h1>
                        <p class="text-sm text-slate-500 mt-1">Phân hiệu UFM tại tỉnh Quảng Ngãi</p>
                    </div>

                    <form id="login-form" class="space-y-5">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Email UFM</label>
                            <input type="email" id="login-email" required placeholder="yenlinhbt@ufm.edu.vn" class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Mật khẩu</label>
                            <input type="password" id="login-password" required placeholder="••••••••" class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <p class="text-[11px] text-slate-400 mt-1.5"><i class="fa-solid fa-info-circle"></i> Mật khẩu mặc định: <b class="text-indigo-600">123</b></p>
                        </div>
                        <div id="login-error" class="hidden p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium"></div>
                        <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition">Đăng Nhập</button>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const res = this.authService.login(
                document.getElementById('login-email').value,
                document.getElementById('login-password').value
            );
            if (res.success) {
                this.initUI();
            } else {
                const errDiv = document.getElementById('login-error');
                errDiv.innerText = res.message;
                errDiv.classList.remove('hidden');
            }
        });
    }

    renderDashboardView(user) {
        const appContainer = document.getElementById('app-root') || document.body;
        const isBGD = user.role === 'ADMIN_BGD' || user.position.includes('Giám đốc') || user.position.includes('Phó Giám đốc');
        const isManager = user.role === 'MANAGER' || user.role === 'SUPER_ADMIN';

        let roleBadgeHtml = user.role === 'SUPER_ADMIN'
            ? `<div class="text-xs text-amber-300 font-medium"><i class="fa-solid fa-crown text-[10px]"></i> ${user.position} (Super Admin)</div>`
            : `<div class="text-xs text-indigo-200 font-medium"><i class="fa-solid fa-user-tie text-[10px]"></i> ${user.position}</div>`;

        const btnRegisterText = isManager ? 'Đăng Ký Nhiệm Vụ Với BGĐ' : 'Đăng Ký Nhiệm Vụ Tuần Mới';

        let staffFilterHtml = '';
        if (isManager || isBGD) {
            staffFilterHtml = `
                <div id="staff-filter-container" class="hidden items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span class="text-xs font-semibold text-slate-600 pl-1"><i class="fa-solid fa-user text-indigo-600 mr-1"></i> Nhân viên:</span>
                    <select id="filter-staff-select" class="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        <option value="ALL">-- Tất cả nhân viên --</option>
                    </select>
                </div>
            `;
        }

        appContainer.innerHTML = `
            <header class="bg-indigo-900 text-white shadow-lg sticky top-0 z-30">
                <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-lg shadow">
                            <i class="fa-solid fa-layer-group"></i>
                        </div>
                        <div>
                            <h1 class="font-bold text-base tracking-wide">QUẢN LÝ CÔNG VIỆC</h1>
                            <p class="text-xs text-indigo-200">Phân hiệu UFM tại Quảng Ngãi</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <div class="text-right hidden sm:block">
                            <div class="font-semibold text-sm">${user.fullName}</div>
                            ${roleBadgeHtml}
                        </div>
                        <button id="btn-change-pass" class="p-2 bg-indigo-800 hover:bg-indigo-700 rounded-lg text-indigo-100 text-xs font-medium px-3"><i class="fa-solid fa-key mr-1"></i> Đổi Pass</button>
                        <button id="btn-logout" class="p-2 bg-rose-600/80 hover:bg-rose-600 rounded-lg text-white text-xs font-medium px-3"><i class="fa-solid fa-arrow-right-from-bracket mr-1"></i> Thoát</button>
                    </div>
                </div>
            </header>

            <main class="max-w-7xl mx-auto px-4 py-8">
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 mb-6">
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <i class="fa-solid fa-chart-line text-indigo-600"></i> Bảng Điều Khiển Tổng Quan Công Việc
                            </h2>
                            <p class="text-xs text-slate-500 mt-1">Theo dõi, giao việc và cập nhật tiến độ minh chứng</p>
                        </div>

                        <div class="flex flex-wrap items-center gap-2">
                            <div class="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                                <span class="text-xs font-semibold text-slate-600 pl-1"><i class="fa-solid fa-calendar-days text-indigo-600 mr-1"></i> Lọc thời hạn:</span>
                                <input type="date" id="filter-start-date" class="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                <span class="text-xs text-slate-400">đến</span>
                                <input type="date" id="filter-end-date" class="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                <button id="btn-apply-date" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shadow-sm transition">Lọc</button>
                                <button id="btn-clear-date" class="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-medium rounded-lg transition">Tất cả</button>
                            </div>

                            ${staffFilterHtml}

                            <button id="btn-export-excel" class="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5" title="Xuất báo cáo ra Excel">
                                <i class="fa-solid fa-file-excel text-sm"></i> Xuất Excel
                            </button>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                        <div class="flex items-center gap-2.5 overflow-x-auto pb-1">
                            ${!isBGD ? `
                                <button data-dept="MY_TASKS" class="dept-btn px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-sm transition flex items-center gap-1.5 relative">
                                    <i class="fa-solid fa-user-check"></i> Công Việc Của Tôi
                                </button>
                            ` : ''}
                            
                            <button data-dept="ALL" class="dept-btn px-4 py-2 text-xs font-semibold rounded-lg ${isBGD ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} transition flex items-center gap-1.5 relative">
                                Tất Cả Phòng Ban
                                <span id="badge-dept-ALL" class="hidden px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full shadow-sm">0</span>
                            </button>

                            <button data-dept="HC-TV" class="dept-btn px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition flex items-center gap-1.5 relative">
                                Hành Chính - Tài Vụ
                                <span id="badge-dept-HC-TV" class="hidden px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full shadow-sm">0</span>
                            </button>

                            <button data-dept="DT-QLSV" class="dept-btn px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition flex items-center gap-1.5 relative">
                                Đào Tạo - KH & QLSV
                                <span id="badge-dept-DT-QLSV" class="hidden px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full shadow-sm">0</span>
                            </button>
                        </div>

                        ${!isBGD ? `
                            <button id="btn-open-add-task" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-1.5 transition">
                                <i class="fa-solid fa-plus-circle text-sm"></i> ${btnRegisterText}
                            </button>
                        ` : ''}
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                            <div><div class="text-[11px] font-semibold text-slate-400 uppercase">TỔNG CÔNG VIỆC</div><div id="stat-total" class="text-xl font-bold text-slate-800">0</div></div>
                            <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm"><i class="fa-solid fa-list-check"></i></div>
                        </div>
                        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                            <div><div class="text-[11px] font-semibold text-slate-400 uppercase">ĐANG THỰC HIỆN</div><div id="stat-doing" class="text-xl font-bold text-amber-600">0</div></div>
                            <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm"><i class="fa-solid fa-spinner"></i></div>
                        </div>
                        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                            <div><div class="text-[11px] font-semibold text-slate-400 uppercase">ĐÃ HOÀN THÀNH</div><div id="stat-done" class="text-xl font-bold text-emerald-600">0</div></div>
                            <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm"><i class="fa-solid fa-circle-check"></i></div>
                        </div>
                        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                            <div><div class="text-[11px] font-semibold text-slate-400 uppercase">CẢNH BÁO TRỄ HẠN</div><div id="stat-late" class="text-xl font-bold text-rose-600">0</div></div>
                            <div class="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center text-sm"><i class="fa-solid fa-triangle-exclamation"></i></div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                    <div class="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                            <i class="fa-solid fa-bars-staggered text-indigo-600"></i> Danh Sách Công Việc
                        </h3>
                        <span id="task-count-label" class="text-xs text-slate-400">0 công việc</span>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                                <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                                    <th class="py-3 px-4">Tên Công Việc / Kết Quả</th>
                                    <th class="py-3 px-4">Phòng Ban</th>
                                    <th class="py-3 px-4">Chủ Trì & Phối Hợp</th>
                                    <th class="py-3 px-4 whitespace-nowrap">Thời Hạn</th>
                                    <th class="py-3 px-4">Trạng Thái & Minh Chứng</th>
                                    <th class="py-3 px-4 text-center">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody id="task-table-body" class="divide-y divide-slate-100"></tbody>
                        </table>
                    </div>
                </div>
            </main>

            <!-- MODAL BÁO CÁO TIẾN ĐỘ -->
            <div id="modal-update-task" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                    <div class="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                        <h3 class="font-bold text-slate-800 text-base"><i class="fa-solid fa-pen-to-square text-indigo-600 mr-1.5"></i> Cập Nhật Tiến Độ & Minh Chứng</h3>
                        <button id="close-modal-update" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark text-lg"></i></button>
                    </div>
                    <form id="form-update-task" class="space-y-4">
                        <input type="hidden" id="update-task-id">
                        <div>
                            <label class="block text-xs font-medium text-slate-500 mb-1">Công việc:</label>
                            <p id="update-task-title-display" class="text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200"></p>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Trạng thái công việc <span class="text-rose-500">*</span></label>
                            <select id="update-task-status" required class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500">
                                <option value="DOING">⏳ Đang thực hiện</option>
                                <option value="DONE">✅ Đã hoàn thành</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Link đính kèm minh chứng / Báo cáo</label>
                            <input type="url" id="update-task-url" placeholder="https://drive.google.com/..." class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500">
                            <p class="text-[11px] text-slate-400 mt-1"><i class="fa-solid fa-link"></i> Dán đường dẫn Google Drive, OneDrive hoặc Link kết quả</p>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Ghi chú minh chứng / Sản phẩm</label>
                            <textarea id="update-task-note" rows="2" placeholder="Ghi chú thêm về kết quả thực hiện..." class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"></textarea>
                        </div>
                        <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button type="button" id="btn-cancel-update" class="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">Hủy</button>
                            <button type="submit" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm">Báo Cáo Tiến Độ</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- MODAL ĐĂNG KÝ CÔNG VIỆC -->
            <div id="modal-add-task" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
                    <div class="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                        <div>
                            <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                                <i class="fa-solid fa-file-excel text-emerald-600 text-lg"></i> ${btnRegisterText}
                            </h3>
                            <p class="text-xs text-slate-500 mt-0.5">Nhập danh sách công việc đăng ký thực hiện trong tuần</p>
                        </div>
                        <button id="close-modal-add" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark text-xl"></i></button>
                    </div>

                    <form id="form-add-task-grid" class="flex-1 overflow-y-auto pr-1">
                        <div class="border border-slate-200 rounded-xl overflow-hidden mb-4">
                            <table class="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr class="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                                        <th class="py-2.5 px-3 w-10 text-center">STT</th>
                                        <th class="py-2.5 px-3">Tên đầu công việc <span class="text-rose-500">*</span></th>
                                        <th class="py-2.5 px-3 w-1/3">Sản phẩm / Kết quả dự kiến</th>
                                        <th class="py-2.5 px-3 w-40">Thời hạn hoàn thành <span class="text-rose-500">*</span></th>
                                        <th class="py-2.5 px-3 w-12 text-center">Xóa</th>
                                    </tr>
                                </thead>
                                <tbody id="task-grid-rows" class="divide-y divide-slate-200 bg-white"></tbody>
                            </table>
                        </div>

                        <div class="flex justify-between items-center">
                            <button type="button" id="btn-add-grid-row" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition">
                                <i class="fa-solid fa-plus text-emerald-600"></i> Thêm Dòng Công Việc
                            </button>

                            <div class="flex items-center gap-2">
                                <button type="button" id="btn-cancel-add" class="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">Hủy</button>
                                <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-md transition flex items-center gap-1.5">
                                    <i class="fa-solid fa-paper-plane"></i> Gửi Đăng Ký
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- MODAL PHÂN CÔNG -->
            <div id="modal-assign-task" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-slate-800 text-base"><i class="fa-solid fa-user-check text-indigo-600 mr-1.5"></i> Phê Duyệt & Phân Công Nhiệm Vụ</h3>
                        <button id="close-modal-assign" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark text-lg"></i></button>
                    </div>
                    <form id="form-assign-task" class="space-y-4">
                        <input type="hidden" id="assign-task-id">
                        <div>
                            <label class="block text-xs font-medium text-slate-500 mb-1">Công việc:</label>
                            <p id="assign-task-title-display" class="text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200"></p>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Người phụ trách / Chủ trì chính <span class="text-rose-500">*</span></label>
                            <select id="assign-main-user" required class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"></select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Người phối hợp (Nhấn Ctrl/Cmd để chọn nhiều)</label>
                            <select id="assign-coworkers" multiple size="4" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"></select>
                        </div>
                        <div class="flex justify-end gap-2 pt-2">
                            <button type="button" id="btn-cancel-assign" class="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">Hủy</button>
                            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-sm">Duyệt & Giao Việc</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- MODAL ĐỔI MẬT KHẨU -->
            <div id="modal-change-pass" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-slate-800 text-base"><i class="fa-solid fa-key text-indigo-600 mr-1.5"></i> Đổi Mật Khẩu Tài Khoản</h3>
                        <button id="close-modal-pass" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark text-lg"></i></button>
                    </div>
                    <form id="form-change-pass" class="space-y-4">
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">Mật khẩu hiện tại</label>
                            <input type="password" id="pass-old" required placeholder="Mật khẩu hiện tại (Mặc định: 123)" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">Mật khẩu mới</label>
                            <input type="password" id="pass-new" required minlength="3" placeholder="Mật khẩu mới" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                            <input type="password" id="pass-confirm" required minlength="3" placeholder="Nhập lại mật khẩu mới" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg">
                        </div>
                        <div id="pass-msg" class="hidden p-2.5 rounded-lg text-xs font-medium"></div>
                        <div class="flex justify-end gap-2 pt-2">
                            <button type="button" id="btn-cancel-pass" class="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">Hủy</button>
                            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-sm">Cập Nhật</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.currentDept = isBGD ? 'ALL' : 'MY_TASKS';

        this.bindEvents(user);
        this.updateStaffFilterDropdown(user);
        this.renderTaskTable(user);
    }

    updateStaffFilterDropdown(user) {
        const staffFilterContainer = document.getElementById('staff-filter-container');
        const staffSelect = document.getElementById('filter-staff-select');

        if (!staffFilterContainer || !staffSelect) return;

        if (this.currentDept === 'HC-TV' || this.currentDept === 'DT-QLSV') {
            staffFilterContainer.classList.remove('hidden');
            staffFilterContainer.classList.add('flex');

            const usersInDept = this.authService.getUsersByDept(this.currentDept);
            staffSelect.innerHTML = `<option value="ALL">-- Tất cả nhân viên --</option>`;
            usersInDept.forEach(u => {
                const opt = document.createElement('option');
                opt.value = u.fullName;
                opt.innerText = `${u.fullName} - ${u.position}`;
                if (this.selectedStaff === u.fullName) opt.selected = true;
                staffSelect.appendChild(opt);
            });
        } else {
            staffFilterContainer.classList.add('hidden');
            staffFilterContainer.classList.remove('flex');
            this.selectedStaff = 'ALL';
        }
    }

    updateDeptBadges() {
        ['ALL', 'HC-TV', 'DT-QLSV'].forEach(deptCode => {
            const count = this.taskService.getUnassignedCountByDept(deptCode);
            const badgeEl = document.getElementById(`badge-dept-${deptCode}`);
            if (badgeEl) {
                if (count > 0) {
                    badgeEl.innerText = count;
                    badgeEl.classList.remove('hidden');
                } else {
                    badgeEl.classList.add('hidden');
                }
            }
        });
    }

    bindEvents(user) {
        document.querySelectorAll('.dept-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.dept-btn').forEach(b => {
                    b.className = "dept-btn px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition flex items-center gap-1.5 relative";
                });
                const targetBtn = e.currentTarget;
                targetBtn.className = "dept-btn px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-sm transition flex items-center gap-1.5 relative";
                
                this.currentDept = targetBtn.getAttribute('data-dept');
                this.selectedStaff = 'ALL';
                
                this.updateStaffFilterDropdown(user);
                this.renderTaskTable(user);
            });
        });

        const staffSelect = document.getElementById('filter-staff-select');
        if (staffSelect) {
            staffSelect.addEventListener('change', (e) => {
                this.selectedStaff = e.target.value;
                this.renderTaskTable(user);
            });
        }

        document.getElementById('btn-apply-date').addEventListener('click', () => {
            this.startDate = document.getElementById('filter-start-date').value;
            this.endDate = document.getElementById('filter-end-date').value;
            this.renderTaskTable(user);
        });

        document.getElementById('btn-clear-date').addEventListener('click', () => {
            document.getElementById('filter-start-date').value = '';
            document.getElementById('filter-end-date').value = '';
            this.startDate = '';
            this.endDate = '';
            this.renderTaskTable(user);
        });

        document.getElementById('btn-export-excel').addEventListener('click', () => {
            this.exportTasksToExcel3Columns(user);
        });

        document.getElementById('btn-logout').addEventListener('click', () => {
            this.authService.logout();
            this.initUI();
        });

        const modalPass = document.getElementById('modal-change-pass');
        document.getElementById('btn-change-pass').addEventListener('click', () => modalPass.classList.remove('hidden'));
        document.getElementById('close-modal-pass').addEventListener('click', () => modalPass.classList.add('hidden'));
        document.getElementById('btn-cancel-pass').addEventListener('click', () => modalPass.classList.add('hidden'));

        document.getElementById('form-change-pass').addEventListener('submit', (e) => {
            e.preventDefault();
            const oldP = document.getElementById('pass-old').value;
            const newP = document.getElementById('pass-new').value;
            const confP = document.getElementById('pass-confirm').value;
            const msgDiv = document.getElementById('pass-msg');

            if (newP !== confP) {
                msgDiv.className = "p-2.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-600";
                msgDiv.innerText = "Mật khẩu xác nhận không trùng!";
                msgDiv.classList.remove('hidden');
                return;
            }

            const res = this.authService.changePassword(user.email, oldP, newP);
            if (res.success) {
                msgDiv.className = "p-2.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-600";
                msgDiv.innerText = res.message;
                msgDiv.classList.remove('hidden');
                setTimeout(() => {
                    modalPass.classList.add('hidden');
                    document.getElementById('form-change-pass').reset();
                    msgDiv.classList.add('hidden');
                }, 1000);
            } else {
                msgDiv.className = "p-2.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-600";
                msgDiv.innerText = res.message;
                msgDiv.classList.remove('hidden');
            }
        });

        const modalAdd = document.getElementById('modal-add-task');
        const btnOpenAdd = document.getElementById('btn-open-add-task');
        const gridTbody = document.getElementById('task-grid-rows');

        const createGridRow = (stt) => {
            const tr = document.createElement('tr');
            tr.className = "grid-row hover:bg-slate-50/80 transition";
            tr.innerHTML = `
                <td class="py-2 px-3 text-center font-semibold text-slate-500 row-stt">${stt}</td>
                <td class="py-2 px-2">
                    <input type="text" class="row-title w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Nhập tên công việc..." required>
                </td>
                <td class="py-2 px-2">
                    <input type="text" class="row-product w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Sản phẩm/Tờ trình...">
                </td>
                <td class="py-2 px-2">
                    <input type="date" class="row-deadline w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500" required>
                </td>
                <td class="py-2 px-2 text-center">
                    <button type="button" class="btn-remove-row text-slate-400 hover:text-rose-600 transition"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            `;

            tr.querySelector('.btn-remove-row').addEventListener('click', () => {
                if (gridTbody.children.length > 1) {
                    tr.remove();
                    Array.from(gridTbody.children).forEach((r, idx) => {
                        r.querySelector('.row-stt').innerText = idx + 1;
                    });
                } else {
                    alert('Phải có ít nhất 1 dòng công việc!');
                }
            });

            return tr;
        };

        const resetAndInitGrid = () => {
            gridTbody.innerHTML = '';
            gridTbody.appendChild(createGridRow(1));
            gridTbody.appendChild(createGridRow(2));
            gridTbody.appendChild(createGridRow(3));
        };

        if (btnOpenAdd) {
            btnOpenAdd.addEventListener('click', () => {
                resetAndInitGrid();
                modalAdd.classList.remove('hidden');
            });
        }

        const btnAddRow = document.getElementById('btn-add-grid-row');
        if (btnAddRow) {
            btnAddRow.addEventListener('click', () => {
                const nextStt = gridTbody.children.length + 1;
                gridTbody.appendChild(createGridRow(nextStt));
            });
        }

        const closeAdd = document.getElementById('close-modal-add');
        if (closeAdd) closeAdd.addEventListener('click', () => modalAdd.classList.add('hidden'));
        
        const cancelAdd = document.getElementById('btn-cancel-add');
        if (cancelAdd) cancelAdd.addEventListener('click', () => modalAdd.classList.add('hidden'));

        const formAddGrid = document.getElementById('form-add-task-grid');
        if (formAddGrid) {
            formAddGrid.addEventListener('submit', (e) => {
                e.preventDefault();
                const rows = Array.from(gridTbody.querySelectorAll('.grid-row'));
                const tasksToAdd = [];
                const deptId = user.deptId || 'HC-TV';
                const deptName = deptId === 'HC-TV' ? 'Hành chính - Tài vụ' : 'Đào tạo - KH & QLSV';

                const isStaff = user.role === 'STAFF';
                const assigneeName = `${user.fullName} (${user.position})`;

                rows.forEach(r => {
                    const title = r.querySelector('.row-title').value.trim();
                    const product = r.querySelector('.row-product').value.trim();
                    const deadline = r.querySelector('.row-deadline').value;

                    if (title && deadline) {
                        tasksToAdd.push({
                            title,
                            expectedProduct: product,
                            deadline,
                            dept: deptId,
                            deptName: deptName,
                            assignee: assigneeName
                        });
                    }
                });

                if (tasksToAdd.length > 0) {
                    this.taskService.addMultipleTasks(tasksToAdd, isStaff);
                    modalAdd.classList.add('hidden');
                    this.renderTaskTable(user);
                }
            });
        }

        const modalAssign = document.getElementById('modal-assign-task');
        document.getElementById('close-modal-assign').addEventListener('click', () => modalAssign.classList.add('hidden'));
        document.getElementById('btn-cancel-assign').addEventListener('click', () => modalAssign.classList.add('hidden'));

        document.getElementById('form-assign-task').addEventListener('submit', (e) => {
            e.preventDefault();
            const taskId = parseInt(document.getElementById('assign-task-id').value);
            const mainUser = document.getElementById('assign-main-user').value;
            
            const selectCo = document.getElementById('assign-coworkers');
            const coWorkers = Array.from(selectCo.selectedOptions).map(opt => opt.value);

            this.taskService.assignTask(taskId, mainUser, coWorkers);
            modalAssign.classList.add('hidden');
            this.renderTaskTable(user);
        });

        const modalUpdate = document.getElementById('modal-update-task');
        document.getElementById('close-modal-update').addEventListener('click', () => modalUpdate.classList.add('hidden'));
        document.getElementById('btn-cancel-update').addEventListener('click', () => modalUpdate.classList.add('hidden'));

        document.getElementById('form-update-task').addEventListener('submit', (e) => {
            e.preventDefault();
            const taskId = parseInt(document.getElementById('update-task-id').value);
            const status = document.getElementById('update-task-status').value;
            const proofUrl = document.getElementById('update-task-url').value.trim();
            const proofNote = document.getElementById('update-task-note').value.trim();

            this.taskService.updateTaskStatusAndProof(taskId, status, proofUrl, proofNote);
            modalUpdate.classList.add('hidden');
            this.renderTaskTable(user);
        });
    }

    exportTasksToExcel3Columns(user) {
        const tasks = this.taskService.getTasks(this.currentDept, this.startDate, this.endDate, user.fullName, this.selectedStaff);
        if (tasks.length === 0) {
            alert('Không có dữ liệu công việc phù hợp với bộ lọc hiện tại để xuất Excel!');
            return;
        }

        const timeRangeLabel = (this.startDate && this.endDate) 
            ? `${this.formatDateShort(this.startDate)} đến ${this.formatDateShort(this.endDate)}` 
            : 'Tất cả thời gian';

        let tableRows = '';
        tasks.forEach(t => {
            let rawAssignee = t.assignee || '';
            const idxOpenParen = rawAssignee.indexOf('(');
            if (idxOpenParen !== -1) {
                rawAssignee = rawAssignee.substring(0, idxOpenParen).trim();
            }

            tableRows += `
                <tr>
                    <td style="mso-number-format:'\\@';">${timeRangeLabel}</td>
                    <td style="mso-number-format:'\\@';">${rawAssignee}</td>
                    <td style="mso-number-format:'\\@';">${t.title || ''}</td>
                </tr>
            `;
        });

        const excelTemplate = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
                <!--[if gte mso 9]>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>Báo cáo công việc</x:Name>
                                <x:WorksheetOptions>
                                    <x:DisplayGridlines/>
                                </x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <![endif]-->
                <style>
                    td, th { font-family: Arial; font-size: 11pt; padding: 5px; }
                    th { font-weight: bold; background-color: #f2f2f2; border: 0.5pt solid #ccc; }
                    td { border: 0.5pt solid #ccc; }
                </style>
            </head>
            <body>
                <table>
                    <thead>
                        <tr>
                            <th>Từ ngày đến ngày</th>
                            <th>Họ và Tên</th>
                            <th>Công việc</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        const staffLabel = this.selectedStaff !== 'ALL' ? `_${this.selectedStaff.replace(/\s+/g, '_')}` : '_Tat_ca';
        link.setAttribute("href", url);
        link.setAttribute("download", `Bao_cao_cong_viec${staffLabel}.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    renderTaskTable(user) {
        this.updateDeptBadges();

        const tbody = document.getElementById('task-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        const isBGD = user.role === 'ADMIN_BGD' || user.position.includes('Giám đốc') || user.position.includes('Phó Giám đốc');
        const isManager = user.role === 'MANAGER' || user.role === 'SUPER_ADMIN';

        let tasks = this.taskService.getTasks(this.currentDept, this.startDate, this.endDate, user.fullName, this.selectedStaff);

        document.getElementById('stat-total').innerText = tasks.length;
        document.getElementById('stat-doing').innerText = tasks.filter(t => t.status === 'DOING').length;
        document.getElementById('stat-done').innerText = tasks.filter(t => t.status === 'DONE').length;
        document.getElementById('stat-late').innerText = tasks.filter(t => t.status === 'LATE').length;
        document.getElementById('task-count-label').innerText = `Hiển thị ${tasks.length} công việc`;

        if (tasks.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-400">Không tìm thấy công việc nào phù hợp.</td></tr>`;
            return;
        }

        tasks.forEach(task => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-slate-50/80 transition";

            let statusBadge = '';
            if (task.status === 'WAITING_ASSIGN') {
                statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700"><i class="fa-solid fa-clock mr-1"></i> Mới đăng ký</span>`;
            } else if (task.status === 'LATE') {
                statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700"><i class="fa-solid fa-circle text-[8px] mr-1"></i> Trễ Hạn</span>`;
            } else if (task.status === 'DOING') {
                statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><i class="fa-solid fa-spinner mr-1"></i> Đang Làm</span>`;
            } else {
                statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700"><i class="fa-solid fa-circle-check mr-1"></i> Hoàn Thành</span>`;
            }

            let proofHtml = '';
            if (task.proofUrl) {
                proofHtml = `<div class="mt-1 text-xs"><a href="${task.proofUrl}" target="_blank" class="text-indigo-600 hover:underline font-semibold flex items-center gap-1"><i class="fa-solid fa-link text-indigo-500"></i> Xem Minh chứng / File</a></div>`;
            }
            if (task.proofNote) {
                proofHtml += `<div class="text-[11px] text-slate-500 italic mt-0.5"><i class="fa-solid fa-comment-dots mr-1"></i> Ghi chú: ${task.proofNote}</div>`;
            }

            let coWorkerText = task.coWorkers && task.coWorkers.length > 0
                ? `<div class="text-[11px] text-slate-500 mt-0.5"><i class="fa-solid fa-users text-indigo-500 mr-1"></i> <b>Phối hợp:</b> ${task.coWorkers.join(', ')}</div>`
                : '';

            const canManageThisTask = isManager && (user.role === 'SUPER_ADMIN' || user.deptId === task.dept);
            const isManagerDirectlyAssigned = task.assignee.includes(user.fullName);
            const isStaffAssignedToMe = !isManager && (task.assignee.includes(user.fullName) || (task.coWorkers && task.coWorkers.some(cw => cw.includes(user.fullName))));

            let actionBtnHtml = '';

            if (isBGD) {
                actionBtnHtml = `<button class="btn-directive text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md text-xs font-medium"><i class="fa-solid fa-comment-dots mr-1"></i> Cho chỉ đạo</button>`;
            } else if (canManageThisTask) {
                const btnLabel = task.status === 'WAITING_ASSIGN' ? 'Phê duyệt & Giao việc' : 'Giao việc';
                
                if (isManagerDirectlyAssigned && task.status !== 'WAITING_ASSIGN') {
                    actionBtnHtml = `
                        <div class="flex items-center justify-center gap-1.5">
                            <button class="btn-assign text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md text-xs font-medium" title="Phân công nhân viên"><i class="fa-solid fa-user-plus mr-1"></i> ${btnLabel}</button>
                            <button class="btn-update-proof text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md text-xs font-medium" title="Minh chứng"><i class="fa-solid fa-pen-to-square mr-1"></i> Minh chứng</button>
                        </div>
                    `;
                } else {
                    actionBtnHtml = `
                        <button class="btn-assign text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md text-xs font-medium"><i class="fa-solid fa-user-plus mr-1"></i> ${btnLabel}</button>
                    `;
                }
            } else if (isStaffAssignedToMe) {
                if (task.status === 'WAITING_ASSIGN') {
                    actionBtnHtml = `<span class="text-sky-600 text-xs italic"><i class="fa-solid fa-hourglass-half mr-1"></i> Chờ Trưởng phòng duyệt</span>`;
                } else {
                    actionBtnHtml = `<button class="btn-update-proof text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md text-xs font-medium"><i class="fa-solid fa-pen-to-square mr-1"></i> Báo cáo / Minh chứng</button>`;
                }
            } else {
                actionBtnHtml = `<span class="text-slate-400 text-xs italic">Xem</span>`;
            }

            const formattedDeadline = this.formatDateShort(task.deadline);

            tr.innerHTML = `
                <td class="py-3.5 px-4 font-medium text-slate-900">
                    <div>${task.title}</div>
                    ${task.expectedProduct ? `<div class="text-xs text-slate-500 font-normal mt-0.5"><i class="fa-solid fa-box-archive mr-1"></i><b>Sản phẩm:</b> ${task.expectedProduct}</div>` : ''}
                    ${task.directive ? `<div class="text-xs text-indigo-700 mt-1 bg-indigo-50 p-1.5 rounded border border-indigo-100"><i class="fa-solid fa-bullhorn mr-1"></i><b>Lãnh đạo Chỉ đạo:</b> ${task.directive}</div>` : ''}
                </td>
                <td class="py-3.5 px-4"><span class="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border whitespace-nowrap">${task.deptName}</span></td>
                <td class="py-3.5 px-4">
                    <div class="font-semibold text-slate-800">${task.assignee}</div>
                    ${coWorkerText}
                </td>
                <td class="py-3.5 px-4 font-medium whitespace-nowrap ${task.status === 'LATE' ? 'text-rose-600' : 'text-slate-700'}">${formattedDeadline}</td>
                <td class="py-3.5 px-4">
                    <div>${statusBadge}</div>
                    ${proofHtml}
                </td>
                <td class="py-3.5 px-4 text-center whitespace-nowrap">${actionBtnHtml}</td>
            `;

            if (isBGD && tr.querySelector('.btn-directive')) {
                tr.querySelector('.btn-directive').addEventListener('click', () => {
                    const directive = prompt(`Nhập ý kiến chỉ đạo của BGĐ cho:\n"${task.title}"`);
                    if (directive) {
                        this.taskService.addDirective(task.id, directive);
                        this.renderTaskTable(user);
                    }
                });
            }

            if (canManageThisTask && tr.querySelector('.btn-assign')) {
                tr.querySelector('.btn-assign').addEventListener('click', () => {
                    const modalAssign = document.getElementById('modal-assign-task');
                    document.getElementById('assign-task-id').value = task.id;
                    document.getElementById('assign-task-title-display').innerText = task.title;

                    const deptUsers = this.authService.getUsersByDept(task.dept);
                    const selectMain = document.getElementById('assign-main-user');
                    const selectCo = document.getElementById('assign-coworkers');

                    selectMain.innerHTML = '';
                    selectCo.innerHTML = '';

                    deptUsers.forEach(u => {
                        const optMain = document.createElement('option');
                        optMain.value = `${u.fullName} (${u.position})`;
                        optMain.innerText = `${u.fullName} - ${u.position}`;
                        if (task.assignee.includes(u.fullName)) optMain.selected = true;
                        selectMain.appendChild(optMain);

                        const optCo = document.createElement('option');
                        optCo.value = u.fullName;
                        optCo.innerText = `${u.fullName} (${u.position})`;
                        if (task.coWorkers && task.coWorkers.includes(u.fullName)) optCo.selected = true;
                        selectCo.appendChild(optCo);
                    });

                    modalAssign.classList.remove('hidden');
                });
            }

            if (tr.querySelector('.btn-update-proof')) {
                tr.querySelector('.btn-update-proof').addEventListener('click', () => {
                    const modalUpdate = document.getElementById('modal-update-task');
                    document.getElementById('update-task-id').value = task.id;
                    document.getElementById('update-task-title-display').innerText = task.title;
                    document.getElementById('update-task-status').value = task.status === 'DONE' ? 'DONE' : 'DOING';
                    document.getElementById('update-task-url').value = task.proofUrl || '';
                    document.getElementById('update-task-note').value = task.proofNote || '';

                    modalUpdate.classList.remove('hidden');
                });
            }

            tbody.appendChild(tr);
        });
    }
}

// Khởi chạy ứng dụng khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});