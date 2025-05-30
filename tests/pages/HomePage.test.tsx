import { render, screen } from 'solid-testing-library';
import HomePage from '../../src/pages/HomePage';

describe('HomePage Component', () => {
  it('renders without crashing', () => {
    const { container } = render(() => <HomePage />);
    expect(container).toBeTruthy();
  });

  it('contains hero section', () => {
    render(() => <HomePage />);
    const headingElement = screen.queryByRole('heading', { level: 1 });
    expect(headingElement).toBeTruthy();
  });
});

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
