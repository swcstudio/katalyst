import { css } from '@sse/ui/styled-system/css';
import type { Component } from 'solid-js';
import {
  AuthorCardDemo,
  CardDemo,
  CarouselDemo,
  CodeBlockDemo,
  ColourfulTextDemo,
  CompareDemo,
  CoverDemo,
  DirectionAwareHoverDemo,
  FeaturesSectionWithGlobeDemo,
  FlipWordsDemo,
  GlowingStarsBackgroundCardPreview,
  GridFeaturesSectionDemo,
  HeroHighlightDemo,
  HeroScrollDemo,
  HoverCardDemo,
  IconFeaturesSection,
  InfiniteMovingCardsDemo,
  LampDemo,
  LayoutGridDemo,
  MeteorsDemo,
  ParallaxScrollDemo,
  PlaceholdersAndVanishInputDemo,
} from '../magicui/index';

export const SolidStackNewComponentsDemo: Component = () => {
  return (
    <div
      class={css({
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'gray.50',
        _dark: { backgroundColor: 'gray.900' },
      })}
    >
      {/* Header */}
      <div
        class={css({
          padding: '80px 24px 40px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        })}
      >
        <h1
          class={css({
            fontSize: '4xl',
            fontWeight: 'bold',
            marginBottom: '16px',
            md: { fontSize: '6xl' },
          })}
        >
          SolidStack-UI Showcase
        </h1>
        <p
          class={css({
            fontSize: 'xl',
            opacity: 0.9,
            maxWidth: '800px',
            marginX: 'auto',
          })}
        >
          Advanced React-to-SolidJS converted components with Motion animations
        </p>
      </div>

      {/* Components Grid */}
      <div
        class={css({
          maxWidth: '1400px',
          marginX: 'auto',
          padding: '80px 24px',
          display: 'grid',
          gap: '80px',
        })}
      >
        {/* Card Skeleton Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Animated Card Skeleton
          </h2>
          <div
            class={css({
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '500px',
            })}
          >
            <CardDemo />
          </div>
        </section>

        {/* Colourful Text Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Animated Colourful Text
          </h2>
          <ColourfulTextDemo />
        </section>

        {/* Cover Text Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Cover Text Effect
          </h2>
          <CoverDemo />
        </section>

        {/* Hover Cards Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Interactive Hover Cards
          </h2>
          <div
            class={css({
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              justifyItems: 'center',
            })}
          >
            <HoverCardDemo />
            <AuthorCardDemo />
          </div>
        </section>

        {/* Direction Aware Hover Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Direction Aware Hover
          </h2>
          <DirectionAwareHoverDemo />
        </section>

        {/* Carousel Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Interactive Carousel
          </h2>
          <CarouselDemo />
        </section>

        {/* Code Block Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Syntax Highlighted Code Block
          </h2>
          <CodeBlockDemo />
        </section>

        {/* Compare Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Before/After Compare
          </h2>
          <div
            class={css({
              display: 'flex',
              justifyContent: 'center',
            })}
          >
            <CompareDemo />
          </div>
        </section>

        {/* Features Section with Globe */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Advanced Features with 3D Globe
          </h2>
          <FeaturesSectionWithGlobeDemo />
        </section>

        {/* Grid Features Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Grid Features Layout
          </h2>
          <GridFeaturesSectionDemo />
        </section>

        {/* Icon Features Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Icon-Based Features
          </h2>
          <IconFeaturesSection />
        </section>

        {/* Flip Words Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Animated Flip Words
          </h2>
          <FlipWordsDemo />
        </section>

        {/* Infinite Moving Cards Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Infinite Moving Testimonials
          </h2>
          <InfiniteMovingCardsDemo />
        </section>

        {/* Glowing Stars Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Glowing Stars Card
          </h2>
          <GlowingStarsBackgroundCardPreview />
        </section>

        {/* Meteors Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Meteors Effect
          </h2>
          <MeteorsDemo />
        </section>

        {/* Layout Grid Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Interactive Layout Grid
          </h2>
          <LayoutGridDemo />
        </section>

        {/* Placeholders Input Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Animated Input with Placeholders
          </h2>
          <PlaceholdersAndVanishInputDemo />
        </section>

        {/* Parallax Scroll Section */}
        <section class={css({ textAlign: 'center' })}>
          <h2
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: 'gray.800',
              _dark: { color: 'white' },
            })}
          >
            Parallax Scroll Gallery
          </h2>
          <ParallaxScrollDemo />
        </section>
      </div>

      {/* Lamp Section - Full height */}
      <section>
        <LampDemo />
      </section>

      {/* Hero Highlight Section - Full height */}
      <section>
        <HeroHighlightDemo />
      </section>

      {/* Container Scroll Section - Full height */}
      <section>
        <HeroScrollDemo />
      </section>

      {/* Footer */}
      <footer
        class={css({
          padding: '60px 24px',
          textAlign: 'center',
          backgroundColor: 'gray.100',
          _dark: { backgroundColor: 'gray.800' },
        })}
      >
        <h3
          class={css({
            fontSize: '2xl',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: 'gray.800',
            _dark: { color: 'white' },
          })}
        >
          SolidStack-UI Component Library
        </h3>
        <p
          class={css({
            color: 'gray.600',
            _dark: { color: 'gray.400' },
          })}
        >
          High-performance SolidJS components converted from React with Motion animations
        </p>
        <div
          class={css({
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          })}
        >
          <span
            class={css({
              paddingX: '12px',
              paddingY: '6px',
              backgroundColor: 'blue.100',
              color: 'blue.800',
              borderRadius: '20px',
              fontSize: 'sm',
              fontWeight: '500',
              _dark: {
                backgroundColor: 'blue.900',
                color: 'blue.200',
              },
            })}
          >
            SolidJS
          </span>
          <span
            class={css({
              paddingX: '12px',
              paddingY: '6px',
              backgroundColor: 'purple.100',
              color: 'purple.800',
              borderRadius: '20px',
              fontSize: 'sm',
              fontWeight: '500',
              _dark: {
                backgroundColor: 'purple.900',
                color: 'purple.200',
              },
            })}
          >
            Motion
          </span>
          <span
            class={css({
              paddingX: '12px',
              paddingY: '6px',
              backgroundColor: 'green.100',
              color: 'green.800',
              borderRadius: '20px',
              fontSize: 'sm',
              fontWeight: '500',
              _dark: {
                backgroundColor: 'green.900',
                color: 'green.200',
              },
            })}
          >
            PandaCSS
          </span>
          <span
            class={css({
              paddingX: '12px',
              paddingY: '6px',
              backgroundColor: 'orange.100',
              color: 'orange.800',
              borderRadius: '20px',
              fontSize: 'sm',
              fontWeight: '500',
              _dark: {
                backgroundColor: 'orange.900',
                color: 'orange.200',
              },
            })}
          >
            TypeScript
          </span>
        </div>
      </footer>
    </div>
  );
};

export default SolidStackNewComponentsDemo;
