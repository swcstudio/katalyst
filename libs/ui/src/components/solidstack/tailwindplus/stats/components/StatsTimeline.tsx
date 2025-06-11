import {
  type Component,
  For,
  type JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
} from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { BlurFade } from '../../../magicui/BlurFade';
import { BorderBeam } from '../../../magicui/BorderBeam';
import { DotPattern } from '../../../magicui/DotPattern';
import { NumberTicker } from '../../../magicui/NumberTicker';
import { type StatItem, useStatsSection } from '../state/useStatsSection';

export interface TimelineStatItem extends StatItem {
  date?: string;
  dateTime?: string;
  period?: string;
  milestone?: string;
}

export interface StatsTimelineProps {
  className?: string;
  style?: JSX.CSSProperties;
  title?: string;
  subtitle?: string;
  badge?: string;
  stats: TimelineStatItem[];
  theme?: 'light' | 'dark';
  variant?: 'horizontal' | 'vertical' | 'grid' | 'compact';
  animated?: boolean;
  countersEnabled?: boolean;
  backgroundPattern?: 'none' | 'dots' | 'beams' | 'gradient';
  showConnectors?: boolean;
  staggerDelay?: number;
  animationDuration?: number;
  onStatSelect?: (stat: TimelineStatItem) => void;
  onAnimationComplete?: () => void;
}

