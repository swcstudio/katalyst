import { type Component, For, JSX, createEffect, createSignal, onMount } from 'solid-js';
import { css } from '../../../../styled-system/css';
import { BlurFade } from '../../magicui/BlurFade';
import { BorderBeam } from '../../magicui/BorderBeam';
import { DotPattern } from '../../magicui/DotPattern';
import { ShimmerButton } from '../../magicui/ShimmerButton';
import { TextAnimate } from '../../magicui/TextAnimate';
import { usePricingSection } from './state/usePricingSection';

export interface PricingTier {
  id: string;
  name: string;
  price: { monthly: string; annually: string } | string;
  description: string;
  features: string[];
  href?: string;
  popular?: boolean;
  featured?: boolean;
  cta?: string;
}

export interface PricingFrequency {
  value: 'monthly' | 'annually';
  label: string;
  priceSuffix: string;
}

export interface PricingSimpleProps {
  className?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  tiers: PricingTier[];
  frequencies?: PricingFrequency[];
  defaultFrequency?: 'monthly' | 'annually';
  theme?: 'light' | 'dark';
  animated?: boolean;
  backgroundPattern?: 'none' | 'dots';
  showFrequencyToggle?: boolean;
  layout?: 'grid' | 'row';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onTierSelect?: (tier: PricingTier) => void;
  onFrequencyChange?: (frequency: 'monthly' | 'annually') => void;
}

