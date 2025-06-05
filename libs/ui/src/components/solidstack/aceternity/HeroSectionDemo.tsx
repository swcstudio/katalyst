import { Component, For, createSignal, onMount } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

// Navbar component
const Navbar: Component = () => {
  return (
    <nav class={css({
      display: 'flex',
      width: 'full',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTop: '1px solid',
      borderBottom: '1px solid',
      borderColor: 'neutral.200',
      paddingX: '4',
      paddingY: '4',
      _dark: {
        borderColor: 'neutral.800',
      },
    })}>
      <div class={css({
        display: 'flex',
        alignItems: 'center',
        gap: '2',
      })}>
        <div class={css({
          width: '7',
          height: '7',
          borderRadius: 'full',
          background: 'linear-gradient(to bottom right, violet.500, pink.500)',
        })} />
        <h1 class={css({
          fontSize: 'base',
          fontWeight: 'bold',
          md: {
            fontSize: '2xl',
          },
        })}>
          SolidStack UI
        </h1>
      </div>
      <button class={css({
        width: '24',
        transform: 'auto',
        borderRadius: 'lg',
        backgroundColor: 'black',
        paddingX: '6',
        paddingY: '2',
        fontWeight: 'medium',
        color: 'white',
        transition: 'all 0.3s',
        _hover: {
          translateY: '-0.5',
          backgroundColor: 'gray.800',
        },
        md: {
          width: '32',
        },
        _dark: {
          backgroundColor: 'white',
          color: 'black',
          _hover: {
            backgroundColor: 'gray.200',
          },
        },
      })}>
        Login
      </button>
    </nav>
  );
};

// Animated text component
const AnimatedText: Component<{ text: string }> = (props) => {
  const [visibleWords, setVisibleWords] = createSignal(0);
  const words = props.text.split(' ');
  
  onMount(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= words.length) {
        setVisibleWords(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  });
  
  return (
    <h1 class={css({
      position: 'relative',
      zIndex: '10',
      marginX: 'auto',
      maxWidth: '4xl',
      textAlign: 'center',
      fontSize: '2xl',
      fontWeight: 'bold',
      color: 'slate.700',
      md: {
        fontSize: '4xl',
      },
      lg: {
        fontSize: '7xl',
      },
      _dark: {
        color: 'slate.300',
      },
    })}>
      <For each={words}>
        {(word, index) => (
          <span 
            class={css({
              marginRight: '2',
              display: 'inline-block',
              opacity: index() < visibleWords() ? '1' : '0',
              filter: index() < visibleWords() ? 'blur(0px)' : 'blur(4px)',
              transform: index() < visibleWords() ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.3s ease-in-out',
            })}
          >
            {word}
          </span>
        )}
      </For>
    </h1>
  );
};

// Animated paragraph component
const AnimatedParagraph: Component = () => {
  const [isVisible, setIsVisible] = createSignal(false);
  
  onMount(() => {
    setTimeout(() => setIsVisible(true), 800);
  });
  
  return (
    <p class={css({
      position: 'relative',
      zIndex: '10',
      marginX: 'auto',
      maxWidth: 'xl',
      paddingY: '4',
      textAlign: 'center',
      fontSize: 'lg',
      fontWeight: 'normal',
      color: 'neutral.600',
      opacity: isVisible() ? '1' : '0',
      transition: 'opacity 0.3s',
      _dark: {
        color: 'neutral.400',
      },
    })}>
      With AI, you can launch your website in hours, not days. Try our best
      in class, state of the art, cutting edge AI tools to get your website
      up.
    </p>
  );
};

