import {
  CHROMATIC_SHARPS,
  CHROMATIC_FLATS,
  NOTE_PITCH_MAP,
  TYPE_SYMBOLS,
  TYPE_LABELS,
} from "@/constants/chords";
import { ChordMeta, InversionDescription } from "@/types/music";

export function getPitch(note: string): number {
  if (NOTE_PITCH_MAP[note] !== undefined) return NOTE_PITCH_MAP[note];
  return CHROMATIC_SHARPS.indexOf(note as any);
}

export function isFlatChord(rootNote: string, type: string): boolean {
  if (type && (type === "flat" || type === "flat_m" || type === "b5" || type.includes("b"))) {
    return true;
  }
  if (rootNote && (rootNote.includes("b") || rootNote === "F")) {
    return true;
  }
  return false;
}

export function getChordMeta(rootNote: string, type: string): ChordMeta {
  const cleanRoot = rootNote.includes("/") ? rootNote.split("/")[0].trim() : rootNote;
  const symbolSuffix = TYPE_SYMBOLS[type] || "";
  const labelSuffix = TYPE_LABELS[type] || "";

  let chordSymbol = `${cleanRoot}${symbolSuffix}`;
  let chordFullName = `${cleanRoot} ${labelSuffix}`;

  if (type === "sharp") {
    chordSymbol = `${cleanRoot}#`;
    chordFullName = `${cleanRoot} Sustenido Maior`;
  } else if (type === "sharp_m") {
    chordSymbol = `${cleanRoot}#m`;
    chordFullName = `${cleanRoot} Sustenido Menor`;
  } else if (type === "flat") {
    chordSymbol = `${cleanRoot}b`;
    chordFullName = `${cleanRoot} Bemol Maior`;
  } else if (type === "flat_m") {
    chordSymbol = `${cleanRoot}bm`;
    chordFullName = `${cleanRoot} Bemol Menor`;
  }

  return { chordSymbol, chordFullName };
}

export function fitTo2Octaves(chordKeys: number[]): number[] {
  let keys = [...chordKeys];
  while (Math.max(...keys) >= 24) {
    keys = keys.map((k) => k - 12);
  }
  while (Math.min(...keys) < 0) {
    keys = keys.map((k) => k + 12);
  }
  return keys;
}

export function formatNotesText(chordKeys: number[], useFlat = false): string {
  const list = useFlat ? CHROMATIC_FLATS : CHROMATIC_SHARPS;
  return "Notas: " + chordKeys.map((k) => list[(((k % 12) + 12) % 12)]).join(" • ");
}

export function calculateInversions(intervals: number[], rootIndex: number): number[][] {
  const numNotes = intervals.length;
  const maxInv = Math.min(numNotes, 4); // Fundamental, 1ª, 2ª e 3ª
  const inversions: number[][] = [];

  for (let k = 0; k < maxInv; k++) {
    const pitchCollection: number[] = [];
    for (let i = k; i < numNotes; i++) {
      pitchCollection.push(rootIndex + intervals[i]);
    }
    for (let i = 0; i < k; i++) {
      pitchCollection.push(rootIndex + intervals[i] + 12);
    }
    inversions.push(fitTo2Octaves(pitchCollection));
  }
  return inversions;
}

export function getInversionDescriptions(numNotes: number): InversionDescription[] {
  if (numNotes >= 4) {
    return [
      { name: "Estado Fundamental", short: "Fund.", desc: "Tônica no Baixo" },
      { name: "1ª Inversão", short: "1ª Inv.", desc: "Terça no Baixo" },
      { name: "2ª Inversão", short: "2ª Inv.", desc: "Quinta no Baixo" },
      { name: "3ª Inversão", short: "3ª Inv.", desc: "Sétima no Baixo" },
    ];
  } else {
    return [
      { name: "Estado Fundamental", short: "Fund.", desc: "Tônica no Baixo" },
      { name: "1ª Inversão (Primário)", short: "1ª Inv.", desc: "Terça no Baixo" },
      { name: "2ª Inversão (Secundário)", short: "2ª Inv.", desc: "Quinta no Baixo" },
    ];
  }
}
