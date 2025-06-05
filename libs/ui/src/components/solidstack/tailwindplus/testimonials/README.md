# SolidStack-UI Testimonial Components

Comprehensive collection of enterprise-grade testimonial and review components built with SolidJS, Zag.js state machines, PandaCSS, and enhanced with thoughtful animation augmentations from Aceternity UI & Magic UI.

## Overview

This testimonial component library provides state-of-the-art customer review and testimonial interfaces with advanced features including:

- **State Machine Architecture**: Powered by Zag.js for predictable state management
- **Animation Augmentations**: Enhanced with carefully selected animations from Aceternity UI & Magic UI
- **Multiple Layout Variants**: Simple, hero, split, grid, masonry, carousel, and branded layouts
- **Theme Support**: Light and dark themes with seamless switching
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Enterprise Features**: Star ratings, carousel navigation, and advanced interactions
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## Components

### TestimonialSection

The main testimonial component with comprehensive layout variants and animation support.

#### Features
- **Multiple Variants**: Simple, hero, split, grid, masonry, carousel, featured, centered, and branded layouts
- **Animation System**: TextAnimate for quotes, BlurFade reveals, BorderBeam highlights, star rating animations
- **Background Patterns**: Dots, beams, gradients, and custom background images
- **Intersection Observer**: Automatic animation triggering on scroll
- **State Tracking**: Hover states, selection states, and animation phases
- **Carousel Support**: Autoplay, navigation controls, and slide management

#### Props Interface

```typescript
interface TestimonialSectionProps {
  className?: string;
  style?: JSX.CSSProperties;
  title?: string;
  subtitle?: string;
  badge?: string;
  testimonials: Testimonial[];
  theme?: 'light' | 'dark';
  variant?: 'simple' | 'hero' | 'split' | 'grid' | 'masonry' | 'carousel' | 'featured' | 'centered' | 'branded';
  layout?: 'grid' | 'masonry' | 'carousel' | 'split' | 'centered';
  animated?: boolean;
  showRatings?: boolean;
  backgroundPattern?: 'none' | 'dots' | 'beams' | 'gradient';
  backgroundImage?: string;
  autoplay?: boolean;
  staggerDelay?: number;
  animationDuration?: number;
  onTestimonialSelect?: (testimonial: Testimonial) => void;
  onAnimationComplete?: () => void;
}

interface Testimonial {
  id: string;
  body: string;
  author: TestimonialAuthor;
  rating?: number;
  category?: string;
  featured?: boolean;
  priority?: boolean;
  date?: string;
  verified?: boolean;
}

interface TestimonialAuthor {
  name: string;
  handle?: string;
  title?: string;
  company?: string;
  imageUrl?: string;
  logoUrl?: string;
}
```

#### Usage Examples

**Basic Grid Layout**
```tsx
import { TestimonialSection } from '@sse/ui/solidstack/tailwindplus';

const testimonials = [
  {
    id: '1',
    body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    author: {
      name: 'Judith Black',
      title: 'CEO',
      company: 'Workcation',
      imageUrl: '/author-image.jpg'
    },
    rating: 5,
    category: 'enterprise'
  },
  // ... more testimonials
];

<TestimonialSection
  badge="Testimonials"
  title="We have worked with thousands of amazing people"
  subtitle="Hear what our customers have to say"
  testimonials={testimonials}
  theme="light"
  variant="grid"
  animated={true}
  showRatings={true}
  backgroundPattern="gradient"
  onTestimonialSelect={(testimonial) => handleSelect(testimonial)}
/>
```

**Featured Testimonial Layout**
```tsx
<TestimonialSection
  testimonials={testimonials}
  theme="light"
  variant="featured"
  animated={true}
  showRatings={true}
  backgroundPattern="gradient"
  staggerDelay={200}
/>
```

### TestimonialSimple

A lightweight testimonial component for single testimonial displays with elegant animations.

#### Features
- **Simple Layouts**: Centered, minimal, logo, and gradient variants
- **Star Ratings**: Animated star displays with staggered reveals
- **Background Support**: Radial gradients, dots, and custom patterns
- **Company Logos**: Optional logo display with smooth animations
- **Theme Compatibility**: Seamless light and dark mode support

#### Props Interface

