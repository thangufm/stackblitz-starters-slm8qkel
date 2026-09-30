import { DeptService } from '../services/dept-service.js';

export const TaskDetailModalComponent = {
    render(task, currentUser = null, onClose = null) {
        // Xóa modal cũ nếu có
        const existingModal = document.getElementById('task-detail-modal');
        if (existingModal) existingModal.remove();

        if (!task) return;

        const deptName = DeptService.getDeptName(task.deptId);
        const priorityBadge = getPriorityBadge(task.priority);
        const statusBadge = getStatusBadge(task.status);

        const modalHtml = `
            <div id="task-detail-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
                    
                    <!-- Header Popup -->
                    <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Chi tiết công việc</span>
                            <span class="text-slate-300">|</span>
                            ${statusBadge}
                        </div>
                        <button id="close-modal-btn" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition">
                            <i class="fa-solid fa-xmark text-lg"></i>
                        </button>
                    </div>

                    <!-- Body Popup (Có thanh cuộn nếu nội dung dài) -->
                    <div class="p-6 overflow-y-auto space-y-5">
                        
                        <!-- Tiêu đề công việc -->
                        <div>
                            <div class="flex items-start justify-between gap-3 mb-1">
                                <h2 class="text-lg font-bold text-slate-800 leading-snug">
                                    ${task.title}
                                </h2>
                                <div class="shrink-0">${priorityBadge}</div>
                            </div>
                            <p class="text-xs text-slate-400">
                                <i class="fa-regular fa-clock mr-1"></i>Hạn hoàn thành: <span class="font-semibold text-slate-600">${task.dueDate || 'Chưa thiết lập'}</span>
                            </p>
                        </div>

                        <!-- Lưới thông tin chung -->
                        <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
                            <div>
                                <span class="text-slate-400 block mb-0.5">Đơn vị chủ trì:</span>
                                <span class="font-semibold text-slate-700">${deptName}</span>
                            </div>
                            <div>
                                <span class="text-slate-400 block mb-0.5">Người giao việc:</span>
                                <span class="font-semibold text-slate-700">${task.createdByName || 'Ban Giám đốc'}</span>
                            </div>
                            <div>
                                <span class="text-slate-400 block mb-0.5">Người thực hiện:</span>
                                <span class="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded inline-block">${task.assigneeName || 'Chưa phân công'}</span>
                            </div>
                            <div>
                                <span class="text-slate-400 block mb-0.5">Tiến độ hiện tại:</span>
                                <div class="flex items-center gap-2 mt-1">
                                    <div class="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                                        <div class="bg-indigo-600 h-2 rounded-full" style="width: ${task.progress || 0}%"></div>
                                    </div>
                                    <span class="font-bold text-indigo-600">${task.progress || 0}%</span>
                                </div>
                            </div>
                        </div>

                        <!-- Nội dung/Yêu cầu chỉ đạo -->
                        <div>
                            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                <i class="fa-solid fa-align-left mr-1.5"></i>Nội dung / Yêu cầu công việc
                            </h3>
                            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                                ${task.description || 'Không có mô tả chi tiết cho công việc này.'}
                            </div>
                        </div>

                        <!-- Báo cáo / Trao đổi công việc -->
                        <div>
                            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                <i class="fa-solid fa-comments mr-1.5"></i>Trao đổi & Báo cáo
                            </h3>
                            <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                                <textarea id="comment-input" rows="2" placeholder="Nhập ghi chú, tiến độ hoặc nội dung trao đổi..." 
                                    class="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"></textarea>
                                <div class="flex justify-end">
                                    <button id="send-comment-btn" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5">
                                        <i class="fa-solid fa-paper-plane"></i> Gửi phản hồi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer Popup -->
                    <div class="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
                        <button id="close-modal-bottom-btn" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition">
                            Đóng
                        </button>
                    </div>

                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modalElement = document.getElementById('task-detail-modal');
        const closeBtn = document.getElementById('close-modal-btn');
        const closeBottomBtn = document.getElementById('close-modal-bottom-btn');

        const closeModal = () => {
            if (modalElement) modalElement.remove();
            if (onClose) onClose();
        };

        closeBtn.addEventListener('click', closeModal);
        closeBottomBtn.addEventListener('click', closeModal);
        
        // Đóng modal khi click ra ngoài vùng trắng
        modalElement.addEventListener('click', (e) => {
            if (e.target === modalElement) closeModal();
        });
    }
};

function getPriorityBadge(priority) {
    switch (priority) {
        case 'KHAN':
            return `<span class="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200"><i class="fa-solid fa-bolt mr-1"></i>Khẩn</span>`;
        case 'CAO':
            return `<span class="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">Cao</span>`;
        case 'TRUNGBINH':
            return `<span class="bg-sky-100 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded border border-sky-200">Trung bình</span>`;
        default:
            return `<span class="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded">Thấp</span>`;
    }
}

function getStatusBadge(status) {
    switch (status) {
        case 'CHO_XU_LY':
            return `<span class="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200">Chờ xử lý</span>`;
        case 'DANG_THUC_HIEN':
            return `<span class="bg-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-200">Đang thực hiện</span>`;
        case 'CHO_DUYET':
            return `<span class="bg-purple-100 text-purple-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-purple-200">Chờ duyệt</span>`;
        case 'HOAN_THANH':
            return `<span class="bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200">Hoàn thành</span>`;
        default:
            return `<span class="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded">N/A</span>`;
    }
}