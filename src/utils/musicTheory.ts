import {
  CHROMATIC_SHARPS,
  CHROMATIC_FLATS,
  NOTE_PITCH_MAP,
  TYPE_SYMBOLS,
  TYPE_LABELS,
  CHORD_INTERVALS,
} from "@/constants/chords";
import { DEGREE_LABELS, HARMONIC_SCALES } from "@/constants/scales";
import { ChordMeta, ChordProgression, HarmonicDegree, InversionDescription } from "@/types/music";

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

const MAJOR_FLAT_PITCHES = new Set([5, 10, 3, 8, 1, 6]); // F, Bb, Eb, Ab, Db, Gb

const SCALE_RELATIVE_MAJOR_OFFSET: Record<string, number> = {
  major: 0,
  natural_minor: 3,
  harmonic_minor: 3,
  melodic_minor: 3,
  dorian: 10,
  phrygian: 8,
  lydian: 7,
  mixolydian: 5,
  locrian: 1,
};

export function shouldScaleUseFlat(tonicPitch: number, scaleId: string): boolean {
  const offset = SCALE_RELATIVE_MAJOR_OFFSET[scaleId] ?? 0;
  const relativeMajorPitch = (tonicPitch + offset) % 12;
  return MAJOR_FLAT_PITCHES.has(relativeMajorPitch);
}

export function generateHarmonicField(
  tonicNote: string,
  scaleId: string,
  useTetrads: boolean
): HarmonicDegree[] {
  const scale = HARMONIC_SCALES.find((s) => s.id === scaleId) || HARMONIC_SCALES[0];
  const tonicPitch = getPitch(tonicNote);
  const scaleUseFlat = shouldScaleUseFlat(tonicPitch, scale.id);
  const noteList = scaleUseFlat ? CHROMATIC_FLATS : CHROMATIC_SHARPS;

  const types = useTetrads ? scale.tetradTypes : scale.triadTypes;
  const romans = useTetrads ? scale.romanTetrads : scale.romanTriads;

  return scale.intervals.map((semitoneOffset, idx) => {
    const degreePitch = (tonicPitch + semitoneOffset) % 12;
    const displayRoot = noteList[degreePitch];
    const selectRoot = CHROMATIC_SHARPS[degreePitch];
    const type = types[idx] || "major";
    const intervals = CHORD_INTERVALS[type] || [0, 4, 7];

    // Estado fundamental ajustado para caber nas 2 oitavas do teclado
    const keys = fitTo2Octaves(intervals.map((iv) => degreePitch + iv));
    const useFlat = scaleUseFlat || isFlatChord(displayRoot, type);
    const { chordSymbol, chordFullName } = getChordMeta(displayRoot, type);

    return {
      degreeIndex: idx,
      degreeLabel: DEGREE_LABELS[idx],
      roman: romans[idx],
      root: displayRoot,
      selectRoot,
      type,
      chordSymbol,
      chordFullName,
      keys,
      notesText: formatNotesText(keys, useFlat),
      useFlat,
      harmonicFunction: scale.functions[idx],
    };
  });
}

export function resolveProgressionChords(
  progression: ChordProgression,
  tonicNote: string,
  formationMode: "auto" | "triads" | "tetrads" = "auto"
): HarmonicDegree[] {
  const useTetrads =
    formationMode === "auto" ? Boolean(progression.preferTetrads) : formationMode === "tetrads";

  const field = generateHarmonicField(tonicNote, progression.scaleId, useTetrads);

  return progression.steps.map((step) => {
    const baseDegree = field[step.degreeIndex] || field[0];
    if (!step.overrideType) {
      return baseDegree;
    }

    const effectiveType =
      formationMode === "triads" && step.overrideType === "7" ? "major" : step.overrideType;
    const effectiveRoman =
      formationMode === "triads" && step.overrideType === "7" && step.overrideRoman
        ? step.overrideRoman.replace(/7$/, "")
        : step.overrideRoman || baseDegree.roman;

    const pitch = getPitch(baseDegree.selectRoot);
    const intervals = CHORD_INTERVALS[effectiveType] || [0, 4, 7];
    const keys = fitTo2Octaves(intervals.map((iv) => pitch + iv));
    const useFlat = baseDegree.useFlat || isFlatChord(baseDegree.root, effectiveType);
    const { chordSymbol, chordFullName } = getChordMeta(baseDegree.root, effectiveType);

    return {
      ...baseDegree,
      type: effectiveType,
      roman: effectiveRoman,
      chordSymbol,
      chordFullName,
      keys,
      notesText: formatNotesText(keys, useFlat),
      useFlat,
    };
  });
}
