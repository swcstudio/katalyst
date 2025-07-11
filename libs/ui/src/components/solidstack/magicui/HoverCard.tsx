import { css, cx } from '@sse/ui/styled-system/css';
import type { Component, JSX } from 'solid-js';

export interface HoverCardProps {
  className?: string;
  children: JSX.Element;
  backgroundImage?: string;
  hoverBackgroundImage?: string;
}

export interface AuthorCardProps {
  className?: string;
  backgroundImage?: string;
  avatar?: string;
  authorName?: string;
  readTime?: string;
  title?: string;
  description?: string;
}

export const HoverCardDemo: Component = () => {
  return (
    <div class={css({ maxWidth: '320px', width: '100%' })}>
      <HoverCard
        backgroundImage="https://images.unsplash.com/photo-1476842634003-7dcca8f832de?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80"
        hoverBackgroundImage="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWlodTF3MjJ3NnJiY3Rlc2J0ZmE0c28yeWoxc3gxY2VtZzA5ejF1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/syEfLvksYQnmM/giphy.gif"
        className={cx(
          css({
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            height: '384px',
            borderRadius: '6px',
            boxShadow: 'xl',
            marginX: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'end',
            padding: '16px',
            border: '1px solid transparent',
            backgroundSize: 'cover',
            transition: 'all 0.5s',
            _dark: { borderColor: 'neutral.800' },
            _hover: {
              _after: {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundColor: 'black',
                opacity: 0.5,
              },
            },
          })
        )}
      >
        <div class={css({ position: 'relative', zIndex: 50 })}>
          <h1
            class={css({
              fontWeight: 'bold',
              fontSize: 'xl',
              color: 'gray.50',
              position: 'relative',
              md: { fontSize: '3xl' },
            })}
          >
            Background Overlays
          </h1>
          <p
            class={css({
              fontWeight: 'normal',
              fontSize: 'base',
              color: 'gray.50',
              position: 'relative',
              marginY: '16px',
            })}
          >
            This card is for some special elements, like displaying background gifs on hover only.
          </p>
        </div>
      </HoverCard>
    </div>
  );
};

export const AuthorCardDemo: Component = () => {
  return (
    <div class={css({ maxWidth: '320px', width: '100%' })}>
      <AuthorCard
        backgroundImage="https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80"
        avatar="/manu.png"
        authorName="Manu Arora"
        readTime="2 min read"
        title="Author Card"
        description="Card with Author avatar, complete name and time to read - most suitable for blogs."
      />
    </div>
  );
};

export const HoverCard: Component<HoverCardProps> = (props) => {
  const backgroundStyle = () => ({
    'background-image': `url(${props.backgroundImage})`,
    'background-size': 'cover',
  });

  const hoverBackgroundStyle = () =>
    props.hoverBackgroundImage
      ? {
          '--hover-bg': `url(${props.hoverBackgroundImage})`,
        }
      : {};

  return (
    <div
      class={cx(
        css({
          group: true,
          width: '100%',
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          height: '384px',
          borderRadius: '6px',
          boxShadow: 'xl',
          marginX: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'end',
          padding: '16px',
          border: '1px solid transparent',
          transition: 'all 0.5s',
          _dark: { borderColor: 'neutral.800' },
          _before: {
            content: '""',
            position: 'fixed',
            inset: 0,
            opacity: 0,
            zIndex: -1,
            backgroundImage: 'var(--hover-bg)',
          },
          _hover: {
            backgroundImage: 'var(--hover-bg)',
            _after: {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundColor: 'black',
              opacity: 0.5,
            },
          },
        }),
        props.className
      )}
      style={{
        ...backgroundStyle(),
        ...hoverBackgroundStyle(),
      }}
    >
      {props.children}
    </div>
  );
};

export const AuthorCard: Component<AuthorCardProps> = (props) => {
  return (
    <div class={css({ maxWidth: '320px', width: '100%', group: true })}>
      <div
        class={cx(
          css({
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            height: '384px',
            borderRadius: '6px',
            boxShadow: 'xl',
            maxWidth: '384px',
            marginX: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px',
            backgroundSize: 'cover',
          }),
          props.className
        )}
        style={{ 'background-image': `url(${props.backgroundImage})` }}
      >
        <div
          class={css({
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            transition: 'all 0.3s',
            opacity: 0.6,
            _groupHover: { backgroundColor: 'black' },
          })}
        />

        <div
          class={css({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16px',
            zIndex: 10,
          })}
        >
          <img
            height="100"
            width="100"
            alt="Avatar"
            src={props.avatar}
            class={css({
              height: '40px',
              width: '40px',
              borderRadius: 'full',
              border: '2px solid white',
              objectFit: 'cover',
            })}
          />
          <div class={css({ display: 'flex', flexDirection: 'column' })}>
            <p
              class={css({
                fontWeight: 'normal',
                fontSize: 'base',
                color: 'gray.50',
                position: 'relative',
                zIndex: 10,
              })}
            >
              {props.authorName}
            </p>
            <p class={css({ fontSize: 'sm', color: 'gray.400' })}>{props.readTime}</p>
          </div>
        </div>

        <div class={css({ position: 'relative' })}>
          <h1
            class={css({
              fontWeight: 'bold',
              fontSize: 'xl',
              color: 'gray.50',
              position: 'relative',
              zIndex: 10,
              md: { fontSize: '2xl' },
            })}
          >
            {props.title}
          </h1>
          <p
            class={css({
              fontWeight: 'normal',
              fontSize: 'sm',
              color: 'gray.50',
              position: 'relative',
              zIndex: 10,
              marginY: '16px',
            })}
          >
            {props.description}
          </p>
        </div>
      </div>
    </div>
  );
};
