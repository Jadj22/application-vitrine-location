'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '@/lib/utils'

const RadioGroup = RadioGroupPrimitive.Root
const RadioGroupItem = RadioGroupPrimitive.Item.forwardRef
  (<RadioGroupPrimitive.ItemProps, HTMLButtonElement>(
    ({ className, ...props }, ref) => (
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          'aspect-square h-4 w-4 rounded-full border border-border text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    )
  )
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }