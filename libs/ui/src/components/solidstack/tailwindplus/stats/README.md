# SolidStack-UI Statistics Components

Comprehensive collection of enterprise-grade statistics and metrics components built with SolidJS, Zag.js state machines, PandaCSS, and enhanced with thoughtful animation augmentations from Aceternity UI & Magic UI.

## Overview

This statistics component library provides state-of-the-art data visualization interfaces with advanced features including:

- **State Machine Architecture**: Powered by Zag.js for predictable state management
- **Animation Augmentations**: Enhanced with carefully selected animations from Aceternity UI & Magic UI
- **Multiple Layout Variants**: Simple grids, cards, timelines, split layouts, and mixed designs
- **Theme Support**: Light and dark themes with seamless switching
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Enterprise Features**: Number animations, intersection observers, and advanced interactions
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## Components

### StatisticsSection

The main statistics component with multiple layout variants and comprehensive animation support.

#### Features
- **Multiple Variants**: Simple, hero, split, cards, timeline, mixed, centered, and background layouts
- **Animation System**: NumberTicker counters, BlurFade reveals, BorderBeam highlights
- **Background Patterns**: Dots, beams, gradients, and custom background images
- **Intersection Observer**: Automatic animation triggering on scroll
- **State Tracking**: Hover states, selection states, and animation phases

#### Props Interface

```typescript
interface StatisticsSectionProps {
  className?: string;
  style?: JSX.CSSProperties;
  title?: string;
  subtitle?: string;
  badge?: string;
  stats: StatItem[];
  theme?: 'light' | 'dark';
  variant?: 'simple' | 'hero' | 'split' | 'cards' | 'timeline' | 'mixed' | 'centered' | 'background';
  layout?: 'grid' | 'list' | 'timeline' | 'cards';
  animated?: boolean;
  countersEnabled?: boolean;
  backgroundPattern?: 'none' | 'dots' | 'beams' | 'gradient';
  backgroundImage?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  staggerDelay?: number;
  animationDuration?: number;
  onStatSelect?: (stat: StatItem) => void;
  onAnimationComplete?: () => void;
}

interface StatItem {
  id: string;
  name: string;
  value: string | number;
  description?: string;
  icon?: any;
  startValue?: number;
  animatedValue?: number;
  suffix?: string;
  prefix?: string;
  decimalPlaces?: number;
  color?: string;
  href?: string;
  category?: string;
  priority?: boolean;
}
```

#### Usage Examples

**Basic Statistics Grid**
```tsx
import { StatisticsSection } from '@sse/ui/solidstack/tailwindplus';

const stats = [
  {
    id: '1',
    name: 'Transactions every 24 hours',
    value: 44000000,
    suffix: 'M',
    startValue: 0,
    category: 'financial'
  },
  {
    id: '2',
    name: 'Assets under holding',
    value: 119,
    prefix: '$',
    suffix: ' trillion',
    startValue: 0,
    category: 'financial'
  },
  {
    id: '3',
    name: 'New users annually',
    value: 46000,
    suffix: 'K',
    startValue: 0,
    category: 'growth'
  }
];

<StatisticsSection
  title="Trusted by millions worldwide"
  subtitle="Our platform processes billions of transactions"
  stats={stats}
  theme="light"
  variant="simple"
  animated={true}
  countersEnabled={true}
  onStatSelect={(stat) => handleStatClick(stat)}
/>
```

**Hero Background Layout**
```tsx
<StatisticsSection
  badge="Our Impact"
  title="Trusted by thousands of creators worldwide"
  subtitle="Lorem ipsum, dolor sit amet consectetur adipisicing elit."
  stats={stats}
  theme="dark"
  variant="background"
  animated={true}
  backgroundPattern="gradient"
  backgroundImage="/hero-background.jpg"
  countersEnabled={true}
/>
```

### StatsSimple

A lightweight statistics component for basic grid layouts.

#### Features
- **Simple Layouts**: Basic, centered, and description variants
- **Minimal Dependencies**: Streamlined for performance
- **Counter Animations**: Optional NumberTicker integration
- **Theme Support**: Light and dark mode compatibility

#### Props Interface

