import { type Component, For, JSX, createSignal, onMount } from 'solid-js';
import { css } from '../../styled-system/css';
import { AnimatedGradientText } from '../magicui/AnimatedGradientText';
import { BlurFade } from '../magicui/BlurFade';
import { BorderBeam } from '../magicui/BorderBeam';
import { DotPattern } from '../magicui/DotPattern';
import { ShimmerButton } from '../magicui/ShimmerButton';
import { TextAnimate } from '../magicui/TextAnimate';
import { WarpBackground } from '../magicui/WarpBackground';
import { useNavigation } from './hooks/useNavigation';

export interface NavigationItem {
  name: string;
  href: string;
}

export interface HeroSplitProps {
  className?: string;
  navigation?: NavigationItem[];
  logo?: {
    src: string;
    alt: string;
  };
  announcement?: {
    text: string;
    linkText: string;
    href: string;
    badge?: string;
  };
  title: string;
  subtitle: string;
  primaryButton: {
    text: string;
    href: string;
  };
  secondaryButton?: {
    text: string;
    href: string;
  };
  image?: {
    src: string;
    alt: string;
  };
  video?: {
    thumbnail: string;
    title: string;
  };
  stats?: Array<{
    value: string;
    label: string;
  }>;
  layout?: 'imageRight' | 'imageLeft' | 'videoRight';
  backgroundPattern?: 'dots' | 'warp' | 'grid' | 'none';
  theme?: 'light' | 'dark';
  animated?: boolean;
}

