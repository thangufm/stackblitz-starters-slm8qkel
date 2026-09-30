//Form / Modal Thêm - Sửa công việc
import { TaskService } from '../services/task-service.js';
import { DeptService } from '../services/dept-service.js';

export const TaskFormComponent = {
    // Hiển thị Modal (Nếu taskData null -> Thêm mới, có taskData -> Cập nhật)
    render(currentUser, taskData = null, onSuccess) {
        const container = document.getElementById('modal-container');
        if (!container) return;

        const isEdit = !!taskData;
        const depts = DeptService.getDepartments();

        container.innerHTML = `
            <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                    
                    <!-- Modal Header -->
                    <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                            <i class="fa-solid ${isEdit ? 'fa-pen-to-square text-amber-600' : 'fa-circle-plus text-indigo-600'}"></i>
                            ${isEdit ? 'Cập Nhật Công Việc' : 'Tạo Công Việc Mới'}
                        </h3>
                        <button id="btn-close-modal" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition">
                            <i class="fa-solid fa-xmark text-lg"></i>
                        </button>
                    </div>

                    <!-- Modal Body Form -->
                    <form id="task-form" class="p-6 space-y-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Tên công việc <span class="text-rose-500">*</span></label>
                            <input type="text" id="task-title" required value="${isEdit ? taskData.title : ''}" placeholder="Nhập tên/tiêu đề công việc..." class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Mô tả nội dung</label>
                            <textarea id="task-desc" rows="3" placeholder="Chi tiết yêu cầu công việc..." class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">${isEdit ? (taskData.description || '') : ''}</textarea>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Phòng ban phụ trách</label>
                                <select id="task-dept" class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    ${depts.map(d => `<option value="${d.id}" ${(isEdit ? taskData.deptId : currentUser.deptId) === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Người thực hiện</label>
                                <input type="text" id="task-assignee" value="${isEdit ? (taskData.assigneeName || '') : currentUser.fullName}" placeholder="Tên cán bộ thực hiện" class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Mức độ ưu tiên</label>
                                <select id="task-priority" class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="low" ${isEdit && taskData.priority === 'low' ? 'selected' : ''}>Thấp</option>
                                    <option value="medium" ${!isEdit || taskData.priority === 'medium' ? 'selected' : ''}>Trung bình</option>
                                    <option value="high" ${isEdit && taskData.priority === 'high' ? 'selected' : ''}>Cao</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Trạng thái</label>
                                <select id="task-status" class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="pending" ${!isEdit || taskData.status === 'pending' ? 'selected' : ''}>Mới tạo</option>
                                    <option value="in_progress" ${isEdit && taskData.status === 'in_progress' ? 'selected' : ''}>Đang thực hiện</option>
                                    <option value="completed" ${isEdit && taskData.status === 'completed' ? 'selected' : ''}>Hoàn thành</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Hạn hoàn thành (Deadline)</label>
                            <input type="date" id="task-duedate" value="${isEdit ? (taskData.dueDate || '') : ''}" class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>

                        <div id="modal-error" class="hidden p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium"></div>

                        <!-- Footer Actions -->
                        <div class="pt-3 border-t border-slate-100 flex justify-end gap-3">
                            <button type="button" id="btn-cancel-modal" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition">
                                Hủy bỏ
                            </button>
                            <button type="submit" id="btn-save-task" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow transition flex items-center gap-2">
                                <i class="fa-solid fa-floppy-disk"></i>
                                <span>${isEdit ? 'Lưu cập nhật' : 'Tạo mới'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Đóng Modal
        const closeModal = () => { container.innerHTML = ''; };
        document.getElementById('btn-close-modal')?.addEventListener('click', closeModal);
        document.getElementById('btn-cancel-modal')?.addEventListener('click', closeModal);

        // Submit Form
        document.getElementById('task-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errorEl = document.getElementById('modal-error');
            const submitBtn = document.getElementById('btn-save-task');

            errorEl.classList.add('hidden');
            submitBtn.disabled = true;

            const payload = {
                title: document.getElementById('task-title').value.trim(),
                description: document.getElementById('task-desc').value.trim(),
                deptId: document.getElementById('task-dept').value,
                assigneeName: document.getElementById('task-assignee').value.trim(),
                priority: document.getElementById('task-priority').value,
                status: document.getElementById('task-status').value,
                dueDate: document.getElementById('task-duedate').value,
                createdById: currentUser.id,
                createdByName: currentUser.fullName
            };

            try {
                if (isEdit) {
                    await TaskService.updateTask(taskData.id, payload);
                } else {
                    await TaskService.createTask(payload);
                }
                closeModal();
                if (onSuccess) onSuccess();
            } catch (err) {
                errorEl.innerText = `Lỗi: ${err.message}`;
                errorEl.classList.remove('hidden');
            } finally {
                submitBtn.disabled = false;
            }
        });
    }
};