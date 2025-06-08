import { Outlet } from '@tanstack/solid-router';
import { Suspense } from 'solid-js';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { css } from '../styled-system/css';
import { flex } from '../styled-system/patterns';

const MainLayout = () => {
  return (
    <div
      class={flex({
        direction: 'column',
        minHeight: '100vh',
      })}
    >
      <Header />
      <main
        class={css({
          flex: '1',
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
          px: '4',
          py: '8',
        })}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
