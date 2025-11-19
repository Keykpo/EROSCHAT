'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { ApiClient } from '@/lib/api'
import {
  Shield,
  Flag,
  User,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Ban,
  Loader2,
} from 'lucide-react'

interface Report {
  _id: string
  reporterId: string
  reportedUserId: string
  chatId?: string
  reason: string
  description?: string
  status: string
  createdAt: Date
  context: any[]
}

export default function AdminPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const [reports, setReports] = useState<Report[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [reviewing, setReviewing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    loadReports()
    loadStats()
  }, [isAuthenticated, router])

  const loadReports = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/v1/reports/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      const data = await response.json()
      setReports(data.reports)
    } catch (error: any) {
      console.error('Error loading reports:', error)
      alert('Error al cargar reportes')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/v1/reports/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      const data = await response.json()
      setStats(data)
    } catch (error: any) {
      console.error('Error loading stats:', error)
    }
  }

  const handleReview = async (reportId: string, action: string) => {
    if (!confirm(`¿Estás seguro de aplicar la acción: ${action}?`)) {
      return
    }

    setReviewing(true)

    try {
      const response = await fetch(`/api/v1/reports/${reportId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error('Error al revisar reporte')
      }

      alert(`Acción ${action} aplicada exitosamente`)
      setSelectedReport(null)
      loadReports()
      loadStats()
    } catch (error: any) {
      console.error('Error reviewing report:', error)
      alert(error.message || 'Error al revisar reporte')
    } finally {
      setReviewing(false)
    }
  }

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      INAPPROPRIATE: 'Contenido inapropiado',
      SPAM: 'Spam',
      HARASSMENT: 'Acoso',
      FAKE: 'Perfil falso',
      UNDERAGE: 'Menor de edad',
      OTHER: 'Otro',
    }
    return labels[reason] || reason
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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Panel de Moderación</h1>
              <p className="text-sm text-gray-400">Gestión de reportes y usuarios</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-background-card rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 text-yellow-400 mb-2">
                <Flag className="w-4 h-4" />
                <span className="text-sm font-medium">Pendientes</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.pending}</div>
            </div>
            <div className="bg-background-card rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Revisados</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.reviewed}</div>
            </div>
            <div className="bg-background-card rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Resueltos</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.resolved}</div>
            </div>
            <div className="bg-background-card rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Descartados</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.dismissed}</div>
            </div>
          </div>
        )}

        {/* Reports List */}
        <div className="bg-background-card rounded-lg border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Flag className="w-5 h-5 text-yellow-400" />
              Reportes Pendientes ({reports.length})
            </h2>
          </div>

          {reports.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Flag className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hay reportes pendientes</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="p-4 hover:bg-background-hover transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          report.reason === 'UNDERAGE' ? 'bg-red-500/20 text-red-400' :
                          report.reason === 'HARASSMENT' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {getReasonLabel(report.reason)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(report.createdAt).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {report.description && (
                        <p className="text-sm text-gray-300 mb-2">{report.description}</p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Usuario reportado: {report.reportedUserId.substring(0, 8)}...</span>
                        <span>Reportero: {report.reporterId.substring(0, 8)}...</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Revisar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-background-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
            {/* Header */}
            <div className="sticky top-0 bg-background-card border-b border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Revisar Reporte</h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-background-hover rounded transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Report Info */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Información del Reporte
                </h4>
                <div className="bg-background rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Razón:</span>
                    <span className="font-semibold">{getReasonLabel(selectedReport.reason)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fecha:</span>
                    <span>{new Date(selectedReport.createdAt).toLocaleString('es-ES')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Usuario reportado:</span>
                    <span className="font-mono text-sm">{selectedReport.reportedUserId}</span>
                  </div>
                  {selectedReport.description && (
                    <div>
                      <span className="text-gray-400">Descripción:</span>
                      <p className="mt-1 text-white">{selectedReport.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Context Messages */}
              {selectedReport.context && selectedReport.context.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Contexto del Chat (últimos mensajes)
                  </h4>
                  <div className="bg-background rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
                    {selectedReport.context.map((msg: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-2 rounded ${
                          msg.senderId === selectedReport.reportedUserId
                            ? 'bg-red-500/10 border border-red-500/20'
                            : 'bg-gray-800'
                        }`}
                      >
                        <div className="text-xs text-gray-500 mb-1">
                          {msg.senderId === selectedReport.reportedUserId ? 'Reportado' : 'Otro usuario'}
                        </div>
                        <div className="text-sm">{msg.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div>
                <h4 className="font-semibold mb-3">Acciones de Moderación</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleReview(selectedReport._id, 'NONE')}
                    disabled={reviewing}
                    className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <XCircle className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <div className="font-semibold">Descartar</div>
                      <div className="text-xs text-gray-400">Sin acción</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleReview(selectedReport._id, 'WARNING')}
                    disabled={reviewing}
                    className="p-4 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <div className="text-left">
                      <div className="font-semibold text-yellow-400">Advertencia</div>
                      <div className="text-xs text-gray-400">+1 strike</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleReview(selectedReport._id, 'SUSPENSION')}
                    disabled={reviewing}
                    className="p-4 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    <div className="text-left">
                      <div className="font-semibold text-orange-400">Suspender</div>
                      <div className="text-xs text-gray-400">7 días</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleReview(selectedReport._id, 'BAN')}
                    disabled={reviewing}
                    className="p-4 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Ban className="w-5 h-5 text-red-400" />
                    <div className="text-left">
                      <div className="font-semibold text-red-400">Banear</div>
                      <div className="text-xs text-gray-400">Permanente</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
