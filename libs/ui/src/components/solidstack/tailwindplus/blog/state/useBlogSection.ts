import { createSignal, createMemo, onMount, onCleanup } from 'solid-js'

export interface BlogAuthor {
  name: string;
  role?: string;
  href?: string;
  imageUrl: string;
}

export interface BlogCategory {
  title: string;
  href?: string;
  color?: string;
}

export interface BlogPost {
  id: number | string;
  title: string;
  href: string;
  description: string;
  date: string;
  datetime: string;
  imageUrl?: string;
  category?: BlogCategory;
  author: BlogAuthor;
  readingTime?: string;
  featured?: boolean;
  tags?: string[];
}

export interface BlogSection {
  title: string;
  subtitle?: string;
  posts: BlogPost[];
  variant?: 'grid' | 'list' | 'featured' | 'overlay' | 'split' | 'masonry' | 'cards';
  layout?: 'centered' | 'left' | 'wide';
  showImages?: boolean;
  showCategories?: boolean;
  showAuthors?: boolean;
  showReadingTime?: boolean;
  enableFiltering?: boolean;
  enableSorting?: boolean;
  enablePagination?: boolean;
  postsPerPage?: number;
}

export interface BlogSectionContext {
  id: string;
  blogData: BlogSection;
  activeBlogId: string | null;
  hoveredBlogId: string | null;
  visibleBlogs: Set<string>;
  animatedBlogs: Set<string>;
  completedBlogs: Set<string>;
  animationPhase: 'idle' | 'loading' | 'animating' | 'complete';
  theme: 'light' | 'dark';
  variant: BlogSection['variant'];
  layout: BlogSection['layout'];
  isVisible: boolean;
  filterCategory: string | null;
  filterTags: string[];
  sortOrder: 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'reading-time';
  searchQuery: string;
  currentPage: number;
  postsPerPage: number;
  showImages: boolean;
  showCategories: boolean;
  showAuthors: boolean;
  showReadingTime: boolean;
}

export type BlogSectionState = 
  | 'initializing'
  | 'idle'
  | 'loading'
  | 'animating'
  | 'interactive'
  | 'filtering'
  | 'sorting'
  | 'paginating'
  | 'complete'
  | 'error';

export interface BlogSectionMachineOptions {
  onBlogClick?: (id: string, post: BlogPost) => void;
  onBlogHover?: (id: string, post: BlogPost) => void;
  onAnimationComplete?: () => void;
  onFilterChange?: (context: BlogSectionContext) => void;
  onSortChange?: (context: BlogSectionContext) => void;
  onPageChange?: (page: number, context: BlogSectionContext) => void;
  onError?: (error: string) => void;
}

export interface BlogSectionAPI {
  // State getters
  get isInitializing(): boolean;
  get isIdle(): boolean;
  get isLoading(): boolean;
  get isAnimating(): boolean;
  get isInteractive(): boolean;
  get isFiltering(): boolean;
  get isSorting(): boolean;
  get isPaginating(): boolean;
  get isComplete(): boolean;
  get isError(): boolean;

  // Data getters
  get blogData(): BlogSection;
  get posts(): BlogPost[];
  get activeBlogId(): string | null;
  get hoveredBlogId(): string | null;
  get visibleBlogs(): Set<string>;
  get animatedBlogs(): Set<string>;
  get completedBlogs(): Set<string>;
  get animationPhase(): string;
  get theme(): string;
  get variant(): BlogSection['variant'];
  get layout(): BlogSection['layout'];
  get isVisible(): boolean;
  get filterCategory(): string | null;
  get filterTags(): string[];
  get sortOrder(): string;
  get searchQuery(): string;
  get currentPage(): number;
  get postsPerPage(): number;
  get totalPages(): number;
  get showImages(): boolean;
  get showCategories(): boolean;
  get showAuthors(): boolean;
  get showReadingTime(): boolean;

  // Computed getters
  get filteredPosts(): BlogPost[];
  get sortedPosts(): BlogPost[];
  get featuredPosts(): BlogPost[];
  get paginatedPosts(): BlogPost[];
  get animationProgress(): number;
  get hasNextPage(): boolean;
  get hasPrevPage(): boolean;

