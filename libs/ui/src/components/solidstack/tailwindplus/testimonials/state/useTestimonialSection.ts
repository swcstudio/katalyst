import { normalizeProps, useMachine } from '@zag-js/solid';
import { createMemo, createSignal, createUniqueId } from 'solid-js';

export interface TestimonialAuthor {
  name: string;
  handle?: string;
  title?: string;
  company?: string;
  imageUrl?: string;
  logoUrl?: string;
}

export interface Testimonial {
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

export interface TestimonialSection {
  id: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  testimonials: Testimonial[];
  layout?: 'grid' | 'masonry' | 'carousel' | 'split' | 'centered';
  theme?: 'light' | 'dark';
  backgroundImage?: string;
  backgroundPattern?: 'none' | 'dots' | 'beams' | 'gradient';
}

export interface TestimonialSectionContext {
  id: string;
  testimonialData: TestimonialSection;
  activeTestimonialId: string | null;
  hoveredTestimonialId: string | null;
  visibleTestimonials: Set<string>;
  animatedTestimonials: Set<string>;
  completedTestimonials: Set<string>;
  animationPhase: 'idle' | 'loading' | 'animating' | 'complete';
  theme: 'light' | 'dark';
  variant: 'simple' | 'hero' | 'split' | 'grid' | 'masonry' | 'carousel' | 'featured';
  isVisible: boolean;
  animationDuration: number;
  animationDelay: number;
  staggerDelay: number;
  autoplayEnabled: boolean;
  intersectionThreshold: number;
  filterCategory: string | null;
  sortOrder: 'default' | 'rating' | 'date' | 'priority';
  showRatings: boolean;
  currentSlide: number;
  slidesPerView: number;
  errorState: string | null;
}

export type TestimonialSectionState =
  | { value: 'initializing'; context: TestimonialSectionContext }
  | { value: 'idle'; context: TestimonialSectionContext }
  | { value: 'loading'; context: TestimonialSectionContext }
  | { value: 'animating'; context: TestimonialSectionContext }
  | { value: 'interactive'; context: TestimonialSectionContext }
  | { value: 'complete'; context: TestimonialSectionContext }
  | { value: 'error'; context: TestimonialSectionContext };

export type TestimonialSectionEvent =
  | { type: 'START_ANIMATION' }
  | { type: 'ANIMATION_COMPLETE' }
  | { type: 'TESTIMONIAL_VISIBLE'; testimonialId: string }
  | { type: 'TESTIMONIAL_ANIMATED'; testimonialId: string }
  | { type: 'TESTIMONIAL_COMPLETED'; testimonialId: string }
  | { type: 'HOVER_TESTIMONIAL'; testimonialId: string }
  | { type: 'UNHOVER_TESTIMONIAL' }
  | { type: 'SELECT_TESTIMONIAL'; testimonialId: string }
  | { type: 'DESELECT_TESTIMONIAL' }
  | { type: 'SET_THEME'; theme: 'light' | 'dark' }
  | { type: 'SET_VARIANT'; variant: string }
  | { type: 'SET_VISIBILITY'; isVisible: boolean }
  | { type: 'TOGGLE_AUTOPLAY'; enabled: boolean }
  | { type: 'SET_FILTER'; category: string | null }
  | { type: 'SET_SORT_ORDER'; order: string }
  | { type: 'UPDATE_TESTIMONIALS'; testimonials: Testimonial[] }
  | { type: 'NEXT_SLIDE' }
  | { type: 'PREV_SLIDE' }
  | { type: 'GO_TO_SLIDE'; slideIndex: number }
  | { type: 'TOGGLE_RATINGS'; show: boolean }
  | { type: 'RESET_ANIMATION' }
  | { type: 'ERROR'; message: string }
  | { type: 'RETRY' };

export interface TestimonialSectionMachineOptions {
  id?: string;
  testimonialData?: TestimonialSection;
  theme?: 'light' | 'dark';
  variant?: string;
  animationDuration?: number;
  animationDelay?: number;
  staggerDelay?: number;
  autoplayEnabled?: boolean;
  intersectionThreshold?: number;
  showRatings?: boolean;
  slidesPerView?: number;
  onTestimonialSelect?: (testimonialId: string) => void;
  onAnimationComplete?: () => void;
  onError?: (error: string) => void;
}

export function createTestimonialSectionMachine(options: TestimonialSectionMachineOptions = {}) {
  const {
    id = createUniqueId(),
    testimonialData = {
      id: createUniqueId(),
      testimonials: [],
      layout: 'grid',
      theme: 'light',
    },
    theme = 'light',
    variant = 'simple',
    animationDuration = 2000,
    animationDelay = 0,
    staggerDelay = 150,
    autoplayEnabled = false,
    intersectionThreshold = 0.1,
    showRatings = true,
    slidesPerView = 1,
    onTestimonialSelect,
    onAnimationComplete,
    onError,
  } = options;

  // Simple state management using SolidJS signals
  const [state, setState] = createSignal('initializing');
  const [context, setContext] = createSignal<TestimonialSectionContext>({
    id,
    testimonialData,
    activeTestimonialId: null,
    hoveredTestimonialId: null,
    visibleTestimonials: new Set(),
    animatedTestimonials: new Set(),
    completedTestimonials: new Set(),
    animationPhase: 'idle',
    theme,
    variant,
    isVisible: false,
    animationDuration,
    animationDelay,
    staggerDelay,
    autoplayEnabled,
    intersectionThreshold,
    filterCategory: null,
    sortOrder: 'default',
    showRatings,
    currentSlide: 0,
    slidesPerView,
    errorState: null,
  });

  const send = (event: TestimonialSectionEvent) => {
    const currentState = state();
    const currentContext = context();

    switch (event.type) {
      case 'START_ANIMATION':
        setState('animating');
        setContext((prev) => ({ ...prev, animationPhase: 'animating' }));
        break;
      case 'SET_VISIBILITY':
        if ('isVisible' in event) {
          setContext((prev) => ({ ...prev, isVisible: event.isVisible }));
          if (event.isVisible) {
            setState('animating');
            setContext((prev) => ({ ...prev, animationPhase: 'animating' }));
          }
        }
        break;
      case 'HOVER_TESTIMONIAL':
        if ('testimonialId' in event) {
          setContext((prev) => ({ ...prev, hoveredTestimonialId: event.testimonialId }));
          setState('interactive');
        }
        break;
      case 'UNHOVER_TESTIMONIAL':
        setContext((prev) => ({ ...prev, hoveredTestimonialId: null }));
        setState('complete');
        break;
      case 'SELECT_TESTIMONIAL':
        if ('testimonialId' in event) {
          setContext((prev) => ({ ...prev, activeTestimonialId: event.testimonialId }));
          setState('interactive');
          if (onTestimonialSelect) {
            onTestimonialSelect(event.testimonialId);
          }
        }
        break;
      case 'SET_THEME':
        if ('theme' in event) {
          setContext((prev) => ({ ...prev, theme: event.theme }));
        }
        break;
      case 'TESTIMONIAL_VISIBLE':
        if ('testimonialId' in event) {
          setContext((prev) => {
            const newVisibleTestimonials = new Set(prev.visibleTestimonials);
            newVisibleTestimonials.add(event.testimonialId);
            return { ...prev, visibleTestimonials: newVisibleTestimonials };
          });
        }
        break;
      case 'TESTIMONIAL_ANIMATED':
        if ('testimonialId' in event) {
          setContext((prev) => {
            const newAnimatedTestimonials = new Set(prev.animatedTestimonials);
            newAnimatedTestimonials.add(event.testimonialId);
            return { ...prev, animatedTestimonials: newAnimatedTestimonials };
          });
        }
        break;
      case 'TESTIMONIAL_COMPLETED':
        if ('testimonialId' in event) {
          setContext((prev) => {
            const newCompletedTestimonials = new Set(prev.completedTestimonials);
            newCompletedTestimonials.add(event.testimonialId);
            const allCompleted =
              newCompletedTestimonials.size === prev.testimonialData.testimonials.length;
            return {
              ...prev,
              completedTestimonials: newCompletedTestimonials,
              animationPhase: allCompleted ? 'complete' : prev.animationPhase,
            };
          });
          if (
            context().completedTestimonials.size === context().testimonialData.testimonials.length
          ) {
            setState('complete');
            if (onAnimationComplete) {
              onAnimationComplete();
            }
          }
        }
        break;
      case 'UPDATE_TESTIMONIALS':
        if ('testimonials' in event) {
          setContext((prev) => ({
            ...prev,
            testimonialData: { ...prev.testimonialData, testimonials: event.testimonials },
            visibleTestimonials: new Set(),
            animatedTestimonials: new Set(),
            completedTestimonials: new Set(),
            animationPhase: 'idle',
          }));
          setState('idle');
        }
        break;
      case 'NEXT_SLIDE':
        setContext((prev) => {
          const maxSlide =
            Math.ceil(prev.testimonialData.testimonials.length / prev.slidesPerView) - 1;
          const nextSlide = prev.currentSlide < maxSlide ? prev.currentSlide + 1 : 0;
          return { ...prev, currentSlide: nextSlide };
        });
        break;
      case 'PREV_SLIDE':
        setContext((prev) => {
          const maxSlide =
            Math.ceil(prev.testimonialData.testimonials.length / prev.slidesPerView) - 1;
          const prevSlide = prev.currentSlide > 0 ? prev.currentSlide - 1 : maxSlide;
          return { ...prev, currentSlide: prevSlide };
        });
        break;
      case 'GO_TO_SLIDE':
        if ('slideIndex' in event) {
          setContext((prev) => ({ ...prev, currentSlide: event.slideIndex }));
        }
        break;
      case 'SET_FILTER':
        if ('category' in event) {
          setContext((prev) => ({ ...prev, filterCategory: event.category }));
        }
        break;
      case 'SET_SORT_ORDER':
        if ('order' in event) {
          setContext((prev) => ({ ...prev, sortOrder: event.order }));
        }
        break;
      case 'TOGGLE_RATINGS':
        if ('show' in event) {
          setContext((prev) => ({ ...prev, showRatings: event.show }));
        }
        break;
      case 'TOGGLE_AUTOPLAY':
        if ('enabled' in event) {
          setContext((prev) => ({ ...prev, autoplayEnabled: event.enabled }));
        }
        break;
      case 'RESET_ANIMATION':
        setContext((prev) => ({
          ...prev,
          visibleTestimonials: new Set(),
          animatedTestimonials: new Set(),
          completedTestimonials: new Set(),
          animationPhase: 'idle',
          activeTestimonialId: null,
          hoveredTestimonialId: null,
        }));
        setState('idle');
        break;
      case 'ERROR':
        if ('message' in event) {
          setContext((prev) => ({ ...prev, errorState: event.message }));
          setState('error');
          if (onError) {
            onError(event.message);
          }
        }
        break;
      case 'RETRY':
        setContext((prev) => ({ ...prev, errorState: null }));
        setState('idle');
        break;
    }
  };

  return [{ value: state(), context: context() }, send] as const;
}

export interface TestimonialSectionAPI {
  // State queries
  isInitializing: boolean;
  isIdle: boolean;
  isLoading: boolean;
  isAnimating: boolean;
  isInteractive: boolean;
  isComplete: boolean;
  isError: boolean;

