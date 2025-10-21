# Agent Templates

Agent templates provide pre-configured agent configurations for common use cases. They enable rapid setup of specialized AI agents with specific capabilities, system prompts, and optimized settings.

## Overview

The agent templates system includes:
- 15+ pre-built agent templates for various development tasks
- Customizable configurations with override support
- Specialized system prompts for each role
- Optimized temperature and capability settings
- Code execution integration where appropriate

## Available Templates

### Development Templates

#### Code Reviewer
Reviews code for bugs, security issues, and performance problems.

```typescript
import { agentTemplates, createAgentFromTemplate } from '@katalyst/ai';

// Use template directly
const reviewerConfig = agentTemplates.codeReviewer();

// Create agent from template
const reviewer = await createAgentFromTemplate('codeReviewer', {
  name: 'Senior Code Reviewer',
  temperature: 0.2
});
```

#### Test Generator
Generates comprehensive unit tests, integration tests, and E2E tests.

```typescript
const testGenConfig = agentTemplates.testGenerator();
// Includes:
// - System prompt for test automation expertise
// - Capabilities: ['test-generation', 'test-design', 'coverage-analysis']
// - Temperature: 0.3 for consistency
// - Code execution enabled
```

#### Refactoring Expert
Identifies code smells and implements refactoring strategies.

```typescript
const refactorConfig = agentTemplates.refactorer();
// Low temperature (0.2) for precise refactoring
// Code execution enabled for testing changes
```

#### Debugging Expert
Diagnoses bugs and provides solutions with explanations.

```typescript
const debuggerConfig = agentTemplates.debugger();
// Very low temperature (0.1) for accurate debugging
// Code execution enabled for testing fixes
```

#### Code Generator
Generates clean, efficient code with best practices.

```typescript
const codeGenConfig = agentTemplates.codeGenerator();
// Balanced temperature (0.4) for creativity and consistency
```

### Architecture & Design Templates

#### Software Architect
Designs scalable system architectures and selects technologies.

```typescript
const architectConfig = agentTemplates.architect();
// Higher temperature (0.6) for creative design thinking
```

#### API Designer
Designs RESTful and GraphQL APIs with proper documentation.

```typescript
const apiDesignerConfig = agentTemplates.apiDesigner();
// Temperature: 0.4 for balanced creativity and precision
```

#### UI/UX Designer
Creates user interfaces and experiences with accessibility focus.

```typescript
const uiuxConfig = agentTemplates.uiuxDesigner();
// Higher temperature (0.7) for creative design solutions
```

### Specialized Templates

#### Security Analyst
Performs security audits and vulnerability analysis.

```typescript
const securityConfig = agentTemplates.securityAnalyst();
// Very low temperature (0.1) for thorough security analysis
// Code execution enabled for security testing
```

#### Performance Optimizer
Identifies bottlenecks and optimizes system performance.

```typescript
const perfConfig = agentTemplates.performanceOptimizer();
// Low temperature (0.2) for precise optimization
// Code execution enabled for benchmarking
```

#### Data Analyst
Analyzes data patterns and creates visualizations.

```typescript
const dataAnalystConfig = agentTemplates.dataAnalyst();
// Temperature: 0.3 for analytical thinking
// Code execution enabled for data processing
```

### Management & Documentation Templates

#### Documentation Writer
Creates comprehensive technical documentation.

```typescript
const docWriterConfig = agentTemplates.documentationWriter();
// Temperature: 0.5 for clear, readable documentation
```

#### Project Manager
Breaks down projects and manages timelines.

```typescript
const pmConfig = agentTemplates.projectManager();
// Temperature: 0.5 for balanced planning and estimation
```

#### DevOps Engineer
Sets up CI/CD pipelines and infrastructure.

```typescript
const devopsConfig = agentTemplates.devOpsEngineer();
// Temperature: 0.3 for precision in infrastructure setup
```

#### Research Agent
Researches technical topics and provides recommendations.

