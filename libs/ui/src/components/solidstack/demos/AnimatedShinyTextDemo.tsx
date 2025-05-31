import { Component } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';
import { AnimatedShinyText } from '../../mystic/text-effects/AnimatedShinyText';

export const AnimatedShinyTextDemo: Component = () => {
  return (
    <div class={css({
      zIndex: 10,
      display: 'flex',
      minHeight: '64',
      alignItems: 'center',
      justifyContent: 'center'
    })}>
      <div
        class={css({
          borderRadius: 'full',
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.05)',
          backgroundColor: 'neutral.100',
          fontSize: 'base',
          color: 'white',
          transition: 'all 0.2s ease-in',
          cursor: 'pointer',
          _hover: {
            backgroundColor: 'neutral.200'
          },
          _dark: {
            borderColor: 'rgba(255, 255, 255, 0.05)',
            backgroundColor: 'neutral.900',
            _hover: {
              backgroundColor: 'neutral.800'
            }
          }
        })}
      >
        <AnimatedShinyText
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingX: '4',
            paddingY: '1',
            transition: 'all 0.2s ease-out',
            _hover: {
              color: 'neutral.600',
              transitionDuration: '300ms',
              _dark: {
                color: 'neutral.400'
              }
            }
          })}
          shimmerColor="#ffffff"
          animationSpeed={3}
        >
          <span>✨ Introducing SolidStack UI</span>
          <svg
            class={css({
              marginLeft: '1',
              width: '3',
              height: '3',
              transition: 'transform 0.3s ease-in-out',
              _groupHover: {
                transform: 'translateX(0.125rem)'
              }
            })}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </AnimatedShinyText>
      </div>
    </div>
  );
};

export default AnimatedShinyTextDemo;