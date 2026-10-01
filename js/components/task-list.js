import { TaskDetailModalComponent } from './task-detail-modal.js';
import { TaskFormModalComponent } from './task-form-modal.js';

export const TaskListComponent = {
    currentPage: 1,
    pageSize: 15,

    render(container, tasks = [], currentUser, onTaskClick, onTaskCreated) {
        if (!container) return;

        // 1. Bản đồ ánh xạ Phòng ban (Map ID -> Tên đầy đủ)
        const deptNames = {
            'BGD': 'Ban Giám đốc',
            'HCTV': 'Phòng Hành chính – Tài vụ',
            'ĐT-KH-QLSV': 'Phòng Đào tạo - Khoa học và QLSV',
            'DAO_TAO': 'Phòng Đào tạo - Khoa học và QLSV',
            'HANH_CHINH': 'Phòng Hành chính – Tài vụ'
        };

        // 2. Sắp xếp công việc mới nhất lên đầu
        const sortedTasks = [...tasks].sort((a, b) => {
            const timeA = a.created_at ? new Date(a.created_at).getTime() : (a.id || 0);
            const timeB = b.created_at ? new Date(b.created_at).getTime() : (b.id || 0);
            return timeB - timeA;
        });

        // 3. Render Khung giao diện & Bộ lọc
        container.innerHTML = `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 space-y-4">
                
                <!-- THANH BỘ LỌC -->
                <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    
                    <div class="flex flex-wrap items-center gap-2 text-xs">
                        <!-- Chọn khoảng ngày: Từ ngày ... Đến ngày ... -->
                        <div class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                            <i class="fa-regular fa-calendar-days text-indigo-600 font-bold"></i>
                            <span class="font-bold text-slate-600">Từ:</span>
                            <input type="date" id="filter-from-date" class="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer">
                            <span class="font-bold text-slate-600 ml-1">Đến:</span>
                            <input type="date" id="filter-to-date" class="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer">
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
                            <option value="CHO_XU_LY">Chờ xử lý</option>
                            <option value="DANG_THUC_HIEN">Đang thực hiện</option>
                            <option value="CHO_DUYET">Chờ duyệt</option>
                            <option value="HOAN_THANH">Hoàn thành</option>
                        </select>

                        <!-- Nút Xóa Lọc -->
                        <button id="btn-reset-filter" title="Xem tất cả công việc mới nhất" 
                            class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition flex items-center gap-1">
                            <i class="fa-solid fa-arrows-rotate text-[10px]"></i> Tất cả
                        </button>
                    </div>

                    <!-- Nút Giao việc mới -->
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
                                <th class="p-3 text-center w-24">Tiến độ</th>
                                <th class="p-3 text-center w-28">Hạn chót</th>
                            </tr>
                        </thead>
                        <tbody id="task-table-body" class="divide-y divide-slate-100 bg-white">
                        </tbody>
                    </table>
                </div>

                <!-- THANH PHÂN TRANG -->
                <div id="pagination-container" class="flex items-center justify-between pt-2 text-xs text-slate-600">
                </div>

            </div>
        `;

        // 4. Hàm hỗ trợ Mapper dữ liệu linh hoạt (Xử lý các key dữ liệu khác nhau)
        const formatTaskData = (t) => {
            // Đơn vị chủ trì
            const deptKey = t.department || t.department_id || t.dept_id || t.DEPARTMENT || '';
            const deptName = deptNames[deptKey] || t.departmentName || deptKey || 'Chưa phân công';
        
            // 1. QUÉT TẤT CẢ CÁC TÊN TRƯỜNG CÓ THỂ CHỨA HẠN CHÓT TRÊN FIREBASE
            let rawDeadline = t.deadline || t.DEADLINE || t.due_date || t.dueDate || t.deadline_date || t.finish_date || t.dueDateStr || '';
        
            let formattedDeadline = '---';
        
            if (rawDeadline) {
                // Trường hợp 1: Dạng YYYY-MM-DD (VD: 2026-10-15) -> Chuyển thành 15/10/2026
                if (rawDeadline.includes('-')) {
                    const p = rawDeadline.split('T')[0].split('-');
                    if (p.length === 3) {
                        formattedDeadline = `${p[2]}/${p[1]}/${p[0]}`;
                    } else {
                        formattedDeadline = rawDeadline;
                    }
                } 
                // Trường hợp 2: Đã là dạng DD/MM/YYYY chuẩn sẵn
                else if (rawDeadline.includes('/')) {
                    formattedDeadline = rawDeadline;
                } 
                // Trường hợp 3: Dạng số Timestamp
                else if (!isNaN(rawDeadline)) {
                    const d = new Date(Number(rawDeadline));
                    if (!isNaN(d.getTime())) {
                        formattedDeadline = d.toLocaleDateString('vi-VN');
                    }
                } else {
                    formattedDeadline = rawDeadline;
                }
            }
        
            // Mức độ ưu tiên + Badges màu
            const rawPriority = String(t.priority || t.PRIORITY || '').toUpperCase();
            let priorityBadge = '<span class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-slate-100 text-slate-600">Thường</span>';
            if (rawPriority === 'KHAN' || rawPriority === 'KHẨN') {
                priorityBadge = '<span class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-rose-100 text-rose-700 border border-rose-200">Khẩn</span>';
            } else if (rawPriority === 'CAO') {
                priorityBadge = '<span class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-amber-100 text-amber-700 border border-amber-200">Cao</span>';
            } else if (rawPriority === 'TRUNGBINH' || rawPriority === 'TRUNG BÌNH') {
                priorityBadge = '<span class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-blue-100 text-blue-700 border border-blue-200">Trung bình</span>';
            }
        
            // Trạng thái + Badges màu
            const rawStatus = String(t.status || t.STATUS || '').toUpperCase();
            let statusBadge = '<span class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-slate-100 text-slate-600">Chờ xử lý</span>';
            if (rawStatus === 'CHO_XU_LY' || rawStatus === 'CHỜ XỬ LÝ') {
                statusBadge = '<span class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">Chờ xử lý</span>';
            } else if (rawStatus === 'DANG_THUC_HIEN' || rawStatus === 'ĐANG THỰC HIỆN') {
                statusBadge = '<span class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-indigo-100 text-indigo-700 border border-indigo-200">Đang thực hiện</span>';
            } else if (rawStatus === 'CHO_DUYET' || rawStatus === 'CHỜ DUYỆT') {
                statusBadge = '<span class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-purple-100 text-purple-700 border border-purple-200">Chờ duyệt</span>';
            } else if (rawStatus === 'HOAN_THANH' || rawStatus === 'HOÀN THÀNH') {
                statusBadge = '<span class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-200">Hoàn thành</span>';
            }
        
            return {
                deptName,
                formattedDeadline,
                rawDeadline,
                priorityBadge,
                statusBadge,
                deptKey,
                rawStatus
            };
        };

        // 5. Hàm lọc & Phân trang
        const applyFiltersAndRender = () => {
            const fromDate = document.getElementById('filter-from-date')?.value;
            const toDate = document.getElementById('filter-to-date')?.value;
            const dept = document.getElementById('filter-dept')?.value;
            const status = document.getElementById('filter-status')?.value;

            // Chuyển ngày về chuẩn YYYY-MM-DD
            const normalizeDate = (dStr) => {
                if (!dStr) return '';
                if (dStr.includes('/')) {
                    const p = dStr.split('/');
                    if (p.length === 3) return `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
                }
                return dStr;
            };

            // Lọc dữ liệu
            let filtered = sortedTasks.filter(task => {
                const info = formatTaskData(task);
                const taskDate = normalizeDate(info.rawDeadline || task.created_at?.split('T')[0]);

                if (fromDate && taskDate && taskDate < fromDate) return false;
                if (toDate && taskDate && taskDate > toDate) return false;
                if (dept && info.deptKey !== dept) return false;
                if (status && info.rawStatus !== status && task.status !== status) return false;

                return true;
            });

            // Cập nhật đếm số lượng
            const countText = document.getElementById('task-count-text');
            if (countText) countText.textContent = filtered.length;

            // Tính Phân trang
            const totalPages = Math.ceil(filtered.length / this.pageSize) || 1;
            if (this.currentPage > totalPages) this.currentPage = totalPages;

            const startIndex = (this.currentPage - 1) * this.pageSize;
            const paginatedTasks = filtered.slice(startIndex, startIndex + this.pageSize);

            // Render Rows Bảng
            const tbody = document.getElementById('task-table-body');
            if (!tbody) return;

            if (paginatedTasks.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" class="p-8 text-center text-slate-400 font-medium">
                            Không có công việc nào trong khoảng thời gian/bộ lọc đã chọn.
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = paginatedTasks.map((t, idx) => {
                    const info = formatTaskData(t);
                    return `
                        <tr data-task-id="${t.id}" class="hover:bg-indigo-50/40 cursor-pointer transition">
                            <td class="p-3 text-center font-bold text-slate-400">${startIndex + idx + 1}</td>
                            <td class="p-3">
                                <div class="font-bold text-slate-800 line-clamp-1">${t.title || t.name || ''}</div>
                                <div class="text-[11px] text-slate-500 line-clamp-1">${t.description || t.content || ''}</div>
                            </td>
                            <td class="p-3 font-semibold text-slate-600">${info.deptName}</td>
                            <td class="p-3 text-slate-700 font-medium">${t.assigneeName || t.assignee || 'Chưa phân công'}</td>
                            <td class="p-3 text-center">${info.priorityBadge}</td>
                            <td class="p-3 text-center">${info.statusBadge}</td>
                            <td class="p-3 text-center font-bold text-indigo-600">${t.progress || 0}%</td>
                            <td class="p-3 text-center font-semibold text-slate-600">${info.formattedDeadline || '---'}</td>
                        </tr>
                    `;
                }).join('');

                // Gán sự kiện click dòng mở Modal Chi tiết
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

        // 6. Lắng nghe sự kiện Bộ lọc
        ['filter-from-date', 'filter-to-date', 'filter-dept', 'filter-status'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => { this.currentPage = 1; applyFiltersAndRender(); });
                el.addEventListener('input', () => { this.currentPage = 1; applyFiltersAndRender(); });
            }
        });

        // Nút đặt lại xem tất cả
        document.getElementById('btn-reset-filter')?.addEventListener('click', () => {
            document.getElementById('filter-from-date').value = '';
            document.getElementById('filter-to-date').value = '';
            document.getElementById('filter-dept').value = '';
            document.getElementById('filter-status').value = '';
            this.currentPage = 1;
            applyFiltersAndRender();
        });

        // Nút Giao việc mới
        document.getElementById('btn-open-create-task')?.addEventListener('click', () => {
            TaskFormModalComponent.render(currentUser, onTaskCreated);
        });

        // Chạy lọc hiển thị ban đầu
        applyFiltersAndRender();
    }
};