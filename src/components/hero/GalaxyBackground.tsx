'use client';

import { useEffect, useState } from 'react';

type Particle = {
  left: string;
  top: string;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  tx: number;
};

export default function GalaxyBackground() {
  // Simplified: keep only the static gradient background. Particle dots removed to avoid
  // accidental dotted-lines across the layout (they were aligning visually at some sizes).
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-800 via-blue-900 to-slate-950" />
    </div>
  );
}
