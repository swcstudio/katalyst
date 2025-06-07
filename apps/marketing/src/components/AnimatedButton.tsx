import { createSignal } from 'solid-js';
import { useAnimation } from '../../../../libs/shared/animations';
import { css } from '../styled-system/css';

interface AnimatedButtonProps {
  children: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export default function AnimatedButton(props: AnimatedButtonProps) {
  const [buttonRef, setButtonRef] = createSignal<HTMLButtonElement>();
  
  const hoverAnimation = useAnimation(buttonRef, {
    scale: [1, 1.05],
    duration: 200,
    easing: 'easeOutQuad',
    autoplay: false,
  });

  const clickAnimation = useAnimation(buttonRef, {
    scale: [1, 0.95, 1],
    duration: 150,
    easing: 'easeOutBack',
    autoplay: false,
  });

  const handleMouseEnter = () => {
    hoverAnimation.play();
  };

  const handleMouseLeave = () => {
    hoverAnimation.reverse();
  };

  const handleClick = () => {
    clickAnimation.restart();
    props.onClick?.();
  };

  return (
    <button
      ref={setButtonRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      class={css({
        px: '6',
        py: '3',
        borderRadius: 'lg',
        fontWeight: 'semibold',
        cursor: 'pointer',
        border: 'none',
        transition: 'all 0.2s ease',
        bg: props.variant === 'secondary' ? 'secondary.500' : 'primary.500',
        color: 'white',
        _hover: {
          bg: props.variant === 'secondary' ? 'secondary.600' : 'primary.600',
        },
        _active: {
          transform: 'scale(0.98)',
        },
      })}
    >
      {props.children}
    </button>
  );
}
