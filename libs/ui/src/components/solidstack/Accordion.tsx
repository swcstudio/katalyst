import * as accordion from '@zag-js/accordion';
import { normalizeProps, useMachine } from '@zag-js/solid';
import { createMemo, createUniqueId, For, type JSX } from 'solid-js';

export interface AccordionItem {
  title: string;
  content: JSX.Element | string;
  value?: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
  collapsible?: boolean;
  defaultValue?: string[];
  class?: string;
}

export function Accordion(props: AccordionProps) {
  const [state, send] = useMachine(
    accordion.machine({
      id: createUniqueId(),
      multiple: props.multiple,
      collapsible: props.collapsible,
      value: props.defaultValue,
    })
  );

  const api = createMemo(() => accordion.connect(state, send, normalizeProps));

  return (
    <div {...api().rootProps} class={props.class}>
      <For each={props.items}>
        {(item) => {
          const value = item.value || item.title;
          return (
            <div {...api().getItemProps({ value })}>
              <h3>
                <button
                  {...api().getItemTriggerProps({ value })}
                  class="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {item.title}
                  <svg
                    class="h-5 w-5 transform transition-transform duration-200"
                    classList={{ 'rotate-180': api().getItemState({ value }).isOpen }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </h3>
              <div
                {...api().getItemContentProps({ value })}
                class="overflow-hidden transition-all duration-200 ease-in-out"
              >
                <div class="px-4 py-3 text-sm text-gray-700">{item.content}</div>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}
