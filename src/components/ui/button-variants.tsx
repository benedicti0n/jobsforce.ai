import type React from "react"
import { Button } from "./Button"
import { cn } from "@/lib/utils"

export function PrimaryButton({ className, children, ...props }: React.ComponentProps<typeof Button>) {
    return (
        <Button
            className={cn(
                "bg-cyan text-black font-medium shadow-lg hover:shadow-cyan/25 hover:bg-cyan/90 transition-all duration-300",
                className,
            )}
            {...props}
        >
            {children}
        </Button>
    )
}

export function SecondaryButton({ className, children, ...props }: React.ComponentProps<typeof Button>) {
    return (
        <Button
            variant="outline"
            className={cn(
                "bg-white border-2 border-yellow text-black font-medium shadow-lg hover:shadow-yellow/25 hover:bg-yellow/10 transition-all duration-300",
                className,
            )}
            {...props}
        >
            {children}
        </Button>
    )
}

export function DestructiveButton({ className, children, ...props }: React.ComponentProps<typeof Button>) {
    return (
        <Button
            variant="destructive"
            className={cn(
                "bg-destructive text-destructive-foreground font-medium shadow-lg hover:shadow-destructive/25 hover:bg-destructive/90 transition-all duration-300",
                className,
            )}
            {...props}
        >
            {children}
        </Button>
    )
}

