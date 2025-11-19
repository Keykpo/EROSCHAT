'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Crown } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function PremiumSuccessPage() {
  const router = useRouter()
  const { refreshUser } = useAuthStore()

  useEffect(() => {
    // Refresh user to get updated premium status
    refreshUser()
  }, [refreshUser])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-background-card border border-background-elevated rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            ¡Pago Exitoso!
          </h1>

          <p className="text-xl text-text-secondary mb-8">
            Ahora eres un miembro Premium de Ero Chat
          </p>

          <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Bienvenido a Premium</h2>
            </div>
            <p className="text-text-secondary">
              Ya puedes disfrutar de todos los beneficios exclusivos
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-background-elevated rounded-lg p-4">
              <p className="text-text-secondary text-sm mb-1">Chats Diarios</p>
              <p className="text-2xl font-bold text-white">Ilimitados</p>
            </div>
            <div className="bg-background-elevated rounded-lg p-4">
              <p className="text-text-secondary text-sm mb-1">Super Likes</p>
              <p className="text-2xl font-bold text-white">5/día</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/home')}
              className="flex-1 px-6 py-3 bg-primary-red hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              Empezar a Chatear
            </button>
            <button
              onClick={() => router.push('/premium')}
              className="flex-1 px-6 py-3 bg-background-elevated hover:bg-background-hover text-white font-semibold rounded-lg transition-colors"
            >
              Ver Beneficios
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
