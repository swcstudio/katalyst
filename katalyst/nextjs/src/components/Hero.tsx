interface HeroProps {
  data?: {
    title: string;
    subtitle: string;
    cta: string;
  };
}

export function Hero({ data }: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          {data?.title || 'Katalyst React 19 Framework'}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
          {data?.subtitle || 'Build lightning-fast web applications with our State-of-the-Art React 19 framework'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button type="button" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            {data?.cta || 'Get Started Today'}
          </button>
          <button type="button" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
            View Documentation
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="opacity-90">Built with RSpack and optimized for maximum performance</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-2">🔧</div>
            <h3 className="text-xl font-semibold mb-2">Developer Experience</h3>
            <p className="opacity-90">TypeScript-first with hot reload and instant feedback</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Production Ready</h3>
            <p className="opacity-90">Deploy to Vercel, AWS, or any cloud platform</p>
          </div>
        </div>
      </div>
    </section>
  );
}
