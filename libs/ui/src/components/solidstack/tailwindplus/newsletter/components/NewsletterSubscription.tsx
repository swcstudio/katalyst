import { type Component, For, JSX, Show, createEffect, createSignal, onMount } from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { BackgroundBeams } from '../../../magicui/BackgroundBeams';
import { BlurFade } from '../../../magicui/BlurFade';
import { BorderBeam } from '../../../magicui/BorderBeam';
import { DotPattern } from '../../../magicui/DotPattern';
import { ShimmerButton } from '../../../magicui/ShimmerButton';
import { TextAnimate } from '../../../magicui/TextAnimate';
import { useNewsletterSection } from '../state/useNewsletterSection';

export interface NewsletterFeature {
  id: string;
  icon: JSX.Element | string;
  title: string;
  description: string;
}

export interface NewsletterSubscriptionProps {
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  features?: NewsletterFeature[];
  theme?: 'light' | 'dark';
  variant?: 'simple' | 'centered' | 'split' | 'card' | 'inline';
  animated?: boolean;
  backgroundPattern?: 'none' | 'dots' | 'beams' | 'gradient';
  showPrivacyPolicy?: boolean;
  showFeatures?: boolean;
  onSubscribe?: (email: string, data?: Record<string, unknown>) => void;
  onError?: (error: string) => void;
  privacyPolicyUrl?: string;
  backgroundImage?: string;
}

