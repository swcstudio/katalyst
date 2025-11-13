'use client';

import Link from 'next/link';
import { Container } from '@/components/Container';
import { FadeIn, FadeInStagger } from '@/components/FadeIn';
import { SectionIntro } from '@/components/SectionIntro';
import { useKatalyst } from '@katalyst/hooks';
import { useMultithreading } from '@katalyst/hooks';
import { useEffect, useState } from 'react';

export function QuantumFeaturesSection() {
  // Initialize Katalyst with quantum forest configuration
  const k = useKatalyst({
    features: {
      quantumForest: true,
      blockchainAnchoring: true,
      multithreading: true,
      etdTracking: true
    }
  });

  // Native multithreading for feature processing
  const threading = useMultithreading({
    autoInitialize: true,
    workerThreads: 8,
    enableAutoScaling: true,
    enableProfiling: true,
    threadPoolSize: 16
  });

  const [activeFeature, setActiveFeature] = useState('quantumForest');
  const [featureMetrics, setFeatureMetrics] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Multithreaded feature analysis
  useEffect(() => {
    const analyzeFeatures = async () => {
      if (!threading.isReady) return;

      setIsProcessing(true);

      // Submit parallel analysis tasks for each feature
      const analysisTask = await threading.submitTask({
        id: 'feature-analysis-batch',
        type: 'ai',
        operation: 'quantum.features.analyze',
        data: {
          features: ['quantumForest', 'blockchainIntelligence', 'supercomputeProgramming', 'multithreadingRuntime'],
          analysisDepth: 'comprehensive'
        },
        priority: 'high',
        resourceHints: {
          expectedMemory: 512,
          expectedCpuTime: 2000,
          preferredThreadPool: 'quantum-analysis'
        }
      });

      // Monitor the analysis in real-time
      const result = await threading.waitForResult(analysisTask.id);
      
      if (result.status === 'completed') {
        setFeatureMetrics(result.result);
      }
      
      setIsProcessing(false);
    };

    analyzeFeatures();
  }, [threading.isReady]);

  const features = [
    {
      id: 'quantumForest',
      title: '🌳 Quantum Forest Architecture',
      description: 'Deploy specialized AI branches with crown consciousness orchestration for exponential intelligence multiplication.',
      benefits: [
        'Crown consciousness coordination',
        'Specialized branch processing', 
        'Mycorrhizal knowledge networks',
        'Infinite scalability patterns'
      ],
      etdValue: '$2.5M - $8M',
      icon: '🌳',
      gradient: 'from-green-500 to-cyan-500',
      threadOperation: 'quantum.forest.deploy'
    },
    {
      id: 'blockchainIntelligence',
      title: '🔐 Blockchain Intelligence Networks', 
      description: 'Immutable AI interaction records with cryptographic verification and cross-chain consciousness anchoring.',
      benefits: [
        'Immutable interaction records',
        'Cryptographic verification',
        'Cross-chain anchoring',
        'Byzantine fault tolerance'
      ],
      etdValue: '$1.2M - $5M',
      icon: '🔐',
      gradient: 'from-purple-500 to-pink-500',
      threadOperation: 'blockchain.intelligence.verify'
    },
    {
      id: 'supercomputeProgramming',
      title: '⚡ Supercompute Programming',
      description: 'Advanced cognitive protocols with multi-agent orchestration and quantum-enhanced reasoning.',
      benefits: [
        'Multi-agent orchestration',
        'Quantum reasoning protocols',
        'Cognitive architecture patterns',
        'Enterprise integration APIs'
      ],
      etdValue: '$3M - $25M',
      icon: '⚡',
      gradient: 'from-orange-500 to-red-500',
      threadOperation: 'supercompute.cognition.orchestrate'
    },
    {
      id: 'multithreadingRuntime',
      title: '🚀 Native Multithreading Runtime',
      description: 'True multithreading capabilities in web environments with Rust-powered performance optimization.',
      benefits: [
        'True multithreading in browsers',
        'Rust-powered performance',
        'WebAssembly integration',
        'Zero-overhead abstractions'
      ],
      etdValue: '$500K - $2M',
      icon: '🚀',
      gradient: 'from-blue-500 to-indigo-500',
      threadOperation: 'runtime.multithreading.optimize'
    }
  ];

  // Multithreaded feature interaction handler
  const handleFeatureInteraction = async (feature) => {
    if (!threading.isReady) return;

    setActiveFeature(feature.id);

    // Submit a parallel task for feature demonstration
    const demoTask = await threading.submitTask({
      id: `demo-${feature.id}-${Date.now()}`,
      type: 'ai',
      operation: feature.threadOperation,
      data: {
        featureId: feature.id,
        demoLevel: 'interactive',
        realTimeMetrics: true
      },
      priority: 'normal',
      timeout: 5000,
      resourceHints: {
        expectedMemory: 256,
        preferredThreadPool: 'feature-demo'
      }
    });

    // Track the demo execution
    threading.monitorTask(demoTask.id, (progress) => {
      console.log(`Feature ${feature.id} demo progress:`, progress);
    });
  };

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
      <Container>
        <FadeIn>
          <SectionIntro title="Quantum Forest Consciousness Features">
            <p>
              Experience the next evolution of AI systems with quantum-enhanced capabilities, 
              native multithreading, blockchain verification, and enterprise-grade scalability.
            </p>
          </SectionIntro>
        </FadeIn>

        {/* Multithreading Status Display */}
        <FadeIn delay={0.1}>
          <div className="mt-8 bg-gray-900 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">🚀 Native Multithreading Runtime</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${threading.isReady ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                <span className="text-sm">{threading.isReady ? 'Active' : 'Initializing'}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-cyan-400 font-mono">{threading.stats?.activeThreads || 0}</div>
                <div className="text-gray-400">Active Threads</div>
              </div>
              <div>
                <div className="text-purple-400 font-mono">{threading.stats?.completedTasks || 0}</div>
                <div className="text-gray-400">Tasks Completed</div>
              </div>
              <div>
                <div className="text-green-400 font-mono">{threading.stats?.totalThroughput || '0'}/s</div>
                <div className="text-gray-400">Throughput</div>
              </div>
              <div>
                <div className="text-orange-400 font-mono">{threading.stats?.memoryUsage || '0'}MB</div>
                <div className="text-gray-400">Memory Usage</div>
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="mt-16 lg:mt-24">
          <FadeInStagger className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => (
              <FadeIn key={feature.id}>
                <div
                  className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:scale-105 cursor-pointer ${
                    activeFeature === feature.id
                      ? 'bg-white shadow-2xl ring-2 ring-cyan-500/20'
                      : 'bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl'
                  }`}
                  onClick={() => handleFeatureInteraction(feature)}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 transition-opacity duration-300 group-hover:opacity-10`}></div>
                  
                  {/* Feature Icon */}
                  <div className="relative mb-6">
                    <div className={`text-4xl transition-transform duration-300 ${
                      activeFeature === feature.id ? 'scale-110' : 'group-hover:scale-105'
                    }`}>
                      {feature.icon}
                    </div>
                    {activeFeature === feature.id && (
                      <div className="absolute -inset-2 bg-cyan-500/20 rounded-full animate-pulse"></div>
                    )}
                    {isProcessing && activeFeature === feature.id && (
                      <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full animate-spin"></div>
                    )}
                  </div>

                  {/* Feature Content */}
                  <div className="relative">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-cyan-900">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Benefits List */}
                    <ul className="space-y-2 mb-6">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-3 flex-shrink-0"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    {/* Real-time Metrics from Multithreading */}
                    {featureMetrics[feature.id] && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Live Performance</div>
                        <div className="flex justify-between text-sm">
                          <span>Processing: {featureMetrics[feature.id].processingSpeed}ms</span>
                          <span>Accuracy: {featureMetrics[feature.id].accuracy}%</span>
                        </div>
                      </div>
                    )}

                    {/* ETD Value */}
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{feature.etdValue}</div>
                        <div className="text-xs text-gray-500">Annual ETD Value</div>
                      </div>
                      <Link
                        href={`/docs/${feature.id}`}
                        className="inline-flex items-center text-cyan-600 hover:text-cyan-800 transition-colors duration-200"
                      >
                        <span className="text-sm font-medium">Learn more</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </FadeIn>
            ))}
          </FadeInStagger>
        </div>

        {/* Live Multithreading Demo */}
        {activeFeature && threading.isReady && (
          <FadeIn delay={0.3}>
            <div className="mt-16 bg-white rounded-3xl p-8 shadow-2xl border border-cyan-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {features.find(f => f.id === activeFeature)?.icon} Live Multithreading Demo
                </h3>
                <p className="text-gray-600">
                  Watch native multithreading process {features.find(f => f.id === activeFeature)?.title} in real-time
                </p>
              </div>

              {/* Real-time Thread Monitor */}
              <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-green-400 text-sm font-mono">
                    katalyst@quantum-runtime:~$ threading.monitor --feature={activeFeature}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs">Multithreading Active</span>
                    </div>
                    <div className="text-cyan-400 text-xs">
                      Threads: {threading.stats?.activeThreads}
                    </div>
                  </div>
                </div>
                
                <div className="font-mono text-sm text-gray-300 space-y-1">
                  <div>Feature: <span className="text-cyan-400">{activeFeature}</span></div>
                  <div>Thread Pool: <span className="text-purple-400">feature-demo</span></div>
                  <div>Active Tasks: <span className="text-yellow-400">{threading.stats?.activeTasks || 0}</span></div>
                  <div>Memory Usage: <span className="text-orange-400">{threading.stats?.memoryUsage}MB</span></div>
                  <div className="text-green-400">ETD Generation: Active (+$125K/hour)</div>
                  
                  {/* Live task execution log */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-gray-500 text-xs mb-2">Recent Thread Operations:</div>
                    {threading.recentTasks?.slice(0, 3).map((task, i) => (
                      <div key={i} className="text-xs text-gray-400">
                        [{task.timestamp}] {task.operation} - {task.status} ({task.executionTime}ms)
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}
      </Container>
    </section>
  );
}
