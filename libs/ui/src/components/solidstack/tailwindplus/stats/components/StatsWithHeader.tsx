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
import { BackgroundBeams } from '../../../magicui/BackgroundBeams';
import { BlurFade } from '../../../magicui/BlurFade';
import { BorderBeam } from '../../../magicui/BorderBeam';
import { DotPattern } from '../../../magicui/DotPattern';
import { NumberTicker } from '../../../magicui/NumberTicker';
import { type StatItem, useStatsSection } from '../state/useStatsSection';

export interface StatsWithHeaderProps {
  className?: string;
  style?: JSX.CSSProperties;
  title?: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  stats: StatItem[];
  theme?: 'light' | 'dark';
  variant?: 'cards' | 'split' | 'background' | 'centered' | 'grid';
  animated?: boolean;
  countersEnabled?: boolean;
  backgroundPattern?: 'none' | 'dots' | 'beams' | 'gradient';
  backgroundImage?: string;
  staggerDelay?: number;
  animationDuration?: number;
  onStatSelect?: (stat: StatItem) => void;
  onAnimationComplete?: () => void;
}

export const StatsWithHeader: Component<StatsWithHeaderProps> = (props) => {
  const merged = mergeProps(
    {
      theme: 'light' as const,
      variant: 'cards' as const,
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
      id: 'stats-with-header',
      title: merged.title,
      subtitle: merged.subtitle,
      badge: merged.badge,
      stats: merged.stats,
      layout: 'grid',
      theme: merged.theme,
      backgroundPattern: merged.backgroundPattern,
      backgroundImage: merged.backgroundImage,
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

    const themeClasses = (() => {
      switch (merged.variant) {
        case 'background':
          return merged.theme === 'dark'
            ? css({ bg: 'gray.900', color: 'white', overflow: 'hidden' })
            : css({ bg: 'white', color: 'gray.900', overflow: 'hidden' });
        case 'split':
          return css({ bg: 'white', color: 'gray.900' });
        default:
          return merged.theme === 'dark'
            ? css({ bg: 'gray.900', color: 'white' })
            : css({ bg: 'white', color: 'gray.900' });
      }
    })();

    return `${baseClasses} ${themeClasses} ${merged.className || ''}`;
  });

  const StatCard: Component<{ stat: StatItem; index: number }> = (cardProps) => {
    const [isHovered, setIsHovered] = createSignal(false);

    const cardClasses = createMemo(() => {
      const baseClasses = css({
        position: 'relative',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      });

      const variantClasses = (() => {
        switch (merged.variant) {
          case 'cards':
            return css({
              display: 'flex',
              flexDirection: 'column',
              bg: merged.theme === 'dark' ? 'gray.400/5' : 'gray.400/5',
              p: '8',
              rounded: '2xl',
              border:
                merged.theme === 'dark'
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid rgba(0,0,0,0.05)',
              _hover: {
                bg: merged.theme === 'dark' ? 'gray.400/10' : 'gray.400/10',
              },
            });
          case 'split':
            return css({
              display: 'flex',
              flexDirection: 'column',
              gap: '3',
              borderLeft:
                merged.theme === 'dark'
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid rgba(0,0,0,0.1)',
              pl: '6',
            });
          case 'background':
            return css({
              display: 'flex',
              flexDirection: 'column',
              gap: '3',
              borderLeft: 'border-white/10',
              pl: '6',
            });
          default:
            return css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4',
              textAlign: 'center',
            });
        }
      })();

      return `${baseClasses} ${variantClasses}`;
    });

    const valueClasses = createMemo(() => {
      const baseClasses = css({
        fontSize: '3xl',
        fontWeight: 'semibold',
        letterSpacing: 'tight',
      });

      const colorClasses = (() => {
        switch (merged.variant) {
          case 'background':
            return css({ color: 'white' });
          case 'split':
            return css({
              color: merged.theme === 'dark' ? 'white' : 'gray.900',
              order: 'first',
            });
          default:
            return css({
              color: merged.theme === 'dark' ? 'white' : 'gray.900',
              order: merged.variant === 'cards' ? 'first' : 'first',
            });
        }
      })();

      return `${baseClasses} ${colorClasses}`;
    });

    const nameClasses = createMemo(() => {
      const baseClasses = css({
        fontSize: 'sm',
        fontWeight: 'semibold',
      });

      const colorClasses = (() => {
        switch (merged.variant) {
          case 'background':
            return css({ color: 'gray.300', lineHeight: '6' });
          case 'cards':
            return css({
              color: merged.theme === 'dark' ? 'gray.300' : 'gray.600',
              lineHeight: '6',
            });
          default:
            return css({
              color: merged.theme === 'dark' ? 'gray.400' : 'gray.600',
            });
        }
      })();

      return `${baseClasses} ${colorClasses}`;
    });

    return (
      <BlurFade delay={cardProps.index * (merged.staggerDelay / 1000)} inView={isIntersecting()}>
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

          <div class={nameClasses()}>{cardProps.stat.name}</div>

          <div class={valueClasses()}>
            <Show
              when={merged.countersEnabled && typeof cardProps.stat.value === 'number'}
              fallback={
                <span>
                  {cardProps.stat.prefix || ''}
                  {cardProps.stat.value}
                  {cardProps.stat.suffix || ''}
                </span>
              }
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

          <Show when={cardProps.stat.description}>
            <div
              class={css({
                fontSize: 'sm',
                color:
                  merged.variant === 'background'
                    ? 'gray.300'
                    : merged.theme === 'dark'
                      ? 'gray.400'
                      : 'gray.500',
                lineHeight: '6',
                mt: '2',
              })}
            >
              {cardProps.stat.description}
            </div>
          </Show>
        </div>
      </BlurFade>
    );
  };

  const gridClasses = createMemo(() => {
    switch (merged.variant) {
      case 'cards':
        return css({
          mt: '16',
          display: 'grid',
          gap: '0.5',
          gridTemplateColumns: '1',
          overflow: 'hidden',
          rounded: '2xl',
          textAlign: 'center',
          sm: { gridTemplateColumns: '2' },
          lg: { gridTemplateColumns: '4' },
        });
      case 'split':
      case 'background':
        return css({
          mt: '16',
          display: 'grid',
          maxW: '2xl',
          gridTemplateColumns: '1',
          gap: '8',
          textAlign: 'left',
          sm: { mt: '20', gridTemplateColumns: '2', gap: '16' },
          lg: { mx: '0', maxW: 'none', gridTemplateColumns: '4' },
        });
      case 'centered':
        return css({
          mt: '10',
          textAlign: 'center',
          sm: { mx: 'auto', display: 'grid', maxW: '3xl', gridTemplateColumns: '3', gap: '8' },
        });
      default:
        return css({
          mt: '16',
          display: 'grid',
          gap: '8',
          gridTemplateColumns: '1',
          textAlign: 'center',
          lg: { gridTemplateColumns: '4' },
        });
    }
  });

  const contentClasses = createMemo(() => {
    switch (merged.variant) {
      case 'split':
        return css({
          mx: 'auto',
          display: 'grid',
          maxW: '7xl',
          lg: { gridTemplateColumns: '2' },
        });
      case 'background':
        return css({
          position: 'relative',
          mx: 'auto',
          maxW: '7xl',
          px: '6',
          lg: { px: '8' },
        });
      default:
        return css({
          mx: 'auto',
          maxW: '7xl',
          px: '6',
          lg: { px: '8' },
        });
    }
  });

  const headerClasses = createMemo(() => {
    switch (merged.variant) {
      case 'split':
        return css({
          px: '6',
          pt: '16',
          pb: '24',
          sm: { pt: '20', pb: '32' },
          lg: { colStart: '2', px: '8', pt: '32' },
        });
      case 'background':
        return css({
          mx: 'auto',
          maxW: '2xl',
          lg: { mx: '0', maxW: 'xl' },
        });
      default:
        return css({
          mx: 'auto',
          maxW: '2xl',
          lg: { mx: '0', maxW: 'none' },
          textAlign: merged.variant === 'centered' ? 'center' : 'left',
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

      <Show when={merged.backgroundPattern === 'beams'}>
        <BackgroundBeams className={css({ position: 'absolute', inset: '0' })} />
      </Show>

      <Show when={merged.backgroundPattern === 'gradient'}>
        <div
          class={css({
            position: 'absolute',
            '-bottom': '8',
            '-left': '96',
            '-z': '10',
            transform: 'gpu',
            filter: 'blur(3xl)',
            sm: { '-bottom': '64', '-left': '40' },
            lg: { '-bottom': '32', left: '8' },
            xl: { '-left': '10' },
          })}
        >
          <div
            style={{
              'clip-path':
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            class={css({
              aspectRatio: '1266/975',
              w: '316.5',
              bg: 'linear-gradient(to top right, #ff4694, #776fff)',
              opacity: '0.2',
            })}
          />
        </div>
      </Show>

      <Show when={merged.backgroundImage}>
        <img
          src={merged.backgroundImage}
          alt=""
          class={css({
            position: 'absolute',
            inset: '0',
            '-z': '10',
            w: 'full',
            h: 'full',
            objectFit: 'cover',
            opacity: merged.theme === 'dark' ? '0.2' : '0.1',
          })}
        />
      </Show>

      <Show when={merged.variant === 'split'}>
        <img
          alt=""
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2850&q=80"
          class={css({
            h: '56',
            w: 'full',
            bg: 'gray.50',
            objectFit: 'cover',
            lg: { position: 'absolute', inset: '0', left: '0', h: 'full', w: '1/2' },
          })}
        />
      </Show>

      <div class={contentClasses()}>
        <div class={headerClasses()}>
          <BlurFade delay={0.1} inView={isIntersecting()}>
            <div
              class={css({
                mx: 'auto',
                maxW: '2xl',
                lg: { mr: '0', maxW: 'lg' },
              })}
            >
              <Show when={merged.badge}>
                <div
                  class={css({
                    fontSize: 'base',
                    lineHeight: '8',
                    fontWeight: 'semibold',
                    color: merged.variant === 'background' ? 'indigo.400' : 'indigo.600',
                    mb: '2',
                  })}
                >
                  {merged.badge}
                </div>
              </Show>

              <Show when={merged.title}>
                <h2
                  class={css({
                    mt: '2',
                    fontSize: '4xl',
                    fontWeight: 'semibold',
                    letterSpacing: 'tight',
                    textWrap: 'pretty',
                    color:
                      merged.variant === 'background'
                        ? 'white'
                        : merged.theme === 'dark'
                          ? 'white'
                          : 'gray.900',
                    sm: { fontSize: '5xl' },
                  })}
                >
                  {merged.title}
                </h2>
              </Show>

              <Show when={merged.subtitle}>
                <p
                  class={css({
                    mt: '6',
                    fontSize: 'lg',
                    lineHeight: '8',
                    color:
                      merged.variant === 'background'
                        ? 'gray.300'
                        : merged.theme === 'dark'
                          ? 'gray.300'
                          : 'gray.600',
                  })}
                >
                  {merged.subtitle}
                </p>
              </Show>

              <Show when={merged.description}>
                <p
                  class={css({
                    mt: '6',
                    fontSize: 'lg',
                    lineHeight: '8',
                    color:
                      merged.variant === 'background'
                        ? 'gray.300'
                        : merged.theme === 'dark'
                          ? 'gray.300'
                          : 'gray.600',
                  })}
                >
                  {merged.description}
                </p>
              </Show>

              <div class={gridClasses()}>
                <For each={merged.stats}>
                  {(stat, index) => <StatCard stat={stat} index={index()} />}
                </For>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </div>
  );
};

export interface StatsWithHeaderDemoProps {
  className?: string;
}

export const StatsWithHeaderDemo: Component<StatsWithHeaderDemoProps> = (props) => {
  const demoStats: StatItem[] = [
    {
      id: '1',
      name: 'Creators on the platform',
      value: 8000,
      suffix: '+',
      category: 'users',
    },
    {
      id: '2',
      name: 'Flat platform fee',
      value: 3,
      suffix: '%',
      category: 'pricing',
    },
    {
      id: '3',
      name: 'Uptime guarantee',
      value: 99.9,
      suffix: '%',
      decimalPlaces: 1,
      category: 'performance',
    },
    {
      id: '4',
      name: 'Paid out to creators',
      value: 70,
      prefix: '$',
      suffix: 'M',
      category: 'financial',
    },
  ];

  return (
    <StatsWithHeader
      badge="Our track record"
      title="Trusted by creators worldwide"
      subtitle="Lorem ipsum dolor sit amet consect adipisicing possimus."
      stats={demoStats}
      theme="light"
      variant="cards"
      animated={true}
      countersEnabled={true}
      className={props.className}
    />
  );
};

export const StatsWithHeaderBackgroundDemo: Component<StatsWithHeaderDemoProps> = (props) => {
  const demoStats: StatItem[] = [
    {
      id: '1',
      name: 'Creators on the platform',
      value: 8000,
      suffix: '+',
      category: 'users',
    },
    {
      id: '2',
      name: 'Flat platform fee',
      value: 3,
      suffix: '%',
      category: 'pricing',
    },
    {
      id: '3',
      name: 'Uptime guarantee',
      value: 99.9,
      suffix: '%',
      decimalPlaces: 1,
      category: 'performance',
    },
    {
      id: '4',
      name: 'Paid out to creators',
      value: 70,
      prefix: '$',
      suffix: 'M',
      category: 'financial',
    },
  ];

  return (
    <StatsWithHeader
      badge="Our track record"
      title="Trusted by thousands of creators worldwide"
      subtitle="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis."
      stats={demoStats}
      theme="dark"
      variant="background"
      animated={true}
      countersEnabled={true}
      backgroundPattern="gradient"
      backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2850&q=80&blend=111827&blend-mode=multiply&sat=-100&exp=15"
      className={props.className}
    />
  );
};

export type { StatsWithHeaderProps, StatsWithHeaderDemoProps };
