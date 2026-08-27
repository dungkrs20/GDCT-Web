/**
 * Custom Confirmation Dialog for Admin CMS
 * Displays a beautiful, modern Tailwind modal matching the application's design system.
 */

let modalStylesInjected = false;

function injectModalStyles() {
  if (modalStylesInjected) return;
  modalStylesInjected = true;
  const style = document.createElement("style");
  style.id = "custom-confirm-modal-styles";
  style.textContent = `
    @keyframes confirmModalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes confirmModalScaleUp {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .animate-confirm-fade-in {
      animation: confirmModalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-confirm-scale-up {
      animation: confirmModalScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Shows an elegant confirmation dialog
 * @param {Object} options
 * @param {string} [options.title="Bạn có chắc chắn muốn xóa không?"]
 * @param {string} [options.message="Thao tác này sẽ xóa vĩnh viễn nội dung khỏi hệ thống và không thể khôi phục."]
 * @param {string} [options.itemName=""] - Name of the item being deleted
 * @param {string} [options.itemType=""] - Type label (e.g. "Cuộc thi", "Banner", "Bài viết", "Tài liệu", "Bài hát", "Nhân vật/Sự kiện")
 * @param {string} [options.confirmText="Xác nhận xóa"]
 * @param {string} [options.cancelText="Hủy bỏ"]
 * @param {'danger'|'warning'|'info'} [options.type="danger"]
 * @returns {Promise<boolean>} Resolves to true if confirmed, false otherwise
 */
export function showConfirmModal({
  title = "Bạn có chắc chắn muốn xóa không?",
  message = "Thao tác này sẽ xóa vĩnh viễn dữ liệu khỏi hệ thống và không thể khôi phục.",
  itemName = "",
  itemType = "",
  confirmText = "Xác nhận xóa",
  cancelText = "Hủy bỏ",
  type = "danger"
} = {}) {
  injectModalStyles();

  return new Promise((resolve) => {
    // Prevent duplicate modals
    const existing = document.getElementById("customConfirmModalContainer");
    if (existing) existing.remove();

    const container = document.createElement("div");
    container.id = "customConfirmModalContainer";
    container.className = "fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-confirm-fade-in";

    let iconHtml = `
      <div class="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>
    `;

    let confirmBtnClass = "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-lg shadow-rose-600/25";

    if (type === "warning") {
      iconHtml = `
        <div class="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      `;
      confirmBtnClass = "bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white shadow-lg shadow-amber-600/25";
    }

    const itemBoxHtml = itemName ? `
      <div class="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 mb-5 text-left flex items-start space-x-3">
        <div class="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs text-sm">
          ${itemType ? (
            itemType.includes("Cuộc thi") ? "🏆" :
            itemType.includes("Banner") ? "🖼️" :
            itemType.includes("Bài viết") || itemType.includes("Tin tức") ? "📰" :
            itemType.includes("Tài liệu") ? "📄" :
            itemType.includes("Bài hát") || itemType.includes("Ca khúc") ? "🎵" :
            itemType.includes("Nhân vật") || itemType.includes("Sự kiện") ? "⭐" : "📦"
          ) : "🗑️"}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">${itemType || "Nội dung xóa"}</div>
          <div class="text-xs font-bold text-slate-900 truncate mt-0.5" title="${itemName}">${itemName}</div>
        </div>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden p-6 sm:p-7 text-center animate-confirm-scale-up">
        
        <!-- Close button (top-right) -->
        <button id="btnConfirmCloseModal" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        ${iconHtml}

        <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-2">
          ${title}
        </h3>

        <p class="text-xs sm:text-sm text-slate-500 mb-4 leading-relaxed px-2">
          ${message}
        </p>

        ${itemBoxHtml}

        <div class="flex items-center space-x-3 pt-1">
          <button id="btnConfirmCancel" class="w-1/2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer">
            ${cancelText}
          </button>
          
          <button id="btnConfirmSubmit" class="w-1/2 px-4 py-2.5 rounded-xl ${confirmBtnClass} font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>${confirmText}</span>
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(container);

    const btnSubmit = container.querySelector("#btnConfirmSubmit");
    const btnCancel = container.querySelector("#btnConfirmCancel");
    const btnClose = container.querySelector("#btnConfirmCloseModal");

    function cleanup(result) {
      document.removeEventListener("keydown", handleKeyDown);
      container.remove();
      resolve(result);
    }

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        cleanup(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    btnSubmit.onclick = () => cleanup(true);
    btnCancel.onclick = () => cleanup(false);
    btnClose.onclick = () => cleanup(false);

    container.onclick = (e) => {
      if (e.target === container) cleanup(false);
    };

    // Auto focus cancel for destructive safety
    btnCancel.focus();
  });
}
