import { createRoot, createSignal } from "solid-js";
import { renderToString } from "solid-js/web";

// Import demo components
import { AnimatedShinyTextDemo } from "../../libs/ui/src/components/solidstack/demos/AnimatedShinyTextDemo.tsx";
import { DotPatternDemo } from "../../libs/ui/src/components/solidstack/demos/DotPatternDemo.tsx";
import { GridPatternDemo } from "../../libs/ui/src/components/solidstack/demos/GridPatternDemo.tsx";
import { OrbitingCirclesDemo } from "../../libs/ui/src/components/solidstack/demos/OrbitingCirclesDemo.tsx";

const componentMap = {
  AnimatedShinyTextDemo,
  DotPatternDemo,
  GridPatternDemo,
  OrbitingCirclesDemo,
} as const;

function renderComponent(componentName: string): string {
  const Component = componentMap[componentName as keyof typeof componentMap];
  
  if (!Component) {
    throw new Error(`Component ${componentName} not found`);
  }

  try {
    const html = renderToString(() => Component({}));
    return html;
  } catch (error) {
    throw new Error(`Failed to render ${componentName}: ${error.message}`);
  }
}

function main() {
  const componentName = Deno.args[0];
  
  if (!componentName) {
    console.error("Component name is required");
    Deno.exit(1);
  }

  try {
    const startTime = performance.now();
    const html = renderComponent(componentName);
    const endTime = performance.now();
    
    console.log(html);
    console.error(`Render time: ${endTime - startTime}ms`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}