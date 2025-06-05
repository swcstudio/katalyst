import { Component, For } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';
import {
  TextAnimateDemo,
  TextAnimateDemo2,
  TextAnimateDemo3,
  TextAnimateDemo4,
  TextAnimateDemo5,
  TextAnimateDemo6,
  TextAnimateDemo7,
  TextAnimateDemo8,
  TextAnimateDemo9,
  LineShadowTextDemo,
  AuroraTextDemo,
  VideoTextDemo,
  NumberTickerDemo,
  NumberTickerDecimalDemo,
  NumberTickerStartValueDemo,
  AnimatedShinyTextDemo,
  AnimatedGradientTextDemo,
  AnimatedGradientTextFastDemo,
  TextRevealDemo,
  HyperTextDemo,
  HyperTextFastDemo,
  HyperTextSlowDemo,
  WordRotateDemo,
  TypingAnimationDemo,
  FlipTextDemo,
  ScrollBasedVelocityDemo,
  BoxRevealDemo,
  SparklesTextDemo,
  MorphingTextDemo,
  SpinningTextBasic,
  SpinningTextReverse,
} from './index';

export const TextAnimationShowcase: Component = () => {
  return (
    <div class={css({
      padding: '40px',
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '80px',
    })}>
      {/* Header */}
      <div class={css({ textAlign: 'center' })}>
        <h1 class={css({
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
        })}>
          Text Animation Components
        </h1>
        <p class={css({
          fontSize: '18px',
          color: 'muted.foreground',
          maxWidth: '600px',
          margin: '0 auto',
        })}>
          Explore our comprehensive collection of text animation components for SolidStack-UI
        </p>
      </div>

      {/* TextAnimate Section */}
      <section class={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      })}>
        <h2 class={css({
          fontSize: '28px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '16px',
        })}>
          TextAnimate Component
        </h2>
        
        <div class={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
        })}>
          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Blur In by Character</h3>
            <div class={css({ ...demoContentStyles })}>
              <TextAnimateDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Blur In Text</h3>
            <div class={css({ ...demoContentStyles })}>
              <TextAnimateDemo2 />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Slide Up by Word</h3>
            <div class={css({ ...demoContentStyles })}>
              <TextAnimateDemo3 />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Scale Up by Text</h3>
            <div class={css({ ...demoContentStyles })}>
              <TextAnimateDemo4 />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Fade In by Line</h3>
            <div class={css({ ...demoContentStyles })}>
              <TextAnimateDemo5 />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Slide Left by Character</h3>
            <div class={css({ ...demoContentStyles })}>
              <TextAnimateDemo6 />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>With Delay</h3>
            <div class={css({ ...demoContentStyles })}>
              <TextAnimateDemo7 />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Custom Duration</h3>
            <div class={css({ ...demoContentStyles })}>
              <TextAnimateDemo8 />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Wavy Motion</h3>
            <div class={css({ ...demoContentStyles })}>
              <TextAnimateDemo9 />
            </div>
          </div>
        </div>
      </section>

      {/* Special Effects Section */}
      <section class={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      })}>
        <h2 class={css({
          fontSize: '28px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '16px',
        })}>
          Special Text Effects
        </h2>
        
        <div class={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
        })}>
          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Line Shadow Text</h3>
            <div class={css({ ...demoContentStyles })}>
              <LineShadowTextDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Aurora Text</h3>
            <div class={css({ ...demoContentStyles })}>
              <AuroraTextDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles, height: '280px' })}>
            <h3 class={css({ ...demoTitleStyles })}>Video Text</h3>
            <div class={css({ ...demoContentStyles })}>
              <VideoTextDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Sparkles Text</h3>
            <div class={css({ ...demoContentStyles })}>
              <SparklesTextDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Text Section */}
      <section class={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      })}>
        <h2 class={css({
          fontSize: '28px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '16px',
        })}>
          Interactive Text Components
        </h2>
        
        <div class={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
        })}>
          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Hyper Text (Hover)</h3>
            <div class={css({ ...demoContentStyles })}>
              <HyperTextDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Hyper Text Fast</h3>
            <div class={css({ ...demoContentStyles })}>
              <HyperTextFastDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Hyper Text Slow</h3>
            <div class={css({ ...demoContentStyles })}>
              <HyperTextSlowDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Flip Text</h3>
            <div class={css({ ...demoContentStyles })}>
              <FlipTextDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Animated Content Section */}
      <section class={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      })}>
        <h2 class={css({
          fontSize: '28px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '16px',
        })}>
          Animated Content
        </h2>
        
        <div class={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
        })}>
          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Word Rotate</h3>
            <div class={css({ ...demoContentStyles })}>
              <WordRotateDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Typing Animation</h3>
            <div class={css({ ...demoContentStyles })}>
              <TypingAnimationDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Morphing Text</h3>
            <div class={css({ ...demoContentStyles })}>
              <MorphingTextDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Text Reveal</h3>
            <div class={css({ ...demoContentStyles })}>
              <TextRevealDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Number and Gradient Effects */}
      <section class={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      })}>
        <h2 class={css({
          fontSize: '28px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '16px',
        })}>
          Numbers and Gradients
        </h2>
        
        <div class={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
        })}>
          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Number Ticker</h3>
            <div class={css({ ...demoContentStyles })}>
              <NumberTickerDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Number Ticker Decimal</h3>
            <div class={css({ ...demoContentStyles })}>
              <NumberTickerDecimalDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Number Ticker Start Value</h3>
            <div class={css({ ...demoContentStyles })}>
              <NumberTickerStartValueDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Animated Gradient Text</h3>
            <div class={css({ ...demoContentStyles })}>
              <AnimatedGradientTextDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Fast Gradient</h3>
            <div class={css({ ...demoContentStyles })}>
              <AnimatedGradientTextFastDemo />
            </div>
          </div>

          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Animated Shiny Text</h3>
            <div class={css({ ...demoContentStyles })}>
              <AnimatedShinyTextDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Motion Effects Section */}
      <section class={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      })}>
        <h2 class={css({
          fontSize: '28px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '16px',
        })}>
          Motion Effects
        </h2>
        
        <div class={css({
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px',
        })}>
          <div class={css({ ...demoCardStyles })}>
            <h3 class={css({ ...demoTitleStyles })}>Velocity Scroll</h3>
            <div class={css({ ...demoContentStyles })}>
              <ScrollBasedVelocityDemo />
            </div>
          </div>

          <div class={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
          })}>
            <div class={css({ ...demoCardStyles })}>
              <h3 class={css({ ...demoTitleStyles })}>Spinning Text Basic</h3>
              <div class={css({ ...demoContentStyles })}>
                <SpinningTextBasic />
              </div>
            </div>

            <div class={css({ ...demoCardStyles })}>
              <h3 class={css({ ...demoTitleStyles })}>Spinning Text Reverse</h3>
              <div class={css({ ...demoContentStyles })}>
                <SpinningTextReverse />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Box Reveal Section */}
      <section class={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      })}>
        <h2 class={css({
          fontSize: '28px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '16px',
        })}>
          Reveal Animations
        </h2>
        
        <div class={css({
          display: 'flex',
          justifyContent: 'center',
        })}>
          <div class={css({ 
            ...demoCardStyles,
            maxWidth: '600px',
            width: '100%',
          })}>
            <h3 class={css({ ...demoTitleStyles })}>Box Reveal</h3>
            <div class={css({ ...demoContentStyles })}>
              <BoxRevealDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer class={css({
        textAlign: 'center',
        padding: '40px 0',
        borderTop: '1px solid',
        borderColor: 'border',
        marginTop: '40px',
      })}>
        <p class={css({
          fontSize: '16px',
          color: 'muted.foreground',
        })}>
          Built with SolidStack-UI • Text Animation Components
        </p>
        <p class={css({
          fontSize: '14px',
          color: 'muted.foreground',
          marginTop: '8px',
        })}>
          Converted from React to SolidJS with love ❤️
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
  minHeight: '200px',
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
  marginBottom: '8px',
  color: 'foreground',
  borderBottom: '1px solid',
  borderColor: 'border',
  paddingBottom: '8px',
};

const demoContentStyles = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center' as const,
  minHeight: '100px',
};

export default TextAnimationShowcase;