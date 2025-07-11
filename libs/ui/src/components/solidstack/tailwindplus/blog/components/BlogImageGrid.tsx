import {
  type Component,
  For,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { BlurFade } from '../../../magicui/BlurFade';
import { BorderBeam } from '../../../magicui/BorderBeam';
import { DotPattern } from '../../../magicui/DotPattern';
import { Meteors } from '../../../magicui/Meteors';
import { TextAnimate } from '../../../magicui/TextAnimate';
import { type BlogPost, type BlogSection, useBlogSection } from '../state/useBlogSection';

export interface BlogImageGridProps {
  blogData: BlogSection;
  className?: string;
  onPostClick?: (post: BlogPost) => void;
  onPostHover?: (post: BlogPost) => void;
  enableAnimations?: boolean;
  staggerDelay?: number;
  animationDuration?: number;
  showOverlayEffects?: boolean;
}

export const BlogImageGrid: Component<BlogImageGridProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);
  const [animationStarted, setAnimationStarted] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;
  let observer: IntersectionObserver | undefined;

  const blogSection = useBlogSection(props.blogData, {
    onBlogClick: (id, post) => {
      props.onPostClick?.(post);
    },
    onBlogHover: (id, post) => {
      props.onPostHover?.(post);
    },
    onAnimationComplete: () => {
      console.log('Blog image grid animation completed');
    },
  });

  onMount(() => {
    blogSection.initialize(props.blogData);

    if (props.enableAnimations !== false && containerRef) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !animationStarted()) {
            setIsVisible(true);
            setAnimationStarted(true);
            blogSection.startAnimation();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef);
    } else {
      setIsVisible(true);
      setAnimationStarted(true);
    }
  });

  onCleanup(() => {
    observer?.disconnect();
  });

  const containerStyles = css({
    position: 'relative',
    backgroundColor: 'white',
    paddingY: { base: '24', sm: '32' },
    overflow: 'hidden',
  });

  const innerStyles = css({
    marginX: 'auto',
    maxWidth: '7xl',
    paddingX: { base: '6', lg: '8' },
  });

  const headerStyles = css({
    marginX: 'auto',
    maxWidth: '2xl',
    textAlign: 'center',
  });

  const titleStyles = css({
    fontSize: { base: '4xl', sm: '5xl' },
    fontWeight: 'semibold',
    letterSpacing: 'tight',
    color: 'gray.900',
    lineHeight: 'tight',
  });

  const subtitleStyles = css({
    marginTop: '2',
    fontSize: { base: 'lg', sm: 'xl' },
    lineHeight: '8',
    color: 'gray.600',
  });

  const gridStyles = css({
    marginX: 'auto',
    marginTop: '16',
    display: 'grid',
    maxWidth: '2xl',
    gridTemplateColumns: { base: '1', lg: 'repeat(3, minmax(0, 1fr))' },
    gap: { base: 'x-8 y-20', lg: 'x-8 y-20' },
  });

  const articleStyles = css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'relative',
    borderRadius: 'xl',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.4s ease',
    '&:hover': {
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    },
  });

  const imageContainerStyles = css({
    position: 'relative',
    width: 'full',
    aspectRatio: 'video',
    '@media (min-width: 640px)': {
      aspectRatio: '2/1',
    },
    '@media (min-width: 1024px)': {
      aspectRatio: '3/2',
    },
  });

  const imageStyles = css({
    width: 'full',
    height: 'full',
    borderRadius: '2xl',
    backgroundColor: 'gray.100',
    objectFit: 'cover',
    transition: 'all 0.4s ease',
  });

  const imageOverlayStyles = css({
    position: 'absolute',
    inset: '0',
    borderRadius: '2xl',
    ring: '1px',
    ringColor: 'gray.900/10',
    ringInset: true,
  });

  const contentStyles = css({
    maxWidth: 'xl',
    width: 'full',
    paddingTop: '8',
  });

  const metaStyles = css({
    marginTop: '8',
    display: 'flex',
    alignItems: 'center',
    gap: 'x-4',
    fontSize: 'xs',
  });

  const dateStyles = css({
    color: 'gray.500',
  });

  const categoryStyles = css({
    position: 'relative',
    zIndex: '10',
    borderRadius: 'full',
    backgroundColor: 'gray.50',
    paddingX: '3',
    paddingY: '1.5',
    fontWeight: 'medium',
    color: 'gray.600',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'gray.100',
      transform: 'scale(1.05)',
    },
  });

  const titleGroupStyles = css({
    position: 'relative',
    display: 'group',
  });

  const postTitleStyles = css({
    marginTop: '3',
    fontSize: 'lg',
    lineHeight: '6',
    fontWeight: 'semibold',
    color: 'gray.900',
    transition: 'color 0.3s ease',
    'group:hover &': {
      color: 'gray.600',
    },
  });

  const linkOverlayStyles = css({
    position: 'absolute',
    inset: '0',
  });

  const descriptionStyles = css({
    marginTop: '5',
    fontSize: 'sm',
    lineHeight: '6',
    color: 'gray.600',
    overflow: 'hidden',
    maxHeight: '4.5rem',
  });

  const authorSectionStyles = css({
    position: 'relative',
    marginTop: '8',
    display: 'flex',
    alignItems: 'center',
    gap: 'x-4',
  });

  const avatarStyles = css({
    width: '10',
    height: '10',
    borderRadius: 'full',
    backgroundColor: 'gray.100',
    ring: '2px',
    ringColor: 'white',
    transition: 'all 0.3s ease',
  });

  const authorInfoStyles = css({
    fontSize: 'sm',
    lineHeight: '6',
  });

  const authorNameStyles = css({
    fontWeight: 'semibold',
    color: 'gray.900',
  });

  const authorRoleStyles = css({
    color: 'gray.600',
  });

  const backgroundPatternStyles = css({
    position: 'absolute',
    inset: '0',
    opacity: '0.02',
    zIndex: '0',
  });

  const hoverEffectsStyles = css({
    position: 'absolute',
    inset: '0',
    borderRadius: '2xl',
    overflow: 'hidden',
    pointerEvents: 'none',
  });

  return (
    <div ref={containerRef} class={`${containerStyles} ${props.className || ''}`}>
      {/* Background Pattern */}
      <div class={backgroundPatternStyles}>
        <DotPattern width={24} height={24} cx={1} cy={1} cr={1} className="fill-gray-300" />
      </div>

      <div class={innerStyles}>
        {/* Header Section */}
        <div class={headerStyles}>
          <BlurFade delay={0.1} inView={isVisible()}>
            <TextAnimate animation="slideUp" class={titleStyles}>
              {blogSection.blogData.title}
            </TextAnimate>
          </BlurFade>

          <Show when={blogSection.blogData.subtitle}>
            <BlurFade delay={0.2} inView={isVisible()}>
              <p class={subtitleStyles}>{blogSection.blogData.subtitle}</p>
            </BlurFade>
          </Show>
        </div>

        {/* Blog Posts Grid */}
        <div class={gridStyles}>
          <For each={blogSection.paginatedPosts}>
            {(post, index) => (
              <BlurFade
                delay={0.4 + index() * (props.staggerDelay || 0.15)}
                inView={isVisible()}
                duration={props.animationDuration || 0.8}
              >
                <article
                  class={articleStyles}
                  onMouseEnter={() => {
                    blogSection.setBlogHover(String(post.id));
                    blogSection.markBlogVisible(String(post.id));
                  }}
                  onMouseLeave={() => blogSection.clearBlogHover()}
                  onClick={() => blogSection.handleBlogClick(String(post.id))}
                >
                  {/* Image Container */}
                  <div class={imageContainerStyles}>
                    <Show when={post.imageUrl}>
                      <img
                        alt={post.title}
                        src={post.imageUrl}
                        class={imageStyles}
                        style={{
                          transform:
                            blogSection.hoveredBlogId === String(post.id)
                              ? 'scale(1.05)'
                              : 'scale(1)',
                        }}
                      />
                    </Show>
                    <div class={imageOverlayStyles} />

                    {/* Hover Effects */}
                    <Show when={blogSection.hoveredBlogId === String(post.id)}>
                      <div class={hoverEffectsStyles}>
                        <Show when={props.showOverlayEffects !== false}>
                          <Meteors number={3} />
                        </Show>
                        <BorderBeam size={300} duration={2} delay={0} borderWidth={2} />
                      </div>
                    </Show>
                  </div>

                  {/* Content Section */}
                  <div class={contentStyles}>
                    {/* Post Metadata */}
                    <div class={metaStyles}>
                      <time dateTime={post.datetime} class={dateStyles}>
                        {post.date}
                      </time>
                      <Show when={post.category && blogSection.showCategories}>
                        <a
                          href={post.category!.href}
                          class={categoryStyles}
                          style={{
                            'background-color': post.category!.color?.includes('bg-')
                              ? undefined
                              : post.category!.color,
                          }}
                        >
                          {post.category!.title}
                        </a>
                      </Show>
                    </div>

                    {/* Post Title and Description */}
                    <div class={titleGroupStyles}>
                      <h3 class={postTitleStyles}>
                        <a href={post.href}>
                          <span class={linkOverlayStyles} />
                          <TextAnimate animation="slideUp" delay={0.5 + index() * 0.05}>
                            {post.title}
                          </TextAnimate>
                        </a>
                      </h3>
                      <p class={descriptionStyles}>{post.description}</p>
                    </div>

                    {/* Author Section */}
                    <Show when={blogSection.showAuthors}>
                      <div class={authorSectionStyles}>
                        <img
                          alt={post.author.name}
                          src={post.author.imageUrl}
                          class={avatarStyles}
                          style={{
                            transform:
                              blogSection.hoveredBlogId === String(post.id)
                                ? 'scale(1.1)'
                                : 'scale(1)',
                          }}
                        />
                        <div class={authorInfoStyles}>
                          <p class={authorNameStyles}>
                            <Show
                              when={post.author.href}
                              fallback={<span>{post.author.name}</span>}
                            >
                              <a href={post.author.href}>
                                <span class={linkOverlayStyles} />
                                {post.author.name}
                              </a>
                            </Show>
                          </p>
                          <Show when={post.author.role}>
                            <p class={authorRoleStyles}>{post.author.role}</p>
                          </Show>
                        </div>
                      </div>
                    </Show>

                    {/* Reading Time */}
                    <Show when={post.readingTime && blogSection.showReadingTime}>
                      <div
                        class={css({
                          marginTop: '4',
                          fontSize: 'xs',
                          color: 'gray.500',
                          fontWeight: 'medium',
                          opacity: '0.8',
                        })}
                      >
                        {post.readingTime} read
                      </div>
                    </Show>
                  </div>
                </article>
              </BlurFade>
            )}
          </For>
        </div>

        {/* Pagination */}
        <Show when={blogSection.totalPages > 1}>
          <BlurFade delay={1.0} inView={isVisible()}>
            <div
              class={css({
                marginTop: '20',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '6',
              })}
            >
              <button
                disabled={!blogSection.hasPrevPage}
                onClick={() => blogSection.prevPage()}
                class={css({
                  paddingX: '6',
                  paddingY: '3',
                  fontSize: 'sm',
                  fontWeight: 'semibold',
                  color: 'indigo.600',
                  backgroundColor: 'white',
                  border: '2px solid',
                  borderColor: 'indigo.200',
                  borderRadius: 'lg',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover:not(:disabled)': {
                    backgroundColor: 'indigo.50',
                    borderColor: 'indigo.300',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    opacity: '0.4',
                    cursor: 'not-allowed',
                  },
                })}
              >
                ← Previous
              </button>

              <span
                class={css({
                  paddingX: '6',
                  paddingY: '3',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  color: 'gray.700',
                  backgroundColor: 'gray.50',
                  borderRadius: 'lg',
                })}
              >
                {blogSection.currentPage} of {blogSection.totalPages}
              </span>

              <button
                disabled={!blogSection.hasNextPage}
                onClick={() => blogSection.nextPage()}
                class={css({
                  paddingX: '6',
                  paddingY: '3',
                  fontSize: 'sm',
                  fontWeight: 'semibold',
                  color: 'indigo.600',
                  backgroundColor: 'white',
                  border: '2px solid',
                  borderColor: 'indigo.200',
                  borderRadius: 'lg',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover:not(:disabled)': {
                    backgroundColor: 'indigo.50',
                    borderColor: 'indigo.300',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    opacity: '0.4',
                    cursor: 'not-allowed',
                  },
                })}
              >
                Next →
              </button>
            </div>
          </BlurFade>
        </Show>
      </div>
    </div>
  );
};
