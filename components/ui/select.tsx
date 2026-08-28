'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = SelectPrimitive.SelectTrigger.forwardRef
  (<SelectPrimitive.SelectTriggerProps, HTMLButtonElement>(
    ({ className, children, ...props }, ref) => (
      <SelectPrimitive.SelectTrigger
        ref={ref}
        className={cn(
          'flex h-9 w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm transition-[width,height] data-[placeholder]:text-muted-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          className
        )}
        {...props}
      >
        {children}
        <SelectPrimitive.SelectIcon>
          <ChevronDown className="size-4 opacity-50" />
        </SelectPrimitive.SelectIcon>
      </SelectPrimitive.SelectTrigger>
    )
  )
SelectTrigger.displayName = SelectPrimitive.SelectTrigger.displayName

const SelectScrollUpButton = SelectPrimitive.ScrollUpButton.forwardRef
  (<SelectPrimitive.ScrollUpButtonProps, HTMLButtonElement>(
    ({ className, ...props }, ref) => (
      <SelectPrimitive.ScrollUpButton
        ref={ref}
        className={cn(
          'flex cursor-default items-center justify-center py-1',
          className
        )}
        {...props}
      >
        <ChevronUp className="size-4" />
      </SelectPrimitive.ScrollUpButton>
    )
  )
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = SelectPrimitive.ScrollDownButton.forwardRef
  (<SelectPrimitive.ScrollDownButtonProps, HTMLButtonElement>(
    ({ className, ...props }, ref) => (
      <SelectPrimitive.ScrollDownButton
        ref={ref}
        className={cn(
          'flex cursor-default items-center justify-center py-1',
          className
        )}
        {...props}
      >
        <ChevronDown className="size-4" />
      </SelectPrimitive.ScrollDownButton>
    )
  )
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = SelectPrimitive.SelectContent.forwardRef
  (<SelectPrimitive.SelectContentProps, HTMLDivElement>(
    ({ className, children, position = 'popper', ...props }, ref) => (
      <SelectPrimitive.SelectPortal>
        <SelectPrimitive.SelectContent
          ref={ref}
          className={cn(
            'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-background text-sm text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            position === 'popper' &&
              'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
            className
          )}
          position={position}
          {...props}
        >
          <SelectPrimitive.SelectScrollUpButton />
          <SelectPrimitive.SelectViewport
            className={cn(
              'p-1',
              position === 'popper' &&
                'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
            )}
          >
            {children}
          </SelectPrimitive.SelectViewport>
          <SelectPrimitive.ScrollDownButton />
        </SelectPrimitive.SelectContent>
      </SelectPrimitive.SelectPortal>
    )
  )
SelectContent.displayName = SelectPrimitive.SelectContent.displayName

const SelectLabel = SelectPrimitive.Label.forwardRef
  (<SelectPrimitive.LabelProps, HTMLDivElement>(
    ({ className, ...props }, ref) => (
      <SelectPrimitive.Label
        ref={ref}
        className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
        {...props}
      />
    )
  )
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = SelectPrimitive.Item.forwardRef
  (<SelectPrimitive.ItemProps, HTMLDivElement>(
    ({ className, children, disabled, ...props }, ref) => (
      <SelectPrimitive.Item
        ref={ref}
        className={cn(
          'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          className
        )}
        {...props}
      >
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" />
        </SelectPrimitive.ItemIndicator>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    )
  )
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = SelectPrimitive.Separator.forwardRef
  (<SelectPrimitive.SeparatorProps, HTMLDivElement>(
    ({ className, ...props }, ref) => (
      <SelectPrimitive.Separator
        ref={ref}
        className={cn('bg-border -mx-1 my-1 h-px', className)}
        {...props}
      />
    )
  )
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton }