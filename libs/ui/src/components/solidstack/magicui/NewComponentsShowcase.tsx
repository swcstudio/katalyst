import { css } from '@sse/ui/styled-system/css';
import { type Component, For } from 'solid-js';
import {
  AnimatedBeamBidirectionalDemo,
  AnimatedBeamDemo,
  AnimatedBeamMultipleOutputDemo,
  AnimatedBeamSimpleDemo,
  BlurFadeDemo,
  BlurFadeTextDemo,
  BorderBeam,
  ConfettiButtonDemo,
  ConfettiFireworks,
  ConfettiStars,
  CoolModeCustomDemo,
  CoolModeDemo,
  MagicCard,
  MagicCardDemo,
  NeonGradientCardDemo,
  ParticlesDemo,
  ScratchToRevealDemo,
  ShineBorder,
} from './index';

export const NewComponentsShowcase: Component = () => {
  return (
    <div
      class={css({
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '60px',
      })}
    >
      {/* Header */}
      <div class={css({ textAlign: 'center' })}>
        <BlurFadeTextDemo />
        <p
          class={css({
            fontSize: '18px',
            color: 'muted.foreground',
            marginTop: '16px',
          })}
        >
          Explore the latest SolidStack-UI MagicUI components
        </p>
      </div>

      {/* Animated Beam Section */}
      <section
        class={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        })}
      >
        <h2
          class={css({
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
          })}
        >
          Animated Beams
        </h2>

        <div
          class={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px',
          })}
        >
          <div
            class={css({
              padding: '20px',
              border: '1px solid',
              borderColor: 'border',
              borderRadius: '8px',
              backgroundColor: 'background',
            })}
          >
            <h3 class={css({ marginBottom: '16px', fontSize: '18px', fontWeight: '600' })}>
              Complex Network
            </h3>
            <AnimatedBeamDemo />
          </div>

          <div
            class={css({
              padding: '20px',
              border: '1px solid',
              borderColor: 'border',
              borderRadius: '8px',
              backgroundColor: 'background',
            })}
          >
            <h3 class={css({ marginBottom: '16px', fontSize: '18px', fontWeight: '600' })}>
              Simple Connection
            </h3>
            <AnimatedBeamSimpleDemo />
          </div>

          <div
            class={css({
              padding: '20px',
              border: '1px solid',
              borderColor: 'border',
              borderRadius: '8px',
              backgroundColor: 'background',
            })}
          >
            <h3 class={css({ marginBottom: '16px', fontSize: '18px', fontWeight: '600' })}>
              Bidirectional
            </h3>
            <AnimatedBeamBidirectionalDemo />
          </div>

          <div
            class={css({
              padding: '20px',
              border: '1px solid',
              borderColor: 'border',
              borderRadius: '8px',
              backgroundColor: 'background',
            })}
          >
            <h3 class={css({ marginBottom: '16px', fontSize: '18px', fontWeight: '600' })}>
              Multiple Outputs
            </h3>
            <AnimatedBeamMultipleOutputDemo />
          </div>
        </div>
      </section>

      {/* Card Effects Section */}
      <section
        class={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        })}
      >
        <h2
          class={css({
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
          })}
        >
          Interactive Cards
        </h2>

        <div
          class={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px',
            justifyItems: 'center',
          })}
        >
          <div
            class={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            })}
          >
            <h3 class={css({ fontSize: '18px', fontWeight: '600' })}>Border Beam</h3>
            <div class={css({ position: 'relative', overflow: 'hidden', borderRadius: '8px' })}>
              <div
                class={css({
                  padding: '24px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  textAlign: 'center',
                })}
              >
                <h4 class={css({ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' })}>
                  Featured Card
                </h4>
                <p class={css({ color: 'muted.foreground' })}>
                  This card has an animated border beam effect
                </p>
              </div>
              <BorderBeam duration={8} size={100} />
            </div>
          </div>

          <div
            class={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            })}
          >
            <h3 class={css({ fontSize: '18px', fontWeight: '600' })}>Shine Border</h3>
            <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']}>
              <div
                class={css({
                  padding: '24px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  textAlign: 'center',
                })}
              >
                <h4 class={css({ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' })}>
                  Shiny Card
                </h4>
                <p class={css({ color: 'muted.foreground' })}>
                  This card has a shimmering border effect
                </p>
              </div>
            </ShineBorder>
          </div>

          <div
            class={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            })}
          >
            <h3 class={css({ fontSize: '18px', fontWeight: '600' })}>Magic Card</h3>
            <MagicCardDemo />
          </div>

          <div
            class={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            })}
          >
            <h3 class={css({ fontSize: '18px', fontWeight: '600' })}>Neon Gradient</h3>
            <NeonGradientCardDemo />
          </div>
        </div>
      </section>

      {/* Interactive Effects Section */}
      <section
        class={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        })}
      >
        <h2
          class={css({
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
          })}
        >
          Interactive Effects
        </h2>

        <div
          class={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          })}
        >
          <div
            class={css({
              padding: '24px',
              border: '1px solid',
              borderColor: 'border',
              borderRadius: '8px',
              backgroundColor: 'background',
              textAlign: 'center',
            })}
          >
            <h3 class={css({ marginBottom: '16px', fontSize: '18px', fontWeight: '600' })}>
              Confetti Effects
            </h3>
            <div
              class={css({
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              })}
            >
              <ConfettiButtonDemo />
              <ConfettiFireworks />
              <ConfettiStars />
            </div>
          </div>

          <div
            class={css({
              padding: '24px',
              border: '1px solid',
              borderColor: 'border',
              borderRadius: '8px',
              backgroundColor: 'background',
              textAlign: 'center',
            })}
          >
            <h3 class={css({ marginBottom: '16px', fontSize: '18px', fontWeight: '600' })}>
              Cool Mode
            </h3>
            <div
              class={css({
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              })}
            >
              <CoolModeDemo />
              <CoolModeCustomDemo />
            </div>
          </div>

          <div
            class={css({
              padding: '24px',
              border: '1px solid',
              borderColor: 'border',
              borderRadius: '8px',
              backgroundColor: 'background',
              textAlign: 'center',
              position: 'relative',
            })}
          >
            <h3 class={css({ marginBottom: '16px', fontSize: '18px', fontWeight: '600' })}>
              Scratch to Reveal
            </h3>
            <ScratchToRevealDemo />
          </div>
        </div>
      </section>

      {/* Background Effects Section */}
      <section
        class={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        })}
      >
        <h2
          class={css({
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
          })}
        >
          Background Effects
        </h2>

        <div
          class={css({
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '24px',
          })}
        >
          <div
            class={css({
              padding: '24px',
              border: '1px solid',
              borderColor: 'border',
              borderRadius: '8px',
              backgroundColor: 'background',
            })}
          >
            <h3
              class={css({
                marginBottom: '16px',
                fontSize: '18px',
                fontWeight: '600',
                textAlign: 'center',
              })}
            >
              Particles Background
            </h3>
            <ParticlesDemo />
          </div>
        </div>
      </section>

      {/* Animation Effects Section */}
      <section
        class={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        })}
      >
        <h2
          class={css({
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
          })}
        >
          Animation Effects
        </h2>

        <div
          class={css({
            padding: '24px',
            border: '1px solid',
            borderColor: 'border',
            borderRadius: '8px',
            backgroundColor: 'background',
          })}
        >
          <h3
            class={css({
              marginBottom: '16px',
              fontSize: '18px',
              fontWeight: '600',
              textAlign: 'center',
            })}
          >
            Blur Fade Gallery
          </h3>
          <BlurFadeDemo />
        </div>
      </section>

      {/* Footer */}
      <footer
        class={css({
          textAlign: 'center',
          padding: '40px 0',
          borderTop: '1px solid',
          borderColor: 'border',
        })}
      >
        <p
          class={css({
            fontSize: '16px',
            color: 'muted.foreground',
          })}
        >
          Built with SolidStack-UI • MagicUI Components
        </p>
      </footer>
    </div>
  );
};

export default NewComponentsShowcase;
