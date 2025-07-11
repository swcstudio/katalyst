import { css } from '@sse/ui/styled-system/css';
import { type Component, For } from 'solid-js';

// Aceternity Imports
import {
  AuthorCardDemo,
  BackgroundOverlayCardDemo,
  CardDemo,
  FeaturesSectionDemo,
  GridFeaturesSectionDemo,
  HeroSectionDemo,
  IconFeaturesSectionDemo,
  VortexDemo,
  VortexDemoSecond,
  WavyBackgroundDemo,
  WobbleCardDemo,
  WorldMapDemo,
} from '../aceternity';

// MagicUI Imports
import {
  AndroidDemo,
  AnimatedCircularProgressBarDemo,
  CodeComparisonDemo,
  FileTreeDemo,
  Iphone15ProDemo,
  LensDemo,
  MarqueeDemo,
  OrbitingCirclesDemo,
  PointerDemo,
  SafariDemo,
  ScriptCopyBtnDemo,
  ScrollProgressDemo,
  SmoothCursorDemo,
} from '../magicui';

interface ShowcaseComponent {
  name: string;
  component: Component;
  description: string;
}

interface ShowcaseSection {
  title: string;
  description: string;
  components: Array<ShowcaseComponent>;
}

const showcaseSections: ShowcaseSection[] = [
  {
    title: 'Hero & Landing Sections',
    description: 'Eye-catching hero sections and landing page components',
    components: [
      {
        name: 'Hero Section',
        component: HeroSectionDemo,
        description: 'Animated hero section with gradient borders and staggered text animations',
      },
      {
        name: 'Wavy Background',
        component: WavyBackgroundDemo,
        description: 'Hero section with animated wavy background effects',
      },
    ],
  },
  {
    title: 'Interactive Effects',
    description: 'Dynamic and interactive visual effects',
    components: [
      {
        name: 'Vortex Effect',
        component: VortexDemo,
        description: 'Swirling vortex background effect with customizable particles',
      },
      {
        name: 'Vortex Effect (Enhanced)',
        component: VortexDemoSecond,
        description: 'Enhanced vortex with increased particle count and range',
      },
      {
        name: 'Wobble Cards',
        component: WobbleCardDemo,
        description: 'Cards with subtle wobble animations and gradient backgrounds',
      },
    ],
  },
  {
    title: 'Data Visualization',
    description: 'Components for displaying data and information',
    components: [
      {
        name: 'World Map',
        component: WorldMapDemo,
        description: 'Interactive world map with connection lines and animated text',
      },
      {
        name: 'Features Section',
        component: FeaturesSectionDemo,
        description: 'Comprehensive features showcase with skeleton components',
      },
      {
        name: 'Grid Features',
        component: GridFeaturesSectionDemo,
        description: 'Grid-based features section with pattern backgrounds',
      },
      {
        name: 'Icon Features',
        component: IconFeaturesSectionDemo,
        description: 'Features section with icons and hover effects',
      },
    ],
  },
  {
    title: 'Card Components',
    description: 'Various card designs and layouts',
    components: [
      {
        name: 'Animated Card',
        component: CardDemo,
        description: 'Card with animated icons and sparkle effects',
      },
      {
        name: 'Background Overlay Card',
        component: BackgroundOverlayCardDemo,
        description: 'Card with background image and hover overlay effects',
      },
      {
        name: 'Author Card',
        component: AuthorCardDemo,
        description: 'Author profile card with avatar and content',
      },
    ],
  },
  {
    title: 'Motion & Animation',
    description: 'Components with advanced animations and motion effects',
    components: [
      {
        name: 'Marquee',
        component: MarqueeDemo,
        description: 'Scrolling marquee with pause on hover functionality',
      },
      {
        name: 'Orbiting Circles',
        component: OrbitingCirclesDemo,
        description: 'Icons orbiting in circular patterns with customizable speed',
      },
      {
        name: 'Animated Progress Bar',
        component: AnimatedCircularProgressBarDemo,
        description: 'Circular progress bar with smooth animations',
      },
      {
        name: 'Smooth Cursor',
        component: SmoothCursorDemo,
        description: 'Custom animated cursor with smooth movement',
      },
    ],
  },
  {
    title: 'Developer Tools',
    description: 'Components for code display and developer workflows',
    components: [
      {
        name: 'File Tree',
        component: FileTreeDemo,
        description: 'Interactive file explorer with collapsible folders',
      },
      {
        name: 'Code Comparison',
        component: CodeComparisonDemo,
        description: 'Side-by-side code comparison with syntax highlighting',
      },
      {
        name: 'Script Copy Button',
        component: ScriptCopyBtnDemo,
        description: 'Multi-package manager command copy button',
      },
      {
        name: 'Scroll Progress',
        component: ScrollProgressDemo,
        description: 'Page scroll progress indicator',
      },
    ],
  },
  {
    title: 'Interactive Elements',
    description: 'Components with advanced user interactions',
    components: [
      {
        name: 'Lens Effect',
        component: LensDemo,
        description: 'Magnifying lens effect for images',
      },
      {
        name: 'Pointer Tracking',
        component: PointerDemo,
        description: 'Custom pointer effects with animations',
      },
    ],
  },
  {
    title: 'Device Mockups',
    description: 'Realistic device frames for showcasing content',
    components: [
      {
        name: 'Safari Browser',
        component: SafariDemo,
        description: 'Safari browser mockup for web content',
      },
      {
        name: 'iPhone 15 Pro',
        component: Iphone15ProDemo,
        description: 'iPhone 15 Pro mockup for mobile content',
      },
      {
        name: 'Android Device',
        component: AndroidDemo,
        description: 'Android device mockup for mobile apps',
      },
    ],
  },
];

