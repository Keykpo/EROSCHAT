'use client'

import { useState } from 'react'
import { X, AlertTriangle, Flag } from 'lucide-react'
import { ApiClient } from '@/lib/api'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  reportedUserId: string
  chatId: string
  username?: string
}

const REPORT_REASONS = [
  { value: 'INAPPROPRIATE', label: 'Contenido inapropiado', description: 'Contenido sexual explícito o inapropiado' },
  { value: 'SPAM', label: 'Spam', description: 'Mensajes repetitivos o no deseados' },
  { value: 'HARASSMENT', label: 'Acoso', description: 'Acoso, intimidación o bullying' },
  { value: 'FAKE', label: 'Perfil falso', description: 'Perfil falso o suplantación de identidad' },
  { value: 'UNDERAGE', label: 'Menor de edad', description: 'Sospecha de usuario menor de 18 años' },
  { value: 'OTHER', label: 'Otro', description: 'Otra razón no listada' },
]

export default function ReportModal({
  isOpen,
  onClose,
  reportedUserId,
  chatId,
  username = 'este usuario',
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedReason) {
      setError('Por favor selecciona una razón')
      return
    }

    setLoading(true)
    setError('')

    try {
      await ApiClient.createReport({
        reportedUserId,
        chatId,
        reason: selectedReason,
        description: description.trim() || undefined,
      })

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setSelectedReason('')
        setDescription('')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Error al enviar el reporte')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setSelectedReason('')
      setDescription('')
      setError('')
      setSuccess(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-background-card rounded-lg max-w-md w-full border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
              <Flag className="w-4 h-4 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold">Reportar Usuario</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1 hover:bg-background-hover rounded transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-200">
              Reportar a <span className="font-semibold">{username}</span>.
              Los reportes falsos pueden resultar en la suspensión de tu cuenta.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-sm text-green-500">
                ✓ Reporte enviado. Gracias por ayudarnos a mantener la comunidad segura.
              </p>
            </div>
          )}

          {/* Reasons */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Razón del reporte *
            </label>
            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedReason === reason.value
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mt-1"
                    disabled={loading || success}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">{reason.label}</div>
                    <div className="text-sm text-gray-400">{reason.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Detalles adicionales (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Proporciona más información si es necesario..."
              className="w-full px-3 py-2 bg-background border border-gray-800 rounded-lg focus:outline-none focus:border-primary-500 text-white resize-none"
              rows={3}
              maxLength={500}
              disabled={loading || success}
            />
            <div className="text-xs text-gray-500 text-right">
              {description.length}/500
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !selectedReason || success}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Reporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
