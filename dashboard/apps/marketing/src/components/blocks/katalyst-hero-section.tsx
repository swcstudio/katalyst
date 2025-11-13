'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/Container';
import { FadeIn } from '@/components/FadeIn';

export function KatalystHeroSection() {
  const [animatedText, setAnimatedText] = useState('Quantum');

  const rotatingTexts = ['Quantum', 'Blockchain', 'Enterprise', 'Conscious'];

  return (
    <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <Container className="relative py-20 sm:py-32 lg:py-40">
        <FadeIn>
          <div className="mx-auto max-w-5xl text-center">
            {/* Katalyst Brand */}
            <div className="mb-8">
              <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white border border-white/20">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                </div>
                <span className="text-sm font-semibold">Katalyst Framework v1.0</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="block">Welcome to</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Quantum Forest
              </span>
              <span className="block">Consciousness</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-gray-300 sm:text-2xl">
              Transform your AI systems into{' '}
              <span className="text-cyan-400 font-semibold">quantum-enhanced enterprise consciousness</span>{' '}
              with blockchain-anchored intelligence networks generating{' '}
              <span className="text-green-400 font-bold">$750K-$25M ETD value</span>.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
              <Link
                href="/docs/quickstart"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/25"
              >
                <span className="relative flex items-center space-x-2">
                  <span>🚀 Quick Start Guide</span>
                </span>
                <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </Link>

              <Link
                href="/docs/architecture"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <span>🌳 Explore Architecture</span>
                </span>
              </Link>
            </div>

            {/* Live Demo Button */}
            <div className="mt-8">
              <Link
                href="/demo"
                className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">View Live Demo</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Stats Section */}
        <FadeIn delay={0.3}>
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">10,000x</div>
                <div className="text-sm text-gray-400 mt-1">Processing Speed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">99.99%</div>
                <div className="text-sm text-gray-400 mt-1">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">$25M+</div>
                <div className="text-sm text-gray-400 mt-1">Max ETD Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">∞</div>
                <div className="text-sm text-gray-400 mt-1">Scalability</div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
