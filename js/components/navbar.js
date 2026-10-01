import { ChangePassModalComponent } from './change-pass-modal.js';

export const NavbarComponent = {
    render(container, currentUser, onLogout) {
        let targetElement = null;

        if (typeof container === 'string') {
            targetElement = document.getElementById(container.replace('#', '')) || document.querySelector(container);
        } else if (container && container.nodeType === 1) {
            targetElement = container;
        } else {
            targetElement = document.getElementById('navbar');
        }

        if (!targetElement) return;

        targetElement.innerHTML = `
            <header class="bg-indigo-900 text-white shadow-lg sticky top-0 z-40">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16">
                        
                        <!-- Logo & Tiêu đề ứng dụng -->
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-indigo-700/80 border border-indigo-500/30 flex items-center justify-center shadow-inner">
                                <i class="fa-solid fa-list-check text-xl text-indigo-200"></i>
                            </div>
                            <div>
                                <h1 class="font-bold text-sm sm:text-base tracking-wide uppercase leading-tight text-white">
                                    QUẢN LÝ CÔNG VIỆC UFM - PHÂN HIỆU QUẢNG NGÃI
                                </h1>
                                <p class="text-[11px] text-indigo-300 font-medium">Hệ thống theo dõi & Điều hành công việc</p>
                            </div>
                        </div>

                        <!-- Thông tin Người đăng nhập & Thao tác -->
                        <div class="flex items-center gap-3">
                            <!-- Khối hiển thị thông tin User -->
                            <div class="hidden sm:flex items-center gap-2.5 bg-indigo-800/60 border border-indigo-700/80 px-3 py-1.5 rounded-xl">
                                <div class="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                    ${currentUser?.fullName ? currentUser.fullName.charAt(0) : 'U'}
                                </div>
                                <div class="text-right">
                                    <div class="text-xs font-bold text-white leading-tight">
                                        ${currentUser?.fullName || 'Chưa đăng nhập'}
                                    </div>
                                    <div class="text-[10px] text-indigo-200 font-medium">
                                        ${currentUser?.position || 'Thành viên'}
                                    </div>
                                </div>
                            </div>

                            <!-- Nút Đổi Mật Khẩu -->
                            <button id="btn-change-pass" title="Đổi mật khẩu" 
                                class="px-3 py-1.5 bg-indigo-800 hover:bg-indigo-700 text-indigo-100 rounded-lg text-xs font-medium transition border border-indigo-700 flex items-center gap-1.5 shadow-sm">
                                <i class="fa-solid fa-key text-indigo-300"></i>
                                <span class="hidden md:inline">Đổi mật khẩu</span>
                            </button>

                            <!-- Nút Đăng Xuất -->
                            <button id="btn-logout" title="Đăng xuất" 
                                class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition shadow-sm flex items-center gap-1.5">
                                <i class="fa-solid fa-right-from-bracket"></i>
                                <span class="hidden md:inline">Đăng xuất</span>
                            </button>
                        </div>

                    </div>
                </div>
            </header>
        `;

        // Gán sự kiện cho các nút
        setTimeout(() => {
            const btnChangePass = document.getElementById('btn-change-pass');
            if (btnChangePass) {
                btnChangePass.onclick = () => ChangePassModalComponent.render(currentUser);
            }

            const btnLogout = document.getElementById('btn-logout');
            if (btnLogout && onLogout) {
                btnLogout.onclick = onLogout;
            }
        }, 0);
    }
};