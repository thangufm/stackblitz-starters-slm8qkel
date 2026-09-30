import { Task } from './models/Task.js';
import { User } from './models/User.js';
import { TaskService } from './services/TaskService.js';
import { UserService } from './services/UserService.js';
import { AdminDashboardView } from './views/AdminDashboardView.js';

class App {
  constructor() {
    this.userService = new UserService();
    this.taskService = new TaskService();
    this.dashboardView = new AdminDashboardView();
  }

  init() {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      this.renderLoginView();
    } else {
      this.renderDashboardView(currentUser);
    }
    this.bindGlobalEvents();
  }

  renderLoginView() {
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    if (loginContainer) loginContainer.classList.remove('d-none');
    if (dashboardContainer) dashboardContainer.classList.add('d-none');
  }

  renderDashboardView(currentUser) {
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    if (loginContainer) loginContainer.classList.add('d-none');
    if (dashboardContainer) dashboardContainer.classList.remove('d-none');

    // Hiển thị thông tin người dùng
    const userNameEl = document.getElementById('user-name-display');
    const userRoleEl = document.getElementById('user-role-display');
    if (userNameEl) userNameEl.textContent = currentUser.name || currentUser.email;
    if (userRoleEl) userRoleEl.textContent = currentUser.roleTitle || currentUser.role;

    // Load dữ liệu và render view
    this.refreshDashboard();
  }

  refreshDashboard() {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) return;

    // Lấy bộ lọc hiện tại
    const startDate = document.getElementById('filter-start-date')?.value || '';
    const endDate = document.getElementById('filter-end-date')?.value || '';
    const department = document.getElementById('filter-department')?.value || 'ALL';
    const staffId = document.getElementById('filter-staff')?.value || 'ALL';

    // Lấy danh sách công việc đã lọc từ TaskService
    const tasks = this.taskService.getFilteredTasks({
      user: currentUser,
      startDate,
      endDate,
      department,
      staffId
    });

    // Gọi View render bảng và thống kê
    if (typeof this.dashboardView.render === 'function') {
      this.dashboardView.render(currentUser, tasks);
    } else {
      this.renderTaskTable(tasks, currentUser);
      this.renderStatCards(tasks);
    }

    this.updateBadges();
  }

  updateBadges() {
    const unassignedCount = this.taskService.getUnassignedTasksCount
      ? this.taskService.getUnassignedTasksCount()
      : 0;
    
    const badgeEls = document.querySelectorAll('.unassigned-badge');
    badgeEls.forEach(badge => {
      badge.textContent = unassignedCount;
      if (unassignedCount > 0) {
        badge.classList.remove('d-none');
      } else {
        badge.classList.add('d-none');
      }
    });
  }

  bindGlobalEvents() {
    // 1. Đăng nhập
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;
        const user = this.userService.login(email, password);
        if (user) {
          this.renderDashboardView(user);
        } else {
          alert('Email UFM hoặc mật khẩu không đúng!');
        }
      });
    }

    // 2. Đăng xuất
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        this.userService.logout();
        this.renderLoginView();
      });
    }

    // 3. Đổi mật khẩu
    const btnSavePassword = document.getElementById('btn-save-password');
    if (btnSavePassword) {
      btnSavePassword.addEventListener('click', () => {
        const currentPass = document.getElementById('current-pass')?.value;
        const newPass = document.getElementById('new-pass')?.value;
        const confirmPass = document.getElementById('confirm-pass')?.value;

        if (newPass !== confirmPass) {
          alert('Mật khẩu mới không trùng khớp!');
          return;
        }

        const res = this.userService.changePassword(currentPass, newPass);
        if (res && res.success) {
          alert('Đổi mật khẩu thành công!');
          const modal = bootstrap.Modal.getInstance(document.getElementById('modal-change-pass'));
          if (modal) modal.hide();
        } else {
          alert(res?.message || 'Đổi mật khẩu thất bại!');
        }
      });
    }

    // 4. Lọc ngày, phòng ban, nhân viên
    const filterDept = document.getElementById('filter-department');
    if (filterDept) {
      filterDept.addEventListener('change', (e) => {
        this.populateStaffDropdown(e.target.value);
        this.refreshDashboard();
      });
    }

    ['filter-start-date', 'filter-end-date', 'filter-staff'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', () => this.refreshDashboard());
    });

    // 5. Thêm công việc nhiều dòng (Batch Task Register)
    const btnSaveBatchTask = document.getElementById('btn-save-batch-task');
    if (btnSaveBatchTask) {
      btnSaveBatchTask.addEventListener('click', () => {
        const rows = document.querySelectorAll('.batch-task-row');
        const tasksToCreate = [];

        rows.forEach(row => {
          const title = row.querySelector('.task-title')?.value?.trim();
          const expectedOutput = row.querySelector('.task-output')?.value?.trim();
          const deadline = row.querySelector('.task-deadline')?.value;

          if (title) {
            tasksToCreate.push({ title, expectedOutput, deadline });
          }
        });

        if (tasksToCreate.length === 0) {
          alert('Vui lòng nhập ít nhất một tên công việc!');
          return;
        }

        const currentUser = this.userService.getCurrentUser();
        this.taskService.addBatchTasks(tasksToCreate, currentUser);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('modal-add-task'));
        if (modal) modal.hide();

        this.refreshDashboard();
      });
    }

    // 6. Phân công công việc (Assign Task)
    const btnSaveAssign = document.getElementById('btn-save-assign');
    if (btnSaveAssign) {
      btnSaveAssign.addEventListener('click', () => {
        const taskId = document.getElementById('assign-task-id')?.value;
        const mainAssignee = document.getElementById('assignee-main')?.value;
        const coAssigneeSelect = document.getElementById('assignee-co');
        const coAssignees = coAssigneeSelect 
          ? Array.from(coAssigneeSelect.selectedOptions).map(opt => opt.value)
          : [];

        if (!mainAssignee) {
          alert('Vui lòng chọn người phụ trách chính!');
          return;
        }

        this.taskService.assignTask(taskId, mainAssignee, coAssignees);

        const modal = bootstrap.Modal.getInstance(document.getElementById('modal-assign-task'));
        if (modal) modal.hide();

        this.refreshDashboard();
      });
    }

    // 7. Cập nhật tiến độ & Minh chứng
    const btnSaveProgress = document.getElementById('btn-save-progress');
    if (btnSaveProgress) {
      btnSaveProgress.addEventListener('click', () => {
        const taskId = document.getElementById('update-task-id')?.value;
        const status = document.getElementById('update-status')?.value;
        const proofLink = document.getElementById('update-proof-link')?.value;
        const note = document.getElementById('update-note')?.value;

        this.taskService.updateTaskProgress(taskId, { status, proofLink, note });

        const modal = bootstrap.Modal.getInstance(document.getElementById('modal-update-task'));
        if (modal) modal.hide();

        this.refreshDashboard();
      });
    }

    // 8. Ý kiến chỉ đạo của Ban Giám đốc
    const btnSaveDirective = document.getElementById('btn-save-directive');
    if (btnSaveDirective) {
      btnSaveDirective.addEventListener('click', () => {
        const taskId = document.getElementById('directive-task-id')?.value;
        const directiveText = document.getElementById('bgd-directive-input')?.value?.trim();

        if (!directiveText) {
          alert('Vui lòng nhập nội dung chỉ đạo!');
          return;
        }

        const currentUser = this.userService.getCurrentUser();
        this.taskService.addDirective(taskId, directiveText, currentUser);

        const modal = bootstrap.Modal.getInstance(document.getElementById('modal-directive-task'));
        if (modal) modal.hide();

        this.refreshDashboard();
      });
    }

    // 9. Xuất Excel 3 Cột (Thời gian | Họ và Tên | Công việc)
    const btnExportExcel = document.getElementById('btn-export-excel');
    if (btnExportExcel) {
      btnExportExcel.addEventListener('click', () => {
        const startDate = document.getElementById('filter-start-date')?.value || '';
        const endDate = document.getElementById('filter-end-date')?.value || '';
        const currentUser = this.userService.getCurrentUser();
        const department = document.getElementById('filter-department')?.value || 'ALL';
        const staffId = document.getElementById('filter-staff')?.value || 'ALL';

        const filteredTasks = this.taskService.getFilteredTasks({
          user: currentUser,
          startDate,
          endDate,
          department,
          staffId
        });

        if (typeof this.taskService.exportToExcel3Columns === 'function') {
          this.taskService.exportToExcel3Columns(filteredTasks, startDate, endDate);
        } else {
          this.exportExcel3ColumnsFallback(filteredTasks, startDate, endDate);
        }
      });
    }
  }

  populateStaffDropdown(department) {
    const staffSelect = document.getElementById('filter-staff');
    if (!staffSelect) return;

    staffSelect.innerHTML = '<option value="ALL">-- Tất cả nhân viên --</option>';
    const staffList = this.userService.getUsersByDepartment ? this.userService.getUsersByDepartment(department) : [];

    staffList.forEach(user => {
      const opt = document.createElement('option');
      opt.value = user.id || user.email;
      opt.textContent = `${user.name} (${user.email})`;
      staffSelect.appendChild(opt);
    });
  }

  exportExcel3ColumnsFallback(tasks, startDate, endDate) {
    if (!tasks || tasks.length === 0) {
      alert("Không có dữ liệu để xuất Excel!");
      return;
    }

    const dateRangeText = (startDate && endDate) 
      ? `Từ ${startDate} đến ${endDate}` 
      : "Tất cả thời gian";

    let tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"></head>
      <body>
        <table border="1">
          <thead>
            <tr style="background-color: #f2f2f2; font-weight: bold;">
              <th>Thời gian</th>
              <th>Họ và Tên</th>
              <th>Công việc</th>
            </tr>
          </thead>
          <tbody>
    `;

    tasks.forEach(task => {
      const assignee = task.assigneeName || task.creatorName || "Chưa phân công";
      tableHtml += `
        <tr>
          <td>${dateRangeText}</td>
          <td>${assignee}</td>
          <td>${task.title || ''}</td>
        </tr>
      `;
    });

    tableHtml += `</tbody></table></body></html>`;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bao_cao_cong_viec_${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

// Khởi tạo app
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});