import { Component, createSignal, onMount, onCleanup, For, Show, createEffect } from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { useBlogSection, BlogPost, BlogSection } from '../state/useBlogSection';
import { BlurFade } from '../../../magicui/BlurFade';
import { TextAnimate } from '../../../magicui/TextAnimate';
import { BorderBeam } from '../../../magicui/BorderBeam';
import { DotPattern } from '../../../magicui/DotPattern';
import { NumberTicker } from '../../../magicui/NumberTicker';

export interface BlogListProps {
  blogData: BlogSection;
  className?: string;
  onPostClick?: (post: BlogPost) => void;
  onPostHover?: (post: BlogPost) => void;
  enableAnimations?: boolean;
  staggerDelay?: number;
  animationDuration?: number;
  showTimeline?: boolean;
  showNumbers?: boolean;
}

export const BlogList: Component<BlogListProps> = (props) => {
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
      console.log('Blog list animation completed');
    }
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
    overflow: 'hidden'
  });

  const innerStyles = css({
    marginX: 'auto',
    maxWidth: '2xl',
    paddingX: { base: '6', lg: '8' }
  });

  const headerStyles = css({
    marginX: 'auto',
    maxWidth: '2xl'
  });

  const titleStyles = css({
    fontSize: { base: '4xl', sm: '5xl' },
    fontWeight: 'semibold',
    letterSpacing: 'tight',
    color: 'gray.900',
    lineHeight: 'tight'
  });

  const subtitleStyles = css({
    marginTop: '2',
    fontSize: { base: 'lg', sm: 'xl' },
    lineHeight: '8',
    color: 'gray.600'
  });

  const listContainerStyles = css({
    marginTop: '10',
    paddingTop: '10',
    borderTopWidth: '1px',
    borderTopColor: 'gray.200',
    '@media (min-width: 640px)': {
      marginTop: '16',
      paddingTop: '16'
    }
  });

  const timelineStyles = css({
    position: 'relative',
    paddingLeft: { base: '0', sm: '12' }
  });

  const timelineLineStyles = css({
    position: 'absolute',
    left: '6',
    top: '0',
    bottom: '0',
    width: '0.5',
    backgroundColor: 'gradient-to-b',
    background: 'linear-gradient(to bottom, transparent 0%, #e5e7eb 10%, #e5e7eb 90%, transparent 100%)',
    '@media (max-width: 640px)': {
      display: 'none'
    }
  });

  const listStyles = css({
    display: 'flex',
    flexDirection: 'column',
    gap: '16'
  });

  const articleStyles = css({
    position: 'relative',
    display: 'flex',
    maxWidth: 'xl',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 'xl',
    padding: '6',
    cursor: 'pointer',
    transition: 'all 0.4s ease',
    border: '1px solid',
    borderColor: 'gray.100',
    '&:hover': {
      transform: 'translateX(8px)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      borderColor: 'gray.200'
    }
  });

  const timelineNodeStyles = css({
    position: 'absolute',
    left: '-18',
    top: '6',
    width: '12',
    height: '12',
    borderRadius: 'full',
    backgroundColor: 'white',
    border: '3px solid',
    borderColor: 'indigo.200',
    zIndex: '10',
    transition: 'all 0.3s ease',
    '@media (max-width: 640px)': {
      display: 'none'
    }
  });

  const timelineNodeActiveStyles = css({
    borderColor: 'indigo.500',
    backgroundColor: 'indigo.100',
    transform: 'scale(1.2)',
    boxShadow: '0 0 20px rgba(79, 70, 229, 0.3)'
  });

  const numberIndicatorStyles = css({
    position: 'absolute',
    left: '-24',
    top: '2',
    width: '6',
    height: '6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'xs',
    fontWeight: 'bold',
    color: 'indigo.600',
    backgroundColor: 'indigo.50',
    borderRadius: 'full',
    border: '2px solid',
    borderColor: 'indigo.200',
    zIndex: '10',
    '@media (max-width: 640px)': {
      position: 'static',
      marginBottom: '4',
      width: '8',
      height: '8'
    }
  });

  const metaStyles = css({
    display: 'flex',
    alignItems: 'center',
    gap: 'x-4',
    fontSize: 'xs',
    marginBottom: '4'
  });

  const dateStyles = css({
    color: 'gray.500',
    fontWeight: 'medium'
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
      transform: 'scale(1.05)'
    }
  });

  const titleGroupStyles = css({
    position: 'relative',
    display: 'group',
    flex: '1'
  });

  const postTitleStyles = css({
    marginTop: '3',
    fontSize: 'lg',
    lineHeight: '6',
    fontWeight: 'semibold',
    color: 'gray.900',
    transition: 'color 0.2s ease',
    'group:hover &': {
      color: 'gray.600'
    }
  });

  const linkOverlayStyles = css({
    position: 'absolute',
    inset: '0'
  });

  const descriptionStyles = css({
    marginTop: '5',
    fontSize: 'sm',
    lineHeight: '6',
    color: 'gray.600',
    overflow: 'hidden',
    maxHeight: '4.5rem'
  });

  const authorSectionStyles = css({
    position: 'relative',
    marginTop: '8',
    display: 'flex',
    alignItems: 'center',
    gap: 'x-4'
  });

  const avatarStyles = css({
    width: '10',
    height: '10',
    borderRadius: 'full',
    backgroundColor: 'gray.50',
    ring: '2px',
    ringColor: 'white',
    transition: 'all 0.3s ease'
  });

  const authorInfoStyles = css({
    fontSize: 'sm',
    lineHeight: '6'
  });

  const authorNameStyles = css({
    fontWeight: 'semibold',
    color: 'gray.900'
  });

  const authorRoleStyles = css({
    color: 'gray.600'
  });

  const backgroundPatternStyles = css({
    position: 'absolute',
    inset: '0',
    opacity: '0.02',
    zIndex: '0'
  });

  const readingTimeStyles = css({
    marginTop: '4',
    fontSize: 'xs',
    color: 'gray.500',
    fontWeight: 'medium',
    backgroundColor: 'gray.50',
    paddingX: '2',
    paddingY: '1',
    borderRadius: 'md',
    display: 'inline-block'
  });

  return (
    <div ref={containerRef} class={`${containerStyles} ${props.className || ''}`}>
      {/* Background Pattern */}
      <div class={backgroundPatternStyles}>
        <DotPattern
          width={16}
          height={16}
          cx={1}
          cy={1}
          cr={0.5}
          className="fill-gray-300"
        />
      </div>

      <div class={innerStyles}>
        {/* Header Section */}
        <div class={headerStyles}>
          <BlurFade delay={0.1} inView={isVisible()}>
            <TextAnimate
              animation="blurInUp"
              class={titleStyles}
            >
              {blogSection.blogData.title}
            </TextAnimate>
          </BlurFade>
          
          <Show when={blogSection.blogData.subtitle}>
            <BlurFade delay={0.2} inView={isVisible()}>
              <p class={subtitleStyles}>
                {blogSection.blogData.subtitle}
              </p>
            </BlurFade>
          </Show>
        </div>

        {/* Blog Posts List */}
        <div class={listContainerStyles}>
          <div class={timelineStyles}>
            {/* Timeline Line */}
            <Show when={props.showTimeline !== false}>
              <div class={timelineLineStyles} />
            </Show>

            <div class={listStyles}>
              <For each={blogSection.paginatedPosts}>
                {(post, index) => (
                  <BlurFade 
                    delay={0.3 + (index() * (props.staggerDelay || 0.1))} 
                    inView={isVisible()}
                    duration={props.animationDuration || 0.6}
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
                      {/* Timeline Node */}
                      <Show when={props.showTimeline !== false}>
                        <div 
                          class={`${timelineNodeStyles} ${
                            blogSection.hoveredBlogId === String(post.id) ? timelineNodeActiveStyles : ''
                          }`}
                        />
                      </Show>

                      {/* Number Indicator */}
                      <Show when={props.showNumbers !== false}>
                        <div class={numberIndicatorStyles}>
                          <NumberTicker 
                            value={index() + 1 + ((blogSection.currentPage - 1) * blogSection.postsPerPage)}
                            className="text-xs font-bold"
                          />
                        </div>
                      </Show>

                      {/* Border Beam on Hover */}
                      <Show when={blogSection.hoveredBlogId === String(post.id)}>
                        <BorderBeam size={300} duration={2} delay={0} />
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
                                : post.category!.color
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
                            <TextAnimate
                              animation="slideUp"
                              delay={0.4 + (index() * 0.05)}
                            >
                              {post.title}
                            </TextAnimate>
                          </a>
                        </h3>
                        <p class={descriptionStyles}>
                          {post.description}
                        </p>
                      </div>

                      {/* Author Section */}
                      <Show when={blogSection.showAuthors}>
                        <div class={authorSectionStyles}>
                          <img 
                            alt={post.author.name} 
                            src={post.author.imageUrl} 
                            class={avatarStyles}
                            style={{
                              transform: blogSection.hoveredBlogId === String(post.id) 
                                ? 'scale(1.1)' 
                                : 'scale(1)'
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
                              <p class={authorRoleStyles}>
                                {post.author.role}
                              </p>
                            </Show>
                          </div>
                        </div>
                      </Show>

                      {/* Reading Time */}
                      <Show when={post.readingTime && blogSection.showReadingTime}>
                        <div class={readingTimeStyles}>
                          {post.readingTime} read
                        </div>
                      </Show>
                    </article>
                  </BlurFade>
                )}
              </For>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <Show when={blogSection.totalPages > 1}>
          <BlurFade delay={0.8} inView={isVisible()}>
            <div class={css({
              marginTop: '16',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '4'
            })}>
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
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    opacity: '0.5',
                    cursor: 'not-allowed'
                  }
                })}
              >
                ← Previous
              </button>
              
              <span class={css({
                paddingX: '4',
                fontSize: 'sm',
                color: 'gray.700',
                fontWeight: 'medium'
              })}>
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
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    opacity: '0.5',
                    cursor: 'not-allowed'
                  }
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