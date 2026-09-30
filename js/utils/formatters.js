//Định dạng ngày tháng, trạng thái, màu sắc
// Định dạng hiển thị ngày tháng
export function formatDate(dateString) {
    if (!dateString) return 'Chưa đặt';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Lấy thông tin Badge Trạng thái công việc
export function getStatusBadge(status) {
    switch (status) {
        case 'completed':
            return {
                label: 'Hoàn thành',
                bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
            };
        case 'in_progress':
            return {
                label: 'Đang thực hiện',
                bgClass: 'bg-blue-50 text-blue-700 border-blue-200'
            };
        case 'pending':
        default:
            return {
                label: 'Mới tạo',
                bgClass: 'bg-slate-100 text-slate-700 border-slate-200'
            };
    }
}

// Lấy thông tin Badge Mức độ ưu tiên
export function getPriorityBadge(priority) {
    switch (priority) {
        case 'high':
            return {
                label: 'Cao',
                class: 'bg-rose-50 text-rose-700 border-rose-200'
            };
        case 'medium':
            return {
                label: 'Trung bình',
                class: 'bg-amber-50 text-amber-700 border-amber-200'
            };
        case 'low':
        default:
            return {
                label: 'Thấp',
                class: 'bg-slate-50 text-slate-600 border-slate-200'
            };
    }
}