```typescript
interface TestimonialSimpleProps {
  className?: string;
  style?: JSX.CSSProperties;
  testimonial: Testimonial;
  theme?: 'light' | 'dark';
  variant?: 'centered' | 'minimal' | 'logo' | 'gradient';
  animated?: boolean;
  showRating?: boolean;
  showLogo?: boolean;
  backgroundPattern?: 'none' | 'dots' | 'gradient' | 'radial';
  companyLogo?: string;
  animationDelay?: number;
  onTestimonialSelect?: (testimonial: Testimonial) => void;
}
```

#### Usage Examples

**Centered with Radial Background**
```tsx
import { TestimonialSimple } from '@sse/ui/solidstack/tailwindplus';

<TestimonialSimple
  testimonial={testimonial}
  theme="light"
  variant="centered"
  animated={true}
  showRating={true}
  showLogo={true}
  backgroundPattern="radial"
/>
```

**Gradient Background Variant**
```tsx
<TestimonialSimple
  testimonial={testimonial}
  theme="light"
  variant="gradient"
  animated={true}
  showRating={true}
  backgroundPattern="none"
/>
```

### TestimonialHero

Specialized component for hero testimonial displays with split layouts and overlay designs.

#### Features
- **Split Layouts**: Left/right content arrangement with images
- **Overlay Designs**: Background images with gradient overlays
- **Quote SVG**: Decorative quote marks with theme-aware styling
- **Background Effects**: BackgroundBeams, gradient blobs, and image overlays
- **Hero Images**: Support for author or hero images in split layouts

#### Props Interface

```typescript
interface TestimonialHeroProps {
  className?: string;
  style?: JSX.CSSProperties;
  testimonial: Testimonial;
  theme?: 'light' | 'dark';
  variant?: 'split' | 'overlay' | 'split-reverse' | 'image-bg' | 'gradient';
  animated?: boolean;
  showLogo?: boolean;
  backgroundImage?: string;
  heroImage?: string;
  companyLogo?: string;
  overlayOpacity?: number;
  animationDelay?: number;
  onTestimonialSelect?: (testimonial: Testimonial) => void;
}
```

#### Usage Examples

**Split Layout with Hero Image**
```tsx
import { TestimonialHero } from '@sse/ui/solidstack/tailwindplus';

<TestimonialHero
  testimonial={testimonial}
  theme="dark"
  variant="split"
  animated={true}
  showLogo={true}
  heroImage="/hero-image.jpg"
/>
```

**Overlay with Background Image**
```tsx
<TestimonialHero
  testimonial={testimonial}
  theme="dark"
  variant="overlay"
  animated={true}
  showLogo={true}
  backgroundImage="/background.jpg"
  overlayOpacity={0.9}
/>
```

## Animation Augmentations

### From Aceternity UI
- **TextAnimate**: Smooth quote text reveals with multiple animation variants
- **BackgroundBeams**: Dynamic background effects for hero sections
- **Gradient Overlays**: Complex gradient backgrounds with clip-path masks
- **Quote SVG**: Animated decorative quote marks

### From Magic UI
- **BlurFade**: Progressive reveal animations for testimonials and elements
- **BorderBeam**: Interactive border highlights for hovered cards
- **DotPattern**: Subtle background patterns for visual texture
- **NumberTicker**: Animated star rating reveals (when using numeric ratings)

## State Machine Architecture

All testimonial components follow Zag.js state machine patterns for predictable state management:

### State Values
- `initializing` - Component setup phase
- `idle` - Ready for user interaction
- `loading` - Preparing animations
- `animating` - Animations in progress
- `interactive` - User interaction states (hover, selection)
- `complete` - All animations finished
- `error` - Error state handling

### Context Management

```typescript
interface TestimonialSectionContext {
  id: string;
  testimonialData: TestimonialSection;
  activeTestimonialId: string | null;
  hoveredTestimonialId: string | null;
  visibleTestimonials: Set<string>;
  animatedTestimonials: Set<string>;
  completedTestimonials: Set<string>;
  animationPhase: 'idle' | 'loading' | 'animating' | 'complete';
  theme: 'light' | 'dark';
  variant: string;
  isVisible: boolean;
  autoplayEnabled: boolean;
  showRatings: boolean;
  currentSlide: number;
  slidesPerView: number;
  filterCategory: string | null;
  sortOrder: 'default' | 'rating' | 'date' | 'priority';
  errorState: string | null;
}
```

