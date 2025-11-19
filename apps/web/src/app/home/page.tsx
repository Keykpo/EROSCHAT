'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // TODO: Check if user has profile, if not redirect to onboarding
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Ero Chat!</h1>
        <p className="text-gray-400 mb-8">
          Home page coming soon...
        </p>
        <div className="bg-background-card p-8 rounded-lg border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">What's Next?</h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-500/10 text-primary-400 flex items-center justify-center flex-shrink-0">
                🔥
              </div>
              <div>
                <h3 className="font-semibold">Matching Algorithm</h3>
                <p className="text-sm text-gray-400">Find compatible people based on your preferences</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-500/10 text-primary-400 flex items-center justify-center flex-shrink-0">
                💬
              </div>
              <div>
                <h3 className="font-semibold">Anonymous Chat</h3>
                <p className="text-sm text-gray-400">Chat without revealing identity until mutual match</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-500/10 text-primary-400 flex items-center justify-center flex-shrink-0">
                ❤️
              </div>
              <div>
                <h3 className="font-semibold">Match & Reveal</h3>
                <p className="text-sm text-gray-400">When both like each other, profiles are revealed</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => useAuthStore.getState().logout()}
          className="mt-6 px-6 py-2 border border-gray-800 hover:bg-background-hover rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
