import { type Component, createEffect, createSignal, For, JSX, onMount, Show } from 'solid-js';
import { css } from '../../../../styled-system/css';
import { usePricingSection } from './state/usePricingSection';

export interface PricingTier {
  id: string;
  name: string;
  price: { monthly: string; annually: string };
  description: string;
  features: string[];
  mostPopular?: boolean;
  cta?: string;
}

export interface PricingFrequency {
  value: 'monthly' | 'annually';
  label: string;
  priceSuffix: string;
}

export interface PricingDemoProps {
  className?: string;
  theme?: 'light' | 'dark';
  animated?: boolean;
}

const sampleTiers: PricingTier[] = [
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

const frequencies: PricingFrequency[] = [
  { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  { value: 'annually', label: 'Annually', priceSuffix: '/year' },
];

export const PricingDemo: Component<PricingDemoProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const pricingSection = usePricingSection();

  const theme = () => props.theme ?? 'light';
  const animated = () => props.animated ?? true;

  onMount(() => {
    setMounted(true);
    pricingSection.mount();
    pricingSection.updateTiers(sampleTiers);

    if (animated()) {
      setTimeout(() => {
        pricingSection.startAnimation();
      }, 100);
    }
  });

  createEffect(() => {
    if (pricingSection.getTheme() !== theme()) {
      pricingSection.toggleTheme();
    }
  });

  const handleTierSelect = (tier: PricingTier) => {
    pricingSection.selectTier(tier.id);
    console.log('Selected tier:', tier);
  };

  const handleFrequencyChange = (frequency: 'monthly' | 'annually') => {
    pricingSection.setFrequency(frequency);
  };

  const containerStyles = css({
    position: 'relative',
    backgroundColor: theme() === 'dark' ? '#111827' : '#ffffff',
    paddingY: '96px',
    minHeight: '100vh',
  });

  const innerContainerStyles = css({
    marginX: 'auto',
    maxWidth: '1792px',
    paddingX: '24px',
  });

  const headerStyles = css({
    marginX: 'auto',
    maxWidth: '1024px',
    textAlign: 'center',
    marginBottom: '64px',
  });

  const titleStyles = css({
    fontSize: '48px',
    lineHeight: '1',
    fontWeight: '600',
    letterSpacing: '-0.025em',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    marginBottom: '16px',
    '@media (min-width: 640px)': {
      fontSize: '64px',
    },
  });

  const subtitleStyles = css({
    fontSize: '18px',
    lineHeight: '28px',
    fontWeight: '500',
    color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
    maxWidth: '512px',
    marginX: 'auto',
    '@media (min-width: 640px)': {
      fontSize: '20px',
      lineHeight: '32px',
    },
  });

  const frequencyToggleStyles = css({
    marginTop: '48px',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '64px',
  });

  const radioGroupStyles = css({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '4px',
    borderRadius: '9999px',
    backgroundColor: theme() === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    padding: '4px',
    textAlign: 'center',
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '600',
  });

  const radioButtonStyles = (selected: boolean) =>
    css({
      cursor: 'pointer',
      borderRadius: '9999px',
      paddingX: '10px',
      paddingY: '4px',
      backgroundColor: selected ? (theme() === 'dark' ? '#6366f1' : '#4f46e5') : 'transparent',
      color: selected ? '#ffffff' : theme() === 'dark' ? '#ffffff' : '#111827',
      transition: 'all 0.2s ease-in-out',
      border: 'none',
      outline: 'none',
      '&:hover': {
        backgroundColor: selected
          ? theme() === 'dark'
            ? '#5b21b6'
            : '#4338ca'
          : theme() === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
      },
    });

  const tiersGridStyles = css({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
    maxWidth: '320px',
    marginX: 'auto',
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      maxWidth: 'none',
      marginX: '0',
    },
  });

  const tierCardStyles = (tier: PricingTier) =>
    css({
      position: 'relative',
      borderRadius: '24px',
      padding: '32px',
      backgroundColor:
        theme() === 'dark'
          ? tier.mostPopular
            ? 'rgba(255, 255, 255, 0.05)'
            : '#1f2937'
          : '#ffffff',
      boxShadow:
        theme() === 'dark'
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: tier.mostPopular
        ? `2px solid ${theme() === 'dark' ? '#6366f1' : '#4f46e5'}`
        : `1px solid ${theme() === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'}`,
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow:
          theme() === 'dark'
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.7)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
      },
    });

  const tierHeaderStyles = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '16px',
  });

  const tierNameStyles = css({
    fontSize: '18px',
    lineHeight: '32px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
  });

  const popularBadgeStyles = css({
    borderRadius: '9999px',
    backgroundColor: theme() === 'dark' ? '#6366f1' : '#4f46e5',
    paddingX: '10px',
    paddingY: '4px',
    fontSize: '12px',
    lineHeight: '20px',
    fontWeight: '600',
    color: '#ffffff',
  });

  const tierDescriptionStyles = css({
    fontSize: '14px',
    lineHeight: '24px',
    color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
    marginBottom: '24px',
  });

  const priceContainerStyles = css({
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    marginBottom: '24px',
  });

  const priceStyles = css({
    fontSize: '48px',
    fontWeight: '600',
    letterSpacing: '-0.025em',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
  });

  const priceSuffixStyles = css({
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
  });

  const ctaButtonStyles = (tier: PricingTier) =>
    css({
      display: 'block',
      width: '100%',
      borderRadius: '8px',
      paddingX: '12px',
      paddingY: '8px',
      textAlign: 'center',
      fontSize: '14px',
      lineHeight: '24px',
      fontWeight: '600',
      backgroundColor: tier.mostPopular
        ? theme() === 'dark'
          ? '#6366f1'
          : '#4f46e5'
        : theme() === 'dark'
          ? 'rgba(255, 255, 255, 0.1)'
          : '#f9fafb',
      color: tier.mostPopular ? '#ffffff' : theme() === 'dark' ? '#ffffff' : '#4f46e5',
      border: tier.mostPopular
        ? 'none'
        : `1px solid ${theme() === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#e5e7eb'}`,
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer',
      textDecoration: 'none',
      marginBottom: '32px',
      '&:hover': {
        backgroundColor: tier.mostPopular
          ? theme() === 'dark'
            ? '#5b21b6'
            : '#4338ca'
          : theme() === 'dark'
            ? 'rgba(255, 255, 255, 0.2)'
            : '#f3f4f6',
      },
    });

  const featuresListStyles = css({
    listStyle: 'none',
    padding: '0',
    margin: '0',
    fontSize: '14px',
    lineHeight: '24px',
    color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
  });

  const featureItemStyles = css({
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '12px',
    '&:last-child': {
      marginBottom: '0',
    },
  });

  const checkIconStyles = css({
    height: '20px',
    width: '20px',
    flexShrink: '0',
    color: theme() === 'dark' ? '#ffffff' : '#4f46e5',
    marginTop: '2px',
  });

  const badgeStyles = css({
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#818cf8' : '#4f46e5',
    marginBottom: '8px',
  });

  return (
    <div class={`${containerStyles} ${props.className || ''}`}>
      <div class={innerContainerStyles}>
        <div class={headerStyles}>
          <div class={badgeStyles}>Pricing</div>
          <h2 class={titleStyles}>Pricing that grows with you</h2>
          <p class={subtitleStyles}>
            Choose an affordable plan that's packed with the best features for engaging your
            audience, creating customer loyalty, and driving sales.
          </p>
        </div>

        <div class={frequencyToggleStyles}>
          <fieldset aria-label="Payment frequency">
            <div class={radioGroupStyles}>
              <For each={frequencies}>
                {(frequency) => (
                  <button
                    type="button"
                    class={radioButtonStyles(
                      pricingSection.getSelectedFrequency() === frequency.value
                    )}
                    onClick={() => handleFrequencyChange(frequency.value)}
                  >
                    {frequency.label}
                  </button>
                )}
              </For>
            </div>
          </fieldset>
        </div>

        <div class={tiersGridStyles}>
          <For each={sampleTiers}>
            {(tier, index) => (
              <div
                class={tierCardStyles(tier)}
                onMouseEnter={() => pricingSection.hoverTier(tier.id)}
                onMouseLeave={() => pricingSection.unhoverTier()}
              >
                <div class={tierHeaderStyles}>
                  <h3 class={tierNameStyles}>{tier.name}</h3>
                  <Show when={tier.mostPopular}>
                    <span class={popularBadgeStyles}>Most popular</span>
                  </Show>
                </div>

                <p class={tierDescriptionStyles}>{tier.description}</p>

                <div class={priceContainerStyles}>
                  <span class={priceStyles}>
                    {tier.price[pricingSection.getSelectedFrequency()]}
                  </span>
                  <span class={priceSuffixStyles}>
                    {
                      frequencies.find((f) => f.value === pricingSection.getSelectedFrequency())
                        ?.priceSuffix
                    }
                  </span>
                </div>

                <button class={ctaButtonStyles(tier)} onClick={() => handleTierSelect(tier)}>
                  {tier.cta || 'Get started'}
                </button>

                <ul class={featuresListStyles}>
                  <For each={tier.features}>
                    {(feature) => (
                      <li class={featureItemStyles}>
                        <svg class={checkIconStyles} fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
