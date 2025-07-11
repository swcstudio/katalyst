import { createVirtualizer } from '@tanstack/solid-virtual';
import { createSignal, For } from 'solid-js';
import { css } from '../styled-system/css';

interface Item {
  id: number;
  text: string;
}

const generateItems = (count: number): Item[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    text: `Item ${i + 1}`,
  }));
};

export default function TanstackVirtual() {
  const [items] = createSignal(generateItems(10000));
  const [parentRef, setParentRef] = createSignal<HTMLDivElement | null>(null);

  const virtualizer = createVirtualizer({
    count: items().length,
    getScrollElement: () => parentRef(),
    estimateSize: () => 40,
    overscan: 5,
  });

  return (
    <div
      class={css({ padding: '4', borderRadius: 'md', bg: 'gray.50', _dark: { bg: 'gray.800' } })}
    >
      <h2 class={css({ fontSize: '2xl', fontWeight: 'bold', mb: '4', color: 'emerald.500' })}>
        Tanstack Virtual Example
      </h2>
      <p class={css({ mb: '4' })}>
        Efficiently rendering {items().length.toLocaleString()} items with virtualization
      </p>

      <div
        ref={setParentRef}
        class={css({
          height: '400px',
          overflow: 'auto',
          border: '1px solid',
          borderColor: 'gray.200',
          _dark: { borderColor: 'gray.700' },
          borderRadius: 'md',
        })}
      >
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
          <For each={virtualizer.getVirtualItems()}>
            {(virtualItem) => {
              const item = items()[virtualItem.index];
              return (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  class={css({
                    padding: '3',
                    borderBottom: '1px solid',
                    borderColor: 'gray.200',
                    _dark: { borderColor: 'gray.700' },
                    _hover: { bg: 'gray.100', _dark: { bg: 'gray.700' } },
                  })}
                >
                  {item.text}
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
