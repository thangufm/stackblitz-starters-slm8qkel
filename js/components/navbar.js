import { ChangePassModalComponent } from './change-pass-modal.js';

export const NavbarComponent = {
    render(container, currentUser, onLogout) {
        // 1. Xác định thẻ DOM chứa Navbar (xử lý an toàn cho mọi kiểu truyền vào)
        let targetElement = null;

        if (typeof container === 'string') {
            targetElement = document.getElementById(container.replace('#', '')) || document.querySelector(container);
        } else if (container && container.nodeType === 1) {
            targetElement = container;
        } else {
            // Trường hợp container truyền vào là null/undefined hoặc object khác, tìm mặc định theo id #navbar
            targetElement = document.getElementById('navbar') || document.querySelector('header');
        }

        // Nếu vẫn không tìm thấy thẻ DOM nào trên trang thì dừng an toàn
        if (!targetElement) {
            console.warn("NavbarComponent: Không tìm thấy thẻ chứa Navbar trong index.html");
            return;
        }

        // 2. Gán HTML giao diện
        targetElement.innerHTML = `
            <nav class="bg-indigo-900 text-white shadow-md">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16">
                        
                        <!-- Tiêu đề phần mềm -->
                        <div class="flex items-center gap-3">
                            <i class="fa-solid fa-list-check text-2xl text-indigo-300"></i>
                            <div>
                                <h1 class="font-bold text-sm sm:text-base leading-tight tracking-wide uppercase">
                                    QUẢN LÝ CÔNG VIỆC UFM - PHÂN HIỆU QUẢNG NGÃI
                                </h1>
                            </div>
                        </div>

                        <!-- Góc phải User & Thao tác -->
                        <div class="flex items-center gap-3">
                            <div class="hidden sm:block text-right border-r border-indigo-700/60 pr-3">
                                <div class="text-xs font-bold text-white">${currentUser?.fullName || 'Người dùng'}</div>
                                <div class="text-[11px] text-indigo-200">${currentUser?.position || ''}</div>
                            </div>

                            <!-- Nút Đổi Mật Khẩu -->
                            <button id="btn-change-pass" title="Đổi mật khẩu" class="px-2.5 py-1.5 bg-indigo-800 hover:bg-indigo-700 text-indigo-100 rounded-lg text-xs font-medium transition border border-indigo-700 flex items-center gap-1">
                                <i class="fa-solid fa-key"></i>
                                <span class="hidden md:inline">Đổi mật khẩu</span>
                            </button>

                            <!-- Nút Đăng Xuất -->
                            <button id="btn-logout" title="Đăng xuất" class="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition shadow-sm flex items-center gap-1">
                                <i class="fa-solid fa-right-from-bracket"></i>
                                <span class="hidden md:inline">Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        `;

        // 3. Lắng nghe sự kiện (Sử dụng document.getElementById để đảm bảo không phụ thuộc vào container)
        setTimeout(() => {
            const btnChangePass = document.getElementById('btn-change-pass');
            if (btnChangePass) {
                btnChangePass.onclick = () => {
                    ChangePassModalComponent.render(currentUser);
                };
            }

            const btnLogout = document.getElementById('btn-logout');
            if (btnLogout && onLogout) {
                btnLogout.onclick = onLogout;
            }
        }, 0);
    }
};