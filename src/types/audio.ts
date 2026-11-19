export type TimbreType =
  | "acoustic_piano"
  | "electric_piano"
  | "synth_poly"
  | "synth_pad";

export interface TimbreOption {
  id: TimbreType;
  label: string;
  icon: string;
  category: "acoustic" | "electric" | "synth";
  description: string;
}

export interface MidiDeviceState {
  isSupported: boolean;
  connected: boolean;
  deviceName: string | null;
  activeNotes: number[]; // notas MIDI brutas ativas (ex: 60, 64, 67)
  activeKeyIndices: number[]; // mapeadas para as teclas do nosso piano (0..23)
}
