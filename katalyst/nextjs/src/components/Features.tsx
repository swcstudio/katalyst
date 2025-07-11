
export function Features() {
  const features = [
    {
      icon: '⚛️',
      title: 'React 19',
      description: 'Latest React with concurrent features, server components, and improved performance',
    },
    {
      icon: '📦',
      title: 'RSpack Bundling',
      description: 'Lightning-fast Rust-based bundler for optimal build times and performance',
    },
    {
      icon: '🎨',
      title: 'Tailwind CSS 4.0',
      description: 'Modern utility-first CSS framework with advanced features and optimizations',
    },
    {
      icon: '🔄',
      title: 'TanStack Ecosystem',
      description: 'Complete suite including Query, Router, Form, Table, and Virtual components',
    },
    {
      icon: '🏪',
      title: 'State Management',
      description: 'Zustand for lightweight, scalable state management across your application',
    },
    {
      icon: '🧪',
      title: 'Testing Suite',
      description: 'Vitest, Playwright, and Storybook for comprehensive testing and documentation',
    },
    {
      icon: '🔐',
      title: 'Authentication',
      description: 'Clerk integration for secure, scalable user authentication and management',
    },
    {
      icon: '🌐',
      title: 'Micro-Frontends',
      description: 'Module Federation support for building scalable, distributed applications',
    },
    {
      icon: '📊',
      title: 'Analytics Ready',
      description: 'Built-in analytics and monitoring capabilities for production applications',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Build Modern Web Apps</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Katalyst comes with 24+ State-of-the-Art integrations and tools to accelerate your development workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">And Much More...</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['Biome', 'NX', 'Nitro', 'StyleX', 'Typia', 'EMP', 'Deno', 'Bun'].map((tech) => (
              <span key={tech} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
