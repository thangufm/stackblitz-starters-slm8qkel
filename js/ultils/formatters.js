//Định dạng ngày tháng, trạng thái, màu sắc
// Định dạng ngày ISO (YYYY-MM-DD) sang chuẩn Việt Nam (DD/MM/YYYY)
export function formatDate(dateString) {
    if (!dateString) return '---';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Trả về class Tailwind CSS tương ứng cho từng trạng thái công việc
export function getStatusBadge(status) {
    switch (status) {
        case 'completed':
            return {
                label: 'Hoàn thành',
                bgClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
            };
        case 'in_progress':
            return {
                label: 'Đang thực hiện',
                bgClass: 'bg-blue-100 text-blue-800 border-blue-300'
            };
        case 'overdue':
            return {
                label: 'Trễ hạn',
                bgClass: 'bg-rose-100 text-rose-800 border-rose-300'
            };
        default:
            return {
                label: 'Mới tạo',
                bgClass: 'bg-slate-100 text-slate-800 border-slate-300'
            };
    }
}

// Trả về badge mức độ ưu tiên
export function getPriorityBadge(priority) {
    switch (priority) {
        case 'high':
            return { label: 'Cao', class: 'bg-red-50 text-red-700 border-red-200' };
        case 'medium':
            return { label: 'Trung bình', class: 'bg-amber-50 text-amber-700 border-amber-200' };
        default:
            return { label: 'Thấp', class: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
}