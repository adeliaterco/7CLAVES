"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowRight, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// GA otimizado - só envia quando necessário
const enviarEvento = (() => {
  let queue = []
  let timeout

  return (evento, props = {}) => {
    queue.push({ evento, props })
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      if (typeof window !== "undefined" && window.gtag && queue.length) {
        queue.forEach(({ evento, props }) => {
          window.gtag("event", evento, props)
        })
        queue = []
      }
    }, 500)
  }
})()

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [isOnline, setIsOnline] = useState(true)

  // Detecção de conexão minimalista
  useEffect(() => {
    if (typeof window === "undefined") return

    const updateOnlineStatus = () => setIsOnline(navigator.onLine)

    window.addEventListener("online", updateOnlineStatus, { passive: true })
    window.addEventListener("offline", updateOnlineStatus, { passive: true })

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  // Tracking minimalista - só o essencial
  useEffect(() => {
    if (typeof window === "undefined") return

    const timer = setTimeout(() => {
      enviarEvento("page_view", {
        device: window.innerWidth < 768 ? "mobile" : "desktop",
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Função de início ultra-otimizada
  const handleStart = useCallback(() => {
    if (isLoading || !isOnline) return

    setIsLoading(true)
    setLoadingProgress(20)

    enviarEvento("quiz_start")

    let progress = 20
    const interval = setInterval(() => {
      progress += 15
      setLoadingProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)

        // Preservar UTMs
        let url = "/quiz/1"
        if (typeof window !== "undefined" && window.location.search) {
          const params = new URLSearchParams(window.location.search)
          const utms = new URLSearchParams()

          for (const [key, value] of params) {
            if (key.startsWith("utm_")) utms.set(key, value)
          }

          if (utms.toString()) url += `?${utms.toString()}`
        }

        router.push(url)
      }
    }, 200)
  }, [isLoading, isOnline, router])

  return (
    <>
      <head>
        <link rel="preconnect" href="https://comprarplanseguro.shop" />
        <link rel="dns-prefetch" href="https://comprarplanseguro.shop" />
      </head>
      <div
        style={{
          backgroundColor: "#000000",
          minHeight: "100vh",
          padding: "20px",
          position: "relative",
        }}
      >
        <style jsx>{`
.btn-quiz-pulsante{background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%)!important;color:white!important;border:none!important;padding:18px 36px!important;font-size:19px!important;font-weight:bold!important;border-radius:50px!important;text-transform:uppercase!important;cursor:pointer!important;transition:all .3s ease!important;animation:pulsar 2s infinite!important;width:100%!important;max-width:320px!important;box-shadow:0 8px 25px rgba(220,38,38,.4)!important;letter-spacing:.5px!important}
@keyframes pulsar{0%{transform:scale3d(1, 1, 1);box-shadow:0 8px 25px rgba(220,38,38,.4),0 0 0 0 rgba(220,38,38,.7)}70%{transform:scale3d(1.03, 1.03, 1);box-shadow:0 12px 35px rgba(220,38,38,.6),0 0 0 15px rgba(220,38,38,0)}100%{transform:scale3d(1, 1, 1);box-shadow:0 8px 25px rgba(220,38,38,.4),0 0 0 0 rgba(220,38,38,0)}}
.btn-quiz-pulsante:hover{background:linear-gradient(135deg,#b91c1c 0%,#991b1b 100%)!important;transform:scale(1.05)!important;box-shadow:0 15px 40px rgba(220,38,38,.7)!important}
.container-preto{background:linear-gradient(145deg,#000 0%,#111 100%)!important;border:2px solid #333!important;border-radius:25px!important;padding:45px!important;max-width:650px!important;margin:0 auto!important;text-align:center!important;box-shadow:0 20px 60px rgba(0,0,0,.8)!important;backdrop-filter:blur(10px)!important;min-height: 400px;contain: layout style;}
.titulo-principal{color:#fff!important;font-size:34px!important;font-weight:800!important;margin-bottom:25px!important;line-height:1.3!important;text-shadow:2px 2px 4px rgba(0,0,0,.5)!important;animation:fadeInUp 1.2s ease-out .3s both!important}
.subtitulo{color:#e5e5e5!important;font-size:19px!important;margin-bottom:35px!important;font-weight:500!important;line-height:1.4!important;animation:fadeInUp 1.2s ease-out .6s both!important}
.texto-garantia{color:#a3a3a3!important;font-size:14px!important;margin-top:20px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;font-weight:500!important}
.indicador-progresso{display:flex!important;align-items:center!important;justify-content:center!important;gap:12px!important;margin-bottom:30px!important;color:#dc2626!important;font-size:14px!important;font-weight:600!important;animation:fadeInUp 1.2s ease-out .9s both!important}
.circulo-progresso{width:12px!important;height:12px!important;border-radius:50%!important;background:#dc2626!important;box-shadow:0 0 10px rgba(220,38,38,.5)!important}
.circulo-inativo{background:#333!important;box-shadow:none!important}
.depoimento{background: linear-gradient(145deg, #111 0%, #000 100%);
  border: 1px solid #444;
  border-radius: 18px;
  padding: 18px;
  max-width: 400px;
  margin: 30px auto;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  min-height: 80px;
  contain: layout;}
.avatar{width: 55px;
  height: 55px;
  border-radius: 50%;
  border: 3px solid #FFD700;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  overflow: hidden;
  aspect-ratio: 1/1;}
.estrelas{color:#FFD700;font-size:13px;text-shadow:0 0 5px rgba(255,215,0,.5)}
.nome-usuario{color:#FFD700;font-weight:bold;font-size:13px}
.texto-depoimento{color:#fff;font-size:12px;line-height:1.4;font-style:italic}
.logo-container{display:flex;justify-content:center;align-items:center;margin-bottom:45px!important;animation:fadeInDown 1.2s ease-out}
.logo-arredondada{border-radius: 15px !important;
  width: 200px !important;
  height: 120px !important;
  object-fit: cover !important;
  border: 4px solid #dc2626 !important;
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.4), 0 0 0 2px #dc2626 !important;
  transition: all 0.4s ease !important;
  display: block !important;
  aspect-ratio: 5/3;}
@keyframes fadeInDown{from{opacity:0;transform: translate3d(0, -40px, 0);}to{opacity:1;transform: translate3d(0, 0, 0);}}
@keyframes fadeInUp{from{opacity:0;transform: translate3d(0, 40px, 0);}to{opacity:1;transform: translate3d(0, 0, 0);}}
.loading-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.95);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(5px)}
.loading-content{text-align:center;color:white}
.progress-bar{width:250px;height:6px;background:#333;border-radius:3px;overflow:hidden;margin-top:25px}
.progress-fill{height:100%;background:linear-gradient(90deg,#dc2626,#f87171);transition:width .3s ease;border-radius:3px}
.main-content{display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding-top: 100px;
  contain: layout style paint;}
.copyright{position:relative;margin-top:40px;padding:20px;color:#888;font-size:12px;text-align:center}
@media (max-width:768px){.container-preto{padding:25px!important;margin:10px!important;border-radius:20px!important}.logo-container{margin-bottom:30px!important}.logo-arredondada{width:160px!important;height:100px!important;border:3px solid #dc2626!important}.titulo-principal{font-size:26px!important;margin-bottom:18px!important;line-height:1.2!important}.subtitulo{font-size:16px!important;margin-bottom:25px!important}.depoimento{padding:15px;margin:20px auto;max-width:95%}.btn-quiz-pulsante{padding:16px 32px!important;font-size:16px!important;max-width:95%!important}.main-content{padding-top:20px;min-height:calc(100vh - 40px)}.copyright{margin-top:30px;padding:15px}}
@media (max-width:480px){.container-preto{padding:20px!important;margin:5px!important}.logo-arredondada{width:140px!important;height:85px!important;border:2px solid #dc2626!important}.titulo-principal{font-size:22px!important;line-height:1.1!important}.subtitulo{font-size:14px!important}.depoimento{padding:12px;gap:10px;margin:15px auto}.avatar{width:35px;height:35px}.btn-quiz-pulsante{padding:14px 28px!important;font-size:14px!important}.copyright{margin-top:25px;padding:10px;font-size:11px}}
@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
`}</style>

        {/* Loading overlay */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div style={{ fontSize: "18px", fontWeight: "600" }}>Preparando tu quiz personalizado...</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${loadingProgress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              left: "20px",
              right: "20px",
              background: "#dc2626",
              color: "white",
              padding: "15px",
              borderRadius: "10px",
              zIndex: 1000,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage("")}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Offline indicator */}
        {!isOnline && (
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              right: "0",
              background: "#f59e0b",
              color: "white",
              textAlign: "center",
              padding: "10px",
              zIndex: 1000,
            }}
          >
            ⚠️ Sem conexão com a internet
          </div>
        )}

        {/* CONTEÚDO PRINCIPAL */}
        <div className="main-content">
          <div className="container-preto">
            {/* LOGO CENTRALIZADA - IMAGEM WEBP OTIMIZADA */}
            <div className="logo-container">
              <Image
                src="https://comprarplanseguro.shop/wp-content/uploads/2025/08/543af5ae-e239-4f03-a3a8-59c53717f3b9.webp"
                alt="Logo Plan A"
                width={200}
                height={120}
                className="logo-arredondada"
                priority
                fetchPriority="high"
                quality={70}
                sizes="(max-width: 480px) 140px, (max-width: 768px) 160px, 200px"
                placeholder="blur"
                blurDataURL="data:image/webp;base64,UklGRpIAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSDIAAAARL0AmbZurmr57yyIiqE8oiG0bejIYEQTgqiDA9vqnsUSI6H+oAERp2HZ65qP/VIAWAFZQOCBCAAAA8AEAnQEqEAAIAAVAfCWkAALp8sF8rgRgAP7o9FDvMCkMde9PK7euH5M1m6VWoDXf2FkP3BqV0ZYbO6NA/VFIAAAA"
                onError={(e) => {
                  e.target.style.display = "none"
                }}
              />
            </div>

            {/* TÍTULO PRINCIPAL OTIMIZADO */}
            <h1 className="titulo-principal">
              Haz que tu amor regrese a ti 100% en piloto automático, incluso en las situaciones más complicadas.
            </h1>

            {/* SUBTÍTULO OTIMIZADO */}
            <p className="subtitulo">
              Sin juegos mentales. Solo el poder del método probado por más de 3.847 personas.
            </p>

            {/* INDICADOR DE PROGRESSO */}
            <div className="indicador-progresso">
              <div className="circulo-progresso"></div>
              <div className="circulo-progresso circulo-inativo"></div>
              <div className="circulo-progresso circulo-inativo"></div>
              <div className="circulo-progresso circulo-inativo"></div>
              <span>Paso 1</span>
            </div>

            {/* BOTÃO CTA OTIMIZADO */}
            <button onClick={handleStart} disabled={isLoading || !isOnline} className="btn-quiz-pulsante">
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  PREPARANDO...
                  <div
                    style={{
                      marginLeft: "10px",
                      width: "18px",
                      height: "18px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                </span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  COMENZAR QUIZ AHORA
                  <ArrowRight style={{ marginLeft: "12px", width: "22px", height: "22px" }} />
                </span>
              )}
            </button>

            {/* TEXTO DE GARANTIA */}
            <div className="texto-garantia">
              <Shield size={16} />
              <span>Confidencial y personalizado. En solo 2 minutos tendrás tu plan de acción.</span>
            </div>
          </div>
        </div>

        {/* DEPOIMENTO MELHORADO - AVATAR WEBP OTIMIZADO */}
        <div className="depoimento">
          <div className="avatar">
            <Image
              src="https://comprarplanseguro.shop/wp-content/uploads/2025/08/Persona-1.webp"
              alt="Pablo Alvez"
              width={55}
              height={55}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              quality={70}
              sizes="(max-width: 480px) 35px, 55px"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRpIAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSDIAAAARL0AmbZurmr57yyIiqE8oiG0bejIYEQTgqiDA9vqnsUSI6H+oAERp2HZ65qP/VIAWAFZQOCBCAAAA8AEAnQEqEAAIAAVAfCWkAALp8sF8rgRgAP7o9FDvMCkMde9PK7euH5M1m6VWoDXf2FkP3BqV0ZYbO6NA/VFIAAAA"
            />
          </div>
          <div>
            <div className="estrelas">★★★★★</div>
            <div className="nome-usuario">Pablo Alvez (@Plaboalvezs)</div>
            <div className="texto-depoimento">
              "Apliqué tu Método de los 3 Pasos y en 2 semanas ella regresó. Sin juegos mentales, ¡simplemente
              funciona!"
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="copyright">Plan A™ Todos los Derechos Reservados.</div>

        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
      <script defer src="data:text/javascript,"></script>
    </>
  )
}
