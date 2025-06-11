import { type Component, For, JSX, Show, createSignal, onMount } from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { BlurFade } from '../magicui/BlurFade';
import { BorderBeam } from '../magicui/BorderBeam';
import { DotPattern } from '../magicui/DotPattern';
import { ShimmerButton } from '../magicui/ShimmerButton';
import { TextAnimate } from '../magicui/TextAnimate';
import { PricingGrid } from './pricing/components/PricingGrid';
import { PricingShowcase } from './pricing/components/PricingShowcase';
import { PricingSplit } from './pricing/components/PricingSplit';
import { PricingTable } from './pricing/components/PricingTable';

const pricingVariants = [
  {
    id: 'grid-light',
    name: 'Grid Layout - Light',
    description: 'Clean grid layout with hover animations',
    component: 'PricingGrid',
    theme: 'light',
  },
  {
    id: 'grid-dark',
    name: 'Grid Layout - Dark',
    description: 'Elegant dark theme with premium styling',
    component: 'PricingGrid',
    theme: 'dark',
  },
  {
    id: 'table-light',
    name: 'Comparison Table - Light',
    description: 'Detailed feature comparison with responsive views',
    component: 'PricingTable',
    theme: 'light',
  },
  {
    id: 'table-dark',
    name: 'Comparison Table - Dark',
    description: 'Dark themed comparison with enhanced contrast',
    component: 'PricingTable',
    theme: 'dark',
  },
  {
    id: 'split-layout',
    name: 'Split Layout',
    description: 'Featured plan with gradient backgrounds',
    component: 'PricingSplit',
    theme: 'dark',
  },
  {
    id: 'showcase',
    name: 'Complete Showcase',
    description: 'All pricing variants in one view',
    component: 'PricingShowcase',
    theme: 'mixed',
  },
];

const gridTiers = [
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
  },
];

const tableTiers = [
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: '$19', annually: '$190' },
    mostPopular: false,
  },
  { id: 'growth', name: 'Growth', price: { monthly: '$49', annually: '$490' }, mostPopular: true },
  { id: 'scale', name: 'Scale', price: { monthly: '$99', annually: '$990' }, mostPopular: false },
];

