'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Crown, Sparkles, Zap, Users, MessageCircle } from 'lucide-react'
import ApiClient from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

const PREMIUM_FEATURES = [
  {
    icon: Zap,
    title: 'Chats Ilimitados',
    description: 'Sin límite de chats diarios, habla con todas las personas que quieras'
  },
  {
    icon: Users,
    title: 'Ver Quién Te Dio Like',
    description: 'Descubre quién está interesado en ti antes de hacer match'
  },
  {
    icon: MessageCircle,
    title: 'Mensajes Prioritarios',
    description: 'Tus mensajes aparecen primero en las conversaciones'
  },
  {
    icon: Crown,
    title: 'Perfil Destacado',
    description: 'Tu perfil aparece más alto en las búsquedas'
  },
  {
    icon: Sparkles,
    title: 'Super Likes',
    description: '5 super likes al día para destacar tu interés'
  },
  {
    icon: Check,
    title: 'Sin Anuncios',
    description: 'Experiencia completamente libre de publicidad'
  }
]

export default function PremiumPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')

  useEffect(() => {
    loadSubscription()
  }, [])

  const loadSubscription = async () => {
    try {
      const { subscription } = await ApiClient.getCurrentSubscription()
      setSubscription(subscription)
    } catch (error) {
      console.error('Error loading subscription:', error)
    }
  }

  const handleSubscribe = async () => {
    try {
      setLoading(true)
      const { url } = await ApiClient.createCheckoutSession(selectedPlan)

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error: any) {
      alert(error.message || 'Error al crear la sesión de pago')
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    try {
      setLoading(true)
      const { url } = await ApiClient.createPortalSession()
      window.location.href = url
    } catch (error: any) {
      alert(error.message || 'Error al abrir el portal')
      setLoading(false)
    }
  }

  if (subscription) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              ¡Eres Premium!
            </h1>
            <p className="text-text-secondary">
              Disfrutando de todos los beneficios
            </p>
          </div>

          <div className="bg-background-card rounded-xl p-8 border border-background-elevated mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Tu Suscripción</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-text-secondary">Estado:</span>
                <span className="text-green-400 font-semibold">Activa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Plan:</span>
                <span className="text-white font-semibold">Premium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Próxima facturación:</span>
                <span className="text-white">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
              {subscription.cancelAtPeriodEnd && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p className="text-yellow-400 text-sm">
                    Tu suscripción se cancelará al final del período actual
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleManageSubscription}
              disabled={loading}
              className="w-full mt-6 px-6 py-3 bg-background-elevated hover:bg-background-hover rounded-lg text-white font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Administrar Suscripción'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PREMIUM_FEATURES.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-background-card border border-background-elevated rounded-xl p-6"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Descubre Premium
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Lleva tus conexiones al siguiente nivel con funciones exclusivas
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {PREMIUM_FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-background-card border border-background-elevated rounded-xl p-6 hover:border-primary-red transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Monthly Plan */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`bg-background-card border-2 rounded-2xl p-8 cursor-pointer transition-all ${
              selectedPlan === 'monthly'
                ? 'border-primary-red scale-105'
                : 'border-background-elevated hover:border-background-hover'
            }`}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Mensual</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-white">$9.99</span>
                <span className="text-text-secondary">/mes</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {['Chats ilimitados', 'Ver quién te dio like', 'Sin anuncios', 'Perfil destacado'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-text-secondary">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Yearly Plan */}
          <div
            onClick={() => setSelectedPlan('yearly')}
            className={`bg-background-card border-2 rounded-2xl p-8 cursor-pointer transition-all relative ${
              selectedPlan === 'yearly'
                ? 'border-primary-red scale-105'
                : 'border-background-elevated hover:border-background-hover'
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Ahorra 33%
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Anual</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-white">$79.99</span>
                <span className="text-text-secondary">/año</span>
              </div>
              <p className="text-sm text-text-secondary mt-2">$6.67/mes</p>
            </div>
            <ul className="space-y-3 mb-8">
              {['Todos los beneficios Premium', '2 meses gratis', 'Soporte prioritario', 'Acceso temprano a funciones'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-text-secondary">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="px-12 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? 'Procesando...' : 'Suscribirse Ahora'}
          </button>
          <p className="text-text-secondary text-sm mt-4">
            Cancela cuando quieras. Sin compromisos.
          </p>
        </div>
      </div>
    </div>
  )
}
