"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Gift,
  Check,
  ArrowRight,
  ArrowLeft,
  Heart,
  Clock,
  AlertTriangle,
  User,
  TrendingUp,
  Target,
  Zap,
  Calendar,
  Users,
  MessageCircle,
  Smile,
  Star,
  CheckCircle,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { quizSteps, socialProofMessages, getPersonalizedContent } from "@/lib/quiz-data"
import { BonusUnlock } from "@/components/bonus-unlock"
import { ValueCounter } from "@/components/value-counter"
import { LoadingAnalysis } from "@/components/loading-analysis"

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
  const [unlockedBonuses, setUnlockedBonuses] = useState<number[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [showBonusUnlock, setShowBonusUnlock] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [newBonus, setNewBonus] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [peopleCount, setPeopleCount] = useState(17)
  const [userGender, setUserGender] = useState<string>("")

  const currentStep = quizSteps[step - 1]
  // ✅ ATUALIZADO: Agora são 12 etapas no total
  const progress = (step / 12) * 100

  useEffect(() => {
    // Cargar datos guardados
    const saved = localStorage.getItem("quizData")
    const savedBonuses = localStorage.getItem("unlockedBonuses")
    const savedValue = localStorage.getItem("totalValue")
    const savedGender = localStorage.getItem("userGender")

    if (saved) setQuizData(JSON.parse(saved))
    if (savedBonuses) setUnlockedBonuses(JSON.parse(savedBonuses))
    if (savedValue) setTotalValue(Number.parseInt(savedValue))
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

    // Avance automático para el paso de experto
    if (currentStep?.autoAdvance) {
      const timer = setTimeout(() => {
        proceedToNextStep()
      }, 3000)

      return () => clearTimeout(timer)
    }

    // Simular contador de personas
    const interval = setInterval(() => {
      setPeopleCount((prev) => prev + Math.floor(Math.random() * 3))
    }, 45000)

    return () => clearInterval(interval)
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

    // Mostrar análisis para ciertos pasos
    if (currentStep?.elements?.analysisText || currentStep?.elements?.profileAnalysis) {
      setShowAnalysis(true)
      setTimeout(() => {
        setShowAnalysis(false)
        proceedToNextStep()
      }, 2000)
      return
    }

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

    // Verificar desbloqueo de bonificación
    if (currentStep?.bonusUnlock && !unlockedBonuses.includes(currentStep.bonusUnlock.id)) {
      // Registra evento de desbloqueo de bonificación
      enviarEvento('desbloqueou_bonus', {
        numero_etapa: step,
        bonus_id: currentStep.bonusUnlock.id,
        bonus_titulo: currentStep.bonusUnlock.title
      });

      const newUnlockedBonuses = [...unlockedBonuses, currentStep.bonusUnlock.id]
      const newTotalValue = totalValue + currentStep.bonusUnlock.value

      setUnlockedBonuses(newUnlockedBonuses)
      setTotalValue(newTotalValue)

      // Personalizar bonificación basada en el género
      const personalizedBonus = {
        ...currentStep.bonusUnlock,
        title: getPersonalizedContent(currentStep.bonusUnlock.title, userGender),
        description: getPersonalizedContent(currentStep.bonusUnlock.description, userGender),
      }
      setNewBonus(personalizedBonus)

      localStorage.setItem("unlockedBonuses", JSON.stringify(newUnlockedBonuses))
      localStorage.setItem("totalValue", newTotalValue.toString())

      setShowBonusUnlock(true)
      return
    }

    // ✅ ATUALIZADO: Navegação agora usa 12 como limite
    if (step < 12) {
      router.push(`/quiz/${step + 1}${utmString}`)
    } else {
      // ✅ ATUALIZADO: Evento de conclusão agora registra 12 etapas
      enviarEvento('concluiu_quiz', {
        total_etapas_completadas: 12,
        total_bonus_desbloqueados: unlockedBonuses.length
      });
      
      router.push(`/resultado${utmString}`)
    }
  }

  const handleBonusUnlockComplete = () => {
    setShowBonusUnlock(false)
    
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
    
    // ✅ ATUALIZADO: Navegação agora usa 12 como limite
    if (step < 12) {
      router.push(`/quiz/${step + 1}${utmString}`)
    } else {
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

  const getStepIcon = (stepNumber: number, index: number) => {
    const iconMaps = {
      1: [User, Users], // Género
      2: [Calendar, TrendingUp, Target, Zap], // Edad
      3: [Clock, Calendar, MessageCircle, Heart], // Tiempo separados
      4: [Heart, MessageCircle, Users], // Cómo fue la separación
      5: [Calendar, Heart, TrendingUp, Clock], // Tiempo juntos
      6: [Smile, Heart, MessageCircle, TrendingUp, Target, Zap], // Parte dolorosa
      7: [MessageCircle, Heart, Users, TrendingUp, Smile, Users, Heart], // Situación actual
      8: [MessageCircle, Heart, Users, TrendingUp, Smile], // Ella está con otra persona
      9: [Heart, TrendingUp, Target, Zap], // Nivel de compromiso
    }

    const icons = iconMaps[stepNumber] || [Heart]
    const Icon = icons[index] || Heart
    return <Icon className="w-6 h-6" />
  }

  // Obtener contenido personalizado basado en el género
  const getPersonalizedQuestion = () => {
    return getPersonalizedContent(currentStep.question, userGender)
  }

  const getPersonalizedOptions = () => {
    const options = getPersonalizedContent(currentStep.options, userGender)
    return Array.isArray(options) ? options : currentStep.options
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
              {totalValue > 0 && <ValueCounter value={totalValue} />}
              {currentStep?.elements?.timer && (
                <div className="flex items-center gap-2 text-white text-sm bg-white/10 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>{currentStep.elements.timer}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/20 rounded-full p-1 mb-2">
            <Progress value={progress} className="h-3" />
          </div>

          <div className="flex justify-between items-center">
            {/* ✅ ATUALIZADO: Texto do progresso agora mostra 12 etapas */}
            <p className="text-white text-sm">
              Etapa {step} de 12 • {Math.round(progress)}% completado
            </p>
            {currentStep?.elements?.profileComplete && (
              <p className="text-green-400 text-sm font-semibold">
                Análisis de perfil: {currentStep.elements.profileComplete} completo
              </p>
            )}
          </div>
        </div>

        {/* Imagen de Testimonio - Aparece en la etapa 7 */}
        {step === 7 && currentStep?.elements?.testimonialImage && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-blue-500/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-blue-400 mb-4">💬 TESTIMONIO REAL</h3>
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 1, -1, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-lg mb-4"
                >
                  {currentStep.elements.testimonialImage ? (
                    <img
                      src={currentStep.elements.testimonialImage || "/placeholder.svg"}
                      alt="Testimonio de Cliente"
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Star className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-300 font-semibold">ESPACIO PARA TESTIMONIO</p>
                        <p className="text-gray-400 text-sm">Inserte el enlace de la imagen aquí</p>
                      </div>
                    </div>
                  )}
                </motion.div>
                <p className="text-blue-300 font-medium">
                  ¡Vea lo que nuestros clientes están diciendo sobre los resultados!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tarjeta de Pregunta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border-orange-500/30 shadow-2xl border-2">
            <CardContent className="p-8">
              {/* Paso de avance automático de experto */}
              {currentStep?.autoAdvance && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  {currentStep?.elements?.expertImage ? (
                    <motion.img
                      src={currentStep.elements.expertImage}
                      alt="Experto en Reconquista"
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-600 mx-auto mb-6"
                      animate={{
                        y: [0, -8, 0],
                        scale: [1, 1.02, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-6"
                  >
                    <p className="text-blue-400 font-semibold text-lg mb-4">{currentStep.elements?.autoMessage}</p>
                  </motion.div>

                  <div className="flex justify-center">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-3 h-3 bg-blue-500 rounded-full"
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

              {/* ✅ NOVA LÓGICA: Renderização especial para finalReveal (nova etapa 12) */}
              {currentStep?.elements?.finalReveal && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-8"
                >
                  {/* Ícone de sucesso animado */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 1, delay: 0.3 }}
                    className="mb-6"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                  </motion.div>

                  {/* Indicador de progresso completo */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="mb-6"
                  >
                    <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Trophy className="w-6 h-6 text-green-400" />
                        <span className="text-2xl font-bold text-green-400">
                          {currentStep.elements.profileComplete}
                        </span>
                      </div>
                      <p className="text-green-300 font-medium">Análisis Completo</p>
                    </div>
                  </motion.div>

                  {/* Indicador de plan listo */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="bg-blue-900/50 border border-blue-500 rounded-lg p-4 mb-6"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Target className="w-6 h-6 text-blue-400" />
                      <span className="text-blue-300 font-semibold">Plan Personalizado Generado</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Foto de experto para el paso 11 */}
              {currentStep?.elements?.expertPhoto && !currentStep?.autoAdvance && (
                <div className="flex justify-center mb-6">
                  {currentStep?.elements?.expertImage ? (
                    <motion.img
                      src={currentStep.elements.expertImage}
                      alt="Experto en Reconquista"
                      className="w-20 h-20 rounded-full object-cover border-4 border-blue-600"
                      animate={{
                        y: [0, -6, 0],
                        rotate: [0, 2, -2, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>
              )}

              {/* Cálculo de compatibilidad para el paso 11 */}
              {currentStep?.elements?.compatibilityCalc && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "91%" }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="mb-6"
                >
                  <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {currentStep.elements.compatibilityCalc} de compatibilidad
                    </div>
                  </div>
                </motion.div>
              )}

              {!currentStep?.autoAdvance && (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                    {getPersonalizedQuestion()}
                  </h2>

                  {currentStep.subtext && (
                    <p className="text-orange-200 text-center mb-6 text-lg font-medium">{currentStep.subtext}</p>
                  )}

                  {currentStep.description && (
                    <p className="text-gray-300 text-center mb-8">{currentStep.description}</p>
                  )}

                  {/* Termómetro para nivel de compromiso */}
                  {currentStep?.elements?.thermometer && (
                    <div className="mb-8">
                      <div className="flex justify-between text-gray-300 text-sm mb-2 font-medium">
                        <span>No estoy seguro</span>
                        <span>Lo quiero mucho</span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-4 mb-4">
                        <motion.div
                          className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: selectedAnswer ? "100%" : "0%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  )}

                  {getPersonalizedOptions().length > 0 && (
                    <div className="space-y-4">
                      {getPersonalizedOptions().map((option, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                          className="relative"
                        >
                          {/* GIF ESPECIAL PARA A OPÇÃO "No dejes que la..." NA ETAPA 1 */}
                          {step === 1 && option.includes("No dejes que la") && (
                            <motion.div
                              initial={{ opacity: 0, y: -20, scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ 
                                delay: 0.3, 
                                duration: 0.6,
                                type: "spring",
                                bounce: 0.4
                              }}
                              className="flex flex-col items-center mb-6"
                            >
                              {/* Container do GIF com efeitos */}
                              <div className="relative mb-3">
                                <motion.img
                                  src="https://comprarplanseguro.shop/wp-content/uploads/2025/06/edy1q-marilyn-monroe-gif-by-maudit.gif"
                                  alt="Marilyn Monroe GIF"
                                  className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-full border-4 border-gradient-to-r from-pink-500 to-red-500 shadow-2xl"
                                  animate={{
                                    y: [0, -8, 0],
                                    rotate: [0, 2, -2, 0],
                                  }}
                                  transition={{
                                    duration: 4,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                  }}
                                  style={{
                                    filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
                                    boxShadow: '0 0 30px rgba(236, 72, 153, 0.5)',
                                  }}
                                />
                                
                                {/* Efeito de brilho pulsante */}
                                <motion.div 
                                  className="absolute inset-0 rounded-full border-4 border-pink-400 opacity-60"
                                  animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.6, 0.3, 0.6],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                  }}
                                />
                                
                                {/* Partículas de brilho */}
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-400 rounded-full animate-ping opacity-75"></div>
                                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-60" style={{animationDelay: '0.5s'}}></div>
                              </div>
                              
                              {/* Texto motivacional */}
                              <motion.p 
                                className="text-pink-300 text-sm font-semibold text-center max-w-xs"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                              >
                                💋 ¡La opción más poderosa para reconquistar!
                              </motion.p>
                            </motion.div>
                          )}

                          <button
                            onClick={() => handleAnswerSelect(option)}
                            data-option={option}
                            className={`w-full p-6 text-left justify-start text-wrap h-auto rounded-lg border-2 transition-all duration-300 transform hover:scale-102 ${
                              selectedAnswer === option
                                ? "bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-500 shadow-lg scale-105"
                                : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500 shadow-sm"
                            }`}
                          >
                            <div className="flex items-center w-full">
                              {/* Iconos para diferentes pasos */}
                              <div className={`mr-4 ${selectedAnswer === option ? "text-white" : "text-orange-400"}`}>
                                {getStepIcon(step, index)}
                              </div>

                              <div
                                className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                                  selectedAnswer === option ? "border-white bg-white" : "border-gray-400 bg-gray-700"
                                }`}
                              >
                                {selectedAnswer === option && <Check className="w-3 h-3 text-orange-600" />}
                              </div>
                              <span className="flex-1 font-medium">{option}</span>
                            </div>
                          </button>

                          {/* Efecto de pulso para botones */}
                          {!selectedAnswer && (
                            <motion.div
                              className="absolute inset-0 rounded-lg border-2 border-orange-400/50 pointer-events-none"
                              animate={{
                                opacity: [0, 0.3, 0],
                                scale: [1, 1.02, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: index * 0.5,
                              }}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {currentStep.note && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="mt-6 text-center text-amber-300 bg-amber-900/30 p-4 rounded-lg border border-amber-600"
                    >
                      <p className="font-medium">{currentStep.note}</p>
                    </motion.div>
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

                  {selectedAnswer && getPersonalizedOptions().length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 text-center"
                    >
                      {/* ✅ ATUALIZADO: Botão agora usa 12 como referência para resultado */}
                      <Button
                        onClick={handleNext}
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-full shadow-lg max-w-full"
                      >
                        {step === 12 ? "Ver Resultado" : "Siguiente Pregunta"}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Prueba Social */}
        {step > 2 && !currentStep?.autoAdvance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center space-y-2 mt-6"
          >
            {currentStep?.elements?.counter && (
              <p className="text-white text-sm bg-white/10 px-3 py-1 rounded-full inline-block">
                👥 {peopleCount} {currentStep.elements.counter}
              </p>
            )}

            {currentStep?.elements?.helpedCounter && (
              <p className="text-green-400 text-sm font-semibold bg-green-900/20 px-3 py-1 rounded-full inline-block">
                ✅ {currentStep.elements.helpedCounter}
              </p>
            )}

            {step > 5 && (
              <p className="text-blue-300 text-sm bg-blue-900/20 px-3 py-1 rounded-full inline-block">
                {socialProofMessages[Math.min(step - 6, socialProofMessages.length - 1)]}
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Modal de Análisis de Carga */}
      <AnimatePresence>
        {showAnalysis && (
          <LoadingAnalysis
            message={
              currentStep?.elements?.analysisText ||
              currentStep?.elements?.profileAnalysis ||
              "Analizando tus respuestas..."
            }
            successMessage={currentStep?.elements?.successRate}
          />
        )}
      </AnimatePresence>

      {/* Modal de Desbloqueo de Bonificación */}
      <AnimatePresence>
        {showBonusUnlock && newBonus && <BonusUnlock bonus={newBonus} onComplete={handleBonusUnlockComplete} />}
      </AnimatePresence>
    </div>
  )
}
