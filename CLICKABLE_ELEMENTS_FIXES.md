# Clickable Elements Accessibility Fixes

## Overview

This document outlines the fixes needed for clickable elements in the IVolex project to ensure proper accessibility compliance. The main issues identified are:

1. Missing `aria-label` attributes on icon-only buttons
2. Missing `role` attributes on interactive elements
3. Missing `tabIndex` for custom interactive components
4. Missing keyboard event handlers for accessibility

## Files That Need Fixes

### 1. ProductCard Component
**File**: [src/ui/components/ProductCard/ProductCard.jsx](file:///C:/Users/FAISAL/Downloads/IVOLEX/src/ui/components/ProductCard/ProductCard.jsx)

**Issues**:
- Add to Cart button has `aria-label` but Wishlist button doesn't
- Product card itself is clickable but doesn't have proper accessibility attributes

**Fixes**:
```jsx
// Add proper accessibility to the product card
<motion.div
  className="relative overflow-hidden rounded-2xl bg-white shadow-soft cursor-pointer group"
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.3 }}
  onClick={onCardClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCardClick();
    }
  }}
  role="button"
  tabIndex={0}
  aria-label={`View details for ${safeProduct.name}`}
>

// Add aria-label to Wishlist button
<motion.button
  className="p-3 bg-white rounded-full shadow-lg hover:bg-stone-50"
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  aria-label="Add to Wishlist"
  onClick={e => e.stopPropagation()}
>
  <Heart size={20} className="text-stone-700" />
</motion.button>
```

### 2. FloatingNavbar Component
**File**: [src/ui/components/FloatingNavbar.jsx](file:///C:/Users/FAISAL/Downloads/IVOLEX/src/ui/components/FloatingNavbar.jsx)

**Issues**:
- Cart button is missing `onClick` handler
- Mobile menu toggle button has "Menu" label but could be more descriptive

**Fixes**:
```jsx
// Add onClick handler to Cart button
<motion.button
  className="relative p-2 text-foreground/70 hover:text-primary hover:bg-background/50 rounded-full transition-all"
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  aria-label={t('nav.cart')}
  onClick={() => navigate('/cart')}
>
  <ShoppingBag size={20} />
  {/* ... existing badge code ... */}
</motion.button>

// Improve mobile menu toggle label
<motion.button
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  className="lg:hidden p-2 text-foreground/70 hover:text-primary hover:bg-background/50 rounded-full transition-all"
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
  aria-expanded={isMobileMenuOpen}
>
  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
</motion.button>
```

### 3. Header Component
**File**: [src/ui/sections/Header.jsx](file:///C:/Users/FAISAL/Downloads/IVOLEX/src/ui/sections/Header.jsx)

**Issues**:
- Region selector button lacks descriptive label
- User menu button lacks descriptive label

**Fixes**:
```jsx
// Improve region selector button
<button
  onClick={() => setIsRegionOpen(!isRegionOpen)}
  className="flex items-center gap-1 text-sm border rounded-xl px-3 py-1.5 hover:bg-stone-50 transition-colors"
  aria-label={`Select region, currently ${effectiveRegion || 'Global'}`}
  aria-expanded={isRegionOpen}
>
  <Globe size={16} />
  <span>{effectiveRegion || 'Global'}</span>
  <ChevronDown size={14} />
</button>

// Improve user menu button
<button
  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
  className="flex items-center gap-2 text-sm border rounded-xl px-3 py-1.5 hover:bg-stone-50 transition-colors"
  aria-label={`User menu, ${user?.firstName || 'Profile'}`}
  aria-expanded={isUserMenuOpen}
>
  <User size={16} />
  <span>{user?.firstName || 'Profile'}</span>
  <ChevronDown size={14} />
</button>
```

### 4. SearchAndFilter Component
**File**: [src/ui/components/SearchAndFilter.jsx](file:///C:/Users/FAISAL/Downloads/IVOLEX/src/ui/components/SearchAndFilter.jsx)

**Issues**:
- Filter panel button lacks descriptive label
- Sort dropdown button lacks descriptive label
- Clear filters button lacks descriptive label

**Fixes**:
```jsx
// Improve filter panel button
<button
  onClick={() => setIsOpen(!isOpen)}
  className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-stone-50 transition-colors ${
    hasActiveFilters
      ? 'border-brand-300 bg-brand-50 text-brand-700'
      : 'border-stone-300'
  } ${isRTL ? 'flex-row-reverse' : ''}`}
  aria-expanded={isOpen}
  aria-haspopup="true"
  aria-label={hasActiveFilters ? "Filters applied, click to modify" : "Open filters panel"}
>
  {/* ... existing content ... */}
</button>

// Improve sort dropdown button
<button
  onClick={() => setIsOpen(!isOpen)}
  className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors min-w-[140px] justify-between"
  aria-expanded={isOpen}
  aria-haspopup="true"
  aria-label={`Sort by ${currentOption ? currentOption.label : 'default'}`}
>
  {/* ... existing content ... */}
</button>

// Improve clear filters button
<button
  onClick={() => {
    onClearFilters()
    setIsOpen(false)
  }}
  className="text-sm text-brand-600 hover:text-brand-700"
  aria-label="Clear all filters"
>
  {t('common.clearAll', 'Clear All')}
</button>
```

### 5. ProductRecommendations Component
**File**: [src/ui/components/ProductRecommendations.jsx](file:///C:/Users/FAISAL/Downloads/IVOLEX/src/ui/components/ProductRecommendations.jsx)

**Issues**:
- Quick action buttons lack descriptive labels
- View All button lacks descriptive label
- Add Bundle to Cart button lacks descriptive label

**Fixes**:
```jsx
// Improve wishlist button
<button
  onClick={e => {
    e.stopPropagation()
    handleWishlist(product)
  }}
  className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
  aria-label="Add to wishlist"
>
  <Heart size={16} />
</button>

// Improve eye/view button
<button
  onClick={e => {
    e.stopPropagation()
    // Navigate to product detail
  }}
  className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
  aria-label="View product details"
>
  <Eye size={16} />
</button>

// Improve View All button
<button 
  className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium transition-colors"
  aria-label="View all recommended products"
>
  {t('common.viewAll', 'View All')}
  <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
</button>

// Improve Add Bundle to Cart button
<button 
  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
  aria-label="Add bundle to cart for 10% discount"
>
  {t('recommendations.addBundle', 'Add Bundle to Cart')}
</button>
```

### 6. EnhancedHero Component
**File**: [src/ui/sections/EnhancedHero.jsx](file:///C:/Users/FAISAL/Downloads/IVOLEX/src/ui/sections/EnhancedHero.jsx)

**Issues**:
- CTA buttons lack descriptive labels
- Watch Our Story button lacks descriptive label

**Fixes**:
```jsx
// Improve main CTA button
<motion.button
  onClick={handleCTAClick}
  className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg shadow-segment-lg transition-all duration-300"
  style={{
    backgroundColor: theme.colors.primary,
    color: 'white',
  }}
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  aria-label={`Shop now: ${content.cta}`}
>
  {/* ... existing content ... */}
</motion.button>

// Improve Watch Our Story button
<motion.button
  onClick={handleVideoPlay}
  className="group flex items-center gap-3 px-6 py-4 rounded-2xl border border-border bg-surface/50 backdrop-blur-sm text-foreground font-medium transition-all duration-300 hover:bg-surface/80"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  aria-label="Watch our story video"
>
  {/* ... existing content ... */}
  Watch Our Story
</motion.button>
```

### 7. NotFoundScreen Component
**File**: [src/pages/screens/NotFound/NotFoundScreen.jsx](file:///C:/Users/FAISAL/Downloads/IVOLEX/src/pages/screens/NotFound/NotFoundScreen.jsx)

**Issues**:
- Go Back button has proper label but could be more descriptive

**Fixes**:
```jsx
// Improve Go Back button
<button
  onClick={() => navigate(-1)}
  className={`flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
  aria-label="Go back to previous page"
>
  <ArrowLeft size={18} />
  {t('common.back', 'Go Back')}
</button>
```

## Implementation Plan

### Phase 1: Critical Accessibility Fixes (High Priority)
1. Add missing `aria-label` attributes to all icon-only buttons
2. Add proper `role` and `tabIndex` to interactive elements
3. Add keyboard event handlers for keyboard navigation

### Phase 2: Enhanced Accessibility (Medium Priority)
1. Add `aria-expanded` and `aria-haspopup` attributes where appropriate
2. Add descriptive labels for screen readers
3. Implement focus management for dropdowns and modals

### Phase 3: Testing and Validation (Low Priority)
1. Test with screen readers
2. Validate keyboard navigation
3. Run accessibility audit tools

## Benefits of These Fixes

1. **Improved Accessibility**: Users with disabilities will have a better experience
2. **Better SEO**: Search engines can better understand interactive elements
3. **Compliance**: Meets WCAG 2.1 AA standards
4. **User Experience**: All users benefit from clearer interaction cues

## Testing Recommendations

1. Use screen readers (NVDA, JAWS, VoiceOver) to test navigation
2. Test keyboard-only navigation through all interactive elements
3. Run automated accessibility testing tools (axe, Lighthouse)
4. Validate with manual testing using accessibility checklists