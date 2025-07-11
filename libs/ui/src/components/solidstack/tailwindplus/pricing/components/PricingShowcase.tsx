import { type Component, createSignal, For, JSX, Show } from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { BlurFade } from '../../../magicui/BlurFade';
import { BorderBeam } from '../../../magicui/BorderBeam';
import { DotPattern } from '../../../magicui/DotPattern';
import { TextAnimate } from '../../../magicui/TextAnimate';
import { PricingGrid } from './PricingGrid';
import { PricingSplit } from './PricingSplit';
import { PricingTable } from './PricingTable';

// Sample data for different pricing scenarios
const gridPricingTiers = [
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
    mostPopular: false,
    cta: 'Get started',
  },
  {
    id: 'startup',
    name: 'Startup',
    price: { monthly: '$29', annually: '$299' },
    description: 'A plan that scales with your rapidly growing business.',
    features: [
      '25 products',
      'Up to 10,000 subscribers',
      'Advanced analytics',
      '24-hour support response time',
      'Marketing automations',
    ],
    mostPopular: true,
    cta: 'Start free trial',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: '$59', annually: '$599' },
    description: 'Dedicated support and infrastructure for your company.',
    features: [
      'Unlimited products',
      'Unlimited subscribers',
      'Advanced analytics',
      '1-hour, dedicated support response time',
      'Marketing automations',
      'Custom reporting tools',
    ],
    mostPopular: false,
    cta: 'Contact sales',
  },
];

const tablePricingTiers = [
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: '$19', annually: '$190' },
    mostPopular: false,
  },
  { id: 'growth', name: 'Growth', price: { monthly: '$49', annually: '$490' }, mostPopular: true },
  { id: 'scale', name: 'Scale', price: { monthly: '$99', annually: '$990' }, mostPopular: false },
];

const tablePricingSections = [
  {
    name: 'Features',
    features: [
      { name: 'Edge content delivery', tiers: { Starter: true, Growth: true, Scale: true } },
      { name: 'Custom domains', tiers: { Starter: '1', Growth: '3', Scale: 'Unlimited' } },
      { name: 'Team members', tiers: { Starter: '3', Growth: '20', Scale: 'Unlimited' } },
      { name: 'Single sign-on (SSO)', tiers: { Starter: false, Growth: false, Scale: true } },
    ],
  },
  {
    name: 'Reporting',
    features: [
      { name: 'Advanced analytics', tiers: { Starter: true, Growth: true, Scale: true } },
      { name: 'Basic reports', tiers: { Starter: false, Growth: true, Scale: true } },
      { name: 'Professional reports', tiers: { Starter: false, Growth: false, Scale: true } },
      { name: 'Custom report builder', tiers: { Starter: false, Growth: false, Scale: true } },
    ],
  },
  {
    name: 'Support',
    features: [
      { name: '24/7 online support', tiers: { Starter: true, Growth: true, Scale: true } },
      { name: 'Quarterly workshops', tiers: { Starter: false, Growth: true, Scale: true } },
      { name: 'Priority phone support', tiers: { Starter: false, Growth: false, Scale: true } },
      { name: '1:1 onboarding tour', tiers: { Starter: false, Growth: false, Scale: true } },
    ],
  },
];

const splitPricingTiers = [
  {
    id: 'hobby',
    name: 'Hobby',
    price: { monthly: '$79', annually: '$790' },
    description: 'Perfect for side projects and personal use.',
    features: ['Pariatur quod similique', 'Sapiente libero doloribus', 'Vel ipsa esse repudiandae'],
    featured: false,
    cta: 'Start your trial',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: { monthly: '$149', annually: '$1490' },
    description: 'The best solution for growing businesses.',
    features: [
      'Quia rem est sed impedit magnam',
      'Dolorem vero ratione voluptates',
      'Qui sed ab doloribus voluptatem dolore',
      'Laborum commodi molestiae id et fugiat',
      'Nam ut ipsa nesciunt culpa modi dolor',
    ],
    featured: true,
    cta: 'Start your trial',
  },
  {
    id: 'scale',
    name: 'Scale',
    price: { monthly: '$349', annually: '$3490' },
    description: 'Advanced features for large organizations.',
    features: ['Pariatur quod similique', 'Sapiente libero doloribus', 'Vel ipsa esse repudiandae'],
    featured: false,
    cta: 'Start your trial',
  },
];

