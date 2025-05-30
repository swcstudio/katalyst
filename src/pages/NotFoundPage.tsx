import { Link } from '@tanstack/solid-router';
import { css } from '../styled-system/css';
import { flex } from '../styled-system/patterns';

const NotFoundPage = () => {
  return (
    <div
      class={flex({
        direction: 'column',
        align: 'center',
        justify: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        px: '4',
      })}
    >
      <h1
        class={css({
          fontSize: { base: '6xl', md: '8xl' },
          fontWeight: 'bold',
          color: 'gray.900',
          mb: '4',
        })}
      >
        404
      </h1>
      <h2
        class={css({
          fontSize: { base: '2xl', md: '4xl' },
          fontWeight: 'semibold',
          color: 'gray.700',
          mb: '6',
        })}
      >
        Page Not Found
      </h2>
      <p
        class={css({
          fontSize: { base: 'md', md: 'lg' },
          color: 'gray.600',
          maxWidth: '600px',
          mb: '8',
        })}
      >
        The page you are looking for might have been removed, had its name changed, or is
        temporarily unavailable.
      </p>
      <Link
        href="/"
        class={css({
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: '6',
          py: '3',
          bg: 'primary.500',
          color: 'white',
          fontWeight: 'medium',
          rounded: 'md',
          _hover: {
            bg: 'primary.600',
          },
        })}
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