  // Context accessors
  testimonialData: TestimonialSection;
  activeTestimonialId: string | null;
  hoveredTestimonialId: string | null;
  visibleTestimonials: Set<string>;
  animatedTestimonials: Set<string>;
  completedTestimonials: Set<string>;
  animationPhase: string;
  theme: string;
  variant: string;
  isVisible: boolean;
  autoplayEnabled: boolean;
  filterCategory: string | null;
  sortOrder: string;
  showRatings: boolean;
  currentSlide: number;
  slidesPerView: number;
  errorState: string | null;

  // Actions
  startAnimation: () => void;
  setVisibility: (isVisible: boolean) => void;
  hoverTestimonial: (testimonialId: string) => void;
  unhoverTestimonial: () => void;
  selectTestimonial: (testimonialId: string) => void;
  deselectTestimonial: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setVariant: (variant: string) => void;
  setFilter: (category: string | null) => void;
  setSortOrder: (order: string) => void;
  updateTestimonials: (testimonials: Testimonial[]) => void;
  toggleAutoplay: (enabled: boolean) => void;
  toggleRatings: (show: boolean) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (slideIndex: number) => void;
  resetAnimation: () => void;
  markTestimonialVisible: (testimonialId: string) => void;
  markTestimonialAnimated: (testimonialId: string) => void;
  markTestimonialCompleted: (testimonialId: string) => void;
  retry: () => void;

