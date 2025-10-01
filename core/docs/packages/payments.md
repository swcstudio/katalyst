# @katalyst/payments

Unified payment provider integrations including HyperSwitch, WalletConnect, 1inch DEX, and Symbiosis.

## Overview

The `@katalyst/payments` package provides a unified interface for multiple payment providers, supporting both traditional and crypto payments.

### Key Features

- 💳 **Traditional Payments** - HyperSwitch for cards and digital wallets
- 🔗 **Web3 Payments** - WalletConnect for crypto
- 🔄 **DEX Integration** - 1inch for token swaps
- 🌉 **Cross-Chain** - Symbiosis for cross-chain transfers
- 🎯 **Unified API** - Single interface for all providers
- 🔐 **Secure** - Built-in security best practices
- 📊 **Analytics** - Transaction tracking

## Installation

```typescript
import { PaymentManager } from '@katalyst/payments';
```

## Quick Start

```typescript
import { PaymentManager } from '@katalyst/payments';

const payments = new PaymentManager({
  providers: ['hyperswitch', 'walletconnect']
});

// Process payment
const result = await payments.processPayment({
  amount: 1000,
  currency: 'USD',
  provider: 'hyperswitch',
  paymentMethod: 'card'
});
```

## Payment Providers

### HyperSwitch

```typescript
import { HyperSwitch } from '@katalyst/payments/providers/hyperswitch';

const hyperswitch = new HyperSwitch({
  apiKey: process.env.HYPERSWITCH_API_KEY,
  environment: 'production'
});

// Create payment
const payment = await hyperswitch.createPayment({
  amount: 5000,
  currency: 'USD',
  customer: {
    email: 'customer@example.com'
  }
});

// Confirm payment
const result = await hyperswitch.confirmPayment(payment.id, {
  paymentMethod: 'card',
  cardDetails: { /* ... */ }
});
```

### WalletConnect

```typescript
import { WalletConnect } from '@katalyst/payments/providers/walletconnect';

const walletConnect = new WalletConnect({
  projectId: process.env.WALLETCONNECT_PROJECT_ID
});

// Connect wallet
await walletConnect.connect();

// Send transaction
const tx = await walletConnect.sendTransaction({
  to: '0x...',
  value: ethers.utils.parseEther('0.1')
});
```

### 1inch (DEX)

```typescript
import { OneInch } from '@katalyst/payments/providers/oneinch';

const oneinch = new OneInch({
  apiKey: process.env.ONEINCH_API_KEY
});

// Get swap quote
const quote = await oneinch.getQuote({
  fromToken: 'ETH',
  toToken: 'USDC',
  amount: '1'
});

// Execute swap
const swap = await oneinch.executeSwap(quote);
```

### Symbiosis

```typescript
import { Symbiosis } from '@katalyst/payments/providers/symbiosis';

const symbiosis = new Symbiosis();

// Cross-chain swap
const result = await symbiosis.swap({
  fromChain: 'ethereum',
  toChain: 'polygon',
  fromToken: 'ETH',
  toToken: 'MATIC',
  amount: '1'
});
```

## Payment Manager

```typescript
import { PaymentManager } from '@katalyst/payments';

const manager = new PaymentManager({
  providers: {
    hyperswitch: {
      apiKey: process.env.HYPERSWITCH_API_KEY
    },
    walletconnect: {
      projectId: process.env.WALLETCONNECT_PROJECT_ID
    }
  }
});

// Process with any provider
const result = await manager.process({
  provider: 'hyperswitch',
  amount: 1000,
  currency: 'USD'
});
```

## React Integration

```tsx
import { usePayments, PaymentProvider } from '@katalyst/payments';

function App() {
  return (
    <PaymentProvider>
      <CheckoutForm />
    </PaymentProvider>
  );
}

function CheckoutForm() {
  const { processPayment, loading } = usePayments();
  
  const handlePay = async () => {
    const result = await processPayment({
      amount: 5000,
      currency: 'USD'
    });
  };
  
  return (
    <button onClick={handlePay} disabled={loading}>
      Pay Now
    </button>
  );
}
```

## Best Practices

1. **Secure API keys** - Never expose keys in client code
2. **Handle errors** - Implement proper error handling
3. **Test payments** - Use sandbox/testnet
4. **Validate amounts** - Check amounts before processing
5. **Track transactions** - Log all payment attempts
6. **Use webhooks** - Listen for payment events

## Related Documentation

- [API Package](./api.md) - Payment APIs
- [Core Package](./core.md) - Payment UI components

---

**Version**: N/A (Monorepo)  
**Last Updated**: 2024  
**Status**: Production Ready