  // Actions
  initialize(data: BlogSection): void;
  startAnimation(): void;
  markBlogVisible(id: string): void;
  markBlogAnimated(id: string): void;
  setBlogHover(id: string): void;
  clearBlogHover(): void;
  handleBlogClick(id: string): void;
  setTheme(theme: 'light' | 'dark'): void;
  setVariant(variant: BlogSection['variant']): void;
  setLayout(layout: BlogSection['layout']): void;
  filterByCategory(category: string | null): void;
  filterByTags(tags: string[]): void;
  setSearchQuery(query: string): void;
  sortPosts(order: BlogSectionContext['sortOrder']): void;
  setPage(page: number): void;
  nextPage(): void;
  prevPage(): void;
  toggleOption(option: 'images' | 'categories' | 'authors' | 'readingTime'): void;
  retry(): void;
  reset(): void;
}

export function useBlogSection(
  initialData?: BlogSection,
  options: BlogSectionMachineOptions = {}
): BlogSectionAPI {
  // Core state signals
  const [state, setState] = createSignal<BlogSectionState>('initializing');
  const [blogData, setBlogData] = createSignal<BlogSection>(initialData || {
    title: '',
    posts: [],
    variant: 'grid',
    layout: 'centered',
    showImages: true,
    showCategories: true,
    showAuthors: true,
    showReadingTime: true,
    enableFiltering: false,
    enableSorting: false,
    enablePagination: false,
    postsPerPage: 9
  });

  // Interaction state
  const [activeBlogId, setActiveBlogId] = createSignal<string | null>(null);
  const [hoveredBlogId, setHoveredBlogId] = createSignal<string | null>(null);
  const [visibleBlogs, setVisibleBlogs] = createSignal<Set<string>>(new Set());
  const [animatedBlogs, setAnimatedBlogs] = createSignal<Set<string>>(new Set());
  const [completedBlogs, setCompletedBlogs] = createSignal<Set<string>>(new Set());

  // Animation state
  const [animationPhase, setAnimationPhase] = createSignal<'idle' | 'loading' | 'animating' | 'complete'>('idle');
  const [animationProgress, setAnimationProgress] = createSignal(0);

  // UI state
  const [theme, setTheme] = createSignal<'light' | 'dark'>('light');
  const [variant, setVariant] = createSignal<BlogSection['variant']>('grid');
  const [layout, setLayout] = createSignal<BlogSection['layout']>('centered');
  const [isVisible, setIsVisible] = createSignal(false);

  // Filtering and sorting state
  const [filterCategory, setFilterCategory] = createSignal<string | null>(null);
  const [filterTags, setFilterTags] = createSignal<string[]>([]);
  const [sortOrder, setSortOrder] = createSignal<BlogSectionContext['sortOrder']>('date-desc');
  const [searchQuery, setSearchQuery] = createSignal('');

  // Pagination state
  const [currentPage, setCurrentPage] = createSignal(1);
  const [postsPerPage, setPostsPerPage] = createSignal(9);

  // Display options state
  const [showImages, setShowImages] = createSignal(true);
  const [showCategories, setShowCategories] = createSignal(true);
  const [showAuthors, setShowAuthors] = createSignal(true);
  const [showReadingTime, setShowReadingTime] = createSignal(true);

  // Error state
  const [errorState, setErrorState] = createSignal<string | null>(null);

  // Computed values
  const filteredPosts = createMemo(() => {
    let filtered = [...blogData().posts];

    // Apply category filter
    if (filterCategory()) {
      filtered = filtered.filter(post => 
        post.category?.title === filterCategory()
      );
    }

    // Apply tag filters
    if (filterTags().length > 0) {
      filtered = filtered.filter(post =>
        post.tags?.some(tag => filterTags().includes(tag))
      );
    }

    // Apply search query
    if (searchQuery()) {
      const query = searchQuery().toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  const sortedPosts = createMemo(() => {
    const filtered = filteredPosts();
    
    return [...filtered].sort((a, b) => {
      switch (sortOrder()) {
        case 'date-desc':
          return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
        case 'date-asc':
          return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'reading-time':
          const aTime = parseInt(a.readingTime?.replace(/\D/g, '') || '0');
          const bTime = parseInt(b.readingTime?.replace(/\D/g, '') || '0');
          return aTime - bTime;
        default:
          return 0;
      }
    });
  });

  const featuredPosts = createMemo(() => {
    return sortedPosts().filter(post => post.featured);
  });

  const totalPages = createMemo(() => {
    return Math.ceil(sortedPosts().length / postsPerPage());
  });

  const paginatedPosts = createMemo(() => {
    const sorted = sortedPosts();
    const start = (currentPage() - 1) * postsPerPage();
    const end = start + postsPerPage();
    return sorted.slice(start, end);
  });

  const hasNextPage = createMemo(() => currentPage() < totalPages());
  const hasPrevPage = createMemo(() => currentPage() > 1);

  // Initialize on mount
  onMount(() => {
    if (initialData) {
      initialize(initialData);
    }
    setState('idle');
  });

  // Actions
  const initialize = (data: BlogSection) => {
    setBlogData(data);
    setVariant(data.variant || 'grid');
    setLayout(data.layout || 'centered');
    setShowImages(data.showImages ?? true);
    setShowCategories(data.showCategories ?? true);
    setShowAuthors(data.showAuthors ?? true);
    setShowReadingTime(data.showReadingTime ?? true);
    setPostsPerPage(data.postsPerPage || 9);
    setErrorState(null);
    setState('idle');
  };

  const startAnimation = () => {
    setAnimationPhase('animating');
    setAnimationProgress(0);
    setVisibleBlogs(new Set<string>());
    setAnimatedBlogs(new Set<string>());
    setState('animating');
  };

  const markBlogVisible = (id: string) => {
    setVisibleBlogs(prev => new Set([...prev, id]));
  };

  const markBlogAnimated = (id: string) => {
    setAnimatedBlogs(prev => new Set([...prev, id]));
    setCompletedBlogs(prev => new Set([...prev, id]));
  };

  const setBlogHover = (id: string) => {
    setHoveredBlogId(id);
    const post = blogData().posts.find(p => String(p.id) === id);
    if (post) {
      options.onBlogHover?.(id, post);
    }
  };

  const clearBlogHover = () => {
    setHoveredBlogId(null);
  };

  const handleBlogClick = (id: string) => {
    setActiveBlogId(id);
    const post = blogData().posts.find(p => String(p.id) === id);
    if (post) {
      options.onBlogClick?.(id, post);
    }
  };

  const setThemeValue = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  const setVariantValue = (newVariant: BlogSection['variant']) => {
    setVariant(newVariant);
  };

  const setLayoutValue = (newLayout: BlogSection['layout']) => {
    setLayout(newLayout);
  };

  const filterByCategory = (category: string | null) => {
    setFilterCategory(category);
    setCurrentPage(1);
    setState('filtering');
    setTimeout(() => {
      setState('idle');
      options.onFilterChange?.({
        id: 'blog-section',
        blogData: blogData(),
        activeBlogId: activeBlogId(),
        hoveredBlogId: hoveredBlogId(),
        visibleBlogs: visibleBlogs(),
        animatedBlogs: animatedBlogs(),
        completedBlogs: completedBlogs(),
        animationPhase: animationPhase(),
        theme: theme(),
        variant: variant(),
        layout: layout(),
        isVisible: isVisible(),
        filterCategory: filterCategory(),
        filterTags: filterTags(),
        sortOrder: sortOrder(),
        searchQuery: searchQuery(),
        currentPage: currentPage(),
        postsPerPage: postsPerPage(),
        showImages: showImages(),
        showCategories: showCategories(),
        showAuthors: showAuthors(),
        showReadingTime: showReadingTime()
      });
    }, 100);
  };

  const filterByTags = (tags: string[]) => {
    setFilterTags(tags);
    setCurrentPage(1);
    setState('filtering');
    setTimeout(() => setState('idle'), 100);
  };

  const setSearchQueryValue = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setState('filtering');
    setTimeout(() => setState('idle'), 100);
  };

  const sortPosts = (order: BlogSectionContext['sortOrder']) => {
    setSortOrder(order);
    setState('sorting');
    setTimeout(() => {
      setState('idle');
      options.onSortChange?.({
        id: 'blog-section',
        blogData: blogData(),
        activeBlogId: activeBlogId(),
        hoveredBlogId: hoveredBlogId(),
        visibleBlogs: visibleBlogs(),
        animatedBlogs: animatedBlogs(),
        completedBlogs: completedBlogs(),
        animationPhase: animationPhase(),
        theme: theme(),
        variant: variant(),
        layout: layout(),
        isVisible: isVisible(),
        filterCategory: filterCategory(),
        filterTags: filterTags(),
        sortOrder: sortOrder(),
        searchQuery: searchQuery(),
        currentPage: currentPage(),
        postsPerPage: postsPerPage(),
        showImages: showImages(),
        showCategories: showCategories(),
        showAuthors: showAuthors(),
        showReadingTime: showReadingTime()
      });
    }, 100);
  };

  const setPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages()));
    setCurrentPage(newPage);
    setState('paginating');
    setTimeout(() => {
      setState('idle');
      options.onPageChange?.(newPage, {
        id: 'blog-section',
        blogData: blogData(),
        activeBlogId: activeBlogId(),
        hoveredBlogId: hoveredBlogId(),
        visibleBlogs: visibleBlogs(),
        animatedBlogs: animatedBlogs(),
        completedBlogs: completedBlogs(),
        animationPhase: animationPhase(),
        theme: theme(),
        variant: variant(),
        layout: layout(),
        isVisible: isVisible(),
        filterCategory: filterCategory(),
        filterTags: filterTags(),
        sortOrder: sortOrder(),
        searchQuery: searchQuery(),
        currentPage: currentPage(),
        postsPerPage: postsPerPage(),
        showImages: showImages(),
        showCategories: showCategories(),
        showAuthors: showAuthors(),
        showReadingTime: showReadingTime()
      });
    }, 100);
  };

  const nextPage = () => {
    if (hasNextPage()) {
      setPage(currentPage() + 1);
    }
  };

  const prevPage = () => {
    if (hasPrevPage()) {
      setPage(currentPage() - 1);
    }
  };

  const toggleOption = (option: 'images' | 'categories' | 'authors' | 'readingTime') => {
    switch (option) {
      case 'images':
        setShowImages(!showImages());
        break;
      case 'categories':
        setShowCategories(!showCategories());
        break;
      case 'authors':
        setShowAuthors(!showAuthors());
        break;
      case 'readingTime':
        setShowReadingTime(!showReadingTime());
        break;
    }
  };

  const retry = () => {
    setErrorState(null);
    setState('loading');
    setTimeout(() => setState('idle'), 500);
  };

  const reset = () => {
    setActiveBlogId(null);
    setHoveredBlogId(null);
    setVisibleBlogs(new Set<string>());
    setAnimatedBlogs(new Set<string>());
    setCompletedBlogs(new Set<string>());
    setAnimationPhase('idle');
    setAnimationProgress(0);
    setFilterCategory(null);
    setFilterTags([]);
    setSearchQuery('');
    setSortOrder('date-desc');
    setCurrentPage(1);
    setErrorState(null);
    setState('idle');
  };

  return {
    // State getters
    get isInitializing() { return state() === 'initializing'; },
    get isIdle() { return state() === 'idle'; },
    get isLoading() { return state() === 'loading'; },
    get isAnimating() { return state() === 'animating'; },
    get isInteractive() { return state() === 'interactive'; },
    get isFiltering() { return state() === 'filtering'; },
    get isSorting() { return state() === 'sorting'; },
    get isPaginating() { return state() === 'paginating'; },
    get isComplete() { return state() === 'complete'; },
    get isError() { return state() === 'error'; },

    // Data getters
    get blogData() { return blogData(); },
    get posts() { return blogData().posts; },
    get activeBlogId() { return activeBlogId(); },
    get hoveredBlogId() { return hoveredBlogId(); },
    get visibleBlogs() { return visibleBlogs(); },
    get animatedBlogs() { return animatedBlogs(); },
    get completedBlogs() { return completedBlogs(); },
    get animationPhase() { return animationPhase(); },
    get theme() { return theme(); },
    get variant() { return variant(); },
    get layout() { return layout(); },
    get isVisible() { return isVisible(); },
    get filterCategory() { return filterCategory(); },
    get filterTags() { return filterTags(); },
    get sortOrder() { return sortOrder(); },
    get searchQuery() { return searchQuery(); },
    get currentPage() { return currentPage(); },
    get postsPerPage() { return postsPerPage(); },
    get totalPages() { return totalPages(); },
    get showImages() { return showImages(); },
    get showCategories() { return showCategories(); },
    get showAuthors() { return showAuthors(); },
    get showReadingTime() { return showReadingTime(); },

    // Computed getters
    get filteredPosts() { return filteredPosts(); },
    get sortedPosts() { return sortedPosts(); },
    get featuredPosts() { return featuredPosts(); },
    get paginatedPosts() { return paginatedPosts(); },
    get animationProgress() { return animationProgress(); },
    get hasNextPage() { return hasNextPage(); },
    get hasPrevPage() { return hasPrevPage(); },

    // Actions
    initialize,
    startAnimation,
    markBlogVisible,
    markBlogAnimated,
    setBlogHover,
    clearBlogHover,
    handleBlogClick,
    setTheme: setThemeValue,
    setVariant: setVariantValue,
    setLayout: setLayoutValue,
    filterByCategory,
    filterByTags,
    setSearchQuery: setSearchQueryValue,
    sortPosts,
    setPage,
    nextPage,
    prevPage,
    toggleOption,
    retry,
    reset
  };
}