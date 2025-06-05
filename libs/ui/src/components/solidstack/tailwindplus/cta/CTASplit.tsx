import { Component, JSX, onMount, createSignal, createEffect } from "solid-js";
import { css } from "../../../../styled-system/css";
import { useCTASection } from "./state/useCTASection";
import { TextAnimate } from "../../magicui/TextAnimate";
import { BlurFade } from "../../magicui/BlurFade";
import { ShimmerButton } from "../../magicui/ShimmerButton";
import { BorderBeam } from "../../magicui/BorderBeam";
import { WarpBackground } from "../../magicui/WarpBackground";
import { DotPattern } from "../../magicui/DotPattern";

export interface CTAButton {
  id: string;
  text: string;
  href?: string;
  variant: "primary" | "secondary";
  onClick?: () => void;
}

export interface CTASplitImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface CTASplitProps {
  className?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  buttons: CTAButton[];
  image: CTASplitImage;
  imagePosition?: "left" | "right";
  theme?: "light" | "dark";
  animated?: boolean;
  backgroundVariant?: "white" | "gray" | "indigo" | "dark" | "gradient";
  backgroundPattern?: "none" | "dots" | "warp";
  imageVariant?: "default" | "card" | "gradient" | "overlay";
  contentAlignment?: "left" | "center";
  showImageOverlay?: boolean;
  onButtonClick?: (button: CTAButton) => void;
}

