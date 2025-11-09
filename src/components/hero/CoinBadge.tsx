'use client';

import { motion } from 'framer-motion';
import NextImage from 'next/image';
import { useEffect, useState } from 'react';
import { plan733Assets } from '../../config/plan733Assets';

interface CoinBadgeProps {
  onClick?: () => void;
  animationStage: number;
  selectedGoal?: string | null;
  elevated?: boolean;
  gray?: boolean;
}

const CoinBadge = ({ onClick, animationStage, selectedGoal, elevated = false, gray = false }: CoinBadgeProps) => {
  const [coinSrc, setCoinSrc] = useState<string | null>(null);

  useEffect(() => {
    if (plan733Assets.coin) {
      setCoinSrc(plan733Assets.coin);
      console.log('Loading coin:', plan733Assets.coin);
    }
  }, []);

  return (
    // static positioned wrapper ensures translate(-50%,-50%) stays applied
    // and is not overwritten by Framer Motion's inline transform.
    <div
      id="lakshya-coin"
      className={`fixed left-1/2 -translate-x-1/2 -translate-y-1/2 ${elevated ? 'z-[50]' : 'z-[20]'} cursor-pointer`}
      // position coin center exactly at the computed --coin-center (no extra nudge)
      style={{
        top: 'var(--coin-center, var(--coin-top))',
        filter: gray ? 'grayscale(1) contrast(0.95) brightness(0.9)' : undefined,
        WebkitFilter: gray ? 'grayscale(1) contrast(0.95) brightness(0.9)' : undefined,
        transition: 'filter 900ms ease-out, -webkit-filter 900ms ease-out, opacity 220ms ease',
        willChange: 'filter, opacity'
      } as React.CSSProperties}
      onClick={onClick}
    >
  <motion.div
        // animated content lives inside the static wrapper so Framer Motion
        // doesn't override the positioning translate used to center the coin.
        initial={{ y: -100, opacity: 0, scale: 0.3 }}
        animate={
          animationStage >= 3
            // use a final scale of 1 so the element's CSS width/height (var --coin-size)
            // determines the rendered diameter exactly; motion controls only opacity/y.
            ? { y: 0, opacity: 1, scale: 1 }
            : { y: -100, opacity: 0, scale: 0.3 }
        }
        transition={{ duration: 1.0, ease: 'easeOut', type: 'spring', damping: 20, stiffness: 100 }}
        style={{ transformOrigin: 'center center' } as React.CSSProperties}
      >
        {/* Inner wrapper applies capture-time scaling via CSS var --capture-scale (set by GoalsModal) */}
  <div id="lakshya-coin-face" className="relative flex items-center justify-center" style={{ transform: 'none', width: 'var(--coin-size, 225px)', height: 'var(--coin-size, 225px)' } as React.CSSProperties}>
        {/* Local coin glow removed — use page-level warm rim glow so it sits below path/characters */}
        {/* If a goal is selected, show the goal image inside the coin area (no extra ring). Otherwise show the coin image or fallback. */}
        {selectedGoal ? (
          <div className="relative z-10 rounded-full overflow-hidden flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
            <NextImage
              src={selectedGoal === 'career' ? plan733Assets.career :
                   selectedGoal === 'marriage' ? plan733Assets.marriage :
                   selectedGoal === 'study' ? plan733Assets.study :
                   plan733Assets.goals}
              alt={`Selected goal`}
              fill
              className="object-cover"
              style={{ objectFit: 'cover', filter: gray ? 'grayscale(1) contrast(0.95) brightness(0.9)' : undefined, transition: 'filter 900ms ease-out' } as React.CSSProperties}
              quality={90}
            />
          </div>
        ) : coinSrc ? (
          <NextImage
            src={coinSrc}
            alt="Jeevan Lakshya coin"
            fill
            className="relative z-10"
            style={{ objectFit: 'cover', filter: gray ? 'grayscale(1) contrast(0.95) brightness(0.9)' : undefined, transition: 'filter 900ms ease-out' } as React.CSSProperties}
            quality={90}
            onError={() => console.log('Coin image failed to load')}
          />
        ) : (
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-4 border-yellow-300 relative z-10 flex items-center justify-center text-xs font-bold text-yellow-900">
            JEEVAN LAKSHYA
          </div>
        )}
      </div>
      </motion.div>
    </div>
  );
};

export default CoinBadge;
