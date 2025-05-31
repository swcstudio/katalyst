import { Component, JSX, createSignal, For } from 'solid-js';
import { cx } from '@sse/ui/styled-system/css';
import { css } from '@sse/ui/styled-system/css';
import { createUniqueId } from 'solid-js';

export interface GridFeatureData {
  title: string;
  description: string;
}

export interface GridFeaturesSectionProps {
  features?: GridFeatureData[];
  className?: string;
}

export interface GridPatternProps {
  width?: number;
  height?: number;
  x?: string;
  y?: string;
  squares?: number[][];
  className?: string;
}

export interface GridProps {
  pattern?: number[][];
  size?: number;
}

export const GridFeaturesSectionDemo: Component = () => {
  return (
    <div class={css({ paddingY: '80px', lg: { paddingY: '160px' } })}>
      <div class={css({
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '40px',
        maxWidth: '1280px',
        marginX: 'auto',
        sm: { gridTemplateColumns: 'repeat(2, 1fr)' },
        md: { gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' },
        lg: { gridTemplateColumns: 'repeat(4, 1fr)' }
      })}>
        <For each={gridFeatures}>
          {(feature) => (
            <div class={css({
              position: 'relative',
              background: 'linear-gradient(to bottom, #f5f5f5, white)',
              padding: '24px',
              borderRadius: '24px',
              overflow: 'hidden',
              _dark: {
                background: 'linear-gradient(to bottom, #171717, #0a0a0a)'
              }
            })}>
              <Grid size={20} />
              <p class={css({
                fontSize: 'base',
                fontWeight: 'bold',
                color: 'neutral.800',
                position: 'relative',
                zIndex: 20,
                _dark: { color: 'white' }
              })}>
                {feature.title}
              </p>
              <p class={css({
                color: 'neutral.600',
                marginTop: '16px',
                fontSize: 'base',
                fontWeight: 'normal',
                position: 'relative',
                zIndex: 20,
                _dark: { color: 'neutral.400' }
              })}>
                {feature.description}
              </p>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export const IconFeaturesSection: Component = () => {
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
      icon: <DollarIcon />,
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
      icon: <AdjustmentsIcon />,
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
      gridTemplateColumns: '1fr',
      position: 'relative',
      zIndex: 10,
      paddingY: '40px',
      maxWidth: '1280px',
      marginX: 'auto',
      md: { gridTemplateColumns: 'repeat(2, 1fr)' },
      lg: { gridTemplateColumns: 'repeat(4, 1fr)' }
    })}>
      <For each={features}>
        {(feature, index) => (
          <Feature {...feature} index={index()} />
        )}
      </For>
    </div>
  );
};

const Feature: Component<{
  title: string;
  description: string;
  icon: JSX.Element;
  index: number;
}> = (props) => {
  return (
    <div
      class={cx(
        css({
          display: 'flex',
          flexDirection: 'column',
          paddingY: '40px',
          position: 'relative',
          group: true,
          lg: { borderRight: '1px solid' },
          _dark: { borderColor: 'neutral.800' }
        }),
        (props.index === 0 || props.index === 4) && css({
          lg: { borderLeft: '1px solid' },
          _dark: { borderColor: 'neutral.800' }
        }),
        props.index < 4 && css({
          lg: { borderBottom: '1px solid' },
          _dark: { borderColor: 'neutral.800' }
        })
      )}
    >
      {props.index < 4 && (
        <div class={css({
          opacity: 0,
          transition: 'opacity 0.2s',
          position: 'absolute',
          inset: 0,
          height: '100%',
          width: '100%',
          background: 'linear-gradient(to top, #f5f5f5, transparent)',
          pointerEvents: 'none',
          _groupHover: { opacity: 1 },
          _dark: {
            background: 'linear-gradient(to top, #262626, transparent)'
          }
        })} />
      )}
      {props.index >= 4 && (
        <div class={css({
          opacity: 0,
          transition: 'opacity 0.2s',
          position: 'absolute',
          inset: 0,
          height: '100%',
          width: '100%',
          background: 'linear-gradient(to bottom, #f5f5f5, transparent)',
          pointerEvents: 'none',
          _groupHover: { opacity: 1 },
          _dark: {
            background: 'linear-gradient(to bottom, #262626, transparent)'
          }
        })} />
      )}
      <div class={css({
        marginBottom: '16px',
        position: 'relative',
        zIndex: 10,
        paddingX: '40px',
        color: 'neutral.600',
        _dark: { color: 'neutral.400' }
      })}>
        {props.icon}
      </div>
      <div class={css({
        fontSize: 'lg',
        fontWeight: 'bold',
        marginBottom: '8px',
        position: 'relative',
        zIndex: 10,
        paddingX: '40px'
      })}>
        <div class={css({
          position: 'absolute',
          left: 0,
          insetY: 0,
          height: '24px',
          width: '4px',
          borderTopRightRadius: 'full',
          borderBottomRightRadius: 'full',
          backgroundColor: 'neutral.300',
          transition: 'all 0.2s',
          transformOrigin: 'center',
          _groupHover: {
            height: '32px',
            backgroundColor: 'blue.500'
          },
          _dark: {
            backgroundColor: 'neutral.700'
          }
        })} />
        <span class={css({
          transition: 'transform 0.2s',
          display: 'inline-block',
          color: 'neutral.800',
          _groupHover: { transform: 'translateX(8px)' },
          _dark: { color: 'neutral.100' }
        })}>
          {props.title}
        </span>
      </div>
      <p class={css({
        fontSize: 'sm',
        color: 'neutral.600',
        maxWidth: '320px',
        position: 'relative',
        zIndex: 10,
        paddingX: '40px',
        _dark: { color: 'neutral.300' }
      })}>
        {props.description}
      </p>
    </div>
  );
};

const gridFeatures = [
  {
    title: "HIPAA and SOC2 Compliant",
    description:
      "Our applications are HIPAA and SOC2 compliant, your data is safe with us, always.",
  },
  {
    title: "Automated Social Media Posting",
    description:
      "Schedule and automate your social media posts across multiple platforms to save time and maintain a consistent online presence.",
  },
  {
    title: "Advanced Analytics",
    description:
      "Gain insights into your social media performance with detailed analytics and reporting tools to measure engagement and ROI.",
  },
  {
    title: "Content Calendar",
    description:
      "Plan and organize your social media content with an intuitive calendar view, ensuring you never miss a post.",
  },
  {
    title: "Audience Targeting",
    description:
      "Reach the right audience with advanced targeting options, including demographics, interests, and behaviors.",
  },
  {
    title: "Social Listening",
    description:
      "Monitor social media conversations and trends to stay informed about what your audience is saying and respond in real-time.",
  },
  {
    title: "Customizable Templates",
    description:
      "Create stunning social media posts with our customizable templates, designed to fit your brand's unique style and voice.",
  },
  {
    title: "Collaboration Tools",
    description:
      "Work seamlessly with your team using our collaboration tools, allowing you to assign tasks, share drafts, and provide feedback in real-time.",
  },
];

export const Grid: Component<GridProps> = (props) => {
  const p = () => props.pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  
  return (
    <div class={css({
      pointerEvents: 'none',
      position: 'absolute',
      left: '50%',
      top: 0,
      marginLeft: '-80px',
      marginTop: '-8px',
      height: '100%',
      width: '100%',
      maskImage: 'linear-gradient(white, transparent)'
    })}>
      <div class={css({
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(farthest-side at top, white, transparent)',
        opacity: 1,
        _dark: {
          background: 'linear-gradient(to right, rgba(39, 39, 42, 0.3), rgba(39, 39, 42, 0.3))'
        }
      })}>
        <GridPattern
          width={props.size ?? 20}
          height={props.size ?? 20}
          x="-12"
          y="4"
          squares={p()}
          className={css({
            position: 'absolute',
            inset: 0,
            height: '100%',
            width: '100%',
            mixBlendMode: 'overlay',
            stroke: 'rgba(0, 0, 0, 0.1)',
            fill: 'rgba(0, 0, 0, 0.1)',
            _dark: {
              fill: 'rgba(255, 255, 255, 0.1)',
              stroke: 'rgba(255, 255, 255, 0.1)'
            }
          })}
        />
      </div>
    </div>
  );
};

export const GridPattern: Component<GridPatternProps> = (props) => {
  const patternId = createUniqueId();

  return (
    <svg aria-hidden="true" class={props.className}>
      <defs>
        <pattern
          id={patternId}
          width={props.width}
          height={props.height}
          patternUnits="userSpaceOnUse"
          x={props.x}
          y={props.y}
        >
          <path d={`M.5 ${props.height}V.5H${props.width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        stroke-width={0}
        fill={`url(#${patternId})`}
      />
      {props.squares && (
        <svg x={props.x} y={props.y} class={css({ overflow: 'visible' })}>
          <For each={props.squares}>
            {([x, y]) => (
              <rect
                stroke-width="0"
                width={(props.width ?? 20) + 1}
                height={(props.height ?? 20) + 1}
                x={x * (props.width ?? 20)}
                y={y * (props.height ?? 20)}
              />
            )}
          </For>
        </svg>
      )}
    </svg>
  );
};

// Icon Components
const TerminalIcon: Component = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="4,17 10,11 4,5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const EaseIcon: Component = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);

const DollarIcon: Component = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const CloudIcon: Component = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

const RouteIcon: Component = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
  </svg>
);

const HelpIcon: Component = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

const AdjustmentsIcon: Component = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const HeartIcon: Component = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
</svg>
);

export default GridFeaturesSectionDemo;