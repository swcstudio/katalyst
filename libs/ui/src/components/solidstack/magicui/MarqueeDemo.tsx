import { css } from '@sse/ui/styled-system/css';
import { type Component, For, type JSX } from 'solid-js';

// Placeholder Marquee component - this would need to be implemented separately
const Marquee: Component<{
  pauseOnHover?: boolean;
  className?: string;
  reverse?: boolean;
  children: JSX.Element;
}> = (props) => {
  return (
    <div
      class={css(
        {
          display: 'flex',
          width: 'full',
          overflow: 'hidden',
          userSelect: 'none',
          gap: '4',
        },
        props.className
      )}
    >
      <div
        class={css({
          display: 'flex',
          animation: props.reverse
            ? 'marquee-reverse 20s linear infinite'
            : 'marquee 20s linear infinite',
          gap: '4',
          _hover: props.pauseOnHover ? { animationPlayState: 'paused' } : {},
        })}
      >
        {props.children}
      </div>
      <div
        class={css({
          display: 'flex',
          animation: props.reverse
            ? 'marquee-reverse 20s linear infinite'
            : 'marquee 20s linear infinite',
          gap: '4',
          _hover: props.pauseOnHover ? { animationPlayState: 'paused' } : {},
        })}
      >
        {props.children}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0%); }
          to { transform: translateX(-100%); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(-100%); }
          to { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
};

const reviews = [
  {
    name: 'Jack',
    username: '@jack',
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: 'https://avatar.vercel.sh/jack',
  },
  {
    name: 'Jill',
    username: '@jill',
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: 'https://avatar.vercel.sh/jill',
  },
  {
    name: 'John',
    username: '@john',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/john',
  },
  {
    name: 'Jane',
    username: '@jane',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/jane',
  },
  {
    name: 'Jenny',
    username: '@jenny',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/jenny',
  },
  {
    name: 'James',
    username: '@james',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/james',
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard: Component<{
  img: string;
  name: string;
  username: string;
  body: string;
}> = (props) => {
  return (
    <figure
      class={css({
        position: 'relative',
        height: 'full',
        width: '64',
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: 'xl',
        border: '1px solid',
        padding: '4',
        borderColor: 'gray.950/10',
        backgroundColor: 'gray.950/1',
        _hover: {
          backgroundColor: 'gray.950/5',
        },
        _dark: {
          borderColor: 'gray.50/10',
          backgroundColor: 'gray.50/10',
          _hover: {
            backgroundColor: 'gray.50/15',
          },
        },
      })}
    >
      <div
        class={css({
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '2',
        })}
      >
        <img class={css({ borderRadius: 'full' })} width="32" height="32" alt="" src={props.img} />
        <div
          class={css({
            display: 'flex',
            flexDirection: 'column',
          })}
        >
          <figcaption
            class={css({
              fontSize: 'sm',
              fontWeight: 'medium',
              color: 'black',
              _dark: {
                color: 'white',
              },
            })}
          >
            {props.name}
          </figcaption>
          <p
            class={css({
              fontSize: 'xs',
              fontWeight: 'medium',
              color: 'black/40',
              _dark: {
                color: 'white/40',
              },
            })}
          >
            {props.username}
          </p>
        </div>
      </div>
      <blockquote
        class={css({
          marginTop: '2',
          fontSize: 'sm',
        })}
      >
        {props.body}
      </blockquote>
    </figure>
  );
};

export const MarqueeDemo: Component = () => {
  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        width: 'full',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      })}
    >
      <Marquee pauseOnHover className={css({ marginBottom: '4' })}>
        <For each={firstRow}>{(review) => <ReviewCard {...review} />}</For>
      </Marquee>
      <Marquee reverse pauseOnHover>
        <For each={secondRow}>{(review) => <ReviewCard {...review} />}</For>
      </Marquee>
      <div
        class={css({
          pointerEvents: 'none',
          position: 'absolute',
          insetY: '0',
          left: '0',
          width: '1/4',
          background: 'linear-gradient(to right, white, transparent)',
          _dark: {
            background: 'linear-gradient(to right, black, transparent)',
          },
        })}
      />
      <div
        class={css({
          pointerEvents: 'none',
          position: 'absolute',
          insetY: '0',
          right: '0',
          width: '1/4',
          background: 'linear-gradient(to left, white, transparent)',
          _dark: {
            background: 'linear-gradient(to left, black, transparent)',
          },
        })}
      />
    </div>
  );
};

export default MarqueeDemo;
