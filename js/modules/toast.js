/**
 * Toast notifikačný systém - moderná alternatíva pre alert/confirm
 */

/**
 * Typy toast notifikácií
 */
export const ToastType = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

/**
 * Kontajner pre toast notifikácie
 */
let toastContainer = null;

/**
 * Inicializuje toast kontajner
 */
function initToastContainer() {
    if (toastContainer) return toastContainer;

    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toastContainer);

    return toastContainer;
}

/**
 * Zobrazí toast notifikáciu
 */
export function showToast(message, type = ToastType.INFO, duration = 3000) {
    const container = initToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');

    // Ikona podľa typu
    const icon = getIconForType(type);

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${escapeHtml(message)}</div>
        <button class="toast-close" aria-label="Zavrieť notifikáciu">&times;</button>
    `;

    // Pridanie do kontajnera
    container.appendChild(toast);

    // Animácia zobrazenia
    requestAnimationFrame(() => {
        toast.classList.add('toast-show');
    });

    // Zatvorenie na klik
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        hideToast(toast);
    });

    // Automatické zatvorenie
    if (duration > 0) {
        setTimeout(() => {
            hideToast(toast);
        }, duration);
    }

    return toast;
}

/**
 * Skryje toast notifikáciu
 */
function hideToast(toast) {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

/**
 * Zobrazí success toast
 */
export function showSuccess(message, duration = 3000) {
    return showToast(message, ToastType.SUCCESS, duration);
}

/**
 * Zobrazí error toast
 */
export function showError(message, duration = 4000) {
    return showToast(message, ToastType.ERROR, duration);
}

/**
 * Zobrazí warning toast
 */
export function showWarning(message, duration = 3500) {
    return showToast(message, ToastType.WARNING, duration);
}

/**
 * Zobrazí info toast
 */
export function showInfo(message, duration = 3000) {
    return showToast(message, ToastType.INFO, duration);
}

/**
 * Zobrazí potvrdzovací dialóg (nahradí confirm())
 */
export function showConfirm(message, options = {}) {
    return new Promise((resolve) => {
        const {
            title = 'Potvrdenie',
            confirmText = 'Potvrdiť',
            cancelText = 'Zrušiť',
            type = 'warning'
        } = options;

        // Vytvorenie overlay
        const overlay = document.createElement('div');
        overlay.className = 'toast-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'dialog-title');

        // Vytvorenie dialógu
        const dialog = document.createElement('div');
        dialog.className = `toast-dialog toast-dialog-${type}`;

        const icon = getIconForType(type);

        dialog.innerHTML = `
            <div class="toast-dialog-header">
                <div class="toast-dialog-icon">${icon}</div>
                <h3 id="dialog-title" class="toast-dialog-title">${escapeHtml(title)}</h3>
            </div>
            <div class="toast-dialog-body">
                <p>${escapeHtml(message)}</p>
            </div>
            <div class="toast-dialog-footer">
                <button class="toast-btn toast-btn-cancel">${escapeHtml(cancelText)}</button>
                <button class="toast-btn toast-btn-confirm">${escapeHtml(confirmText)}</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Animácia zobrazenia
        requestAnimationFrame(() => {
            overlay.classList.add('toast-overlay-show');
            dialog.classList.add('toast-dialog-show');
        });

        // Focus na confirm button
        const confirmBtn = dialog.querySelector('.toast-btn-confirm');
        const cancelBtn = dialog.querySelector('.toast-btn-cancel');
        setTimeout(() => confirmBtn.focus(), 100);

        // Funkcia na zatvorenie
        const closeDialog = (confirmed) => {
            overlay.classList.remove('toast-overlay-show');
            dialog.classList.remove('toast-dialog-show');

            setTimeout(() => {
                document.body.removeChild(overlay);
                resolve(confirmed);
            }, 300);
        };

        // Event listenery
        confirmBtn.addEventListener('click', () => closeDialog(true));
        cancelBtn.addEventListener('click', () => closeDialog(false));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeDialog(false);
            }
        });

        // ESC key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeDialog(false);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Tab trapping
        dialog.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = dialog.querySelectorAll('button');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    });
}

/**
 * Zobrazí prompt dialóg (nahradí prompt())
 */
export function showPrompt(message, options = {}) {
    return new Promise((resolve) => {
        const {
            title = 'Vstup',
            confirmText = 'OK',
            cancelText = 'Zrušiť',
            defaultValue = '',
            placeholder = ''
        } = options;

        // Vytvorenie overlay
        const overlay = document.createElement('div');
        overlay.className = 'toast-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'dialog-title');

        // Vytvorenie dialógu
        const dialog = document.createElement('div');
        dialog.className = 'toast-dialog toast-dialog-info';

        dialog.innerHTML = `
            <div class="toast-dialog-header">
                <h3 id="dialog-title" class="toast-dialog-title">${escapeHtml(title)}</h3>
            </div>
            <div class="toast-dialog-body">
                <p>${escapeHtml(message)}</p>
                <input type="text" class="toast-input" value="${escapeHtml(defaultValue)}" placeholder="${escapeHtml(placeholder)}" />
            </div>
            <div class="toast-dialog-footer">
                <button class="toast-btn toast-btn-cancel">${escapeHtml(cancelText)}</button>
                <button class="toast-btn toast-btn-confirm">${escapeHtml(confirmText)}</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        const input = dialog.querySelector('.toast-input');

        // Animácia zobrazenia
        requestAnimationFrame(() => {
            overlay.classList.add('toast-overlay-show');
            dialog.classList.add('toast-dialog-show');
        });

        // Focus na input
        setTimeout(() => {
            input.focus();
            input.select();
        }, 100);

        // Funkcia na zatvorenie
        const closeDialog = (confirmed) => {
            overlay.classList.remove('toast-overlay-show');
            dialog.classList.remove('toast-dialog-show');

            setTimeout(() => {
                document.body.removeChild(overlay);
                resolve(confirmed ? input.value : null);
            }, 300);
        };

        // Event listenery
        const confirmBtn = dialog.querySelector('.toast-btn-confirm');
        const cancelBtn = dialog.querySelector('.toast-btn-cancel');

        confirmBtn.addEventListener('click', () => closeDialog(true));
        cancelBtn.addEventListener('click', () => closeDialog(false));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeDialog(false);
            }
        });

        // Enter key na input
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                closeDialog(true);
            }
        });

        // ESC key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeDialog(false);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    });
}

/**
 * Vráti ikonu pre daný typ notifikácie
 */
function getIconForType(type) {
    switch (type) {
        case ToastType.SUCCESS:
            return '✅';
        case ToastType.ERROR:
            return '❌';
        case ToastType.WARNING:
            return '⚠️';
        case ToastType.INFO:
            return 'ℹ️';
        default:
            return 'ℹ️';
    }
}

/**
 * Escapuje HTML pre bezpečné zobrazenie
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Vymaže všetky toast notifikácie
 */
export function clearAllToasts() {
    if (toastContainer) {
        const toasts = toastContainer.querySelectorAll('.toast');
        toasts.forEach(toast => hideToast(toast));
    }
}
