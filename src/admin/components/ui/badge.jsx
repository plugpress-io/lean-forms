import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        warning:
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        info:
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        // Feature type variants - static, no hover/transitions
        pro:
          "bg-blue-100 text-blue-700 border-blue-200 pointer-events-none select-none shadow-none transition-none hover:bg-blue-100 hover:text-blue-700 active:bg-blue-100 active:text-blue-700",
        lite:
          "bg-gray-100 text-gray-700 border-gray-200 pointer-events-none select-none shadow-none transition-none hover:bg-gray-100 hover:text-gray-700 active:bg-gray-100 active:text-gray-700",
        planned:
          "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-80 pointer-events-none select-none shadow-none transition-none hover:bg-muted hover:text-muted-foreground active:bg-muted active:text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
