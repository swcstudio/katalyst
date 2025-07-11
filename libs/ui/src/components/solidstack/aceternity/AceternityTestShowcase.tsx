import { css } from '@sse/ui/styled-system/css';
import { type Component, createSignal, For } from 'solid-js';
import {
  HoverMotion,
  Motion,
  motionPresets,
  ScrollReveal,
  ShootingStars,
  ShootingStarsAndStarsBackgroundDemo,
  SidebarDemo,
  SignupFormDemo,
  SparklesCore,
  SparklesFullPagePreview,
  SparklesPreview,
  SpotlightPreview,
  Stagger,
  StarsBackground,
  StickyBannerDemo,
  StickyScrollRevealDemo,
  SVGMaskEffectDemo,
  TabsDemo,
  TailwindcssButtons,
  TextGenerateEffect,
  TextGenerateEffectDemo,
  TextGenerateEffectDemoWithOptions,
  TextHoverEffectDemo,
  TimelineDemo,
  TracingBeamDemo,
  TypewriterEffectDemo,
  TypewriterEffectSmoothDemo,
} from './index';

interface TestSection {
  id: string;
  title: string;
  description: string;
  component: Component;
  category: 'animation' | 'interaction' | 'core' | 'motion';
}

export const AceternityTestShowcase: Component = () => {
  const [activeCategory, setActiveCategory] = createSignal<string>('all');
  const [testResults, setTestResults] = createSignal<Record<string, boolean>>({});

  const testSections: TestSection[] = [
    // Core Components
    {
      id: 'sparkles-core',
      title: 'Sparkles Core Component',
      description: 'Test the core sparkles particle system',
      category: 'core',
      component: () => (
        <div
          class={css({
            height: '300px',
            width: '100%',
            position: 'relative',
            backgroundColor: 'black',
            borderRadius: 'md',
          })}
        >
          <SparklesCore particleDensity={500} minSize={0.5} maxSize={2} particleColor="#00D4FF" />
        </div>
      ),
    },
    {
      id: 'shooting-stars-core',
      title: 'Shooting Stars Core',
      description: 'Test the shooting stars animation system',
      category: 'core',
      component: () => (
        <div
          class={css({
            height: '300px',
            width: '100%',
            position: 'relative',
            backgroundColor: 'black',
            borderRadius: 'md',
          })}
        >
          <ShootingStars starCount={5} starColor="#FFD700" trailLength={120} />
        </div>
      ),
    },
    {
      id: 'stars-background-core',
      title: 'Stars Background Core',
      description: 'Test the twinkling stars background',
      category: 'core',
      component: () => (
        <div
          class={css({
            height: '300px',
            width: '100%',
            position: 'relative',
            backgroundColor: 'black',
            borderRadius: 'md',
          })}
        >
          <StarsBackground starCount={150} twinkleSpeed={0.05} />
        </div>
      ),
    },
    {
      id: 'text-generate-core',
      title: 'Text Generate Effect Core',
      description: 'Test the text generation animation',
      category: 'core',
      component: () => (
        <div class={css({ padding: '4', backgroundColor: 'white', borderRadius: 'md' })}>
          <TextGenerateEffect
            words="This is a test of the text generation effect component."
            duration={2}
            mode="words"
            filter={true}
          />
        </div>
      ),
    },

    // Motion Components
    {
      id: 'motion-basic',
      title: 'Basic Motion Component',
      description: 'Test basic motion animations',
      category: 'motion',
      component: () => (
        <Stagger staggerDelay={0.2} variant="fadeInUp">
          <div class={css({ display: 'flex', gap: '4', flexWrap: 'wrap' })}>
            <Motion variant="fadeIn" duration={0.5}>
              <div
                class={css({
                  padding: '4',
                  backgroundColor: 'blue.500',
                  color: 'white',
                  borderRadius: 'md',
                })}
              >
                Fade In
              </div>
            </Motion>
            <Motion variant="scaleIn" duration={0.5}>
              <div
                class={css({
                  padding: '4',
                  backgroundColor: 'green.500',
                  color: 'white',
                  borderRadius: 'md',
                })}
              >
                Scale In
              </div>
            </Motion>
            <Motion variant="slideInLeft" duration={0.5}>
              <div
                class={css({
                  padding: '4',
                  backgroundColor: 'purple.500',
                  color: 'white',
                  borderRadius: 'md',
                })}
              >
                Slide Left
              </div>
            </Motion>
          </div>
        </Stagger>
      ),
    },
    {
      id: 'hover-motion',
      title: 'Hover Motion Effects',
      description: 'Test hover-based animations',
      category: 'motion',
      component: () => (
        <div class={css({ display: 'flex', gap: '4', flexWrap: 'wrap' })}>
          <HoverMotion scale={1.1} rotate={5} lift={true}>
            <div
              class={css({
                padding: '6',
                backgroundColor: 'orange.500',
                color: 'white',
                borderRadius: 'md',
                cursor: 'pointer',
              })}
            >
              Hover Scale + Rotate
            </div>
          </HoverMotion>
          <HoverMotion scale={1.05} lift={true}>
            <div
              class={css({
                padding: '6',
                backgroundColor: 'red.500',
                color: 'white',
                borderRadius: 'md',
                cursor: 'pointer',
              })}
            >
              Hover Lift
            </div>
          </HoverMotion>
        </div>
      ),
    },

    // Animation Components
    {
      id: 'spotlight-preview',
      title: 'Spotlight Effect',
      description: 'Test spotlight background effect',
      category: 'animation',
      component: SpotlightPreview,
    },
    {
      id: 'shooting-stars-demo',
      title: 'Shooting Stars Demo',
      description: 'Combined shooting stars and background',
      category: 'animation',
      component: ShootingStarsAndStarsBackgroundDemo,
    },
    {
      id: 'sparkles-preview',
      title: 'Sparkles Preview',
      description: 'Sparkles with gradient effects',
      category: 'animation',
      component: SparklesPreview,
    },
    {
      id: 'text-generate-demo',
      title: 'Text Generate Demo',
      description: 'Text generation with word animation',
      category: 'animation',
      component: TextGenerateEffectDemo,
    },
    {
      id: 'typewriter-smooth',
      title: 'Typewriter Smooth',
      description: 'Smooth typewriter effect',
      category: 'animation',
      component: TypewriterEffectSmoothDemo,
    },
    {
      id: 'text-hover-effect',
      title: 'Text Hover Effect',
      description: 'Interactive text hover animations',
      category: 'animation',
      component: TextHoverEffectDemo,
    },

    // Interactive Components
    {
      id: 'sidebar-demo',
      title: 'Interactive Sidebar',
      description: 'Collapsible sidebar with navigation',
      category: 'interaction',
      component: SidebarDemo,
    },
    {
      id: 'tabs-demo',
      title: 'Dynamic Tabs',
      description: 'Animated tab switching',
      category: 'interaction',
      component: TabsDemo,
    },
    {
      id: 'signup-form',
      title: 'Signup Form',
      description: 'Animated form with social logins',
      category: 'interaction',
      component: SignupFormDemo,
    },
    {
      id: 'sticky-banner',
      title: 'Sticky Banner',
      description: 'Sticky notification banner',
      category: 'interaction',
      component: StickyBannerDemo,
    },
    {
      id: 'svg-mask-effect',
      title: 'SVG Mask Effect',
      description: 'Reveal text with mask animation',
      category: 'interaction',
      component: SVGMaskEffectDemo,
    },
  ];

  const categories = ['all', 'core', 'motion', 'animation', 'interaction'];

  const filteredSections = () => {
    if (activeCategory() === 'all') return testSections;
    return testSections.filter((section) => section.category === activeCategory());
  };

  const markTestResult = (testId: string, passed: boolean) => {
    setTestResults((prev) => ({ ...prev, [testId]: passed }));
  };

  const getTestStatus = (testId: string) => {
    return testResults()[testId];
  };

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
      <ScrollReveal variant="fadeInDown" duration={0.8}>
        <div
          class={css({
            padding: '60px 24px 40px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
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
            Aceternity Components Test Suite
          </h1>
          <p
            class={css({
              fontSize: 'lg',
              opacity: 0.9,
              maxWidth: '800px',
              marginX: 'auto',
            })}
          >
            Comprehensive testing environment for all converted SolidJS components
          </p>
        </div>
      </ScrollReveal>

      {/* Category Filter */}
      <div
        class={css({
          padding: '20px 24px',
          borderBottom: '1px solid',
          borderColor: 'gray.200',
          _dark: { borderColor: 'gray.700' },
        })}
      >
        <div
          class={css({
            maxWidth: '1200px',
            marginX: 'auto',
            display: 'flex',
            gap: '4',
            justifyContent: 'center',
            flexWrap: 'wrap',
          })}
        >
          <For each={categories}>
            {(category) => (
              <button
                class={css({
                  paddingX: '6',
                  paddingY: '3',
                  borderRadius: 'lg',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  transition: 'all 0.2s',
                  backgroundColor: activeCategory() === category ? 'blue.500' : 'gray.200',
                  color: activeCategory() === category ? 'white' : 'gray.700',
                  _hover: {
                    backgroundColor: activeCategory() === category ? 'blue.600' : 'gray.300',
                  },
                  _dark: {
                    backgroundColor: activeCategory() === category ? 'blue.600' : 'gray.700',
                    color: activeCategory() === category ? 'white' : 'gray.300',
                  },
                })}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            )}
          </For>
        </div>
      </div>

      {/* Test Components Grid */}
      <div
        class={css({
          maxWidth: '1400px',
          marginX: 'auto',
          padding: '40px 24px',
          display: 'grid',
          gap: '40px',
        })}
      >
        <For each={filteredSections()}>
          {(section, index) => (
            <ScrollReveal variant="fadeInUp" duration={0.6}>
              <div
                class={css({
                  backgroundColor: 'white',
                  borderRadius: 'xl',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  _dark: { backgroundColor: 'gray.800' },
                })}
              >
                {/* Test Header */}
                <div
                  class={css({
                    padding: '6',
                    borderBottom: '1px solid',
                    borderColor: 'gray.200',
                    _dark: { borderColor: 'gray.700' },
                  })}
                >
                  <div
                    class={css({
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '2',
                    })}
                  >
                    <h3
                      class={css({
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        color: 'gray.900',
                        _dark: { color: 'white' },
                      })}
                    >
                      {section.title}
                    </h3>
                    <div class={css({ display: 'flex', gap: '2' })}>
                      <span
                        class={css({
                          paddingX: '3',
                          paddingY: '1',
                          fontSize: 'xs',
                          fontWeight: 'medium',
                          borderRadius: 'full',
                          backgroundColor:
                            section.category === 'core'
                              ? 'red.100'
                              : section.category === 'motion'
                                ? 'blue.100'
                                : section.category === 'animation'
                                  ? 'green.100'
                                  : 'purple.100',
                          color:
                            section.category === 'core'
                              ? 'red.800'
                              : section.category === 'motion'
                                ? 'blue.800'
                                : section.category === 'animation'
                                  ? 'green.800'
                                  : 'purple.800',
                        })}
                      >
                        {section.category}
                      </span>
                      {getTestStatus(section.id) !== undefined && (
                        <span
                          class={css({
                            paddingX: '3',
                            paddingY: '1',
                            fontSize: 'xs',
                            fontWeight: 'medium',
                            borderRadius: 'full',
                            backgroundColor: getTestStatus(section.id) ? 'green.100' : 'red.100',
                            color: getTestStatus(section.id) ? 'green.800' : 'red.800',
                          })}
                        >
                          {getTestStatus(section.id) ? '✓ Pass' : '✗ Fail'}
                        </span>
                      )}
                    </div>
                  </div>
                  <p
                    class={css({
                      fontSize: 'sm',
                      color: 'gray.600',
                      _dark: { color: 'gray.400' },
                    })}
                  >
                    {section.description}
                  </p>
                  <div
                    class={css({
                      display: 'flex',
                      gap: '2',
                      marginTop: '3',
                    })}
                  >
                    <button
                      class={css({
                        paddingX: '4',
                        paddingY: '2',
                        fontSize: 'sm',
                        fontWeight: 'medium',
                        borderRadius: 'md',
                        backgroundColor: 'green.500',
                        color: 'white',
                        _hover: { backgroundColor: 'green.600' },
                      })}
                      onClick={() => markTestResult(section.id, true)}
                    >
                      Mark Pass
                    </button>
                    <button
                      class={css({
                        paddingX: '4',
                        paddingY: '2',
                        fontSize: 'sm',
                        fontWeight: 'medium',
                        borderRadius: 'md',
                        backgroundColor: 'red.500',
                        color: 'white',
                        _hover: { backgroundColor: 'red.600' },
                      })}
                      onClick={() => markTestResult(section.id, false)}
                    >
                      Mark Fail
                    </button>
                  </div>
                </div>

                {/* Test Component */}
                <Motion variant="fadeIn" delay={index() * 0.1}>
                  <div
                    class={css({
                      padding: '6',
                      minHeight: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    })}
                  >
                    <div class={css({ width: '100%' })}>
                      <section.component />
                    </div>
                  </div>
                </Motion>
              </div>
            </ScrollReveal>
          )}
        </For>
      </div>

      {/* Test Summary */}
      <div
        class={css({
          padding: '40px 24px',
          backgroundColor: 'gray.100',
          _dark: { backgroundColor: 'gray.800' },
        })}
      >
        <div
          class={css({
            maxWidth: '800px',
            marginX: 'auto',
            textAlign: 'center',
          })}
        >
          <h2
            class={css({
              fontSize: '2xl',
              fontWeight: 'bold',
              marginBottom: '4',
              color: 'gray.900',
              _dark: { color: 'white' },
            })}
          >
            Test Results Summary
          </h2>
          <div
            class={css({
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '4',
              marginTop: '6',
            })}
          >
            <div
              class={css({
                padding: '4',
                backgroundColor: 'white',
                borderRadius: 'lg',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                _dark: { backgroundColor: 'gray.700' },
              })}
            >
              <div
                class={css({
                  fontSize: '2xl',
                  fontWeight: 'bold',
                  color: 'blue.600',
                })}
              >
                {testSections.length}
              </div>
              <div
                class={css({
                  fontSize: 'sm',
                  color: 'gray.600',
                  _dark: { color: 'gray.400' },
                })}
              >
                Total Tests
              </div>
            </div>
            <div
              class={css({
                padding: '4',
                backgroundColor: 'white',
                borderRadius: 'lg',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                _dark: { backgroundColor: 'gray.700' },
              })}
            >
              <div
                class={css({
                  fontSize: '2xl',
                  fontWeight: 'bold',
                  color: 'green.600',
                })}
              >
                {Object.values(testResults()).filter(Boolean).length}
              </div>
              <div
                class={css({
                  fontSize: 'sm',
                  color: 'gray.600',
                  _dark: { color: 'gray.400' },
                })}
              >
                Passed
              </div>
            </div>
            <div
              class={css({
                padding: '4',
                backgroundColor: 'white',
                borderRadius: 'lg',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                _dark: { backgroundColor: 'gray.700' },
              })}
            >
              <div
                class={css({
                  fontSize: '2xl',
                  fontWeight: 'bold',
                  color: 'red.600',
                })}
              >
                {Object.values(testResults()).filter((result) => result === false).length}
              </div>
              <div
                class={css({
                  fontSize: 'sm',
                  color: 'gray.600',
                  _dark: { color: 'gray.400' },
                })}
              >
                Failed
              </div>
            </div>
            <div
              class={css({
                padding: '4',
                backgroundColor: 'white',
                borderRadius: 'lg',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                _dark: { backgroundColor: 'gray.700' },
              })}
            >
              <div
                class={css({
                  fontSize: '2xl',
                  fontWeight: 'bold',
                  color: 'yellow.600',
                })}
              >
                {testSections.length - Object.keys(testResults()).length}
              </div>
              <div
                class={css({
                  fontSize: 'sm',
                  color: 'gray.600',
                  _dark: { color: 'gray.400' },
                })}
              >
                Pending
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AceternityTestShowcase;
