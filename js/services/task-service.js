//Logic CRUD & Lắng nghe thời gian thực Công việc
import { db, ref, push, set, get, update, remove, onValue } from 'js/config/firebase-config.js';

export const TaskService = {
    // 1. Tạo công việc mới
    async createTask(taskData) {
        const tasksRef = ref(db, 'tasks');
        const newTaskRef = push(tasksRef);
        const taskId = newTaskRef.key;

        const payload = {
            id: taskId,
            title: taskData.title,
            description: taskData.description || '',
            assigneeId: taskData.assigneeId || '', // Người thực hiện (User ID)
            assigneeName: taskData.assigneeName || '',
            deptId: taskData.deptId || '', // Phòng ban phụ trách
            priority: taskData.priority || 'medium', // 'low', 'medium', 'high'
            status: taskData.status || 'pending', // 'pending', 'in_progress', 'completed'
            dueDate: taskData.dueDate || '',
            createdById: taskData.createdById,
            createdByName: taskData.createdByName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await set(newTaskRef, payload);
        return payload;
    },

    // 2. Cập nhật thông tin công việc
    async updateTask(taskId, updateData) {
        const taskRef = ref(db, `tasks/${taskId}`);
        const payload = {
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        await update(taskRef, payload);
    },

    // 3. Xóa công việc
    async deleteTask(taskId) {
        const taskRef = ref(db, `tasks/${taskId}`);
        await remove(taskRef);
    },

    // 4. Lắng nghe danh sách công việc thời gian thực (Realtime Sync)
    subscribeTasks(callback) {
        const tasksRef = ref(db, 'tasks');
        return onValue(tasksRef, (snapshot) => {
            const data = snapshot.val();
            const taskList = [];
            if (data) {
                Object.keys(data).forEach((key) => {
                    taskList.push({
                        id: key,
                        ...data[key]
                    });
                });
            }
            // Sắp xếp công việc mới nhất lên đầu
            taskList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            callback(taskList);
        });
    }
};