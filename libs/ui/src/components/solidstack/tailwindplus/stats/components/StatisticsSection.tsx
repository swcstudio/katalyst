import { Component, JSX, mergeProps, createSignal, onMount, onCleanup, createEffect, For, Show, createMemo } from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { useStatsSection, StatItem, StatsSection } from '../state/useStatsSection';
import { NumberTicker } from '../../../magicui/NumberTicker';
import { BlurFade } from '../../../magicui/BlurFade';
import { BorderBeam } from '../../../magicui/BorderBeam';
import { DotPattern } from '../../../magicui/DotPattern';
import { BackgroundBeams } from '../../../magicui/BackgroundBeams';

export interface StatisticsSectionProps {
  className?: string;
  style?: JSX.CSSProperties;
  title?: string;
  subtitle?: string;
  badge?: string;
  stats: StatItem[];
  theme?: 'light' | 'dark';
  variant?: 'simple' | 'hero' | 'split' | 'cards' | 'timeline' | 'mixed' | 'centered' | 'background';
  layout?: 'grid' | 'list' | 'timeline' | 'cards';
  animated?: boolean;
  countersEnabled?: boolean;
  backgroundPattern?: 'none' | 'dots' | 'beams' | 'gradient';
  backgroundImage?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  staggerDelay?: number;
  animationDuration?: number;
  onStatSelect?: (stat: StatItem) => void;
  onAnimationComplete?: () => void;
}

