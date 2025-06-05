import { Component, For } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

// Icon Components
const TerminalIcon: Component = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
    <path d="M7 10l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13 18h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
);

const EaseIcon: Component = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12h18m-9-9v18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
  </svg>
);

const CurrencyIcon: Component = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" stroke-width="2"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2"/>
  </svg>
);

const CloudIcon: Component = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="currentColor" stroke-width="2"/>
  </svg>
);

const RouteIcon: Component = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="19" r="3" stroke="currentColor" stroke-width="2"/>
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" stroke="currentColor" stroke-width="2"/>
    <circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2"/>
  </svg>
);

const HelpIcon: Component = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2"/>
    <path d="M12 17h.01" stroke="currentColor" stroke-width="2"/>
  </svg>
);

const AdjustmentIcon: Component = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
    <path d="M12 1v6m0 6v6" stroke="currentColor" stroke-width="2"/>
    <path d="M21 12h-6m-6 0H3" stroke="currentColor" stroke-width="2"/>
  </svg>
);

const HeartIcon: Component = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2"/>
  </svg>
);

const Feature: Component<{
  title: string;
  description: string;
  icon: any;
  index: number;
}> = (props) => {
  return (
    <div class={css({
      display: 'flex',
      flexDirection: 'column',
      paddingY: '10',
      position: 'relative',
      borderColor: 'neutral.800',
      _dark: {
        borderColor: 'neutral.800',
      },
      lg: {
        borderRight: '1px solid',
        borderColor: 'neutral.800',
        _dark: {
          borderColor: 'neutral.800',
        },
      },
      ...(props.index === 0 || props.index === 4 ? {
        lg: {
          borderLeft: '1px solid',
          borderColor: 'neutral.800',
          _dark: {
            borderColor: 'neutral.800',
          },
        },
      } : {}),
      ...(props.index < 4 ? {
        lg: {
          borderBottom: '1px solid',
          borderColor: 'neutral.800',
          _dark: {
            borderColor: 'neutral.800',
          },
        },
      } : {}),
      _groupHover: {},
    })}>
      {props.index < 4 && (
        <div class={css({
          opacity: '0',
          transition: 'all 0.2s',
          position: 'absolute',
          inset: '0',
          height: 'full',
          width: 'full',
          background: 'linear-gradient(to top, neutral.100, transparent)',
          pointerEvents: 'none',
          _dark: {
            background: 'linear-gradient(to top, neutral.800, transparent)',
          },
          _groupHover: {
            opacity: '100',
          },
        })} />
      )}
      {props.index >= 4 && (
        <div class={css({
          opacity: '0',
          transition: 'all 0.2s',
          position: 'absolute',
          inset: '0',
          height: 'full',
          width: 'full',
          background: 'linear-gradient(to bottom, neutral.100, transparent)',
          pointerEvents: 'none',
          _dark: {
            background: 'linear-gradient(to bottom, neutral.800, transparent)',
          },
          _groupHover: {
            opacity: '100',
          },
        })} />
      )}
      <div class={css({
        marginBottom: '4',
        position: 'relative',
        zIndex: '10',
        paddingX: '10',
        color: 'neutral.600',
        _dark: {
          color: 'neutral.400',
        },
      })}>
        {props.icon}
      </div>
      <div class={css({
        fontSize: 'lg',
        fontWeight: 'bold',
        marginBottom: '2',
        position: 'relative',
        zIndex: '10',
        paddingX: '10',
      })}>
        <div class={css({
          position: 'absolute',
          left: '0',
          insetY: '0',
          height: '6',
          width: '1',
          borderRadius: 'tr-full br-full',
          backgroundColor: 'neutral.300',
          transition: 'all 0.2s',
          transformOrigin: 'center',
          _dark: {
            backgroundColor: 'neutral.700',
          },
          _groupHover: {
            height: '8',
            backgroundColor: 'blue.500',
          },
        })} />
        <span class={css({
          transition: 'all 0.2s',
          display: 'inline-block',
          color: 'neutral.800',
          _dark: {
            color: 'neutral.100',
          },
          _groupHover: {
            transform: 'translateX(2px)',
          },
        })}>
          {props.title}
        </span>
      </div>
      <p class={css({
        fontSize: 'sm',
        color: 'neutral.600',
        maxWidth: 'xs',
        position: 'relative',
        zIndex: '10',
        paddingX: '10',
        _dark: {
          color: 'neutral.300',
        },
      })}>
        {props.description}
      </p>
    </div>
  );
};

export const IconFeaturesSectionDemo: Component = () => {
  const features = [
    {
      title: "Built for developers",
      description:
        "Built for engineers, developers, dreamers, thinkers and doers.",
      icon: <TerminalIcon />,
    },
    {
      title: "Ease of use",
      description:
        "It's as easy as using an Apple, and as expensive as buying one.",
      icon: <EaseIcon />,
    },
    {
      title: "Pricing like no other",
      description:
        "Our prices are best in the market. No cap, no lock, no credit card required.",
      icon: <CurrencyIcon />,
    },
    {
      title: "100% Uptime guarantee",
      description: "We just cannot be taken down by anyone.",
      icon: <CloudIcon />,
    },
    {
      title: "Multi-tenant Architecture",
      description: "You can simply share passwords instead of buying new seats",
      icon: <RouteIcon />,
    },
    {
      title: "24/7 Customer Support",
      description:
        "We are available a 100% of the time. Atleast our AI Agents are.",
      icon: <HelpIcon />,
    },
    {
      title: "Money back guarantee",
      description:
        "If you donot like EveryAI, we will convince you to like us.",
      icon: <AdjustmentIcon />,
    },
    {
      title: "And everything else",
      description: "I just ran out of copy ideas. Accept my sincere apologies",
      icon: <HeartIcon />,
    },
  ];

  return (
    <div class={css({
      display: 'grid',
      gridTemplateColumns: '1',
      position: 'relative',
      zIndex: '10',
      paddingY: '10',
      maxWidth: '7xl',
      marginX: 'auto',
      md: {
        gridTemplateColumns: '2',
      },
      lg: {
        gridTemplateColumns: '4',
      },
    })}>
      <For each={features}>
        {(feature, index) => (
          <Feature {...feature} index={index()} />
        )}
      </For>
    </div>
  );
};

export default IconFeaturesSectionDemo;