// Animated buttons component
const AnimatedButtons: Component = () => {
  const [isVisible, setIsVisible] = createSignal(false);
  
  onMount(() => {
    setTimeout(() => setIsVisible(true), 1000);
  });
  
  return (
    <div class={css({
      position: 'relative',
      zIndex: '10',
      marginTop: '8',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4',
      opacity: isVisible() ? '1' : '0',
      transition: 'opacity 0.3s',
    })}>
      <button class={css({
        width: '60',
        transform: 'auto',
        borderRadius: 'lg',
        backgroundColor: 'black',
        paddingX: '6',
        paddingY: '2',
        fontWeight: 'medium',
        color: 'white',
        transition: 'all 0.3s',
        _hover: {
          translateY: '-0.5',
          backgroundColor: 'gray.800',
        },
        _dark: {
          backgroundColor: 'white',
          color: 'black',
          _hover: {
            backgroundColor: 'gray.200',
          },
        },
      })}>
        Explore Now
      </button>
      <button class={css({
        width: '60',
        transform: 'auto',
        borderRadius: 'lg',
        border: '1px solid',
        borderColor: 'gray.300',
        backgroundColor: 'white',
        paddingX: '6',
        paddingY: '2',
        fontWeight: 'medium',
        color: 'black',
        transition: 'all 0.3s',
        _hover: {
          translateY: '-0.5',
          backgroundColor: 'gray.100',
        },
        _dark: {
          borderColor: 'gray.700',
          backgroundColor: 'black',
          color: 'white',
          _hover: {
            backgroundColor: 'gray.900',
          },
        },
      })}>
        Contact Support
      </button>
    </div>
  );
};

// Animated preview component
const AnimatedPreview: Component = () => {
  const [isVisible, setIsVisible] = createSignal(false);
  
  onMount(() => {
    setTimeout(() => setIsVisible(true), 1200);
  });
  
  return (
    <div class={css({
      position: 'relative',
      zIndex: '10',
      marginTop: '20',
      borderRadius: '3xl',
      border: '1px solid',
      borderColor: 'neutral.200',
      backgroundColor: 'neutral.100',
      padding: '4',
      boxShadow: 'md',
      opacity: isVisible() ? '1' : '0',
      transform: isVisible() ? 'translateY(0)' : 'translateY(10px)',
      transition: 'all 0.3s',
      _dark: {
        borderColor: 'neutral.800',
        backgroundColor: 'neutral.900',
      },
    })}>
      <div class={css({
        width: 'full',
        overflow: 'hidden',
        borderRadius: 'xl',
        border: '1px solid',
        borderColor: 'gray.300',
        _dark: {
          borderColor: 'gray.700',
        },
      })}>
        <img
          src="https://assets.aceternity.com/pro/aceternity-landing.webp"
          alt="Landing page preview"
          class={css({
            aspectRatio: '16/9',
            height: 'auto',
            width: 'full',
            objectFit: 'cover',
          })}
          height={1000}
          width={1000}
        />
      </div>
    </div>
  );
};

export const HeroSectionDemo: Component = () => {
  return (
    <div class={css({
      position: 'relative',
      marginX: 'auto',
      marginY: '10',
      display: 'flex',
      maxWidth: '7xl',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    })}>
      <Navbar />
      
      {/* Left border gradient */}
      <div class={css({
        position: 'absolute',
        insetY: '0',
        left: '0',
        height: 'full',
        width: 'px',
        backgroundColor: 'neutral.200/80',
        _dark: {
          backgroundColor: 'neutral.800/80',
        },
      })}>
        <div class={css({
          position: 'absolute',
          top: '0',
          height: '40',
          width: 'px',
          background: 'linear-gradient(to bottom, transparent, blue.500, transparent)',
        })} />
      </div>
      
      {/* Right border gradient */}
      <div class={css({
        position: 'absolute',
        insetY: '0',
        right: '0',
        height: 'full',
        width: 'px',
        backgroundColor: 'neutral.200/80',
        _dark: {
          backgroundColor: 'neutral.800/80',
        },
      })}>
        <div class={css({
          position: 'absolute',
          height: '40',
          width: 'px',
          background: 'linear-gradient(to bottom, transparent, blue.500, transparent)',
        })} />
      </div>
      
      {/* Bottom border gradient */}
      <div class={css({
        position: 'absolute',
        insetX: '0',
        bottom: '0',
        height: 'px',
        width: 'full',
        backgroundColor: 'neutral.200/80',
        _dark: {
          backgroundColor: 'neutral.800/80',
        },
      })}>
        <div class={css({
          position: 'absolute',
          marginX: 'auto',
          height: 'px',
          width: '40',
          background: 'linear-gradient(to right, transparent, blue.500, transparent)',
        })} />
      </div>
      
      <div class={css({
        paddingX: '4',
        paddingY: '10',
        md: {
          paddingY: '20',
        },
      })}>
        <AnimatedText text="Launch your website in hours, not days" />
        <AnimatedParagraph />
        <AnimatedButtons />
        <AnimatedPreview />
      </div>
    </div>
  );
};

export default HeroSectionDemo;