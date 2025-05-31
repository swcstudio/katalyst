import { Component, For, createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

interface ContentItem {
  title: string;
  description: string;
  content: any;
}

// Placeholder StickyScroll component - this would need to be implemented separately
const StickyScroll: Component<{
  content: ContentItem[];
}> = (props) => {
  const [activeIndex, setActiveIndex] = createSignal(0);

  onMount(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const index = Math.floor(scrollY / (windowHeight * 0.5));
      setActiveIndex(Math.min(index, props.content.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    onCleanup(() => window.removeEventListener('scroll', handleScroll));
  });

  return (
    <div class={css({
      position: 'relative',
      width: 'full',
    })}>
      <div class={css({
        display: 'flex',
        minHeight: 'screen',
      })}>
        {/* Content Side */}
        <div class={css({
          flex: '1',
          paddingY: '20',
          paddingX: '8',
        })}>
          <For each={props.content}>
            {(item, index) => (
              <div class={css({
                minHeight: 'screen',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingY: '20',
                position: 'sticky',
                top: '0',
                opacity: activeIndex() === index() ? 1 : 0.3,
                transition: 'opacity 0.5s ease',
              })}>
                <h2 class={css({
                  fontSize: '3xl',
                  fontWeight: 'bold',
                  marginBottom: '6',
                  color: 'gray.900',
                  _dark: { color: 'white' },
                  md: { fontSize: '4xl' },
                })}>
                  {item.title}
                </h2>
                <p class={css({
                  fontSize: 'lg',
                  lineHeight: 'relaxed',
                  color: 'gray.600',
                  maxWidth: '2xl',
                  _dark: { color: 'gray.300' },
                })}>
                  {item.description}
                </p>
              </div>
            )}
          </For>
        </div>

        {/* Visual Side */}
        <div class={css({
          flex: '1',
          position: 'sticky',
          top: '20',
          height: 'screen',
          paddingY: '20',
          paddingX: '8',
        })}>
          <div class={css({
            width: 'full',
            height: 'full',
            borderRadius: 'xl',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          })}>
            <For each={props.content}>
              {(item, index) => (
                <div 
                  class={css({
                    width: 'full',
                    height: 'full',
                    position: 'absolute',
                    inset: '0',
                    opacity: activeIndex() === index() ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                  })}
                  style={{
                    display: activeIndex() === index() ? 'block' : 'none',
                  }}
                >
                  {item.content}
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StickyScrollRevealDemo: Component = () => {
  const content: ContentItem[] = [
    {
      title: "Collaborative Editing",
      description:
        "Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.",
      content: (
        <div class={css({
          display: 'flex',
          height: 'full',
          width: 'full',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, rgb(6, 182, 212), rgb(16, 185, 129))', // cyan-500 to emerald-500
          color: 'white',
          fontSize: '2xl',
          fontWeight: 'bold',
        })}>
          Collaborative Editing
        </div>
      ),
    },
    {
      title: "Real time changes",
      description:
        "See changes as they happen. With our platform, you can track every modification in real time. No more confusion about the latest version of your project. Say goodbye to the chaos of version control and embrace the simplicity of real-time updates.",
      content: (
        <div class={css({
          display: 'flex',
          height: 'full',
          width: 'full',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        })}>
          <img
            src="/linear.webp"
            width={300}
            height={300}
            class={css({
              height: 'full',
              width: 'full',
              objectFit: 'cover',
            })}
            alt="linear board demo"
          />
        </div>
      ),
    },
    {
      title: "Version control",
      description:
        "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
      content: (
        <div class={css({
          display: 'flex',
          height: 'full',
          width: 'full',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, rgb(249, 115, 22), rgb(234, 179, 8))', // orange-500 to yellow-500
          color: 'white',
          fontSize: '2xl',
          fontWeight: 'bold',
        })}>
          Version control
        </div>
      ),
    },
    {
      title: "Running out of content",
      description:
        "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
      content: (
        <div class={css({
          display: 'flex',
          height: 'full',
          width: 'full',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, rgb(6, 182, 212), rgb(16, 185, 129))', // cyan-500 to emerald-500
          color: 'white',
          fontSize: '2xl',
          fontWeight: 'bold',
        })}>
          Running out of content
        </div>
      ),
    },
  ];

  return (
    <div class={css({
      width: 'full',
      paddingY: '4',
    })}>
      <StickyScroll content={content} />
    </div>
  );
};

export default StickyScrollRevealDemo;