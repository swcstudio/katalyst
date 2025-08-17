import { useQuery } from '@tanstack/react-query';
import { Features } from './Features.tsx';
import { Hero } from './Hero.tsx';
import { Pricing } from './Pricing.tsx';

export default function Marketing() {
  const { data: marketingData } = useQuery({
    queryKey: ['marketing-data'],
    queryFn: () => ({
      hero: {
        title: 'Katalyst-React Framework',
        subtitle:
          'Build lightning-fast web applications with our State-of-the-Art React 19 framework',
        cta: 'Get Started Today',
      },
      stats: {
        users: '10,000+',
        projects: '5,000+',
        performance: '99.9%',
        satisfaction: '4.9/5',
      },
    }),
  });

  return (
    <div className="marketing-site">
      <Hero data={marketingData?.hero} />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{marketingData?.stats.users}</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {marketingData?.stats.projects}
              </div>
              <div className="text-gray-600">Projects Built</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {marketingData?.stats.performance}
              </div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {marketingData?.stats.satisfaction}
              </div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <Pricing />

      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Something Amazing?</h2>
          <p className="text-xl mb-8">
            Join thousands of developers using Katalyst to create exceptional web experiences.
          </p>
          <button
            type="button"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}
