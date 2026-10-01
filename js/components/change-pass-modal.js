import { db, ref, set } from '../config/firebase-config.js';

export const ChangePassModalComponent = {
    render(currentUser) {
        if (!currentUser) return;

        const modalId = 'change-pass-modal';
        const existing = document.getElementById(modalId);
        if (existing) existing.remove();

        const modalHtml = `
            <div id="${modalId}" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 flex flex-col">
                    
                    <div class="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            <i class="fa-solid fa-key text-indigo-600 mr-1.5"></i>Đổi Mật Khẩu
                        </h3>
                        <button id="close-pass-btn" class="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200/60">
                            <i class="fa-solid fa-xmark text-base"></i>
                        </button>
                    </div>

                    <form id="change-pass-form" class="p-5 space-y-3.5 text-xs">
                        <div>
                            <label class="block font-semibold text-slate-700 mb-1">Mật khẩu hiện tại</label>
                            <input type="password" id="old-pass" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 mb-1">Mật khẩu mới</label>
                            <input type="password" id="new-pass" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                        </div>

                        <div>
                            <label class="block font-semibold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                            <input type="password" id="confirm-pass" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                        </div>

                        <div class="pt-2 flex justify-end gap-2">
                            <button type="button" id="cancel-pass-btn" class="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition">Hủy</button>
                            <button type="submit" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition">
                                Lưu mật khẩu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modalElement = document.getElementById(modalId);
        const form = document.getElementById('change-pass-form');
        const closeModal = () => modalElement.remove();

        document.getElementById('close-pass-btn').addEventListener('click', closeModal);
        document.getElementById('cancel-pass-btn').addEventListener('click', closeModal);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const oldPass = document.getElementById('old-pass').value;
            const newPass = document.getElementById('new-pass').value;
            const confirmPass = document.getElementById('confirm-pass').value;

            if (oldPass !== currentUser.password) {
                alert('Mật khẩu hiện tại không chính xác!');
                return;
            }

            if (newPass !== confirmPass) {
                alert('Mật khẩu mới và xác nhận mật khẩu không trùng khớp!');
                return;
            }

            try {
                // Cập nhật mật khẩu mới lên Firebase
                await set(ref(db, `users/${currentUser.id}/password`), newPass);
                currentUser.password = newPass;
                localStorage.setItem('user', JSON.stringify(currentUser));
                alert('Đổi mật khẩu thành công!');
                closeModal();
            } catch (err) {
                alert('Lỗi cập nhật mật khẩu: ' + err.message);
            }
        });
    }
};