import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { RefreshCw, X } from 'lucide-react'

export function PWAUpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Verifica atualizações a cada 30 segundos
      const interval = setInterval(() => {
        navigator.serviceWorker.ready.then((reg) => {
          reg.update()
        })
      }, 30000)

      // Listener para mensagens do service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATED') {
          console.log('Nova versão disponível:', event.data.version)
          setShowUpdate(true)
        }
      })

      // Detecta novo service worker aguardando
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)
        
        if (reg.waiting) {
          setShowUpdate(true)
        }

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdate(true)
              }
            })
          }
        })
      })

      return () => clearInterval(interval)
    }
  }, [])

  const handleUpdate = () => {
    if (registration?.waiting) {
      // Envia mensagem para o service worker ativar
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
    
    // Recarrega a página
    window.location.reload()
  }

  const handleDismiss = () => {
    setShowUpdate(false)
  }

  if (!showUpdate) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom-5">
      <Card className="border-blue-500 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Nova versão disponível!</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Uma nova versão do CarCare está pronta. Atualize para ver as últimas melhorias.
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-2 pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="flex-1"
          >
            Agora não
          </Button>
          <Button
            size="sm"
            onClick={handleUpdate}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar agora
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
