import { db, ref, set, get } from '../config/firebase-config.js';
import { DeptService } from '../services/dept-service.js';

export const TaskFormModalComponent = {
    async render(currentUser, onSuccess) {
        const modalId = 'task-form-modal';
        const existing = document.getElementById(modalId);
        if (existing) existing.remove();

        const departments = DeptService.getDepartments();
        
        // Lấy danh sách tất cả nhân sự từ Firebase
        let allUsers = [];
        try {
            const userSnap = await get(ref(db, 'users'));
            if (userSnap.exists()) {
                allUsers = Object.values(userSnap.val());
            }
        } catch (e) {
            console.error(e);
        }

        const modalHtml = `
            <div id="${modalId}" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100 flex flex-col">
                    
                    <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider">
                            <i class="fa-solid fa-file-circle-plus text-indigo-600 mr-2"></i>Giao Việc Mới (Ban Giám đốc)
                        </h3>
                        <button id="close-form-btn" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition">
                            <i class="fa-solid fa-xmark text-lg"></i>
                        </button>
                    </div>

                    <form id="create-task-form" class="p-6 space-y-4 text-xs">
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Tên công việc <span class="text-rose-500">*</span></label>
                            <input type="text" id="task-title" required placeholder="Nhập tên/tiêu đề công việc..." 
                                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Nội dung / Chỉ đạo chi tiết</label>
                            <textarea id="task-desc" rows="3" placeholder="Chi tiết yêu cầu công việc..." 
                                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"></textarea>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-bold text-slate-700 mb-1">Đơn vị chủ trì <span class="text-rose-500">*</span></label>
                                <select id="task-dept" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">
                                    <option value="">-- Chọn đơn vị --</option>
                                    ${departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                                </select>
                            </div>

                            <div>
                                <label class="block font-bold text-slate-700 mb-1">Giao thẳng cho Cá nhân (Không bắt buộc)</label>
                                <select id="task-assignee" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">
                                    <option value="">-- Giao toàn phòng (Trưởng phòng phân công) --</option>
                                    ${allUsers.map(u => `<option value="${u.id}" data-dept="${u.deptId}">${u.fullName} (${u.position || 'Nhân viên'})</option>`).join('')}
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-bold text-slate-700 mb-1">Độ ưu tiên</label>
                                <select id="task-priority" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">
                                    <option value="TRUNGBINH">Trung bình</option>
                                    <option value="CAO">Cao</option>
                                    <option value="KHAN">Khẩn</option>
                                    <option value="THAP">Thấp</option>
                                </select>
                            </div>

                            <div>
                                <label class="block font-bold text-slate-700 mb-1">Hạn chót hoàn thành <span class="text-rose-500">*</span></label>
                                <input type="date" id="task-duedate" required 
                                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white" />
                            </div>
                        </div>

                        <div class="pt-4 border-t border-slate-100 flex justify-end gap-2">
                            <button type="button" id="cancel-form-btn" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition">Hủy</button>
                            <button type="submit" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition flex items-center gap-1.5">
                                <i class="fa-solid fa-paper-plane"></i> Tạo & Giao việc
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modalElement = document.getElementById(modalId);
        const form = document.getElementById('create-task-form');
        const closeBtn = document.getElementById('close-form-btn');
        const cancelBtn = document.getElementById('cancel-form-btn');

        const closeModal = () => modalElement.remove();
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // Xử lý gửi Form
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const taskId = 'task_' + Date.now();
            const deptId = document.getElementById('task-dept').value;
            const assigneeSelect = document.getElementById('task-assignee');
            const assigneeId = assigneeSelect.value;
            const assigneeName = assigneeId ? assigneeSelect.options[assigneeSelect.selectedIndex].text.split(' (')[0] : 'Toàn phòng';

            const newTask = {
                id: taskId,
                title: document.getElementById('task-title').value,
                description: document.getElementById('task-desc').value,
                deptId: deptId,
                assigneeId: assigneeId || null,
                assigneeName: assigneeName,
                createdByName: currentUser ? `${currentUser.fullName} (${currentUser.position || 'Ban Giám đốc'})` : 'Ban Giám đốc',
                priority: document.getElementById('task-priority').value,
                status: 'CHO_XU_LY',
                progress: 0,
                dueDate: document.getElementById('task-duedate').value
            };

            try {
                await set(ref(db, `tasks/${taskId}`), newTask);
                closeModal();
                if (onSuccess) onSuccess();
            } catch (err) {
                alert('Lỗi tạo công việc: ' + err.message);
            }
        });
    }
};