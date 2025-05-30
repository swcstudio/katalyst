import { render, screen } from 'solid-testing-library';
import Header from '../../src/components/Header';

describe('Header Component', () => {
  it('renders without crashing', () => {
    const { container } = render(() => <Header />);
    expect(container).toBeTruthy();
  });

  it('contains navigation elements', () => {
    render(() => <Header />);
    const element = screen.queryByText('SOTA Stack');
    expect(element).toBeTruthy();
  });
});

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
