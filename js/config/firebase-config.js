// Khởi tạo & Xuất kết nối Firebase Realtime DB
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    push, 
    set, 
    get, 
    update, 
    remove, 
    onValue, 
    query, 
    orderByChild, 
    equalTo 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBYjORDaQLmPwfAFhqRTwAi-ufVec8qd_0",
    authDomain: "quanlycongviec-651b6.firebaseapp.com",
    databaseURL: "https://quanlycongviec-651b6-default-rtdb.firebaseio.com",
    projectId: "quanlycongviec-651b6",
    storageBucket: "quanlycongviec-651b6.firebasestorage.app",
    messagingSenderId: "775368483539",
    appId: "1:775368483539:web:c9464d5f59c3104fe2aa26"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Export các hàm thao tác DB để các Module khác gọi trực tiếp
export { ref, push, set, get, update, remove, onValue, query, orderByChild, equalTo };