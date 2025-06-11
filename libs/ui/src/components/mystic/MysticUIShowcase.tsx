import { css } from '@sse/ui/styled-system/css';
import { type Component, For, createSignal } from 'solid-js';

import DotPattern from './backgrounds/DotPattern.tsx';
import GridPattern from './backgrounds/GridPattern.tsx';
import NoSignalScreen from './backgrounds/NoSignalScreen.tsx';
import RetroGrid from './backgrounds/RetroGrid.tsx';
import Ripple from './backgrounds/Ripple.tsx';
import Dock from './components/Dock.tsx';
import Marquee from './components/Marquee.tsx';
import OrbitingCircles from './components/OrbitingCircles.tsx';
import Android from './device-mocks/Android.tsx';
import Safari from './device-mocks/Safari.tsx';
import iPhone15 from './device-mocks/iPhone15.tsx';
import AnimatedBeam from './effects/AnimatedBeam.tsx';
import BorderBeam from './effects/BorderBeam.tsx';
import Meteors from './effects/Meteors.tsx';
// Import all MysticUI components
import { AnimatedText, AuroraButton, FloatingParticles, GlassCard } from './index.ts';
import AnimatedShinyText from './text-effects/AnimatedShinyText.tsx';
import TypingAnimation from './text-effects/TypingAnimation.tsx';

export interface MysticUIShowcaseProps {
  className?: string;
}

