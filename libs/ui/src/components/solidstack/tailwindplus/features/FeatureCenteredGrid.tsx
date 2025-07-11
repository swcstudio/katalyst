import { type Component, createEffect, createSignal, For, type JSX, onMount } from 'solid-js';
import { css } from '../../../../styled-system/css';
import { BlurFade } from '../../magicui/BlurFade';
import { BorderBeam } from '../../magicui/BorderBeam';
import { DotPattern } from '../../magicui/DotPattern';
import { ShimmerButton } from '../../magicui/ShimmerButton';
import { TextAnimate } from '../../magicui/TextAnimate';
import { WarpBackground } from '../../magicui/WarpBackground';
import { useFeatureSection } from './state/useFeatureSection';

export interface Feature {
  name: string;
  description: string;
  href?: string;
  icon: string | (() => JSX.Element);
  id?: string;
}

export interface FeatureCenteredGridProps {
  className?: string;
  badge?: string;
  title: string;
  subtitle: string;
  features: Feature[];
  theme?: 'light' | 'dark';
  animated?: boolean;
  backgroundPattern?: 'dots' | 'warp' | 'none';
  iconStyle?: 'solid' | 'outlined' | 'gradient';
  gridColumns?: 1 | 2 | 3 | 4;
  showCTA?: boolean;
  ctaText?: string;
  ctaHref?: string;
  onFeatureClick?: (feature: Feature) => void;
}

