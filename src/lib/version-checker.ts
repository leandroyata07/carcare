/**
 * Sistema de verificação de versão do aplicativo
 * Compara versão local com versão remota e força atualização quando necessário
 */

const VERSION_KEY = 'carcare-app-version'
const LAST_CHECK_KEY = 'carcare-last-version-check'
const CHECK_INTERVAL = 5 * 60 * 1000 // 5 minutos

interface VersionInfo {
  version: string
  buildDate: string
  description: string
}

/**
 * Busca a versão atual do servidor (do GitHub Pages)
 */
export async function fetchServerVersion(): Promise<VersionInfo | null> {
  try {
    // Adiciona timestamp para evitar cache do navegador
    const timestamp = new Date().getTime()
    const response = await fetch(`/carcare/version.json?t=${timestamp}`, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    })

    if (!response.ok) {
      console.warn('[VersionChecker] Failed to fetch version:', response.status)
      return null
    }

    const versionInfo = await response.json()
    console.log('[VersionChecker] Server version:', versionInfo.version)
    return versionInfo
  } catch (error) {
    console.error('[VersionChecker] Error fetching version:', error)
    return null
  }
}

/**
 * Obtém a versão local armazenada
 */
export function getLocalVersion(): string | null {
  return localStorage.getItem(VERSION_KEY)
}

/**
 * Salva a versão local
 */
export function setLocalVersion(version: string): void {
  localStorage.setItem(VERSION_KEY, version)
  localStorage.setItem(LAST_CHECK_KEY, Date.now().toString())
  console.log('[VersionChecker] Local version updated to:', version)
}

/**
 * Verifica se precisa checar versão novamente (evita checks excessivos)
 */
export function shouldCheckVersion(): boolean {
  const lastCheck = localStorage.getItem(LAST_CHECK_KEY)
  if (!lastCheck) return true

  const timeSinceLastCheck = Date.now() - parseInt(lastCheck, 10)
  return timeSinceLastCheck > CHECK_INTERVAL
}

/**
 * Compara versões e retorna true se houver atualização disponível
 */
export function hasNewVersion(localVersion: string | null, serverVersion: string): boolean {
  if (!localVersion) return true

  // Remove o 'v' se existir e compara
  const cleanLocal = localVersion.replace(/^v/, '')
  const cleanServer = serverVersion.replace(/^v/, '')

  console.log('[VersionChecker] Comparing versions:', {
    local: cleanLocal,
    server: cleanServer,
  })

  return cleanLocal !== cleanServer
}

/**
 * Força a atualização do aplicativo
 */
export function forceUpdate(): void {
  console.log('[VersionChecker] Forcing application update...')

  // Marca que está atualizando (para mostrar toast depois)
  sessionStorage.setItem('carcare-just-updated', 'true')

  // 1. Limpa todos os caches do service worker
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' })
  }

  // 2. Desregistra o service worker atual
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister()
      })
    })
  }

  // 3. Aguarda um pouco e faz reload forçado
  setTimeout(() => {
    window.location.reload()
  }, 500)
}

/**
 * Verifica se há nova versão e retorna informação
 */
export async function checkForUpdates(): Promise<{
  hasUpdate: boolean
  serverVersion: string | null
  localVersion: string | null
}> {
  const localVersion = getLocalVersion()
  const serverVersionInfo = await fetchServerVersion()

  if (!serverVersionInfo) {
    return {
      hasUpdate: false,
      serverVersion: null,
      localVersion,
    }
  }

  const hasUpdate = hasNewVersion(localVersion, serverVersionInfo.version)

  return {
    hasUpdate,
    serverVersion: serverVersionInfo.version,
    localVersion,
  }
}

/**
 * Verifica versão e força atualização se necessário
 * Retorna true se houve atualização
 */
export async function checkAndUpdate(): Promise<boolean> {
  console.log('[VersionChecker] Checking for updates...')

  const { hasUpdate, serverVersion, localVersion } = await checkForUpdates()

  if (hasUpdate && serverVersion) {
    console.log('[VersionChecker] Update detected!', {
      from: localVersion,
      to: serverVersion,
    })

    // Salva nova versão antes de recarregar
    setLocalVersion(serverVersion)

    // Força atualização
    forceUpdate()

    return true
  }

  console.log('[VersionChecker] No updates available')
  return false
}

/**
 * Inicializa o listener para mensagens do service worker
 */
export function initVersionListener(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'FORCE_RELOAD') {
        console.log('[VersionChecker] Received FORCE_RELOAD from SW')
        console.log('[VersionChecker] New version:', event.data.version)

        // Salva a nova versão
        if (event.data.version) {
          setLocalVersion(event.data.version)
        }

        // Marca que está atualizando (para mostrar toast depois)
        sessionStorage.setItem('carcare-just-updated', 'true')

        // Recarrega a página
        setTimeout(() => {
          window.location.reload()
        }, 100)
      }
    })
  }
}

/**
 * Verifica versão periodicamente quando o app está aberto
 */
export function startVersionPolling(): void {
  // Verifica agora
  checkForUpdates().then(({ hasUpdate, serverVersion }) => {
    if (hasUpdate && serverVersion) {
      console.log('[VersionChecker] Update available on polling')
      setLocalVersion(serverVersion)
    }
  })

  // Verifica a cada 5 minutos
  setInterval(async () => {
    if (!shouldCheckVersion()) return

    const { hasUpdate, serverVersion } = await checkForUpdates()
    if (hasUpdate && serverVersion) {
      console.log('[VersionChecker] Update available on polling')
      setLocalVersion(serverVersion)
      // Não força reload aqui, deixa o usuário fazer logout/login
    }
  }, CHECK_INTERVAL)
}