const MysticUIShowcase: Component<MysticUIShowcaseProps> = (props) => {
  const [activeSection, setActiveSection] = createSignal('backgrounds');
  const [fromRef, setFromRef] = createSignal<HTMLElement | null>(null);
  const [toRef, setToRef] = createSignal<HTMLElement | null>(null);

  const sections = [
    { id: 'backgrounds', name: 'Backgrounds', icon: '🎨' },
    { id: 'components', name: 'Components', icon: '🧩' },
    { id: 'device-mocks', name: 'Device Mocks', icon: '📱' },
    { id: 'effects', name: 'Effects', icon: '✨' },
    { id: 'text-effects', name: 'Text Effects', icon: '📝' },
    { id: 'original', name: 'Original Components', icon: '🎭' },
  ];

  const dockItems = [
    { id: '1', icon: '🏠', label: 'Home', onClick: () => console.log('Home') },
    { id: '2', icon: '📁', label: 'Files', onClick: () => console.log('Files') },
    { id: '3', icon: '💻', label: 'Code', onClick: () => console.log('Code') },
    { id: '4', icon: '🎵', label: 'Music', onClick: () => console.log('Music') },
    { id: '5', icon: '⚙️', label: 'Settings', onClick: () => console.log('Settings') },
  ];

  const marqueeItems = [
    '🎉 Welcome to MysticUI',
    '✨ Beautiful Components',
    '🚀 Built with SolidJS',
    '🎨 Styled with Panda CSS',
    '💫 Powered by Deno',
  ];

  const safariTabs = [
    { id: '1', title: 'MysticUI Docs', url: 'https://mysticui.dev', active: true, favicon: '📚' },
    { id: '2', title: 'GitHub', url: 'https://github.com', favicon: '🐙' },
    { id: '3', title: 'SolidJS', url: 'https://solidjs.com', favicon: '⚡' },
  ];

  return (
    <div
      class={css(
        {
          minHeight: '100vh',
          backgroundColor: 'gray.900',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        },
        props.className
      )}
    >
      {/* Background Pattern */}
      <DotPattern width={20} height={20} className={css({ opacity: 0.1 })} />

      {/* Floating Particles */}
      <FloatingParticles count={50} speed={2} className={css({ opacity: 0.6 })} />

      {/* Main Content */}
      <div
        class={css({
          position: 'relative',
          zIndex: 10,
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        })}
      >
        {/* Header */}
        <div class={css({ textAlign: 'center', marginBottom: '3rem' })}>
          <AnimatedShinyText
            as="h1"
            className={css({
              fontSize: '4xl',
              fontWeight: 'bold',
              marginBottom: '1rem',
            })}
            shimmerColor="#ffaa40"
            animationSpeed={2}
          >
            MysticUI Components
          </AnimatedShinyText>

          <TypingAnimation
            text={[
              'Beautiful UI Components for SolidJS',
              'Built with Deno Runtime',
              'Styled with Panda CSS',
              'Ready for Production',
            ]}
            className={css({
              fontSize: 'xl',
              color: 'gray.300',
              marginBottom: '2rem',
            })}
            loop
            showDeleteAnimation
            speed="medium"
          />
        </div>

        {/* Navigation */}
        <div
          class={css({
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '3rem',
            gap: '1rem',
            flexWrap: 'wrap',
          })}
        >
          <For each={sections}>
            {(section) => (
              <AuroraButton
                variant={activeSection() === section.id ? 'primary' : 'secondary'}
                size="md"
                onClick={() => setActiveSection(section.id)}
                className={css({ minWidth: '140px' })}
              >
                {section.icon} {section.name}
              </AuroraButton>
            )}
          </For>
        </div>

        {/* Content Sections */}
        <div class={css({ position: 'relative' })}>
          {/* Backgrounds Section */}
          {activeSection() === 'backgrounds' && (
            <div
              class={css({
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              })}
            >
              <GlassCard
                title="Dot Pattern"
                className={css({ height: '200px', position: 'relative' })}
              >
                <DotPattern width={16} height={16} cx={1} cy={1} cr={1} />
                <div class={css({ position: 'relative', zIndex: 5, padding: '1rem' })}>
                  Perfect for subtle background textures
                </div>
              </GlassCard>

              <GlassCard
                title="Grid Pattern"
                className={css({ height: '200px', position: 'relative' })}
              >
                <GridPattern width={40} height={40} strokeDasharray={0} />
                <div class={css({ position: 'relative', zIndex: 5, padding: '1rem' })}>
                  Clean grid layouts for design systems
                </div>
              </GlassCard>

              <GlassCard
                title="Retro Grid"
                className={css({ height: '200px', position: 'relative' })}
              >
                <RetroGrid angle={65} gridSize={50} strokeColor="#00ff00" />
                <div class={css({ position: 'relative', zIndex: 5, padding: '1rem' })}>
                  80s aesthetic grid with perspective
                </div>
              </GlassCard>

              <GlassCard
                title="Ripple Effect"
                className={css({ height: '200px', position: 'relative' })}
              >
                <Ripple mainCircleSize={100} numCircles={6} color="rgba(255, 170, 64, 0.8)" />
                <div class={css({ position: 'relative', zIndex: 5, padding: '1rem' })}>
                  Animated ripple waves
                </div>
              </GlassCard>

              <GlassCard
                title="No Signal Screen"
                className={css({ height: '200px', position: 'relative' })}
              >
                <NoSignalScreen opacity={0.6} animationSpeed={150} />
                <div class={css({ position: 'relative', zIndex: 5, padding: '1rem' })}>
                  TV static noise effect
                </div>
              </GlassCard>
            </div>
          )}

          {/* Components Section */}
          {activeSection() === 'components' && (
            <div
              class={css({
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              })}
            >
              <GlassCard
                title="Dock Component"
                className={css({ height: '300px', position: 'relative' })}
              >
                <div
                  class={css({
                    position: 'absolute',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  })}
                >
                  <Dock items={dockItems} position="center" size="md" magnification={60} />
                </div>
                <div class={css({ padding: '1rem' })}>macOS-style dock with hover effects</div>
              </GlassCard>

              <GlassCard title="Marquee" className={css({ height: '300px', position: 'relative' })}>
                <div
                  class={css({
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '100%',
                  })}
                >
                  <Marquee speed={30} pauseOnHover>
                    <div class={css({ display: 'flex', gap: '2rem', padding: '0 2rem' })}>
                      <For each={marqueeItems}>
                        {(item) => (
                          <div
                            class={css({
                              whiteSpace: 'nowrap',
                              fontSize: 'lg',
                              fontWeight: 'semibold',
                            })}
                          >
                            {item}
                          </div>
                        )}
                      </For>
                    </div>
                  </Marquee>
                </div>
                <div class={css({ padding: '1rem' })}>Smooth scrolling text marquee</div>
              </GlassCard>

              <GlassCard
                title="Orbiting Circles"
                className={css({ height: '300px', position: 'relative' })}
              >
                <div
                  class={css({
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  })}
                >
                  <OrbitingCircles
                    radius={60}
                    duration={15}
                    circleCount={8}
                    circleSize={6}
                    path
                    pauseOnHover
                  >
                    <div
                      class={css({
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'blue.500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      })}
                    >
                      ⚡
                    </div>
                  </OrbitingCircles>
                </div>
                <div class={css({ padding: '1rem' })}>Rotating orbital animation</div>
              </GlassCard>
            </div>
          )}

          {/* Device Mocks Section */}
          {activeSection() === 'device-mocks' && (
            <div
              class={css({
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem',
              })}
            >
              <GlassCard
                title="iPhone 15"
                className={css({ display: 'flex', justifyContent: 'center', padding: '2rem' })}
              >
                <iPhone15 variant="pro" size="sm" color="black-titanium">
                  <div
                    class={css({
                      padding: '2rem',
                      textAlign: 'center',
                      backgroundColor: 'blue.600',
                      color: 'white',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: '1rem',
                    })}
                  >
                    <h3>iOS App</h3>
                    <p>Beautiful mobile interface</p>
                  </div>
                </iPhone15>
              </GlassCard>

              <GlassCard
                title="Android Phone"
                className={css({ display: 'flex', justifyContent: 'center', padding: '2rem' })}
              >
                <Android variant="pixel" size="sm">
                  <div
                    class={css({
                      padding: '2rem',
                      textAlign: 'center',
                      backgroundColor: 'green.600',
                      color: 'white',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: '1rem',
                    })}
                  >
                    <h3>Android App</h3>
                    <p>Material Design interface</p>
                  </div>
                </Android>
              </GlassCard>

              <GlassCard
                title="Safari Browser"
                className={css({ display: 'flex', justifyContent: 'center', padding: '1rem' })}
              >
                <Safari
                  size="sm"
                  tabs={safariTabs}
                  url="https://mysticui.dev"
                  title="MysticUI Documentation"
                  showBookmarks
                >
                  <div
                    class={css({
                      padding: '2rem',
                      textAlign: 'center',
                      backgroundColor: 'purple.600',
                      color: 'white',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: '1rem',
                    })}
                  >
                    <h3>Web App</h3>
                    <p>Modern browser interface</p>
                  </div>
                </Safari>
              </GlassCard>
            </div>
          )}

          {/* Effects Section */}
          {activeSection() === 'effects' && (
            <div
              class={css({
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              })}
            >
              <GlassCard
                title="Border Beam"
                className={css({ height: '200px', position: 'relative' })}
              >
                <BorderBeam
                  size={200}
                  duration={8}
                  colorFrom="#ffaa40"
                  colorTo="#9c40ff"
                  className={css({
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '150px',
                    height: '100px',
                    backgroundColor: 'gray.800',
                    borderRadius: 'lg',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  <div>Animated Border</div>
                </BorderBeam>
              </GlassCard>

              <GlassCard title="Meteors" className={css({ height: '200px', position: 'relative' })}>
                <Meteors number={15} speed={3} color="#ffaa40" size={2} glow />
                <div class={css({ position: 'relative', zIndex: 5, padding: '1rem' })}>
                  Falling meteor animation
                </div>
              </GlassCard>

              <GlassCard
                title="Animated Beam"
                className={css({ height: '200px', position: 'relative' })}
              >
                <div
                  ref={setFromRef}
                  class={css({
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'blue.500',
                    borderRadius: '50%',
                  })}
                />
                <div
                  ref={setToRef}
                  class={css({
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'purple.500',
                    borderRadius: '50%',
                  })}
                />
                <AnimatedBeam fromRef={fromRef()} toRef={toRef()} curvature={0.5} duration={2000} />
                <div class={css({ position: 'relative', zIndex: 5, padding: '1rem' })}>
                  Connecting beam animation
                </div>
              </GlassCard>
            </div>
          )}

          {/* Text Effects Section */}
          {activeSection() === 'text-effects' && (
            <div
              class={css({
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              })}
            >
              <GlassCard
                title="Animated Shiny Text"
                className={css({ height: '200px', position: 'relative' })}
              >
                <div
                  class={css({
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                  })}
                >
                  <AnimatedShinyText
                    as="h2"
                    className={css({ fontSize: '2xl', fontWeight: 'bold' })}
                    shimmerColor="#ffaa40"
                    animationSpeed={3}
                  >
                    Shiny Text Effect
                  </AnimatedShinyText>
                  <p class={css({ marginTop: '1rem', color: 'gray.300' })}>
                    Shimmer animation on text
                  </p>
                </div>
              </GlassCard>

              <GlassCard
                title="Typing Animation"
                className={css({ height: '200px', position: 'relative' })}
              >
                <div
                  class={css({
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                  })}
                >
                  <TypingAnimation
                    text={[
                      'Hello World!',
                      'Welcome to MysticUI',
                      'Built with SolidJS',
                      'Powered by Deno',
                    ]}
                    className={css({ fontSize: 'xl', fontWeight: 'semibold' })}
                    loop
                    showDeleteAnimation
                    speed="fast"
                  />
                  <p class={css({ marginTop: '1rem', color: 'gray.300' })}>
                    Typewriter effect with multiple strings
                  </p>
                </div>
              </GlassCard>
            </div>
          )}

          {/* Original Components Section */}
          {activeSection() === 'original' && (
            <div
              class={css({
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              })}
            >
              <GlassCard
                title="Aurora Button"
                className={css({ height: '200px', position: 'relative' })}
              >
                <div
                  class={css({
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                  })}
                >
                  <AuroraButton variant="primary" size="lg">
                    Aurora Effect
                  </AuroraButton>
                  <p class={css({ marginTop: '1rem', color: 'gray.300' })}>
                    Beautiful gradient button with aurora effects
                  </p>
                </div>
              </GlassCard>

              <GlassCard
                title="Glass Card"
                className={css({ height: '200px', position: 'relative' })}
              >
                <div class={css({ padding: '1rem' })}>
                  <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold', marginBottom: '1rem' })}>
                    Glassmorphism
                  </h3>
                  <p class={css({ color: 'gray.300' })}>
                    Beautiful glass morphism effect with backdrop blur and transparency
                  </p>
                </div>
              </GlassCard>

              <GlassCard
                title="Animated Text"
                className={css({ height: '200px', position: 'relative' })}
              >
                <div
                  class={css({
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                  })}
                >
                  <AnimatedText
                    text="Fade In Animation"
                    variant="fadeIn"
                    className={css({ fontSize: 'xl', fontWeight: 'bold' })}
                  />
                  <p class={css({ marginTop: '1rem', color: 'gray.300' })}>
                    Multiple text animation variants
                  </p>
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MysticUIShowcase;
