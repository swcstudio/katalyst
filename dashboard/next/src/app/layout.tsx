import ThemeProvider from '@/components/ThemeProvider';
import type { Metadata } from 'next';
import { ReactQueryProvider } from './providers.tsx';
import '@/styles/tailwind.css';

export const metadata: Metadata = {
  title: {
    template: '%s - Spectrum Web Co Studio',
    default: 'Spectrum Web Co Studio - Award winning development studio',
  },
  description:
    'High-performance full-stack framework combining React 19 with Next.js and cutting-edge design',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-neutral-950 text-base antialiased">
      <body className="flex min-h-full flex-col" suppressHydrationWarning={true}>
        <ReactQueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
