import { createEffect, createSignal, onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';

export interface FeatureSectionContext {
  activeFeature: string | null;
  isVisible: boolean;
  animationPhase: 'loading' | 'animating' | 'complete';
  hoveredFeature: string | null;
  visibleFeatures: Set<string>;
  scrollProgress: number;
  theme: 'light' | 'dark';
  animationsEnabled: boolean;
}

export interface FeatureSectionState {
  value: 'initializing' | 'idle' | 'animating' | 'interacting' | 'scrolling';
  context: FeatureSectionContext;
}

export interface FeatureSectionAPI {
  state: () => FeatureSectionState;
  mount: () => void;
  startAnimation: () => void;
  completeAnimation: () => void;
  hoverFeature: (featureId: string) => void;
  unhoverFeature: () => void;
  clickFeature: (featureId: string) => void;
  focusFeature: (featureId: string) => void;
  blurFeature: () => void;
  featureEnterView: (featureId: string) => void;
  featureLeaveView: (featureId: string) => void;
  updateScrollProgress: (progress: number) => void;
  toggleTheme: () => void;
  toggleAnimations: () => void;
  isFeatureVisible: (featureId: string) => boolean;
  isFeatureHovered: (featureId: string) => boolean;
  isFeatureActive: (featureId: string) => boolean;
  getAnimationPhase: () => 'loading' | 'animating' | 'complete';
  getTheme: () => 'light' | 'dark';
  areAnimationsEnabled: () => boolean;
}

export function useFeatureSection(): FeatureSectionAPI {
  const [currentState, setCurrentState] = createSignal<
    'initializing' | 'idle' | 'animating' | 'interacting' | 'scrolling'
  >('initializing');

  const [context, setContext] = createStore<FeatureSectionContext>({
    activeFeature: null,
    isVisible: false,
    animationPhase: 'loading',
    hoveredFeature: null,
    visibleFeatures: new Set(),
    scrollProgress: 0,
    theme: 'light',
    animationsEnabled: true,
  });

  // Handle intersection observer for features
  let intersectionObserver: IntersectionObserver | undefined;

  createEffect(() => {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const featureId = entry.target.getAttribute('data-feature-id');
          if (featureId) {
            if (entry.isIntersecting) {
              featureEnterView(featureId);
            } else {
              featureLeaveView(featureId);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    onCleanup(() => {
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
    });
  });

  const mount = () => {
    setContext('animationPhase', 'loading');
    setContext('isVisible', true);
    setCurrentState('idle');
  };

  const startAnimation = () => {
    setContext('animationPhase', 'animating');
    setCurrentState('animating');
  };

  const completeAnimation = () => {
    setContext('animationPhase', 'complete');
    setCurrentState('idle');
  };

  const hoverFeature = (featureId: string) => {
    setContext('hoveredFeature', featureId);
    setCurrentState('interacting');
  };

  const unhoverFeature = () => {
    setContext('hoveredFeature', null);
    setCurrentState('idle');
  };

  const clickFeature = (featureId: string) => {
    setContext('activeFeature', featureId);
  };

  const focusFeature = (featureId: string) => {
    setContext('activeFeature', featureId);
    setCurrentState('interacting');
  };

  const blurFeature = () => {
    setContext('activeFeature', null);
    setCurrentState('idle');
  };

  const featureEnterView = (featureId: string) => {
    const newVisibleFeatures = new Set(context.visibleFeatures);
    newVisibleFeatures.add(featureId);
    setContext('visibleFeatures', newVisibleFeatures);
    setCurrentState('scrolling');

    // Auto-return to idle after scroll
    setTimeout(() => {
      if (currentState() === 'scrolling') {
        setCurrentState('idle');
      }
    }, 100);
  };

  const featureLeaveView = (featureId: string) => {
    const newVisibleFeatures = new Set(context.visibleFeatures);
    newVisibleFeatures.delete(featureId);
    setContext('visibleFeatures', newVisibleFeatures);
  };

  const updateScrollProgress = (progress: number) => {
    setContext('scrollProgress', progress);
    setCurrentState('scrolling');

    // Auto-return to idle after scroll
    setTimeout(() => {
      if (currentState() === 'scrolling') {
        setCurrentState('idle');
      }
    }, 100);
  };

  const toggleTheme = () => {
    setContext('theme', context.theme === 'light' ? 'dark' : 'light');
  };

  const toggleAnimations = () => {
    setContext('animationsEnabled', !context.animationsEnabled);
  };

  const isFeatureVisible = (featureId: string): boolean => {
    return context.visibleFeatures.has(featureId);
  };

  const isFeatureHovered = (featureId: string): boolean => {
    return context.hoveredFeature === featureId;
  };

  const isFeatureActive = (featureId: string): boolean => {
    return context.activeFeature === featureId;
  };

  const getAnimationPhase = () => context.animationPhase;
  const getTheme = () => context.theme;
  const areAnimationsEnabled = () => context.animationsEnabled;

  const state = (): FeatureSectionState => ({
    value: currentState(),
    context: { ...context },
  });

  // Auto-mount when created
  setTimeout(() => {
    mount();
  }, 0);

  return {
    state,
    mount,
    startAnimation,
    completeAnimation,
    hoverFeature,
    unhoverFeature,
    clickFeature,
    focusFeature,
    blurFeature,
    featureEnterView,
    featureLeaveView,
    updateScrollProgress,
    toggleTheme,
    toggleAnimations,
    isFeatureVisible,
    isFeatureHovered,
    isFeatureActive,
    getAnimationPhase,
    getTheme,
    areAnimationsEnabled,
  };
}
