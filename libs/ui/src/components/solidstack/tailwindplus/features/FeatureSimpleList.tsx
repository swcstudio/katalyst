import { type Component, For, type JSX, createEffect, createSignal, onMount } from 'solid-js';
import { css } from '../../../../styled-system/css';
import { BlurFade } from '../../magicui/BlurFade';
import { DotPattern } from '../../magicui/DotPattern';
import { TextAnimate } from '../../magicui/TextAnimate';
import { useFeatureSection } from './state/useFeatureSection';

export interface Feature {
  name: string;
  description: string;
  icon?: string | (() => JSX.Element);
  id?: string;
}

export interface FeatureSimpleListProps {
  className?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  features: Feature[];
  theme?: 'light' | 'dark';
  animated?: boolean;
  backgroundPattern?: 'dots' | 'none';
  layout?: 'single' | 'two-column' | 'three-column';
  showIcons?: boolean;
  iconStyle?: 'check' | 'custom';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  alignment?: 'left' | 'center';
  onFeatureClick?: (feature: Feature) => void;
}

export const FeatureSimpleList: Component<FeatureSimpleListProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const featureSection = useFeatureSection();

  const theme = () => props.theme ?? 'light';
  const animated = () => props.animated ?? true;
  const backgroundPattern = () => props.backgroundPattern ?? 'none';
  const layout = () => props.layout ?? 'single';
  const showIcons = () => props.showIcons ?? true;
  const iconStyle = () => props.iconStyle ?? 'check';
  const maxWidth = () => props.maxWidth ?? 'lg';
  const alignment = () => props.alignment ?? 'left';

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
    '@media (min-width: 640px)': {
      padding: '128px 0',
    },
  });

  const innerContainerStyles = css({
    maxWidth:
      maxWidth() === 'sm'
        ? '640px'
        : maxWidth() === 'md'
          ? '768px'
          : maxWidth() === 'lg'
            ? '1024px'
            : maxWidth() === 'xl'
              ? '1280px'
              : '100%',
    margin: '0 auto',
    padding: '0 24px',
    '@media (min-width: 1024px)': {
      padding: '0 32px',
    },
  });

  const headerStyles = css({
    maxWidth: '896px',
    margin: alignment() === 'center' ? '0 auto' : '0',
    textAlign: alignment() === 'center' ? 'center' : 'left',
    marginBottom: '64px',
    '@media (min-width: 1024px)': {
      marginBottom: '96px',
    },
  });

  const badgeStyles = css({
    fontSize: '14px',
    lineHeight: '28px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#818cf8' : '#6366f1',
    marginBottom: '16px',
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
    marginBottom: props.subtitle ? '24px' : '0',
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
    '@media (min-width: 1024px)': {
      fontSize: '20px',
      lineHeight: '32px',
    },
  });

  const featuresContainerStyles = css({
    display: 'grid',
    gridTemplateColumns: layout() === 'single' ? '1fr' : layout() === 'two-column' ? '1fr' : '1fr',
    gap: '32px',
    '@media (min-width: 640px)': {
      gridTemplateColumns:
        layout() === 'two-column'
          ? 'repeat(2, 1fr)'
          : layout() === 'three-column'
            ? 'repeat(2, 1fr)'
            : '1fr',
      gap: '40px 48px',
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns:
        layout() === 'three-column'
          ? 'repeat(3, 1fr)'
          : layout() === 'two-column'
            ? 'repeat(2, 1fr)'
            : '1fr',
      gap: '48px 64px',
    },
  });

  const featureItemStyles = css({
    position: 'relative',
    paddingLeft: showIcons() ? '32px' : '0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  });

  const checkIconStyles = css({
    position: 'absolute',
    top: '4px',
    left: '0',
    width: '20px',
    height: '20px',
    color: theme() === 'dark' ? '#10b981' : '#10b981',
  });

  const customIconStyles = css({
    position: 'absolute',
    top: '4px',
    left: '0',
    width: '20px',
    height: '20px',
    color: theme() === 'dark' ? '#8b5cf6' : '#6366f1',
  });

  const featureNameStyles = css({
    fontSize: '16px',
    lineHeight: '28px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    marginBottom: '8px',
    display: 'block',
  });

  const featureDescStyles = css({
    fontSize: '16px',
    lineHeight: '24px',
    color: theme() === 'dark' ? '#d1d5db' : '#6b7280',
  });

  const CheckIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5">
      <path
        fill-rule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const CloudIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5">
      <path
        fill-rule="evenodd"
        d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const LockIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5">
      <path
        fill-rule="evenodd"
        d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const ServerIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5">
      <path
        fill-rule="evenodd"
        d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z"
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
    };

    return iconMap[icon] ? iconMap[icon]() : CloudIcon();
  };

  const getIconStyles = () => {
    if (iconStyle() === 'check') {
      return checkIconStyles;
    }
    return customIconStyles;
  };

  const renderIcon = (feature: Feature) => {
    if (!showIcons()) return null;

    if (iconStyle() === 'check') {
      return (
        <div class={getIconStyles()}>
          <CheckIcon />
        </div>
      );
    }

    if (feature.icon) {
      return <div class={getIconStyles()}>{getIconComponent(feature.icon)}</div>;
    }

    return null;
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

          {props.subtitle &&
            (mounted() && animated() ? (
              <BlurFade delay={0.5}>
                <p class={subtitleStyles}>{props.subtitle}</p>
              </BlurFade>
            ) : (
              <p class={subtitleStyles}>{props.subtitle}</p>
            ))}
        </div>

        <dl class={featuresContainerStyles}>
          <For each={props.features}>
            {(feature, index) => {
              const featureId = feature.id || feature.name;
              const isHovered = featureSection.isFeatureHovered(featureId);

              return mounted() && animated() ? (
                <BlurFade delay={0.7 + index() * 0.1}>
                  <div
                    class={featureItemStyles}
                    data-feature-id={featureId}
                    onClick={() => handleFeatureClick(feature)}
                    onMouseEnter={() => handleFeatureHover(feature)}
                    onMouseLeave={handleFeatureUnhover}
                    style={{
                      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    }}
                  >
                    {renderIcon(feature)}
                    <dt class={featureNameStyles}>{feature.name}</dt>
                    <dd class={featureDescStyles}>{feature.description}</dd>
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
                  {renderIcon(feature)}
                  <dt class={featureNameStyles}>{feature.name}</dt>
                  <dd class={featureDescStyles}>{feature.description}</dd>
                </div>
              );
            }}
          </For>
        </dl>
      </div>
    </div>
  );
};

export default FeatureSimpleList;
