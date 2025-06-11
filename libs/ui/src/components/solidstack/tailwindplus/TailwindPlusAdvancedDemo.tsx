import { type Component, For, JSX, Show, createSignal, onMount } from 'solid-js';
import { css } from '../../../styled-system/css';
import { BlurFade } from '../magicui/BlurFade';
import { BorderBeam } from '../magicui/BorderBeam';
import { DotPattern } from '../magicui/DotPattern';
import { ShimmerButton } from '../magicui/ShimmerButton';
import { TextAnimate } from '../magicui/TextAnimate';
import { NewsletterSubscription } from './newsletter/components/NewsletterSubscription';
import { PricingDemo } from './pricing/PricingDemo';
import { SupportCenter } from './support/components/SupportCenter';

const demoCategories = [
  {
    id: 'overview',
    name: 'Overview',
    description: 'Complete SolidStack-UI showcase',
    icon: () => (
      <svg fill="currentColor" viewBox="0 0 20 20" class={css({ width: '100%', height: '100%' })}>
        <path
          fillRule="evenodd"
          d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 'pricing',
    name: 'Pricing',
    description: 'Advanced pricing tables and grids',
    icon: () => (
      <svg fill="currentColor" viewBox="0 0 20 20" class={css({ width: '100%', height: '100%' })}>
        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 'support',
    name: 'Support Center',
    description: 'Help and contact components',
    icon: () => (
      <svg fill="currentColor" viewBox="0 0 20 20" class={css({ width: '100%', height: '100%' })}>
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Subscription and signup forms',
    icon: () => (
      <svg fill="currentColor" viewBox="0 0 20 20" class={css({ width: '100%', height: '100%' })}>
        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
      </svg>
    ),
  },
];

const supportCards = [
  {
    id: 'sales',
    name: 'Sales Team',
    description:
      'Get help with pricing, quotes, and product demonstrations from our sales experts.',
    icon: () => (
      <svg fill="currentColor" viewBox="0 0 20 20" class={css({ width: '100%', height: '100%' })}>
        <path
          fillRule="evenodd"
          d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
    contactMethod: 'phone' as const,
    available: true,
    priority: false,
  },
  {
    id: 'technical',
    name: 'Technical Support',
    description:
      'Resolve technical issues, bugs, and get implementation assistance from our engineering team.',
    icon: () => (
      <svg fill="currentColor" viewBox="0 0 20 20" class={css({ width: '100%', height: '100%' })}>
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    contactMethod: 'chat' as const,
    available: true,
    priority: true,
  },
  {
    id: 'community',
    name: 'Community',
    description:
      'Connect with other developers, share experiences, and learn from community discussions.',
    icon: () => (
      <svg fill="currentColor" viewBox="0 0 20 20" class={css({ width: '100%', height: '100%' })}>
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
      </svg>
    ),
    contactMethod: 'form' as const,
    available: true,
    priority: false,
  },
];

const newsletterFeatures = [
  {
    id: 'updates',
    icon: () => (
      <svg fill="currentColor" viewBox="0 0 20 20" class={css({ width: '100%', height: '100%' })}>
        <path
          fillRule="evenodd"
          d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    title: 'Product Updates',
    description: 'Get notified about new features, improvements, and releases.',
  },
  {
    id: 'insights',
    icon: () => (
      <svg fill="currentColor" viewBox="0 0 20 20" class={css({ width: '100%', height: '100%' })}>
        <path
          fillRule="evenodd"
          d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l-3.401 3.402c-.57.57-1.505.57-2.075 0L5.823 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75z"
          clipRule="evenodd"
        />
      </svg>
    ),
    title: 'Developer Insights',
    description: 'Technical articles, best practices, and development tips.',
  },
];

export const TailwindPlusAdvancedDemo: Component = () => {
  const [activeCategory, setActiveCategory] = createSignal('overview');
  const [theme, setTheme] = createSignal<'light' | 'dark'>('dark');
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
    padding: '32px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  });

  const themeToggleStyles = css({
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '32px',
  });

  const themeButtonStyles = (active: boolean) =>
    css({
      paddingX: '20px',
      paddingY: '10px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      border: '1px solid',
      borderColor: active ? '#6366f1' : 'rgba(255, 255, 255, 0.2)',
      backgroundColor: active ? '#6366f1' : 'transparent',
      color: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        borderColor: '#6366f1',
        backgroundColor: active ? '#5b21b6' : 'rgba(99, 102, 241, 0.1)',
      },
    });

  const categoriesGridStyles = css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  });

  const categoryCardStyles = (active: boolean) =>
    css({
      position: 'relative',
      padding: '24px',
      borderRadius: '16px',
      backgroundColor: active ? 'rgba(79, 70, 229, 0.2)' : 'rgba(255, 255, 255, 0.05)',
      border: active ? '2px solid #4f46e5' : '1px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease-in-out',
      overflow: 'hidden',
      '&:hover': {
        backgroundColor: active ? 'rgba(79, 70, 229, 0.3)' : 'rgba(255, 255, 255, 0.1)',
        borderColor: active ? '#6366f1' : 'rgba(255, 255, 255, 0.2)',
        transform: 'translateY(-2px)',
      },
    });

  const categoryIconStyles = css({
    width: '48px',
    height: '48px',
    marginBottom: '16px',
    color: '#a5b4fc',
  });

  const categoryTitleStyles = css({
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '8px',
  });

  const categoryDescriptionStyles = css({
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: '20px',
  });

  const contentStyles = css({
    position: 'relative',
    backgroundColor: activeCategory() === 'overview' ? '#f8fafc' : 'transparent',
  });

  const overviewGridStyles = css({
    padding: '80px 24px',
    marginX: 'auto',
    maxWidth: '1280px',
    display: 'grid',
    gap: '80px',
  });

  const sectionHeaderStyles = css({
    textAlign: 'center',
    marginBottom: '48px',
  });

  const sectionTitleStyles = css({
    fontSize: '32px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px',
  });

  const sectionDescriptionStyles = css({
    fontSize: '18px',
    color: '#64748b',
    maxWidth: '640px',
    marginX: 'auto',
  });

  const renderOverview = () => (
    <div class={overviewGridStyles}>
      <section>
        <BlurFade delay={0.1} inView>
          <div class={sectionHeaderStyles}>
            <h2 class={sectionTitleStyles}>Pricing Components</h2>
            <p class={sectionDescriptionStyles}>
              Enterprise-grade pricing tables with state machine architecture and beautiful
              animations
            </p>
          </div>
        </BlurFade>
        <PricingDemo theme={theme()} animated={true} />
      </section>

      <section>
        <BlurFade delay={0.2} inView>
          <div class={sectionHeaderStyles}>
            <h2 class={sectionTitleStyles}>Support Center</h2>
            <p class={sectionDescriptionStyles}>
              Comprehensive support interfaces with contact management and interactive features
            </p>
          </div>
        </BlurFade>
        <SupportCenter
          title="How can we help you?"
          subtitle="Our expert team is here to assist you with any questions or technical challenges you may have."
          badge="Support"
          cards={supportCards}
          theme={theme()}
          variant="cards"
          animated={true}
          backgroundPattern="dots"
          onContactSelect={(card, method) => console.log('Contact selected:', card.name, method)}
        />
      </section>

      <section>
        <BlurFade delay={0.3} inView>
          <div class={sectionHeaderStyles}>
            <h2 class={sectionTitleStyles}>Newsletter Subscription</h2>
            <p class={sectionDescriptionStyles}>
              Advanced subscription forms with validation, privacy compliance, and success states
            </p>
          </div>
        </BlurFade>
        <NewsletterSubscription
          title="Stay updated with SolidStack-UI"
          subtitle="Get the latest updates, feature announcements, and developer insights delivered to your inbox."
          badge="Newsletter"
          features={newsletterFeatures}
          theme={theme()}
          variant="split"
          animated={true}
          backgroundPattern="gradient"
          showFeatures={true}
          showPrivacyPolicy={true}
          onSubscribe={(email) => console.log('Newsletter subscription:', email)}
        />
      </section>
    </div>
  );

  const renderCategoryContent = () => {
    switch (activeCategory()) {
      case 'pricing':
        return (
          <PricingDemo
            theme={theme()}
            animated={true}
            className={css({ backgroundColor: theme() === 'dark' ? '#111827' : '#ffffff' })}
          />
        );

      case 'support':
        return (
          <SupportCenter
            title="Support Center"
            subtitle="Get expert help and technical assistance from our dedicated support team."
            badge="Support"
            cards={supportCards}
            theme={theme()}
            variant="hero"
            animated={true}
            backgroundPattern="beams"
            showSearch={true}
            showFilters={true}
            heroImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
            onContactSelect={(card, method) => console.log('Contact selected:', card.name, method)}
          />
        );

      case 'newsletter':
        return (
          <NewsletterSubscription
            title="Subscribe to our newsletter"
            subtitle="Join thousands of developers who stay updated with the latest SolidStack-UI features and insights."
            badge="Developer Newsletter"
            features={newsletterFeatures}
            theme={theme()}
            variant="card"
            animated={true}
            backgroundPattern="beams"
            showFeatures={false}
            showPrivacyPolicy={true}
            onSubscribe={(email, data) => console.log('Newsletter subscription:', email, data)}
            onError={(error) => console.error('Subscription error:', error)}
          />
        );

      default:
        return renderOverview();
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
            SolidStack-UI Tailwind Plus
          </TextAnimate>

          <BlurFade delay={0.2} inView>
            <p class={subtitleStyles}>
              State-of-the-art UI components with Zag.js state machines, PandaCSS styling, and
              thoughtful animation augmentations from Aceternity UI & Magic UI.
            </p>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <div class={navigationStyles}>
              <BorderBeam size={100} duration={20} colorFrom="#6366f1" colorTo="#8b5cf6" />

              <div class={themeToggleStyles}>
                <div
                  class={css({
                    display: 'flex',
                    gap: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '4px',
                  })}
                >
                  <button
                    class={themeButtonStyles(theme() === 'light')}
                    onClick={() => setTheme('light')}
                  >
                    Light Theme
                  </button>
                  <button
                    class={themeButtonStyles(theme() === 'dark')}
                    onClick={() => setTheme('dark')}
                  >
                    Dark Theme
                  </button>
                </div>
              </div>

              <h3
                class={css({
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '24px',
                  textAlign: 'center',
                })}
              >
                Explore Component Categories
              </h3>

              <div class={categoriesGridStyles}>
                <For each={demoCategories}>
                  {(category) => (
                    <div
                      class={categoryCardStyles(activeCategory() === category.id)}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <Show when={activeCategory() === category.id}>
                        <BorderBeam size={60} duration={12} colorFrom="#6366f1" colorTo="#8b5cf6" />
                      </Show>

                      <category.icon class={categoryIconStyles} />
                      <h4 class={categoryTitleStyles}>{category.name}</h4>
                      <p class={categoryDescriptionStyles}>{category.description}</p>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </BlurFade>
        </div>
      </header>

      <main class={contentStyles}>
        <Show when={mounted()}>{renderCategoryContent()}</Show>
      </main>

      <footer
        class={css({
          backgroundColor: '#0f172a',
          paddingY: '64px',
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
          <h3
            class={css({
              fontSize: '24px',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '16px',
            })}
          >
            Built for the Modern Web
          </h3>

          <p
            class={css({
              fontSize: '16px',
              color: '#94a3b8',
              marginBottom: '32px',
              maxWidth: '640px',
              marginX: 'auto',
            })}
          >
            SolidStack-UI combines the best of SolidJS reactivity, Zag.js state machines, PandaCSS
            styling, and beautiful animations to create enterprise-grade components.
          </p>

          <div
            class={css({
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              flexWrap: 'wrap',
              marginBottom: '24px',
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
                  backgroundColor: '#f59e0b',
                })}
              />
              Production Tested
            </span>
          </div>

          <div
            class={css({
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
            })}
          >
            <ShimmerButton
              onClick={() => window.open('https://github.com/your-repo/solidstack-ui', '_blank')}
            >
              View on GitHub
            </ShimmerButton>
            <button
              class={css({
                paddingX: '24px',
                paddingY: '12px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: 'transparent',
                color: '#a5b4fc',
                border: '1px solid rgba(165, 180, 252, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(165, 180, 252, 0.1)',
                  borderColor: 'rgba(165, 180, 252, 0.4)',
                },
              })}
              onClick={() => window.open('https://docs.solidstack-ui.dev', '_blank')}
            >
              Documentation
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
