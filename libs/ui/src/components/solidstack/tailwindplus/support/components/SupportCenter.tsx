import { type Component, For, JSX, Show, createEffect, createSignal, onMount } from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { BackgroundBeams } from '../../../magicui/BackgroundBeams';
import { BlurFade } from '../../../magicui/BlurFade';
import { BorderBeam } from '../../../magicui/BorderBeam';
import { DotPattern } from '../../../magicui/DotPattern';
import { HoverCard } from '../../../magicui/HoverCard';
import { ShimmerButton } from '../../../magicui/ShimmerButton';
import { TextAnimate } from '../../../magicui/TextAnimate';
import { useSupportSection } from '../state/useSupportSection';

export interface SupportCard {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element | string;
  href?: string;
  contactMethod?: 'email' | 'phone' | 'chat' | 'form';
  available?: boolean;
  priority?: boolean;
}

export interface SupportCenterProps {
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  cards: SupportCard[];
  theme?: 'light' | 'dark';
  variant?: 'simple' | 'hero' | 'split' | 'cards';
  animated?: boolean;
  backgroundPattern?: 'none' | 'dots' | 'beams' | 'gradient';
  showSearch?: boolean;
  showFilters?: boolean;
  onContactSelect?: (card: SupportCard, method?: string) => void;
  heroImage?: string;
}