export const HeroSplit: Component<HeroSplitProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const [imageLoaded, setImageLoaded] = createSignal(false);
  const nav = useNavigation();

  const theme = () => props.theme ?? 'light';
  const layout = () => props.layout ?? 'imageRight';
  const backgroundPattern = () => props.backgroundPattern ?? 'none';
  const animated = () => props.animated ?? true;

  const navigation = () =>
    props.navigation ?? [
      { name: 'Product', href: '#' },
      { name: 'Features', href: '#' },
      { name: 'Marketplace', href: '#' },
      { name: 'Company', href: '#' },
    ];

  onMount(() => {
    setMounted(true);
    // Preload image for smooth animation
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
    minHeight: '100vh',
    backgroundColor: theme() === 'dark' ? '#0f172a' : '#ffffff',
    overflow: 'hidden',
  });

  const headerStyles = css({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: nav.isScrolled()
      ? theme() === 'dark'
        ? 'rgba(15, 23, 42, 0.95)'
        : 'rgba(255, 255, 255, 0.95)'
      : 'transparent',
    backdropFilter: nav.isScrolled() ? 'blur(12px)' : 'none',
    borderBottom: nav.isScrolled()
      ? `1px solid ${theme() === 'dark' ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.5)'}`
      : 'none',
  });

  const navStyles = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    maxWidth: '1400px',
    margin: '0 auto',
    '@media (min-width: 1024px)': {
      padding: '24px 32px',
    },
  });

  const logoStyles = css({
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.2s ease',
    _hover: {
      transform: 'scale(1.05)',
    },
    '& img': {
      height: '32px',
      width: 'auto',
      filter: theme() === 'dark' ? 'brightness(1.2)' : 'none',
    },
  });

  const mobileMenuButtonStyles = css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: theme() === 'dark' ? '#cbd5e1' : '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    _hover: {
      backgroundColor: theme() === 'dark' ? 'rgba(71, 85, 105, 0.4)' : 'rgba(248, 250, 252, 0.8)',
      color: theme() === 'dark' ? '#ffffff' : '#0f172a',
      transform: 'scale(1.05)',
    },
    '@media (min-width: 1024px)': {
      display: 'none',
    },
  });

  const desktopNavStyles = css({
    display: 'none',
    alignItems: 'center',
    gap: '40px',
    '@media (min-width: 1024px)': {
      display: 'flex',
    },
  });

  const navLinkStyles = css({
    fontSize: '15px',
    lineHeight: '24px',
    fontWeight: '500',
    color: theme() === 'dark' ? '#e2e8f0' : '#334155',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    padding: '8px 16px',
    borderRadius: '8px',
    _hover: {
      color: theme() === 'dark' ? '#ffffff' : '#0f172a',
      backgroundColor: theme() === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
      transform: 'translateY(-1px)',
    },
    _before: {
      content: '""',
      position: 'absolute',
      bottom: '2px',
      left: '50%',
      width: '0',
      height: '2px',
      backgroundColor: '#6366f1',
      transition: 'all 0.3s ease',
      transform: 'translateX(-50%)',
    },
    _hover_before: {
      width: 'calc(100% - 32px)',
    },
  });

  const loginButtonStyles = css({
    display: 'none',
    alignItems: 'center',
    fontSize: '15px',
    lineHeight: '24px',
    fontWeight: '500',
    color: theme() === 'dark' ? '#e2e8f0' : '#334155',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    padding: '8px 16px',
    borderRadius: '8px',
    _hover: {
      color: theme() === 'dark' ? '#a78bfa' : '#6366f1',
      backgroundColor: theme() === 'dark' ? 'rgba(167, 139, 250, 0.1)' : 'rgba(99, 102, 241, 0.05)',
    },
    '@media (min-width: 1024px)': {
      display: 'flex',
    },
  });

  const mobileMenuStyles = css({
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    maxWidth: '400px',
    backgroundColor: theme() === 'dark' ? '#0f172a' : '#ffffff',
    zIndex: 60,
    padding: '24px',
    transform: nav.isMobileMenuOpen() ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    borderLeft: `1px solid ${theme() === 'dark' ? '#334155' : '#e2e8f0'}`,
    backdropFilter: 'blur(20px)',
    '@media (min-width: 1024px)': {
      display: 'none',
    },
  });

  const overlayStyles = css({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 59,
    opacity: nav.isMobileMenuOpen() ? 1 : 0,
    visibility: nav.isMobileMenuOpen() ? 'visible' : 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(4px)',
  });

  const heroContentStyles = css({
    position: 'relative',
    zIndex: 10,
    display: 'grid',
    gridTemplateColumns: layout() === 'imageLeft' ? '1fr 1fr' : '1fr 1fr',
    gap: '64px',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '80px 24px 40px',
    maxWidth: '1400px',
    margin: '0 auto',
    '@media (max-width: 1023px)': {
      gridTemplateColumns: '1fr',
      gap: '48px',
      padding: '100px 24px 40px',
      textAlign: 'center',
    },
    '@media (min-width: 1024px)': {
      padding: '80px 32px 40px',
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
  });

  const announcementStyles = css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: theme() === 'dark' ? 'rgba(71, 85, 105, 0.3)' : 'rgba(248, 250, 252, 0.8)',
    border: `1px solid ${theme() === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.15)'}`,
    borderRadius: '50px',
    padding: '6px 20px',
    marginBottom: '32px',
    backdropFilter: 'blur(12px)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    _hover: {
      borderColor: theme() === 'dark' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)',
      transform: 'translateY(-1px)',
      boxShadow:
        theme() === 'dark'
          ? '0 10px 30px -5px rgba(99, 102, 241, 0.2)'
          : '0 10px 30px -5px rgba(99, 102, 241, 0.15)',
    },
  });

  const badgeStyles = css({
    backgroundColor: '#6366f1',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  });

  const announcementTextStyles = css({
    fontSize: '14px',
    lineHeight: '20px',
    color: theme() === 'dark' ? '#cbd5e1' : '#64748b',
  });

  const announcementLinkStyles = css({
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#a78bfa' : '#6366f1',
    textDecoration: 'none',
    _hover: {
      textDecoration: 'underline',
    },
  });

  const titleStyles = css({
    fontSize: '56px',
    lineHeight: '64px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    color: theme() === 'dark' ? '#ffffff' : '#0f172a',
    marginBottom: '24px',
    '@media (max-width: 639px)': {
      fontSize: '40px',
      lineHeight: '48px',
    },
    '@media (min-width: 640px) and (max-width: 1023px)': {
      fontSize: '48px',
      lineHeight: '56px',
    },
    '@media (min-width: 1280px)': {
      fontSize: '64px',
      lineHeight: '72px',
    },
  });

  const subtitleStyles = css({
    fontSize: '20px',
    lineHeight: '32px',
    color: theme() === 'dark' ? '#cbd5e1' : '#64748b',
    marginBottom: '40px',
    maxWidth: '600px',
    '@media (max-width: 639px)': {
      fontSize: '18px',
      lineHeight: '28px',
    },
    '@media (max-width: 1023px)': {
      margin: '0 auto 40px',
    },
  });

  const buttonGroupStyles = css({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '48px',
    '@media (max-width: 639px)': {
      flexDirection: 'column',
      gap: '12px',
    },
    '@media (max-width: 1023px)': {
      justifyContent: 'center',
    },
  });

  const statsStyles = css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '32px',
    '@media (max-width: 1023px)': {
      justifyContent: 'center',
      maxWidth: '400px',
      margin: '0 auto',
    },
  });

  const statItemStyles = css({
    textAlign: 'left',
    '@media (max-width: 1023px)': {
      textAlign: 'center',
    },
  });

  const statValueStyles = css({
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: '700',
    color: theme() === 'dark' ? '#ffffff' : '#0f172a',
    marginBottom: '4px',
  });

  const statLabelStyles = css({
    fontSize: '14px',
    lineHeight: '20px',
    color: theme() === 'dark' ? '#94a3b8' : '#64748b',
    fontWeight: '500',
  });

  const imageContainerStyles = css({
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    aspectRatio: '4/3',
    backgroundColor: theme() === 'dark' ? '#1e293b' : '#f8fafc',
    '@media (max-width: 1023px)': {
      maxWidth: '600px',
      margin: '0 auto',
    },
  });

  const imageStyles = css({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    _hover: {
      transform: 'scale(1.05)',
    },
  });

  const videoButtonStyles = css({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    _hover: {
      transform: 'translate(-50%, -50%) scale(1.1)',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
    },
  });

  const HamburgerIcon = () => (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const CloseIcon = () => (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const PlayIcon = () => (
    <svg class="w-8 h-8 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );

  const ArrowIcon = () => (
    <span style={{ 'margin-left': '6px', transition: 'transform 0.2s ease' }}>→</span>
  );

  const ChevronIcon = () => (
    <svg
      class="w-4 h-4 ml-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <div class={`${containerStyles} ${props.className || ''}`}>
      {/* Background Patterns */}
      {backgroundPattern() === 'warp' && (
        <WarpBackground
          intensity={0.4}
          speed={0.6}
          colors={
            theme() === 'dark'
              ? ['#6366f1', '#8b5cf6', '#a78bfa', '#c084fc']
              : ['#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8']
          }
        />
      )}

      {backgroundPattern() === 'dots' && (
        <DotPattern
          className={
            theme() === 'dark'
              ? '[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]'
              : '[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]'
          }
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          fill={theme() === 'dark' ? '#334155' : '#e2e8f0'}
        />
      )}

      {/* Mobile Menu Overlay */}
      <div class={overlayStyles} onClick={nav.closeMobileMenu} />

      {/* Header */}
      <header class={headerStyles}>
        <nav class={navStyles}>
          <div class={logoStyles}>
            <a href="/">
              <span class="sr-only">{props.logo?.alt || 'Your Company'}</span>
              <img
                src={
                  props.logo?.src ||
                  'https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600'
                }
                alt={props.logo?.alt || 'Logo'}
              />
            </a>
          </div>

          <button
            class={mobileMenuButtonStyles}
            onClick={nav.toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <HamburgerIcon />
          </button>

          <div class={desktopNavStyles}>
            <For each={navigation()}>
              {(item) => (
                <a href={item.href} class={navLinkStyles}>
                  {item.name}
                </a>
              )}
            </For>
          </div>

          <div class={loginButtonStyles}>
            <a href="#" class={navLinkStyles}>
              Log in <ArrowIcon />
            </a>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div class={mobileMenuStyles}>
        <div
          style={{
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'space-between',
            'margin-bottom': '32px',
          }}
        >
          <img
            src={
              props.logo?.src ||
              'https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600'
            }
            alt={props.logo?.alt || 'Logo'}
            style={{ height: '32px', width: 'auto' }}
          />
          <button
            class={mobileMenuButtonStyles}
            onClick={nav.closeMobileMenu}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            'flex-direction': 'column',
            gap: '4px',
            'margin-bottom': '32px',
          }}
        >
          <For each={navigation()}>
            {(item) => (
              <a
                href={item.href}
                class={navLinkStyles}
                style={{
                  padding: '16px 0',
                  'border-bottom': `1px solid ${theme() === 'dark' ? '#334155' : '#e2e8f0'}`,
                }}
                onClick={nav.closeMobileMenu}
              >
                {item.name}
              </a>
            )}
          </For>
        </div>

        <a href="#" class={navLinkStyles} onClick={nav.closeMobileMenu}>
          Log in <ArrowIcon />
        </a>
      </div>

      {/* Hero Content */}
      <div class={heroContentStyles}>
        {/* Content Section */}
        <div class={contentSectionStyles}>
          {props.announcement && mounted() && animated() && (
            <BlurFade delay={0.2}>
              <div class={announcementStyles}>
                {props.announcement.badge && (
                  <span class={badgeStyles}>{props.announcement.badge}</span>
                )}
                <span class={announcementTextStyles}>{props.announcement.text}</span>
                <a href={props.announcement.href} class={announcementLinkStyles}>
                  {props.announcement.linkText} <ChevronIcon />
                </a>
              </div>
            </BlurFade>
          )}

          {props.announcement && mounted() && !animated() && (
            <div class={announcementStyles}>
              {props.announcement.badge && (
                <span class={badgeStyles}>{props.announcement.badge}</span>
              )}
              <span class={announcementTextStyles}>{props.announcement.text}</span>
              <a href={props.announcement.href} class={announcementLinkStyles}>
                {props.announcement.linkText} <ChevronIcon />
              </a>
            </div>
          )}

          {mounted() && animated() ? (
            <TextAnimate
              text={props.title}
              className={titleStyles}
              animation="slideUp"
              staggerChildren={0.08}
              delay={0.4}
            />
          ) : (
            <h1 class={titleStyles}>{props.title}</h1>
          )}

          {mounted() && animated() ? (
            <BlurFade delay={0.8}>
              <p class={subtitleStyles}>{props.subtitle}</p>
            </BlurFade>
          ) : (
            <p class={subtitleStyles}>{props.subtitle}</p>
          )}

          {mounted() && (
            <div
              class={buttonGroupStyles}
              style={{
                opacity: animated() ? 0 : 1,
                transform: animated() ? 'translateY(20px)' : 'none',
                animation: animated() ? 'fadeInUp 0.6s ease forwards 1s' : 'none',
              }}
            >
              <ShimmerButton className="px-8 py-3 text-base font-medium">
                {props.primaryButton.text}
              </ShimmerButton>
              {props.secondaryButton && (
                <a
                  href={props.secondaryButton.href}
                  class={css({
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '12px 32px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: theme() === 'dark' ? '#e2e8f0' : '#334155',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    borderRadius: '8px',
                    _hover: {
                      color: theme() === 'dark' ? '#ffffff' : '#0f172a',
                      transform: 'translateY(-1px)',
                    },
                  })}
                >
                  {props.secondaryButton.text} <ArrowIcon />
                </a>
              )}
            </div>
          )}

          {props.stats && mounted() && (
            <div
              class={statsStyles}
              style={{
                opacity: animated() ? 0 : 1,
                transform: animated() ? 'translateY(20px)' : 'none',
                animation: animated() ? 'fadeInUp 0.6s ease forwards 1.2s' : 'none',
              }}
            >
              <For each={props.stats}>
                {(stat) => (
                  <div class={statItemStyles}>
                    <div class={statValueStyles}>{stat.value}</div>
                    <div class={statLabelStyles}>{stat.label}</div>
                  </div>
                )}
              </For>
            </div>
          )}
        </div>

        {/* Image/Video Section */}
        <div class={imageSectionStyles}>
          {mounted() && animated() ? (
            <BlurFade delay={1.4}>
              <div class={imageContainerStyles}>
                {props.video ? (
                  <>
                    <img src={props.video.thumbnail} alt={props.video.title} class={imageStyles} />
                    <button class={videoButtonStyles} aria-label="Play video">
                      <PlayIcon />
                    </button>
                  </>
                ) : props.image ? (
                  <img
                    src={props.image.src}
                    alt={props.image.alt}
                    class={imageStyles}
                    onLoad={() => setImageLoaded(true)}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      'align-items': 'center',
                      'justify-content': 'center',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      'font-size': '18px',
                      'font-weight': '500',
                    }}
                  >
                    Your Image Here
                  </div>
                )}
                <BorderBeam size={250} duration={12} />
              </div>
            </BlurFade>
          ) : (
            <div class={imageContainerStyles}>
              {props.video ? (
                <>
                  <img src={props.video.thumbnail} alt={props.video.title} class={imageStyles} />
                  <button class={videoButtonStyles} aria-label="Play video">
                    <PlayIcon />
                  </button>
                </>
              ) : props.image ? (
                <img
                  src={props.image.src}
                  alt={props.image.alt}
                  class={imageStyles}
                  onLoad={() => setImageLoaded(true)}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    'font-size': '18px',
                    'font-weight': '500',
                  }}
                >
                  Your Image Here
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSplit;