  // Computed properties
  filteredTestimonials: Testimonial[];
  sortedTestimonials: Testimonial[];
  featuredTestimonials: Testimonial[];
  animationProgress: number;
  totalSlides: number;
  isTestimonialVisible: (testimonialId: string) => boolean;
  isTestimonialAnimated: (testimonialId: string) => boolean;
  isTestimonialCompleted: (testimonialId: string) => boolean;
  isTestimonialHovered: (testimonialId: string) => boolean;
  isTestimonialSelected: (testimonialId: string) => boolean;
}

export function useTestimonialSection(
  options: TestimonialSectionMachineOptions = {}
): TestimonialSectionAPI {
  const [state, send] = createTestimonialSectionMachine(options);

  const filteredTestimonials = createMemo(() => {
    const testimonials = state.context.testimonialData.testimonials;
    if (!state.context.filterCategory) return testimonials;
    return testimonials.filter(
      (testimonial) => testimonial.category === state.context.filterCategory
    );
  });

  const sortedTestimonials = createMemo(() => {
    const testimonials = filteredTestimonials();
    switch (state.context.sortOrder) {
      case 'rating':
        return [...testimonials].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'date':
        return [...testimonials].sort((a, b) => {
          if (!a.date || !b.date) return 0;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      case 'priority':
        return [...testimonials].sort((a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0));
      default:
        return testimonials;
    }
  });

  const featuredTestimonials = createMemo(() => {
    return state.context.testimonialData.testimonials.filter((testimonial) => testimonial.featured);
  });

  const animationProgress = createMemo(() => {
    const totalTestimonials = state.context.testimonialData.testimonials.length;
    if (totalTestimonials === 0) return 0;
    return state.context.completedTestimonials.size / totalTestimonials;
  });

  const totalSlides = createMemo(() => {
    return Math.ceil(
      state.context.testimonialData.testimonials.length / state.context.slidesPerView
    );
  });

  return {
    // State queries
    get isInitializing() {
      return state.value === 'initializing';
    },
    get isIdle() {
      return state.value === 'idle';
    },
    get isLoading() {
      return state.value === 'loading';
    },
    get isAnimating() {
      return state.value === 'animating';
    },
    get isInteractive() {
      return state.value === 'interactive';
    },
    get isComplete() {
      return state.value === 'complete';
    },
    get isError() {
      return state.value === 'error';
    },

    // Context accessors
    get testimonialData() {
      return state.context.testimonialData;
    },
    get activeTestimonialId() {
      return state.context.activeTestimonialId;
    },
    get hoveredTestimonialId() {
      return state.context.hoveredTestimonialId;
    },
    get visibleTestimonials() {
      return state.context.visibleTestimonials;
    },
    get animatedTestimonials() {
      return state.context.animatedTestimonials;
    },
    get completedTestimonials() {
      return state.context.completedTestimonials;
    },
    get animationPhase() {
      return state.context.animationPhase;
    },
    get theme() {
      return state.context.theme;
    },
    get variant() {
      return state.context.variant;
    },
    get isVisible() {
      return state.context.isVisible;
    },
    get autoplayEnabled() {
      return state.context.autoplayEnabled;
    },
    get filterCategory() {
      return state.context.filterCategory;
    },
    get sortOrder() {
      return state.context.sortOrder;
    },
    get showRatings() {
      return state.context.showRatings;
    },
    get currentSlide() {
      return state.context.currentSlide;
    },
    get slidesPerView() {
      return state.context.slidesPerView;
    },
    get errorState() {
      return state.context.errorState;
    },

    // Actions
    startAnimation: () => send({ type: 'START_ANIMATION' }),
    setVisibility: (isVisible: boolean) => send({ type: 'SET_VISIBILITY', isVisible }),
    hoverTestimonial: (testimonialId: string) => send({ type: 'HOVER_TESTIMONIAL', testimonialId }),
    unhoverTestimonial: () => send({ type: 'UNHOVER_TESTIMONIAL' }),
    selectTestimonial: (testimonialId: string) =>
      send({ type: 'SELECT_TESTIMONIAL', testimonialId }),
    deselectTestimonial: () => send({ type: 'DESELECT_TESTIMONIAL' }),
    setTheme: (theme: 'light' | 'dark') => send({ type: 'SET_THEME', theme }),
    setVariant: (variant: string) => send({ type: 'SET_VARIANT', variant }),
    setFilter: (category: string | null) => send({ type: 'SET_FILTER', category }),
    setSortOrder: (order: string) => send({ type: 'SET_SORT_ORDER', order }),
    updateTestimonials: (testimonials: Testimonial[]) =>
      send({ type: 'UPDATE_TESTIMONIALS', testimonials }),
    toggleAutoplay: (enabled: boolean) => send({ type: 'TOGGLE_AUTOPLAY', enabled }),
    toggleRatings: (show: boolean) => send({ type: 'TOGGLE_RATINGS', show }),
    nextSlide: () => send({ type: 'NEXT_SLIDE' }),
    prevSlide: () => send({ type: 'PREV_SLIDE' }),
    goToSlide: (slideIndex: number) => send({ type: 'GO_TO_SLIDE', slideIndex }),
    resetAnimation: () => send({ type: 'RESET_ANIMATION' }),
    markTestimonialVisible: (testimonialId: string) =>
      send({ type: 'TESTIMONIAL_VISIBLE', testimonialId }),
    markTestimonialAnimated: (testimonialId: string) =>
      send({ type: 'TESTIMONIAL_ANIMATED', testimonialId }),
    markTestimonialCompleted: (testimonialId: string) =>
      send({ type: 'TESTIMONIAL_COMPLETED', testimonialId }),
    retry: () => send({ type: 'RETRY' }),

    // Computed properties
    get filteredTestimonials() {
      return filteredTestimonials();
    },
    get sortedTestimonials() {
      return sortedTestimonials();
    },
    get featuredTestimonials() {
      return featuredTestimonials();
    },
    get animationProgress() {
      return animationProgress();
    },
    get totalSlides() {
      return totalSlides();
    },

    isTestimonialVisible: (testimonialId: string) =>
      state.context.visibleTestimonials.has(testimonialId),
    isTestimonialAnimated: (testimonialId: string) =>
      state.context.animatedTestimonials.has(testimonialId),
    isTestimonialCompleted: (testimonialId: string) =>
      state.context.completedTestimonials.has(testimonialId),
    isTestimonialHovered: (testimonialId: string) =>
      state.context.hoveredTestimonialId === testimonialId,
    isTestimonialSelected: (testimonialId: string) =>
      state.context.activeTestimonialId === testimonialId,
  };
}
