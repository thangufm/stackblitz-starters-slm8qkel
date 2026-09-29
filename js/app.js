// ==========================================
// 1. CLASS TASK (ĐỐI TƯỢNG CÔNG VIỆC)
// ==========================================
class Task {
    constructor(id, title, dept, deptName, assignee, deadline, status, directive = '') {
        this.id = id;
        this.title = title;
        this.dept = dept;           // 'HC-TV' hoặc 'DT-QLSV'
        this.deptName = deptName;
        this.assignee = assignee;   // Người phụ trách
        this.deadline = deadline;
        this.status = status;       // 'DOING', 'DONE', 'LATE'
        this.directive = directive; // Ý kiến chỉ đạo của BGĐ
    }

    setDirective(text) {
        this.directive = text;
    }
}

// ==========================================
// 2. CLASS TASK SERVICE (QUẢN LÝ DỮ LIỆU)
// ==========================================
class TaskService {
    constructor() {
        this.tasks = [
            // --- PHÒNG HÀNH CHÍNH - TÀI VỤ ---
            new Task(
                1, 
                'Báo cáo kiểm kê tài sản & hạ tầng CNTT Quý 3/2026', 
                'HC-TV', 
                'Hành chính - Tài vụ', 
                'Trần Thị Bích Liên (Trưởng phòng)', 
                '30/09/2026', 
                'LATE'
            ),
            new Task(
                2, 
                'Triển khai bảo trì hệ thống mạng máy tính phòng họp', 
                'HC-TV', 
                'Hành chính - Tài vụ', 
                'Trần Thị Bích Liên (Trưởng phòng)', 
                '02/10/2026', 
                'DOING'
            ),
            new Task(
                3, 
                'Thanh toán chi phí điện nước và dịch vụ vệ sinh tháng 9', 
                'HC-TV', 
                'Hành chính - Tài vụ', 
                'Huỳnh Thị Anh Tùng (Kế toán viên)', 
                '29/09/2026', 
                'DONE'
            ),

            // --- PHÒNG ĐÀO TẠO - KHOA HỌC & QLSV ---
            new Task(
                4, 
                'Lập danh sách sinh viên xét học bổng học kỳ 1', 
                'DT-QLSV', 
                'Đào tạo - KH & QLSV', 
                'Phạm Hoài Nam (Trưởng phòng)', 
                '03/10/2026', 
                'DOING'
            ),
            new Task(
                5, 
                'Cập nhật thời khóa biểu bổ sung cho các lớp buổi tối', 
                'DT-QLSV', 
                'Đào tạo - KH & QLSV', 
                'Phạm Hoài Nam (Trưởng phòng)', 
                '01/10/2026', 
                'DONE'
            ),
            new Task(
                6, 
                'Tổng hợp đề xuất đề tài nghiên cứu khoa học cấp cơ sở', 
                'DT-QLSV', 
                'Đào tạo - KH & QLSV', 
                'Huỳnh Ngọc Nghiêm (Phó Trưởng phòng)', 
                '28/09/2026', 
                'LATE'
            )
        ];
    }

    getTasksByDepartment(deptCode) {
        if (deptCode === 'ALL') return this.tasks;
        return this.tasks.filter(task => task.dept === deptCode);
    }

    addDirective(taskId, directiveText) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.setDirective(directiveText);
            return true;
        }
        return false;
    }
}

// ==========================================
// 3. CLASS ADMIN DASHBOARD VIEW (GIAO DIỆN)
// ==========================================
class AdminDashboardView {
    constructor() {
        this.tbody = document.getElementById('task-table-body');
        this.statTotal = document.getElementById('stat-total');
        this.statDoing = document.getElementById('stat-doing');
        this.statDone = document.getElementById('stat-done');
        this.statLate = document.getElementById('stat-late');
        this.taskCountLabel = document.getElementById('task-count-label');
    }

    render(tasks, onDirectiveClick) {
        if (!this.tbody) return;
        this.tbody.innerHTML = '';

        // Cập nhật thẻ thống kê
        this.statTotal.innerText = tasks.length;
        this.statDoing.innerText = tasks.filter(t => t.status === 'DOING').length;
        this.statDone.innerText = tasks.filter(t => t.status === 'DONE').length;
        this.statLate.innerText = tasks.filter(t => t.status === 'LATE').length;
        this.taskCountLabel.innerText = `Hiển thị ${tasks.length} công việc`;

        if (tasks.length === 0) {
            this.tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-400">Không có công việc nào.</td></tr>`;
            return;
        }

        tasks.forEach(task => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-slate-50/80 transition";

            let statusBadge = '';
            if (task.status === 'LATE') {
                statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700"><i class="fa-solid fa-circle text-[8px]"></i> Trễ Hạn</span>`;
            } else if (task.status === 'DOING') {
                statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><i class="fa-solid fa-circle text-[8px]"></i> Đang Làm</span>`;
            } else {
                statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700"><i class="fa-solid fa-circle text-[8px]"></i> Hoàn Thành</span>`;
            }

            const deptBadgeClass = task.dept === 'HC-TV' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200';

            tr.innerHTML = `
                <td class="py-3.5 px-4 font-medium text-slate-900">
                    ${task.title}
                    ${task.directive ? `<div class="text-xs text-indigo-700 font-normal mt-1 bg-indigo-50 p-1.5 rounded border border-indigo-100"><i class="fa-solid fa-bullhorn mr-1"></i> <b>BGĐ Chỉ đạo:</b> ${task.directive}</div>` : ''}
                </td>
                <td class="py-3.5 px-4"><span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${deptBadgeClass} border">${task.deptName}</span></td>
                <td class="py-3.5 px-4 font-medium text-slate-800">${task.assignee}</td>
                <td class="py-3.5 px-4 ${task.status === 'LATE' ? 'text-rose-600 font-medium' : ''}">${task.deadline}</td>
                <td class="py-3.5 px-4">${statusBadge}</td>
                <td class="py-3.5 px-4 text-center">
                    <button class="btn-directive text-indigo-600 hover:text-indigo-900 font-medium text-xs bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition">
                        <i class="fa-solid fa-comment-dots mr-1"></i> Cho chỉ đạo
                    </button>
                </td>
            `;

            tr.querySelector('.btn-directive').addEventListener('click', () => onDirectiveClick(task));
            this.tbody.appendChild(tr);
        });
    }
}

// ==========================================
// 4. CLASS MAIN APP (BỘ ĐIỀU KHUYỂN)
// ==========================================
class App {
    constructor() {
        this.taskService = new TaskService();
        this.view = new AdminDashboardView();
        this.currentDept = 'ALL';

        this.initEvents();
        this.updateView();
    }

    initEvents() {
        document.querySelectorAll('.dept-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.dept-btn').forEach(b => {
                    b.className = "dept-btn px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition";
                });
                
                const targetBtn = e.currentTarget;
                targetBtn.className = "dept-btn px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-sm transition";
                
                this.currentDept = targetBtn.getAttribute('data-dept');
                this.updateView();
            });
        });
    }

    updateView() {
        const tasks = this.taskService.getTasksByDepartment(this.currentDept);
        this.view.render(tasks, (task) => this.handleDirective(task));
    }

    handleDirective(task) {
        const directive = prompt(`Nhập ý kiến chỉ đạo của Ban Giám đốc cho:\n"${task.title}"`);
        if (directive) {
            this.taskService.addDirective(task.id, directive);
            this.updateView();
        }
    }
}

// Khởi chạy ứng dụng khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});