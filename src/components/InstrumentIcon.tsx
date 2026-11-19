import React from "react";
import { TimbreType } from "@/types/audio";

interface IconProps {
  className?: string;
}

export function GrandPianoIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 8.5c-1.5 0-2.8-.8-3.5-2.2A7 7 0 0 0 2 9.5v10.5a1.5 1.5 0 0 0 1.5 1.5h17a1.5 1.5 0 0 0 1.5-1.5v-8c0-1.9-1.3-3.5-3-3.5Z" />
      <path d="M2 14.5h20" />
      <path d="M6 14.5v4" />
      <path d="M10 14.5v4" />
      <path d="M14 14.5v4" />
      <path d="M18 14.5v4" />
    </svg>
  );
}

export function FMPianoIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <rect x="5" y="8" width="5" height="2" rx="0.5" fill="currentColor" fillOpacity={0.3} />
      <path d="M13 9h1" />
      <path d="M16 9h1" />
      <path d="M19 9h0" />
      <path d="M2 13h20" />
      <path d="M6.5 13v6" />
      <path d="M11 13v6" />
      <path d="M15.5 13v6" />
      <path d="M19 13v6" />
    </svg>
  );
}

export function WorshipPadIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 6c3-2 6-2 9 0s6 2 9 0" opacity={0.4} />
      <path d="M2 12c3-3 6-3 9 0s6 3 9 0" />
      <path d="M2 18c3-2 6-2 9 0s6 2 9 0" opacity={0.4} />
    </svg>
  );
}

export function SoftStringsIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2v6" />
      <path d="M10 3.5h4" />
      <path d="M10 8c-2.2 0-3.5 1.2-3.5 3 0 1.5 1 2.2 1.5 3-.8 1-2 2.2-2 4 0 2.5 2.5 4 6 4s6-1.5 6-4c0-1.8-1.2-3-2-4 .5-.8 1.5-1.5 1.5-3 0-1.8-1.3-3-3.5-3h-4Z" />
      <path d="M11 9v11" opacity={0.5} />
      <path d="M13 9v11" opacity={0.5} />
    </svg>
  );
}

export function RhodesIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M2.5 10.5h19" />
      <circle cx="6.5" cy="8" r="1" fill="currentColor" />
      <circle cx="9.5" cy="8" r="1" fill="currentColor" />
      <path d="M2.5 14h19" />
      <path d="M7 14v4.5" />
      <path d="M11.5 14v4.5" />
      <path d="M16 14v4.5" />
    </svg>
  );
}

export function GospelOrganIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 21V9a1.5 1.5 0 0 1 3 0v12" />
      <path d="M10.5 21V4a1.5 1.5 0 0 1 3 0v17" />
      <path d="M16 21V7a1.5 1.5 0 0 1 3 0v14" />
      <path d="M3 21h18" />
      <circle cx="6.5" cy="17" r="0.75" fill="currentColor" />
      <circle cx="12" cy="17" r="0.75" fill="currentColor" />
      <circle cx="17.5" cy="17" r="0.75" fill="currentColor" />
    </svg>
  );
}

export function InstrumentIcon({
  timbre,
  className = "w-4 h-4",
}: {
  timbre: TimbreType;
  className?: string;
}) {
  switch (timbre) {
    case "grand_piano":
      return <GrandPianoIcon className={className} />;
    case "fm_piano":
      return <FMPianoIcon className={className} />;
    case "worship_pad":
      return <WorshipPadIcon className={className} />;
    case "soft_strings":
      return <SoftStringsIcon className={className} />;
    case "rhodes":
      return <RhodesIcon className={className} />;
    case "gospel_organ":
      return <GospelOrganIcon className={className} />;
    default:
      return <GrandPianoIcon className={className} />;
  }
}
