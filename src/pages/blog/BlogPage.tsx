import { createSignal, createEffect, For } from 'solid-js';
import { Link } from '@tanstack/solid-router';
import { css } from '../../styled-system/css';
import { flex } from '../../styled-system/patterns';

const BLOG_POSTS = [
  {
    id: '003',
    slug: 'cloud-native-marketing-websites',
    title: 'Building Cloud-Native Marketing Websites',
    excerpt: 'Learn how to leverage Kubernetes and vCluster to create scalable marketing websites.',
    date: '2025-05-15',
    author: 'Jane Smith',
    readTime: '8 min read',
    tags: ['cloud-native', 'kubernetes', 'marketing'],
  },
  {
    id: '002',
    slug: 'solidjs-vs-react',
    title: 'SolidJS vs React: A Performance Comparison',
    excerpt: 'Discover why SolidJS offers superior performance for marketing websites.',
    date: '2025-04-22',
    author: 'John Doe',
    readTime: '6 min read',
    tags: ['solidjs', 'react', 'performance'],
  },
  {
    id: '001',
    slug: 'getting-started-with-sota-stack',
    title: 'Getting Started with SOTA Marketing Stack',
    excerpt: 'A comprehensive guide to setting up your first project with SOTA Marketing Stack.',
    date: '2025-03-10',
    author: 'Emily Chen',
    readTime: '10 min read',
    tags: ['sota-stack', 'tutorial', 'getting-started'],
  },
];

const POSTS_PER_PAGE = 5;

