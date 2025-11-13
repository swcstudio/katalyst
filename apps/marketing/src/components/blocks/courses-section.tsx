'use client';

import Link from 'next/link';
import { Container } from '@/components/Container';
import { FadeIn, FadeInStagger } from '@/components/FadeIn';
import { SectionIntro } from '@/components/SectionIntro';
import { useKatalyst } from '@katalyst/hooks';
import { useMultithreading } from '@katalyst/hooks';
import { useState, useEffect } from 'react';

export function CoursesSection() {
  const k = useKatalyst({
    features: {
      coursePlatform: true,
      progressTracking: true,
      adaptiveLearning: true
    }
  });

  const threading = useMultithreading({
    autoInitialize: true,
    workerThreads: 6,
    threadPoolSize: 12,
    enableProfiling: true
  });

  const [selectedTrack, setSelectedTrack] = useState('beginner');
  const [learningProgress, setLearningProgress] = useState({});
  const [isAnalyzingProgress, setIsAnalyzingProgress] = useState(false);

  const learningTracks = [
    {
      id: 'beginner',
      title: '🌱 Beginner Track',
      description: 'Start your journey into quantum forest consciousness with hands-on fundamentals.',
      duration: '6-8 weeks',
      difficulty: 'Beginner',
      etdValue: '$250K+',
      lessons: 24,
      projects: 6,
      certificates: 3,
      color: 'green'
    },
    {
      id: 'advanced',
      title: '🚀 Advanced Track',
      description: 'Master enterprise deployment patterns and quantum-enhanced architectures.',
      duration: '10-12 weeks',
      difficulty: 'Advanced',
      etdValue: '$2M+',
      lessons: 48,
      projects: 12,
      certificates: 6,
      color: 'blue'
    },
    {
      id: 'enterprise',
      title: '💼 Enterprise Track',
      description: 'Lead organization-wide transformations with blockchain-anchored intelligence.',
      duration: '16-20 weeks',
      difficulty: 'Expert',
      etdValue: '$8M+',
      lessons: 72,
      projects: 24,
      certificates: 12,
      color: 'purple'
    }
  ];

  const courses = [
    {
      id: 'foundations',
      title: 'Quantum Forest Foundations',
      description: 'Master the fundamental concepts of quantum consciousness and AI branch architecture.',
      instructor: 'Dr. Sarah Chen',
      duration: '4 hours',
      lessons: 12,
      level: 'Beginner',
      price: '$149',
      rating: 4.9,
      students: 2847,
      topics: ['Quantum Basics', 'Forest Architecture', 'Crown Consciousness', 'First Deployment'],
      href: '/courses/foundations',
      threadOperation: 'course.foundations.load'
    },
    {
      id: 'multithreading',
      title: 'Native Multithreading Mastery',
      description: 'Unlock the full power of Rust-powered multithreading in web applications.',
      instructor: 'Alex Rodriguez',
      duration: '6 hours',
      lessons: 18,
      level: 'Intermediate',
      price: '$249',
      rating: 4.8,
      students: 1923,
      topics: ['Thread Pools', 'Parallel Processing', 'WebAssembly', 'Performance Optimization'],
      href: '/courses/multithreading',
      threadOperation: 'course.multithreading.load'
    },
    {
      id: 'blockchain',
      title: 'Blockchain Intelligence Networks',
      description: 'Build immutable AI systems with cryptographic verification and cross-chain anchoring.',
      instructor: 'Dr. Michael Kim',
      duration: '8 hours',
      lessons: 24,
      level: 'Advanced',
      price: '$349',
      rating: 4.9,
      students: 1456,
      topics: ['Blockchain Integration', 'Cryptographic Verification', 'Cross-chain', 'Enterprise Security'],
      href: '/courses/blockchain',
      threadOperation: 'course.blockchain.load'
    },
    {
      id: 'enterprise',
      title: 'Enterprise Deployment Patterns',
      description: 'Scale quantum forest consciousness across large organizations with proven patterns.',
      instructor: 'Jennifer Park',
      duration: '12 hours',
      lessons: 36,
      level: 'Expert',
      price: '$499',
      rating: 5.0,
      students: 891,
      topics: ['Enterprise Architecture', 'Scaling Patterns', 'Team Management', 'ROI Optimization'],
      href: '/courses/enterprise',
      threadOperation: 'course.enterprise.load'
    }
  ];

  // Multithreaded learning progress analysis
  useEffect(() => {
    if (!threading.isReady) return;

    const analyzeProgress = async () => {
      setIsAnalyzingProgress(true);

      const progressTask = await threading.submitTask({
        id: 'learning-progress-analysis',
        type: 'ai',
        operation: 'learning.progress.analyze',
        data: {
          userId: 'demo-user',
          courses: courses.map(c => c.id),
          adaptiveLearning: true
        },
        priority: 'normal',
        resourceHints: {
          expectedMemory: 256,
          preferredThreadPool: 'learning-analytics'
        }
      });

      const result = await threading.waitForResult(progressTask.id);
      
      if (result.status === 'completed') {
        setLearningProgress(result.result);
      }
      
      setIsAnalyzingProgress(false);
    };

    analyzeProgress();
  }, [threading.isReady]);

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-purple-50 to-pink-50">
      <Container>
        <FadeIn>
          <SectionIntro title="Master Quantum Forest Consciousness">
            <p>
              Comprehensive video courses and learning paths designed by industry experts. 
              Powered by native multithreading for interactive coding exercises and 
              real-time performance feedback.
            </p>
          </SectionIntro>
        </FadeIn>

        {/* Learning Track Selector */}
        <FadeIn delay={0.1}>
          <div className="mt-12">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {learningTracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedTrack === track.id
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {track.title}
                </button>
              ))}
            </div>

            {/* Selected Track Details */}
            {learningTracks.map((track) => (
              selectedTrack === track.id && (
                <div key={track.id} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{track.title}</h3>
                      <p className="text-gray-600 mb-6">{track.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                          <div className="text-2xl font-bold text-purple-600">{track.lessons}</div>
                          <div className="text-sm text-gray-600">Lessons</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                          <div className="text-2xl font-bold text-blue-600">{track.projects}</div>
                          <div className="text-sm text-gray-600">Projects</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                          <div className="text-2xl font-bold text-green-600">{track.duration}</div>
                          <div className="text-sm text-gray-600">Duration</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                          <div className="text-2xl font-bold text-orange-600">{track.etdValue}</div>
                          <div className="text-sm text-gray-600">ETD Value</div>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold">🎯 Adaptive Learning Path</h4>
                          {threading.isReady && (
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-400">AI-Powered</span>
                            </div>
                          )}
                        </div>
                        
                        {isAnalyzingProgress ? (
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm">Analyzing learning patterns...</span>
                          </div>
                        ) : (
                          <div className="space-y-3 text-sm">
                            <div>Track Progress: <span className="text-cyan-400">0% Complete</span></div>
                            <div>Recommended Start: <span className="text-purple-400">Foundations Course</span></div>
                            <div>Estimated Completion: <span className="text-green-400">{track.duration}</span></div>
                            <div>Threads Active: <span className="text-orange-400">{threading.stats?.activeThreads || 0}</span></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </FadeIn>

        {/* Course Grid */}
        <div className="mt-16 lg:mt-24">
          <FadeInStagger className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <FadeIn key={course.id}>
                <Link href={course.href} className="group block h-full">
                  <div className="h-full bg-white rounded-3xl p-6 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                    {/* Course Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                        course.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                        course.level === 'Advanced' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {course.level}
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{course.price}</div>
                    </div>

                    {/* Course Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-purple-900">
                      {course.title}
                    </h3>

                    {/* Course Description */}
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-500">
                      <div>⭐ {course.rating} ({course.students} students)</div>
                      <div>🕒 {course.duration}</div>
                      <div>📚 {course.lessons} lessons</div>
                      <div>👨‍🏫 {course.instructor}</div>
                    </div>

                    {/* Course Topics */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-1">
                        {course.topics.slice(0, 3).map((topic, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {topic}
                          </span>
                        ))}
                        {course.topics.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{course.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between mt-auto">
                      <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                        Start Learning
                      </button>
                    </div>

                    {/* Multithreading Indicator */}
                    {threading.isReady && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center text-xs text-gray-500">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                          Interactive coding exercises
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </FadeIn>
            ))}
          </FadeInStagger>
        </div>

        {/* Live Learning Platform Features */}
        <FadeIn delay={0.4}>
          <div className="mt-16 bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🎯 Advanced Learning Platform Features
              </h3>
              <p className="text-gray-600">
                Powered by native multithreading for real-time code execution and adaptive learning
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                <div className="text-3xl mb-4">⚡</div>
                <h4 className="font-semibold text-gray-900 mb-2">Live Code Execution</h4>
                <p className="text-sm text-gray-600">
                  Run and test code directly in the browser with multithreaded processing
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                <div className="text-3xl mb-4">🧠</div>
                <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Assistance</h4>
                <p className="text-sm text-gray-600">
                  Get instant help and personalized learning recommendations
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl">
                <div className="text-3xl mb-4">📊</div>
                <h4 className="font-semibold text-gray-900 mb-2">Progress Analytics</h4>
                <p className="text-sm text-gray-600">
                  Track your learning journey with detailed performance metrics
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl">
                <div className="text-3xl mb-4">🏆</div>
                <h4 className="font-semibold text-gray-900 mb-2">Certification</h4>
                <p className="text-sm text-gray-600">
                  Earn blockchain-verified certificates for completed courses
                </p>
              </div>
            </div>

            {/* Real-time Platform Stats */}
            {threading.isReady && (
              <div className="mt-8 bg-gray-50 rounded-xl p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                  <div>
                    <div className="font-mono text-xl font-bold text-purple-600">
                      {threading.stats?.activeThreads || 0}
                    </div>
                    <div className="text-gray-600">Active Learning Threads</div>
                  </div>
                  <div>
                    <div className="font-mono text-xl font-bold text-blue-600">5,847</div>
                    <div className="text-gray-600">Students Online</div>
                  </div>
                  <div>
                    <div className="font-mono text-xl font-bold text-green-600">98.3%</div>
                    <div className="text-gray-600">Course Completion Rate</div>
                  </div>
                  <div>
                    <div className="font-mono text-xl font-bold text-orange-600">&lt;30ms</div>
                    <div className="text-gray-600">Code Execution Time</div>
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
