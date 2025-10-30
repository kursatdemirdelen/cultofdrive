import { AlertTriangle } from "lucide-react";

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning";
};

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type = "warning",
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-xl border border-white/10 bg-black/90 p-6 shadow-2xl">
        <div className="mb-4 flex items-start gap-3">
          <div
            className={`rounded-full p-2 ${
              type === "danger" ? "bg-red-500/10" : "bg-yellow-500/10"
            }`}
          >
            <AlertTriangle
              className={`h-6 w-6 ${
                type === "danger" ? "text-red-400" : "text-yellow-400"
              }`}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-white/70">{message}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-white/20 px-4 py-2.5 font-medium text-white/80 transition hover:bg-white/5"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-lg px-4 py-2.5 font-medium text-white transition ${
              type === "danger"
                ? "bg-red-500/80 hover:bg-red-500"
                : "bg-yellow-500/80 hover:bg-yellow-500"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
