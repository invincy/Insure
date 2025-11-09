'use client';

import NextImage from 'next/image';
import { useEffect, useState } from 'react';
import { plan733Assets } from '../../config/plan733Assets';

interface GirlFigureProps {
  noAnimation?: boolean;
  parentControlled?: boolean;
}

const GirlFigure = ({ noAnimation = false, parentControlled = false }: GirlFigureProps) => {
  const [girlSrc, setGirlSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  useEffect(() => {
    if (plan733Assets.girl && plan733Assets.girl[fallbackIndex]) {
      setGirlSrc(plan733Assets.girl[fallbackIndex]);
      console.log('Loading girl (attempt', fallbackIndex + 1, '):', plan733Assets.girl[fallbackIndex]);
      setImageError(false);
    } else {
      console.log('No more girl assets to try, using SVG fallback');
      setImageError(true);
    }
  }, [fallbackIndex]);

  const handleImageError = () => {
    console.log('Girl image failed to load:', girlSrc);
    if (fallbackIndex < plan733Assets.girl.length - 1) {
      console.log('Trying next fallback...');
      setFallbackIndex(prev => prev + 1);
    } else {
      console.log('All girl images failed, using SVG');
      setImageError(true);
    }
  };

  if (noAnimation) {
    // When parentControlled is true, do not apply internal absolute positioning — let parent wrapper handle it
    if (parentControlled) {
      return (
        <>
          {girlSrc && !imageError ? (
            <NextImage
              src={girlSrc}
              alt="Girl future planning"
              width={2000}
              height={1600}
              // let the parent container control height; constrain the image to that height
              className="w-auto"
              style={{ objectFit: 'contain', objectPosition: '50% 100%', maxHeight: '60vh' } as React.CSSProperties}
              priority
              quality={90}
              onError={handleImageError}
            />
          ) : (
            <svg className="w-full h-auto" viewBox="0 0 1000 800">
              {/* Girl silhouette */}
              <circle cx="200" cy="200" r="50" fill="rgba(255,255,255,0.4)" />
              <rect x="165" y="250" width="70" height="150" rx="15" fill="rgba(255,255,255,0.3)" />
              {/* School bag */}
              <rect x="130" y="280" width="25" height="30" rx="5" fill="rgba(200,200,200,0.6)" />
            </svg>
          )}
        </>
      );
    }

    // Default noAnimation behaviour (legacy): push girl left using internal offsets
    return (
      <div className="absolute bottom-0 left-[-30vw] z-[3] w-[120vw] overflow-hidden">
        {girlSrc && !imageError ? (
          <NextImage
            src={girlSrc}
            alt="Girl future planning"
            width={2000}
            height={1600}
            className="w-full h-auto object-left-bottom"
            priority
            quality={90}
            onError={handleImageError}
          />
        ) : (
          <svg className="w-full h-auto" viewBox="0 0 1000 800">
            {/* Girl silhouette */}
            <circle cx="200" cy="200" r="50" fill="rgba(255,255,255,0.4)" />
            <rect x="165" y="250" width="70" height="150" rx="15" fill="rgba(255,255,255,0.3)" />
            {/* School bag */}
            <rect x="130" y="280" width="25" height="30" rx="5" fill="rgba(200,200,200,0.6)" />
          </svg>
        )}
      </div>
    );
  }

  // Original animated version
  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center z-[3]">
      {girlSrc && !imageError ? (
        <NextImage
          src={girlSrc}
          alt="Girl future planning"
          width={2000}
          height={1600}
          className="w-[250vw] h-auto"
          priority
          quality={90}
          onError={handleImageError}
        />
      ) : (
        <svg className="w-[250vw] h-auto" viewBox="0 0 1000 800">
          {/* Girl silhouette */}
          <circle cx="500" cy="200" r="50" fill="rgba(255,255,255,0.4)" />
          <rect x="465" y="250" width="70" height="150" rx="15" fill="rgba(255,255,255,0.3)" />
          {/* School bag */}
          <rect x="430" y="280" width="25" height="30" rx="5" fill="rgba(200,200,200,0.6)" />
        </svg>
      )}
    </div>
  );
};

export default GirlFigure;