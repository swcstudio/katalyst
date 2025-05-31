import * as toast from "@zag-js/toast"
import { normalizeProps, useMachine } from "@zag-js/solid"
import { createMemo, createUniqueId, For, JSX, splitProps, Show } from "solid-js"

export interface ToastData {
  id?: string
  title?: string | JSX.Element
  description?: string | JSX.Element
  type?: "success" | "error" | "warning" | "info"
  duration?: number
  closable?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ToastProps {
  placement?: "top-start" | "top" | "top-end" | "bottom-start" | "bottom" | "bottom-end"
  gutter?: number
  hotkey?: string[]
  pauseOnPageIdle?: boolean
  pauseOnInteraction?: boolean
  class?: string
  max?: number
}

export interface SingleToastProps {
  toast: ToastData & { id: string }
  onClose?: (id: string) => void
  class?: string
}

export function SingleToast(props: SingleToastProps) {
  const [local, others] = splitProps(props, ["toast", "onClose", "class"])

  const service = useMachine(
    toast.machine({
      id: local.toast.id,
      type: local.toast.type || "info",
      duration: local.toast.duration || 5000,
      onClose: () => {
        local.onClose?.(local.toast.id)
      }
    })
  )

  const api = createMemo(() => toast.connect(service, normalizeProps))

  const getTypeClasses = () => {
    switch (local.toast.type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      default:
        return "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  const getTypeIcon = () => {
    switch (local.toast.type) {
      case "success":
        return (
          <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        )
      case "error":
        return (
          <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        )
      case "warning":
        return (
          <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg class="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        )
    }
  }

  const toastClasses = () => {
    return `relative flex items-start p-4 rounded-lg border shadow-lg transition-all duration-300 ${getTypeClasses()} ${local.class || ""}`
  }

  return (
    <div {...api().getRootProps()} {...others} class={toastClasses()}>
      <div class="flex-shrink-0 mr-3">
        {getTypeIcon()}
      </div>
      
      <div class="flex-1 min-w-0">
        {local.toast.title && (
          <h4 {...api().getTitleProps()} class="text-sm font-medium mb-1">
            {local.toast.title}
          </h4>
        )}
        
        {local.toast.description && (
          <p {...api().getDescriptionProps()} class="text-sm opacity-90">
            {local.toast.description}
          </p>
        )}
        
        {local.toast.action && (
          <div class="mt-2">
            <button
              onClick={local.toast.action.onClick}
              class="text-sm font-medium underline hover:no-underline focus:outline-none"
            >
              {local.toast.action.label}
            </button>
          </div>
        )}
      </div>
      
      {local.toast.closable !== false && (
        <div class="flex-shrink-0 ml-4">
          <button
            {...api().getCloseTriggerProps()}
            class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-black hover:bg-opacity-10"
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export function ToastGroup(props: ToastProps) {
  const [local, others] = splitProps(props, [
    "placement", "gutter", "hotkey", "pauseOnPageIdle", "pauseOnInteraction", "class", "max"
  ])

  const service = useMachine(
    toast.group.machine({
      id: createUniqueId(),
      placement: local.placement || "bottom-end",
      gutter: local.gutter || 8,
      hotkey: local.hotkey,
      pauseOnPageIdle: local.pauseOnPageIdle ?? true,
      pauseOnInteraction: local.pauseOnInteraction ?? true,
      max: local.max || 5
    })
  )

  const api = createMemo(() => toast.group.connect(service, normalizeProps))

  const getPlacementClasses = () => {
    const placement = local.placement || "bottom-end"
    const positions = {
      "top-start": "top-0 left-0",
      "top": "top-0 left-1/2 -translate-x-1/2",
      "top-end": "top-0 right-0",
      "bottom-start": "bottom-0 left-0",
      "bottom": "bottom-0 left-1/2 -translate-x-1/2",
      "bottom-end": "bottom-0 right-0"
    }
    return positions[placement] || positions["bottom-end"]
  }

  const groupClasses = () => {
    return `fixed z-50 p-4 space-y-2 pointer-events-none ${getPlacementClasses()} ${local.class || ""}`
  }

  return (
    <div {...api().getGroupProps()} {...others} class={groupClasses()}>
      <For each={api().toasts}>
        {(toastData) => (
          <div class="pointer-events-auto">
            <SingleToast
              toast={toastData as ToastData & { id: string }}
              onClose={(id) => api().dismiss({ id })}
            />
          </div>
        )}
      </For>
    </div>
  )
}

// Export convenience functions for creating toasts
export const createToastService = () => {
  const service = useMachine(
    toast.group.machine({
      id: createUniqueId(),
      placement: "bottom-end"
    })
  )

  const api = createMemo(() => toast.group.connect(service, normalizeProps))

  return {
    api,
    success: (data: Omit<ToastData, "type">) => api().create({ ...data, type: "success" }),
    error: (data: Omit<ToastData, "type">) => api().create({ ...data, type: "error" }),
    warning: (data: Omit<ToastData, "type">) => api().create({ ...data, type: "warning" }),
    info: (data: Omit<ToastData, "type">) => api().create({ ...data, type: "info" }),
    dismiss: (id: string) => api().dismiss({ id }),
    dismissAll: () => api().dismissAll()
  }
}

export { ToastGroup as Toast }