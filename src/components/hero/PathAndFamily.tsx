'use client';

import { motion } from 'framer-motion';
import NextImage from 'next/image';
import { useEffect, useState } from 'react';
import { plan733Assets } from '../../config/plan733Assets';

interface PathAndFamilyProps {
  animationStage: number;
  // when true, the parent will control motion (useful during What‑If)
  parentControlled?: boolean;
}

const DadAndDaughter = ({ animationStage, parentControlled = false }: PathAndFamilyProps) => {
  const [figuresSrc, setFiguresSrc] = useState<string | null>(null);

  useEffect(() => {
    if (plan733Assets.figures) {
      setFiguresSrc(plan733Assets.figures);
      console.log('Loading figures:', plan733Assets.figures);
    }
  }, []);

  if (parentControlled) {
    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center z-[3]">
        {figuresSrc ? (
          <NextImage
            src={figuresSrc}
            alt="Father and daughter journey"
            width={2000}
            height={1600}
            className="w-[250vw] h-auto"
            priority
            quality={90}
            onError={() => console.log('Figures image failed to load')}
          />
        ) : (
          <svg className="w-[250vw] h-auto" viewBox="0 0 1000 800">
            <circle cx="600" cy="200" r="70" fill="rgba(255,255,255,0.4)" />
            <rect x="550" y="270" width="100" height="200" rx="20" fill="rgba(255,255,255,0.3)" />
            <circle cx="400" cy="230" r="50" fill="rgba(255,255,255,0.4)" />
            <rect x="365" y="280" width="70" height="150" rx="15" fill="rgba(255,255,255,0.3)" />
            <line x1="535" y1="350" x2="435" y2="350" stroke="#FFD700" strokeWidth="18" strokeLinecap="round" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 flex justify-center z-[3]"
      initial={{ y: 200, opacity: 0 }}
      animate={animationStage >= 1 ? {
        y: 0,
        opacity: 1
      } : {
        y: 200,
        opacity: 0
      }}
      transition={{
        // Make the default entrance slower and smoother across the app so
        // the dad & daughter figures don't appear snappy. Use a gentle ease
        // rather than a spring to avoid bounce.
        duration: 1.8,
        ease: "easeOut"
      }}
    >
      {figuresSrc ? (
        <NextImage
          src={figuresSrc}
          alt="Father and daughter journey"
          width={2000}
          height={1600}
          className="w-[250vw] h-auto"
          priority
          quality={90}
          onError={() => console.log('Figures image failed to load')}
        />
      ) : (
        <svg className="w-[250vw] h-auto" viewBox="0 0 1000 800">
          <circle cx="600" cy="200" r="70" fill="rgba(255,255,255,0.4)" />
          <rect x="550" y="270" width="100" height="200" rx="20" fill="rgba(255,255,255,0.3)" />
          <circle cx="400" cy="230" r="50" fill="rgba(255,255,255,0.4)" />
          <rect x="365" y="280" width="70" height="150" rx="15" fill="rgba(255,255,255,0.3)" />
          <line x1="535" y1="350" x2="435" y2="350" stroke="#FFD700" strokeWidth="18" strokeLinecap="round" />
        </svg>
      )}
    </motion.div>
  );
};

export default DadAndDaughter;
