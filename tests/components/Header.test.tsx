import { render } from 'solid-testing-library';
import Header from '../../src/components/Header';
import '../setup.ts';

describe('Header Component', () => {
  it('renders without crashing', () => {
    const { container } = render(() => <Header />);
    expect(container).toBeInTheDocument();
  });

  it('contains navigation elements', () => {
    const { getByText } = render(() => <Header />);
    expect(getByText('SOTA Marketing')).toBeInTheDocument();
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
