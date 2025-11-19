'use client'

import { useEffect, useState } from 'react'
import { Heart, X, MapPin, Sparkles, MessageCircle } from 'lucide-react'

interface Profile {
  username: string
  gender: string
  age: number
  city?: string
  bio?: string
  photos: string[]
  interests: string[]
  lookingFor: string[]
}

interface MatchCelebrationModalProps {
  isOpen: boolean
  onClose: () => void
  profile: Profile | null
  chatId: string
}

export default function MatchCelebrationModal({
  isOpen,
  onClose,
  profile,
  chatId,
}: MatchCelebrationModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
    if (isOpen && profile?.photos && profile.photos.length > 1) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % profile.photos.length)
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [isOpen, profile])

  if (!isOpen || !profile) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Confetti effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <Heart className={`w-4 h-4 text-${['pink', 'red', 'purple'][Math.floor(Math.random() * 3)]}-500`} fill="currentColor" />
          </div>
        ))}
      </div>

      {/* Modal */}
      <div className="bg-background-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-500/20 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center animate-bounce">
                <Heart className="w-12 h-12 text-pink-500" fill="currentColor" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">¡Es un Match!</h2>
            <p className="text-pink-100">
              A ambos les gustó el otro. Los perfiles han sido revelados.
            </p>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-6">
          {/* Photos */}
          {profile.photos && profile.photos.length > 0 && (
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-800">
                <img
                  src={profile.photos[currentPhotoIndex] || '/placeholder-avatar.png'}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-avatar.png'
                  }}
                />
              </div>

              {/* Photo dots */}
              {profile.photos.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                  {profile.photos.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentPhotoIndex
                          ? 'w-8 bg-primary-500'
                          : 'w-2 bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Basic Info */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">
              {profile.username}, {profile.age}
            </h3>

            {profile.city && (
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{profile.city}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Sobre {profile.username}
              </h4>
              <p className="text-white">{profile.bio}</p>
            </div>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Intereses</h4>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-sm border border-primary-500/20"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Looking For */}
          {profile.lookingFor && profile.lookingFor.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Buscando</h4>
              <div className="flex flex-wrap gap-2">
                {profile.lookingFor.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-pink-500/10 text-pink-400 rounded-full text-sm border border-pink-500/20"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Continuar Chateando
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
