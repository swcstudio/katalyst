import { createEffect, createSignal, onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';

export interface PricingTier {
  id: string;
  name: string;
  price: { monthly: string; annually: string } | string;
  description: string;
  features: string[];
  href?: string;
  popular?: boolean;
  featured?: boolean;
  cta?: string;
}

export interface PricingFrequency {
  value: 'monthly' | 'annually';
  label: string;
  priceSuffix: string;
}

export interface PricingSectionContext {
  activeTier: string | null;
  hoveredTier: string | null;
  selectedFrequency: 'monthly' | 'annually';
  isVisible: boolean;
  animationPhase: 'loading' | 'animating' | 'complete';
  theme: 'light' | 'dark';
  animationsEnabled: boolean;
  formState: 'idle' | 'submitting' | 'success' | 'error';
  buttonStates: Map<string, 'idle' | 'loading' | 'success' | 'error'>;
  comparisonMode: boolean;
  tiers: PricingTier[];
  frequencies: PricingFrequency[];
}

export interface PricingSectionState {
  value: 'initializing' | 'idle' | 'animating' | 'interacting' | 'selecting' | 'comparing';
  context: PricingSectionContext;
}

export interface PricingSectionAPI {
  state: () => PricingSectionState;
  mount: () => void;
  startAnimation: () => void;
  completeAnimation: () => void;
  hoverTier: (tierId: string) => void;
  unhoverTier: () => void;
  selectTier: (tierId: string) => void;
  setFrequency: (frequency: 'monthly' | 'annually') => void;
  toggleFrequency: () => void;
  setButtonState: (tierId: string, state: 'idle' | 'loading' | 'success' | 'error') => void;
  toggleComparison: () => void;
  setFormState: (state: 'idle' | 'submitting' | 'success' | 'error') => void;
  submitPlan: (tierId: string, data?: Record<string, any>) => void;
  updateTiers: (tiers: PricingTier[]) => void;
  toggleTheme: () => void;
  toggleAnimations: () => void;
  isTierHovered: (tierId: string) => boolean;
  isTierActive: (tierId: string) => boolean;
  isTierPopular: (tierId: string) => boolean;
  isTierFeatured: (tierId: string) => boolean;
  getButtonState: (tierId: string) => 'idle' | 'loading' | 'success' | 'error';
  getTierPrice: (tierId: string) => string;
  getAnimationPhase: () => 'loading' | 'animating' | 'complete';
  getTheme: () => 'light' | 'dark';
  areAnimationsEnabled: () => boolean;
  getFormState: () => 'idle' | 'submitting' | 'success' | 'error';
  getSelectedFrequency: () => 'monthly' | 'annually';
  isComparisonMode: () => boolean;
}

export function usePricingSection(): PricingSectionAPI {
  const [currentState, setCurrentState] = createSignal<
    'initializing' | 'idle' | 'animating' | 'interacting' | 'selecting' | 'comparing'
  >('initializing');

  const [context, setContext] = createStore<PricingSectionContext>({
    activeTier: null,
    hoveredTier: null,
    selectedFrequency: 'monthly',
    isVisible: false,
    animationPhase: 'loading',
    theme: 'light',
    animationsEnabled: true,
    formState: 'idle',
    buttonStates: new Map(),
    comparisonMode: false,
    tiers: [],
    frequencies: [
      { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
      { value: 'annually', label: 'Annually', priceSuffix: '/year' },
    ],
  });

  // Handle intersection observer for pricing sections
  let intersectionObserver: IntersectionObserver | undefined;

  createEffect(() => {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (context.animationPhase === 'loading') {
              startAnimation();
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

    // Auto-complete animation after delay
    setTimeout(() => {
      completeAnimation();
    }, 1200);
  };

  const completeAnimation = () => {
    setContext('animationPhase', 'complete');
    setCurrentState('idle');
  };

  const hoverTier = (tierId: string) => {
    setContext('hoveredTier', tierId);
    setCurrentState('interacting');
  };

  const unhoverTier = () => {
    setContext('hoveredTier', null);
    setCurrentState('idle');
  };

  const selectTier = (tierId: string) => {
    setContext('activeTier', tierId);
    setCurrentState('selecting');

    // Reset after delay
    setTimeout(() => {
      if (context.activeTier === tierId) {
        setContext('activeTier', null);
        if (currentState() === 'selecting') {
          setCurrentState('idle');
        }
      }
    }, 1000);
  };

  const setFrequency = (frequency: 'monthly' | 'annually') => {
    setContext('selectedFrequency', frequency);
    setCurrentState('selecting');

    // Return to idle after frequency change
    setTimeout(() => {
      if (currentState() === 'selecting') {
        setCurrentState('idle');
      }
    }, 300);
  };

  const toggleFrequency = () => {
    const newFreq = context.selectedFrequency === 'monthly' ? 'annually' : 'monthly';
    setFrequency(newFreq);
  };

  const setButtonState = (tierId: string, state: 'idle' | 'loading' | 'success' | 'error') => {
    const newButtonStates = new Map(context.buttonStates);
    newButtonStates.set(tierId, state);
    setContext('buttonStates', newButtonStates);
  };

  const toggleComparison = () => {
    setContext('comparisonMode', !context.comparisonMode);
    setCurrentState('comparing');

    // Return to idle after comparison toggle
    setTimeout(() => {
      if (currentState() === 'comparing') {
        setCurrentState('idle');
      }
    }, 500);
  };

  const setFormState = (state: 'idle' | 'submitting' | 'success' | 'error') => {
    setContext('formState', state);

    if (state === 'idle') {
      setCurrentState('idle');
    } else if (state === 'submitting') {
      setCurrentState('selecting');
    } else {
      // Success or error states
      setCurrentState('interacting');

      // Auto-reset to idle after delay
      setTimeout(() => {
        if (context.formState === state) {
          setContext('formState', 'idle');
          setCurrentState('idle');
        }
      }, 3000);
    }
  };

  const submitPlan = (tierId: string, data?: Record<string, any>) => {
    setContext('activeTier', tierId);
    setContext('formState', 'submitting');
    setCurrentState('selecting');
    setButtonState(tierId, 'loading');
  };

  const updateTiers = (tiers: PricingTier[]) => {
    setContext('tiers', tiers);
  };

  const toggleTheme = () => {
    setContext('theme', context.theme === 'light' ? 'dark' : 'light');
  };

  const toggleAnimations = () => {
    setContext('animationsEnabled', !context.animationsEnabled);
  };

  const isTierHovered = (tierId: string): boolean => {
    return context.hoveredTier === tierId;
  };

  const isTierActive = (tierId: string): boolean => {
    return context.activeTier === tierId;
  };

  const isTierPopular = (tierId: string): boolean => {
    const tier = context.tiers.find((t) => t.id === tierId);
    return tier?.popular || false;
  };

  const isTierFeatured = (tierId: string): boolean => {
    const tier = context.tiers.find((t) => t.id === tierId);
    return tier?.featured || false;
  };

  const getButtonState = (tierId: string): 'idle' | 'loading' | 'success' | 'error' => {
    return context.buttonStates.get(tierId) || 'idle';
  };

  const getTierPrice = (tierId: string): string => {
    const tier = context.tiers.find((t) => t.id === tierId);
    if (!tier) return '';

    if (typeof tier.price === 'string') {
      return tier.price;
    }

    return tier.price[context.selectedFrequency];
  };

  const getAnimationPhase = () => context.animationPhase;
  const getTheme = () => context.theme;
  const areAnimationsEnabled = () => context.animationsEnabled;
  const getFormState = () => context.formState;
  const getSelectedFrequency = () => context.selectedFrequency;
  const isComparisonMode = () => context.comparisonMode;

  const state = (): PricingSectionState => ({
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
    hoverTier,
    unhoverTier,
    selectTier,
    setFrequency,
    toggleFrequency,
    setButtonState,
    toggleComparison,
    setFormState,
    submitPlan,
    updateTiers,
    toggleTheme,
    toggleAnimations,
    isTierHovered,
    isTierActive,
    isTierPopular,
    isTierFeatured,
    getButtonState,
    getTierPrice,
    getAnimationPhase,
    getTheme,
    areAnimationsEnabled,
    getFormState,
    getSelectedFrequency,
    isComparisonMode,
  };
}
