import { Component, createSignal } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

// Placeholder Card components
const Card: Component<{
  className?: string;
  children: any;
}> = (props) => {
  return (
    <div class={css({
      borderRadius: 'lg',
      border: '1px solid',
      borderColor: 'gray.200',
      backgroundColor: 'white',
      boxShadow: 'sm',
      _dark: {
        borderColor: 'gray.800',
        backgroundColor: 'gray.900',
      },
    }, props.className)}>
      {props.children}
    </div>
  );
};

const CardHeader: Component<{
  children: any;
}> = (props) => {
  return (
    <div class={css({
      padding: '6',
      paddingBottom: '0',
    })}>
      {props.children}
    </div>
  );
};

const CardContent: Component<{
  children: any;
}> = (props) => {
  return (
    <div class={css({
      padding: '6',
      paddingTop: '0',
    })}>
      {props.children}
    </div>
  );
};

const CardFooter: Component<{
  children: any;
  className?: string;
}> = (props) => {
  return (
    <div class={css({
      display: 'flex',
      alignItems: 'center',
      padding: '6',
      paddingTop: '0',
    }, props.className)}>
      {props.children}
    </div>
  );
};

const CardTitle: Component<{
  children: any;
  className?: string;
}> = (props) => {
  return (
    <h3 class={css({
      fontSize: 'lg',
      fontWeight: 'semibold',
      lineHeight: 'none',
      letterSpacing: 'tight',
      color: 'gray.900',
      _dark: {
        color: 'white',
      },
    }, props.className)}>
      {props.children}
    </h3>
  );
};

const CardDescription: Component<{
  children: any;
}> = (props) => {
  return (
    <p class={css({
      fontSize: 'sm',
      color: 'gray.600',
      _dark: {
        color: 'gray.400',
      },
    })}>
      {props.children}
    </p>
  );
};

// Placeholder Button components
const Button: Component<{
  children: any;
  variant?: 'default' | 'secondary';
}> = (props) => {
  return (
    <button class={css({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'md',
      fontSize: 'sm',
      fontWeight: 'medium',
      transition: 'colors 0.2s',
      paddingX: '4',
      paddingY: '2',
      backgroundColor: props.variant === 'secondary' ? 'gray.100' : 'gray.900',
      color: props.variant === 'secondary' ? 'gray.900' : 'white',
      _hover: {
        backgroundColor: props.variant === 'secondary' ? 'gray.200' : 'gray.800',
      },
      _dark: {
        backgroundColor: props.variant === 'secondary' ? 'gray.800' : 'gray.50',
        color: props.variant === 'secondary' ? 'gray.50' : 'gray.900',
        _hover: {
          backgroundColor: props.variant === 'secondary' ? 'gray.700' : 'gray.200',
        },
      },
    })}>
      {props.children}
    </button>
  );
};

// Placeholder Lens component - this would need to be implemented separately
const Lens: Component<{
  isStatic?: boolean;
  defaultPosition?: { x: number; y: number };
  position?: { x: number; y: number };
  children: any;
}> = (props) => {
  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = createSignal(false);

  const handleMouseMove = (e: MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const lensPosition = props.isStatic 
    ? props.position || { x: 260, y: 150 }
    : props.defaultPosition || mousePosition();

  return (
    <div 
      class={css({
        position: 'relative',
        overflow: 'hidden',
        cursor: 'none',
      })}
      onMouseMove={!props.isStatic ? handleMouseMove : undefined}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {props.children}
      
      {/* Lens effect */}
      {(isHovering() || props.isStatic) && (
        <div 
          class={css({
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: 'full',
            border: '3px solid white',
            boxShadow: '0 0 20px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            overflow: 'hidden',
            zIndex: '10',
          })}
          style={{
            left: `${lensPosition.x}px`,
            top: `${lensPosition.y}px`,
          }}
        >
          {/* Magnified content */}
          <div 
            class={css({
              position: 'absolute',
              width: '200px',
              height: '200px',
              transform: 'scale(2) translate(-25%, -25%)',
              transformOrigin: 'top left',
            })}
            style={{
              left: `${-lensPosition.x}px`,
              top: `${-lensPosition.y}px`,
            }}
          >
            {props.children}
          </div>
        </div>
      )}
    </div>
  );
};

export const LensDemo: Component = () => {
  return (
    <Card className={css({
      position: 'relative',
      maxWidth: 'md',
      boxShadow: 'none',
    })}>
      <CardHeader>
        <Lens isStatic position={{ x: 260, y: 150 }}>
          <img
            src="https://images.unsplash.com/photo-1736606355698-5efdb410fe93?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="image placeholder"
            width={500}
            height={500}
            class={css({
              width: 'full',
              height: 'auto',
              borderRadius: 'lg',
            })}
          />
        </Lens>
      </CardHeader>
      <CardContent>
        <CardTitle className={css({ fontSize: '2xl' })}>Your next camp</CardTitle>
        <CardDescription>
          See our latest and best camp destinations all across the five
          continents of the globe.
        </CardDescription>
      </CardContent>
      <CardFooter className={css({ gap: '4' })}>
        <Button>Let's go</Button>
        <Button variant="secondary">Another time</Button>
      </CardFooter>
    </Card>
  );
};

export const LensDemoInteractive: Component = () => {
  return (
    <Card className={css({
      position: 'relative',
      maxWidth: 'md',
      boxShadow: 'none',
    })}>
      <CardHeader>
        <Lens defaultPosition={{ x: 260, y: 150 }}>
          <img
            src="https://images.unsplash.com/photo-1736606355698-5efdb410fe93?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="image placeholder"
            width={500}
            height={500}
            class={css({
              width: 'full',
              height: 'auto',
              borderRadius: 'lg',
            })}
          />
        </Lens>
      </CardHeader>
      <CardContent>
        <CardTitle className={css({ fontSize: '2xl' })}>Your next camp</CardTitle>
        <CardDescription>
          See our latest and best camp destinations all across the five
          continents of the globe.
        </CardDescription>
      </CardContent>
      <CardFooter className={css({ gap: '4' })}>
        <Button>Let's go</Button>
        <Button variant="secondary">Another time</Button>
      </CardFooter>
    </Card>
  );
};

export default LensDemo;