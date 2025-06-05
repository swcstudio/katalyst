# Pattern Components Documentation

A comprehensive collection of beautiful background pattern components for SolidStack-UI. These components provide animated and interactive background effects to enhance your user interface.

## Overview

The Pattern Components collection includes 8 core components with 14+ variations, all built with SolidJS and optimized for performance. Each component is fully customizable, TypeScript-ready, and designed to work seamlessly in modern web applications.

## Components

### WarpBackground

A dynamic multi-layered background with warping effects and gradient animations.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `JSX.Element` | - | Content to display over the background |
| `className` | `string` | - | Additional CSS classes |
| `intensity` | `number` | `0.5` | Animation intensity (0-1) |
| `speed` | `number` | `1` | Animation speed multiplier |
| `colors` | `string[]` | `["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#dda0dd"]` | Color palette for gradients |

#### Usage

```tsx
import { WarpBackground } from '@solidstack/ui/magicui';

export function MyComponent() {
  return (
    <WarpBackground intensity={0.7} speed={1.5}>
      <div>Your content here</div>
    </WarpBackground>
  );
}
```

#### Features

- Multi-layered animated gradients
- Customizable color schemes
- Configurable animation intensity and speed
- Smooth warping transformations
- Zero dependencies

---

### FlickeringGrid

An animated grid with randomly flickering squares creating subtle movement effects.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `squareSize` | `number` | `4` | Size of each grid square in pixels |
| `gridGap` | `number` | `6` | Gap between grid squares |
| `color` | `string` | `"#6B7280"` | Color of the flickering squares |
| `maxOpacity` | `number` | `0.5` | Maximum opacity of squares |
| `flickerChance` | `number` | `0.1` | Probability of square flickering (0-1) |
| `width` | `number` | `800` | Canvas width |
| `height` | `number` | `800` | Canvas height |

#### Usage

```tsx
import { FlickeringGrid } from '@solidstack/ui/magicui';

export function MyComponent() {
  return (
    <div className="relative h-96 w-full">
      <FlickeringGrid
        squareSize={6}
        gridGap={8}
        color="#3B82F6"
        maxOpacity={0.3}
        flickerChance={0.15}
      />
    </div>
  );
}
```

#### Features

- Canvas-based rendering for smooth performance
- Configurable grid dimensions and spacing
- Customizable flicker probability and timing
- Supports CSS masking for creative effects
- Lightweight and efficient

---

### AnimatedGridPattern

SVG-based grid pattern with animated squares appearing and disappearing.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `numSquares` | `number` | `30` | Number of animated squares |
| `maxOpacity` | `number` | `0.1` | Maximum opacity of squares |
| `duration` | `number` | `3` | Animation duration in seconds |
| `repeatDelay` | `number` | `1` | Delay between animation cycles |
| `width` | `number` | `40` | Grid cell width |
| `height` | `number` | `40` | Grid cell height |
| `x` | `string` | `"-1"` | Pattern X offset |
| `y` | `string` | `"-1"` | Pattern Y offset |
| `strokeDasharray` | `string` | `"0"` | Stroke dash pattern |
| `fill` | `string` | `"none"` | Base fill color |
| `stroke` | `string` | `"#e5e7eb"` | Base stroke color |

#### Usage

```tsx
import { AnimatedGridPattern } from '@solidstack/ui/magicui';

export function MyComponent() {
  return (
    <div className="relative h-96 w-full">
      <AnimatedGridPattern
        numSquares={50}
        maxOpacity={0.2}
        duration={4}
        repeatDelay={2}
        className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
      />
    </div>
  );
}
```

#### Features

- SVG-based for crisp rendering at any scale
- Configurable animation timing and intensity
- Random square positioning
- Supports CSS masking and transforms
- Accessible and semantic markup

---

### RetroGrid

80s-inspired perspective grid with neon glow effects.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `angle` | `number` | `65` | Perspective angle in degrees |
| `speed` | `number` | `5` | Animation speed |
| `opacity` | `number` | `0.5` | Grid opacity |
| `color` | `string` | `"#00ffff"` | Grid line color |
| `gridSize` | `number` | `50` | Size of grid cells |

#### Usage

```tsx
import { RetroGrid } from '@solidstack/ui/magicui';

export function MyComponent() {
  return (
    <div className="relative h-96 w-full bg-black">
      <RetroGrid
        angle={70}
        speed={3}
        color="#ff00ff"
        gridSize={60}
      />
      <div className="relative z-10">
        Your content here
      </div>
    </div>
  );
}
```

#### Features

- 3D perspective transformation
- Animated grid movement
- Customizable neon colors
- Atmospheric glow effects
- Perfect for sci-fi themes

---

### Ripple

Animated concentric ripple effects with multiple expanding circles.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `mainCircleSize` | `number` | `210` | Size of the main circle |
| `mainCircleOpacity` | `number` | `0.24` | Opacity of the main circle |
| `numCircles` | `number` | `8` | Number of ripple circles |
| `speed` | `number` | `2` | Animation speed |
| `color` | `string` | `"#3b82f6"` | Circle color |

#### Usage

```tsx
import { Ripple } from '@solidstack/ui/magicui';

export function MyComponent() {
  return (
    <div className="relative h-96 w-full bg-gray-900">
      <Ripple
        mainCircleSize={300}
        numCircles={12}
        speed={1.5}
        color="#10b981"
      />
      <div className="relative z-10">
        Your content here
      </div>
    </div>
  );
}
```

#### Features

- Smooth circular animations
- Multiple concurrent ripples
- Configurable timing and appearance
- Responsive to container size
- Elegant fade effects

---

### DotPattern

Clean dot pattern with various masking options and optional glow effects.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `width` | `number` | `16` | Pattern width |
| `height` | `number` | `16` | Pattern height |
| `x` | `number` | `0` | Pattern X offset |
| `y` | `number` | `0` | Pattern Y offset |
| `cx` | `number` | `1` | Circle center X |
| `cy` | `number` | `1` | Circle center Y |
| `cr` | `number` | `1` | Circle radius |
| `fill` | `string` | `"#d1d5db"` | Dot color |
| `glow` | `boolean` | `false` | Enable glow effect |
| `glowColor` | `string` | `"#3b82f6"` | Glow color |
| `glowSize` | `number` | `3` | Glow blur radius |

#### Usage

```tsx
import { DotPattern } from '@solidstack/ui/magicui';

export function MyComponent() {
  return (
    <div className="relative h-96 w-full">
      <DotPattern
        width={20}
        height={20}
        cr={2}
        glow={true}
        glowColor="#8b5cf6"
        className="[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
      />
    </div>
  );
}
```

#### Features

- SVG-based dot patterns
- Optional glow effects
- Flexible sizing and positioning
- Supports CSS masking
- Minimal and elegant

---

### GridPattern

Traditional grid pattern with optional highlighted squares and dashed lines.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `width` | `number` | `40` | Grid cell width |
| `height` | `number` | `40` | Grid cell height |
| `x` | `number` | `-1` | Pattern X offset |
| `y` | `number` | `-1` | Pattern Y offset |
| `strokeDasharray` | `string` | `"0"` | Dash pattern for lines |
| `squares` | `[number, number][]` | `[]` | Highlighted square positions |
| `fill` | `string` | `"none"` | Base fill color |
| `stroke` | `string` | `"#e5e7eb"` | Line color |
| `strokeWidth` | `number` | `1` | Line width |

#### Usage

```tsx
import { GridPattern } from '@solidstack/ui/magicui';

export function MyComponent() {
  return (
    <div className="relative h-96 w-full">
      <GridPattern
        width={30}
        height={30}
        strokeDasharray="4 2"
        squares={[[2, 3], [4, 5], [7, 1]]}
        className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
      />
    </div>
  );
}
```

