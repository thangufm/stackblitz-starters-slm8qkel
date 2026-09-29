// ==========================================
// 1. CLASS USER & AUTH SERVICE (XÁC THỰC)
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
        // Khởi tạo danh sách người dùng UFM với mật khẩu mặc định là "123"
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
                new User('nguyenthiphuongthao@ufm.edu.vn', 'Nguyễn Thị Phương Thảo', 'Phó Trưởng phòng', 'HC-TV', 'MANAGER'),
                new User('huynhthianhtung@ufm.edu.vn', 'Huỳnh Thị Anh Tùng', 'Kế toán viên hạng III', 'HC-TV', 'STAFF'),
                new User('phamngocthang@ufm.edu.vn', 'Phạm Ngọc Thắng', 'Chuyên viên chính', 'HC-TV', 'SUPER_ADMIN'),
                new User('dinhthanhha@ufm.edu.vn', 'Đinh Thanh Hà', 'Kỹ sư', 'HC-TV', 'STAFF'),
                new User('tranthang@ufm.edu.vn', 'Bùi Trần Quyết Thắng', 'Kỹ sư', 'HC-TV', 'STAFF'),

                // Phòng Đào tạo - KH & QLSV
                new User('phamhoainam@ufm.edu.vn', 'Phạm Hoài Nam', 'Trưởng phòng', 'DT-QLSV', 'MANAGER'),
                new User('huynhngocnghiem@ufm.edu.vn', 'Huỳnh Ngọc Nghiêm', 'Phó trưởng phòng', 'DT-QLSV', 'MANAGER'),
                new User('vovanthao@ufm.edu.vn', 'Võ Văn Thảo', 'Chuyên viên', 'DT-QLSV', 'STAFF'),
                new User('tathiquynhngoc@ufm.edu.vn', 'Tạ Thị Quỳnh Ngọc', 'Chuyên viên chính', 'DT-QLSV', 'STAFF')
            ];
            this.saveUsers();
        }
    }

    saveUsers() {
        localStorage.setItem('ufm_users', JSON.stringify(this.users));
    }

    login(email, password) {
        const user = this.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!user) {
            return { success: false, message: 'Email không tồn tại trong hệ thống UFM!' };
        }
        if (user.password !== password) {
            return { success: false, message: 'Mật khẩu không chính xác! (Mật khẩu mặc định: 123)' };
        }
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
            if (user.password !== oldPassword) {
                return { success: false, message: 'Mật khẩu hiện tại không đúng!' };
            }
            user.password = newPassword;
            this.saveUsers();
            
            // Cập nhật lại session
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true, message: 'Đổi mật khẩu thành công!' };
        }
        return { success: false, message: 'Lỗi người dùng!' };
    }
}

// ==========================================
// 2. CLASS TASK & TASK SERVICE
// ==========================================
class Task {
    constructor(id, title, dept, deptName, assignee, deadline, status, directive = '') {
        this.id = id;
        this.title = title;
        this.dept = dept;
        this.deptName = deptName;
        this.assignee = assignee;
        this.deadline = deadline;
        this.status = status;
        this.directive = directive;
    }

    setDirective(text) {
        this.directive = text;
    }
}

class TaskService {
    constructor() {
        this.tasks = [
            new Task(1, 'Báo cáo kiểm kê tài sản & hạ tầng CNTT Quý 3/2026', 'HC-TV', 'Hành chính - Tài vụ', 'Trần Thị Bích Liên (Trưởng phòng)', '30/09/2026', 'LATE'),
            new Task(2, 'Triển khai bảo trì hệ thống mạng máy tính phòng họp', 'HC-TV', 'Hành chính - Tài vụ', 'Trần Thị Bích Liên (Trưởng phòng)', '02/10/2026', 'DOING'),
            new Task(3, 'Thanh toán chi phí điện nước và dịch vụ vệ sinh tháng 9', 'HC-TV', 'Hành chính - Tài vụ', 'Huỳnh Thị Anh Tùng (Kế toán viên)', '29/09/2026', 'DONE'),
            new Task(4, 'Lập danh sách sinh viên xét học bổng học kỳ 1', 'DT-QLSV', 'Đào tạo - KH & QLSV', 'Phạm Hoài Nam (Trưởng phòng)', '03/10/2026', 'DOING'),
            new Task(5, 'Cập nhật thời khóa biểu bổ sung cho các lớp buổi tối', 'DT-QLSV', 'Đào tạo - KH & QLSV', 'Phạm Hoài Nam (Trưởng phòng)', '01/10/2026', 'DONE'),
            new Task(6, 'Tổng hợp đề xuất đề tài nghiên cứu khoa học cấp cơ sở', 'DT-QLSV', 'Đào tạo - KH & QLSV', 'Huỳnh Ngọc Nghiêm (Phó Trưởng phòng)', '28/09/2026', 'LATE')
        ];
    }

