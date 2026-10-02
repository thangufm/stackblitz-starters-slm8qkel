import { TaskDetailModalComponent } from './task-detail-modal.js';
import { TaskFormModalComponent } from './task-form-modal.js';

export const TaskListComponent = {
    currentPage: 1,
    pageSize: 15,

    render(container, tasks = [], currentUser, onTaskClick, onTaskCreated) {
        if (!container) return;

        // 1. Bản đồ tự động gắn Phòng Ban theo Người thực hiện
        const assigneeDeptMap = {
            'Lê Xuân Lâm': 'Ban Giám đốc',
            'Bùi Thị Yến Linh': 'Ban Giám đốc',
            'Tạ Thị Quỳnh Ngọc': 'Phòng Đào tạo - Khoa học và QLSV',
            'Phạm Thị Thu Hảo': 'Phòng Đào tạo - Khoa học và QLSV',
            'Phạm Ngọc Thắng': 'Phòng Hành chính – Tài vụ',
            'Huỳnh Thị Anh Tùng': 'Phòng Hành chính – Tài vụ',
            'Bùi Trần Quyết Thắng': 'Phòng Hành chính – Tài vụ'
        };

        const deptCodeMap = {
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

                        <!-- Lọc Phòng Ban / Công việc của tôi -->
                        <select id="filter-dept" class="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium text-slate-700 outline-none shadow-sm cursor-pointer">
                            <option value="">-- Tất cả phòng ban --</option>
                            <option value="MY_TASKS" class="font-bold text-indigo-600">📌 Công việc của tôi</option>
                            <option value="Ban Giám đốc">Ban Giám đốc</option>
                            <option value="Phòng Hành chính – Tài vụ">Phòng Hành chính – Tài vụ</option>
                            <option value="Phòng Đào tạo - Khoa học và QLSV">Phòng Đào tạo - Khoa học và QLSV</option>
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

                    <!-- Số lượng & Nút thao tác -->
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-slate-500 font-medium mr-1">Tổng số: <b id="task-count-text" class="text-indigo-600 text-sm">0</b> công việc</span>
                        
                        <!-- Nút Đăng ký công việc cho Nhân viên -->
                        <button id="btn-open-register-task" 
                            class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-100">
                            <i class="fa-solid fa-pen-to-square"></i> Đăng ký công việc
                        </button>

                        ${currentUser?.department === 'BGD' ? `
                            <button id="btn-open-create-task" 
                                class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-100">
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
                                <th class="p-3 min-w-[240px]">TÊN CÔNG VIỆC / NỘI DUNG</th>
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

            <!-- MODAL ĐĂNG KÝ CÔNG VIỆC NHIỀU DÒNG (Dành cho Nhân viên) -->
            <div id="register-task-modal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-4xl p-6 space-y-4 animate-in fade-in zoom-in duration-150 max-h-[90vh] flex flex-col">
                    
                    <!-- Header Modal -->
                    <div class="flex items-center justify-between border-b pb-3 border-slate-100 shrink-0">
                        <div>
                            <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                                <i class="fa-solid fa-pen-to-square text-emerald-600"></i> Đăng ký danh sách công việc
                            </h3>
                            <p class="text-[11px] text-slate-500 mt-0.5">Nhập thông tin công việc cần đăng ký (mỗi dòng tương ứng 1 công việc)</p>
                        </div>
                        <button id="btn-close-register-modal" class="text-slate-400 hover:text-slate-600 text-lg p-1">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <!-- Form cuộn nội dung các dòng -->
                    <form id="register-task-form" class="flex-1 overflow-y-auto pr-1 space-y-3">
                        
                        <!-- Tiêu đề cột -->
                        <div class="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-600 uppercase px-1">
                            <div class="col-span-1 text-center">STT</div>
                            <div class="col-span-5">Nội dung công việc <span class="text-rose-500">*</span></div>
                            <div class="col-span-2.5">Từ ngày</div>
                            <div class="col-span-2.5">Hạn chót <span class="text-rose-500">*</span></div>
                            <div class="col-span-1 text-center">Xóa</div>
                        </div>

                        <!-- Danh sách dòng công việc -->
                        <div id="register-task-rows" class="space-y-2">
                        </div>

                        <!-- Nút Thêm dòng mới -->
                        <div class="pt-2">
                            <button type="button" id="btn-add-task-row" 
                                class="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs transition flex items-center gap-1.5 border border-emerald-200/80">
                                <i class="fa-solid fa-plus"></i> Thêm công việc mới
                            </button>
                        </div>

                        <!-- Footer Modal -->
                        <div class="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 shrink-0">
                            <button type="button" id="btn-cancel-register" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition">
                                Hủy bỏ
                            </button>
                            <button type="submit" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-100">
                                Gửi đăng ký
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // 4. Mapper dữ liệu
        const formatTaskData = (t) => {
            const rawAssignee = t.assigneeName || t.assignee || t.executor || 'Chưa phân công';
            const rawDept = t.departmentName || t.department_name || t.deptName || t.department || t.department_id || t.dept_id || '';
            let finalDeptName = deptCodeMap[rawDept] || rawDept;

            if (!finalDeptName || finalDeptName === 'Chưa phân công') {
                finalDeptName = assigneeDeptMap[rawAssignee] || 'Phòng Hành chính – Tài vụ';
            }

            let deptBadge = '';
            let titleColorClass = 'text-indigo-900 border-l-2 border-indigo-500 pl-2';
            let iconClass = 'fa-folder-open text-indigo-500';

            if (finalDeptName.includes('Ban Giám đốc')) {
                deptBadge = `<span class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-100 text-purple-700 border border-purple-200 whitespace-nowrap">Ban Giám đốc</span>`;
                titleColorClass = 'text-purple-900 border-l-2 border-purple-500 pl-2';
                iconClass = 'fa-shield-halved text-purple-600';
            } else if (finalDeptName.includes('Đào tạo') || finalDeptName.includes('ĐT-KH-QLSV')) {
                deptBadge = `<span class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 whitespace-nowrap">Phòng Đào tạo - KH & QLSV</span>`;
                titleColorClass = 'text-emerald-900 border-l-2 border-emerald-500 pl-2';
                iconClass = 'fa-graduation-cap text-emerald-600';
            } else {
                deptBadge = `<span class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-100 text-blue-700 border border-blue-200 whitespace-nowrap">Phòng Hành chính – Tài vụ</span>`;
                titleColorClass = 'text-blue-900 border-l-2 border-blue-500 pl-2';
                iconClass = 'fa-briefcase text-blue-600';
            }

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
                rawAssignee,
                deptBadge,
                finalDeptName,
                titleColorClass,
                iconClass,
                formattedDeadline,
                rawDeadline,
                priorityBadge,
                statusBadge,
                progressBar,
                rawStatus
            };
        };

        // 5. Lọc danh sách & Phân trang
        const applyFiltersAndRender = () => {
            const fromDate = document.getElementById('filter-from-date')?.value;
            const toDate = document.getElementById('filter-to-date')?.value;
            const dept = document.getElementById('filter-dept')?.value;
            const status = document.getElementById('filter-status')?.value;

            const myName = currentUser?.fullName || currentUser?.name || currentUser?.displayName || '';

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

                // Xử lý Lọc "Công việc của tôi" vs Phòng ban
                if (dept === 'MY_TASKS') {
                    if (!info.rawAssignee.toLowerCase().includes(myName.toLowerCase()) && 
                        !task.assignee?.toLowerCase().includes(myName.toLowerCase())) {
                        return false;
                    }
                } else if (dept && !info.finalDeptName.includes(dept)) {
                    return false;
                }

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
                            Không tìm thấy công việc nào phù hợp.
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = paginatedTasks.map((t, idx) => {
                    const info = formatTaskData(t);
                    return `
                        <tr data-task-id="${t.id}" class="hover:bg-slate-50 cursor-pointer transition duration-150 border-b border-slate-100">
                            <td class="p-3.5 text-center font-bold text-slate-400">${startIndex + idx + 1}</td>
                            <td class="p-3.5">
                                <div class="${info.titleColorClass} py-0.5">
                                    <div class="font-bold text-[13px] leading-snug line-clamp-1 flex items-center gap-1.5">
                                        <i class="fa-solid ${info.iconClass} text-[11px]"></i>
                                        <span>${t.title || t.name || ''}</span>
                                    </div>
                                    <div class="text-[11px] text-slate-400 line-clamp-1 mt-0.5 pl-4">${t.description || t.content || ''}</div>
                                </div>
                            </td>
                            <td class="p-3.5">${info.deptBadge}</td>
                            <td class="p-3.5 text-slate-700 font-semibold">${info.rawAssignee}</td>
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

            // Thanh phân trang
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

        // 6. Gán sự kiện Bộ Lọc
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

        // ----------------------------------------------------
        // 7. XỬ LÝ MODAL ĐĂNG KÝ CÔNG VIỆC DẠNG NHIỀU DÒNG
        // ----------------------------------------------------
        const regModal = document.getElementById('register-task-modal');
        const btnOpenReg = document.getElementById('btn-open-register-task');
        const btnCloseReg = document.getElementById('btn-close-register-modal');
        const btnCancelReg = document.getElementById('btn-cancel-register');
        const regForm = document.getElementById('register-task-form');
        const rowsContainer = document.getElementById('register-task-rows');
        const btnAddRow = document.getElementById('btn-add-task-row');

        const toggleRegModal = (show) => {
            if (regModal) {
                if (show) regModal.classList.remove('hidden');
                else regModal.classList.add('hidden');
            }
        };

        // Hàm tạo HTML cho 1 dòng
        const createRowHTML = (index, todayStr = '') => {
            return `
                <div class="task-row grid grid-cols-12 gap-2 items-center bg-slate-50/70 p-2 rounded-xl border border-slate-200/80">
                    <div class="col-span-1 text-center font-bold text-slate-500 row-stt">${index}</div>
                    
                    <div class="col-span-5">
                        <input type="text" class="reg-row-title w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                            placeholder="Nhập nội dung công việc..." required>
                    </div>

                    <div class="col-span-2.5">
                        <input type="date" class="reg-row-start-date w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                            value="${todayStr}">
                    </div>

                    <div class="col-span-2.5">
                        <input type="date" class="reg-row-deadline w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                            value="${todayStr}" required>
                    </div>

                    <div class="col-span-1 text-center">
                        <button type="button" class="btn-remove-row text-rose-400 hover:text-rose-600 p-1 transition" title="Xóa dòng này">
                            <i class="fa-solid fa-trash-can text-sm"></i>
                        </button>
                    </div>
                </div>
            `;
        };

        // Đánh lại STT các dòng
        const reindexRows = () => {
            if (!rowsContainer) return;
            const rows = rowsContainer.querySelectorAll('.task-row');
            rows.forEach((row, idx) => {
                const sttEl = row.querySelector('.row-stt');
                if (sttEl) sttEl.textContent = idx + 1;

                // Ẩn/Hiện nút xóa nếu chỉ còn 1 dòng
                const btnRemove = row.querySelector('.btn-remove-row');
                if (btnRemove) {
                    if (rows.length === 1) btnRemove.classList.add('hidden');
                    else btnRemove.classList.remove('hidden');
                }
            });
        };

        // Khởi tạo ban đầu với 3 dòng
        const initRegisterRows = () => {
            if (!rowsContainer) return;
            const todayStr = new Date().toISOString().split('T')[0];
            rowsContainer.innerHTML = '';
            for (let i = 1; i <= 3; i++) {
                rowsContainer.insertAdjacentHTML('beforeend', createRowHTML(i, todayStr));
            }
            reindexRows();
        };

        // Nút bấm Mở Modal
        btnOpenReg?.addEventListener('click', () => {
            initRegisterRows();
            toggleRegModal(true);
        });

        // Thêm dòng mới khi bấm nút "+"
        btnAddRow?.addEventListener('click', () => {
            if (!rowsContainer) return;
            const todayStr = new Date().toISOString().split('T')[0];
            const currentCount = rowsContainer.querySelectorAll('.task-row').length;
            rowsContainer.insertAdjacentHTML('beforeend', createRowHTML(currentCount + 1, todayStr));
            reindexRows();
        });

        // Bắt sự kiện xóa dòng (Ủy quyền sự kiện)
        rowsContainer?.addEventListener('click', (e) => {
            const btnRemove = e.target.closest('.btn-remove-row');
            if (btnRemove) {
                const row = btnRemove.closest('.task-row');
                if (row && rowsContainer.querySelectorAll('.task-row').length > 1) {
                    row.remove();
                    reindexRows();
                }
            }
        });

        btnCloseReg?.addEventListener('click', () => toggleRegModal(false));
        btnCancelReg?.addEventListener('click', () => toggleRegModal(false));

        // Submit form đăng ký nhiều công việc
        regForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const rows = rowsContainer.querySelectorAll('.task-row');
            const createdTasks = [];

            rows.forEach(row => {
                const title = row.querySelector('.reg-row-title')?.value?.trim();
                const startDate = row.querySelector('.reg-row-start-date')?.value;
                const deadline = row.querySelector('.reg-row-deadline')?.value;

                if (title && deadline) {
                    createdTasks.push({
                        title: title,
                        description: `Đăng ký công việc từ ${startDate || '---'} đến ${deadline}`,
                        start_date: startDate,
                        deadline: deadline,
                        assigneeName: currentUser?.fullName || currentUser?.name || 'Nhân viên đăng ký',
                        departmentName: currentUser?.departmentName || 'Phòng Hành chính – Tài vụ',
                        status: 'CHO_DUYET',
                        priority: 'TRUNGBINH',
                        progress: 0,
                        created_at: new Date().toISOString()
                    });
                }
            });

            if (createdTasks.length > 0 && typeof onTaskCreated === 'function') {
                createdTasks.forEach(task => onTaskCreated(task));
            }

            toggleRegModal(false);
        });

        applyFiltersAndRender();
    }
};