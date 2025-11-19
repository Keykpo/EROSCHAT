'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { ApiClient } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'
import MatchCelebrationModal from '@/components/MatchCelebrationModal'
import {
  Send,
  Heart,
  Clock,
  User,
  X,
  Check,
  Loader2,
  ArrowLeft,
} from 'lucide-react'

interface Message {
  id: string
  senderId: string
  content: string
  type: 'TEXT' | 'IMAGE' | 'SYSTEM'
  createdAt: Date
  readBy: string[]
}

interface Chat {
  id: string
  status: 'ACTIVE' | 'ENDED' | 'MATCHED'
  createdAt: Date
  endsAt: Date
  otherUserId: string
  matchStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  matchRequestedBy?: string
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const chatId = params.chatId as string

  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [showMatchRequest, setShowMatchRequest] = useState(false)
  const [showMatchCelebration, setShowMatchCelebration] = useState(false)
  const [revealedProfile, setRevealedProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // WebSocket integration
  const { socket, emit } = useWebSocket({
    onMatchFound: (data) => {
      // Already matched, do nothing
    },
    onNewMessage: (data) => {
      if (data.chatId === chatId) {
        setMessages((prev) => [...prev, data.message])
        scrollToBottom()
      }
    },
    onMatchRevealed: (data) => {
      if (data.chatId === chatId) {
        // Match revealed! Show celebration
        setChat((prev) => prev ? { ...prev, status: 'MATCHED' } : null)
        setRevealedProfile(data.profile)
        setShowMatchCelebration(true)
      }
    },
  })

  // Initialize chat and join room
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    loadChat()
    loadMessages()

    // Join chat room via WebSocket
    if (socket) {
      emit('chat:join', { chatId })

      // Listen for typing indicators
      socket.on('user-typing', () => {
        setOtherUserTyping(true)
      })

      socket.on('user-stopped-typing', () => {
        setOtherUserTyping(false)
      })

      // Listen for match request
      socket.on('match:requested', (data) => {
        setShowMatchRequest(true)
      })

      // Listen for chat ended
      socket.on('chat:ended', (data) => {
        alert(data.message)
        router.push('/home')
      })

      // Listen for new messages
      socket.on('message:received', (message) => {
        setMessages((prev) => [...prev, message])
        scrollToBottom()
      })
    }

    return () => {
      if (socket) {
        emit('chat:leave', { chatId })
        socket.off('user-typing')
        socket.off('user-stopped-typing')
        socket.off('match:requested')
        socket.off('chat:ended')
        socket.off('message:received')
      }
    }
  }, [chatId, socket, isAuthenticated, router])

  // Timer countdown
  useEffect(() => {
    if (!chat) return

    const calculateTimeRemaining = () => {
      const now = new Date().getTime()
      const end = new Date(chat.endsAt).getTime()
      const remaining = Math.max(0, end - now)
      setTimeRemaining(remaining)

      if (remaining === 0) {
        // Chat ended
        alert('El chat ha terminado.')
        router.push('/home')
      }
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [chat, router])

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadChat = async () => {
    try {
      const data = await ApiClient.getChat(chatId)
      setChat(data)
    } catch (error: any) {
      console.error('Error loading chat:', error)
      alert(error.message || 'Error al cargar el chat')
      router.push('/home')
    }
  }

  const loadMessages = async () => {
    try {
      setLoading(true)
      const data = await ApiClient.getChatMessages(chatId)
      setMessages(data.messages)
    } catch (error: any) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || sending) return

    setSending(true)

    try {
      const message = await ApiClient.sendMessage(chatId, newMessage.trim())

      // Add message to list
      setMessages((prev) => [...prev, message])

      // Broadcast via WebSocket
      emit('message:sent', { chatId, message })

      // Clear input
      setNewMessage('')

      // Stop typing indicator
      emit('typing:stop', { chatId })
    } catch (error: any) {
      console.error('Error sending message:', error)
      alert(error.message || 'Error al enviar el mensaje')
    } finally {
      setSending(false)
    }
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)

    // Emit typing indicator
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true)
      emit('typing:start', { chatId })
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      emit('typing:stop', { chatId })
    }, 1000)
  }

  const handleRequestMatch = async () => {
    try {
      await ApiClient.requestMatch(chatId)
      setChat((prev) => prev ? { ...prev, matchStatus: 'PENDING', matchRequestedBy: user?.id } : null)

      // Broadcast via WebSocket
      emit('match:request', { chatId })

      alert('Solicitud de match enviada ❤️')
    } catch (error: any) {
      console.error('Error requesting match:', error)
      alert(error.message || 'Error al solicitar match')
    }
  }

  const handleRespondToMatch = async (accept: boolean) => {
    try {
      const result = await ApiClient.respondToMatchRequest(chatId, accept)

      setShowMatchRequest(false)

      if (accept && result.matched) {
        setChat((prev) => prev ? { ...prev, status: 'MATCHED', matchStatus: 'ACCEPTED' } : null)
        alert('¡Es un Match! 🎉\n\nLos perfiles han sido revelados')
      } else {
        alert('Match rechazado')
      }

      // Broadcast via WebSocket
      emit('match:respond', { chatId, accepted: accept })
    } catch (error: any) {
      console.error('Error responding to match:', error)
      alert(error.message || 'Error al responder')
    }
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  if (loading || !chat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-background-card border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/home')}
            className="p-2 hover:bg-background-hover rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h2 className="font-semibold">Anónimo</h2>
              <p className="text-xs text-gray-400">
                {otherUserTyping ? 'Escribiendo...' : 'En línea'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
            timeRemaining < 300000 ? 'bg-red-500/10 text-red-400' : 'bg-gray-800 text-gray-300'
          }`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm font-semibold">
              {formatTime(timeRemaining)}
            </span>
          </div>

          {/* Match Button */}
          {chat.status === 'ACTIVE' && chat.matchStatus !== 'PENDING' && (
            <button
              onClick={handleRequestMatch}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Match</span>
            </button>
          )}

          {chat.matchStatus === 'PENDING' && chat.matchRequestedBy === user?.id && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Esperando...</span>
            </div>
          )}
        </div>
      </header>

      {/* Match Request Modal */}
      {showMatchRequest && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background-card rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-2">Solicitud de Match ❤️</h3>
            <p className="text-gray-400 mb-6">
              La otra persona quiere hacer match contigo. ¿Aceptas revelar los perfiles?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleRespondToMatch(false)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
                Rechazar
              </button>
              <button
                onClick={() => handleRespondToMatch(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
              >
                <Check className="w-5 h-5" />
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>No hay mensajes aún</p>
            <p className="text-sm">¡Rompe el hielo! 👋</p>
          </div>
        )}

        {messages.map((message) => {
          const isOwn = message.senderId === user?.id
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                  isOwn
                    ? 'bg-primary-500 text-white rounded-br-sm'
                    : 'bg-gray-800 text-white rounded-bl-sm'
                }`}
              >
                <p className="break-words">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(message.createdAt).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          )
        })}

        {otherUserTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 px-4 py-2 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-background-card border-t border-gray-800 px-4 py-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-3 bg-background border border-gray-800 rounded-lg focus:outline-none focus:border-primary-500 text-white"
            maxLength={1000}
            disabled={chat.status === 'ENDED'}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending || chat.status === 'ENDED'}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>

      {/* Match Celebration Modal */}
      <MatchCelebrationModal
        isOpen={showMatchCelebration}
        onClose={() => setShowMatchCelebration(false)}
        profile={revealedProfile}
        chatId={chatId}
      />
    </div>
  )
}
