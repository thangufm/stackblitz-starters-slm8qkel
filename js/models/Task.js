export class Task {
    constructor(id, title, dept, deptName, assignee, deadline, status, directive = '') {
        this.id = id;
        this.title = title;
        this.dept = dept;           // 'HC-TV' hoặc 'DT-QLSV'
        this.deptName = deptName;
        this.assignee = assignee;   // Người phụ trách
        this.deadline = deadline;
        this.status = status;       // 'DOING', 'DONE', 'LATE'
        this.directive = directive; // Ý kiến chỉ đạo của BGĐ55
    }

    // Cập nhật ý kiến chỉ đạo của BGĐ
    setDirective(text) {
        this.directive = text;
    }
}