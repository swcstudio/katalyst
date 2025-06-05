# MagicUI Components - New Additions

This document covers the latest additions to the SolidStack-UI MagicUI component library. These components have been converted from React to SolidJS and are ready for use in your SolidJS applications.

## 🚀 New Components

### Animated Beam Components

Beautiful animated connection lines between elements with customizable curvature and effects.

#### Components:
- `AnimatedBeamDemo` - Complex network visualization
- `AnimatedBeamSimpleDemo` - Simple two-point connection
- `AnimatedBeamBidirectionalDemo` - Bidirectional connections
- `AnimatedBeamMultipleOutputDemo` - Hub-and-spoke pattern
- `AnimatedBeamMultipleOutputReverseDemo` - Reverse hub pattern

#### Usage:
```tsx
import { AnimatedBeamDemo } from '@sse/ui/components/solidstack/magicui';

<AnimatedBeamDemo />
```

#### Props:
- Uses the existing `AnimatedBeam` component from `mystic/effects`
- Supports curvature, duration, reverse, and offset properties

---

### BorderBeam

Animated border effect that creates a moving beam of light around elements.

#### Usage:
```tsx
import { BorderBeam, BorderBeamCard } from '@sse/ui/components/solidstack/magicui';

<div class="relative">
  <YourContent />
  <BorderBeam duration={8} size={100} />
</div>
```

#### Props:
- `size?: number` - Size of the beam (default: 200)
- `duration?: number` - Animation duration in seconds (default: 15)
- `borderWidth?: number` - Border width (default: 1.5)
- `colorFrom?: string` - Start color (default: '#ffaa40')
- `colorTo?: string` - End color (default: '#9c40ff')
- `delay?: number` - Animation delay (default: 0)

---

### ShineBorder

Creates a shimmering border effect with customizable colors.

#### Usage:
```tsx
import { ShineBorder } from '@sse/ui/components/solidstack/magicui';

<ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}>
  <YourContent />
</ShineBorder>
```

#### Props:
- `shineColor?: string | string[]` - Colors for the shine effect
- `duration?: number` - Animation duration (default: 14)
- `borderRadius?: number` - Border radius (default: 8)
- `borderWidth?: number` - Border width (default: 1)

---

### MagicCard

Interactive card with mouse-following gradient effects.

#### Usage:
```tsx
import { MagicCard, MagicCardDemo } from '@sse/ui/components/solidstack/magicui';

<MagicCard gradientColor="#D9D9D955">
  <YourContent />
</MagicCard>
```

#### Props:
- `gradientColor?: string` - Gradient color (default: '#262626')
- `gradientSize?: number` - Size of gradient effect (default: 200)
- `gradientOpacity?: number` - Opacity of gradient (default: 0.8)

---

### NeonGradientCard

Card with animated neon glow and gradient borders.

#### Usage:
```tsx
import { NeonGradientCard } from '@sse/ui/components/solidstack/magicui';

<NeonGradientCard>
  <YourContent />
</NeonGradientCard>
```

#### Props:
- `borderSize?: number` - Border thickness (default: 2)
- `borderRadius?: number` - Border radius (default: 20)
- `neonColors?: object` - First and second colors for neon effect
- `backgroundColor?: string` - Background color (default: 'transparent')

---

### Confetti Components

Multiple confetti effects for celebrations and interactions.

#### Components:
- `Confetti` - Base confetti component
- `ConfettiButton` - Button that triggers confetti
- `ConfettiDemo` - Demo with hover trigger
- `ConfettiFireworks` - Fireworks-style confetti
- `ConfettiSideCannons` - Side-mounted confetti cannons
- `ConfettiStars` - Star-shaped confetti
- `ConfettiCustomShapes` - Custom shape confetti
- `ConfettiEmoji` - Emoji confetti

#### Usage:
```tsx
import { ConfettiButton, ConfettiFireworks } from '@sse/ui/components/solidstack/magicui';

<ConfettiButton options={{ particleCount: 100 }}>
  Celebrate! 🎉
</ConfettiButton>
```

#### Dependencies:
Requires `canvas-confetti` library:
```bash
npm install canvas-confetti
```

---

### Particles

Animated particle background with customizable behavior.

#### Usage:
```tsx
import { Particles, ParticlesDemo } from '@sse/ui/components/solidstack/magicui';

<div class="relative">
  <YourContent />
  <Particles
    quantity={100}
    ease={80}
    color="#ffffff"
    refresh
  />
</div>
```