    getTasksByDepartment(deptCode) {
        if (deptCode === 'ALL') return this.tasks;
        return this.tasks.filter(task => task.dept === deptCode);
    }

    addDirective(taskId, directiveText) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.setDirective(directiveText);
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

    // --- GIAO DIỆN ĐĂNG NHẬP ---
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
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                    <i class="fa-solid fa-envelope"></i>
                                </span>
                                <input type="email" id="login-email" required placeholder="nhansukhoa@ufm.edu.vn" 
                                    class="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Mật khẩu</label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                    <i class="fa-solid fa-lock"></i>
                                </span>
                                <input type="password" id="login-password" required placeholder="••••••••" 
                                    class="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition">
                            </div>
                            <p class="text-[11px] text-slate-400 mt-1.5"><i class="fa-solid fa-info-circle"></i> Mật khẩu khởi đầu mặc định là: <b class="text-indigo-600">123</b></p>
                        </div>

                        <div id="login-error" class="hidden p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium"></div>

                        <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition duration-200">
                            <i class="fa-solid fa-right-to-bracket mr-2"></i> Đăng Nhập
                        </button>
                    </form>

                    <div class="mt-6 pt-6 border-t border-slate-100 text-center">
                        <p class="text-xs text-slate-400">Tài khoản mẫu thử nghiệm: <br><b class="text-slate-600">phamngocthang@ufm.edu.vn</b> (Pass: 123)</p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-password').value;
            
