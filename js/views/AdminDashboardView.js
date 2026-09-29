export class AdminDashboardView {
    constructor() {
        this.tbody = document.getElementById('task-table-body');
        this.statTotal = document.getElementById('stat-total');
        this.statDoing = document.getElementById('stat-doing');
        this.statDone = document.getElementById('stat-done');
        this.statLate = document.getElementById('stat-late');
        this.taskCountLabel = document.getElementById('task-count-label');
    }

    render(tasks, onDirectiveClick) {
        this.tbody.innerHTML = '';

        // Cập nhật các thẻ KPI
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
                <td class="py-3.5 px-4">${task.assignee}</td>
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