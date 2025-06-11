import { type Component, For, JSX, createSignal, onMount } from 'solid-js';
import { css } from '../../styled-system/css';
import { AnimatedGradientText } from '../magicui/AnimatedGradientText';
import { TextAnimate } from '../magicui/TextAnimate';
import { WarpBackground } from '../magicui/WarpBackground';
import { useNavigation } from './hooks/useNavigation';

export interface NavigationItem {
  name: string;
  href: string;
}

export interface HeroSimpleProps {
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
  backgroundPattern?: boolean;
  theme?: 'light' | 'dark';
}

export const HeroSimple: Component<HeroSimpleProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const nav = useNavigation();

  const theme = () => props.theme ?? 'light';
  const navigation = () =>
    props.navigation ?? [
      { name: 'Product', href: '#' },
      { name: 'Features', href: '#' },
      { name: 'Marketplace', href: '#' },
      { name: 'Company', href: '#' },
    ];

  onMount(() => {
    setMounted(true);
  });

  const containerStyles = css({
    position: 'relative',
    minHeight: '100vh',
    backgroundColor: theme() === 'dark' ? '#111827' : '#ffffff',
    overflow: 'hidden',
  });

  const headerStyles = css({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: 'all 0.3s ease',
    backgroundColor: nav.isScrolled()
      ? theme() === 'dark'
        ? 'rgba(17, 24, 39, 0.95)'
        : 'rgba(255, 255, 255, 0.95)'
      : 'transparent',
    backdropFilter: nav.isScrolled() ? 'blur(8px)' : 'none',
    borderBottom: nav.isScrolled()
      ? `1px solid ${theme() === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`
      : 'none',
  });

  const navStyles = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px',
    maxWidth: '1280px',
    margin: '0 auto',
    '@media (min-width: 1024px)': {
      padding: '24px 32px',
    },
  });

  const logoStyles = css({
    display: 'flex',
    alignItems: 'center',
    '& img': {
      height: '32px',
      width: 'auto',
    },
  });

  const mobileMenuButtonStyles = css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    _hover: {
      backgroundColor: theme() === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)',
      color: theme() === 'dark' ? '#ffffff' : '#111827',
    },
    '@media (min-width: 1024px)': {
      display: 'none',
    },
  });

  const desktopNavStyles = css({
    display: 'none',
    alignItems: 'center',
    gap: '48px',
    '@media (min-width: 1024px)': {
      display: 'flex',
    },
  });

  const navLinkStyles = css({
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    position: 'relative',
    _hover: {
      color: theme() === 'dark' ? '#a78bfa' : '#6366f1',
    },
    _before: {
      content: '""',
      position: 'absolute',
      bottom: '-4px',
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: 'currentColor',
      transform: 'scaleX(0)',
      transition: 'transform 0.2s ease',
    },
    _hover_before: {
      transform: 'scaleX(1)',
    },
  });

  const loginButtonStyles = css({
    display: 'none',
    alignItems: 'center',
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    _hover: {
      color: theme() === 'dark' ? '#a78bfa' : '#6366f1',
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
    maxWidth: '384px',
    backgroundColor: theme() === 'dark' ? '#111827' : '#ffffff',
    zIndex: 60,
    padding: '24px',
    transform: nav.isMobileMenuOpen() ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease',
    borderLeft: `1px solid ${theme() === 'dark' ? '#374151' : '#e5e7eb'}`,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 59,
    opacity: nav.isMobileMenuOpen() ? 1 : 0,
    visibility: nav.isMobileMenuOpen() ? 'visible' : 'hidden',
    transition: 'all 0.3s ease',
  });

  const heroContentStyles = css({
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '56px 24px 0',
    '@media (min-width: 1024px)': {
      padding: '56px 32px 0',
    },
  });

  const heroInnerStyles = css({
    maxWidth: '896px',
    margin: '0 auto',
    textAlign: 'center',
  });

  const announcementStyles = css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: theme() === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.8)',
    border: `1px solid ${theme() === 'dark' ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)'}`,
    borderRadius: '9999px',
    padding: '8px 16px',
    marginBottom: '32px',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.2s ease',
    _hover: {
      borderColor: theme() === 'dark' ? 'rgba(147, 197, 253, 0.5)' : 'rgba(99, 102, 241, 0.5)',
    },
  });

  const announcementTextStyles = css({
    fontSize: '14px',
    lineHeight: '20px',
    color: theme() === 'dark' ? '#d1d5db' : '#6b7280',
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
    fontSize: '48px',
    lineHeight: '56px',
    fontWeight: '600',
    letterSpacing: '-0.025em',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    marginBottom: '32px',
    '@media (min-width: 640px)': {
      fontSize: '72px',
      lineHeight: '80px',
    },
  });

  const subtitleStyles = css({
    fontSize: '18px',
    lineHeight: '28px',
    color: theme() === 'dark' ? '#d1d5db' : '#6b7280',
    marginBottom: '40px',
    maxWidth: '768px',
    margin: '0 auto 40px',
    '@media (min-width: 640px)': {
      fontSize: '20px',
      lineHeight: '32px',
    },
  });

  const buttonGroupStyles = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    flexDirection: 'column',
    '@media (min-width: 640px)': {
      flexDirection: 'row',
    },
  });

  const primaryButtonStyles = css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 28px',
    backgroundColor: '#6366f1',
    color: '#ffffff',
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '600',
    borderRadius: '6px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    _hover: {
      backgroundColor: '#4f46e5',
      transform: 'translateY(-1px)',
      boxShadow: '0 10px 25px -3px rgba(99, 102, 241, 0.25)',
    },
    _before: {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      transition: 'left 0.5s ease',
    },
    _hover_before: {
      left: '100%',
    },
  });

  const secondaryButtonStyles = css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 28px',
    backgroundColor: 'transparent',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '600',
    borderRadius: '6px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
    _hover: {
      transform: 'translateY(-1px)',
    },
  });

  const HamburgerIcon = () => (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );

  const CloseIcon = () => (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  const ArrowIcon = () => <span style={{ 'margin-left': '4px' }}>→</span>;

  return (
    <div class={`${containerStyles} ${props.className || ''}`}>
      {props.backgroundPattern && (
        <WarpBackground
          intensity={0.3}
          speed={0.8}
          colors={
            theme() === 'dark'
              ? ['#6366f1', '#8b5cf6', '#a78bfa', '#c084fc']
              : ['#ddd6fe', '#c7d2fe', '#a5b4fc', '#818cf8']
          }
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
            'margin-bottom': '24px',
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
            gap: '8px',
            'margin-bottom': '24px',
          }}
        >
          <For each={navigation()}>
            {(item) => (
              <a
                href={item.href}
                class={navLinkStyles}
                style={{
                  padding: '12px 0',
                  'border-bottom': `1px solid ${theme() === 'dark' ? '#374151' : '#e5e7eb'}`,
                }}
                onClick={nav.closeMobileMenu}
              >
                {item.name}
              </a>
            )}
          </For>
        </div>

        <a href="#" class={navLinkStyles} onClick={nav.closeMobileMenu}>
          Log in
        </a>
      </div>

      {/* Hero Content */}
      <div class={heroContentStyles}>
        <div class={heroInnerStyles}>
          {props.announcement && mounted() && (
            <div class={announcementStyles}>
              <span class={announcementTextStyles}>{props.announcement.text}</span>
              <a href={props.announcement.href} class={announcementLinkStyles}>
                {props.announcement.linkText} <ArrowIcon />
              </a>
            </div>
          )}

          {mounted() && (
            <TextAnimate
              text={props.title}
              className={titleStyles}
              animation="slideUp"
              staggerChildren={0.1}
              delay={0.2}
            />
          )}

          {mounted() && (
            <TextAnimate
              text={props.subtitle}
              className={subtitleStyles}
              animation="fadeIn"
              delay={0.6}
            />
          )}

          {mounted() && (
            <div
              class={buttonGroupStyles}
              style={{
                opacity: 0,
                transform: 'translateY(20px)',
                animation: 'fadeInUp 0.6s ease forwards 0.8s',
              }}
            >
              <a href={props.primaryButton.href} class={primaryButtonStyles}>
                {props.primaryButton.text}
              </a>
              {props.secondaryButton && (
                <a href={props.secondaryButton.href} class={secondaryButtonStyles}>
                  {props.secondaryButton.text} <ArrowIcon />
                </a>
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

export default HeroSimple;
