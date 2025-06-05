import { Component } from "solid-js";
import { css } from "../../styled-system/css";
import { 
  ExampleComponentDemo,
  FlickeringGridDemo,
  FlickeringGridRoundedDemo,
  AnimatedGridPatternDemo,
  RetroGridDemo,
  RippleDemo,
  DotPatternDemo,
  DotPatternLinearGradient,
  DotPatternWithGlowEffectDemo,
  GridPatternDemo,
  GridPatternLinearGradient,
  GridPatternDashed,
  InteractiveGridPatternDemo,
  InteractiveGridPatternCustomDemo
} from './PatternDemoComponents';

interface ShowcaseCardProps {
  title: string;
  description: string;
  component: any;
  height?: string;
}

const ShowcaseCard: Component<ShowcaseCardProps> = (props) => {
  const cardStyles = css({
    backgroundColor: "white",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    padding: "24px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    transition: "all 0.3s ease",
    _hover: {
      transform: "translateY(-4px)",
      boxShadow: "0 10px 25px -3px rgb(0 0 0 / 0.1)",
    },
  });

  const headerStyles = css({
    marginBottom: "16px",
  });

  const titleStyles = css({
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "8px",
  });

  const descriptionStyles = css({
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.5",
  });

  const demoContainerStyles = css({
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #d1d5db",
    backgroundColor: "#f9fafb",
    height: props.height || "300px",
    position: "relative",
  });

  return (
    <div class={cardStyles}>
      <div class={headerStyles}>
        <h3 class={titleStyles}>{props.title}</h3>
        <p class={descriptionStyles}>{props.description}</p>
      </div>
      <div class={demoContainerStyles}>
        {props.component}
      </div>
    </div>
  );
};

