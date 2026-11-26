import { ChordTypeCategory, RootNoteOption } from "@/types/music";

export const CHROMATIC_SHARPS = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
] as const;

export const CHROMATIC_FLATS = [
  "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"
] as const;

export const NOTE_PITCH_MAP: Record<string, number> = {
  "C": 0, "B#": 0,
  "C#": 1, "Db": 1, "C# / Db": 1,
  "D": 2,
  "D#": 3, "Eb": 3, "D# / Eb": 3,
  "E": 4, "Fb": 4,
  "F": 5, "E#": 5,
  "F#": 6, "Gb": 6, "F# / Gb": 6,
  "G": 7,
  "G#": 8, "Ab": 8, "G# / Ab": 8,
  "A": 9,
  "A#": 10, "Bb": 10, "A# / Bb": 10,
  "B": 11, "Cb": 11
};

export const ROOT_NOTE_OPTIONS: RootNoteOption[] = [
  { value: "C", label: "C (Dó)" },
  { value: "C#", label: "C# / Db" },
  { value: "D", label: "D (Ré)" },
  { value: "D#", label: "D# / Eb" },
  { value: "E", label: "E (Mi)" },
  { value: "F", label: "F (Fá)" },
  { value: "F#", label: "F# / Gb" },
  { value: "G", label: "G (Sol)" },
  { value: "G#", label: "G# / Ab" },
  { value: "A", label: "A (Lá)" },
  { value: "A#", label: "A# / Bb" },
  { value: "B", label: "B (Si)" },
];

export const CHORD_TYPE_CATEGORIES: ChordTypeCategory[] = [
  {
    category: "Tríades",
    options: [
      { value: "major", label: "Maior (M)" },
      { value: "minor", label: "Menor (m)" },
      { value: "dim", label: "Diminuto (dim / °)" },
      { value: "aug", label: "Aumentado (aug / +)" },
    ],
  },
  {
    category: "Sustenidos (#)",
    options: [
      { value: "sharp", label: "Sustenido (#)" },
      { value: "sharp_m", label: "Sustenido Menor (#m)" },
      { value: "sharp5", label: "Com 5ª Aumentada (#5)" },
      { value: "7sharp5", label: "Com 7ª e 5ª Aumentada (7(#5))" },
      { value: "7sharp9", label: "Com 7ª e 9ª Aumentada (7(#9))" },
      { value: "maj7sharp11", label: "Com 7ª Maior e 11ª Aumentada (7M(#11))" },
      { value: "augMaj7", label: "Com 7ª Maior e 5ª Aumentada (7M(#5))" },
    ],
  },
  {
    category: "Bemóis (b)",
    options: [
      { value: "flat", label: "Bemol (b)" },
      { value: "flat_m", label: "Bemol Menor (bm)" },
      { value: "b5", label: "Com 5ª Diminuta (b5)" },
      { value: "7b5", label: "Com 7ª e 5ª Diminuta (7(b5))" },
      { value: "7b9", label: "Com 7ª e 9ª Menor (7(b9))" },
      { value: "m7b5_alt", label: "Meio-Diminuto (m7(b5))" },
      { value: "7b13", label: "Com 7ª e 13ª Menor (7(b13))" },
    ],
  },
  {
    category: "Suspensos e Sextas (sus / 6)",
    options: [
      { value: "sus4", label: "Suspenso 4 (sus4)" },
      { value: "sus2", label: "Suspenso 2 (sus2)" },
      { value: "7sus4", label: "Com 7ª e 4ª Suspensa (7sus4)" },
      { value: "6", label: "Com 6ª Maior (6)" },
      { value: "m6", label: "Menor com 6ª (m6)" },
    ],
  },
  {
    category: "Sétimas (7)",
    options: [
      { value: "7", label: "Com 7ª Dominante (7)" },
      { value: "maj7", label: "Com 7ª Maior (7M / maj7)" },
      { value: "m7", label: "Menor com 7ª (m7)" },
      { value: "mMaj7", label: "Menor com 7ª Maior (m7M)" },
      { value: "m7b5", label: "Meio-Diminuto (m7(b5) / ø)" },
      { value: "dim7", label: "Diminuto Completo (dim7 / °)" },
    ],
  },
  {
    category: "Nonas (9 / add9)",
    options: [
      { value: "add9", label: "Com 9ª Adicionada (add9)" },
      { value: "mAdd9", label: "Menor com 9ª Adicionada (m(add9))" },
      { value: "9", label: "Dominante com 9ª (9)" },
      { value: "maj9", label: "Maior com 7ª e 9ª (7M(9))" },
      { value: "m9", label: "Menor com 7ª e 9ª (m9)" },
    ],
  },
];

