import { AuthService } from '../services/auth-service.js';
import { DeptService } from '../services/dept-service.js';

export const AuthViewComponent = {
    render(container, onAuthSuccess) {
        if (!container) return;

        const depts = DeptService.getDepartments();

        container.innerHTML = `
            <div class="max-w-md w-full mx-auto my-8 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <!-- Header Tabs -->
                <div class="flex border-b border-slate-200 bg-slate-50">
                    <button id="tab-login" class="flex-1 py-3 text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 transition">
                        Đăng Nhập
                    </button>
                    <button id="tab-register" class="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-indigo-600 transition">
                        Đăng Ký Tài Khoản
                    </button>
                </div>

                <div class="p-6">
                    <!-- Alert Error Message -->
                    <div id="auth-error" class="hidden mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"></div>

                    <!-- FORM ĐĂNG NHẬP -->
                    <form id="form-login" class="space-y-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Email</label>
                            <input type="email" id="login-email" required placeholder="thangpn@ufm.edu.vn" class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Mật khẩu</label>
                            <input type="password" id="login-password" required placeholder="••••••••" class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>

                        <button type="submit" id="btn-login" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow transition">
                            Vào Hệ Thống
                        </button>
                    </form>

                    <!-- FORM ĐĂNG KÝ -->
                    <form id="form-register" class="space-y-4 hidden">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Họ và Tên <span class="text-rose-500">*</span></label>
                            <input type="text" id="reg-fullname" required placeholder="Phạm Ngọc Thắng" class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Email <span class="text-rose-500">*</span></label>
                            <input type="email" id="reg-email" required placeholder="thangpn@ufm.edu.vn" class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Mật khẩu <span class="text-rose-500">*</span></label>
                            <input type="password" id="reg-password" required placeholder="••••••••" class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Phòng Ban <span class="text-rose-500">*</span></label>
                            <select id="reg-dept" class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                ${depts.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                            </select>
                        </div>

                        <button type="submit" id="btn-register" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow transition">
                            Tạo Tài Khoản
                        </button>
                    </form>
                </div>
            </div>
        `;

        const tabLogin = document.getElementById('tab-login');
        const tabRegister = document.getElementById('tab-register');
        const formLogin = document.getElementById('form-login');
        const formRegister = document.getElementById('form-register');
        const errorEl = document.getElementById('auth-error');

        const showError = (msg) => {
            errorEl.innerText = msg;
            errorEl.classList.remove('hidden');
        };

        const hideError = () => {
            errorEl.classList.add('hidden');
        };

        // Chuyển Tab
        tabLogin?.addEventListener('click', () => {
            hideError();
            tabLogin.className = "flex-1 py-3 text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 transition";
            tabRegister.className = "flex-1 py-3 text-sm font-bold text-slate-500 hover:text-indigo-600 transition";
            formLogin.classList.remove('hidden');
            formRegister.classList.add('hidden');
        });

        tabRegister?.addEventListener('click', () => {
            hideError();
            tabRegister.className = "flex-1 py-3 text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 transition";
            tabLogin.className = "flex-1 py-3 text-sm font-bold text-slate-500 hover:text-indigo-600 transition";
            formRegister.classList.remove('hidden');
            formLogin.classList.add('hidden');
        });

        // Xử lý submit Form Đăng nhập
        formLogin?.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideError();

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            try {
                const user = await AuthService.login(email, password);
                if (onAuthSuccess) onAuthSuccess(user);
            } catch (err) {
                showError(err.message);
            }
        });

        // Xử lý submit Form Đăng ký
        formRegister?.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideError();

            const fullName = document.getElementById('reg-fullname').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value;
            const deptId = document.getElementById('reg-dept').value;

            try {
                const user = await AuthService.register({ fullName, email, password, deptId });
                AuthService.setCurrentUser(user);
                if (onAuthSuccess) onAuthSuccess(user);
            } catch (err) {
                showError(err.message);
            }
        });
    }
};