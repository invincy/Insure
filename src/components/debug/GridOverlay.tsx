import React, { useEffect, useState } from 'react';

export default function GridOverlay() {
  // Default to visible to help debugging; toggle with Shift+G or window.__GRID_DEBUG
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Only enable when developer sets window.__GRID_DEBUG = true in the console
    // This avoids shipping visible debug UI to end users.
    try {
      // @ts-ignore
      if (window && (window as any).__GRID_DEBUG) setVisible(true);
    } catch (e) {
      // noop during SSR
    }

    const handler = (e: KeyboardEvent) => {
      // Optional quick toggle: Shift+G toggles the grid
      if (e.key.toLowerCase() === 'g' && e.shiftKey) {
        setVisible((v) => !v);
        try {
          // @ts-ignore
          (window as any).__GRID_DEBUG = !(window as any).__GRID_DEBUG;
        } catch {}
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!visible) return null;

  const vPositions = ['25%', '50%', '75%'];
  const hPositions = ['25%', '50%', '75%'];
  const rows = ['A', 'B', 'C'];
  const cols = ['1', '2', '3'];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      {/* vertical lines */}
      {vPositions.map((left) => (
        <div key={left} style={{ left }} className="absolute top-0 bottom-0 w-px bg-white/40 opacity-90" />
      ))}

      {/* horizontal lines */}
      {hPositions.map((top) => (
        <div key={top} style={{ top }} className="absolute left-0 right-0 h-px bg-white/40 opacity-90" />
      ))}

      {/* intersection labels */}
      {rows.map((r, ri) =>
        cols.map((c, ci) => {
          const left = vPositions[ci];
          const top = hPositions[ri];
          return (
            <div
              key={`${r}${c}`}
              style={{ left, top, transform: 'translate(-50%, -50%)' }}
              className="absolute z-100 text-xs font-mono text-white/95 bg-black/60 px-1 py-0.5 rounded"
            >
              {r + c}
            </div>
          );
        })
      )}

      {/* center cross marker */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-100">
        <div className="w-3 h-3 rounded-full bg-red-400 opacity-95" />
      </div>
    </div>
  );
}
