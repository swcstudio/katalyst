import type { MetaFunction } from "@remix-run/node";
import { useQuery } from '@tanstack/react-query';

export const meta: MetaFunction = () => {
  return [
    { title: "Katalyst Remix - React 19 + Remix Framework" },
    { name: "description", content: "High-performance full-stack framework combining React 19 with Remix and Rust toolchain" },
  ];
};

export default function Index() {
  const { data: message } = useQuery({
    queryKey: ['welcome'],
    queryFn: () => Promise.resolve('Welcome to Katalyst Remix Framework!'),
  });

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>{message}</h1>
      <p>
        Built with React 19, Remix, and the complete Tanstack ecosystem.
      </p>
      <ul>
        <li>
          <strong>React 19</strong> - Latest React with concurrent features
        </li>
        <li>
          <strong>Remix</strong> - Full-stack web framework
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
    </div>
  );
}
