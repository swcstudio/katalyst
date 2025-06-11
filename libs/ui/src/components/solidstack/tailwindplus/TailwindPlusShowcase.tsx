import { type Component, For, createSignal } from 'solid-js';
import { css } from '../../styled-system/css';
import { HeroSimple } from './HeroSimple';
import { HeroSplit } from './HeroSplit';

interface ShowcaseItem {
  title: string;
  description: string;
  component: Component<any>;
  props: Record<string, any>;
  height?: string;
}

export const TailwindPlusShowcase: Component = () => {
  const [activeDemo, setActiveDemo] = createSignal(0);

  const containerStyles = css({
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '48px 24px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  });

  const headerStyles = css({
    textAlign: 'center',
    marginBottom: '64px',
  });

  const titleStyles = css({
    fontSize: '48px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    color: 'transparent',
    marginBottom: '16px',
    letterSpacing: '-0.02em',
  });

  const subtitleStyles = css({
    fontSize: '20px',
    color: '#64748b',
    maxWidth: '720px',
    margin: '0 auto',
    lineHeight: '1.6',
  });

  const badgeStyles = css({
    display: 'inline-block',
    backgroundColor: '#ddd6fe',
    color: '#7c3aed',
    fontSize: '14px',
    fontWeight: '600',
    padding: '6px 16px',
    borderRadius: '20px',
    marginBottom: '24px',
  });

  const tabsStyles = css({
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '48px',
    flexWrap: 'wrap',
  });

  const tabStyles = css({
    padding: '12px 24px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    _hover: {
      borderColor: '#6366f1',
      backgroundColor: '#f8fafc',
    },
  });

  const activeTabStyles = css({
    backgroundColor: '#6366f1',
    color: 'white',
    borderColor: '#6366f1',
  });

  const demoContainerStyles = css({
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    marginBottom: '32px',
  });

  const demoHeaderStyles = css({
    padding: '24px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  });

  const demoTitleStyles = css({
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px',
  });

  const demoDescriptionStyles = css({
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.5',
  });

  const demoContentStyles = css({
    position: 'relative',
    height: '600px',
    overflow: 'hidden',
  });

  const showcaseItems: ShowcaseItem[] = [
    {
      title: 'Hero Simple - Light Theme',
      description: 'Clean and minimal hero section with animated text and smooth hover effects',
      component: HeroSimple,
      props: {
        title: 'Data to enrich your online business',
        subtitle:
          'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.',
        primaryButton: {
          text: 'Get started',
          href: '#',
        },
        secondaryButton: {
          text: 'Learn more',
          href: '#',
        },
        announcement: {
          text: 'Announcing our next round of funding.',
          linkText: 'Read more',
          href: '#',
        },
        backgroundPattern: true,
        theme: 'light',
      },
    },
    {
      title: 'Hero Simple - Dark Theme',
      description: 'Dark variant with enhanced visual effects and modern styling',
      component: HeroSimple,
      props: {
        title: 'Deploy to the cloud with confidence',
        subtitle:
          'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.',
        primaryButton: {
          text: 'Get started',
          href: '#',
        },
        secondaryButton: {
          text: 'Learn more',
          href: '#',
        },
        announcement: {
          text: 'Just shipped v1.0',
          linkText: "What's new",
          href: '#',
        },
        backgroundPattern: true,
        theme: 'dark',
      },
    },
    {
      title: 'Hero Split - Image Right',
      description:
        'Split layout with content on left and image on right, includes stats and advanced animations',
      component: HeroSplit,
      props: {
        title: 'Deploy to the cloud with confidence',
        subtitle:
          'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.',
        primaryButton: {
          text: 'Get started',
          href: '#',
        },
        secondaryButton: {
          text: 'Learn more',
          href: '#',
        },
        announcement: {
          badge: "What's new",
          text: 'Just shipped v1.0',
          linkText: 'Read more',
          href: '#',
        },
        image: {
          src: 'https://tailwindcss.com/plus-assets/img/component-images/project-app-screenshot.png',
          alt: 'App screenshot',
        },
        stats: [
          { value: '99%', label: 'Uptime' },
          { value: '12M+', label: 'Requests' },
          { value: '99.9%', label: 'Accuracy' },
        ],
        layout: 'imageRight',
        backgroundPattern: 'dots',
        theme: 'light',
        animated: true,
      },
    },
    {
      title: 'Hero Split - Image Left',
      description: 'Reversed split layout with image on left and content on right',
      component: HeroSplit,
      props: {
        title: 'Supercharge your web app',
        subtitle:
          'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
        primaryButton: {
          text: 'Documentation',
          href: '#',
        },
        secondaryButton: {
          text: 'View on GitHub',
          href: '#',
        },
        announcement: {
          badge: "What's new",
          text: 'Just shipped v0.1.0',
          linkText: 'Read more',
          href: '#',
        },
        image: {
          src: 'https://images.unsplash.com/photo-1567532900872-f4e906cbf06a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80',
          alt: 'Team collaboration',
        },
        layout: 'imageLeft',
        backgroundPattern: 'warp',
        theme: 'light',
        animated: true,
      },
    },
    {
      title: 'Hero Split - Video Player',
      description: 'Hero with embedded video player and interactive play button',
      component: HeroSplit,
      props: {
        title: 'A better way to ship your projects',
        subtitle:
          'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.',
        primaryButton: {
          text: 'Get started',
          href: '#',
        },
        secondaryButton: {
          text: 'Live demo',
          href: '#',
        },
        announcement: {
          badge: "We're hiring",
          text: 'See open positions',
          linkText: 'Apply now',
          href: '#',
        },
        video: {
          thumbnail:
            'https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          title: 'Watch our video to learn more',
        },
        stats: [
          { value: '50K+', label: 'Users' },
          { value: '99.9%', label: 'Uptime' },
          { value: '24/7', label: 'Support' },
        ],
        layout: 'videoRight',
        backgroundPattern: 'dots',
        theme: 'light',
        animated: true,
      },
    },
    {
      title: 'Hero Split - Dark Theme',
      description: 'Dark theme variant with enhanced visual effects and modern styling',
      component: HeroSplit,
      props: {
        title: "We're changing the way people connect",
        subtitle:
          'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.',
        primaryButton: {
          text: 'Get started',
          href: '#',
        },
        secondaryButton: {
          text: 'Learn more',
          href: '#',
        },
        announcement: {
          badge: 'New',
          text: 'Advanced analytics',
          linkText: 'Learn more',
          href: '#',
        },
        image: {
          src: 'https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png',
          alt: 'Dark app screenshot',
        },
        stats: [
          { value: '100M+', label: 'Messages' },
          { value: '150K+', label: 'Teams' },
          { value: '99.9%', label: 'Uptime' },
        ],
        layout: 'imageRight',
        backgroundPattern: 'warp',
        theme: 'dark',
        animated: true,
      },
    },
  ];

  const statsStyles = css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    marginTop: '48px',
    padding: '32px',
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  });

  const statItemStyles = css({
    textAlign: 'center',
  });

  const statNumberStyles = css({
    fontSize: '32px',
    fontWeight: '800',
    color: '#6366f1',
    marginBottom: '8px',
  });

  const statLabelStyles = css({
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
  });

  const featuresStyles = css({
    marginTop: '48px',
    padding: '32px',
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  });

  const featuresTitleStyles = css({
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '24px',
    textAlign: 'center',
  });

  const featuresGridStyles = css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  });

  const featureItemStyles = css({
    textAlign: 'center',
    padding: '16px',
  });

  const featureIconStyles = css({
    width: '48px',
    height: '48px',
    backgroundColor: '#ddd6fe',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    color: '#7c3aed',
  });

  const featureNameStyles = css({
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px',
  });

  const featureDescStyles = css({
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.5',
  });

  const features = [
    {
      name: 'State Machine Architecture',
      description: 'Built with Zag.js state machines for predictable and robust state management',
      icon: '⚙️',
    },
    {
      name: 'Beautiful Animations',
      description: 'Thoughtfully integrated animations from Magic UI and Aceternity UI collections',
      icon: '✨',
    },
    {
      name: 'TypeScript Ready',
      description: 'Full TypeScript support with comprehensive type definitions and interfaces',
      icon: '🔷',
    },
    {
      name: 'Responsive Design',
      description: 'Mobile-first responsive design that works perfectly on all screen sizes',
      icon: '📱',
    },
    {
      name: 'Theme Support',
      description: 'Light and dark theme variants with smooth transitions and proper contrast',
      icon: '🌙',
    },
    {
      name: 'Performance Optimized',
      description: 'Optimized for performance with lazy loading and efficient rendering',
      icon: '🚀',
    },
  ];

  return (
    <div class={containerStyles}>
      <div class={headerStyles}>
        <div class={badgeStyles}>TailwindPlus UI - Hero Components</div>
        <h1 class={titleStyles}>Enterprise Hero Components</h1>
        <p class={subtitleStyles}>
          Professional hero sections with state machine architecture, beautiful animations, and
          modern design patterns. Built with SolidJS, Zag.js, and enhanced with Magic UI animations.
        </p>
      </div>

      <div class={tabsStyles}>
        <For each={showcaseItems}>
          {(item, index) => (
            <button
              class={`${tabStyles} ${activeDemo() === index() ? activeTabStyles : ''}`}
              onClick={() => setActiveDemo(index())}
            >
              {item.title.split(' - ')[0]}
            </button>
          )}
        </For>
      </div>

      <div class={demoContainerStyles}>
        <div class={demoHeaderStyles}>
          <h3 class={demoTitleStyles}>{showcaseItems[activeDemo()].title}</h3>
          <p class={demoDescriptionStyles}>{showcaseItems[activeDemo()].description}</p>
        </div>
        <div class={demoContentStyles}>
          {showcaseItems[activeDemo()].component(showcaseItems[activeDemo()].props)}
        </div>
      </div>

      <div class={statsStyles}>
        <div class={statItemStyles}>
          <div class={statNumberStyles}>6+</div>
          <div class={statLabelStyles}>Hero Variants</div>
        </div>
        <div class={statItemStyles}>
          <div class={statNumberStyles}>2</div>
          <div class={statLabelStyles}>Core Components</div>
        </div>
        <div class={statItemStyles}>
          <div class={statNumberStyles}>100%</div>
          <div class={statLabelStyles}>TypeScript</div>
        </div>
        <div class={statItemStyles}>
          <div class={statNumberStyles}>0</div>
          <div class={statLabelStyles}>Dependencies</div>
        </div>
      </div>

      <div class={featuresStyles}>
        <h2 class={featuresTitleStyles}>Key Features</h2>
        <div class={featuresGridStyles}>
          <For each={features}>
            {(feature) => (
              <div class={featureItemStyles}>
                <div class={featureIconStyles}>
                  <span style={{ 'font-size': '20px' }}>{feature.icon}</span>
                </div>
                <h3 class={featureNameStyles}>{feature.name}</h3>
                <p class={featureDescStyles}>{feature.description}</p>
              </div>
            )}
          </For>
        </div>
      </div>

      <div
        style={{
          'text-align': 'center',
          'margin-top': '64px',
          padding: '48px 32px',
          'background-color': 'white',
          'border-radius': '16px',
          border: '1px solid #e2e8f0',
          'box-shadow': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }}
      >
        <h3
          style={{
            'font-size': '28px',
            'font-weight': '700',
            color: '#1e293b',
            'margin-bottom': '16px',
          }}
        >
          Ready to build amazing experiences?
        </h3>
        <p
          style={{
            'font-size': '16px',
            color: '#64748b',
            'margin-bottom': '32px',
            'max-width': '600px',
            margin: '0 auto 32px',
          }}
        >
          All components are production-ready, fully documented, and designed to work seamlessly
          together. Start building your next project with confidence.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            'justify-content': 'center',
            'flex-wrap': 'wrap',
          }}
        >
          <div
            style={{
              padding: '8px 16px',
              'background-color': '#f0f9ff',
              color: '#0369a1',
              'border-radius': '8px',
              'font-size': '14px',
              'font-weight': '500',
            }}
          >
            🏗️ State Machine Architecture
          </div>
          <div
            style={{
              padding: '8px 16px',
              'background-color': '#f0fdf4',
              color: '#15803d',
              'border-radius': '8px',
              'font-size': '14px',
              'font-weight': '500',
            }}
          >
            ⚡ High Performance
          </div>
          <div
            style={{
              padding: '8px 16px',
              'background-color': '#fefce8',
              color: '#a16207',
              'border-radius': '8px',
              'font-size': '14px',
              'font-weight': '500',
            }}
          >
            🎨 Beautiful Animations
          </div>
          <div
            style={{
              padding: '8px 16px',
              'background-color': '#fdf2f8',
              color: '#be185d',
              'border-radius': '8px',
              'font-size': '14px',
              'font-weight': '500',
            }}
          >
            📱 Fully Responsive
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailwindPlusShowcase;
