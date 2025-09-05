"use client"

import { useState, useEffect, useRef } from "react"
import { enviarEvento } from "../../lib/analytics"

export default function ResultPageOptimized() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const scriptLoadedRef = useRef(false)
  const playerInitializedRef = useRef(false)

  // ✅ FUNÇÃO PARA CARREGAR/RECARREGAR O SCRIPT VTURB
  const loadVturbScript = () => {
    return new Promise((resolve, reject) => {
      // Remove script anterior se existir
      const existingScript = document.querySelector('script[src*="converteai.net"]')
      if (existingScript) {
        existingScript.remove()
        console.log('🔄 Script vturb anterior removido')
      }

      // Remove player anterior se existir
      const existingPlayer = document.querySelector('vturb-smartplayer')
      if (existingPlayer) {
        existingPlayer.remove()
        console.log('🔄 Player vturb anterior removido')
      }

      // Aguarda um pouco antes de recriar
      setTimeout(() => {
        // Cria novo script
        const script = document.createElement("script")
        script.src = "https://scripts.converteai.net/498be6ac-2d19-4386-aba2-c11c84449107/players/68ba7f242b000d381bc12c3b/v4/player.js"
        script.async = true
        
        script.onload = () => {
          console.log('✅ Script vturb carregado com sucesso')
          scriptLoadedRef.current = true
          
          // Aguarda um pouco para o script processar
          setTimeout(() => {
            initializePlayer()
            resolve(true)
          }, 500)
        }
        
        script.onerror = () => {
          console.error('❌ Erro ao carregar script vturb')
          reject(new Error('Falha ao carregar script'))
        }
        
        document.head.appendChild(script)
      }, 100)
    })
  }

  // ✅ FUNÇÃO PARA INICIALIZAR O PLAYER
  const initializePlayer = () => {
    if (playerInitializedRef.current) return

    try {
      // Verifica se o container existe
      const container = document.getElementById('vturb-container')
      if (!container) {
        console.error('❌ Container do vídeo não encontrado')
        return
      }

      // Cria o elemento do player
      const player = document.createElement('vturb-smartplayer')
      player.id = 'vid-68ba7f242b000d381bc12c3b'
      player.style.cssText = 'display: block; margin: 0 auto; width: 100%;'
      
      // Limpa container e adiciona player
      container.innerHTML = ''
      container.appendChild(player)
      
      playerInitializedRef.current = true
      setVideoLoaded(true)
      
      console.log('✅ Player vturb inicializado com sucesso')
      
      // Registra evento de vídeo carregado
      enviarEvento("video_carregado", {
        player_id: "vid-68ba7f242b000d381bc12c3b",
        metodo: "spa_navigation"
      })
      
    } catch (error) {
      console.error('❌ Erro ao inicializar player:', error)
      
      // Fallback: tenta novamente após 2 segundos
      setTimeout(() => {
        if (!playerInitializedRef.current) {
          console.log('🔄 Tentando inicializar player novamente...')
          playerInitializedRef.current = false
          initializePlayer()
        }
      }, 2000)
    }
  }

  // ✅ EFFECT PRINCIPAL
  useEffect(() => {
    console.log('🚀 Página de resultados montada')
    
    // Reset dos refs
    scriptLoadedRef.current = false
    playerInitializedRef.current = false
    
    // Delay inicial para estabilizar o DOM
    const initTimer = setTimeout(() => {
      setIsLoaded(true)
      
      // Carrega o script vturb
      loadVturbScript().catch(error => {
        console.error('❌ Falha ao carregar vturb:', error)
        
        // Fallback: tenta novamente
        setTimeout(() => {
          console.log('🔄 Tentativa de fallback...')
          loadVturbScript()
        }, 3000)
      })
    }, 500)

    // Registra visualização da página
    try {
      enviarEvento("visualizou_resultado")
      console.log("✅ Evento de visualización registrado")
    } catch (error) {
      console.error("❌ Error al registrar evento:", error)
    }

    // Cleanup
    return () => {
      clearTimeout(initTimer)
    }
  }, [])

  // ✅ EFFECT PARA MONITORAR CARREGAMENTO
  useEffect(() => {
    if (!videoLoaded) return

    const checkPlayer = setInterval(() => {
      const player = document.querySelector('vturb-smartplayer')
      if (player) {
        console.log('✅ Player encontrado e funcionando')
        clearInterval(checkPlayer)
      }
    }, 1000)

    return () => clearInterval(checkPlayer)
  }, [videoLoaded])

  // ✅ ADICIONAR ESTILOS VIA useEffect (MÉTODO SEGURO)
  useEffect(() => {
    // Adiciona estilos globais de forma segura
    const style = document.createElement('style')
    style.textContent = `
      /* Reset para evitar scroll horizontal */
      html, body {
        overflow-x: hidden !important;
        max-width: 100vw !important;
      }

      /* Container principal sem overflow */
      .result-page-container {
        max-width: 100vw !important;
        overflow-x: hidden !important;
      }

      /* Estilos para o player VTURB */
      vturb-smartplayer {
        border-radius: 12px !important;
        overflow: hidden !important;
        width: 100% !important;
        max-width: 100% !important;
        display: block !important;
      }

      /* Otimizações específicas para mobile */
      @media (max-width: 768px) {
        .result-page-container * {
          max-width: 100vw !important;
          box-sizing: border-box !important;
        }

        .result-page-container .container, 
        .result-page-container .max-w-4xl, 
        .result-page-container .max-w-3xl, 
        .result-page-container .max-w-2xl {
          max-width: 100% !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        .result-page-container .text-3xl {
          font-size: 1.5rem !important;
          line-height: 2rem !important;
        }

        .result-page-container .text-4xl {
          font-size: 1.875rem !important;
          line-height: 2.25rem !important;
        }

        .result-page-container .text-5xl {
          font-size: 2.25rem !important;
          line-height: 2.5rem !important;
        }

        .result-page-container p, 
        .result-page-container span, 
        .result-page-container div, 
        .result-page-container h1 {
          line-height: 1.6 !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
      }

      /* Melhorias de performance */
      .result-page-container .bg-gradient-to-r, 
      .result-page-container .bg-gradient-to-br {
        will-change: transform;
        backface-visibility: hidden;
      }

      /* Scroll suave */
      html {
        scroll-behavior: smooth;
      }

      /* Garantir que o vídeo não quebre o layout */
      vturb-smartplayer {
        max-width: 100% !important;
        height: auto !important;
      }
    `
    
    document.head.appendChild(style)
    
    // Cleanup: remove o style quando o componente for desmontado
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [])

  return (
    <div className="result-page-container min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-x-hidden">
      {/* HERO SECTION - HEADLINE + VÍDEO */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 animate-pulse"></div>

        <div className="relative z-10 px-4 py-8 text-center">
          {/* HEADLINE PRINCIPAL */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-8 leading-tight px-2 max-w-4xl mx-auto">
            HAGA ESTA CADENA DE ORACIÓN Y TENGA A LA PERSONA QUE DESEE A SUS PIES EN UN PLAZO DE 7 DÍAS.
          </h1>

          {/* VÍDEO VTURB CENTRALIZADO */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-4xl">
              <div className="relative bg-black rounded-2xl p-2 sm:p-4 border-4 border-orange-500 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl animate-pulse"></div>
                <div className="relative z-10">
                  {/* ✅ CONTAINER PARA O PLAYER VTURB */}
                  <div id="vturb-container" className="min-h-[300px] flex items-center justify-center">
                    {!videoLoaded && (
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p>Cargando video...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ INDICADOR DE STATUS DO VÍDEO */}
          {isLoaded && !videoLoaded && (
            <div className="text-center mb-4">
              <p className="text-orange-400 text-sm">
                �� Inicializando reproductor de video...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}