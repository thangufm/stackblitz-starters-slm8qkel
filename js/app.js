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
    // 1. Kiểm tra trạng thái đăng nhập từ UserService
    const currentUser = this.userService.getCurrentUser();

    if (!currentUser) {
      this.renderLoginView();
    } else {
      this.renderDashboard(currentUser);
    }

    // 2. Lắng nghe các sự kiện chung
    this.bindGlobalEvents();
  }

  // --- XỬ LÝ GIAO DIỆN ĐĂNG NHẬP ---
  renderLoginView() {
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');

    if (loginContainer) loginContainer.classList.remove('d-none');
    if (dashboardContainer) dashboardContainer.classList.add('d-none');
  }

  // --- XỬ LÝ GIAO DIỆN DASHBOARD CHÍNH ---
  renderDashboard(user) {
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');

    if (loginContainer) loginContainer.classList.add('d-none');
    if (dashboardContainer) dashboardContainer.classList.remove('d-none');

    // Lấy dữ liệu công việc và render bằng AdminDashboardView
    const tasks = this.taskService.getTasks();
    this.dashboardView.render(user, tasks);
  }

  // --- BẮT SỰ KIỆN TOÀN CỤC ---
  bindGlobalEvents() {
    // 1. Sự kiện Đăng nhập
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;

        const user = this.userService.login(email, password);
        if (user) {
          this.renderDashboard(user);
        } else {
          alert('Email UFM hoặc mật khẩu không chính xác!');
        }
      });
    }

    // 2. Sự kiện Đăng xuất
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        this.userService.logout();
        this.renderLoginView();
      });
    }

    // 3. Sự kiện Đổi mật khẩu
    const btnSavePass = document.getElementById('btn-save-password');
    if (btnSavePass) {
      btnSavePass.addEventListener('click', () => {
        const currentPass = document.getElementById('current-pass')?.value;
        const newPass = document.getElementById('new-pass')?.value;
        
        const result = this.userService.changePassword(currentPass, newPass);
        if (result.success) {
          alert('Đổi mật khẩu thành công!');
          const modalEl = document.getElementById('modal-change-pass');
          if (modalEl && window.bootstrap) {
            bootstrap.Modal.getInstance(modalEl)?.hide();
          }
        } else {
          alert(result.message || 'Đổi mật khẩu thất bại!');
        }
      });
    }

    // 4. Sự kiện Đăng ký công việc nhiều dòng (Batch add)
    const btnSaveBatch = document.getElementById('btn-save-batch-task');
    if (btnSaveBatch) {
      btnSaveBatch.addEventListener('click', () => {
        const rows = document.querySelectorAll('.batch-task-row');
        const tasksData = [];

        rows.forEach(row => {
          const title = row.querySelector('.task-title')?.value;
          const expectedOutput = row.querySelector('.task-output')?.value;
          const deadline = row.querySelector('.task-deadline')?.value;

          if (title && title.trim() !== '') {
            tasksData.push({ title, expectedOutput, deadline });
          }
        });

        if (tasksData.length > 0) {
          const currentUser = this.userService.getCurrentUser();
          this.taskService.addBatchTasks(tasksData, currentUser);
          this.refreshDashboard();

          const modalEl = document.getElementById('modal-add-task');
          if (modalEl && window.bootstrap) {
            bootstrap.Modal.getInstance(modalEl)?.hide();
          }
        } else {
          alert('Vui lòng nhập ít nhất một tên công việc!');
        }
      });
    }

    // 5. Bộ lọc (Ngày tháng, Phòng ban, Nhân viên)
    const filterDept = document.getElementById('filter-department');
    if (filterDept) {
      filterDept.addEventListener('change', () => this.refreshDashboard());
    }

    const filterStartDate = document.getElementById('filter-start-date');
    const filterEndDate = document.getElementById('filter-end-date');
    if (filterStartDate) filterStartDate.addEventListener('change', () => this.refreshDashboard());
    if (filterEndDate) filterEndDate.addEventListener('change', () => this.refreshDashboard());

    // 6. Nút Xuất báo cáo Excel (3 cột)
    const btnExportExcel = document.getElementById('btn-export-excel');
    if (btnExportExcel) {
      btnExportExcel.addEventListener('click', () => {
        const startDate = document.getElementById('filter-start-date')?.value;
        const endDate = document.getElementById('filter-end-date')?.value;
        const filteredTasks = this.taskService.getFilteredTasks();
        this.taskService.exportToExcel3Columns(filteredTasks, startDate, endDate);
      });
    }
  }

  // --- CẬP NHẬT LẠI GIAO DIỆN KHI DỮ LIỆU THAY ĐỔI ---
  refreshDashboard() {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.renderDashboard(currentUser);
    }
  }
}

// Khởi chạy ứng dụng
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});