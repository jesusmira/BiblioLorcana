import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "solid" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const buttonBase = "rounded-full px-[18px] py-3 text-[0.95rem] font-semibold transition duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0";

const variantStyles: Record<ButtonVariant, string> = {
  solid: "bg-[var(--accent)] text-white shadow-[0_12px_24px_rgba(197,138,60,0.35)]",
  ghost: "border border-[var(--stroke)] bg-transparent text-[var(--ink)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "solid", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonBase, variantStyles[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export const buttonSolid = cn(buttonBase, variantStyles.solid);
export const buttonGhost = cn(buttonBase, variantStyles.ghost);
