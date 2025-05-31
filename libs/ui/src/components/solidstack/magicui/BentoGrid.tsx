import { Component, JSX, mergeProps, For, children } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

export interface BentoGridProps {
  className?: string;
  children?: JSX.Element;
}

export interface BentoGridItemProps {
  className?: string;
  title?: string | JSX.Element;
  description?: string | JSX.Element;
  header?: JSX.Element;
  icon?: JSX.Element;
}

export const BentoGrid: Component<BentoGridProps> = (props) => {
  const merged = mergeProps({}, props);
  const resolved = children(() => props.children);

  return (
    <div
      class={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '4',
        maxWidth: '7xl',
        marginX: 'auto',
        _md: {
          gridTemplateColumns: 'repeat(3, 1fr)',
        },
      }, merged.className)}
    >
      {resolved()}
    </div>
  );
};

export const BentoGridItem: Component<BentoGridItemProps> = (props) => {
  const merged = mergeProps({}, props);

  return (
    <div
      class={css({
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'xl',
        border: '1px solid',
        borderColor: 'transparent',
        background: 'linear-gradient(white, white) padding-box, linear-gradient(145deg, transparent, rgba(255,255,255,0.1)) border-box',
        padding: '4',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        },
        _dark: {
          background: 'linear-gradient(rgb(17 24 39), rgb(17 24 39)) padding-box, linear-gradient(145deg, transparent, rgba(255,255,255,0.1)) border-box',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
      }, merged.className)}
    >
      {merged.header}
      <div class={css({ marginTop: '4' })}>
        {merged.icon && (
          <div class={css({ marginBottom: '2' })}>
            {merged.icon}
          </div>
        )}
        {merged.title && (
          <div class={css({
            fontSize: 'lg',
            fontWeight: 'bold',
            color: 'neutral.800',
            marginBottom: '2',
            _dark: {
              color: 'neutral.200',
            },
          })}>
            {merged.title}
          </div>
        )}
        {merged.description && (
          <div class={css({
            fontSize: 'sm',
            color: 'neutral.600',
            lineHeight: 'relaxed',
            _dark: {
              color: 'neutral.400',
            },
          })}>
            {merged.description}
          </div>
        )}
      </div>
    </div>
  );
};

const Skeleton: Component = () => (
  <div class={css({
    display: 'flex',
    flex: '1',
    width: 'full',
    height: 'full',
    minHeight: '6rem',
    borderRadius: 'xl',
    background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
    _dark: {
      background: 'linear-gradient(135deg, #1f2937, #374151)',
    },
  })} />
);

// Icon components
const IconClipboardCopy: Component<{ className?: string }> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.className}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const IconFileBroken: Component<{ className?: string }> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
);

const IconSignature: Component<{ className?: string }> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.className}
  >
    <path d="M3 17c3.333-3.333 5-6 5-8a4 4 0 1 1 8 0c0 2-2 4.667-6 8" />
    <path d="M16.5 17c3.333-3.333 5-6 5-8a4 4 0 1 1 8 0c0 2-2 4.667-6 8" />
  </svg>
);

const IconTableColumn: Component<{ className?: string }> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.className}
  >
    <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z" />
    <path d="M8 3v18" />
  </svg>
);

const IconArrowWaveRightUp: Component<{ className?: string }> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.className}
  >
    <path d="m7 16 4-4-4-4" />
    <path d="m17 16 4-4-4-4" />
  </svg>
);

const IconBoxAlignTopLeft: Component<{ className?: string }> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.className}
  >
    <path d="M3 3h6v6H3z" />
    <path d="M21 3v18" />
    <path d="M3 21h18" />
  </svg>
);

const IconBoxAlignRightFilled: Component<{ className?: string }> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.className}
  >
    <path d="M15 3h6v6h-6z" />
    <path d="M3 3v18" />
    <path d="M3 21h18" />
  </svg>
);

export interface BentoGridDemoProps {
  className?: string;
}

export const BentoGridDemo: Component<BentoGridDemoProps> = (props) => {
  const items = [
    {
      title: "The Dawn of Innovation",
      description: "Explore the birth of groundbreaking ideas and inventions.",
      header: <Skeleton />,
      icon: <IconClipboardCopy className={css({ height: '4', width: '4', color: 'neutral.500' })} />,
    },
    {
      title: "The Digital Revolution",
      description: "Dive into the transformative power of technology.",
      header: <Skeleton />,
      icon: <IconFileBroken className={css({ height: '4', width: '4', color: 'neutral.500' })} />,
    },
    {
      title: "The Art of Design",
      description: "Discover the beauty of thoughtful and functional design.",
      header: <Skeleton />,
      icon: <IconSignature className={css({ height: '4', width: '4', color: 'neutral.500' })} />,
    },
    {
      title: "The Power of Communication",
      description: "Understand the impact of effective communication in our lives.",
      header: <Skeleton />,
      icon: <IconTableColumn className={css({ height: '4', width: '4', color: 'neutral.500' })} />,
      className: css({ _md: { colSpan: 2 } }),
    },
    {
      title: "The Pursuit of Knowledge",
      description: "Join the quest for understanding and enlightenment.",
      header: <Skeleton />,
      icon: <IconArrowWaveRightUp className={css({ height: '4', width: '4', color: 'neutral.500' })} />,
    },
    {
      title: "The Joy of Creation",
      description: "Experience the thrill of bringing ideas to life.",
      header: <Skeleton />,
      icon: <IconBoxAlignTopLeft className={css({ height: '4', width: '4', color: 'neutral.500' })} />,
    },
    {
      title: "The Spirit of Adventure",
      description: "Embark on exciting journeys and thrilling discoveries.",
      header: <Skeleton />,
      icon: <IconBoxAlignRightFilled className={css({ height: '4', width: '4', color: 'neutral.500' })} />,
      className: css({ _md: { colSpan: 2 } }),
    },
  ];

  return (
    <BentoGrid className={css({ maxWidth: '4xl', marginX: 'auto' }, props.className)}>
      <For each={items}>
        {(item, i) => (
          <BentoGridItem
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={item.className || (i() === 3 || i() === 6 ? css({ _md: { colSpan: 2 } }) : "")}
          />
        )}
      </For>
    </BentoGrid>
  );
};

export default BentoGridDemo;