```typescript
const researcherConfig = agentTemplates.researcher();
// Higher temperature (0.6) for comprehensive research
```

## Usage Examples

### Using Templates Directly

```typescript
import { agentTemplates } from '@katalyst/ai';

// Get template configuration
const reviewerConfig = agentTemplates.codeReviewer();
console.log('Reviewer config:', reviewerConfig);

// Modify configuration
reviewerConfig.name = 'Senior Code Reviewer';
reviewerConfig.temperature = 0.1;
reviewerConfig.capabilities?.push('architecture-review');

// Use with agent factory
const reviewer = await createAgent(reviewerConfig);
```

### Creating Agents from Templates

```typescript
import { createFromTemplate } from '@katalyst/ai';

// Create agent with template
const tester = await createFromTemplate('testGenerator', {
  name: 'QA Specialist',
  model: 'claude-3-opus-20240229',
  capabilities: ['test-generation', 'quality-assurance', 'automation']
});

// Create agent with multiple overrides
const securityAgent = await createFromTemplate('securityAnalyst', {
  name: 'Security Auditor',
  temperature: 0.05, // Even more conservative
  systemPrompt: `You are a senior security auditor with 15+ years experience.
  Focus on OWASP Top 10 vulnerabilities and provide specific, actionable recommendations.`,
  metadata: {
    specialization: 'web-security',
    experience: 'senior'
  }
});
```

### Template Customization

```typescript
// Create custom template based on existing one
function createCustomReviewer(): ClaudeConfig {
  const baseTemplate = agentTemplates.codeReviewer();
  
  return {
    ...baseTemplate,
    name: 'Enterprise Code Reviewer',
    systemPrompt: `${baseTemplate.systemPrompt}
    
    Additional requirements:
    - Ensure compliance with enterprise coding standards
    - Check for proper error handling and logging
    - Validate input sanitization
    - Review for scalability and maintainability
    - Ensure appropriate documentation`,
    capabilities: [
      ...(baseTemplate.capabilities || []),
      'enterprise-standards',
      'scalability-review',
      'compliance-check'
    ],
    temperature: 0.2,
    metadata: {
      level: 'enterprise',
      compliance: ['SOC2', 'GDPR', 'HIPAA']
    }
  };
}

// Use custom template
const enterpriseReviewer = await createAgent(createCustomReviewer());
```

### Quick Start Examples

```typescript
import { quickStart } from '@katalyst/ai';

// Quick code review
const review = await quickStart.codeReview(`
  function getUser(id) {
    return users.find(u => u.id === id);
  }
`);

console.log('Code review:', review);

// Generate tests
const tests = await quickStart.generateTests(`
  class Calculator {
    add(a, b) { return a + b; }
    subtract(a, b) { return a - b; }
  }
`, 'jest');

console.log('Generated tests:', tests);

// Debug an error
const debugHelp = await quickStart.debug(
  'TypeError: Cannot read property "name" of undefined',
  'The error occurs when processing user data from an API response'
);

console.log('Debug analysis:', debugHelp);

// Refactor code
const refactored = await quickStart.refactor(`
  // Old code
  if (user.role === 'admin') {
    return true;
  } else if (user.role === 'moderator') {
    return true;
  } else if (user.role === 'editor') {
    return true;
  } else {
    return false;
  }
`, 'Use array.includes() for cleaner logic');

console.log('Refactored code:', refactored);

// Generate documentation
const docs = await quickStart.document(`
  function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
`, 'api');

console.log('Documentation:', docs);
```

## API Reference

### agentTemplates

An object containing all available template functions:

```typescript
interface AgentTemplates {
  codeReviewer: () => ClaudeConfig;
  documentationWriter: () => ClaudeConfig;
  testGenerator: () => ClaudeConfig;
  refactorer: () => ClaudeConfig;
  debugger: () => ClaudeConfig;
  architect: () => ClaudeConfig;
  securityAnalyst: () => ClaudeConfig;
  performanceOptimizer: () => ClaudeConfig;
  apiDesigner: () => ClaudeConfig;
  dataAnalyst: () => ClaudeConfig;
  projectManager: () => ClaudeConfig;
  codeGenerator: () => ClaudeConfig;
  devOpsEngineer: () => ClaudeConfig;
  uiuxDesigner: () => ClaudeConfig;
  researcher: () => ClaudeConfig;
}
```

