import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const baseStyles = "inline-flex items-center justify-center font-ui font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants: Record<ButtonVariant, string> = {
      primary: "bg-moss text-white rounded-full hover:bg-moss-dark px-6 py-2.5 shadow-sm hover:shadow-md",
      secondary: "bg-transparent text-clay border border-clay hover:bg-warm-surface rounded-full px-6 py-2.5",
      ghost: "bg-transparent text-ink hover:text-moss relative group px-2 py-1 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-moss before:scale-x-0 before:origin-left hover:before:scale-x-100 before:transition-transform before:duration-300",
      icon: "bg-surface hover:bg-surface-hover text-ink border border-border rounded-full p-2 hover:shadow-sm"
    };

    return (
      <Comp
        className={cn(baseStyles, variants[variant], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
