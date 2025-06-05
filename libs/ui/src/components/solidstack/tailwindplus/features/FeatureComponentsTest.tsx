import { Component, createSignal } from "solid-js";
import { css } from "../../../../styled-system/css";
import FeatureCenteredGrid from "./FeatureCenteredGrid";
import FeatureSplitImage from "./FeatureSplitImage";
import FeatureSimpleList from "./FeatureSimpleList";

export const FeatureComponentsTest: Component = () => {
  const [theme, setTheme] = createSignal<"light" | "dark">("light");

  const testFeatures = [
    {
      id: "test-1",
      name: "Test Feature 1",
      description: "This is a test feature description to verify the component works correctly.",
      icon: "cloud",
      href: "#"
    },
    {
      id: "test-2", 
      name: "Test Feature 2",
      description: "Another test feature with different content for testing purposes.",
      icon: "lock",
      href: "#"
    },
    {
      id: "test-3",
      name: "Test Feature 3", 
      description: "Third test feature to complete the set of test data.",
      icon: "server",
      href: "#"
    }
  ];

  const testImage = {
    src: "https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png",
    alt: "Test Image",
    width: 2432,
    height: 1442
  };

  const testTestimonial = {
    quote: "This is a test testimonial to verify the component rendering works properly.",
    author: "Test Author",
    title: "Test Title",
    avatar: "https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
  };

  const containerStyles = css({
    backgroundColor: theme() === "dark" ? "#0f172a" : "#f8fafc",
    minHeight: "100vh",
    padding: "48px 0",
  });

  const headerStyles = css({
    textAlign: "center",
    padding: "0 24px 48px",
  });

  const titleStyles = css({
    fontSize: "32px",
    fontWeight: "bold",
    color: theme() === "dark" ? "#ffffff" : "#1e293b",
    marginBottom: "16px",
  });

  const toggleStyles = css({
    padding: "8px 16px",
    backgroundColor: "#6366f1",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  });

  const sectionStyles = css({
    marginBottom: "96px",
  });

  return (
    <div class={containerStyles}>
      <div class={headerStyles}>
        <h1 class={titleStyles}>Feature Components Test</h1>
        <button 
          class={toggleStyles} 
          onClick={() => setTheme(theme() === "light" ? "dark" : "light")}
        >
          Toggle Theme ({theme()})
        </button>
      </div>

      <div class={sectionStyles}>
        <FeatureCenteredGrid
          badge="Test Badge"
          title="Test Centered Grid"
          subtitle="This is a test of the FeatureCenteredGrid component"
          features={testFeatures}
          theme={theme()}
          animated={true}
          backgroundPattern="dots"
          iconStyle="solid"
          gridColumns={3}
          showCTA={true}
          ctaText="Test CTA"
          ctaHref="#"
        />
      </div>

      <div class={sectionStyles}>
        <FeatureSplitImage
          badge="Test Split"
          title="Test Split Image"
          subtitle="This is a test of the FeatureSplitImage component"
          features={testFeatures}
          image={testImage}
          imagePosition="right"
          theme={theme()}
          animated={true}
          showCTA={true}
          ctaText="Test Split CTA"
          ctaHref="#"
          testimonial={testTestimonial}
          imageOverlay={true}
          imageBackground="card"
        />
      </div>

      <div class={sectionStyles}>
        <FeatureSimpleList
          badge="Test Simple"
          title="Test Simple List"
          subtitle="This is a test of the FeatureSimpleList component"
          features={testFeatures}
          theme={theme()}
          animated={true}
          layout="three-column"
          showIcons={true}
          iconStyle="check"
          maxWidth="lg"
          alignment="center"
        />
      </div>
    </div>
  );
};

export default FeatureComponentsTest;