# SolidStack-UI Pricing Components

Comprehensive collection of enterprise-grade pricing components built with SolidJS, Zag.js state machines, PandaCSS, and enhanced with thoughtful animation augmentations from Aceternity UI & Magic UI.

## Overview

This pricing component library provides state-of-the-art pricing tables, grids, and layouts with advanced features including:

- **State Machine Architecture**: Powered by Zag.js for predictable state management
- **Animation Augmentations**: Enhanced with carefully selected animations from Aceternity UI & Magic UI
- **Theme Support**: Light and dark themes with seamless switching
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Enterprise Features**: Comparison tables, feature matrices, and advanced layouts
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## Components

### 1. PricingDemo
A comprehensive demo component showcasing the core pricing functionality.

**Features:**
- Frequency toggle (Monthly/Annually)
- Tier selection with state management
- Hover animations and transitions
- Popular tier highlighting
- Feature lists with check icons

### 2. PricingGrid
Advanced grid layout for displaying multiple pricing tiers.

**Features:**
- Responsive grid (1-4 columns)
- BorderBeam effects for popular tiers
- ShimmerButton for CTAs
- BlurFade entrance animations
- TextAnimate for titles
- DotPattern background effects

### 3. PricingTable
Comprehensive comparison table with detailed feature breakdown.

**Features:**
- Mobile and desktop responsive views
- Feature comparison matrix
- Sectioned feature groups
- Popular tier highlighting
- Animated table reveals

### 4. PricingSplit
Hero-style layout with featured center tier.

**Features:**
- Gradient background overlays
- Enhanced center tier with BorderBeam
- Side tier layout
- WarpBackground effects
- Advanced typography scaling

### 5. PricingShowcase
Complete showcase demonstrating all variants.

**Features:**
- Interactive variant selector
- Theme switching
- Live demos of all components
- Comprehensive examples

## State Machine Architecture

Built on Zag.js state machines for predictable state management:

```typescript
interface PricingSectionContext {
  activeTier: string | null
  hoveredTier: string | null
  selectedFrequency: "monthly" | "annually"
  isVisible: boolean
  animationPhase: "loading" | "animating" | "complete"
  theme: "light" | "dark"
  animationsEnabled: boolean
  formState: "idle" | "submitting" | "success" | "error"
  buttonStates: Map<string, "idle" | "loading" | "success" | "error">
  comparisonMode: boolean
  tiers: PricingTier[]
  frequencies: PricingFrequency[]
}
```

### State Machine Events
- `mount()` - Initialize component
- `startAnimation()` - Begin entrance animations
- `hoverTier(id)` - Handle tier hover states
- `selectTier(id)` - Handle tier selection
- `setFrequency(freq)` - Change billing frequency
- `toggleTheme()` - Switch between light/dark themes

## Animation Augmentations

### From Aceternity UI
- **BorderBeam**: Animated borders for featured tiers
- **TextAnimate**: Smooth text reveals with multiple variants
- **Background effects**: Gradient overlays and patterns

### From Magic UI
- **BlurFade**: Entrance animations with blur effects
- **ShimmerButton**: Animated CTA buttons
- **DotPattern**: Subtle background patterns
- **WarpBackground**: Dynamic background effects

## Usage Examples

### Basic Grid Layout
```tsx
import { PricingGrid } from '@sse/ui/solidstack/tailwindplus';

const tiers = [
  {
    id: "starter",
    name: "Starter",
    price: { monthly: "$19", annually: "$190" },
    description: "Perfect for small projects",
    features: ["5 projects", "Basic support"],
    mostPopular: false
  },
  // ... more tiers
];

<PricingGrid
  badge="Pricing"
  title="Choose your plan"
  subtitle="Find the perfect plan for your needs"
  tiers={tiers}
  theme="light"
  animated={true}
  backgroundPattern={true}
  onTierSelect={(tier) => console.log("Selected:", tier)}
/>
```

### Comparison Table
```tsx
import { PricingTable } from '@sse/ui/solidstack/tailwindplus';

const sections = [
  {
    name: "Features",
    features: [
      { 
        name: "Custom domains", 
        tiers: { Starter: "1", Growth: "3", Scale: "Unlimited" } 
      },
      // ... more features
    ]
  }
];

<PricingTable
  title="Compare Features"
  tiers={tiers}
  sections={sections}
  theme="dark"
  animated={true}
/>
```

### Split Layout with Featured Tier
```tsx
import { PricingSplit } from '@sse/ui/solidstack/tailwindplus';

const tiersWithFeatured = [
  { id: "basic", name: "Basic", featured: false, /* ... */ },
  { id: "pro", name: "Pro", featured: true, /* ... */ },
  { id: "enterprise", name: "Enterprise", featured: false, /* ... */ }
];

<PricingSplit
  title="The right price for you"
  tiers={tiersWithFeatured}
  theme="dark"
  gradientBackground={true}
  backgroundPattern={true}
/>
```

## TypeScript Interfaces

### PricingTier
```typescript
interface PricingTier {
  id: string;
  name: string;
  price: { monthly: string; annually: string } | string;
  description: string;
  features: string[];
  href?: string;
  mostPopular?: boolean;
  featured?: boolean;
  cta?: string;
}
```

### PricingFrequency
```typescript
interface PricingFrequency {
  value: "monthly" | "annually";
  label: string;
  priceSuffix: string;
}
```

### Component Props
Each component accepts these common props:
- `className?: string` - Additional CSS classes
- `theme?: "light" | "dark"` - Theme variant
- `animated?: boolean` - Enable/disable animations
- `onTierSelect?: (tier: PricingTier) => void` - Selection callback

## Themes

### Light Theme
- Clean white backgrounds
- Subtle shadows and borders
- Indigo accent colors
- High contrast text

### Dark Theme
- Dark gray backgrounds
- Subtle white borders
- Purple/blue gradients
- Optimized contrast ratios

## Responsive Behavior

### Mobile (< 1024px)
- Single column layouts
- Stacked comparison tables
- Touch-optimized interactions
- Simplified animations

### Desktop (>= 1024px)
- Multi-column grids
- Side-by-side comparisons
- Enhanced hover effects
- Full animation suite

## Performance Optimizations

- **Lazy animations**: Only animate visible elements
- **State batching**: Efficient state updates
- **CSS-in-JS optimization**: PandaCSS compilation
- **Tree shaking**: Only bundle used components

## Accessibility Features

- **ARIA labels**: Proper semantic markup
- **Keyboard navigation**: Full keyboard support
- **Screen reader support**: Descriptive text
- **Color contrast**: WCAG AA compliance
- **Focus management**: Visible focus indicators

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

When adding new pricing components:

1. Follow the Zag.js state machine pattern
2. Use PandaCSS for styling
3. Add appropriate animation augmentations
4. Include both light and dark theme support
5. Ensure mobile responsiveness
6. Add TypeScript interfaces
7. Include accessibility features

## Examples

See the `PricingShowcase` component for live examples of all variants and their capabilities. The showcase includes interactive demos, theme switching, and comprehensive feature demonstrations.