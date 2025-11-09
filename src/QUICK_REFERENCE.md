# Plan Context - Quick Reference Card

**1-page cheat sheet for developers**

---

## 🚀 Quick Start (Copy & Paste)

```tsx
import PlanContext from '@/components/planContext/PlanContext';

export default function Page() {
  return (
    <PlanContext
      bonusConfig={{ simpleReversionaryPerThousand: 50, finalAdditionalPerThousand: 30 }}
      language="en"
      onProceed={(sel) => console.log(sel)}
    />
  );
}
```

---

## 📦 Files You Need

```
types/planContext.ts              - Interfaces
data/brochurePremiums.ts          - Premium matrix
utils/bonus.ts                    - Calculations
i18n/planContext.{en,gu}.json     - Strings
components/planContext/PlanContext.tsx  - Component
```

---

## 🎯 Props

```typescript
interface PlanContextProps {
  bonusConfig: BonusConfig;           // Required: { simpleReversionaryPerThousand, finalAdditionalPerThousand }
  onProceed: (sel: PlanSelection) => void;  // Required: Callback
  language?: 'en' | 'gu';             // Optional: Default 'en'
  initialAge?: number;                // Optional: Pre-select age
  initialTerm?: number;               // Optional: Pre-select term
}
```

---

## 💾 Selection Payload

```typescript
{
  age: 30,
  term: 20,
  ppt: 17,
  sumAssured: 200000,
  annualPremium: 11858,
  totalPremiumPaid: 201586,
  estimatedMaturity: { basicSumAssured, simpleReversionaryBonus, finalAdditionalBonus, totalMaturity },
  installmentOptions: [ {mode, amount, multiplier, isApproximate}, ... ]
}
```

---

## 🧮 Formula

```
Maturity = SA + (Simple × PPT × SA/1000) + (Final × SA/1000)

Example: ₹2L + (₹50 × 17 × 200) + (₹30 × 200) = ₹3,76,000
```

---

## 📊 Brochure Premiums (SA ₹2L)

| Age | 13y | 15y | 17y | 20y | 25y |
|-----|-----|-----|-----|-----|-----|
| 20  | 20217 | 16670 | — | 11711 | 9006 |
| 30  | 20286 | 16758 | — | 11858 | 9222 |
| 40  | 20678 | 16758 | 14798 | 12495 | 10074 |
| 50  | 22030 | 18698 | — | — | — |

PPT = Term - 3

---

## 🧪 Test

```bash
node __tests__/bonus.simple.test.js
# 9 tests → All pass ✅
```

---

## 🌐 i18n

```tsx
<PlanContext language={lang === 'gu' ? 'gu' : 'en'} ... />
```

Edit: `i18n/planContext.{en,gu}.json`

---

## 🔧 Utils

```typescript
import { estimateMaturity, calculateInstallments, formatCurrency } from '@/utils/bonus';

estimateMaturity({ sumAssured, term, ppt, bonus })  // → MaturityEstimate
calculateInstallments(annualPremium)                // → { annual, halfYearly, quarterly, monthly }
formatCurrency(200000)                              // → "₹2,00,000"
formatCurrency(200000, true)                        // → "₹2L"
```

---

## 📱 Demo

```bash
npm run dev
# → http://localhost:3000/demo/plan-context
```

---

## ⚠️ Important

- Bonuses are **illustrative**, not guaranteed
- Premiums from **LIC brochure** (official)
- No GST in calculations (add separately if needed)
- Works **offline** (no API calls)

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| Cells not showing | Check brochurePremiums import |
| Wrong maturity | Verify bonusConfig values |
| Gujarati broken | Use Noto Sans Gujarati font |
| TypeScript errors | Run `npm install` |

---

## 📚 Full Docs

- `PLAN_CONTEXT_README.md` - Complete reference
- `INTEGRATION_GUIDE.md` - Step-by-step integration
- `DELIVERY_SUMMARY.md` - What's included

---

## ✅ Checklist Before Deploy

- [ ] Update bonusConfig with current LIC rates
- [ ] Test all age/term combinations
- [ ] Verify Gujarati text displays correctly
- [ ] Check mobile responsiveness
- [ ] Run `node __tests__/bonus.simple.test.js`
- [ ] Test onProceed callback
- [ ] Verify What-If scene receives payload

---

**Module:** `@/components/planContext/PlanContext`  
**Version:** 1.0.0  
**Status:** Production Ready ✅
