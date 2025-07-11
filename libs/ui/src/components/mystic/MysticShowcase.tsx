import { createSignal, For } from 'solid-js';
import {
  AnimatedText,
  AuroraButton,
  cn,
  FloatingParticles,
  GlassCard,
  gradients,
  typography,
} from './index.ts';

export function MysticShowcase() {
  const [activeDemo, setActiveDemo] = createSignal('buttons');
  const [textVariant, setTextVariant] = createSignal<
    'typewriter' | 'fade' | 'slide' | 'wave' | 'glitch' | 'rainbow'
  >('typewriter');

  const demoSections = [
    { id: 'buttons', label: 'Aurora Buttons', icon: '✨' },
    { id: 'cards', label: 'Glass Cards', icon: '🔮' },
    { id: 'text', label: 'Animated Text', icon: '📝' },
    { id: 'particles', label: 'Floating Particles', icon: '🌟' },
  ];

  const buttonVariants = [
    { variant: 'aurora' as const, label: 'Aurora' },
    { variant: 'cosmic' as const, label: 'Cosmic' },
    { variant: 'mystic' as const, label: 'Mystic' },
    { variant: 'ocean' as const, label: 'Ocean' },
    { variant: 'forest' as const, label: 'Forest' },
    { variant: 'sunset' as const, label: 'Sunset' },
  ];

  const cardVariants = [
    { variant: 'light' as const, label: 'Light Glass' },
    { variant: 'medium' as const, label: 'Medium Glass' },
    { variant: 'heavy' as const, label: 'Heavy Glass' },
    { variant: 'rainbow' as const, label: 'Rainbow' },
    { variant: 'aurora' as const, label: 'Aurora' },
    { variant: 'dark' as const, label: 'Dark' },
  ];

  const textVariants = [
    { variant: 'typewriter' as const, label: 'Typewriter' },
    { variant: 'fade' as const, label: 'Fade In' },
    { variant: 'slide' as const, label: 'Slide Up' },
    { variant: 'wave' as const, label: 'Wave' },
    { variant: 'glitch' as const, label: 'Glitch' },
    { variant: 'rainbow' as const, label: 'Rainbow' },
  ];

  return (
    <div class="min-h-screen relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Floating Particles Background */}
      <FloatingParticles
        count={80}
        size="md"
        speed="normal"
        pattern="wave"
        interactive={true}
        glow={true}
        colors={[
          'rgba(59, 130, 246, 0.3)',
          'rgba(147, 51, 234, 0.3)',
          'rgba(236, 72, 153, 0.3)',
          'rgba(6, 182, 212, 0.3)',
          'rgba(16, 185, 129, 0.3)',
        ]}
      />

      {/* Content */}
      <div class="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div class="text-center mb-16">
          <AnimatedText
            text="✨ Mystic Design System ✨"
            variant="typewriter"
            gradient="accent"
            size="3xl"
            as="h1"
            cursor={true}
            class={cn(typography.display.lg, 'mb-6')}
          />

          <AnimatedText
            text="Beautiful components inspired by Aceternity UI, Magic UI, and modern design"
            variant="fade"
            gradient="primary"
            size="lg"
            delay={2000}
            class={cn(typography.body.lg, 'text-gray-300 max-w-3xl mx-auto')}
          />
        </div>

        {/* Navigation */}
        <GlassCard variant="medium" size="sm" rounded="2xl" class="max-w-2xl mx-auto mb-12">
          <div class="flex flex-wrap justify-center gap-2">
            <For each={demoSections}>
              {(section) => (
                <AuroraButton
                  variant={activeDemo() === section.id ? 'aurora' : 'cosmic'}
                  size="sm"
                  onClick={() => setActiveDemo(section.id)}
                  class="min-w-0"
                >
                  <span class="mr-2">{section.icon}</span>
                  {section.label}
                </AuroraButton>
              )}
            </For>
          </div>
        </GlassCard>

        {/* Demo Content */}
        <div class="max-w-7xl mx-auto">
          {/* Aurora Buttons Demo */}
          {activeDemo() === 'buttons' && (
            <GlassCard
              variant="aurora"
              size="lg"
              animated={true}
              hoverable={false}
              gradient={true}
              class="mb-8"
              header={
                <AnimatedText
                  text="🌈 Aurora Button Collection"
                  variant="rainbow"
                  size="xl"
                  class="font-bold text-white"
                />
              }
            >
              <div class="space-y-8">
                {/* Button Variants */}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <For each={buttonVariants}>
                    {(btn) => (
                      <div class="text-center">
                        <AuroraButton
                          variant={btn.variant}
                          size="md"
                          glowIntensity="medium"
                          animationSpeed="normal"
                          class="w-full mb-2"
                        >
                          {btn.label} Magic
                        </AuroraButton>
                        <p class="text-xs text-gray-400">{btn.label}</p>
                      </div>
                    )}
                  </For>
                </div>

                {/* Button Sizes */}
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-white text-center">Different Sizes</h3>
                  <div class="flex flex-wrap items-center justify-center gap-4">
                    <AuroraButton variant="aurora" size="xs">
                      Extra Small
                    </AuroraButton>
                    <AuroraButton variant="cosmic" size="sm">
                      Small
                    </AuroraButton>
                    <AuroraButton variant="mystic" size="md">
                      Medium
                    </AuroraButton>
                    <AuroraButton variant="ocean" size="lg">
                      Large
                    </AuroraButton>
                    <AuroraButton variant="sunset" size="xl">
                      Extra Large
                    </AuroraButton>
                  </div>
                </div>

                {/* Interactive Examples */}
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-white text-center">Interactive States</h3>
                  <div class="flex flex-wrap justify-center gap-4">
                    <AuroraButton variant="forest" loading={true}>
                      Loading...
                    </AuroraButton>
                    <AuroraButton variant="sunset" disabled={true}>
                      Disabled
                    </AuroraButton>
                    <AuroraButton variant="aurora" glowIntensity="intense">
                      Intense Glow
                    </AuroraButton>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Glass Cards Demo */}
          {activeDemo() === 'cards' && (
            <div class="space-y-8">
              <GlassCard
                variant="aurora"
                size="md"
                animated={true}
                class="text-center"
                header={
                  <AnimatedText
                    text="🔮 Glass Morphism Cards"
                    variant="glitch"
                    size="xl"
                    class="font-bold text-white"
                  />
                }
              >
                <p class="text-gray-300">
                  Beautiful glass morphism effects with different variants and animations
                </p>
              </GlassCard>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <For each={cardVariants}>
                  {(card) => (
                    <GlassCard
                      variant={card.variant}
                      size="md"
                      hoverable={true}
                      animated={true}
                      gradient={true}
                      shadow="glow"
                      header={
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 bg-white/30 rounded-full" />
                          <h3 class="text-white font-semibold">{card.label}</h3>
                        </div>
                      }
                      footer={
                        <AuroraButton variant="aurora" size="sm" class="w-full">
                          Explore
                        </AuroraButton>
                      }
                    >
                      <div class="space-y-3">
                        <p class="text-white/80 text-sm">
                          Experience the beauty of glass morphism with {card.label.toLowerCase()}{' '}
                          transparency and backdrop blur effects.
                        </p>
                        <div class="flex gap-2">
                          <div class="w-8 h-8 bg-white/20 rounded-full" />
                          <div class="w-8 h-8 bg-white/15 rounded-full" />
                          <div class="w-8 h-8 bg-white/10 rounded-full" />
                        </div>
                      </div>
                    </GlassCard>
                  )}
                </For>
              </div>
            </div>
          )}

          {/* Animated Text Demo */}
          {activeDemo() === 'text' && (
            <GlassCard
              variant="rainbow"
              size="lg"
              animated={true}
              gradient={true}
              class="space-y-8"
              header={
                <AnimatedText
                  text="📝 Animated Typography"
                  variant="wave"
                  size="xl"
                  stagger={true}
                  class="font-bold text-white"
                />
              }
            >
              {/* Text Variant Selector */}
              <div class="flex flex-wrap justify-center gap-2 mb-8">
                <For each={textVariants}>
                  {(variant) => (
                    <AuroraButton
                      variant={textVariant() === variant.variant ? 'aurora' : 'cosmic'}
                      size="xs"
                      onClick={() => setTextVariant(variant.variant)}
                    >
                      {variant.label}
                    </AuroraButton>
                  )}
                </For>
              </div>

              {/* Text Demonstrations */}
              <div class="space-y-12">
                {/* Large Display Text */}
                <div class="text-center">
                  <AnimatedText
                    text="Magic Happens Here"
                    variant={textVariant()}
                    gradient="accent"
                    size="2xl"
                    cursor={textVariant() === 'typewriter'}
                    repeat={textVariant() === 'typewriter'}
                    stagger={textVariant() !== 'typewriter'}
                    shimmer={true}
                    class="font-bold"
                  />
                </div>

                {/* Different Gradients */}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <h3 class="text-white text-lg font-semibold text-center">Gradient Examples</h3>
                    <div class="space-y-3">
                      <AnimatedText
                        text="Ocean Gradient"
                        variant="fade"
                        gradient="ocean"
                        size="lg"
                      />
                      <AnimatedText
                        text="Forest Gradient"
                        variant="fade"
                        gradient="forest"
                        size="lg"
                      />
                      <AnimatedText
                        text="Sunset Gradient"
                        variant="fade"
                        gradient="sunset"
                        size="lg"
                      />
                      <AnimatedText
                        text="Rainbow Gradient"
                        variant="fade"
                        gradient="rainbow"
                        size="lg"
                      />
                    </div>
                  </div>

                  <div class="space-y-4">
                    <h3 class="text-white text-lg font-semibold text-center">Size Variations</h3>
                    <div class="space-y-3">
                      <AnimatedText
                        text="Extra Large Text"
                        variant="slide"
                        gradient="primary"
                        size="xl"
                      />
                      <AnimatedText
                        text="Large Text"
                        variant="slide"
                        gradient="primary"
                        size="lg"
                      />
                      <AnimatedText
                        text="Medium Text"
                        variant="slide"
                        gradient="primary"
                        size="md"
                      />
                      <AnimatedText
                        text="Small Text"
                        variant="slide"
                        gradient="primary"
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Effects */}
                <div class="text-center space-y-6">
                  <AnimatedText
                    text="✨ GLITCH EFFECT ✨"
                    variant="glitch"
                    size="xl"
                    class="font-bold"
                  />
                  <AnimatedText
                    text="Typewriter with cursor..."
                    variant="typewriter"
                    gradient="accent"
                    size="lg"
                    cursor={true}
                    repeat={true}
                  />
                </div>
              </div>
            </GlassCard>
          )}

          {/* Floating Particles Demo */}
          {activeDemo() === 'particles' && (
            <div class="space-y-8">
              <GlassCard
                variant="cosmic"
                size="lg"
                animated={true}
                class="relative overflow-hidden"
                header={
                  <AnimatedText
                    text="🌟 Floating Particles System"
                    variant="rainbow"
                    size="xl"
                    class="font-bold text-white"
                  />
                }
              >
                <FloatingParticles
                  count={50}
                  size="sm"
                  speed="normal"
                  pattern="orbit"
                  interactive={true}
                  shape="star"
                  glow={true}
                  colors={[
                    'rgba(255, 215, 0, 0.6)',
                    'rgba(255, 165, 0, 0.6)',
                    'rgba(255, 69, 0, 0.6)',
                  ]}
                />

                <div class="relative z-10 space-y-6">
                  <p class="text-white/90 text-center">
                    Interactive particle system with multiple patterns, shapes, and behaviors. Move
                    your mouse around to see the particles react!
                  </p>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div class="space-y-2">
                      <div class="text-2xl">🔄</div>
                      <h4 class="text-white font-semibold">Multiple Patterns</h4>
                      <p class="text-white/70 text-sm">
                        Wave, orbit, flow, and random movement patterns
                      </p>
                    </div>
                    <div class="space-y-2">
                      <div class="text-2xl">🎨</div>
                      <h4 class="text-white font-semibold">Custom Shapes</h4>
                      <p class="text-white/70 text-sm">
                        Circles, squares, triangles, stars, and dots
                      </p>
                    </div>
                    <div class="space-y-2">
                      <div class="text-2xl">⚡</div>
                      <h4 class="text-white font-semibold">Interactive</h4>
                      <p class="text-white/70 text-sm">
                        Particles respond to mouse movement and interactions
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Different Particle Demos */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard
                  variant="ocean"
                  size="md"
                  hoverable={true}
                  class="relative h-64"
                  header={<h3 class="text-white font-semibold">Ocean Waves</h3>}
                >
                  <FloatingParticles
                    count={30}
                    size="md"
                    speed="slow"
                    pattern="wave"
                    shape="circle"
                    colors={[
                      'rgba(6, 182, 212, 0.4)',
                      'rgba(59, 130, 246, 0.4)',
                      'rgba(147, 197, 253, 0.4)',
                    ]}
                  />
                </GlassCard>

                <GlassCard
                  variant="forest"
                  size="md"
                  hoverable={true}
                  class="relative h-64"
                  header={<h3 class="text-white font-semibold">Forest Glow</h3>}
                >
                  <FloatingParticles
                    count={40}
                    size="sm"
                    speed="normal"
                    pattern="flow"
                    shape="dot"
                    glow={true}
                    colors={[
                      'rgba(16, 185, 129, 0.5)',
                      'rgba(34, 197, 94, 0.5)',
                      'rgba(132, 204, 22, 0.5)',
                    ]}
                  />
                </GlassCard>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div class="mt-20 text-center">
          <GlassCard variant="dark" size="sm" class="max-w-2xl mx-auto">
            <AnimatedText
              text="Built with ❤️ using SolidJS + Zag.js + PandaCSS"
              variant="fade"
              gradient="accent"
              size="md"
              class="text-center"
            />
            <div class="flex justify-center gap-4 mt-4">
              <AuroraButton variant="aurora" size="sm">
                ⭐ Star on GitHub
              </AuroraButton>
              <AuroraButton variant="cosmic" size="sm">
                📖 View Docs
              </AuroraButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
