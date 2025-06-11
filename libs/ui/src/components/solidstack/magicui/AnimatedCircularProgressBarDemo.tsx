import { css } from '@sse/ui/styled-system/css';
import { type Component, createSignal, onCleanup, onMount } from 'solid-js';

// Placeholder AnimatedCircularProgressBar component - this would need to be implemented separately
const AnimatedCircularProgressBar: Component<{
  max: number;
  min: number;
  value: number;
  gaugePrimaryColor: string;
  gaugeSecondaryColor: string;
}> = (props) => {
  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDashoffset = circumference - (props.value / props.max) * circumference;

  return (
    <div
      class={css({
        position: 'relative',
        width: '120px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 100 100"
        class={css({
          transform: 'rotate(-90deg)',
        })}
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={props.gaugeSecondaryColor}
          stroke-width="8"
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={props.gaugePrimaryColor}
          stroke-width="8"
          fill="transparent"
          stroke-dasharray={circumference}
          stroke-dashoffset={strokeDashoffset}
          stroke-linecap="round"
          class={css({
            transition: 'stroke-dashoffset 0.3s ease-in-out',
          })}
        />
      </svg>

      {/* Center text */}
      <div
        class={css({
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'xl',
          fontWeight: 'bold',
          color: 'gray.700',
          _dark: {
            color: 'gray.300',
          },
        })}
      >
        {Math.round(props.value)}%
      </div>
    </div>
  );
};

export const AnimatedCircularProgressBarDemo: Component = () => {
  const [value, setValue] = createSignal(0);
  let intervalId: number;

  const handleIncrement = (prev: number) => {
    if (prev === 100) {
      return 0;
    }
    return prev + 10;
  };

  onMount(() => {
    setValue(handleIncrement);
    intervalId = setInterval(() => {
      setValue((prev) => handleIncrement(prev));
    }, 2000);
  });

  onCleanup(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  return (
    <div
      class={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8',
      })}
    >
      <AnimatedCircularProgressBar
        max={100}
        min={0}
        value={value()}
        gaugePrimaryColor="rgb(79 70 229)"
        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
      />
    </div>
  );
};

export default AnimatedCircularProgressBarDemo;
