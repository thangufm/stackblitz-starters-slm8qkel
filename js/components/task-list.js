import { DeptService } from '../services/dept-service.js';

export const TaskListComponent = {
    render(container, tasks = [], currentUser = null, onSelectTask = null) {
        const departments = DeptService.getDepartments();

        // Biến lưu trạng thái lọc
        let selectedDept = 'ALL';
        let selectedStatus = 'ALL';

        const filterTasks = () => {
            return tasks.filter(task => {
                const matchDept = selectedDept === 'ALL' || task.deptId === selectedDept;
                const matchStatus = selectedStatus === 'ALL' || task.status === selectedStatus;
                return matchDept && matchStatus;
            });
        };

        const renderCards = () => {
            const filtered = filterTasks();
            const cardContainer = container.querySelector('#task-cards-grid');
            if (!cardContainer) return;

            if (filtered.length === 0) {
                cardContainer.innerHTML = `
                    <div class="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                        <i class="fa-solid fa-folder-open text-4xl mb-2 text-slate-300"></i>
                        <p class="text-sm">Không tìm thấy công việc nào phù hợp!</p>
                    </div>
                `;
                return;
            }

            cardContainer.innerHTML = filtered.map(task => {
                const priorityBadge = getPriorityBadge(task.priority);
                const statusBadge = getStatusBadge(task.status);
                const deptName = DeptService.getDeptName(task.deptId);

                return `
                    <div class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md border border-slate-200 transition duration-200 flex flex-col justify-between cursor-pointer"
                        data-task-id="${task.id}">
                        <div>
                            <!-- Header thẻ -->
                            <div class="flex items-center justify-between gap-2 mb-3">
                                ${priorityBadge}
                                ${statusBadge}
                            </div>

                            <!-- Tiêu đề -->
                            <h3 class="font-bold text-slate-800 text-base line-clamp-2 hover:text-indigo-600 transition mb-2">
                                ${task.title}
                            </h3>

                            <!-- Mô tả ngắn -->
                            <p class="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                                ${task.description || 'Chưa có mô tả chi tiết'}
                            </p>
                        </div>

                        <!-- Thông tin thêm -->
                        <div class="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
                            <div class="flex items-center justify-between">
                                <span class="text-slate-400"><i class="fa-solid fa-building mr-1"></i>Đơn vị:</span>
                                <span class="font-semibold text-slate-700">${deptName}</span>
                            </div>

                            <div class="flex items-center justify-between">
                                <span class="text-slate-400"><i class="fa-solid fa-user mr-1"></i>Người thực hiện:</span>
                                <span class="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">${task.assigneeName || 'Chưa gán'}</span>
                            </div>

                            <div class="flex items-center justify-between">
                                <span class="text-slate-400"><i class="fa-regular fa-calendar-check mr-1"></i>Hạn chót:</span>
                                <span class="font-medium text-slate-700">${task.dueDate || 'N/A'}</span>
                            </div>

                            <!-- Thanh tiến độ -->
                            <div class="pt-2">
                                <div class="flex justify-between text-[11px] text-slate-500 mb-1">
                                    <span>Tiến độ</span>
                                    <span class="font-bold text-indigo-600">${task.progress || 0}%</span>
                                </div>
                                <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div class="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" style="width: ${task.progress || 0}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Gán sự kiện click cho từng thẻ
            cardContainer.querySelectorAll('[data-task-id]').forEach(card => {
                card.addEventListener('click', () => {
                    const taskId = card.getAttribute('data-task-id');
                    const task = tasks.find(t => t.id === taskId);
                    if (task && onSelectTask) onSelectTask(task);
                });
            });
        };

        // Render giao diện chung
        container.innerHTML = `
            <div class="space-y-6">
                <!-- Thanh công cụ & Bộ lọc -->
                <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <!-- Lọc Phòng Ban -->
                        <select id="filter-dept" class="px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                            <option value="ALL">-- Tất cả phòng ban --</option>
                            ${departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                        </select>

                        <!-- Lọc Trạng Thái -->
                        <select id="filter-status" class="px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                            <option value="ALL">-- Tất cả trạng thái --</option>
                            <option value="CHO_XU_LY">Chờ xử lý</option>
                            <option value="DANG_THUC_HIEN">Đang thực hiện</option>
                            <option value="CHO_DUYET">Chờ duyệt</option>
                            <option value="HOAN_THANH">Hoàn thành</option>
                        </select>
                    </div>

                    <div class="text-xs text-slate-500">
                        Hiển thị <span id="task-count" class="font-bold text-indigo-600">${tasks.length}</span> công việc
                    </div>
                </div>

                <!-- Grid Danh sách thẻ -->
                <div id="task-cards-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"></div>
            </div>
        `;

        // Lắng nghe sự kiện đổi bộ lọc
        const deptSelect = container.querySelector('#filter-dept');
        const statusSelect = container.querySelector('#filter-status');

        deptSelect.addEventListener('change', (e) => {
            selectedDept = e.target.value;
            renderCards();
        });

        statusSelect.addEventListener('change', (e) => {
            selectedStatus = e.target.value;
            renderCards();
        });

        // Khởi tạo thẻ ban đầu
        renderCards();
    }
};

// Hàm bổ trợ hiển thị Nhãn Ưu tiên
function getPriorityBadge(priority) {
    switch (priority) {
        case 'KHAN':
            return `<span class="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200"><i class="fa-solid fa-bolt mr-1"></i>Khẩn</span>`;
        case 'CAO':
            return `<span class="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">Cao</span>`;
        case 'TRUNGBINH':
            return `<span class="bg-sky-100 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-200">Trung bình</span>`;
        default:
            return `<span class="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full">Thấp</span>`;
    }
}

// Hàm bổ trợ hiển thị Nhãn Trạng thái
function getStatusBadge(status) {
    switch (status) {
        case 'CHO_XU_LY':
            return `<span class="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded">Chờ xử lý</span>`;
        case 'DANG_THUC_HIEN':
            return `<span class="bg-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded">Đang thực hiện</span>`;
        case 'CHO_DUYET':
            return `<span class="bg-purple-100 text-purple-700 text-[10px] font-semibold px-2 py-0.5 rounded">Chờ duyệt</span>`;
        case 'HOAN_THANH':
            return `<span class="bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded">Hoàn thành</span>`;
        default:
            return `<span class="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded">N/A</span>`;
    }
}