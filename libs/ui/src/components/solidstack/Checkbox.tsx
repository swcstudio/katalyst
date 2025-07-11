import * as checkbox from '@zag-js/checkbox';
import { normalizeProps, useMachine } from '@zag-js/solid';
import { createMemo, createUniqueId, type JSX, Show, splitProps } from 'solid-js';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  id?: string;
  class?: string;
  label?: string | JSX.Element;
  description?: string | JSX.Element;
  onChange?: (checked: boolean) => void;
  children?: JSX.Element;
}

export function Checkbox(props: CheckboxProps) {
  const [local, others] = splitProps(props, [
    'checked',
    'defaultChecked',
    'disabled',
    'invalid',
    'required',
    'name',
    'value',
    'id',
    'class',
    'label',
    'description',
    'onChange',
    'children',
  ]);

  const [state, send] = useMachine(
    checkbox.machine({
      id: local.id || createUniqueId(),
      checked: local.checked ?? local.defaultChecked,
      disabled: local.disabled,
      invalid: local.invalid,
      required: local.required,
      name: local.name,
      value: local.value,
      onCheckedChange: (details) => {
        local.onChange?.(!!details.checked);
      },
    })
  );

  const api = createMemo(() => checkbox.connect(state, send, normalizeProps));

  const containerClasses = () => {
    return `flex items-start gap-3 ${local.class || ''}`;
  };

  const checkboxClasses = () => {
    const base =
      'relative flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    const checked = 'bg-blue-600 border-blue-600 text-white';
    const unchecked = 'border-gray-300 bg-white hover:border-gray-400';
    const disabled = 'opacity-50 cursor-not-allowed';
    const invalid = 'border-red-500';

    let classes = base;
    if (api().isChecked) {
      classes += ` ${checked}`;
    } else {
      classes += ` ${unchecked}`;
    }
    if (api().isDisabled) classes += ` ${disabled}`;
    if (local.invalid) classes += ` ${invalid}`;

    return classes;
  };

  const labelClasses = () => {
    const base = 'text-sm font-medium leading-none select-none cursor-pointer';
    const disabled = 'opacity-50 cursor-not-allowed';

    return api().isDisabled ? `${base} ${disabled}` : base;
  };

  return (
    <div {...others} class={containerClasses()}>
      <label {...api().rootProps}>
        <input {...api().hiddenInputProps} />
        <div {...api().controlProps} class={checkboxClasses()}>
          <Show when={api().isChecked}>
            <svg
              class="h-3 w-3 fill-current"
              viewBox="0 0 12 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.6666 1.5L4.24992 7.91667L1.33325 5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Show>
        </div>
        <Show when={local.label || local.children}>
          <div class="flex flex-col gap-1">
            <span {...api().labelProps} class={labelClasses()}>
              {local.label || local.children}
            </span>
            <Show when={local.description}>
              <span class="text-xs text-gray-500">{local.description}</span>
            </Show>
          </div>
        </Show>
      </label>
    </div>
  );
}
