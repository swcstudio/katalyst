import { Component, JSX, createSignal, For, Show, onMount } from "solid-js";
import { css } from "../../../styled-system/css";
import { SupportCenter } from "./support/components/SupportCenter";
import { NewsletterSubscription } from "./newsletter/components/NewsletterSubscription";
import { TextAnimate } from "../magicui/TextAnimate";
import { BlurFade } from "../magicui/BlurFade";
import { DotPattern } from "../magicui/DotPattern";
import { BorderBeam } from "../magicui/BorderBeam";

// Sample support cards
const supportCards = [
  {
    id: "sales",
    name: "Sales",
    description: "Consectetur vel non. Rerum ut consequatur nobis unde. Enim est quo corrupti consequatur.",
    icon: () => (
      <svg fill="currentColor" viewBox="0 0 20 20" class={css({ width: "100%", height: "100%" })}>
        <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
      </svg>
    ),
    contactMethod: "phone" as const,
    available: true,
    priority: false,
  },
  {
    id: "support",
    name: "Technical Support",
    description: "Quod possimus sit modi rerum exercitationem quaerat atque tenetur ullam.",
    icon: () => (
      <svg fill="currentColor" viewBox="0 0 20 20" class={css({ width: "100%", height: "100%" })}>
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
    contactMethod: "chat" as const,
    available: true,
    priority: true,
  },
  {
    id: "media",
    name: "Media Inquiries",
    description: "Ratione et porro eligendi est sed ratione rerum itaque. Placeat accusantium impedit eum odit.",
    icon: () => (
      <svg fill="currentColor" viewBox="0 0 20 20" class={css({ width: "100%", height: "100%" })}>
        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
        <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
      </svg>
    ),
    contactMethod: "email" as const,
    available: false,
    priority: false,
  },
];

// Sample newsletter features
const newsletterFeatures = [
  {
    id: "weekly",
    icon: () => (
      <svg fill="currentColor" viewBox="0 0 20 20" class={css({ width: "100%", height: "100%" })}>
        <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
      </svg>
    ),
    title: "Weekly articles",
    description: "Non laboris consequat cupidatat laborum magna. Eiusmod non irure cupidatat duis commodo amet.",
  },
  {
    id: "nospam",
    icon: () => (
      <svg fill="currentColor" viewBox="0 0 20 20" class={css({ width: "100%", height: "100%" })}>
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
      </svg>
    ),
    title: "No spam",
    description: "Officia excepteur ullamco ut sint duis proident non adipisicing. Voluptate incididunt anim.",
  },
];

const showcaseVariants = [
  {
    id: "support-simple",
    name: "Support - Simple",
    description: "Clean and minimal support center",
    component: "support",
    variant: "simple",
  },
  {
    id: "support-hero",
    name: "Support - Hero",
    description: "Hero layout with background image",
    component: "support",
    variant: "hero",
  },
  {
    id: "support-cards",
    name: "Support - Cards",
    description: "Card-based layout with animations",
    component: "support",
    variant: "cards",
  },
  {
    id: "support-split",
    name: "Support - Split",
    description: "Overlapping cards with hero section",
    component: "support",
    variant: "split",
  },
  {
    id: "newsletter-simple",
    name: "Newsletter - Simple",
    description: "Simple newsletter signup form",
    component: "newsletter",
    variant: "simple",
  },
  {
    id: "newsletter-centered",
    name: "Newsletter - Centered",
    description: "Centered layout with enhanced animations",
    component: "newsletter",
    variant: "centered",
  },
  {
    id: "newsletter-split",
    name: "Newsletter - Split",
    description: "Two-column layout with features",
    component: "newsletter",
    variant: "split",
  },
  {
    id: "newsletter-card",
    name: "Newsletter - Card",
    description: "Card-style signup with border effects",
    component: "newsletter",
    variant: "card",
  },
];

export const SupportNewsletterShowcase: Component = () => {
  const [selectedDemo, setSelectedDemo] = createSignal("support-hero");
  const [theme, setTheme] = createSignal<"light" | "dark">("dark");
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    setMounted(true);
  });

  const containerStyles = css({
    position: "relative",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  });

  const headerStyles = css({
    position: "relative",
    backgroundColor: "#0f172a",
    paddingY: "80px",
    overflow: "hidden",
  });

  const gradientOverlayStyles = css({
    position: "absolute",
    inset: "0",
    background: "radial-gradient(circle at 30% 40%, rgba(79, 70, 229, 0.3), transparent 50%), radial-gradient(circle at 80% 10%, rgba(124, 58, 237, 0.2), transparent 50%)",
    pointerEvents: "none",
  });

  const headerContentStyles = css({
    position: "relative",
    zIndex: "10",
    marginX: "auto",
    maxWidth: "1280px",
    paddingX: "24px",
    textAlign: "center",
  });

  const titleStyles = css({
    fontSize: "56px",
    lineHeight: "1",
    fontWeight: "700",
    letterSpacing: "-0.025em",
    color: "#ffffff",
    "@media (min-width: 640px)": {
      fontSize: "72px",
    },
  });

  const subtitleStyles = css({
    marginTop: "24px",
    fontSize: "20px",
    lineHeight: "32px",
    color: "#cbd5e1",
    maxWidth: "768px",
    marginX: "auto",
  });

  const navigationStyles = css({
    marginTop: "48px",
    padding: "24px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(8px)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  });

  const themeToggleStyles = css({
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
  });

  const themeButtonStyles = (active: boolean) => css({
    paddingX: "16px",
    paddingY: "8px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    border: "1px solid",
    borderColor: active ? "#6366f1" : "rgba(255, 255, 255, 0.2)",
    backgroundColor: active ? "#6366f1" : "transparent",
    color: "#ffffff",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      borderColor: "#6366f1",
      backgroundColor: active ? "#5b21b6" : "rgba(99, 102, 241, 0.1)",
    },
  });

  const navGridStyles = css({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  });

  const navItemStyles = (active: boolean) => css({
    position: "relative",
    padding: "16px",
    borderRadius: "12px",
    backgroundColor: active ? "rgba(79, 70, 229, 0.2)" : "rgba(255, 255, 255, 0.05)",
    border: active ? "2px solid #4f46e5" : "1px solid rgba(255, 255, 255, 0.1)",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: active ? "rgba(79, 70, 229, 0.3)" : "rgba(255, 255, 255, 0.1)",
      borderColor: active ? "#6366f1" : "rgba(255, 255, 255, 0.2)",
    },
  });

  const navTitleStyles = css({
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: "4px",
  });

  const navDescriptionStyles = css({
    fontSize: "14px",
    color: "#94a3b8",
  });

  const contentStyles = css({
    position: "relative",
  });

  const renderActiveComponent = () => {
    const selected = showcaseVariants.find(v => v.id === selectedDemo());
    if (!selected) return null;

    if (selected.component === "support") {
      return (
        <SupportCenter
          title="Support Center"
          subtitle="Get the help you need from our experienced support team. We're here to assist you with any questions or issues you may have."
          badge="Support"
          cards={supportCards}
          theme={theme()}
          variant={selected.variant as any}
          animated={true}
          backgroundPattern={selected.variant === "hero" ? "beams" : "dots"}
          showSearch={selected.variant === "hero"}
          showFilters={selected.variant === "cards"}
          heroImage={selected.variant === "hero" || selected.variant === "split" ? "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply" : undefined}
          onContactSelect={(card, method) => console.log("Contact selected:", card, method)}
        />
      );
    } else if (selected.component === "newsletter") {
      return (
        <NewsletterSubscription
          title={
            selected.variant === "simple" 
              ? "Want product news and updates? Sign up for our newsletter."
              : selected.variant === "centered"
              ? "Get notified when we're launching"
              : selected.variant === "split"
              ? "Subscribe to our newsletter"
              : "Sign up for our newsletter"
          }
          subtitle={
            selected.variant === "split" 
              ? "Nostrud amet eu ullamco nisi aute in ad minim nostrud adipisicing velit quis. Duis tempor incididunt dolore."
              : "Reprehenderit ad esse et non officia in nulla. Id proident tempor incididunt nostrud nulla et culpa."
          }
          badge={selected.variant === "split" ? "Newsletter" : undefined}
          features={selected.variant === "split" ? newsletterFeatures : undefined}
          theme={theme()}
          variant={selected.variant as any}
          animated={true}
          backgroundPattern={selected.variant === "centered" ? "gradient" : selected.variant === "card" ? "beams" : "dots"}
          showPrivacyPolicy={true}
          showFeatures={selected.variant === "split"}
          onSubscribe={(email, data) => console.log("Subscribed:", email, data)}
          onError={(error) => console.error("Subscription error:", error)}
          privacyPolicyUrl="#"
        />
      );
    }

    return null;
  };

  return (
    <div class={containerStyles}>
      <DotPattern
        className={css({
          position: "absolute",
          inset: "0",
          zIndex: "0",
          opacity: "0.03",
        })}
      />

      <header class={headerStyles}>
        <div class={gradientOverlayStyles} />
        
        <DotPattern
          className={css({
            position: "absolute",
            inset: "0",
            zIndex: "1",
            opacity: "0.1",
          })}
        />

        <div class={headerContentStyles}>
          <TextAnimate
            class={titleStyles}
            animation="slideUp"
            delay={0.1}
          >
            Support & Newsletter Components
          </TextAnimate>

          <BlurFade delay={0.2} inView>
            <p class={subtitleStyles}>
              State-of-the-art support center and newsletter subscription components with Zag.js state machines, 
              PandaCSS styling, and thoughtful animation augmentations.
            </p>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <div class={navigationStyles}>
              <BorderBeam
                size={80}
                duration={15}
                colorFrom="#6366f1"
                colorTo="#8b5cf6"
              />
              
              <div class={themeToggleStyles}>
                <div class={css({ display: "flex", gap: "4px", backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "4px" })}>
                  <button
                    class={themeButtonStyles(theme() === "light")}
                    onClick={() => setTheme("light")}
                  >
                    Light
                  </button>
                  <button
                    class={themeButtonStyles(theme() === "dark")}
                    onClick={() => setTheme("dark")}
                  >
                    Dark
                  </button>
                </div>
              </div>

              <h3 class={css({
                fontSize: "18px",
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: "16px",
                textAlign: "center",
              })}>
                Choose a component variant to explore
              </h3>

              <div class={navGridStyles}>
                <For each={showcaseVariants}>
                  {(variant) => (
                    <div
                      class={navItemStyles(selectedDemo() === variant.id)}
                      onClick={() => setSelectedDemo(variant.id)}
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
        <Show when={mounted()}>
          {renderActiveComponent()}
        </Show>
      </main>

      <footer class={css({
        backgroundColor: "#0f172a",
        paddingY: "48px",
        textAlign: "center",
      })}>
        <div class={css({
          marginX: "auto",
          maxWidth: "1280px",
          paddingX: "24px",
        })}>
          <p class={css({
            fontSize: "16px",
            color: "#94a3b8",
            marginBottom: "24px",
          })}>
            Built with SolidJS, Zag.js State Machines, PandaCSS, and enhanced with animations from Aceternity UI & Magic UI
          </p>
          
          <div class={css({
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap",
          })}>
            <span class={css({
              fontSize: "14px",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            })}>
              <div class={css({
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
              })} />
              State Machine Architecture
            </span>
            <span class={css({
              fontSize: "14px",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            })}>
              <div class={css({
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#3b82f6",
              })} />
              Animation Augmented
            </span>
            <span class={css({
              fontSize: "14px",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            })}>
              <div class={css({
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#8b5cf6",
              })} />
              Enterprise Ready
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};