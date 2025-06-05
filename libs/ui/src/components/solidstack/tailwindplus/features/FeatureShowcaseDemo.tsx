import { Component, createSignal } from "solid-js";
import { css } from "../../../../styled-system/css";
import FeatureCenteredGrid from "./FeatureCenteredGrid";
import FeatureSplitImage from "./FeatureSplitImage";
import FeatureSimpleList from "./FeatureSimpleList";

export const FeatureShowcaseDemo: Component = () => {
  const [currentTheme, setCurrentTheme] = createSignal<"light" | "dark">("light");

  const toggleTheme = () => {
    setCurrentTheme(currentTheme() === "light" ? "dark" : "light");
  };

  const handleFeatureClick = (feature: any) => {
    console.log("Feature clicked:", feature);
  };

  const sampleFeatures = [
    {
      id: "push-deploy",
      name: "Push to deploy",
      description: "Commodo nec sagittis tortor mauris sed. Turpis tortor quis scelerisque diam id accumsan nullam tempus. Pulvinar etiam lacus volutpat eu.",
      href: "#",
      icon: "cloud"
    },
    {
      id: "ssl-certs",
      name: "SSL certificates",
      description: "Pellentesque enim a commodo malesuada turpis eleifend risus. Facilisis donec placerat sapien consequat tempor fermentum nibh.",
      href: "#",
      icon: "lock"
    },
    {
      id: "simple-queues",
      name: "Simple queues",
      description: "Pellentesque sit elit congue ante nec amet. Dolor aenean curabitur viverra suspendisse iaculis eget. Nec mollis placerat ultricies euismod.",
      href: "#",
      icon: "arrow-path"
    }
  ];

  const advancedFeatures = [
    {
      id: "advanced-security",
      name: "Advanced security",
      description: "Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.",
      icon: "fingerprint"
    },
    {
      id: "powerful-api",
      name: "Powerful API",
      description: "Laudantium tempora sint ut consectetur ratione. Ut illum ut rem numquam fuga delectus.",
      icon: "cog"
    },
    {
      id: "database-backups",
      name: "Database backups",
      description: "Culpa dolorem voluptatem velit autem rerum qui et corrupti. Quibusdam quo placeat.",
      icon: "server"
    }
  ];

  const allInOneFeatures = [
    {
      id: "invite-team",
      name: "Invite team members",
      description: "Rerum repellat labore necessitatibus reprehenderit molestiae praesentium."
    },
    {
      id: "list-view",
      name: "List view",
      description: "Corporis asperiores ea nulla temporibus asperiores non tempore assumenda aut."
    },
    {
      id: "keyboard-shortcuts",
      name: "Keyboard shortcuts",
      description: "In sit qui aliquid deleniti et. Ad nobis sunt omnis. Quo sapiente dicta laboriosam."
    },
    {
      id: "calendars",
      name: "Calendars",
      description: "Sed rerum sunt dignissimos ullam. Iusto iure occaecati voluptate eligendi."
    },
    {
      id: "notifications",
      name: "Notifications",
      description: "Quos inventore harum enim nesciunt. Aut repellat rerum omnis adipisci."
    },
    {
      id: "boards",
      name: "Boards",
      description: "Quae sit sunt excepturi fugit veniam voluptatem ipsum commodi."
    }
  ];

  const sampleTestimonial = {
    quote: "Vel ultricies morbi odio facilisi ultrices accumsan donec lacus purus. Lectus nibh ullamcorper ac dictum justo in euismod. Risus aenean ut elit massa. In amet aliquet eget cras. Sem volutpat enim tristique.",
    author: "Maria Hill",
    title: "Marketing Manager",
    avatar: "https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
  };

  const sampleImage = {
    src: "https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png",
    alt: "Product screenshot",
    width: 2432,
    height: 1442
  };

  const showcaseStyles = css({
    backgroundColor: currentTheme() === "dark" ? "#0f172a" : "#f8fafc",
    minHeight: "100vh",
    transition: "background-color 0.3s ease",
  });

  const headerStyles = css({
    padding: "48px 24px",
    textAlign: "center",
    backgroundColor: currentTheme() === "dark" ? "#1e293b" : "#ffffff",
    borderBottom: currentTheme() === "dark" ? "1px solid #334155" : "1px solid #e2e8f0",
  });

  const titleStyles = css({
    fontSize: "32px",
    fontWeight: "bold",
    color: currentTheme() === "dark" ? "#ffffff" : "#1e293b",
    marginBottom: "16px",
  });

  const subtitleStyles = css({
    fontSize: "18px",
    color: currentTheme() === "dark" ? "#94a3b8" : "#64748b",
    marginBottom: "32px",
  });

  const themeToggleStyles = css({
    padding: "8px 16px",
    backgroundColor: currentTheme() === "dark" ? "#6366f1" : "#6366f1",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: currentTheme() === "dark" ? "#5b5bd6" : "#5b5bd6",
      transform: "translateY(-1px)",
    },
  });

  const sectionStyles = css({
    marginBottom: "96px",
  });

  const sectionHeaderStyles = css({
    padding: "0 24px",
    marginBottom: "48px",
    textAlign: "center",
  });

  const sectionTitleStyles = css({
    fontSize: "24px",
    fontWeight: "600",
    color: currentTheme() === "dark" ? "#ffffff" : "#1e293b",
    marginBottom: "8px",
  });

  const sectionDescStyles = css({
    fontSize: "16px",
    color: currentTheme() === "dark" ? "#94a3b8" : "#64748b",
  });

  return (
    <div class={showcaseStyles}>
      <div class={headerStyles}>
        <h1 class={titleStyles}>SolidStack UI Feature Components</h1>
        <p class={subtitleStyles}>
          Beautiful, animated feature sections built with Zag.js state machines, SolidJS, and Magic UI animations
        </p>
        <button class={themeToggleStyles} onClick={toggleTheme}>
          Switch to {currentTheme() === "light" ? "Dark" : "Light"} Theme
        </button>
      </div>

      {/* Centered Grid Features */}
      <div class={sectionStyles}>
        <div class={sectionHeaderStyles}>
          <h2 class={sectionTitleStyles}>Centered Grid Layout</h2>
          <p class={sectionDescStyles}>Perfect for showcasing key features with icons and descriptions</p>
        </div>
        
        <FeatureCenteredGrid
          badge="Deploy faster"
          title="Everything you need to deploy your app"
          subtitle="Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum pulvinar et feugiat blandit at. In mi viverra elit nunc."
          features={sampleFeatures}
          theme={currentTheme()}
          animated={true}
          backgroundPattern="dots"
          iconStyle="solid"
          gridColumns={3}
          showCTA={true}
          ctaText="Get Started"
          ctaHref="#"
          onFeatureClick={handleFeatureClick}
        />
      </div>

      {/* Gradient Icons Variant */}
      <div class={sectionStyles}>
        <div class={sectionHeaderStyles}>
          <h2 class={sectionTitleStyles}>Gradient Icons & Warp Background</h2>
          <p class={sectionDescStyles}>Enhanced with gradient icons and animated warp background</p>
        </div>
        
        <FeatureCenteredGrid
          badge="Everything you need"
          title="No server? No problem."
          subtitle="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis."
          features={advancedFeatures}
          theme={currentTheme()}
          animated={true}
          backgroundPattern="warp"
          iconStyle="gradient"
          gridColumns={3}
          showCTA={false}
          onFeatureClick={handleFeatureClick}
        />
      </div>

      {/* Split Image Layout */}
      <div class={sectionStyles}>
        <div class={sectionHeaderStyles}>
          <h2 class={sectionTitleStyles}>Split Image Layout</h2>
          <p class={sectionDescStyles}>Content and image side by side with testimonial support</p>
        </div>
        
        <FeatureSplitImage
          badge="Deploy faster"
          title="A better workflow"
          subtitle="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione."
          features={sampleFeatures}
          image={sampleImage}
          imagePosition="right"
          theme={currentTheme()}
          animated={true}
          backgroundPattern="none"
          showCTA={true}
          ctaText="Get Started"
          ctaHref="#"
          testimonial={sampleTestimonial}
          imageOverlay={true}
          imageBackground="card"
          contentAlignment="left"
          onFeatureClick={handleFeatureClick}
        />
      </div>

      {/* Split Image with Gradient Background */}
      <div class={sectionStyles}>
        <div class={sectionHeaderStyles}>
          <h2 class={sectionTitleStyles}>Gradient Image Background</h2>
          <p class={sectionDescStyles}>Image on left with gradient background and centered content</p>
        </div>
        
        <FeatureSplitImage
          badge="Boost productivity"
          title="Start using our app today"
          subtitle="Ac euismod vel sit maecenas id pellentesque eu sed consectetur. Malesuada adipiscing sagittis vel nulla. Ac euismod vel sit maecenas."
          features={sampleFeatures}
          image={sampleImage}
          imagePosition="left"
          theme={currentTheme()}
          animated={true}
          backgroundPattern="dots"
          showCTA={true}
          ctaText="Try It Now"
          ctaHref="#"
          imageOverlay={false}
          imageBackground="gradient"
          contentAlignment="center"
          onFeatureClick={handleFeatureClick}
        />
      </div>

      {/* Simple List Layout */}
      <div class={sectionStyles}>
        <div class={sectionHeaderStyles}>
          <h2 class={sectionTitleStyles}>Simple List Layout</h2>
          <p class={sectionDescStyles}>Clean, minimal design focusing on content</p>
        </div>
        
        <FeatureSimpleList
          badge="Everything you need"
          title="All-in-one platform"
          subtitle="Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in accusamus quisquam."
          features={allInOneFeatures}
          theme={currentTheme()}
          animated={true}
          backgroundPattern="none"
          layout="three-column"
          showIcons={true}
          iconStyle="check"
          maxWidth="xl"
          alignment="center"
          onFeatureClick={handleFeatureClick}
        />
      </div>

      {/* Two Column Simple List */}
      <div class={sectionStyles}>
        <div class={sectionHeaderStyles}>
          <h2 class={sectionTitleStyles}>Two Column Simple List</h2>
          <p class={sectionDescStyles}>Compact layout with custom icons and left alignment</p>
        </div>
        
        <FeatureSimpleList
          title="Stay on top of customer support"
          subtitle="Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in accusamus quisquam."
          features={[
            {
              id: "unlimited-inboxes",
              name: "Unlimited inboxes",
              description: "Non quo aperiam repellendus quas est est. Eos aut dolore aut ut sit nesciunt. Ex tempora quia. Sit nobis consequatur dolores incidunt.",
              icon: "server"
            },
            {
              id: "manage-team",
              name: "Manage team members",
              description: "Vero eum voluptatem aliquid nostrum voluptatem. Vitae esse natus. Earum nihil deserunt eos quasi cupiditate. A inventore et molestiae natus.",
              icon: "cog"
            },
            {
              id: "spam-report",
              name: "Spam report",
              description: "Et quod quaerat dolorem quaerat architecto aliquam accusantium. Ex adipisci et doloremque autem quia quam. Quis eos molestiae at iure impedit.",
              icon: "fingerprint"
            },
            {
              id: "advanced-analytics",
              name: "Advanced analytics",
              description: "Comprehensive insights into your application performance with real-time monitoring and detailed reporting capabilities.",
              icon: "cloud"
            }
          ]}
          theme={currentTheme()}
          animated={true}
          backgroundPattern="dots"
          layout="two-column"
          showIcons={true}
          iconStyle="custom"
          maxWidth="lg"
          alignment="left"
          onFeatureClick={handleFeatureClick}
        />
      </div>

      {/* Single Column with No Icons */}
      <div class={sectionStyles}>
        <div class={sectionHeaderStyles}>
          <h2 class={sectionTitleStyles}>Single Column No Icons</h2>
          <p class={sectionDescStyles}>Minimal design focusing purely on typography</p>
        </div>
        
        <FeatureSimpleList
          title="Simple and elegant"
          features={[
            {
              id: "feature-1",
              name: "Push to deploy",
              description: "Aut illo quae. Ut et harum ea animi natus. Culpa maiores et sed sint et magnam exercitationem quia. Ullam voluptas nihil vitae dicta molestiae et. Aliquid velit porro vero."
            },
            {
              id: "feature-2",
              name: "SSL certificates",
              description: "Mollitia delectus a omnis. Quae velit aliquid. Qui nulla maxime adipisci illo id molestiae. Cumque cum ut minus rerum architecto magnam consequatur. Quia quaerat minima."
            },
            {
              id: "feature-3",
              name: "Simple queues",
              description: "Aut repellendus et officiis dolor possimus. Deserunt velit quasi sunt fuga error labore quia ipsum. Commodi autem voluptatem nam. Quos voluptatem totam."
            }
          ]}
          theme={currentTheme()}
          animated={true}
          backgroundPattern="none"
          layout="single"
          showIcons={false}
          maxWidth="md"
          alignment="center"
          onFeatureClick={handleFeatureClick}
        />
      </div>
    </div>
  );
};

export default FeatureShowcaseDemo;