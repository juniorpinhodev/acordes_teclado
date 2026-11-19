export type TimbreType =
  | "grand_piano"
  | "fm_piano"
  | "worship_pad"
  | "soft_strings"
  | "rhodes"
  | "gospel_organ";

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
  activeNotes: number[];
  activeKeyIndices: number[];
}
