"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Paintbrush,
  ArrowRight,
  Github,
  Share2,
  Palette,
  Users,
  Menu,
  X
} from 'lucide-react';

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black px-6">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300  ${isScrolled ? 'bg-black/95 backdrop-blur-sm shadow-lg' : ''} py-6`}>
        <div className="container mx-auto ">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <Paintbrush className="h-9 w-9 text-emerald-400 transition-transform group-hover:rotate-12" />
                <div className="absolute -inset-1 bg-emerald-400 rounded-full opacity-10 group-hover:opacity-20 blur transition-opacity"></div>
              </div>
              <span className="text-2xl font-bold text-white">DoodleVerse</span>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              <a href="#features" className="text-gray-300 hover:text-emerald-400 transition-colors">Features</a>
              <a href="#about" className="text-gray-300 hover:text-emerald-400 transition-colors">About</a>
              <div className="flex items-center space-x-6">
                <Link href="/signin" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" className="relative group">
                  <span className="absolute -inset-0.5 bg-emerald-500 rounded-full blur opacity-30 group-hover:opacity-50 transition"></span>
                  <span className="relative bg-black text-emerald-400 px-7 py-3 rounded-full border border-emerald-500/50 hover:bg-gray-900 transition-colors inline-block">
                    Sign Up
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4 bg-black/95 backdrop-blur-sm rounded-lg p-4`}>
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-300 hover:text-emerald-400 transition-colors">Features</a>
              <a href="#about" className="text-gray-300 hover:text-emerald-400 transition-colors">About</a>
              <Link href="/signin" className="text-gray-300 hover:text-emerald-400 transition-colors">Sign In</Link>
              <Link href="/signup" className="bg-emerald-500 text-white px-6 py-2 rounded-full hover:bg-emerald-400 transition-colors text-center">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div className="relative z-10">
            <div className="inline-block">
              <div className="inline-flex items-center rounded-full px-6 py-2 border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm mb-6">
                <div className="h-2 w-2 rounded-full bg-emerald-400 mr-3 animate-pulse"></div>
                <span className="text-sm text-emerald-400">Now in public beta</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Collaborate & Create in{' '}
              <span className="text-emerald-400">
                Real-time Drawing
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Transform your ideas into reality with DoodleVerse's collaborative canvas.
              Draw together in real-time and bring your creative visions to life.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5">
              <Link href="/signup" className="group relative">
                <span className="absolute -inset-0.5 bg-emerald-500 rounded-full blur opacity-30 group-hover:opacity-50 transition"></span>
                <span className="relative bg-emerald-500 text-white px-9 py-4 rounded-full hover:bg-emerald-400 transition-colors flex items-center justify-center">
                  Try Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <button className="relative group">
                <span className="relative border border-gray-700 text-white px-9 py-4 rounded-full hover:border-emerald-500/50 transition-colors flex items-center justify-center">
                  <Github className="mr-2 h-5 w-5" /> GitHub
                </span>
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-emerald-500 rounded-3xl blur-lg opacity-10 group-hover:opacity-20 transition"></div>
            <div className="relative">
              <img
                src="/api/placeholder/600/400"
                alt="Collaborative Drawing"
                className="rounded-3xl shadow-2xl w-full object-cover"
              />
              <div className="absolute -bottom-7 -left-7 bg-black/90 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs text-white">
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">12 artists online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 border-t border-gray-900" id="features">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-20">
            Everything you need to{' '}
            <span className="text-emerald-400">
              create together
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Share2 className="h-9 w-9 text-emerald-400" />}
              title="Real-time Collaboration"
              description="Draw and design together with your team in real-time, no matter where they are."
            />
            <FeatureCard
              icon={<Users className="h-9 w-9 text-emerald-400" />}
              title="Team Workspace"
              description="Create shared workspaces for your team to collaborate on multiple projects."
            />
            <FeatureCard
              icon={<Palette className="h-9 w-9 text-emerald-400" />}
              title="Infinite Canvas"
              description="Unlimited space to bring your ideas to life with our infinite canvas technology."
            />
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-gray-900 py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Paintbrush className="h-7 w-7 text-emerald-400" />
              <span className="text-xl font-bold text-white">DoodleVerse</span>
            </div>
            <div className="flex items-center space-x-6 text-gray-400">
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Contact</a>
            </div>
            <p className="text-gray-400">© 2025 DoodleVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group p-7 bg-black/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-emerald-500/30 transition-all hover:bg-black/70">
      <div className="relative inline-block mb-5">
        <div className="absolute -inset-2 bg-emerald-400 rounded-full opacity-10 group-hover:opacity-20 blur transition-opacity"></div>
        <div className="relative">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-emerald-400 transition-colors">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

interface StatCardProps {
  number: string;
  label: string;
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="group p-7 bg-black/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-emerald-500/30 transition-all text-center">
      <div className="text-4xl font-bold text-emerald-400 mb-3">
        {number}
      </div>
      <div className="text-gray-300">{label}</div>
    </div>
  );
}

export default LandingPage;