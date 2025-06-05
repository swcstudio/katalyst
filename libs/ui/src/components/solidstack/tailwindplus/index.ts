// TailwindPlus Hero Components
export { HeroSimple } from './HeroSimple';
export type { HeroSimpleProps } from './HeroSimple';

export { HeroSplit } from './HeroSplit';
export type { HeroSplitProps } from './HeroSplit';

// TailwindPlus Feature Components
export { FeatureSplit } from './FeatureSplit';
export type { FeatureSplitProps, Feature } from './FeatureSplit';

export { FeatureGrid } from './FeatureGrid';
export type { FeatureGridProps } from './FeatureGrid';

export { FeatureSimple } from './FeatureSimple';
export type { FeatureSimpleProps } from './FeatureSimple';

// TailwindPlus Advanced Feature Components
export { FeatureCenteredGrid } from './features/FeatureCenteredGrid';
export type { FeatureCenteredGridProps } from './features/FeatureCenteredGrid';

export { FeatureSplitImage } from './features/FeatureSplitImage';
export type { FeatureSplitImageProps, Testimonial } from './features/FeatureSplitImage';

export { FeatureSimpleList } from './features/FeatureSimpleList';
export type { FeatureSimpleListProps } from './features/FeatureSimpleList';

export { FeatureShowcaseDemo } from './features/FeatureShowcaseDemo';

export { FeatureComponentsTest } from './features/FeatureComponentsTest';

export { CTAPricingTest } from './CTAPricingTest';

// TailwindPlus CTA Components
export { CTASimple } from './cta/CTASimple';
export type { CTASimpleProps, CTAButton } from './cta/CTASimple';

export { CTASplit } from './cta/CTASplit';
export type { CTASplitProps, CTASplitImage } from './cta/CTASplit';

// TailwindPlus Pricing Components
export { PricingSimple } from './pricing/PricingSimple';
export type { PricingSimpleProps, PricingTier, PricingFrequency } from './pricing/PricingSimple';

export { PricingDemo } from './pricing/PricingDemo';
export type { PricingDemoProps, PricingTier as DemoPricingTier, PricingFrequency as DemoPricingFrequency } from './pricing/PricingDemo';

export { PricingGrid } from './pricing/components/PricingGrid';
export type { PricingGridProps, PricingTier as GridPricingTier, PricingFrequency as GridPricingFrequency } from './pricing/components/PricingGrid';

export { PricingTable } from './pricing/components/PricingTable';
export type { PricingTableProps, PricingTier as TablePricingTier, PricingFeature, PricingSection, PricingFrequency as TablePricingFrequency } from './pricing/components/PricingTable';

export { PricingSplit } from './pricing/components/PricingSplit';
export type { PricingSplitProps, PricingTier as SplitPricingTier, PricingFrequency as SplitPricingFrequency } from './pricing/components/PricingSplit';

export { PricingShowcase } from './pricing/components/PricingShowcase';

export { ComprehensivePricingDemo } from './ComprehensivePricingDemo';

// TailwindPlus Support Components
export { SupportCenter } from './support/components/SupportCenter';
export type { SupportCenterProps, SupportCard } from './support/components/SupportCenter';

export { useSupportSection } from './support/state/useSupportSection';
export type { SupportSectionAPI, SupportSectionContext, SupportSectionState } from './support/state/useSupportSection';

// TailwindPlus Newsletter Components
export { NewsletterSubscription } from './newsletter/components/NewsletterSubscription';
export type { NewsletterSubscriptionProps, NewsletterFeature } from './newsletter/components/NewsletterSubscription';

export { useNewsletterSection } from './newsletter/state/useNewsletterSection';
export type { NewsletterSectionAPI, NewsletterFormData, NewsletterSectionContext, NewsletterSectionState } from './newsletter/state/useNewsletterSection';

// TailwindPlus Support & Newsletter Showcase
export { SupportNewsletterShowcase } from './SupportNewsletterShowcase';

// TailwindPlus Advanced Demo
export { TailwindPlusAdvancedDemo } from './TailwindPlusAdvancedDemo';

// TailwindPlus CTA & Pricing Showcase
export { CTAPricingShowcase } from './CTAPricingShowcase';

// TailwindPlus Showcase
export { TailwindPlusShowcase } from './TailwindPlusShowcase';
export { CompleteTailwindPlusDemo } from './CompleteTailwindPlusDemo';
export { FeatureShowcase } from './FeatureShowcase';
export { CompleteTailwindPlusFeatureDemo } from './CompleteTailwindPlusFeatureDemo';

// Hooks
export { useNavigation } from './hooks/useNavigation';
export type { NavigationAPI } from './hooks/useNavigation';

export { useFeatureSection } from './features/state/useFeatureSection';
export type { FeatureSectionAPI } from './features/state/useFeatureSection';

export { useCTASection } from './cta/state/useCTASection';
export type { CTASectionAPI } from './cta/state/useCTASection';

