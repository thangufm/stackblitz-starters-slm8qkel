export class AdminDashboardView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(tasks = []) {
        if (!this.container) return;

        const rowsHtml = tasks.map(task => `
            <tr>
                <td>${task.id}</td>
                <td><strong>${task.title}</strong></td>
                <td>${task.deptName || task.dept}</td>
                <td>${task.assignee || '<em>Chưa phân công</em>'}</td>
                <td>${task.deadline}</td>
                <td><span class="badge ${this.getStatusBadgeClass(task.status)}">${task.status}</span></td>
            </tr>
        `).join('');

        this.container.innerHTML = `
            <div class="admin-dashboard">
                <h2>Bảng Điều Khiển Quản Trị</h2>
                <table class="table table-striped mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên công việc</th>
                            <th>Đơn vị</th>
                            <th>Người thực hiện</th>
                            <th>Hạn chót</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml.length > 0 ? rowsHtml : '<tr><td colspan="6" class="text-center">Chưa có công việc nào</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    }

    getStatusBadgeClass(status) {
        switch (status) {
            case 'DOING': return 'bg-primary';
            case 'DONE': return 'bg-success';
            case 'LATE': return 'bg-danger';
            default: return 'bg-warning text-dark';
        }
    }
}