            const res = this.authService.login(email, pass);
            if (res.success) {
                this.initUI();
            } else {
                const errDiv = document.getElementById('login-error');
                errDiv.innerText = res.message;
                errDiv.classList.remove('hidden');
            }
        });
    }

    // --- GIAO DIỆN BẢNG ĐIỀU KHUYỂN SANH XANH ---
    renderDashboardView(user) {
        const appContainer = document.getElementById('app-root') || document.body;
        
        const isBGD = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN_BGD';
        const roleTitle = isBGD ? 'Super Admin / BGĐ' : user.position;

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

                    <div class="flex items-center gap-4">
                        <div class="text-right hidden sm:block">
                            <div class="font-semibold text-sm">${user.fullName}</div>
                            <div class="text-xs text-amber-300"><i class="fa-solid fa-crown text-[10px]"></i> ${roleTitle}</div>
                        </div>

                        <button id="btn-change-pass" title="Đổi mật khẩu" class="p-2 bg-indigo-800 hover:bg-indigo-700 rounded-lg text-indigo-100 transition text-xs font-medium flex items-center gap-1.5 px-3">
                            <i class="fa-solid fa-key"></i> <span class="hidden sm:inline">Đổi Mật Khẩu</span>
                        </button>

                        <button id="btn-logout" title="Đăng xuất" class="p-2 bg-rose-600/80 hover:bg-rose-600 rounded-lg text-white transition text-xs font-medium flex items-center gap-1.5 px-3">
                            <i class="fa-solid fa-arrow-right-from-bracket"></i> <span class="hidden sm:inline">Thoát</span>
                        </button>
                    </div>
                </div>
            </header>

            <!-- MAIN CONTENT -->
            <main class="max-w-7xl mx-auto px-4 py-8">
                <!-- PANEL THỐNG KÊ -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 mb-6">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <i class="fa-solid fa-chart-line text-indigo-600"></i> Bảng Điều Khiển Tổng Quan Công Việc
                            </h2>
                            <p class="text-xs text-slate-500 mt-1">Theo dõi tiến độ đăng ký và thực hiện công việc tuần của các Phòng/Ban</p>
                        </div>
                        
                        <div class="flex items-center gap-2">
                            <button data-dept="ALL" class="dept-btn px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-sm transition">Tất Cả Phòng Ban</button>
                            <button data-dept="HC-TV" class="dept-btn px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition">Hành Chính - Tài Vụ</button>
                            <button data-dept="DT-QLSV" class="dept-btn px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition">Đào Tạo - KH & QLSV</button>
                        </div>
                    </div>

                    <!-- 4 CARD THỐNG KÊ -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                            <div>
                                <div class="text-xs font-semibold text-slate-400 uppercase">TỔNG CÔNG VIỆC</div>
                                <div id="stat-total" class="text-2xl font-extrabold text-slate-800 mt-1">0</div>
                            </div>
                            <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><i class="fa-solid fa-list-check"></i></div>
                        </div>

                        <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                            <div>
                                <div class="text-xs font-semibold text-slate-400 uppercase">ĐANG THỰC HIỆN</div>
                                <div id="stat-doing" class="text-2xl font-extrabold text-amber-600 mt-1">0</div>
                            </div>
                            <div class="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center"><i class="fa-solid fa-spinner"></i></div>
                        </div>

                        <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                            <div>
                                <div class="text-xs font-semibold text-slate-400 uppercase">ĐÃ HOÀN THÀNH</div>
                                <div id="stat-done" class="text-2xl font-extrabold text-emerald-600 mt-1">0</div>
                            </div>
                            <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"><i class="fa-solid fa-circle-check"></i></div>
                        </div>

                        <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                            <div>
                                <div class="text-xs font-semibold text-slate-400 uppercase">CẢNH BÁO TRỄ HẠN</div>
                                <div id="stat-late" class="text-2xl font-extrabold text-rose-600 mt-1">0</div>
                            </div>
                            <div class="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center"><i class="fa-solid fa-triangle-exclamation"></i></div>
                        </div>
                    </div>
                </div>

                <!-- BẢNG CÔNG VIỆC -->
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                    <div class="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 class="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                            <i class="fa-solid fa-bars-staggered text-indigo-600"></i> Danh Sách Công Việc Đăng Ký Trong Tuần
                        </h3>
                        <span id="task-count-label" class="text-xs text-slate-400">Hiển thị 0 công việc</span>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                                <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                                    <th class="py-3 px-4">Tên Công Việc</th>
                                    <th class="py-3 px-4">Phòng Ban</th>
                                    <th class="py-3 px-4">Người Phụ Trách</th>
                                    <th class="py-3 px-4">Thời Hạn</th>
                                    <th class="py-3 px-4">Trạng Thái</th>
                                    <th class="py-3 px-4 text-center">Thao Tác BGĐ</th>
                                </tr>
                            </thead>
                            <tbody id="task-table-body" class="divide-y divide-slate-100">
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <!-- MODAL ĐỔI MẬT KHẨU -->
            <div id="modal-change-pass" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-slate-800 text-base"><i class="fa-solid fa-key text-indigo-600 mr-1.5"></i> Đổi Mật Khẩu Tài Khoản</h3>
                        <button id="close-modal-pass" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark text-lg"></i></button>
                    </div>

                    <form id="form-change-pass" class="space-y-4">
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">Mật khẩu hiện tại</label>
                            <input type="password" id="pass-old" required placeholder="Nhập mật khẩu hiện tại (Mặc định: 123)" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">Mật khẩu mới</label>
                            <input type="password" id="pass-new" required minlength="3" placeholder="Nhập mật khẩu mới" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                            <input type="password" id="pass-confirm" required minlength="3" placeholder="Nhập lại mật khẩu mới" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>

                        <div id="pass-msg" class="hidden p-2.5 rounded-lg text-xs font-medium"></div>

                        <div class="flex justify-end gap-2 pt-2">
                            <button type="button" id="btn-cancel-pass" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg">Hủy</button>
                            <button type="submit" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm">Lưu Mật Khẩu</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Lắng nghe sự kiện
        document.getElementById('btn-logout').addEventListener('click', () => {
            this.authService.logout();
            this.initUI();
        });

        // Event Modal Đổi pass
        const modalPass = document.getElementById('modal-change-pass');
        document.getElementById('btn-change-pass').addEventListener('click', () => {
            modalPass.classList.remove('hidden');
        });
        document.getElementById('close-modal-pass').addEventListener('click', () => {
            modalPass.classList.add('hidden');
        });
        document.getElementById('btn-cancel-pass').addEventListener('click', () => {
            modalPass.classList.add('hidden');
        });

        document.getElementById('form-change-pass').addEventListener('submit', (e) => {
            e.preventDefault();
            const oldP = document.getElementById('pass-old').value;
            const newP = document.getElementById('pass-new').value;
            const confP = document.getElementById('pass-confirm').value;
            const msgDiv = document.getElementById('pass-msg');

            if (newP !== confP) {
                msgDiv.className = "p-2.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-600";
                msgDiv.innerText = "Mật khẩu mới xác nhận không trùng khớp!";
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
                }, 1200);
            } else {
                msgDiv.className = "p-2.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-600";
                msgDiv.innerText = res.message;
                msgDiv.classList.remove('hidden');
            }
        });

        // Lọc theo Phòng ban
        document.querySelectorAll('.dept-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.dept-btn').forEach(b => {
                    b.className = "dept-btn px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition";
                });
                const targetBtn = e.currentTarget;
                targetBtn.className = "dept-btn px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-sm transition";
                
                this.currentDept = targetBtn.getAttribute('data-dept');
                this.renderTaskTable(user);
            });
        });

        this.renderTaskTable(user);
    }

    // --- RENDER BẢNG CÔNG VIỆC ---
    renderTaskTable(user) {
        const tbody = document.getElementById('task-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        const isBGD = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN_BGD';
        let tasks = this.taskService.getTasksByDepartment(this.currentDept);

        // Cập nhật thẻ Thống kê
        document.getElementById('stat-total').innerText = tasks.length;
        document.getElementById('stat-doing').innerText = tasks.filter(t => t.status === 'DOING').length;
        document.getElementById('stat-done').innerText = tasks.filter(t => t.status === 'DONE').length;
        document.getElementById('stat-late').innerText = tasks.filter(t => t.status === 'LATE').length;
        document.getElementById('task-count-label').innerText = `Hiển thị ${tasks.length} công việc`;

        if (tasks.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-400">Không có công việc nào.</td></tr>`;
            return;
        }

        tasks.forEach(task => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-slate-50/80 transition";

            let statusBadge = '';
            if (task.status === 'LATE') {
                statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700"><i class="fa-solid fa-circle text-[8px]"></i> Trễ Hạn</span>`;
            } else if (task.status === 'DOING') {
                statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><i class="fa-solid fa-circle text-[8px]"></i> Đang Làm</span>`;
            } else {
                statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700"><i class="fa-solid fa-circle text-[8px]"></i> Hoàn Thành</span>`;
            }

            const deptBadgeClass = task.dept === 'HC-TV' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200';

            const directiveBtnHtml = isBGD 
                ? `<button class="btn-directive text-indigo-600 hover:text-indigo-900 font-medium text-xs bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition"><i class="fa-solid fa-comment-dots mr-1"></i> Cho chỉ đạo</button>`
                : `<span class="text-slate-400 text-xs italic">Xem chỉ đạo</span>`;

            tr.innerHTML = `
                <td class="py-3.5 px-4 font-medium text-slate-900">
                    ${task.title}
                    ${task.directive ? `<div class="text-xs text-indigo-700 font-normal mt-1 bg-indigo-50 p-1.5 rounded border border-indigo-100"><i class="fa-solid fa-bullhorn mr-1"></i> <b>BGĐ Chỉ đạo:</b> ${task.directive}</div>` : ''}
                </td>
                <td class="py-3.5 px-4"><span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${deptBadgeClass} border">${task.deptName}</span></td>
                <td class="py-3.5 px-4 font-medium text-slate-800">${task.assignee}</td>
                <td class="py-3.5 px-4 ${task.status === 'LATE' ? 'text-rose-600 font-medium' : ''}">${task.deadline}</td>
                <td class="py-3.5 px-4">${statusBadge}</td>
                <td class="py-3.5 px-4 text-center">${directiveBtnHtml}</td>
            `;

            if (isBGD) {
                tr.querySelector('.btn-directive').addEventListener('click', () => {
                    const directive = prompt(`Nhập ý kiến chỉ đạo của Ban Giám đốc cho:\n"${task.title}"`);
                    if (directive) {
                        this.taskService.addDirective(task.id, directive);
                        this.renderTaskTable(user);
                    }
                });
            }

            tbody.appendChild(tr);
        });
    }
}

// Khởi chạy ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});