### createAgentFromTemplate

```typescript
function createAgentFromTemplate(
  templateName: keyof typeof agentTemplates,
  overrides?: Partial<AgentConfig>
): AgentConfig
```

Creates a configuration object from a template with optional overrides.

### createFromTemplate

```typescript
function createFromTemplate(
  templateName: keyof typeof agentTemplates,
  overrides?: Partial<AgentConfig>
): Promise<BaseAgent>
```

Creates an agent instance from a template with optional overrides.

### quickStart

```typescript
interface QuickStart {
  codeReview: (code: string) => Promise<string>;
  generateTests: (code: string, framework?: string) => Promise<string>;
  debug: (error: string, context?: string) => Promise<string>;
  refactor: (code: string, goal?: string) => Promise<string>;
  document: (code: string, type?: 'api' | 'readme' | 'inline') => Promise<string>;
  comprehensiveReview: (code: string) => Promise<Map<string, string>>;
}
```

Quick start functions for common tasks.

## Integration Patterns

### Multi-Agent Review System

```typescript
class ComprehensiveReviewSystem {
  private agents: Map<string, BaseAgent> = new Map();

  async initialize() {
    // Create specialized agents
    this.agents.set('reviewer', await createFromTemplate('codeReviewer'));
    this.agents.set('security', await createFromTemplate('securityAnalyst'));
    this.agents.set('performance', await createFromTemplate('performanceOptimizer'));
    this.agents.set('tester', await createFromTemplate('testGenerator'));
    this.agents.set('architect', await createFromTemplate('architect'));
  }

  async comprehensiveReview(code: string): Promise<ReviewReport> {
    const reviews = new Map<string, string>();
    
    // Parallel review by all agents
    const reviewPromises = Array.from(this.agents.entries()).map(async ([name, agent]) => {
      const prompt = `Review this code from a ${name} perspective:\n\n${code}`;
      const review = await agent.send(prompt);
      reviews.set(name, review);
    });

    await Promise.all(reviewPromises);

    // Generate comprehensive report
    const report: ReviewReport = {
      code,
      reviews: Object.fromEntries(reviews),
      overallScore: this.calculateOverallScore(reviews),
      recommendations: this.extractRecommendations(reviews),
      issues: this.identifyIssues(reviews)
    };

    return report;
  }

  private calculateOverallScore(reviews: Map<string, string>): number {
    // Implement scoring logic based on review quality
    return 0;
  }

  private extractRecommendations(reviews: Map<string, string>): string[] {
    // Extract actionable recommendations from reviews
    return [];
  }

  private identifyIssues(reviews: Map<string, string>): Issue[] {
    // Identify common issues across reviews
    return [];
  }
}

interface ReviewReport {
  code: string;
  reviews: Record<string, string>;
  overallScore: number;
  recommendations: string[];
  issues: Issue[];
}

interface Issue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location?: string;
}
```

### Adaptive Agent Selection

