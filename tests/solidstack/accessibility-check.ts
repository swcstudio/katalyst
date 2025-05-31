import { createRoot } from "solid-js";
import { renderToString } from "solid-js/web";

// Import demo components
import { AnimatedShinyTextDemo } from "../../libs/ui/src/components/solidstack/demos/AnimatedShinyTextDemo.tsx";
import { DotPatternDemo } from "../../libs/ui/src/components/solidstack/demos/DotPatternDemo.tsx";
import { GridPatternDemo } from "../../libs/ui/src/components/solidstack/demos/GridPatternDemo.tsx";
import { OrbitingCirclesDemo } from "../../libs/ui/src/components/solidstack/demos/OrbitingCirclesDemo.tsx";

interface AccessibilityViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  element: string;
  help: string;
}

interface AccessibilityResult {
  violations: AccessibilityViolation[];
  passes: number;
  incomplete: number;
  inapplicable: number;
  url: string;
  timestamp: string;
}

const componentMap = {
  AnimatedShinyTextDemo,
  DotPatternDemo,
  GridPatternDemo,
  OrbitingCirclesDemo,
} as const;

class AccessibilityChecker {
  private violations: AccessibilityViolation[] = [];
  private passes = 0;

  checkAriaAttributes(html: string): void {
    // Check for decorative elements that should be hidden from screen readers
    const svgMatches = html.match(/<svg[^>]*>/g) || [];
    for (const svgMatch of svgMatches) {
      if (!svgMatch.includes('aria-hidden="true"') && !svgMatch.includes('role=')) {
        this.violations.push({
          id: 'svg-aria-hidden',
          impact: 'moderate',
          description: 'SVG elements should have aria-hidden="true" if they are decorative',
          element: svgMatch,
          help: 'Add aria-hidden="true" to decorative SVG elements'
        });
      } else {
        this.passes++;
      }
    }

    // Check for interactive elements without proper ARIA labels
    const buttonMatches = html.match(/<button[^>]*>/g) || [];
    for (const buttonMatch of buttonMatches) {
      if (!buttonMatch.includes('aria-label') && 
          !buttonMatch.includes('aria-labelledby') && 
          !html.includes('</button>')) {
        this.violations.push({
          id: 'button-aria-label',
          impact: 'serious',
          description: 'Interactive buttons should have accessible names',
          element: buttonMatch,
          help: 'Add aria-label or ensure button has text content'
        });
      } else {
        this.passes++;
      }
    }
  }

  checkColorContrast(html: string): void {
    // Basic color contrast check - look for color definitions
    const colorRegex = /color:\s*([^;]+)/g;
    const backgroundRegex = /background(?:-color)?:\s*([^;]+)/g;
    
    let colorMatch;
    let hasColorDefinitions = false;
    
    while ((colorMatch = colorRegex.exec(html)) !== null) {
      hasColorDefinitions = true;
      const color = colorMatch[1];
      
      // Check for potentially low contrast combinations
      if (color.includes('gray') || color.includes('grey')) {
        this.violations.push({
          id: 'color-contrast',
          impact: 'moderate',
          description: 'Gray colors may not provide sufficient contrast',
          element: colorMatch[0],
          help: 'Ensure color contrast ratio is at least 4.5:1 for normal text'
        });
      } else {
        this.passes++;
      }
    }

    if (hasColorDefinitions) {
      this.passes++;
    }
  }

  checkSemanticHTML(html: string): void {
    // Check for proper semantic structure
    const headingMatches = html.match(/<h[1-6][^>]*>/g) || [];
    const divMatches = html.match(/<div[^>]*>/g) || [];
    
    if (divMatches.length > headingMatches.length * 3) {
      this.violations.push({
        id: 'semantic-structure',
        impact: 'minor',
        description: 'Consider using semantic HTML elements instead of generic divs',
        element: '<div>',
        help: 'Use semantic elements like <section>, <article>, <nav>, etc.'
      });
    } else {
      this.passes++;
    }

    // Check for missing alt text on images (if any)
    const imgMatches = html.match(/<img[^>]*>/g) || [];
    for (const imgMatch of imgMatches) {
      if (!imgMatch.includes('alt=')) {
        this.violations.push({
          id: 'img-alt',
          impact: 'serious',
          description: 'Images must have alt text',
          element: imgMatch,
          help: 'Add alt attribute to image elements'
        });
      } else {
        this.passes++;
      }
    }
  }

  checkKeyboardNavigation(html: string): void {
    // Check for interactive elements that should be keyboard accessible
    const interactiveElements = html.match(/<(button|a|input|select|textarea)[^>]*>/g) || [];
    
    for (const element of interactiveElements) {
      if (element.includes('tabindex="-1"') && !element.includes('aria-hidden="true"')) {
        this.violations.push({
          id: 'keyboard-navigation',
          impact: 'serious',
          description: 'Interactive elements should be keyboard accessible',
          element: element,
          help: 'Remove tabindex="-1" or ensure element is properly hidden'
        });
      } else {
        this.passes++;
      }
    }
  }

  checkFocusManagement(html: string): void {
    // Check for focus indicators
    const focusableElements = html.match(/<(button|a|input|select|textarea)[^>]*>/g) || [];
    
    if (focusableElements.length > 0) {
      // Look for focus styles in CSS
      const hasFocusStyles = html.includes('focus') || html.includes(':focus');
      
      if (!hasFocusStyles) {
        this.violations.push({
          id: 'focus-visible',
          impact: 'moderate',
          description: 'Focusable elements should have visible focus indicators',
          element: 'Interactive elements',
          help: 'Add CSS focus styles to indicate keyboard focus'
        });
      } else {
        this.passes++;
      }
    }
  }

  checkReducedMotion(html: string): void {
    // Check for animation that should respect reduced motion preferences
    const hasAnimations = html.includes('animation') || html.includes('transition');
    
    if (hasAnimations) {
      const hasReducedMotionCheck = html.includes('prefers-reduced-motion');
      
      if (!hasReducedMotionCheck) {
        this.violations.push({
          id: 'reduced-motion',
          impact: 'moderate',
          description: 'Animations should respect prefers-reduced-motion setting',
          element: 'Animated elements',
          help: 'Add @media (prefers-reduced-motion: reduce) to disable animations'
        });
      } else {
        this.passes++;
      }
    }
  }

  checkComponent(componentName: string): AccessibilityResult {
    const Component = componentMap[componentName as keyof typeof componentMap];
    
    if (!Component) {
      throw new Error(`Component ${componentName} not found`);
    }

    const html = renderToString(() => Component({}));
    
    // Reset counters
    this.violations = [];
    this.passes = 0;

    // Run all accessibility checks
    this.checkAriaAttributes(html);
    this.checkColorContrast(html);
    this.checkSemanticHTML(html);
    this.checkKeyboardNavigation(html);
    this.checkFocusManagement(html);
    this.checkReducedMotion(html);

    return {
      violations: this.violations,
      passes: this.passes,
      incomplete: 0,
      inapplicable: 0,
      url: `component://${componentName}`,
      timestamp: new Date().toISOString()
    };
  }
}

function main() {
  const componentName = Deno.args[0];
  
  if (!componentName) {
    console.error("Component name is required");
    Deno.exit(1);
  }

  try {
    const checker = new AccessibilityChecker();
    const result = checker.checkComponent(componentName);
    
    console.log(JSON.stringify(result, null, 2));
    
    if (result.violations.length > 0) {
      Deno.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}