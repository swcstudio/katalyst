import { Link } from '@tanstack/solid-router';
import { Show, createSignal } from 'solid-js';
import { css } from '../styled-system/css';
import { flex } from '../styled-system/patterns';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen());
  };

  return (
    <header
      class={css({
        bg: 'white',
        borderBottom: '1px solid',
        borderColor: 'gray.200',
        py: '4',
        px: '6',
        position: 'sticky',
        top: '0',
        zIndex: '10',
        width: '100%',
      })}
    >
      <div
        class={flex({
          justify: 'space-between',
          align: 'center',
          maxWidth: '1200px',
          mx: 'auto',
          width: '100%',
        })}
      >
        <div
          class={css({
            fontWeight: 'bold',
            fontSize: 'xl',
            color: 'primary.700',
          })}
        >
          <Link href="/">SOTA Marketing</Link>
        </div>

        {/* Desktop Navigation */}
        <nav
          class={css({
            display: { base: 'none', md: 'block' },
          })}
        >
          <ul
            class={flex({
              gap: '8',
            })}
          >
            <li>
              <Link
                href="/"
                class={css({
                  fontWeight: 'medium',
                  color: 'gray.700',
                  _hover: { color: 'primary.600' },
                })}
                activeProps={{
                  class: css({ color: 'primary.600', fontWeight: 'bold' }),
                }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                class={css({
                  fontWeight: 'medium',
                  color: 'gray.700',
                  _hover: { color: 'primary.600' },
                })}
                activeProps={{
                  class: css({ color: 'primary.600', fontWeight: 'bold' }),
                }}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                class={css({
                  fontWeight: 'medium',
                  color: 'gray.700',
                  _hover: { color: 'primary.600' },
                })}
                activeProps={{
                  class: css({ color: 'primary.600', fontWeight: 'bold' }),
                }}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                class={css({
                  fontWeight: 'medium',
                  color: 'gray.700',
                  _hover: { color: 'primary.600' },
                })}
                activeProps={{
                  class: css({ color: 'primary.600', fontWeight: 'bold' }),
                }}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          class={css({
            display: { base: 'block', md: 'none' },
            bg: 'transparent',
            border: 'none',
            cursor: 'pointer',
            p: '2',
          })}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div
            class={css({
              width: '24px',
              height: '3px',
              bg: 'gray.800',
              mb: '5px',
              transition: 'all 0.3s ease',
              transform: isMenuOpen() ? 'rotate(45deg) translate(5px, 5px)' : 'none',
            })}
          ></div>
          <div
            class={css({
              width: '24px',
              height: '3px',
              bg: 'gray.800',
              mb: '5px',
              transition: 'all 0.3s ease',
              opacity: isMenuOpen() ? '0' : '1',
            })}
          ></div>
          <div
            class={css({
              width: '24px',
              height: '3px',
              bg: 'gray.800',
              transition: 'all 0.3s ease',
              transform: isMenuOpen() ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
            })}
          ></div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <Show when={isMenuOpen()}>
        <nav
          class={css({
            display: { base: 'block', md: 'none' },
            py: '4',
            px: '6',
            bg: 'white',
            borderTop: '1px solid',
            borderColor: 'gray.200',
          })}
        >
          <ul
            class={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4',
            })}
          >
            <li>
              <Link
                href="/"
                class={css({
                  fontWeight: 'medium',
                  color: 'gray.700',
                  _hover: { color: 'primary.600' },
                  display: 'block',
                  py: '2',
                })}
                activeProps={{
                  class: css({ color: 'primary.600', fontWeight: 'bold' }),
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                class={css({
                  fontWeight: 'medium',
                  color: 'gray.700',
                  _hover: { color: 'primary.600' },
                  display: 'block',
                  py: '2',
                })}
                activeProps={{
                  class: css({ color: 'primary.600', fontWeight: 'bold' }),
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                class={css({
                  fontWeight: 'medium',
                  color: 'gray.700',
                  _hover: { color: 'primary.600' },
                  display: 'block',
                  py: '2',
                })}
                activeProps={{
                  class: css({ color: 'primary.600', fontWeight: 'bold' }),
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                class={css({
                  fontWeight: 'medium',
                  color: 'gray.700',
                  _hover: { color: 'primary.600' },
                  display: 'block',
                  py: '2',
                })}
                activeProps={{
                  class: css({ color: 'primary.600', fontWeight: 'bold' }),
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </Show>
    </header>
  );
};

export default Header;

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
