import { TaskDetailModalComponent } from './task-detail-modal.js';
import { TaskFormModalComponent } from './task-form-modal.js';

export const TaskListComponent = {
    currentPage: 1,
    pageSize: 15,

    render(container, tasks = [], currentUser, onTaskClick, onTaskCreated) {
        if (!container) return;

        // 1. Ánh xạ Mã phòng ban sang Tên hiển thị đầy đủ
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
                        <!-- Chọn khoảng ngày -->
                        <div class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
                            <i class="fa-regular fa-calendar-days text-indigo-600 font-bold"></i>
                            <span class="font-bold text-slate-600">Từ:</span>
                            <input type="date" id="filter-from-date" class="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer">
                            <span class="font-bold text-slate-600 ml-1">Đến:</span>
                            <input type="date" id="filter-to-date" class="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer">
                        </div>

                        <!-- Lọc Phòng Ban -->
                        <select id="filter-dept" class="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium text-slate-700 outline-none shadow-sm cursor-pointer">
                            <option value="">-- Tất cả phòng ban --</option>
                            <option value="BGD">Ban Giám đốc</option>
                            <option value="HCTV">Phòng Hành chính – Tài vụ</option>
                            <option value="ĐT-KH-QLSV">Phòng Đào tạo - Khoa học và QLSV</option>
                        </select>

                        <!-- Lọc Trạng Thái -->
                        <select id="filter-status" class="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium text-slate-700 outline-none shadow-sm cursor-pointer">
                            <option value="">-- Tất cả trạng thái --</option>
                            <option value="CHO_XU_LY">Chờ xử lý</option>
                            <option value="DANG_THUC_HIEN">Đang thực hiện</option>
                            <option value="CHO_DUYET">Chờ duyệt</option>
                            <option value="HOAN_THANH">Hoàn thành</option>
                        </select>

                        <!-- Nút Xóa Lọc -->
                        <button id="btn-reset-filter" title="Xem tất cả công việc mới nhất" 
                            class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition flex items-center gap-1 shadow-sm">
                            <i class="fa-solid fa-arrows-rotate text-[10px]"></i> Tất cả
                        </button>
                    </div>

                    <!-- Số lượng & Nút Giao việc mới -->
                    <div class="flex items-center gap-3">
                        <span class="text-xs text-slate-500 font-medium">Tổng số: <b id="task-count-text" class="text-indigo-600 text-sm">0</b> công việc</span>
                        ${currentUser?.department === 'BGD' ? `
                            <button id="btn-open-create-task" 
                                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-100">
                                <i class="fa-solid fa-plus"></i> Giao việc mới
                            </button>
                        ` : ''}
                    </div>

                </div>

                <!-- BẢNG CÔNG VIỆC -->
                <div class="overflow-x-auto rounded-xl border border-slate-200/80 shadow-sm">
                    <table class="w-full text-xs text-left border-collapse">
                        <thead class="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <th class="p-3 text-center w-12">STT</th>
                                <th class="p-3 min-w-[220px]">TÊN CÔNG VIỆC / NỘI DUNG</th>
                                <th class="p-3 min-w-[170px]">ĐƠN VỊ CHỦ TRÌ</th>
                                <th class="p-3 min-w-[150px]">NGƯỜI THỰC HIỆN</th>
                                <th class="p-3 text-center min-w-[100px]">ƯU TIÊN</th>
                                <th class="p-3 text-center min-w-[120px]">TRẠNG THÁI</th>
                                <th class="p-3 text-center min-w-[110px]">TIẾN ĐỘ</th>
                                <th class="p-3 text-center min-w-[100px]">HẠN CHÓT</th>
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

        // 4. Mapper dữ liệu & Render Badges sắc nét
        // Mapper dữ liệu Đơn vị chủ trì chuẩn xác 100%
const formatTaskData = (t) => {
    // 1. Danh sách ánh xạ các mã viết tắt (nếu CSDL dùng mã)
    const deptMap = {
        'BGD': 'Ban Giám đốc',
        'HCTV': 'Phòng Hành chính – Tài vụ',
        'ĐT-KH-QLSV': 'Phòng Đào tạo - Khoa học và QLSV',
        'DAO_TAO': 'Phòng Đào tạo - Khoa học và QLSV',
        'HANH_CHINH': 'Phòng Hành chính – Tài vụ'
    };

    // 2. Quét tất cả các tên trường có thể chứa thông tin Phòng Ban trên Firebase
    const rawDept = t.departmentName || t.department_name || t.deptName || t.department || t.department_id || t.dept_id || t.DEPARTMENT || '';
    
    // 3. Nếu giá trị trả về đã là Tên tiếng Việt chuẩn thì giữ nguyên, nếu là Mã viết tắt thì tra cứu qua deptMap
    let finalDeptName = '';
    if (deptMap[rawDept]) {
        finalDeptName = deptMap[rawDept];
    } else if (rawDept && rawDept !== 'Chưa phân công') {
        finalDeptName = rawDept;
    }

    // 4. Render Badge màu sắc cho Đơn vị chủ trì
    let deptBadge = '';
    if (finalDeptName.includes('Ban Giám đốc')) {
        deptBadge = `<span class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-100 text-purple-700 border border-purple-200 whitespace-nowrap">${finalDeptName}</span>`;
    } else if (finalDeptName.includes('Đào tạo') || finalDeptName.includes('ĐT-KH-QLSV')) {
        deptBadge = `<span class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 whitespace-nowrap">${finalDeptName}</span>`;
    } else if (finalDeptName.includes('Hành chính') || finalDeptName.includes('HCTV')) {
        deptBadge = `<span class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-100 text-blue-700 border border-blue-200 whitespace-nowrap">${finalDeptName}</span>`;
    } else if (finalDeptName) {
        deptBadge = `<span class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 whitespace-nowrap">${finalDeptName}</span>`;
    } else {
        deptBadge = `<span class="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-500 whitespace-nowrap">Chưa phân công</span>`;
    }

    // --- Giữ nguyên các phần Hạn chót, Ưu tiên, Trạng thái, Tiến độ ---
    let rawDeadline = t.deadline || t.DEADLINE || t.due_date || t.dueDate || t.deadline_date || t.finish_date || '';
    let formattedDeadline = '---';
    if (rawDeadline) {
        if (rawDeadline.includes('-')) {
            const p = rawDeadline.split('T')[0].split('-');
            if (p.length === 3) formattedDeadline = `${p[2]}/${p[1]}/${p[0]}`;
        } else if (rawDeadline.includes('/')) {
            formattedDeadline = rawDeadline;
        }
    }

    const rawPriority = String(t.priority || t.PRIORITY || '').toUpperCase();
    let priorityBadge = '<span class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-slate-100 text-slate-600 border border-slate-200 inline-block whitespace-nowrap">Thường</span>';
    if (rawPriority === 'KHAN' || rawPriority === 'KHẨN') {
        priorityBadge = '<span class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-rose-50 text-rose-600 border border-rose-200/80 inline-block whitespace-nowrap shadow-sm">Khẩn</span>';
    } else if (rawPriority === 'CAO') {
        priorityBadge = '<span class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-amber-50 text-amber-600 border border-amber-200/80 inline-block whitespace-nowrap shadow-sm">Cao</span>';
    } else if (rawPriority === 'TRUNGBINH' || rawPriority === 'TRUNG BÌNH') {
        priorityBadge = '<span class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-blue-50 text-blue-600 border border-blue-200/80 inline-block whitespace-nowrap shadow-sm">Trung bình</span>';
    }

    const rawStatus = String(t.status || t.STATUS || '').toUpperCase();
    let statusBadge = '<span class="px-2.5 py-1 rounded-lg font-semibold text-[10px] bg-slate-100 text-slate-600 border border-slate-200 inline-block whitespace-nowrap">Chờ xử lý</span>';
    if (rawStatus === 'CHO_XU_LY' || rawStatus === 'CHỜ XỬ LÝ') {
        statusBadge = '<span class="px-2.5 py-1 rounded-lg font-semibold text-[10px] bg-slate-100 text-slate-700 border border-slate-200 inline-block whitespace-nowrap">Chờ xử lý</span>';
    } else if (rawStatus === 'DANG_THUC_HIEN' || rawStatus === 'ĐANG THỰC HIỆN') {
        statusBadge = '<span class="px-2.5 py-1 rounded-lg font-semibold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200/80 inline-block whitespace-nowrap">Đang thực hiện</span>';
    } else if (rawStatus === 'CHO_DUYET' || rawStatus === 'CHỜ DUYỆT') {
        statusBadge = '<span class="px-2.5 py-1 rounded-lg font-semibold text-[10px] bg-purple-50 text-purple-700 border border-purple-200/80 inline-block whitespace-nowrap">Chờ duyệt</span>';
    } else if (rawStatus === 'HOAN_THANH' || rawStatus === 'HOÀN THÀNH') {
        statusBadge = '<span class="px-2.5 py-1 rounded-lg font-semibold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 inline-block whitespace-nowrap">Hoàn thành</span>';
    }

    const progressVal = Number(t.progress || 0);
    const progressBar = `
        <div class="flex items-center gap-2 justify-center">
            <div class="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                <div class="bg-indigo-600 h-full rounded-full transition-all duration-300" style="width: ${progressVal}%"></div>
            </div>
            <span class="font-bold text-indigo-600 text-[11px] min-w-[28px] text-right">${progressVal}%</span>
        </div>
    `;

    return {
        deptBadge,
        formattedDeadline,
        rawDeadline,
        priorityBadge,
        statusBadge,
        progressBar,
        deptKey: rawDept,
        rawStatus
    };
};
        // 5. Hàm lọc & Render
        const applyFiltersAndRender = () => {
            const fromDate = document.getElementById('filter-from-date')?.value;
            const toDate = document.getElementById('filter-to-date')?.value;
            const dept = document.getElementById('filter-dept')?.value;
            const status = document.getElementById('filter-status')?.value;

            const normalizeDate = (dStr) => {
                if (!dStr) return '';
                if (dStr.includes('/')) {
                    const p = dStr.split('/');
                    if (p.length === 3) return `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
                }
                return dStr;
            };

            let filtered = sortedTasks.filter(task => {
                const info = formatTaskData(task);
                const taskDate = normalizeDate(info.rawDeadline || task.created_at?.split('T')[0]);

                if (fromDate && taskDate && taskDate < fromDate) return false;
                if (toDate && taskDate && taskDate > toDate) return false;
                if (dept && info.deptKey !== dept) return false;
                if (status && info.rawStatus !== status && task.status !== status) return false;

                return true;
            });

            const countText = document.getElementById('task-count-text');
            if (countText) countText.textContent = filtered.length;

            const totalPages = Math.ceil(filtered.length / this.pageSize) || 1;
            if (this.currentPage > totalPages) this.currentPage = totalPages;

            const startIndex = (this.currentPage - 1) * this.pageSize;
            const paginatedTasks = filtered.slice(startIndex, startIndex + this.pageSize);

            const tbody = document.getElementById('task-table-body');
            if (!tbody) return;

            if (paginatedTasks.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" class="p-8 text-center text-slate-400 font-medium">
                            Không tìm thấy công việc nào phù hợp với bộ lọc.
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = paginatedTasks.map((t, idx) => {
                    const info = formatTaskData(t);
                    return `
                        <tr data-task-id="${t.id}" class="hover:bg-indigo-50/50 cursor-pointer transition duration-150 border-b border-slate-100">
                            <td class="p-3.5 text-center font-bold text-slate-400">${startIndex + idx + 1}</td>
                            <td class="p-3.5">
                                <div class="font-bold text-slate-800 text-[13px] leading-snug line-clamp-1">${t.title || t.name || ''}</div>
                                <div class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">${t.description || t.content || ''}</div>
                            </td>
                            <td class="p-3.5">${info.deptBadge}</td>
                            <td class="p-3.5 text-slate-700 font-semibold">${t.assigneeName || t.assignee || 'Phạm Ngọc Thắng'}</td>
                            <td class="p-3.5 text-center">${info.priorityBadge}</td>
                            <td class="p-3.5 text-center">${info.statusBadge}</td>
                            <td class="p-3.5 text-center">${info.progressBar}</td>
                            <td class="p-3.5 text-center font-semibold text-slate-600">${info.formattedDeadline}</td>
                        </tr>
                    `;
                }).join('');

                tbody.querySelectorAll('tr[data-task-id]').forEach(row => {
                    row.onclick = () => {
                        const taskId = row.getAttribute('data-task-id');
                        const selectedTask = tasks.find(item => String(item.id) === String(taskId));
                        if (selectedTask) TaskDetailModalComponent.render(selectedTask, currentUser);
                    };
                });
            }

            // Render Phân trang
            const pagContainer = document.getElementById('pagination-container');
            if (pagContainer) {
                if (filtered.length <= this.pageSize) {
                    pagContainer.innerHTML = `<span class="text-slate-400">Hiển thị toàn bộ ${filtered.length} công việc</span>`;
                } else {
                    pagContainer.innerHTML = `
                        <div>Trang <b>${this.currentPage}</b> / <b>${totalPages}</b> (Tổng ${filtered.length} công việc)</div>
                        <div class="flex items-center gap-1.5">
                            <button id="btn-prev-page" ${this.currentPage === 1 ? 'disabled' : ''} 
                                class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 rounded-xl font-bold transition">
                                <i class="fa-solid fa-chevron-left"></i> Trước
                            </button>
                            <button id="btn-next-page" ${this.currentPage === totalPages ? 'disabled' : ''} 
                                class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 rounded-xl font-bold transition">
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

        // 6. Gán sự kiện Bộ lọc
        ['filter-from-date', 'filter-to-date', 'filter-dept', 'filter-status'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => { this.currentPage = 1; applyFiltersAndRender(); });
                el.addEventListener('input', () => { this.currentPage = 1; applyFiltersAndRender(); });
            }
        });

        document.getElementById('btn-reset-filter')?.addEventListener('click', () => {
            document.getElementById('filter-from-date').value = '';
            document.getElementById('filter-to-date').value = '';
            document.getElementById('filter-dept').value = '';
            document.getElementById('filter-status').value = '';
            this.currentPage = 1;
            applyFiltersAndRender();
        });

        document.getElementById('btn-open-create-task')?.addEventListener('click', () => {
            TaskFormModalComponent.render(currentUser, onTaskCreated);
        });

        applyFiltersAndRender();
    }
};