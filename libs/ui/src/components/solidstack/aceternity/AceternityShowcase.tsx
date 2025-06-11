import { css } from '@sse/ui/styled-system/css';
import type { Component } from 'solid-js';
import { HoverMotion, Motion, ScrollReveal, Stagger } from './core/motion';
import {
  SVGMaskEffectDemo,
  ShootingStarsAndStarsBackgroundDemo,
  SidebarDemo,
  SignupFormDemo,
  SparklesFullPagePreview,
  SparklesPreview,
  SpotlightPreview,
  StickyBannerDemo,
  StickyScrollRevealDemo,
  TabsDemo,
  TailwindcssButtons,
  TextGenerateEffectDemo,
  TextGenerateEffectDemoWithOptions,
  TextHoverEffectDemo,
  TimelineDemo,
  TracingBeamDemo,
  TypewriterEffectDemo,
  TypewriterEffectSmoothDemo,
} from './index';

export const AceternityShowcase: Component = () => {
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
          position: 'relative',
          overflow: 'hidden',
        })}
      >
        <Motion variant="fadeInDown" duration={0.8}>
          <h1
            class={css({
              fontSize: '4xl',
              fontWeight: 'bold',
              marginBottom: '16px',
              md: { fontSize: '6xl' },
            })}
          >
            Aceternity UI Showcase
          </h1>
        </Motion>
        <Motion variant="fadeInUp" delay={0.3} duration={0.8}>
          <p
            class={css({
              fontSize: 'xl',
              opacity: 0.9,
              maxWidth: '800px',
              marginX: 'auto',
            })}
          >
            Beautiful React components converted to SolidJS with stunning animations
          </p>
        </Motion>
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
        {/* Spotlight Section */}
        <ScrollReveal variant="fadeInUp" duration={0.8}>
          <section class={css({ textAlign: 'center' })}>
            <Motion variant="fadeIn" delay={0.2}>
              <h2
                class={css({
                  fontSize: '3xl',
                  fontWeight: 'bold',
                  marginBottom: '32px',
                  color: 'gray.800',
                  _dark: { color: 'white' },
                })}
              >
                Spotlight Effect
              </h2>
            </Motion>
            <HoverMotion scale={1.02} lift={true}>
              <div
                class={css({
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                })}
              >
                <SpotlightPreview />
              </div>
            </HoverMotion>
          </section>
        </ScrollReveal>

        {/* Shooting Stars Section */}
        <ScrollReveal variant="fadeInUp" duration={0.8}>
          <section class={css({ textAlign: 'center' })}>
            <Motion variant="fadeIn" delay={0.2}>
              <h2
                class={css({
                  fontSize: '3xl',
                  fontWeight: 'bold',
                  marginBottom: '32px',
                  color: 'gray.800',
                  _dark: { color: 'white' },
                })}
              >
                Shooting Stars & Background
              </h2>
            </Motion>
            <HoverMotion scale={1.02} lift={true}>
              <div
                class={css({
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                })}
              >
                <ShootingStarsAndStarsBackgroundDemo />
              </div>
            </HoverMotion>
          </section>
        </ScrollReveal>

        {/* Sparkles Section */}
        <ScrollReveal variant="fadeInUp" duration={0.8}>
          <section class={css({ textAlign: 'center' })}>
            <Motion variant="fadeIn" delay={0.2}>
              <h2
                class={css({
                  fontSize: '3xl',
                  fontWeight: 'bold',
                  marginBottom: '32px',
                  color: 'gray.800',
                  _dark: { color: 'white' },
                })}
              >
                Sparkles Animation
              </h2>
            </Motion>
            <Stagger staggerDelay={0.2} variant="scaleIn">
              <div
                class={css({
                  display: 'grid',
                  gap: '32px',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
                  justifyItems: 'center',
                })}
              >
                <HoverMotion scale={1.02} lift={true}>
                  <SparklesPreview />
                </HoverMotion>
                <HoverMotion scale={1.02} lift={true}>
                  <SparklesFullPagePreview />
                </HoverMotion>
              </div>
            </Stagger>
          </section>
        </ScrollReveal>

        {/* Text Effects Section */}
        <ScrollReveal variant="fadeInUp" duration={0.8}>
          <section class={css({ textAlign: 'center' })}>
            <Motion variant="fadeIn" delay={0.2}>
              <h2
                class={css({
                  fontSize: '3xl',
                  fontWeight: 'bold',
                  marginBottom: '32px',
                  color: 'gray.800',
                  _dark: { color: 'white' },
                })}
              >
                Text Generation Effects
              </h2>
            </Motion>
            <Stagger staggerDelay={0.3} variant="fadeInUp">
              <div
                class={css({
                  display: 'grid',
                  gap: '32px',
                  justifyItems: 'center',
                })}
              >
                <HoverMotion scale={1.02} lift={true}>
                  <div
                    class={css({
                      padding: '8',
                      backgroundColor: 'white',
                      borderRadius: 'lg',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      _dark: { backgroundColor: 'gray.800' },
                    })}
                  >
                    <h3
                      class={css({
                        fontSize: 'xl',
                        fontWeight: 'semibold',
                        marginBottom: '16px',
                        color: 'gray.700',
                        _dark: { color: 'gray.300' },
                      })}
                    >
                      Basic Text Generate Effect
                    </h3>
                    <TextGenerateEffectDemo />
                  </div>
                </HoverMotion>
                <HoverMotion scale={1.02} lift={true}>
                  <div
                    class={css({
                      padding: '8',
                      backgroundColor: 'white',
                      borderRadius: 'lg',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      _dark: { backgroundColor: 'gray.800' },
                    })}
                  >
                    <h3
                      class={css({
                        fontSize: 'xl',
                        fontWeight: 'semibold',
                        marginBottom: '16px',
                        color: 'gray.700',
                        _dark: { color: 'gray.300' },
                      })}
                    >
                      Text Generate with Options
                    </h3>
                    <TextGenerateEffectDemoWithOptions />
                  </div>
                </HoverMotion>
              </div>
            </Stagger>
          </section>
        </ScrollReveal>

        {/* Typewriter Effects Section */}
        <ScrollReveal variant="fadeInUp" duration={0.8}>
          <section class={css({ textAlign: 'center' })}>
            <Motion variant="fadeIn" delay={0.2}>
              <h2
                class={css({
                  fontSize: '3xl',
                  fontWeight: 'bold',
                  marginBottom: '32px',
                  color: 'gray.800',
                  _dark: { color: 'white' },
                })}
              >
                Typewriter Effects
              </h2>
            </Motion>
            <Stagger staggerDelay={0.2} variant="scaleIn">
              <div
                class={css({
                  display: 'grid',
                  gap: '32px',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
                  justifyItems: 'center',
                })}
              >
                <HoverMotion scale={1.02} lift={true}>
                  <div
                    class={css({
                      padding: '8',
                      backgroundColor: 'white',
                      borderRadius: 'lg',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      _dark: { backgroundColor: 'gray.800' },
                    })}
                  >
                    <h3
                      class={css({
                        fontSize: 'xl',
                        fontWeight: 'semibold',
                        marginBottom: '16px',
                        color: 'gray.700',
                        _dark: { color: 'gray.300' },
                      })}
                    >
                      Smooth Typewriter
                    </h3>
                    <TypewriterEffectSmoothDemo />
                  </div>
                </HoverMotion>
                <HoverMotion scale={1.02} lift={true}>
                  <div
                    class={css({
                      padding: '8',
                      backgroundColor: 'white',
                      borderRadius: 'lg',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      _dark: { backgroundColor: 'gray.800' },
                    })}
                  >
                    <h3
                      class={css({
                        fontSize: 'xl',
                        fontWeight: 'semibold',
                        marginBottom: '16px',
                        color: 'gray.700',
                        _dark: { color: 'gray.300' },
                      })}
                    >
                      Classic Typewriter
                    </h3>
                    <TypewriterEffectDemo />
                  </div>
                </HoverMotion>
              </div>
            </Stagger>
          </section>
        </ScrollReveal>

        {/* Sticky Banner Section */}
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
            Sticky Banner
          </h2>
          <div
            class={css({
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 'lg',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              _dark: { backgroundColor: 'gray.800' },
            })}
          >
            <StickyBannerDemo />
          </div>
        </section>

        {/* Advanced Components Section */}
        <ScrollReveal variant="fadeInUp" duration={0.8}>
          <section class={css({ textAlign: 'center' })}>
            <Motion variant="fadeIn" delay={0.2}>
              <h2
                class={css({
                  fontSize: '3xl',
                  fontWeight: 'bold',
                  marginBottom: '32px',
                  color: 'gray.800',
                  _dark: { color: 'white' },
                })}
              >
                Advanced UI Components
              </h2>
            </Motion>
            <Stagger staggerDelay={0.3} variant="fadeInUp">
              <div
                class={css({
                  display: 'grid',
                  gap: '48px',
                  justifyItems: 'center',
                })}
              >
                <HoverMotion scale={1.01} lift={true}>
                  <div
                    class={css({
                      width: 'full',
                      maxWidth: '1200px',
                    })}
                  >
                    <h3
                      class={css({
                        fontSize: 'xl',
                        fontWeight: 'semibold',
                        marginBottom: '16px',
                        color: 'gray.700',
                        _dark: { color: 'gray.300' },
                      })}
                    >
                      Interactive Sidebar
                    </h3>
                    <SidebarDemo />
                  </div>
                </HoverMotion>
                <HoverMotion scale={1.01} lift={true}>
                  <div
                    class={css({
                      width: 'full',
                      maxWidth: '1200px',
                    })}
                  >
                    <h3
                      class={css({
                        fontSize: 'xl',
                        fontWeight: 'semibold',
                        marginBottom: '16px',
                        color: 'gray.700',
                        _dark: { color: 'gray.300' },
                      })}
                    >
                      Dynamic Tabs
                    </h3>
                    <TabsDemo />
                  </div>
                </HoverMotion>
                <HoverMotion scale={1.01} lift={true}>
                  <div
                    class={css({
                      width: 'full',
                      maxWidth: '1200px',
                    })}
                  >
                    <h3
                      class={css({
                        fontSize: 'xl',
                        fontWeight: 'semibold',
                        marginBottom: '16px',
                        color: 'gray.700',
                        _dark: { color: 'gray.300' },
                      })}
                    >
                      Text Hover Effect
                    </h3>
                    <TextHoverEffectDemo />
                  </div>
                </HoverMotion>
              </div>
            </Stagger>
          </section>
        </ScrollReveal>

        {/* Buttons Showcase Section */}
        <ScrollReveal variant="fadeInUp" duration={0.8}>
          <section class={css({ textAlign: 'center' })}>
            <Motion variant="fadeIn" delay={0.2}>
              <h2
                class={css({
                  fontSize: '3xl',
                  fontWeight: 'bold',
                  marginBottom: '32px',
                  color: 'gray.800',
                  _dark: { color: 'white' },
                })}
              >
                Button Components
              </h2>
            </Motion>
            <Motion variant="scaleIn" delay={0.4}>
              <TailwindcssButtons />
            </Motion>
          </section>
        </ScrollReveal>

        {/* Signup Form Section */}
        <ScrollReveal variant="fadeInUp" duration={0.8}>
          <section class={css({ textAlign: 'center' })}>
            <Motion variant="fadeIn" delay={0.2}>
              <h2
                class={css({
                  fontSize: '3xl',
                  fontWeight: 'bold',
                  marginBottom: '32px',
                  color: 'gray.800',
                  _dark: { color: 'white' },
                })}
              >
                Animated Signup Form
              </h2>
            </Motion>
            <HoverMotion scale={1.02} lift={true}>
              <div
                class={css({
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '32px',
                })}
              >
                <SignupFormDemo />
              </div>
            </HoverMotion>
          </section>
        </ScrollReveal>
      </div>

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
          Aceternity UI for SolidJS
        </h3>
        <p
          class={css({
            color: 'gray.600',
            marginBottom: '24px',
            _dark: { color: 'gray.400' },
          })}
        >
          Beautiful, performant components converted from React to SolidJS
        </p>
        <div
          class={css({
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
            Aceternity
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

export default AceternityShowcase;
