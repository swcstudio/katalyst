'use client';

import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const { data: message } = useQuery({
    queryKey: ['welcome'],
    queryFn: () => Promise.resolve('Welcome to Katalyst Next.js Framework!'),
  });

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8", padding: "2rem" }}>
      <h1>{message}</h1>
      <p>
        Built with React 19, Next.js, and the complete Tanstack ecosystem.
      </p>
      <ul>
        <li>
          <strong>React 19</strong> - Latest React with concurrent features
        </li>
        <li>
          <strong>Next.js 15</strong> - Full-stack React framework
        </li>
        <li>
          <strong>Tanstack</strong> - Router, Query, Form, Table, Virtual
        </li>
        <li>
          <strong>Zustand</strong> - State management
        </li>
        <li>
          <strong>Tailwind CSS 4.0</strong> - Utility-first CSS framework
        </li>
        <li>
          <strong>Anime.js</strong> - Smooth animations
        </li>
      </ul>
    </main>
  );
}
