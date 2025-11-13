# index.ts

> Source: `src/features/commerce/index.ts`

**Package:** `@katalyst/core`

## Overview

This module is part of the `@katalyst/core` package.

## Source Code

```typescript
/**
 * @katalyst/commerce - Commerce feature module
 * 
 * Used by: Applications that need payment processing
 * Contains: Payment providers, checkout flows, commerce hooks
 */

// ========================================
// 💳 PAYMENT PROVIDERS - Production ready only
// ========================================

// Hyperswitch (primary payment processor)
export {
  HyperswitchProvider,
  useHyperswitch,
  createPaymentIntent
} from '../../payments/providers/hyperswitch.ts';

// WalletConnect (crypto payments)
export {
  WalletConnectProvider,
  useWalletConnect,
  connectWallet
} from '../../payments/providers/walletconnect.ts';

// ========================================
// 🛒 COMMERCE COMPONENTS
// ========================================

// Payment forms and checkout
export {
  CheckoutForm,
  PaymentButton,
  PriceDisplay,
  CartSummary
} from '../../payments/components';

// ========================================
// 🪝 COMMERCE HOOKS
// ========================================

export {
  usePayment,
  useCart,
  useCheckout,
  useCurrency
} from '../../payments/hooks.ts';

// ========================================
// 🏪 COMMERCE STORE
// ========================================

export {
  usePaymentStore,
  useCartStore,
  type PaymentState,
  type CartState
} from '../../stores/payment-store.ts';

// ========================================
// 🔧 COMMERCE UTILITIES
// ========================================

export {
  formatCurrency,
  calculateTax,
  validateCard,
  generateInvoice
} from '../../payments/utils.ts';

/**
 * FOCUSED ON ACTUAL BUSINESS NEEDS:
 * 
 * ✅ Hyperswitch integration (used in production)
 * ✅ WalletConnect (crypto payments)
 * ✅ Checkout forms (reusable UI)
 * ✅ Cart management
 * ✅ Payment processing
 * 
 * REMOVED EXPERIMENTAL:
 * ❌ 1inch DEX integration (not used)
 * ❌ Symbiosis cross-chain (experimental)
 * ❌ Advanced DeFi protocols
 * 
 * Bundle size: ~12KB
 * Optional dependency - only loaded when needed
 */
```

---

*Generated documentation for @katalyst/core*
