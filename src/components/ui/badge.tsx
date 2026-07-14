interface BadgeProps {

    children: React.ReactNode;

    className?: string;

}

export function Badge({

    children,

    className = "",

}: BadgeProps) {

    return (

        <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${className}`}
        >
            {children}
        </span>

    );

}