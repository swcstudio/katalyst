import { Component } from "solid-js";
import { css } from "../../styled-system/css";
import { WarpBackground } from "./WarpBackground";
import { FlickeringGrid } from "./FlickeringGrid";
import { AnimatedGridPattern } from "./AnimatedGridPattern";
import { RetroGrid } from "./RetroGrid";
import { Ripple } from "./Ripple";
import { DotPattern } from "./DotPattern";
import { GridPattern } from "./GridPattern";
import { InteractiveGridPattern } from "./InteractiveGridPattern";

// Warp Background Demo
export const ExampleComponentDemo: Component = () => {
  const cardStyles = css({
    width: "20rem",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
  });

  const cardContentStyles = css({
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "1rem",
  });

  const cardTitleStyles = css({
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1f2937",
  });

  const cardDescriptionStyles = css({
    fontSize: "0.875rem",
    color: "#6b7280",
  });

  return (
    <WarpBackground>
      <div class={cardStyles}>
        <div class={cardContentStyles}>
          <h3 class={cardTitleStyles}>Congratulations on Your Promotion!</h3>
          <p class={cardDescriptionStyles}>
            Your hard work and dedication have paid off. We're thrilled to
            see you take this next step in your career. Keep up the fantastic
            work!
          </p>
        </div>
      </div>
    </WarpBackground>
  );
};

// Flickering Grid Demo
export const FlickeringGridDemo: Component = () => {
  const containerStyles = css({
    position: "relative",
    height: "500px",
    width: "100%",
    overflow: "hidden",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  });

  return (
    <div class={containerStyles}>
      <FlickeringGrid
        className="absolute inset-0 z-0 size-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={800}
        width={800}
      />
    </div>
  );
};

// Flickering Grid Rounded Demo
export const FlickeringGridRoundedDemo: Component = () => {
  const containerStyles = css({
    position: "relative",
    height: "600px",
    width: "600px",
    overflow: "hidden",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  });

  return (
    <div class={containerStyles}>
      <FlickeringGrid
        className="relative inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
        squareSize={4}
        gridGap={6}
        color="#60A5FA"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={800}
        width={800}
      />
    </div>
  );
};

// Animated Grid Pattern Demo
export const AnimatedGridPatternDemo: Component = () => {
  const containerStyles = css({
    position: "relative",
    display: "flex",
    height: "500px",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    padding: "5rem",
  });

  return (
    <div class={containerStyles}>
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
      />
    </div>
  );
};

// Retro Grid Demo
export const RetroGridDemo: Component = () => {
  const containerStyles = css({
    position: "relative",
    display: "flex",
    height: "500px",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    backgroundColor: "#000000",
  });

  const titleStyles = css({
    pointerEvents: "none",
    zIndex: 10,
    whiteSpace: "pre-wrap",
    background: "linear-gradient(to bottom, #ffd319, #ff2975, #8c1eff)",
    backgroundClip: "text",
    textAlign: "center",
    fontSize: "3.5rem",
    fontWeight: "700",
    lineHeight: 1,
    letterSpacing: "-0.05em",
    color: "transparent",
  });

  return (
    <div class={containerStyles}>
      <span class={titleStyles}>
        Retro Grid
      </span>
      <RetroGrid />
    </div>
  );
};

// Ripple Demo
export const RippleDemo: Component = () => {
  const containerStyles = css({
    position: "relative",
    display: "flex",
    height: "500px",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    backgroundColor: "#000000",
  });

  const titleStyles = css({
    zIndex: 10,
    whiteSpace: "pre-wrap",
    textAlign: "center",
    fontSize: "3rem",
    fontWeight: "500",
    letterSpacing: "-0.05em",
    color: "white",
  });

  return (
    <div class={containerStyles}>
      <p class={titleStyles}>
        Ripple
      </p>
      <Ripple />
    </div>
  );
};

// Dot Pattern Demo
export const DotPatternDemo: Component = () => {
  const containerStyles = css({
    position: "relative",
    display: "flex",
    height: "500px",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  });

  return (
    <div class={containerStyles}>
      <DotPattern
        className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
      />
    </div>
  );
};

// Dot Pattern Linear Gradient Demo
export const DotPatternLinearGradient: Component = () => {
  const containerStyles = css({
    position: "relative",
    display: "flex",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    padding: "5rem",
  });

  return (
    <div class={containerStyles}>
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className="[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
      />
    </div>
  );
};

// Dot Pattern With Glow Effect Demo
export const DotPatternWithGlowEffectDemo: Component = () => {
  const containerStyles = css({
    position: "relative",
    display: "flex",
    height: "500px",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  });

  return (
    <div class={containerStyles}>
      <DotPattern
        glow={true}
        className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
      />
    </div>
  );
};

// Grid Pattern Demo
export const GridPatternDemo: Component = () => {
  const containerStyles = css({
    position: "relative",
    display: "flex",
    height: "500px",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  });

  return (
    <div class={containerStyles}>
      <GridPattern
        squares={[
          [4, 4],
          [5, 1],
          [8, 2],
          [5, 3],
          [5, 5],
          [10, 10],
          [12, 15],
          [15, 10],
          [10, 15],
          [15, 10],
          [10, 15],
          [15, 10],
        ]}
        className="[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
      />
    </div>
  );
};

// Grid Pattern Linear Gradient Demo
export const GridPatternLinearGradient: Component = () => {
  const containerStyles = css({
    position: "relative",
    display: "flex",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    padding: "5rem",
  });

  return (
    <div class={containerStyles}>
      <GridPattern
        width={20}
        height={20}
        x={-1}
        y={-1}
        className="[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
      />
    </div>
  );
};

// Grid Pattern Dashed Demo
export const GridPatternDashed: Component = () => {
  const containerStyles = css({
    position: "relative",
    display: "flex",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    padding: "5rem",
  });

  return (
    <div class={containerStyles}>
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray="4 2"
        className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
      />
    </div>
  );
};

// Interactive Grid Pattern Demo
export const InteractiveGridPatternDemo: Component = () => {
  const containerStyles = css({
    position: "relative",
    display: "flex",
    height: "500px",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  });

  return (
    <div class={containerStyles}>
      <InteractiveGridPattern
        className="[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
      />
    </div>
  );
};

// Interactive Grid Pattern Custom Demo
export const InteractiveGridPatternCustomDemo: Component = () => {
  const containerStyles = css({
    position: "relative",
    display: "flex",
    height: "500px",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  });

  return (
    <div class={containerStyles}>
      <InteractiveGridPattern
        className="[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
        width={20}
        height={20}
        squares={[80, 80]}
        squaresClassName="hover:fill-blue-500"
      />
    </div>
  );
};