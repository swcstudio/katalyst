import { Component, createSignal, onMount, For, Show } from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { BlogGrid } from './BlogGrid';
import { BlogImageGrid } from './BlogImageGrid';
import { BlogOverlay } from './BlogOverlay';
import { BlogList } from './BlogList';
import { BlogSection, BlogPost } from '../state/useBlogSection';
import { BlurFade } from '../../../magicui/BlurFade';
import { TextAnimate } from '../../../magicui/TextAnimate';
import { BorderBeam } from '../../../magicui/BorderBeam';
import { DotPattern } from '../../../magicui/DotPattern';
import { ShimmerButton } from '../../../magicui/ShimmerButton';

export interface ComprehensiveBlogDemoProps {
  className?: string;
}

const comprehensiveBlogData: BlogSection = {
  title: "SolidStack Blog Components",
  subtitle: "Experience the power of animated, state-managed blog layouts with native Magic UI & Aceternity augmentations.",
  variant: 'grid',
  layout: 'centered',
  showImages: true,
  showCategories: true,
  showAuthors: true,
  showReadingTime: true,
  enableFiltering: true,
  enableSorting: true,
  enablePagination: true,
  postsPerPage: 6,
  posts: [
    {
      id: 1,
      title: 'Building State-of-the-Art UI Components',
      href: '#',
      description: 'Discover how we built SolidStack-UI with Zag.js state machines, native animations from Magic UI and Aceternity, and enterprise-grade architecture patterns.',
      date: 'Mar 16, 2024',
      datetime: '2024-03-16',
      category: { title: 'Engineering', href: '#', color: '#3b82f6' },
      author: {
        name: 'Sarah Chen',
        role: 'Lead Frontend Engineer',
        href: '#',
        imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b830?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      readingTime: '8 min',
      featured: true,
      tags: ['solidjs', 'ui-components', 'state-machines']
    },
    {
      id: 2,
      title: 'The Power of Zag.js State Machines',
      href: '#',
      description: 'Learn why we chose Zag.js for our component state management and how it provides predictable, testable, and maintainable component logic.',
      date: 'Mar 12, 2024',
      datetime: '2024-03-12',
      category: { title: 'Architecture', href: '#', color: '#8b5cf6' },
      author: {
        name: 'Alex Rodriguez',
        role: 'Senior Developer',
        href: '#',
        imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=2064&q=80',
      readingTime: '6 min',
      tags: ['zagjs', 'state-management', 'architecture']
    },
    {
      id: 3,
      title: 'Native Animation Augmentations',
      href: '#',
      description: 'Explore how we enhanced Tailwind Plus components with beautiful animations from Magic UI and Aceternity UI, creating truly unique user experiences.',
      date: 'Mar 8, 2024',
      datetime: '2024-03-08',
      category: { title: 'Design', href: '#', color: '#f59e0b' },
      author: {
        name: 'Emma Thompson',
        role: 'UI/UX Designer',
        href: '#',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=2064&q=80',
      readingTime: '5 min',
      featured: true,
      tags: ['animations', 'magic-ui', 'aceternity-ui']
    },
    {
      id: 4,
      title: 'Performance Optimization Strategies',
      href: '#',
      description: 'Deep dive into the performance optimizations we implemented, from intersection observers to efficient re-rendering strategies.',
      date: 'Mar 4, 2024',
      datetime: '2024-03-04',
      category: { title: 'Performance', href: '#', color: '#10b981' },
      author: {
        name: 'David Kim',
        role: 'Performance Engineer',
        href: '#',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80',
      readingTime: '10 min',
      tags: ['performance', 'optimization', 'web-vitals']
    },
    {
      id: 5,
      title: 'Accessibility-First Component Design',
      href: '#',
      description: 'How we ensured WCAG compliance and created components that work for everyone, including keyboard navigation and screen reader support.',
      date: 'Feb 28, 2024',
      datetime: '2024-02-28',
      category: { title: 'Accessibility', href: '#', color: '#ef4444' },
      author: {
        name: 'Maria Garcia',
        role: 'Accessibility Specialist',
        href: '#',
        imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      imageUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
      readingTime: '7 min',
      tags: ['accessibility', 'wcag', 'inclusive-design']
    },
    {
      id: 6,
      title: 'TypeScript-First Development',
      href: '#',
      description: 'Learn about our TypeScript-first approach and how comprehensive type definitions improve developer experience and code quality.',
      date: 'Feb 24, 2024',
      datetime: '2024-02-24',
      category: { title: 'Development', href: '#', color: '#6366f1' },
      author: {
        name: 'James Wilson',
        role: 'Senior TypeScript Developer',
        href: '#',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      readingTime: '9 min',
      featured: true,
      tags: ['typescript', 'developer-experience', 'type-safety']
    },
    {
      id: 7,
      title: 'Enterprise-Grade Testing Strategies',
      href: '#',
      description: 'Discover our comprehensive testing approach, from unit tests to visual regression testing, ensuring reliability at scale.',
      date: 'Feb 20, 2024',
      datetime: '2024-02-20',
      category: { title: 'Testing', href: '#', color: '#14b8a6' },
      author: {
        name: 'Lisa Zhang',
        role: 'QA Engineer',
        href: '#',
        imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      readingTime: '12 min',
      tags: ['testing', 'quality-assurance', 'automation']
    },
    {
      id: 8,
      title: 'The Future of Component Libraries',
      href: '#',
      description: 'Our vision for the next generation of component libraries and how SolidStack-UI is paving the way for innovation.',
      date: 'Feb 16, 2024',
      datetime: '2024-02-16',
      category: { title: 'Innovation', href: '#', color: '#f97316' },
      author: {
        name: 'Michael Brown',
        role: 'CTO',
        href: '#',
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
      readingTime: '6 min',
      tags: ['innovation', 'future', 'component-libraries']
    }
  ]
};

const variants = [
  { 
    id: 'grid', 
    name: 'Grid Layout', 
    description: 'Clean grid with staggered animations',
    color: 'indigo'
  },
  { 
    id: 'image-grid', 
    name: 'Image Grid', 
    description: 'Visual-first with hover effects',
    color: 'purple'
  },
  { 
    id: 'overlay', 
    name: 'Overlay Hero', 
    description: 'Dramatic overlays with beams',
    color: 'pink'
  },
  { 
    id: 'list', 
    name: 'Timeline List', 
    description: 'Sequential timeline design',
    color: 'green'
  }
];

export const ComprehensiveBlogDemo: Component<ComprehensiveBlogDemoProps> = (props) => {
  const [currentVariant, setCurrentVariant] = createSignal('grid');
  const [isVisible, setIsVisible] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef) {
      observer.observe(containerRef);
    }

    return () => observer.disconnect();
  });

  const handlePostClick = (post: BlogPost) => {
    console.log('Post clicked:', post.title);
    // Could implement routing or modal here
  };

  const handlePostHover = (post: BlogPost) => {
    console.log('Post hovered:', post.title);
  };

  const containerStyles = css({
    position: 'relative',
    width: 'full',
    minHeight: '100vh',
    backgroundColor: 'gray.50',
    overflow: 'hidden'
  });

  const headerSectionStyles = css({
    position: 'relative',
    backgroundColor: 'white',
    paddingY: '24',
    borderBottomWidth: '1px',
    borderBottomColor: 'gray.200'
  });

  const headerContentStyles = css({
    marginX: 'auto',
    maxWidth: '7xl',
    paddingX: { base: '6', lg: '8' },
    textAlign: 'center'
  });

  const mainTitleStyles = css({
    fontSize: { base: '4xl', sm: '5xl', lg: '6xl' },
    fontWeight: 'bold',
    color: 'gray.900',
    marginBottom: '6',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    color: 'transparent'
  });

  const mainSubtitleStyles = css({
    fontSize: { base: 'lg', sm: 'xl' },
    color: 'gray.600',
    maxWidth: '4xl',
    marginX: 'auto',
    marginBottom: '12',
    lineHeight: 'relaxed'
  });

  const controlsSectionStyles = css({
    paddingY: '8',
    borderBottomWidth: '1px',
    borderBottomColor: 'gray.200',
    position: 'sticky',
    top: '0',
    zIndex: '40',
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  });

  const controlsContentStyles = css({
    marginX: 'auto',
    maxWidth: '7xl',
    paddingX: { base: '6', lg: '8' }
  });

  const variantSelectorStyles = css({
    display: 'flex',
    justifyContent: 'center',
    gap: '4',
    flexWrap: 'wrap'
  });

  const variantButtonStyles = css({
    position: 'relative',
    paddingX: '6',
    paddingY: '3',
    fontSize: 'sm',
    fontWeight: 'medium',
    borderRadius: 'lg',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid',
    borderColor: 'transparent',
    backgroundColor: 'gray.100',
    color: 'gray.700',
    '&:hover': {
      backgroundColor: 'gray.200',
      transform: 'translateY(-1px)'
    }
  });

  const getActiveButtonStyles = (color: string) => css({
    backgroundColor: `${color}.600`,
    color: 'white',
    borderColor: `${color}.600`,
    '&:hover': {
      backgroundColor: `${color}.700`
    }
  });

  const variantInfoStyles = css({
    fontSize: 'xs',
    color: 'gray.500',
    marginTop: '1',
    textAlign: 'center'
  });

  const componentSectionStyles = css({
    position: 'relative',
    width: 'full'
  });

  const backgroundPatternStyles = css({
    position: 'absolute',
    inset: '0',
    opacity: '0.03',
    zIndex: '0'
  });

  const featuresSectionStyles = css({
    backgroundColor: 'white',
    paddingY: '16',
    borderTopWidth: '1px',
    borderTopColor: 'gray.200'
  });

  const featuresContentStyles = css({
    marginX: 'auto',
    maxWidth: '7xl',
    paddingX: { base: '6', lg: '8' }
  });

  const featuresTitleStyles = css({
    fontSize: '2xl',
    fontWeight: 'semibold',
    color: 'gray.900',
    textAlign: 'center',
    marginBottom: '12'
  });

  const featuresGridStyles = css({
    display: 'grid',
    gridTemplateColumns: { base: '1', md: '2', lg: '4' },
    gap: '8'
  });

  const featureCardStyles = css({
    backgroundColor: 'gray.50',
    borderRadius: 'xl',
    padding: '6',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-2px)'
    }
  });

  const featureIconStyles = css({
    fontSize: '2xl',
    marginBottom: '4'
  });

  const featureTitleStyles = css({
    fontWeight: 'semibold',
    color: 'gray.900',
    marginBottom: '2'
  });

  const featureDescriptionStyles = css({
    fontSize: 'sm',
    color: 'gray.600',
    lineHeight: 'relaxed'
  });

  return (
    <div ref={containerRef} class={`${containerStyles} ${props.className || ''}`}>
      {/* Background Pattern */}
      <div class={backgroundPatternStyles}>
        <DotPattern
          width={32}
          height={32}
          cx={1}
          cy={1}
          cr={1}
          className="fill-gray-300"
        />
      </div>

      {/* Header Section */}
      <div class={headerSectionStyles}>
        <div class={headerContentStyles}>
          <BlurFade delay={0.1} inView={isVisible()}>
            <TextAnimate
              animation="slideUp"
              class={mainTitleStyles}
            >
              Blog Components Showcase
            </TextAnimate>
          </BlurFade>
          
          <BlurFade delay={0.2} inView={isVisible()}>
            <p class={mainSubtitleStyles}>
              Experience the complete suite of SolidStack-UI blog components. Built with Zag.js state machines, 
              enhanced with Magic UI & Aceternity animations, and designed for enterprise applications.
            </p>
          </BlurFade>

          <BlurFade delay={0.3} inView={isVisible()}>
            <div class="flex justify-center gap-4 flex-wrap">
              <ShimmerButton class="px-6 py-3">
                View Documentation
              </ShimmerButton>
              <button class={css({
                paddingX: '6',
                paddingY: '3',
                fontSize: 'sm',
                fontWeight: 'medium',
                color: 'gray.700',
                backgroundColor: 'white',
                border: '1px solid',
                borderColor: 'gray.300',
                borderRadius: 'lg',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'gray.50'
                }
              })}>
                GitHub Repository
              </button>
            </div>
          </BlurFade>
        </div>
      </div>

      {/* Controls Section */}
      <div class={controlsSectionStyles}>
        <div class={controlsContentStyles}>
          <BlurFade delay={0.4} inView={isVisible()}>
            <div class={variantSelectorStyles}>
              <For each={variants}>
                {(variant) => (
                  <div class="text-center">
                    <button
                      class={`${variantButtonStyles} ${
                        currentVariant() === variant.id 
                          ? getActiveButtonStyles(variant.color) 
                          : ''
                      }`}
                      onClick={() => setCurrentVariant(variant.id)}
                    >
                      <Show when={currentVariant() === variant.id}>
                        <BorderBeam size={200} duration={2} delay={0} />
                      </Show>
                      {variant.name}
                    </button>
                    <p class={variantInfoStyles}>
                      {variant.description}
                    </p>
                  </div>
                )}
              </For>
            </div>
          </BlurFade>
        </div>
      </div>

      {/* Component Showcase */}
      <div class={componentSectionStyles}>
        <Show when={currentVariant() === 'grid'}>
          <BlogGrid
            blogData={{
              ...comprehensiveBlogData,
              title: "Clean Grid Layout",
              subtitle: "Responsive grid with staggered BlurFade animations and BorderBeam highlights"
            }}
            onPostClick={handlePostClick}
            onPostHover={handlePostHover}
            enableAnimations={true}
            staggerDelay={0.1}
            animationDuration={0.6}
          />
        </Show>

        <Show when={currentVariant() === 'image-grid'}>
          <BlogImageGrid
            blogData={{
              ...comprehensiveBlogData,
              title: "Visual Image Grid",
              subtitle: "Image-centric design with Meteors effects and enhanced hover interactions"
            }}
            onPostClick={handlePostClick}
            onPostHover={handlePostHover}
            enableAnimations={true}
            staggerDelay={0.15}
            animationDuration={0.8}
            showOverlayEffects={true}
          />
        </Show>

        <Show when={currentVariant() === 'overlay'}>
          <BlogOverlay
            blogData={{
              ...comprehensiveBlogData,
              title: "Dramatic Overlay Design",
              subtitle: "Immersive full-screen experience with BackgroundBeams and Spotlight effects"
            }}
            onPostClick={handlePostClick}
            onPostHover={handlePostHover}
            enableAnimations={true}
            staggerDelay={0.2}
            animationDuration={1.0}
            showSpotlight={true}
            showBackgroundBeams={true}
          />
        </Show>

        <Show when={currentVariant() === 'list'}>
          <BlogList
            blogData={{
              ...comprehensiveBlogData,
              title: "Timeline List Design",
              subtitle: "Sequential timeline with NumberTicker indicators and smooth slide animations"
            }}
            onPostClick={handlePostClick}
            onPostHover={handlePostHover}
            enableAnimations={true}
            staggerDelay={0.1}
            animationDuration={0.6}
            showTimeline={true}
            showNumbers={true}
          />
        </Show>
      </div>

      {/* Features Section */}
      <div class={featuresSectionStyles}>
        <div class={featuresContentStyles}>
          <BlurFade delay={0.6} inView={isVisible()}>
            <h3 class={featuresTitleStyles}>
              ⚡ Powered by Advanced Technologies
            </h3>
          </BlurFade>
          
          <div class={featuresGridStyles}>
            <BlurFade delay={0.7} inView={isVisible()}>
              <div class={featureCardStyles}>
                <div class={featureIconStyles}>🎯</div>
                <h4 class={featureTitleStyles}>Zag.js State Machines</h4>
                <p class={featureDescriptionStyles}>
                  Predictable state management with comprehensive event handling and animation control.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.8} inView={isVisible()}>
              <div class={featureCardStyles}>
                <div class={featureIconStyles}>✨</div>
                <h4 class={featureTitleStyles}>Magic UI Animations</h4>
                <p class={featureDescriptionStyles}>
                  BlurFade, TextAnimate, BorderBeam, Meteors, and more for stunning visual effects.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.9} inView={isVisible()}>
              <div class={featureCardStyles}>
                <div class={featureIconStyles}>🌟</div>
                <h4 class={featureTitleStyles}>Aceternity Effects</h4>
                <p class={featureDescriptionStyles}>
                  BackgroundBeams, Spotlight, and complex gradients for dramatic visual impact.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={1.0} inView={isVisible()}>
              <div class={featureCardStyles}>
                <div class={featureIconStyles}>🚀</div>
                <h4 class={featureTitleStyles}>Enterprise Ready</h4>
                <p class={featureDescriptionStyles}>
                  TypeScript-first, accessible, performant, and built for production applications.
                </p>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </div>
  );
};