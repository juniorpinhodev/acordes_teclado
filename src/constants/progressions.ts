import { ChordProgression, ProgressionGenre } from "@/types/music";

export const PROGRESSION_GENRES: ProgressionGenre[] = [
  "Pop",
  "Gospel / Worship",
  "Jazz",
  "Blues",
  "Soul / R&B",
  "Rock",
  "Metal",
];

export const POPULAR_PROGRESSIONS: ChordProgression[] = [
  // ==================== POP ====================
  {
    id: "pop-axis",
    name: "4 Acordes do Pop (Axis)",
    genre: "Pop",
    scaleId: "major",
    description: "A sequência mais famosa do mundo — toca centenas de hits (Let It Be, Pais e Filhos, Someone Like You).",
    steps: [
      { degreeIndex: 0 }, // Iº
      { degreeIndex: 4 }, // Vº
      { degreeIndex: 5 }, // VIº
      { degreeIndex: 3 }, // IVº
    ],
  },
  {
    id: "pop-emocional",
    name: "Emocional",
    genre: "Pop",
    scaleId: "major",
    description: "Dramática e envolvente — base de baladas pop, sertanejo e hits internacionais (Zombie, Despacito).",
    steps: [
      { degreeIndex: 5 }, // VIº
      { degreeIndex: 3 }, // IVº
      { degreeIndex: 0 }, // Iº
      { degreeIndex: 4 }, // Vº
    ],
  },
  {
    id: "pop-anos-50",
    name: "Anos 50 (Doo-Wop)",
    genre: "Pop",
    scaleId: "major",
    description: "Clássica nostálgica e romântica (Stand By Me, Every Breath You Take, Unchained Melody).",
    steps: [
      { degreeIndex: 0 }, // Iº
      { degreeIndex: 5 }, // VIº
      { degreeIndex: 3 }, // IVº
      { degreeIndex: 4 }, // Vº
    ],
  },
  {
    id: "pop-moderna",
    name: "Moderna",
    genre: "Pop",
    scaleId: "major",
    description: "Abertura brilhante com resolução emocional, muito usada no pop e indie atual.",
    steps: [
      { degreeIndex: 0 }, // Iº
      { degreeIndex: 3 }, // IVº
      { degreeIndex: 5 }, // VIº
      { degreeIndex: 4 }, // Vº
    ],
  },
  {
    id: "pop-popular",
    name: "Popular (Royal Road)",
    genre: "Pop",
    scaleId: "major",
    description: "Explosiva em refrões — muito presente no pop brasileiro, sertanejo, MPB e J-Pop.",
    steps: [
      { degreeIndex: 3 }, // IVº
      { degreeIndex: 4 }, // Vº
      { degreeIndex: 2 }, // IIIº
      { degreeIndex: 5 }, // VIº
    ],
  },

  // ==================== GOSPEL / WORSHIP ====================
  {
    id: "worship-atmosferico",
    name: "Worship Atmosférico",
    genre: "Gospel / Worship",
    scaleId: "major",
    description: "A progressão nº 1 da adoração moderna — gera amplitude e movimento contínuo no refrão.",
    steps: [
      { degreeIndex: 3 }, // IVº
      { degreeIndex: 0 }, // Iº
      { degreeIndex: 4 }, // Vº
      { degreeIndex: 5 }, // VIº
    ],
  },
  {
    id: "worship-clamor",
    name: "Worship Clamor & Ponte",
    genre: "Gospel / Worship",
    scaleId: "major",
    description: "Tensão crescente do menor relativo para a dominante — muito usada em pontes e refrões.",
    steps: [
      { degreeIndex: 5 }, // VIº
      { degreeIndex: 4 }, // Vº
      { degreeIndex: 3 }, // IVº
      { degreeIndex: 4 }, // Vº
    ],
  },
  {
    id: "worship-espontaneo",
    name: "Adoração Espontânea (3 Acordes)",
    genre: "Gospel / Worship",
    scaleId: "major",
    description: "Ciclo aberto e suave de 3 acordes perfeito para ministrações e fundo de oração.",
    steps: [
      { degreeIndex: 3 }, // IVº
      { degreeIndex: 0 }, // Iº
      { degreeIndex: 4 }, // Vº
    ],
  },
  {
    id: "gospel-subida",
    name: "Subida Gospel (Escalada)",
    genre: "Gospel / Worship",
    scaleId: "major",
    description: "Movimento ascendente de 5 acordes para construir clímax e explosão na música.",
    steps: [
      { degreeIndex: 0 }, // Iº
      { degreeIndex: 1 }, // IIº
      { degreeIndex: 2 }, // IIIº
      { degreeIndex: 3 }, // IVº
      { degreeIndex: 4 }, // Vº
    ],
  },
  {
    id: "gospel-tradicional",
    name: "Gospel Tradicional",
    genre: "Gospel / Worship",
    scaleId: "major",
    description: "Base clássica de hinos congregacionais, corinhos e louvores tradicionais.",
    steps: [
      { degreeIndex: 0 }, // Iº
      { degreeIndex: 3 }, // IVº
      { degreeIndex: 0 }, // Iº
      { degreeIndex: 4 }, // Vº
      { degreeIndex: 0 }, // Iº
    ],
  },
  {
    id: "gospel-black-turnaround",
    name: "Gospel Black (Turnaround)",
    genre: "Gospel / Worship",
    scaleId: "major",
    description: "Sequência cadencial vibrante de 5 acordes (experimente ativar Tétrades para soar ainda mais Gospel).",
    steps: [
      { degreeIndex: 0 }, // Iº
      { degreeIndex: 5 }, // VIº
      { degreeIndex: 1 }, // IIº
      { degreeIndex: 4 }, // Vº
      { degreeIndex: 0 }, // Iº
    ],
  },

  // ==================== JAZZ ====================
  {
    id: "jazz-ii-v-i",
    name: "ii - V - I (Padrão Ouro)",
    genre: "Jazz",
    scaleId: "major",
    preferTetrads: true,
    description: "A cadência mais tocada do Jazz e da Bossa Nova — aparece em quase todos os standards.",
    steps: [
      { degreeIndex: 1 }, // IIº
      { degreeIndex: 4 }, // Vº
      { degreeIndex: 0 }, // Iº
    ],
  },
  {
    id: "jazz-turnaround",
    name: "Turnaround Jazz & MPB",
    genre: "Jazz",
    scaleId: "major",
    preferTetrads: true,
    description: "Ciclo clássico de 4 acordes (Fly Me to the Moon, Blue Moon, standards de Bossa Nova).",
    steps: [
      { degreeIndex: 0 }, // Iº
      { degreeIndex: 5 }, // VIº
      { degreeIndex: 1 }, // IIº
      { degreeIndex: 4 }, // Vº
    ],
  },

  // ==================== BLUES ====================
  {
    id: "blues-classico",
    name: "Blues Clássico (12 Compassos)",
    genre: "Blues",
    scaleId: "major",
    preferTetrads: true,
    description: "A estrutura que toca milhares de músicas de Blues, Rock'n'Roll clássico e Soul.",
    steps: [
      { degreeIndex: 0, overrideType: "7", overrideRoman: "I7" },
      { degreeIndex: 3, overrideType: "7", overrideRoman: "IV7" },
      { degreeIndex: 0, overrideType: "7", overrideRoman: "I7" },
      { degreeIndex: 4, overrideType: "7", overrideRoman: "V7" },
      { degreeIndex: 3, overrideType: "7", overrideRoman: "IV7" },
      { degreeIndex: 0, overrideType: "7", overrideRoman: "I7" },
    ],
  },
  {
    id: "blues-3-acordes",
    name: "Blues 3 Acordes (Essencial)",
    genre: "Blues",
    scaleId: "major",
    preferTetrads: true,
    description: "A base mais direta do Blues e Boogie-Woogie usando os três acordes dominantes.",
    steps: [
      { degreeIndex: 0, overrideType: "7", overrideRoman: "I7" },
      { degreeIndex: 3, overrideType: "7", overrideRoman: "IV7" },
      { degreeIndex: 4, overrideType: "7", overrideRoman: "V7" },
    ],
  },
  {
    id: "blues-menor",
    name: "Blues Menor (Estilo B.B. King)",
    genre: "Blues",
    scaleId: "natural_minor",
    preferTetrads: true,
    description: "Dramático e expressivo — clássico em The Thrill Is Gone e blues modernos.",
    steps: [
      { degreeIndex: 0 }, // i7
      { degreeIndex: 3 }, // iv7
      { degreeIndex: 0 }, // i7
      { degreeIndex: 4, overrideType: "7", overrideRoman: "V7" },
      { degreeIndex: 3 }, // iv7
      { degreeIndex: 0 }, // i7
    ],
  },
  {
    id: "blues-slow-8-compassos",
    name: "Slow Blues (8 Compassos)",
    genre: "Blues",
    scaleId: "major",
    preferTetrads: true,
    description: "Clássico do Blues lento e Soul-Blues (Key to the Highway, Trouble in Mind).",
    steps: [
      { degreeIndex: 0, overrideType: "7", overrideRoman: "I7" },
      { degreeIndex: 4, overrideType: "7", overrideRoman: "V7" },
      { degreeIndex: 3, overrideType: "7", overrideRoman: "IV7" },
      { degreeIndex: 0, overrideType: "7", overrideRoman: "I7" },
      { degreeIndex: 4, overrideType: "7", overrideRoman: "V7" },
    ],
  },
  {
    id: "blues-turnaround",
    name: "Blues Turnaround (Jazz-Blues)",
    genre: "Blues",
    scaleId: "major",
    preferTetrads: true,
    description: "Retorno sofisticado de 4 acordes para encerrar ou reiniciar o ciclo do Blues.",
    steps: [
      { degreeIndex: 0, overrideType: "7", overrideRoman: "I7" },
      { degreeIndex: 5, overrideType: "7", overrideRoman: "VI7" },
      { degreeIndex: 1 }, // ii7
      { degreeIndex: 4, overrideType: "7", overrideRoman: "V7" },
    ],
  },

  // ==================== SOUL / R&B ====================
  {
    id: "neosoul-descendente",
    name: "Neo-Soul & R&B Suave",
    genre: "Soul / R&B",
    scaleId: "major",
    description: "Caminhada elegante por graus conjuntos, típica de R&B contemporâneo.",
    steps: [
      { degreeIndex: 3 }, // IVº
      { degreeIndex: 2 }, // IIIº
      { degreeIndex: 1 }, // IIº
      { degreeIndex: 0 }, // Iº
    ],
  },
  {
    id: "rnb-groove",
    name: "Soul / R&B Groove",
    genre: "Soul / R&B",
    scaleId: "major",
    description: "Sequência sofisticada com preparação e resolução suave usada em R&B e Gospel Black.",
    steps: [
      { degreeIndex: 1 }, // IIº
      { degreeIndex: 4 }, // Vº
      { degreeIndex: 2 }, // IIIº
      { degreeIndex: 5 }, // VIº
    ],
  },
  {
    id: "rnb-romantico-90s",
    name: "R&B Romântico (Anos 90/2000)",
    genre: "Soul / R&B",
    scaleId: "major",
    description: "Clássica de baladas R&B e Slow Jams (Boyz II Men, Usher, Mariah Carey).",
    steps: [
      { degreeIndex: 3 }, // IVº
      { degreeIndex: 4 }, // Vº
      { degreeIndex: 2 }, // IIIº
      { degreeIndex: 5 }, // VIº
    ],
  },
  {
    id: "neosoul-vi-ii-v-i",
    name: "Neo-Soul Clássico (vi - ii - V - I)",
    genre: "Soul / R&B",
    scaleId: "major",
    description: "Ciclo quente de quartas muito usado por Silk Sonic, Bruno Mars, D'Angelo e Daniel Caesar.",
    steps: [
      { degreeIndex: 5 }, // vi
      { degreeIndex: 1 }, // ii
      { degreeIndex: 4 }, // V
      { degreeIndex: 0 }, // I
    ],
  },
  {
    id: "soul-motown",
    name: "Soul Clássico (Motown)",
    genre: "Soul / R&B",
    scaleId: "major",
    description: "Groove clássico e vibrante inspirado em Stevie Wonder e Marvin Gaye.",
    steps: [
      { degreeIndex: 0 }, // I
      { degreeIndex: 2 }, // iii
      { degreeIndex: 3 }, // IV
      { degreeIndex: 4 }, // V
    ],
  },
  {
    id: "rnb-menor-soul",
    name: "R&B & Soul Menor (Vibe 'Two of Us')",
    genre: "Soul / R&B",
    scaleId: "natural_minor",
    description: "Cadência menor envolvente com V dominante — clássico do Soul e R&B.",
    steps: [
      { degreeIndex: 0 }, // i
      { degreeIndex: 3 }, // iv
      { degreeIndex: 5 }, // VI
      { degreeIndex: 4, overrideType: "7", overrideRoman: "V7" }, // V7
    ],
  },

  // ==================== ROCK ====================
  {
    id: "rock-classico",
    name: "Rock Clássico (3 Acordes)",
    genre: "Rock",
    scaleId: "major",
    description: "A base direta de milhares de clássicos (La Bamba, Twist and Shout, Wild Thing).",
    steps: [
      { degreeIndex: 0 }, // Iº
      { degreeIndex: 3 }, // IVº
      { degreeIndex: 4 }, // Vº
    ],
  },
  {
    id: "rock-mixolidio",
    name: "Rock Arena (Mixolídio)",
    genre: "Rock",
    scaleId: "mixolydian",
    description: "Uso do VIIº maior (bVII) — marca de Sweet Child O' Mine, Hey Jude e rock dos anos 70/80.",
    steps: [
      { degreeIndex: 0 }, // Iº
      { degreeIndex: 6 }, // VIIº
      { degreeIndex: 3 }, // IVº
      { degreeIndex: 0 }, // Iº
    ],
  },

  // ==================== METAL ====================
  {
    id: "metal-epico",
    name: "Metal Épico (Menor Natural)",
    genre: "Metal",
    scaleId: "natural_minor",
    description: "Progressão grandiosa presente em Iron Maiden, Metallica e trilhas épicas.",
    steps: [
      { degreeIndex: 0 }, // i
      { degreeIndex: 5 }, // VI
      { degreeIndex: 2 }, // III
      { degreeIndex: 6 }, // VII
    ],
  },
  {
    id: "metal-andaluz",
    name: "Heavy Metal Clássico (Andaluza)",
    genre: "Metal",
    scaleId: "natural_minor",
    description: "Descida dramática até o V maior — clássica do Heavy Metal, Flamenco e Hit the Road Jack.",
    steps: [
      { degreeIndex: 0 }, // i
      { degreeIndex: 6 }, // VII
      { degreeIndex: 5 }, // VI
      { degreeIndex: 4, overrideType: "major", overrideRoman: "V" }, // V maior
    ],
  },
];
