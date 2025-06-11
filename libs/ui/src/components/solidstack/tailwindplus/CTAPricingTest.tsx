import { type Component, createSignal } from 'solid-js';
import { css } from '../../../styled-system/css';
import CTASimple from './cta/CTASimple';
import CTASplit from './cta/CTASplit';
import PricingSimple from './pricing/PricingSimple';

export const CTAPricingTest: Component = () => {
  const [theme, setTheme] = createSignal<'light' | 'dark'>('light');

  const testButtons = [
    {
      id: 'test-primary',
      text: 'Get Started',
      variant: 'primary' as const,
    },
    {
      id: 'test-secondary',
      text: 'Learn More',
      variant: 'secondary' as const,
    },
  ];

  const testImage = {
    src: 'https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png',
    alt: 'Test Image',
    width: 2432,
    height: 1442,
  };

  const testTiers = [
    {
      id: 'basic',
      name: 'Basic',
      price: { monthly: '$19', annually: '$199' },
      description: 'Perfect for getting started',
      features: ['5 projects', 'Basic support', '1GB storage'],
      href: '#',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: '$49', annually: '$499' },
      description: 'For growing businesses',
      features: ['Unlimited projects', 'Priority support', '10GB storage', 'Advanced analytics'],
      href: '#',
      popular: true,
    },
  ];

  const containerStyles = css({
    backgroundColor: theme() === 'dark' ? '#0f172a' : '#f8fafc',
    minHeight: '100vh',
    padding: '48px 0',
  });

  const headerStyles = css({
    textAlign: 'center',
    padding: '0 24px 48px',
  });

  const titleStyles = css({
    fontSize: '32px',
    fontWeight: 'bold',
    color: theme() === 'dark' ? '#ffffff' : '#1e293b',
    marginBottom: '16px',
  });

  const toggleStyles = css({
    padding: '8px 16px',
    backgroundColor: '#6366f1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  });

  const sectionStyles = css({
    marginBottom: '96px',
  });

  return (
    <div class={containerStyles}>
      <div class={headerStyles}>
        <h1 class={titleStyles}>CTA & Pricing Components Test</h1>
        <button
          class={toggleStyles}
          onClick={() => setTheme(theme() === 'light' ? 'dark' : 'light')}
        >
          Toggle Theme ({theme()})
        </button>
      </div>

      <div class={sectionStyles}>
        <CTASimple
          title="Test CTA Simple"
          subtitle="This is a test of the CTASimple component"
          buttons={testButtons}
          theme={theme()}
          animated={true}
          backgroundVariant="white"
          backgroundPattern="dots"
          centered={true}
        />
      </div>

      <div class={sectionStyles}>
        <CTASplit
          badge="Test Badge"
          title="Test CTA Split"
          subtitle="This is a test of the CTASplit component with image"
          buttons={testButtons}
          image={testImage}
          imagePosition="right"
          theme={theme()}
          animated={true}
          backgroundVariant="dark"
          imageVariant="card"
          showImageOverlay={true}
        />
      </div>

      <div class={sectionStyles}>
        <PricingSimple
          badge="Test Pricing"
          title="Test Pricing Component"
          subtitle="This is a test of the PricingSimple component"
          tiers={testTiers}
          theme={theme()}
          animated={true}
          showFrequencyToggle={true}
          layout="grid"
        />
      </div>
    </div>
  );
};

export default CTAPricingTest;
