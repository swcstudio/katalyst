import { type Component, For, JSX, Show, createEffect, createSignal, onMount } from 'solid-js';
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
  price: { monthly: string; annually: string } | string;
  description?: string;
  features?: string[];
  href?: string;
  mostPopular?: boolean;
  cta?: string;
}

export interface PricingFeature {
  name: string;
  tiers: Record<string, boolean | string>;
}

export interface PricingSection {
  name: string;
  features: PricingFeature[];
}

export interface PricingFrequency {
  value: 'monthly' | 'annually';
  label: string;
  priceSuffix: string;
}

export interface PricingTableProps {
  className?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  tiers: PricingTier[];
  sections: PricingSection[];
  frequencies?: PricingFrequency[];
  defaultFrequency?: 'monthly' | 'annually';
  theme?: 'light' | 'dark';
  animated?: boolean;
  backgroundPattern?: boolean;
  showMobileView?: boolean;
  onTierSelect?: (tier: PricingTier) => void;
}

export const PricingTable: Component<PricingTableProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const pricingSection = usePricingSection();

  const theme = () => props.theme ?? 'light';
  const animated = () => props.animated ?? true;
  const backgroundPattern = () => props.backgroundPattern ?? true;
  const showMobileView = () => props.showMobileView ?? true;

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

  const getTierPrice = (tier: PricingTier): string => {
    if (typeof tier.price === 'string') return tier.price;
    return tier.price[pricingSection.getSelectedFrequency()];
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

  const mobileViewStyles = css({
    marginX: 'auto',
    marginTop: '48px',
    maxWidth: '320px',
    '@media (min-width: 640px)': {
      marginTop: '64px',
    },
    '@media (min-width: 1024px)': {
      display: 'none',
    },
    '& > section:not(:first-child)': {
      marginTop: '32px',
    },
  });

  const mobileCardStyles = (tier: PricingTier) =>
    css({
      position: 'relative',
      borderRadius: '12px',
      backgroundColor:
        theme() === 'dark'
          ? tier.mostPopular
            ? 'rgba(255, 255, 255, 0.05)'
            : '#1f2937'
          : '#ffffff',
      border: tier.mostPopular
        ? `2px solid ${theme() === 'dark' ? '#6366f1' : '#4f46e5'}`
        : `1px solid ${theme() === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'}`,
      padding: '32px',
      boxShadow:
        theme() === 'dark'
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    });

  const desktopTableStyles = css({
    marginTop: '80px',
    display: 'none',
    '@media (min-width: 1024px)': {
      display: 'block',
    },
  });

  const tableContainerStyles = css({
    position: 'relative',
    marginX: '-32px',
  });

  const tableBackgroundStyles = css({
    position: 'absolute',
    insetX: '16px',
    insetY: '0',
    zIndex: '-10',
    display: 'flex',
  });

  const popularColumnBackgroundStyles = () => {
    const popularIndex = props.tiers.findIndex((tier) => tier.mostPopular);
    if (popularIndex === -1) return '';

    return css({
      marginLeft: `${(popularIndex + 1) * 25}%`,
      width: '25%',
      paddingX: '16px',
      '& > div': {
        width: '100%',
        borderRadius: '12px 12px 0 0',
        borderX: `1px solid ${theme() === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'}`,
        borderTop: `1px solid ${theme() === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'}`,
        backgroundColor: theme() === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb',
      },
    });
  };

  const tableStyles = css({
    width: '100%',
    tableLayout: 'fixed',
    borderCollapse: 'separate',
    borderSpacing: '32px 0',
    textAlign: 'left',
  });

  const tableHeaderStyles = css({
    '& td': {
      paddingTop: '24px',
      paddingBottom: '0',
      paddingX: '24px',
      '@media (min-width: 1280px)': {
        paddingTop: '32px',
        paddingX: '32px',
      },
    },
  });

  const tierHeaderStyles = css({
    fontSize: '14px',
    lineHeight: '28px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
  });

  const priceRowStyles = css({
    '& td': {
      paddingTop: '8px',
      paddingX: '24px',
      '@media (min-width: 1280px)': {
        paddingX: '32px',
      },
    },
  });

  const priceStyles = css({
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    '& .price': {
      fontSize: '48px',
      fontWeight: '600',
    },
    '& .suffix': {
      fontSize: '14px',
      lineHeight: '24px',
      fontWeight: '600',
      color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
    },
  });

  const ctaButtonStyles = (tier: PricingTier) =>
    css({
      marginTop: '32px',
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

  const sectionHeaderStyles = css({
    paddingTop: '32px',
    paddingBottom: '16px',
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    '@media (min-width: 1024px)': {
      paddingTop: '64px',
    },
    '& .divider': {
      position: 'absolute',
      insetX: '32px',
      marginTop: '16px',
      height: '1px',
      backgroundColor: theme() === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
    },
  });

  const featureRowStyles = css({
    '& th': {
      paddingY: '16px',
      fontSize: '14px',
      lineHeight: '24px',
      fontWeight: '400',
      color: theme() === 'dark' ? '#ffffff' : '#111827',
      '& .divider': {
        position: 'absolute',
        insetX: '32px',
        marginTop: '16px',
        height: '1px',
        backgroundColor: theme() === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6',
      },
    },
    '& td': {
      paddingX: '24px',
      paddingY: '16px',
      '@media (min-width: 1280px)': {
        paddingX: '32px',
      },
    },
  });

  const featureValueStyles = css({
    textAlign: 'center',
    fontSize: '14px',
    lineHeight: '24px',
    color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
  });

  const checkIconStyles = css({
    marginX: 'auto',
    height: '20px',
    width: '20px',
    color: theme() === 'dark' ? '#818cf8' : '#4f46e5',
  });

  const crossIconStyles = css({
    marginX: 'auto',
    height: '20px',
    width: '20px',
    color: theme() === 'dark' ? '#6b7280' : '#9ca3af',
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

        {/* Mobile View */}
        <Show when={showMobileView()}>
          <div class={mobileViewStyles}>
            <For each={props.tiers}>
              {(tier, index) => (
                <BlurFade delay={0.5 + index() * 0.1} inView>
                  <section class={mobileCardStyles(tier)}>
                    <Show when={tier.mostPopular}>
                      <BorderBeam
                        size={60}
                        duration={12}
                        colorFrom={theme() === 'dark' ? '#6366f1' : '#4f46e5'}
                        colorTo={theme() === 'dark' ? '#8b5cf6' : '#7c3aed'}
                      />
                    </Show>

                    <h3
                      class={css({
                        fontSize: '14px',
                        lineHeight: '24px',
                        fontWeight: '600',
                        color: theme() === 'dark' ? '#ffffff' : '#111827',
                      })}
                    >
                      {tier.name}
                    </h3>

                    <Show when={tier.description}>
                      <p
                        class={css({
                          marginTop: '8px',
                          fontSize: '14px',
                          lineHeight: '24px',
                          color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
                        })}
                      >
                        {tier.description}
                      </p>
                    </Show>

                    <div class={priceStyles}>
                      <span class="price">{getTierPrice(tier)}</span>
                      <span class="suffix">
                        {
                          frequencies().find(
                            (f) => f.value === pricingSection.getSelectedFrequency()
                          )?.priceSuffix
                        }
                      </span>
                    </div>

                    <Show
                      when={tier.mostPopular}
                      fallback={
                        <button
                          class={ctaButtonStyles(tier)}
                          onClick={() => handleTierSelect(tier)}
                        >
                          {tier.cta || 'Buy plan'}
                        </button>
                      }
                    >
                      <ShimmerButton
                        class={css({
                          marginTop: '32px',
                          width: '100%',
                        })}
                        onClick={() => handleTierSelect(tier)}
                      >
                        {tier.cta || 'Buy plan'}
                      </ShimmerButton>
                    </Show>

                    <For each={props.sections}>
                      {(section) => (
                        <>
                          <h4
                            class={css({
                              marginTop: '40px',
                              fontSize: '14px',
                              lineHeight: '24px',
                              fontWeight: '600',
                              color: theme() === 'dark' ? '#ffffff' : '#111827',
                            })}
                          >
                            {section.name}
                          </h4>
                          <ul
                            class={css({
                              marginTop: '24px',
                              '& > li:not(:first-child)': {
                                marginTop: '12px',
                              },
                            })}
                          >
                            <For each={section.features}>
                              {(feature) => (
                                <Show when={feature.tiers[tier.name]}>
                                  <li
                                    class={css({
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      paddingY: '12px',
                                      fontSize: '14px',
                                      lineHeight: '24px',
                                      color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
                                    })}
                                  >
                                    <span>{feature.name}</span>
                                    <span>
                                      <Show
                                        when={typeof feature.tiers[tier.name] === 'string'}
                                        fallback={
                                          <Show
                                            when={feature.tiers[tier.name] === true}
                                            fallback={
                                              <svg
                                                class={crossIconStyles}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                              >
                                                <path
                                                  fill-rule="evenodd"
                                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                  clip-rule="evenodd"
                                                />
                                              </svg>
                                            }
                                          >
                                            <svg
                                              class={checkIconStyles}
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path
                                                fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd"
                                              />
                                            </svg>
                                          </Show>
                                        }
                                      >
                                        <span
                                          class={css({
                                            fontWeight: '600',
                                            color: theme() === 'dark' ? '#ffffff' : '#111827',
                                          })}
                                        >
                                          {feature.tiers[tier.name] as string}
                                        </span>
                                      </Show>
                                    </span>
                                  </li>
                                </Show>
                              )}
                            </For>
                          </ul>
                        </>
                      )}
                    </For>
                  </section>
                </BlurFade>
              )}
            </For>
          </div>
        </Show>

        {/* Desktop Table View */}
        <BlurFade delay={0.6} inView>
          <div class={desktopTableStyles}>
            <div class={tableContainerStyles}>
              <Show when={props.tiers.some((tier) => tier.mostPopular)}>
                <div class={tableBackgroundStyles}>
                  <div class={popularColumnBackgroundStyles()}>
                    <div />
                  </div>
                </div>
              </Show>

              <table class={tableStyles}>
                <caption class="sr-only">Pricing plan comparison</caption>
                <colgroup>
                  <col class={css({ width: '25%' })} />
                  <For each={props.tiers}>{() => <col class={css({ width: '25%' })} />}</For>
                </colgroup>

                <thead>
                  <tr class={tableHeaderStyles}>
                    <td />
                    <For each={props.tiers}>
                      {(tier) => (
                        <th scope="col">
                          <div class={tierHeaderStyles}>{tier.name}</div>
                        </th>
                      )}
                    </For>
                  </tr>
                </thead>

                <tbody>
                  <tr class={priceRowStyles}>
                    <th scope="row">
                      <span class="sr-only">Price</span>
                    </th>
                    <For each={props.tiers}>
                      {(tier) => (
                        <td>
                          <div class={priceStyles}>
                            <span class="price">{getTierPrice(tier)}</span>
                            <span class="suffix">
                              {
                                frequencies().find(
                                  (f) => f.value === pricingSection.getSelectedFrequency()
                                )?.priceSuffix
                              }
                            </span>
                          </div>
                          <Show
                            when={tier.mostPopular}
                            fallback={
                              <button
                                class={ctaButtonStyles(tier)}
                                onClick={() => handleTierSelect(tier)}
                              >
                                {tier.cta || 'Buy plan'}
                              </button>
                            }
                          >
                            <ShimmerButton
                              class={css({
                                marginTop: '32px',
                                width: '100%',
                              })}
                              onClick={() => handleTierSelect(tier)}
                            >
                              {tier.cta || 'Buy plan'}
                            </ShimmerButton>
                          </Show>
                        </td>
                      )}
                    </For>
                  </tr>

                  <For each={props.sections}>
                    {(section, sectionIndex) => (
                      <>
                        <tr>
                          <th
                            scope="colgroup"
                            colSpan={props.tiers.length + 1}
                            class={sectionHeaderStyles}
                          >
                            {section.name}
                            <div class="divider" />
                          </th>
                        </tr>
                        <For each={section.features}>
                          {(feature) => (
                            <tr class={featureRowStyles}>
                              <th scope="row">
                                {feature.name}
                                <div class="divider" />
                              </th>
                              <For each={props.tiers}>
                                {(tier) => (
                                  <td>
                                    <Show
                                      when={typeof feature.tiers[tier.name] === 'string'}
                                      fallback={
                                        <Show
                                          when={feature.tiers[tier.name] === true}
                                          fallback={
                                            <svg
                                              class={crossIconStyles}
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path
                                                fill-rule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clip-rule="evenodd"
                                              />
                                            </svg>
                                          }
                                        >
                                          <svg
                                            class={checkIconStyles}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path
                                              fill-rule="evenodd"
                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                              clip-rule="evenodd"
                                            />
                                          </svg>
                                        </Show>
                                      }
                                    >
                                      <div class={featureValueStyles}>
                                        {feature.tiers[tier.name] as string}
                                      </div>
                                    </Show>
                                  </td>
                                )}
                              </For>
                            </tr>
                          )}
                        </For>
                      </>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
        </BlurFade>
      </div>
    </div>
  );
};
