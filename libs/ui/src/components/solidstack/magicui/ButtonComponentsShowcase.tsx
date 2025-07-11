import { css } from '@sse/ui/styled-system/css';
import type { Component } from 'solid-js';
import {
  AnimatedSubscribeButtonDemo,
  InteractiveHoverButtonDemo,
  PulsatingButtonDemo,
  RainbowButtonDemo,
  RainbowButtonOutlineDemo,
  RippleButtonDemo,
  ShimmerButtonDemo,
  ShinyButtonDemo,
} from './index';

export const ButtonComponentsShowcase: Component = () => {
  return (
    <div
      class={css({
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '60px',
      })}
    >
      {/* Header */}
      <div class={css({ textAlign: 'center' })}>
        <h1
          class={css({
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
          })}
        >
          Interactive Button Components
        </h1>
        <p
          class={css({
            fontSize: '18px',
            color: 'muted.foreground',
            maxWidth: '600px',
            margin: '0 auto',
          })}
        >
          Explore our collection of beautiful and interactive button components for SolidStack-UI
        </p>
      </div>

      {/* Gradient & Rainbow Effects */}
      <section
        class={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        })}
      >
        <h2
          class={css({
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '16px',
          })}
        >
          Gradient & Rainbow Effects
        </h2>

        <div
          class={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px',
          })}
        >
          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Rainbow Button</h3>
            <p class={css({ ...demoDescriptionStyles })}>
              Animated rainbow gradient background with smooth color transitions
            </p>
            <div class={css({ ...demoContentStyles })}>
              <RainbowButtonDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Rainbow Button Outline</h3>
            <p class={css({ ...demoDescriptionStyles })}>
              Rainbow gradient border with transparent background
            </p>
            <div class={css({ ...demoContentStyles })}>
              <RainbowButtonOutlineDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Shimmer Button</h3>
            <p class={css({ ...demoDescriptionStyles })}>
              Elegant shimmer effect that sweeps across the button
            </p>
            <div class={css({ ...demoContentStyles })}>
              <ShimmerButtonDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Shiny Button</h3>
            <p class={css({ ...demoDescriptionStyles })}>
              Diagonal shine effect that creates a polished appearance
            </p>
            <div class={css({ ...demoContentStyles })}>
              <ShinyButtonDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Effects */}
      <section
        class={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        })}
      >
        <h2
          class={css({
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '16px',
          })}
        >
          Interactive Effects
        </h2>

        <div
          class={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px',
          })}
        >
          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Interactive Hover Button</h3>
            <p class={css({ ...demoDescriptionStyles })}>
              Mouse-following gradient effect that responds to cursor position
            </p>
            <div class={css({ ...demoContentStyles })}>
              <InteractiveHoverButtonDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Animated Subscribe Button</h3>
            <p class={css({ ...demoDescriptionStyles })}>
              State-changing button with smooth transition between states
            </p>
            <div class={css({ ...demoContentStyles })}>
              <AnimatedSubscribeButtonDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Ripple Button</h3>
            <p class={css({ ...demoDescriptionStyles })}>
              Material Design inspired ripple effect on click
            </p>
            <div class={css({ ...demoContentStyles })}>
              <RippleButtonDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Pulsating Button</h3>
            <p class={css({ ...demoDescriptionStyles })}>
              Continuous pulsing animation to draw attention
            </p>
            <div class={css({ ...demoContentStyles })}>
              <PulsatingButtonDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples Section */}
      <section
        class={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        })}
      >
        <h2
          class={css({
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '16px',
          })}
        >
          Usage Examples
        </h2>

        <div
          class={css({
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '24px',
          })}
        >
          <div
            class={css({
              padding: '24px',
              border: '1px solid',
              borderColor: 'border',
              borderRadius: '12px',
              backgroundColor: 'muted',
            })}
          >
            <h3
              class={css({
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: 'foreground',
              })}
            >
              Button Component Features
            </h3>
            <div
              class={css({
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                fontSize: '14px',
                color: 'muted.foreground',
              })}
            >
              <div>
                <h4 class={css({ fontWeight: '600', marginBottom: '8px', color: 'foreground' })}>
                  🎨 Visual Effects
                </h4>
                <ul class={css({ listStyle: 'disc', paddingLeft: '20px', lineHeight: 1.6 })}>
                  <li>Rainbow gradients</li>
                  <li>Shimmer animations</li>
                  <li>Shine effects</li>
                  <li>Pulsing animations</li>
                </ul>
              </div>
              <div>
                <h4 class={css({ fontWeight: '600', marginBottom: '8px', color: 'foreground' })}>
                  🖱️ Interactions
                </h4>
                <ul class={css({ listStyle: 'disc', paddingLeft: '20px', lineHeight: 1.6 })}>
                  <li>Mouse-following effects</li>
                  <li>Click ripples</li>
                  <li>State transitions</li>
                  <li>Hover animations</li>
                </ul>
              </div>
              <div>
                <h4 class={css({ fontWeight: '600', marginBottom: '8px', color: 'foreground' })}>
                  ⚙️ Customization
                </h4>
                <ul class={css({ listStyle: 'disc', paddingLeft: '20px', lineHeight: 1.6 })}>
                  <li>Custom colors</li>
                  <li>Animation timing</li>
                  <li>Size variants</li>
                  <li>Disabled states</li>
                </ul>
              </div>
              <div>
                <h4 class={css({ fontWeight: '600', marginBottom: '8px', color: 'foreground' })}>
                  ♿ Accessibility
                </h4>
                <ul class={css({ listStyle: 'disc', paddingLeft: '20px', lineHeight: 1.6 })}>
                  <li>Keyboard navigation</li>
                  <li>Focus indicators</li>
                  <li>Screen reader support</li>
                  <li>Motion preferences</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section
        class={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        })}
      >
        <h2
          class={css({
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '16px',
          })}
        >
          Quick Start
        </h2>

        <div
          class={css({
            padding: '24px',
            backgroundColor: 'muted',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'border',
          })}
        >
          <h3
            class={css({
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: 'foreground',
            })}
          >
            Import and Use
          </h3>
          <div
            class={css({
              backgroundColor: 'background',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'border',
              fontFamily: 'monospace',
              fontSize: '14px',
              overflow: 'auto',
            })}
          >
            <pre class={css({ margin: 0, color: 'foreground' })}>
              {`import { 
  RainbowButton,
  ShimmerButton,
  RippleButton 
} from '@sse/ui/components/solidstack/magicui';

// Basic usage
<RainbowButton>Get Started</RainbowButton>

// With custom props
<RippleButton 
  rippleColor="#ff6b6b" 
  onClick={() => console.log('Clicked!')}
>
  Click Me
</RippleButton>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        class={css({
          textAlign: 'center',
          padding: '40px 0',
          borderTop: '1px solid',
          borderColor: 'border',
          marginTop: '40px',
        })}
      >
        <p
          class={css({
            fontSize: '16px',
            color: 'muted.foreground',
          })}
        >
          Built with SolidStack-UI • Interactive Button Components
        </p>
        <p
          class={css({
            fontSize: '14px',
            color: 'muted.foreground',
            marginTop: '8px',
          })}
        >
          Perfect for modern web applications ✨
        </p>
      </footer>
    </div>
  );
};

// Shared styles
const demoCardStyles = {
  padding: '24px',
  border: '1px solid',
  borderColor: 'border',
  borderRadius: '12px',
  backgroundColor: 'background',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '16px',
  minHeight: '280px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    borderColor: 'primary',
  },
};

const demoTitleStyles = {
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '0',
  color: 'foreground',
};

const demoDescriptionStyles = {
  fontSize: '14px',
  color: 'muted.foreground',
  lineHeight: 1.5,
  marginBottom: '8px',
};

const demoContentStyles = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center' as const,
  minHeight: '120px',
  borderTop: '1px solid',
  borderColor: 'border',
  paddingTop: '16px',
  marginTop: '8px',
};

export default ButtonComponentsShowcase;