export const NewsletterSubscription: Component<NewsletterSubscriptionProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const [email, setEmail] = createSignal('');
  const newsletterSection = useNewsletterSection();

  const theme = () => props.theme ?? 'dark';
  const animated = () => props.animated ?? true;
  const variant = () => props.variant ?? 'centered';
  const backgroundPattern = () => props.backgroundPattern ?? 'gradient';
  const showPrivacyPolicy = () => props.showPrivacyPolicy ?? true;
  const showFeatures = () => props.showFeatures ?? true;

  onMount(() => {
    setMounted(true);
    newsletterSection.mount();
    newsletterSection.setVariant(variant());

    if (showPrivacyPolicy()) {
      newsletterSection.togglePrivacyPolicy();
    }

    if (animated()) {
      setTimeout(() => {
        newsletterSection.startAnimation();
      }, 100);
    }
  });

  createEffect(() => {
    if (newsletterSection.getTheme() !== theme()) {
      newsletterSection.toggleTheme();
    }
  });

  createEffect(() => {
    newsletterSection.updateFormData('email', email());
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    try {
      await newsletterSection.submitForm();
      const formData = newsletterSection.getFormData();
      props.onSubscribe?.(formData.email, formData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Subscription failed';
      props.onError?.(errorMessage);
    }
  };

  const containerStyles = css({
    position: 'relative',
    backgroundColor: theme() === 'dark' ? '#111827' : '#ffffff',
    overflow: 'hidden',
  });

  const sectionStyles = css({
    position: 'relative',
    paddingY: variant() === 'inline' ? '64px' : '96px',
    '@media (min-width: 640px)': {
      paddingY: variant() === 'inline' ? '96px' : '128px',
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

  const backgroundImageStyles = css({
    position: 'absolute',
    inset: '0',
    zIndex: '-10',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
  });

  const innerContainerStyles = css({
    position: 'relative',
    zIndex: '10',
    marginX: 'auto',
    maxWidth: variant() === 'split' ? '1792px' : '896px',
    paddingX: '24px',
    '@media (min-width: 1024px)': {
      paddingX: '32px',
    },
  });

  const splitLayoutStyles = css({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '40px',
    alignItems: 'center',
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '32px',
    },
  });

  const splitContentStyles = css({
    '@media (min-width: 1024px)': {
      gridColumn: 'span 7',
    },
  });

  const splitFormStyles = css({
    width: '100%',
    maxWidth: '448px',
    '@media (min-width: 1024px)': {
      gridColumn: 'span 5',
      paddingTop: '8px',
    },
  });

  const headerStyles = css({
    textAlign: variant() === 'split' ? 'left' : 'center',
    marginBottom: variant() === 'inline' ? '40px' : '48px',
  });

  const badgeStyles = css({
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#a5b4fc' : '#6366f1',
    marginBottom: '8px',
  });

  const titleStyles = css({
    fontSize: variant() === 'inline' ? '24px' : '32px',
    lineHeight: '1.1',
    fontWeight: '600',
    letterSpacing: '-0.025em',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    marginBottom: '16px',
    '@media (min-width: 640px)': {
      fontSize: variant() === 'inline' ? '32px' : '48px',
    },
  });

  const subtitleStyles = css({
    fontSize: '18px',
    lineHeight: '28px',
    fontWeight: '500',
    color: theme() === 'dark' ? '#d1d5db' : '#4b5563',
    maxWidth: variant() === 'split' ? 'none' : '640px',
    marginX: variant() === 'split' ? '0' : 'auto',
    '@media (min-width: 640px)': {
      fontSize: '20px',
      lineHeight: '32px',
    },
  });

  const formContainerStyles = css({
    position: 'relative',
    maxWidth: variant() === 'split' ? 'none' : '512px',
    marginX: 'auto',
  });

  const formStyles = css({
    display: 'flex',
    flexDirection: variant() === 'inline' ? 'row' : 'column',
    gap: '16px',
    '@media (min-width: 640px)': {
      flexDirection: 'row',
      gap: '16px',
    },
  });

  const inputContainerStyles = css({
    position: 'relative',
    flex: '1',
  });

  const inputStyles = css({
    width: '100%',
    paddingX: '16px',
    paddingY: '12px',
    borderRadius: '12px',
    backgroundColor: theme() === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
    border: `1px solid ${theme() === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'}`,
    color: theme() === 'dark' ? '#ffffff' : '#111827',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    '&:focus': {
      borderColor: theme() === 'dark' ? '#6366f1' : '#4f46e5',
      backgroundColor: theme() === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
      boxShadow: `0 0 0 3px ${theme() === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)'}`,
    },
    '&::placeholder': {
      color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
    },
  });

  const submitButtonStyles = css({
    flexShrink: '0',
    borderRadius: '12px',
    paddingX: '24px',
    paddingY: '12px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: theme() === 'dark' ? '#6366f1' : '#4f46e5',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme() === 'dark' ? '#5b21b6' : '#4338ca',
    },
    '&:disabled': {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
  });

  const errorStyles = css({
    marginTop: '8px',
    fontSize: '14px',
    color: theme() === 'dark' ? '#f87171' : '#dc2626',
  });

  const successStyles = css({
    marginTop: '16px',
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: theme() === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
    border: `1px solid ${theme() === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
    color: theme() === 'dark' ? '#4ade80' : '#16a34a',
    fontSize: '14px',
    textAlign: 'center',
  });

  const privacyPolicyStyles = css({
    marginTop: '16px',
    fontSize: '14px',
    lineHeight: '20px',
    color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
  });

  const privacyLinkStyles = css({
    color: theme() === 'dark' ? '#a5b4fc' : '#4f46e5',
    textDecoration: 'underline',
    '&:hover': {
      color: theme() === 'dark' ? '#c7d2fe' : '#6366f1',
    },
  });

  const featuresGridStyles = css({
    marginTop: '64px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '32px',
    },
  });

  const featureStyles = css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px',
  });

  const featureIconStyles = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: theme() === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb',
    border: `1px solid ${theme() === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'}`,
    color: theme() === 'dark' ? '#a5b4fc' : '#4f46e5',
  });

  const featureTitleStyles = css({
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '600',
    color: theme() === 'dark' ? '#ffffff' : '#111827',
  });

  const featureDescriptionStyles = css({
    fontSize: '14px',
    lineHeight: '20px',
    color: theme() === 'dark' ? '#9ca3af' : '#6b7280',
  });

  const cardContainerStyles = css({
    position: 'relative',
    maxWidth: '640px',
    marginX: 'auto',
    borderRadius: '24px',
    backgroundColor: theme() === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
    border: `1px solid ${theme() === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'}`,
    padding: '48px',
    boxShadow:
      theme() === 'dark'
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
    '@media (min-width: 640px)': {
      padding: '64px',
    },
  });

  const renderSimpleVariant = () => (
    <div class={sectionStyles}>
      <div class={innerContainerStyles}>
        <div class={headerStyles}>
          <Show when={props.badge}>
            <BlurFade delay={0.1} inView>
              <div class={badgeStyles}>{props.badge}</div>
            </BlurFade>
          </Show>

          <TextAnimate class={titleStyles} animation="slideUp" delay={0.2}>
            {props.title || 'Want product news and updates? Sign up for our newsletter.'}
          </TextAnimate>
        </div>

        <BlurFade delay={0.3} inView>
          <div class={formContainerStyles}>
            <form class={formStyles} onSubmit={handleSubmit}>
              <div class={inputContainerStyles}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email()}
                  onInput={(e) => setEmail(e.target.value)}
                  onFocus={() => newsletterSection.setFocusedField('email')}
                  onBlur={() => newsletterSection.setFocusedField(null)}
                  class={inputStyles}
                  required
                />
                <Show when={newsletterSection.getValidationErrors().email}>
                  <div class={errorStyles}>{newsletterSection.getValidationErrors().email}</div>
                </Show>
              </div>

              <Show
                when={newsletterSection.getFormState() === 'submitting'}
                fallback={
                  <button
                    type="submit"
                    disabled={!newsletterSection.canSubmit()}
                    class={submitButtonStyles}
                  >
                    Subscribe
                  </button>
                }
              >
                <ShimmerButton class={css({ flexShrink: '0' })} disabled={true}>
                  Subscribing...
                </ShimmerButton>
              </Show>
            </form>

            <Show when={newsletterSection.getFormState() === 'success'}>
              <div class={successStyles}>{newsletterSection.getSubmitMessage()}</div>
            </Show>

            <Show when={showPrivacyPolicy()}>
              <p class={privacyPolicyStyles}>
                We care about your data. Read our{' '}
                <a href={props.privacyPolicyUrl || '#'} class={privacyLinkStyles}>
                  privacy policy
                </a>
                .
              </p>
            </Show>
          </div>
        </BlurFade>
      </div>
    </div>
  );

  const renderCenteredVariant = () => (
    <div class={sectionStyles}>
      <div class={innerContainerStyles}>
        <div class={headerStyles}>
          <Show when={props.badge}>
            <BlurFade delay={0.1} inView>
              <div class={badgeStyles}>{props.badge}</div>
            </BlurFade>
          </Show>

          <TextAnimate class={titleStyles} animation="slideUp" delay={0.2}>
            {props.title || "Get notified when we're launching"}
          </TextAnimate>

          <Show when={props.subtitle}>
            <BlurFade delay={0.3} inView>
              <p class={subtitleStyles}>{props.subtitle}</p>
            </BlurFade>
          </Show>
        </div>

        <BlurFade delay={0.4} inView>
          <div class={formContainerStyles}>
            <form class={formStyles} onSubmit={handleSubmit}>
              <div class={inputContainerStyles}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email()}
                  onInput={(e) => setEmail(e.target.value)}
                  onFocus={() => newsletterSection.setFocusedField('email')}
                  onBlur={() => newsletterSection.setFocusedField(null)}
                  class={inputStyles}
                  required
                />
                <Show when={newsletterSection.isFieldFocused('email')}>
                  <BorderBeam
                    size={60}
                    duration={12}
                    colorFrom={theme() === 'dark' ? '#6366f1' : '#4f46e5'}
                    colorTo={theme() === 'dark' ? '#8b5cf6' : '#7c3aed'}
                  />
                </Show>
              </div>

              <ShimmerButton
                class={css({ flexShrink: '0' })}
                disabled={!newsletterSection.canSubmit()}
                onClick={handleSubmit}
              >
                {newsletterSection.getFormState() === 'submitting' ? 'Notifying...' : 'Notify me'}
              </ShimmerButton>
            </form>

            <Show when={newsletterSection.getFormState() === 'success'}>
              <div class={successStyles}>{newsletterSection.getSubmitMessage()}</div>
            </Show>
          </div>
        </BlurFade>
      </div>
    </div>
  );

  const renderSplitVariant = () => (
    <div class={sectionStyles}>
      <div class={innerContainerStyles}>
        <div class={splitLayoutStyles}>
          <div class={splitContentStyles}>
            <Show when={props.badge}>
              <BlurFade delay={0.1} inView>
                <div class={badgeStyles}>{props.badge}</div>
              </BlurFade>
            </Show>

            <TextAnimate class={titleStyles} animation="slideUp" delay={0.2}>
              {props.title || 'Want our product updates? Sign up for our newsletter.'}
            </TextAnimate>

            <Show when={props.subtitle}>
              <BlurFade delay={0.3} inView>
                <p class={subtitleStyles}>{props.subtitle}</p>
              </BlurFade>
            </Show>

            <Show when={showFeatures() && props.features}>
              <div class={featuresGridStyles}>
                <For each={props.features}>
                  {(feature, index) => (
                    <BlurFade delay={0.5 + index() * 0.1} inView>
                      <div class={featureStyles}>
                        <div class={featureIconStyles}>
                          <feature.icon class={css({ width: '24px', height: '24px' })} />
                        </div>
                        <div>
                          <div class={featureTitleStyles}>{feature.title}</div>
                          <div class={featureDescriptionStyles}>{feature.description}</div>
                        </div>
                      </div>
                    </BlurFade>
                  )}
                </For>
              </div>
            </Show>
          </div>

          <BlurFade delay={0.4} inView>
            <div class={splitFormStyles}>
              <form class={formStyles} onSubmit={handleSubmit}>
                <div class={inputContainerStyles}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email()}
                    onInput={(e) => setEmail(e.target.value)}
                    class={inputStyles}
                    required
                  />
                </div>

                <ShimmerButton
                  class={css({ flexShrink: '0' })}
                  disabled={!newsletterSection.canSubmit()}
                  onClick={handleSubmit}
                >
                  {newsletterSection.getFormState() === 'submitting'
                    ? 'Subscribing...'
                    : 'Subscribe'}
                </ShimmerButton>
              </form>

              <Show when={showPrivacyPolicy()}>
                <p class={privacyPolicyStyles}>
                  We care about your data. Read our{' '}
                  <a href={props.privacyPolicyUrl || '#'} class={privacyLinkStyles}>
                    privacy policy
                  </a>
                  .
                </p>
              </Show>
            </div>
          </BlurFade>
        </div>
      </div>
    </div>
  );

  const renderCardVariant = () => (
    <div class={sectionStyles}>
      <div class={innerContainerStyles}>
        <BlurFade delay={0.1} inView>
          <div class={cardContainerStyles}>
            <BorderBeam
              size={120}
              duration={15}
              colorFrom={theme() === 'dark' ? '#6366f1' : '#4f46e5'}
              colorTo={theme() === 'dark' ? '#8b5cf6' : '#7c3aed'}
            />

            <div class={css({ textAlign: 'center' })}>
              <Show when={props.badge}>
                <div class={badgeStyles}>{props.badge}</div>
              </Show>

              <TextAnimate class={titleStyles} animation="slideUp" delay={0.2}>
                {props.title || 'Sign up for our newsletter'}
              </TextAnimate>

              <Show when={props.subtitle}>
                <p class={subtitleStyles}>{props.subtitle}</p>
              </Show>
            </div>

            <form class={css({ marginTop: '32px' })} onSubmit={handleSubmit}>
              <div class={formStyles}>
                <div class={inputContainerStyles}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email()}
                    onInput={(e) => setEmail(e.target.value)}
                    class={inputStyles}
                    required
                  />
                </div>

                <ShimmerButton
                  class={css({ flexShrink: '0' })}
                  disabled={!newsletterSection.canSubmit()}
                  onClick={handleSubmit}
                >
                  {newsletterSection.getFormState() === 'submitting'
                    ? 'Subscribing...'
                    : 'Subscribe'}
                </ShimmerButton>
              </div>
            </form>

            <Show when={showPrivacyPolicy()}>
              <p class={css({ ...privacyPolicyStyles, textAlign: 'center' })}>
                We care about the protection of your data. Read our{' '}
                <a href={props.privacyPolicyUrl || '#'} class={privacyLinkStyles}>
                  Privacy Policy
                </a>
                .
              </p>
            </Show>
          </div>
        </BlurFade>
      </div>
    </div>
  );

  return (
    <div class={`${containerStyles} ${props.className || ''}`}>
      <Show when={props.backgroundImage}>
        <img alt="" src={props.backgroundImage} class={backgroundImageStyles} />
      </Show>

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

      <Show when={backgroundPattern() === 'gradient'}>
        <div class={gradientOverlayStyles} />
      </Show>

      <Show when={variant() === 'simple'}>{renderSimpleVariant()}</Show>

      <Show when={variant() === 'centered'}>{renderCenteredVariant()}</Show>

      <Show when={variant() === 'split'}>{renderSplitVariant()}</Show>

      <Show when={variant() === 'card'}>{renderCardVariant()}</Show>
    </div>
  );
};
