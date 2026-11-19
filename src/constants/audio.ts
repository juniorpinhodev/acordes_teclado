import { TimbreOption } from "@/types/audio";

export const TIMBRE_OPTIONS: TimbreOption[] = [
  {
    id: "acoustic_piano",
    label: "Piano de Cauda",
    icon: "🎹",
    category: "acoustic",
    description: "Steinway Grand Piano acústico real com múltiplos níveis de dinâmica.",
  },
  {
    id: "electric_piano",
    label: "Rhodes Elétrico",
    icon: "⚡",
    category: "electric",
    description: "Piano elétrico vintage encorpado no estilo Fender Rhodes / Wurlitzer.",
  },
  {
    id: "synth_poly",
    label: "Synth Polifônico",
    icon: "🎛️",
    category: "synth",
    description: "Sintetizador analógico polifônico com filtros e brilho harmônico.",
  },
  {
    id: "synth_pad",
    label: "Synth Pad Atmosférico",
    icon: "🌌",
    category: "synth",
    description: "Pad ambiente envolvente com ataque suave e cauda espacial.",
  },
];