export const PricingSimple: Component<PricingSimpleProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const pricingSection = usePricingSection();

  const theme = () => props.theme ?? 'light';
  const animated = () => props.animated ?? true;
  const backgroundPattern = () => props.backgroundPattern ?? 'none';
  const showFrequencyToggle = () => props.showFrequencyToggle ?? true;
  const layout = () => props.layout ?? 'grid';
  const maxWidth = () => props.maxWidth ?? 'lg';

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

  // Sync theme with state machine
  createEffect(() => {
    if (pricingSection.getTheme() !== theme()) {
      pricingSection.toggleTheme();
    }
  });

  // Update tiers when props change
  createEffect(() => {
    pricingSection.updateTiers(props.tiers);
  });

  const containerStyles = css({
    position: 'relative',
    backgroundColor: theme() === 'dark' ? '#111827' : '#ffffff',
    padding: '96px 0',
    '@media (min-width: 640px)': {
      padding: '128px 0',
    },
  });

  const innerContainerStyles = css({
    maxWidth:
      maxWidth() === 'sm'
        ? '640px'
        : maxWidth() === 'md'
          ? '768px'
          : maxWidth() === 'lg'
            ? '1024px'
            : maxWidth() === 'xl'
              ? '1280px'
              : '100%',
    margin: '0 auto',
    padding: '0 24px',
    '@media (min-width: 1024px)': {
      padding: '0 32px',
    },
  });

  const headerStyles = css({
    maxWidth: '896px',
    margin: '0 auto',
    textAlign: 'center',
    marginBottom: '64px',
  });

  const badgeStyles = css({
    fontSize: '14px',
    lineHeight: '28px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#818cf8' : '#6366f1',
    marginBottom: '16px',
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '9999px',
    backgroundColor: theme() === 'dark' ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.1)',
    border:
      theme() === 'dark'
        ? '1px solid rgba(129, 140, 248, 0.2)'
        : '1px solid rgba(99, 102, 241, 0.2)',
  });

  const titleStyles = css({
    fontSize: '40px',
    lineHeight: '48px',
    fontWeight: '600',
    letterSpacing: '-0.025em',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    marginBottom: '24px',
    textWrap: 'balance',
    '@media (min-width: 640px)': {
      fontSize: '48px',
      lineHeight: '56px',
    },
    '@media (min-width: 1024px)': {
      fontSize: '56px',
      lineHeight: '64px',
    },
  });

  const subtitleStyles = css({
    fontSize: '18px',
    lineHeight: '32px',
    color: theme() === 'dark' ? '#d1d5db' : '#6b7280',
    marginBottom: showFrequencyToggle() ? '48px' : '0',
    maxWidth: '768px',
    margin: '0 auto',
    '@media (min-width: 1024px)': {
      fontSize: '20px',
      lineHeight: '32px',
      marginBottom: showFrequencyToggle() ? '64px' : '0',
    },
  });

  const frequencyToggleStyles = css({
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '64px',
  });

  const frequencyButtonGroupStyles = css({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4px',
    padding: '4px',
    backgroundColor: theme() === 'dark' ? '#374151' : '#f3f4f6',
    borderRadius: '12px',
    border: theme() === 'dark' ? '1px solid #4b5563' : '1px solid #e5e7eb',
  });

  const frequencyButtonStyles = (isActive: boolean) =>
    css({
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '600',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: isActive ? (theme() === 'dark' ? '#6366f1' : '#6366f1') : 'transparent',
      color: isActive ? '#ffffff' : theme() === 'dark' ? '#d1d5db' : '#6b7280',
      '&:hover': {
        backgroundColor: isActive
          ? theme() === 'dark'
            ? '#5b5bd6'
            : '#5b5bd6'
          : theme() === 'dark'
            ? '#4b5563'
            : '#e5e7eb',
      },
    });

  const tiersGridStyles = css({
    display: 'grid',
    gridTemplateColumns: layout() === 'row' ? '1fr' : '1fr',
    gap: '32px',
    maxWidth: layout() === 'row' ? '640px' : '1280px',
    margin: '0 auto',
    '@media (min-width: 640px)': {
      gridTemplateColumns:
        layout() === 'row'
          ? '1fr'
          : props.tiers.length === 2
            ? 'repeat(2, 1fr)'
            : props.tiers.length >= 3
              ? 'repeat(2, 1fr)'
              : '1fr',
      gap: '40px',
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns:
        layout() === 'row'
          ? '1fr'
          : props.tiers.length === 2
            ? 'repeat(2, 1fr)'
            : props.tiers.length >= 3
              ? 'repeat(3, 1fr)'
              : '1fr',
      gap: '32px',
    },
  });

  const tierCardStyles = (tier: PricingTier) => {
    const isHovered = pricingSection.isTierHovered(tier.id);
    const isPopular = tier.popular || false;
    const isFeatured = tier.featured || false;

    return css({
      position: 'relative',
      padding: '32px',
      borderRadius: '16px',
      backgroundColor: theme() === 'dark' ? '#1f2937' : '#ffffff',
      border:
        isPopular || isFeatured
          ? theme() === 'dark'
            ? '2px solid #6366f1'
            : '2px solid #6366f1'
          : theme() === 'dark'
            ? '1px solid #374151'
            : '1px solid #e5e7eb',
      boxShadow:
        isPopular || isFeatured
          ? theme() === 'dark'
            ? '0 25px 50px -12px rgba(99, 102, 241, 0.25)'
            : '0 25px 50px -12px rgba(99, 102, 241, 0.25)'
          : theme() === 'dark'
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
      '@media (min-width: 1024px)': {
        padding: '40px',
      },
    });
  };

  const popularBadgeStyles = css({
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '4px 16px',
    backgroundColor: '#6366f1',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '9999px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  });

  const tierNameStyles = css({
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    marginBottom: '16px',
  });

  const tierPriceStyles = css({
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '8px',
  });

  const priceAmountStyles = css({
    fontSize: '48px',
    lineHeight: '56px',
    fontWeight: '600',
    letterSpacing: '-0.025em',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
  });

  const priceSuffixStyles = css({
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
  });

  const tierDescriptionStyles = css({
    fontSize: '16px',
    lineHeight: '24px',
    color: theme() === 'dark' ? '#d1d5db' : '#6b7280',
    marginBottom: '32px',
  });

  const featuresListStyles = css({
    marginBottom: '32px',
  });

  const featureItemStyles = css({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '16px',
    fontSize: '16px',
    lineHeight: '24px',
    color: theme() === 'dark' ? '#d1d5db' : '#6b7280',
  });

  const checkIconStyles = css({
    width: '20px',
    height: '20px',
    color: '#10b981',
    flexShrink: 0,
    marginTop: '2px',
  });

  const ctaButtonStyles = (tier: PricingTier) => {
    const isPopular = tier.popular || false;
    const isFeatured = tier.featured || false;

    return css({
      width: '100%',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      textAlign: 'center',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      display: 'block',
      backgroundColor:
        isPopular || isFeatured ? '#6366f1' : theme() === 'dark' ? '#374151' : '#f3f4f6',
      color: isPopular || isFeatured ? '#ffffff' : theme() === 'dark' ? '#ffffff' : '#111827',
      border:
        isPopular || isFeatured
          ? 'none'
          : theme() === 'dark'
            ? '1px solid #4b5563'
            : '1px solid #d1d5db',
      '&:hover': {
        backgroundColor:
          isPopular || isFeatured ? '#5b5bd6' : theme() === 'dark' ? '#4b5563' : '#e5e7eb',
        transform: 'translateY(-1px)',
      },
    });
  };

  const CheckIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5">
      <path
        fill-rule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const handleFrequencyChange = (frequency: 'monthly' | 'annually') => {
    pricingSection.setFrequency(frequency);
    props.onFrequencyChange?.(frequency);
  };

  const handleTierSelect = (tier: PricingTier) => {
    pricingSection.selectTier(tier.id);
    props.onTierSelect?.(tier);
  };

  const handleTierHover = (tier: PricingTier) => {
    pricingSection.hoverTier(tier.id);
  };

  const handleTierUnhover = () => {
    pricingSection.unhoverTier();
  };

  const getTierPrice = (tier: PricingTier) => {
    if (typeof tier.price === 'string') {
      return tier.price;
    }
    return tier.price[pricingSection.getSelectedFrequency()];
  };

  const getPriceSuffix = () => {
    const currentFreq = frequencies().find(
      (f) => f.value === pricingSection.getSelectedFrequency()
    );
    return currentFreq?.priceSuffix || '/month';
  };

  return (
    <div class={`${containerStyles} ${props.className || ''}`}>
      {backgroundPattern() === 'dots' && (
        <DotPattern
          className="[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          fill={theme() === 'dark' ? '#374151' : '#e5e7eb'}
        />
      )}

      <div class={innerContainerStyles} style={{ position: 'relative', 'z-index': 1 }}>
        <div class={headerStyles}>
          {props.badge && mounted() && animated() ? (
            <BlurFade delay={0.1}>
              <div class={badgeStyles}>{props.badge}</div>
            </BlurFade>
          ) : props.badge ? (
            <div class={badgeStyles}>{props.badge}</div>
          ) : null}

          {mounted() && animated() ? (
            <TextAnimate class={titleStyles} animation="slideUp" delay={0.2}>
              {props.title}
            </TextAnimate>
          ) : (
            <h2 class={titleStyles}>{props.title}</h2>
          )}

          {props.subtitle &&
            (mounted() && animated() ? (
              <BlurFade delay={0.5}>
                <p class={subtitleStyles}>{props.subtitle}</p>
              </BlurFade>
            ) : (
              <p class={subtitleStyles}>{props.subtitle}</p>
            ))}

          {showFrequencyToggle() && (
            <div class={frequencyToggleStyles}>
              {mounted() && animated() ? (
                <BlurFade delay={0.7}>
                  <div class={frequencyButtonGroupStyles}>
                    <For each={frequencies()}>
                      {(frequency) => (
                        <button
                          class={frequencyButtonStyles(
                            pricingSection.getSelectedFrequency() === frequency.value
                          )}
                          onClick={() => handleFrequencyChange(frequency.value)}
                        >
                          {frequency.label}
                        </button>
                      )}
                    </For>
                  </div>
                </BlurFade>
              ) : (
                <div class={frequencyButtonGroupStyles}>
                  <For each={frequencies()}>
                    {(frequency) => (
                      <button
                        class={frequencyButtonStyles(
                          pricingSection.getSelectedFrequency() === frequency.value
                        )}
                        onClick={() => handleFrequencyChange(frequency.value)}
                      >
                        {frequency.label}
                      </button>
                    )}
                  </For>
                </div>
              )}
            </div>
          )}
        </div>

        <div class={tiersGridStyles}>
          <For each={props.tiers}>
            {(tier, index) =>
              mounted() && animated() ? (
                <BlurFade delay={0.9 + index() * 0.1}>
                  <div
                    class={tierCardStyles(tier)}
                    onClick={() => handleTierSelect(tier)}
                    onMouseEnter={() => handleTierHover(tier)}
                    onMouseLeave={handleTierUnhover}
                    style={{ position: 'relative' }}
                  >
                    {(tier.popular || tier.featured) && (
                      <div class={popularBadgeStyles}>
                        {tier.popular ? 'Most Popular' : 'Featured'}
                      </div>
                    )}

                    {tier.featured && pricingSection.isTierHovered(tier.id) && (
                      <BorderBeam size={200} duration={15} />
                    )}

                    <h3 class={tierNameStyles}>{tier.name}</h3>

                    <div class={tierPriceStyles}>
                      <span class={priceAmountStyles}>{getTierPrice(tier)}</span>
                      {typeof tier.price !== 'string' && (
                        <span class={priceSuffixStyles}>{getPriceSuffix()}</span>
                      )}
                    </div>

                    <p class={tierDescriptionStyles}>{tier.description}</p>

                    <ul class={featuresListStyles}>
                      <For each={tier.features}>
                        {(feature) => (
                          <li class={featureItemStyles}>
                            <div class={checkIconStyles}>
                              <CheckIcon />
                            </div>
                            {feature}
                          </li>
                        )}
                      </For>
                    </ul>

                    <a
                      href={tier.href || '#'}
                      class={ctaButtonStyles(tier)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!tier.href) e.preventDefault();
                        handleTierSelect(tier);
                      }}
                    >
                      {tier.cta || 'Get Started'}
                    </a>
                  </div>
                </BlurFade>
              ) : (
                <div
                  class={tierCardStyles(tier)}
                  onClick={() => handleTierSelect(tier)}
                  onMouseEnter={() => handleTierHover(tier)}
                  onMouseLeave={handleTierUnhover}
                  style={{ position: 'relative' }}
                >
                  {(tier.popular || tier.featured) && (
                    <div class={popularBadgeStyles}>
                      {tier.popular ? 'Most Popular' : 'Featured'}
                    </div>
                  )}

                  <h3 class={tierNameStyles}>{tier.name}</h3>

                  <div class={tierPriceStyles}>
                    <span class={priceAmountStyles}>{getTierPrice(tier)}</span>
                    {typeof tier.price !== 'string' && (
                      <span class={priceSuffixStyles}>{getPriceSuffix()}</span>
                    )}
                  </div>

                  <p class={tierDescriptionStyles}>{tier.description}</p>

                  <ul class={featuresListStyles}>
                    <For each={tier.features}>
                      {(feature) => (
                        <li class={featureItemStyles}>
                          <div class={checkIconStyles}>
                            <CheckIcon />
                          </div>
                          {feature}
                        </li>
                      )}
                    </For>
                  </ul>

                  <a
                    href={tier.href || '#'}
                    class={ctaButtonStyles(tier)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!tier.href) e.preventDefault();
                      handleTierSelect(tier);
                    }}
                  >
                    {tier.cta || 'Get Started'}
                  </a>
                </div>
              )
            }
          </For>
        </div>
      </div>
    </div>
  );
};

export default PricingSimple;
