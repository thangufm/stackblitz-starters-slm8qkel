import { DeptService } from '../services/dept-service.js';
import { TaskDetailModalComponent } from './task-detail-modal.js';
import { TaskFormModalComponent } from './task-form-modal.js';

export const TaskListComponent = {
    render(container, tasks = [], currentUser = null, onSelectTask = null, onTaskCreated = null) {
        const departments = DeptService.getDepartments();

        let selectedDept = 'ALL';
        let selectedStatus = 'ALL';

        const filterTasks = () => {
            return tasks.filter(task => {
                const matchDept = selectedDept === 'ALL' || task.deptId === selectedDept;
                const matchStatus = selectedStatus === 'ALL' || task.status === selectedStatus;
                return matchDept && matchStatus;
            });
        };

        // Hàm định dạng ngày DD/MM/YYYY
        const formatDate = (dateStr) => {
            if (!dateStr) return 'N/A';
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
            return dateStr;
        };

        // Hàm phân màu Badge theo Phòng Ban (Yêu cầu 1)
        const getDeptBadge = (deptId) => {
            const deptName = DeptService.getDeptName(deptId);
            switch (deptId) {
                case 'dept_bgd':
                    return `<span class="bg-purple-100 text-purple-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-purple-200">${deptName}</span>`;
                case 'dept_hctv':
                    return `<span class="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-blue-200">${deptName}</span>`;
                case 'dept_dtkhqlsv':
                    return `<span class="bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald-200">${deptName}</span>`;
                default:
                    return `<span class="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-slate-200">${deptName}</span>`;
            }
        };

        const renderTableRows = () => {
            const filtered = filterTasks();
            const tableBody = container.querySelector('#task-table-body');
            const countLabel = container.querySelector('#task-count');
            
            if (countLabel) countLabel.textContent = filtered.length;
            if (!tableBody) return;

            if (filtered.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="8" class="px-4 py-8 text-center text-slate-400 bg-slate-50">
                            <i class="fa-solid fa-folder-open text-2xl mb-1 text-slate-300 block"></i>
                            <span class="text-xs">Không tìm thấy công việc nào phù hợp!</span>
                        </td>
                    </tr>
                `;
                return;
            }

            tableBody.innerHTML = filtered.map((task, index) => {
                const priorityBadge = getPriorityBadge(task.priority);
                const statusBadge = getStatusBadge(task.status);
                const deptBadge = getDeptBadge(task.deptId);

                return `
                    <tr class="hover:bg-indigo-50/50 transition duration-150 border-b border-slate-200 text-xs text-slate-700 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}"
                        data-task-id="${task.id}">
                        <td class="px-3 py-3 text-center font-medium text-slate-400 border-r border-slate-200 w-12">
                            ${index + 1}
                        </td>
                        <td class="px-4 py-3 border-r border-slate-200">
                            <div class="font-bold text-slate-800 hover:text-indigo-600 transition line-clamp-1">
                                ${task.title}
                            </div>
                            ${task.description ? `<div class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">${task.description}</div>` : ''}
                        </td>
                        <!-- Cột đơn vị phân màu -->
                        <td class="px-3 py-3 border-r border-slate-200 whitespace-nowrap">
                            ${deptBadge}
                        </td>
                        <td class="px-3 py-3 border-r border-slate-200 font-medium text-indigo-700 whitespace-nowrap">
                            <i class="fa-regular fa-user mr-1 text-indigo-400"></i>${task.assigneeName || 'Chưa gán'}
                        </td>
                        <td class="px-3 py-3 border-r border-slate-200 text-center whitespace-nowrap">
                            ${priorityBadge}
                        </td>
                        <td class="px-3 py-3 border-r border-slate-200 text-center whitespace-nowrap">
                            ${statusBadge}
                        </td>
                        <td class="px-3 py-3 border-r border-slate-200 whitespace-nowrap w-32">
                            <div class="flex items-center gap-2">
                                <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                    <div class="bg-indigo-600 h-1.5 rounded-full" style="width: ${task.progress || 0}%"></div>
                                </div>
                                <span class="text-[11px] font-bold text-slate-600 w-8 text-right">${task.progress || 0}%</span>
                            </div>
                        </td>
                        <!-- Cột Hạn chót dạng DD/MM/YYYY -->
                        <td class="px-3 py-3 text-center font-semibold text-slate-700 whitespace-nowrap">
                            ${formatDate(task.dueDate)}
                        </td>
                    </tr>
                `;
            }).join('');

            tableBody.querySelectorAll('[data-task-id]').forEach(row => {
                row.addEventListener('click', () => {
                    const taskId = row.getAttribute('data-task-id');
                    const task = tasks.find(t => t.id === taskId);
                    if (task) {
                        TaskDetailModalComponent.render(task, currentUser);
                        if (onSelectTask) onSelectTask(task);
                    }
                });
            });
        };

        // Kiểm tra xem User có phải thuộc Ban Giám đốc hoặc Admin không (Yêu cầu 3)
        const isBGD = currentUser && (currentUser.deptId === 'dept_bgd' || currentUser.role === 'admin');

        container.innerHTML = `
            <div class="space-y-4">
                <div class="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div class="flex flex-wrap items-center gap-2.5">
                        <span class="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                            <i class="fa-solid fa-filter mr-1"></i>Lọc:
                        </span>
                        
                        <select id="filter-dept" class="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50">
                            <option value="ALL">-- Tất cả phòng ban --</option>
                            ${departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                        </select>

                        <select id="filter-status" class="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50">
                            <option value="ALL">-- Tất cả trạng thái --</option>
                            <option value="CHO_XU_LY">Chờ xử lý</option>
                            <option value="DANG_THUC_HIEN">Đang thực hiện</option>
                            <option value="CHO_DUYET">Chờ duyệt</option>
                            <option value="HOAN_THANH">Hoàn thành</option>
                        </select>
                    </div>

                    <div class="flex items-center gap-3">
                        <div class="text-xs text-slate-500 font-medium">
                            Tổng số: <span id="task-count" class="font-bold text-indigo-600">${tasks.length}</span> công việc
                        </div>

                        <!-- Nút Giao việc mới dành riêng cho Ban Giám đốc (Yêu cầu 3) -->
                        ${isBGD ? `
                            <button id="btn-create-task" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
                                <i class="fa-solid fa-plus"></i> Giao việc mới
                            </button>
                        ` : ''}
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse text-left">
                            <thead>
                                <tr class="bg-slate-100 border-b border-slate-300 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                    <th class="px-3 py-2.5 text-center border-r border-slate-200 w-12">STT</th>
                                    <th class="px-4 py-2.5 border-r border-slate-200">Tên Công Việc / Nội Dung</th>
                                    <th class="px-3 py-2.5 border-r border-slate-200 w-48">Đơn Vị Chủ Trì</th>
                                    <th class="px-3 py-2.5 border-r border-slate-200 w-44">Người Thực Hiện</th>
                                    <th class="px-3 py-2.5 text-center border-r border-slate-200 w-28">Ưu Tiên</th>
                                    <th class="px-3 py-2.5 text-center border-r border-slate-200 w-32">Trạng Thái</th>
                                    <th class="px-3 py-2.5 border-r border-slate-200 w-36">Tiến Độ</th>
                                    <th class="px-3 py-2.5 text-center w-28">Hạn Chót</th>
                                </tr>
                            </thead>
                            <tbody id="task-table-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        const deptSelect = container.querySelector('#filter-dept');
        const statusSelect = container.querySelector('#filter-status');
        const btnCreateTask = container.querySelector('#btn-create-task');

        deptSelect.addEventListener('change', (e) => {
            selectedDept = e.target.value;
            renderTableRows();
        });

        statusSelect.addEventListener('change', (e) => {
            selectedStatus = e.target.value;
            renderTableRows();
        });

        if (btnCreateTask) {
            btnCreateTask.addEventListener('click', () => {
                TaskFormModalComponent.render(currentUser, onTaskCreated);
            });
        }

        renderTableRows();
    }
};

function getPriorityBadge(priority) {
    switch (priority) {
        case 'KHAN':
            return `<span class="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200">Khẩn</span>`;
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