"use client";
import { plan733Assets } from '../../config/plan733Assets';
import { useEffect, useState, useRef } from 'react';

interface GoalsFanOutProps {
  onClose: () => void;
  onGoalSelect: (goalId: string) => void;
  onCaptured?: (goalId: string) => void;
}

const GoalsFanOut = ({ onClose, onGoalSelect, onCaptured }: GoalsFanOutProps) => {
  // We'll position goals to grid points: above two -> A2, A3; below two -> C1, C3
  const goals = [
    { id: 'goals', title: 'લક્ષ્યો', image: plan733Assets.goals, targetCell: 'A1' },
    { id: 'marriage', title: 'લગ્ન', image: plan733Assets.marriage, targetCell: 'A3' },
    { id: 'study', title: 'અભ્યાસ', image: plan733Assets.study, targetCell: 'C1' },
    { id: 'career', title: 'કારકિર્દી', image: plan733Assets.career, targetCell: 'C3' }
  ];

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(true);
  const [animatingGoal, setAnimatingGoal] = useState<string | null>(null);
  // confetti removed: replaced by a single capture animation
  const [capturing, setCapturing] = useState(false);
  const [computed, setComputed] = useState<Record<string, { offsetX: number; offsetY: number }>>({});
  const [coinCenter, setCoinCenter] = useState<{ x: number; y: number } | null>(null);
  const [entered, setEntered] = useState<Record<string, boolean>>({});
  const ZOOM_MS = 600; // zoom duration
  const CONFETTI_MS = 600; // confetti duration

  useEffect(() => {
    // compute target positions once mounted and on resize
    const compute = () => {
      try {
        const coinEl = document.getElementById('lakshya-coin');
        const coinRect = coinEl?.getBoundingClientRect();
        const coinCenterX = coinRect ? coinRect.left + coinRect.width / 2 : window.innerWidth / 2;
        const coinCenterY = coinRect ? coinRect.top + coinRect.height / 2 : window.innerHeight / 2;

        // grid mapping used by GridOverlay: positions are 25%,50%,75% of viewport
        const gridMap: Record<string, { x: number; y: number }> = {
          A1: { x: 0.25, y: 0.25 },
          A2: { x: 0.5, y: 0.25 },
          A3: { x: 0.75, y: 0.25 },
          B1: { x: 0.25, y: 0.5 },
          B2: { x: 0.5, y: 0.5 },
          B3: { x: 0.75, y: 0.5 },
          C1: { x: 0.25, y: 0.75 },
          C2: { x: 0.5, y: 0.75 },
          C3: { x: 0.75, y: 0.75 }
        };

        const next: Record<string, { offsetX: number; offsetY: number }> = {};
        goals.forEach((g) => {
          const cell = gridMap[g.targetCell as keyof typeof gridMap] || gridMap.B2;
          const targetX = Math.round(window.innerWidth * cell.x);
          // compute the target Y (grid row). We apply any row-specific visual nudges
          // later at transform application time (single source of truth) so we avoid
          // double adjustments while still allowing this to be deterministic.
          let targetY = Math.round(window.innerHeight * cell.y);
          // compute vector from coin center -> target
          const fullOffsetX = targetX - coinCenterX;
          const fullOffsetY = targetY - coinCenterY;
          const reduct = 1.0; // full travel so goals land at their A/C grid positions
          const offsetX = Math.round(fullOffsetX * reduct);
          const offsetY = Math.round(fullOffsetY * reduct);
          next[g.id] = { offsetX, offsetY };
        });
          // Debug: expose computed offsets so we can verify C-row nudges at runtime
          // eslint-disable-next-line no-console
          console.log('[goals-compute] computed offsets:', next);
          setComputed(next);
          // reset entered state so animations re-run when modal opens
          setEntered({});
        setCoinCenter({ x: coinCenterX, y: coinCenterY });
      } catch (e) {
        // noop
      }
    };

    compute();
    // staggered entrance once computed
    const enterTimers: number[] = [];
    const scheduleEnter = () => {
      goals.forEach((g, idx) => {
        const t = window.setTimeout(() => {
          setEntered((s) => ({ ...s, [g.id]: true }));
        }, 120 + idx * 80);
        enterTimers.push(t);
      });
    };
    scheduleEnter();

    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('resize', compute);
      enterTimers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const handleClick = (e: React.MouseEvent, goalId: string) => {
    e.stopPropagation();
    if (animatingGoal || capturing) return; // prevent double-clicks
    // mark the goal being animated / captured
    setAnimatingGoal(goalId);
    // start capture flow: fade other goals and move the selected back to coin
    setCapturing(true);

    // After capture animation completes, call parent and clear state
    const CAPTURE_MS = 700;
    window.setTimeout(() => {
      try {
        if (onCaptured) onCaptured(goalId);
      } catch (err) {
        /* noop */
      }
      // clear local animation state; parent will hide modal
      setAnimatingGoal(null);
      setCapturing(false);
    }, CAPTURE_MS);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[40]" onClick={onClose}>
      <div ref={wrapperRef} className="absolute inset-0">
        {goals.map((g, idx) => {
          const isAnimating = animatingGoal === g.id;
          const data = computed[g.id];
          // Use coin center as anchor; position each goal at the coin center, then translate to its offset
          const cc = coinCenter || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
          const left = cc.x;
          const top = cc.y;
          const off = data ? data : { offsetX: 0, offsetY: 0 };

          // goal uses the canonical coin-size scaled down to 80% so they read as secondary
          const goalSize = 'calc(var(--coin-size, 225px) * 0.8)';

          // initial: at coin center, small scale; final: translate to offset + slight overshoot/settle
          const initialTransform = `translate(-50%, -50%) scale(0.9)`;
          // apply an additional per-row nudge (C-row higher) to ensure visual spacing
          // user requested an extra 50px; total applied transform nudge is now -100px
          const rowNudge = (g.targetCell === 'C1' || g.targetCell === 'C3') ? -100 : 0;
          const finalTransform = `translate(${off.offsetX}px, ${off.offsetY + rowNudge}px) translate(-50%, -50%) scale(1)`;

          // single capture transition; stagger entries
          const transition = `transform ${ZOOM_MS}ms cubic-bezier(0.175,0.885,0.32,1.275) ${idx * 60}ms, opacity 260ms ease`;

          // when capturing: selected one moves back to coin (initialTransform), others fade and scale down
          const isSelected = animatingGoal === g.id;
          const opacity = capturing ? (isSelected ? 1 : 0) : animatingGoal ? (isSelected ? 1 : 0.14) : 1;
          const zIndex = isSelected ? 60 : 40;

          const appliedTransform = capturing
            ? isSelected
              ? `translate(-50%, -50%) scale(1.06)` // selected moves back to coin with slight pop
              : `translate(${off.offsetX * 0.08}px, ${off.offsetY * 0.08 + rowNudge * 0.08}px) translate(-50%, -50%) scale(0.88)` // other goals slightly shift and shrink while fading
            : entered[g.id]
            ? finalTransform
            : initialTransform;

          return (
            <div
              key={g.id}
              onClick={(e) => handleClick(e, g.id)}
              style={{ position: 'absolute', left: `${left}px`, top: `${top}px`, zIndex } as React.CSSProperties}
            >
              <div
                className="relative"
                style={{
                  width: goalSize,
                  height: goalSize,
                  transform: appliedTransform,
                  transition,
                  opacity,
                  pointerEvents: capturing ? (isSelected ? 'auto' : 'none') : animatingGoal ? (isSelected ? 'auto' : 'none') : 'auto',
                  willChange: 'transform, opacity'
                } as React.CSSProperties}
              >
                {/* dark soft shadow beneath the goal to elevate it off the background */}
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: 6,
                    transform: 'translateX(-50%)',
                    width: '96%',
                    height: 44,
                    borderRadius: 9999,
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.35) 70%, transparent 95%)',
                    filter: 'blur(26px)',
                    opacity: 1,
                    zIndex: 0,
                    pointerEvents: 'none',
                    boxShadow: '0 36px 96px rgba(0,0,0,0.75), 0 12px 48px rgba(0,0,0,0.6), inset 0 -6px 24px rgba(0,0,0,0.25)'
                  }}
                />

                <div style={{ width: '100%', height: '100%', borderRadius: '9999px', overflow: 'hidden', position: 'relative', zIndex: 10 }}>
                  <img src={g.image} alt={g.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* confetti removed; capture uses single transform to coin */}

      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1 }
          100% { transform: translateY(160px) rotate(360deg); opacity: 0 }
        }
        .animate-confetti {
          animation: confetti 700ms linear forwards;
        }
      `}</style>
    </div>
  );
};

export default GoalsFanOut;