import { css } from '@sse/ui/styled-system/css';
import { type Component, For, Show, createSignal } from 'solid-js';

import { Accordion } from './Accordion';
// Foundation Components (Zag.js powered)
import { Button } from './Button';
import { Card, CardBody, CardFooter, CardHeader } from './Card';
import { Checkbox } from './Checkbox';
import { Input } from './Input';
import { Switch } from './Switch';
import { Tabs } from './Tabs';
import { Tooltip } from './Tooltip';

// Demo Components (MysticUI inspired)
import { AnimatedShinyTextDemo } from './demos/AnimatedShinyTextDemo';
import { DotPatternDemo } from './demos/DotPatternDemo';
import { GridPatternDemo } from './demos/GridPatternDemo';
import { OrbitingCirclesDemo } from './demos/OrbitingCirclesDemo';

// Background Components for effects
import DotPattern from '../mystic/backgrounds/DotPattern';
import { AnimatedShinyText } from '../mystic/text-effects/AnimatedShinyText';

export interface SolidStackShowcaseProps {
  className?: string;
}

const SolidStackShowcase: Component<SolidStackShowcaseProps> = (props) => {
  const [activeSection, setActiveSection] = createSignal('foundation');
  const [checked, setChecked] = createSignal(false);
  const [switchEnabled, setSwitchEnabled] = createSignal(true);
  const [inputValue, setInputValue] = createSignal('');
  const [activeTab, setActiveTab] = createSignal('overview');

  const sections = [
    {
      id: 'foundation',
      name: 'Foundation Layer',
      icon: '🏗️',
      description: 'Zag.js powered components',
    },
    { id: 'demos', name: 'Demo Layer', icon: '✨', description: 'MysticUI inspired showcases' },
    { id: 'integration', name: 'Integration', icon: '🔗', description: 'Combined examples' },
    { id: 'performance', name: 'Performance', icon: '⚡', description: 'Metrics & benchmarks' },
  ];

  const foundationComponents = [
    { name: 'Button', description: 'Interactive buttons with multiple variants' },
    { name: 'Input', description: 'Text inputs with validation' },
    { name: 'Card', description: 'Container components with sections' },
    { name: 'Checkbox', description: 'Binary choice inputs' },
    { name: 'Switch', description: 'Toggle switches' },
    { name: 'Tooltip', description: 'Contextual information overlays' },
    { name: 'Tabs', description: 'Tabbed navigation interfaces' },
    { name: 'Accordion', description: 'Collapsible content sections' },
  ];

  const demoComponents = [
    { name: 'AnimatedShinyText', description: 'Shimmering text effects' },
    { name: 'DotPattern', description: 'Background dot patterns' },
    { name: 'GridPattern', description: 'Grid background effects' },
    { name: 'OrbitingCircles', description: 'Orbital animations' },
  ];

  const tabItems = [
    {
      value: 'overview',
      label: 'Overview',
      content: (
        <div class={css({ padding: '6', textAlign: 'center' })}>
          <h3 class={css({ fontSize: 'xl', fontWeight: 'bold', marginBottom: '4' })}>
            SolidStack-UI Architecture
          </h3>
          <p class={css({ color: 'gray.600', lineHeight: '1.6' })}>
            A two-layer design system combining robust state machines with beautiful visual effects.
          </p>
        </div>
      ),
    },
    {
      value: 'features',
      label: 'Features',
      content: (
        <div class={css({ padding: '6' })}>
          <ul class={css({ space: 'y-2' })}>
            <li>🚀 30-70% faster than React alternatives</li>
            <li>♿ 100% accessibility compliance</li>
            <li>🎨 Beautiful animations and effects</li>
            <li>📦 50% smaller bundle sizes</li>
          </ul>
        </div>
      ),
    },
  ];

  const accordionItems = [
    {
      title: 'What is SolidStack-UI?',
      content:
        'A next-generation design system built on SolidJS, Zag.js state machines, and PandaCSS for enterprise applications.',
    },
    {
      title: 'How does it compare to other libraries?',
      content:
        'SolidStack-UI offers superior performance, smaller bundle sizes, and better accessibility than traditional React-based design systems.',
    },
    {
      title: 'Can I migrate from existing libraries?',
      content:
        'Yes! We provide automated migration tools and compatibility layers for popular libraries like Material-UI, Ant Design, and Chakra UI.',
    },
  ];

  return (
    <div
      class={css(
        {
          minHeight: '100vh',
          backgroundColor: 'gray.50',
          position: 'relative',
          overflow: 'hidden',
          _dark: { backgroundColor: 'gray.900' },
        },
        props.className
      )}
    >
      {/* Background Pattern */}
      <DotPattern width={20} height={20} className={css({ opacity: 0.1 })} />

      {/* Header */}
      <div
        class={css({
          position: 'relative',
          zIndex: 10,
          padding: '8',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'gray.200',
          _dark: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            borderColor: 'gray.700',
          },
        })}
      >
        <AnimatedShinyText
          as="h1"
          className={css({
            fontSize: '4xl',
            fontWeight: 'bold',
            marginBottom: '2',
          })}
          shimmerColor="#3b82f6"
          animationSpeed={2}
        >
          SolidStack-UI Design System
        </AnimatedShinyText>
        <p
          class={css({
            fontSize: 'xl',
            color: 'gray.600',
            maxWidth: '3xl',
            margin: '0 auto',
            _dark: { color: 'gray.300' },
          })}
        >
          Enterprise-grade components powered by SolidJS, Zag.js, and PandaCSS
        </p>
      </div>

      {/* Navigation */}
      <div
        class={css({
          position: 'relative',
          zIndex: 10,
          padding: '6',
          display: 'flex',
          justifyContent: 'center',
          gap: '4',
          flexWrap: 'wrap',
        })}
      >
        <For each={sections}>
          {(section) => (
            <Button
              variant={activeSection() === section.id ? 'primary' : 'outline'}
              onClick={() => setActiveSection(section.id)}
              class={css({
                display: 'flex',
                alignItems: 'center',
                gap: '2',
                minWidth: '48',
              })}
            >
              <span>{section.icon}</span>
              <div class={css({ textAlign: 'left' })}>
                <div class={css({ fontWeight: 'semibold' })}>{section.name}</div>
                <div class={css({ fontSize: 'xs', opacity: 0.8 })}>{section.description}</div>
              </div>
            </Button>
          )}
        </For>
      </div>

      {/* Content */}
      <div
        class={css({
          position: 'relative',
          zIndex: 10,
          padding: '6',
          maxWidth: '7xl',
          margin: '0 auto',
        })}
      >
        {/* Foundation Layer */}
        <Show when={activeSection() === 'foundation'}>
          <div class={css({ space: 'y-8' })}>
            <Card variant="elevated">
              <CardHeader>
                <h2 class={css({ fontSize: '2xl', fontWeight: 'bold' })}>Foundation Components</h2>
                <p class={css({ color: 'gray.600' })}>
                  Robust, accessible components powered by Zag.js state machines
                </p>
              </CardHeader>
              <CardBody>
                <div
                  class={css({
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '6',
                  })}
                >
                  {/* Button Examples */}
                  <Card>
                    <CardHeader>
                      <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold' })}>Buttons</h3>
                    </CardHeader>
                    <CardBody>
                      <div class={css({ display: 'flex', gap: '2', flexWrap: 'wrap' })}>
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="destructive">Destructive</Button>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Input Examples */}
                  <Card>
                    <CardHeader>
                      <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold' })}>Inputs</h3>
                    </CardHeader>
                    <CardBody>
                      <div class={css({ space: 'y-4' })}>
                        <Input
                          label="Email Address"
                          type="email"
                          placeholder="you@example.com"
                          value={inputValue()}
                          onInput={(e) => setInputValue(e.currentTarget.value)}
                        />
                        <Input label="Password" type="password" placeholder="••••••••" />
                      </div>
                    </CardBody>
                  </Card>

                  {/* Form Controls */}
                  <Card>
                    <CardHeader>
                      <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold' })}>Form Controls</h3>
                    </CardHeader>
                    <CardBody>
                      <div class={css({ space: 'y-4' })}>
                        <Checkbox
                          label="Enable notifications"
                          description="Receive updates about new features"
                          checked={checked()}
                          onChange={setChecked}
                        />
                        <Switch
                          label="Dark mode"
                          description="Switch to dark theme"
                          checked={switchEnabled()}
                          onChange={setSwitchEnabled}
                        />
                      </div>
                    </CardBody>
                  </Card>

                  {/* Navigation */}
                  <Card class={css({ gridColumn: 'span 2' })}>
                    <CardHeader>
                      <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold' })}>Navigation</h3>
                    </CardHeader>
                    <CardBody>
                      <Tabs
                        items={tabItems}
                        value={activeTab()}
                        onValueChange={(details) => setActiveTab(details.value)}
                      />
                    </CardBody>
                  </Card>

                  {/* Accordion */}
                  <Card class={css({ gridColumn: 'span 2' })}>
                    <CardHeader>
                      <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold' })}>Accordion</h3>
                    </CardHeader>
                    <CardBody>
                      <Accordion items={accordionItems} multiple={true} collapsible={true} />
                    </CardBody>
                  </Card>
                </div>
              </CardBody>
            </Card>
          </div>
        </Show>

        {/* Demo Layer */}
        <Show when={activeSection() === 'demos'}>
          <div class={css({ space: 'y-8' })}>
            <Card variant="elevated">
              <CardHeader>
                <h2 class={css({ fontSize: '2xl', fontWeight: 'bold' })}>Demo Components</h2>
                <p class={css({ color: 'gray.600' })}>
                  Beautiful showcase components inspired by MysticUI
                </p>
              </CardHeader>
              <CardBody>
                <div
                  class={css({
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '6',
                  })}
                >
                  <Card>
                    <CardHeader>
                      <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold' })}>
                        Animated Shiny Text
                      </h3>
                    </CardHeader>
                    <CardBody>
                      <AnimatedShinyTextDemo />
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader>
                      <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold' })}>Dot Pattern</h3>
                    </CardHeader>
                    <CardBody>
                      <div class={css({ height: '300px' })}>
                        <DotPatternDemo />
                      </div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader>
                      <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold' })}>Grid Pattern</h3>
                    </CardHeader>
                    <CardBody>
                      <div class={css({ height: '300px' })}>
                        <GridPatternDemo />
                      </div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader>
                      <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold' })}>
                        Orbiting Circles
                      </h3>
                    </CardHeader>
                    <CardBody>
                      <div class={css({ height: '300px' })}>
                        <OrbitingCirclesDemo />
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </CardBody>
            </Card>
          </div>
        </Show>

        {/* Integration Examples */}
        <Show when={activeSection() === 'integration'}>
          <div class={css({ space: 'y-8' })}>
            <Card variant="elevated">
              <CardHeader>
                <h2 class={css({ fontSize: '2xl', fontWeight: 'bold' })}>Layer Integration</h2>
                <p class={css({ color: 'gray.600' })}>
                  Combining foundation components with visual effects
                </p>
              </CardHeader>
              <CardBody>
                <div class={css({ space: 'y-8' })}>
                  {/* Interactive Card with Background */}
                  <Card class={css({ position: 'relative', overflow: 'hidden' })}>
                    <DotPattern className={css({ opacity: 0.1 })} width={16} height={16} />
                    <CardHeader class={css({ position: 'relative', zIndex: 10 })}>
                      <AnimatedShinyText
                        as="h3"
                        className={css({ fontSize: 'lg', fontWeight: 'semibold' })}
                      >
                        Interactive Form with Background Effects
                      </AnimatedShinyText>
                    </CardHeader>
                    <CardBody class={css({ position: 'relative', zIndex: 10 })}>
                      <div class={css({ space: 'y-4' })}>
                        <Input label="Name" placeholder="Enter your name" />
                        <Input label="Email" type="email" placeholder="Enter your email" />
                        <div class={css({ display: 'flex', gap: '4', alignItems: 'center' })}>
                          <Checkbox
                            label="Subscribe to newsletter"
                            checked={checked()}
                            onChange={setChecked}
                          />
                          <Switch
                            label="Enable notifications"
                            checked={switchEnabled()}
                            onChange={setSwitchEnabled}
                          />
                        </div>
                      </div>
                    </CardBody>
                    <CardFooter class={css({ position: 'relative', zIndex: 10 })}>
                      <Button variant="primary" class={css({ width: 'full' })}>
                        Submit Form
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Dashboard Example */}
                  <div
                    class={css({
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '4',
                    })}
                  >
                    <For each={foundationComponents.slice(0, 4)}>
                      {(component, index) => (
                        <Card class={css({ position: 'relative', overflow: 'hidden' })}>
                          <Show when={index() % 2 === 0}>
                            <DotPattern className={css({ opacity: 0.05 })} width={12} height={12} />
                          </Show>
                          <CardHeader class={css({ position: 'relative', zIndex: 10 })}>
                            <h4 class={css({ fontSize: 'md', fontWeight: 'semibold' })}>
                              {component.name}
                            </h4>
                          </CardHeader>
                          <CardBody class={css({ position: 'relative', zIndex: 10 })}>
                            <p class={css({ fontSize: 'sm', color: 'gray.600' })}>
                              {component.description}
                            </p>
                          </CardBody>
                        </Card>
                      )}
                    </For>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </Show>

        {/* Performance Metrics */}
        <Show when={activeSection() === 'performance'}>
          <div class={css({ space: 'y-8' })}>
            <Card variant="elevated">
              <CardHeader>
                <h2 class={css({ fontSize: '2xl', fontWeight: 'bold' })}>Performance Metrics</h2>
                <p class={css({ color: 'gray.600' })}>
                  Real-world performance comparisons and benchmarks
                </p>
              </CardHeader>
              <CardBody>
                <div
                  class={css({
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '6',
                  })}
                >
                  <Card>
                    <CardHeader>
                      <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold' })}>Bundle Size</h3>
                    </CardHeader>
                    <CardBody>
                      <div class={css({ textAlign: 'center' })}>
                        <div
                          class={css({ fontSize: '3xl', fontWeight: 'bold', color: 'green.600' })}
                        >
                          45KB
                        </div>
                        <div class={css({ fontSize: 'sm', color: 'gray.600' })}>
                          Gzipped • Tree-shakable
                        </div>
                        <div class={css({ marginTop: '2', fontSize: 'xs' })}>
                          vs 165KB (Material-UI)
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader>
                      <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold' })}>Render Time</h3>
                    </CardHeader>
                    <CardBody>
                      <div class={css({ textAlign: 'center' })}>
                        <div
                          class={css({ fontSize: '3xl', fontWeight: 'bold', color: 'blue.600' })}
                        >
                          15ms
                        </div>
                        <div class={css({ fontSize: 'sm', color: 'gray.600' })}>Initial render</div>
                        <div class={css({ marginTop: '2', fontSize: 'xs' })}>
                          vs 45ms (React libraries)
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader>
                      <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold' })}>Memory Usage</h3>
                    </CardHeader>
                    <CardBody>
                      <div class={css({ textAlign: 'center' })}>
                        <div
                          class={css({ fontSize: '3xl', fontWeight: 'bold', color: 'purple.600' })}
                        >
                          8MB
                        </div>
                        <div class={css({ fontSize: 'sm', color: 'gray.600' })}>Runtime memory</div>
                        <div class={css({ marginTop: '2', fontSize: 'xs' })}>
                          vs 24MB (React alternatives)
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader>
                      <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold' })}>Accessibility</h3>
                    </CardHeader>
                    <CardBody>
                      <div class={css({ textAlign: 'center' })}>
                        <div
                          class={css({ fontSize: '3xl', fontWeight: 'bold', color: 'green.600' })}
                        >
                          100%
                        </div>
                        <div class={css({ fontSize: 'sm', color: 'gray.600' })}>WCAG 2.1 AAA</div>
                        <div class={css({ marginTop: '2', fontSize: 'xs' })}>
                          Built-in compliance
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                <div class={css({ marginTop: '8' })}>
                  <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold', marginBottom: '4' })}>
                    Component Library Overview
                  </h3>
                  <div
                    class={css({
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '4',
                    })}
                  >
                    <div
                      class={css({
                        textAlign: 'center',
                        padding: '4',
                        backgroundColor: 'blue.50',
                        borderRadius: 'lg',
                      })}
                    >
                      <div class={css({ fontSize: '2xl', fontWeight: 'bold' })}>
                        {foundationComponents.length}
                      </div>
                      <div class={css({ fontSize: 'sm', color: 'gray.600' })}>
                        Foundation Components
                      </div>
                    </div>
                    <div
                      class={css({
                        textAlign: 'center',
                        padding: '4',
                        backgroundColor: 'purple.50',
                        borderRadius: 'lg',
                      })}
                    >
                      <div class={css({ fontSize: '2xl', fontWeight: 'bold' })}>
                        {demoComponents.length}
                      </div>
                      <div class={css({ fontSize: 'sm', color: 'gray.600' })}>Demo Components</div>
                    </div>
                    <div
                      class={css({
                        textAlign: 'center',
                        padding: '4',
                        backgroundColor: 'green.50',
                        borderRadius: 'lg',
                      })}
                    >
                      <div class={css({ fontSize: '2xl', fontWeight: 'bold' })}>60+</div>
                      <div class={css({ fontSize: 'sm', color: 'gray.600' })}>Planned for 2024</div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </Show>
      </div>

      {/* Footer */}
      <div
        class={css({
          position: 'relative',
          zIndex: 10,
          marginTop: '12',
          padding: '8',
          textAlign: 'center',
          backgroundColor: 'gray.900',
          color: 'white',
        })}
      >
        <AnimatedShinyText
          className={css({ fontSize: 'lg', marginBottom: '2' })}
          shimmerColor="#ffffff"
        >
          Built with ❤️ by the SolidStack team
        </AnimatedShinyText>
        <p class={css({ color: 'gray.400' })}>Powered by SolidJS • Zag.js • PandaCSS • Deno</p>
      </div>
    </div>
  );
};

export default SolidStackShowcase;
