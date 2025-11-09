"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import NextImage from "next/image";
import GalaxyBackground from "../hero/GalaxyBackground";
import GoldenPath from "../hero/GoldenPath";
import PathAndFamily from "../hero/PathAndFamily";
import GirlFigure from "../hero/GirlFigure";
import CoinBadge from "../hero/CoinBadge";
import GoalsFanOut from "../hero/GoalsModal";
import { plan733Assets } from "../../config/plan733Assets";

const Plan733Interactive = () => {
  const [showGoals, setShowGoals] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  // inline WhatIf flow removed; use route-based /plans/733/what-if instead
  const [showBenefitPage, setShowBenefitPage] = useState(false);
  const [benefitStage, setBenefitStage] = useState(0);
  const [loadedDeath, setLoadedDeath] = useState(false);
  const [loadedThen, setLoadedThen] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [goalCoinPos, setGoalCoinPos] = useState<
    { left: number; top: number; width: number; height: number } | null
  >(null);
  const router = useRouter();

  useEffect(() => {
    setAnimationStage(1);
    const pathTimer = setTimeout(() => setAnimationStage(2), 500);
    const coinTimer = setTimeout(() => setAnimationStage(3), 1000);
    return () => {
      clearTimeout(pathTimer);
      clearTimeout(coinTimer);
    };
  }, []);

  useEffect(() => {
    if (!showBenefitPage) {
      setGoalCoinPos(null);
      return;
    }
    const measure = () => {
      try {
        const el = document.getElementById('lakshya-coin');
  if (!el) return;
  const r = el.getBoundingClientRect();
  const left = Math.round(r.left + r.width / 2);
  const top = Math.round(r.top + r.height / 2);
  const width = Math.round(r.width);
  const height = Math.round(r.height);
  setGoalCoinPos({ left, top, width, height });
      } catch (e) {
        // ignore
      }
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, [showBenefitPage]);

  const handleCoinClick = () => setShowGoals(true);
  const handleCloseGoals = () => setShowGoals(false);
  const handleGoalSelection = (goalId: string) => {
    setSelectedGoal(goalId);
    try {
      const el = document.getElementById('lakshya-coin');
      if (el) {
        const r = el.getBoundingClientRect();
        const left = Math.round(r.left + r.width / 2);
        const top = Math.round(r.top + r.height / 2);
        const width = Math.round(r.width);
        const height = Math.round(r.height);
        setGoalCoinPos({ left, top, width, height });
      }
    } catch (e) {
      // ignore
    }
    setShowGoals(false);
    // Persist minimal selection and navigate to the original route-based What-If page
    try {
      const payload = { goal: goalId };
      sessionStorage.setItem("planSelection", JSON.stringify(payload));
    } catch (e) {
      // ignore storage errors
    }
    router.push("/plans/733/what-if");
  };
  // removed handleWhatIfClick — navigation is handled above
  const handleBenefitPageClick = () => {
    if (isAdvancing) return;
    setIsAdvancing(true);
    setTimeout(() => setIsAdvancing(false), 400);
    if (benefitStage < 3) setBenefitStage((p) => p + 1);
  };

  const OVERLAY_SCALE = 1.2;
  const MATURITY_SCALE = 0.38;
  const MATURITY_GAP = 8;
  const MIN_PILL_WIDTH = 110;
  const MATURITY_RAISE = 24;

  const overlayCenterY = goalCoinPos ? goalCoinPos.top - 120 : 0;
  const overlayWidth = goalCoinPos ? Math.round(goalCoinPos.width * OVERLAY_SCALE) : 0;
  const overlayHeight = goalCoinPos ? Math.round(goalCoinPos.height * OVERLAY_SCALE) : 0;
  const rawWidth = goalCoinPos ? Math.round(goalCoinPos.width * MATURITY_SCALE * 1.2) : 0;
  const maturityWidth = goalCoinPos ? Math.max(MIN_PILL_WIDTH, rawWidth) : 0;
  const maturityHeight = goalCoinPos ? Math.round(goalCoinPos.height * MATURITY_SCALE * 0.9) : 0;
  const maturityLeft = goalCoinPos ? Math.round(goalCoinPos.left - Math.round(overlayWidth * 0.43)) : 0;
  const maturityTop = goalCoinPos
    ? Math.round(goalCoinPos.top - Math.round(overlayHeight * 0.45) - Math.round(maturityHeight * 0.35))
    : 0;
  const maturityTopAdjusted = maturityTop - MATURITY_RAISE;
  const maturityFontSize = goalCoinPos ? Math.max(8, Math.round(maturityHeight * 0.18)) : 8;
  const displayMaturityWidth = Math.max(Math.round(maturityWidth * 2.0), 220);
  const maturityFixedTop = goalCoinPos
    ? Math.round(goalCoinPos.top - Math.round(goalCoinPos.height / 2) - Math.round(maturityHeight / 2) - MATURITY_GAP)
    : 0;

  return (
  <main className="min-h-[100svh] relative overflow-x-hidden bg-black text-white pt-16">
      <GalaxyBackground />

      <motion.div
        className="absolute top-24 left-6 right-6 z-[5] text-left"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={
          animationStage >= 3 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }
        }
        transition={{ duration: 0.8, ease: "easeOut", type: "spring", damping: 20 }}
      >
        <h1
          className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight tracking-wide drop-shadow-2xl"
          style={{ fontFamily: "Georgia, serif", textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
        >
          Your Vision, Your Date.
          <br />
          <span className="text-yellow-400">Our Commitment.</span>
        </h1>
      </motion.div>

      <PathAndFamily animationStage={animationStage} />
      <GoldenPath animationStage={animationStage} />

      {!showBenefitPage && (
        <CoinBadge
          onClick={handleCoinClick}
          animationStage={animationStage}
          selectedGoal={selectedGoal}
        />
      )}

      {showGoals && <GoalsFanOut onClose={handleCloseGoals} onGoalSelect={handleGoalSelection} />}

      {/* inline showWhatIf overlay removed — navigation now goes directly to /plans/733/what-if */}

      {showBenefitPage && (
        <motion.div
          className="fixed inset-0 z-[10] bg-black overflow-visible"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          onClick={handleBenefitPageClick}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/30 to-black">
            <div className="absolute top-0 left-0 w-full h-3/5 bg-gradient-radial from-yellow-400/18 via-yellow-500/10 to-transparent blur-3xl" />
          </div>

          <GoldenPath animationStage={animationStage} heightVh={90} />

          <div className="absolute left-[8%] md:left-[18%] bottom-0 z-[5] w-[140px] md:w-[220px] h-auto md:h-[60vh] overflow-hidden">
            <div className="w-full h-full flex items-end justify-center">
              <div className="w-full flex items-end justify-center origin-bottom">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ transform: "scale(1.5)", transformOrigin: "50% 100%" }}>
                  <GirlFigure noAnimation parentControlled />
                </motion.div>
              </div>
            </div>
          </div>

          {benefitStage >= 3 && selectedGoal && goalCoinPos && (
            <div
              className="fixed z-[200] pointer-events-none"
              style={{
                left: goalCoinPos.left,
                top: goalCoinPos.top - 120,
                width: Math.round(goalCoinPos.width * OVERLAY_SCALE),
                height: Math.round(goalCoinPos.height * OVERLAY_SCALE),
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.div
                className="relative flex items-center justify-center w-full h-full"
                initial={{ y: -40, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", type: "spring", damping: 16 }}
              >
                <div className="absolute inset-0 w-full h-full bg-yellow-400 opacity-20 rounded-full blur-2xl" />
                <div
                  className="absolute inset-0 w-full h-full bg-yellow-300 opacity-30 rounded-full blur-xl"
                  style={{ animationDelay: "0.5s" }}
                />
                <div
                  className="absolute inset-0 w-full h-full bg-yellow-200 opacity-40 rounded-full blur-lg"
                  style={{ animationDelay: "1s" }}
                />
                {maturityWidth > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: `calc(-${maturityHeight}px - ${MATURITY_GAP}px)`,
                      transform: 'translateX(-50%)',
                      width: maturityWidth,
                      height: maturityHeight,
                      borderRadius: '50%',
                      background: 'linear-gradient(180deg,#0b4db8 0%, #053a8a 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 18px rgba(5,10,30,0.6)',
                      border: '2px solid rgba(255,255,255,0.06)',
                      zIndex: 9999,
                      outline: '2px solid rgba(255,0,255,0.9)'
                    }}
                  >
                    <div
                      style={{
                        color: '#ffd92e',
                        fontWeight: 800,
                        fontSize: maturityFontSize,
                        fontFamily: 'Georgia, serif',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        textShadow: '0 1px 0 rgba(0,0,0,0.6)',
                        transform: 'translateY(-2px)'
                      }}
                    >
                      MATURITY
                    </div>
                  </div>
                )}

                <div className="relative z-10 w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                  <NextImage
                    src={
                      selectedGoal === "career"
                        ? plan733Assets.career
                        : selectedGoal === "marriage"
                        ? plan733Assets.marriage
                        : selectedGoal === "study"
                        ? plan733Assets.study
                        : plan733Assets.goals
                    }
                    alt={`Selected goal`}
                    width={Math.round(goalCoinPos.width * OVERLAY_SCALE)}
                    height={Math.round(goalCoinPos.height * OVERLAY_SCALE)}
                    className="object-cover w-full h-full"
                    quality={90}
                  />
                </div>
              </motion.div>
            </div>
          )}

          {benefitStage >= 3 && selectedGoal && goalCoinPos && maturityWidth > 0 && (
            <div
              className="fixed pointer-events-none"
              style={{
                left: maturityLeft,
                top: maturityTopAdjusted,
                width: maturityWidth,
                height: maturityHeight,
                transform: 'translate(-50%, -50%)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: displayMaturityWidth,
                  height: 'auto',
                  borderRadius: 4,
                  background: 'rgba(5,58,138,0.92)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 18px rgba(191,161,74,0.12)',
                  border: '2px solid #bfa14a',
                  padding: '4px 6px',
                  minWidth: displayMaturityWidth,
                }}
              >
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div
                    style={{
                      color: '#ffd92e',
                      fontWeight: 700,
                      fontSize: Math.max(10, maturityFontSize - 1),
                      fontFamily: 'Georgia, serif',
                      lineHeight: 1.05,
                      whiteSpace: 'normal',
                      wordBreak: 'keep-all',
                    }}
                  >
                    On Decided Date:
                  </div>
                  <div
                    style={{
                      color: '#ffd92e',
                      fontWeight: 700,
                      fontSize: Math.max(10, maturityFontSize - 1),
                      fontFamily: 'Georgia, serif',
                      lineHeight: 1.05,
                      whiteSpace: 'normal',
                      wordBreak: 'keep-all',
                      marginTop: 2,
                    }}
                  >
                    get 110% SA + Bonus
                  </div>
                </div>
              </div>
            </div>
          )}

          {benefitStage >= 3 && selectedGoal && loadedDeath && loadedThen && (
            <>
              <div className="absolute left-1/2 top-[7.5vh] z-[12]" style={{ transform: "translateX(-50%)" }}>
                <div
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: "50%",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
                    overflow: "hidden",
                    background: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <NextImage
                    src={
                      selectedGoal === "career"
                        ? plan733Assets.career
                        : selectedGoal === "marriage"
                        ? plan733Assets.marriage
                        : selectedGoal === "study"
                        ? plan733Assets.study
                        : plan733Assets.goals
                    }
                    alt={`Selected goal`}
                    width={92}
                    height={92}
                    style={{ objectFit: "cover", width: 92, height: 92 }}
                    quality={90}
                  />
                </div>
              </div>

              <div className="absolute left-1/2 top-[2.5vh] z-[13]" style={{ transform: "translateX(40%)" }}>
                <div
                  style={{
                    background: "#23210f",
                    color: "#fffbe6",
                    borderRadius: 14,
                    border: "2px solid #bfa14a",
                    boxShadow: "0 2px 12px #0007",
                    padding: "0.6em 1.1em 0.6em 1.1em",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    minWidth: 140,
                    textAlign: "left",
                    lineHeight: 1.25,
                  }}
                >
                  <div style={{ fontSize: "0.93em", opacity: 0.85 }}>ON MATURITY:</div>
                  <div style={{ fontSize: "1.18em", fontWeight: 800, letterSpacing: "0.01em" }}>100% SUM ASSURED</div>
                  <div style={{ fontSize: "0.93em", opacity: 0.85 }}>+BONUS + FAB</div>
                </div>
              </div>
            </>
          )}

          {benefitStage >= 2 && (
            <div className="absolute left-1/2 top-[46vh] z-[11]" style={{ transform: "translateX(8%)" }}>
              <div
                style={{
                  background: "rgba(30,30,30,0.95)",
                  color: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px #0006",
                  padding: "0.5em 1.0em",
                  fontWeight: 700,
                  fontSize: "1.06rem",
                  letterSpacing: "0.02em",
                  textAlign: "center",
                  minWidth: 130,
                  border: "1px solid #fff2",
                }}
              >
                <div style={{ lineHeight: 1.05 }}>પછી: 10%<br />દર વર્ષે SA</div>
              </div>
            </div>
          )}

          {benefitStage >= 1 && (
            <div className="absolute right-[3%] top-[72%] z-[12] flex items-center justify-center">
              <div
                style={{
                  background: "rgba(192,57,43,0.92)",
                  color: "#fff",
                  borderRadius: 18,
                  boxShadow: "0 8px 26px rgba(0,0,0,0.6)",
                  padding: "0.5em 1.0em",
                  fontWeight: 800,
                  fontSize: "1.32rem",
                  letterSpacing: "0.02em",
                  textAlign: "center",
                  minWidth: 180,
                  border: "1px solid rgba(255,255,255,0.12)",
                  lineHeight: 1.05,
                }}
              >
                <div style={{ whiteSpace: 'nowrap' }}>💰 પ્રીમિયમ</div>
                <div style={{ fontSize: '1.18rem', marginTop: 6 }}>ભરવાનું બંધ</div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </main>
  );
};

export default Plan733Interactive;
