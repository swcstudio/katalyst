import { Component, JSX, mergeProps, createSignal, onMount, onCleanup, createEffect } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

export interface NumberTickerProps {
  class?: string;
  style?: JSX.CSSProperties;
  value: number;
  startValue?: number;
  decimalPlaces?: number;
  duration?: number;
  delay?: number;
  direction?: 'up' | 'down';
  onComplete?: () => void;
}

export const NumberTicker: Component<NumberTickerProps> = (props) => {
  const merged = mergeProps(
    {
      startValue: 0,
      decimalPlaces: 0,
      duration: 2000,
      delay: 0,
      direction: 'up' as const,
    },
    props
  );

  const [displayValue, setDisplayValue] = createSignal(merged.startValue);
  const [isAnimating, setIsAnimating] = createSignal(false);
  let animationId: number;
  let timeoutId: number;

  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  const formatNumber = (num: number): string => {
    return num.toFixed(merged.decimalPlaces);
  };

  const animate = () => {
    const startTime = Date.now();
    const startVal = merged.startValue;
    const endVal = merged.value;
    const difference = endVal - startVal;

    setIsAnimating(true);

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / merged.duration, 1);
      const easedProgress = easeOutCubic(progress);
      
      const currentValue = startVal + (difference * easedProgress);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationId = requestAnimationFrame(tick);
      } else {
        setDisplayValue(endVal);
        setIsAnimating(false);
        if (merged.onComplete) {
          merged.onComplete();
        }
      }
    };

    animationId = requestAnimationFrame(tick);
  };

  const startAnimation = () => {
    if (merged.delay > 0) {
      timeoutId = setTimeout(animate, merged.delay);
    } else {
      animate();
    }
  };

  onMount(() => {
    startAnimation();
  });

  onCleanup(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  createEffect(() => {
    // Restart animation if value changes
    if (!isAnimating()) {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      startAnimation();
    }
  });

  return (
    <span
      class={css({
        fontVariantNumeric: 'tabular-nums',
        fontFeatureSettings: '"tnum"',
      }, merged.class)}
      style={merged.style}
    >
      {formatNumber(displayValue())}
    </span>
  );
};

export interface NumberTickerDemoProps {
  class?: string;
}

export const NumberTickerDemo: Component<NumberTickerDemoProps> = (props) => {
  return (
    <NumberTicker
      value={100}
      class={css({
        whiteSpace: 'pre-wrap',
        fontSize: '4rem',
        fontWeight: 'medium',
        letterSpacing: '-0.025em',
        color: 'foreground',
      }, props.class)}
    />
  );
};

export const NumberTickerDecimalDemo: Component<NumberTickerDemoProps> = (props) => {
  return (
    <NumberTicker
      value={5.67}
      decimalPlaces={2}
      class={css({
        whiteSpace: 'pre-wrap',
        fontSize: '4rem',
        fontWeight: 'medium',
        letterSpacing: '-0.025em',
        color: 'foreground',
      }, props.class)}
    />
  );
};

export const NumberTickerStartValueDemo: Component<NumberTickerDemoProps> = (props) => {
  return (
    <NumberTicker
      value={100}
      startValue={80}
      class={css({
        whiteSpace: 'pre-wrap',
        fontSize: '4rem',
        fontWeight: 'medium',
        letterSpacing: '-0.025em',
        color: 'foreground',
      }, props.class)}
    />
  );
};

export type { NumberTickerProps, NumberTickerDemoProps };