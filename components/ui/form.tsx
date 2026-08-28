'use client'

import * as React from 'react'
import * as Slot from '@radix-ui/react-slot'
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Label } from './label'

const Form = FormProvider

type FormFieldContextValue<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>
}

const FormFieldContext = React.createContext<FormFieldContextValue<FieldValues> | null>(null)

const FormField = <TFieldValues extends FieldValues = FieldValues>({
  ...props
}: ControllerProps<TFieldValues>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const context = React.useContext(FormFieldContext)
  if (!context) {
    throw new Error('useFormField should be used within <FormField>')
  }
  return context
}

type FormItemProps = React.HTMLAttributes<HTMLDivElement>

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className="space-y-2" {...props} />
})
FormItem.displayName = 'FormItem'

type FormLabelProps = React.HTMLAttributes<HTMLLabelElement>

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(({ className, ...props }, ref) => {
  return (
    <Label ref={ref} className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)} {...props} />
  )
})
FormLabel.displayName = 'FormLabel'

type FormControlProps = React.HTMLAttributes<HTMLDivElement>

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('', className)} {...props} />
})
FormControl.displayName = 'FormControl'

type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(({ className, ...props }, ref) => {
  return <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
})
FormDescription.displayName = 'FormDescription'

type FormMessageProps = React.HTMLAttributes<HTMLParagraphElement>

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(({ className, children, ...props }, ref) => {
  if (!children) return null
  return <p ref={ref} className={cn('text-sm font-medium text-destructive', className)} {...props}>{children}</p>
})
FormMessage.displayName = 'FormMessage'

const FormField: React.FC<ControllerProps<FieldValues>> = ({ ...props }) => <FormField {...props} />

export { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField, useFormField }