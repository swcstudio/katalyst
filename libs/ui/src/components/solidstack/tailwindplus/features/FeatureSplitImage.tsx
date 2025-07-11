import { type Component, For, type JSX, createEffect, createSignal, onMount } from 'solid-js';
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
  icon: string | (() => JSX.Element);
  id?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  avatar?: string;
}

export interface FeatureSplitImageProps {
  className?: string;
  badge?: string;
  title: string;
  subtitle: string;
  features?: Feature[];
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  imagePosition?: 'left' | 'right';
  theme?: 'light' | 'dark';
  animated?: boolean;
  backgroundPattern?: 'dots' | 'warp' | 'none';
  showCTA?: boolean;
  ctaText?: string;
  ctaHref?: string;
  testimonial?: Testimonial;
  imageOverlay?: boolean;
  imageBackground?: 'none' | 'gradient' | 'card';
  contentAlignment?: 'left' | 'center';
  onFeatureClick?: (feature: Feature) => void;
}

export const FeatureSplitImage: Component<FeatureSplitImageProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const [imageLoaded, setImageLoaded] = createSignal(false);
  const featureSection = useFeatureSection();

  const theme = () => props.theme ?? 'light';
  const animated = () => props.animated ?? true;
  const backgroundPattern = () => props.backgroundPattern ?? 'none';
  const imagePosition = () => props.imagePosition ?? 'right';
  const showCTA = () => props.showCTA ?? false;
  const imageBackground = () => props.imageBackground ?? 'none';
  const contentAlignment = () => props.contentAlignment ?? 'left';

  onMount(() => {
    setMounted(true);
    featureSection.mount();

    // Preload image
    if (props.image?.src) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.src = props.image.src;
    } else {
      setImageLoaded(true);
    }

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
    '@media (min-width: 768px)': {
      padding: '0 24px',
    },
    '@media (min-width: 1024px)': {
      padding: '0 32px',
    },
  });

  const gridContainerStyles = css({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '64px 32px',
    alignItems: 'start',
    '@media (min-width: 640px)': {
      gap: '80px 32px',
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: '1fr 1fr',
      gap: '96px 64px',
      alignItems: 'center',
    },
  });

  const contentAreaStyles = css({
    order: imagePosition() === 'right' ? 1 : 2,
    '@media (min-width: 1024px)': {
      paddingTop: '16px',
      paddingRight: imagePosition() === 'right' ? '16px' : '0',
      paddingLeft: imagePosition() === 'left' ? '16px' : '0',
    },
  });

  const imageAreaStyles = css({
    order: imagePosition() === 'right' ? 2 : 1,
    '@media (min-width: 1024px)': {
      order: imagePosition() === 'right' ? 2 : 1,
    },
  });

  const contentInnerStyles = css({
    maxWidth: '672px',
    margin: contentAlignment() === 'center' ? '0 auto' : '0',
    '@media (min-width: 1024px)': {
      margin: '0',
      maxWidth: '576px',
    },
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
    textAlign: contentAlignment() === 'center' ? 'center' : 'left',
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
    marginBottom: '24px',
    textAlign: contentAlignment() === 'center' ? 'center' : 'left',
    '@media (min-width: 1024px)': {
      fontSize: '20px',
      lineHeight: '32px',
    },
  });

  const ctaContainerStyles = css({
    marginTop: '32px',
    textAlign: contentAlignment() === 'center' ? 'center' : 'left',
  });

  const featuresListStyles = css({
    marginTop: '40px',
    maxWidth: '640px',
    '@media (min-width: 1024px)': {
      maxWidth: 'none',
    },
  });

  const featureItemStyles = css({
    position: 'relative',
    paddingLeft: '36px',
    marginBottom: '32px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateX(4px)',
    },
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
    fontSize: '16px',
    lineHeight: '28px',
  });

  const featureDescStyles = css({
    display: 'inline',
    marginLeft: '4px',
    color: theme() === 'dark' ? '#d1d5db' : '#6b7280',
    fontSize: '16px',
    lineHeight: '28px',
  });

  const testimonialStyles = css({
    marginTop: '64px',
    borderTop: theme() === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
    paddingTop: '24px',
    textAlign: contentAlignment() === 'center' ? 'center' : 'left',
  });

  const testimonialQuoteStyles = css({
    fontSize: '16px',
    lineHeight: '28px',
    color: theme() === 'dark' ? '#d1d5db' : '#6b7280',
    fontStyle: 'italic',
    marginBottom: '24px',
  });

  const testimonialAuthorStyles = css({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    justifyContent: contentAlignment() === 'center' ? 'center' : 'flex-start',
  });

  const authorAvatarStyles = css({
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    flexShrink: 0,
  });

  const authorInfoStyles = css({
    fontSize: '14px',
    lineHeight: '24px',
  });

  const authorNameStyles = css({
    fontWeight: '600',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
  });

  const authorTitleStyles = css({
    color: theme() === 'dark' ? '#d1d5db' : '#6b7280',
  });

  const imageContainerStyles = css({
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: imagePosition() === 'left' ? 'flex-start' : 'flex-end',
  });

  const imageWrapperStyles = css({
    position: 'relative',
    width: '100%',
    maxWidth: 'none',
    borderRadius: imageBackground() === 'card' ? '12px' : '0',
    overflow: 'hidden',
    boxShadow:
      imageBackground() === 'card'
        ? theme() === 'dark'
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1)'
        : 'none',
    '@media (min-width: 640px)': {
      maxWidth: '896px',
    },
    '@media (min-width: 1024px)': {
      maxWidth: 'none',
    },
  });

  const imageStyles = css({
    width: '100%',
    height: 'auto',
    display: 'block',
  });

  const gradientImageWrapperStyles = css({
    position: 'relative',
    borderRadius: '24px',
    padding: '32px',
    background:
      imageBackground() === 'gradient'
        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
        : 'transparent',
    '@media (min-width: 640px)': {
      padding: '64px',
      borderRadius: '32px',
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

  const renderImage = () => {
    if (imageBackground() === 'gradient') {
      return (
        <div class={gradientImageWrapperStyles}>
          <div class={imageWrapperStyles} style={{ position: 'relative' }}>
            <img
              src={props.image.src}
              alt={props.image.alt}
              width={props.image.width || 2432}
              height={props.image.height || 1442}
              class={imageStyles}
              onLoad={() => setImageLoaded(true)}
            />
            {props.imageOverlay && <BorderBeam size={400} duration={20} />}
          </div>
        </div>
      );
    }

    return (
      <div class={imageWrapperStyles} style={{ position: 'relative' }}>
        <img
          src={props.image.src}
          alt={props.image.alt}
          width={props.image.width || 2432}
          height={props.image.height || 1442}
          class={imageStyles}
          onLoad={() => setImageLoaded(true)}
        />
        {props.imageOverlay && <BorderBeam size={400} duration={20} />}
      </div>
    );
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
        <div class={gridContainerStyles}>
          <div class={contentAreaStyles}>
            <div class={contentInnerStyles}>
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

              {props.features && props.features.length > 0 && (
                <dl class={featuresListStyles}>
                  <For each={props.features}>
                    {(feature, index) => {
                      const featureId = feature.id || feature.name;
                      const isHovered = featureSection.isFeatureHovered(featureId);

                      return mounted() && animated() ? (
                        <BlurFade delay={0.9 + index() * 0.1}>
                          <div
                            class={featureItemStyles}
                            data-feature-id={featureId}
                            onClick={() => handleFeatureClick(feature)}
                            onMouseEnter={() => handleFeatureHover(feature)}
                            onMouseLeave={handleFeatureUnhover}
                            style={{
                              transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
                            }}
                          >
                            <dt class={featureNameStyles}>
                              <div class={featureIconStyles}>{getIconComponent(feature.icon)}</div>
                              {feature.name}
                            </dt>
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
                          <dt class={featureNameStyles}>
                            <div class={featureIconStyles}>{getIconComponent(feature.icon)}</div>
                            {feature.name}
                          </dt>
                          <dd class={featureDescStyles}>{feature.description}</dd>
                        </div>
                      );
                    }}
                  </For>
                </dl>
              )}

              {props.testimonial && (
                <figure class={testimonialStyles}>
                  {mounted() && animated() ? (
                    <BlurFade delay={1.4}>
                      <blockquote>
                        <p class={testimonialQuoteStyles}>"{props.testimonial.quote}"</p>
                      </blockquote>
                      <figcaption class={testimonialAuthorStyles}>
                        {props.testimonial.avatar && (
                          <img src={props.testimonial.avatar} alt="" class={authorAvatarStyles} />
                        )}
                        <div class={authorInfoStyles}>
                          <div class={authorNameStyles}>{props.testimonial.author}</div>
                          <div class={authorTitleStyles}>{props.testimonial.title}</div>
                        </div>
                      </figcaption>
                    </BlurFade>
                  ) : (
                    <>
                      <blockquote>
                        <p class={testimonialQuoteStyles}>"{props.testimonial.quote}"</p>
                      </blockquote>
                      <figcaption class={testimonialAuthorStyles}>
                        {props.testimonial.avatar && (
                          <img src={props.testimonial.avatar} alt="" class={authorAvatarStyles} />
                        )}
                        <div class={authorInfoStyles}>
                          <div class={authorNameStyles}>{props.testimonial.author}</div>
                          <div class={authorTitleStyles}>{props.testimonial.title}</div>
                        </div>
                      </figcaption>
                    </>
                  )}
                </figure>
              )}
            </div>
          </div>

          <div class={imageAreaStyles}>
            <div class={imageContainerStyles}>
              {mounted() && animated() ? (
                <BlurFade delay={0.8}>{renderImage()}</BlurFade>
              ) : (
                renderImage()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSplitImage;
