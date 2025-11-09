"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

let toastId = 0;
const listeners = new Set<(toasts: Toast[]) => void>();
let toasts: Toast[] = [];

function notify(message: string, type: ToastType = "success") {
  const id = `toast-${++toastId}`;
  toasts = [...toasts, { id, message, type }];
  listeners.forEach((listener) => listener(toasts));
  
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(toasts));
  }, 3000);
}

export const toast = {
  success: (message: string) => notify(message, "success"),
  error: (message: string) => notify(message, "error"),
  info: (message: string) => notify(message, "info"),
};

export function ToastContainer() {
  const [toastList, setToastList] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.add(setToastList);
    return () => {
      listeners.delete(setToastList);
    };
  }, []);

  const remove = (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(toasts));
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "border-green-500/30 bg-green-500/10 text-green-400",
    error: "border-red-500/30 bg-red-500/10 text-red-400",
    info: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  };

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toastList.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`pointer-events-auto flex items-center gap-3 rounded-lg border backdrop-blur-xl px-4 py-3 shadow-lg ${colors[toast.type]}`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => remove(toast.id)}
                className="ml-2 opacity-60 transition hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
