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

        // Lấy chữ cái đầu tiên làm Avatar
        const avatarLetter = currentUser?.fullName ? currentUser.fullName.trim().charAt(0).toUpperCase() : 'U';

        targetElement.innerHTML = `
            <header style="background-color: #1e1b4b; color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); width: 100%;">
                <div style="max-width: 1280px; margin: 0 auto; padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                    
                    <!-- Logo & Tiêu đề -->
                    <div style="display: flex; items-center: center; gap: 0.75rem;">
                        <div style="width: 40px; height: 40px; background-color: #3730a3; border: 1px solid #4338ca; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.25rem; color: #a5b4fc;">
                            📋
                        </div>
                        <div>
                            <h1 style="font-weight: 700; font-size: 1rem; line-height: 1.2; text-transform: uppercase; margin: 0; color: #ffffff; letter-spacing: 0.5px;">
                                QUẢN LÝ CÔNG VIỆC UFM - PHÂN HIỆU QUẢNG NGÃI
                            </h1>
                            <p style="font-size: 0.75rem; color: #a5b4fc; margin: 2px 0 0 0;">Hệ thống theo dõi & Điều hành công việc</p>
                        </div>
                    </div>

                    <!-- Thông tin người dùng & Thao tác -->
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <!-- Block thông tin User -->
                        <div style="display: flex; align-items: center; gap: 0.6rem; background-color: #312e81; border: 1px solid #3730a3; padding: 0.35rem 0.75rem; border-radius: 0.5rem;">
                            <div style="width: 30px; height: 30px; border-radius: 50%; background-color: #4f46e5; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.85rem;">
                                ${avatarLetter}
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 0.8rem; font-weight: 700; color: #ffffff; line-height: 1.2;">
                                    ${currentUser?.fullName || 'Người dùng'}
                                </div>
                                <div style="font-size: 0.7rem; color: #c7d2fe;">
                                    ${currentUser?.position || 'Thành viên'}
                                </div>
                            </div>
                        </div>

                        <!-- Nút Đổi mật khẩu -->
                        <button id="btn-change-pass" title="Đổi mật khẩu" style="background-color: #3730a3; color: #e0e7ff; border: 1px solid #4338ca; padding: 0.4rem 0.75rem; border-radius: 0.5rem; font-size: 0.8rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 0.3rem;">
                            🔑 <span>Đổi mật khẩu</span>
                        </button>

                        <!-- Nút Đăng xuất -->
                        <button id="btn-logout" title="Đăng xuất" style="background-color: #e11d48; color: #ffffff; border: none; padding: 0.4rem 0.75rem; border-radius: 0.5rem; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.3rem;">
                            🚪 <span>Đăng xuất</span>
                        </button>
                    </div>

                </div>
            </header>
        `;

        // Gán sự kiện
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