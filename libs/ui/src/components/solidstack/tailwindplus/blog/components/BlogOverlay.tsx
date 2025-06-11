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
import { BackgroundBeams } from '../../../aceternity/core/BackgroundBeams';
import { Spotlight } from '../../../aceternity/core/Spotlight';
import { BlurFade } from '../../../magicui/BlurFade';
import { BorderBeam } from '../../../magicui/BorderBeam';
import { Meteors } from '../../../magicui/Meteors';
import { TextAnimate } from '../../../magicui/TextAnimate';
import { type BlogPost, type BlogSection, useBlogSection } from '../state/useBlogSection';

export interface BlogOverlayProps {
  blogData: BlogSection;
  className?: string;
  onPostClick?: (post: BlogPost) => void;
  onPostHover?: (post: BlogPost) => void;
  enableAnimations?: boolean;
  staggerDelay?: number;
  animationDuration?: number;
  showSpotlight?: boolean;
  showBackgroundBeams?: boolean;
}

export const BlogOverlay: Component<BlogOverlayProps> = (props) => {
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
      console.log('Blog overlay animation completed');
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
    backgroundColor: 'gray.900',
    paddingY: { base: '24', sm: '32' },
    overflow: 'hidden',
    minHeight: '100vh',
  });

  const innerStyles = css({
    marginX: 'auto',
    maxWidth: '7xl',
    paddingX: { base: '6', lg: '8' },
    position: 'relative',
    zIndex: '10',
  });

  const headerStyles = css({
    marginX: 'auto',
    maxWidth: '2xl',
    textAlign: 'center',
    marginBottom: '16',
  });

  const titleStyles = css({
    fontSize: { base: '4xl', sm: '5xl' },
    fontWeight: 'semibold',
    letterSpacing: 'tight',
    color: 'white',
    lineHeight: 'tight',
    textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
  });

  const subtitleStyles = css({
    marginTop: '4',
    fontSize: { base: 'lg', sm: 'xl' },
    lineHeight: '8',
    color: 'gray.300',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
  });

  const gridStyles = css({
    marginX: 'auto',
    marginTop: '16',
    display: 'grid',
    maxWidth: '2xl',
    gridTemplateColumns: { base: '1', lg: 'repeat(3, minmax(0, 1fr))' },
    gap: { base: '8', lg: '8' },
    autoRows: 'fr',
  });

  const articleStyles = css({
    position: 'relative',
    isolation: 'isolate',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderRadius: '2xl',
    backgroundColor: 'gray.900',
    paddingX: '8',
    paddingTop: { base: '80', sm: '48', lg: '80' },
    paddingBottom: '8',
    cursor: 'pointer',
    transition: 'all 0.5s ease',
    '&:hover': {
      transform: 'scale(1.02) translateY(-4px)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
    },
  });

  const imageStyles = css({
    position: 'absolute',
    inset: '0',
    zIndex: '-10',
    width: 'full',
    height: 'full',
    objectFit: 'cover',
    transition: 'all 0.5s ease',
  });

  const gradientOverlayStyles = css({
    position: 'absolute',
    inset: '0',
    zIndex: '-10',
    background:
      'linear-gradient(to top, rgba(17, 24, 39, 0.9) 0%, rgba(17, 24, 39, 0.4) 40%, transparent 100%)',
    transition: 'all 0.3s ease',
  });

  const ringOverlayStyles = css({
    position: 'absolute',
    inset: '0',
    zIndex: '-10',
    borderRadius: '2xl',
    ring: '1px',
    ringColor: 'gray.900/10',
    ringInset: true,
  });

  const metaStyles = css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 'y-1 x-8',
    overflow: 'hidden',
    fontSize: 'sm',
    lineHeight: '6',
    color: 'gray.300',
    marginBottom: '4',
  });

  const dateStyles = css({
    marginRight: '8',
    color: 'gray.300',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)',
  });

  const authorSectionStyles = css({
    marginLeft: '-4',
    display: 'flex',
    alignItems: 'center',
    gap: 'x-4',
  });

  const separatorStyles = css({
    marginLeft: '-0.5',
    width: '0.5',
    height: '0.5',
    flexShrink: '0',
    fill: 'white/50',
  });

  const authorInfoStyles = css({
    display: 'flex',
    gap: 'x-2.5',
  });

  const avatarStyles = css({
    width: '6',
    height: '6',
    flexShrink: '0',
    borderRadius: 'full',
    backgroundColor: 'white/10',
    ring: '2px',
    ringColor: 'white/20',
  });

  const authorNameStyles = css({
    color: 'gray.200',
    fontWeight: 'medium',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)',
  });

  const titleLinkStyles = css({
    marginTop: '3',
    fontSize: 'lg',
    lineHeight: '6',
    fontWeight: 'semibold',
    color: 'white',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: 'gray.200',
    },
  });

  const linkOverlayStyles = css({
    position: 'absolute',
    inset: '0',
  });

  const backgroundBeamsStyles = css({
    position: 'absolute',
    inset: '0',
    opacity: '0.1',
    zIndex: '0',
  });

  const spotlightStyles = css({
    position: 'absolute',
    top: '-40',
    left: '0',
    width: 'full',
    height: '169',
    opacity: '0.3',
    zIndex: '1',
  });

  const meteorContainerStyles = css({
    position: 'absolute',
    inset: '0',
    overflow: 'hidden',
    pointerEvents: 'none',
    borderRadius: '2xl',
  });

  return (
    <div ref={containerRef} class={`${containerStyles} ${props.className || ''}`}>
      {/* Background Effects */}
      <Show when={props.showBackgroundBeams !== false}>
        <div class={backgroundBeamsStyles}>
          <BackgroundBeams />
        </div>
      </Show>

      <Show when={props.showSpotlight !== false}>
        <div class={spotlightStyles}>
          <Spotlight className="top-40 left-0 md:left-60 md:-top-20" fill="white" />
        </div>
      </Show>

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
                delay={0.4 + index() * (props.staggerDelay || 0.2)}
                inView={isVisible()}
                duration={props.animationDuration || 1.0}
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
                  {/* Background Image */}
                  <Show when={post.imageUrl}>
                    <img
                      alt={post.title}
                      src={post.imageUrl}
                      class={imageStyles}
                      style={{
                        transform:
                          blogSection.hoveredBlogId === String(post.id)
                            ? 'scale(1.1)'
                            : 'scale(1.05)',
                        filter:
                          blogSection.hoveredBlogId === String(post.id)
                            ? 'brightness(1.1) contrast(1.1)'
                            : 'brightness(0.9) contrast(1.05)',
                      }}
                    />
                  </Show>

                  {/* Gradient Overlay */}
                  <div
                    class={gradientOverlayStyles}
                    style={{
                      background:
                        blogSection.hoveredBlogId === String(post.id)
                          ? 'linear-gradient(to top, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.3) 50%, transparent 100%)'
                          : 'linear-gradient(to top, rgba(17, 24, 39, 0.9) 0%, rgba(17, 24, 39, 0.4) 40%, transparent 100%)',
                    }}
                  />

                  <div class={ringOverlayStyles} />

                  {/* Hover Effects */}
                  <Show when={blogSection.hoveredBlogId === String(post.id)}>
                    <div class={meteorContainerStyles}>
                      <Meteors number={5} />
                    </div>
                    <BorderBeam
                      size={400}
                      duration={3}
                      delay={0}
                      borderWidth={1}
                      colorFrom="#60a5fa"
                      colorTo="#a855f7"
                    />
                  </Show>

                  {/* Content */}
                  <div class={metaStyles}>
                    <time dateTime={post.datetime} class={dateStyles}>
                      {post.date}
                    </time>
                    <Show when={blogSection.showAuthors}>
                      <div class={authorSectionStyles}>
                        <svg viewBox="0 0 2 2" aria-hidden="true" class={separatorStyles}>
                          <circle r={1} cx={1} cy={1} />
                        </svg>
                        <div class={authorInfoStyles}>
                          <img
                            alt={post.author.name}
                            src={post.author.imageUrl}
                            class={avatarStyles}
                          />
                          <span class={authorNameStyles}>{post.author.name}</span>
                        </div>
                      </div>
                    </Show>
                  </div>

                  <h3 class={titleLinkStyles}>
                    <a href={post.href}>
                      <span class={linkOverlayStyles} />
                      <TextAnimate animation="slideUp" delay={0.6 + index() * 0.1}>
                        {post.title}
                      </TextAnimate>
                    </a>
                  </h3>
                </article>
              </BlurFade>
            )}
          </For>
        </div>

        {/* Pagination */}
        <Show when={blogSection.totalPages > 1}>
          <BlurFade delay={1.2} inView={isVisible()}>
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
                  color: 'white',
                  backgroundColor: 'white/10',
                  border: '1px solid',
                  borderColor: 'white/20',
                  borderRadius: 'lg',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.3s ease',
                  '&:hover:not(:disabled)': {
                    backgroundColor: 'white/20',
                    borderColor: 'white/30',
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
                  color: 'white',
                  backgroundColor: 'white/20',
                  borderRadius: 'lg',
                  backdropFilter: 'blur(4px)',
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
                  color: 'white',
                  backgroundColor: 'white/10',
                  border: '1px solid',
                  borderColor: 'white/20',
                  borderRadius: 'lg',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.3s ease',
                  '&:hover:not(:disabled)': {
                    backgroundColor: 'white/20',
                    borderColor: 'white/30',
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
