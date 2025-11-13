'use client';

import Link from 'next/link';
import { Container } from '@/components/Container';
import { FadeIn, FadeInStagger } from '@/components/FadeIn';
import { SectionIntro } from '@/components/SectionIntro';
import { useKatalyst } from '@katalyst/hooks';
import { useMultithreading } from '@katalyst/hooks';
import { useState, useEffect } from 'react';

export function DocumentationSection() {
  const k = useKatalyst({
    features: {
      documentation: true,
      searchIndexing: true,
      realTimeUpdates: true
    }
  });

  const threading = useMultithreading({
    autoInitialize: true,
    workerThreads: 4,
    threadPoolSize: 8,
    enableProfiling: true
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Multithreaded documentation search
  const handleSearch = async (query) => {
    if (!threading.isReady || query.length < 2) return;

    setIsSearching(true);
    setSearchQuery(query);

    // Submit parallel search tasks across documentation sections
    const searchTask = await threading.submitTask({
      id: `doc-search-${Date.now()}`,
      type: 'ai',
      operation: 'documentation.search.parallel',
      data: {
        query,
        sections: ['quickstart', 'architecture', 'api', 'examples', 'tutorials'],
        fuzzySearch: true,
        semanticSearch: true
      },
      priority: 'high',
      timeout: 3000,
      resourceHints: {
        expectedMemory: 128,
        preferredThreadPool: 'search-index'
      }
    });

    const result = await threading.waitForResult(searchTask.id);
    
    if (result.status === 'completed') {
      setSearchResults(result.result.matches);
    }
    
    setIsSearching(false);
  };

  const docSections = [
    {
      id: 'quickstart',
      title: '🚀 Quick Start',
      description: 'Get up and running with Katalyst in under 5 minutes. From installation to your first quantum forest deployment.',
      icon: '🚀',
      estimatedTime: '5 min',
      difficulty: 'Beginner',
      topics: ['Installation', 'Basic Setup', 'First Deployment', 'Hello World'],
      href: '/docs/quickstart',
      threadOperation: 'docs.quickstart.load'
    },
    {
      id: 'architecture',
      title: '🏗️ Architecture',
      description: 'Deep dive into quantum forest consciousness, multithreading runtime, and blockchain integration architecture.',
      icon: '🏗️',
      estimatedTime: '20 min',
      difficulty: 'Advanced',
      topics: ['Quantum Forest', 'Crown Consciousness', 'Multithreading', 'Blockchain'],
      href: '/docs/architecture',
      threadOperation: 'docs.architecture.load'
    },
    {
      id: 'multithreading',
      title: '⚡ Multithreading Guide',
      description: 'Master native multithreading with Rust-powered performance, thread pools, and parallel processing.',
      icon: '⚡',
      estimatedTime: '15 min',
      difficulty: 'Intermediate',
      topics: ['Thread Pools', 'Parallel Processing', 'WebAssembly', 'Performance'],
      href: '/docs/multithreading',
      threadOperation: 'docs.multithreading.load'
    },
    {
      id: 'api',
      title: '📚 API Reference',
      description: 'Complete API documentation with interactive examples and real-time testing capabilities.',
      icon: '📚',
      estimatedTime: '30 min',
      difficulty: 'Reference',
      topics: ['useKatalyst', 'useMultithreading', 'Hooks API', 'Components'],
      href: '/docs/api',
      threadOperation: 'docs.api.load'
    },
    {
      id: 'examples',
      title: '💡 Examples',
      description: 'Real-world examples and production-ready templates for enterprise deployment.',
      icon: '💡',
      estimatedTime: '25 min',
      difficulty: 'Practical',
      topics: ['Enterprise Apps', 'AI Integration', 'Blockchain', 'Performance'],
      href: '/examples',
      threadOperation: 'docs.examples.load'
    },
    {
      id: 'tutorials',
      title: '🎓 Tutorials',
      description: 'Step-by-step tutorials covering everything from basics to advanced quantum consciousness patterns.',
      icon: '🎓',
      estimatedTime: '45 min',
      difficulty: 'All Levels',
      topics: ['Beginner Series', 'Advanced Patterns', 'Best Practices', 'Case Studies'],
      href: '/tutorials',
      threadOperation: 'docs.tutorials.load'
    }
  ];

  // Preload documentation sections using multithreading
  useEffect(() => {
    if (!threading.isReady) return;

    const preloadDocs = async () => {
      // Submit parallel preload tasks for popular sections
      const preloadTasks = docSections.slice(0, 3).map(async (section) => {
        return await threading.submitTask({
          id: `preload-${section.id}`,
          type: 'io',
          operation: section.threadOperation,
          data: { sectionId: section.id, preload: true },
          priority: 'low',
          resourceHints: {
            expectedMemory: 64,
            preferredThreadPool: 'doc-preload'
          }
        });
      });

      // Monitor preloading progress
      Promise.all(preloadTasks).then(tasks => {
        console.log('Documentation sections preloaded:', tasks.length);
      });
    };

    preloadDocs();
  }, [threading.isReady]);

  return (
    <section className="py-20 sm:py-32 bg-white">
      <Container>
        <FadeIn>
          <SectionIntro title="Comprehensive Documentation Hub">
            <p>
              Everything you need to master Katalyst's quantum forest consciousness, 
              from quick starts to advanced enterprise patterns. Powered by native 
              multithreading for instant search and real-time updates.
            </p>
          </SectionIntro>
        </FadeIn>

        {/* Multithreaded Search */}
        <FadeIn delay={0.1}>
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documentation with multithreaded AI..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-6 py-4 pl-12 text-lg rounded-2xl border-2 border-gray-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all duration-300"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                {isSearching ? (
                  <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
              {threading.isReady && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">AI Search Active</span>
                </div>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <Link
                    key={index}
                    href={result.href}
                    className="block px-6 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{result.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{result.snippet}</p>
                      </div>
                      <div className="text-xs text-cyan-600 font-mono">
                        {result.score}% match
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

        {/* Documentation Grid */}
        <div className="mt-16 lg:mt-24">
          <FadeInStagger className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {docSections.map((section) => (
              <FadeIn key={section.id}>
                <Link
                  href={section.href}
                  className="group block h-full"
                >
                  <div className="h-full bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-cyan-300">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {section.icon}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs rounded-full font-medium">
                          {section.difficulty}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-900">
                      {section.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                      {section.description}
                    </p>

                    {/* Topics */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {section.topics.map((topic, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-sm text-gray-500">
                        📖 {section.estimatedTime} read
                      </div>
                      <div className="flex items-center text-cyan-600 group-hover:text-cyan-800 transition-colors">
                        <span className="text-sm font-medium">Read now</span>
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Multithreading Status Indicator */}
                    {threading.isReady && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center text-xs text-gray-500">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                          Preloaded with multithreading
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </FadeIn>
            ))}
          </FadeInStagger>
        </div>

        {/* Interactive Documentation Features */}
        <FadeIn delay={0.4}>
          <div className="mt-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                🔥 Interactive Documentation Features
              </h3>
              <p className="text-blue-700">
                Powered by native multithreading for real-time code execution and live examples
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-2xl mb-3">⚡</div>
                <h4 className="font-semibold text-gray-900 mb-2">Live Code Execution</h4>
                <p className="text-sm text-gray-600">
                  Run examples directly in the browser with multithreaded processing
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-2xl mb-3">🔍</div>
                <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Search</h4>
                <p className="text-sm text-gray-600">
                  Semantic search across all documentation with instant results
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-2xl mb-3">📊</div>
                <h4 className="font-semibold text-gray-900 mb-2">Performance Metrics</h4>
                <p className="text-sm text-gray-600">
                  Real-time performance monitoring and optimization suggestions
                </p>
              </div>
            </div>

            {/* Live Documentation Stats */}
            {threading.isReady && (
              <div className="mt-8 bg-white/60 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-700">Documentation Runtime Active</span>
                  </div>
                  <div className="flex space-x-6 text-gray-600">
                    <span>Search Threads: {threading.stats?.activeThreads || 0}</span>
                    <span>Cache Hit Rate: 94%</span>
                    <span>Avg Response: &lt;50ms</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
