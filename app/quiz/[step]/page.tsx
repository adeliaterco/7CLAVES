"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ArrowLeft,
  Heart,
  Clock,
  AlertTriangle,
  User,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { quizSteps, getPersonalizedContent } from "@/lib/quiz-data"

// Función para enviar eventos a Google Analytics
function enviarEvento(nombre_evento, propriedades = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', nombre_evento, propriedades);
    console.log('Evento enviado:', nombre_evento, propriedades);
  }
}

export default function QuizStep() {
  const params = useParams()
  const router = useRouter()
  const step = Number.parseInt(params.step as string)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [quizData, setQuizData] = useState<any>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [userGender, setUserGender] = useState<string>("")

  const currentStep = quizSteps[step - 1]
  // ✅ ATUALIZADO: Agora são 18 etapas no total
  const progress = currentStep?.elements?.progressValue || (step / 18) * 100

  useEffect(() => {
    // Cargar datos guardados
    const saved = localStorage.getItem("quizData")
    const savedGender = localStorage.getItem("userGender")

    if (saved) setQuizData(JSON.parse(saved))
    if (savedGender) setUserGender(savedGender)

    // Retraso de animación
    setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    // Registra visualización de la etapa del cuestionario
    enviarEvento('visualizou_etapa_quiz', {
      numero_etapa: step,
      pergunta: currentStep?.question || `Etapa ${step}`
    });

    // Avance automático para el paso de carga (etapa 18)
    if (currentStep?.autoAdvance) {
      const timer = setTimeout(() => {
        proceedToNextStep()
      }, 4000) // 4 segundos para "LIBERANDO EL ACCESO..."

      return () => clearTimeout(timer)
    }
  }, [step])

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)

    // Registra evento de respuesta seleccionada
    enviarEvento('selecionou_resposta', {
      numero_etapa: step,
      pergunta: currentStep?.question || `Etapa ${step}`,
      resposta: answer
    });

    // Guardar selección de género en el primer paso
    if (step === 1) {
      setUserGender(answer)
      localStorage.setItem("userGender", answer)
    }

    // Retroalimentación visual inmediata
    const button = document.querySelector(`button[data-option="${answer}"]`)
    if (button) {
      button.classList.add("scale-105")
      setTimeout(() => button.classList.remove("scale-105"), 200)
    }
  }

  const handleNext = () => {
    // Registra evento de avance a la siguiente etapa
    enviarEvento('avancou_etapa', {
      numero_etapa: step,
      pergunta: currentStep?.question || `Etapa ${step}`,
      resposta_selecionada: selectedAnswer
    });

    // Guardar respuesta
    const newQuizData = { ...quizData, [step]: selectedAnswer }
    setQuizData(newQuizData)
    localStorage.setItem("quizData", JSON.stringify(newQuizData))

    proceedToNextStep()
  }

  const proceedToNextStep = () => {
    // Capturar UTMs da URL atual
    const currentUrl = new URL(window.location.href);
    let utmString = '';
    
    // Verificar se há parâmetros UTM na URL atual
    const utmParams = new URLSearchParams();
    for (const [key, value] of currentUrl.searchParams.entries()) {
      if (key.startsWith('utm_')) {
        utmParams.append(key, value);
      }
    }
    
    // Se encontramos UTMs, criar a string de query
    if (utmParams.toString() !== '') {
      utmString = '?' + utmParams.toString();
    }

    // ✅ ATUALIZADO: Navegação agora usa 18 como limite
    if (step < 18) {
      router.push(`/quiz/${step + 1}${utmString}`)
    } else {
      // ✅ ATUALIZADO: Evento de conclusão agora registra 18 etapas
      enviarEvento('concluiu_quiz', {
        total_etapas_completadas: 18,
      });
      
      router.push(`/resultado${utmString}`)
    }
  }

  const handleBack = () => {
    // Registra evento de retorno a la etapa anterior
    enviarEvento('retornou_etapa', {
      de_etapa: step,
      para_etapa: step > 1 ? step - 1 : 'inicio'
    });
    
    // Capturar UTMs da URL atual
    const currentUrl = new URL(window.location.href);
    let utmString = '';
    
    // Verificar se há parâmetros UTM na URL atual
    const utmParams = new URLSearchParams();
    for (const [key, value] of currentUrl.searchParams.entries()) {
      if (key.startsWith('utm_')) {
        utmParams.append(key, value);
      }
    }
    
    // Se encontramos UTMs, criar a string de query
    if (utmParams.toString() !== '') {
      utmString = '?' + utmParams.toString();
    }
    
    if (step > 1) {
      router.push(`/quiz/${step - 1}${utmString}`)
    } else {
      router.push(`/${utmString}`)
    }
  }

  if (!currentStep) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado con progreso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-white hover:bg-white/20 border border-white/20"
              disabled={currentStep?.autoAdvance}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>

            <div className="flex items-center gap-4">
              {currentStep?.elements?.timer && (
                <div className="flex items-center gap-2 text-white text-sm bg-white/10 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>{currentStep.elements.timer}</span>
                </div>
              )}
            </div>
          </div>

          {/* ✅ BARRA DE PROGRESSO VERMELHA */}
          <div className="bg-white/20 rounded-full p-1 mb-2">
            <div className="bg-red-500 h-3 rounded-full transition-all duration-500" 
                 style={{ width: `${progress}%` }} />
          </div>

          <div className="flex justify-between items-center">
            {/* ✅ ATUALIZADO: Texto do progresso agora mostra 18 etapas */}
            <p className="text-white text-sm">
              Etapa {step} de 18 • {Math.round(progress)}% completado
            </p>
          </div>
        </div>

        {/* ✅ IMAGEM DA ETAPA */}
        {currentStep.image && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-8 text-center"
          >
            <div className="w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-lg">
              <img
                src={currentStep.image}
                alt={`Imagen Etapa ${step}`}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  // Fallback se a imagem não carregar
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Tarjeta de Pregunta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border-red-500/30 shadow-2xl border-2">
            <CardContent className="p-8">
              
              {/* ✅ ETAPA 18 - LOADING ESPECIAL */}
              {currentStep?.autoAdvance && currentStep?.elements?.loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <motion.div
                    className="w-24 h-24 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-6"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {currentStep.question}
                  </h2>
                  
                  <div className="flex justify-center">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-3 h-3 bg-red-500 rounded-full"
                          animate={{
                            opacity: [0.3, 1, 0.3],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {!currentStep?.autoAdvance && (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                    {currentStep.question}
                  </h2>

                  {currentStep.subtext && (
                    <p className="text-red-200 text-center mb-6 text-lg font-medium">{currentStep.subtext}</p>
                  )}

                  {currentStep.description && (
                    <p className="text-gray-300 text-center mb-8">{currentStep.description}</p>
                  )}

                  {/* ✅ RENDERIZAÇÃO DAS OPÇÕES */}
                  {currentStep.options && currentStep.options.length > 0 && (
                    <div className="space-y-4">
                      {currentStep.options.map((option, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                          className="relative"
                        >
                          <button
                            onClick={() => handleAnswerSelect(option)}
                            data-option={option}
                            className={`w-full p-6 text-left justify-start text-wrap h-auto rounded-lg border-2 transition-all duration-300 transform hover:scale-102 ${
                              selectedAnswer === option
                                ? "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500 shadow-lg scale-105"
                                : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500 shadow-sm"
                            }`}
                          >
                            <div className="flex items-center w-full">
                              <div className={`mr-4 ${selectedAnswer === option ? "text-white" : "text-red-400"}`}>
                                <Heart className="w-6 h-6" />
                              </div>

                              <div
                                className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                                  selectedAnswer === option ? "border-white bg-white" : "border-gray-400 bg-gray-700"
                                }`}
                              >
                                {selectedAnswer === option && <Check className="w-3 h-3 text-red-600" />}
                              </div>
                              <span className="flex-1 font-medium">{option}</span>
                            </div>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {currentStep.warning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="mt-6 text-center text-red-300 bg-red-900/30 p-4 rounded-lg border border-red-600 flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <p className="font-medium">{currentStep.warning}</p>
                    </motion.div>
                  )}

                  {selectedAnswer && currentStep.options && currentStep.options.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 text-center"
                    >
                      {/* ✅ ATUALIZADO: Botão agora usa 18 como referência para resultado */}
                      <Button
                        onClick={handleNext}
                        size="lg"
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-full shadow-lg max-w-full"
                      >
                        {step === 17 ? "Liberar Acceso" : "Siguiente Pregunta"}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}