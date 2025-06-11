import { type Component, For, createSignal } from 'solid-js';
import { css } from '../../styled-system/css';
import { FeatureGrid } from './FeatureGrid';
import { FeatureSimple } from './FeatureSimple';
import { FeatureSplit } from './FeatureSplit';

interface ShowcaseItem {
  title: string;
  description: string;
  component: Component<Record<string, unknown>>;
  props: Record<string, unknown>;
  category: 'split' | 'grid' | 'simple';
}

export const FeatureShowcase: Component = () => {
  const [activeDemo, setActiveDemo] = createSignal(0);
  const [activeCategory, setActiveCategory] = createSignal('all');

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

  const categoryTabsStyles = css({
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  });

  const categoryTabStyles = css({
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    _hover: {
      borderColor: '#6366f1',
      backgroundColor: '#f8fafc',
    },
  });

  const activeCategoryTabStyles = css({
    backgroundColor: '#6366f1',
    color: 'white',
    borderColor: '#6366f1',
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
    overflow: 'hidden',
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

  const showcaseItems: ShowcaseItem[] = [
    {
      title: 'Feature Split - Light (Image Right)',
      description: 'Split layout with content on left and image on right',
      category: 'split',
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
    },
    {
      title: 'Feature Split - Dark (Image Right)',
      description: 'Dark theme variant with enhanced visual effects',
      category: 'split',
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
    },
    {
      title: 'Feature Split - Image Left',
      description: 'Reversed layout with image on left and content on right',
      category: 'split',
      component: FeatureSplit,
      props: {
        badge: 'Deploy faster',
        title: 'A better workflow',
        subtitle:
          'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
        features: featuresData,
        image: {
          src: 'https://tailwindcss.com/plus-assets/img/component-images/project-app-screenshot.png',
          alt: 'Product screenshot',
        },
        layout: 'imageLeft',
        theme: 'light',
        animated: true,
        backgroundPattern: 'none',
        imageOverlay: false,
      },
    },
    {
      title: 'Feature Grid - 3 Columns',
      description: 'Centered layout with image and 3-column feature grid',
      category: 'grid',
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
    },
    {
      title: 'Feature Grid - Dark Theme',
      description: 'Dark variant with enhanced styling and 3-column layout',
      category: 'grid',
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
    },
    {
      title: 'Feature Grid - 2 Columns',
      description: 'Responsive 2-column grid layout for better mobile experience',
      category: 'grid',
      component: FeatureGrid,
      props: {
        badge: 'Everything you need',
        title: 'No server? No problem.',
        subtitle:
          'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis.',
        features: featuresData.concat(featuresData[0]),
        image: {
          src: 'https://tailwindcss.com/plus-assets/img/component-images/project-app-screenshot.png',
          alt: 'App screenshot',
        },
        theme: 'light',
        animated: true,
        backgroundPattern: 'none',
        imageOverlay: false,
        gridColumns: 2,
      },
    },
    {
      title: 'Feature Simple - Light',
      description: 'Minimal layout with title and image only',
      category: 'simple',
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
    },
    {
      title: 'Feature Simple - Dark',
      description: 'Dark theme minimal layout with enhanced styling',
      category: 'simple',
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
    },
    {
      title: 'Feature Simple - Compact',
      description: 'Smaller max-width for more focused content presentation',
      category: 'simple',
      component: FeatureSimple,
      props: {
        title: 'Everything you need to deploy your app',
        image: {
          src: 'https://tailwindcss.com/plus-assets/img/component-images/project-app-screenshot.png',
          alt: 'App screenshot',
        },
        theme: 'light',
        animated: true,
        backgroundPattern: 'none',
        imageOverlay: false,
        maxWidth: '4xl',
      },
    },
  ];

  const filteredItems = () => {
    if (activeCategory() === 'all') return showcaseItems;
    return showcaseItems.filter((item) => item.category === activeCategory());
  };

  const categories = [
    { id: 'all', name: 'All Components' },
    { id: 'split', name: 'Split Layout' },
    { id: 'grid', name: 'Grid Layout' },
    { id: 'simple', name: 'Simple Layout' },
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

  return (
    <div class={containerStyles}>
      <div class={headerStyles}>
        <div class={badgeStyles}>TailwindPlus UI - Feature Components</div>
        <h1 class={titleStyles}>Feature Section Components</h1>
        <p class={subtitleStyles}>
          Professional feature sections with split layouts, grid displays, and minimal
          presentations. All components include state machine architecture, beautiful animations,
          and theme support.
        </p>
      </div>

      <div class={categoryTabsStyles}>
        <For each={categories}>
          {(category) => (
            <button
              class={`${categoryTabStyles} ${activeCategory() === category.id ? activeCategoryTabStyles : ''}`}
              onClick={() => {
                setActiveCategory(category.id);
                setActiveDemo(0);
              }}
            >
              {category.name}
            </button>
          )}
        </For>
      </div>

      <div class={tabsStyles}>
        <For each={filteredItems()}>
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
          <h3 class={demoTitleStyles}>{filteredItems()[activeDemo()]?.title}</h3>
          <p class={demoDescriptionStyles}>{filteredItems()[activeDemo()]?.description}</p>
        </div>
        <div class={demoContentStyles}>
          {filteredItems()[activeDemo()]?.component(filteredItems()[activeDemo()]?.props)}
        </div>
      </div>

      <div class={statsStyles}>
        <div class={statItemStyles}>
          <div class={statNumberStyles}>9+</div>
          <div class={statLabelStyles}>Component Variants</div>
        </div>
        <div class={statItemStyles}>
          <div class={statNumberStyles}>3</div>
          <div class={statLabelStyles}>Layout Types</div>
        </div>
        <div class={statItemStyles}>
          <div class={statNumberStyles}>100%</div>
          <div class={statLabelStyles}>TypeScript</div>
        </div>
        <div class={statItemStyles}>
          <div class={statNumberStyles}>2</div>
          <div class={statLabelStyles}>Theme Variants</div>
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
          Perfect for any use case
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
          From simple product showcases to complex feature comparisons, these components adapt to
          your content needs while maintaining consistent design and performance.
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
            ✨ Beautiful Animations
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
            🎨 Flexible Layouts
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
            📱 Responsive Design
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;
