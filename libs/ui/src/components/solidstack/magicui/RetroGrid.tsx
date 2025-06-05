import { Component, onMount, createSignal } from "solid-js";
import { css } from "../../styled-system/css";

interface RetroGridProps {
  className?: string;
  angle?: number;
  speed?: number;
  opacity?: number;
  color?: string;
  gridSize?: number;
}

export const RetroGrid: Component<RetroGridProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);

  const angle = () => props.angle ?? 65;
  const speed = () => props.speed ?? 5;
  const opacity = () => props.opacity ?? 0.5;
  const color = () => props.color ?? "#00ffff";
  const gridSize = () => props.gridSize ?? 50;

  onMount(() => {
    setMounted(true);
  });

  const retroGridStyles = css({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    overflow: "hidden",
  });

  const gridContainerStyles = css({
    position: "absolute",
    bottom: 0,
    left: "50%",
    width: "200%",
    height: "200%",
    transform: `translateX(-50%) rotateX(${angle()}deg)`,
    transformOrigin: "bottom center",
    perspective: "1000px",
  });

  const gridStyles = css({
    width: "100%",
    height: "100%",
    backgroundImage: `
      linear-gradient(to right, ${color()} 1px, transparent 1px),
      linear-gradient(to bottom, ${color()} 1px, transparent 1px)
    `,
    backgroundSize: `${gridSize()}px ${gridSize()}px`,
    opacity: opacity(),
    animation: `retroGridMove ${20 / speed()}s linear infinite`,
  });

  return (
    <div class={`${retroGridStyles} ${props.className || ""}`}>
      <style>{`
        @keyframes retroGridMove {
          0% {
            transform: translateY(0) translateZ(0);
          }
          100% {
            transform: translateY(${gridSize()}px) translateZ(0);
          }
        }

        .retro-grid-glow {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(
            to top,
            ${color()}22 0%,
            ${color()}11 25%,
            transparent 50%
          );
          pointer-events: none;
        }

        .retro-grid-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            transparent 40%,
            rgba(0, 0, 0, 0.1) 60%,
            rgba(0, 0, 0, 0.3) 80%,
            rgba(0, 0, 0, 0.5) 100%
          );
          pointer-events: none;
        }
      `}</style>
      
      {mounted() && (
        <>
          <div class={gridContainerStyles}>
            <div class={gridStyles} />
          </div>
          <div class="retro-grid-glow" />
          <div class="retro-grid-fade" />
        </>
      )}
    </div>
  );
};

export default RetroGrid;