"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { plan733Assets } from "../../config/plan733Assets";

interface GoldenPathProps {
  animationStage: number;
  // optional: desired height in vh (as number), default 64 (keeps main page size)
  heightVh?: number;
}

const GoldenPath = ({ animationStage, heightVh = 64 }: GoldenPathProps) => {
  const [pathSrc, setPathSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (plan733Assets.path) setPathSrc(plan733Assets.path);
  }, []);

  useEffect(() => {
    if (!pathSrc) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let mounted = true;
    const devicePR = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    const drawStretched = () => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = pathSrc as string;
      img.onload = () => {
        if (!mounted) return;

        const targetHeight = Math.max(200, Math.round((window.innerHeight || 800) * (heightVh / 100)));
        const targetWidth = Math.max(800, Math.round((window.innerWidth || 1200) * 1.0));

        canvas.width = Math.round(targetWidth * devicePR);
        canvas.height = Math.round(targetHeight * devicePR);
        canvas.style.width = `${targetWidth}px`;
        canvas.style.height = `${targetHeight}px`;
        ctx.setTransform(devicePR, 0, 0, devicePR, 0, 0);
        ctx.clearRect(0, 0, targetWidth, targetHeight);

        const srcW = img.width;
        const srcH = img.height;

        const capRatio = 0.15;
        const topH = Math.max(1, Math.floor(srcH * capRatio));
        const bottomH = Math.max(1, Math.floor(srcH * capRatio));
        const middleSrcH = Math.max(0, srcH - topH - bottomH);
        const middleDestH = Math.max(0, targetHeight - topH - bottomH);

        // draw top cap
        ctx.drawImage(img, 0, 0, srcW, topH, 0, 0, targetWidth, topH);
        // draw stretched middle
        if (middleDestH > 0 && middleSrcH > 0) {
          ctx.drawImage(img, 0, topH, srcW, middleSrcH, 0, topH, targetWidth, middleDestH);
        }
        // draw bottom cap
        ctx.drawImage(img, 0, topH + middleSrcH, srcW, bottomH, 0, topH + middleDestH, targetWidth, bottomH);
      };
      img.onerror = (e) => {
        console.error("Failed to load path image for stretching", e);
      };
    };

    drawStretched();
    const onResize = () => drawStretched();
    window.addEventListener("resize", onResize);
    return () => {
      mounted = false;
      window.removeEventListener("resize", onResize);
    };
  }, [pathSrc, heightVh]);

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 flex justify-center z-[2] pointer-events-none overflow-visible"
      initial={{ y: 150, opacity: 0 }}
      animate={
        animationStage >= 2
          ? {
              y: 0,
              opacity: 1,
            }
          : {
              y: 150,
              opacity: 0,
            }
      }
      transition={{
        duration: 0.8,
        ease: "easeOut",
        type: "spring",
        damping: 25,
      }}
    >
      {pathSrc ? (
        // canvas dimensions are controlled in JS; avoid CSS width that causes horizontal overflow
        <canvas ref={canvasRef} className="max-w-none opacity-95" />
      ) : (
        <svg className="max-w-none opacity-95" viewBox="0 0 1200 1200">
          <defs>
            <linearGradient id="goldPath" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FFA500" />
              <stop offset="100%" stopColor="#FF8C00" />
            </linearGradient>
          </defs>
          <path
            d="M 180 1000 Q 380 750 550 550 Q 720 350 850 200 Q 900 120 950 80"
            stroke="url(#goldPath)"
            strokeWidth="110"
            fill="none"
            strokeLinecap="round"
          />
          <polygon
            points="950,100 935,70 955,70 960,95 945,110"
            fill="url(#goldPath)"
            transform="rotate(20 950 100) scale(1.1)"
          />
        </svg>
      )}
    </motion.div>
  );
};

export default GoldenPath;