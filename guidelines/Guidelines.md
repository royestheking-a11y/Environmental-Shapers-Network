# Engineering & Architecture Guidelines

**Environmental Shapers Network (ESN)**  
*Engineered and Maintained by Rizqara Tech*

---

## 1. Code Architecture & Organization
- **Component Modularity:** Reusable, presentation-focused components live under `src/app/components/`. UI primitives live under `src/app/components/ui/`.
- **Pages & Routes:** Page-level views live under `src/app/pages/` and are registered in the top-level router (`src/app/App.tsx`).
- **Dynamic Content & Mock CMS:** Live state is synchronized with Firestore / local cache utilities (`src/lib/useFirestore.ts`). All sections gracefully degrade to built-in fallbacks when offline or uninitialized.
- **Type Safety:** Maintain strict TypeScript interfaces across all data models (found in `src/app/pages/admin/sections/`).

## 2. Design System & Styling
- **Typography:** `Plus Jakarta Sans` for headers and emphasis, `Inter` for crisp body typography.
- **Color Palette:** 
  - Primary Forest Green: `#0B5D3F`
  - Emerald Accent: `#10B981` / `#4CAF50`
  - Deep Navy / Slate: `#173B63` / `#0F172A`
  - Warm Earth & Backgrounds: `#F8FAFC` / `#FFFFFF`
- **Responsiveness:** Mobile-first approach using Tailwind CSS breakpoints (`sm`, `md`, `lg`, `xl`).

## 3. Performance & Accessibility
- **Images:** All dynamic images utilize `ImageWithFallback` to ensure smooth rendering and graceful failure recovery.
- **Animations:** Subtle, hardware-accelerated animations using `motion/react` with respect for reduced motion preferences.
- **Semantic HTML:** Correct hierarchy of headings (`<h1>` through `<h6>`), proper ARIA attributes, and accessible keyboard navigation.
