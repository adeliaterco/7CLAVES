"use client"

import { useState, useEffect } from "react"
import { enviarEvento } from "../../lib/analytics"

export default function ResultPageOptimized() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true)
    }, 300)

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
                    id="vid-68ba7f242b000d381bc12c3b" 
                    style={{display: 'block', margin: '0 auto', width: '100%'}}
                  ></vturb-smartplayer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SCRIPT VTURB */}
      <script 
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
            var s=document.createElement("script");
            s.src="https://scripts.converteai.net/498be6ac-2d19-4386-aba2-c11c84449107/players/68ba7f242b000d381bc12c3b/v4/player.js";
            s.async=true;
            document.head.appendChild(s);
          `
        }}
      />

      {/* ESTILOS OTIMIZADOS */}
      <style jsx global>{`
        /* Reset para evitar scroll horizontal */
        html, body {
          overflow-x: hidden;
          max-width: 100vw;
        }

        /* Container principal sem overflow */
        .min-h-screen {
          max-width: 100vw;
          overflow-x: hidden;
        }

        /* Estilos para o player VTURB */
        vturb-smartplayer {
          border-radius: 12px !important;
          overflow: hidden;
          width: 100% !important;
          max-width: 100% !important;
          display: block !important;
        }

        /* Otimizações específicas para mobile */
        @media (max-width: 768px) {
          /* Previne overflow horizontal */
          * {
            max-width: 100vw;
            box-sizing: border-box;
          }

          /* Containers responsivos */
          .container, .max-w-4xl, .max-w-3xl, .max-w-2xl {
            max-width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }

          /* Textos responsivos */
          .text-3xl {
            font-size: 1.5rem !important;
            line-height: 2rem !important;
          }

          .text-4xl {
            font-size: 1.875rem !important;
            line-height: 2.25rem !important;
          }

          .text-5xl {
            font-size: 2.25rem !important;
            line-height: 2.5rem !important;
          }

          /* Melhor legibilidade */
          p, span, div, h1 {
            line-height: 1.6 !important;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          /* Espaçamentos otimizados */
          .px-4 {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }

          .py-8 {
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
          }

          /* Centralização melhorada */
          .justify-center {
            justify-content: center !important;
          }

          .items-center {
            align-items: center !important;
          }

          .text-center {
            text-align: center !important;
          }
        }

        /* Animações otimizadas para performance */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Melhorias de performance */
        .bg-gradient-to-r, .bg-gradient-to-br {
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
      `}</style>
    </div>
  )
}