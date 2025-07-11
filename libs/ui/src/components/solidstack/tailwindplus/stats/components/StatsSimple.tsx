import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  type JSX,
  mergeProps,
  onCleanup,
  onMount,
  Show,
} from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { BlurFade } from '../../../magicui/BlurFade';
import { NumberTicker } from '../../../magicui/NumberTicker';
import { type StatItem, useStatsSection } from '../state/useStatsSection';

export interface StatsSimpleProps {
  className?: string;
  style?: JSX.CSSProperties;
  title?: string;
  subtitle?: string;
  stats: StatItem[];
  theme?: 'light' | 'dark';
  variant?: 'basic' | 'centered' | 'description';
  animated?: boolean;
  countersEnabled?: boolean;
  staggerDelay?: number;
  animationDuration?: number;
  onStatSelect?: (stat: StatItem) => void;
}

export const StatsSimple: Component<StatsSimpleProps> = (props) => {
  const merged = mergeProps(
    {
      theme: 'light' as const,
      variant: 'basic' as const,
      animated: true,
      countersEnabled: true,
      staggerDelay: 150,
      animationDuration: 2000,
    },
    props
  );

  const [containerRef, setContainerRef] = createSignal<HTMLElement>();
  const [isIntersecting, setIsIntersecting] = createSignal(false);

  const statsSection = useStatsSection({
    statsData: {
      id: 'stats-simple',
      title: merged.title,
      subtitle: merged.subtitle,
      stats: merged.stats,
      layout: 'grid',
      theme: merged.theme,
    },
    theme: merged.theme,
    variant: merged.variant,
    animationDuration: merged.animationDuration,
    staggerDelay: merged.staggerDelay,
    countersEnabled: merged.countersEnabled,
    onStatSelect: (statId) => {
      const stat = merged.stats.find((s) => s.id === statId);
      if (stat && merged.onStatSelect) {
        merged.onStatSelect(stat);
      }
    },
  });

  onMount(() => {
    const container = containerRef();
    if (!container || !merged.animated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isIntersecting()) {
            setIsIntersecting(true);
            statsSection.setVisibility(true);
            statsSection.startAnimation();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    onCleanup(() => {
      observer.disconnect();
    });
  });

  const containerClasses = createMemo(() => {
    const baseClasses = css({
      py: '24',
      sm: { py: '32' },
    });

    const themeClasses =
      merged.theme === 'dark'
        ? css({ bg: 'gray.900', color: 'white' })
        : css({ bg: 'white', color: 'gray.900' });

    return `${baseClasses} ${themeClasses} ${merged.className || ''}`;
  });

  const gridClasses = createMemo(() => {
    const baseGrid = css({
      display: 'grid',
      gap: '8',
      gridTemplateColumns: '1',
      textAlign: 'center',
      lg: { gridTemplateColumns: '3' },
    });

    if (merged.variant === 'centered') {
      return css({
        display: 'grid',
        gap: '16',
        gridTemplateColumns: '1',
        textAlign: 'center',
        lg: { gridTemplateColumns: '3' },
      });
    }

    return baseGrid;
  });

  const StatItem: Component<{ stat: StatItem; index: number }> = (itemProps) => {
    const itemClasses = createMemo(() => {
      const baseClasses = css({
        mx: 'auto',
        display: 'flex',
        maxW: 'xs',
        flexDirection: 'column',
        gap: '4',
      });

      if (merged.variant === 'description') {
        return css({
          mx: 'auto',
          display: 'flex',
          maxW: 'xs',
          flexDirection: 'column',
          gap: '4',
          textAlign: 'center',
        });
      }

      return baseClasses;
    });

    const valueClasses = createMemo(() => {
      return css({
        order: merged.variant === 'description' ? 'first' : 'first',
        fontSize: '3xl',
        fontWeight: 'semibold',
        letterSpacing: 'tight',
        color: merged.theme === 'dark' ? 'white' : 'gray.900',
        sm: { fontSize: '5xl' },
      });
    });

    const nameClasses = createMemo(() => {
      const textColor = merged.theme === 'dark' ? 'gray.400' : 'gray.600';

      if (merged.variant === 'description') {
        return css({
          fontSize: 'base',
          fontWeight: 'medium',
          color: textColor,
          lineHeight: '7',
        });
      }

      return css({
        fontSize: 'base',
        color: textColor,
        lineHeight: '7',
      });
    });

    return (
      <BlurFade delay={itemProps.index * (merged.staggerDelay / 1000)} inView={isIntersecting()}>
        <div class={itemClasses()}>
          <div class={valueClasses()}>
            <Show
              when={merged.countersEnabled && typeof itemProps.stat.value === 'number'}
              fallback={
                <span>
                  {itemProps.stat.prefix || ''}
                  {itemProps.stat.value}
                  {itemProps.stat.suffix || ''}
                </span>
              }
            >
              <NumberTicker
                value={itemProps.stat.value as number}
                startValue={itemProps.stat.startValue || 0}
                decimalPlaces={itemProps.stat.decimalPlaces || 0}
                duration={merged.animationDuration}
                delay={itemProps.index * merged.staggerDelay}
              />
              <span>{itemProps.stat.suffix || ''}</span>
            </Show>
          </div>

          <div class={nameClasses()}>{itemProps.stat.name}</div>

          <Show when={merged.variant === 'description' && itemProps.stat.description}>
            <div
              class={css({
                fontSize: 'sm',
                color: merged.theme === 'dark' ? 'gray.400' : 'gray.500',
                lineHeight: '6',
              })}
            >
              {itemProps.stat.description}
            </div>
          </Show>
        </div>
      </BlurFade>
    );
  };

  return (
    <div ref={setContainerRef} class={containerClasses()} style={merged.style}>
      <div
        class={css({
          mx: 'auto',
          maxW: '7xl',
          px: '6',
          lg: { px: '8' },
        })}
      >
        <Show when={merged.title || merged.subtitle}>
          <BlurFade delay={0.1} inView={isIntersecting()}>
            <div
              class={css({
                mx: 'auto',
                maxW: '2xl',
                textAlign: 'center',
                mb: '16',
                lg: { mb: '20' },
              })}
            >
              <Show when={merged.title}>
                <h2
                  class={css({
                    fontSize: '4xl',
                    sm: { fontSize: '5xl' },
                    fontWeight: 'bold',
                    letterSpacing: 'tight',
                    color: merged.theme === 'dark' ? 'white' : 'gray.900',
                    mb: merged.subtitle ? '6' : '0',
                  })}
                >
                  {merged.title}
                </h2>
              </Show>

              <Show when={merged.subtitle}>
                <p
                  class={css({
                    fontSize: 'lg',
                    sm: { fontSize: 'xl' },
                    color: merged.theme === 'dark' ? 'gray.300' : 'gray.600',
                    lineHeight: '8',
                  })}
                >
                  {merged.subtitle}
                </p>
              </Show>
            </div>
          </BlurFade>
        </Show>

        <div class={gridClasses()}>
          <For each={merged.stats}>{(stat, index) => <StatItem stat={stat} index={index()} />}</For>
        </div>
      </div>
    </div>
  );
};

export interface StatsSimpleDemoProps {
  className?: string;
}

export const StatsSimpleDemo: Component<StatsSimpleDemoProps> = (props) => {
  const demoStats: StatItem[] = [
    {
      id: '1',
      name: 'Transactions every 24 hours',
      value: '44 million',
    },
    {
      id: '2',
      name: 'Assets under holding',
      value: '$119 trillion',
    },
    {
      id: '3',
      name: 'New users annually',
      value: '46,000',
    },
  ];

  return (
    <StatsSimple
      stats={demoStats}
      theme="light"
      variant="basic"
      animated={true}
      countersEnabled={false}
      className={props.className}
    />
  );
};

export const StatsSimpleDarkDemo: Component<StatsSimpleDemoProps> = (props) => {
  const demoStats: StatItem[] = [
    {
      id: '1',
      name: 'Transactions every 24 hours',
      value: '44 million',
    },
    {
      id: '2',
      name: 'Assets under holding',
      value: '$119 trillion',
    },
    {
      id: '3',
      name: 'New users annually',
      value: '46,000',
    },
  ];

  return (
    <StatsSimple
      stats={demoStats}
      theme="dark"
      variant="basic"
      animated={true}
      countersEnabled={false}
      className={props.className}
    />
  );
};

export type { StatsSimpleProps, StatsSimpleDemoProps };
