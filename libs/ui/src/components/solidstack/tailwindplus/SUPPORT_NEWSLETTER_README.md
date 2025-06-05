# SolidStack-UI Support & Newsletter Components

Comprehensive collection of enterprise-grade support center and newsletter subscription components built with SolidJS, Zag.js state machines, PandaCSS, and enhanced with thoughtful animation augmentations from Aceternity UI & Magic UI.

## Overview

This support and newsletter component library provides state-of-the-art user engagement interfaces with advanced features including:

- **State Machine Architecture**: Powered by Zag.js for predictable state management
- **Animation Augmentations**: Enhanced with carefully selected animations from Aceternity UI & Magic UI
- **Theme Support**: Light and dark themes with seamless switching
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Enterprise Features**: Contact management, form validation, and advanced interactions
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## Support Center Components

### SupportCenter

A comprehensive support center component with multiple layout variants and interactive features.

#### Features
- **Multiple Variants**: Simple, hero, cards, and split layouts
- **Contact Management**: Phone, chat, email, and form-based interactions
- **Search & Filtering**: Real-time search and availability filtering
- **Hover Animations**: Smooth card interactions with BorderBeam effects
- **State Tracking**: Contact states, availability status, and user interactions

#### Props Interface

```typescript
interface SupportCenterProps {
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  cards: SupportCard[];
  theme?: "light" | "dark";
  variant?: "simple" | "hero" | "split" | "cards";
  animated?: boolean;
  backgroundPattern?: "none" | "dots" | "beams" | "gradient";
  showSearch?: boolean;
  showFilters?: boolean;
  onContactSelect?: (card: SupportCard, method?: string) => void;
  heroImage?: string;
}

interface SupportCard {
  id: string;
  name: string;
  description: string;
  icon: any;
  href?: string;
  contactMethod?: "email" | "phone" | "chat" | "form";
  available?: boolean;
  priority?: boolean;
}
```

#### Usage Examples

**Basic Support Center**
```tsx
import { SupportCenter } from '@sse/ui/solidstack/tailwindplus';

const supportCards = [
  {
    id: "sales",
    name: "Sales",
    description: "Get help with pricing and product questions",
    icon: PhoneIcon,
    contactMethod: "phone",
    available: true,
  },
  {
    id: "support",
    name: "Technical Support", 
    description: "Resolve technical issues and bugs",
    icon: LifebuoyIcon,
    contactMethod: "chat",
    available: true,
    priority: true,
  }
];

<SupportCenter
  title="Support Center"
  subtitle="Get the help you need from our expert team"
  cards={supportCards}
  theme="dark"
  variant="hero"
  animated={true}
  backgroundPattern="beams"
  showSearch={true}
  onContactSelect={(card, method) => handleContact(card, method)}
/>
```

**Hero Variant with Background**
```tsx
<SupportCenter
  badge="Support"
  title="How can we help you?"
  subtitle="Our support team is here to assist you 24/7"
  cards={supportCards}
  variant="hero"
  theme="dark"
  heroImage="/support-hero.jpg"
  backgroundPattern="gradient"
  showSearch={true}
  showFilters={true}
/>
```

### Support State Machine

The support center uses a Zag.js state machine for managing interactions:

```typescript
interface SupportSectionContext {
  activeCard: string | null;
  hoveredCard: string | null;
  selectedContactMethod: string | null;
  isVisible: boolean;
  animationPhase: "loading" | "animating" | "complete";
  theme: "light" | "dark";
  formState: "idle" | "submitting" | "success" | "error";
  filterMode: "all" | "available" | "priority";
  searchQuery: string;
}
```

#### State Machine Events
- `hoverCard(id)` - Handle card hover states
- `selectCard(id)` - Handle card selection
- `initiateContact(id, method)` - Start contact process
- `setFilterMode(mode)` - Change filter settings
- `setSearchQuery(query)` - Update search query

## Newsletter Subscription Components

