import { createSignal } from 'solid-js';
import { css } from '../../../src/styled-system/css';
import { animeWrapper } from '../animations/anime-wrapper';

interface AnimatedButtonProps {
  children: JSX.Element;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const AnimatedButton = (props: AnimatedButtonProps) => {
  const [isHovered, setIsHovered] = createSignal(false);
  const animate = (target: HTMLElement, config: Record<string, unknown>) => {
    animeWrapper.animate(target, config);
  };

  const handleMouseEnter = (element: HTMLElement) => {
    setIsHovered(true);
    animate(element, {
      scale: [1, 1.05],
      duration: 200,
      easing: 'easeOutQuad',
    });
  };

  const handleMouseLeave = (element: HTMLElement) => {
    setIsHovered(false);
    animate(element, {
      scale: [1.05, 1],
      duration: 200,
      easing: 'easeOutQuad',
    });
  };

  return (
    <button
      type="button"
      ref={(el) => {
        el.addEventListener('mouseenter', () => handleMouseEnter(el));
        el.addEventListener('mouseleave', () => handleMouseLeave(el));
      }}
      onClick={props.onClick}
      disabled={props.disabled}
      class={css({
        px: '6',
        py: '3',
        borderRadius: 'md',
        fontWeight: 'medium',
        transition: 'all 0.2s',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.5 : 1,
        bg: props.variant === 'secondary' ? 'gray.200' : 'emerald.500',
        color: props.variant === 'secondary' ? 'gray.800' : 'white',
        _hover: {
          bg: props.variant === 'secondary' ? 'gray.300' : 'emerald.600',
        },
        _active: {
          transform: 'scale(0.98)',
        },
      })}
    >
      {props.children}
    </button>
  );
};