export const StatsTimeline: Component<StatsTimelineProps> = (props) => {
  const merged = mergeProps(
    {
      theme: 'light' as const,
      variant: 'horizontal' as const,
      animated: true,
      countersEnabled: true,
      backgroundPattern: 'none' as const,
      showConnectors: true,
      staggerDelay: 150,
      animationDuration: 2000,
    },
    props
  );

  const [containerRef, setContainerRef] = createSignal<HTMLElement>();
  const [isIntersecting, setIsIntersecting] = createSignal(false);

  const statsSection = useStatsSection({
    statsData: {
      id: 'stats-timeline',
      title: merged.title,
      subtitle: merged.subtitle,
      badge: merged.badge,
      stats: merged.stats,
      layout: 'timeline',
      theme: merged.theme,
      backgroundPattern: merged.backgroundPattern,
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
    onAnimationComplete: merged.onAnimationComplete,
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
      position: 'relative',
    });

    const themeClasses =
      merged.theme === 'dark'
        ? css({ bg: 'gray.900', color: 'white' })
        : css({ bg: 'white', color: 'gray.900' });

    return `${baseClasses} ${themeClasses} ${merged.className || ''}`;
  });

  const TimelineItem: Component<{ stat: TimelineStatItem; index: number; isLast: boolean }> = (
    itemProps
  ) => {
    const [isHovered, setIsHovered] = createSignal(false);

    const itemClasses = createMemo(() => {
      const baseClasses = css({
        position: 'relative',
        transition: 'all 0.3s ease',
      });

      const variantClasses = (() => {
        switch (merged.variant) {
          case 'horizontal':
            return css({
              display: 'flex',
              flexDirection: 'column',
              flex: '1',
            });
          case 'vertical':
            return css({
              display: 'flex',
              flexDirection: 'column',
              pb: '8',
              borderLeft:
                merged.theme === 'dark'
                  ? '2px solid rgba(255,255,255,0.1)'
                  : '2px solid rgba(0,0,0,0.1)',
              pl: '6',
              ml: '4',
            });
          case 'grid':
            return css({
              display: 'flex',
              flexDirection: 'column',
              bg: merged.theme === 'dark' ? 'gray.800' : 'gray.50',
              p: '6',
              rounded: 'lg',
              border:
                merged.theme === 'dark'
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid rgba(0,0,0,0.1)',
              cursor: 'pointer',
              _hover: {
                bg: merged.theme === 'dark' ? 'gray.700' : 'gray.100',
              },
            });
          default:
            return css({
              display: 'flex',
              flexDirection: 'column',
            });
        }
      })();

      return `${baseClasses} ${variantClasses}`;
    });

    const dateClasses = createMemo(() => {
      const baseClasses = css({
        display: 'flex',
        alignItems: 'center',
        fontSize: 'sm',
        lineHeight: '6',
        fontWeight: 'semibold',
      });

      const colorClasses =
        merged.variant === 'grid'
          ? css({ color: merged.theme === 'dark' ? 'indigo.400' : 'indigo.600' })
          : css({ color: merged.theme === 'dark' ? 'indigo.400' : 'indigo.600' });

      return `${baseClasses} ${colorClasses}`;
    });

    const connectorClasses = createMemo(() => {
      if (!merged.showConnectors || merged.variant === 'grid') return '';

      return css({
        position: 'absolute',
        h: 'px',
        w: 'screen',
        '-translateX': 'full',
        bg: merged.theme === 'dark' ? 'gray.900/10' : 'gray.900/10',
        '-ml': '2',
        sm: { '-ml': '4' },
        lg: {
          position: 'static',
          '-mr': '6',
          ml: '8',
          w: 'auto',
          flex: 'auto',
          translateX: '0',
        },
      });
    });

    const milestoneClasses = createMemo(() => {
      return css({
        mt: '6',
        fontSize: 'lg',
        lineHeight: '8',
        fontWeight: 'semibold',
        letterSpacing: 'tight',
        color: merged.theme === 'dark' ? 'white' : 'gray.900',
      });
    });

    const valueClasses = createMemo(() => {
      return css({
        mt: '1',
        fontSize: merged.variant === 'grid' ? '2xl' : '3xl',
        fontWeight: 'semibold',
        letterSpacing: 'tight',
        color: merged.theme === 'dark' ? 'white' : 'gray.900',
      });
    });

    const descriptionClasses = createMemo(() => {
      return css({
        mt: '1',
        fontSize: 'base',
        lineHeight: '7',
        color: merged.theme === 'dark' ? 'gray.300' : 'gray.600',
      });
    });

    return (
      <BlurFade delay={itemProps.index * (merged.staggerDelay / 1000)} inView={isIntersecting()}>
        <div
          class={itemClasses()}
          onMouseEnter={() => {
            setIsHovered(true);
            statsSection.hoverStat(itemProps.stat.id);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            statsSection.unhoverStat();
          }}
          onClick={() => statsSection.selectStat(itemProps.stat.id)}
        >
          <Show when={merged.variant === 'grid' && isHovered()}>
            <BorderBeam size={200} duration={8} />
          </Show>

          {/* Timeline dot/marker */}
          <Show when={merged.variant === 'vertical'}>
            <div
              class={css({
                position: 'absolute',
                left: '-1',
                top: '0',
                w: '2',
                h: '2',
                bg: merged.theme === 'dark' ? 'indigo.400' : 'indigo.600',
                rounded: 'full',
                transform: 'translateX(-50%)',
              })}
            >
              <svg
                viewBox="0 0 4 4"
                aria-hidden="true"
                class={css({ mr: '4', w: '1', h: '1', flex: 'none' })}
              >
                <circle r={2} cx={2} cy={2} fill="currentColor" />
              </svg>
            </div>
          </Show>

          {/* Date/Time */}
          <Show when={itemProps.stat.date || itemProps.stat.period}>
            <time dateTime={itemProps.stat.dateTime} class={dateClasses()}>
              <Show when={merged.variant === 'horizontal' && merged.showConnectors}>
                <svg
                  viewBox="0 0 4 4"
                  aria-hidden="true"
                  class={css({ mr: '4', w: '1', h: '1', flex: 'none' })}
                >
                  <circle r={2} cx={2} cy={2} fill="currentColor" />
                </svg>
              </Show>

              {itemProps.stat.date || itemProps.stat.period}

              <Show
                when={merged.variant === 'horizontal' && merged.showConnectors && !itemProps.isLast}
              >
                <div class={connectorClasses()} />
              </Show>
            </time>
          </Show>

          {/* Value/Statistic */}
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

          {/* Milestone/Name */}
          <Show when={itemProps.stat.milestone || itemProps.stat.name}>
            <p class={milestoneClasses()}>{itemProps.stat.milestone || itemProps.stat.name}</p>
          </Show>

          {/* Description */}
          <Show when={itemProps.stat.description}>
            <p class={descriptionClasses()}>{itemProps.stat.description}</p>
          </Show>
        </div>
      </BlurFade>
    );
  };

  const gridClasses = createMemo(() => {
    switch (merged.variant) {
      case 'horizontal':
        return css({
          mx: 'auto',
          display: 'grid',
          maxW: '2xl',
          gridTemplateColumns: '1',
          gap: '8',
          overflow: 'hidden',
          lg: { mx: '0', maxW: 'none', gridTemplateColumns: '4' },
        });
      case 'vertical':
        return css({
          display: 'flex',
          flexDirection: 'column',
          gap: '8',
          maxW: '4xl',
          mx: 'auto',
        });
      case 'grid':
        return css({
          display: 'grid',
          gap: '6',
          gridTemplateColumns: '1',
          sm: { gridTemplateColumns: '2' },
          lg: { gridTemplateColumns: '3' },
          xl: { gridTemplateColumns: '4' },
        });
      case 'compact':
        return css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4',
          justifyContent: 'center',
        });
      default:
        return css({
          display: 'grid',
          gap: '8',
          gridTemplateColumns: '1',
          lg: { gridTemplateColumns: '4' },
        });
    }
  });

  return (
    <div ref={setContainerRef} class={containerClasses()} style={merged.style}>
      {/* Background Elements */}
      <Show when={merged.backgroundPattern === 'dots'}>
        <DotPattern
          className={css({
            position: 'absolute',
            inset: '0',
            opacity: merged.theme === 'dark' ? '0.1' : '0.05',
          })}
        />
      </Show>

      <Show when={merged.backgroundPattern === 'gradient'}>
        <div
          class={css({
            position: 'absolute',
            inset: '0',
            bg:
              merged.theme === 'dark'
                ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(239, 246, 255, 0.6) 0%, rgba(219, 234, 254, 0.6) 100%)',
          })}
        />
      </Show>

      <div
        class={css({
          position: 'relative',
          mx: 'auto',
          maxW: '7xl',
          px: '6',
          lg: { px: '8' },
        })}
      >
        {/* Header Section */}
        <Show when={merged.badge || merged.title || merged.subtitle}>
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
              <Show when={merged.badge}>
                <div
                  class={css({
                    display: 'inline-block',
                    rounded: 'full',
                    bg: merged.theme === 'dark' ? 'indigo.600' : 'indigo.100',
                    px: '3',
                    py: '1',
                    fontSize: 'sm',
                    fontWeight: 'medium',
                    color: merged.theme === 'dark' ? 'white' : 'indigo.600',
                    mb: '4',
                  })}
                >
                  {merged.badge}
                </div>
              </Show>

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

        {/* Timeline */}
        <div class={gridClasses()}>
          <For each={merged.stats}>
            {(stat, index) => (
              <TimelineItem
                stat={stat}
                index={index()}
                isLast={index() === merged.stats.length - 1}
              />
            )}
          </For>
        </div>

        {/* Error State */}
        <Show when={statsSection.isError && statsSection.errorState}>
          <div
            class={css({
              textAlign: 'center',
              py: '12',
            })}
          >
            <p
              class={css({
                color: 'red.500',
                mb: '4',
              })}
            >
              {statsSection.errorState}
            </p>
            <button
              onClick={() => statsSection.retry()}
              class={css({
                bg: 'red.600',
                color: 'white',
                px: '4',
                py: '2',
                rounded: 'md',
                _hover: { bg: 'red.700' },
              })}
            >
              Retry
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
};

