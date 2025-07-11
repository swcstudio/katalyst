import { css, cx } from '@sse/ui/styled-system/css';
import { animate } from 'motion';
import { type Component, createSignal, For, JSX, onCleanup, onMount } from 'solid-js';

export interface MeteorProps {
  number?: number;
  className?: string;
}

export interface MeteorItem {
  id: number;
  left: string;
  delay: number;
  duration: number;
  size: number;
}

export const MeteorsDemo: Component = () => {
  return (
    <div class={css({ padding: '40px' })}>
      <div class={css({ position: 'relative', width: '100%', maxWidth: '576px' })}>
        <div
          class={css({
            position: 'absolute',
            inset: 0,
            height: '100%',
            width: '100%',
            transform: 'scale(0.8)',
            borderRadius: 'full',
            backgroundColor: 'red.500',
            background: 'linear-gradient(to right, #3b82f6, #14b8a6)',
            filter: 'blur(48px)',
          })}
        />
        <div
          class={css({
            position: 'relative',
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            alignItems: 'start',
            justifyContent: 'end',
            overflow: 'hidden',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: 'gray.800',
            backgroundColor: 'gray.900',
            paddingX: '16px',
            paddingY: '32px',
            boxShadow: 'xl',
          })}
        >
          <div
            class={css({
              marginBottom: '16px',
              display: 'flex',
              height: '20px',
              width: '20px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'full',
              border: '1px solid',
              borderColor: 'gray.500',
            })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class={css({
                height: '8px',
                width: '8px',
                color: 'gray.300',
              })}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
              />
            </svg>
          </div>

          <h1
            class={css({
              position: 'relative',
              zIndex: 50,
              marginBottom: '16px',
              fontSize: 'xl',
              fontWeight: 'bold',
              color: 'white',
            })}
          >
            Meteors because they're cool
          </h1>

          <p
            class={css({
              position: 'relative',
              zIndex: 50,
              marginBottom: '16px',
              fontSize: 'base',
              fontWeight: 'normal',
              color: 'slate.500',
            })}
          >
            I don't know what to write so I'll just paste something cool here. One more sentence
            because lorem ipsum is just unacceptable. Won't ChatGPT the shit out of this.
          </p>

          <button
            class={css({
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'gray.500',
              paddingX: '16px',
              paddingY: '4px',
              color: 'gray.300',
            })}
          >
            Explore
          </button>

          <Meteors number={20} />
        </div>
      </div>
    </div>
  );
};

export const Meteors: Component<MeteorProps> = (props) => {
  const [meteors, setMeteors] = createSignal<MeteorItem[]>([]);

  const createMeteors = () => {
    const meteorArray: MeteorItem[] = [];
    const count = props.number || 20;

    for (let i = 0; i < count; i++) {
      meteorArray.push({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
        duration: Math.random() * 3 + 2,
        size: Math.random() * 2 + 1,
      });
    }

    setMeteors(meteorArray);
  };

  onMount(() => {
    createMeteors();

    meteors().forEach((meteor) => {
      const element = document.querySelector(`.meteor-${meteor.id}`);
      if (element) {
        const animateMeteor = () => {
          animate(
            element,
            {
              top: ['-10%', '100%'],
              opacity: [0, 1, 0],
              transform: [
                'translateX(0px) translateY(0px) rotate(45deg)',
                'translateX(-500px) translateY(300px) rotate(45deg)',
              ],
            },
            {
              duration: meteor.duration,
              delay: meteor.delay,
              easing: 'linear',
            }
          ).then(() => {
            // Restart animation after completion
            setTimeout(animateMeteor, Math.random() * 3000);
          });
        };

        animateMeteor();
      }
    });
  });

  return (
    <div
      class={css({
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      })}
    >
      <For each={meteors()}>
        {(meteor) => (
          <div
            class={cx(
              `meteor-${meteor.id}`,
              css({
                position: 'absolute',
                left: meteor.left,
                top: '-10%',
                width: `${meteor.size}px`,
                height: `${meteor.size * 20}px`,
                background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.8), transparent)',
                borderRadius: '999px',
                transform: 'rotate(45deg)',
                _before: {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: `${meteor.size * 0.5}px`,
                  height: `${meteor.size * 10}px`,
                  background: 'linear-gradient(to bottom, rgba(147, 197, 253, 1), transparent)',
                  borderRadius: '999px',
                },
                _after: {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: `${meteor.size * 2}px`,
                  height: `${meteor.size * 30}px`,
                  background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.3), transparent)',
                  borderRadius: '999px',
                  filter: 'blur(2px)',
                },
              })
            )}
          />
        )}
      </For>
    </div>
  );
};

export default MeteorsDemo;
