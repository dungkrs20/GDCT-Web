import { getAuth, onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { app, db } from "./firebase.js";

const auth = getAuth(app);

/* ===== BẢO VỆ TRANG ADMIN ===== */
export function requireAuth() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // ❌ Chưa đăng nhập → đá về login
      location.replace("login.html");
      return;
    }

    // 🔐 Kiểm tra quyền admin
    const ref = doc(db, "admins", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists() || snap.data().active !== true) {
      alert("Tài khoản không có quyền quản trị");
      await signOut(auth);
      location.replace("login.html");
    }
  });
}

/* ===== CHẶN QUAY LẠI LOGIN ===== */
export function blockLoginPage() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      location.replace("dashboard.html");
    }
  });
}

/* ===== ĐĂNG XUẤT ===== */
export async function logout() {
  await signOut(auth);
  location.replace("login.html");
}
