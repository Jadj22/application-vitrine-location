import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning'
}

const Alert = ({ className, variant = 'default', ...props }: AlertProps) => (
  <div
    className={cn(
      'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
      {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        success: 'bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800 [&>svg]:text-green-600 dark:[&>svg]:text-green-400',
        warning: 'bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400',
      }[variant],
      className
    )}
    role="alert"
    {...props}
  )
)

const AlertTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h5 className={cn('mb-1 font-medium leading-none', className)} {...props} />
)

const AlertDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <div className={cn('text-sm [&_p]:leading-relaxed [&_p]:mt-1', className)} {...props} />
)

export { Alert, AlertTitle, AlertDescription }