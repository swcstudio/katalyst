import { type Component, createSignal, JSX, onMount } from 'solid-js';
import { css } from '../../styled-system/css';
import { BlurFade } from '../magicui/BlurFade';
import { BorderBeam } from '../magicui/BorderBeam';
import { DotPattern } from '../magicui/DotPattern';
import { TextAnimate } from '../magicui/TextAnimate';

export interface FeatureSimpleProps {
  className?: string;
  title: string;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  theme?: 'light' | 'dark';
  animated?: boolean;
  backgroundPattern?: 'dots' | 'none';
  imageOverlay?: boolean;
  maxWidth?: '2xl' | '4xl' | '6xl' | '7xl';
}

export const FeatureSimple: Component<FeatureSimpleProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const [imageLoaded, setImageLoaded] = createSignal(false);

  const theme = () => props.theme ?? 'light';
  const animated = () => props.animated ?? true;
  const backgroundPattern = () => props.backgroundPattern ?? 'none';
  const maxWidth = () => props.maxWidth ?? '7xl';

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
    maxWidth:
      maxWidth() === '2xl'
        ? '672px'
        : maxWidth() === '4xl'
          ? '896px'
          : maxWidth() === '6xl'
            ? '1152px'
            : '1280px',
    margin: '0 auto',
    padding: '0 24px',
    '@media (min-width: 1024px)': {
      padding: '0 32px',
    },
  });

  const titleStyles = css({
    maxWidth: '896px',
    fontSize: '40px',
    lineHeight: '48px',
    fontWeight: '600',
    letterSpacing: '-0.025em',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    '@media (min-width: 640px)': {
      fontSize: '48px',
      lineHeight: '56px',
    },
    '@media (min-width: 640px) and (max-width: 1279px)': {
      fontSize: '56px',
      lineHeight: '64px',
      textWrap: 'balance',
    },
  });

  const imageContainerStyles = css({
    position: 'relative',
    marginTop: '64px',
    aspectRatio: '2432/1442',
    height: '576px',
    '@media (min-width: 640px)': {
      height: 'auto',
      width: `calc(${maxWidth() === '7xl' ? '1280px' : maxWidth() === '6xl' ? '1152px' : maxWidth() === '4xl' ? '896px' : '672px'} - 64px)`,
    },
  });

  const imageWrapperStyles = css({
    position: 'absolute',
    inset: '-8px',
    borderRadius: 'calc(12px + 8px)',
    boxShadow:
      theme() === 'dark'
        ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), inset 0 0 2px 1px rgba(255, 255, 255, 0.025)'
        : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    backgroundColor: theme() === 'dark' ? 'rgba(255, 255, 255, 0.025)' : 'transparent',
    '@media (min-width: 640px)': {
      borderRadius: 'calc(12px + 8px)',
      backgroundColor: theme() === 'dark' ? 'rgba(255, 255, 255, 0.025)' : 'rgba(255, 255, 255, 1)',
      boxShadow:
        theme() === 'dark'
          ? 'inset 0 0 2px 1px rgba(255, 255, 255, 0.025), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    },
  });

  const imageStyles = css({
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: '12px',
    objectFit: 'cover',
    boxShadow:
      theme() === 'dark'
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    _hover: {
      transform: 'scale(1.02)',
    },
  });

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

        {props.image && (
          <div class={imageContainerStyles}>
            {mounted() && animated() ? (
              <BlurFade delay={0.6}>
                <div class={imageWrapperStyles}>
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
              </BlurFade>
            ) : (
              <div class={imageWrapperStyles}>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureSimple;
