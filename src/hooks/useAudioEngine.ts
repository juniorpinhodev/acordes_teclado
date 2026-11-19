"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { TimbreType } from "@/types/audio";
import { midiToNoteName } from "@/utils/midiHelper";

export function useAudioEngine() {
  const [currentTimbre, setCurrentTimbre] = useState<TimbreType>("acoustic_piano");
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);
  const [volume, setVolume] = useState<number>(0.85);

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Instâncias dos instrumentos
  const acousticPianoRef = useRef<any>(null);
  const electricPianoRef = useRef<any>(null);
  const synthPolyRef = useRef<any>(null);
  const synthPadRef = useRef<any>(null);
  const toneInitializedRef = useRef<boolean>(false);

  // Garante que o AudioContext esteja ativo
  const ensureAudioContext = useCallback(async () => {
    if (typeof window === "undefined") return null;

    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
        const masterGain = audioContextRef.current.createGain();
        masterGain.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
        masterGain.connect(audioContextRef.current.destination);
        masterGainRef.current = masterGain;
      }
    }

    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    setIsAudioInitialized(true);
    return audioContextRef.current;
  }, [volume]);

  // Carrega e inicializa o instrumento selecionado
  const loadInstrument = useCallback(
    async (timbre: TimbreType) => {
      const ctx = await ensureAudioContext();
      if (!ctx) return;

      setIsLoadingSamples(true);
      try {
        if (timbre === "acoustic_piano" && !acousticPianoRef.current) {
          const { SplendidGrandPiano } = await import("smplr");
          const piano = new SplendidGrandPiano(ctx, {
            destination: masterGainRef.current || ctx.destination,
          });
          await piano.ready;
          acousticPianoRef.current = piano;
        } else if (timbre === "electric_piano" && !electricPianoRef.current) {
          const { ElectricPiano } = await import("smplr");
          const ep = new ElectricPiano(ctx, {
            instrument: "WurlitzerEP200",
            destination: masterGainRef.current || ctx.destination,
          });
          await ep.ready;
          electricPianoRef.current = ep;
        } else if ((timbre === "synth_poly" || timbre === "synth_pad") && !toneInitializedRef.current) {
          const Tone = await import("tone");
          await Tone.start();

          // Sintetizador Polifônico com brilho e envelope rápido
          const poly = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "sawtooth" },
            envelope: {
              attack: 0.02,
              decay: 0.2,
              sustain: 0.5,
              release: 0.8,
            },
          }).toDestination();
          poly.volume.value = -6;
          synthPolyRef.current = poly;

          // Synth Pad atmosférico com ataque suave e cauda espacial
          const pad = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "triangle" },
            envelope: {
              attack: 0.35,
              decay: 0.5,
              sustain: 0.85,
              release: 1.8,
            },
          }).toDestination();
          pad.volume.value = -8;
          synthPadRef.current = pad;

          toneInitializedRef.current = true;
        }
      } catch (err) {
        console.error("Erro ao carregar timbre:", timbre, err);
      } finally {
        setIsLoadingSamples(false);
      }
    },
    [ensureAudioContext]
  );

  // Muda o timbre e pré-carrega
  const setTimbre = useCallback(
    async (timbre: TimbreType) => {
      setCurrentTimbre(timbre);
      await loadInstrument(timbre);
    },
    [loadInstrument]
  );

  // Atualiza o volume principal
  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    }
  }, [volume]);

  // Tocar uma nota (Note On)
  const playNote = useCallback(
    async (midiNumber: number, velocity: number = 90) => {
      await ensureAudioContext();

      // Garante que o timbre atual está carregado
      if (currentTimbre === "acoustic_piano") {
        if (!acousticPianoRef.current) await loadInstrument("acoustic_piano");
        if (acousticPianoRef.current) {
          acousticPianoRef.current.start({
            note: midiNumber,
            velocity: Math.min(127, Math.max(1, velocity)),
          });
        }
      } else if (currentTimbre === "electric_piano") {
        if (!electricPianoRef.current) await loadInstrument("electric_piano");
        if (electricPianoRef.current) {
          electricPianoRef.current.start({
            note: midiNumber,
            velocity: Math.min(127, Math.max(1, velocity)),
          });
        }
      } else if (currentTimbre === "synth_poly") {
        if (!synthPolyRef.current) await loadInstrument("synth_poly");
        if (synthPolyRef.current) {
          const noteName = midiToNoteName(midiNumber);
          synthPolyRef.current.triggerAttack(noteName, undefined, velocity / 127);
        }
      } else if (currentTimbre === "synth_pad") {
        if (!synthPadRef.current) await loadInstrument("synth_pad");
        if (synthPadRef.current) {
          const noteName = midiToNoteName(midiNumber);
          synthPadRef.current.triggerAttack(noteName, undefined, velocity / 127);
        }
      }
    },
    [currentTimbre, ensureAudioContext, loadInstrument]
  );

  // Parar uma nota (Note Off)
  const stopNote = useCallback(
    (midiNumber: number) => {
      if (currentTimbre === "acoustic_piano" && acousticPianoRef.current) {
        acousticPianoRef.current.stop({ note: midiNumber });
      } else if (currentTimbre === "electric_piano" && electricPianoRef.current) {
        electricPianoRef.current.stop({ note: midiNumber });
      } else if (currentTimbre === "synth_poly" && synthPolyRef.current) {
        const noteName = midiToNoteName(midiNumber);
        synthPolyRef.current.triggerRelease(noteName);
      } else if (currentTimbre === "synth_pad" && synthPadRef.current) {
        const noteName = midiToNoteName(midiNumber);
        synthPadRef.current.triggerRelease(noteName);
      }
    },
    [currentTimbre]
  );

  // Tocar um acorde completo (preview com arpejo elegante ou bloco)
  const playChord = useCallback(
    async (
      pianoKeyIndices: number[],
      mode: "arpeggio" | "block" = "arpeggio",
      baseOctaveMidi: number = 48
    ) => {
      await ensureAudioContext();
      // Converte índices de teclas do teclado visual (0..23) em números MIDI reais (ex: 48..71)
      const midiNotes = pianoKeyIndices.map((idx) => baseOctaveMidi + idx);

      if (mode === "arpeggio") {
        midiNotes.forEach((midiNote, i) => {
          setTimeout(() => {
            playNote(midiNote, 95);
            setTimeout(() => {
              stopNote(midiNote);
            }, 1200);
          }, i * 90);
        });
      } else {
        midiNotes.forEach((midiNote) => {
          playNote(midiNote, 90);
          setTimeout(() => {
            stopNote(midiNote);
          }, 1400);
        });
      }
    },
    [ensureAudioContext, playNote, stopNote]
  );

  return {
    currentTimbre,
    isAudioInitialized,
    isLoadingSamples,
    volume,
    setVolume,
    setTimbre,
    ensureAudioContext,
    playNote,
    stopNote,
    playChord,
  };
}
