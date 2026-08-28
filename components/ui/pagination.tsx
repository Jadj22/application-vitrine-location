import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ className, ...props }: React.HTMLAttributes<HTMLNavElement>) => (
  <nav className={cn('flex items-center justify-center gap-1', className)} {...props} />
)
Pagination.displayName = 'Pagination'

const PaginationContent = ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className={cn('flex items-center gap-1', className)} {...props} />
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
  <li {...props} />
)
PaginationItem.displayName = 'PaginationItem'

const PaginationLink = ({ className, isActive, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    className={cn(
      'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
      isActive && 'bg-accent text-accent-foreground',
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationEllipsis = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn('flex h-9 w-9 items-center justify-center text-sm text-muted-foreground', className)} {...props} />
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

const PaginationNext = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={cn('h-9 w-9 rounded-lg border border-border bg-background text-sm font-medium', className)} {...props}>
    <ChevronRight className="h-4 w-4" />
    <span className="sr-only">Next page</span>
  </button>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationPrevious = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={cn('h-9 w-9 rounded-lg border border-border bg-background text-sm font-medium', className)} {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous page</span>
  </button>
)
PaginationPrevious.displayName = 'PaginationPrevious'

export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, PaginationNext, PaginationPrevious }