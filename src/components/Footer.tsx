import { css } from '../styled-system/css';
import { flex } from '../styled-system/patterns';
import { Link } from '@tanstack/solid-router';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      class={css({
        bg: 'gray.100',
        py: '8',
        px: '6',
        borderTop: '1px solid',
        borderColor: 'gray.200',
      })}
    >
      <div
        class={css({
          maxWidth: '1200px',
          mx: 'auto',
          width: '100%',
        })}
      >
        <div
          class={flex({
            direction: { base: 'column', md: 'row' },
            justify: 'space-between',
            align: { base: 'flex-start', md: 'center' },
            gap: '6',
          })}
        >
          <div>
            <div
              class={css({
                fontWeight: 'bold',
                fontSize: 'xl',
                color: 'primary.700',
                mb: '4',
              })}
            >
              SOTA Marketing
            </div>
            <p
              class={css({
                color: 'gray.600',
                maxWidth: '400px',
              })}
            >
              A state-of-the-art, cloud-native, distributed system boilerplate for marketing
              websites.
            </p>
          </div>

          <div
            class={flex({
              direction: 'column',
              gap: '4',
            })}
          >
            <div
              class={css({
                fontWeight: 'semibold',
                color: 'gray.800',
                mb: '2',
              })}
            >
              Quick Links
            </div>
            <div
              class={flex({
                direction: 'column',
                gap: '2',
              })}
            >
              <Link
                href="/"
                class={css({
                  color: 'gray.600',
                  _hover: { color: 'primary.600' },
                })}
              >
                Home
              </Link>
              <Link
                href="/about"
                class={css({
                  color: 'gray.600',
                  _hover: { color: 'primary.600' },
                })}
              >
                About
              </Link>
              <Link
                href="/blog"
                class={css({
                  color: 'gray.600',
                  _hover: { color: 'primary.600' },
                })}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                class={css({
                  color: 'gray.600',
                  _hover: { color: 'primary.600' },
                })}
              >
                Contact
              </Link>
            </div>
          </div>

          <div
            class={flex({
              direction: 'column',
              gap: '4',
            })}
          >
            <div
              class={css({
                fontWeight: 'semibold',
                color: 'gray.800',
                mb: '2',
              })}
            >
              Connect
            </div>
            <div
              class={flex({
                direction: 'column',
                gap: '2',
              })}
            >
              <a
                href="https://github.com/spectrumwebco"
                target="_blank"
                rel="noopener noreferrer"
                class={css({
                  color: 'gray.600',
                  _hover: { color: 'primary.600' },
                })}
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/spectrumwebco"
                target="_blank"
                rel="noopener noreferrer"
                class={css({
                  color: 'gray.600',
                  _hover: { color: 'primary.600' },
                })}
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/company/spectrumwebco"
                target="_blank"
                rel="noopener noreferrer"
                class={css({
                  color: 'gray.600',
                  _hover: { color: 'primary.600' },
                })}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div
          class={css({
            borderTop: '1px solid',
            borderColor: 'gray.200',
            mt: '8',
            pt: '6',
            textAlign: 'center',
            color: 'gray.600',
            fontSize: 'sm',
          })}
        >
          © {currentYear} Spectrum Web Co LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
