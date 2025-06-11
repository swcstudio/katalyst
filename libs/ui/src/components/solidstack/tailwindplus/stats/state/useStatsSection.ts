import { normalizeProps, useMachine } from '@zag-js/solid';
import { createMemo, createSignal, createUniqueId } from 'solid-js';

export interface StatItem {
  id: string;
  name: string;
  value: string | number;
  description?: string;
  icon?: React.ComponentType | string;
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

export interface StatsSection {
  id: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  stats: StatItem[];
  layout?: 'grid' | 'list' | 'timeline' | 'cards' | 'split';
  theme?: 'light' | 'dark';
  backgroundImage?: string;
  backgroundPattern?: 'none' | 'dots' | 'beams' | 'gradient';
}

export interface StatsSectionContext {
  id: string;
  statsData: StatsSection;
  activeStatId: string | null;
  hoveredStatId: string | null;
  visibleStats: Set<string>;
  animatedStats: Set<string>;
  completedStats: Set<string>;
  animationPhase: 'idle' | 'loading' | 'animating' | 'complete';
  theme: 'light' | 'dark';
  variant: 'simple' | 'hero' | 'split' | 'cards' | 'timeline' | 'mixed';
  isVisible: boolean;
  animationDuration: number;
  animationDelay: number;
  staggerDelay: number;
  countersEnabled: boolean;
  intersectionThreshold: number;
  filterCategory: string | null;
  sortOrder: 'default' | 'value' | 'name' | 'priority';
  errorState: string | null;
}

export type StatsSectionState =
  | { value: 'initializing'; context: StatsSectionContext }
  | { value: 'idle'; context: StatsSectionContext }
  | { value: 'loading'; context: StatsSectionContext }
  | { value: 'animating'; context: StatsSectionContext }
  | { value: 'interactive'; context: StatsSectionContext }
  | { value: 'complete'; context: StatsSectionContext }
  | { value: 'error'; context: StatsSectionContext };

export type StatsSectionEvent =
  | { type: 'START_ANIMATION' }
  | { type: 'ANIMATION_COMPLETE' }
  | { type: 'STAT_VISIBLE'; statId: string }
  | { type: 'STAT_ANIMATED'; statId: string }
  | { type: 'STAT_COMPLETED'; statId: string }
  | { type: 'HOVER_STAT'; statId: string }
  | { type: 'UNHOVER_STAT' }
  | { type: 'SELECT_STAT'; statId: string }
  | { type: 'DESELECT_STAT' }
  | { type: 'SET_THEME'; theme: 'light' | 'dark' }
  | { type: 'SET_VARIANT'; variant: string }
  | { type: 'SET_VISIBILITY'; isVisible: boolean }
  | { type: 'TOGGLE_COUNTERS'; enabled: boolean }
  | { type: 'SET_FILTER'; category: string | null }
  | { type: 'SET_SORT_ORDER'; order: string }
  | { type: 'UPDATE_STATS'; stats: StatItem[] }
  | { type: 'RESET_ANIMATION' }
  | { type: 'ERROR'; message: string }
  | { type: 'RETRY' };

export interface StatsSectionMachineOptions {
  id?: string;
  statsData?: StatsSection;
  theme?: 'light' | 'dark';
  variant?: string;
  animationDuration?: number;
  animationDelay?: number;
  staggerDelay?: number;
  countersEnabled?: boolean;
  intersectionThreshold?: number;
  onStatSelect?: (statId: string) => void;
  onAnimationComplete?: () => void;
  onError?: (error: string) => void;
}

export function createStatsSectionMachine(options: StatsSectionMachineOptions = {}) {
  const {
    id = createUniqueId(),
    statsData = {
      id: createUniqueId(),
      stats: [],
      layout: 'grid',
      theme: 'light',
    },
    theme = 'light',
    variant = 'simple',
    animationDuration = 2000,
    animationDelay = 0,
    staggerDelay = 150,
    countersEnabled = true,
    intersectionThreshold = 0.1,
    onStatSelect,
    onAnimationComplete,
    onError,
  } = options;

  // Simple state management using SolidJS signals
  const [state, setState] = createSignal('initializing');
  const [context, setContext] = createSignal<StatsSectionContext>({
    id,
    statsData,
    activeStatId: null,
    hoveredStatId: null,
    visibleStats: new Set(),
    animatedStats: new Set(),
    completedStats: new Set(),
    animationPhase: 'idle',
    theme,
    variant,
    isVisible: false,
    animationDuration,
    animationDelay,
    staggerDelay,
    countersEnabled,
    intersectionThreshold,
    filterCategory: null,
    sortOrder: 'default',
    errorState: null,
  });

  const send = (event: StatsSectionEvent) => {
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
      case 'HOVER_STAT':
        if ('statId' in event) {
          setContext((prev) => ({ ...prev, hoveredStatId: event.statId }));
          setState('interactive');
        }
        break;
      case 'UNHOVER_STAT':
        setContext((prev) => ({ ...prev, hoveredStatId: null }));
        setState('complete');
        break;
      case 'SELECT_STAT':
        if ('statId' in event) {
          setContext((prev) => ({ ...prev, activeStatId: event.statId }));
          setState('interactive');
          if (onStatSelect) {
            onStatSelect(event.statId);
          }
        }
        break;
      case 'SET_THEME':
        if ('theme' in event) {
          setContext((prev) => ({ ...prev, theme: event.theme }));
        }
        break;
      case 'STAT_VISIBLE':
        if ('statId' in event) {
          setContext((prev) => {
            const newVisibleStats = new Set(prev.visibleStats);
            newVisibleStats.add(event.statId);
            return { ...prev, visibleStats: newVisibleStats };
          });
        }
        break;
      case 'STAT_ANIMATED':
        if ('statId' in event) {
          setContext((prev) => {
            const newAnimatedStats = new Set(prev.animatedStats);
            newAnimatedStats.add(event.statId);
            return { ...prev, animatedStats: newAnimatedStats };
          });
        }
        break;
      case 'STAT_COMPLETED':
        if ('statId' in event) {
          setContext((prev) => {
            const newCompletedStats = new Set(prev.completedStats);
            newCompletedStats.add(event.statId);
            const allCompleted = newCompletedStats.size === prev.statsData.stats.length;
            return {
              ...prev,
              completedStats: newCompletedStats,
              animationPhase: allCompleted ? 'complete' : prev.animationPhase,
            };
          });
          if (context().completedStats.size === context().statsData.stats.length) {
            setState('complete');
            if (onAnimationComplete) {
              onAnimationComplete();
            }
          }
        }
        break;
      case 'UPDATE_STATS':
        if ('stats' in event) {
          setContext((prev) => ({
            ...prev,
            statsData: { ...prev.statsData, stats: event.stats },
            visibleStats: new Set(),
            animatedStats: new Set(),
            completedStats: new Set(),
            animationPhase: 'idle',
          }));
          setState('idle');
        }
        break;
      case 'RESET_ANIMATION':
        setContext((prev) => ({
          ...prev,
          visibleStats: new Set(),
          animatedStats: new Set(),
          completedStats: new Set(),
          animationPhase: 'idle',
          activeStatId: null,
          hoveredStatId: null,
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

export interface StatsSectionAPI {
  // State queries
  isInitializing: boolean;
  isIdle: boolean;
  isLoading: boolean;
  isAnimating: boolean;
  isInteractive: boolean;
  isComplete: boolean;
  isError: boolean;

  // Context accessors
  statsData: StatsSection;
  activeStatId: string | null;
  hoveredStatId: string | null;
  visibleStats: Set<string>;
  animatedStats: Set<string>;
  completedStats: Set<string>;
  animationPhase: string;
  theme: string;
  variant: string;
  isVisible: boolean;
  countersEnabled: boolean;
  filterCategory: string | null;
  sortOrder: string;
  errorState: string | null;

  // Actions
  startAnimation: () => void;
  setVisibility: (isVisible: boolean) => void;
  hoverStat: (statId: string) => void;
  unhoverStat: () => void;
  selectStat: (statId: string) => void;
  deselectStat: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setVariant: (variant: string) => void;
  setFilter: (category: string | null) => void;
  setSortOrder: (order: string) => void;
  updateStats: (stats: StatItem[]) => void;
  toggleCounters: (enabled: boolean) => void;
  resetAnimation: () => void;
  markStatVisible: (statId: string) => void;
  markStatAnimated: (statId: string) => void;
  markStatCompleted: (statId: string) => void;
  retry: () => void;

  // Computed properties
  filteredStats: StatItem[];
  sortedStats: StatItem[];
  animationProgress: number;
  isStatVisible: (statId: string) => boolean;
  isStatAnimated: (statId: string) => boolean;
  isStatCompleted: (statId: string) => boolean;
  isStatHovered: (statId: string) => boolean;
  isStatSelected: (statId: string) => boolean;
}

export function useStatsSection(options: StatsSectionMachineOptions = {}): StatsSectionAPI {
  const [state, send] = createStatsSectionMachine(options);

  const filteredStats = createMemo(() => {
    const stats = state.context.statsData.stats;
    if (!state.context.filterCategory) return stats;
    return stats.filter((stat) => stat.category === state.context.filterCategory);
  });

  const sortedStats = createMemo(() => {
    const stats = filteredStats();
    switch (state.context.sortOrder) {
      case 'value':
        return [...stats].sort((a, b) => {
          const aVal =
            typeof a.value === 'number' ? a.value : Number.parseFloat(a.value.toString());
          const bVal =
            typeof b.value === 'number' ? b.value : Number.parseFloat(b.value.toString());
          return bVal - aVal;
        });
      case 'name':
        return [...stats].sort((a, b) => a.name.localeCompare(b.name));
      case 'priority':
        return [...stats].sort((a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0));
      default:
        return stats;
    }
  });

  const animationProgress = createMemo(() => {
    const totalStats = state.context.statsData.stats.length;
    if (totalStats === 0) return 0;
    return state.context.completedStats.size / totalStats;
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
    get statsData() {
      return state.context.statsData;
    },
    get activeStatId() {
      return state.context.activeStatId;
    },
    get hoveredStatId() {
      return state.context.hoveredStatId;
    },
    get visibleStats() {
      return state.context.visibleStats;
    },
    get animatedStats() {
      return state.context.animatedStats;
    },
    get completedStats() {
      return state.context.completedStats;
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
    get countersEnabled() {
      return state.context.countersEnabled;
    },
    get filterCategory() {
      return state.context.filterCategory;
    },
    get sortOrder() {
      return state.context.sortOrder;
    },
    get errorState() {
      return state.context.errorState;
    },

    // Actions
    startAnimation: () => send({ type: 'START_ANIMATION' }),
    setVisibility: (isVisible: boolean) => send({ type: 'SET_VISIBILITY', isVisible }),
    hoverStat: (statId: string) => send({ type: 'HOVER_STAT', statId }),
    unhoverStat: () => send({ type: 'UNHOVER_STAT' }),
    selectStat: (statId: string) => send({ type: 'SELECT_STAT', statId }),
    deselectStat: () => send({ type: 'DESELECT_STAT' }),
    setTheme: (theme: 'light' | 'dark') => send({ type: 'SET_THEME', theme }),
    setVariant: (variant: string) => send({ type: 'SET_VARIANT', variant }),
    setFilter: (category: string | null) => send({ type: 'SET_FILTER', category }),
    setSortOrder: (order: string) => send({ type: 'SET_SORT_ORDER', order }),
    updateStats: (stats: StatItem[]) => send({ type: 'UPDATE_STATS', stats }),
    toggleCounters: (enabled: boolean) => send({ type: 'TOGGLE_COUNTERS', enabled }),
    resetAnimation: () => send({ type: 'RESET_ANIMATION' }),
    markStatVisible: (statId: string) => send({ type: 'STAT_VISIBLE', statId }),
    markStatAnimated: (statId: string) => send({ type: 'STAT_ANIMATED', statId }),
    markStatCompleted: (statId: string) => send({ type: 'STAT_COMPLETED', statId }),
    retry: () => send({ type: 'RETRY' }),

    // Computed properties
    get filteredStats() {
      return filteredStats();
    },
    get sortedStats() {
      return sortedStats();
    },
    get animationProgress() {
      return animationProgress();
    },

    isStatVisible: (statId: string) => state.context.visibleStats.has(statId),
    isStatAnimated: (statId: string) => state.context.animatedStats.has(statId),
    isStatCompleted: (statId: string) => state.context.completedStats.has(statId),
    isStatHovered: (statId: string) => state.context.hoveredStatId === statId,
    isStatSelected: (statId: string) => state.context.activeStatId === statId,
  };
}
