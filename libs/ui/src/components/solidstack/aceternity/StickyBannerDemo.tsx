import { Component } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

// Placeholder StickyBanner component - this would need to be implemented separately
const StickyBanner: Component<{
  className?: string;
  children: any;
}> = (props) => {
  return (
    <div class={css({
      position: 'sticky',
      top: '0',
      zIndex: '50',
      width: 'full',
      padding: '4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }, props.className)}>
      {props.children}
    </div>
  );
};

const DummyContent: Component = () => {
  return (
    <div class={css({
      position: 'relative',
      marginX: 'auto',
      display: 'flex',
      width: 'full',
      maxWidth: '7xl',
      flexDirection: 'column',
      gap: '10',
      paddingY: '8',
    })}>
      <div class={css({
        height: '96',
        width: 'full',
        animation: 'pulse',
        borderRadius: 'lg',
        backgroundColor: 'neutral.100',
        _dark: {
          backgroundColor: 'neutral.800',
        },
      })} />
      <div class={css({
        height: '96',
        width: 'full',
        animation: 'pulse',
        borderRadius: 'lg',
        backgroundColor: 'neutral.100',
        _dark: {
          backgroundColor: 'neutral.800',
        },
      })} />
      <div class={css({
        height: '96',
        width: 'full',
        animation: 'pulse',
        borderRadius: 'lg',
        backgroundColor: 'neutral.100',
        _dark: {
          backgroundColor: 'neutral.800',
        },
      })} />
    </div>
  );
};

export const StickyBannerDemo: Component = () => {
  return (
    <div class={css({
      position: 'relative',
      display: 'flex',
      height: '60vh',
      width: 'full',
      flexDirection: 'column',
      overflowY: 'auto',
    })}>
      <StickyBanner className={css({
        background: 'linear-gradient(to bottom, rgb(59, 130, 246), rgb(37, 99, 235))', // from-blue-500 to-blue-600
      })}>
        <p class={css({
          marginX: '0',
          maxWidth: '90%',
          color: 'white',
          filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))',
        })}>
          Announcing $10M seed funding from project mayhem ventures.{" "}
          <a 
            href="#" 
            class={css({
              transition: 'all 0.2s',
              _hover: {
                textDecoration: 'underline',
              },
            })}
          >
            Read announcement
          </a>
        </p>
      </StickyBanner>
      <DummyContent />
    </div>
  );
};

export default StickyBannerDemo;