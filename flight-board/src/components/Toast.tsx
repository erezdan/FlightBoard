import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastData {
  type: ToastType;
  message: string;
  description?: string;
}

interface ToastProps {
  toast: ToastData | null;
  onClose: () => void;
}

const toastTypes: Record<ToastType, {
  icon: React.ElementType;
  className: string;
  iconColor: string;
}> = {
  success: {
    icon: CheckCircle,
    className: "bg-green-50 border-green-200 text-green-800",
    iconColor: "text-green-500"
  },
  error: {
    icon: XCircle,
    className: "bg-red-50 border-red-200 text-red-800",
    iconColor: "text-red-500"
  },
  info: {
    icon: AlertCircle,
    className: "bg-blue-50 border-blue-200 text-blue-800",
    iconColor: "text-blue-500"
  }
};

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const config = toastTypes[toast?.type || "info"];
  const Icon = config.icon;

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`${config.className} border rounded-xl shadow-lg p-4 max-w-sm min-w-80 backdrop-blur-sm`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`w-5 h-5 ${config.iconColor} mt-0.5 flex-shrink-0`} />
              <div className="flex-1">
                <p className="font-medium text-sm">{toast.message}</p>
                {toast.description && (
                  <p className="text-xs opacity-80 mt-1">{toast.description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Toast;