### NewsletterSubscription

A flexible newsletter subscription component with multiple layout variants and form validation.

#### Features
- **Multiple Variants**: Simple, centered, split, card, and inline layouts
- **Form Validation**: Real-time email validation and error handling
- **Privacy Compliance**: Built-in privacy policy acceptance
- **Animation States**: Loading, success, and error animations
- **Feature Showcase**: Optional feature highlights with icons

#### Props Interface

```typescript
interface NewsletterSubscriptionProps {
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  features?: NewsletterFeature[];
  theme?: "light" | "dark";
  variant?: "simple" | "centered" | "split" | "card" | "inline";
  animated?: boolean;
  backgroundPattern?: "none" | "dots" | "beams" | "gradient";
  showPrivacyPolicy?: boolean;
  showFeatures?: boolean;
  onSubscribe?: (email: string, data?: any) => void;
  onError?: (error: string) => void;
  privacyPolicyUrl?: string;
  backgroundImage?: string;
}

interface NewsletterFeature {
  id: string;
  icon: any;
  title: string;
  description: string;
}
```

#### Usage Examples

**Simple Newsletter Signup**
```tsx
import { NewsletterSubscription } from '@sse/ui/solidstack/tailwindplus';

<NewsletterSubscription
  title="Want product news and updates?"
  subtitle="Sign up for our newsletter to stay informed"
  theme="light"
  variant="simple"
  animated={true}
  showPrivacyPolicy={true}
  onSubscribe={(email) => handleSubscription(email)}
  onError={(error) => handleError(error)}
/>
```

**Split Layout with Features**
```tsx
const features = [
  {
    id: "weekly",
    icon: CalendarIcon,
    title: "Weekly articles",
    description: "Get the latest insights delivered weekly",
  },
  {
    id: "nospam", 
    icon: ShieldIcon,
    title: "No spam",
    description: "We respect your inbox and privacy",
  }
];

<NewsletterSubscription
  badge="Newsletter"
  title="Subscribe to our newsletter"
  subtitle="Stay updated with our latest news and insights"
  features={features}
  theme="dark"
  variant="split"
  backgroundPattern="gradient"
  showFeatures={true}
  showPrivacyPolicy={true}
/>
```

**Card Variant with Enhanced Effects**
```tsx
<NewsletterSubscription
  title="Get notified when we launch"
  subtitle="Be the first to know about our exciting new features"
  theme="dark"
  variant="card"
  backgroundPattern="beams"
  animated={true}
  onSubscribe={(email, data) => handleLaunchNotification(email, data)}
/>
```

### Newsletter State Machine

The newsletter component uses a comprehensive state machine for form management:

```typescript
interface NewsletterSectionContext {
  formData: NewsletterFormData;
  formState: "idle" | "validating" | "submitting" | "success" | "error";
  validationErrors: Record<string, string>;
  isEmailValid: boolean;
  focusedField: string | null;
  subscriptionType: "newsletter" | "updates" | "announcements" | "all";
  submitCount: number;
}
```

#### Form Validation Features
- **Real-time Email Validation**: Instant feedback on email format
- **Privacy Policy Enforcement**: Required acceptance tracking
- **Rate Limiting**: Prevents spam submissions
- **Error Recovery**: Clear error states and messaging
- **Success Handling**: Confirmation messages and form reset

## Animation Augmentations

### From Aceternity UI
- **BorderBeam**: Animated borders for focused elements and priority cards
- **TextAnimate**: Smooth text reveals with multiple animation variants
- **BackgroundBeams**: Dynamic background effects for hero sections
- **Gradient Overlays**: Subtle background gradients for visual depth

### From Magic UI
- **BlurFade**: Progressive reveal animations for cards and sections
- **ShimmerButton**: Enhanced CTA buttons with shimmer effects
- **DotPattern**: Subtle background patterns for visual texture
- **HoverCard**: Interactive card hover effects

## Responsive Design

