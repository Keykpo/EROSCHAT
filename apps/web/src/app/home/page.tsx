'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { ApiClient } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'
import { Loader2, Search, Users, Clock, Heart, LogOut } from 'lucide-react'

const MOTIVATIONAL_MESSAGES = [
  "Buscando tu conexión perfecta...",
  "Analizando compatibilidades...",
  "La química está a punto de suceder...",
  "Encontrando mentes afines...",
  "Preparando conversaciones interesantes...",
  "Tu próxima aventura está cerca...",
  "Conectando energías compatibles...",
  "Buscando tu match ideal..."
]

interface QueueStatus {
  inQueue: boolean
  position?: number
  estimatedWaitTime?: number
  usersInQueue?: number
}

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  const [isSearching, setIsSearching] = useState(false)
  const [queueStatus, setQueueStatus] = useState<QueueStatus>({ inQueue: false })
  const [currentMessage, setCurrentMessage] = useState(0)
  const [error, setError] = useState('')

  // WebSocket integration for real-time match notifications
  const { connected } = useWebSocket({
    onMatchFound: (data) => {
      console.log('Match found via WebSocket!', data)
      // Redirect to chat
      router.push(`/chat/${data.chatId}`)
    },
    onQueueUpdate: (data) => {
      console.log('Queue update via WebSocket:', data)
      setQueueStatus({
        inQueue: true,
        position: data.position,
        estimatedWaitTime: data.estimatedWaitTime,
        usersInQueue: data.usersInQueue,
      })
    },
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!user?.hasProfile) {
      router.push('/onboarding')
      return
    }

    // Check if user is already in queue
    checkQueueStatus()
  }, [isAuthenticated, user, router])

  // Rotate motivational messages while searching
  useEffect(() => {
    if (!isSearching) return

    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isSearching])

  // Poll queue status while searching
  useEffect(() => {
    if (!isSearching) return

    const interval = setInterval(() => {
      checkQueueStatus()
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [isSearching])

  const checkQueueStatus = async () => {
    try {
      const status = await ApiClient.getMatchingStatus()
      setQueueStatus(status)

      if (status.inQueue && !isSearching) {
        setIsSearching(true)
      }
    } catch (err: any) {
      console.error('Error checking queue status:', err)
    }
  }

  const handleStartSearch = async () => {
    setError('')
    setIsSearching(true)

    try {
      const response = await ApiClient.joinMatchingQueue()

      if (response.matched) {
        // Match found! Redirect to chat
        router.push(`/chat/${response.chatId}`)
      } else {
        // Added to queue
        setQueueStatus({
          inQueue: true,
          position: response.queuePosition,
          estimatedWaitTime: response.estimatedWaitTime,
          usersInQueue: response.usersInQueue
        })
      }
    } catch (err: any) {
      setError(err.message || 'Error al unirse a la búsqueda')
      setIsSearching(false)
    }
  }

  const handleCancelSearch = async () => {
    try {
      await ApiClient.leaveMatchingQueue()
      setIsSearching(false)
      setQueueStatus({ inQueue: false })
    } catch (err: any) {
      setError(err.message || 'Error al salir de la búsqueda')
    }
  }

  const handleLogout = () => {
    useAuthStore.getState().logout()
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-800 bg-background-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent">
              Ero Chat
            </h1>
            <p className="text-sm text-gray-400">Hola, {user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white border border-gray-800 hover:bg-background-hover rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            {isSearching ? 'Buscando tu match...' : 'Encuentra tu conexión perfecta'}
          </h2>
          <p className="text-gray-400">
            {isSearching
              ? 'Estamos buscando personas compatibles contigo'
              : 'Presiona el botón para comenzar a buscar un chat anónimo'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-center">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Search Button or Searching State */}
        <div className="bg-background-card rounded-lg border border-gray-800 p-8">
          {!isSearching ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-500/10 text-primary-400 mb-6">
                <Search className="w-10 h-10" />
              </div>

              <h3 className="text-xl font-semibold mb-4">
                ¿Listo para conectar?
              </h3>

              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Nuestro algoritmo encontrará personas compatibles contigo basándose en tus
                preferencias, intereses y ubicación.
              </p>

              <button
                onClick={handleStartSearch}
                className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-3 mx-auto"
              >
                <Search className="w-5 h-5" />
                Buscar Chat
              </button>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 mb-2">
                    <Users className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold text-white">{user.credits || 0}</p>
                  <p className="text-xs text-gray-500">Créditos</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-400 mb-2">
                    <Heart className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-xs text-gray-500">Matches</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 mb-2">
                    <Clock className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {user.isPremium ? '∞' : '3'}
                  </p>
                  <p className="text-xs text-gray-500">Chats/Día</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              {/* Loading Spinner */}
              <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-primary-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"></div>
                <Search className="w-12 h-12 text-primary-400" />
              </div>

              {/* Motivational Message */}
              <h3 className="text-2xl font-semibold mb-2">
                {MOTIVATIONAL_MESSAGES[currentMessage]}
              </h3>

              {/* Queue Info */}
              {queueStatus.inQueue && (
                <div className="mt-6 space-y-2">
                  {queueStatus.position !== undefined && (
                    <p className="text-gray-400">
                      Posición en cola: <span className="text-white font-semibold">#{queueStatus.position}</span>
                    </p>
                  )}
                  {queueStatus.usersInQueue !== undefined && (
                    <p className="text-gray-400">
                      Usuarios buscando: <span className="text-white font-semibold">{queueStatus.usersInQueue}</span>
                    </p>
                  )}
                  {queueStatus.estimatedWaitTime !== undefined && (
                    <p className="text-gray-400">
                      Tiempo estimado: <span className="text-white font-semibold">~{queueStatus.estimatedWaitTime}s</span>
                    </p>
                  )}
                </div>
              )}

              {/* Cancel Button */}
              <button
                onClick={handleCancelSearch}
                className="mt-8 px-6 py-3 border border-gray-800 hover:bg-background-hover text-white rounded-lg transition-colors"
              >
                Cancelar Búsqueda
              </button>

              <p className="text-xs text-gray-500 mt-6">
                Mantén esta ventana abierta. Serás redirigido automáticamente cuando encontremos un match.
              </p>
            </div>
          )}
        </div>

        {/* How it Works */}
        {!isSearching && (
          <div className="mt-12 bg-background-card rounded-lg border border-gray-800 p-8">
            <h3 className="text-xl font-semibold mb-6 text-center">¿Cómo funciona?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-500/10 text-primary-400 mb-3">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-2">Buscar</h4>
                <p className="text-sm text-gray-400">
                  Presiona el botón y nuestro algoritmo buscará personas compatibles
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-500/10 text-primary-400 mb-3">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-2">Chatear</h4>
                <p className="text-sm text-gray-400">
                  Conversa de forma anónima. Ninguno conoce la identidad del otro
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-500/10 text-primary-400 mb-3">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h4 className="font-semibold mb-2">Revelar</h4>
                <p className="text-sm text-gray-400">
                  Si ambos hacen match, los perfiles se revelan automáticamente
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
