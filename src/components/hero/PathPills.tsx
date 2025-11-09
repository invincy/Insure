'use client';

import { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { motion } from 'framer-motion';
import { plan733Assets } from '../../config/plan733Assets';

const pickFirst = (candidates: readonly string[]) => {
  return new Promise<string | null>((resolve) => {
    const tryIndex = (i: number) => {
      if (i >= candidates.length) return resolve(null);
      const src = candidates[i];
      const img = new window.Image();
      img.onload = () => resolve(src);
      img.onerror = () => tryIndex(i + 1);
      img.src = src;
    };
    tryIndex(0);
  });
};

const PathPills = () => {
  const [maturity, setMaturity] = useState<string | null>(null);
  const [death, setDeath] = useState<string | null>(null);
  const [thenPill, setThenPill] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const asArray = (v: string | readonly string[]) => (Array.isArray(v) ? v : [v]);
    const run = async () => {
      const [m, d, t] = await Promise.all([
        pickFirst(asArray(plan733Assets.maturityPill as any)),
        pickFirst(asArray(plan733Assets.deathPill as any)),
        pickFirst(asArray(plan733Assets.thenPill as any)),
      ]);
      if (!mounted) return;
      setMaturity(m);
      setDeath(d);
      setThenPill(t);
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const fadeSlide = {
    hidden: { y: 12, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const } },
  };

  return (
    <div className="absolute inset-0 z-[3] pointer-events-none">
      {/* All pills removed for clean layout */}
    </div>
  );
};

export default PathPills;