#### Props:
- `quantity?: number` - Number of particles (default: 100)
- `ease?: number` - Movement easing (default: 50)
- `color?: string` - Particle color (default: '#ffffff')
- `refresh?: boolean` - Auto-refresh particles (default: false)
- `vx?: number` - Horizontal velocity (default: 0)
- `vy?: number` - Vertical velocity (default: 0)
- `size?: number` - Particle size (default: 1)

---

### CoolMode

Click effect that spawns animated particles.

#### Usage:
```tsx
import { CoolMode, CoolModeDemo } from '@sse/ui/components/solidstack/magicui';

<CoolMode options={{ particleCount: 30 }}>
  <button>Click Me!</button>
</CoolMode>
```

#### Options:
- `particle?: string` - Custom particle image URL
- `particleCount?: number` - Number of particles (default: 30)
- `speedHorz?: number` - Horizontal speed (default: 1)
- `speedUp?: number` - Upward speed (default: 1)
- `gravity?: number` - Gravity effect (default: 0.1)
- `particleSize?: number` - Particle size (default: 8)
- `colors?: string[]` - Particle colors

---

### ScratchToReveal

Interactive scratch-off effect that reveals content underneath.

#### Usage:
```tsx
import { ScratchToReveal } from '@sse/ui/components/solidstack/magicui';

<ScratchToReveal
  width={250}
  height={250}
  minScratchPercentage={70}
  gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
  onComplete={() => console.log('Revealed!')}
>
  <p>Hidden Content! 🎉</p>
</ScratchToReveal>
```

#### Props:
- `width: number` - Component width (required)
- `height: number` - Component height (required)
- `minScratchPercentage?: number` - Percentage to trigger reveal (default: 70)
- `gradientColors?: string[]` - Overlay gradient colors
- `brushSize?: number` - Scratch brush size (default: 20)
- `onComplete?: () => void` - Callback when revealed

---

### BlurFade

Smooth entrance animation with blur and fade effects.

#### Usage:
```tsx
import { BlurFade, BlurFadeDemo, BlurFadeTextDemo } from '@sse/ui/components/solidstack/magicui';

<BlurFade delay={0.25} inView>
  <YourContent />
</BlurFade>
```

#### Props:
- `delay?: number` - Animation delay in seconds (default: 0)
- `inView?: boolean` - Trigger animation on scroll into view (default: false)
- `yOffset?: number` - Initial Y offset in pixels (default: 6)
- `duration?: number` - Animation duration in seconds (default: 0.6)
- `blur?: string` - Initial blur amount (default: '6px')

---

## 🎨 Styling and Animations

### CSS Animations
Import the animations stylesheet for proper effects:

```tsx
import '@sse/ui/components/solidstack/magicui/animations.css';
```

### Theme Integration
Components automatically integrate with your theme system and support both light and dark modes.

### Responsive Design
All components are built with responsive design in mind and work across different screen sizes.

---

## 📦 Showcase Component

Use the `NewComponentsShowcase` to see all components in action:

```tsx
import { NewComponentsShowcase } from '@sse/ui/components/solidstack/magicui';

<NewComponentsShowcase />
```

---

## 🔧 Installation & Setup

1. All components are included in the SolidStack-UI library
2. For confetti effects, install canvas-confetti: `npm install canvas-confetti`
3. Import the animations CSS file in your app root
4. Components work with your existing theme system

---

## 🎯 Best Practices

1. **Performance**: Use `inView` prop for animations that should trigger on scroll
2. **Accessibility**: Provide proper ARIA labels and respect user motion preferences
3. **Mobile**: Test interactive components on touch devices
4. **Theme**: Components respect your theme colors and dark mode settings

---

## 🐛 Troubleshooting

### Common Issues:

1. **Animations not working**: Ensure animations.css is imported
2. **Confetti not showing**: Install canvas-confetti dependency
3. **Particles not visible**: Check color contrast against background
4. **Touch events not working**: Ensure proper touch event handling

### Browser Support:
- Modern browsers with Canvas API support
- CSS animations and transforms
- IntersectionObserver API (for inView animations)

---

## 🚀 Examples

Check the demo components for implementation examples:
- `AnimatedBeamDemo`
- `MagicCardDemo`
- `ParticlesDemo`
- `ScratchToRevealDemo`
- `BlurFadeDemo`

Each demo component shows the recommended usage patterns and configurations.