export const PatternComponentsShowcase: Component = () => {
  const containerStyles = css({
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "48px 24px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  });

  const headerStyles = css({
    textAlign: "center",
    marginBottom: "64px",
  });

  const titleStyles = css({
    fontSize: "42px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    backgroundClip: "text",
    color: "transparent",
    marginBottom: "16px",
    letterSpacing: "-0.02em",
  });

  const subtitleStyles = css({
    fontSize: "20px",
    color: "#64748b",
    maxWidth: "720px",
    margin: "0 auto",
    lineHeight: "1.6",
  });

  const badgeStyles = css({
    display: "inline-block",
    backgroundColor: "#ddd6fe",
    color: "#7c3aed",
    fontSize: "14px",
    fontWeight: "600",
    padding: "6px 16px",
    borderRadius: "20px",
    marginBottom: "24px",
  });

  const gridStyles = css({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))",
    gap: "32px",
    marginBottom: "48px",
  });

  const sectionTitleStyles = css({
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "32px",
    textAlign: "center",
    position: "relative",
    _after: {
      content: '""',
      position: "absolute",
      bottom: "-8px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "80px",
      height: "3px",
      background: "linear-gradient(90deg, #667eea, #764ba2)",
      borderRadius: "2px",
    },
  });

  const statsStyles = css({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "24px",
    marginBottom: "48px",
    padding: "32px",
    backgroundColor: "white",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  });

  const statItemStyles = css({
    textAlign: "center",
  });

  const statNumberStyles = css({
    fontSize: "32px",
    fontWeight: "800",
    color: "#7c3aed",
    marginBottom: "8px",
  });

  const statLabelStyles = css({
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "500",
  });

  return (
    <div class={containerStyles}>
      <div class={headerStyles}>
        <div class={badgeStyles}>SolidStack UI - Pattern Collection</div>
        <h1 class={titleStyles}>Background Pattern Components</h1>
        <p class={subtitleStyles}>
          Beautiful, performant, and customizable background patterns built with SolidJS. 
          Create stunning visual experiences with animated grids, particles, and interactive effects.
        </p>
      </div>

      <div class={statsStyles}>
        <div class={statItemStyles}>
          <div class={statNumberStyles}>14+</div>
          <div class={statLabelStyles}>Pattern Variants</div>
        </div>
        <div class={statItemStyles}>
          <div class={statNumberStyles}>8</div>
          <div class={statLabelStyles}>Core Components</div>
        </div>
        <div class={statItemStyles}>
          <div class={statNumberStyles}>100%</div>
          <div class={statLabelStyles}>TypeScript</div>
        </div>
        <div class={statItemStyles}>
          <div class={statNumberStyles}>0</div>
          <div class={statLabelStyles}>Dependencies</div>
        </div>
      </div>

      <h2 class={sectionTitleStyles}>Dynamic Background Patterns</h2>
      <div class={gridStyles}>
        <ShowcaseCard
          title="Warp Background"
          description="Multi-layered animated background with warping effects and gradient colors. Perfect for hero sections and feature cards."
          component={<ExampleComponentDemo />}
          height="400px"
        />

        <ShowcaseCard
          title="Retro Grid"
          description="80s-inspired perspective grid with neon glow effects. Ideal for sci-fi and retro-themed interfaces."
          component={<RetroGridDemo />}
          height="400px"
        />

        <ShowcaseCard
          title="Ripple Effect"
          description="Elegant concentric ripple animations with customizable colors and timing. Great for call-to-action sections."
          component={<RippleDemo />}
          height="400px"
        />
      </div>

      <h2 class={sectionTitleStyles}>Grid Pattern Variations</h2>
      <div class={gridStyles}>
        <ShowcaseCard
          title="Flickering Grid"
          description="Animated grid with randomly flickering squares. Creates subtle movement and visual interest."
          component={<FlickeringGridDemo />}
        />

        <ShowcaseCard
          title="Flickering Grid (Rounded)"
          description="Circular masked flickering grid with smooth radial fade. Perfect for spotlight effects."
          component={<FlickeringGridRoundedDemo />}
        />

        <ShowcaseCard
          title="Animated Grid Pattern"
          description="SVG-based grid with animated square appearances. Lightweight and highly customizable."
          component={<AnimatedGridPatternDemo />}
        />

        <ShowcaseCard
          title="Interactive Grid"
          description="Mouse-responsive grid pattern with hover effects. Engages users with interactive feedback."
          component={<InteractiveGridPatternDemo />}
        />

        <ShowcaseCard
          title="Interactive Grid (Custom)"
          description="Customizable interactive grid with configurable dimensions and hover states."
          component={<InteractiveGridPatternCustomDemo />}
        />
      </div>

      <h2 class={sectionTitleStyles}>Dot & Line Patterns</h2>
      <div class={gridStyles}>
        <ShowcaseCard
          title="Dot Pattern"
          description="Clean dot pattern with radial masking. Minimal and elegant background decoration."
          component={<DotPatternDemo />}
        />

        <ShowcaseCard
          title="Dot Pattern (Linear)"
          description="Linear gradient masked dot pattern. Creates directional visual flow."
          component={<DotPatternLinearGradient />}
        />

        <ShowcaseCard
          title="Dot Pattern (Glow)"
          description="Glowing dot pattern with blur effects. Adds atmospheric lighting to designs."
          component={<DotPatternWithGlowEffectDemo />}
        />

        <ShowcaseCard
          title="Grid Pattern"
          description="Traditional grid pattern with highlighted cells. Shows structured layout foundation."
          component={<GridPatternDemo />}
        />

        <ShowcaseCard
          title="Grid Pattern (Linear)"
          description="Linear gradient masked grid for directional emphasis and visual hierarchy."
          component={<GridPatternLinearGradient />}
        />

        <ShowcaseCard
          title="Grid Pattern (Dashed)"
          description="Dashed line grid pattern. Provides subtle structure without overwhelming content."
          component={<GridPatternDashed />}
        />
      </div>

      <div style={{
        "text-align": "center",
        "margin-top": "64px",
        padding: "32px",
        "background-color": "white",
        "border-radius": "16px",
        border: "1px solid #e5e7eb",
        "box-shadow": "0 4px 6px -1px rgb(0 0 0 / 0.1)"
      }}>
        <h3 style={{
          "font-size": "24px",
          "font-weight": "700",
          color: "#1e293b",
          "margin-bottom": "16px"
        }}>
          Ready to enhance your UI?
        </h3>
        <p style={{
          "font-size": "16px",
          color: "#64748b",
          "margin-bottom": "24px",
          "max-width": "600px",
          margin: "0 auto 24px"
        }}>
          All components are fully customizable, TypeScript-ready, and optimized for performance. 
          Easy to integrate into any SolidJS project.
        </p>
        <div style={{
          display: "flex",
          gap: "16px",
          "justify-content": "center",
          "flex-wrap": "wrap"
        }}>
          <div style={{
            padding: "8px 16px",
            "background-color": "#f0f9ff",
            color: "#0369a1",
            "border-radius": "8px",
            "font-size": "14px",
            "font-weight": "500"
          }}>
            ✨ Zero Dependencies
          </div>
          <div style={{
            padding: "8px 16px",
            "background-color": "#f0fdf4",
            color: "#15803d",
            "border-radius": "8px",
            "font-size": "14px",
            "font-weight": "500"
          }}>
            🚀 Performance Optimized
          </div>
          <div style={{
            padding: "8px 16px",
            "background-color": "#fefce8",
            color: "#a16207",
            "border-radius": "8px",
            "font-size": "14px",
            "font-weight": "500"
          }}>
            🎨 Fully Customizable
          </div>
          <div style={{
            padding: "8px 16px",
            "background-color": "#fdf2f8",
            color: "#be185d",
            "border-radius": "8px",
            "font-size": "14px",
            "font-weight": "500"
          }}>
            📱 Responsive Ready
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternComponentsShowcase;