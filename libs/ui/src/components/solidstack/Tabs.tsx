import { normalizeProps, useMachine } from '@zag-js/solid';
import * as tabs from '@zag-js/tabs';
import { createMemo, createUniqueId, For, type JSX, Show, splitProps } from 'solid-js';

export interface TabItem {
  value: string;
  label: string | JSX.Element;
  content: JSX.Element;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  disabled?: boolean;
  id?: string;
  class?: string;
  listClass?: string;
  tabClass?: string;
  panelClass?: string;
  onValueChange?: (details: { value: string }) => void;
}

export function Tabs(props: TabsProps) {
  const [local, others] = splitProps(props, [
    'items',
    'defaultValue',
    'value',
    'orientation',
    'activationMode',
    'disabled',
    'id',
    'class',
    'listClass',
    'tabClass',
    'panelClass',
    'onValueChange',
  ]);

  const [state, send] = useMachine(
    tabs.machine({
      id: local.id || createUniqueId(),
      value: local.value || local.defaultValue || local.items[0]?.value,
      orientation: local.orientation || 'horizontal',
      activationMode: local.activationMode || 'automatic',

      onValueChange: (details) => {
        local.onValueChange?.(details);
      },
    })
  );

  const api = createMemo(() => tabs.connect(state, send, normalizeProps));

  const containerClasses = () => {
    const orientation = local.orientation || 'horizontal';
    const base = 'w-full';
    const orientationClasses = orientation === 'vertical' ? 'flex gap-4' : '';
    return `${base} ${orientationClasses} ${local.class || ''}`;
  };

  const listClasses = () => {
    const orientation = local.orientation || 'horizontal';
    const base = 'flex border-b border-gray-200';
    const orientationClasses =
      orientation === 'vertical'
        ? 'flex-col border-b-0 border-r border-gray-200 w-48'
        : 'space-x-1';
    return `${base} ${orientationClasses} ${local.listClass || ''}`;
  };

  const tabClasses = (item: TabItem) => {
    const base =
      'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    const active = 'text-blue-600 border-b-2 border-blue-600 bg-blue-50';
    const inactive = 'text-gray-500 hover:text-gray-700 hover:bg-gray-50';
    const disabled = 'opacity-50 cursor-not-allowed';
    const vertical =
      local.orientation === 'vertical' ? 'rounded-l-lg rounded-t-none border-b-0 border-r-2' : '';

    let classes = `${base} ${vertical}`;

    if (api().value === item.value) {
      classes += ` ${active}`;
    } else {
      classes += ` ${inactive}`;
    }

    if (item.disabled || local.disabled) {
      classes += ` ${disabled}`;
    }

    return `${classes} ${local.tabClass || ''}`;
  };

  const panelClasses = () => {
    const base = 'mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    const vertical = local.orientation === 'vertical' ? 'mt-0 flex-1' : '';
    return `${base} ${vertical} ${local.panelClass || ''}`;
  };

  const contentClasses = () => {
    return 'p-4 text-gray-900';
  };

  return (
    <div {...others} class={containerClasses()}>
      <div {...api().rootProps}>
        <div {...api().tablistProps} class={listClasses()}>
          <For each={local.items}>
            {(item) => (
              <button
                {...api().getTriggerProps({ value: item.value })}
                class={tabClasses(item)}
                disabled={item.disabled}
              >
                {item.label}
              </button>
            )}
          </For>
        </div>

        <For each={local.items}>
          {(item) => (
            <Show when={api().value === item.value}>
              <div {...api().getContentProps({ value: item.value })} class={panelClasses()}>
                <div class={contentClasses()}>{item.content}</div>
              </div>
            </Show>
          )}
        </For>
      </div>
    </div>
  );
}
