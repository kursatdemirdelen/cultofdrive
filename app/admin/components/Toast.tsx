import { CheckCircle, XCircle, X } from "lucide-react";
import { useEffect } from "react";

type Props = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

export function Toast({ message, type, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
      <div
        className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur ${
          type === "success"
            ? "border-green-500/20 bg-green-500/10 text-green-400"
            : "border-red-500/20 bg-red-500/10 text-red-400"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <XCircle className="h-5 w-5" />
        )}
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 rounded p-1 hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
