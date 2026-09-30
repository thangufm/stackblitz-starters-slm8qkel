export class Task {
    constructor(id, title, dept, deptName, assignee, deadline, status, directive = '', expectedProduct = '', coWorkers = [], proofUrl = '', proofNote = '') {
        this.id = id;
        this.title = title;
        this.dept = dept;
        this.deptName = deptName;
        this.assignee = assignee;         
        this.coWorkers = coWorkers;       
        this.deadline = deadline;         
        this.status = status;             // 'WAITING_ASSIGN', 'DOING', 'DONE', 'LATE'
        this.directive = directive;       
        this.expectedProduct = expectedProduct; 
        this.proofUrl = proofUrl;         
        this.proofNote = proofNote;       
    }

    setDirective(text) {
        this.directive = text;
    }

    assignTask(assignee, coWorkers = []) {
        this.assignee = assignee;
        this.coWorkers = coWorkers;
        if (this.status === 'WAITING_ASSIGN') {
            this.status = 'DOING';
        }
    }

    updateStatusAndProof(newStatus, proofUrl, proofNote) {
        this.status = newStatus;
        this.proofUrl = proofUrl;
        this.proofNote = proofNote;
    }
}