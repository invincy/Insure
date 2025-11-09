# Plan Context Integration Guide

Quick start for integrating the Plan Context module into your LIC Jeevan Lakshya flow.

## Quick Integration (3 steps)

### 1. Import and configure

```tsx
// app/plans/733/premium-selection/page.tsx
'use client';

import PlanContext from '@/components/planContext/PlanContext';
import type { PlanSelection, BonusConfig } from '@/types/planContext';
import { useRouter } from 'next/navigation';

export default function PremiumSelectionPage() {
  const router = useRouter();

  // Configure bonus assumptions (update these based on current LIC rates)
  const bonusConfig: BonusConfig = {
    simpleReversionaryPerThousand: 50,  // ₹50 per ₹1,000 SA per year
    finalAdditionalPerThousand: 30,     // ₹30 per ₹1,000 SA at maturity
  };

  const handleProceed = (selection: PlanSelection) => {
    // Store selection in state/context/localStorage
    sessionStorage.setItem('planSelection', JSON.stringify(selection));
    
    // Navigate to What-If scene
    router.push('/plans/733/what-if');
  };

  return (
    <PlanContext
      bonusConfig={bonusConfig}
      language="en"  // or use user preference
      onProceed={handleProceed}
    />
  );
}
```

### 2. Retrieve selection in What-If scene

```tsx
// app/plans/733/what-if/page.tsx
'use client';

import { useEffect, useState } from 'react';
import type { PlanSelection } from '@/types/planContext';

export default function WhatIfPage() {
  const [selection, setSelection] = useState<PlanSelection | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('planSelection');
    if (stored) {
      setSelection(JSON.parse(stored));
    }
  }, []);

  if (!selection) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>What If Scenario</h1>
      <p>Age: {selection.age}</p>
      <p>Premium: ₹{selection.annualPremium.toLocaleString('en-IN')}</p>
      <p>Maturity: ₹{selection.estimatedMaturity.totalMaturity.toLocaleString('en-IN')}</p>
      {/* ... your What-If content */}
    </div>
  );
}
```

### 3. Update bonus config (when LIC rates change)

```tsx
// config/bonusRates.ts
import type { BonusConfig } from '@/types/planContext';

/**
 * Current bonus assumptions for LIC Jeevan Lakshya (733)
 * Update these when new bonus rates are declared
 * 
 * Source: LIC official bonus declaration / agent handbook
 * Last updated: [DATE]
 */
export const CURRENT_BONUS: BonusConfig = {
  // Simple Reversionary Bonus (₹ per ₹1,000 Sum Assured per year)
  simpleReversionaryPerThousand: 50,
  
  // Final Additional Bonus (₹ per ₹1,000 Sum Assured, one-time at maturity)
  finalAdditionalPerThousand: 30,
};

// Historical rates for reference
export const BONUS_HISTORY = [
  { year: 2024, simple: 50, final: 30 },
  { year: 2023, simple: 48, final: 28 },
  // ...
];
```

Then import in your page:

```tsx
import { CURRENT_BONUS } from '@/config/bonusRates';

<PlanContext bonusConfig={CURRENT_BONUS} ... />
```

## Language Switching

```tsx
'use client';

import { useState } from 'react';
import type { Language } from '@/types/planContext';

function MyApp() {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <>
      <button onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}>
        {language === 'en' ? 'ગુજરાતી' : 'English'}
      </button>
      
      <PlanContext language={language} ... />
    </>
  );
}
```

## Pre-selecting Age/Term

Useful if user came from a specific campaign or flow:

```tsx
<PlanContext
  initialAge={30}
  initialTerm={20}
  bonusConfig={bonusConfig}
  onProceed={handleProceed}
/>
```

## Customizing Styling

The component uses Tailwind classes. Override via parent styles:

```tsx
<div className="custom-wrapper">
  <PlanContext ... />
</div>

<style jsx>{`
  .custom-wrapper :global(.bg-blue-600) {
    background-color: #your-brand-color;
  }
`}</style>
```

Or create a custom theme:

```tsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-brand-color',
      },
    },
  },
};
```

## Validation & Error Handling

```tsx
const handleProceed = (selection: PlanSelection) => {
  // Validate selection
  if (selection.age < 18 || selection.age > 60) {
    alert('Age must be between 18 and 60');
    return;
  }

  // Check minimum premium
  if (selection.annualPremium < 5000) {
    alert('Premium too low');
    return;
  }

  // All good - proceed
  saveAndNavigate(selection);
};
```

## Analytics Integration

```tsx
import { trackEvent } from '@/lib/analytics';

const handleProceed = (selection: PlanSelection) => {
  // Track premium selection
  trackEvent('premium_selected', {
    age: selection.age,
    term: selection.term,
    premium: selection.annualPremium,
    maturity: selection.estimatedMaturity.totalMaturity,
  });

  // Proceed
  router.push('/plans/733/what-if');
};
```

## SSR/Static Generation

The component is client-side only (`'use client'`). For SSR, create a wrapper:

```tsx
// app/plans/733/premium-selection/page.tsx
import dynamic from 'next/dynamic';

const PlanContext = dynamic(
  () => import('@/components/planContext/PlanContext'),
  { ssr: false }
);

export default function Page() {
  return <PlanContext ... />;
}
```

## Testing Your Integration

```tsx
// __tests__/integration.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import PlanContext from '@/components/planContext/PlanContext';

test('selects premium and proceeds', () => {
  const mockOnProceed = jest.fn();
  
  render(
    <PlanContext
      bonusConfig={{ simpleReversionaryPerThousand: 50, finalAdditionalPerThousand: 30 }}
      onProceed={mockOnProceed}
    />
  );

  // Click a premium cell
  const cell = screen.getByLabelText(/age 30.*term 20/i);
  fireEvent.click(cell);

  // Click proceed
  const proceedBtn = screen.getByText(/proceed to what-if/i);
  fireEvent.click(proceedBtn);

  // Verify callback
  expect(mockOnProceed).toHaveBeenCalledWith(
    expect.objectContaining({
      age: 30,
      term: 20,
      ppt: 17,
    })
  );
});
```

## Troubleshooting

### Premium cells not showing
- Check console for TypeScript errors
- Verify brochurePremiums.ts is imported correctly
- Ensure ages/terms match the brochure data

### Maturity calculation seems wrong
- Verify bonusConfig values
- Check formula in utils/bonus.ts
- Run unit tests: `node __tests__/bonus.simple.test.js`

### Gujarati text not displaying correctly
- Ensure font supports Gujarati script (Noto Sans Gujarati)
- Check browser/OS has proper Gujarati rendering

### Component not rendering
- Verify all imports are correct
- Check Next.js version compatibility (requires 14+)
- Ensure Tailwind is configured

## Performance Tips

1. **Memoize bonus config** if it doesn't change:
```tsx
const bonusConfig = useMemo(() => ({
  simpleReversionaryPerThousand: 50,
  finalAdditionalPerThousand: 30,
}), []);
```

2. **Lazy load the component**:
```tsx
const PlanContext = lazy(() => import('@/components/planContext/PlanContext'));
```

3. **Prefetch What-If route**:
```tsx
import { useRouter } from 'next/navigation';
useEffect(() => {
  router.prefetch('/plans/733/what-if');
}, [router]);
```

## Next Steps

- [ ] Integrate with goal selection flow
- [ ] Connect to What-If scene
- [ ] Add custom SA calculator
- [ ] Implement comparison view
- [ ] Add PDF brochure download
- [ ] Set up analytics tracking

---

**Need help?** Check PLAN_CONTEXT_README.md or try the demo at `/demo/plan-context`.