```typescript
interface StatsSimpleProps {
  className?: string;
  style?: JSX.CSSProperties;
  title?: string;
  subtitle?: string;
  stats: StatItem[];
  theme?: 'light' | 'dark';
  variant?: 'basic' | 'centered' | 'description';
  animated?: boolean;
  countersEnabled?: boolean;
  staggerDelay?: number;
  animationDuration?: number;
  onStatSelect?: (stat: StatItem) => void;
}
```

#### Usage Examples

**Basic Grid**
```tsx
import { StatsSimple } from '@sse/ui/solidstack/tailwindplus';

<StatsSimple
  stats={stats}
  theme="light"
  variant="basic"
  animated={true}
  countersEnabled={true}
/>
```

**Centered with Descriptions**
```tsx
<StatsSimple
  title="Platform Statistics"
  subtitle="Key metrics that drive our success"
  stats={stats}
  theme="dark"
  variant="description"
  animated={true}
/>
```

### StatsWithHeader

Advanced statistics component with rich header sections and multiple layout options.

#### Features
- **Rich Headers**: Badge, title, subtitle, and description support
- **Layout Variants**: Cards, split, background, centered, and grid layouts
- **Background Elements**: Patterns, gradients, and image overlays
- **Interactive Cards**: Hover effects with BorderBeam animations
- **Split Layouts**: Image and content side-by-side arrangements

#### Props Interface

```typescript
interface StatsWithHeaderProps {
  className?: string;
  style?: JSX.CSSProperties;
  title?: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  stats: StatItem[];
  theme?: 'light' | 'dark';
  variant?: 'cards' | 'split' | 'background' | 'centered' | 'grid';
  animated?: boolean;
  countersEnabled?: boolean;
  backgroundPattern?: 'none' | 'dots' | 'beams' | 'gradient';
  backgroundImage?: string;
  staggerDelay?: number;
  animationDuration?: number;
  onStatSelect?: (stat: StatItem) => void;
  onAnimationComplete?: () => void;
}
```

#### Usage Examples

**Cards Layout**
```tsx
import { StatsWithHeader } from '@sse/ui/solidstack/tailwindplus';

<StatsWithHeader
  badge="Our track record"
  title="Trusted by creators worldwide"
  subtitle="Lorem ipsum dolor sit amet consectetur."
  stats={stats}
  theme="light"
  variant="cards"
  animated={true}
  countersEnabled={true}
/>
```

**Split Layout with Image**
```tsx
<StatsWithHeader
  badge="Our Impact"
  title="Trusted by thousands worldwide"
  subtitle="Comprehensive platform statistics"
  stats={stats}
  theme="light"
  variant="split"
  animated={true}
  backgroundImage="/split-image.jpg"
/>
```

### StatsTimeline

Specialized component for timeline-based statistics and milestones.

#### Features
- **Timeline Layouts**: Horizontal, vertical, grid, and compact variants
- **Milestone Tracking**: Date-based progression with connectors
- **Rich Content**: Descriptions, values, and category organization
- **Visual Connectors**: Optional timeline lines and progression indicators
- **Interactive Elements**: Hover states and selection handling

#### Props Interface

```typescript
interface StatsTimelineProps {
  className?: string;
  style?: JSX.CSSProperties;
  title?: string;
  subtitle?: string;
  badge?: string;
  stats: TimelineStatItem[];
  theme?: 'light' | 'dark';
  variant?: 'horizontal' | 'vertical' | 'grid' | 'compact';
  animated?: boolean;
  countersEnabled?: boolean;
  backgroundPattern?: 'none' | 'dots' | 'beams' | 'gradient';
  showConnectors?: boolean;
  staggerDelay?: number;
  animationDuration?: number;
  onStatSelect?: (stat: TimelineStatItem) => void;
  onAnimationComplete?: () => void;
}

interface TimelineStatItem extends StatItem {
  date?: string;
  dateTime?: string;
  period?: string;
  milestone?: string;
}
```

#### Usage Examples