export const StatisticsSection: Component<StatisticsSectionProps> = (props) => {
  const merged = mergeProps(
    {
      theme: 'light' as const,
      variant: 'simple' as const,
      layout: 'grid' as const,
      animated: true,
      countersEnabled: true,
      backgroundPattern: 'none' as const,
      staggerDelay: 150,
      animationDuration: 2000,
    },
    props
  );

  const [containerRef, setContainerRef] = createSignal<HTMLElement>();
  const [isIntersecting, setIsIntersecting] = createSignal(false);

  const statsSection = useStatsSection({
    statsData: {
      id: 'stats-section',
      title: merged.title,
      subtitle: merged.subtitle,
      badge: merged.badge,
      stats: merged.stats,
      layout: merged.layout,
      theme: merged.theme,
      backgroundPattern: merged.backgroundPattern,
      backgroundImage: merged.backgroundImage
    },
    theme: merged.theme,
    variant: merged.variant,
    animationDuration: merged.animationDuration,
    staggerDelay: merged.staggerDelay,
    countersEnabled: merged.countersEnabled,
    onStatSelect: (statId) => {
      const stat = merged.stats.find(s => s.id === statId);
      if (stat && merged.onStatSelect) {
        merged.onStatSelect(stat);
      }
    },
    onAnimationComplete: merged.onAnimationComplete
  });

  // Intersection Observer for triggering animations
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

  const themeClasses = createMemo(() => {
    const base = merged.theme === 'dark' 
      ? 'bg-gray-900 text-white'
      : 'bg-white text-gray-900';
    
    switch (merged.variant) {
      case 'hero':
        return merged.theme === 'dark'
          ? 'relative bg-gray-900 text-white overflow-hidden'
          : 'relative bg-white text-gray-900 overflow-hidden';
      case 'background':
        return merged.theme === 'dark'
          ? 'relative bg-gray-900 text-white overflow-hidden'
          : 'relative bg-gray-50 text-gray-900 overflow-hidden';
      case 'split':
        return 'relative bg-white text-gray-900';
      default:
        return base;
    }
  });

  const containerClasses = createMemo(() => {
    const baseClasses = css({
      py: '24',
      sm: { py: '32' },
    });

    const variantClasses = (() => {
      switch (merged.variant) {
        case 'hero':
        case 'background':
          return css({
            py: '24',
            sm: { py: '32' },
            position: 'relative',
            overflow: 'hidden'
          });
        case 'centered':
          return css({
            pt: '12',
            pb: '12',
            sm: { pt: '16', pb: '16' }
          });
        default:
          return baseClasses;
      }
    })();

    return `${themeClasses()} ${variantClasses} ${merged.className || ''}`;
  });

  const StatCard: Component<{ stat: StatItem; index: number }> = (cardProps) => {
    const [isHovered, setIsHovered] = createSignal(false);
    
    const cardClasses = createMemo(() => {
      const baseClasses = css({
        position: 'relative',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      });

      const themeClasses = merged.theme === 'dark'
        ? css({
            bg: 'white/5',
            border: '1px solid white/10',
            _hover: { bg: 'white/10' }
          })
        : css({
            bg: 'gray.50',
            border: '1px solid gray.200',
            _hover: { bg: 'gray.100' }
          });

      const layoutClasses = (() => {
        switch (merged.variant) {
          case 'cards':
            return css({
              rounded: '2xl',
              p: '8',
              display: 'flex',
              flexDirection: 'column',
              gap: '4'
            });
          case 'timeline':
            return css({
              display: 'flex',
              flexDirection: 'column',
              gap: '3',
              borderLeft: merged.theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              pl: '6'
            });
          default:
            return css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4',
              textAlign: 'center'
            });
        }
      })();

      return `${baseClasses} ${themeClasses} ${layoutClasses}`;
    });

    return (
      <BlurFade 
        delay={cardProps.index * (merged.staggerDelay / 1000)}
        inView={isIntersecting()}
      >
        <div
          class={cardClasses()}
          onMouseEnter={() => {
            setIsHovered(true);
            statsSection.hoverStat(cardProps.stat.id);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            statsSection.unhoverStat();
          }}
          onClick={() => statsSection.selectStat(cardProps.stat.id)}
        >
          <Show when={merged.variant === 'cards' && isHovered()}>
            <BorderBeam size={250} duration={12} />
          </Show>

          <Show when={cardProps.stat.icon}>
            <div class={css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: merged.variant === 'timeline' ? 'flex-start' : 'center',
              mb: '2'
            })}>
              <cardProps.stat.icon class={css({
                w: '6',
                h: '6',
                color: merged.theme === 'dark' ? 'white' : 'gray.600'
              })} />
            </div>
          </Show>

          <Show when={merged.variant === 'timeline'}>
            <div class={css({
              position: 'absolute',
              left: '-1',
              top: '0',
              w: '2',
              h: '2',
              bg: cardProps.stat.color || (merged.theme === 'dark' ? 'white' : 'gray.900'),
              rounded: 'full',
              transform: 'translateX(-50%)'
            })} />
          </Show>

          <div class={css({
            order: merged.variant === 'timeline' ? '1' : 'first',
            fontSize: merged.variant === 'cards' ? '3xl' : '5xl',
            sm: { fontSize: merged.variant === 'cards' ? '4xl' : '6xl' },
            fontWeight: 'bold',
            letterSpacing: 'tight',
            color: cardProps.stat.color || (merged.theme === 'dark' ? 'white' : 'gray.900')
          })}>
            <Show 
              when={merged.countersEnabled && typeof cardProps.stat.value === 'number'}
              fallback={<span>{cardProps.stat.prefix || ''}{cardProps.stat.value}{cardProps.stat.suffix || ''}</span>}
            >
              <NumberTicker
                value={cardProps.stat.value as number}
                startValue={cardProps.stat.startValue || 0}
                decimalPlaces={cardProps.stat.decimalPlaces || 0}
                duration={merged.animationDuration}
                delay={cardProps.index * merged.staggerDelay}
              />
              <span>{cardProps.stat.suffix || ''}</span>
            </Show>
          </div>

          <div class={css({
            fontSize: merged.variant === 'cards' ? 'lg' : 'base',
            sm: { fontSize: merged.variant === 'cards' ? 'xl' : 'lg' },
            fontWeight: 'semibold',
            color: merged.theme === 'dark' ? 'white' : 'gray.900',
            mb: merged.variant === 'cards' ? '2' : '1'
          })}>
            {cardProps.stat.name}
          </div>

          <Show when={cardProps.stat.description}>
            <div class={css({
              fontSize: 'sm',
              color: merged.theme === 'dark' ? 'gray.300' : 'gray.600',
              lineHeight: '6'
            })}>
              {cardProps.stat.description}
            </div>
          </Show>
        </div>
      </BlurFade>
    );
  };

  const gridClasses = createMemo(() => {
    const baseGrid = css({
      display: 'grid',
      gap: '8',
      gridTemplateColumns: '1',
      sm: { gridTemplateColumns: '2' },
      lg: { gridTemplateColumns: merged.stats.length >= 4 ? '4' : merged.stats.length.toString() }
    });

    switch (merged.variant) {
      case 'cards':
        return css({
          display: 'grid',
          gap: '8',
          gridTemplateColumns: '1',
          sm: { gridTemplateColumns: '2' },
          lg: { gridTemplateColumns: '3' }
        });
      case 'timeline':
        return css({
          display: 'grid',
          gap: '16',
          gridTemplateColumns: '1',
          lg: { gridTemplateColumns: '4' }
        });
      case 'mixed':
        return css({
          display: 'flex',
          flexDirection: 'column',
          gap: '8',
          lg: {
            flexDirection: 'row',
            alignItems: 'end'
          }
        });
      default:
        return baseGrid;
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
            opacity: merged.theme === 'dark' ? '0.1' : '0.05'
          })}
        />
      </Show>

      <Show when={merged.backgroundPattern === 'beams'}>
        <BackgroundBeams className={css({ position: 'absolute', inset: '0' })} />
      </Show>

      <Show when={merged.backgroundPattern === 'gradient'}>
        <div class={css({
          position: 'absolute',
          inset: '0',
          bg: merged.theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(239, 246, 255, 0.6) 0%, rgba(219, 234, 254, 0.6) 100%)'
        })} />
      </Show>

      <Show when={merged.backgroundImage}>
        <img
          src={merged.backgroundImage}
          alt=""
          class={css({
            position: 'absolute',
            inset: '0',
            w: 'full',
            h: 'full',
            objectFit: 'cover',
            opacity: merged.theme === 'dark' ? '0.2' : '0.1'
          })}
        />
      </Show>

      <div class={css({
        position: 'relative',
        mx: 'auto',
        maxW: '7xl',
        px: '6',
        lg: { px: '8' }
      })}>
        {/* Header Section */}
        <Show when={merged.badge || merged.title || merged.subtitle}>
          <BlurFade delay={0.1} inView={isIntersecting()}>
            <div class={css({
              mx: 'auto',
              maxW: '2xl',
              textAlign: merged.variant === 'split' ? 'left' : 'center',
              mb: '16',
              lg: { mb: '20' }
            })}>
              <Show when={merged.badge}>
                <div class={css({
                  display: 'inline-block',
                  rounded: 'full',
                  bg: merged.theme === 'dark' ? 'indigo.600' : 'indigo.100',
                  px: '3',
                  py: '1',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  color: merged.theme === 'dark' ? 'white' : 'indigo.600',
                  mb: '4'
                })}>
                  {merged.badge}
                </div>
              </Show>

              <Show when={merged.title}>
                <h2 class={css({
                  fontSize: '4xl',
                  sm: { fontSize: '5xl' },
                  fontWeight: 'bold',
                  letterSpacing: 'tight',
                  color: merged.theme === 'dark' ? 'white' : 'gray.900',
                  mb: merged.subtitle ? '6' : '0'
                })}>
                  {merged.title}
                </h2>
              </Show>

              <Show when={merged.subtitle}>
                <p class={css({
                  fontSize: 'lg',
                  sm: { fontSize: 'xl' },
                  color: merged.theme === 'dark' ? 'gray.300' : 'gray.600',
                  lineHeight: '8'
                })}>
                  {merged.subtitle}
                </p>
              </Show>
            </div>
          </BlurFade>
        </Show>

        {/* Stats Grid */}
        <Show when={merged.variant === 'mixed'}>
          <div class={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '8',
            lg: {
              flexDirection: 'row',
              alignItems: 'end'
            }
          })}>
            <For each={merged.stats}>
              {(stat, index) => (
                <div class={css({
                  flex: '1',
                  minW: '0'
                })}>
                  <StatCard stat={stat} index={index()} />
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={merged.variant !== 'mixed'}>
          <div class={gridClasses()}>
            <For each={merged.stats}>
              {(stat, index) => <StatCard stat={stat} index={index()} />}
            </For>
          </div>
        </Show>

        {/* Error State */}
        <Show when={statsSection.isError && statsSection.errorState}>
          <div class={css({
            textAlign: 'center',
            py: '12'
          })}>
            <p class={css({
              color: 'red.500',
              mb: '4'
            })}>
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
                _hover: { bg: 'red.700' }
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

export interface StatisticsSectionDemoProps {
  className?: string;
}

export const StatisticsSectionDemo: Component<StatisticsSectionDemoProps> = (props) => {
  const demoStats: StatItem[] = [
    {
      id: '1',
      name: 'Transactions every 24 hours',
      value: 44000000,
      suffix: 'M',
      category: 'financial',
      priority: true
    },
    {
      id: '2', 
      name: 'Assets under holding',
      value: 119,
      prefix: '$',
      suffix: ' trillion',
      category: 'financial'
    },
    {
      id: '3',
      name: 'New users annually', 
      value: 46000,
      suffix: 'K',
      category: 'growth'
    }
  ];

  return (
    <StatisticsSection
      title="Trusted by millions worldwide"
      subtitle="Our platform processes billions of transactions and manages trillions in assets"
      stats={demoStats}
      theme="light"
      variant="simple"
      animated={true}
      countersEnabled={true}
      className={props.className}
    />
  );
};

export type { StatisticsSectionProps, StatisticsSectionDemoProps };