const SectionHeader: Component<{ title: string; description: string }> = (props) => {
  return (
    <div
      class={css({
        marginBottom: '12',
        textAlign: 'center',
      })}
    >
      <h2
        class={css({
          fontSize: '3xl',
          fontWeight: 'bold',
          color: 'gray.900',
          marginBottom: '4',
          _dark: {
            color: 'white',
          },
          lg: {
            fontSize: '4xl',
          },
        })}
      >
        {props.title}
      </h2>
      <p
        class={css({
          fontSize: 'lg',
          color: 'gray.600',
          maxWidth: '2xl',
          marginX: 'auto',
          _dark: {
            color: 'gray.400',
          },
        })}
      >
        {props.description}
      </p>
    </div>
  );
};

const ComponentCard: Component<ShowcaseComponent> = (props) => {
  const ComponentToRender = props.component;

  return (
    <div
      class={css({
        backgroundColor: 'white',
        borderRadius: 'xl',
        padding: '6',
        boxShadow: 'lg',
        border: '1px solid',
        borderColor: 'gray.200',
        transition: 'all 0.3s',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'xl',
        },
        _dark: {
          backgroundColor: 'gray.900',
          borderColor: 'gray.700',
        },
      })}
    >
      <div
        class={css({
          marginBottom: '4',
        })}
      >
        <h3
          class={css({
            fontSize: 'xl',
            fontWeight: 'semibold',
            color: 'gray.900',
            marginBottom: '2',
            _dark: {
              color: 'white',
            },
          })}
        >
          {props.name}
        </h3>
        <p
          class={css({
            fontSize: 'sm',
            color: 'gray.600',
            _dark: {
              color: 'gray.400',
            },
          })}
        >
          {props.description}
        </p>
      </div>

      <div
        class={css({
          borderRadius: 'lg',
          overflow: 'hidden',
          backgroundColor: 'gray.50',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          _dark: {
            backgroundColor: 'gray.800',
          },
        })}
      >
        <ComponentToRender />
      </div>
    </div>
  );
};

export const SolidStackUIShowcase: Component = () => {
  return (
    <div
      class={css({
        minHeight: '100vh',
        backgroundColor: 'gray.50',
        paddingY: '12',
        _dark: {
          backgroundColor: 'gray.900',
        },
      })}
    >
      <div
        class={css({
          maxWidth: '7xl',
          marginX: 'auto',
          paddingX: '4',
          sm: {
            paddingX: '6',
          },
          lg: {
            paddingX: '8',
          },
        })}
      >
        {/* Main Header */}
        <div
          class={css({
            textAlign: 'center',
            marginBottom: '16',
          })}
        >
          <h1
            class={css({
              fontSize: '4xl',
              fontWeight: 'bold',
              color: 'gray.900',
              marginBottom: '4',
              _dark: {
                color: 'white',
              },
              lg: {
                fontSize: '6xl',
              },
            })}
          >
            SolidStack UI
          </h1>
          <p
            class={css({
              fontSize: 'xl',
              color: 'gray.600',
              maxWidth: '3xl',
              marginX: 'auto',
              marginBottom: '2',
              _dark: {
                color: 'gray.400',
              },
            })}
          >
            State-of-the-Art Enterprise Design System
          </p>
          <p
            class={css({
              fontSize: 'base',
              color: 'gray.500',
              _dark: {
                color: 'gray.500',
              },
            })}
          >
            Built with SolidJS & Panda CSS - Converted from React UI Libraries
          </p>
        </div>

        {/* Showcase Sections */}
        <For each={showcaseSections}>
          {(section) => (
            <section
              class={css({
                marginBottom: '20',
              })}
            >
              <SectionHeader title={section.title} description={section.description} />

              <div
                class={css({
                  display: 'grid',
                  gap: '8',
                  gridTemplateColumns: '1',
                  lg: {
                    gridTemplateColumns: '2',
                  },
                  xl: {
                    gridTemplateColumns: '3',
                  },
                })}
              >
                <For each={section.components}>
                  {(component) => <ComponentCard {...component} />}
                </For>
              </div>
            </section>
          )}
        </For>

        {/* Footer */}
        <footer
          class={css({
            textAlign: 'center',
            paddingTop: '16',
            borderTop: '1px solid',
            borderColor: 'gray.200',
            marginTop: '20',
            _dark: {
              borderColor: 'gray.700',
            },
          })}
        >
          <p
            class={css({
              color: 'gray.600',
              fontSize: 'sm',
              _dark: {
                color: 'gray.400',
              },
            })}
          >
            © 2024 SolidStack UI. Built by Spectrum Web Co LLC.
          </p>
          <p
            class={css({
              color: 'gray.500',
              fontSize: 'xs',
              marginTop: '2',
              _dark: {
                color: 'gray.500',
              },
            })}
          >
            Enterprise-grade components for modern web applications
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SolidStackUIShowcase;