const tableSections = [
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

const splitTiers = [
  {
    id: 'hobby',
    name: 'Hobby',
    price: { monthly: '$79', annually: '$790' },
    description: 'Perfect for side projects and personal use.',
    features: ['Pariatur quod similique', 'Sapiente libero doloribus', 'Vel ipsa esse repudiandae'],
    featured: false,
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
  },
  {
    id: 'scale',
    name: 'Scale',
    price: { monthly: '$349', annually: '$3490' },
    description: 'Advanced features for large organizations.',
    features: ['Pariatur quod similique', 'Sapiente libero doloribus', 'Vel ipsa esse repudiandae'],
    featured: false,
  },
];

export const ComprehensivePricingDemo: Component = () => {
  const [activeVariant, setActiveVariant] = createSignal('grid-light');
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    setMounted(true);
  });

  const containerStyles = css({
    position: 'relative',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  });

  const headerStyles = css({
    position: 'relative',
    backgroundColor: '#0f172a',
    paddingY: '80px',
    overflow: 'hidden',
  });

  const gradientOverlayStyles = css({
    position: 'absolute',
    inset: '0',
    background:
      'radial-gradient(circle at 30% 40%, rgba(79, 70, 229, 0.3), transparent 50%), radial-gradient(circle at 80% 10%, rgba(124, 58, 237, 0.2), transparent 50%)',
    pointerEvents: 'none',
  });

  const headerContentStyles = css({
    position: 'relative',
    zIndex: '10',
    marginX: 'auto',
    maxWidth: '1280px',
    paddingX: '24px',
    textAlign: 'center',
  });

  const titleStyles = css({
    fontSize: '56px',
    lineHeight: '1',
    fontWeight: '700',
    letterSpacing: '-0.025em',
    color: '#ffffff',
    '@media (min-width: 640px)': {
      fontSize: '72px',
    },
  });

  const subtitleStyles = css({
    marginTop: '24px',
    fontSize: '20px',
    lineHeight: '32px',
    color: '#cbd5e1',
    maxWidth: '768px',
    marginX: 'auto',
  });

  const navigationStyles = css({
    marginTop: '48px',
    padding: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(8px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  });

  const navGridStyles = css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    marginTop: '16px',
  });

  const navItemStyles = (active: boolean) =>
    css({
      position: 'relative',
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: active ? 'rgba(79, 70, 229, 0.2)' : 'rgba(255, 255, 255, 0.05)',
      border: active ? '2px solid #4f46e5' : '1px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: active ? 'rgba(79, 70, 229, 0.3)' : 'rgba(255, 255, 255, 0.1)',
        borderColor: active ? '#6366f1' : 'rgba(255, 255, 255, 0.2)',
      },
    });

  const navTitleStyles = css({
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '4px',
  });

  const navDescriptionStyles = css({
    fontSize: '14px',
    color: '#94a3b8',
  });

  const contentStyles = css({
    position: 'relative',
  });

  const renderActiveComponent = () => {
    const variant = pricingVariants.find((v) => v.id === activeVariant());
    if (!variant) return null;

    switch (variant.component) {
      case 'PricingGrid':
        return (
          <PricingGrid
            badge="Pricing"
            title={variant.theme === 'dark' ? 'Pricing that grows with you' : 'Choose your plan'}
            subtitle={
              variant.theme === 'dark'
                ? "Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales."
                : 'Find the perfect plan for your business needs with our flexible pricing options.'
            }
            tiers={gridTiers}
            theme={variant.theme as 'light' | 'dark'}
            animated={true}
            backgroundPattern={true}
            onTierSelect={(tier) => console.log('Selected tier:', tier)}
          />
        );
      case 'PricingTable':
        return (
          <PricingTable
            badge={variant.theme === 'dark' ? 'Enterprise Features' : 'Compare Plans'}
            title={
              variant.theme === 'dark' ? 'Pricing that scales' : 'Choose the right plan for you'
            }
            subtitle={
              variant.theme === 'dark'
                ? 'Advanced features and capabilities designed for growing businesses and enterprises.'
                : 'Compare features across all plans to find the perfect fit for your needs.'
            }
            tiers={tableTiers}
            sections={tableSections}
            theme={variant.theme as 'light' | 'dark'}
            animated={true}
            backgroundPattern={true}
            onTierSelect={(tier) => console.log('Selected tier:', tier)}
          />
        );
      case 'PricingSplit':
        return (
          <PricingSplit
            badge="Most Popular"
            title="The right price for you"
            subtitle="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit numquam eligendi quos odit doloribus molestiae voluptatum."
            tiers={splitTiers}
            theme="dark"
            animated={true}
            backgroundPattern={true}
            gradientBackground={true}
            onTierSelect={(tier) => console.log('Selected tier:', tier)}
          />
        );
      case 'PricingShowcase':
        return <PricingShowcase />;
      default:
        return null;
    }
  };

  return (
    <div class={containerStyles}>
      <DotPattern
        className={css({
          position: 'absolute',
          inset: '0',
          zIndex: '0',
          opacity: '0.03',
        })}
      />

      <header class={headerStyles}>
        <div class={gradientOverlayStyles} />

        <DotPattern
          className={css({
            position: 'absolute',
            inset: '0',
            zIndex: '1',
            opacity: '0.1',
          })}
        />

        <div class={headerContentStyles}>
          <TextAnimate class={titleStyles} animation="slideUp" delay={0.1}>
            SolidStack-UI Pricing Components
          </TextAnimate>

          <BlurFade delay={0.2} inView>
            <p class={subtitleStyles}>
              State-of-the-art pricing components with Zag.js state machines, PandaCSS styling, and
              thoughtful animation augmentations from Aceternity UI & Magic UI.
            </p>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <div class={navigationStyles}>
              <BorderBeam size={80} duration={15} colorFrom="#6366f1" colorTo="#8b5cf6" />

              <h3
                class={css({
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '16px',
                  textAlign: 'center',
                })}
              >
                Choose a pricing variant to explore
              </h3>

              <div class={navGridStyles}>
                <For each={pricingVariants}>
                  {(variant) => (
                    <div
                      class={navItemStyles(activeVariant() === variant.id)}
                      onClick={() => setActiveVariant(variant.id)}
                    >
                      <h4 class={navTitleStyles}>{variant.name}</h4>
                      <p class={navDescriptionStyles}>{variant.description}</p>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </BlurFade>
        </div>
      </header>

      <main class={contentStyles}>
        <Show when={mounted()}>{renderActiveComponent()}</Show>
      </main>

      <footer
        class={css({
          backgroundColor: '#0f172a',
          paddingY: '48px',
          textAlign: 'center',
        })}
      >
        <div
          class={css({
            marginX: 'auto',
            maxWidth: '1280px',
            paddingX: '24px',
          })}
        >
          <p
            class={css({
              fontSize: '16px',
              color: '#94a3b8',
            })}
          >
            Built with SolidJS, Zag.js State Machines, PandaCSS, and enhanced with animations from
            Aceternity UI & Magic UI
          </p>

          <div
            class={css({
              marginTop: '24px',
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
            })}
          >
            <span
              class={css({
                fontSize: '14px',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              })}
            >
              <div
                class={css({
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                })}
              />
              State Machine Architecture
            </span>
            <span
              class={css({
                fontSize: '14px',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              })}
            >
              <div
                class={css({
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                })}
              />
              Animation Augmented
            </span>
            <span
              class={css({
                fontSize: '14px',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              })}
            >
              <div
                class={css({
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#8b5cf6',
                })}
              />
              Enterprise Ready
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
