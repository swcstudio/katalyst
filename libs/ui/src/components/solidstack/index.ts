// SolidStack Core Components - Foundation Layer (Zag.js powered)

// Form Controls
export { Button } from './Button.tsx';
export type { ButtonProps } from './Button.tsx';

export { Input } from './Input.tsx';
export type { InputProps } from './Input.tsx';

export { Checkbox } from './Checkbox.tsx';
export type { CheckboxProps } from './Checkbox.tsx';

export { Switch } from './Switch.tsx';
export type { SwitchProps } from './Switch.tsx';

export { NumberInput } from './NumberInput.tsx';
export type { NumberInputProps } from './NumberInput.tsx';

export { RadioGroup } from './RadioGroup.tsx';
export type { RadioGroupProps, RadioOption } from './RadioGroup.tsx';

// Layout & Navigation
export { Card, CardHeader, CardBody, CardFooter } from './Card.tsx';
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps } from './Card.tsx';

export { Accordion } from './Accordion.tsx';
export type { AccordionProps, AccordionItem } from './Accordion.tsx';

export { Tabs } from './Tabs.tsx';
export type { TabsProps, TabItem } from './Tabs.tsx';

// Feedback & Overlays
export { Tooltip } from './Tooltip.tsx';
export type { TooltipProps } from './Tooltip.tsx';

// Examples & Showcases
export { SimpleExample } from './SimpleExample.tsx';
export { ComprehensiveExample } from './ComprehensiveExample.tsx';

// SolidStack Demo Components - Showcase Layer
export {
  AnimatedShinyTextDemo,
  DotPatternDemo,
  GridPatternDemo,
  OrbitingCirclesDemo,
} from './demos/index.ts';

// MagicUI Components - Advanced Interactive Layer
export {
  // 3D Card Components
  CardContainer,
  CardBody,
  CardItem,
  ThreeDCardDemo,
  // 3D Marquee Components
  ThreeDMarquee,
  ThreeDMarqueeDemo,
  // Animated Pin Components
  PinContainer,
  AnimatedPinDemo,
  // Animated Modal Components
  Modal,
  ModalTrigger,
  ModalBody,
  ModalContent,
  ModalFooter,
  AnimatedModalDemo,
  // Animated Testimonials Components
  AnimatedTestimonials,
  AnimatedTestimonialsDemo,
  // Animated Tooltip Components
  AnimatedTooltip,
  AnimatedTooltipPreview,
} from './magicui/index';

// TailwindPlus Components - Enterprise Hero Layer
export {
  // Hero Components
  HeroSimple,
  HeroSplit,
  // Feature Components
  FeatureSplit,
  FeatureGrid,
  FeatureSimple,
  // TailwindPlus Showcase
  TailwindPlusShowcase,
  CompleteTailwindPlusDemo,
  FeatureShowcase,
  CompleteTailwindPlusFeatureDemo,
  // Navigation Hook
  useNavigation,
} from './tailwindplus/index';

export type {
  // Hero Component Props
  HeroSimpleProps,
  HeroSplitProps,
  // Feature Component Props
  FeatureSplitProps,
  FeatureGridProps,
  FeatureSimpleProps,
  Feature,
  // Navigation Types
  NavigationAPI,
  NavigationContext,
  NavigationState,
  NavigationItem,
} from './tailwindplus/index';
