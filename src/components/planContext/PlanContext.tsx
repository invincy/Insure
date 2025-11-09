/**
 * PlanContext Component
 * Interactive premium selection table for LIC Jeevan Lakshya (733)
 * 
 * Features:
 * - Brochure-based premium grid (age × term)
 * - Summary card with installment options
 * - Maturity benefit estimation
 * - Bilingual support (EN/GU)
 * - Accessible & responsive
 */

'use client';

import { useState } from 'react';
import { 
  AVAILABLE_AGES, 
  ALL_TERMS, 
  getPremium, 
  BROCHURE_SUM_ASSURED 
} from '../../data/brochurePremiums';
import { estimateMaturity, calculateInstallments, formatCurrency } from '../../utils/bonus';
import { BonusConfig, PlanSelection, Language } from '../../types/planContext';
import enStrings from '../../i18n/planContext.en.json';
import guStrings from '../../i18n/planContext.gu.json';

interface PlanContextProps {
  /** Bonus configuration (set by parent) */
  bonusConfig: BonusConfig;
  /** Current language */
  language?: Language;
  /** Callback when user proceeds to What-If */
  onProceed: (selection: PlanSelection) => void;
  /** Optional: Pre-selected age */
  initialAge?: number;
  /** Optional: Pre-selected term */
  initialTerm?: number;
  /** Render a compact, transparent inline variant (no large white background) */
  compact?: boolean;
}

