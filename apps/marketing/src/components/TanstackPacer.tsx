import { createSignal, onCleanup } from 'solid-js';

interface PacerOptions {
  fps: number;
  onUpdate: () => void;
}

interface Pacer {
  start: () => void;
  stop: () => void;
}

function createPacer(options: PacerOptions): Pacer {
  let intervalId: number | null = null;

  const start = () => {
    if (intervalId === null) {
      const interval = Math.floor(1000 / options.fps);
      intervalId = setInterval(options.onUpdate, interval) as unknown as number;
    }
  };

  const stop = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  return { start, stop };
}

import { css } from '../styled-system/css';

export default function TanstackPacer() {
  const [count, setCount] = createSignal(0);
  const [isRunning, setIsRunning] = createSignal(false);
  const [pacerRate, setPacerRate] = createSignal(1000); // 1 second default

  const pacer = createPacer({
    fps: 60, // Update at 60fps for smooth animation
    onUpdate: () => {
      if (isRunning()) {
        setCount((prev) => prev + 1);
      }
    },
  });

  const toggleCounter = () => {
    if (isRunning()) {
      pacer.stop();
    } else {
      pacer.start();
    }
    setIsRunning(!isRunning());
  };

  const resetCounter = () => {
    setCount(0);
  };

  const handleRateChange = (e: Event) => {
    const value = Number.parseInt((e.target as HTMLInputElement).value);
    setPacerRate(value);

    if (isRunning()) {
      pacer.stop();
      pacer.start();
    }
  };

  onCleanup(() => {
    pacer.stop();
  });

  return (
    <div
      class={css({ padding: '4', borderRadius: 'md', bg: 'gray.50', _dark: { bg: 'gray.800' } })}
    >
      <h2 class={css({ fontSize: '2xl', fontWeight: 'bold', mb: '4', color: 'emerald.500' })}>
        Tanstack Pacer Example
      </h2>

      <div class={css({ mb: '6', textAlign: 'center' })}>
        <div
          class={css({
            fontSize: '6xl',
            fontWeight: 'bold',
            mb: '4',
            color: isRunning() ? 'emerald.500' : 'gray.500',
          })}
        >
          {count()}
        </div>

        <div class={css({ mb: '4' })}>
          <button
            type="button"
            onClick={toggleCounter}
            class={css({
              bg: isRunning() ? 'red.500' : 'emerald.500',
              color: 'white',
              px: '4',
              py: '2',
              borderRadius: 'md',
              fontWeight: 'medium',
              mr: '2',
              _hover: { bg: isRunning() ? 'red.600' : 'emerald.600' },
            })}
          >
            {isRunning() ? 'Stop' : 'Start'}
          </button>

          <button
            type="button"
            onClick={resetCounter}
            class={css({
              bg: 'gray.200',
              _dark: { bg: 'gray.700' },
              px: '4',
              py: '2',
              borderRadius: 'md',
              fontWeight: 'medium',
              _hover: { bg: 'gray.300', _dark: { bg: 'gray.600' } },
            })}
          >
            Reset
          </button>
        </div>
      </div>

      <div class={css({ maxWidth: '400px', mx: 'auto' })}>
        <label for="pacer-rate" class={css({ display: 'block', mb: '2', fontWeight: 'medium' })}>
          Update Rate: {pacerRate()}ms
        </label>
        <input
          id="pacer-rate"
          type="range"
          min="100"
          max="2000"
          step="100"
          value={pacerRate()}
          onInput={handleRateChange}
          class={css({
            width: '100%',
            accentColor: 'emerald.500',
          })}
        />
        <div
          class={css({ display: 'flex', justifyContent: 'space-between', mt: '1', fontSize: 'sm' })}
        >
          <span>Fast (100ms)</span>
          <span>Slow (2000ms)</span>
        </div>
      </div>

      <div
        class={css({
          mt: '6',
          p: '3',
          bg: 'gray.100',
          _dark: { bg: 'gray.700' },
          borderRadius: 'md',
        })}
      >
        <p class={css({ fontSize: 'sm' })}>
          Tanstack Pacer provides a high-performance, frame-rate-independent timer for animations
          and time-based updates. It's perfect for creating smooth animations, game loops, or any
          time-based functionality in your application.
        </p>
      </div>
    </div>
  );
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
