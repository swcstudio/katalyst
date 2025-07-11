import { css } from '@sse/ui/styled-system/css';
import { type Component, For, createUniqueId } from 'solid-js';

const grid = [
  {
    title: 'HIPAA and SOC2 Compliant',
    description:
      'Our applications are HIPAA and SOC2 compliant, your data is safe with us, always.',
  },
  {
    title: 'Automated Social Media Posting',
    description:
      'Schedule and automate your social media posts across multiple platforms to save time and maintain a consistent online presence.',
  },
  {
    title: 'Advanced Analytics',
    description:
      'Gain insights into your social media performance with detailed analytics and reporting tools to measure engagement and ROI.',
  },
  {
    title: 'Content Calendar',
    description:
      'Plan and organize your social media content with an intuitive calendar view, ensuring you never miss a post.',
  },
  {
    title: 'Audience Targeting',
    description:
      'Reach the right audience with advanced targeting options, including demographics, interests, and behaviors.',
  },
  {
    title: 'Social Listening',
    description:
      'Monitor social media conversations and trends to stay informed about what your audience is saying and respond in real-time.',
  },
  {
    title: 'Customizable Templates',
    description:
      "Create stunning social media posts with our customizable templates, designed to fit your brand's unique style and voice.",
  },
  {
    title: 'Collaboration Tools',
    description:
      'Work seamlessly with your team using our collaboration tools, allowing you to assign tasks, share drafts, and provide feedback in real-time.',
  },
];

export const Grid: Component<{
  pattern?: number[][];
  size?: number;
}> = (props) => {
  const p = props.pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];

  return (
    <div
      class={css({
        pointerEvents: 'none',
        position: 'absolute',
        left: '1/2',
        top: '0',
        marginLeft: '-20',
        marginTop: '-2',
        height: 'full',
        width: 'full',
        maskImage: 'linear-gradient(white, transparent)',
      })}
    >
      <div
        class={css({
          position: 'absolute',
          inset: '0',
          background: 'linear-gradient(to right, zinc.100/30, zinc.300/30)',
          maskImage: 'radial-gradient(farthest-side at top, white, transparent)',
          opacity: '100',
          _dark: {
            background: 'linear-gradient(to right, zinc.900/30, zinc.900/30)',
          },
        })}
      >
        <GridPattern
          width={props.size ?? 20}
          height={props.size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className={css({
            position: 'absolute',
            inset: '0',
            height: 'full',
            width: 'full',
            mixBlendMode: 'overlay',
            stroke: 'black/10',
            fill: 'black/10',
            _dark: {
              fill: 'white/10',
              stroke: 'white/10',
            },
          })}
        />
      </div>
    </div>
  );
};

export const GridPattern: Component<{
  width: number;
  height: number;
  x: string;
  y: string;
  squares: number[][];
  className?: string;
}> = (props) => {
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
      <rect width="100%" height="100%" stroke-width={0} fill={`url(#${patternId})`} />
      {props.squares && (
        <svg x={props.x} y={props.y} class={css({ overflow: 'visible' })}>
          <For each={props.squares}>
            {([x, y]) => (
              <rect
                stroke-width="0"
                width={props.width + 1}
                height={props.height + 1}
                x={x * props.width}
                y={y * props.height}
              />
            )}
          </For>
        </svg>
      )}
    </svg>
  );
};

export const GridFeaturesSectionDemo: Component = () => {
  return (
    <div
      class={css({
        paddingY: '20',
        lg: {
          paddingY: '40',
        },
      })}
    >
      <div
        class={css({
          display: 'grid',
          gridTemplateColumns: '1',
          gap: '10',
          maxWidth: '7xl',
          marginX: 'auto',
          sm: {
            gridTemplateColumns: '2',
          },
          md: {
            gridTemplateColumns: '3',
            gap: '2',
          },
          lg: {
            gridTemplateColumns: '4',
          },
        })}
      >
        <For each={grid}>
          {(feature) => (
            <div
              class={css({
                position: 'relative',
                background: 'linear-gradient(to bottom, neutral.100, white)',
                padding: '6',
                borderRadius: '3xl',
                overflow: 'hidden',
                _dark: {
                  background: 'linear-gradient(to bottom, neutral.900, neutral.950)',
                },
              })}
            >
              <Grid size={20} />
              <p
                class={css({
                  fontSize: 'base',
                  fontWeight: 'bold',
                  color: 'neutral.800',
                  position: 'relative',
                  zIndex: '20',
                  _dark: {
                    color: 'white',
                  },
                })}
              >
                {feature.title}
              </p>
              <p
                class={css({
                  color: 'neutral.600',
                  marginTop: '4',
                  fontSize: 'base',
                  fontWeight: 'normal',
                  position: 'relative',
                  zIndex: '20',
                  _dark: {
                    color: 'neutral.400',
                  },
                })}
              >
                {feature.description}
              </p>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default GridFeaturesSectionDemo;
