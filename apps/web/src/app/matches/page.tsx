'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { ApiClient } from '@/lib/api'
import {
  Heart,
  MessageCircle,
  User,
  Loader2,
  ArrowLeft,
  Trash2,
  X,
  Check,
  MapPin,
  Sparkles,
} from 'lucide-react'

interface Match {
  id: string
  chatId: string
  matchedAt: Date
  otherUser: {
    id: string
    email: string
    isPremium: boolean
  }
  profile: {
    username: string
    gender: string
    age: number
    city?: string
    bio?: string
    photos: string[]
    interests: string[]
    lookingFor: string[]
  } | null
  lastMessage: {
    content: string
    senderId: string
    createdAt: Date
  } | null
  unreadCount: number
}

export default function MatchesPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [showUnmatchModal, setShowUnmatchModal] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    loadMatches()
    loadStats()
  }, [isAuthenticated, router])

  const loadMatches = async () => {
    try {
      setLoading(true)
      const data = await ApiClient.getUserMatches()
      setMatches(data.matches)
    } catch (error: any) {
      console.error('Error loading matches:', error)
      alert(error.message || 'Error al cargar matches')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const data = await ApiClient.getMatchStats()
      setStats(data)
    } catch (error: any) {
      console.error('Error loading stats:', error)
    }
  }

  const handleUnmatch = (match: Match) => {
    setSelectedMatch(match)
    setShowUnmatchModal(true)
  }

  const confirmUnmatch = async () => {
    if (!selectedMatch) return

    try {
      await ApiClient.unmatch(selectedMatch.id)
      setShowUnmatchModal(false)
      setSelectedMatch(null)

      // Remove from list
      setMatches((prev) => prev.filter((m) => m.id !== selectedMatch.id))

      // Reload stats
      loadStats()

      alert('Match eliminado exitosamente')
    } catch (error: any) {
      console.error('Error unmatching:', error)
      alert(error.message || 'Error al eliminar match')
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const messageDate = new Date(date)
    const diffMs = now.getTime() - messageDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    return `${diffDays}d`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background-card border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/home')}
              className="p-2 hover:bg-background-hover rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Mis Matches</h1>
          </div>

          {stats && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 text-primary-400 rounded-lg">
              <Heart className="w-4 h-4" fill="currentColor" />
              <span className="text-sm font-semibold">{stats.totalMatches}</span>
            </div>
          )}
        </div>
      </header>

      {/* Stats */}
      {stats && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-background-card rounded-lg p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-white mb-1">{stats.totalMatches}</div>
              <div className="text-xs text-gray-400">Matches</div>
            </div>
            <div className="bg-background-card rounded-lg p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-white mb-1">{stats.totalChats}</div>
              <div className="text-xs text-gray-400">Chats</div>
            </div>
            <div className="bg-background-card rounded-lg p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {Math.round(stats.matchRate)}%
              </div>
              <div className="text-xs text-gray-400">Tasa de Match</div>
            </div>
          </div>
        </div>
      )}

      {/* Matches List */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        {matches.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-4">
              <Heart className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No tienes matches aún
            </h2>
            <p className="text-gray-400 mb-6">
              Empieza a chatear y encuentra a personas compatibles
            </p>
            <button
              onClick={() => router.push('/home')}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Buscar Chat
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-background-card rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Profile Photo */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                      {match.profile?.photos && match.profile.photos.length > 0 ? (
                        <img
                          src={match.profile.photos[0]}
                          alt={match.profile.username}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-avatar.png'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                    </div>
                    {match.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {match.unreadCount > 9 ? '9+' : match.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {match.profile?.username || 'Usuario'}
                      </h3>
                      {match.profile?.age && (
                        <span className="text-gray-400">{match.profile.age}</span>
                      )}
                      {match.otherUser.isPremium && (
                        <div className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded font-semibold">
                          PRO
                        </div>
                      )}
                    </div>

                    {match.profile?.city && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                        <MapPin className="w-3 h-3" />
                        {match.profile.city}
                      </div>
                    )}

                    {match.lastMessage ? (
                      <p className="text-sm text-gray-400 truncate">
                        {match.lastMessage.senderId === user?.id && 'Tú: '}
                        {match.lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        ¡Match nuevo! Envía un mensaje
                      </p>
                    )}
                  </div>

                  {/* Time */}
                  {match.lastMessage && (
                    <div className="text-xs text-gray-500">
                      {formatTime(match.lastMessage.createdAt)}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/chat/${match.chatId}`)}
                      className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                      title="Abrir chat"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleUnmatch(match)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                      title="Eliminar match"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Interests Preview */}
                {match.profile?.interests && match.profile.interests.length > 0 && (
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Sparkles className="w-3 h-3 text-gray-500" />
                      {match.profile.interests.slice(0, 3).map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-primary-500/10 text-primary-400 rounded-full text-xs border border-primary-500/20"
                        >
                          {interest}
                        </span>
                      ))}
                      {match.profile.interests.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{match.profile.interests.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unmatch Confirmation Modal */}
      {showUnmatchModal && selectedMatch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background-card rounded-lg p-6 max-w-md w-full border border-gray-800">
            <h3 className="text-xl font-bold mb-2">¿Eliminar Match?</h3>
            <p className="text-gray-400 mb-6">
              ¿Estás seguro que quieres eliminar el match con{' '}
              <span className="text-white font-semibold">
                {selectedMatch.profile?.username || 'este usuario'}
              </span>
              ? Esta acción no se puede deshacer y no podrán volver a hacer match.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUnmatchModal(false)
                  setSelectedMatch(null)
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
                Cancelar
              </button>
              <button
                onClick={confirmUnmatch}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <Check className="w-5 h-5" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
