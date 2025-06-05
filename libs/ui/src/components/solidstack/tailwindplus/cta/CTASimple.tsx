import { Component, JSX, onMount, createSignal, createEffect } from "solid-js";
import { css } from "../../../../styled-system/css";
import { useCTASection } from "./state/useCTASection";
import { TextAnimate } from "../../magicui/TextAnimate";
import { BlurFade } from "../../magicui/BlurFade";
import { ShimmerButton } from "../../magicui/ShimmerButton";
import { WarpBackground } from "../../magicui/WarpBackground";
import { DotPattern } from "../../magicui/DotPattern";

export interface CTAButton {
  id: string;
  text: string;
  href?: string;
  variant: "primary" | "secondary";
  onClick?: () => void;
}

export interface CTASimpleProps {
  className?: string;
  title: string;
  subtitle?: string;
  buttons: CTAButton[];
  theme?: "light" | "dark";
  animated?: boolean;
  backgroundVariant?: "white" | "gray" | "indigo" | "dark" | "gradient";
  backgroundPattern?: "none" | "dots" | "warp";
  centered?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  onButtonClick?: (button: CTAButton) => void;
}

export const CTASimple: Component<CTASimpleProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const ctaSection = useCTASection();

  const theme = () => props.theme ?? "light";
  const animated = () => props.animated ?? true;
  const backgroundVariant = () => props.backgroundVariant ?? "white";
  const backgroundPattern = () => props.backgroundPattern ?? "none";
  const centered = () => props.centered ?? true;
  const maxWidth = () => props.maxWidth ?? "lg";

  onMount(() => {
    setMounted(true);
    ctaSection.mount();
    
    if (animated()) {
      setTimeout(() => {
        ctaSection.startAnimation();
      }, 100);
    }
  });

  // Sync theme with state machine
  createEffect(() => {
    if (ctaSection.getTheme() !== theme()) {
      ctaSection.toggleTheme();
    }
  });

  const getBackgroundColor = () => {
    switch (backgroundVariant()) {
      case "gray":
        return theme() === "dark" ? "#1f2937" : "#f9fafb";
      case "indigo":
        return theme() === "dark" ? "#4338ca" : "#6366f1";
      case "dark":
        return "#111827";
      case "gradient":
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      default:
        return theme() === "dark" ? "#111827" : "#ffffff";
    }
  };

  const getTextColor = () => {
    if (backgroundVariant() === "dark" || backgroundVariant() === "indigo" || backgroundVariant() === "gradient") {
      return "#ffffff";
    }
    return theme() === "dark" ? "#ffffff" : "#111827";
  };

  const getSubtitleColor = () => {
    if (backgroundVariant() === "dark" || backgroundVariant() === "indigo" || backgroundVariant() === "gradient") {
      return "#d1d5db";
    }
    return theme() === "dark" ? "#d1d5db" : "#6b7280";
  };

  const containerStyles = css({
    position: "relative",
    backgroundColor: getBackgroundColor(),
    background: backgroundVariant() === "gradient" ? getBackgroundColor() : undefined,
    padding: "96px 24px",
    overflow: "hidden",
    "@media (min-width: 640px)": {
      padding: "128px 24px",
    },
    "@media (min-width: 1024px)": {
      padding: "128px 32px",
    },
  });

  const innerContainerStyles = css({
    maxWidth: maxWidth() === "sm" ? "640px" : 
              maxWidth() === "md" ? "768px" :
              maxWidth() === "lg" ? "1024px" :
              maxWidth() === "xl" ? "1280px" : "100%",
    margin: "0 auto",
    textAlign: centered() ? "center" : "left",
  });

  const titleStyles = css({
    fontSize: "32px",
    lineHeight: "40px",
    fontWeight: "600",
    letterSpacing: "-0.025em",
    color: getTextColor(),
    marginBottom: props.subtitle ? "24px" : "40px",
    "@media (min-width: 640px)": {
      fontSize: "40px",
      lineHeight: "48px",
    },
    "@media (min-width: 1024px)": {
      fontSize: "48px",
      lineHeight: "56px",
      textWrap: "balance",
    },
  });

  const subtitleStyles = css({
    fontSize: "18px",
    lineHeight: "32px",
    color: getSubtitleColor(),
    marginBottom: "40px",
    maxWidth: "672px",
    margin: centered() ? "0 auto 40px" : "0 0 40px",
    "@media (min-width: 1024px)": {
      fontSize: "20px",
      lineHeight: "32px",
    },
  });

  const buttonsContainerStyles = css({
    display: "flex",
    alignItems: "center",
    gap: "24px",
    justifyContent: centered() ? "center" : "flex-start",
    flexWrap: "wrap",
  });

  const primaryButtonStyles = css({
    display: "inline-flex",
    alignItems: "center",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    transition: "all 0.2s ease",
    backgroundColor: backgroundVariant() === "dark" || backgroundVariant() === "indigo" || backgroundVariant() === "gradient"
      ? "#ffffff"
      : "#6366f1",
    color: backgroundVariant() === "dark" || backgroundVariant() === "indigo" || backgroundVariant() === "gradient"
      ? "#111827"
      : "#ffffff",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "&:hover": {
      backgroundColor: backgroundVariant() === "dark" || backgroundVariant() === "indigo" || backgroundVariant() === "gradient"
        ? "#f3f4f6"
        : "#5b5bd6",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
  });

  const secondaryButtonStyles = css({
    display: "inline-flex",
    alignItems: "center",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    color: backgroundVariant() === "dark" || backgroundVariant() === "indigo" || backgroundVariant() === "gradient"
      ? "#ffffff"
      : theme() === "dark" ? "#ffffff" : "#111827",
    transition: "all 0.2s ease",
    "&:hover": {
      textDecoration: "underline",
    },
  });

  const handleButtonClick = (button: CTAButton) => {
    ctaSection.clickButton(button.id);
    props.onButtonClick?.(button);
    button.onClick?.();
  };

  const handleButtonHover = (button: CTAButton) => {
    ctaSection.hoverButton(button.id);
  };

  const handleButtonUnhover = () => {
    ctaSection.unhoverButton();
  };

  const renderButton = (button: CTAButton) => {
    const isHovered = ctaSection.isButtonHovered(button.id);
    const isActive = ctaSection.isButtonActive(button.id);

    if (button.variant === "primary") {
      return mounted() && animated() ? (
        <BlurFade delay={0.7}>
          <div style={{ position: "relative" }}>
            <ShimmerButton
              class={primaryButtonStyles}
              onClick={() => handleButtonClick(button)}
              onMouseEnter={() => handleButtonHover(button)}
              onMouseLeave={handleButtonUnhover}
              style={{
                transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                "box-shadow": isHovered ? "0 10px 25px -5px rgba(0, 0, 0, 0.25)" : undefined,
              }}
            >
              {button.text}
            </ShimmerButton>
          </div>
        </BlurFade>
      ) : (
        <a 
          href={button.href || "#"}
          class={primaryButtonStyles}
          onClick={(e) => {
            if (!button.href) e.preventDefault();
            handleButtonClick(button);
          }}
          onMouseEnter={() => handleButtonHover(button)}
          onMouseLeave={handleButtonUnhover}
        >
          {button.text}
        </a>
      );
    } else {
      return mounted() && animated() ? (
        <BlurFade delay={0.8}>
          <a 
            href={button.href || "#"}
            class={secondaryButtonStyles}
            onClick={(e) => {
              if (!button.href) e.preventDefault();
              handleButtonClick(button);
            }}
            onMouseEnter={() => handleButtonHover(button)}
            onMouseLeave={handleButtonUnhover}
            style={{
              transform: isActive ? "scale(0.98)" : "scale(1)",
            }}
          >
            {button.text} <span aria-hidden="true">→</span>
          </a>
        </BlurFade>
      ) : (
        <a 
          href={button.href || "#"}
          class={secondaryButtonStyles}
          onClick={(e) => {
            if (!button.href) e.preventDefault();
            handleButtonClick(button);
          }}
          onMouseEnter={() => handleButtonHover(button)}
          onMouseLeave={handleButtonUnhover}
        >
          {button.text} <span aria-hidden="true">→</span>
        </a>
      );
    }
  };

  return (
    <div class={`${containerStyles} ${props.className || ""}`}>
      {backgroundPattern() === "dots" && (
        <DotPattern
          className="[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          fill={theme() === "dark" ? "#374151" : "#e5e7eb"}
        />
      )}

      {backgroundPattern() === "warp" && (
        <WarpBackground 
          className={css({ position: "absolute", inset: 0, zIndex: 0 })}
          intensity={0.2}
          speed={0.5}
        />
      )}

      <div class={innerContainerStyles} style={{ position: "relative", "z-index": 1 }}>
        {mounted() && animated() ? (
          <TextAnimate
            class={titleStyles}
            animation="slideUp"
            delay={0.2}
          >
            {props.title}
          </TextAnimate>
        ) : (
          <h2 class={titleStyles}>{props.title}</h2>
        )}

        {props.subtitle && (
          mounted() && animated() ? (
            <BlurFade delay={0.5}>
              <p class={subtitleStyles}>{props.subtitle}</p>
            </BlurFade>
          ) : (
            <p class={subtitleStyles}>{props.subtitle}</p>
          )
        )}

        <div class={buttonsContainerStyles}>
          {props.buttons.map((button) => renderButton(button))}
        </div>
      </div>
    </div>
  );
};

export default CTASimple;