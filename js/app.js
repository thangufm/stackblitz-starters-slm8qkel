// ==========================================
// 1. CLASS USER & AUTH SERVICE
// ==========================================
class User {
    constructor(email, fullName, position, deptId, role, password = '123') {
        this.email = email;
        this.fullName = fullName;
        this.position = position;
        this.deptId = deptId;
        this.role = role; // 'SUPER_ADMIN', 'ADMIN_BGD', 'MANAGER', 'STAFF'
        this.password = password;
    }
}

class AuthService {
    constructor() {
        const savedUsers = localStorage.getItem('ufm_users');
        if (savedUsers) {
            this.users = JSON.parse(savedUsers).map(u => new User(u.email, u.fullName, u.position, u.deptId, u.role, u.password));
        } else {
            this.users = [
                // Ban Giám đốc
                new User('yenlinhbt@ufm.edu.vn', 'Bùi Thị Yến Linh', 'Giám đốc Phân hiệu', 'BGD', 'ADMIN_BGD'),
                new User('lexuanlam@ufm.edu.vn', 'Lê Xuân Lãm', 'Phó Giám đốc Phân hiệu', 'BGD', 'ADMIN_BGD'),
                
                // Phòng Hành chính - Tài vụ
                new User('tranthibichlien@ufm.edu.vn', 'Trần Thị Bích Liên', 'Trưởng Phòng', 'HC-TV', 'MANAGER'),
                new User('nguyenthiphoungthao@ufm.edu.vn', 'Nguyễn Thị Phương Thảo', 'Phó Trưởng phòng', 'HC-TV', 'MANAGER'),
                new User('tranthitam@ufm.edu.vn', 'Trần Thị Tâm', 'Nhân viên văn thư', 'HC-TV', 'STAFF'),
                new User('huynhthianhtung@ufm.edu.vn', 'Huỳnh Thị Anh Tùng', 'Kế toán viên', 'HC-TV', 'STAFF'),
                new User('nguyenthikimdung@ufm.edu.vn', 'Nguyễn Thị Kim Dung', 'Chuyên viên', 'HC-TV', 'STAFF'),
                new User('phamngocthang@ufm.edu.vn', 'Phạm Ngọc Thắng', 'Chuyên viên chính', 'HC-TV', 'SUPER_ADMIN'),
                new User('dinhthanhha@ufm.edu.vn', 'Đinh Thanh Hà', 'Kỹ sư', 'HC-TV', 'STAFF'),
                new User('tranthang@ufm.edu.vn', 'Bùi Trần Quyết Thắng', 'Kỹ sư', 'HC-TV', 'STAFF'),

                // Phòng Đào tạo - KH & QLSV
                new User('phamhoainam@ufm.edu.vn', 'Phạm Hoài Nam', 'Trưởng phòng', 'DT-QLSV', 'MANAGER'),
                new User('huynhngocnghiem@ufm.edu.vn', 'Huỳnh Ngọc Nghiêm', 'Phó Trưởng phòng', 'DT-QLSV', 'MANAGER'),
                new User('tranquanghai@ufm.edu.vn', 'Trần Quang Hải', 'Phó Trưởng phòng', 'DT-QLSV', 'MANAGER'),
                new User('vovanthao@ufm.edu.vn', 'Võ Văn Thảo', 'Chuyên viên', 'DT-QLSV', 'STAFF'),
                new User('tathiquynhngoc@ufm.edu.vn', 'Tạ Thị Quỳnh Ngọc', 'Chuyên viên chính', 'DT-QLSV', 'STAFF'),
                new User('huynhthithanhri@ufm.edu.vn', 'Huỳnh Thị Thanh Ri', 'Giảng viên', 'DT-QLSV', 'STAFF'),
                new User('tuyetdung.le@ufm.edu.vn', 'Lê Thị Tuyết Dung', 'Giảng viên chính', 'DT-QLSV', 'STAFF')
            ];
            this.saveUsers();
        }
    }

