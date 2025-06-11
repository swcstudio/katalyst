import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  type JSX,
  children,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
  splitProps,
} from 'solid-js';

export interface CardContainerProps {
  children?: JSX.Element;
  className?: string;
  containerClassName?: string;
}

export interface CardBodyProps {
  children?: JSX.Element;
  className?: string;
}

export interface CardItemProps {
  children?: JSX.Element;
  className?: string;
  translateZ?: string | number;
  rotateX?: string | number;
  rotateY?: string | number;
  rotateZ?: string | number;
  as?: keyof JSX.IntrinsicElements;
}

export const CardContainer: Component<CardContainerProps> = (props) => {
  const merged = mergeProps({}, props);
  const [isMouseEntered, setIsMouseEntered] = createSignal(false);
  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });
  let containerRef: HTMLDivElement;

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef) return;
    const { left, top, width, height } = containerRef.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    setIsMouseEntered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const resolved = children(() => props.children);

  return (
    <div
      ref={containerRef!}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      class={css(
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          perspective: '1000px',
        },
        merged.className
      )}
      style={{
        transform: isMouseEntered()
          ? `rotateY(${mousePosition().x}deg) rotateX(${-mousePosition().y}deg)`
          : 'rotateY(0deg) rotateX(0deg)',
        transition: 'transform 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)',
      }}
    >
      {resolved()}
    </div>
  );
};

export const CardBody: Component<CardBodyProps> = (props) => {
  const merged = mergeProps({}, props);
  const resolved = children(() => props.children);

  return (
    <div
      class={css(
        {
          backgroundColor: 'gray.50',
          position: 'relative',
          width: 'auto',
          height: 'auto',
          borderRadius: 'xl',
          padding: '6',
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          transform: 'translateZ(0)',
          _dark: {
            backgroundColor: 'black',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            _hover: {
              boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.1)',
            },
          },
          _sm: {
            width: '30rem',
          },
        },
        merged.className
      )}
    >
      {resolved()}
    </div>
  );
};

export const CardItem: Component<CardItemProps> = (props) => {
  const [local, others] = splitProps(props, [
    'translateZ',
    'rotateX',
    'rotateY',
    'rotateZ',
    'className',
    'as',
    'children',
  ]);
  const merged = mergeProps({ as: 'div' as const }, local);
  const Dynamic = merged.as as any;
  const resolved = children(() => props.children);

  const getTransform = () => {
    const transforms = [];

    if (merged.translateZ) {
      transforms.push(`translateZ(${merged.translateZ}px)`);
    }
    if (merged.rotateX) {
      transforms.push(`rotateX(${merged.rotateX}deg)`);
    }
    if (merged.rotateY) {
      transforms.push(`rotateY(${merged.rotateY}deg)`);
    }
    if (merged.rotateZ) {
      transforms.push(`rotateZ(${merged.rotateZ}deg)`);
    }

    return transforms.length > 0 ? transforms.join(' ') : 'none';
  };

  return (
    <Dynamic
      class={css(
        {
          width: 'fit-content',
          position: 'relative',
          transformStyle: 'preserve-3d',
        },
        merged.className
      )}
      style={{
        transform: getTransform(),
        transition: 'transform 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)',
      }}
      {...others}
    >
      {resolved()}
    </Dynamic>
  );
};

export interface ThreeDCardDemoProps {
  className?: string;
}

export const ThreeDCardDemo: Component<ThreeDCardDemoProps> = (props) => {
  return (
    <CardContainer className={css({ fontFamily: 'Inter, sans-serif' }, props.className)}>
      <CardBody
        class={css({
          backgroundColor: 'gray.50',
          position: 'relative',
          width: 'auto',
          height: 'auto',
          borderRadius: 'xl',
          padding: '6',
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          _dark: {
            backgroundColor: 'black',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            _hover: {
              boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.1)',
            },
          },
          _sm: {
            width: '30rem',
          },
        })}
      >
        <CardItem
          translateZ="50"
          class={css({
            fontSize: 'xl',
            fontWeight: 'bold',
            color: 'neutral.600',
            _dark: { color: 'white' },
          })}
        >
          Make things float in air
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          class={css({
            color: 'neutral.500',
            fontSize: 'sm',
            maxWidth: 'sm',
            marginTop: '2',
            _dark: { color: 'neutral.300' },
          })}
        >
          Hover over this card to unleash the power of CSS perspective
        </CardItem>
        <CardItem translateZ="100" class={css({ width: 'full', marginTop: '4' })}>
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            height="1000"
            width="1000"
            class={css({
              height: '60',
              width: 'full',
              objectFit: 'cover',
              borderRadius: 'xl',
              _groupHover: {
                boxShadow: 'xl',
              },
            })}
            alt="thumbnail"
          />
        </CardItem>
        <div
          class={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20',
          })}
        >
          <CardItem
            translateZ={20}
            as="a"
            href="https://twitter.com/mannupaaji"
            target="_blank"
            class={css({
              paddingX: '4',
              paddingY: '2',
              borderRadius: 'xl',
              fontSize: 'xs',
              fontWeight: 'normal',
              _dark: { color: 'white' },
            })}
          >
            Try now →
          </CardItem>
          <CardItem
            translateZ={20}
            as="button"
            class={css({
              paddingX: '4',
              paddingY: '2',
              borderRadius: 'xl',
              backgroundColor: 'black',
              color: 'white',
              fontSize: 'xs',
              fontWeight: 'bold',
              _dark: {
                backgroundColor: 'white',
                color: 'black',
              },
            })}
          >
            Sign up
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
};

export default ThreeDCardDemo;
