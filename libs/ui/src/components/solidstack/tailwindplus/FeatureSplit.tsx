import { type Component, For, type JSX, createSignal, onMount } from 'solid-js';
import { css } from '../../styled-system/css';
import { BlurFade } from '../magicui/BlurFade';
import { BorderBeam } from '../magicui/BorderBeam';
import { DotPattern } from '../magicui/DotPattern';
import { TextAnimate } from '../magicui/TextAnimate';

export interface Feature {
  name: string;
  description: string;
  icon: string | (() => JSX.Element);
}

export interface FeatureSplitProps {
  className?: string;
  badge?: string;
  title: string;
  subtitle: string;
  features: Feature[];
  image?: {
    src: string;
    alt: string;
  };
  layout?: 'imageRight' | 'imageLeft';
  theme?: 'light' | 'dark';
  animated?: boolean;
  backgroundPattern?: 'dots' | 'none';
  imageOverlay?: boolean;
}

export const FeatureSplit: Component<FeatureSplitProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const [imageLoaded, setImageLoaded] = createSignal(false);

  const theme = () => props.theme ?? 'light';
  const layout = () => props.layout ?? 'imageRight';
  const animated = () => props.animated ?? true;
  const backgroundPattern = () => props.backgroundPattern ?? 'none';

  onMount(() => {
    setMounted(true);
    if (props.image?.src) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.src = props.image.src;
    } else {
      setImageLoaded(true);
    }
  });

  const containerStyles = css({
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme() === 'dark' ? '#111827' : '#ffffff',
    padding: '96px 0',
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

  const gridStyles = css({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '64px',
    alignItems: 'center',
    '@media (min-width: 1024px)': {
      gridTemplateColumns: layout() === 'imageLeft' ? '1fr 1fr' : '1fr 1fr',
      gap: '80px',
    },
    '@media (min-width: 640px)': {
      gap: '80px',
    },
  });

  const contentSectionStyles = css({
    order: layout() === 'imageLeft' ? 2 : 1,
    '@media (max-width: 1023px)': {
      order: 1,
    },
  });

  const imageSectionStyles = css({
    order: layout() === 'imageLeft' ? 1 : 2,
    '@media (max-width: 1023px)': {
      order: 2,
    },
    '@media (min-width: 1024px)': {
      paddingTop: '16px',
      paddingRight: layout() === 'imageLeft' ? '32px' : '0',
      paddingLeft: layout() === 'imageRight' ? '32px' : '0',
    },
  });

  const contentInnerStyles = css({
    '@media (min-width: 1024px)': {
      maxWidth: '512px',
    },
  });

  const badgeStyles = css({
    fontSize: '14px',
    lineHeight: '28px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#818cf8' : '#6366f1',
    marginBottom: '8px',
    display: 'block',
  });

  const titleStyles = css({
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: '600',
    letterSpacing: '-0.025em',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    marginBottom: '8px',
    '@media (min-width: 640px)': {
      fontSize: '40px',
      lineHeight: '48px',
    },
  });

  const subtitleStyles = css({
    fontSize: '18px',
    lineHeight: '32px',
    color: theme() === 'dark' ? '#d1d5db' : '#6b7280',
    marginBottom: '40px',
    '@media (min-width: 1024px)': {
      fontSize: '18px',
      lineHeight: '32px',
    },
  });

  const featuresListStyles = css({
    maxWidth: '640px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    fontSize: '14px',
    lineHeight: '28px',
    color: theme() === 'dark' ? '#d1d5db' : '#6b7280',
    '@media (min-width: 1024px)': {
      maxWidth: 'none',
    },
  });

  const featureItemStyles = css({
    position: 'relative',
    paddingLeft: '36px',
  });

  const featureIconStyles = css({
    position: 'absolute',
    top: '4px',
    left: '4px',
    width: '20px',
    height: '20px',
    color: theme() === 'dark' ? '#8b5cf6' : '#6366f1',
  });

  const featureNameStyles = css({
    display: 'inline',
    fontWeight: '600',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
  });

  const featureDescStyles = css({
    display: 'inline',
    marginLeft: '4px',
  });

  const imageContainerStyles = css({
    position: 'relative',
    width: '100%',
    maxWidth: 'none',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow:
      theme() === 'dark'
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1)',
    '@media (min-width: 640px)': {
      width: '912px',
    },
    '@media (min-width: 768px)': {
      marginLeft: '-16px',
    },
    '@media (min-width: 1024px)': {
      marginLeft: layout() === 'imageLeft' ? '0' : '-16px',
    },
  });

  const imageStyles = css({
    width: '100%',
    height: 'auto',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    _hover: {
      transform: 'scale(1.02)',
    },
  });

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

  const ArrowPathIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5">
      <path
        fill-rule="evenodd"
        d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const FingerPrintIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5">
      <path
        fill-rule="evenodd"
        d="M6.75 2.75A.75.75 0 017.5 2h5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3.5h-3.5v.75a.75.75 0 01-1.5 0v-1.5zM12 5.5a1 1 0 00-1-1H9a1 1 0 00-1 1v4a1 1 0 001 1h2a1 1 0 001-1v-4zM9 6.5h2v3H9v-3zM6.25 12a.75.75 0 01.75-.75h6a.75.75 0 010 1.5H7a.75.75 0 01-.75-.75zM6.25 14.5a.75.75 0 01.75-.75h6a.75.75 0 010 1.5H7a.75.75 0 01-.75-.75z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const CogIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5">
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

      <div class={innerContainerStyles}>
        <div class={gridStyles}>
          {/* Content Section */}
          <div class={contentSectionStyles}>
            <div class={contentInnerStyles}>
              {props.badge && mounted() && animated() ? (
                <BlurFade delay={0.1}>
                  <div class={badgeStyles}>{props.badge}</div>
                </BlurFade>
              ) : props.badge ? (
                <div class={badgeStyles}>{props.badge}</div>
              ) : null}

              {mounted() && animated() ? (
                <TextAnimate
                  text={props.title}
                  className={titleStyles}
                  animation="slideUp"
                  staggerChildren={0.08}
                  delay={0.2}
                />
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

              <dl class={featuresListStyles}>
                <For each={props.features}>
                  {(feature, index) =>
                    mounted() && animated() ? (
                      <BlurFade delay={0.7 + index() * 0.1}>
                        <div class={featureItemStyles}>
                          <dt class={featureNameStyles}>
                            <div class={featureIconStyles}>{getIconComponent(feature.icon)}</div>
                            {feature.name}
                          </dt>
                          <dd class={featureDescStyles}>{feature.description}</dd>
                        </div>
                      </BlurFade>
                    ) : (
                      <div class={featureItemStyles}>
                        <dt class={featureNameStyles}>
                          <div class={featureIconStyles}>{getIconComponent(feature.icon)}</div>
                          {feature.name}
                        </dt>
                        <dd class={featureDescStyles}>{feature.description}</dd>
                      </div>
                    )
                  }
                </For>
              </dl>
            </div>
          </div>

          {/* Image Section */}
          {props.image && (
            <div class={imageSectionStyles}>
              {mounted() && animated() ? (
                <BlurFade delay={0.8}>
                  <div class={imageContainerStyles}>
                    <img
                      src={props.image.src}
                      alt={props.image.alt}
                      class={imageStyles}
                      onLoad={() => setImageLoaded(true)}
                    />
                    {props.imageOverlay && <BorderBeam size={300} duration={15} />}
                  </div>
                </BlurFade>
              ) : (
                <div class={imageContainerStyles}>
                  <img
                    src={props.image.src}
                    alt={props.image.alt}
                    class={imageStyles}
                    onLoad={() => setImageLoaded(true)}
                  />
                  {props.imageOverlay && <BorderBeam size={300} duration={15} />}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureSplit;
