import {
  type Component,
  createEffect,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { BlurFade } from '../../../magicui/BlurFade';
import { BorderBeam } from '../../../magicui/BorderBeam';
import { DotPattern } from '../../../magicui/DotPattern';
import { TextAnimate } from '../../../magicui/TextAnimate';
import { type BlogPost, type BlogSection, useBlogSection } from '../state/useBlogSection';

export interface BlogGridProps {
  blogData: BlogSection;
  className?: string;
  onPostClick?: (post: BlogPost) => void;
  onPostHover?: (post: BlogPost) => void;
  enableAnimations?: boolean;
  staggerDelay?: number;
  animationDuration?: number;
}

export const BlogGrid: Component<BlogGridProps> = (props) => {
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
      console.log('Blog grid animation completed');
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
    textAlign: { lg: 'left' },
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
    marginTop: '10',
    display: 'grid',
    maxWidth: '2xl',
    gridTemplateColumns: { base: '1', lg: 'none' },
    gap: { base: 'x-8 y-16', lg: 'x-8 y-16' },
    borderTopWidth: '1px',
    borderTopColor: 'gray.200',
    paddingTop: '10',
    '@media (min-width: 1024px)': {
      marginX: '0',
      maxWidth: 'none',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      marginTop: '16',
      paddingTop: '16',
    },
  });

  const articleStyles = css({
    display: 'flex',
    maxWidth: 'xl',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'relative',
    borderRadius: 'lg',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },
  });

  const metaStyles = css({
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
    transition: 'color 0.2s ease',
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
    backgroundColor: 'gray.50',
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
    opacity: '0.03',
    zIndex: '0',
  });

  return (
    <div ref={containerRef} class={`${containerStyles} ${props.className || ''}`}>
      {/* Background Pattern */}
      <div class={backgroundPatternStyles}>
        <DotPattern width={20} height={20} cx={1} cy={1} cr={1} className="fill-gray-400" />
      </div>

      <div class={innerStyles}>
        {/* Header Section */}
        <div class={headerStyles}>
          <BlurFade delay={0.1} inView={isVisible()}>
            <TextAnimate animation="blurInUp" class={titleStyles}>
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
                delay={0.3 + index() * (props.staggerDelay || 0.1)}
                inView={isVisible()}
                duration={props.animationDuration || 0.6}
              >
                <article
                  class={articleStyles}
                  onMouseEnter={() => blogSection.setBlogHover(String(post.id))}
                  onMouseLeave={() => blogSection.clearBlogHover()}
                  onClick={() => blogSection.handleBlogClick(String(post.id))}
                >
                  {/* Border Beam on Hover */}
                  <Show when={blogSection.hoveredBlogId === String(post.id)}>
                    <BorderBeam size={200} duration={3} delay={0} />
                  </Show>

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
                        <TextAnimate animation="slideUp" delay={0.4 + index() * 0.05}>
                          {post.title}
                        </TextAnimate>
                      </a>
                    </h3>
                    <p class={descriptionStyles}>{post.description}</p>
                  </div>

                  {/* Author Section */}
                  <Show when={blogSection.showAuthors}>
                    <div class={authorSectionStyles}>
                      <img alt={post.author.name} src={post.author.imageUrl} class={avatarStyles} />
                      <div class={authorInfoStyles}>
                        <p class={authorNameStyles}>
                          <Show when={post.author.href} fallback={<span>{post.author.name}</span>}>
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
                      })}
                    >
                      {post.readingTime} read
                    </div>
                  </Show>
                </article>
              </BlurFade>
            )}
          </For>
        </div>

        {/* Pagination */}
        <Show when={blogSection.totalPages > 1}>
          <BlurFade delay={0.8} inView={isVisible()}>
            <div
              class={css({
                marginTop: '16',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4',
              })}
            >
              <button
                disabled={!blogSection.hasPrevPage}
                onClick={() => blogSection.prevPage()}
                class={css({
                  paddingX: '4',
                  paddingY: '2',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  color: 'indigo.600',
                  backgroundColor: 'white',
                  border: '1px solid',
                  borderColor: 'gray.300',
                  borderRadius: 'md',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover:not(:disabled)': {
                    backgroundColor: 'gray.50',
                  },
                  '&:disabled': {
                    opacity: '0.5',
                    cursor: 'not-allowed',
                  },
                })}
              >
                Previous
              </button>

              <span
                class={css({
                  paddingX: '4',
                  fontSize: 'sm',
                  color: 'gray.700',
                })}
              >
                Page {blogSection.currentPage} of {blogSection.totalPages}
              </span>

              <button
                disabled={!blogSection.hasNextPage}
                onClick={() => blogSection.nextPage()}
                class={css({
                  paddingX: '4',
                  paddingY: '2',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  color: 'indigo.600',
                  backgroundColor: 'white',
                  border: '1px solid',
                  borderColor: 'gray.300',
                  borderRadius: 'md',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover:not(:disabled)': {
                    backgroundColor: 'gray.50',
                  },
                  '&:disabled': {
                    opacity: '0.5',
                    cursor: 'not-allowed',
                  },
                })}
              >
                Next
              </button>
            </div>
          </BlurFade>
        </Show>
      </div>
    </div>
  );
};