export interface StatsTimelineDemoProps {
  className?: string;
}

export const StatsTimelineDemo: Component<StatsTimelineDemoProps> = (props) => {
  const timelineStats: TimelineStatItem[] = [
    {
      id: '1',
      milestone: 'Founded company',
      description:
        'Nihil aut nam. Dignissimos a pariatur et quos omnis. Aspernatur asperiores et dolorem dolorem optio voluptate repudiandae.',
      date: 'Aug 2021',
      dateTime: '2021-08',
      value: 1,
      category: 'milestone',
    },
    {
      id: '2',
      milestone: 'Secured $65m in funding',
      description:
        'Provident quia ut esse. Vero vel eos repudiandae aspernatur. Cumque minima impedit sapiente a architecto nihil.',
      date: 'Dec 2021',
      dateTime: '2021-12',
      value: 65,
      prefix: '$',
      suffix: 'M',
      category: 'funding',
    },
    {
      id: '3',
      milestone: 'Released beta',
      description:
        'Sunt perspiciatis incidunt. Non necessitatibus aliquid. Consequatur ut officiis earum eum quia facilis. Hic deleniti dolorem quia et.',
      date: 'Feb 2022',
      dateTime: '2022-02',
      value: 1000,
      suffix: ' users',
      category: 'product',
    },
    {
      id: '4',
      milestone: 'Global launch of product',
      description:
        'Ut ipsa sint distinctio quod itaque nam qui. Possimus aut unde id architecto voluptatem hic aut pariatur velit.',
      date: 'Dec 2022',
      dateTime: '2022-12',
      value: 1000000,
      suffix: ' users',
      category: 'growth',
    },
  ];

  return (
    <StatsTimeline
      title="Company Timeline"
      subtitle="Key milestones in our journey"
      stats={timelineStats}
      theme="light"
      variant="horizontal"
      animated={true}
      countersEnabled={true}
      showConnectors={true}
      className={props.className}
    />
  );
};

export const StatsTimelineVerticalDemo: Component<StatsTimelineDemoProps> = (props) => {
  const timelineStats: TimelineStatItem[] = [
    {
      id: '1',
      milestone: 'Founded company',
      description: 'Started with a vision to transform the industry',
      date: 'Aug 2021',
      dateTime: '2021-08',
      value: 2021,
      category: 'milestone',
    },
    {
      id: '2',
      milestone: 'First million users',
      description: 'Reached our first major user milestone',
      date: 'Dec 2021',
      dateTime: '2021-12',
      value: 1000000,
      suffix: ' users',
      category: 'growth',
    },
    {
      id: '3',
      milestone: 'Series A funding',
      description: 'Secured funding to scale our operations',
      date: 'Feb 2022',
      dateTime: '2022-02',
      value: 25,
      prefix: '$',
      suffix: 'M',
      category: 'funding',
    },
    {
      id: '4',
      milestone: 'Global expansion',
      description: 'Launched in 50+ countries worldwide',
      date: 'Dec 2022',
      dateTime: '2022-12',
      value: 50,
      suffix: ' countries',
      category: 'expansion',
    },
  ];

  return (
    <StatsTimeline
      badge="Our Journey"
      title="Milestones & Achievements"
      subtitle="Track our progress and key achievements over time"
      stats={timelineStats}
      theme="dark"
      variant="vertical"
      animated={true}
      countersEnabled={true}
      showConnectors={true}
      backgroundPattern="gradient"
      className={props.className}
    />
  );
};

export type { StatsTimelineProps, StatsTimelineDemoProps, TimelineStatItem };
