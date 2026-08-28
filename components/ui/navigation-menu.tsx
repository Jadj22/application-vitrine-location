'use client'

import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const NavigationMenu = NavigationMenuPrimitive.Root
const NavigationMenuList = NavigationMenuPrimitive.List
const NavigationMenuItem = NavigationMenuPrimitive.Item

const NavigationMenuContent = NavigationMenuPrimitive.Content.forwardRef
  (<NavigationMenuPrimitive.ContentProps, HTMLDivElement>(
    ({ className, ...props }, ref) => (
      <NavigationMenuPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-0 top-0 z-50 w-full h-[var(--radix-navigation-menu-viewport-height)] overflow-y-auto bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          className
        )}
        {...props}
      />
    )
  )
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link.forwardRef
  (<NavigationMenuPrimitive.LinkProps, HTMLAnchorElement>(
    ({ className, active, ...props }, ref) => (
      <NavigationMenuPrimitive.Link
        ref={ref}
        className={cn(
          'group flex cursor-pointer items-center px-3 py-2 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground',
          active && 'bg-accent text-accent-foreground',
          className
        )}
        {...props}
      />
    )
  )
NavigationMenuLink.displayName = NavigationMenuPrimitive.Link.displayName

const NavigationMenuIndicator = NavigationMenuPrimitive.Indicator.forwardRef
  (<NavigationMenuPrimitive.IndicatorProps, HTMLDivElement>(
    ({ className, ...props }, ref) => (
      <NavigationMenuPrimitive.Viewport className={cn('absolute bottom-0 h-1 w-px bg-primary', className)}>
        <NavigationMenuPrimitive.Indicator
          ref={ref}
          className={cn(
            'h-full w-[var(--radix-navigation-menu-indicator-size)] bg-primary transition-transform duration-200',
            className
          )}
        />
      </NavigationMenuPrimitive.Viewport>
    )
  )
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName

const NavigationMenuViewport = NavigationMenuPrimitive.Viewport
const NavigationMenuTrigger = NavigationMenuPrimitive.Trigger.forwardRef
  (<NavigationMenuPrimitive.TriggerProps, HTMLButtonElement>(
    ({ className, children, ...props }, ref) => (
      <NavigationMenuPrimitive.Trigger
        ref={ref}
        className={cn(
          'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="relative -top-0.5 ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
      </NavigationMenuPrimitive.Trigger>
    )
  )
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

export { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport }