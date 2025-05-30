import { render } from 'solid-testing-library';
import HomePage from '../../src/pages/HomePage';
import '../setup.ts';

describe('HomePage Component', () => {
  it('renders without crashing', () => {
    const { container } = render(() => <HomePage />);
    expect(container).toBeInTheDocument();
  });

  it('contains hero section', () => {
    const { queryByRole } = render(() => <HomePage />);
    const headingElement = queryByRole('heading', { level: 1 });
    expect(headingElement).toBeTruthy();
  });
});

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
