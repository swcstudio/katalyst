'use client';

import Link from 'next/link';
import { Container } from '@/components/Container';
import { FadeIn, FadeInStagger } from '@/components/FadeIn';
import { SectionIntro } from '@/components/SectionIntro';
import { useKatalyst } from '@katalyst/hooks';
import { useMultithreading } from '@katalyst/hooks';
import { useState, useEffect } from 'react';

export function CommunitySection() {
  const k = useKatalyst({
    features: {
      communityPlatform: true,
      realTimeChat: true,
      collaborativeIDE: true
    }
  });

  const threading = useMultithreading({
    autoInitialize: true,
    workerThreads: 4,
    threadPoolSize: 8,
    enableWebSocketMonitoring: true,
    websocketPort: 8080
  });

  const [onlineUsers, setOnlineUsers] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);

  const communityChannels = [
    {
      id: 'general',
      name: '#general',
      description: 'General discussions about Katalyst and quantum forest consciousness',
      members: 12847,
      icon: '💬',
      color: 'blue',
      activity: 'Very Active'
    },
    {
      id: 'multithreading',
      name: '#multithreading',
      description: 'Native multithreading discussions, performance tips, and optimization',
      members: 3492,
      icon: '⚡',
      color: 'yellow',
      activity: 'Active'
    },
    {
      id: 'blockchain',
      name: '#blockchain',
      description: 'Blockchain integration, smart contracts, and cryptographic verification',
      members: 2156,
      icon: '🔐',
      color: 'purple',
      activity: 'Active'
    },
    {
      id: 'showcase',
      name: '#showcase',
      description: 'Share your quantum forest projects and get feedback from the community',
      members: 8734,
      icon: '🎨',
      color: 'green',
      activity: 'Very Active'
    },
    {
      id: 'help',
      name: '#help',
      description: 'Get help from experts and community members with technical questions',
      members: 15632,
      icon: '❓',
      color: 'red',
      activity: 'Very Active'
    },
    {
      id: 'enterprise',
      name: '#enterprise',
      description: 'Enterprise deployment discussions, scaling patterns, and case studies',
      members: 1847,
      icon: '🏢',
      color: 'indigo',
      activity: 'Moderate'
    }
  ];

  const contributors = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Quantum Architecture Lead',
      avatar: '/images/avatars/sarah.jpg',
      contributions: 247,
      speciality: 'Quantum Forest Design'
    },
    {
      name: 'Alex Rodriguez',
      role: 'Multithreading Expert',
      avatar: '/images/avatars/alex.jpg',
      contributions: 189,
      speciality: 'Rust Performance'
    },
    {
      name: 'Dr. Michael Kim',
      role: 'Blockchain Architect',
      avatar: '/images/avatars/michael.jpg',
      contributions: 156,
      speciality: 'Cross-chain Integration'
    },
    {
      name: 'Jennifer Park',
      role: 'Enterprise Consultant',
      avatar: '/images/avatars/jennifer.jpg',
      contributions: 134,
      speciality: 'Scaling Strategies'
    }
  ];

  // Multithreaded community activity monitoring
  useEffect(() => {
    if (!threading.isReady) return;

    const monitorActivity = async () => {
      setIsLoadingActivity(true);

      // Submit parallel tasks to monitor different community metrics
      const activityTask = await threading.submitTask({
        id: 'community-activity-monitor',
        type: 'io',
        operation: 'community.activity.realtime',
        data: {
          channels: communityChannels.map(c => c.id),
          metrics: ['online_users', 'recent_messages', 'trending_topics'],
          realTime: true
        },
        priority: 'normal',
        timeout: 5000,
        resourceHints: {
          expectedMemory: 128,
          preferredThreadPool: 'community-monitor'
        }
      });

      const result = await threading.waitForResult(activityTask.id);
      
      if (result.status === 'completed') {
        setOnlineUsers(result.result.onlineUsers);
        setRecentActivity(result.result.recentActivity);
      }
      
      setIsLoadingActivity(false);
    };

    monitorActivity();
    const interval = setInterval(monitorActivity, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [threading.isReady]);

  return (
    <section className="py-20 sm:py-32 bg-white">
      <Container>
        <FadeIn>
          <SectionIntro title="Join the Quantum Forest Community">
            <p>
              Connect with thousands of developers, researchers, and enterprises building 
              the future with quantum forest consciousness. Powered by native multithreading 
              for real-time collaboration and instant support.
            </p>
          </SectionIntro>
        </FadeIn>

        {/* Live Community Stats */}
        <FadeIn delay={0.1}>
          <div className="mt-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-cyan-400 font-mono">
                  {onlineUsers.toLocaleString() || '12,847'}
                </div>
                <div className="text-gray-300 mt-2">Community Members</div>
                {threading.isReady && (
                  <div className="flex items-center justify-center mt-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                    <span className="text-xs text-green-400">Live Count</span>
                  </div>
                )}
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 font-mono">2,847</div>
                <div className="text-gray-300 mt-2">Online Now</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 font-mono">847</div>
                <div className="text-gray-300 mt-2">Contributors</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-400 font-mono">24/7</div>
                <div className="text-gray-300 mt-2">Expert Support</div>
              </div>
            </div>

            {/* Real-time Activity Feed */}
            {threading.isReady && (
              <div className="mt-8 pt-8 border-t border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">🔥 Live Community Activity</h4>
                  {isLoadingActivity && (
                    <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  {recentActivity.length > 0 ? (
                    recentActivity.slice(0, 3).map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 text-gray-300">
                        <span className="text-cyan-400">{activity.channel}</span>
                        <span>{activity.user}</span>
                        <span className="text-gray-500">{activity.action}</span>
                        <span className="text-xs text-gray-400 ml-auto">{activity.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 text-gray-300">
                        <span className="text-cyan-400">#general</span>
                        <span>sarah.chen</span>
                        <span className="text-gray-500">shared a new quantum forest pattern</span>
                        <span className="text-xs text-gray-400 ml-auto">2m ago</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-300">
                        <span className="text-purple-400">#multithreading</span>
                        <span>alex.rodriguez</span>
                        <span className="text-gray-500">optimized thread pool performance by 40%</span>
                        <span className="text-xs text-gray-400 ml-auto">5m ago</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-300">
                        <span className="text-green-400">#showcase</span>
                        <span>jennifer.park</span>
                        <span className="text-gray-500">deployed enterprise solution generating $2M ETD</span>
                        <span className="text-xs text-gray-400 ml-auto">8m ago</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Community Channels */}
        <div className="mt-16 lg:mt-24">
          <FadeInStagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {communityChannels.map((channel) => (
              <FadeIn key={channel.id}>
                <Link
                  href={`/community/${channel.id}`}
                  className="group block h-full"
                >
                  <div className="h-full bg-gradient-to-br from-gray-50 to-white p-6 rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                    {/* Channel Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{channel.icon}</div>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-cyan-900">
                            {channel.name}
                          </h3>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            channel.activity === 'Very Active' ? 'bg-green-100 text-green-700' :
                            channel.activity === 'Active' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {channel.activity}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Channel Description */}
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {channel.description}
                    </p>

                    {/* Channel Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>👥 {channel.members.toLocaleString()} members</span>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          channel.activity === 'Very Active' ? 'bg-green-400' :
                          channel.activity === 'Active' ? 'bg-blue-400' :
                          'bg-gray-400'
                        } animate-pulse`}></div>
                        <span>Join chat</span>
                      </div>
                    </div>

                    {/* Multithreading Status */}
                    {threading.isReady && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center text-xs text-gray-500">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
                          Real-time messaging active
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </FadeIn>
            ))}
          </FadeInStagger>
        </div>

        {/* Top Contributors */}
        <FadeIn delay={0.3}>
          <div className="mt-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🏆 Top Contributors
              </h3>
              <p className="text-gray-600">
                Meet the experts shaping the quantum forest consciousness ecosystem
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {contributors.map((contributor, index) => (
                <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200 shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                    {contributor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{contributor.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{contributor.role}</p>
                  <div className="text-xs text-cyan-600 mb-2">{contributor.speciality}</div>
                  <div className="text-lg font-bold text-purple-600">{contributor.contributions}</div>
                  <div className="text-xs text-gray-500">Contributions</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Community Resources */}
        <FadeIn delay={0.4}>
          <div className="mt-16 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 border border-cyan-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-cyan-900 mb-2">
                🚀 Community Resources & Tools
              </h3>
              <p className="text-cyan-700">
                Everything you need to contribute and collaborate effectively
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/community/ide"
                className="group block bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="text-3xl mb-4">💻</div>
                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-cyan-900">
                  Collaborative IDE
                </h4>
                <p className="text-sm text-gray-600">
                  Real-time code editing with multithreaded execution and shared workspaces
                </p>
                {threading.isReady && (
                  <div className="mt-3 text-xs text-cyan-600">
                    ⚡ Multithreading enabled
                  </div>
                )}
              </Link>

              <Link
                href="/community/github"
                className="group block bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="text-3xl mb-4">📚</div>
                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-cyan-900">
                  Open Source
                </h4>
                <p className="text-sm text-gray-600">
                  Contribute to Katalyst's open source ecosystem and earn recognition
                </p>
              </Link>

              <Link
                href="/community/events"
                className="group block bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="text-3xl mb-4">🎪</div>
                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-cyan-900">
                  Events & Meetups
                </h4>
                <p className="text-sm text-gray-600">
                  Join virtual and in-person events, hackathons, and quantum forest workshops
                </p>
              </Link>
            </div>

            {/* Community CTA */}
            <div className="text-center mt-8">
              <Link
                href="/community/join"
                className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span className="mr-2">🌳</span>
                Join the Quantum Forest Community
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Live Community Status */}
            {threading.isReady && (
              <div className="mt-8 bg-white/60 rounded-xl p-4">
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-700">Community Platform Online</span>
                  </div>
                  <div className="text-gray-600">
                    Response Time: &lt;5s
                  </div>
                  <div className="text-gray-600">
                    Threads: {threading.stats?.activeThreads || 0}
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
