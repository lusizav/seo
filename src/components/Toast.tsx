import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import type { Toast as ToastType } from '../hooks/useToast';

interface ToastProps {
    toast: ToastType;
    onClose: (id: string) => void;
}

export function Toast({ toast, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => onClose(toast.id), 3000);
        return () => clearTimeout(timer);
    }, [toast.id, onClose]);

    const icons = {
        success: <CheckCircle className="text-primary-500" size={20} />,
        error: <XCircle className="text-red-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
    };

    const bgColors = {
        success: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    };

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColors[toast.type]} shadow-lg animate-slideUp`}>
            {icons[toast.type]}
            <p className="flex-1 text-sm font-medium text-slate-900 dark:text-slate-100">{toast.message}</p>
            <button
                onClick={() => onClose(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
}

interface ToastContainerProps {
    toasts: ToastType[];
    onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={onClose} />
            ))}
        </div>
    );
}