export const FeatureCenteredGrid: Component<FeatureCenteredGridProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const featureSection = useFeatureSection();

  const theme = () => props.theme ?? 'light';
  const animated = () => props.animated ?? true;
  const backgroundPattern = () => props.backgroundPattern ?? 'none';
  const iconStyle = () => props.iconStyle ?? 'solid';
  const gridColumns = () => props.gridColumns ?? 3;
  const showCTA = () => props.showCTA ?? false;

  onMount(() => {
    setMounted(true);
    featureSection.mount();

    // Start animations after mount
    if (animated()) {
      setTimeout(() => {
        featureSection.startAnimation();
      }, 100);
    }
  });

  // Sync theme with state machine
  createEffect(() => {
    if (featureSection.getTheme() !== theme()) {
      featureSection.toggleTheme();
    }
  });

  const containerStyles = css({
    position: 'relative',
    backgroundColor: theme() === 'dark' ? '#111827' : '#ffffff',
    padding: '96px 0',
    overflow: 'hidden',
    '@media (min-width: 640px)': {
      padding: '128px 0',
    },
  });

  const innerContainerStyles = css({
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    '@media (min-width: 1024px)': {
      padding: '0 32px',
    },
  });

  const headerStyles = css({
    maxWidth: '896px',
    margin: '0 auto',
    textAlign: 'center',
  });

  const badgeStyles = css({
    fontSize: '14px',
    lineHeight: '28px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#818cf8' : '#6366f1',
    marginBottom: '8px',
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '9999px',
    backgroundColor: theme() === 'dark' ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.1)',
    border:
      theme() === 'dark'
        ? '1px solid rgba(129, 140, 248, 0.2)'
        : '1px solid rgba(99, 102, 241, 0.2)',
  });

  const titleStyles = css({
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: '600',
    letterSpacing: '-0.025em',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    marginBottom: '24px',
    '@media (min-width: 640px)': {
      fontSize: '40px',
      lineHeight: '48px',
    },
    '@media (min-width: 1024px)': {
      fontSize: '48px',
      lineHeight: '56px',
      textWrap: 'balance',
    },
  });

  const subtitleStyles = css({
    fontSize: '18px',
    lineHeight: '32px',
    color: theme() === 'dark' ? '#d1d5db' : '#6b7280',
    marginBottom: showCTA() ? '32px' : '64px',
    '@media (min-width: 1024px)': {
      fontSize: '20px',
      lineHeight: '32px',
    },
  });

  const ctaContainerStyles = css({
    marginBottom: '64px',
  });

  const featuresContainerStyles = css({
    maxWidth: '1280px',
    margin: '0 auto',
  });

  const featuresGridStyles = css({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '40px 32px',
    '@media (min-width: 640px)': {
      gridTemplateColumns: gridColumns() >= 2 ? 'repeat(2, 1fr)' : '1fr',
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: `repeat(${gridColumns()}, 1fr)`,
      gap: '64px 32px',
    },
  });

  const featureItemStyles = css({
    position: 'relative',
    textAlign: 'center',
    padding: '32px 24px',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      backgroundColor: theme() === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      boxShadow:
        theme() === 'dark'
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
          : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
  });

  const iconContainerStyles = css({
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'center',
  });

  const solidIconStyles = css({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: theme() === 'dark' ? '#6366f1' : '#6366f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  });

  const outlinedIconStyles = css({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    border: theme() === 'dark' ? '2px solid #6366f1' : '2px solid #6366f1',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme() === 'dark' ? '#6366f1' : '#6366f1',
    fontSize: '24px',
  });

  const gradientIconStyles = css({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '24px',
    position: 'relative',
    overflow: 'hidden',
  });

  const featureNameStyles = css({
    fontSize: '18px',
    lineHeight: '28px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    marginBottom: '12px',
  });

  const featureDescStyles = css({
    fontSize: '16px',
    lineHeight: '24px',
    color: theme() === 'dark' ? '#d1d5db' : '#6b7280',
  });

  const CloudIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
      <path
        fill-rule="evenodd"
        d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const LockIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
      <path
        fill-rule="evenodd"
        d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const ServerIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
      <path
        fill-rule="evenodd"
        d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const ArrowPathIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
      <path
        fill-rule="evenodd"
        d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const FingerPrintIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
      <path
        fill-rule="evenodd"
        d="M6.75 2.75A.75.75 0 017.5 2h5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3.5h-3.5v.75a.75.75 0 01-1.5 0v-1.5zM12 5.5a1 1 0 00-1-1H9a1 1 0 00-1 1v4a1 1 0 001 1h2a1 1 0 001-1v-4zM9 6.5h2v3H9v-3zM6.25 12a.75.75 0 01.75-.75h6a.75.75 0 010 1.5H7a.75.75 0 01-.75-.75zM6.25 14.5a.75.75 0 01.75-.75h6a.75.75 0 010 1.5H7a.75.75 0 01-.75-.75z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const CogIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
      <path
        fill-rule="evenodd"
        d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.205 1.251l-1.18 2.044a1 1 0 01-1.186.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.205-1.251l1.18-2.044a1 1 0 011.186-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const getIconComponent = (icon: string | (() => JSX.Element)) => {
    if (typeof icon === 'function') {
      return icon();
    }

    const iconMap: Record<string, () => JSX.Element> = {
      cloud: CloudIcon,
      lock: LockIcon,
      server: ServerIcon,
      'arrow-path': ArrowPathIcon,
      fingerprint: FingerPrintIcon,
      cog: CogIcon,
    };

    return iconMap[icon] ? iconMap[icon]() : CloudIcon();
  };

  const getIconStyles = () => {
    switch (iconStyle()) {
      case 'outlined':
        return outlinedIconStyles;
      case 'gradient':
        return gradientIconStyles;
      default:
        return solidIconStyles;
    }
  };

  const handleFeatureClick = (feature: Feature) => {
    featureSection.clickFeature(feature.id || feature.name);
    props.onFeatureClick?.(feature);
  };

  const handleFeatureHover = (feature: Feature) => {
    featureSection.hoverFeature(feature.id || feature.name);
  };

  const handleFeatureUnhover = () => {
    featureSection.unhoverFeature();
  };

  return (
    <div class={`${containerStyles} ${props.className || ''}`}>
      {backgroundPattern() === 'dots' && (
        <DotPattern
          className={
            theme() === 'dark'
              ? '[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]'
              : '[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]'
          }
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          fill={theme() === 'dark' ? '#374151' : '#e5e7eb'}
        />
      )}

      {backgroundPattern() === 'warp' && (
        <WarpBackground
          className={css({ position: 'absolute', inset: 0, zIndex: 0 })}
          intensity={0.3}
          speed={0.5}
        />
      )}

      <div class={innerContainerStyles} style={{ position: 'relative', 'z-index': 1 }}>
        <div class={headerStyles}>
          {props.badge && mounted() && animated() ? (
            <BlurFade delay={0.1}>
              <div class={badgeStyles}>{props.badge}</div>
            </BlurFade>
          ) : props.badge ? (
            <div class={badgeStyles}>{props.badge}</div>
          ) : null}

          {mounted() && animated() ? (
            <TextAnimate class={titleStyles} animation="slideUp" delay={0.2}>
              {props.title}
            </TextAnimate>
          ) : (
            <h2 class={titleStyles}>{props.title}</h2>
          )}

          {mounted() && animated() ? (
            <BlurFade delay={0.5}>
              <p class={subtitleStyles}>{props.subtitle}</p>
            </BlurFade>
          ) : (
            <p class={subtitleStyles}>{props.subtitle}</p>
          )}

          {showCTA() && (
            <div class={ctaContainerStyles}>
              {mounted() && animated() ? (
                <BlurFade delay={0.7}>
                  <a href={props.ctaHref || '#'}>
                    <ShimmerButton
                      class={css({
                        padding: '12px 24px',
                        fontSize: '16px',
                        fontWeight: '600',
                      })}
                    >
                      {props.ctaText || 'Get Started'}
                    </ShimmerButton>
                  </a>
                </BlurFade>
              ) : (
                <a
                  href={props.ctaHref || '#'}
                  class={css({
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '12px 24px',
                    backgroundColor: '#6366f1',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#5b5bd6',
                      transform: 'translateY(-1px)',
                    },
                  })}
                >
                  {props.ctaText || 'Get Started'}
                </a>
              )}
            </div>
          )}
        </div>

        <div class={featuresContainerStyles}>
          <dl class={featuresGridStyles}>
            <For each={props.features}>
              {(feature, index) => {
                const featureId = feature.id || feature.name;
                const isHovered = featureSection.isFeatureHovered(featureId);
                const isActive = featureSection.isFeatureActive(featureId);

                return mounted() && animated() ? (
                  <BlurFade delay={0.9 + index() * 0.1}>
                    <div
                      class={featureItemStyles}
                      data-feature-id={featureId}
                      onClick={() => handleFeatureClick(feature)}
                      onMouseEnter={() => handleFeatureHover(feature)}
                      onMouseLeave={handleFeatureUnhover}
                      style={{
                        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                        'box-shadow': isHovered
                          ? theme() === 'dark'
                            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.3)'
                            : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(99, 102, 241, 0.2)'
                          : 'none',
                      }}
                    >
                      <dt>
                        <div class={iconContainerStyles}>
                          <div class={getIconStyles()} style={{ position: 'relative' }}>
                            {getIconComponent(feature.icon)}
                            {iconStyle() === 'gradient' && isHovered && (
                              <BorderBeam size={60} duration={3} />
                            )}
                          </div>
                        </div>
                        <div class={featureNameStyles}>{feature.name}</div>
                      </dt>
                      <dd class={featureDescStyles}>{feature.description}</dd>
                      {feature.href && (
                        <div style={{ 'margin-top': '16px' }}>
                          <a
                            href={feature.href}
                            class={css({
                              fontSize: '14px',
                              fontWeight: '600',
                              color: theme() === 'dark' ? '#818cf8' : '#6366f1',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            })}
                          >
                            Learn more →
                          </a>
                        </div>
                      )}
                    </div>
                  </BlurFade>
                ) : (
                  <div
                    class={featureItemStyles}
                    data-feature-id={featureId}
                    onClick={() => handleFeatureClick(feature)}
                    onMouseEnter={() => handleFeatureHover(feature)}
                    onMouseLeave={handleFeatureUnhover}
                  >
                    <dt>
                      <div class={iconContainerStyles}>
                        <div class={getIconStyles()}>{getIconComponent(feature.icon)}</div>
                      </div>
                      <div class={featureNameStyles}>{feature.name}</div>
                    </dt>
                    <dd class={featureDescStyles}>{feature.description}</dd>
                    {feature.href && (
                      <div style={{ 'margin-top': '16px' }}>
                        <a
                          href={feature.href}
                          class={css({
                            fontSize: '14px',
                            fontWeight: '600',
                            color: theme() === 'dark' ? '#818cf8' : '#6366f1',
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          })}
                        >
                          Learn more →
                        </a>
                      </div>
                    )}
                  </div>
                );
              }}
            </For>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FeatureCenteredGrid;
