import { type Component, createSignal } from 'solid-js';
import { css } from '../../../styled-system/css';
import CTASimple from './cta/CTASimple';
import CTASplit from './cta/CTASplit';
import PricingSimple from './pricing/PricingSimple';

export const CTAPricingShowcase: Component = () => {
  const [currentTheme, setCurrentTheme] = createSignal<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setCurrentTheme(currentTheme() === 'light' ? 'dark' : 'light');
  };

  const handleButtonClick = (button: {
    id: string;
    text: string;
    variant: 'primary' | 'secondary';
  }) => {
    console.log('Button clicked:', button);
  };

  const handleTierSelect = (tier: {
    id: string;
    name: string;
    price: { monthly: string; annually: string };
    description: string;
    features: string[];
    href: string;
    cta: string;
    popular?: boolean;
    featured?: boolean;
  }) => {
    console.log('Tier selected:', tier);
  };

  const handleFrequencyChange = (frequency: 'monthly' | 'annually') => {
    console.log('Frequency changed:', frequency);
  };

  // Sample data
  const simpleButtons = [
    {
      id: 'get-started',
      text: 'Get Started',
      variant: 'primary' as const,
    },
    {
      id: 'learn-more',
      text: 'Learn More',
      variant: 'secondary' as const,
    },
  ];

  const splitButtons = [
    {
      id: 'visit-help',
      text: 'Visit the help center',
      variant: 'primary' as const,
    },
    {
      id: 'contact-sales',
      text: 'Contact Sales',
      variant: 'secondary' as const,
    },
  ];

  const sampleImage = {
    src: 'https://images.unsplash.com/photo-1507207611509-ec012433ff52?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=934&q=80',
    alt: 'Team collaboration',
    width: 934,
    height: 600,
  };

  const pricingTiers = [
    {
      id: 'hobby',
      name: 'Hobby',
      price: { monthly: '$29', annually: '$299' },
      description: "The perfect plan if you're just getting started with our product.",
      features: [
        '25 products',
        'Up to 10,000 subscribers',
        'Advanced analytics',
        '24-hour support response time',
      ],
      href: '#',
      cta: 'Get started today',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: '$99', annually: '$999' },
      description: 'Dedicated support and infrastructure for your company.',
      features: [
        'Unlimited products',
        'Unlimited subscribers',
        'Advanced analytics',
        'Dedicated support representative',
        'Marketing automations',
        'Custom integrations',
      ],
      href: '#',
      popular: true,
      cta: 'Get started today',
    },
  ];

  const advancedPricingTiers = [
    {
      id: 'freelancer',
      name: 'Freelancer',
      price: { monthly: '$19', annually: '$199' },
      description: 'The essentials to provide your best work for clients.',
      features: [
        '5 products',
        'Up to 1,000 subscribers',
        'Basic analytics',
        '48-hour support response time',
      ],
      href: '#',
    },
    {
      id: 'startup',
      name: 'Startup',
      price: { monthly: '$49', annually: '$499' },
      description: 'A plan that scales with your rapidly growing business.',
      features: [
        '25 products',
        'Up to 10,000 subscribers',
        'Advanced analytics',
        '24-hour support response time',
        'Marketing automations',
      ],
      href: '#',
      popular: true,
    },
    {
      id: 'enterprise-pro',
      name: 'Enterprise',
      price: { monthly: '$99', annually: '$999' },
      description: 'Dedicated support and infrastructure for your company.',
      features: [
        'Unlimited products',
        'Unlimited subscribers',
        'Advanced analytics',
        '1-hour, dedicated support response time',
        'Marketing automations',
        'Custom reporting tools',
      ],
      href: '#',
      featured: true,
    },
  ];

  const showcaseStyles = css({
    backgroundColor: currentTheme() === 'dark' ? '#0f172a' : '#f8fafc',
    minHeight: '100vh',
    transition: 'background-color 0.3s ease',
  });

  const headerStyles = css({
    padding: '48px 24px',
    textAlign: 'center',
    backgroundColor: currentTheme() === 'dark' ? '#1e293b' : '#ffffff',
    borderBottom: currentTheme() === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
  });

  const titleStyles = css({
    fontSize: '32px',
    fontWeight: 'bold',
    color: currentTheme() === 'dark' ? '#ffffff' : '#1e293b',
    marginBottom: '16px',
  });

  const subtitleStyles = css({
    fontSize: '18px',
    color: currentTheme() === 'dark' ? '#94a3b8' : '#64748b',
    marginBottom: '32px',
  });

  const themeToggleStyles = css({
    padding: '8px 16px',
    backgroundColor: '#6366f1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#5b5bd6',
      transform: 'translateY(-1px)',
    },
  });

  const sectionStyles = css({
    marginBottom: '96px',
  });

  const sectionHeaderStyles = css({
    padding: '0 24px',
    marginBottom: '48px',
    textAlign: 'center',
  });

  const sectionTitleStyles = css({
    fontSize: '24px',
    fontWeight: '600',
    color: currentTheme() === 'dark' ? '#ffffff' : '#1e293b',
    marginBottom: '8px',
  });

  const sectionDescStyles = css({
    fontSize: '16px',
    color: currentTheme() === 'dark' ? '#94a3b8' : '#64748b',
  });

  return (
    <div class={showcaseStyles}>
      <div class={headerStyles}>
        <h1 class={titleStyles}>SolidStack UI CTA & Pricing Components</h1>
        <p class={subtitleStyles}>
          Beautiful, animated CTA and pricing sections with state management and thoughtful UX
        </p>
        <button class={themeToggleStyles} onClick={toggleTheme}>
          Switch to {currentTheme() === 'light' ? 'Dark' : 'Light'} Theme
        </button>
      </div>

      {/* Simple CTA - White Background */}
      <div class={sectionStyles}>
        <div class={sectionHeaderStyles}>
          <h2 class={sectionTitleStyles}>Simple CTA - Clean & Minimal</h2>
          <p class={sectionDescStyles}>
            Perfect for straightforward calls-to-action with beautiful animations
          </p>
        </div>

        <CTASimple
          title="Boost your productivity. Start using our app today."
          subtitle="Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea."
          buttons={simpleButtons}
          theme={currentTheme()}
          animated={true}
          backgroundVariant="white"
          backgroundPattern="none"
          centered={true}
          maxWidth="lg"
          onButtonClick={handleButtonClick}
        />
      </div>

      {/* Simple CTA - Indigo Background */}
      <div class={sectionStyles}>
        <div class={sectionHeaderStyles}>
          <h2 class={sectionTitleStyles}>CTA with Colored Background</h2>
          <p class={sectionDescStyles}>
            Stand out with beautiful colored backgrounds and contrasting text
          </p>
        </div>

        <CTASimple
          title="Ready to dive in? Start your free trial today."
          subtitle="Everything you need to get started with our powerful platform."
          buttons={simpleButtons}
          theme={currentTheme()}
          animated={true}
          backgroundVariant="indigo"
          backgroundPattern="dots"
          centered={true}
          maxWidth="lg"
          onButtonClick={handleButtonClick}
        />
      </div>

      {/* Simple CTA - Gradient with Warp Background */}
      <div class={sectionStyles}>
        <div class={sectionHeaderStyles}>
          <h2 class={sectionTitleStyles}>CTA with Animated Background</h2>
          <p class={sectionDescStyles}>
            Eye-catching gradient backgrounds with animated warp effects
          </p>
        </div>

        <CTASimple
          title="Experience the future of productivity"
          subtitle="Join thousands of teams already using our platform to streamline their workflow."
          buttons={simpleButtons}
          theme={currentTheme()}
          animated={true}
          backgroundVariant="gradient"
          backgroundPattern="warp"
          centered={true}
          maxWidth="lg"
          onButtonClick={handleButtonClick}
        />
      </div>

      {/* Split CTA with Image */}
      <div class={sectionStyles}>
        <div class={sectionHeaderStyles}>
          <h2 class={sectionTitleStyles}>Split CTA with Image</h2>
          <p class={sectionDescStyles}>Content and image side-by-side for maximum impact</p>
        </div>

        <CTASplit
          badge="Award winning support"
          title="We're here to help"
          subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et, egestas tempus tellus etiam sed. Quam a scelerisque amet ullamcorper eu enim et fermentum, augue. Aliquet amet volutpat quisque ut interdum tincidunt duis."
          buttons={splitButtons}
          image={sampleImage}
          imagePosition="left"
          theme={currentTheme()}
          animated={true}
          backgroundVariant="dark"
          backgroundPattern="none"
          imageVariant="card"
          contentAlignment="left"
          showImageOverlay={true}
          onButtonClick={handleButtonClick}
        />
      </div>

      {/* Split CTA with Gradient Image */}
      <div class={sectionStyles}>
        <div class={sectionHeaderStyles}>
          <h2 class={sectionTitleStyles}>Split CTA with Gradient Image Background</h2>
          <p class={sectionDescStyles}>Beautiful gradient backgrounds for premium feel</p>
        </div>

        <CTASplit
          badge="Join our team"
          title="Start building the future with us"
          subtitle="We're looking for talented individuals to join our growing team and help shape the future of productivity."
          buttons={[
            {
              id: 'see-jobs',
              text: 'See job postings',
              variant: 'primary' as const,
            },
            {
              id: 'learn-culture',
              text: 'Learn about our culture',
              variant: 'secondary' as const,
            },
          ]}
          image={{
            src: 'https://images.unsplash.com/photo-1519338381761-c7523edc1f46?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
            alt: 'Team working together',
            width: 800,
            height: 600,
          }}
          imagePosition="right"
          theme={currentTheme()}
          animated={true}
          backgroundVariant="white"
          backgroundPattern="dots"
          imageVariant="gradient"
          contentAlignment="center"
          showImageOverlay={false}
          onButtonClick={handleButtonClick}
        />
      </div>

      {/* Simple Pricing */}
      <div class={sectionStyles}>
        <div class={sectionHeaderStyles}>
          <h2 class={sectionTitleStyles}>Simple Pricing</h2>
          <p class={sectionDescStyles}>
            Clean pricing tables with frequency switching and beautiful animations
          </p>
        </div>

        <PricingSimple
          badge="Pricing"
          title="Choose the right plan for you"
          subtitle="Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales."
          tiers={pricingTiers}
          defaultFrequency="monthly"
          theme={currentTheme()}
          animated={true}
          backgroundPattern="none"
          showFrequencyToggle={true}
          layout="grid"
          maxWidth="lg"
          onTierSelect={handleTierSelect}
          onFrequencyChange={handleFrequencyChange}
        />
      </div>

      {/* Advanced Pricing with 3 Tiers */}
      <div class={sectionStyles}>
        <div class={sectionHeaderStyles}>
          <h2 class={sectionTitleStyles}>Advanced Pricing with Popular Badge</h2>
          <p class={sectionDescStyles}>
            Three-tier pricing with popular indicators and featured highlights
          </p>
        </div>

        <PricingSimple
          badge="Pricing"
          title="Pricing that grows with you"
          subtitle="Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales."
          tiers={advancedPricingTiers}
          defaultFrequency="monthly"
          theme={currentTheme()}
          animated={true}
          backgroundPattern="dots"
          showFrequencyToggle={true}
          layout="grid"
          maxWidth="xl"
          onTierSelect={handleTierSelect}
          onFrequencyChange={handleFrequencyChange}
        />
      </div>

      {/* Row Layout Pricing */}
      <div class={sectionStyles}>
        <div class={sectionHeaderStyles}>
          <h2 class={sectionTitleStyles}>Row Layout Pricing</h2>
          <p class={sectionDescStyles}>Compact row layout perfect for simple pricing structures</p>
        </div>

        <PricingSimple
          badge="Simple Pricing"
          title="One plan, everything included"
          subtitle="Get started with our comprehensive plan that includes everything you need to succeed."
          tiers={[
            {
              id: 'pro',
              name: 'Professional',
              price: { monthly: '$49', annually: '$499' },
              description: 'Everything you need to grow your business and engage your audience.',
              features: [
                'Unlimited products',
                'Unlimited subscribers',
                'Advanced analytics',
                'Priority support',
                'Marketing automations',
                'Custom integrations',
              ],
              href: '#',
              featured: true,
              cta: 'Start free trial',
            },
          ]}
          defaultFrequency="monthly"
          theme={currentTheme()}
          animated={true}
          backgroundPattern="none"
          showFrequencyToggle={true}
          layout="row"
          maxWidth="md"
          onTierSelect={handleTierSelect}
          onFrequencyChange={handleFrequencyChange}
        />
      </div>
    </div>
  );
};

export default CTAPricingShowcase;
