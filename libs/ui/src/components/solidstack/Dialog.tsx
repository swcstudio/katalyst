import * as dialog from '@zag-js/dialog';
import { normalizeProps, useMachine } from '@zag-js/solid';
import { type JSX, Show, createMemo, createUniqueId, splitProps } from 'solid-js';

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  closeOnInteractOutside?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
  restoreFocus?: boolean;
  id?: string;
  class?: string;
  overlayClass?: string;
  contentClass?: string;
  title?: string | JSX.Element;
  description?: string | JSX.Element;
  children?: JSX.Element;
  trigger?: JSX.Element;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

export function Dialog(props: DialogProps) {
  const [local, others] = splitProps(props, [
    'open',
    'defaultOpen',
    'modal',
    'closeOnInteractOutside',
    'closeOnEscape',
    'preventScroll',
    'restoreFocus',
    'id',
    'class',
    'overlayClass',
    'contentClass',
    'title',
    'description',
    'children',
    'trigger',
    'onOpenChange',
    'onClose',
  ]);

  const service = useMachine(
    dialog.machine({
      id: local.id || createUniqueId(),
      open: local.open,
      modal: local.modal ?? true,
      closeOnInteractOutside: local.closeOnInteractOutside ?? true,
      closeOnEscape: local.closeOnEscape ?? true,
      preventScroll: local.preventScroll ?? true,
      restoreFocus: local.restoreFocus ?? true,
      onOpenChange: (details) => {
        local.onOpenChange?.(details.open);
        if (!details.open) {
          local.onClose?.();
        }
      },
    })
  );

  const api = createMemo(() => dialog.connect(service, normalizeProps));

  const overlayClasses = () => {
    return `fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity ${local.overlayClass || ''}`;
  };

  const contentClasses = () => {
    return `fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg transition-all ${local.contentClass || ''}`;
  };

  return (
    <>
      {local.trigger && <button {...api().getTriggerProps()}>{local.trigger}</button>}

      <Show when={api().open}>
        <div {...others}>
          <div {...api().getBackdropProps()} class={overlayClasses()} />
          <div {...api().getPositionerProps()}>
            <div {...api().getContentProps()} class={contentClasses()}>
              <div class="flex items-center justify-between mb-4">
                {local.title && (
                  <h2 {...api().getTitleProps()} class="text-lg font-semibold text-gray-900">
                    {local.title}
                  </h2>
                )}
                <button
                  {...api().getCloseTriggerProps()}
                  class="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {local.description && (
                <p {...api().getDescriptionProps()} class="text-sm text-gray-600 mb-4">
                  {local.description}
                </p>
              )}

              <div class={local.class}>{local.children}</div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}
