import * as select from '@zag-js/select';
import { normalizeProps, useMachine } from '@zag-js/solid';
import { createMemo, createUniqueId, For, type JSX, splitProps } from 'solid-js';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  class?: string;
  label?: string | JSX.Element;
  helperText?: string | JSX.Element;
  errorText?: string | JSX.Element;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled';
  onChange?: (value: string) => void;
  onValueChange?: (details: { value: string; label: string }) => void;
}

export function Select(props: SelectProps) {
  const [local, others] = splitProps(props, [
    'options',
    'value',
    'defaultValue',
    'placeholder',
    'disabled',
    'invalid',
    'required',
    'name',
    'id',
    'class',
    'label',
    'helperText',
    'errorText',
    'size',
    'variant',
    'onChange',
    'onValueChange',
  ]);

  const service = useMachine(
    select.machine({
      id: local.id || createUniqueId(),
      value: local.value ? [local.value] : local.defaultValue ? [local.defaultValue] : [],
      disabled: local.disabled,
      required: local.required,
      name: local.name,
      placeholder: local.placeholder,
      onValueChange: (details) => {
        const selectedValue = details.value[0];
        const selectedOption = local.options.find((opt) => opt.value === selectedValue);
        local.onChange?.(selectedValue);
        if (selectedOption) {
          local.onValueChange?.({ value: selectedValue, label: selectedOption.label });
        }
      },
    })
  );

  const api = createMemo(() => select.connect(service, normalizeProps));

  const baseClasses =
    'relative w-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  const variantClasses = () => {
    switch (local.variant) {
      case 'filled':
        return 'bg-gray-100 border-transparent rounded-md focus:bg-white focus:border-blue-500 focus:ring-blue-500';
      default: // outline
        return 'bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500';
    }
  };

  const sizeClasses = () => {
    switch (local.size) {
      case 'sm':
        return 'h-8 px-3 text-sm';
      case 'lg':
        return 'h-12 px-4 text-lg';
      default:
        return 'h-10 px-3 text-base';
    }
  };

  const invalidClasses = () => {
    return local.invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
  };

  const triggerClasses = () => {
    return `${baseClasses} ${variantClasses()} ${sizeClasses()} ${invalidClasses()} ${local.class || ''} flex items-center justify-between cursor-pointer`;
  };

  const contentClasses = () => {
    return 'absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto';
  };

  const optionClasses = (option: SelectOption) => {
    const base = 'relative cursor-pointer select-none py-2 px-3 text-sm';
    const highlighted = 'bg-blue-100 text-blue-900';
    const selected = 'bg-blue-600 text-white';
    const disabled = 'opacity-50 cursor-not-allowed';

    let classes = base;
    if (option.disabled) {
      classes += ` ${disabled}`;
    } else {
      if (api().isOptionSelected({ value: option.value })) {
        classes += ` ${selected}`;
      } else if (api().getOptionState({ value: option.value }).highlighted) {
        classes += ` ${highlighted}`;
      } else {
        classes += ' text-gray-900 hover:bg-gray-100';
      }
    }

    return classes;
  };

  return (
    <div {...others} class="w-full">
      {local.label && (
        <label {...api().getLabelProps()} class="block text-sm font-medium text-gray-700 mb-1">
          {local.label}
        </label>
      )}

      <div {...api().getRootProps()}>
        <div {...api().getControlProps()}>
          <button {...api().getTriggerProps()} class={triggerClasses()}>
            <span {...api().getValueTextProps()} class="block truncate">
              {api().valueAsString || local.placeholder || 'Select an option'}
            </span>
            <svg
              class="h-5 w-5 text-gray-400 transition-transform"
              classList={{ 'rotate-180': api().open }}
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
        </div>

        <div {...api().getPositionerProps()}>
          {api().open && (
            <div {...api().getContentProps()} class={contentClasses()}>
              <For each={local.options}>
                {(option) => (
                  <div
                    {...api().getOptionProps({
                      label: option.label,
                      value: option.value,
                      disabled: option.disabled,
                    })}
                    class={optionClasses(option)}
                  >
                    <span class="block truncate">{option.label}</span>
                    {api().isOptionSelected({ value: option.value }) && (
                      <span class="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                )}
              </For>
            </div>
          )}
        </div>
      </div>

      {local.errorText && local.invalid && (
        <p class="mt-1 text-sm text-red-600">{local.errorText}</p>
      )}

      {local.helperText && !local.invalid && (
        <p class="mt-1 text-sm text-gray-500">{local.helperText}</p>
      )}
    </div>
  );
}