### Mobile (< 640px)
- **Stacked Layouts**: Single column arrangements
- **Touch Optimizations**: Larger touch targets
- **Simplified Animations**: Reduced motion for performance
- **Form Adaptations**: Full-width inputs and buttons

### Tablet (640px - 1024px)
- **Two-Column Grids**: Support cards in pairs
- **Enhanced Interactions**: Hover states enabled
- **Balanced Layouts**: Optimized content distribution

### Desktop (1024px+)
- **Multi-Column Layouts**: Full grid displays
- **Advanced Animations**: Complete animation suite
- **Split Layouts**: Side-by-side content arrangements
- **Enhanced Visual Effects**: Full background patterns and overlays

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

## State Machine Architecture

Both support and newsletter components follow Zag.js state machine patterns:

### State Values
- `initializing` - Component setup phase
- `idle` - Ready for user interaction
- `interacting` - User is engaging with UI
- `submitting` - Processing form data
- `success` - Successful completion
- `error` - Error state handling

### Context Management
- **Reactive Updates**: Real-time state synchronization
- **Event Handling**: Predictable state transitions
- **Side Effects**: Managed async operations
- **Cleanup**: Proper resource disposal

## Performance Optimizations

### Animation Performance
- **RAF Scheduling**: Smooth 60fps animations
- **GPU Acceleration**: Transform-based animations
- **Intersection Observers**: Lazy animation triggering
- **Reduced Motion**: Respect user preferences

### State Management
- **Efficient Updates**: Minimal re-renders
- **Memory Management**: Proper cleanup on unmount
- **Event Debouncing**: Search and validation throttling
- **Cached Computations**: Optimized derived state

## Accessibility Features

### Keyboard Navigation
- **Tab Order**: Logical focus progression
- **Escape Handling**: Modal and form dismissal
- **Enter Activation**: Form submission support
- **Arrow Navigation**: Grid and list traversal

### Screen Reader Support
- **ARIA Labels**: Descriptive element labeling
- **Live Regions**: Dynamic content announcements
- **Semantic HTML**: Proper heading hierarchy
- **Focus Management**: Clear focus indicators

### Visual Accessibility
- **Color Contrast**: WCAG AA compliance
- **Focus Indicators**: Visible focus states
- **Text Scaling**: Responsive typography
- **Motion Preferences**: Reduced animation options

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Integration Examples

### Custom Contact Handlers
```tsx
const handleContactSelection = (card: SupportCard, method?: string) => {
  switch (method) {
    case 'phone':
      window.open(`tel:${card.phone}`);
      break;
    case 'email':
      window.open(`mailto:${card.email}`);
      break;
    case 'chat':
      openChatWidget(card.id);
      break;
    default:
      navigateToContact(card.href);
  }
};
```

### Newsletter API Integration
```tsx
const handleNewsletterSubscription = async (email: string, data: any) => {
  try {
    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, ...data }),
    });
    
    if (!response.ok) throw new Error('Subscription failed');
    
    // Handle success
    showSuccessNotification('Welcome to our newsletter!');
  } catch (error) {
    // Handle error
    showErrorNotification(error.message);
  }
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
```

### State Machine Extensions
```tsx
const extendedSupportMachine = useSupportSection();

// Add custom event handlers
extendedSupportMachine.on('contact.initiated', (context, event) => {
  analytics.track('support_contact_started', {
    cardId: event.cardId,
    method: event.method,
  });
});
```

## Contributing

When extending these components:

1. **Follow State Machine Patterns**: Use Zag.js for predictable state management
2. **Maintain Animation Consistency**: Use established animation patterns
3. **Ensure Accessibility**: Include proper ARIA support
4. **Test Responsiveness**: Verify mobile and desktop layouts
5. **Document Changes**: Update type definitions and examples

## Examples

See the `SupportNewsletterShowcase` component for live examples of all variants and their capabilities. The showcase includes interactive demos, theme switching, and comprehensive feature demonstrations.