import { css } from '@sse/ui/styled-system/css';
import { type Component, For } from 'solid-js';

interface TimelineData {
  title: string;
  content: JSX.Element;
}

// Placeholder Timeline component - this would need to be implemented separately
const Timeline: Component<{
  data: TimelineData[];
}> = (props) => {
  return (
    <div
      class={css({
        position: 'relative',
        width: 'full',
        paddingY: '20',
      })}
    >
      {/* Timeline line */}
      <div
        class={css({
          position: 'absolute',
          left: '4',
          top: '0',
          bottom: '0',
          width: '1px',
          backgroundColor: 'gray.300',
          _dark: { backgroundColor: 'gray.600' },
          md: { left: '8' },
        })}
      />

      <For each={props.data}>
        {(item, index) => (
          <div
            class={css({
              position: 'relative',
              paddingLeft: '12',
              paddingBottom: '16',
              md: { paddingLeft: '20' },
            })}
          >
            {/* Timeline dot */}
            <div
              class={css({
                position: 'absolute',
                left: '2.5',
                width: '3',
                height: '3',
                backgroundColor: 'blue.500',
                borderRadius: 'full',
                md: { left: '6.5' },
              })}
            />

            {/* Content */}
            <div
              class={css({
                backgroundColor: 'white',
                borderRadius: 'lg',
                padding: '6',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                _dark: { backgroundColor: 'gray.800' },
              })}
            >
              <h3
                class={css({
                  fontSize: 'xl',
                  fontWeight: 'bold',
                  marginBottom: '4',
                  color: 'gray.900',
                  _dark: { color: 'white' },
                })}
              >
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export const TimelineDemo: Component = () => {
  const data: TimelineData[] = [
    {
      title: '2024',
      content: (
        <div>
          <p
            class={css({
              marginBottom: '8',
              fontSize: 'xs',
              fontWeight: 'normal',
              color: 'neutral.800',
              md: { fontSize: 'sm' },
              _dark: { color: 'neutral.200' },
            })}
          >
            Built and launched Aceternity UI and Aceternity UI Pro from scratch
          </p>
          <div
            class={css({
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '4',
            })}
          >
            <img
              src="https://assets.aceternity.com/templates/startup-1.webp"
              alt="startup template"
              width={500}
              height={500}
              class={css({
                height: '20',
                width: 'full',
                borderRadius: 'lg',
                objectFit: 'cover',
                boxShadow:
                  '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
                md: { height: '44' },
                lg: { height: '60' },
              })}
            />
            <img
              src="https://assets.aceternity.com/templates/startup-2.webp"
              alt="startup template"
              width={500}
              height={500}
              class={css({
                height: '20',
                width: 'full',
                borderRadius: 'lg',
                objectFit: 'cover',
                boxShadow:
                  '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
                md: { height: '44' },
                lg: { height: '60' },
              })}
            />
            <img
              src="https://assets.aceternity.com/templates/startup-3.webp"
              alt="startup template"
              width={500}
              height={500}
              class={css({
                height: '20',
                width: 'full',
                borderRadius: 'lg',
                objectFit: 'cover',
                boxShadow:
                  '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
                md: { height: '44' },
                lg: { height: '60' },
              })}
            />
            <img
              src="https://assets.aceternity.com/templates/startup-4.webp"
              alt="startup template"
              width={500}
              height={500}
              class={css({
                height: '20',
                width: 'full',
                borderRadius: 'lg',
                objectFit: 'cover',
                boxShadow:
                  '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
                md: { height: '44' },
                lg: { height: '60' },
              })}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Early 2023',
      content: (
        <div>
          <p
            class={css({
              marginBottom: '8',
              fontSize: 'xs',
              fontWeight: 'normal',
              color: 'neutral.800',
              md: { fontSize: 'sm' },
              _dark: { color: 'neutral.200' },
            })}
          >
            I usually run out of copy, but when I see content this big, I try to integrate lorem
            ipsum.
          </p>
          <p
            class={css({
              marginBottom: '8',
              fontSize: 'xs',
              fontWeight: 'normal',
              color: 'neutral.800',
              md: { fontSize: 'sm' },
              _dark: { color: 'neutral.200' },
            })}
          >
            Lorem ipsum is for people who are too lazy to write copy. But we are not. Here are some
            more example of beautiful designs I built.
          </p>
          <div
            class={css({
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '4',
            })}
          >
            <img
              src="https://assets.aceternity.com/pro/hero-sections.png"
              alt="hero template"
              width={500}
              height={500}
              class={css({
                height: '20',
                width: 'full',
                borderRadius: 'lg',
                objectFit: 'cover',
                boxShadow:
                  '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
                md: { height: '44' },
                lg: { height: '60' },
              })}
            />
            <img
              src="https://assets.aceternity.com/features-section.png"
              alt="feature template"
              width={500}
              height={500}
              class={css({
                height: '20',
                width: 'full',
                borderRadius: 'lg',
                objectFit: 'cover',
                boxShadow:
                  '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
                md: { height: '44' },
                lg: { height: '60' },
              })}
            />
            <img
              src="https://assets.aceternity.com/pro/bento-grids.png"
              alt="bento template"
              width={500}
              height={500}
              class={css({
                height: '20',
                width: 'full',
                borderRadius: 'lg',
                objectFit: 'cover',
                boxShadow:
                  '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
                md: { height: '44' },
                lg: { height: '60' },
              })}
            />
            <img
              src="https://assets.aceternity.com/cards.png"
              alt="cards template"
              width={500}
              height={500}
              class={css({
                height: '20',
                width: 'full',
                borderRadius: 'lg',
                objectFit: 'cover',
                boxShadow:
                  '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
                md: { height: '44' },
                lg: { height: '60' },
              })}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Changelog',
      content: (
        <div>
          <p
            class={css({
              marginBottom: '4',
              fontSize: 'xs',
              fontWeight: 'normal',
              color: 'neutral.800',
              md: { fontSize: 'sm' },
              _dark: { color: 'neutral.200' },
            })}
          >
            Deployed 5 new components on Aceternity today
          </p>
          <div class={css({ marginBottom: '8' })}>
            <div
              class={css({
                display: 'flex',
                alignItems: 'center',
                gap: '2',
                fontSize: 'xs',
                color: 'neutral.700',
                md: { fontSize: 'sm' },
                _dark: { color: 'neutral.300' },
              })}
            >
              ✅ Card grid component
            </div>
            <div
              class={css({
                display: 'flex',
                alignItems: 'center',
                gap: '2',
                fontSize: 'xs',
                color: 'neutral.700',
                md: { fontSize: 'sm' },
                _dark: { color: 'neutral.300' },
              })}
            >
              ✅ Startup template Aceternity
            </div>
            <div
              class={css({
                display: 'flex',
                alignItems: 'center',
                gap: '2',
                fontSize: 'xs',
                color: 'neutral.700',
                md: { fontSize: 'sm' },
                _dark: { color: 'neutral.300' },
              })}
            >
              ✅ Random file upload lol
            </div>
            <div
              class={css({
                display: 'flex',
                alignItems: 'center',
                gap: '2',
                fontSize: 'xs',
                color: 'neutral.700',
                md: { fontSize: 'sm' },
                _dark: { color: 'neutral.300' },
              })}
            >
              ✅ Himesh Reshammiya Music CD
            </div>
            <div
              class={css({
                display: 'flex',
                alignItems: 'center',
                gap: '2',
                fontSize: 'xs',
                color: 'neutral.700',
                md: { fontSize: 'sm' },
                _dark: { color: 'neutral.300' },
              })}
            >
              ✅ Salman Bhai Fan Club registrations open
            </div>
          </div>
          <div
            class={css({
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '4',
            })}
          >
            <img
              src="https://assets.aceternity.com/pro/hero-sections.png"
              alt="hero template"
              width={500}
              height={500}
              class={css({
                height: '20',
                width: 'full',
                borderRadius: 'lg',
                objectFit: 'cover',
                boxShadow:
                  '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
                md: { height: '44' },
                lg: { height: '60' },
              })}
            />
            <img
              src="https://assets.aceternity.com/features-section.png"
              alt="feature template"
              width={500}
              height={500}
              class={css({
                height: '20',
                width: 'full',
                borderRadius: 'lg',
                objectFit: 'cover',
                boxShadow:
                  '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
                md: { height: '44' },
                lg: { height: '60' },
              })}
            />
            <img
              src="https://assets.aceternity.com/pro/bento-grids.png"
              alt="bento template"
              width={500}
              height={500}
              class={css({
                height: '20',
                width: 'full',
                borderRadius: 'lg',
                objectFit: 'cover',
                boxShadow:
                  '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
                md: { height: '44' },
                lg: { height: '60' },
              })}
            />
            <img
              src="https://assets.aceternity.com/cards.png"
              alt="cards template"
              width={500}
              height={500}
              class={css({
                height: '20',
                width: 'full',
                borderRadius: 'lg',
                objectFit: 'cover',
                boxShadow:
                  '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
                md: { height: '44' },
                lg: { height: '60' },
              })}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div
      class={css({
        position: 'relative',
        width: 'full',
        overflow: 'clip',
      })}
    >
      <Timeline data={data} />
    </div>
  );
};

export default TimelineDemo;
