import type { JSX } from 'solid-js';

const HomePage = (): JSX.Element => {
  return (
    <div>
      <h1>Storefront Home</h1>
      <p>Welcome to the SSE Storefront micro-frontend</p>
    </div>
  );
};

const ProductsPage = (): JSX.Element => {
  return (
    <div>
      <h1>Products</h1>
      <p>Browse our products</p>
    </div>
  );
};

export const StorefrontRouter = (): JSX.Element => {
  return (
    <div>
      <HomePage />
    </div>
  );
};
