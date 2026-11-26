"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { TimbreType } from "@/types/audio";

interface PlayableInstrument {
  start: (note: number, velocity: number, detune?: number) => (() => void) | void;
  stop: (note: number) => void;
}

export function useAudioEngine() {
  const [currentTimbre, setCurrentTimbre] = useState<TimbreType>("grand_piano");
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  // Inicia como true pois o grand_piano é carregado automaticamente por default ao abrir a página
  const [isLoadingSamples, setIsLoadingSamples] = useState(true);
  const [loadingPercent, setLoadingPercent] = useState<number>(10);
  const [loadedTimbres, setLoadedTimbres] = useState<Record<string, boolean>>({});
  const [volume, setVolume] = useState<number>(0.85);

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Cache de instrumentos smplr indexado por chave de timbre
  const instrumentsRef = useRef<Record<string, PlayableInstrument>>({});
  const loadingLockRef = useRef<Record<string, boolean>>({});

  // Registro de vozes ativas para interrupção imediata ao soltar a tecla
  const activeVoicesRef = useRef<Map<number, () => void>>(new Map());

  // Chave de Sustain (Ativado / Desativado)
  const [isSustainOn, setIsSustainOn] = useState(false);
  const sustainTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Obtém ou cria o AudioContext de forma síncrona sem bloquear no resume
  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;

    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(volume, ctx.currentTime);
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;
        audioContextRef.current = ctx;
      }
    }
    return audioContextRef.current;
  }, [volume]);

  // Ativa o contexto sonoro quando há interação do usuário (respeitando autoplay policy)
  const resumeAudioContext = useCallback(async () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        // Silencioso se o navegador ainda exigir interação explícita
      }
    }
    setIsAudioInitialized(true);
    return ctx;
  }, [getAudioContext]);

  // Desbloqueia o áudio no primeiro clique, toque ou tecla pressionada
  useEffect(() => {
    const unlockAudio = () => {
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume().catch(() => {});
      }
      setIsAudioInitialized(true);
    };

    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  // Carrega e inicializa o instrumento selecionado via smplr com medidor de progresso
  const loadInstrument = useCallback(
    async (timbre: TimbreType) => {
      // Se já está carregado e em cache, marca como pronto imediatamente
      if (instrumentsRef.current[timbre]) {
        setLoadedTimbres((prev) => ({ ...prev, [timbre]: true }));
        setLoadingPercent(100);
        setIsLoadingSamples(false);
        return instrumentsRef.current[timbre];
      }

      // Evita disparos duplicados concorrentes para o mesmo timbre
      if (loadingLockRef.current[timbre]) return;
      loadingLockRef.current[timbre] = true;

      const ctx = getAudioContext();
      if (!ctx) {
        loadingLockRef.current[timbre] = false;
        return;
      }

      setIsLoadingSamples(true);
      setLoadingPercent(10);

      const handleProgress = ({ loaded, total }: { loaded: number; total: number }) => {
        const pct = total > 0 ? Math.round((loaded / total) * 100) : 15;
        setLoadingPercent(Math.max(10, Math.min(100, pct)));
      };

      try {
        const dest = masterGainRef.current || ctx.destination;

        if (timbre === "grand_piano") {
          // 1. Piano de Cauda Steinway Acústico Real (SplendidGrandPiano smplr)
          const { SplendidGrandPiano } = await import("smplr");
          const piano = new SplendidGrandPiano(ctx, {
            destination: dest,
            onLoadProgress: handleProgress,
          });
          await piano.ready;
          instrumentsRef.current["grand_piano"] = {
            start: (note, velocity, detune) => piano.start({ note, velocity, detune }),
            stop: (note) => piano.stop(note),
          };
        } else if (timbre === "fm_piano") {
          // 2. FM E. Piano Yamaha DX7 clássico (Soundfont electric_piano_2 smplr)
          const { Soundfont } = await import("smplr");
          const fm = new Soundfont(ctx, {
            instrument: "electric_piano_2",
            destination: dest,
            onLoadProgress: handleProgress,
          });
          await fm.ready;
          instrumentsRef.current["fm_piano"] = {
            start: (note, velocity, detune) => fm.start({ note, velocity, detune }),
            stop: (note) => fm.stop(note),
          };
        } else if (timbre === "worship_pad") {
          // 3. Worship Ambient Pad: Halo Pad original que você gostou (Soundfont pad_7_halo smplr)
          const { Soundfont } = await import("smplr");
          const pad = new Soundfont(ctx, {
            instrument: "pad_7_halo",
            destination: dest,
            onLoadProgress: handleProgress,
          });
          await pad.ready;
          instrumentsRef.current["worship_pad"] = {
            start: (note, velocity, detune) => pad.start({ note, velocity, detune }),
            stop: (note) => pad.stop(note),
          };
        } else if (timbre === "soft_strings") {
          // 4. Soft Silk Strings: cordas orquestrais lentas (Soundfont string_ensemble_2 smplr)
          const { Soundfont } = await import("smplr");
          const strings = new Soundfont(ctx, {
            instrument: "string_ensemble_2",
            destination: dest,
            onLoadProgress: handleProgress,
          });
          await strings.ready;
          instrumentsRef.current["soft_strings"] = {
            start: (note, velocity, detune) => strings.start({ note, velocity, detune }),
            stop: (note) => strings.stop(note),
          };
        } else if (timbre === "rhodes") {
          // 5. Fender Rhodes Mark I Neo-Soul (Soundfont electric_piano_1 smplr)
          const { Soundfont } = await import("smplr");
          const rhodes = new Soundfont(ctx, {
            instrument: "electric_piano_1",
            destination: dest,
            onLoadProgress: handleProgress,
          });
          await rhodes.ready;
          instrumentsRef.current["rhodes"] = {
            start: (note, velocity, detune) => rhodes.start({ note, velocity, detune }),
            stop: (note) => rhodes.stop(note),
          };
        } else if (timbre === "gospel_organ") {
          // 6. Órgão Hammond B3 Drawbar com Leslie (Soundfont drawbar_organ smplr)
          const { Soundfont } = await import("smplr");
          const organ = new Soundfont(ctx, {
            instrument: "drawbar_organ",
            destination: dest,
            onLoadProgress: handleProgress,
          });
          await organ.ready;
          instrumentsRef.current["gospel_organ"] = {
            start: (note, velocity, detune) => organ.start({ note, velocity, detune }),
            stop: (note) => organ.stop(note),
          };
        }

        setLoadingPercent(100);
        setLoadedTimbres((prev) => ({ ...prev, [timbre]: true }));
      } catch (err) {
        console.error("Erro ao carregar timbre:", timbre, err);
      } finally {
        loadingLockRef.current[timbre] = false;
        setIsLoadingSamples(false);
      }
    },
    [getAudioContext]
  );

  // Carrega automaticamente o timbre por default (Grand Piano) assim que a página é aberta
  useEffect(() => {
    loadInstrument("grand_piano");
  }, [loadInstrument]);

  // Muda o timbre e carrega automaticamente sob demanda
  const setTimbre = useCallback(
    async (timbre: TimbreType) => {
      // Limpa agendamentos de sustain e interrompe qualquer som ativo antes de trocar o timbre
      sustainTimeoutsRef.current.forEach((t) => clearTimeout(t));
      sustainTimeoutsRef.current.clear();
      activeVoicesRef.current.forEach((stopFn) => {
        try {
          stopFn();
        } catch {}
      });
      activeVoicesRef.current.clear();

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

  // Alterna a chave de Sustain (Ativado / Desativado)
  const toggleSustain = useCallback(() => {
    setIsSustainOn((prev) => {
      const next = !prev;
      if (!next) {
        // Ao desativar o sustain, encerra imediatamente qualquer nota que estava prolongando
        sustainTimeoutsRef.current.forEach((t) => clearTimeout(t));
        sustainTimeoutsRef.current.clear();
        activeVoicesRef.current.forEach((stopFn) => {
          try {
            stopFn();
          } catch {}
        });
        activeVoicesRef.current.clear();
      }
      return next;
    });
  }, []);

  // Tocar uma nota (Note On)
  const playNote = useCallback(
    async (midiNumber: number, velocity: number = 90, detune: number = 0) => {
      await resumeAudioContext();
      const safeVelocity = Math.min(127, Math.max(1, velocity));

      // Se havia um desligamento de sustain agendado para esta nota, cancela
      const pendingTimeout = sustainTimeoutsRef.current.get(midiNumber);
      if (pendingTimeout) {
        clearTimeout(pendingTimeout);
        sustainTimeoutsRef.current.delete(midiNumber);
      }

      let inst = instrumentsRef.current[currentTimbre];
      if (!inst) {
        await loadInstrument(currentTimbre);
        inst = instrumentsRef.current[currentTimbre];
      }

      if (inst && typeof inst.start === "function") {
        // Encerra qualquer reprodução anterior pendente da mesma nota
        const prevStop = activeVoicesRef.current.get(midiNumber);
        if (typeof prevStop === "function") {
          try {
            prevStop();
          } catch {}
        }

        const voiceStopFn = inst.start(midiNumber, safeVelocity, detune !== 0 ? detune : undefined);
        if (typeof voiceStopFn === "function") {
          activeVoicesRef.current.set(midiNumber, voiceStopFn);
        }
      }
    },
    [currentTimbre, resumeAudioContext, loadInstrument]
  );

  // Interrompe fisicamente a voz da nota
  const executeStop = useCallback(
    (midiNumber: number) => {
      // 1. Executa a função direta de parada da voz retornada pelo start()
      const voiceStopFn = activeVoicesRef.current.get(midiNumber);
      if (typeof voiceStopFn === "function") {
        try {
          voiceStopFn();
        } catch {}
        activeVoicesRef.current.delete(midiNumber);
      }

      // 2. Garante parada também por stopId no instrumento
      const inst = instrumentsRef.current[currentTimbre];
      if (inst && typeof inst.stop === "function") {
        try {
          inst.stop(midiNumber);
        } catch {}
      }
    },
    [currentTimbre]
  );

  // Parar uma nota (Note Off) - Respeita a chave de Sustain
  const stopNote = useCallback(
    (midiNumber: number) => {
      if (isSustainOn) {
        // Com o Sustain ativado, a nota se prolonga por 2.5s antes de cortar, permitindo transição de acordes
        const existing = sustainTimeoutsRef.current.get(midiNumber);
        if (existing) clearTimeout(existing);

        const timeout = setTimeout(() => {
          executeStop(midiNumber);
          sustainTimeoutsRef.current.delete(midiNumber);
        }, 2500);

        sustainTimeoutsRef.current.set(midiNumber, timeout);
      } else {
        // Com o Sustain desativado, o som corta imediatamente ao soltar a tecla
        executeStop(midiNumber);
      }
    },
    [isSustainOn, executeStop]
  );

  // Tocar um acorde completo (preview de 1.8s a 2s para arpejo ou bloco)
  const playChord = useCallback(
    async (
      pianoKeyIndices: number[],
      mode: "arpeggio" | "block" = "arpeggio",
      baseOctaveMidi: number = 48
    ) => {
      await resumeAudioContext();
      const midiNotes = pianoKeyIndices.map((idx) => baseOctaveMidi + idx);

      if (mode === "arpeggio") {
        midiNotes.forEach((midiNote, i) => {
          setTimeout(() => {
            playNote(midiNote, 95);
            setTimeout(() => {
              stopNote(midiNote);
            }, 1800);
          }, i * 95);
        });
      } else {
        midiNotes.forEach((midiNote) => {
          playNote(midiNote, 90);
          setTimeout(() => {
            stopNote(midiNote);
          }, 2000);
        });
      }
    },
    [resumeAudioContext, playNote, stopNote]
  );

  // Carrega manualmente o timbre selecionado se necessário
  const loadCurrentTimbre = useCallback(async () => {
    await loadInstrument(currentTimbre);
  }, [currentTimbre, loadInstrument]);

  const isTimbreReady = !!loadedTimbres[currentTimbre] || !!instrumentsRef.current[currentTimbre];

  return {
    currentTimbre,
    isAudioInitialized,
    isLoadingSamples,
    loadingPercent,
    isTimbreReady,
    loadedTimbres,
    volume,
    setVolume,
    setTimbre,
    isSustainOn,
    setIsSustainOn,
    toggleSustain,
    loadCurrentTimbre,
    ensureAudioContext: resumeAudioContext,
    playNote,
    stopNote,
    playChord,
  };
}