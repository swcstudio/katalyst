'use client';

import React, { Suspense } from 'react';
import Marketing from '../components/Marketing.tsx';

export default function Home(): React.JSX.Element {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <Marketing />
    </Suspense>
  );
}
