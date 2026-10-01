export const NavbarComponent = {
    render(container, currentUser, onLogout) {
        // 1. Tìm thẻ chứa
        let targetElement = null;
        if (typeof container === 'string') {
            targetElement = document.getElementById(container.replace('#', '')) || document.querySelector(container);
        } else if (container && container.nodeType === 1) {
            targetElement = container;
        } else {
            targetElement = document.getElementById('navbar') || document.getElementById('navbar-container');
        }

        if (!targetElement) {
            console.warn("Navbar: Không tìm thấy element chứa navbar");
            return;
        }

        const name = currentUser?.fullName || 'Người dùng';
        const position = currentUser?.position || '';
        const avatarLetter = name.trim().charAt(0).toUpperCase();

        // 2. Gán HTML trực tiếp
        targetElement.innerHTML = `
            <div style="background:#1e1b4b; color:#fff; padding: 12px 20px; display:flex; justify-size:space-between; align-items:center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:20px;">📋</span>
                    <div>
                        <div style="font-weight:bold; font-size:14px; text-transform:uppercase;">QUẢN LÝ CÔNG VIỆC UFM - PHÂN HIỆU QUẢNG NGÃI</div>
                        <div style="font-size:11px; color:#a5b4fc;">Hệ thống theo dõi & Điều hành công việc</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="display:flex; align-items:center; gap:8px; background:#312e81; padding:4px 10px; border-radius:6px;">
                        <div style="width:28px; height:28px; background:#4f46e5; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px;">${avatarLetter}</div>
                        <div style="text-align:right;">
                            <div style="font-size:12px; font-weight:bold;">${name}</div>
                            <div style="font-size:10px; color:#c7d2fe;">${position}</div>
                        </div>
                    </div>
                    <button id="btn-logout" style="background:#e11d48; color:#fff; border:none; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:bold; cursor:pointer;">
                        Đăng xuất
                    </button>
                </div>
            </div>
        `;

        // 3. Gán sự kiện nút Đăng xuất
        setTimeout(() => {
            const btnLogout = document.getElementById('btn-logout');
            if (btnLogout && typeof onLogout === 'function') {
                btnLogout.onclick = onLogout;
            }
        }, 0);
    }
};