    saveUsers() {
        localStorage.setItem('ufm_users', JSON.stringify(this.users));
    }

    getUsersByDept(deptId) {
        return this.users.filter(u => u.deptId === deptId);
    }

    login(email, password) {
        const user = this.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!user) return { success: false, message: 'Email không tồn tại trong hệ thống UFM!' };
        if (user.password !== password) return { success: false, message: 'Mật khẩu không chính xác! (Mặc định: 123)' };
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
    }

    logout() {
        sessionStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        const u = sessionStorage.getItem('currentUser');
        return u ? JSON.parse(u) : null;
    }

    changePassword(email, oldPassword, newPassword) {
        const user = this.users.find(u => u.email === email);
        if (user) {
            if (user.password !== oldPassword) return { success: false, message: 'Mật khẩu hiện tại không đúng!' };
            user.password = newPassword;
            this.saveUsers();
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true, message: 'Đổi mật khẩu thành công!' };
        }
        return { success: false, message: 'Lỗi tài khoản!' };
    }
}

// ==========================================
// 2. CLASS TASK & TASK SERVICE
// ==========================================
class Task {
    constructor(id, title, dept, deptName, assignee, deadline, status, directive = '', expectedProduct = '', coWorkers = [], proofUrl = '', proofNote = '') {
        this.id = id;
        this.title = title;
        this.dept = dept;
        this.deptName = deptName;
        this.assignee = assignee;         // Người chủ trì chính
        this.coWorkers = coWorkers;       // Danh sách người phối hợp (Mảng tên)
        this.deadline = deadline;         // YYYY-MM-DD
        this.status = status;             // 'REGISTERED', 'DOING', 'DONE', 'LATE'
        this.directive = directive;       // Chỉ đạo BGĐ / Lãnh đạo
        this.expectedProduct = expectedProduct; 
        this.proofUrl = proofUrl;         // Link đính kèm minh chứng
        this.proofNote = proofNote;       
    }

    setDirective(text) {
        this.directive = text;
    }

    assignTask(assignee, coWorkers = []) {
        this.assignee = assignee;
        this.coWorkers = coWorkers;
        // Nếu đang ở trạng thái 'Mới đăng ký', khi giao việc sẽ chuyển sang 'Đang thực hiện'
        if (this.status === 'REGISTERED') {
            this.status = 'DOING';
        }
    }

    updateStatusAndProof(newStatus, proofUrl, proofNote) {
        this.status = newStatus;
        this.proofUrl = proofUrl;
        this.proofNote = proofNote;
    }
}

class TaskService {
    constructor() {
        const savedTasks = localStorage.getItem('ufm_tasks');
        if (savedTasks) {
            const raw = JSON.parse(savedTasks);
            this.tasks = raw.map(t => new Task(t.id, t.title, t.dept, t.deptName, t.assignee, t.deadline, t.status, t.directive, t.expectedProduct, t.coWorkers || [], t.proofUrl || '', t.proofNote || ''));
        } else {
            this.tasks = [
                new Task(1, 'Báo cáo kiểm kê tài sản & hạ tầng CNTT Quý 3/2026', 'HC-TV', 'Hành chính - Tài vụ', 'Trần Thị Bích Liên (Trưởng Phòng)', '2026-09-30', 'LATE', '', 'Bảng tổng hợp kiểm kê', ['Phạm Ngọc Thắng', 'Đinh Thanh Hà']),
                new Task(2, 'Triển khai bảo trì hệ thống mạng máy tính phòng họp', 'HC-TV', 'Hành chính - Tài vụ', 'Đinh Thanh Hà (Kỹ sư)', '2026-10-02', 'DOING', '', 'Mạng ổn định', ['Bùi Trần Quyết Thắng']),
                new Task(3, 'Thanh toán chi phí điện nước và dịch vụ vệ sinh tháng 9', 'HC-TV', 'Hành chính - Tài vụ', 'Huỳnh Thị Anh Tùng (Kế toán viên)', '2026-09-29', 'DONE', '', 'Hóa đơn chứng từ', [], 'https://drive.google.com/file/d/sample_bill', 'Đã chuyển kế toán duyệt'),
                new Task(4, 'Lập danh sách sinh viên xét học bổng học kỳ 1', 'DT-QLSV', 'Đào tạo - KH & QLSV', 'Phạm Hoài Nam (Trưởng phòng)', '2026-10-03', 'DOING', '', 'Danh sách SV đạt chuẩn', ['Võ Văn Thảo', 'Tạ Thị Quỳnh Ngọc']),
                new Task(5, 'Cập nhật thời khóa biểu bổ sung cho các lớp buổi tối', 'DT-QLSV', 'Đào tạo - KH & QLSV', 'Tạ Thị Quỳnh Ngọc (Chuyên viên chính)', '2026-10-01', 'REGISTERED', '', 'TKB công bố trên web', []),
                new Task(6, 'Tổng hợp đề xuất đề tài nghiên cứu khoa học cấp cơ sở', 'DT-QLSV', 'Đào tạo - KH & QLSV', 'Huỳnh Ngọc Nghiêm (Phó Trưởng phòng)', '2026-09-28', 'LATE', '', 'Danh mục đề tài KH', ['Lê Thị Tuyết Dung'])
            ];
            this.saveTasks();
        }
    }

