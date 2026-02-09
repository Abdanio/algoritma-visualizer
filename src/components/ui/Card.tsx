import { ComponentProps } from "react";

export const Card = ({
    className,
    title,
    subtext,
    children,
    ...props
}: ComponentProps<"div"> & { title?: string; subtext?: string }) => {
    return (
        <div
            className={`relative overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-black/50 ${className}`}
            {...props}
        >
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10 p-6">
                {title && (
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                            {title}
                        </h3>
                        {subtext && (
                            <p className="mt-1 text-sm text-muted-foreground">{subtext}</p>
                        )}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};
