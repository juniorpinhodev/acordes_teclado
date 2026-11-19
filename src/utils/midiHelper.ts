import { CHROMATIC_SHARPS, CHROMATIC_FLATS, CHORD_INTERVALS, TYPE_SYMBOLS } from "@/constants/chords";

export function midiToNoteName(midiNumber: number, useFlat = false): string {
  const pitch = midiNumber % 12;
  const octave = Math.floor(midiNumber / 12) - 1;
  const noteList = useFlat ? CHROMATIC_FLATS : CHROMATIC_SHARPS;
  return `${noteList[pitch]}${octave}`;
}

export function midiToPitch(midiNumber: number): number {
  return ((midiNumber % 12) + 12) % 12;
}

/**
 * Mapeia uma nota MIDI qualquer (ex: 36..96) para o intervalo de 2 oitavas [0..23] do nosso teclado virtual.
 * Considera C4 (MIDI 60) no início da 2ª oitava (índice 12), e C3 (MIDI 48) no início da 1ª oitava (índice 0).
 */
export function midiToPianoIndex(midiNumber: number): number {
  const baseMidi = 48; // C3
  let offset = midiNumber - baseMidi;
  while (offset < 0) offset += 12;
  while (offset >= 24) offset -= 12;
  return offset;
}

/**
 * Identifica o acorde a partir das notas MIDI pressionadas simultaneamente.
 */
export function detectChordFromPitches(midiNotes: number[]): {
  root: string;
  type: string;
  chordSymbol: string;
  pitches: number[];
} | null {
  if (midiNotes.length < 3) return null;

  const uniquePitches = Array.from(new Set(midiNotes.map((n) => midiToPitch(n)))).sort(
    (a, b) => a - b
  );
  if (uniquePitches.length < 3) return null;

  // Testa cada nota presente como possível fundamental (Root)
  for (const rootPitch of uniquePitches) {
    const rootName = CHROMATIC_SHARPS[rootPitch];
    // Calcula os intervalos em relação a essa nota fundamental (em semitons 0..11)
    const intervalsFromRoot = uniquePitches
      .map((p) => (p - rootPitch + 12) % 12)
      .sort((a, b) => a - b);

    // Compara com os intervalos conhecidos da nossa base de acordes
    for (const [chordType, defIntervals] of Object.entries(CHORD_INTERVALS)) {
      const normalizedDef = Array.from(
        new Set(defIntervals.map((i) => (i % 12 + 12) % 12))
      ).sort((a, b) => a - b);

      if (
        intervalsFromRoot.length === normalizedDef.length &&
        intervalsFromRoot.every((val, idx) => val === normalizedDef[idx])
      ) {
        const symbolSuffix = TYPE_SYMBOLS[chordType] || "";
        return {
          root: rootName,
          type: chordType,
          chordSymbol: `${rootName}${symbolSuffix}`,
          pitches: uniquePitches,
        };
      }
    }
  }

  return null;
}