    saveTasks() {
        localStorage.setItem('ufm_tasks', JSON.stringify(this.tasks));
    }

    getTasks(deptCode = 'ALL', startDate = '', endDate = '', userFullName = '') {
        let list = this.tasks;
        
        if (deptCode === 'MY_TASKS' && userFullName) {
            list = list.filter(t => t.assignee.includes(userFullName) || (t.coWorkers && t.coWorkers.some(cw => cw.includes(userFullName))));
        } else if (deptCode !== 'ALL') {
            list = list.filter(t => t.dept === deptCode);
        }

        if (startDate) list = list.filter(t => t.deadline >= startDate);
        if (endDate) list = list.filter(t => t.deadline <= endDate);

        return list;
    }

    addMultipleTasks(taskList, initialStatus = 'DOING') {
        taskList.forEach((t, idx) => {
            const newId = Date.now() + idx;
            const newTask = new Task(newId, t.title, t.dept, t.deptName, t.assignee || 'Chưa phân công', t.deadline, initialStatus, '', t.expectedProduct, []);
            this.tasks.unshift(newTask);
        });
        this.saveTasks();
    }

    assignTask(taskId, assignee, coWorkers) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.assignTask(assignee, coWorkers);
            this.saveTasks();
            return true;
        }
        return false;
    }

    updateTaskStatusAndProof(taskId, status, proofUrl, proofNote) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.updateStatusAndProof(status, proofUrl, proofNote);
            this.saveTasks();
            return true;
        }
        return false;
    }

    addDirective(taskId, directiveText) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.setDirective(directiveText);
            this.saveTasks();
            return true;
        }
        return false;
    }
}