export { usePricingSection } from './pricing/state/usePricingSection';
export type { PricingSectionAPI } from './pricing/state/usePricingSection';

// Navigation State Machine Types
export type {
  NavigationContext,
  NavigationState
} from './hooks/useNavigation';

// Feature Section State Machine Types
export type {
  FeatureSectionContext,
  FeatureSectionState
} from './features/state/useFeatureSection';

// CTA Section State Machine Types
export type {
  CTASectionContext,
  CTASectionState
} from './cta/state/useCTASection';

// Pricing Section State Machine Types
export type {
  PricingSectionContext,
  PricingSectionState
} from './pricing/state/usePricingSection';

// TailwindPlus Statistics Components
export { StatisticsSection } from './stats/components/StatisticsSection';
export type { StatisticsSectionProps, StatisticsSectionDemoProps } from './stats/components/StatisticsSection';

export { StatsSimple, StatsSimpleDemo, StatsSimpleDarkDemo } from './stats/components/StatsSimple';
export type { StatsSimpleProps, StatsSimpleDemoProps } from './stats/components/StatsSimple';

export { StatsWithHeader, StatsWithHeaderDemo, StatsWithHeaderBackgroundDemo } from './stats/components/StatsWithHeader';
export type { StatsWithHeaderProps, StatsWithHeaderDemoProps } from './stats/components/StatsWithHeader';

export { StatsTimeline, StatsTimelineDemo, StatsTimelineVerticalDemo } from './stats/components/StatsTimeline';
export type { StatsTimelineProps, StatsTimelineDemoProps, TimelineStatItem } from './stats/components/StatsTimeline';

export { StatsShowcase } from './stats/components/StatsShowcase';
export type { StatsShowcaseProps } from './stats/components/StatsShowcase';

export { ComprehensiveStatsDemo } from './stats/components/ComprehensiveStatsDemo';
export type { ComprehensiveStatsDemoProps } from './stats/components/ComprehensiveStatsDemo';

export { useStatsSection } from './stats/state/useStatsSection';
export type { 
  StatsSectionAPI, 
  StatsSectionContext, 
  StatsSectionState, 
  StatItem, 
  StatsSection 
} from './stats/state/useStatsSection';

// TailwindPlus Testimonial Components
export { TestimonialSection } from './testimonials/components/TestimonialSection';
export type { TestimonialSectionProps, TestimonialSectionDemoProps } from './testimonials/components/TestimonialSection';

export { TestimonialSimple, TestimonialSimpleDemo, TestimonialSimpleGradientDemo } from './testimonials/components/TestimonialSimple';
export type { TestimonialSimpleProps, TestimonialSimpleDemoProps } from './testimonials/components/TestimonialSimple';

export { TestimonialHero, TestimonialHeroDemo, TestimonialHeroOverlayDemo } from './testimonials/components/TestimonialHero';
export type { TestimonialHeroProps, TestimonialHeroDemoProps } from './testimonials/components/TestimonialHero';

export { TestimonialShowcase } from './testimonials/components/TestimonialShowcase';
export type { TestimonialShowcaseProps } from './testimonials/components/TestimonialShowcase';

export { ComprehensiveTestimonialDemo } from './testimonials/components/ComprehensiveTestimonialDemo';
export type { ComprehensiveTestimonialDemoProps } from './testimonials/components/ComprehensiveTestimonialDemo';

export { useTestimonialSection } from './testimonials/state/useTestimonialSection';
export type { 
  TestimonialSectionAPI, 
  TestimonialSectionContext, 
  TestimonialSectionState, 
  Testimonial,
  TestimonialAuthor,
  TestimonialSection as TestimonialSectionType
} from './testimonials/state/useTestimonialSection';

// TailwindPlus Blog Components
export { BlogGrid } from './blog/components/BlogGrid';
export type { BlogGridProps } from './blog/components/BlogGrid';

export { BlogImageGrid } from './blog/components/BlogImageGrid';
export type { BlogImageGridProps } from './blog/components/BlogImageGrid';

export { BlogOverlay } from './blog/components/BlogOverlay';
export type { BlogOverlayProps } from './blog/components/BlogOverlay';

export { BlogList } from './blog/components/BlogList';
export type { BlogListProps } from './blog/components/BlogList';

export { BlogShowcase } from './blog/components/BlogShowcase';
export type { BlogShowcaseProps } from './blog/components/BlogShowcase';

export { ComprehensiveBlogDemo } from './blog/components/ComprehensiveBlogDemo';
export type { ComprehensiveBlogDemoProps } from './blog/components/ComprehensiveBlogDemo';

export { useBlogSection } from './blog/state/useBlogSection';
export type { 
  BlogSectionAPI, 
  BlogSectionContext, 
  BlogSectionState, 
  BlogPost,
  BlogAuthor,
  BlogCategory,
  BlogSection as BlogSectionType,
  BlogSectionMachineOptions
} from './blog/state/useBlogSection';