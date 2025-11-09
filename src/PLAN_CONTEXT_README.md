# Plan Context Module - LIC Jeevan Lakshya (733)

Post-goal selection premium picker with maturity estimation.

## Overview

This module implements the **Plan Context** screen that appears after a user selects their goal in the LIC Jeevan Lakshya flow. It displays an interactive table of brochure premiums and calculates estimated maturity benefits.

## Features

✅ **Brochure-accurate premiums** - Only official LIC data for ₹2,00,000 SA  
✅ **Interactive age × term grid** - Ages 20/30/40/50, Terms 13/15/17/20/25  
✅ **Maturity estimation** - Transparent bonus calculation (illustrative)  
✅ **Installment options** - Annual, half-yearly, quarterly, monthly  
✅ **Bilingual** - English + Gujarati (ગુજરાતી)  
✅ **Accessible** - ARIA labels, focus states, 14px+ text  
✅ **Offline-ready** - No network calls, pure client-side  

## Files Structure

```
plan-733/
├── types/
│   └── planContext.ts              # TypeScript interfaces
├── data/
│   └── brochurePremiums.ts         # Official premium matrix
├── utils/
│   └── bonus.ts                    # Maturity calculation logic
├── i18n/
│   ├── planContext.en.json         # English strings
│   └── planContext.gu.json         # Gujarati strings
├── components/
│   └── planContext/
│       └── PlanContext.tsx         # Main component
├── app/
│   └── demo/
│       └── plan-context/
│           └── page.tsx            # Demo page
└── __tests__/
    ├── bonus.test.ts               # Unit tests (TypeScript)
    └── bonus.simple.test.js        # Standalone test runner
```

## Usage

### Basic Integration

```tsx
import PlanContext from '@/components/planContext/PlanContext';
import type { PlanSelection, BonusConfig } from '@/types/planContext';

function MyPage() {
  const bonusConfig: BonusConfig = {
    simpleReversionaryPerThousand: 50,  // ₹50 per ₹1,000 SA per year
    finalAdditionalPerThousand: 30,     // ₹30 per ₹1,000 SA at maturity
  };

  const handleProceed = (selection: PlanSelection) => {
    console.log('User selected:', selection);
    // Navigate to What-If scene with selection data
  };

  return (
    <PlanContext
      bonusConfig={bonusConfig}
      language="en"  // or "gu"
      onProceed={handleProceed}
    />
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `bonusConfig` | `BonusConfig` | ✅ | Bonus rates for maturity calculation |
| `language` | `'en' \| 'gu'` | ❌ | UI language (default: `'en'`) |
| `onProceed` | `(selection: PlanSelection) => void` | ✅ | Callback when user proceeds |
| `initialAge` | `number` | ❌ | Pre-select an age |
| `initialTerm` | `number` | ❌ | Pre-select a term |

### Selection Payload

When user proceeds, `onProceed` receives:

```typescript
{
  age: 30,
  term: 20,
  ppt: 17,
  sumAssured: 200000,
  annualPremium: 11858,
  totalPremiumPaid: 201586,  // annualPremium × ppt
  estimatedMaturity: {
    basicSumAssured: 200000,
    simpleReversionaryBonus: 170000,
    finalAdditionalBonus: 6000,
    totalMaturity: 376000
  },
  installmentOptions: [
    { mode: 'annual', amount: 11858, ... },
    { mode: 'halfYearly', amount: 6048, ... },
    { mode: 'quarterly', amount: 3024, ... },
    { mode: 'monthly', amount: 1008, ... }
  ]
}
```

## Brochure Data

Premium matrix from **LIC Jeevan Lakshya Plan 733 official brochure**:

| Age | Term 13 (PPT 10) | Term 15 (PPT 12) | Term 17 (PPT 14) | Term 20 (PPT 17) | Term 25 (PPT 22) |
|-----|------------------|------------------|------------------|------------------|------------------|
| 20  | ₹20,217         | ₹16,670         | —                | ₹11,711         | ₹9,006          |
| 30  | ₹20,286         | ₹16,758         | —                | ₹11,858         | ₹9,222          |
| 40  | ₹20,678         | ₹16,758         | ₹14,798         | ₹12,495         | ₹10,074         |
| 50  | ₹22,030         | ₹18,698         | —                | —                | —                |

Sum Assured: **₹2,00,000** (annual premiums, excl. taxes)

## Maturity Formula

```typescript
// Maturity Benefit (on survival)
= Basic Sum Assured
+ Vested Simple Reversionary Bonus
+ Final Additional Bonus