// ==========================================
// 3. MAIN APP CONTROLLER
// ==========================================
class App {
    constructor() {
        this.authService = new AuthService();
        this.taskService = new TaskService();
        this.currentDept = 'ALL';
        this.startDate = '';
        this.endDate = '';

        this.initUI();
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
                            <input type="email" id="login-email" required placeholder="tranthibichlien@ufm.edu.vn" class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Mật khẩu</label>
                            <input type="password" id="login-password" required placeholder="••••••••" class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <p class="text-[11px] text-slate-400 mt-1.5"><i class="fa-solid fa-info-circle"></i> Mật khẩu khởi đầu mặc định: <b class="text-indigo-600">123</b></p>
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
        const isBGD = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN_BGD';
        const isManager = user.role === 'MANAGER' || user.role === 'SUPER_ADMIN';

        let roleBadgeHtml = user.role === 'SUPER_ADMIN'
            ? `<div class="text-xs text-amber-300 font-medium"><i class="fa-solid fa-crown text-[10px]"></i> ${user.position} (Super Admin)</div>`
            : `<div class="text-xs text-indigo-200 font-medium"><i class="fa-solid fa-user-tie text-[10px]"></i> ${user.position}</div>`;

        const btnRegisterText = isManager ? 'Đăng Ký Nhiệm Vụ Với BGĐ' : 'Đăng Ký Nhiệm Vụ Với Lãnh Đạo Phòng';

        appContainer.innerHTML = `
            <!-- HEADER -->
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

            <!-- CONTENT -->
            <main class="max-w-7xl mx-auto px-4 py-8">
                <!-- KHU VỰC BỘ LỌC CÔNG VIỆC -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 mb-6">
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <i class="fa-solid fa-chart-line text-indigo-600"></i> Bảng Điều Khiển Tổng Quan Công Việc
                            </h2>
                            <p class="text-xs text-slate-500 mt-1">Theo dõi, đăng ký công việc và cập nhật minh chứng kết quả</p>
                        </div>

                        <!-- BỘ LỌC TỪ NGÀY ... ĐẾN NGÀY ... -->
                        <div class="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                            <span class="text-xs font-semibold text-slate-600 pl-1"><i class="fa-solid fa-calendar-days text-indigo-600 mr-1"></i> Lọc thời hạn:</span>
                            <input type="date" id="filter-start-date" class="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500">
                            <span class="text-xs text-slate-400">đến</span>
                            <input type="date" id="filter-end-date" class="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500">
                            <button id="btn-apply-date" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shadow-sm transition">Lọc</button>
                            <button id="btn-clear-date" class="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-medium rounded-lg transition">Tất cả</button>
                        </div>
                    </div>

                    <!-- TAB DÂN CƯ VÀ NÚT ĐĂNG KÝ CÔNG VIỆC -->
                    <div class="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                        <div class="flex items-center gap-2 overflow-x-auto pb-1">
                            <button data-dept="MY_TASKS" class="dept-btn px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-sm transition flex items-center gap-1.5">
                                <i class="fa-solid fa-user-check"></i> Công Việc Của Tôi
                            </button>
                            <button data-dept="ALL" class="dept-btn px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition">Tất Cả Phòng Ban</button>
                            <button data-dept="HC-TV" class="dept-btn px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition">Hành Chính - Tài Vụ</button>
                            <button data-dept="DT-QLSV" class="dept-btn px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition">Đào Tạo - KH & QLSV</button>
                        </div>

                        <button id="btn-open-add-task" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-1.5 transition">
                            <i class="fa-solid fa-plus-circle text-sm"></i> ${btnRegisterText}
                        </button>
                    </div>

                    <!-- THỐNG KÊ CARDS -->
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

                <!-- BẢNG DANH SÁCH CÔNG VIỆC -->
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
                                    <th class="py-3 px-4">Thời Hạn</th>
                                    <th class="py-3 px-4">Trạng Thái & Minh Chứng</th>
                                    <th class="py-3 px-4 text-center">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody id="task-table-body" class="divide-y divide-slate-100"></tbody>
                        </table>
                    </div>
                </div>
            </main>

            <!-- MODAL BÁO CÁO TIẾN ĐỘ & UPLOAD MINH CHỨNG -->
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

            <!-- MODAL ĐĂNG KÝ CÔNG VIỆC MULTI-ROW -->
            <div id="modal-add-task" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
                    <div class="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                        <div>
                            <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                                <i class="fa-solid fa-file-excel text-emerald-600 text-lg"></i> ${btnRegisterText}
                            </h3>
                            <p class="text-xs text-slate-500 mt-0.5">Nhập danh sách công việc cá nhân/đơn vị đăng ký thực hiện trong tuần</p>
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

            <!-- MODAL GIAO NHIỆM VỤ CẤP PHÒNG -->
            <div id="modal-assign-task" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-slate-800 text-base"><i class="fa-solid fa-user-check text-indigo-600 mr-1.5"></i> Duyệt & Phân Công Nhiệm Vụ</h3>
                        <button id="close-modal-assign" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark text-lg"></i></button>
                    </div>
                    <form id="form-assign-task" class="space-y-4">
                        <input type="hidden" id="assign-task-id">
                        <div>
                            <label class="block text-xs font-medium text-slate-500 mb-1">Công việc:</label>
                            <p id="assign-task-title-display" class="text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200"></p>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Người chủ trì / Phụ trách chính <span class="text-rose-500">*</span></label>
                            <select id="assign-main-user" required class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"></select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Người phối hợp (Nhấn Ctrl/Cmd để chọn nhiều)</label>
                            <select id="assign-coworkers" multiple size="4" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"></select>
                        </div>
                        <div class="flex justify-end gap-2 pt-2">
                            <button type="button" id="btn-cancel-assign" class="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">Hủy</button>
                            <button type="submit" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm">Lưu Phân Công</button>
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

        this.currentDept = 'MY_TASKS';

        this.bindEvents(user);
        this.renderTaskTable(user);
    }

    bindEvents(user) {
        // Lắng nghe Lọc Phòng Ban / Công Việc CỦA TÔI
        document.querySelectorAll('.dept-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.dept-btn').forEach(b => {
                    b.className = "dept-btn px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition flex items-center gap-1.5";
                });
                const targetBtn = e.currentTarget;
                targetBtn.className = "dept-btn px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-sm transition flex items-center gap-1.5";
                
                this.currentDept = targetBtn.getAttribute('data-dept');
                this.renderTaskTable(user);
            });
        });

        // Lắng nghe Lọc ngày
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

        // Đăng xuất & Đổi pass
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

        // LOGIC BẢNG ĐĂNG KÝ CÔNG VIỆC DẠNG LƯỚI EXCEL
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

        document.getElementById('btn-add-grid-row').addEventListener('click', () => {
            const nextStt = gridTbody.children.length + 1;
            gridTbody.appendChild(createGridRow(nextStt));
        });

        document.getElementById('close-modal-add').addEventListener('click', () => modalAdd.classList.add('hidden'));
        document.getElementById('btn-cancel-add').addEventListener('click', () => modalAdd.classList.add('hidden'));

        document.getElementById('form-add-task-grid').addEventListener('submit', (e) => {
            e.preventDefault();
            const rows = Array.from(gridTbody.querySelectorAll('.grid-row'));
            const tasksToAdd = [];
            const deptId = user.deptId || 'HC-TV';
            const deptName = deptId === 'HC-TV' ? 'Hành chính - Tài vụ' : 'Đào tạo - KH & QLSV';

            const assigneeName = `${user.fullName} (${user.position})`;

            // NẾU LÀ NHÂN VIÊN ĐĂNG KÝ: Trạng thái ban đầu là 'REGISTERED' (Mới đăng ký)
            // NẾU LÀ TRƯỞNG PHÒNG ĐĂNG KÝ: Trạng thái ban đầu là 'DOING' (Đã duyệt)
            const initialStatus = user.role === 'STAFF' ? 'REGISTERED' : 'DOING';

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
                this.taskService.addMultipleTasks(tasksToAdd, initialStatus);
                modalAdd.classList.add('hidden');
                this.renderTaskTable(user);
            }
        });

        // Sự kiện Modal Giao việc
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

        // Sự kiện Modal Báo cáo tiến độ & Minh chứng
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

    renderTaskTable(user) {
        const tbody = document.getElementById('task-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        const isBGD = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN_BGD';
        const isManager = user.role === 'MANAGER' || user.role === 'SUPER_ADMIN';

        let tasks = this.taskService.getTasks(this.currentDept, this.startDate, this.endDate, user.fullName);

        // Thống kê
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

            // TRẠNG THÁI HIỂN THỊ BADGE (Bổ sung trạng thái 'Mới đăng ký')
            let statusBadge = '';
            if (task.status === 'REGISTERED') {
                statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"><i class="fa-solid fa-file-circle-plus mr-1"></i> Mới Đăng Ký</span>`;
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
                // Tên nút thay đổi linh hoạt: Nếu mới đăng ký -> "Duyệt & Giao việc", Nếu đã phân công -> "Giao việc"
                const assignBtnLabel = task.status === 'REGISTERED' ? 'Duyệt & Giao việc' : 'Giao việc';

                if (isManagerDirectlyAssigned) {
                    actionBtnHtml = `
                        <div class="flex items-center justify-center gap-1.5">
                            <button class="btn-assign text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md text-xs font-medium" title="Phân công cho nhân viên"><i class="fa-solid fa-user-plus mr-1"></i> ${assignBtnLabel}</button>
                            <button class="btn-update-proof text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md text-xs font-medium" title="Báo cáo / Minh chứng cá nhân"><i class="fa-solid fa-pen-to-square mr-1"></i> Minh chứng</button>
                        </div>
                    `;
                } else {
                    actionBtnHtml = `
                        <button class="btn-assign text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md text-xs font-medium" title="Điều chỉnh người giao việc"><i class="fa-solid fa-user-plus mr-1"></i> ${assignBtnLabel}</button>
                    `;
                }
            } else if (isStaffAssignedToMe) {
                // Nếu công việc mới đăng ký và chưa được sếp duyệt thì ẩn nút nộp minh chứng
                if (task.status === 'REGISTERED') {
                    actionBtnHtml = `<span class="text-blue-500 text-xs italic font-medium">Chờ Lãnh đạo duyệt</span>`;
                } else {
                    actionBtnHtml = `<button class="btn-update-proof text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md text-xs font-medium"><i class="fa-solid fa-pen-to-square mr-1"></i> Báo cáo / Minh chứng</button>`;
                }
            } else {
                actionBtnHtml = `<span class="text-slate-400 text-xs italic">Xem</span>`;
            }

