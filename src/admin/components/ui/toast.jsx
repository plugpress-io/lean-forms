import React from "react"
import { Toaster, toast } from "sonner"
import { cn } from "../lib/utils"

// Custom toast component wrapper
export function Toast({ className, ...props }) {
  return (
    <Toaster
      className={cn(
        "toaster group",
        className
      )}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

// Helper functions for different toast types
export const showToast = {
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 3000,
      ...options,
    })
  },
  
  error: (message, options = {}) => {
    return toast.error(message, {
      duration: 4000,
      ...options,
    })
  },
  
  info: (message, options = {}) => {
    return toast.info(message, {
      duration: 3000,
      ...options,
    })
  },
  
  loading: (message, options = {}) => {
    return toast.loading(message, {
      duration: Infinity,
      ...options,
    })
  },
  
  promise: (promise, messages, options = {}) => {
    return toast.promise(promise, messages, {
      duration: 3000,
      ...options,
    })
  },
  
  dismiss: (toastId) => {
    return toast.dismiss(toastId)
  },
  
  dismissAll: () => {
    return toast.dismiss()
  }
}

export { toast }