export default function PlanContext({
  bonusConfig,
  language = 'en',
  onProceed,
  initialAge,
  initialTerm,
  compact = false,
}: PlanContextProps) {
  const [selectedAge, setSelectedAge] = useState<number | null>(initialAge ?? null);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(initialTerm ?? null);
  const [showSummary, setShowSummary] = useState(false);

  const t = language === 'gu' ? guStrings.planContext : enStrings.planContext;

  const handleCellClick = (age: number, term: number) => {
    setSelectedAge(age);
    setSelectedTerm(term);
    setShowSummary(true);
  };

  const handleProceed = () => {
    if (!selectedAge || !selectedTerm) return;

    const annualPremium = getPremium(selectedAge, selectedTerm);
    if (!annualPremium) return;

    const ppt = selectedTerm - 3;
    const totalPremiumPaid = annualPremium * ppt;

    const maturity = estimateMaturity({
      sumAssured: BROCHURE_SUM_ASSURED,
      term: selectedTerm,
      ppt,
      bonus: bonusConfig,
    });

    const installments = calculateInstallments(annualPremium);
    
    const selection: PlanSelection = {
      age: selectedAge,
      term: selectedTerm,
      ppt,
      sumAssured: BROCHURE_SUM_ASSURED,
      annualPremium,
      totalPremiumPaid,
      estimatedMaturity: maturity,
      installmentOptions: [
        {
          mode: 'annual',
          label: 'Annual',
          labelGu: 'વાર્ષિક',
          amount: installments.annual,
          multiplier: 1.0,
          isApproximate: false,
        },
        {
          mode: 'halfYearly',
          label: t.summary.installmentHalfYearly,
          labelGu: guStrings.planContext.summary.installmentHalfYearly,
          amount: installments.halfYearly,
          multiplier: 0.51,
          isApproximate: true,
        },
        {
          mode: 'quarterly',
          label: t.summary.installmentQuarterly,
          labelGu: guStrings.planContext.summary.installmentQuarterly,
          amount: installments.quarterly,
          multiplier: 0.255,
          isApproximate: true,
        },
        {
          mode: 'monthly',
          label: t.summary.installmentMonthly,
          labelGu: guStrings.planContext.summary.installmentMonthly,
          amount: installments.monthly,
          multiplier: 0.085,
          isApproximate: true,
        },
      ],
    };

    onProceed(selection);
  };

  const containerOuterClass = compact
    ? 'w-full'
    : 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8';

  const containerInnerClass = compact ? 'max-w-md mx-auto' : 'max-w-6xl mx-auto';

  return (
    <div className={containerOuterClass}>
      <div className={containerInnerClass}>
        {/* Header (hidden in compact mode) */}
        {!compact && (
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t.title}</h1>
            <p className="text-base md:text-lg text-gray-600">{t.subtitle}</p>
          </div>
        )}

        {/* Premium Table */}
        <div className={compact ? '' : 'bg-white rounded-2xl shadow-lg overflow-hidden mb-6'}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <th className="p-4 text-left font-semibold text-sm md:text-base border-r border-white/20">
                    {t.tableHeader.age}
                  </th>
                  {ALL_TERMS.map((term) => {
                    const ppt = term - 3;
                    return (
                      <th
                        key={term}
                        className={`text-center font-semibold text-sm ${compact ? 'p-2' : 'p-4 md:p-4'} border-r border-white/20 last:border-r-0`}
                      >
                        <div>{term} {t.summary.years}</div>
                        <div className="text-xs opacity-90 mt-1">PPT {ppt}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {AVAILABLE_AGES.map((age, rowIndex) => (
                  <tr
                    key={age}
                    className={`${
                      rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <td className="p-4 font-bold text-gray-900 text-base md:text-lg border-r border-gray-200">
                      {age}
                    </td>
                    {ALL_TERMS.map((term) => {
                      const premium = getPremium(age, term);
                      const isSelected = selectedAge === age && selectedTerm === term;

                      return (
                        <td
                          key={`${age}-${term}`}
                          className={`text-center border-r border-gray-200 last:border-r-0 ${compact ? 'p-2' : 'p-2 md:p-4'}`}
                        >
                          {premium ? (
                            <button
                              onClick={() => handleCellClick(age, term)}
                              className={`w-full ${compact ? 'px-2 py-2 rounded-lg text-sm' : 'px-3 py-3 md:py-4 rounded-xl text-sm md:text-base'} font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                isSelected
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                                  : 'bg-blue-100 text-blue-900 hover:bg-blue-200 hover:shadow-md'
                              }`}
                              aria-label={`Select age ${age}, term ${term} years, premium ${formatCurrency(premium)}`}
                            >
                              <div className="flex flex-col items-center space-y-1">
                                <span className="text-xs opacity-75">{t.currency}</span>
                                <span>{premium.toLocaleString('en-IN')}</span>
                              </div>
                            </button>
                          ) : (
                            <div
                              className="text-gray-400 text-sm italic py-1"
                              aria-label={`Not available for age ${age}, term ${term}`}
                            >
                              {t.notAvailable}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Card */}
        {showSummary && selectedAge && selectedTerm && (() => {
          const annualPremium = getPremium(selectedAge, selectedTerm);
          if (!annualPremium) return null;

          const ppt = selectedTerm - 3;
          const totalPremiumPaid = annualPremium * ppt;
          const maturity = estimateMaturity({
            sumAssured: BROCHURE_SUM_ASSURED,
            term: selectedTerm,
            ppt,
            bonus: bonusConfig,
          });
          const installments = calculateInstallments(annualPremium);

          return (
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border-2 border-blue-200 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">📋</span>
                {t.summary.title}
              </h2>

              {/* Basic Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <InfoCard label={t.summary.age} value={`${selectedAge} ${t.summary.years}`} />
                <InfoCard label={t.summary.term} value={`${selectedTerm} ${t.summary.years}`} />
                <InfoCard label={t.summary.ppt} value={`${ppt} ${t.summary.years}`} />
                <InfoCard label={t.summary.sumAssured} value={formatCurrency(BROCHURE_SUM_ASSURED)} />
              </div>

              {/* Annual Premium */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-5 mb-6">
                <div className="text-sm opacity-90 mb-1">{t.summary.annualPremium}</div>
                <div className="text-3xl font-bold">{formatCurrency(annualPremium)}</div>
              </div>

              {/* Installment Options */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {t.summary.installmentTitle}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <InstallmentCard
                    label={t.summary.installmentHalfYearly}
                    amount={installments.halfYearly}
                    approx={t.summary.approx}
                  />
                  <InstallmentCard
                    label={t.summary.installmentQuarterly}
                    amount={installments.quarterly}
                    approx={t.summary.approx}
                  />
                  <InstallmentCard
                    label={t.summary.installmentMonthly}
                    amount={installments.monthly}
                    approx={t.summary.approx}
                  />
                </div>
              </div>

              {/* You Pay */}
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-gray-800">💰 {t.summary.youPay}</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {formatCurrency(totalPremiumPaid)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(annualPremium)} × {ppt} {t.summary.years}
                </div>
              </div>

              {/* You Get */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-gray-800">🎯 {t.summary.youGet}</span>
                  <span className="text-2xl md:text-3xl font-bold text-green-600">
                    {formatCurrency(maturity.totalMaturity)}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <BreakdownRow label={t.summary.breakdownBasic} value={maturity.basicSumAssured} />
                  <BreakdownRow label={t.summary.breakdownSimple} value={maturity.simpleReversionaryBonus} />
                  <BreakdownRow label={t.summary.breakdownFinal} value={maturity.finalAdditionalBonus} />
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  ⚠️ {t.summary.disclaimer}
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={handleProceed}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                aria-label={t.summary.ctaProceed}
              >
                {t.summary.ctaProceed}
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// Helper Components

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="text-base font-bold text-gray-900">{value}</div>
    </div>
  );
}

function InstallmentCard({ label, amount, approx }: { label: string; amount: number; approx: string }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
      <div className="text-xs text-gray-700 mb-1">{label}</div>
      <div className="text-sm font-bold text-blue-900">{formatCurrency(amount)}</div>
      <div className="text-xs text-gray-500 mt-1">{approx}</div>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-700">{label}</span>
      <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
    </div>
  );
}
