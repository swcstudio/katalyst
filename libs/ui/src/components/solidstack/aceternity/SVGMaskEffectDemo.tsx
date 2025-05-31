import { Component } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

// Placeholder MaskContainer component - this would need to be implemented separately
const MaskContainer: Component<{
  revealText: any;
  className?: string;
  children: any;
}> = (props) => {
  return (
    <div class={css({
      position: 'relative',
      overflow: 'hidden',
      width: 'full',
      height: 'full',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(45deg, #1f2937, #374151)',
    }, props.className)}>
      {/* Background text (masked) */}
      <div class={css({
        position: 'absolute',
        inset: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2xl',
        fontWeight: 'medium',
        color: 'gray.400',
        padding: '8',
        textAlign: 'center',
        zIndex: '1',
        filter: 'blur(0.5px)',
        opacity: 0.7,
      })}>
        {props.children}
      </div>
      
      {/* Reveal text */}
      <div class={css({
        position: 'relative',
        zIndex: '10',
        padding: '8',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 'lg',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
        animation: 'maskReveal 2s ease-in-out infinite alternate',
      })}>
        {props.revealText}
      </div>
      
      <style>{`
        @keyframes maskReveal {
          0% {
            mask-size: 100% 100%;
            -webkit-mask-size: 100% 100%;
          }
          100% {
            mask-size: 200% 200%;
            -webkit-mask-size: 200% 200%;
          }
        }
      `}</style>
    </div>
  );
};

export const SVGMaskEffectDemo: Component = () => {
  return (
    <div class={css({
      display: 'flex',
      height: '40rem',
      width: 'full',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    })}>
      <MaskContainer
        revealText={
          <p class={css({
            marginX: 'auto',
            maxWidth: '4xl',
            textAlign: 'center',
            fontSize: '4xl',
            fontWeight: 'bold',
            color: 'slate.800',
            _dark: { color: 'white' },
          })}>
            The first rule of MRR Club is you do not talk about MRR Club. The
            second rule of MRR Club is you DO NOT talk about MRR Club.
          </p>
        }
        className={css({
          height: '40rem',
          borderRadius: 'md',
          border: '1px solid',
          borderColor: 'gray.300',
          color: 'white',
          _dark: { 
            color: 'black',
            borderColor: 'gray.600',
          },
        })}
      >
        Discover the power of{" "}
        <span class={css({ color: 'blue.500' })}>Tailwind CSS v4</span> with native CSS
        variables and container queries with{" "}
        <span class={css({ color: 'blue.500' })}>advanced animations</span>.
      </MaskContainer>
    </div>
  );
};

export default SVGMaskEffectDemo;