import { type Component, For, createSignal, onMount } from 'solid-js';
import { css } from '../../styled-system/css';
import { HeroSimple } from './HeroSimple';
import { HeroSplit } from './HeroSplit';
import { useNavigation } from './hooks/useNavigation';

interface DemoSection {
  id: string;
  title: string;
  description: string;
  component: Component<any>;
  props: Record<string, any>;
  code: string;
}

export const CompleteTailwindPlusDemo: Component = () => {
  const [activeSection, setActiveSection] = createSignal(0);
  const [mounted, setMounted] = createSignal(false);
  const nav = useNavigation();

  onMount(() => {
    setMounted(true);
  });

  const containerStyles = css({
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#ffffff',
  });

  const sidebarStyles = css({
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: '320px',
    backgroundColor: '#1e293b',
    borderRight: '1px solid #334155',
    padding: '24px',
    overflowY: 'auto',
    zIndex: 100,
    transform: nav.isMobileMenuOpen() ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease',
    '@media (min-width: 1024px)': {
      transform: 'translateX(0)',
    },
  });

  const mainContentStyles = css({
    marginLeft: '0',
    '@media (min-width: 1024px)': {
      marginLeft: '320px',
    },
  });

  const headerStyles = css({
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #334155',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  });

  const mobileMenuButtonStyles = css({
    display: 'block',
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#cbd5e1',
    cursor: 'pointer',
    borderRadius: '6px',
    _hover: {
      backgroundColor: '#334155',
    },
    '@media (min-width: 1024px)': {
      display: 'none',
    },
  });

  const sectionButtonStyles = css({
    width: '100%',
    textAlign: 'left',
    padding: '12px 16px',
    marginBottom: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#cbd5e1',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    _hover: {
      backgroundColor: '#334155',
      color: '#ffffff',
    },
  });

  const activeSectionStyles = css({
    backgroundColor: '#6366f1',
    color: '#ffffff',
    _hover: {
      backgroundColor: '#5b55e5',
    },
  });

  const sectionTitleStyles = css({
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '4px',
  });

  const sectionDescStyles = css({
    fontSize: '12px',
    opacity: 0.8,
    lineHeight: '1.4',
  });

  const demoSectionStyles = css({
    position: 'relative',
    minHeight: '100vh',
  });

  const overlayStyles = css({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99,
    opacity: nav.isMobileMenuOpen() ? 1 : 0,
    visibility: nav.isMobileMenuOpen() ? 'visible' : 'hidden',
    transition: 'all 0.3s ease',
    '@media (min-width: 1024px)': {
      display: 'none',
    },
  });

  const codePreviewStyles = css({
    position: 'absolute',
    bottom: '24px',
    right: '24px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#ffffff',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '12px',
    fontFamily: 'monospace',
    maxWidth: '400px',
    backdropFilter: 'blur(8px)',
    border: '1px solid #334155',
    zIndex: 10,
  });

  const demoSections: DemoSection[] = [
    {
      id: 'hero-simple-light',
      title: 'Hero Simple - Light',
      description: 'Clean minimal hero with animated text and background patterns',
      component: HeroSimple,
      props: {
        title: 'Build the future with confidence',
        subtitle:
          'Transform your ideas into reality with our comprehensive platform. Designed for developers, built for scale.',
        primaryButton: {
          text: 'Get Started',
          href: '#',
        },
        secondaryButton: {
          text: 'Learn More',
          href: '#',
        },
        announcement: {
          text: '🎉 Announcing our Series A funding',
          linkText: 'Read more',
          href: '#',
        },
        backgroundPattern: true,
        theme: 'light',
      },
      code: `<HeroSimple
  title="Build the future with confidence"
  subtitle="Transform your ideas into reality..."
  primaryButton={{ text: "Get Started", href: "#" }}
  secondaryButton={{ text: "Learn More", href: "#" }}
  announcement={{
    text: "🎉 Announcing our Series A funding",
    linkText: "Read more",
    href: "#"
  }}
  backgroundPattern={true}
  theme="light"
/>`,
    },
    {
      id: 'hero-simple-dark',
      title: 'Hero Simple - Dark',
      description: 'Dark theme variant with enhanced visual effects',
      component: HeroSimple,
      props: {
        title: 'Deploy to the cloud with confidence',
        subtitle:
          'Scale your applications effortlessly with our enterprise-grade infrastructure and developer-first tools.',
        primaryButton: {
          text: 'Start Free Trial',
          href: '#',
        },
        secondaryButton: {
          text: 'View Documentation',
          href: '#',
        },
        announcement: {
          text: '✨ Just shipped v2.0',
          linkText: "What's new",
          href: '#',
        },
        backgroundPattern: true,
        theme: 'dark',
      },
      code: `<HeroSimple
  title="Deploy to the cloud with confidence"
  subtitle="Scale your applications effortlessly..."
  primaryButton={{ text: "Start Free Trial", href: "#" }}
  theme="dark"
  backgroundPattern={true}
/>`,
    },
    {
      id: 'hero-split-image-right',
      title: 'Hero Split - Image Right',
      description: 'Split layout with content left, image right, and statistics',
      component: HeroSplit,
      props: {
        title: 'Modern development platform',
        subtitle:
          'Build, deploy, and scale applications with ease. Our platform provides everything you need from development to production.',
        primaryButton: {
          text: 'Start Building',
          href: '#',
        },
        secondaryButton: {
          text: 'Live Demo',
          href: '#',
        },
        announcement: {
          badge: 'New',
          text: 'Advanced analytics dashboard',
          linkText: 'Explore features',
          href: '#',
        },
        image: {
          src: 'https://tailwindcss.com/plus-assets/img/component-images/project-app-screenshot.png',
          alt: 'Platform dashboard',
        },
        stats: [
          { value: '99.9%', label: 'Uptime' },
          { value: '50M+', label: 'API Calls' },
          { value: '10K+', label: 'Developers' },
        ],
        layout: 'imageRight',
        backgroundPattern: 'dots',
        theme: 'light',
        animated: true,
      },
      code: `<HeroSplit
  title="Modern development platform"
  layout="imageRight"
  backgroundPattern="dots"
  stats={[
    { value: "99.9%", label: "Uptime" },
    { value: "50M+", label: "API Calls" },
    { value: "10K+", label: "Developers" }
  ]}
  animated={true}
/>`,
    },
    {
      id: 'hero-split-image-left',
      title: 'Hero Split - Image Left',
      description: 'Reversed layout with image left and enhanced animations',
      component: HeroSplit,
      props: {
        title: 'Supercharge your workflow',
        subtitle:
          'Streamline your development process with our integrated tools and automated workflows.',
        primaryButton: {
          text: 'Get Started',
          href: '#',
        },
        secondaryButton: {
          text: 'View Integrations',
          href: '#',
        },
        announcement: {
          badge: 'Beta',
          text: 'AI-powered code generation',
          linkText: 'Join waitlist',
          href: '#',
        },
        image: {
          src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
          alt: 'Development workflow',
        },
        layout: 'imageLeft',
        backgroundPattern: 'warp',
        theme: 'light',
        animated: true,
      },
      code: `<HeroSplit
  title="Supercharge your workflow"
  layout="imageLeft"
  backgroundPattern="warp"
  animated={true}
/>`,
    },
    {
      id: 'hero-split-video',
      title: 'Hero Split - Video',
      description: 'Hero with video player and interactive elements',
      component: HeroSplit,
      props: {
        title: 'See our platform in action',
        subtitle:
          'Watch how teams are building and deploying applications faster than ever before.',
        primaryButton: {
          text: 'Start Free Trial',
          href: '#',
        },
        secondaryButton: {
          text: 'Schedule Demo',
          href: '#',
        },
        announcement: {
          badge: 'Live',
          text: 'Product demo webinar',
          linkText: 'Register now',
          href: '#',
        },
        video: {
          thumbnail:
            'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
          title: 'Platform demo video',
        },
        stats: [
          { value: '5x', label: 'Faster Deployment' },
          { value: '99.9%', label: 'Uptime SLA' },
          { value: '24/7', label: 'Support' },
        ],
        layout: 'videoRight',
        backgroundPattern: 'dots',
        theme: 'light',
        animated: true,
      },
      code: `<HeroSplit
  video={{
    thumbnail: "...",
    title: "Platform demo video"
  }}
  layout="videoRight"
  stats={[...]}
/>`,
    },
    {
      id: 'hero-split-dark',
      title: 'Hero Split - Dark Theme',
      description: 'Dark theme with enhanced visual effects and modern styling',
      component: HeroSplit,
      props: {
        title: 'Transform your business',
        subtitle:
          'Enterprise-grade solutions designed to scale with your business needs and accelerate growth.',
        primaryButton: {
          text: 'Contact Sales',
          href: '#',
        },
        secondaryButton: {
          text: 'View Pricing',
          href: '#',
        },
        announcement: {
          badge: 'Enterprise',
          text: 'SOC 2 Type II certified',
          linkText: 'Learn more',
          href: '#',
        },
        image: {
          src: 'https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png',
          alt: 'Enterprise dashboard',
        },
        stats: [
          { value: 'Fortune 500', label: 'Companies' },
          { value: '99.99%', label: 'Availability' },
          { value: '24/7', label: 'Support' },
        ],
        layout: 'imageRight',
        backgroundPattern: 'warp',
        theme: 'dark',
        animated: true,
      },
      code: `<HeroSplit
  theme="dark"
  backgroundPattern="warp"
  stats={[
    { value: "Fortune 500", label: "Companies" },
    { value: "99.99%", label: "Availability" },
    { value: "24/7", label: "Support" }
  ]}
/>`,
    },
  ];

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

  return (
    <div class={containerStyles}>
      {/* Mobile Overlay */}
      <div class={overlayStyles} onClick={nav.closeMobileMenu} />

      {/* Sidebar */}
      <div class={sidebarStyles}>
        <div style={{ 'margin-bottom': '32px' }}>
          <h1 style={{ 'font-size': '20px', 'font-weight': '700', 'margin-bottom': '8px' }}>
            TailwindPlus Demo
          </h1>
          <p style={{ 'font-size': '14px', opacity: '0.8', 'line-height': '1.4' }}>
            Interactive showcase of enterprise hero components with state machines and animations
          </p>
        </div>

        <div>
          <h2
            style={{
              'font-size': '12px',
              'font-weight': '600',
              'text-transform': 'uppercase',
              'letter-spacing': '0.05em',
              'margin-bottom': '16px',
              color: '#94a3b8',
            }}
          >
            Components
          </h2>
          <For each={demoSections}>
            {(section, index) => (
              <button
                class={`${sectionButtonStyles} ${activeSection() === index() ? activeSectionStyles : ''}`}
                onClick={() => {
                  setActiveSection(index());
                  nav.closeMobileMenu();
                }}
              >
                <div class={sectionTitleStyles}>{section.title}</div>
                <div class={sectionDescStyles}>{section.description}</div>
              </button>
            )}
          </For>
        </div>

        <div
          style={{ 'margin-top': '32px', 'padding-top': '24px', 'border-top': '1px solid #334155' }}
        >
          <h3
            style={{
              'font-size': '12px',
              'font-weight': '600',
              'margin-bottom': '12px',
              color: '#94a3b8',
            }}
          >
            Features
          </h3>
          <ul style={{ 'font-size': '12px', 'line-height': '1.5', color: '#cbd5e1' }}>
            <li style={{ 'margin-bottom': '6px' }}>🏗️ Zag.js State Machines</li>
            <li style={{ 'margin-bottom': '6px' }}>✨ Magic UI Animations</li>
            <li style={{ 'margin-bottom': '6px' }}>🎨 Panda CSS Styling</li>
            <li style={{ 'margin-bottom': '6px' }}>📱 Responsive Design</li>
            <li style={{ 'margin-bottom': '6px' }}>🌙 Dark/Light Themes</li>
            <li style={{ 'margin-bottom': '6px' }}>⚡ High Performance</li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div class={mainContentStyles}>
        {/* Header */}
        <div class={headerStyles}>
          <button
            class={mobileMenuButtonStyles}
            onClick={nav.toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <HamburgerIcon />
          </button>

          <div>
            <h2 style={{ 'font-size': '18px', 'font-weight': '600' }}>
              {demoSections[activeSection()].title}
            </h2>
            <p style={{ 'font-size': '14px', opacity: '0.8' }}>
              {demoSections[activeSection()].description}
            </p>
          </div>

          <div style={{ 'font-size': '12px', color: '#94a3b8' }}>
            {activeSection() + 1} / {demoSections.length}
          </div>
        </div>

        {/* Demo Section */}
        <div class={demoSectionStyles}>
          {mounted() &&
            demoSections[activeSection()].component(demoSections[activeSection()].props)}

          {/* Code Preview */}
          <div class={codePreviewStyles}>
            <div style={{ 'font-weight': '600', 'margin-bottom': '8px', color: '#60a5fa' }}>
              Component Code:
            </div>
            <pre style={{ 'white-space': 'pre-wrap', 'font-size': '11px', 'line-height': '1.4' }}>
              {demoSections[activeSection()].code}
            </pre>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px',
          zIndex: 20,
          '@media (max-width: 1023px)': {
            left: '24px',
            transform: 'none',
          },
        }}
      >
        <button
          onClick={() => setActiveSection(Math.max(0, activeSection() - 1))}
          disabled={activeSection() === 0}
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#ffffff',
            border: '1px solid #334155',
            borderRadius: '8px',
            cursor: activeSection() === 0 ? 'not-allowed' : 'pointer',
            opacity: activeSection() === 0 ? 0.5 : 1,
            'backdrop-filter': 'blur(8px)',
            transition: 'all 0.2s ease',
          }}
        >
          ← Previous
        </button>

        <button
          onClick={() => setActiveSection(Math.min(demoSections.length - 1, activeSection() + 1))}
          disabled={activeSection() === demoSections.length - 1}
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#ffffff',
            border: '1px solid #334155',
            borderRadius: '8px',
            cursor: activeSection() === demoSections.length - 1 ? 'not-allowed' : 'pointer',
            opacity: activeSection() === demoSections.length - 1 ? 0.5 : 1,
            'backdrop-filter': 'blur(8px)',
            transition: 'all 0.2s ease',
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default CompleteTailwindPlusDemo;
