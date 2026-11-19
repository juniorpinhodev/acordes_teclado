"use client";

import React, { useMemo } from "react";
import { CHROMATIC_SHARPS, CHROMATIC_FLATS } from "@/constants/chords";

interface PianoProps {
  activeKeys: number[];
  useFlat?: boolean;
  size?: "normal" | "mini";
  className?: string;
}

export function Piano({
  activeKeys = [],
  useFlat = false,
  size = "normal",
  className = "",
}: PianoProps) {
  const activeSet = useMemo(() => new Set(activeKeys), [activeKeys]);

  // Pré-calcula a estrutura das 24 teclas (2 oitavas)
  const keysData = useMemo(() => {
    const list: {
      index: number;
      pitch: number;
      isBlack: boolean;
      whiteIndex?: number;
    }[] = [];

    let whiteCount = 0;
    for (let i = 0; i < 24; i++) {
      const noteName = CHROMATIC_SHARPS[i % 12];
      const isBlack = noteName.includes("#");

      if (isBlack) {
        list.push({
          index: i,
          pitch: i % 12,
          isBlack: true,
          whiteIndex: whiteCount,
        });
      } else {
        list.push({
          index: i,
          pitch: i % 12,
          isBlack: false,
        });
        whiteCount++;
      }
    }
    return list;
  }, []);

  const isMini = size === "mini";

  return (
    <div
      className={`piano-container select-none flex relative mx-auto w-max ${
        isMini ? "piano-mini" : "piano-normal"
      } ${className}`}
    >
      {keysData.map((k) => {
        const isActive = activeSet.has(k.index);
        const noteLabel = useFlat
          ? CHROMATIC_FLATS[k.pitch]
          : CHROMATIC_SHARPS[k.pitch];

        if (k.isBlack) {
          return (
            <div
              key={k.index}
              data-index={k.index}
              style={{
                left: `calc(${k.whiteIndex} * var(--white-key-w))`,
              }}
              className={`key black absolute z-10 flex items-end justify-center font-bold -translate-x-1/2 rounded-b-[clamp(2px,0.5vw,4px)] border border-t-0 border-[#09090a] shadow-[0_3px_6px_rgba(0,0,0,0.5)] transition-colors duration-150 ${
                isActive
                  ? "active bg-gradient-to-b from-[#996dff] to-[#8257e5] text-white border-[#6a39d8] shadow-[0_4px_10px_rgba(130,87,229,0.6)]"
                  : "bg-gradient-to-b from-[#27272a] to-[#121214] text-transparent"
              }`}
            >
              {noteLabel}
            </div>
          );
        }

        return (
          <div
            key={k.index}
            data-index={k.index}
            className={`key white relative z-0 flex items-end justify-center font-bold border border-[#c4c4cc] rounded-b-[var(--key-radius)] transition-colors duration-150 ${
              isActive
                ? "active bg-gradient-to-b from-[#996dff] to-[#8257e5] text-white border-[#6a39d8] shadow-[0_4px_12px_rgba(130,87,229,0.5),inset_0_-2px_6px_rgba(0,0,0,0.2)]"
                : "bg-gradient-to-b from-[#fafafa] to-[#ffffff] text-[#71717a]"
            }`}
          >
            {noteLabel}
          </div>
        );
      })}
    </div>
  );
}