### State Machine API

```typescript
interface TestimonialSectionAPI {
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
  hoverTestimonial: (testimonialId: string) => void;
  unhoverTestimonial: () => void;
  selectTestimonial: (testimonialId: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  updateTestimonials: (testimonials: Testimonial[]) => void;
  toggleAutoplay: (enabled: boolean) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  
  // Computed properties
  filteredTestimonials: Testimonial[];
  sortedTestimonials: Testimonial[];
  featuredTestimonials: Testimonial[];
  animationProgress: number;
}
```

## Responsive Design

### Mobile (< 640px)
- **Single Column**: Stacked testimonial layouts
- **Touch Optimizations**: Larger touch targets for interaction
- **Simplified Animations**: Reduced motion for performance
- **Compact Headers**: Condensed title and subtitle layouts
- **Full-Width Cards**: Maximize screen usage

### Tablet (640px - 1024px)
- **Two-Column Grids**: Testimonials in pairs
- **Enhanced Interactions**: Hover states enabled
- **Balanced Layouts**: Optimized content distribution
- **Medium Animations**: Partial animation suite
- **Responsive Images**: Appropriately sized author photos

### Desktop (1024px+)
- **Multi-Column Layouts**: Full grid displays (3-4 columns)
- **Advanced Animations**: Complete animation suite
- **Rich Interactions**: Full hover and selection states
- **Enhanced Visual Effects**: Background patterns and overlays
- **Masonry Support**: Dynamic column layouts

## Theme System

### Light Theme
- **Clean Backgrounds**: White and light gray surfaces
- **Subtle Shadows**: Minimal depth indicators for cards
- **High Contrast**: Dark text on light backgrounds
- **Indigo Accents**: Consistent brand color usage
- **Gray Borders**: Subtle card boundaries

### Dark Theme
- **Rich Backgrounds**: Dark gray and black surfaces
- **Enhanced Borders**: Subtle white border outlines
- **Purple Gradients**: Vibrant accent combinations
- **Optimized Contrast**: Proper text readability
- **Blue Highlights**: Star ratings and interactive elements

## Performance Optimizations

### Animation Performance
- **RAF Scheduling**: Smooth 60fps animations using requestAnimationFrame
- **GPU Acceleration**: Transform-based animations for optimal performance
- **Intersection Observers**: Lazy animation triggering based on viewport visibility
- **Staggered Reveals**: Intelligent delay management for multiple testimonials
- **Reduced Motion**: Respect user preferences for reduced motion

### State Management
- **Efficient Updates**: Minimal re-renders through precise dependency tracking
- **Memory Management**: Proper cleanup on component unmount
- **Event Debouncing**: Hover and interaction throttling
- **Cached Computations**: Optimized derived state calculations
- **Lazy Loading**: Progressive testimonial loading for large sets

### Loading Strategies
- **Progressive Enhancement**: Core functionality first, animations second
- **Code Splitting**: Lazy loading of animation components
- **Asset Optimization**: Optimized author images and logos
- **Bundle Analysis**: Minimal impact on bundle size

## Accessibility Features

### Keyboard Navigation
- **Tab Order**: Logical focus progression through testimonials
- **Escape Handling**: Clear selection and focus states
- **Enter Activation**: Testimonial selection and interaction
- **Arrow Navigation**: Carousel and grid traversal
- **Focus Indicators**: Clear visual focus states

### Screen Reader Support
- **ARIA Labels**: Descriptive element labeling
- **Live Regions**: Dynamic content announcements
- **Semantic HTML**: Proper figure, blockquote, and citation markup
- **Focus Management**: Clear focus indicators and states
- **Role Attributes**: Proper ARIA roles for interactive elements

### Visual Accessibility
- **Color Contrast**: WCAG AA compliance across all themes
- **Focus Indicators**: Visible focus states for all interactive elements
- **Text Scaling**: Responsive typography that scales properly
- **Motion Preferences**: Reduced animation options for motion sensitivity
- **High Contrast Mode**: Support for system high contrast modes

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Integration Examples

