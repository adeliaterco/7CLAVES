"use client"

import { useState, useEffect } from "react"
import { enviarEvento } from "../../lib/analytics"

export default function ResultPageOptimized() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // ✅ FUNÇÃO PARA RECARREGAR O SCRIPT VTURB
  const reloadVturbScript = () => {
    // Remove script anterior se existir
    const existingScript = document.querySelector('script[src*="converteai.net"]')
    if (existingScript) {
      existingScript.remove()
    }

    // Cria novo script
    const script = document.createElement("script")
    script.src = "https://scripts.converteai.net/498be6ac-2d19-4386-aba2-c11c84449107/players/68ba87ec575dfb94b010bc9f/v4/player.js"
    script.async = true
    
    script.onload = () => {
      console.log('✅ Script vturb recarregado com sucesso')
      setScriptLoaded(true)
    }
    
    document.head.appendChild(script)
  }

  useEffect(() => {
    // Delay inicial
    setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    // ✅ RECARREGA O SCRIPT VTURB APÓS UM DELAY
    setTimeout(() => {
      reloadVturbScript()
    }, 800) // Aguarda 800ms para o DOM estabilizar

    // Registra visualização da página de resultado
    try {
      enviarEvento("visualizou_resultado")
      console.log("Evento de visualización registrado con éxito")
    } catch (error) {
      console.error("Error al registrar evento de visualización:", error)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-x-hidden">
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
                  {/* VTURB PLAYER */}
                  <vturb-smartplayer 
                    id="vid-68ba87ec575dfb94b010bc9f" 
                    style={{display: 'block', margin: '0 auto', width: '100%'}}
                  ></vturb-smartplayer>
                  
                  {/* ✅ LOADING INDICATOR */}
                  {!scriptLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                        <p className="text-sm">Cargando video...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ SCRIPT VTURB REMOVIDO DAQUI - SERÁ CARREGADO VIA useEffect */}
    </div>
  )
}