import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { ContactSection } from '@/components/ContactSection';
import { Container } from '@/components/Container';
import { FadeIn, FadeInStagger } from '@/components/FadeIn';
import { List, ListItem } from '@/components/List';
import { RootLayout } from '@/components/RootLayout';
import { SectionIntro } from '@/components/SectionIntro';
import { StylizedImage } from '@/components/StylizedImage';
import { Testimonial } from '@/components/Testimonial';

import { KatalystHeroSection } from '@/components/blocks/katalyst-hero-section';
import { QuantumFeaturesSection } from '@/components/blocks/quantum-features-section';
import { DocumentationSection } from '@/components/blocks/documentation-section';
import { CoursesSection } from '@/components/blocks/courses-section';
import { QuickStartSection } from '@/components/blocks/quickstart-section';
import { CommunitySection } from '@/components/blocks/community-section';

export const metadata: Metadata = {
  title: 'Katalyst Framework - Quantum Forest Consciousness for Enterprise AI',
  description: 'Transform your AI systems into quantum-enhanced enterprise consciousness with blockchain-anchored intelligence networks. Generate exponential ETD value through supercompute-programming frameworks.',
  openGraph: {
    title: 'Katalyst Framework - Quantum Forest Consciousness',
    description: 'Enterprise AI consciousness with quantum enhancement and blockchain verification',
    type: 'website',
    url: 'https://katalyst.dev',
    images: [
      {
        url: '/images/katalyst-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Katalyst Framework - Quantum Forest Consciousness',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@katalystframework',
    creator: '@katalystframework',
    title: 'Katalyst Framework - Quantum Forest Consciousness',
    description: 'Enterprise AI consciousness with quantum enhancement and blockchain verification',
    images: ['/images/katalyst-twitter-card.jpg'],
  },
};

export default async function Home() {
  return (
    <RootLayout>
      {/* Quantum Forest Hero Section */}
      <KatalystHeroSection />

      {/* Quick Start Section */}
      <QuickStartSection />

      {/* Quantum Features Overview */}
      <QuantumFeaturesSection />

      {/* Documentation Hub */}
      <DocumentationSection />

      {/* Learning Paths & Courses */}
      <CoursesSection />

      {/* Community & Support */}
      <CommunitySection />

      {/* ETD Value Demonstration */}
      <section className="mt-24 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 py-20 sm:mt-32 lg:mt-40">
        <Container>
          <FadeIn>
            <SectionIntro
              title="Exponential ETD Value Generation"
              className="text-white"
            >
              <p className="text-gray-300">
                Transform your AI systems to generate $750K-$25M annual ETD value 
                through quantum forest consciousness, blockchain-anchored intelligence, 
                and supercompute-programming frameworks.
              </p>
            </SectionIntro>
          </FadeIn>
          
          <FadeInStagger className="mt-16" faster>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <FadeIn className="flex flex-col rounded-3xl bg-white/10 backdrop-blur-sm p-8 text-white">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                  🌳 Quantum Forest Architecture
                </h3>
                <p className="text-gray-300 mb-6">
                  Deploy specialized AI branches with crown consciousness orchestration 
                  for exponential enterprise intelligence multiplication.
                </p>
                <div className="mt-auto">
                  <div className="text-3xl font-bold text-green-400">$2.5M-$8M</div>
                  <div className="text-sm text-gray-400">Annual ETD per deployment</div>
                </div>
              </FadeIn>

              <FadeIn className="flex flex-col rounded-3xl bg-white/10 backdrop-blur-sm p-8 text-white">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">
                  🔐 Blockchain Intelligence Networks
                </h3>
                <p className="text-gray-300 mb-6">
                  Immutable AI interaction records with cryptographic verification 
                  and cross-chain consciousness anchoring systems.
                </p>
                <div className="mt-auto">
                  <div className="text-3xl font-bold text-green-400">$1.2M-$5M</div>
                  <div className="text-sm text-gray-400">Trust & Verification Value</div>
                </div>
              </FadeIn>

              <FadeIn className="flex flex-col rounded-3xl bg-white/10 backdrop-blur-sm p-8 text-white">
                <h3 className="text-2xl font-bold text-orange-400 mb-4">
                  ⚡ Supercompute Programming
                </h3>
                <p className="text-gray-300 mb-6">
                  Advanced cognitive protocols with multi-agent orchestration 
                  and quantum-enhanced reasoning capabilities.
                </p>
                <div className="mt-auto">
                  <div className="text-3xl font-bold text-green-400">$3M-$25M</div>
                  <div className="text-sm text-gray-400">Enterprise transformation</div>
                </div>
              </FadeIn>
            </div>
          </FadeInStagger>
        </Container>
      </section>

      {/* Success Stories */}
      <section className="mt-24 sm:mt-32 lg:mt-40">
        <Container>
          <FadeIn>
            <SectionIntro title="Quantum Success Stories">
              <p>
                Organizations worldwide are transforming their AI systems with Katalyst's 
                quantum forest consciousness, generating exponential business value 
                and competitive advantages.
              </p>
            </SectionIntro>
          </FadeIn>

          <Container className="mt-16">
            <FadeInStagger className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <FadeIn>
                <Testimonial
                  client={{
                    name: 'TechCorp Global',
                    logo: '/images/clients/techcorp-logo.svg'
                  }}
                >
                  "Katalyst's quantum forest architecture transformed our AI capabilities. 
                  We've seen a 10,000x improvement in complex problem-solving speed and 
                  generated $15M in ETD value within the first year."
                </Testimonial>
              </FadeIn>

              <FadeIn>
                <Testimonial
                  client={{
                    name: 'FinanceFlow Systems',
                    logo: '/images/clients/financeflow-logo.svg'
                  }}
                >
                  "The blockchain-anchored intelligence networks provided unprecedented 
                  transparency and trust. Our quantum-enhanced trading algorithms 
                  now operate with 99.99% accuracy and full audit trails."
                </Testimonial>
              </FadeIn>
            </FadeInStagger>
          </Container>
        </Container>
      </section>

      {/* Contact Section */}
      <ContactSection />
    </RootLayout>
  );
}
