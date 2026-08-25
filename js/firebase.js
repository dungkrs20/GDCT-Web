// admin/js/firebase.js

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 Firebase config của dự án
export const firebaseConfig = {
  apiKey: "AIzaSyC9DCdJckkapVVgFURq2Tr3-FpuLmrZQl4",
  authDomain: "chinh-tri-so.firebaseapp.com",
  projectId: "chinh-tri-so"
};

// 🚀 Khởi tạo app (CHỈ 1 LẦN)
export const app = initializeApp(firebaseConfig);

// 🔐 Auth dùng chung
export const auth = getAuth(app);

// 🗄️ Firestore dùng chung
export const db = getFirestore(app);