export const SupportCenter: Component<SupportCenterProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal('');
  const supportSection = useSupportSection();

  const theme = () => props.theme ?? 'dark';
  const animated = () => props.animated ?? true;
  const variant = () => props.variant ?? 'hero';
  const backgroundPattern = () => props.backgroundPattern ?? 'beams';
  const showSearch = () => props.showSearch ?? false;
  const showFilters = () => props.showFilters ?? false;

  onMount(() => {
    setMounted(true);
    supportSection.mount();
    supportSection.updateSupportCards(props.cards);

    if (animated()) {
      setTimeout(() => {
        supportSection.startAnimation();
      }, 100);
    }
  });

  createEffect(() => {
    if (supportSection.getTheme() !== theme()) {
      supportSection.toggleTheme();
    }
  });

  createEffect(() => {
    supportSection.updateSupportCards(props.cards);
  });

  createEffect(() => {
    supportSection.setSearchQuery(searchQuery());
  });

  const handleCardSelect = (card: SupportCard) => {
    supportSection.selectCard(card.id);
    props.onContactSelect?.(card);
  };

  const handleContactInitiate = (card: SupportCard, method?: string) => {
    supportSection.initiateContact(card.id, method);
    props.onContactSelect?.(card, method);
  };

  const containerStyles = css({
    position: 'relative',
    backgroundColor: theme() === 'dark' ? '#111827' : '#ffffff',
    overflow: 'hidden',
  });

  const heroSectionStyles = css({
    position: 'relative',
    paddingY: '96px',
    '@media (min-width: 640px)': {
      paddingY: '128px',
    },
  });

  const gradientOverlayStyles = css({
    position: 'absolute',
    inset: '0',
    background:
      theme() === 'dark'
        ? 'radial-gradient(circle at 30% 40%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 10%, rgba(120, 119, 198, 0.15), transparent 50%), radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.15), transparent 50%)'
        : 'radial-gradient(circle at 30% 40%, rgba(79, 70, 229, 0.08), transparent 50%), radial-gradient(circle at 80% 10%, rgba(124, 58, 237, 0.05), transparent 50%)',
    pointerEvents: 'none',
  });

  const heroImageStyles = css({
    position: 'absolute',
    inset: '0',
    zIndex: '-10',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: theme() === 'dark' ? 'right' : 'center',
    '@media (min-width: 768px)': {
      objectPosition: 'center',
    },
  });

  const innerContainerStyles = css({
    position: 'relative',
    zIndex: '10',
    marginX: 'auto',
    maxWidth: '1792px',
    paddingX: '24px',
    '@media (min-width: 1024px)': {
      paddingX: '32px',
    },
  });

  const headerStyles = css({
    marginX: 'auto',
    maxWidth: variant() === 'split' ? '512px' : '1024px',
    textAlign: variant() === 'simple' ? 'center' : 'left',
    '@media (min-width: 1024px)': {
      textAlign: variant() === 'split' ? 'left' : 'center',
      maxWidth: variant() === 'split' ? 'none' : '1024px',
    },
  });

  const badgeStyles = css({
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#a5b4fc' : '#6366f1',
    marginBottom: '8px',
  });

  const titleStyles = css({
    fontSize: '48px',
    lineHeight: '1',
    fontWeight: '600',
    letterSpacing: '-0.025em',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    marginBottom: '32px',
    '@media (min-width: 640px)': {
      fontSize: '72px',
    },
  });

  const subtitleStyles = css({
    fontSize: '18px',
    lineHeight: '28px',
    fontWeight: '500',
    color: theme() === 'dark' ? '#d1d5db' : '#4b5563',
    maxWidth: '768px',
    '@media (min-width: 640px)': {
      fontSize: '20px',
      lineHeight: '32px',
    },
  });

  const searchSectionStyles = css({
    marginTop: '48px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    '@media (min-width: 640px)': {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });

  const searchInputStyles = css({
    paddingX: '16px',
    paddingY: '12px',
    borderRadius: '12px',
    backgroundColor: theme() === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb',
    border: `1px solid ${theme() === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'}`,
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    '&:focus': {
      borderColor: theme() === 'dark' ? '#6366f1' : '#4f46e5',
      backgroundColor: theme() === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
    },
    '&::placeholder': {
      color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
    },
  });

  const filterButtonStyles = (active: boolean) =>
    css({
      paddingX: '16px',
      paddingY: '8px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      border: '1px solid',
      borderColor: active
        ? theme() === 'dark'
          ? '#6366f1'
          : '#4f46e5'
        : theme() === 'dark'
          ? 'rgba(255, 255, 255, 0.1)'
          : '#e5e7eb',
      backgroundColor: active
        ? theme() === 'dark'
          ? 'rgba(99, 102, 241, 0.1)'
          : 'rgba(79, 70, 229, 0.1)'
        : 'transparent',
      color: active
        ? theme() === 'dark'
          ? '#a5b4fc'
          : '#4f46e5'
        : theme() === 'dark'
          ? '#d1d5db'
          : '#6b7280',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        borderColor: theme() === 'dark' ? '#6366f1' : '#4f46e5',
        backgroundColor: theme() === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
      },
    });

  const cardsContainerStyles = css({
    marginTop: '64px',
    position: 'relative',
    zIndex: '10',
  });

  const cardsGridStyles = css({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
    maxWidth: '896px',
    marginX: 'auto',
    '@media (min-width: 640px)': {
      gap: '32px',
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: variant() === 'cards' ? 'repeat(3, 1fr)' : '1fr',
      maxWidth: variant() === 'cards' ? 'none' : '896px',
      gap: variant() === 'cards' ? '32px' : '24px',
    },
  });

  const cardStyles = (card: SupportCard) =>
    css({
      position: 'relative',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
      padding: '24px',
      borderRadius: '16px',
      backgroundColor: theme() === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
      border: `1px solid ${theme() === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'}`,
      transition: 'all 0.3s ease-in-out',
      cursor: 'pointer',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-4px)',
        backgroundColor: theme() === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f9fafb',
        borderColor: theme() === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
        boxShadow:
          theme() === 'dark'
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    });

  const cardIconContainerStyles = (card: SupportCard) =>
    css({
      flexShrink: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      backgroundColor: card.priority
        ? theme() === 'dark'
          ? '#6366f1'
          : '#4f46e5'
        : theme() === 'dark'
          ? 'rgba(129, 140, 248, 0.1)'
          : 'rgba(79, 70, 229, 0.1)',
      color: card.priority ? '#ffffff' : theme() === 'dark' ? '#a5b4fc' : '#4f46e5',
    });

  const cardContentStyles = css({
    flex: '1',
    minWidth: '0',
  });

  const cardTitleStyles = css({
    fontSize: '18px',
    lineHeight: '28px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    marginBottom: '8px',
  });

  const cardDescriptionStyles = css({
    fontSize: '14px',
    lineHeight: '20px',
    color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
    marginBottom: '16px',
  });

  const cardActionsStyles = css({
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  });

  const contactMethodStyles = (method: string) =>
    css({
      paddingX: '12px',
      paddingY: '6px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: theme() === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
      color: theme() === 'dark' ? '#a5b4fc' : '#4f46e5',
      border: `1px solid ${theme() === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(79, 70, 229, 0.2)'}`,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: theme() === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(79, 70, 229, 0.2)',
      },
    });

  const availabilityBadgeStyles = (available: boolean) =>
    css({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      paddingX: '8px',
      paddingY: '4px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: available
        ? theme() === 'dark'
          ? 'rgba(34, 197, 94, 0.1)'
          : 'rgba(34, 197, 94, 0.1)'
        : theme() === 'dark'
          ? 'rgba(239, 68, 68, 0.1)'
          : 'rgba(239, 68, 68, 0.1)',
      color: available
        ? theme() === 'dark'
          ? '#4ade80'
          : '#16a34a'
        : theme() === 'dark'
          ? '#f87171'
          : '#dc2626',
    });

  const statusDotStyles = (available: boolean) =>
    css({
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: available
        ? theme() === 'dark'
          ? '#4ade80'
          : '#16a34a'
        : theme() === 'dark'
          ? '#f87171'
          : '#dc2626',
    });

  const overlappingCardsStyles = css({
    position: 'relative',
    zIndex: '10',
    marginX: 'auto',
    marginTop: '-128px',
    maxWidth: '1792px',
    paddingX: '24px',
    paddingBottom: '128px',
  });

  const overlappingCardStyles = (index: number) =>
    css({
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '16px',
      backgroundColor: '#ffffff',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
      transform: `translateY(${index * 8}px)`,
    });

  const overlappingCardHeaderStyles = css({
    position: 'relative',
    flex: '1',
    paddingX: '24px',
    paddingTop: '64px',
    paddingBottom: '32px',
    '@media (min-width: 768px)': {
      paddingX: '32px',
    },
  });

  const overlappingIconStyles = css({
    position: 'absolute',
    top: '0',
    display: 'inline-block',
    transform: 'translateY(-50%)',
    borderRadius: '12px',
    backgroundColor: '#4f46e5',
    padding: '20px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  });

  const renderSimpleVariant = () => (
    <div class={heroSectionStyles}>
      <div class={innerContainerStyles}>
        <div class={css({ textAlign: 'center', maxWidth: '512px', marginX: 'auto' })}>
          <Show when={props.badge}>
            <BlurFade delay={0.1} inView>
              <div class={badgeStyles}>{props.badge}</div>
            </BlurFade>
          </Show>

          <TextAnimate class={titleStyles} animation="slideUp" delay={0.2}>
            {props.title || 'Support center'}
          </TextAnimate>

          <Show when={props.subtitle}>
            <BlurFade delay={0.3} inView>
              <p class={subtitleStyles}>{props.subtitle}</p>
            </BlurFade>
          </Show>
        </div>
      </div>
    </div>
  );

  const renderHeroVariant = () => (
    <div class={heroSectionStyles}>
      <Show when={props.heroImage}>
        <img alt="" src={props.heroImage} class={heroImageStyles} />
      </Show>

      <Show when={backgroundPattern() === 'gradient'}>
        <div class={gradientOverlayStyles} />
      </Show>

      <div class={innerContainerStyles}>
        <div class={headerStyles}>
          <Show when={props.badge}>
            <BlurFade delay={0.1} inView>
              <div class={badgeStyles}>{props.badge}</div>
            </BlurFade>
          </Show>

          <TextAnimate class={titleStyles} animation="slideUp" delay={0.2}>
            {props.title || 'Support center'}
          </TextAnimate>

          <Show when={props.subtitle}>
            <BlurFade delay={0.3} inView>
              <p class={subtitleStyles}>{props.subtitle}</p>
            </BlurFade>
          </Show>

          <Show when={showSearch()}>
            <BlurFade delay={0.4} inView>
              <div class={searchSectionStyles}>
                <input
                  type="text"
                  placeholder="Search support topics..."
                  value={searchQuery()}
                  onInput={(e) => setSearchQuery(e.target.value)}
                  class={searchInputStyles}
                />

                <Show when={showFilters()}>
                  <div class={css({ display: 'flex', gap: '8px' })}>
                    <button
                      class={filterButtonStyles(supportSection.getFilterMode() === 'all')}
                      onClick={() => supportSection.setFilterMode('all')}
                    >
                      All
                    </button>
                    <button
                      class={filterButtonStyles(supportSection.getFilterMode() === 'available')}
                      onClick={() => supportSection.setFilterMode('available')}
                    >
                      Available
                    </button>
                    <button
                      class={filterButtonStyles(supportSection.getFilterMode() === 'priority')}
                      onClick={() => supportSection.setFilterMode('priority')}
                    >
                      Priority
                    </button>
                  </div>
                </Show>
              </div>
            </BlurFade>
          </Show>
        </div>

        <div class={cardsContainerStyles}>
          <div class={cardsGridStyles}>
            <For each={supportSection.getFilteredCards()}>
              {(card, index) => (
                <BlurFade delay={0.5 + index() * 0.1} inView>
                  <div
                    class={cardStyles(card)}
                    onMouseEnter={() => supportSection.hoverCard(card.id)}
                    onMouseLeave={() => supportSection.unhoverCard()}
                    onClick={() => handleCardSelect(card)}
                  >
                    <Show when={card.priority || supportSection.isCardActive(card.id)}>
                      <BorderBeam
                        size={60}
                        duration={12}
                        colorFrom={theme() === 'dark' ? '#6366f1' : '#4f46e5'}
                        colorTo={theme() === 'dark' ? '#8b5cf6' : '#7c3aed'}
                      />
                    </Show>

                    <div class={cardIconContainerStyles(card)}>
                      <card.icon class={css({ width: '24px', height: '24px' })} />
                    </div>

                    <div class={cardContentStyles}>
                      <div
                        class={css({
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '8px',
                        })}
                      >
                        <h3 class={cardTitleStyles}>{card.name}</h3>
                        <Show when={card.available !== undefined}>
                          <div class={availabilityBadgeStyles(card.available!)}>
                            <div class={statusDotStyles(card.available!)} />
                            {card.available ? 'Available' : 'Offline'}
                          </div>
                        </Show>
                      </div>

                      <p class={cardDescriptionStyles}>{card.description}</p>

                      <div class={cardActionsStyles}>
                        <Show when={card.contactMethod}>
                          <button
                            class={contactMethodStyles(card.contactMethod!)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContactInitiate(card, card.contactMethod);
                            }}
                          >
                            Contact via {card.contactMethod}
                          </button>
                        </Show>

                        <Show when={card.href}>
                          <ShimmerButton
                            class={css({ fontSize: '12px', paddingX: '12px', paddingY: '6px' })}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(card.href, '_blank');
                            }}
                          >
                            Learn more
                          </ShimmerButton>
                        </Show>
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

  const renderOverlappingVariant = () => (
    <>
      <div
        class={css({ position: 'relative', backgroundColor: '#1f2937', paddingBottom: '128px' })}
      >
        <Show when={props.heroImage}>
          <div class={css({ position: 'absolute', inset: '0' })}>
            <img
              alt=""
              src={props.heroImage}
              class={css({ width: '100%', height: '100%', objectFit: 'cover' })}
            />
            <div
              class={css({
                position: 'absolute',
                inset: '0',
                backgroundColor: '#1f2937',
                mixBlendMode: 'multiply',
              })}
            />
          </div>
        </Show>

        <div
          class={css({
            position: 'relative',
            marginX: 'auto',
            maxWidth: '1792px',
            paddingX: '24px',
            paddingY: '96px',
            '@media (min-width: 1024px)': { paddingX: '32px' },
          })}
        >
          <TextAnimate
            class={css({
              fontSize: '32px',
              fontWeight: '700',
              letterSpacing: '-0.025em',
              color: '#ffffff',
              '@media (min-width: 768px)': { fontSize: '48px' },
              '@media (min-width: 1024px)': { fontSize: '64px' },
            })}
            animation="slideUp"
            delay={0.1}
          >
            {props.title || 'Support'}
          </TextAnimate>

          <Show when={props.subtitle}>
            <BlurFade delay={0.2} inView>
              <p
                class={css({
                  marginTop: '24px',
                  maxWidth: '768px',
                  fontSize: '20px',
                  color: '#d1d5db',
                })}
              >
                {props.subtitle}
              </p>
            </BlurFade>
          </Show>
        </div>
      </div>

      <section class={overlappingCardsStyles}>
        <div
          class={css({
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '80px',
            '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' },
          })}
        >
          <For each={supportSection.getFilteredCards()}>
            {(card, index) => (
              <BlurFade delay={0.3 + index() * 0.1} inView>
                <div class={overlappingCardStyles(index())}>
                  <div class={overlappingCardHeaderStyles}>
                    <div class={overlappingIconStyles}>
                      <card.icon class={css({ width: '24px', height: '24px', color: '#ffffff' })} />
                    </div>
                    <h3 class={css({ fontSize: '20px', fontWeight: '500', color: '#111827' })}>
                      {card.name}
                    </h3>
                    <p class={css({ marginTop: '16px', fontSize: '16px', color: '#6b7280' })}>
                      {card.description}
                    </p>
                  </div>
                  <div
                    class={css({
                      borderRadius: '0 0 16px 16px',
                      backgroundColor: '#f9fafb',
                      padding: '24px',
                      '@media (min-width: 768px)': { paddingX: '32px' },
                    })}
                  >
                    <ShimmerButton
                      class={css({ width: '100%' })}
                      onClick={() => handleContactInitiate(card)}
                    >
                      Contact us
                      <span class={css({ marginLeft: '8px' })}>&rarr;</span>
                    </ShimmerButton>
                  </div>
                </div>
              </BlurFade>
            )}
          </For>
        </div>
      </section>
    </>
  );

  return (
    <div class={`${containerStyles} ${props.className || ''}`}>
      <Show when={backgroundPattern() === 'dots'}>
        <DotPattern
          className={css({
            position: 'absolute',
            inset: '0',
            zIndex: '0',
            opacity: theme() === 'dark' ? '0.1' : '0.05',
          })}
        />
      </Show>

      <Show when={backgroundPattern() === 'beams'}>
        <BackgroundBeams className={css({ position: 'absolute', inset: '0', zIndex: '0' })} />
      </Show>

      <Show when={variant() === 'simple'}>{renderSimpleVariant()}</Show>

      <Show when={variant() === 'hero' || variant() === 'cards'}>{renderHeroVariant()}</Show>

      <Show when={variant() === 'split'}>{renderOverlappingVariant()}</Show>
    </div>
  );
};
