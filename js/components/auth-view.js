import { AuthService } from '../services/auth-service.js';

export const AuthViewComponent = {
    render(container, onLoginSuccess) {
        container.innerHTML = `
            <div class="max-w-md mx-auto my-12 bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
                <div class="p-8">
                    <div class="text-center mb-8">
                        <i class="fa-solid fa-user-shield text-4xl text-indigo-600 mb-2"></i>
                        <h2 class="text-2xl font-bold text-slate-800">Đăng Nhập Hệ Thống</h2>
                        <p class="text-xs text-slate-500 mt-1">Sử dụng Email Phân hiệu để truy cập</p>
                    </div>

                    <form id="login-form" class="space-y-5">
                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase mb-2">Email *</label>
                            <input type="email" id="login-email" required placeholder="nhanvien@ufm.edu.vn"
                                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-600 uppercase mb-2">Mật khẩu *</label>
                            <input type="password" id="login-password" required placeholder="••••••••"
                                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition">
                        </div>

                        <div id="auth-error" class="hidden text-xs text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200"></div>

                        <button type="submit" 
                            class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200">
                            Đăng Nhập
                        </button>
                    </form>

                    <div class="mt-6 text-center text-xs text-slate-400 border-t pt-4">
                        <p>Mật khẩu mặc định cho nhân sự: <span class="font-bold text-slate-600">123</span></p>
                    </div>
                </div>
            </div>
        `;

        const form = container.querySelector('#login-form');
        const errorDiv = container.querySelector('#auth-error');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.classList.add('hidden');

            const email = container.querySelector('#login-email').value.trim();
            const password = container.querySelector('#login-password').value.trim();

            try {
                const user = await AuthService.login(email, password);
                onLoginSuccess(user);
            } catch (error) {
                errorDiv.textContent = error.message;
                errorDiv.classList.remove('hidden');
            }
        });
    }
};