const fourTierPricing = [
  {
    id: 'hobby',
    name: 'Hobby',
    price: { monthly: '$19', annually: '$199' },
    description: 'The essentials to provide your best work for clients.',
    features: ['5 products', 'Up to 1,000 subscribers', 'Basic analytics'],
    mostPopular: false,
  },
  {
    id: 'freelancer',
    name: 'Freelancer',
    price: { monthly: '$29', annually: '$299' },
    description: 'The essentials to provide your best work for clients.',
    features: [
      '5 products',
      'Up to 1,000 subscribers',
      'Basic analytics',
      '48-hour support response time',
    ],
    mostPopular: false,
  },
  {
    id: 'startup',
    name: 'Startup',
    price: { monthly: '$59', annually: '$599' },
    description: 'A plan that scales with your rapidly growing business.',
    features: [
      '25 products',
      'Up to 10,000 subscribers',
      'Advanced analytics',
      '24-hour support response time',
      'Marketing automations',
    ],
    mostPopular: true,
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
      '1-hour, dedicated support response time',
      'Marketing automations',
      'Custom reporting tools',
    ],
    mostPopular: false,
  },
];

interface PricingShowcaseProps {
  className?: string;
}

export const PricingShowcase: Component<PricingShowcaseProps> = (props) => {
  const [selectedDemo, setSelectedDemo] = createSignal('all');

  const containerStyles = css({
    position: 'relative',
    backgroundColor: '#f8fafc',
    paddingY: '64px',
  });

  const headerStyles = css({
    marginX: 'auto',
    maxWidth: '1280px',
    paddingX: '24px',
    textAlign: 'center',
    marginBottom: '80px',
  });

  const titleStyles = css({
    fontSize: '48px',
    lineHeight: '1',
    fontWeight: '700',
    letterSpacing: '-0.025em',
    color: '#0f172a',
    '@media (min-width: 640px)': {
      fontSize: '64px',
    },
  });

  const subtitleStyles = css({
    marginTop: '24px',
    fontSize: '20px',
    lineHeight: '32px',
    color: '#64748b',
    maxWidth: '768px',
    marginX: 'auto',
  });

  const demoSelectorStyles = css({
    marginTop: '40px',
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  });

  const demoButtonStyles = (active: boolean) =>
    css({
      paddingX: '16px',
      paddingY: '8px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      border: '1px solid #e2e8f0',
      backgroundColor: active ? '#4f46e5' : '#ffffff',
      color: active ? '#ffffff' : '#475569',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: active ? '#4338ca' : '#f8fafc',
      },
    });

  const sectionStyles = css({
    marginBottom: '120px',
    '&:last-child': {
      marginBottom: '0',
    },
  });

  const sectionHeaderStyles = css({
    marginX: 'auto',
    maxWidth: '1280px',
    paddingX: '24px',
    marginBottom: '48px',
    textAlign: 'center',
  });

  const sectionTitleStyles = css({
    fontSize: '32px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '12px',
  });

  const sectionDescriptionStyles = css({
    fontSize: '16px',
    color: '#64748b',
  });

  const demos = [
    { id: 'all', label: 'All Demos' },
    { id: 'grid-light', label: 'Grid Light' },
    { id: 'grid-dark', label: 'Grid Dark' },
    { id: 'table-light', label: 'Table Light' },
    { id: 'table-dark', label: 'Table Dark' },
    { id: 'split', label: 'Split Layout' },
    { id: 'four-tier', label: 'Four Tiers' },
  ];

  const shouldShowDemo = (demoId: string) => {
    return selectedDemo() === 'all' || selectedDemo() === demoId;
  };

  return (
    <div class={`${containerStyles} ${props.className || ''}`}>
      <DotPattern
        className={css({
          position: 'absolute',
          inset: '0',
          zIndex: '0',
          opacity: '0.03',
        })}
      />

      <div class={headerStyles}>
        <TextAnimate class={titleStyles} animation="slideUp" delay={0.1}>
          Pricing Components Showcase
        </TextAnimate>

        <BlurFade delay={0.2} inView>
          <p class={subtitleStyles}>
            Comprehensive collection of pricing components with state-of-the-art animations and
            Zag.js state management. Choose from various layouts and themes to fit your design
            needs.
          </p>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <div class={demoSelectorStyles}>
            <For each={demos}>
              {(demo) => (
                <button
                  class={demoButtonStyles(selectedDemo() === demo.id)}
                  onClick={() => setSelectedDemo(demo.id)}
                >
                  {demo.label}
                </button>
              )}
            </For>
          </div>
        </BlurFade>
      </div>

      <Show when={shouldShowDemo('grid-light')}>
        <section class={sectionStyles}>
          <div class={sectionHeaderStyles}>
            <h2 class={sectionTitleStyles}>Grid Layout - Light Theme</h2>
            <p class={sectionDescriptionStyles}>
              Clean grid layout with hover animations and frequency toggle
            </p>
          </div>
          <PricingGrid
            badge="Pricing"
            title="Choose your plan"
            subtitle="Find the perfect plan for your business needs with our flexible pricing options."
            tiers={gridPricingTiers}
            theme="light"
            animated={true}
            backgroundPattern={true}
            onTierSelect={(tier) => console.log('Selected tier:', tier)}
          />
        </section>
      </Show>

      <Show when={shouldShowDemo('grid-dark')}>
        <section class={sectionStyles}>
          <div class={sectionHeaderStyles}>
            <h2 class={sectionTitleStyles}>Grid Layout - Dark Theme</h2>
            <p class={sectionDescriptionStyles}>
              Elegant dark theme with premium styling and enhanced animations
            </p>
          </div>
          <PricingGrid
            badge="Premium Plans"
            title="Pricing that grows with you"
            subtitle="Choose an affordable plan that's packed with the best features for engaging your audience."
            tiers={gridPricingTiers}
            theme="dark"
            animated={true}
            backgroundPattern={true}
            onTierSelect={(tier) => console.log('Selected tier:', tier)}
          />
        </section>
      </Show>

      <Show when={shouldShowDemo('table-light')}>
        <section class={sectionStyles}>
          <div class={sectionHeaderStyles}>
            <h2 class={sectionTitleStyles}>Comparison Table - Light Theme</h2>
            <p class={sectionDescriptionStyles}>
              Detailed feature comparison with responsive mobile and desktop views
            </p>
          </div>
          <PricingTable
            badge="Compare Plans"
            title="Choose the right plan for you"
            subtitle="Compare features across all plans to find the perfect fit for your needs."
            tiers={tablePricingTiers}
            sections={tablePricingSections}
            theme="light"
            animated={true}
            backgroundPattern={true}
            onTierSelect={(tier) => console.log('Selected tier:', tier)}
          />
        </section>
      </Show>

      <Show when={shouldShowDemo('table-dark')}>
        <section class={sectionStyles}>
          <div class={sectionHeaderStyles}>
            <h2 class={sectionTitleStyles}>Comparison Table - Dark Theme</h2>
            <p class={sectionDescriptionStyles}>
              Dark themed comparison table with enhanced contrast and readability
            </p>
          </div>
          <PricingTable
            badge="Enterprise Features"
            title="Pricing that scales"
            subtitle="Advanced features and capabilities designed for growing businesses and enterprises."
            tiers={tablePricingTiers}
            sections={tablePricingSections}
            theme="dark"
            animated={true}
            backgroundPattern={true}
            onTierSelect={(tier) => console.log('Selected tier:', tier)}
          />
        </section>
      </Show>

      <Show when={shouldShowDemo('split')}>
        <section class={sectionStyles}>
          <div class={sectionHeaderStyles}>
            <h2 class={sectionTitleStyles}>Split Layout with Featured Plan</h2>
            <p class={sectionDescriptionStyles}>
              Highlight your most popular plan with enhanced visual emphasis and gradient
              backgrounds
            </p>
          </div>
          <PricingSplit
            badge="Most Popular"
            title="The right price for you"
            subtitle="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit numquam eligendi quos odit doloribus molestiae voluptatum."
            tiers={splitPricingTiers}
            theme="dark"
            animated={true}
            backgroundPattern={true}
            gradientBackground={true}
            onTierSelect={(tier) => console.log('Selected tier:', tier)}
          />
        </section>
      </Show>

      <Show when={shouldShowDemo('four-tier')}>
        <section class={sectionStyles}>
          <div class={sectionHeaderStyles}>
            <h2 class={sectionTitleStyles}>Four Tier Layout</h2>
            <p class={sectionDescriptionStyles}>
              Extended pricing options with four different tiers for maximum flexibility
            </p>
          </div>
          <PricingGrid
            badge="Flexible Options"
            title="Plans for every stage"
            subtitle="From hobby projects to enterprise solutions, we have a plan that fits your needs."
            tiers={fourTierPricing}
            theme="light"
            animated={true}
            backgroundPattern={true}
            maxTiers={4}
            onTierSelect={(tier) => console.log('Selected tier:', tier)}
          />
        </section>
      </Show>
    </div>
  );
};
