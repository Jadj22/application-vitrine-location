'use client'

import { cn } from '@/lib/utils'

export function Toaster() {
  // Simple toast implementation - in production would use a proper toast library
  return null
}

export function Toast({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border border-border bg-background p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full',
        className
      )}
      {...props}
    />
  )
}

export function ToastAction({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}

export function ToastClose({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.toast]:opacity-100',
        className
      )}
      {...props}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  )
}

export function ToastDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <div className={cn('text-sm opacity-90', className)} {...props} />
}

export function ToastTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <div className={cn('text-sm font-semibold', className)} {...props} />
}

export function ToastViewport({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 overflow-y-auto p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
        className
      )}
      {...props}
    />
  )
}