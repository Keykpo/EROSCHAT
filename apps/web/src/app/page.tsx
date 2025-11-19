import Link from 'next/link'
import { Heart, MessageCircle, Eye, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent">
              Connect Mentally<br />Before Physically
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Anonymous chat that reveals only when you both match.
              Break the superficial barrier and connect through conversation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors text-lg"
              >
                Get Started Free
              </Link>

              <Link
                href="/login"
                className="px-8 py-4 border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10 font-semibold rounded-lg transition-colors text-lg"
              >
                Sign In
              </Link>
            </div>

            <p className="text-gray-500 mt-4">
              18+ Only • Free to start • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Feature
              icon={<MessageCircle className="w-8 h-8" />}
              title="Anonymous Chat"
              description="Start with a completely anonymous 20-minute chat. No photos, no names, just conversation."
            />

            <Feature
              icon={<Heart className="w-8 h-8" />}
              title="Mutual Match"
              description="Both users must agree to reveal identities. If there's chemistry, take it to the next level."
            />

            <Feature
              icon={<Eye className="w-8 h-8" />}
              title="Reveal & Connect"
              description="When you both match, profiles are revealed and chat becomes permanent."
            />

            <Feature
              icon={<Shield className="w-8 h-8" />}
              title="Safe & Secure"
              description="Advanced moderation, report system, and strict privacy controls keep you safe."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Connect Beyond the Surface?
          </h2>

          <p className="text-xl text-gray-300 mb-8">
            Join thousands of people discovering authentic connections.
          </p>

          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors text-lg"
          >
            Start Chatting Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-card py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2025 Ero Chat. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <Link href="/terms" className="hover:text-primary-400">Terms</Link>
              <Link href="/privacy" className="hover:text-primary-400">Privacy</Link>
              <Link href="/guidelines" className="hover:text-primary-400">Guidelines</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/10 text-primary-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
