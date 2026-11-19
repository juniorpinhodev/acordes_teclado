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
