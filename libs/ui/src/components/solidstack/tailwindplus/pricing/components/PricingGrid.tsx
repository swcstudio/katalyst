import { type Component, createEffect, createSignal, For, JSX, onMount, Show } from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { BlurFade } from '../../../magicui/BlurFade';
import { BorderBeam } from '../../../magicui/BorderBeam';
import { DotPattern } from '../../../magicui/DotPattern';
import { ShimmerButton } from '../../../magicui/ShimmerButton';
import { TextAnimate } from '../../../magicui/TextAnimate';
import { usePricingSection } from '../state/usePricingSection';

export interface PricingTier {
  id: string;
  name: string;
  price: { monthly: string; annually: string };
  description: string;
  features: string[];
  href?: string;
  mostPopular?: boolean;
  cta?: string;
}

export interface PricingFrequency {
  value: 'monthly' | 'annually';
  label: string;
  priceSuffix: string;
}

export interface PricingGridProps {
  className?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  tiers: PricingTier[];
  frequencies?: PricingFrequency[];
  defaultFrequency?: 'monthly' | 'annually';
  theme?: 'light' | 'dark';
  animated?: boolean;
  backgroundPattern?: boolean;
  maxTiers?: number;
  onTierSelect?: (tier: PricingTier) => void;
}

export const PricingGrid: Component<PricingGridProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const pricingSection = usePricingSection();

  const theme = () => props.theme ?? 'light';
  const animated = () => props.animated ?? true;
  const backgroundPattern = () => props.backgroundPattern ?? true;
  const maxTiers = () => props.maxTiers ?? 4;

  const defaultFrequencies: PricingFrequency[] = [
    { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
    { value: 'annually', label: 'Annually', priceSuffix: '/year' },
  ];

  const frequencies = () => props.frequencies ?? defaultFrequencies;

  onMount(() => {
    setMounted(true);
    pricingSection.mount();
    pricingSection.updateTiers(props.tiers);

    if (props.defaultFrequency) {
      pricingSection.setFrequency(props.defaultFrequency);
    }

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

  createEffect(() => {
    pricingSection.updateTiers(props.tiers);
  });

  const handleTierSelect = (tier: PricingTier) => {
    pricingSection.selectTier(tier.id);
    props.onTierSelect?.(tier);
  };

  const handleFrequencyChange = (frequency: 'monthly' | 'annually') => {
    pricingSection.setFrequency(frequency);
  };

  const containerStyles = css({
    position: 'relative',
    backgroundColor: theme() === 'dark' ? '#111827' : '#ffffff',
    paddingY: '96px',
    '@media (min-width: 640px)': {
      paddingY: '128px',
    },
  });

  const innerContainerStyles = css({
    marginX: 'auto',
    maxWidth: '1792px',
    paddingX: '24px',
    '@media (min-width: 1024px)': {
      paddingX: '32px',
    },
  });

  const headerStyles = css({
    marginX: 'auto',
    maxWidth: '1024px',
    textAlign: 'center',
  });

  const badgeStyles = css({
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#818cf8' : '#4f46e5',
  });

  const titleStyles = css({
    marginTop: '8px',
    fontSize: '48px',
    lineHeight: '1',
    fontWeight: '600',
    letterSpacing: '-0.025em',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    '@media (min-width: 640px)': {
      fontSize: '64px',
    },
  });

  const subtitleStyles = css({
    marginX: 'auto',
    marginTop: '24px',
    maxWidth: '512px',
    textAlign: 'center',
    fontSize: '18px',
    lineHeight: '28px',
    fontWeight: '500',
    color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
    '@media (min-width: 640px)': {
      fontSize: '20px',
      lineHeight: '32px',
    },
  });

  const frequencyToggleStyles = css({
    marginTop: '64px',
    display: 'flex',
    justifyContent: 'center',
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
    color: theme() === 'dark' ? '#ffffff' : '#111827',
  });

  const radioButtonStyles = (selected: boolean) =>
    css({
      cursor: 'pointer',
      borderRadius: '9999px',
      paddingX: '10px',
      paddingY: '4px',
      backgroundColor: selected ? (theme() === 'dark' ? '#6366f1' : '#4f46e5') : 'transparent',
      color: selected ? '#ffffff' : 'inherit',
      transition: 'all 0.2s ease-in-out',
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
    isolation: 'isolate',
    marginX: 'auto',
    marginTop: '40px',
    display: 'grid',
    maxWidth: '320px',
    gridTemplateColumns: '1fr',
    gap: '32px',
    '@media (min-width: 1024px)': {
      marginX: '0',
      maxWidth: 'none',
      gridTemplateColumns: `repeat(${Math.min(props.tiers.length, maxTiers())}, 1fr)`,
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
      '@media (min-width: 1280px)': {
        padding: '40px',
      },
    });

  const tierHeaderStyles = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
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
    marginTop: '16px',
    fontSize: '14px',
    lineHeight: '24px',
    color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
  });

  const priceContainerStyles = css({
    marginTop: '24px',
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
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
      marginTop: '24px',
      display: 'block',
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
    marginTop: '32px',
    fontSize: '14px',
    lineHeight: '24px',
    color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
    '& > li:not(:first-child)': {
      marginTop: '12px',
    },
    '@media (min-width: 1280px)': {
      marginTop: '40px',
    },
  });

  const featureItemStyles = css({
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  });

  const checkIconStyles = css({
    height: '24px',
    width: '20px',
    flexShrink: '0',
    color: theme() === 'dark' ? '#ffffff' : '#4f46e5',
  });

  return (
    <div class={`${containerStyles} ${props.className || ''}`}>
      <Show when={backgroundPattern()}>
        <DotPattern
          className={css({
            position: 'absolute',
            inset: '0',
            zIndex: '-1',
            opacity: theme() === 'dark' ? '0.1' : '0.05',
          })}
        />
      </Show>

      <div class={innerContainerStyles}>
        <div class={headerStyles}>
          <Show when={props.badge}>
            <BlurFade delay={0.1} inView>
              <h2 class={badgeStyles}>{props.badge}</h2>
            </BlurFade>
          </Show>

          <TextAnimate class={titleStyles} animation="slideUp" delay={0.2}>
            {props.title}
          </TextAnimate>

          <Show when={props.subtitle}>
            <BlurFade delay={0.3} inView>
              <p class={subtitleStyles}>{props.subtitle}</p>
            </BlurFade>
          </Show>
        </div>

        <Show when={frequencies().length > 1}>
          <BlurFade delay={0.4} inView>
            <div class={frequencyToggleStyles}>
              <fieldset aria-label="Payment frequency">
                <div class={radioGroupStyles}>
                  <For each={frequencies()}>
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
          </BlurFade>
        </Show>

        <div class={tiersGridStyles}>
          <For each={props.tiers}>
            {(tier, index) => (
              <BlurFade delay={0.5 + index() * 0.1} inView>
                <div
                  class={tierCardStyles(tier)}
                  onMouseEnter={() => pricingSection.hoverTier(tier.id)}
                  onMouseLeave={() => pricingSection.unhoverTier()}
                >
                  <Show when={tier.mostPopular}>
                    <BorderBeam
                      size={60}
                      duration={12}
                      colorFrom={theme() === 'dark' ? '#6366f1' : '#4f46e5'}
                      colorTo={theme() === 'dark' ? '#8b5cf6' : '#7c3aed'}
                    />
                  </Show>

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
                        frequencies().find((f) => f.value === pricingSection.getSelectedFrequency())
                          ?.priceSuffix
                      }
                    </span>
                  </div>

                  <Show
                    when={tier.mostPopular}
                    fallback={
                      <button class={ctaButtonStyles(tier)} onClick={() => handleTierSelect(tier)}>
                        {tier.cta || 'Get started'}
                      </button>
                    }
                  >
                    <ShimmerButton
                      class={css({
                        marginTop: '24px',
                        width: '100%',
                      })}
                      onClick={() => handleTierSelect(tier)}
                    >
                      {tier.cta || 'Get started'}
                    </ShimmerButton>
                  </Show>

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
              </BlurFade>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
