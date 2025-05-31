import * as tooltip from "@zag-js/tooltip"
import { normalizeProps, useMachine } from "@zag-js/solid"
import { createMemo, createUniqueId, JSX, Show } from "solid-js"

export interface TooltipProps {
  content: string | JSX.Element
  placement?: "top" | "bottom" | "left" | "right"
  openDelay?: number
  closeDelay?: number
  disabled?: boolean
  children: JSX.Element
}

export function Tooltip(props: TooltipProps) {
  const [state, send] = useMachine(
    tooltip.machine({
      id: createUniqueId(),
      positioning: {
        placement: props.placement || "top"
      },
      openDelay: props.openDelay || 700,
      closeDelay: props.closeDelay || 300,
      disabled: props.disabled
    })
  )

  const api = createMemo(() => tooltip.connect(state, send, normalizeProps))

  return (
    <>
      {props.children}
      
      <Show when={api().open}>
        <div {...api().positionerProps}>
          <div 
            {...api().contentProps} 
            class="z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg max-w-xs"
          >
            {props.content}
          </div>
        </div>
      </Show>
    </>
  )
}