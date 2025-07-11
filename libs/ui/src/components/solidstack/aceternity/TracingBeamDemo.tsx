import { css } from '@sse/ui/styled-system/css';
import { type Component, For, Show } from 'solid-js';

interface ContentItem {
  title: string;
  description: JSX.Element;
  badge: string;
  image?: string;
}

// Placeholder TracingBeam component - this would need to be implemented separately
const TracingBeam: Component<{
  className?: string;
  children: JSX.Element;
}> = (props) => {
  return (
    <div
      class={css(
        {
          position: 'relative',
          width: 'full',
          minHeight: 'screen',
        },
        props.className
      )}
    >
      {/* Tracing line */}
      <div
        class={css({
          position: 'absolute',
          left: '8',
          top: '0',
          bottom: '0',
          width: '2px',
          background: 'linear-gradient(to bottom, transparent, rgb(59, 130, 246), transparent)',
          zIndex: '1',
        })}
      />

      {/* Animated dot */}
      <div
        class={css({
          position: 'absolute',
          left: '7',
          width: '4',
          height: '4',
          backgroundColor: 'blue.500',
          borderRadius: 'full',
          zIndex: '2',
          animation: 'moveDown 3s ease-in-out infinite',
        })}
      />

      <div
        class={css({
          position: 'relative',
          zIndex: '3',
          paddingLeft: '16',
        })}
      >
        {props.children}
      </div>

      <style>{`
        @keyframes moveDown {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export const TracingBeamDemo: Component = () => {
  const dummyContent: ContentItem[] = [
    {
      title: 'Lorem Ipsum Dolor Sit Amet',
      description: (
        <>
          <p>
            Sit duis est minim proident non nisi velit non consectetur. Esse adipisicing laboris
            consectetur enim ipsum reprehenderit eu deserunt Lorem ut aliqua anim do. Duis cupidatat
            qui irure cupidatat incididunt incididunt enim magna id est qui sunt fugiat. Laboris do
            duis pariatur fugiat Lorem aute sit ullamco. Qui deserunt non reprehenderit dolore nisi
            velit exercitation Lorem qui do enim culpa. Aliqua eiusmod in occaecat reprehenderit
            laborum nostrud fugiat voluptate do Lorem culpa officia sint labore. Tempor consectetur
            excepteur ut fugiat veniam commodo et labore dolore commodo pariatur.
          </p>
          <p>
            Dolor minim irure ut Lorem proident. Ipsum do pariatur est ad ad veniam in commodo id
            reprehenderit adipisicing. Proident duis exercitation ad quis ex cupidatat cupidatat
            occaecat adipisicing.
          </p>
          <p>
            Tempor quis dolor veniam quis dolor. Sit reprehenderit eiusmod reprehenderit deserunt
            amet laborum consequat adipisicing officia qui irure id sint adipisicing. Adipisicing
            fugiat aliqua nulla nostrud. Amet culpa officia aliquip deserunt veniam deserunt officia
            adipisicing aliquip proident officia sunt.
          </p>
        </>
      ),
      badge: 'React',
      image:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=3540&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      title: 'Lorem Ipsum Dolor Sit Amet',
      description: (
        <>
          <p>
            Ex irure dolore veniam ex velit non aute nisi labore ipsum occaecat deserunt cupidatat
            aute. Enim cillum dolor et nulla sunt exercitation non voluptate qui aliquip esse
            tempor. Ullamco ut sunt consectetur sint qui qui do do qui do. Labore laborum culpa
            magna reprehenderit ea velit id esse adipisicing deserunt amet dolore. Ipsum occaecat
            veniam commodo proident aliqua id ad deserunt dolor aliquip duis veniam sunt.
          </p>
          <p>
            In dolore veniam excepteur eu est et sunt velit. Ipsum sint esse veniam fugiat esse qui
            sint ad sunt reprehenderit do qui proident reprehenderit. Laborum exercitation aliqua
            reprehenderit ea sint cillum ut mollit.
          </p>
        </>
      ),
      badge: 'Changelog',
      image:
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=3540&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      title: 'Lorem Ipsum Dolor Sit Amet',
      description: (
        <>
          <p>
            Ex irure dolore veniam ex velit non aute nisi labore ipsum occaecat deserunt cupidatat
            aute. Enim cillum dolor et nulla sunt exercitation non voluptate qui aliquip esse
            tempor. Ullamco ut sunt consectetur sint qui qui do do qui do. Labore laborum culpa
            magna reprehenderit ea velit id esse adipisicing deserunt amet dolore. Ipsum occaecat
            veniam commodo proident aliqua id ad deserunt dolor aliquip duis veniam sunt.
          </p>
        </>
      ),
      badge: 'Launch Week',
      image:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=3506&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  return (
    <TracingBeam className={css({ paddingX: '6' })}>
      <div
        class={css({
          maxWidth: '2xl',
          marginX: 'auto',
          WebkitFontSmoothing: 'antialiased',
          paddingTop: '4',
          position: 'relative',
        })}
      >
        <For each={dummyContent}>
          {(item, index) => (
            <div class={css({ marginBottom: '10' })}>
              <h2
                class={css({
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: 'full',
                  fontSize: 'sm',
                  width: 'fit-content',
                  paddingX: '4',
                  paddingY: '1',
                  marginBottom: '4',
                })}
              >
                {item.badge}
              </h2>

              <p
                class={css({
                  fontSize: 'xl',
                  marginBottom: '4',
                  fontWeight: 'medium',
                  fontFamily: 'system-ui, -apple-system, sans-serif', // placeholder for calsans
                })}
              >
                {item.title}
              </p>

              <div
                class={css({
                  fontSize: 'sm',
                  lineHeight: 'relaxed',
                  color: 'gray.700',
                  _dark: { color: 'gray.300' },
                  '& p': {
                    marginBottom: '4',
                    lineHeight: 'relaxed',
                  },
                })}
              >
                <Show when={item.image}>
                  <img
                    src={item.image}
                    alt="blog thumbnail"
                    height="1000"
                    width="1000"
                    class={css({
                      borderRadius: 'lg',
                      marginBottom: '10',
                      objectFit: 'cover',
                      width: 'full',
                      height: 'auto',
                    })}
                  />
                </Show>
                {item.description}
              </div>
            </div>
          )}
        </For>
      </div>
    </TracingBeam>
  );
};

export default TracingBeamDemo;