export const CHORD_INTERVALS: Record<string, number[]> = {
  // Tríades
  major: [0, 4, 7],
  minor: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],

  // Sétimas (Tétrades)
  "7": [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  mMaj7: [0, 3, 7, 11],
  m7b5: [0, 3, 6, 10],
  dim7: [0, 3, 6, 9],

  // Suspensos e Sextas
  sus4: [0, 5, 7],
  sus2: [0, 2, 7],
  "7sus4": [0, 5, 7, 10],
  "6": [0, 4, 7, 9],
  m6: [0, 3, 7, 9],

  // Nonas
  add9: [0, 4, 7, 14],
  mAdd9: [0, 3, 7, 14],
  "9": [0, 4, 7, 10, 14],
  maj9: [0, 4, 7, 11, 14],
  m9: [0, 3, 7, 10, 14],

  // Sustenidos (#)
  sharp: [1, 5, 8],
  sharp_m: [1, 4, 8],
  sharp5: [0, 4, 8],
  "7sharp5": [0, 4, 8, 10],
  "7sharp9": [0, 4, 7, 10, 15],
  maj7sharp11: [0, 4, 7, 11, 18],
  augMaj7: [0, 4, 8, 11],

  // Bemóis (b)
  flat: [-1, 3, 6],
  flat_m: [-1, 2, 6],
  b5: [0, 4, 6],
  "7b5": [0, 4, 6, 10],
  "7b9": [0, 4, 7, 10, 13],
  m7b5_alt: [0, 3, 6, 10],
  "7b13": [0, 4, 7, 10, 20],
};

export const TYPE_LABELS: Record<string, string> = {
  major: "Maior",
  minor: "Menor",
  dim: "Diminuto",
  aug: "Aumentado",
  "7": "com 7ª Dominante",
  maj7: "com 7ª Maior",
  m7: "Menor com 7ª",
  mMaj7: "Menor com 7ª Maior",
  m7b5: "Meio-Diminuto",
  dim7: "Diminuto Completo",
  sus4: "Suspenso 4",
  sus2: "Suspenso 2",
  "7sus4": "com 7ª e 4ª Suspensa",
  "6": "com 6ª",
  m6: "Menor com 6ª",
  add9: "com 9ª Adicionada",
  mAdd9: "Menor com 9ª Adicionada",
  "9": "Dominante com 9ª",
  maj9: "Maior com 7ª e 9ª",
  m9: "Menor com 7ª e 9ª",

  sharp: "Sustenido",
  sharp_m: "Sustenido Menor",
  sharp5: "com 5ª Aumentada (#5)",
  "7sharp5": "com 7ª e 5ª Aumentada (7#5)",
  "7sharp9": "com 7ª e 9ª Aumentada (7#9)",
  maj7sharp11: "com 7ª Maior e 11ª Aumentada (7M#11)",
  augMaj7: "com 7ª Maior e 5ª Aumentada (7M#5)",

  flat: "Bemol",
  flat_m: "Bemol Menor",
  b5: "com 5ª Diminuta (b5)",
  "7b5": "com 7ª e 5ª Diminuta (7b5)",
  "7b9": "com 7ª e 9ª Menor (7b9)",
  m7b5_alt: "Meio-Diminuto (m7(b5))",
  "7b13": "com 7ª e 13ª Menor (7b13)",
};

export const TYPE_SYMBOLS: Record<string, string> = {
  major: "",
  minor: "m",
  dim: "dim",
  aug: "aug",
  "7": "7",
  maj7: "7M",
  m7: "m7",
  mMaj7: "m7M",
  m7b5: "m7(b5)",
  dim7: "dim7",
  sus4: "sus4",
  sus2: "sus2",
  "7sus4": "7sus4",
  "6": "6",
  m6: "m6",
  add9: "add9",
  mAdd9: "m(add9)",
  "9": "9",
  maj9: "7M(9)",
  m9: "m9",

  sharp: "#",
  sharp_m: "#m",
  sharp5: "(#5)",
  "7sharp5": "7(#5)",
  "7sharp9": "7(#9)",
  maj7sharp11: "7M(#11)",
  augMaj7: "7M(#5)",

  flat: "b",
  flat_m: "bm",
  b5: "(b5)",
  "7b5": "7(b5)",
  "7b9": "7(b9)",
  m7b5_alt: "m7(b5)",
  "7b13": "7(b13)",
};

export const STORAGE_KEY = "acordes_teclado_slots_v1";
export const INITIAL_SLOTS = 3;
