import { TaskDetailModalComponent } from './task-detail-modal.js';
import { TaskFormModalComponent } from './task-form-modal.js';

export const TaskListComponent = {
    currentPage: 1,
    pageSize: 15,

    render(container, tasks = [], currentUser, onTaskClick, onTaskCreated) {
        if (!container) return;

        // 1. Sắp xếp danh sách công việc mới nhất lên đầu (dựa vào created_at hoặc id)
        const sortedTasks = [...tasks].sort((a, b) => {
            const timeA = a.created_at ? new Date(a.created_at).getTime() : (a.id || 0);
            const timeB = b.created_at ? new Date(b.created_at).getTime() : (b.id || 0);
            return timeB - timeA; // Mới nhất lên trước
        });

        // 2. Render khung Giao diện + Bộ lọc
        container.innerHTML = `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 space-y-4">
                
                <!-- THANH BỘ LỌC -->
                <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    
                    <div class="flex flex-wrap items-center gap-2 text-xs">
                        <!-- Chọn từ ngày bất kỳ (Để trống mặc định để thấy ngay việc mới nhất) -->
                        <div class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                            <i class="fa-regular fa-calendar-days text-indigo-600 font-bold"></i>
                            <span class="font-bold text-slate-600">Xem từ ngày:</span>
                            <input type="date" id="filter-from-date" 
                                class="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer"
                                title="Chọn ngày để xem công việc từ ngày đó trở đi">
                        </div>

                        <!-- Lọc Phòng Ban -->
                        <select id="filter-dept" class="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium text-slate-700 outline-none">
                            <option value="">-- Tất cả phòng ban --</option>
                            <option value="BGD">Ban Giám đốc</option>
                            <option value="HCTV">Phòng Hành chính – Tài vụ</option>
                            <option value="ĐT-KH-QLSV">Phòng Đào tạo - Khoa học và QLSV</option>
                        </select>

                        <!-- Lọc Trạng Thái -->
                        <select id="filter-status" class="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium text-slate-700 outline-none">
                            <option value="">-- Tất cả trạng thái --</option>
                            <option value="Chờ xử lý">Chờ xử lý</option>
                            <option value="Đang thực hiện">Đang thực hiện</option>
                            <option value="Chờ duyệt">Chờ duyệt</option>
                            <option value="Hoàn thành">Hoàn thành</option>
                        </select>

                        <!-- Nút Xóa Lọc (Xem toàn bộ) -->
                        <button id="btn-reset-filter" title="Xem tất cả công việc mới nhất" 
                            class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition flex items-center gap-1">
                            <i class="fa-solid fa-arrows-rotate text-[10px]"></i> Tất cả
                        </button>
                    </div>

                    <!-- Nút Giao việc mới (Chỉ BGD) -->
                    <div class="flex items-center gap-3">
                        <span class="text-xs text-slate-500">Hiển thị: <b id="task-count-text" class="text-indigo-600">0</b> công việc</span>
                        ${currentUser?.department === 'BGD' ? `
                            <button id="btn-open-create-task" 
                                class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
                                <i class="fa-solid fa-plus"></i> Giao việc mới
                            </button>
                        ` : ''}
                    </div>

                </div>

                <!-- BẢNG CÔNG VIỆC -->
                <div class="overflow-x-auto rounded-xl border border-slate-200">
                    <table class="w-full text-xs text-left border-collapse">
                        <thead class="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <th class="p-3 text-center w-12">STT</th>
                                <th class="p-3">Tên công việc / Nội dung</th>
                                <th class="p-3 w-48">Đơn vị chủ trì</th>
                                <th class="p-3 w-40">Người thực hiện</th>
                                <th class="p-3 text-center w-24">Ưu tiên</th>
                                <th class="p-3 text-center w-28">Trạng thái</th>
                                <th class="p-3 text-center w-28">Tiến độ</th>
                                <th class="p-3 text-center w-28">Hạn chót</th>
                            </tr>
                        </thead>
                        <tbody id="task-table-body" class="divide-y divide-slate-100 bg-white">
                            <!-- Dữ liệu render tại đây -->
                        </tbody>
                    </table>
                </div>

                <!-- THANH PHÂN TRANG -->
                <div id="pagination-container" class="flex items-center justify-between pt-2 text-xs text-slate-600">
                </div>

            </div>
        `;

        // 3. Hàm Lọc & Phân trang Tự động
        const applyFiltersAndRender = () => {
            const selectedFromDate = document.getElementById('filter-from-date')?.value;
            const dept = document.getElementById('filter-dept')?.value;
            const status = document.getElementById('filter-status')?.value;

            // Chuyển DD/MM/YYYY về YYYY-MM-DD để so sánh ngày
            const parseDateStr = (dateStr) => {
                if (!dateStr) return '';
                if (dateStr.includes('/')) {
                    const parts = dateStr.split('/');
                    if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                }
                return dateStr;
            };

            // Lọc dữ liệu
            let filtered = sortedTasks.filter(task => {
                // Kiểm tra ngày tạo hoặc hạn chót
                if (selectedFromDate) {
                    const taskCreatedDate = task.created_at ? parseDateStr(task.created_at.split('T')[0]) : '';
                    const taskDeadline = parseDateStr(task.deadline);
                    const compareDate = taskCreatedDate || taskDeadline;

                    if (compareDate && compareDate < selectedFromDate) {
                        return false;
                    }
                }

                if (dept && task.department !== dept) return false;
                if (status && task.status !== status) return false;

                return true;
            });

            // Cập nhật số lượng đếm
            const countText = document.getElementById('task-count-text');
            if (countText) countText.textContent = filtered.length;

            // Tính Phân trang (>15 công việc)
            const totalPages = Math.ceil(filtered.length / this.pageSize) || 1;
            if (this.currentPage > totalPages) this.currentPage = totalPages;

            const startIndex = (this.currentPage - 1) * this.pageSize;
            const paginatedTasks = filtered.slice(startIndex, startIndex + this.pageSize);

            // Render Nội dung Bảng
            const tbody = document.getElementById('task-table-body');
            if (!tbody) return;

            if (paginatedTasks.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" class="p-8 text-center text-slate-400 font-medium">
                            Không có công việc nào từ ngày đã chọn.
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = paginatedTasks.map((t, idx) => `
                    <tr data-task-id="${t.id}" class="hover:bg-indigo-50/40 cursor-pointer transition">
                        <td class="p-3 text-center font-bold text-slate-400">${startIndex + idx + 1}</td>
                        <td class="p-3">
                            <div class="font-bold text-slate-800 line-clamp-1">${t.title || ''}</div>
                            <div class="text-[11px] text-slate-500 line-clamp-1">${t.description || ''}</div>
                        </td>
                        <td class="p-3 font-semibold text-slate-600">${t.departmentName || t.department || ''}</td>
                        <td class="p-3 text-slate-700 font-medium">${t.assigneeName || 'Chưa phân công'}</td>
                        <td class="p-3 text-center">
                            <span class="px-2 py-0.5 rounded-md font-bold text-[10px] ${t.priority === 'Khẩn' ? 'bg-rose-100 text-rose-700' : t.priority === 'Cao' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}">
                                ${t.priority || 'Thường'}
                            </span>
                        </td>
                        <td class="p-3 text-center">
                            <span class="px-2 py-0.5 rounded-md font-semibold text-[10px] ${t.status === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-700' : t.status === 'Đang thực hiện' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}">
                                ${t.status || 'Chờ xử lý'}
                            </span>
                        </td>
                        <td class="p-3 text-center font-bold text-indigo-600">${t.progress || 0}%</td>
                        <td class="p-3 text-center font-semibold text-slate-600">${t.deadline || ''}</td>
                    </tr>
                `).join('');

                // Click mở Chi tiết
                tbody.querySelectorAll('tr[data-task-id]').forEach(row => {
                    row.onclick = () => {
                        const taskId = row.getAttribute('data-task-id');
                        const selectedTask = tasks.find(item => String(item.id) === String(taskId));
                        if (selectedTask) TaskDetailModalComponent.render(selectedTask, currentUser);
                    };
                });
            }

            // Render Nút Phân trang
            const pagContainer = document.getElementById('pagination-container');
            if (pagContainer) {
                if (filtered.length <= this.pageSize) {
                    pagContainer.innerHTML = `<span class="text-slate-400">Đang hiển thị toàn bộ ${filtered.length} công việc</span>`;
                } else {
                    pagContainer.innerHTML = `
                        <div>Trang <b>${this.currentPage}</b> / <b>${totalPages}</b> (Tổng ${filtered.length} công việc)</div>
                        <div class="flex items-center gap-1.5">
                            <button id="btn-prev-page" ${this.currentPage === 1 ? 'disabled' : ''} 
                                class="px-3 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg font-bold">
                                <i class="fa-solid fa-chevron-left"></i> Trước
                            </button>
                            <button id="btn-next-page" ${this.currentPage === totalPages ? 'disabled' : ''} 
                                class="px-3 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg font-bold">
                                Sau <i class="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    `;

                    document.getElementById('btn-prev-page')?.addEventListener('click', () => {
                        if (this.currentPage > 1) {
                            this.currentPage--;
                            applyFiltersAndRender();
                        }
                    });

                    document.getElementById('btn-next-page')?.addEventListener('click', () => {
                        if (this.currentPage < totalPages) {
                            this.currentPage++;
                            applyFiltersAndRender();
                        }
                    });
                }
            }
        };

        // 4. BẮT SỰ KIỆN TỰ ĐỘNG THAY ĐỔI
        // Sự kiện 'input' & 'change' giúp bảng cập nhật TỨC THÌ ngay khi chọn ngày
        const dateInput = document.getElementById('filter-from-date');
        if (dateInput) {
            dateInput.addEventListener('change', () => { this.currentPage = 1; applyFiltersAndRender(); });
            dateInput.addEventListener('input', () => { this.currentPage = 1; applyFiltersAndRender(); });
        }

        document.getElementById('filter-dept')?.addEventListener('change', () => { this.currentPage = 1; applyFiltersAndRender(); });
        document.getElementById('filter-status')?.addEventListener('change', () => { this.currentPage = 1; applyFiltersAndRender(); });

        // Nút đặt lại hiển thị tất cả
        document.getElementById('btn-reset-filter')?.addEventListener('click', () => {
            if (dateInput) dateInput.value = '';
            document.getElementById('filter-dept').value = '';
            document.getElementById('filter-status').value = '';
            this.currentPage = 1;
            applyFiltersAndRender();
        });

        // Nút Tạo việc mới
        document.getElementById('btn-open-create-task')?.addEventListener('click', () => {
            TaskFormModalComponent.render(currentUser, onTaskCreated);
        });

        // Chạy lọc hiển thị lần đầu
        applyFiltersAndRender();
    }
};