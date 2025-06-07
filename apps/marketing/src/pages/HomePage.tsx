import { Link } from '@tanstack/solid-router';
import { createSignal } from 'solid-js';
import { css } from '../styled-system/css';
import { flex } from '../styled-system/patterns';

const HomePage = () => {
  const [email, setEmail] = createSignal('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log('Subscribed with email:', email());
    setEmail('');
    alert('Thank you for subscribing!');
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        class={css({
          py: { base: '12', md: '20' },
          textAlign: 'center',
        })}
      >
        <h1
          class={css({
            fontSize: { base: '4xl', md: '6xl' },
            fontWeight: 'bold',
            color: 'gray.900',
            mb: '6',
            lineHeight: 'tight',
          })}
        >
          SOTA Marketing Stack
        </h1>
        <p
          class={css({
            fontSize: { base: 'xl', md: '2xl' },
            color: 'gray.600',
            maxWidth: '800px',
            mx: 'auto',
            mb: '10',
          })}
        >
          A state-of-the-art, cloud-native, distributed system boilerplate for creating
          high-performance marketing websites.
        </p>
        <div
          class={flex({
            gap: '4',
            justify: 'center',
            direction: { base: 'column', sm: 'row' },
          })}
        >
          <Link
            href="/about"
            class={css({
              bg: 'primary.600',
              color: 'white',
              px: '6',
              py: '3',
              rounded: 'md',
              fontWeight: 'semibold',
              _hover: { bg: 'primary.700' },
              width: { base: '100%', sm: 'auto' },
            })}
          >
            Learn More
          </Link>
          <Link
            href="/contact"
            class={css({
              bg: 'white',
              color: 'primary.600',
              px: '6',
              py: '3',
              rounded: 'md',
              fontWeight: 'semibold',
              border: '1px solid',
              borderColor: 'primary.600',
              _hover: { bg: 'gray.50' },
              width: { base: '100%', sm: 'auto' },
            })}
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section
        class={css({
          py: '16',
          bg: 'gray.50',
        })}
      >
        <div
          class={css({
            maxWidth: '1200px',
            mx: 'auto',
            px: '6',
          })}
        >
          <h2
            class={css({
              fontSize: { base: '3xl', md: '4xl' },
              fontWeight: 'bold',
              color: 'gray.900',
              mb: '12',
              textAlign: 'center',
            })}
          >
            Key Features
          </h2>
          <div
            class={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
              gap: '8',
            })}
          >
            {/* Feature 1 */}
            <div
              class={css({
                bg: 'white',
                p: '6',
                rounded: 'lg',
                shadow: 'md',
                transition: 'all 0.3s ease',
                _hover: { transform: 'translateY(-5px)', shadow: 'lg' },
              })}
            >
              <div
                class={css({
                  bg: 'primary.100',
                  color: 'primary.700',
                  p: '3',
                  rounded: 'full',
                  width: 'fit-content',
                  mb: '4',
                })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
              </div>
              <h3
                class={css({
                  fontSize: 'xl',
                  fontWeight: 'bold',
                  color: 'gray.900',
                  mb: '2',
                })}
              >
                Modern Frontend
              </h3>
              <p
                class={css({
                  color: 'gray.600',
                })}
              >
                Built with SolidJS and the complete Tanstack Framework suite for a reactive and
                performant user experience.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              class={css({
                bg: 'white',
                p: '6',
                rounded: 'lg',
                shadow: 'md',
                transition: 'all 0.3s ease',
                _hover: { transform: 'translateY(-5px)', shadow: 'lg' },
              })}
            >
              <div
                class={css({
                  bg: 'primary.100',
                  color: 'primary.700',
                  p: '3',
                  rounded: 'full',
                  width: 'fit-content',
                  mb: '4',
                })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
              </div>
              <h3
                class={css({
                  fontSize: 'xl',
                  fontWeight: 'bold',
                  color: 'gray.900',
                  mb: '2',
                })}
              >
                Cloud-Native Architecture
              </h3>
              <p
                class={css({
                  color: 'gray.600',
                })}
              >
                Designed for Kubernetes and vCluster deployment with a distributed system approach
                for scalability.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              class={css({
                bg: 'white',
                p: '6',
                rounded: 'lg',
                shadow: 'md',
                transition: 'all 0.3s ease',
                _hover: { transform: 'translateY(-5px)', shadow: 'lg' },
              })}
            >
              <div
                class={css({
                  bg: 'primary.100',
                  color: 'primary.700',
                  p: '3',
                  rounded: 'full',
                  width: 'fit-content',
                  mb: '4',
                })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>
              <h3
                class={css({
                  fontSize: 'xl',
                  fontWeight: 'bold',
                  color: 'gray.900',
                  mb: '2',
                })}
              >
                TypeScript-First
              </h3>
              <p
                class={css({
                  color: 'gray.600',
                })}
              >
                100% TypeScript codebase for type safety, better developer experience, and fewer
                runtime errors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        class={css({
          py: '16',
          bg: 'primary.700',
          color: 'white',
        })}
      >
        <div
          class={css({
            maxWidth: '800px',
            mx: 'auto',
            px: '6',
            textAlign: 'center',
          })}
        >
          <h2
            class={css({
              fontSize: { base: '2xl', md: '3xl' },
              fontWeight: 'bold',
              mb: '4',
            })}
          >
            Stay Updated
          </h2>
          <p
            class={css({
              mb: '8',
              opacity: '0.9',
            })}
          >
            Subscribe to our newsletter to receive updates, news, and insights about SOTA Marketing
            Stack.
          </p>
          <form
            onSubmit={handleSubmit}
            class={css({
              display: 'flex',
              flexDirection: { base: 'column', md: 'row' },
              gap: '4',
              maxWidth: '500px',
              mx: 'auto',
            })}
          >
            <input
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="Enter your email"
              required
              class={css({
                flex: '1',
                px: '4',
                py: '3',
                rounded: { base: 'md', md: 'md 0 0 md' },
                border: 'none',
                outline: 'none',
                color: 'gray.800',
              })}
            />
            <button
              type="submit"
              class={css({
                bg: 'primary.900',
                color: 'white',
                px: '6',
                py: '3',
                rounded: { base: 'md', md: '0 md md 0' },
                fontWeight: 'semibold',
                _hover: { bg: 'primary.800' },
              })}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section
        class={css({
          py: '16',
        })}
      >
        <div
          class={css({
            maxWidth: '1200px',
            mx: 'auto',
            px: '6',
          })}
        >
          <h2
            class={css({
              fontSize: { base: '3xl', md: '4xl' },
              fontWeight: 'bold',
              color: 'gray.900',
              mb: '6',
              textAlign: 'center',
            })}
          >
            Latest from Our Blog
          </h2>
          <p
            class={css({
              textAlign: 'center',
              color: 'gray.600',
              maxWidth: '800px',
              mx: 'auto',
              mb: '12',
            })}
          >
            Explore our latest articles, insights, and updates about marketing technology and
            strategies.
          </p>

          <div
            class={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
              gap: '8',
            })}
          >
            {/* Blog Post 1 */}
            <div
              class={css({
                bg: 'white',
                rounded: 'lg',
                overflow: 'hidden',
                shadow: 'md',
                transition: 'all 0.3s ease',
                _hover: { transform: 'translateY(-5px)', shadow: 'lg' },
              })}
            >
              <div
                class={css({
                  height: '200px',
                  bg: 'gray.200',
                  position: 'relative',
                })}
              >
                <div
                  class={css({
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'gray.500',
                  })}
                >
                  Blog Image Placeholder
                </div>
              </div>
              <div
                class={css({
                  p: '6',
                })}
              >
                <div
                  class={css({
                    fontSize: 'sm',
                    color: 'gray.500',
                    mb: '2',
                  })}
                >
                  May 15, 2025
                </div>
                <h3
                  class={css({
                    fontSize: 'xl',
                    fontWeight: 'bold',
                    color: 'gray.900',
                    mb: '2',
                  })}
                >
                  Getting Started with SOTA Marketing Stack
                </h3>
                <p
                  class={css({
                    color: 'gray.600',
                    mb: '4',
                  })}
                >
                  Learn how to set up and deploy your first marketing website using our
                  state-of-the-art stack.
                </p>
                <Link
                  href="/blog/getting-started"
                  class={css({
                    color: 'primary.600',
                    fontWeight: 'semibold',
                    _hover: { textDecoration: 'underline' },
                  })}
                >
                  Read More →
                </Link>
              </div>
            </div>

            {/* Blog Post 2 */}
            <div
              class={css({
                bg: 'white',
                rounded: 'lg',
                overflow: 'hidden',
                shadow: 'md',
                transition: 'all 0.3s ease',
                _hover: { transform: 'translateY(-5px)', shadow: 'lg' },
              })}
            >
              <div
                class={css({
                  height: '200px',
                  bg: 'gray.200',
                  position: 'relative',
                })}
              >
                <div
                  class={css({
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'gray.500',
                  })}
                >
                  Blog Image Placeholder
                </div>
              </div>
              <div
                class={css({
                  p: '6',
                })}
              >
                <div
                  class={css({
                    fontSize: 'sm',
                    color: 'gray.500',
                    mb: '2',
                  })}
                >
                  May 10, 2025
                </div>
                <h3
                  class={css({
                    fontSize: 'xl',
                    fontWeight: 'bold',
                    color: 'gray.900',
                    mb: '2',
                  })}
                >
                  Cloud-Native Architecture Benefits
                </h3>
                <p
                  class={css({
                    color: 'gray.600',
                    mb: '4',
                  })}
                >
                  Explore the advantages of using a cloud-native distributed system for your
                  marketing website.
                </p>
                <Link
                  href="/blog/cloud-native-benefits"
                  class={css({
                    color: 'primary.600',
                    fontWeight: 'semibold',
                    _hover: { textDecoration: 'underline' },
                  })}
                >
                  Read More →
                </Link>
              </div>
            </div>

            {/* Blog Post 3 */}
            <div
              class={css({
                bg: 'white',
                rounded: 'lg',
                overflow: 'hidden',
                shadow: 'md',
                transition: 'all 0.3s ease',
                _hover: { transform: 'translateY(-5px)', shadow: 'lg' },
              })}
            >
              <div
                class={css({
                  height: '200px',
                  bg: 'gray.200',
                  position: 'relative',
                })}
              >
                <div
                  class={css({
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'gray.500',
                  })}
                >
                  Blog Image Placeholder
                </div>
              </div>
              <div
                class={css({
                  p: '6',
                })}
              >
                <div
                  class={css({
                    fontSize: 'sm',
                    color: 'gray.500',
                    mb: '2',
                  })}
                >
                  May 5, 2025
                </div>
                <h3
                  class={css({
                    fontSize: 'xl',
                    fontWeight: 'bold',
                    color: 'gray.900',
                    mb: '2',
                  })}
                >
                  Optimizing Performance with SolidJS
                </h3>
                <p
                  class={css({
                    color: 'gray.600',
                    mb: '4',
                  })}
                >
                  Tips and tricks for maximizing the performance of your SolidJS applications in
                  production.
                </p>
                <Link
                  href="/blog/solidjs-performance"
                  class={css({
                    color: 'primary.600',
                    fontWeight: 'semibold',
                    _hover: { textDecoration: 'underline' },
                  })}
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>

          <div
            class={css({
              textAlign: 'center',
              mt: '12',
            })}
          >
            <Link
              href="/blog"
              class={css({
                display: 'inline-flex',
                alignItems: 'center',
                color: 'primary.600',
                fontWeight: 'semibold',
                _hover: { textDecoration: 'underline' },
              })}
            >
              View All Articles
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class={css({ ml: '2' })}
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
