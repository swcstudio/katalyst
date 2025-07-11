import { type Component, createSignal, For, onMount, Show } from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { BlurFade } from '../../../magicui/BlurFade';
import { BorderBeam } from '../../../magicui/BorderBeam';
import { TextAnimate } from '../../../magicui/TextAnimate';
import type { BlogPost, BlogSection } from '../state/useBlogSection';
import { BlogGrid } from './BlogGrid';
import { BlogImageGrid } from './BlogImageGrid';
import { BlogList } from './BlogList';
import { BlogOverlay } from './BlogOverlay';

export interface BlogShowcaseProps {
  className?: string;
}

const sampleBlogData: BlogSection = {
  title: 'From the Blog',
  subtitle: 'Learn how to grow your business with our expert advice and insights.',
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
      title: 'Boost your conversion rate',
      href: '#',
      description:
        'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
      date: 'Mar 16, 2020',
      datetime: '2020-03-16',
      category: { title: 'Marketing', href: '#' },
      author: {
        name: 'Michael Foster',
        role: 'Co-Founder / CTO',
        href: '#',
        imageUrl:
          'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      imageUrl:
        'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80',
      readingTime: '6 min',
      featured: true,
      tags: ['marketing', 'conversion', 'growth'],
    },
    {
      id: 2,
      title: 'How to use search engine optimization to drive sales',
      href: '#',
      description:
        'Optio cum necessitatibus dolor voluptatum provident commodi et. Qui aperiam fugiat nemo cumque. Et voluptas consequatur magni sapiente amet voluptates dolorum.',
      date: 'Mar 10, 2020',
      datetime: '2020-03-10',
      category: { title: 'SEO', href: '#' },
      author: {
        name: 'Lindsay Walton',
        role: 'Marketing Manager',
        href: '#',
        imageUrl:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      imageUrl:
        'https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
      readingTime: '4 min',
      tags: ['seo', 'sales', 'optimization'],
    },
    {
      id: 3,
      title: 'Improve your customer experience',
      href: '#',
      description:
        'Cupiditate maiores ullam eveniet adipisci in doloribus nulla minus. Voluptas iusto libero adipisci rem et corporis. Sint harum rerum voluptatem quo recusandae magni placeat saepe molestiae.',
      date: 'Feb 12, 2020',
      datetime: '2020-02-12',
      category: { title: 'UX Design', href: '#' },
      author: {
        name: 'Tom Cook',
        role: 'UX Designer',
        href: '#',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      imageUrl:
        'https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
      readingTime: '8 min',
      tags: ['ux', 'design', 'customer experience'],
    },
    {
      id: 4,
      title: 'Writing effective landing page copy',
      href: '#',
      description:
        'Ipsum voluptates quia doloremque culpa qui eius. Id qui id officia molestias quaerat deleniti. Qui facere numquam autem libero quae cupiditate asperiores vitae cupiditate.',
      date: 'Jan 29, 2020',
      datetime: '2020-01-29',
      category: { title: 'Content', href: '#' },
      author: {
        name: 'Whitney Francis',
        role: 'Content Writer',
        href: '#',
        imageUrl:
          'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      imageUrl:
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
      readingTime: '5 min',
      featured: true,
      tags: ['copywriting', 'landing pages', 'conversion'],
    },
    {
      id: 5,
      title: 'Building a design system that scales',
      href: '#',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto accusantium praesentium eius, ut atque fuga culpa, similique sequi cum eos quis dolorum.',
      date: 'Jan 15, 2020',
      datetime: '2020-01-15',
      category: { title: 'Design', href: '#' },
      author: {
        name: 'Leonard Krasner',
        role: 'Senior Designer',
        href: '#',
        imageUrl:
          'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      imageUrl:
        'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
      readingTime: '12 min',
      tags: ['design system', 'scalability', 'design'],
    },
    {
      id: 6,
      title: 'Advanced React patterns for modern apps',
      href: '#',
      description:
        'Velit facilis asperiores porro quaerat doloribus, eveniet dolore. Adipisci tempora aut inventore optio animi, tempore temporibus quo laudantium.',
      date: 'Dec 20, 2019',
      datetime: '2019-12-20',
      category: { title: 'Development', href: '#' },
      author: {
        name: 'Floyd Miles',
        role: 'Lead Developer',
        href: '#',
        imageUrl:
          'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      imageUrl:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
      readingTime: '10 min',
      tags: ['react', 'javascript', 'development'],
    },
  ],
};

const variants = [
  { id: 'grid', name: 'Grid Layout', description: 'Clean grid layout with staggered animations' },
  { id: 'image-grid', name: 'Image Grid', description: 'Visual-first grid with image overlays' },
  {
    id: 'overlay',
    name: 'Overlay Hero',
    description: 'Dramatic overlay design with background effects',
  },
  {
    id: 'list',
    name: 'Timeline List',
    description: 'Timeline-style list with sequential animations',
  },
];

export const BlogShowcase: Component<BlogShowcaseProps> = (props) => {
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
  };

  const handlePostHover = (post: BlogPost) => {
    console.log('Post hovered:', post.title);
  };

  const containerStyles = css({
    position: 'relative',
    width: 'full',
    backgroundColor: 'gray.50',
    paddingY: '24',
    overflow: 'hidden',
  });

  const showcaseHeaderStyles = css({
    textAlign: 'center',
    marginBottom: '16',
    paddingX: { base: '6', lg: '8' },
  });

  const showcaseTitleStyles = css({
    fontSize: { base: '3xl', sm: '4xl', lg: '5xl' },
    fontWeight: 'bold',
    color: 'gray.900',
    marginBottom: '4',
  });

  const showcaseSubtitleStyles = css({
    fontSize: { base: 'lg', sm: 'xl' },
    color: 'gray.600',
    maxWidth: '3xl',
    marginX: 'auto',
    marginBottom: '12',
  });

  const variantSelectorStyles = css({
    display: 'flex',
    justifyContent: 'center',
    gap: '4',
    marginBottom: '16',
    flexWrap: 'wrap',
    paddingX: { base: '6', lg: '8' },
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
    backgroundColor: 'white',
    color: 'gray.700',
    '&:hover': {
      backgroundColor: 'gray.50',
      transform: 'translateY(-1px)',
    },
  });

  const activeVariantButtonStyles = css({
    backgroundColor: 'indigo.600',
    color: 'white',
    borderColor: 'indigo.600',
    '&:hover': {
      backgroundColor: 'indigo.700',
    },
  });

  const variantDescriptionStyles = css({
    fontSize: 'xs',
    color: 'gray.500',
    marginTop: '1',
    textAlign: 'center',
  });

  const componentContainerStyles = css({
    position: 'relative',
    width: 'full',
  });

  return (
    <div ref={containerRef} class={`${containerStyles} ${props.className || ''}`}>
      {/* Showcase Header */}
      <div class={showcaseHeaderStyles}>
        <BlurFade delay={0.1} inView={isVisible()}>
          <TextAnimate animation="slideUp" class={showcaseTitleStyles}>
            SolidStack Blog Components
          </TextAnimate>
        </BlurFade>

        <BlurFade delay={0.2} inView={isVisible()}>
          <p class={showcaseSubtitleStyles}>
            Beautiful, animated blog components with state machine architecture and native Magic UI
            & Aceternity augmentations.
          </p>
        </BlurFade>
      </div>

      {/* Variant Selector */}
      <BlurFade delay={0.3} inView={isVisible()}>
        <div class={variantSelectorStyles}>
          <For each={variants}>
            {(variant) => (
              <div class="text-center">
                <button
                  class={`${variantButtonStyles} ${
                    currentVariant() === variant.id ? activeVariantButtonStyles : ''
                  }`}
                  onClick={() => setCurrentVariant(variant.id)}
                >
                  <Show when={currentVariant() === variant.id}>
                    <BorderBeam size={200} duration={2} delay={0} />
                  </Show>
                  {variant.name}
                </button>
                <p class={variantDescriptionStyles}>{variant.description}</p>
              </div>
            )}
          </For>
        </div>
      </BlurFade>

      {/* Component Showcase */}
      <div class={componentContainerStyles}>
        <Show when={currentVariant() === 'grid'}>
          <BlurFade delay={0.4} inView={isVisible()}>
            <BlogGrid
              blogData={sampleBlogData}
              onPostClick={handlePostClick}
              onPostHover={handlePostHover}
              enableAnimations={true}
              staggerDelay={0.1}
              animationDuration={0.6}
            />
          </BlurFade>
        </Show>

        <Show when={currentVariant() === 'image-grid'}>
          <BlurFade delay={0.4} inView={isVisible()}>
            <BlogImageGrid
              blogData={{
                ...sampleBlogData,
                title: 'Visual Stories',
                subtitle: 'Discover insights through our featured image stories',
              }}
              onPostClick={handlePostClick}
              onPostHover={handlePostHover}
              enableAnimations={true}
              staggerDelay={0.15}
              animationDuration={0.8}
              showOverlayEffects={true}
            />
          </BlurFade>
        </Show>

        <Show when={currentVariant() === 'overlay'}>
          <BlurFade delay={0.4} inView={isVisible()}>
            <BlogOverlay
              blogData={{
                ...sampleBlogData,
                title: 'Featured Articles',
                subtitle: 'Immersive reading experiences with dramatic visuals',
              }}
              onPostClick={handlePostClick}
              onPostHover={handlePostHover}
              enableAnimations={true}
              staggerDelay={0.2}
              animationDuration={1.0}
              showSpotlight={true}
              showBackgroundBeams={true}
            />
          </BlurFade>
        </Show>

        <Show when={currentVariant() === 'list'}>
          <BlurFade delay={0.4} inView={isVisible()}>
            <BlogList
              blogData={{
                ...sampleBlogData,
                title: 'Latest Updates',
                subtitle: 'Follow our journey through time with these chronological insights',
              }}
              onPostClick={handlePostClick}
              onPostHover={handlePostHover}
              enableAnimations={true}
              staggerDelay={0.1}
              animationDuration={0.6}
              showTimeline={true}
              showNumbers={true}
            />
          </BlurFade>
        </Show>
      </div>

      {/* Features Info */}
      <BlurFade delay={0.6} inView={isVisible()}>
        <div
          class={css({
            marginTop: '20',
            paddingX: { base: '6', lg: '8' },
            textAlign: 'center',
          })}
        >
          <div
            class={css({
              maxWidth: '4xl',
              marginX: 'auto',
              backgroundColor: 'white',
              borderRadius: '2xl',
              padding: '8',
              border: '1px solid',
              borderColor: 'gray.200',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            })}
          >
            <h3
              class={css({
                fontSize: 'xl',
                fontWeight: 'semibold',
                color: 'gray.900',
                marginBottom: '4',
              })}
            >
              ✨ Enhanced with Native Animations
            </h3>
            <div
              class={css({
                display: 'grid',
                gridTemplateColumns: { base: '1', md: '2', lg: '4' },
                gap: '6',
                textAlign: 'left',
              })}
            >
              <div>
                <h4 class={css({ fontWeight: 'medium', color: 'gray.900', marginBottom: '2' })}>
                  Magic UI Integrations
                </h4>
                <ul
                  class={css({
                    fontSize: 'sm',
                    color: 'gray.600',
                    listStyle: 'disc',
                    paddingLeft: '4',
                  })}
                >
                  <li>BlurFade animations</li>
                  <li>TextAnimate effects</li>
                  <li>BorderBeam highlights</li>
                  <li>Meteors & DotPattern</li>
                </ul>
              </div>
              <div>
                <h4 class={css({ fontWeight: 'medium', color: 'gray.900', marginBottom: '2' })}>
                  Aceternity Effects
                </h4>
                <ul
                  class={css({
                    fontSize: 'sm',
                    color: 'gray.600',
                    listStyle: 'disc',
                    paddingLeft: '4',
                  })}
                >
                  <li>BackgroundBeams</li>
                  <li>Spotlight effects</li>
                  <li>Gradient overlays</li>
                  <li>Complex animations</li>
                </ul>
              </div>
              <div>
                <h4 class={css({ fontWeight: 'medium', color: 'gray.900', marginBottom: '2' })}>
                  State Machine
                </h4>
                <ul
                  class={css({
                    fontSize: 'sm',
                    color: 'gray.600',
                    listStyle: 'disc',
                    paddingLeft: '4',
                  })}
                >
                  <li>Zag.js architecture</li>
                  <li>Predictable states</li>
                  <li>Animation control</li>
                  <li>Event handling</li>
                </ul>
              </div>
              <div>
                <h4 class={css({ fontWeight: 'medium', color: 'gray.900', marginBottom: '2' })}>
                  Features
                </h4>
                <ul
                  class={css({
                    fontSize: 'sm',
                    color: 'gray.600',
                    listStyle: 'disc',
                    paddingLeft: '4',
                  })}
                >
                  <li>Responsive design</li>
                  <li>Accessibility ready</li>
                  <li>Pagination support</li>
                  <li>Theme integration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>
    </div>
  );
};
