import { type Component, For, createSignal, onMount } from 'solid-js';
import { css } from '../../styled-system/css';
import { FeatureGrid } from './FeatureGrid';
import { FeatureSimple } from './FeatureSimple';
import { FeatureSplit } from './FeatureSplit';
import { HeroSimple } from './HeroSimple';
import { HeroSplit } from './HeroSplit';
import { useNavigation } from './hooks/useNavigation';

interface DemoSection {
  id: string;
  title: string;
  description: string;
  component: Component<any>;
  props: Record<string, unknown>;
  code: string;
  category: 'hero' | 'feature';
}

export const CompleteTailwindPlusFeatureDemo: Component = () => {
  const [activeSection, setActiveSection] = createSignal(0);
  const [activeCategory, setActiveCategory] = createSignal('all');
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
    width: '360px',
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
      marginLeft: '360px',
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

  const categoryTabsStyles = css({
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  });

  const categoryTabStyles = css({
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #475569',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    _hover: {
      borderColor: '#6366f1',
      color: '#ffffff',
    },
  });

  const activeCategoryTabStyles = css({
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    color: '#ffffff',
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
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    fontSize: '12px',
    fontFamily: 'monospace',
    maxWidth: '450px',
    maxHeight: '300px',
    overflow: 'auto',
    backdropFilter: 'blur(12px)',
    border: '1px solid #334155',
    zIndex: 10,
    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
  });

  const featuresData = [
    {
      name: 'Push to deploy.',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
      icon: 'cloud',
    },
    {
      name: 'SSL certificates.',
      description:
        'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
      icon: 'lock',
    },
    {
      name: 'Database backups.',
      description:
        'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
      icon: 'server',
    },
  ];

  const extendedFeaturesData = [
    {
      name: 'Push to deploy.',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.',
      icon: 'cloud',
    },
    {
      name: 'SSL certificates.',
      description:
        'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
      icon: 'lock',
    },
    {
      name: 'Simple queues.',
      description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus.',
      icon: 'arrow-path',
    },
    {
      name: 'Advanced security.',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.',
      icon: 'fingerprint',
    },
    {
      name: 'Powerful API.',
      description:
        'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
      icon: 'cog',
    },
    {
      name: 'Database backups.',
      description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus.',
      icon: 'server',
    },
  ];

  const demoSections: DemoSection[] = [
    {
      id: 'hero-simple-light',
      title: 'Hero Simple - Light',
      description: 'Clean minimal hero with animated text and background patterns',
      category: 'hero',
      component: HeroSimple,
      props: {
        title: 'Build the future with confidence',
        subtitle:
          'Transform your ideas into reality with our comprehensive platform. Designed for developers, built for scale.',
        primaryButton: { text: 'Get Started', href: '#' },
        secondaryButton: { text: 'Learn More', href: '#' },
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
  backgroundPattern={true}
  theme="light"
/>`,
    },
    {
      id: 'hero-simple-dark',
      title: 'Hero Simple - Dark',
      description: 'Dark theme variant with enhanced visual effects',
      category: 'hero',
      component: HeroSimple,
      props: {
        title: 'Deploy to the cloud with confidence',
        subtitle:
          'Scale your applications effortlessly with our enterprise-grade infrastructure and developer-first tools.',
        primaryButton: { text: 'Start Free Trial', href: '#' },
        secondaryButton: { text: 'View Documentation', href: '#' },
        announcement: { text: '✨ Just shipped v2.0', linkText: "What's new", href: '#' },
        backgroundPattern: true,
        theme: 'dark',
      },
      code: `<HeroSimple
  title="Deploy to the cloud with confidence"
  theme="dark"
  backgroundPattern={true}
/>`,
    },
    {
      id: 'hero-split-image-right',
      title: 'Hero Split - Image Right',
      description: 'Split layout with content left, image right, and statistics',
      category: 'hero',
      component: HeroSplit,
      props: {
        title: 'Modern development platform',
        subtitle:
          'Build, deploy, and scale applications with ease. Our platform provides everything you need from development to production.',
        primaryButton: { text: 'Start Building', href: '#' },
        secondaryButton: { text: 'Live Demo', href: '#' },
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
  stats={[...]}
  animated={true}
/>`,
    },
    {
      id: 'hero-split-dark',
      title: 'Hero Split - Dark Theme',
      description: 'Dark theme with enhanced visual effects and modern styling',
      category: 'hero',
      component: HeroSplit,
      props: {
        title: 'Transform your business',
        subtitle:
          'Enterprise-grade solutions designed to scale with your business needs and accelerate growth.',
        primaryButton: { text: 'Contact Sales', href: '#' },
        secondaryButton: { text: 'View Pricing', href: '#' },
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
  stats={[...]}
/>`,
    },
    {
      id: 'feature-split-light',
      title: 'Feature Split - Light',
      description: 'Split layout with content and feature list on left, image on right',
      category: 'feature',
      component: FeatureSplit,
      props: {
        badge: 'Deploy faster',
        title: 'A better workflow',
        subtitle:
          'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
        features: featuresData,
        image: {
          src: 'https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png',
          alt: 'Product screenshot',
        },
        layout: 'imageRight',
        theme: 'light',
        animated: true,
        backgroundPattern: 'dots',
        imageOverlay: true,
      },
      code: `<FeatureSplit
  badge="Deploy faster"
  title="A better workflow"
  features={featuresData}
  layout="imageRight"
  theme="light"
  animated={true}
/>`,
    },
    {
      id: 'feature-split-dark',
      title: 'Feature Split - Dark',
      description: 'Dark theme variant with enhanced styling',
      category: 'feature',
      component: FeatureSplit,
      props: {
        badge: 'Deploy faster',
        title: 'A better workflow',
        subtitle:
          'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
        features: featuresData,
        image: {
          src: 'https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png',
          alt: 'Product screenshot',
        },
        layout: 'imageRight',
        theme: 'dark',
        animated: true,
        backgroundPattern: 'dots',
        imageOverlay: true,
      },
      code: `<FeatureSplit
  theme="dark"
  backgroundPattern="dots"
  imageOverlay={true}
/>`,
    },
    {
      id: 'feature-grid-3col',
      title: 'Feature Grid - 3 Columns',
      description: 'Centered layout with image and 3-column feature grid',
      category: 'feature',
      component: FeatureGrid,
      props: {
        badge: 'Everything you need',
        title: 'No server? No problem.',
        subtitle:
          'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis.',
        features: extendedFeaturesData,
        image: {
          src: 'https://tailwindcss.com/plus-assets/img/component-images/project-app-screenshot.png',
          alt: 'App screenshot',
        },
        theme: 'light',
        animated: true,
        backgroundPattern: 'dots',
        imageOverlay: true,
        gridColumns: 3,
      },
      code: `<FeatureGrid
  title="No server? No problem."
  features={extendedFeaturesData}
  gridColumns={3}
  animated={true}
/>`,
    },
    {
      id: 'feature-grid-dark',
      title: 'Feature Grid - Dark',
      description: 'Dark theme variant with enhanced styling',
      category: 'feature',
      component: FeatureGrid,
      props: {
        badge: 'Everything you need',
        title: 'No server? No problem.',
        subtitle:
          'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis.',
        features: extendedFeaturesData,
        image: {
          src: 'https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png',
          alt: 'App screenshot',
        },
        theme: 'dark',
        animated: true,
        backgroundPattern: 'dots',
        imageOverlay: true,
        gridColumns: 3,
      },
      code: `<FeatureGrid
  theme="dark"
  gridColumns={3}
  backgroundPattern="dots"
/>`,
    },
    {
      id: 'feature-simple-light',
      title: 'Feature Simple - Light',
      description: 'Minimal layout with title and image only',
      category: 'feature',
      component: FeatureSimple,
      props: {
        title: 'Everything you need to deploy your app',
        image: {
          src: 'https://tailwindcss.com/plus-assets/img/component-images/project-app-screenshot.png',
          alt: 'App screenshot',
        },
        theme: 'light',
        animated: true,
        backgroundPattern: 'dots',
        imageOverlay: true,
        maxWidth: '7xl',
      },
      code: `<FeatureSimple
  title="Everything you need to deploy your app"
  theme="light"
  imageOverlay={true}
  maxWidth="7xl"
/>`,
    },
    {
      id: 'feature-simple-dark',
      title: 'Feature Simple - Dark',
      description: 'Dark theme minimal layout with enhanced styling',
      category: 'feature',
      component: FeatureSimple,
      props: {
        title: 'Everything you need to deploy your app',
        image: {
          src: 'https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png',
          alt: 'App screenshot',
        },
        theme: 'dark',
        animated: true,
        backgroundPattern: 'dots',
        imageOverlay: true,
        maxWidth: '7xl',
      },
      code: `<FeatureSimple
  title="Everything you need to deploy your app"
  theme="dark"
  backgroundPattern="dots"
/>`,
    },
  ];

  const filteredSections = () => {
    if (activeCategory() === 'all') return demoSections;
    return demoSections.filter((section) => section.category === activeCategory());
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'hero', name: 'Hero' },
    { id: 'feature', name: 'Feature' },
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
            TailwindPlus Complete
          </h1>
          <p style={{ 'font-size': '14px', opacity: '0.8', 'line-height': '1.4' }}>
            Complete showcase of enterprise components with state machines, animations, and modern
            design patterns
          </p>
        </div>

        <div class={categoryTabsStyles}>
          <For each={categories}>
            {(category) => (
              <button
                class={`${categoryTabStyles} ${activeCategory() === category.id ? activeCategoryTabStyles : ''}`}
                onClick={() => {
                  setActiveCategory(category.id);
                  setActiveSection(0);
                }}
              >
                {category.name}
              </button>
            )}
          </For>
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
            Components ({filteredSections().length})
          </h2>
          <For each={filteredSections()}>
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
            Architecture
          </h3>
          <ul style={{ 'font-size': '12px', 'line-height': '1.5', color: '#cbd5e1' }}>
            <li style={{ 'margin-bottom': '6px' }}>🏗️ Zag.js State Machines</li>
            <li style={{ 'margin-bottom': '6px' }}>✨ Magic UI Animations</li>
            <li style={{ 'margin-bottom': '6px' }}>🎨 PandaCSS Styling</li>
            <li style={{ 'margin-bottom': '6px' }}>📱 Responsive Design</li>
            <li style={{ 'margin-bottom': '6px' }}>🌙 Dark/Light Themes</li>
            <li style={{ 'margin-bottom': '6px' }}>⚡ High Performance</li>
            <li style={{ 'margin-bottom': '6px' }}>🔒 TypeScript Safe</li>
            <li style={{ 'margin-bottom': '6px' }}>♿ Accessible</li>
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
              {filteredSections()[activeSection()]?.title}
            </h2>
            <p style={{ 'font-size': '14px', opacity: '0.8' }}>
              {filteredSections()[activeSection()]?.description}
            </p>
          </div>

          <div style={{ display: 'flex', 'align-items': 'center', gap: '16px' }}>
            <div style={{ 'font-size': '12px', color: '#94a3b8' }}>
              {activeSection() + 1} / {filteredSections().length}
            </div>
            <div
              style={{
                padding: '4px 8px',
                'background-color':
                  filteredSections()[activeSection()]?.category === 'hero' ? '#059669' : '#7c3aed',
                color: 'white',
                'border-radius': '4px',
                'font-size': '10px',
                'font-weight': '600',
                'text-transform': 'uppercase',
              }}
            >
              {filteredSections()[activeSection()]?.category}
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div class={demoSectionStyles}>
          {mounted() &&
            filteredSections()[activeSection()]?.component(
              filteredSections()[activeSection()]?.props
            )}

          {/* Code Preview */}
          <div class={codePreviewStyles}>
            <div
              style={{
                'font-weight': '600',
                'margin-bottom': '12px',
                color: '#60a5fa',
                display: 'flex',
                'align-items': 'center',
                gap: '8px',
              }}
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              Component Code
            </div>
            <pre
              style={{
                'white-space': 'pre-wrap',
                'font-size': '11px',
                'line-height': '1.5',
                color: '#e2e8f0',
              }}
            >
              {filteredSections()[activeSection()]?.code}
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
            padding: '12px 20px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#ffffff',
            border: '1px solid #334155',
            borderRadius: '8px',
            cursor: activeSection() === 0 ? 'not-allowed' : 'pointer',
            opacity: activeSection() === 0 ? 0.5 : 1,
            'backdrop-filter': 'blur(8px)',
            transition: 'all 0.2s ease',
            'font-size': '14px',
            'font-weight': '500',
          }}
        >
          ← Previous
        </button>

        <button
          onClick={() =>
            setActiveSection(Math.min(filteredSections().length - 1, activeSection() + 1))
          }
          disabled={activeSection() === filteredSections().length - 1}
          style={{
            padding: '12px 20px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#ffffff',
            border: '1px solid #334155',
            borderRadius: '8px',
            cursor: activeSection() === filteredSections().length - 1 ? 'not-allowed' : 'pointer',
            opacity: activeSection() === filteredSections().length - 1 ? 0.5 : 1,
            'backdrop-filter': 'blur(8px)',
            transition: 'all 0.2s ease',
            'font-size': '14px',
            'font-weight': '500',
          }}
        >
          Next →
        </button>
      </div>

      {/* Quick Stats Overlay */}
      <div
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '12px',
          backdropFilter: 'blur(8px)',
          border: '1px solid #334155',
          zIndex: 10,
          '@media (max-width: 1023px)': {
            display: 'none',
          },
        }}
      >
        <div style={{ 'margin-bottom': '8px', 'font-weight': '600', color: '#60a5fa' }}>
          Component Library Stats
        </div>
        <div style={{ 'line-height': '1.4' }}>
          <div>📦 {demoSections.length} Total Components</div>
          <div>🎭 {demoSections.filter((s) => s.category === 'hero').length} Hero Variants</div>
          <div>
            ⭐ {demoSections.filter((s) => s.category === 'feature').length} Feature Variants
          </div>
          <div>🎨 2 Theme Options</div>
          <div>📱 Fully Responsive</div>
        </div>
      </div>
    </div>
  );
};

export default CompleteTailwindPlusFeatureDemo;
