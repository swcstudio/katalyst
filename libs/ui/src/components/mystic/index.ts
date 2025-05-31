// Utility functions
export * from "./utils.ts"

// Core components
export { AuroraButton } from "./AuroraButton.tsx"
export type { AuroraButtonProps } from "./AuroraButton.tsx"

export { GlassCard } from "./GlassCard.tsx"
export type { GlassCardProps } from "./GlassCard.tsx"

export { AnimatedText } from "./AnimatedText.tsx"
export type { AnimatedTextProps } from "./AnimatedText.tsx"

export { FloatingParticles } from "./FloatingParticles.tsx"
export type { FloatingParticlesProps, Particle } from "./FloatingParticles.tsx"

export { MysticShowcase } from "./MysticShowcase.tsx"

// Backgrounds
export { default as DotPattern } from "./backgrounds/DotPattern.tsx"
export type { DotPatternProps } from "./backgrounds/DotPattern.tsx"

export { default as GridPattern } from "./backgrounds/GridPattern.tsx"
export type { GridPatternProps } from "./backgrounds/GridPattern.tsx"

export { default as NoSignalScreen } from "./backgrounds/NoSignalScreen.tsx"
export type { NoSignalScreenProps } from "./backgrounds/NoSignalScreen.tsx"

export { default as RetroGrid } from "./backgrounds/RetroGrid.tsx"
export type { RetroGridProps } from "./backgrounds/RetroGrid.tsx"

export { default as Ripple } from "./backgrounds/Ripple.tsx"
export type { RippleProps } from "./backgrounds/Ripple.tsx"

// Components
export { default as Dock } from "./components/Dock.tsx"
export type { DockProps, DockItem } from "./components/Dock.tsx"

export { default as Marquee } from "./components/Marquee.tsx"
export type { MarqueeProps } from "./components/Marquee.tsx"

export { default as OrbitingCircles } from "./components/OrbitingCircles.tsx"
export type { OrbitingCirclesProps } from "./components/OrbitingCircles.tsx"

// Device Mocks
export { default as Android } from "./device-mocks/Android.tsx"
export type { AndroidProps } from "./device-mocks/Android.tsx"

export { default as iPhone15 } from "./device-mocks/iPhone15.tsx"
export type { iPhone15Props } from "./device-mocks/iPhone15.tsx"

export { default as Safari } from "./device-mocks/Safari.tsx"
export type { SafariProps, SafariTab } from "./device-mocks/Safari.tsx"

// Effects
export { default as AnimatedBeam } from "./effects/AnimatedBeam.tsx"
export type { AnimatedBeamProps } from "./effects/AnimatedBeam.tsx"

export { default as BorderBeam } from "./effects/BorderBeam.tsx"
export type { BorderBeamProps } from "./effects/BorderBeam.tsx"

export { default as Meteors } from "./effects/Meteors.tsx"
export type { MeteorsProps } from "./effects/Meteors.tsx"

// Text Effects
export { default as AnimatedShinyText } from "./text-effects/AnimatedShinyText.tsx"
export type { AnimatedShinyTextProps } from "./text-effects/AnimatedShinyText.tsx"

export { default as TypingAnimation } from "./text-effects/TypingAnimation.tsx"
export type { TypingAnimationProps } from "./text-effects/TypingAnimation.tsx"

// Showcase Components
export { default as MysticUIShowcase } from "./MysticUIShowcase.tsx"
export type { MysticUIShowcaseProps } from "./MysticUIShowcase.tsx"

// Re-export utility functions for easy access
export { cn, animations, colorVariants, sizeVariants, typography, glassMorphism, gradients, shadows, borderRadius, states, responsive, darkMode } from "./utils.ts"