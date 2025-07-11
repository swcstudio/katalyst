import * as radioGroup from '@zag-js/radio-group';
import { normalizeProps, useMachine } from '@zag-js/solid';
import { createMemo, createUniqueId, For, type JSX, Show, splitProps } from 'solid-js';

export interface RadioOption {
  value: string;
  label: string | JSX.Element;
  description?: string | JSX.Element;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  id?: string;
  class?: string;
  radioClass?: string;
  label?: string | JSX.Element;
  helperText?: string | JSX.Element;
  errorText?: string | JSX.Element;
  onChange?: (value: string) => void;
  onValueChange?: (details: { value: string }) => void;
}

export function RadioGroup(props: RadioGroupProps) {
  const [local, others] = splitProps(props, [
    'options',
    'value',
    'defaultValue',
    'name',
    'disabled',
    'invalid',
    'required',
    'orientation',
    'id',
    'class',
    'radioClass',
    'label',
    'helperText',
    'errorText',
    'onChange',
    'onValueChange',
  ]);

  const [state, send] = useMachine(
    radioGroup.machine({
      id: local.id || createUniqueId(),
      value: local.value || local.defaultValue,
      name: local.name,
      disabled: local.disabled,

      orientation: local.orientation || 'vertical',
      onValueChange: (details) => {
        local.onChange?.(details.value);
        local.onValueChange?.(details);
      },
    })
  );

  const api = createMemo(() => radioGroup.connect(state, send, normalizeProps));

  const containerClasses = () => {
    return `w-full ${local.class || ''}`;
  };

  const groupClasses = () => {
    const orientation = local.orientation || 'vertical';
    const base = 'flex gap-4';
    const orientationClasses = orientation === 'horizontal' ? 'flex-row' : 'flex-col';
    return `${base} ${orientationClasses}`;
  };

  const radioClasses = (option: RadioOption) => {
    const base = 'flex items-start gap-3';
    const disabled = 'opacity-50 cursor-not-allowed';

    let classes = base;
    if (option.disabled || local.disabled) {
      classes += ` ${disabled}`;
    }

    return `${classes} ${local.radioClass || ''}`;
  };

  const radioButtonClasses = (option: RadioOption) => {
    const base =
      'relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    const checked = 'border-blue-600 bg-blue-600';
    const unchecked = 'border-gray-300 bg-white hover:border-gray-400';
    const disabled = 'opacity-50 cursor-not-allowed';
    const invalid = 'border-red-500';

    let classes = base;

    if (api().value === option.value) {
      classes += ` ${checked}`;
    } else {
      classes += ` ${unchecked}`;
    }

    if (option.disabled || local.disabled) {
      classes += ` ${disabled}`;
    }

    if (local.invalid) {
      classes += ` ${invalid}`;
    }

    return classes;
  };

  const labelClasses = (option: RadioOption) => {
    const base = 'text-sm font-medium leading-none select-none cursor-pointer';
    const disabled = 'opacity-50 cursor-not-allowed';

    return option.disabled || local.disabled ? `${base} ${disabled}` : base;
  };

  const groupLabelClasses = () => {
    const base = 'block text-sm font-medium text-gray-700 mb-3';
    const disabled = 'opacity-50';

    return local.disabled ? `${base} ${disabled}` : base;
  };

  return (
    <div {...others} class={containerClasses()}>
      <Show when={local.label}>
        <div {...api().labelProps} class={groupLabelClasses()}>
          {local.label}
        </div>
      </Show>

      <div {...api().rootProps} class={groupClasses()}>
        <For each={local.options}>
          {(option) => (
            <label {...api().getItemProps({ value: option.value })} class={radioClasses(option)}>
              <input {...api().getItemHiddenInputProps({ value: option.value })} />
              <div
                {...api().getItemControlProps({ value: option.value })}
                class={radioButtonClasses(option)}
              >
                <Show when={api().value === option.value}>
                  <div class="h-2 w-2 rounded-full bg-white" />
                </Show>
              </div>

              <div class="flex flex-col gap-1">
                <span
                  {...api().getItemTextProps({ value: option.value })}
                  class={labelClasses(option)}
                >
                  {option.label}
                </span>
                <Show when={option.description}>
                  <span class="text-xs text-gray-500">{option.description}</span>
                </Show>
              </div>
            </label>
          )}
        </For>
      </div>

      <Show when={local.errorText && local.invalid}>
        <p class="mt-2 text-sm text-red-600">{local.errorText}</p>
      </Show>

      <Show when={local.helperText && !local.invalid}>
        <p class="mt-2 text-sm text-gray-500">{local.helperText}</p>
      </Show>
    </div>
  );
}
