import { ComponentProps } from "react";

export const Button = ({
    className,
    variant = 'primary',
    ...props
}: ComponentProps<"button"> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }) => {
    const base = "inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[0_0_15px_rgba(255,0,255,0.4)]",
        outline: "border-2 border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary",
        ghost: "text-foreground hover:bg-white/5",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${className}`}
            {...props}
        />
    );
};