// Where:
Simple Bonus = (Bonus per ₹1,000 per year) × PPT × (SA / 1,000)
Final Bonus  = (Bonus per ₹1,000) × (SA / 1,000)
```

**Example:**
- SA = ₹2,00,000
- Term = 20, PPT = 17
- Simple bonus = ₹50/₹1,000/yr → ₹50 × 17 × 200 = ₹1,70,000
- Final bonus = ₹30/₹1,000 → ₹30 × 200 = ₹6,000
- **Total = ₹2,00,000 + ₹1,70,000 + ₹6,000 = ₹3,76,000**

> ⚠️ Bonuses are **illustrative** and subject to LIC's performance. Not guaranteed.

## Installment Multipliers

| Mode | Multiplier | Frequency |
|------|-----------|-----------|
| Annual | 1.0 | Once/year |
| Half-Yearly | ~0.51 | Twice/year (approx.) |
| Quarterly | ~0.255 | 4×/year (approx.) |
| Monthly | ~0.085 | 12×/year (approx.) |

Total yearly: ~102% of annual (industry standard).

## Testing

### Run Unit Tests

```bash
# With Jest/Vitest (if configured)
npm test __tests__/bonus.test.ts

# Standalone runner (no dependencies)
node __tests__/bonus.simple.test.js
```

### Test Coverage

- ✅ Zero bonus scenarios
- ✅ Simple reversionary only
- ✅ Both bonus types
- ✅ Fractional calculations
- ✅ Error handling (negative SA, PPT > term)
- ✅ Real brochure scenarios (Age 20/50)
- ✅ Installment calculations
- ✅ Currency formatting

## Demo

Visit `/demo/plan-context` to try the component interactively:

```bash
npm run dev
# Open http://localhost:3000/demo/plan-context
```

Features in demo:
- Toggle EN/GU language
- Adjust bonus config in real-time
- See selection payload JSON
- Test all acceptance criteria

## Accessibility

- ✅ Minimum 14px text (14-18px responsive)
- ✅ Focus indicators on all interactive elements
- ✅ ARIA labels for screen readers
- ✅ Keyboard navigation support
- ✅ Gujarati text properly shaped (no images)

## i18n

Add/edit strings in:
- `i18n/planContext.en.json` - English
- `i18n/planContext.gu.json` - Gujarati

Example:
```json
{
  "planContext": {
    "title": "Choose Your Plan Example",
    "summary": {
      "ctaProceed": "Proceed to What-If →"
    }
  }
}
```

## API Reference

### `estimateMaturity(input: MaturityInput): MaturityEstimate`

Pure function to calculate maturity benefit.

**Input:**
```typescript
{
  sumAssured: number;      // ₹
  term: number;            // years
  ppt: number;             // years
  bonus: BonusConfig;
}
```

**Output:**
```typescript
{
  basicSumAssured: number;
  simpleReversionaryBonus: number;
  finalAdditionalBonus: number;
  totalMaturity: number;
}
```

### `calculateInstallments(annualPremium: number)`

Returns installment amounts for all payment modes.

```typescript
{
  annual: 20000,
  halfYearly: 10200,
  quarterly: 5100,
  monthly: 1700
}
```

### `formatCurrency(amount: number, compact?: boolean): string`

Formats Indian Rupee amounts.

```typescript
formatCurrency(200000)       // "₹2,00,000"
formatCurrency(200000, true) // "₹2L"
```

## Acceptance Criteria ✅

- [x] Only brochure premiums render
- [x] Missing combos hidden (e.g., Age 50 × Term 20)
- [x] PPT = Term - 3
- [x] Total Paid = Annual × PPT (no GST in calculation)
- [x] Estimated maturity clearly marked "Illustrative"
- [x] Installment options show "approx." label
- [x] Single click proceeds to What-If
- [x] Works offline, no network calls
- [x] Buildable with Vite/Next.js

## Next Steps

1. **Integrate with goal selection** - Pass selected goal context
2. **Implement What-If scene** - Use selection payload
3. **Add premium calculator** - Custom SA amounts
4. **Enhance animations** - Framer Motion transitions
5. **Add plan comparison** - Side-by-side view

## License

Internal use only. LIC brochure data © Life Insurance Corporation of India.

---

**Questions?** Check `/demo/plan-context` or review the inline JSDoc comments.
