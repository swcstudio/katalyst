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

interface DemoCardProps {
  title: string;
  description: string;
  children: any;
}

const DemoCard: Component<DemoCardProps> = (props) => {
  const cardStyles = css({
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    padding: "24px",
    marginBottom: "32px",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
  });

  const titleStyles = css({
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#1f2937",
  });

  const descriptionStyles = css({
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "16px",
  });

  const demoContainerStyles = css({
    position: "relative",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #d1d5db",
  });

  return (
    <div class={cardStyles}>
      <h3 class={titleStyles}>{props.title}</h3>
      <p class={descriptionStyles}>{props.description}</p>
      <div class={demoContainerStyles}>
        {props.children}
      </div>
    </div>
  );
};

export const BackgroundPatternDemos: Component = () => {
  const containerStyles = css({
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  });

  const headerStyles = css({
    textAlign: "center",
    marginBottom: "48px",
  });

  const titleStyles = css({
    fontSize: "32px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "16px",
  });

  const subtitleStyles = css({
    fontSize: "18px",
    color: "#6b7280",
    maxWidth: "600px",
    margin: "0 auto",
  });

  const gridStyles = css({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: "32px",
  });

  const demoHeightStyles = css({
    height: "400px",
    width: "100%",
  });

  const cardContentStyles = css({
    backgroundColor: "#1f2937",
    color: "white",
    padding: "24px",
    borderRadius: "8px",
    width: "320px",
    textAlign: "center",
  });

  return (
    <div class={containerStyles}>
      <div class={headerStyles}>
        <h1 class={titleStyles}>Background Pattern Components</h1>
        <p class={subtitleStyles}>
          A collection of beautiful animated background patterns for SolidStack-UI
        </p>
      </div>

      <div class={gridStyles}>
        <DemoCard
          title="Warp Background"
          description="Dynamic warping background with animated layers and color gradients"
        >
          <div class={demoHeightStyles}>
            <WarpBackground>
              <div class={cardContentStyles}>
                <h4 style={{ "font-size": "18px", "font-weight": "600", "margin-bottom": "8px" }}>
                  Congratulations on Your Promotion!
                </h4>
                <p style={{ "font-size": "14px", opacity: 0.9 }}>
                  Your hard work and dedication have paid off. We're thrilled to see you take this next step in your career.
                </p>
              </div>
            </WarpBackground>
          </div>
        </DemoCard>

        <DemoCard
          title="Flickering Grid"
          description="Animated grid with random flickering squares"
        >
          <div class={demoHeightStyles}>
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
        </DemoCard>

        <DemoCard
          title="Flickering Grid (Rounded)"
          description="Flickering grid with radial mask for circular effect"
        >
          <div class={demoHeightStyles}>
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
        </DemoCard>

        <DemoCard
          title="Animated Grid Pattern"
          description="Grid pattern with animated squares appearing and disappearing"
        >
          <div class={demoHeightStyles}>
            <AnimatedGridPattern
              numSquares={30}
              maxOpacity={0.1}
              duration={3}
              repeatDelay={1}
              className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
            />
          </div>
        </DemoCard>

        <DemoCard
          title="Retro Grid"
          description="80s-style perspective grid with neon colors"
        >
          <div class={demoHeightStyles}>
            <div style={{ position: "relative", display: "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", overflow: "hidden", background: "#0a0a0a" }}>
              <span style={{
                "pointer-events": "none",
                "z-index": 10,
                "white-space": "pre-wrap",
                background: "linear-gradient(to bottom, #ffd319, #ff2975, #8c1eff)",
                "-webkit-background-clip": "text",
                "background-clip": "text",
                "text-align": "center",
                "font-size": "48px",
                "font-weight": "700",
                "line-height": 1,
                "letter-spacing": "-0.05em",
                color: "transparent"
              }}>
                Retro Grid
              </span>
              <RetroGrid />
            </div>
          </div>
        </DemoCard>

        <DemoCard
          title="Ripple Effect"
          description="Animated ripple effect with multiple expanding circles"
        >
          <div class={demoHeightStyles}>
            <div style={{ position: "relative", display: "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", overflow: "hidden", background: "#1f2937" }}>
              <p style={{
                "z-index": 10,
                "white-space": "pre-wrap",
                "text-align": "center",
                "font-size": "36px",
                "font-weight": "500",
                "letter-spacing": "-0.05em",
                color: "white"
              }}>
                Ripple
              </p>
              <Ripple />
            </div>
          </div>
        </DemoCard>

        <DemoCard
          title="Dot Pattern"
          description="Simple dot pattern with radial mask"
        >
          <div class={demoHeightStyles}>
            <DotPattern
              className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
            />
          </div>
        </DemoCard>

        <DemoCard
          title="Dot Pattern (Linear Gradient)"
          description="Dot pattern with linear gradient mask"
        >
          <div class={demoHeightStyles}>
            <DotPattern
              width={20}
              height={20}
              cx={1}
              cy={1}
              cr={1}
              className="[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
            />
          </div>
        </DemoCard>

        <DemoCard
          title="Dot Pattern (Glow Effect)"
          description="Dot pattern with glowing effect"
        >
          <div class={demoHeightStyles}>
            <DotPattern
              glow={true}
              className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
            />
          </div>
        </DemoCard>

        <DemoCard
          title="Grid Pattern"
          description="Grid pattern with highlighted squares"
        >
          <div class={demoHeightStyles}>
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
              ]}
              className="[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
            />
          </div>
        </DemoCard>

        <DemoCard
          title="Grid Pattern (Linear Gradient)"
          description="Grid pattern with linear gradient mask"
        >
          <div class={demoHeightStyles}>
            <GridPattern
              width={20}
              height={20}
              x={-1}
              y={-1}
              className="[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
            />
          </div>
        </DemoCard>

        <DemoCard
          title="Grid Pattern (Dashed)"
          description="Dashed grid pattern with radial mask"
        >
          <div class={demoHeightStyles}>
            <GridPattern
              width={30}
              height={30}
              x={-1}
              y={-1}
              strokeDasharray="4 2"
              className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
            />
          </div>
        </DemoCard>

        <DemoCard
          title="Interactive Grid Pattern"
          description="Grid pattern that responds to mouse hover"
        >
          <div class={demoHeightStyles}>
            <InteractiveGridPattern
              className="[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
            />
          </div>
        </DemoCard>

        <DemoCard
          title="Interactive Grid Pattern (Custom)"
          description="Customizable interactive grid with hover effects"
        >
          <div class={demoHeightStyles}>
            <InteractiveGridPattern
              className="[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
              width={20}
              height={20}
              squares={[80, 80]}
              squaresClassName="hover:fill-blue-500"
            />
          </div>
        </DemoCard>
      </div>
    </div>
  );
};

export default BackgroundPatternDemos;