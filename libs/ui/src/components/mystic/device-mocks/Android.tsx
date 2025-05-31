import { Component, JSX, mergeProps, children } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

export interface AndroidProps {
  children?: JSX.Element;
  className?: string;
  style?: JSX.CSSProperties;
  variant?: 'pixel' | 'galaxy' | 'oneplus';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'portrait' | 'landscape';
}

const Android: Component<AndroidProps> = (props) => {
  const merged = mergeProps(
    {
      variant: 'pixel' as const,
      size: 'md' as const,
      orientation: 'portrait' as const,
    },
    props
  );

  const resolved = children(() => props.children);

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        width: '200px',
        height: '400px',
        borderRadius: '24px',
      },
      md: {
        width: '280px',
        height: '560px',
        borderRadius: '32px',
      },
      lg: {
        width: '320px',
        height: '640px',
        borderRadius: '40px',
      },
    };

    const size = sizes[merged.size];
    
    if (merged.orientation === 'landscape') {
      return {
        width: size.height,
        height: size.width,
        borderRadius: size.borderRadius,
      };
    }
    
    return size;
  };

  const getVariantStyles = () => {
    switch (merged.variant) {
      case 'galaxy':
        return {
          background: 'linear-gradient(145deg, #1a1a1a, #2d2d2d)',
          border: '3px solid #333',
        };
      case 'oneplus':
        return {
          background: 'linear-gradient(145deg, #0f0f0f, #1a1a1a)',
          border: '2px solid #ff6b6b',
        };
      default: // pixel
        return {
          background: 'linear-gradient(145deg, #2d2d2d, #404040)',
          border: '2px solid #666',
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        borderRadius: sizeStyles.borderRadius,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        _before: {
          content: '""',
          position: 'absolute',
          top: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: merged.orientation === 'landscape' ? '8px' : '40px',
          height: merged.orientation === 'landscape' ? '40px' : '4px',
          backgroundColor: '#666',
          borderRadius: '2px',
          zIndex: 10,
        },
        _after: {
          content: '""',
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '32px',
          height: '4px',
          backgroundColor: '#666',
          borderRadius: '2px',
          zIndex: 10,
        },
      }, merged.className)}
      style={{
        ...sizeStyles,
        ...variantStyles,
        ...merged.style,
      }}
    >
      {/* Power button */}
      <div
        class={css({
          position: 'absolute',
          right: '-3px',
          top: merged.orientation === 'landscape' ? '20%' : '15%',
          width: '3px',
          height: '40px',
          backgroundColor: '#444',
          borderRadius: '0 2px 2px 0',
        })}
      />
      
      {/* Volume buttons */}
      <div
        class={css({
          position: 'absolute',
          right: '-3px',
          top: merged.orientation === 'landscape' ? '35%' : '25%',
          width: '3px',
          height: '24px',
          backgroundColor: '#444',
          borderRadius: '0 2px 2px 0',
        })}
      />
      <div
        class={css({
          position: 'absolute',
          right: '-3px',
          top: merged.orientation === 'landscape' ? '45%' : '32%',
          width: '3px',
          height: '24px',
          backgroundColor: '#444',
          borderRadius: '0 2px 2px 0',
        })}
      />

      {/* Screen */}
      <div
        class={css({
          position: 'relative',
          width: 'calc(100% - 24px)',
          height: 'calc(100% - 24px)',
          backgroundColor: '#000',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        })}
      >
        {/* Status bar */}
        <div
          class={css({
            width: '100%',
            height: '24px',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            fontSize: '10px',
            color: 'white',
            flexShrink: 0,
          })}
        >
          <div class={css({ display: 'flex', alignItems: 'center', gap: '4px' })}>
            <div>9:41</div>
          </div>
          <div class={css({ display: 'flex', alignItems: 'center', gap: '2px' })}>
            <div>📶</div>
            <div>📶</div>
            <div>🔋</div>
          </div>
        </div>

        {/* Content area */}
        <div
          class={css({
            flex: 1,
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
          })}
        >
          {resolved()}
        </div>

        {/* Navigation bar */}
        <div
          class={css({
            width: '100%',
            height: '48px',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          })}
        >
          <div
            class={css({
              width: '48px',
              height: '4px',
              backgroundColor: '#666',
              borderRadius: '2px',
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default Android;