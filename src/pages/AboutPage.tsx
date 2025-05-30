import { css } from '../styled-system/css';
import { flex } from '../styled-system/patterns';

const AboutPage = () => {
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
            mb: '8',
          })}
        >
          About SOTA Marketing Stack
        </h1>
        <div
          class={css({
            maxWidth: '800px',
            fontSize: { base: 'md', md: 'lg' },
            color: 'gray.700',
            lineHeight: 'tall',
          })}
        >
          <p
            class={css({
              mb: '6',
            })}
          >
            SOTA Marketing Stack is a state-of-the-art, cloud-native, distributed system boilerplate
            for creating high-performance marketing websites. Developed by Spectrum Web Co, this
            stack combines the latest technologies to provide a robust foundation for building
            scalable and maintainable marketing websites.
          </p>
          <p
            class={css({
              mb: '6',
            })}
          >
            Our mission is to provide developers and businesses with a comprehensive toolkit that
            eliminates the need for extensive infrastructure investments while delivering complete
            functionality. By leveraging cloud-native architecture and modern frontend technologies,
            we enable teams to focus on creating exceptional user experiences rather than managing
            complex infrastructure.
          </p>
        </div>
      </section>

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
          })}
        >
          <h2
            class={css({
              fontSize: { base: '2xl', md: '3xl' },
              fontWeight: 'bold',
              color: 'gray.900',
              mb: '12',
            })}
          >
            Our Technology Stack
          </h2>
          <div
            class={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' },
              gap: '8',
            })}
          >
            <div
              class={css({
                bg: 'white',
                p: '6',
                rounded: 'lg',
                shadow: 'md',
              })}
            >
              <h3
                class={css({
                  fontSize: 'xl',
                  fontWeight: 'bold',
                  color: 'gray.900',
                  mb: '4',
                })}
              >
                Frontend Technologies
              </h3>
              <ul
                class={css({
                  listStyleType: 'disc',
                  pl: '6',
                  color: 'gray.700',
                  '& li': {
                    mb: '2',
                  },
                })}
              >
                <li>SolidJS with Tanstack Framework suite</li>
                <li>Deno Runtime for server-side operations</li>
                <li>Zustand for state management</li>
                <li>PandaCSS, Mystic UI, and Park UI for styling</li>
                <li>100% TypeScript codebase</li>
              </ul>
            </div>

            <div
              class={css({
                bg: 'white',
                p: '6',
                rounded: 'lg',
                shadow: 'md',
              })}
            >
              <h3
                class={css({
                  fontSize: 'xl',
                  fontWeight: 'bold',
                  color: 'gray.900',
                  mb: '4',
                })}
              >
                Backend & Infrastructure
              </h3>
              <ul
                class={css({
                  listStyleType: 'disc',
                  pl: '6',
                  color: 'gray.700',
                  '& li': {
                    mb: '2',
                  },
                })}
              >
                <li>Convex (self-hosted) with CloudNativePG</li>
                <li>Kubernetes with vCluster deployment</li>
                <li>Comprehensive CI/CD pipeline</li>
                <li>Netlify hosting with Clerk authentication</li>
                <li>GitOps workflow with KubeStack</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        class={css({
          py: '16',
        })}
      >
        <div
          class={css({
            maxWidth: '800px',
            mx: 'auto',
          })}
        >
          <h2
            class={css({
              fontSize: { base: '2xl', md: '3xl' },
              fontWeight: 'bold',
              color: 'gray.900',
              mb: '8',
              textAlign: 'center',
            })}
          >
            Our Team
          </h2>
          <p
            class={css({
              textAlign: 'center',
              color: 'gray.700',
              mb: '12',
            })}
          >
            SOTA Marketing Stack is developed and maintained by a team of experienced engineers at
            Spectrum Web Co, dedicated to creating cutting-edge solutions for modern web
            development.
          </p>

          <div
            class={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
              gap: '8',
            })}
          >
            {/* Team Member 1 */}
            <div
              class={css({
                textAlign: 'center',
              })}
            >
              <div
                class={css({
                  width: '120px',
                  height: '120px',
                  borderRadius: 'full',
                  bg: 'gray.200',
                  mx: 'auto',
                  mb: '4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'gray.500',
                })}
              >
                Photo
              </div>
              <h3
                class={css({
                  fontSize: 'lg',
                  fontWeight: 'bold',
                  color: 'gray.900',
                  mb: '1',
                })}
              >
                Jane Doe
              </h3>
              <p
                class={css({
                  color: 'gray.600',
                  fontSize: 'sm',
                })}
              >
                Lead Engineer
              </p>
            </div>

            {/* Team Member 2 */}
            <div
              class={css({
                textAlign: 'center',
              })}
            >
              <div
                class={css({
                  width: '120px',
                  height: '120px',
                  borderRadius: 'full',
                  bg: 'gray.200',
                  mx: 'auto',
                  mb: '4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'gray.500',
                })}
              >
                Photo
              </div>
              <h3
                class={css({
                  fontSize: 'lg',
                  fontWeight: 'bold',
                  color: 'gray.900',
                  mb: '1',
                })}
              >
                John Smith
              </h3>
              <p
                class={css({
                  color: 'gray.600',
                  fontSize: 'sm',
                })}
              >
                Cloud Architect
              </p>
            </div>

            {/* Team Member 3 */}
            <div
              class={css({
                textAlign: 'center',
              })}
            >
              <div
                class={css({
                  width: '120px',
                  height: '120px',
                  borderRadius: 'full',
                  bg: 'gray.200',
                  mx: 'auto',
                  mb: '4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'gray.500',
                })}
              >
                Photo
              </div>
              <h3
                class={css({
                  fontSize: 'lg',
                  fontWeight: 'bold',
                  color: 'gray.900',
                  mb: '1',
                })}
              >
                Emily Chen
              </h3>
              <p
                class={css({
                  color: 'gray.600',
                  fontSize: 'sm',
                })}
              >
                Frontend Developer
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