#### Features

- SVG-based grid rendering
- Highlighted square overlays
- Dashed line support
- Flexible grid dimensions
- Clean and structured

---

### InteractiveGridPattern

Mouse-responsive grid pattern with hover effects and interactive feedback.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `width` | `number` | `40` | Grid cell width |
| `height` | `number` | `40` | Grid cell height |
| `x` | `number` | `-1` | Pattern X offset |
| `y` | `number` | `-1` | Pattern Y offset |
| `strokeDasharray` | `string` | `"0"` | Dash pattern for lines |
| `squares` | `[number, number]` | `[20, 20]` | Grid dimensions [cols, rows] |
| `squaresClassName` | `string` | `"hover:fill-blue-500"` | CSS classes for hover effects |
| `fill` | `string` | `"none"` | Base fill color |
| `stroke` | `string` | `"#e5e7eb"` | Line color |
| `strokeWidth` | `number` | `1` | Line width |

#### Usage

```tsx
import { InteractiveGridPattern } from '@solidstack/ui/magicui';

export function MyComponent() {
  return (
    <div className="relative h-96 w-full">
      <InteractiveGridPattern
        width={25}
        height={25}
        squares={[30, 30]}
        squaresClassName="hover:fill-purple-500"
        className="[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
      />
    </div>
  );
}
```

#### Features

- Mouse hover interactions
- Configurable hover effects
- Responsive grid dimensions
- Smooth transitions
- Engaging user feedback

## Demo Components

The package includes ready-to-use demo components for each pattern:

- `ExampleComponentDemo` - WarpBackground with card content
- `FlickeringGridDemo` - Standard flickering grid
- `FlickeringGridRoundedDemo` - Circular masked grid
- `AnimatedGridPatternDemo` - Animated SVG pattern
- `RetroGridDemo` - Retro grid with title
- `RippleDemo` - Ripple effect with text
- `DotPatternDemo` - Basic dot pattern
- `DotPatternLinearGradient` - Linear masked dots
- `DotPatternWithGlowEffectDemo` - Glowing dots
- `GridPatternDemo` - Grid with highlighted squares
- `GridPatternLinearGradient` - Linear masked grid
- `GridPatternDashed` - Dashed line grid
- `InteractiveGridPatternDemo` - Interactive hover grid
- `InteractiveGridPatternCustomDemo` - Custom interactive grid

## Showcase Components

- `BackgroundPatternDemos` - Comprehensive showcase of all patterns
- `PatternComponentsShowcase` - Professional presentation with stats and features

## CSS Masking

Many components support CSS masking for creative effects:

```css
/* Radial gradient mask */
[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]

/* Linear gradient mask */
[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]

/* Complex transforms */
inset-x-0 inset-y-[-30%] h-[200%] skew-y-12
```

## Performance Tips

1. **Canvas vs SVG**: Use FlickeringGrid for complex animations, SVG patterns for simple effects
2. **Masking**: Apply CSS masks to reduce visible pattern area and improve performance
3. **Animation Timing**: Adjust speed and duration props to balance visual appeal with performance
4. **Container Sizing**: Use appropriate container dimensions to avoid unnecessary rendering

## Browser Support

All components work in modern browsers with:
- CSS Grid support
- SVG support
- Canvas API support
- CSS transforms and animations

## TypeScript Support

Full TypeScript definitions are included for all components and their props. Import types as needed:

```tsx
import type { WarpBackgroundProps, FlickeringGridProps } from '@solidstack/ui/magicui';
```

## Customization

All components are built with customization in mind:

- CSS custom properties for dynamic theming
- Comprehensive prop interfaces
- Support for CSS-in-JS styling
- Panda CSS integration
- Tailwind CSS compatibility

For advanced customization, extend the base components or create your own variations using the provided patterns as templates.