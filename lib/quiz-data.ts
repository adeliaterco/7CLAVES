export const quizSteps = [
  {
    id: 1,
    question: "¡NO DEJES QUE LA PERSONA QUE AMAS SALGA DE TU VIDA PARA SIEMPRE!",
    description: "Haz la prueba rápida de 2 minutos y descubre cómo aplicar el PLAN A - en tu caso específico.",
    subtext: "Selecciona tu género:",
    options: ["MASCULINO", "FEMENINO"],
    warning: "⚠️ ATENCIÓN: ¡Este método comprobado solo debe usarse si estás 100% comprometido en reconquistar tu amor perdido!",
    elements: {
      heartbeat: true,
      timer: "Prueba de 2 minutos",
    },
    image: "URL_IMAGEN_ETAPA_1",
  },
  {
    id: 2,
    question: "¿CUÁL ES EL SEXO DE TU PRETENDIENTE?",
    options: ["MUJER", "HOMBRE"],
    elements: {
      progressColor: "red",
      progressValue: 10,
    },
    image: "URL_IMAGEN_ETAPA_2",
  },
  {
    id: 3,
    question: "¿QUÉ DESEAS LOGRAR CON LA CADENA?",
    options: ["RECUPERAR UNA RELACIÓN", "CONQUISTAR UN NUEVO AMOR"],
    elements: {
      progressColor: "red",
      progressValue: 20,
    },
    image: "URL_IMAGEN_ETAPA_3",
  },
  {
    id: 4,
    question: "¿CÓMO SE ENCUENTRA ESA PERSONA HOY?",
    options: ["CASADA", "EN UNA RELACIÓN"],
    elements: {
      progressColor: "red",
      progressValue: 30,
    },
    image: "URL_IMAGEN_ETAPA_4",
  },
  {
    id: 5,
    question: "DEL 0 AL 10 ¿QUÉ TAN IMPORTANTE ES ESA PERSONA PARA TI?",
    options: ["DEL 0 AL 3", "DEL 4 AL 7", "DEL 8 AL 10"],
    elements: {
      progressColor: "red",
      progressValue: 40,
    },
    image: "URL_IMAGEN_ETAPA_5",
  },
  {
    id: 6,
    question: "DEL 0 AL 10 ¿CUÁNTO AMAS A ESA PERSONA?",
    options: ["DEL 0 AL 3", "DEL 4 AL 7", "DEL 8 AL 10"],
    elements: {
      progressColor: "red",
      progressValue: 50,
    },
    image: "URL_IMAGEN_ETAPA_6",
  },
  {
    id: 7,
    question: "¿EN ALGÚN MOMENTO YA LE DIJISTE QUE AMAS A ESA PERSONA?",
    options: ["SÍ", "NO"],
    elements: {
      progressColor: "red",
      progressValue: 60,
    },
    image: "URL_IMAGEN_ETAPA_7",
  },
  {
    id: 8,
    question: "¿MANTIENEN CONTACTO?",
    options: ["SÍ", "NO"],
    elements: {
      progressColor: "red",
      progressValue: 70,
    },
    image: "URL_IMAGEN_ETAPA_8",
  },
  {
    id: 9,
    question: "¿CREES QUE ESA PERSONA AÚN TE AMA?",
    options: ["SÍ", "NO"],
    elements: {
      progressColor: "red",
      progressValue: 75,
    },
    image: "URL_IMAGEN_ETAPA_9",
  },
  {
    id: 10,
    question: "¿YA BUSCASTE AYUDA ESPIRITUAL PARA TENER A ESA PERSONA?",
    options: ["SÍ, UN SANTERO", "SÍ, UN TAROTISTA", "SÍ, UN PASTOR", "NO, ¡NUNCA BUSQUÉ!"],
    elements: {
      progressColor: "red",
      progressValue: 80,
    },
    image: "URL_IMAGEN_ETAPA_10",
  },
  {
    id: 11,
    question: "¿YA HICISTE ALGÚN TRABAJO ESPIRITUAL?",
    options: ["SÍ, AMARRE", "SÍ, REZOS", "SÍ, ORACIONES", "NO, NUNCA HICE"],
    elements: {
      progressColor: "red",
      progressValue: 85,
    },
    image: "URL_IMAGEN_ETAPA_11",
  },
  {
    id: 12,
    question: "AHORA VAMOS A ANALIZAR TU NIVEL DE FE, PARA LIBERAR TU ACCESO A LA CADENA",
    options: ["CONTINUAR"],
    elements: {
      progressColor: "red",
      progressValue: 90,
    },
    image: "URL_IMAGEN_ETAPA_12",
  },
  {
    id: 13,
    question: "¿TIENES FE EN QUE ESTA CADENA ESPIRITUAL PUEDE VOLVER LOCO DE AMOR A TU PRETENDIENTE POR TI?",
    options: ["SÍ", "NO"],
    elements: {
      progressColor: "red",
      progressValue: 92,
    },
    image: "URL_IMAGEN_ETAPA_13",
  },
  {
    id: 14,
    question: "¿TIENES FE EN QUE AL HACER LA CADENA TU PRETENDIENTE TE VA A BUSCAR DENTRO DE 7 DÍAS?",
    options: ["SÍ", "NO"],
    elements: {
      progressColor: "red",
      progressValue: 94,
    },
    image: "URL_IMAGEN_ETAPA_14",
  },
  {
    id: 15,
    question: "¿TIENES FE EN QUE LAS FUERZAS ESPIRITUALES PUEDEN ALEJAR TODO MAL DE TU VIDA AMOROSA?",
    options: ["SÍ", "NO"],
    elements: {
      progressColor: "red",
      progressValue: 96,
    },
    image: "URL_IMAGEN_ETAPA_15",
  },
  {
    id: 16,
    question: "¿SOSPECHAS QUE TE HICIERON ALGÚN TRABAJO DE MAGIA NEGRA?",
    options: ["SÍ", "NO"],
    elements: {
      progressColor: "red",
      progressValue: 98,
    },
    image: "URL_IMAGEN_ETAPA_16",
  },
  {
    id: 17,
    question: "RESPONDE CON SINCERIDAD, SI LIBERAMOS EL ACCESO A LA CADENA DEL AMOR, ¿PROMETES HACER LOS REZOS TODOS LOS 7 DÍAS?",
    options: ["SÍ", "NO"],
    elements: {
      progressColor: "red",
      progressValue: 100,
    },
    image: "URL_IMAGEN_ETAPA_17",
  },
  {
    id: 18,
    question: "LIBERANDO EL ACCESO......",
    options: [],
    autoAdvance: true,
    elements: {
      progressColor: "red",
      progressValue: 100,
      loading: true,
    },
    image: "",
  },
];

// Função utilitaria para personalizar textos basados en el género
export function getPersonalizedContent(content: any, gender: string) {
  if (typeof content === "string") {
    return content;
  }

  if (typeof content === "object" && content !== null) {
    if (content.masculino && content.feminino) {
      return gender === "MASCULINO" ? content.masculino : content.feminino;
    }
    return content;
  }

  return content;
}