            tr.innerHTML = `
                <td class="py-3.5 px-4 font-medium text-slate-900">
                    <div>${task.title}</div>
                    ${task.expectedProduct ? `<div class="text-xs text-slate-500 font-normal mt-0.5"><i class="fa-solid fa-box-archive mr-1"></i><b>Sản phẩm:</b> ${task.expectedProduct}</div>` : ''}
                    ${task.directive ? `<div class="text-xs text-indigo-700 mt-1 bg-indigo-50 p-1.5 rounded border border-indigo-100"><i class="fa-solid fa-bullhorn mr-1"></i><b>Lãnh đạo Chỉ đạo:</b> ${task.directive}</div>` : ''}
                </td>
                <td class="py-3.5 px-4"><span class="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border">${task.deptName}</span></td>
                <td class="py-3.5 px-4">
                    <div class="font-semibold text-slate-800">${task.assignee}</div>
                    ${coWorkerText}
                </td>
                <td class="py-3.5 px-4 font-medium ${task.status === 'LATE' ? 'text-rose-600' : 'text-slate-700'}">${task.deadline}</td>
                <td class="py-3.5 px-4">
                    <div>${statusBadge}</div>
                    ${proofHtml}
                </td>
                <td class="py-3.5 px-4 text-center">${actionBtnHtml}</td>
            `;

            // Nút BGĐ chỉ đạo
            if (isBGD && tr.querySelector('.btn-directive')) {
                tr.querySelector('.btn-directive').addEventListener('click', () => {
                    const directive = prompt(`Nhập ý kiến chỉ đạo của BGĐ cho:\n"${task.title}"`);
                    if (directive) {
                        this.taskService.addDirective(task.id, directive);
                        this.renderTaskTable(user);
                    }
                });
            }

            // Nút Trưởng phòng Duyệt & Giao việc
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

            // Nút Cập nhật tiến độ & Minh chứng
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

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});