//Thanh điều hướng, User profile
import { AuthService } from '../services/auth-service.js';
import { DeptService } from '../services/dept-service.js';

export const NavbarComponent = {
    render(currentUser, onLogout, onNavigate) {
        const container = document.getElementById('navbar-container');
        if (!container) return;

        if (!currentUser) {
            container.innerHTML = `
                <header class="bg-indigo-900 text-white shadow-md">
                    <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <i class="fa-solid fa-list-check text-2xl text-indigo-300"></i>
                            <div>
                                <h1 class="font-bold text-base sm:text-lg leading-tight">PHÂN HỆ QUẢN LÝ CÔNG VIỆC</h1>
                                <p class="text-xs text-indigo-200">Phân hiệu Trường Đại học Tài chính - Marketing tại tỉnh Quảng Ngãi</p>
                            </div>
                        </div>
                    </div>
                </header>
            `;
            return;
        }

        const deptName = DeptService.getDeptName(currentUser.deptId);

        container.innerHTML = `
            <header class="bg-indigo-900 text-white shadow-md">
                <div class="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
                    <!-- Brand / Logo -->
                    <div class="flex items-center gap-3 cursor-pointer" id="btn-brand">
                        <i class="fa-solid fa-list-check text-2xl text-indigo-300"></i>
                        <div>
                            <h1 class="font-bold text-base sm:text-lg leading-tight">QUẢN LÝ CÔNG VIỆC</h1>
                            <p class="text-xs text-indigo-200">${deptName}</p>
                        </div>
                    </div>

                    <!-- User Profile & Action Buttons -->
                    <div class="flex items-center gap-4">
                        <div class="text-right hidden sm:block">
                            <p class="text-sm font-semibold text-white">${currentUser.fullName}</p>
                            <p class="text-xs text-indigo-200">${currentUser.email}</p>
                        </div>

                        <button id="btn-logout" class="px-3 py-1.5 bg-indigo-800 hover:bg-rose-600 text-xs font-medium rounded-lg transition flex items-center gap-2 border border-indigo-700">
                            <i class="fa-solid fa-right-from-bracket"></i>
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </header>
        `;

        // Gán sự kiện cho các nút
        document.getElementById('btn-logout')?.addEventListener('click', () => {
            AuthService.logout();
            if (onLogout) onLogout();
        });

        document.getElementById('btn-brand')?.addEventListener('click', () => {
            if (onNavigate) onNavigate('tasks');
        });
    }
};