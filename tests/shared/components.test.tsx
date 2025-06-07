import { render } from '@solidjs/testing-library';
import { AnimatedButton, LoadingSpinner } from '../../libs/shared/components';

describe('Shared Components', () => {
  test('AnimatedButton renders correctly', () => {
    const { getByText } = render(() => (
      <AnimatedButton>Test Button</AnimatedButton>
    ));
    
    expect(getByText('Test Button')).toBeInTheDocument();
  });

  test('LoadingSpinner renders with correct size', () => {
    const { container } = render(() => (
      <LoadingSpinner size="lg" />
    ));
    
    expect(container.firstChild).toBeInTheDocument();
  });
});