const BlogPage = () => {
  const [currentPage, setCurrentPage] = createSignal(1);
  const [totalPages, setTotalPages] = createSignal(1);
  const [displayedPosts, setDisplayedPosts] = createSignal<typeof BLOG_POSTS>([]);
  const [selectedTag, setSelectedTag] = createSignal<string | null>(null);

  const allTags = [...new Set(BLOG_POSTS.flatMap(post => post.tags))];

  const filteredPosts = () => {
    if (!selectedTag()) return BLOG_POSTS;
    return BLOG_POSTS.filter(post => post.tags.includes(selectedTag()!));
  };

  createEffect(() => {
    const filtered = filteredPosts();
    setTotalPages(Math.ceil(filtered.length / POSTS_PER_PAGE));
    
    const startIndex = (currentPage() - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    setDisplayedPosts(filtered.slice(startIndex, endIndex));
    
    if (currentPage() > totalPages() && totalPages() > 0) {
      setCurrentPage(1);
    }
  });

  const handleTagClick = (tag: string) => {
    setSelectedTag(prev => prev === tag ? null : tag);
    setCurrentPage(1);
  };

  return (
    <div>
      <section
        class={css({
          py: { base: '12', md: '20' },
        })}
      >
        <h1
          class={css({
            fontSize: { base: '3xl', md: '5xl' },
            fontWeight: 'bold',
            color: 'gray.900',
            mb: '4',
          })}
        >
          SOTA Research Blog
        </h1>
        <p
          class={css({
            fontSize: { base: 'lg', md: 'xl' },
            color: 'gray.700',
            maxWidth: '800px',
            mb: '12',
          })}
        >
          Insights, tutorials, and best practices for building state-of-the-art marketing websites
          using cloud-native technologies.
        </p>

        {/* Tags filter */}
        <div
          class={css({
            mb: '8',
          })}
        >
          <h2
            class={css({
              fontSize: 'lg',
              fontWeight: 'medium',
              color: 'gray.700',
              mb: '3',
            })}
          >
            Filter by topic:
          </h2>
          <div
            class={flex({
              gap: '2',
              flexWrap: 'wrap',
            })}
          >
            <For each={allTags}>
              {(tag) => (
                <button
                  onClick={() => handleTagClick(tag)}
                  class={css({
                    px: '3',
                    py: '1',
                    rounded: 'full',
                    fontSize: 'sm',
                    fontWeight: 'medium',
                    bg: selectedTag() === tag ? 'primary.500' : 'gray.100',
                    color: selectedTag() === tag ? 'white' : 'gray.700',
                    _hover: {
                      bg: selectedTag() === tag ? 'primary.600' : 'gray.200',
                    },
                  })}
                >
                  {tag}
                </button>
              )}
            </For>
            {selectedTag() && (
              <button
                onClick={() => setSelectedTag(null)}
                class={css({
                  px: '3',
                  py: '1',
                  rounded: 'full',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  bg: 'red.100',
                  color: 'red.700',
                  _hover: {
                    bg: 'red.200',
                  },
                })}
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Blog posts */}
        <div
          class={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' },
            gap: '8',
            mb: '12',
          })}
        >
          <For each={displayedPosts()}>
            {(post) => (
              <article
                class={css({
                  bg: 'white',
                  rounded: 'lg',
                  overflow: 'hidden',
                  shadow: 'md',
                  transition: 'transform 0.2s, shadow 0.2s',
                  _hover: {
                    transform: 'translateY(-4px)',
                    shadow: 'lg',
                  },
                })}
              >
                <div
                  class={css({
                    h: '200px',
                    bg: 'gray.200',
                    position: 'relative',
                  })}
                >
                  <div
                    class={css({
                      position: 'absolute',
                      top: '2',
                      left: '2',
                      bg: 'primary.500',
                      color: 'white',
                      px: '2',
                      py: '1',
                      rounded: 'md',
                      fontSize: 'xs',
                      fontWeight: 'medium',
                    })}
                  >
                    {post.id}
                  </div>
                </div>
                <div
                  class={css({
                    p: '6',
                  })}
                >
                  <div
                    class={flex({
                      justify: 'space-between',
                      align: 'center',
                      mb: '2',
                    })}
                  >
                    <span
                      class={css({
                        fontSize: 'sm',
                        color: 'gray.600',
                      })}
                    >
                      {post.date}
                    </span>
                    <span
                      class={css({
                        fontSize: 'sm',
                        color: 'gray.600',
                      })}
                    >
                      {post.readTime}
                    </span>
                  </div>
                  <h2
                    class={css({
                      fontSize: 'xl',
                      fontWeight: 'bold',
                      color: 'gray.900',
                      mb: '2',
                    })}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      class={css({
                        color: 'inherit',
                        _hover: {
                          color: 'primary.600',
                        },
                      })}
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p
                    class={css({
                      color: 'gray.700',
                      mb: '4',
                    })}
                  >
                    {post.excerpt}
                  </p>
                  <div
                    class={flex({
                      justify: 'space-between',
                      align: 'center',
                    })}
                  >
                    <span
                      class={css({
                        fontSize: 'sm',
                        color: 'gray.700',
                        fontWeight: 'medium',
                      })}
                    >
                      By {post.author}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      class={css({
                        fontSize: 'sm',
                        fontWeight: 'medium',
                        color: 'primary.600',
                        _hover: {
                          textDecoration: 'underline',
                        },
                      })}
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            )}
          </For>
        </div>

        {/* Pagination */}
        {totalPages() > 1 && (
          <div
            class={flex({
              justify: 'center',
              gap: '2',
            })}
          >
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage() === 1}
              class={css({
                px: '4',
                py: '2',
                rounded: 'md',
                bg: 'white',
                border: '1px solid',
                borderColor: 'gray.300',
                _hover: {
                  bg: 'gray.50',
                },
                _disabled: {
                  opacity: 0.5,
                  cursor: 'not-allowed',
                  _hover: {
                    bg: 'white',
                  },
                },
              })}
            >
              Previous
            </button>
            <For each={Array.from({ length: totalPages() }, (_, i) => i + 1)}>
              {(page) => (
                <button
                  onClick={() => setCurrentPage(page)}
                  class={css({
                    px: '4',
                    py: '2',
                    rounded: 'md',
                    bg: currentPage() === page ? 'primary.500' : 'white',
                    color: currentPage() === page ? 'white' : 'gray.700',
                    border: '1px solid',
                    borderColor: currentPage() === page ? 'primary.500' : 'gray.300',
                    _hover: {
                      bg: currentPage() === page ? 'primary.600' : 'gray.50',
                    },
                  })}
                >
                  {page}
                </button>
              )}
            </For>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages()))}
              disabled={currentPage() === totalPages()}
              class={css({
                px: '4',
                py: '2',
                rounded: 'md',
                bg: 'white',
                border: '1px solid',
                borderColor: 'gray.300',
                _hover: {
                  bg: 'gray.50',
                },
                _disabled: {
                  opacity: 0.5,
                  cursor: 'not-allowed',
                  _hover: {
                    bg: 'white',
                  },
                },
              })}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogPage;

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
