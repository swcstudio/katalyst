import { render } from '@solidjs/testing-library';
import { AnimatedHero } from '../src/components/AnimatedHero';

describe('Marketing Components', () => {
  test('AnimatedHero renders correctly', () => {
    const { getByText } = render(() => <AnimatedHero />);
    
    expect(getByText('SolidStack Enterprise')).toBeInTheDocument();
  });
});
