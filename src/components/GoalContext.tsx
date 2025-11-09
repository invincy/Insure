"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AVAILABLE_AGES, getPremium, getTermsForAge, BROCHURE_SUM_ASSURED } from '../data/brochurePremiums';
import ILLUSTRATIVE_MATURITIES from '../data/illustrativeMaturities';
import { estimateMaturity as estimateFromLib } from '../lib/bonus';
import en from '../i18n/en.json';
import gu from '../i18n/gu.json';
import { cardFadeVariant } from '../lib/animation';
import { useRouter } from 'next/navigation';
import type { GoalPlanPayload } from '../types';

interface Props {
  goalId: string;
  language?: 'en' | 'gu';
  onProceed: (payload: GoalPlanPayload) => void;
  onCancel: () => void;
  defaultExpanded?: boolean;
}

export default function GoalContext({ goalId, language = 'en', onProceed, onCancel, defaultExpanded = false }: Props) {
  const t = language === 'gu' ? gu.goalContext : en.goalContext;
  const [age, setAge] = useState<number | null>(null);
  const [term, setTerm] = useState<number | null>(null);
  const router = useRouter();
  const [showAgeMenu, setShowAgeMenu] = useState<boolean>(defaultExpanded);
  const [showTermMenu, setShowTermMenu] = useState<boolean>(defaultExpanded);
  const [showPremium, setShowPremium] = useState(false);

  // terms available for selected age (keeps UI minimal)
  const validTerms = useMemo(() => (age ? getTermsForAge(age) : []), [age]);

  const annualPremium = useMemo(() => {
    if (!age || !term) return null;
    return getPremium(age, term) ?? null;
  }, [age, term]);

  // only compute maturity when both age and term are selected
  const estimated = useMemo(() => {
    if (!age || !term) return null;
    return estimateFromLib(200000, term);
  }, [age, term]);

  // prefer pre-calculated illustrative maturities if available for the selected age+term
  const precomputed = useMemo(() => {
    if (!age || !term) return undefined;
    return (ILLUSTRATIVE_MATURITIES as any)[age]?.[term];
  }, [age, term]);

  const displayAnnual = precomputed?.annualPremium ?? annualPremium;
  const displayMaturity = precomputed?.estMaturity ?? ((estimated as any)?.totalMaturity ?? 0);

  const handleProceed = () => {
    // allow proceeding when we have either a computed annualPremium or a precomputed value
    if (!age || !term || (displayAnnual == null)) return;
    const ppt = term - 3;
    const totalPaid = (displayAnnual ?? 0) * ppt;
    // Build a normalized estimatedMaturity object so the route-based What‑If page
    // can display the detailed breakdown (basic SA, reversionary bonus, FAB, total)
    const maturityDetail = estimateFromLib(200000, term, ppt);

    const payload: GoalPlanPayload = {
      planId: 'JeevanLakshya733',
      goalId,
      age,
      term,
      ppt,
      sumAssured: 200000,
  annualPremium: displayAnnual ?? 0,
  totalPaid,
      // ensure we pass a structured maturity estimate (object) rather than a single number
      estimatedMaturity: maturityDetail,
      bonusAssumptionNote: 'Based on local declared bonus constants (offline)',
    };
    onProceed(payload);
  };

  const showPremiumButton = useMemo(() => age && term, [age, term]);

  return (
    <div className="relative z-20">
      {/* Compact floating UI: two small pills (Term on path, Age near father) */}
      <div className="fixed left-1/2 transform -translate-x-1/2 bottom-44 z-30 pointer-events-auto">
        <div className={`relative ${defaultExpanded ? 'bg-yellow-50/30 ring-1 ring-yellow-200/30 rounded-2xl p-3' : ''}`}>
          {/* Show Term and Age controls only when showPremium is false */}
          {!showPremium && (
            <>
              {/* Term menu */}
              {showTermMenu && (
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-32 w-auto bg-black/80 rounded-xl shadow-2xl p-2 border border-white/6 flex justify-center gap-2">
                  {getTermsForAge(age ?? AVAILABLE_AGES[0]).map((tr) => (
                    <button
                      key={tr}
                      onClick={() => {
                        setTerm(tr);
                      }}
                      className={`py-1 px-3 rounded-lg font-semibold text-sm whitespace-nowrap ${term === tr ? 'bg-yellow-400 text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
                    >
                      {tr} Y
                    </button>
                  ))}
                </div>
              )}

              {/* Term button (smaller, rounded-rect) */}
              <button
                onClick={() => setShowTermMenu(!showTermMenu)}
                className="absolute left-1/2 transform -translate-x-1/2 -top-44 py-2 px-4 rounded-md bg-yellow-400 text-black font-semibold shadow-md hover:bg-yellow-500"
              >
                Term
              </button>

              {/* Age menu */}
              {showAgeMenu && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-0 w-auto bg-black/80 rounded-xl shadow-2xl p-2 border border-white/6 flex justify-center gap-2">
                  {AVAILABLE_AGES.map((a) => (
                    <button
                      key={a}
                      onClick={() => {
                        setAge(a);
                      }}
                      className={`py-1 px-3 rounded-lg font-semibold text-sm whitespace-nowrap ${age === a ? 'bg-yellow-400 text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
                    >
                      {a} Y
                    </button>
                  ))}
                </div>
              )}

              {/* Age button (distinct: pill / rounded-full and slightly larger) */}
              <button
                onClick={() => setShowAgeMenu(!showAgeMenu)}
                className="absolute left-1/2 transform -translate-x-1/2 -top-12 py-2 px-4 rounded-full bg-yellow-400 text-black font-semibold shadow-md hover:bg-yellow-500 flex items-center gap-2"
              >
                <span className="w-3 h-3 rounded-full bg-purple-700 inline-block" aria-hidden />
                <span>Age</span>
              </button>
            </>
          )}

          {/* Show Premium and Maturity pills when showPremium is true */}
          {showPremium && (
            <>
              {/* Maturity pill - fixed position (left-1/4, higher) */}
              <div className="fixed left-1/4 transform -translate-x-1/2 bottom-32 z-30">
                <div className="flex items-center gap-3 py-2 px-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-400 text-black text-lg font-bold">★</span>
                  <div className="text-white">
                    <div className="text-xs opacity-90">Maturity</div>
                    <div className="font-semibold">₹{((estimated as any)?.totalMaturity ?? 0).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>

              {/* Premium pill - fixed position (same left, lower) */}
              <div className="fixed left-1/4 transform -translate-x-1/2 bottom-16 z-30">
                <div className="flex items-center gap-3 py-2 px-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-400 text-black text-lg font-bold">₹</span>
                  <div className="text-white">
                    <div className="text-xs opacity-90">Yearly</div>
                    <div className="font-semibold">₹{annualPremium?.toLocaleString('en-IN')}/-</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Show Premium button - only visible when age and term selected and showPremium is false */}
      {!showPremium && showPremiumButton && (
        <div className="fixed left-1/2 transform -translate-x-1/2 bottom-12 z-30 pointer-events-auto">
          <button
            onClick={() => {
              setShowPremium(true);
              setShowTermMenu(false);
              setShowAgeMenu(false);
            }}
            className="bg-yellow-400 text-black px-8 py-3 rounded-full shadow-lg font-bold hover:bg-yellow-500 transition-all cursor-pointer"
          >
            Show Premium
          </button>
        </div>
      )}

      {/* Proceed button - shown after premium is displayed */}
      {showPremium && (
        <div className="fixed left-1/2 transform -translate-x-1/2 bottom-12 z-30 pointer-events-auto">
          <button
            onClick={handleProceed}
            className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all cursor-pointer flex items-center justify-center w-12 h-12"
            aria-label="Proceed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* One-line disclaimer */}
      {age && term && (
        <div className="fixed inset-x-0 bottom-4 flex justify-center z-40 pointer-events-none">
          <div className="bg-black/60 text-white text-xs px-3 py-2 rounded-full backdrop-blur-sm pointer-events-auto">
            Based on LIC brochure & current bonus rate. Bonuses not guaranteed.
          </div>
        </div>
      )}
    </div>
  );
}
