import { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  hidden?: boolean;
}

export function PrimaryButton({
  children,
  disabled,
  loading,
  hidden,
  ...props
}: PrimaryButtonProps) {
  if (hidden) return null;

  return (
    <button
      className="w-full py-3 px-4 bg-[#BA181B] text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#A11518] transition-colors duration-200"
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
}
