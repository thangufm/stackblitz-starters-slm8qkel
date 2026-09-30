export class User {
    constructor(email, fullName, position, deptId, role, password = '123') {
        this.email = email;
        this.fullName = fullName;
        this.position = position;
        this.deptId = deptId;
        this.role = role; // 'SUPER_ADMIN', 'ADMIN_BGD', 'MANAGER', 'STAFF'
        this.password = password;
    }
}