```typescript
class AdaptiveAgentSelector {
  private taskClassifiers = new Map<string, string[]>();

  constructor() {
    this.initializeClassifiers();
  }

  private initializeClassifiers() {
    this.taskClassifiers.set('bug-fix', ['debugger', 'codeReviewer']);
    this.taskClassifiers.set('feature-development', ['codeGenerator', 'architect']);
    this.taskClassifiers.set('testing', ['testGenerator']);
    this.taskClassifiers.set('performance', ['performanceOptimizer']);
    this.taskClassifiers.set('security', ['securityAnalyst']);
    this.taskClassifiers.set('documentation', ['documentationWriter']);
    this.taskClassifiers.set('refactoring', ['refactorer']);
  }

  async selectBestAgents(taskDescription: string): Promise<BaseAgent[]> {
    const taskType = await this.classifyTask(taskDescription);
    const agentNames = this.taskClassifiers.get(taskType) || ['codeReviewer'];
    
    const agents = await Promise.all(
      agentNames.map(name => createFromTemplate(name as keyof typeof agentTemplates))
    );

    return agents;
  }

  private async classifyTask(description: string): Promise<string> {
    // Simple keyword-based classification
    const keywords = {
      'bug-fix': ['bug', 'error', 'fix', 'debug', 'issue'],
      'feature-development': ['implement', 'create', 'build', 'develop', 'feature'],
      'testing': ['test', 'spec', 'coverage', 'unit', 'integration'],
      'performance': ['slow', 'performance', 'optimize', 'speed', 'memory'],
      'security': ['security', 'vulnerability', 'auth', 'encrypt', 'secure'],
      'documentation': ['document', 'readme', 'api', 'guide', 'manual'],
      'refactoring': ['refactor', 'improve', 'clean', 'restructure', 'optimize']
    };

    const desc = description.toLowerCase();
    
    for (const [type, words] of Object.entries(keywords)) {
      if (words.some(word => desc.includes(word))) {
        return type;
      }
    }

    return 'feature-development'; // Default
  }
}
```

## Best Practices

1. **Template Selection**: Choose the most specific template for your task to get the best results.

2. **Customization**: Don't hesitate to customize templates for your specific needs.

3. **Temperature Settings**: Lower temperatures (0.1-0.3) for analytical tasks, higher (0.5-0.7) for creative tasks.

4. **Capability Matching**: Ensure the template's capabilities match your requirements.

5. **System Prompts**: Review and modify system prompts to align with your team's standards.

6. **Code Execution**: Enable code execution only when necessary and ensure proper sandboxing.

7. **Multi-Agent Workflows**: Combine different templates for comprehensive solutions.

8. **Performance**: Cache created agents when using the same template repeatedly.

## Creating Custom Templates

```typescript
// Custom template for microservices development
const microservicesTemplate = (): ClaudeConfig => ({
  name: 'Microservices Developer',
  type: 'claude',
  model: 'claude-3-opus-20240229',
  systemPrompt: `You are a microservices architecture expert. Your role is to:
  - Design scalable microservices architectures
  - Implement service-to-service communication
  - Handle data consistency and distributed transactions
  - Implement proper API gateway patterns
  - Design for failure and resilience
  - Apply domain-driven design principles`,
  capabilities: [
    'microservices-design',
    'api-gateway',
    'distributed-systems',
    'event-driven-architecture',
    'service-mesh',
    'domain-driven-design'
  ],
  temperature: 0.4,
  enableCodeExecution: true
});

// Add to templates
agentTemplates.microservicesDeveloper = microservicesTemplate;

// Use it
const microservicesAgent = await createFromTemplate('microservicesDeveloper');
```

## Testing Templates

```typescript
import { agentTemplates, createFromTemplate } from '@katalyst/ai';

describe('Agent Templates', () => {
  test('codeReviewer template should have correct capabilities', () => {
    const config = agentTemplates.codeReviewer();
    
    expect(config.name).toBe('Code Reviewer');
    expect(config.capabilities).toContain('code-review');
    expect(config.capabilities).toContain('security-analysis');
    expect(config.temperature).toBeLessThan(0.5);
  });

  test('should create agent from template', async () => {
    const agent = await createFromTemplate('testGenerator', {
      name: 'Custom Tester'
    });

    expect(agent.name).toBe('Custom Tester');
    expect(agent.capabilities).toContain('test-generation');
  });

  test('quickStart should work for common tasks', async () => {
    const review = await quickStart.codeReview('const x = 1;');
    expect(review).toBeDefined();
    expect(review.length).toBeGreaterThan(0);
  });
});
```
