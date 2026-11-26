export interface InversionDescription {
  name: string;
  short: string;
  desc: string;
}

export interface ChordMeta {
  chordSymbol: string;
  chordFullName: string;
}

export interface SavedChordSlot {
  root: string;
  type: string;
  chordName: string;
  chordFullName: string;
  inversionIdx: number;
  inversionName: string;
  inversionShort: string;
  keys: number[];
  notesText: string;
  useFlat: boolean;
  locked?: boolean;
}

export interface ModalConfig {
  title?: string;
  message?: string;
  highlightTitle?: string;
  highlightDetail?: string;
  confirmText?: string;
  cancelText?: string;
  secondaryText?: string;
  onConfirm: () => void;
  onSecondaryConfirm?: () => void;
}

export interface RootNoteOption {
  value: string;
  label: string;
}

export interface ChordTypeCategory {
  category: string;
  options: {
    value: string;
    label: string;
  }[];
}

export type HarmonicFunction = "Tônica" | "Subdominante" | "Dominante";

export interface ScaleDefinition {
  id: string;
  name: string;
  description: string;
  intervals: number[];
  triadTypes: string[];
  tetradTypes: string[];
  romanTriads: string[];
  romanTetrads: string[];
  functions: HarmonicFunction[];
}

export interface HarmonicDegree {
  degreeIndex: number;
  degreeLabel: string;
  roman: string;
  root: string;
  selectRoot: string;
  type: string;
  chordSymbol: string;
  chordFullName: string;
  keys: number[];
  notesText: string;
  useFlat: boolean;
  harmonicFunction: HarmonicFunction;
}

export type ProgressionGenre =
  | "Pop"
  | "Gospel / Worship"
  | "Jazz"
  | "Blues"
  | "Soul / R&B"
  | "Rock"
  | "Metal";

export interface ProgressionStep {
  degreeIndex: number;
  overrideType?: string;
  overrideRoman?: string;
}

export interface ChordProgression {
  id: string;
  name: string;
  genre: ProgressionGenre;
  scaleId: string;
  preferTetrads?: boolean;
  description: string;
  steps: ProgressionStep[];
}

export type ScaleCategory =
  | "Maiores & Modos"
  | "Menores & Modos"
  | "Pentatônicas & Blues"
  | "Exóticas & Orientais";

export interface MusicalScaleItem {
  id: string;
  name: string;
  category: ScaleCategory;
  isGreekMode?: boolean;
  intervals: number[];
  detuneCents?: number[];
  formula: string;
  description: string;
}
