import { Component, JSX, onMount, createSignal, For, createEffect, Show } from "solid-js";
import { css } from "../../../../../styled-system/css";
import { usePricingSection } from "../state/usePricingSection";
import { TextAnimate } from "../../../magicui/TextAnimate";
import { BlurFade } from "../../../magicui/BlurFade";
import { ShimmerButton } from "../../../magicui/ShimmerButton";
import { BorderBeam } from "../../../magicui/BorderBeam";
import { DotPattern } from "../../../magicui/DotPattern";

export interface PricingTier {
  id: string;
  name: string;
  price: { monthly: string; annually: string };
  description: string;
  features: string[];
  href?: string;
  featured?: boolean;
  cta?: string;
}

export interface PricingFrequency {
  value: "monthly" | "annually";
  label: string;
  priceSuffix: string;
}

export interface PricingSplitProps {
  className?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  tiers: PricingTier[];
  frequencies?: PricingFrequency[];
  defaultFrequency?: "monthly" | "annually";
  theme?: "light" | "dark";
  animated?: boolean;
  backgroundPattern?: boolean;
  gradientBackground?: boolean;
  onTierSelect?: (tier: PricingTier) => void;
}

export const PricingSplit: Component<PricingSplitProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const pricingSection = usePricingSection();

  const theme = () => props.theme ?? "dark";
  const animated = () => props.animated ?? true;
  const backgroundPattern = () => props.backgroundPattern ?? true;
  const gradientBackground = () => props.gradientBackground ?? true;

  const defaultFrequencies: PricingFrequency[] = [
    { value: "monthly", label: "Monthly", priceSuffix: "/month" },
    { value: "annually", label: "Annually", priceSuffix: "/year" },
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

  const handleFrequencyChange = (frequency: "monthly" | "annually") => {
    pricingSection.setFrequency(frequency);
  };

  const containerStyles = css({
    position: "relative",
    isolation: "isolate",
    overflow: "hidden",
  });

  const backgroundSectionStyles = css({
    position: "relative",
    backgroundColor: theme() === "dark" ? "#111827" : "#f9fafb",
    paddingTop: "96px",
    paddingBottom: "64px",
    "@media (min-width: 640px)": {
      paddingTop: "128px",
    },
    "@media (min-width: 1024px)": {
      paddingBottom: "0",
    },
  });

  const gradientOverlayStyles = css({
    position: "absolute",
    inset: "0",
    background: theme() === "dark" 
      ? "radial-gradient(circle at 30% 40%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 10%, rgba(120, 119, 198, 0.15), transparent 50%), radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.15), transparent 50%)"
      : "radial-gradient(circle at 30% 40%, rgba(79, 70, 229, 0.1), transparent 50%), radial-gradient(circle at 80% 10%, rgba(124, 58, 237, 0.08), transparent 50%)",
    pointerEvents: "none",
  });

  const innerContainerStyles = css({
    marginX: "auto",
    maxWidth: "1792px",
    paddingX: "24px",
    "@media (min-width: 1024px)": {
      paddingX: "32px",
    },
  });

  const headerStyles = css({
    position: "relative",
    zIndex: "10",
    marginX: "auto",
    maxWidth: "1024px",
    textAlign: "center",
  });

  const badgeStyles = css({
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: "600",
    color: theme() === "dark" ? "#a5b4fc" : "#6366f1",
  });

  const titleStyles = css({
    marginTop: "8px",
    fontSize: "60px",
    lineHeight: "1",
    fontWeight: "600",
    letterSpacing: "-0.025em",
    color: theme() === "dark" ? "#ffffff" : "#111827",
    "@media (min-width: 640px)": {
      fontSize: "72px",
    },
  });

  const subtitleStyles = css({
    marginX: "auto",
    marginTop: "32px",
    maxWidth: "672px",
    textAlign: "center",
    fontSize: "20px",
    lineHeight: "32px",
    fontWeight: "500",
    color: theme() === "dark" ? "#d1d5db" : "#4b5563",
    "@media (min-width: 640px)": {
      fontSize: "24px",
      lineHeight: "32px",
    },
  });

  const frequencyToggleStyles = css({
    marginTop: "64px",
    display: "flex",
    justifyContent: "center",
  });

  const radioGroupStyles = css({
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "4px",
    borderRadius: "9999px",
    backgroundColor: theme() === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.8)",
    padding: "4px",
    textAlign: "center",
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: "600",
    color: theme() === "dark" ? "#ffffff" : "#111827",
    backdropFilter: "blur(8px)",
    border: `1px solid ${theme() === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
  });

  const radioButtonStyles = (selected: boolean) => css({
    cursor: "pointer",
    borderRadius: "9999px",
    paddingX: "10px",
    paddingY: "4px",
    backgroundColor: selected ? (theme() === "dark" ? "#6366f1" : "#4f46e5") : "transparent",
    color: selected ? "#ffffff" : "inherit",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: selected ? (theme() === "dark" ? "#5b21b6" : "#4338ca") : (theme() === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"),
    },
  });

  const whiteSectionStyles = css({
    position: "relative",
    backgroundColor: theme() === "dark" ? "#1f2937" : "#ffffff",
    paddingBottom: "48px",
    "@media (min-width: 1024px)": {
      paddingBottom: "80px",
    },
  });

  const tiersContainerStyles = css({
    position: "relative",
    marginX: "auto",
    marginTop: "40px",
    display: "grid",
    maxWidth: "320px",
    gridTemplateColumns: "1fr",
    gap: "32px",
    "@media (min-width: 1024px)": {
      marginX: "0",
      maxWidth: "none",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "0",
      "@media (min-width: 1280px)": {
        marginTop: "-56px",
      },
    },
  });

  const sideTierStyles = css({
    marginX: "auto",
    maxWidth: "448px",
    "@media (min-width: 1024px)": {
      marginTop: "80px",
      marginBottom: "80px",
      marginX: "0",
      maxWidth: "none",
    },
  });

  const centerTierStyles = css({
    marginX: "auto",
    marginTop: "40px",
    maxWidth: "512px",
    "@media (min-width: 1024px)": {
      marginTop: "0",
      marginX: "0",
      maxWidth: "none",
    },
  });

  const tierCardStyles = (tier: PricingTier, isCenterTier: boolean = false) => css({
    position: "relative",
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: "24px",
    boxShadow: isCenterTier 
      ? (theme() === "dark" ? "0 25px 50px -12px rgba(0, 0, 0, 0.8)" : "0 25px 50px -12px rgba(0, 0, 0, 0.25)")
      : (theme() === "dark" ? "0 10px 15px -3px rgba(0, 0, 0, 0.3)" : "0 10px 15px -3px rgba(0, 0, 0, 0.1)"),
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: isCenterTier ? "translateY(-8px)" : "translateY(-4px)",
      boxShadow: isCenterTier 
        ? (theme() === "dark" ? "0 32px 64px -12px rgba(0, 0, 0, 0.9)" : "0 32px 64px -12px rgba(0, 0, 0, 0.3)")
        : (theme() === "dark" ? "0 20px 25px -5px rgba(0, 0, 0, 0.5)" : "0 20px 25px -5px rgba(0, 0, 0, 0.15)"),
    },
  });

  const centerTierBadgeStyles = css({
    position: "absolute",
    insetX: "0",
    top: "0",
    transform: "translateY(-50%)",
    display: "flex",
    justifyContent: "center",
  });

  const badgePillStyles = css({
    display: "inline-flex",
    borderRadius: "9999px",
    backgroundColor: theme() === "dark" ? "#6366f1" : "#4f46e5",
    paddingX: "16px",
    paddingY: "4px",
    fontSize: "14px",
    lineHeight: "16px",
    fontWeight: "600",
    color: "#ffffff",
  });

  const tierContentStyles = (isCenterTier: boolean = false) => css({
    backgroundColor: theme() === "dark" ? "#374151" : "#ffffff",
    paddingX: "24px",
    paddingTop: isCenterTier ? "48px" : "40px",
    paddingBottom: "40px",
    "@media (min-width: 1024px)": {
      paddingTop: isCenterTier ? "56px" : "48px",
      paddingBottom: "48px",
    },
  });

  const tierNameStyles = (isCenterTier: boolean = false) => css({
    fontSize: isCenterTier ? "24px" : "20px",
    lineHeight: "32px",
    fontWeight: "600",
    letterSpacing: "-0.025em",
    color: theme() === "dark" ? "#ffffff" : "#111827",
    "@media (min-width: 640px)": {
      fontSize: isCenterTier ? "32px" : "24px",
    },
  });

  const tierDescriptionStyles = css({
    marginTop: "16px",
    fontSize: "16px",
    lineHeight: "24px",
    color: theme() === "dark" ? "#d1d5db" : "#6b7280",
  });

  const priceContainerStyles = css({
    marginTop: "32px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  });

  const priceStyles = (isCenterTier: boolean = false) => css({
    fontSize: isCenterTier ? "64px" : "56px",
    lineHeight: "1",
    fontWeight: "700",
    letterSpacing: "-0.025em",
    color: theme() === "dark" ? "#ffffff" : "#111827",
    "@media (min-width: 640px)": {
      fontSize: isCenterTier ? "72px" : "64px",
    },
  });

  const priceSuffixStyles = css({
    fontSize: "20px",
    lineHeight: "28px",
    fontWeight: "500",
    color: theme() === "dark" ? "#9ca3af" : "#6b7280",
  });

  const featuresContainerStyles = (isCenterTier: boolean = false) => css({
    display: "flex",
    flex: "1",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: theme() === "dark" ? "#1f2937" : "#f9fafb",
    paddingX: "24px",
    paddingTop: isCenterTier ? "40px" : "24px",
    paddingBottom: "32px",
    "@media (min-width: 640px)": {
      paddingX: "40px",
      paddingTop: isCenterTier ? "48px" : "32px",
      paddingBottom: "40px",
    },
    "@media (min-width: 1024px)": {
      paddingX: "24px",
      paddingBottom: "32px",
    },
    "@media (min-width: 1280px)": {
      paddingX: "40px",
      paddingBottom: "40px",
    },
  });

  const featuresListStyles = css({
    fontSize: "16px",
    lineHeight: "24px",
    color: theme() === "dark" ? "#d1d5db" : "#374151",
    "& > li:not(:first-child)": {
      marginTop: "16px",
    },
  });

  const featureItemStyles = css({
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  });

  const checkIconStyles = css({
    height: "24px",
    width: "20px",
    flexShrink: "0",
    color: theme() === "dark" ? "#10b981" : "#059669",
    marginTop: "2px",
  });

  const ctaContainerStyles = css({
    marginTop: "32px",
  });

  const ctaButtonStyles = (tier: PricingTier, isCenterTier: boolean = false) => css({
    display: "block",
    width: "100%",
    borderRadius: "12px",
    paddingX: "24px",
    paddingY: isCenterTier ? "16px" : "12px",
    textAlign: "center",
    fontSize: isCenterTier ? "18px" : "16px",
    lineHeight: "24px",
    fontWeight: "600",
    backgroundColor: tier.featured ? (theme() === "dark" ? "#6366f1" : "#4f46e5") : (theme() === "dark" ? "#374151" : "#ffffff"),
    color: tier.featured ? "#ffffff" : (theme() === "dark" ? "#ffffff" : "#4f46e5"),
    border: tier.featured ? "none" : `2px solid ${theme() === "dark" ? "#4b5563" : "#e5e7eb"}`,
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: tier.featured ? (theme() === "dark" ? "#5b21b6" : "#4338ca") : (theme() === "dark" ? "#4b5563" : "#f9fafb"),
      borderColor: tier.featured ? "transparent" : (theme() === "dark" ? "#6b7280" : "#d1d5db"),
    },
  });

  const featuredTier = () => props.tiers.find(tier => tier.featured);
  const sideTiers = () => props.tiers.filter(tier => !tier.featured);

  return (
    <div class={`${containerStyles} ${props.className || ""}`}>
      <div class={backgroundSectionStyles}>
        <Show when={gradientBackground()}>
          <div class={gradientOverlayStyles} />
        </Show>
        
        <Show when={backgroundPattern()}>
          <DotPattern
            className={css({
              position: "absolute",
              inset: "0",
              zIndex: "1",
              opacity: theme() === "dark" ? "0.1" : "0.05",
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

            <TextAnimate
              class={titleStyles}
              animation="slideUp"
              delay={0.2}
            >
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
                          class={radioButtonStyles(pricingSection.getSelectedFrequency() === frequency.value)}
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

          <div class={tiersContainerStyles}>
            <For each={sideTiers().slice(0, 1)}>
              {(tier, index) => (
                <BlurFade delay={0.5} inView>
                  <div
                    class={`${sideTierStyles} ${tierCardStyles(tier)}`}
                    onMouseEnter={() => pricingSection.hoverTier(tier.id)}
                    onMouseLeave={() => pricingSection.unhoverTier()}
                  >
                    <div class={tierContentStyles()}>
                      <h3 class={tierNameStyles()}>{tier.name}</h3>
                      <p class={tierDescriptionStyles}>{tier.description}</p>
                      <div class={priceContainerStyles}>
                        <span class={priceStyles()}>
                          {tier.price[pricingSection.getSelectedFrequency()]}
                        </span>
                        <span class={priceSuffixStyles}>
                          {frequencies().find(f => f.value === pricingSection.getSelectedFrequency())?.priceSuffix}
                        </span>
                      </div>
                    </div>
                    <div class={featuresContainerStyles()}>
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
                      <div class={ctaContainerStyles}>
                        <button
                          class={ctaButtonStyles(tier)}
                          onClick={() => handleTierSelect(tier)}
                        >
                          {tier.cta || "Start your trial"}
                        </button>
                      </div>
                    </div>
                  </div>
                </BlurFade>
              )}
            </For>

            <Show when={featuredTier()}>
              <BlurFade delay={0.6} inView>
                <div
                  class={`${centerTierStyles} ${tierCardStyles(featuredTier()!, true)}`}
                  onMouseEnter={() => pricingSection.hoverTier(featuredTier()!.id)}
                  onMouseLeave={() => pricingSection.unhoverTier()}
                >
                  <BorderBeam
                    size={120}
                    duration={15}
                    colorFrom={theme() === "dark" ? "#6366f1" : "#4f46e5"}
                    colorTo={theme() === "dark" ? "#8b5cf6" : "#7c3aed"}
                  />
                  
                  <div class={centerTierBadgeStyles}>
                    <span class={badgePillStyles}>Most popular</span>
                  </div>

                  <div class={tierContentStyles(true)}>
                    <h3 class={tierNameStyles(true)}>{featuredTier()!.name}</h3>
                    <p class={tierDescriptionStyles}>{featuredTier()!.description}</p>
                    <div class={priceContainerStyles}>
                      <span class={priceStyles(true)}>
                        {featuredTier()!.price[pricingSection.getSelectedFrequency()]}
                      </span>
                      <span class={priceSuffixStyles}>
                        {frequencies().find(f => f.value === pricingSection.getSelectedFrequency())?.priceSuffix}
                      </span>
                    </div>
                  </div>
                  <div class={featuresContainerStyles(true)}>
                    <ul class={featuresListStyles}>
                      <For each={featuredTier()!.features}>
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
                    <div class={ctaContainerStyles}>
                      <ShimmerButton
                        class={css({
                          width: "100%",
                          paddingY: "16px",
                          fontSize: "18px",
                          fontWeight: "600",
                        })}
                        onClick={() => handleTierSelect(featuredTier()!)}
                      >
                        {featuredTier()!.cta || "Start your trial"}
                      </ShimmerButton>
                    </div>
                  </div>
                </div>
              </BlurFade>
            </Show>

            <For each={sideTiers().slice(1, 2)}>
              {(tier, index) => (
                <BlurFade delay={0.7} inView>
                  <div
                    class={`${sideTierStyles} ${tierCardStyles(tier)}`}
                    onMouseEnter={() => pricingSection.hoverTier(tier.id)}
                    onMouseLeave={() => pricingSection.unhoverTier()}
                  >
                    <div class={tierContentStyles()}>
                      <h3 class={tierNameStyles()}>{tier.name}</h3>
                      <p class={tierDescriptionStyles}>{tier.description}</p>
                      <div class={priceContainerStyles}>
                        <span class={priceStyles()}>
                          {tier.price[pricingSection.getSelectedFrequency()]}
                        </span>
                        <span class={priceSuffixStyles}>
                          {frequencies().find(f => f.value === pricingSection.getSelectedFrequency())?.priceSuffix}
                        </span>
                      </div>
                    </div>
                    <div class={featuresContainerStyles()}>
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
                      <div class={ctaContainerStyles}>
                        <button
                          class={ctaButtonStyles(tier)}
                          onClick={() => handleTierSelect(tier)}
                        >
                          {tier.cta || "Start your trial"}
                        </button>
                      </div>
                    </div>
                  </div>
                </BlurFade>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
};