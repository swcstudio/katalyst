import { css } from '@sse/ui/styled-system/css';
import { type Component, type JSX, children, mergeProps } from 'solid-js';

export interface iPhone15Props {
  children?: JSX.Element;
  className?: string;
  style?: JSX.CSSProperties;
  variant?: 'standard' | 'plus' | 'pro' | 'pro-max';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'portrait' | 'landscape';
  color?:
    | 'black'
    | 'blue'
    | 'green'
    | 'yellow'
    | 'pink'
    | 'natural'
    | 'blue-titanium'
    | 'white-titanium'
    | 'black-titanium';
}

const iPhone15: Component<iPhone15Props> = (props) => {
  const merged = mergeProps(
    {
      variant: 'standard' as const,
      size: 'md' as const,
      orientation: 'portrait' as const,
      color: 'black' as const,
    },
    props
  );

  const resolved = children(() => props.children);

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        width: '180px',
        height: '380px',
        borderRadius: '32px',
      },
      md: {
        width: '240px',
        height: '520px',
        borderRadius: '40px',
      },
      lg: {
        width: '300px',
        height: '650px',
        borderRadius: '48px',
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

  const getColorStyles = () => {
    switch (merged.color) {
      case 'blue':
        return {
          background: 'linear-gradient(145deg, #1e3a8a, #3b82f6)',
          border: '3px solid #1e40af',
        };
      case 'green':
        return {
          background: 'linear-gradient(145deg, #166534, #22c55e)',
          border: '3px solid #15803d',
        };
      case 'yellow':
        return {
          background: 'linear-gradient(145deg, #ca8a04, #eab308)',
          border: '3px solid #d97706',
        };
      case 'pink':
        return {
          background: 'linear-gradient(145deg, #be185d, #ec4899)',
          border: '3px solid #db2777',
        };
      case 'natural':
        return {
          background: 'linear-gradient(145deg, #a8a29e, #d6d3d1)',
          border: '3px solid #a3a3a3',
        };
      case 'blue-titanium':
        return {
          background: 'linear-gradient(145deg, #1e293b, #475569)',
          border: '3px solid #334155',
        };
      case 'white-titanium':
        return {
          background: 'linear-gradient(145deg, #f1f5f9, #e2e8f0)',
          border: '3px solid #cbd5e1',
        };
      case 'black-titanium':
        return {
          background: 'linear-gradient(145deg, #0f172a, #1e293b)',
          border: '3px solid #374151',
        };
      default: // black
        return {
          background: 'linear-gradient(145deg, #1f2937, #374151)',
          border: '3px solid #4b5563',
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const colorStyles = getColorStyles();

  return (
    <div
      class={css(
        {
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          borderRadius: sizeStyles.borderRadius,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        },
        merged.className
      )}
      style={{
        ...sizeStyles,
        ...colorStyles,
        ...merged.style,
      }}
    >
      {/* Action button */}
      <div
        class={css({
          position: 'absolute',
          left: '-3px',
          top: merged.orientation === 'landscape' ? '20%' : '15%',
          width: '3px',
          height: '32px',
          backgroundColor: '#555',
          borderRadius: '2px 0 0 2px',
        })}
      />

      {/* Volume buttons */}
      <div
        class={css({
          position: 'absolute',
          left: '-3px',
          top: merged.orientation === 'landscape' ? '35%' : '25%',
          width: '3px',
          height: '24px',
          backgroundColor: '#555',
          borderRadius: '2px 0 0 2px',
        })}
      />
      <div
        class={css({
          position: 'absolute',
          left: '-3px',
          top: merged.orientation === 'landscape' ? '45%' : '32%',
          width: '3px',
          height: '24px',
          backgroundColor: '#555',
          borderRadius: '2px 0 0 2px',
        })}
      />

      {/* Power button */}
      <div
        class={css({
          position: 'absolute',
          right: '-3px',
          top: merged.orientation === 'landscape' ? '30%' : '25%',
          width: '3px',
          height: '40px',
          backgroundColor: '#555',
          borderRadius: '0 2px 2px 0',
        })}
      />

      {/* Screen */}
      <div
        class={css({
          position: 'relative',
          width: 'calc(100% - 16px)',
          height: 'calc(100% - 16px)',
          backgroundColor: '#000',
          borderRadius: '32px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        })}
      >
        {/* Dynamic Island */}
        <div
          class={css({
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100px',
            height: '28px',
            backgroundColor: '#000',
            borderRadius: '14px',
            zIndex: 20,
            border: '1px solid #333',
          })}
        />

        {/* Status bar */}
        <div
          class={css({
            width: '100%',
            height: '44px',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            paddingTop: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: 'white',
            flexShrink: 0,
          })}
        >
          <div class={css({ marginLeft: '40px' })}>9:41</div>
          <div
            class={css({ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '40px' })}
          >
            <div class={css({ fontSize: '12px' })}>●●●</div>
            <div class={css({ fontSize: '12px' })}>📶</div>
            <div class={css({ fontSize: '12px' })}>🔋</div>
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

        {/* Home indicator */}
        <div
          class={css({
            width: '100%',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          })}
        >
          <div
            class={css({
              width: '134px',
              height: '5px',
              backgroundColor: '#666',
              borderRadius: '2.5px',
            })}
          />
        </div>
      </div>

      {/* Camera bump */}
      <div
        class={css({
          position: 'absolute',
          top: '16px',
          left: '16px',
          width: '40px',
          height: '40px',
          backgroundColor: '#333',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        })}
      >
        <div
          class={css({
            width: '24px',
            height: '24px',
            backgroundColor: '#1a1a1a',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <div
            class={css({
              width: '16px',
              height: '16px',
              backgroundColor: '#000',
              borderRadius: '50%',
              border: '1px solid #444',
            })}
          />
        </div>
      </div>

      {/* USB-C port */}
      <div
        class={css({
          position: 'absolute',
          bottom: '-2px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20px',
          height: '4px',
          backgroundColor: '#333',
          borderRadius: '2px 2px 0 0',
        })}
      />
    </div>
  );
};

export default iPhone15;