### Custom Animation Handlers
```tsx
const handleAnimationComplete = () => {
  analytics.track('testimonial_animation_completed', {
    component: 'TestimonialSection',
    variant: 'grid',
    testimonialCount: testimonials.length
  });
};

<TestimonialSection
  testimonials={testimonials}
  onAnimationComplete={handleAnimationComplete}
/>
```

### State Machine Extensions
```tsx
const testimonialSection = useTestimonialSection({
  onTestimonialSelect: (testimonialId) => {
    analytics.track('testimonial_selected', { testimonialId });
    router.navigate(`/testimonials/${testimonialId}`);
  },
  onAnimationComplete: () => {
    setAnimationsCompleted(true);
  }
});
```

### Carousel Integration
```tsx
const CarouselTestimonials = () => {
  const testimonialSection = useTestimonialSection({
    autoplayEnabled: true,
    slidesPerView: 3
  });

  useEffect(() => {
    const interval = setInterval(() => {
      testimonialSection.nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TestimonialSection
      testimonials={testimonials}
      variant="carousel"
      autoplay={true}
    />
  );
};
```

## Advanced Customization

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

<TestimonialSection
  testimonials={testimonials}
  theme="dark"
  style={{ '--theme-primary': customTheme.colors.primary }}
/>
```

### Custom Rating Components
```tsx
const CustomStarRating = ({ rating }) => {
  return (
    <div className="custom-rating">
      {Array.from({ length: 5 }, (_, i) => (
        <BlurFade key={i} delay={i * 0.05}>
          <Star filled={i < rating} />
        </BlurFade>
      ))}
    </div>
  );
};
```

### Background Pattern Customization
```tsx
<TestimonialSection
  testimonials={testimonials}
  backgroundPattern="custom"
  style={{
    '--pattern-opacity': '0.1',
    '--pattern-size': '20px',
    '--pattern-color': '#6366f1'
  }}
/>
```

## Layout Variants

### Grid Layout
- **Standard Grid**: 1-3 columns based on screen size
- **Featured Grid**: Highlighted featured testimonial with supporting testimonials
- **Masonry Grid**: Dynamic column heights based on content length

### Split Layouts
- **Side-by-Side**: Two testimonials side by side
- **Hero Split**: Large image with testimonial content
- **Split Reverse**: Reversed image and content order

### Specialized Layouts
- **Carousel**: Sliding testimonials with navigation
- **Centered**: Single testimonial centered display
- **Branded**: Company logo integration with testimonials

## Star Rating System

### Animated Ratings
- **Staggered Reveal**: Stars appear with progressive delays
- **Theme Aware**: Colors adapt to light/dark themes
- **Hover Effects**: Interactive rating displays
- **Screen Reader**: Proper ARIA labels for accessibility

### Rating Display Options
```tsx
// Show numeric ratings with stars
<TestimonialSection showRatings={true} />

// Hide ratings completely
<TestimonialSection showRatings={false} />

// Custom rating display
const CustomRating = ({ rating }) => (
  <div className="flex gap-1">
    {Array.from({ length: rating }, (_, i) => (
      <Star key={i} className="text-yellow-400" />
    ))}
  </div>
);
```

## Contributing

When extending these components:

1. **Follow State Machine Patterns**: Use Zag.js for predictable state management
2. **Maintain Animation Consistency**: Use established animation patterns from Aceternity UI & Magic UI
3. **Ensure Accessibility**: Include proper ARIA support and keyboard navigation
4. **Test Responsiveness**: Verify mobile, tablet, and desktop layouts
5. **Document Changes**: Update type definitions and usage examples
6. **Performance**: Maintain efficient rendering and animation performance

## Examples

See the `TestimonialShowcase` and `ComprehensiveTestimonialDemo` components for live examples of all variants and their capabilities. The showcase includes interactive demos, theme switching, and comprehensive feature demonstrations.

## Related Components

- **TextAnimate**: Quote text animation from Magic UI
- **BlurFade**: Progressive reveal animations from Magic UI
- **BorderBeam**: Interactive border effects from Magic UI
- **BackgroundBeams**: Dynamic background patterns from Aceternity UI
- **DotPattern**: Subtle background textures from Magic UI