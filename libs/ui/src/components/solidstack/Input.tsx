import { JSX, splitProps } from "solid-js"

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  variant?: "outline" | "filled" | "flushed"
  size?: "sm" | "md" | "lg"
  invalid?: boolean
  label?: string | JSX.Element
  helperText?: string | JSX.Element
  errorText?: string | JSX.Element
  leftElement?: JSX.Element
  rightElement?: JSX.Element
  containerClass?: string
}

export function Input(props: InputProps) {
  const [local, others] = splitProps(props, [
    "variant", "size", "invalid", "label", "helperText", "errorText", 
    "leftElement", "rightElement", "containerClass", "class"
  ])

  const baseClasses = "w-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

  const variantClasses = () => {
    switch (local.variant) {
      case "filled":
        return "bg-gray-100 border-transparent rounded-md focus:bg-white focus:border-blue-500 focus:ring-blue-500"
      case "flushed":
        return "bg-transparent border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 focus:ring-0 focus:ring-offset-0 px-0"
      default: // outline
        return "bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
    }
  }

  const sizeClasses = () => {
    switch (local.size) {
      case "sm":
        return "h-8 px-3 text-sm"
      case "lg":
        return "h-12 px-4 text-lg"
      default:
        return "h-10 px-3 text-base"
    }
  }

  const invalidClasses = () => {
    if (!local.invalid) return ""
    switch (local.variant) {
      case "flushed":
        return "border-red-500 focus:border-red-500 focus:ring-red-500"
      default:
        return "border-red-500 focus:border-red-500 focus:ring-red-500"
    }
  }

  const inputClasses = () => {
    let classes = `${baseClasses} ${variantClasses()} ${sizeClasses()} ${local.class || ""}`
    if (local.invalid) {
      classes += ` ${invalidClasses()}`
    }
    if (local.leftElement) {
      classes += " pl-10"
    }
    if (local.rightElement) {
      classes += " pr-10"
    }
    return classes
  }

  const containerClasses = () => {
    return `relative ${local.containerClass || ""}`
  }

  return (
    <div class="w-full">
      {local.label && (
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {local.label}
        </label>
      )}
      
      <div class={containerClasses()}>
        {local.leftElement && (
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {local.leftElement}
          </div>
        )}
        
        <input
          {...others}
          class={inputClasses()}
        />
        
        {local.rightElement && (
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {local.rightElement}
          </div>
        )}
      </div>
      
      {local.errorText && local.invalid && (
        <p class="mt-1 text-sm text-red-600">
          {local.errorText}
        </p>
      )}
      
      {local.helperText && !local.invalid && (
        <p class="mt-1 text-sm text-gray-500">
          {local.helperText}
        </p>
      )}
    </div>
  )
}