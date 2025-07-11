'use client';

import { Suspense } from 'react';
import Marketing from '../components/Marketing.tsx';

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <Marketing />
    </Suspense>
  );
}