**Horizontal Timeline**
```tsx
import { StatsTimeline } from '@sse/ui/solidstack/tailwindplus';

const timelineStats = [
  {
    id: '1',
    milestone: 'Founded company',
    description: 'Started our journey with a vision',
    date: 'Aug 2021',
    dateTime: '2021-08',
    value: 1,
    category: 'milestone'
  },
  // ... more timeline items
];

<StatsTimeline
  title="Company Timeline"
  subtitle="Key milestones in our journey"
  stats={timelineStats}
  theme="light"
  variant="horizontal"
  animated={true}
  showConnectors={true}
/>
```

**Vertical Timeline**
```tsx
<StatsTimeline
  badge="Our Journey"
  title="Milestones & Achievements"
  subtitle="Track our progress over time"
  stats={timelineStats}
  theme="dark"
  variant="vertical"
  animated={true}
  backgroundPattern="gradient"
/>
```

## Animation Augmentations

### From Aceternity UI
- **BorderBeam**: Animated borders for focused elements and priority stats
- **TextAnimate**: Smooth text reveals with multiple animation variants
- **BackgroundBeams**: Dynamic background effects for hero sections
- **Gradient Overlays**: Subtle background gradients for visual depth

### From Magic UI
- **NumberTicker**: Animated counting with customizable easing and duration
- **BlurFade**: Progressive reveal animations for cards and sections
- **DotPattern**: Subtle background patterns for visual texture
- **Ripple**: Interactive ripple effects for user interactions

## State Machine Architecture

All statistics components follow Zag.js state machine patterns for predictable state management:

### State Values
- `initializing` - Component setup phase
- `idle` - Ready for user interaction
- `loading` - Preparing animations
- `animating` - Animations in progress
- `interactive` - User interaction states
- `complete` - All animations finished
- `error` - Error state handling

### Context Management

```typescript
interface StatsSectionContext {
  id: string;
  statsData: StatsSection;
  activeStatId: string | null;
  hoveredStatId: string | null;
  visibleStats: Set<string>;
  animatedStats: Set<string>;
  completedStats: Set<string>;
  animationPhase: 'idle' | 'loading' | 'animating' | 'complete';
  theme: 'light' | 'dark';
  variant: string;
  isVisible: boolean;
  animationDuration: number;
  staggerDelay: number;
  countersEnabled: boolean;
  filterCategory: string | null;
  sortOrder: 'default' | 'value' | 'name' | 'priority';
  errorState: string | null;
}
```

### State Machine API

```typescript
interface StatsSectionAPI {
  // State queries
  isInitializing: boolean;
  isIdle: boolean;
  isLoading: boolean;
  isAnimating: boolean;
  isInteractive: boolean;
  isComplete: boolean;
  isError: boolean;
  
  // Actions
  startAnimation: () => void;
  setVisibility: (isVisible: boolean) => void;
  hoverStat: (statId: string) => void;
  unhoverStat: () => void;
  selectStat: (statId: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  updateStats: (stats: StatItem[]) => void;
  resetAnimation: () => void;
  
  // Computed properties
  filteredStats: StatItem[];
  sortedStats: StatItem[];
  animationProgress: number;
}
```

## Responsive Design

### Mobile (< 640px)
- **Single Column**: Stacked stat layouts
- **Touch Optimizations**: Larger touch targets
- **Simplified Animations**: Reduced motion for performance
- **Condensed Headers**: Compact title and subtitle layouts

### Tablet (640px - 1024px)
- **Two-Column Grids**: Stats in pairs
- **Enhanced Interactions**: Hover states enabled
- **Balanced Layouts**: Optimized content distribution
- **Medium Animations**: Partial animation suite

### Desktop (1024px+)
- **Multi-Column Layouts**: Full grid displays
- **Advanced Animations**: Complete animation suite
- **Rich Interactions**: Full hover and selection states
- **Enhanced Visual Effects**: Background patterns and overlays

## Theme System

### Light Theme
- **Clean Backgrounds**: White and light gray surfaces
- **Subtle Shadows**: Minimal depth indicators
- **High Contrast**: Dark text on light backgrounds
- **Indigo Accents**: Consistent brand color usage

### Dark Theme
- **Rich Backgrounds**: Dark gray and black surfaces
- **Enhanced Borders**: Subtle white border outlines
- **Purple Gradients**: Vibrant accent combinations
- **Optimized Contrast**: Proper text readability

