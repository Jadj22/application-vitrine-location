'use client'

import { cn } from '@/lib/utils'

interface ToasterProps {
  className?: string
}

export function Toaster({ className }: ToasterProps) {
  // Simple toast container - in a real app would use a proper toast library
  return (
    <div className={cn('fixed bottom-0 right-0 flex flex-col gap-2 p-4 z-50', className)} />
  )
}