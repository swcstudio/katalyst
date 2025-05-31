import * as numberInput from "@zag-js/number-input"
import { normalizeProps, useMachine } from "@zag-js/solid"
import { createMemo, createUniqueId, JSX, splitProps, Show } from "solid-js"

export interface NumberInputProps {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  precision?: number
  disabled?: boolean
  invalid?: boolean
  required?: boolean
  readOnly?: boolean
  name?: string
  id?: string
  placeholder?: string
  label?: string | JSX.Element
  helperText?: string | JSX.Element
  errorText?: string | JSX.Element
  class?: string
  inputClass?: string
  size?: "sm" | "md" | "lg"
  variant?: "outline" | "filled"
  allowMouseWheel?: boolean
  clampValueOnBlur?: boolean
  onChange?: (value: number) => void
  onValueChange?: (details: { value: number; valueAsString: string }) => void
}

export function NumberInput(props: NumberInputProps) {
  const [local, others] = splitProps(props, [
    "value", "defaultValue", "min", "max", "step", "precision", "disabled", 
    "invalid", "required", "readOnly", "name", "id", "placeholder", "label", 
    "helperText", "errorText", "class", "inputClass", "size", "variant",
    "allowMouseWheel", "clampValueOnBlur", "onChange", "onValueChange"
  ])

  const [state, send] = useMachine(
    numberInput.machine({
      id: local.id || createUniqueId(),
      value: local.value?.toString() || local.defaultValue?.toString(),
      min: local.min,
      max: local.max,
      step: local.step || 1,

      disabled: local.disabled,
      invalid: local.invalid,

      readOnly: local.readOnly,
      name: local.name,
      allowMouseWheel: local.allowMouseWheel ?? true,
      clampValueOnBlur: local.clampValueOnBlur ?? true,
      onValueChange: (details) => {
        const numValue = parseFloat(details.value)
        if (!isNaN(numValue)) {
          local.onChange?.(numValue)
        }
        local.onValueChange?.({
          value: numValue,
          valueAsString: details.value
        })
      }
    })
  )

  const api = createMemo(() => numberInput.connect(state, send, normalizeProps))

  const containerClasses = () => {
    return `w-full ${local.class || ""}`
  }

  const controlClasses = () => {
    const size = local.size || "md"
    const variant = local.variant || "outline"
    
    const sizeClasses = {
      sm: "h-8",
      md: "h-10",
      lg: "h-12"
    }
    
    const variantClasses = {
      outline: "border border-gray-300 rounded-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500",
      filled: "bg-gray-100 border border-transparent rounded-md focus-within:bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
    }
    
    let classes = `flex ${sizeClasses[size]} ${variantClasses[variant]}`
    
    if (local.disabled) {
      classes += " opacity-50 cursor-not-allowed"
    }
    
    if (local.invalid) {
      classes += " border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
    }
    
    return classes
  }

  const inputClasses = () => {
    const size = local.size || "md"
    
    const sizeClasses = {
      sm: "px-2 text-sm",
      md: "px-3 text-base",
      lg: "px-4 text-lg"
    }
    
    return `flex-1 bg-transparent border-0 outline-none ${sizeClasses[size]} ${local.inputClass || ""}`
  }

  const buttonClasses = () => {
    const size = local.size || "md"
    
    const sizeClasses = {
      sm: "w-6 text-xs",
      md: "w-8 text-sm",
      lg: "w-10 text-base"
    }
    
    return `flex items-center justify-center border-0 bg-transparent hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${sizeClasses[size]}`
  }

  const labelClasses = () => {
    const base = "block text-sm font-medium text-gray-700 mb-1"
    const disabled = "opacity-50"
    
    return local.disabled ? `${base} ${disabled}` : base
  }

  return (
    <div {...others} class={containerClasses()}>
      <Show when={local.label}>
        <label {...api().labelProps} class={labelClasses()}>
          {local.label}
        </label>
      </Show>
      
      <div {...api().rootProps}>
        <div {...api().controlProps} class={controlClasses()}>
          <button 
            {...api().decrementTriggerProps} 
            class={buttonClasses()}
            type="button"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M20 12H4" />
            </svg>
          </button>
          
          <input 
            {...api().inputProps} 
            class={inputClasses()}
          />
          
          <button 
            {...api().incrementTriggerProps} 
            class={buttonClasses()}
            type="button"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      
      <Show when={local.errorText && local.invalid}>
        <p class="mt-1 text-sm text-red-600">
          {local.errorText}
        </p>
      </Show>
      
      <Show when={local.helperText && !local.invalid}>
        <p class="mt-1 text-sm text-gray-500">
          {local.helperText}
        </p>
      </Show>
    </div>
  )
}