## Performance Optimizations

### Animation Performance
- **RAF Scheduling**: Smooth 60fps animations using requestAnimationFrame
- **GPU Acceleration**: Transform-based animations for optimal performance
- **Intersection Observers**: Lazy animation triggering based on viewport visibility
- **Reduced Motion**: Respect user preferences for reduced motion

### State Management
- **Efficient Updates**: Minimal re-renders through precise dependency tracking
- **Memory Management**: Proper cleanup on component unmount
- **Event Debouncing**: Search and validation throttling
- **Cached Computations**: Optimized derived state calculations

### Loading Strategies
- **Progressive Enhancement**: Core functionality first, animations second
- **Code Splitting**: Lazy loading of animation components
- **Asset Optimization**: Optimized background images and patterns
- **Bundle Analysis**: Minimal impact on bundle size

## Accessibility Features

### Keyboard Navigation
- **Tab Order**: Logical focus progression through statistics
- **Escape Handling**: Clear selection and focus states
- **Enter Activation**: Stat selection and interaction
- **Arrow Navigation**: Grid and list traversal

### Screen Reader Support
- **ARIA Labels**: Descriptive element labeling
- **Live Regions**: Dynamic content announcements
- **Semantic HTML**: Proper heading hierarchy and structure
- **Focus Management**: Clear focus indicators and states

### Visual Accessibility
- **Color Contrast**: WCAG AA compliance across all themes
- **Focus Indicators**: Visible focus states for all interactive elements
- **Text Scaling**: Responsive typography that scales properly
- **Motion Preferences**: Reduced animation options for motion sensitivity

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Integration Examples

### Custom Animation Handlers
```tsx
const handleAnimationComplete = () => {
  analytics.track('stats_animation_completed', {
    component: 'StatisticsSection',
    variant: 'hero',
    statsCount: stats.length
  });
};

<StatisticsSection
  stats={stats}
  onAnimationComplete={handleAnimationComplete}
/>
```

### State Machine Extensions
```tsx
const statsSection = useStatsSection({
  onStatSelect: (statId) => {
    analytics.track('stat_selected', { statId });
    router.navigate(`/stats/${statId}`);
  },
  onAnimationComplete: () => {
    setAnimationsCompleted(true);
  }
});
```

### Custom Themes
```tsx
const customTheme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f172a',
    surface: '#1e293b',
  },
  animations: {
    duration: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

<StatisticsSection
  stats={stats}
  theme="dark"
  style={{ '--theme-primary': customTheme.colors.primary }}
/>
```

## Advanced Customization

### Custom Stat Components
```tsx
const CustomStatCard = ({ stat, index }) => {
  return (
    <BlurFade delay={index * 0.1} inView={true}>
      <div className="custom-stat-card">
        <NumberTicker
          value={stat.value}
          duration={2000}
          delay={index * 150}
        />
        <span>{stat.name}</span>
      </div>
    </BlurFade>
  );
};
```

### Background Pattern Customization
```tsx
<StatisticsSection
  stats={stats}
  backgroundPattern="custom"
  style={{
    '--pattern-opacity': '0.1',
    '--pattern-size': '20px',
    '--pattern-color': '#6366f1'
  }}
/>
```

## Contributing

When extending these components:

1. **Follow State Machine Patterns**: Use Zag.js for predictable state management
2. **Maintain Animation Consistency**: Use established animation patterns from Aceternity UI & Magic UI
3. **Ensure Accessibility**: Include proper ARIA support and keyboard navigation
4. **Test Responsiveness**: Verify mobile, tablet, and desktop layouts
5. **Document Changes**: Update type definitions and usage examples

## Examples

See the `StatsShowcase` and `ComprehensiveStatsDemo` components for live examples of all variants and their capabilities. The showcase includes interactive demos, theme switching, and comprehensive feature demonstrations.

## Related Components

- **NumberTicker**: Animated number counting from Magic UI
- **BlurFade**: Progressive reveal animations from Magic UI
- **BorderBeam**: Animated border effects from Magic UI
- **BackgroundBeams**: Dynamic background patterns from Aceternity UI
- **DotPattern**: Subtle background textures from Magic UI