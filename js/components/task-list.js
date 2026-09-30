//Hiển thị bảng danh sách & Lọc công việc
import { DeptService } from '/js/services/dept-service.js';
import { TaskService } from '/js/services/task-service.js';
import { formatDate, getStatusBadge, getPriorityBadge } from '/js/utils/formatters.js';

export const TaskListComponent = {
    render(container, tasks, currentUser, onEditTask) {
        if (!container) return;

        const depts = DeptService.getDepartments();

        container.innerHTML = `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-6">
                <!-- Header Actions & Filters -->
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                        <h2 class="text-lg font-bold text-slate-800">Danh Sách Công Việc</h2>
                        <p class="text-xs text-slate-500">Quản lý và theo dõi tiến độ công việc được giao</p>
                    </div>

                    <button id="btn-create-task" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow transition flex items-center justify-center gap-2">
                        <i class="fa-solid fa-plus"></i>
                        <span>Tạo Công Việc Mới</span>
                    </button>
                </div>

                <!-- Controls Bar: Search & Select Filter -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div class="relative">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs"></i>
                        <input type="text" id="filter-search" placeholder="Tìm theo tên công việc..." class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>

                    <div>
                        <select id="filter-dept" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">-- Tất cả Phòng ban --</option>
                            ${depts.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                        </select>
                    </div>

                    <div>
                        <select id="filter-status" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">-- Tất cả Trạng thái --</option>
                            <option value="pending">Mới tạo</option>
                            <option value="in_progress">Đang thực hiện</option>
                            <option value="completed">Hoàn thành</option>
                        </select>
                    </div>
                </div>

                <!-- Task Table -->
                <div class="overflow-x-auto rounded-xl border border-slate-100">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                                <th class="py-3 px-4">Tên Công Việc</th>
                                <th class="py-3 px-4">Phòng Ban / Phụ Trách</th>
                                <th class="py-3 px-4">Ưu Tiên</th>
                                <th class="py-3 px-4">Trạng Thái</th>
                                <th class="py-3 px-4">Hạn Hoàn Thành</th>
                                <th class="py-3 px-4 text-center">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody id="task-table-body" class="divide-y divide-slate-100 text-xs text-slate-700">
                            <!-- Dữ liệu render động ở hàm renderRows -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        const tableBody = document.getElementById('task-table-body');
        const filterSearch = document.getElementById('filter-search');
        const filterDept = document.getElementById('filter-dept');
        const filterStatus = document.getElementById('filter-status');

        // Lọc dữ liệu và hiển thị
        const applyFilters = () => {
            const searchVal = filterSearch.value.toLowerCase().trim();
            const deptVal = filterDept.value;
            const statusVal = filterStatus.value;

            const filtered = tasks.filter(t => {
                const matchSearch = !searchVal || (t.title && t.title.toLowerCase().includes(searchVal));
                const matchDept = !deptVal || t.deptId === deptVal;
                const matchStatus = !statusVal || t.status === statusVal;
                return matchSearch && matchDept && matchStatus;
            });

            this.renderRows(tableBody, filtered, currentUser, onEditTask);
        };

        filterSearch?.addEventListener('input', applyFilters);
        filterDept?.addEventListener('change', applyFilters);
        filterStatus?.addEventListener('change', applyFilters);

        // Nút Tạo công việc mới
        document.getElementById('btn-create-task')?.addEventListener('click', () => {
            if (onEditTask) onEditTask(null);
        });

        // Hiển thị danh sách ban đầu
        applyFilters();
    },

    renderRows(tableBody, tasks, currentUser, onEditTask) {
        if (!tableBody) return;

        if (tasks.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-12 text-slate-400">
                        <i class="fa-regular fa-folder-open text-3xl mb-2 block"></i>
                        <span>Chưa có công việc nào phù hợp</span>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = tasks.map(task => {
            const statusInfo = getStatusBadge(task.status);
            const priorityInfo = getPriorityBadge(task.priority);
            const deptName = DeptService.getDeptName(task.deptId);

            return `
                <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-3 px-4">
                        <p class="font-semibold text-slate-800 text-sm mb-0.5">${task.title}</p>
                        ${task.description ? `<p class="text-[11px] text-slate-400 line-clamp-1">${task.description}</p>` : ''}
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap">
                        <p class="font-medium text-slate-700">${task.assigneeName || 'Chưa gán'}</p>
                        <p class="text-[10px] text-slate-400">${deptName}</p>
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap">
                        <span class="inline-block px-2 py-0.5 text-[10px] font-semibold border rounded-full ${priorityInfo.class}">
                            ${priorityInfo.label}
                        </span>
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap">
                        <span class="inline-block px-2.5 py-1 text-[11px] font-medium border rounded-lg ${statusInfo.bgClass}">
                            ${statusInfo.label}
                        </span>
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap text-slate-600 font-medium">
                        ${formatDate(task.dueDate)}
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap text-center">
                        <div class="flex items-center justify-center gap-2">
                            <button data-action="edit" data-id="${task.id}" class="btn-edit p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Sửa công việc">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button data-action="delete" data-id="${task.id}" class="btn-delete p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Xóa công việc">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Gán sự kiện cho các nút Sửa / Xóa trên từng dòng
        tableBody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.currentTarget.getAttribute('data-id');
                const task = tasks.find(t => t.id === taskId);
                if (onEditTask && task) onEditTask(task);
            });
        });

        tableBody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const taskId = e.currentTarget.getAttribute('data-id');
                if (confirm('Anh có chắc chắn muốn xóa công việc này không?')) {
                    await TaskService.deleteTask(taskId);
                }
            });
        });
    }
};