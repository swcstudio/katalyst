import { normalizeProps, useMachine } from '@zag-js/solid';
import * as switchMachine from '@zag-js/switch';
import { type JSX, Show, createMemo, createUniqueId, splitProps } from 'solid-js';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  id?: string;
  class?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'accent';
  label?: string | JSX.Element;
  description?: string | JSX.Element;
  labelPlacement?: 'start' | 'end';
  onChange?: (checked: boolean) => void;
  children?: JSX.Element;
}

export function Switch(props: SwitchProps) {
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
    'size',
    'variant',
    'label',
    'description',
    'labelPlacement',
    'onChange',
    'children',
  ]);

  const [state, send] = useMachine(
    switchMachine.machine({
      id: local.id || createUniqueId(),
      checked: local.checked ?? local.defaultChecked,
      disabled: local.disabled,
      invalid: local.invalid,
      required: local.required,
      name: local.name,
      value: local.value,
      onCheckedChange: (details) => {
        local.onChange?.(details.checked);
      },
    })
  );

  const api = createMemo(() => switchMachine.connect(state, send, normalizeProps));

  const containerClasses = () => {
    const placement = local.labelPlacement || 'end';
    const base = 'flex items-center gap-3';
    return placement === 'start' ? `${base} flex-row-reverse` : `${base} ${local.class || ''}`;
  };

  const switchClasses = () => {
    const size = local.size || 'md';
    const variant = local.variant || 'default';

    const sizeClasses = {
      sm: 'h-4 w-7',
      md: 'h-5 w-9',
      lg: 'h-6 w-11',
    };

    const base = `relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${sizeClasses[size]}`;

    let stateClasses = '';
    if (api().isDisabled) {
      stateClasses = 'opacity-50 cursor-not-allowed';
    } else if (api().isChecked) {
      if (variant === 'accent') {
        stateClasses = 'bg-purple-600 focus:ring-purple-500';
      } else {
        stateClasses = 'bg-blue-600 focus:ring-blue-500';
      }
    } else {
      stateClasses = 'bg-gray-200 focus:ring-blue-500';
    }

    if (local.invalid) {
      stateClasses += ' ring-2 ring-red-500';
    }

    return `${base} ${stateClasses}`;
  };

  const thumbClasses = () => {
    const size = local.size || 'md';

    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    const translateClasses = {
      sm: api().isChecked ? 'translate-x-3' : 'translate-x-0',
      md: api().isChecked ? 'translate-x-4' : 'translate-x-0',
      lg: api().isChecked ? 'translate-x-5' : 'translate-x-0',
    };

    const base = `pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${sizeClasses[size]}`;

    return `${base} ${translateClasses[size]}`;
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
        <span {...api().controlProps} class={switchClasses()}>
          <span class={thumbClasses()} />
        </span>
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
