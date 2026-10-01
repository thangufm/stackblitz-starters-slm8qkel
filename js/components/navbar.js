export const NavbarComponent = {
    render(container, currentUser, onLogout) {
        let targetElement = null;

        if (typeof container === 'string') {
            const cleanId = container.replace('#', '');
            targetElement = document.getElementById(cleanId) || document.querySelector(container);
        } else if (container && container.nodeType === 1) {
            targetElement = container;
        } else {
            targetElement = document.getElementById('navbar') || document.getElementById('navbar-container');
        }

        if (!targetElement) return;

        const name = currentUser?.fullName || 'Người dùng';
        const position = currentUser?.position || 'Thành viên';
        const avatarLetter = name.trim().charAt(0).toUpperCase();

        targetElement.innerHTML = `
            <header class="bg-indigo-900 text-white shadow-md w-full">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16">
                        
                        <!-- Logo & Tiêu đề -->
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-lg bg-indigo-800 border border-indigo-700 flex items-center justify-center font-bold text-lg text-indigo-200">
                                <i class="fa-solid fa-list-check"></i>
                            </div>
                            <div>
                                <h1 class="font-bold text-sm sm:text-base leading-tight uppercase tracking-wide text-white">
                                    QUẢN LÝ CÔNG VIỆC UFM - PHÂN HIỆU QUẢNG NGÃI
                                </h1>
                                <p class="text-[11px] text-indigo-300 font-medium">Hệ thống theo dõi & Điều hành công việc</p>
                            </div>
                        </div>

                        <!-- Thông tin Người dùng & Thao tác -->
                        <div class="flex items-center gap-3">
                            <div class="hidden sm:flex items-center gap-2.5 bg-indigo-800/80 border border-indigo-700/80 px-3 py-1.5 rounded-xl">
                                <div class="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                                    ${avatarLetter}
                                </div>
                                <div class="text-right">
                                    <div class="text-xs font-bold text-white leading-tight">${name}</div>
                                    <div class="text-[10px] text-indigo-200 font-medium">${position}</div>
                                </div>
                            </div>

                            <!-- Nút Đổi Mật Khẩu -->
                            <button id="btn-change-pass" title="Đổi mật khẩu" 
                                class="px-3 py-1.5 bg-indigo-800 hover:bg-indigo-700 text-indigo-100 rounded-lg text-xs font-medium transition border border-indigo-700 flex items-center gap-1">
                                <i class="fa-solid fa-key text-indigo-300"></i>
                                <span class="hidden md:inline">Đổi mật khẩu</span>
                            </button>

                            <!-- Nút Đăng Xuất -->
                            <button id="btn-logout" title="Đăng xuất" 
                                class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1 shadow-sm">
                                <i class="fa-solid fa-right-from-bracket"></i>
                                <span class="hidden md:inline">Đăng xuất</span>
                            </button>
                        </div>

                    </div>
                </div>
            </header>
        `;

        // Sự kiện Click
        setTimeout(() => {
            const btnChangePass = document.getElementById('btn-change-pass');
            if (btnChangePass) {
                btnChangePass.onclick = async () => {
                    try {
                        const { ChangePassModalComponent } = await import('./change-pass-modal.js');
                        ChangePassModalComponent.render(currentUser);
                    } catch (e) {
                        console.error("Lỗi load modal đổi mật khẩu:", e);
                    }
                };
            }

            const btnLogout = document.getElementById('btn-logout');
            if (btnLogout && typeof onLogout === 'function') {
                btnLogout.onclick = onLogout;
            }
        }, 0);
    }
};