export const CTASplit: Component<CTASplitProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const [imageLoaded, setImageLoaded] = createSignal(false);
  const ctaSection = useCTASection();

  const theme = () => props.theme ?? "light";
  const animated = () => props.animated ?? true;
  const backgroundVariant = () => props.backgroundVariant ?? "white";
  const backgroundPattern = () => props.backgroundPattern ?? "none";
  const imagePosition = () => props.imagePosition ?? "right";
  const imageVariant = () => props.imageVariant ?? "default";
  const contentAlignment = () => props.contentAlignment ?? "left";
  const showImageOverlay = () => props.showImageOverlay ?? false;

  onMount(() => {
    setMounted(true);
    ctaSection.mount();
    
    // Preload image
    if (props.image?.src) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.src = props.image.src;
    } else {
      setImageLoaded(true);
    }
    
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
    padding: "96px 0",
    overflow: "hidden",
    "@media (min-width: 640px)": {
      padding: "128px 0",
    },
  });

  const innerContainerStyles = css({
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 24px",
    "@media (min-width: 1024px)": {
      padding: "0 32px",
    },
  });

  const gridContainerStyles = css({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "64px 32px",
    alignItems: "center",
    "@media (min-width: 640px)": {
      gap: "80px 32px",
    },
    "@media (min-width: 1024px)": {
      gridTemplateColumns: "1fr 1fr",
      gap: "64px 64px",
    },
  });

  const contentAreaStyles = css({
    order: imagePosition() === "right" ? 1 : 2,
    "@media (min-width: 1024px)": {
      order: imagePosition() === "right" ? 1 : 2,
    },
  });

  const imageAreaStyles = css({
    order: imagePosition() === "right" ? 2 : 1,
    "@media (min-width: 1024px)": {
      order: imagePosition() === "right" ? 2 : 1,
    },
  });

  const contentInnerStyles = css({
    maxWidth: "672px",
    margin: contentAlignment() === "center" ? "0 auto" : "0",
    textAlign: contentAlignment() === "center" ? "center" : "left",
    "@media (min-width: 1024px)": {
      margin: "0",
      maxWidth: "576px",
      textAlign: "left",
    },
  });

  const badgeStyles = css({
    fontSize: "14px",
    lineHeight: "28px",
    fontWeight: "600",
    color: backgroundVariant() === "dark" || backgroundVariant() === "indigo" || backgroundVariant() === "gradient"
      ? "#8b5cf6" : "#6366f1",
    marginBottom: "16px",
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "9999px",
    backgroundColor: backgroundVariant() === "dark" || backgroundVariant() === "indigo" || backgroundVariant() === "gradient"
      ? "rgba(139, 92, 246, 0.1)" : "rgba(99, 102, 241, 0.1)",
    border: backgroundVariant() === "dark" || backgroundVariant() === "indigo" || backgroundVariant() === "gradient"
      ? "1px solid rgba(139, 92, 246, 0.2)" : "1px solid rgba(99, 102, 241, 0.2)",
  });

  const titleStyles = css({
    fontSize: "32px",
    lineHeight: "40px",
    fontWeight: "600",
    letterSpacing: "-0.025em",
    color: getTextColor(),
    marginBottom: "24px",
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
    marginBottom: "32px",
    "@media (min-width: 1024px)": {
      fontSize: "20px",
      lineHeight: "32px",
    },
  });

  const buttonsContainerStyles = css({
    display: "flex",
    alignItems: "center",
    gap: "24px",
    justifyContent: contentAlignment() === "center" ? "center" : "flex-start",
    flexWrap: "wrap",
    "@media (min-width: 1024px)": {
      justifyContent: "flex-start",
    },
  });

  const imageContainerStyles = css({
    position: "relative",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const imageWrapperStyles = css({
    position: "relative",
    width: "100%",
    maxWidth: "672px",
    borderRadius: imageVariant() === "card" ? "16px" : "0",
    overflow: "hidden",
    boxShadow: imageVariant() === "card" ? 
      (theme() === "dark" 
        ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)"
        : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1)")
      : "none",
  });

  const gradientImageWrapperStyles = css({
    position: "relative",
    borderRadius: "24px",
    padding: "32px",
    background: imageVariant() === "gradient" ? 
      "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent",
    "@media (min-width: 640px)": {
      padding: "48px",
    },
  });

  const overlayImageWrapperStyles = css({
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background: "linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))",
      borderRadius: "inherit",
      zIndex: 1,
    },
  });

  const imageStyles = css({
    width: "100%",
    height: "auto",
    display: "block",
    borderRadius: imageVariant() === "default" ? "12px" : "inherit",
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
      : getTextColor(),
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

  const renderButton = (button: CTAButton, delay: number) => {
    const isHovered = ctaSection.isButtonHovered(button.id);
    const isActive = ctaSection.isButtonActive(button.id);

    if (button.variant === "primary") {
      return mounted() && animated() ? (
        <BlurFade delay={delay}>
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
        <BlurFade delay={delay + 0.1}>
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

  const renderImage = () => {
    if (imageVariant() === "gradient") {
      return (
        <div class={gradientImageWrapperStyles}>
          <div class={imageWrapperStyles} style={{ position: "relative" }}>
            <img
              src={props.image.src}
              alt={props.image.alt}
              width={props.image.width || 1824}
              height={props.image.height || 1080}
              class={imageStyles}
              onLoad={() => setImageLoaded(true)}
            />
            {showImageOverlay() && <BorderBeam size={400} duration={20} />}
          </div>
        </div>
      );
    }

    const wrapperClass = imageVariant() === "overlay" 
      ? `${imageWrapperStyles} ${overlayImageWrapperStyles}`
      : imageWrapperStyles;

    return (
      <div class={wrapperClass} style={{ position: "relative" }}>
        <img
          src={props.image.src}
          alt={props.image.alt}
          width={props.image.width || 1824}
          height={props.image.height || 1080}
          class={imageStyles}
          onLoad={() => setImageLoaded(true)}
        />
        {showImageOverlay() && <BorderBeam size={400} duration={20} />}
      </div>
    );
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
        <div class={gridContainerStyles}>
          <div class={contentAreaStyles}>
            <div class={contentInnerStyles}>
              {props.badge && mounted() && animated() ? (
                <BlurFade delay={0.1}>
                  <div class={badgeStyles}>{props.badge}</div>
                </BlurFade>
              ) : props.badge ? (
                <div class={badgeStyles}>{props.badge}</div>
              ) : null}

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
                {props.buttons.map((button, index) => renderButton(button, 0.7 + index * 0.1))}
              </div>
            </div>
          </div>

          <div class={imageAreaStyles}>
            <div class={imageContainerStyles}>
              {mounted() && animated() ? (
                <BlurFade delay={0.8}>
                  {renderImage()}
                </BlurFade>
              ) : (
                renderImage()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASplit;