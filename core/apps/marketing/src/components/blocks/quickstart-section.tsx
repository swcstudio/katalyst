'use client';

import { useState } from 'react';
import { Container } from '@/components/Container';
import { FadeIn, FadeInStagger } from '@/components/FadeIn';
import { SectionIntro } from '@/components/SectionIntro';

export function QuickStartSection() {
  const [activeTab, setActiveTab] = useState('install');

  const codeBlocks = {
    install: `# Install Katalyst Framework
npm create katalyst-app@latest my-quantum-ai
cd my-quantum-ai

# Initialize quantum consciousness
katalyst init --quantum-forest --enterprise

# Deploy your first AI branch
katalyst deploy branch --type=analysis --name=data-processor`,
    
    configure: `# Configure quantum forest consciousness
katalyst configure \\
  --crown-consciousness \\
  --blockchain-anchor \\
  --etd-tracking

# Set up specialized branches
katalyst branch create --type=reasoning --name=logic-processor
katalyst branch create --type=synthesis --name=knowledge-integrator`,

    deploy: `# Deploy to production with blockchain verification
katalyst deploy production \\
  --blockchain=ethereum \\
  --verification=immutable \\
  --monitoring=real-time

# Monitor ETD generation
katalyst monitor --dashboard --etd-analytics`,
  };

  const steps = [
    {
      id: 'install',
      title: 'Installation',
      description: 'Set up Katalyst with quantum consciousness',
      icon: '📦',
    },
    {
      id: 'configure',
      title: 'Configuration', 
      description: 'Configure branches and blockchain anchoring',
      icon: '⚙️',
    },
    {
      id: 'deploy',
      title: 'Deployment',
      description: 'Deploy with enterprise-grade monitoring',
      icon: '🚀',
    },
  ];

  return (
    <section className="py-20 sm:py-32">
      <Container>
        <FadeIn>
          <SectionIntro title="Get Started in Minutes">
            <p>
              Deploy your first quantum forest consciousness system with enterprise-grade 
              AI capabilities in just three simple steps. Generate ETD value from day one.
            </p>
          </SectionIntro>
        </FadeIn>

        <div className="mt-16 lg:mt-20">
          <FadeInStagger className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Step Navigation */}
            <FadeIn>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveTab(step.id)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                      activeTab === step.id
                        ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 shadow-lg'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`text-2xl ${
                        activeTab === step.id ? 'scale-110' : ''
                      } transition-transform duration-300`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className={`text-lg font-semibold ${
                            activeTab === step.id ? 'text-cyan-600' : 'text-gray-900'
                          }`}>
                            Step {index + 1}: {step.title}
                          </h3>
                          {activeTab === step.id && (
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <p className={`mt-2 text-sm ${
                          activeTab === step.id ? 'text-gray-700' : 'text-gray-600'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}

                {/* Quick Links */}
                <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl border border-purple-200">
                  <h4 className="text-lg font-semibold text-purple-900 mb-4">
                    🎓 Learning Resources
                  </h4>
                  <div className="space-y-2 text-sm">
                    <a href="/docs/architecture" className="block text-purple-700 hover:text-purple-900 hover:underline">
                      → Quantum Forest Architecture Guide
                    </a>
                    <a href="/docs/blockchain" className="block text-purple-700 hover:text-purple-900 hover:underline">
                      → Blockchain Integration Tutorial
                    </a>
                    <a href="/courses" className="block text-purple-700 hover:text-purple-900 hover:underline">
                      → Complete Video Course Series
                    </a>
                    <a href="/examples" className="block text-purple-700 hover:text-purple-900 hover:underline">
                      → Production Examples & Templates
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Code Block */}
            <FadeIn>
              <div className="relative">
                <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Terminal Header */}
                  <div className="bg-gray-800 px-6 py-4 flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-gray-400 text-sm font-mono">
                      katalyst-terminal
                    </div>
                  </div>

                  {/* Code Content */}
                  <div className="p-6 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                      <code className="language-bash">
                        {codeBlocks[activeTab as keyof typeof codeBlocks]}
                      </code>
                    </pre>
                  </div>

                  {/* Status Bar */}
                  <div className="bg-gray-800 px-6 py-3 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Quantum consciousness: Active</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span>ETD: +$125K</span>
                      <span>Branches: 3</span>
                      <span>Blockchain: ✓</span>
                    </div>
                  </div>
                </div>

                {/* Copy Button */}
                <button className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs transition-colors duration-200">
                  📋 Copy
                </button>
              </div>
            </FadeIn>
          </FadeInStagger>
        </div>

        {/* Success Metrics */}
        <FadeIn delay={0.4}>
          <div className="mt-16 bg-gradient-to-r from-green-50 to-cyan-50 rounded-3xl p-8 border border-green-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-green-900 mb-2">
                ⚡ Immediate Impact Metrics
              </h3>
              <p className="text-green-700">
                Expected results within first 30 days of deployment
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-green-600">2-5 min</div>
                <div className="text-sm text-green-800 mt-1">Setup Time</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-cyan-600">1000x</div>
                <div className="text-sm text-cyan-800 mt-1">Processing Speed</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-600">$125K+</div>
                <div className="text-sm text-purple-800 mt-1">Month 1 ETD</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-orange-600">99.9%</div>
                <div className="text-sm text-orange-800 mt-1">Uptime SLA</div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
