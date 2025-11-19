# Solana Wallet Configuration Guide

This guide explains how to customize and configure the Solana wallet integration.

## Network Configuration

### Changing the RPC Endpoint

Edit `services/solanaService.ts`:

```typescript
// Mainnet (Production)
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';

// Devnet (Development)
const SOLANA_RPC_URL = 'https://api.devnet.solana.com';

// Testnet
const SOLANA_RPC_URL = 'https://api.testnet.solana.com';

// Custom RPC (e.g., QuickNode, Helius)
const SOLANA_RPC_URL = 'https://your-custom-rpc-endpoint.com';
```

### Using a Private RPC Endpoint

For production, use a private RPC endpoint for better reliability:

```typescript
const SOLANA_RPC_URL = process.env.REACT_APP_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
```

Then set in `.env`:
```
REACT_APP_SOLANA_RPC_URL=https://your-private-endpoint.com
```

## Wallet Provider Configuration

### Adding a New Wallet Provider

Edit `components/WalletConnector.tsx`:

```typescript
import { YourWalletAdapter } from '@solana/wallet-adapter-wallets';

const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    // ... existing wallets
    new YourWalletAdapter(), // Add new wallet
  ],
  []
);
```

### Removing a Wallet Provider

Simply remove the adapter from the `wallets` array:

```typescript
const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    // Remove: new TorusWalletAdapter(),
  ],
  []
);
```

### Reordering Wallet Providers

Change the order in the `wallets` array to change display order in the modal:

```typescript
const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),      // First
    new LedgerWalletAdapter(),       // Second
    new SolflareWalletAdapter(),     // Third
    // ... rest
  ],
  []
);
```

## Tip Configuration

### Setting Default Tip Amount

Edit `components/AudiusPlayer.tsx`:

```typescript
const [tipAmount, setTipAmount] = useState('0.1'); // Change default here
```

### Setting Minimum/Maximum Tip Amounts

Add validation in the `handleTip` function:

```typescript
const MIN_TIP = 0.01;
const MAX_TIP = 100;

const amount = parseFloat(tipAmount);
if (amount < MIN_TIP) {
  setError(`Minimum tip is ${MIN_TIP} SOL`);
  return;
}
if (amount > MAX_TIP) {
  setError(`Maximum tip is ${MAX_TIP} SOL`);
  return;
}
```

### Adding Preset Tip Amounts

Modify the tip input UI in `components/AudiusPlayer.tsx`:

```typescript
const presetAmounts = [0.1, 0.5, 1.0, 5.0];

// In JSX:
<div className="flex gap-2 mb-2">
  {presetAmounts.map(amount => (
    <button
      key={amount}
      onClick={() => setTipAmount(amount.toString())}
      className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded"
    >
      {amount} SOL
    </button>
  ))}
</div>
```

## UI Customization

### Changing Wallet Button Colors

Edit `components/WalletButton.tsx`:

```typescript
// Connected state
className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white"

// Disconnected state
className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
```

### Customizing Wallet Modal

The wallet modal styling comes from `@solana/wallet-adapter-react-ui`. To customize:

1. Override CSS in your global styles:

```css
/* Override wallet modal styles */
.wallet-adapter-modal {
  background-color: rgba(0, 0, 0, 0.9);
  border-color: rgba(168, 85, 247, 0.5);
}

.wallet-adapter-modal-title {
  color: #fff;
}

.wallet-adapter-button {
  background-color: rgba(168, 85, 247, 0.2);
  border-color: rgba(168, 85, 247, 0.5);
}
```

2. Or modify the import in `WalletConnector.tsx`:

```typescript
// The CSS import can be customized or replaced
require('@solana/wallet-adapter-react-ui/styles.css');
```

## Transaction Configuration

### Changing Transaction Confirmation Level

Edit `services/solanaService.ts`:

```typescript
// Current: 'confirmed'
await connection.confirmTransaction(signature, 'confirmed');

// Options:
// 'processed' - Fastest, least reliable
// 'confirmed' - Balanced (default)
// 'finalized' - Slowest, most reliable
```

### Adding Transaction Timeout

```typescript
const TRANSACTION_TIMEOUT = 30000; // 30 seconds

const confirmPromise = connection.confirmTransaction(signature, 'confirmed');
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Transaction timeout')), TRANSACTION_TIMEOUT)
);

await Promise.race([confirmPromise, timeoutPromise]);
```

### Custom Transaction Fees

```typescript
// Set custom fee payer
transaction.feePayer = wallet.publicKey;

// Or use a different fee payer
transaction.feePayer = new PublicKey('fee-payer-address');
```

## Error Handling Customization

### Custom Error Messages

Edit `services/solanaService.ts`:

```typescript
const ERROR_MESSAGES: Record<string, string> = {
  'insufficient_funds': 'You don\'t have enough SOL to send this tip.',
  'invalid_address': 'The artist\'s wallet address is invalid.',
  'network_error': 'Network error. Please check your connection.',
};

// Use in error handling:
const errorKey = error.message.toLowerCase();
const message = ERROR_MESSAGES[errorKey] || error.message;
```

### Retry Logic

Add automatic retry for failed transactions:

```typescript
const MAX_RETRIES = 3;
let retries = 0;

while (retries < MAX_RETRIES) {
  try {
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    await connection.confirmTransaction(signature, 'confirmed');
    return { signature, amount, recipient, timestamp: Date.now() };
  } catch (error) {
    retries++;
    if (retries >= MAX_RETRIES) throw error;
    await new Promise(resolve => setTimeout(resolve, 1000 * retries));
  }
}
```

## Security Configuration

### Rate Limiting

Add rate limiting to prevent spam:

```typescript
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_TIPS_PER_WINDOW = 10;

let tipCount = 0;
let windowStart = Date.now();

export const checkRateLimit = (): boolean => {
  const now = Date.now();
  if (now - windowStart > RATE_LIMIT_WINDOW) {
    tipCount = 0;
    windowStart = now;
  }
  
  if (tipCount >= MAX_TIPS_PER_WINDOW) {
    return false;
  }
  
  tipCount++;
  return true;
};
```

### Address Whitelist

Restrict tipping to approved artists:

```typescript
const APPROVED_ARTISTS = [
  'artist1_wallet_address',
  'artist2_wallet_address',
];

export const isApprovedArtist = (address: string): boolean => {
  return APPROVED_ARTISTS.includes(address);
};
```

## Analytics Integration

### Track Tip Events

Add analytics to `services/solanaService.ts`:

```typescript
export const sendTip = async (
  wallet: WalletContextState,
  recipientAddress: string,
  amountInSol: number
): Promise<TipTransaction> => {
  // ... existing code ...
  
  try {
    // ... transaction logic ...
    
    // Track successful tip
    if (window.gtag) {
      window.gtag('event', 'tip_sent', {
        amount: amountInSol,
        recipient: recipientAddress,
        signature: signature,
      });
    }
    
    return { signature, amount: amountInSol, recipient: recipientAddress, timestamp: Date.now() };
  } catch (error) {
    // Track failed tip
    if (window.gtag) {
      window.gtag('event', 'tip_failed', {
        amount: amountInSol,
        error: error.message,
      });
    }
    throw error;
  }
};
```

## Environment-Specific Configuration

Create different configurations for dev/staging/production:

```typescript
// services/config.ts
const CONFIG = {
  development: {
    rpcUrl: 'https://api.devnet.solana.com',
    network: 'devnet',
    maxTip: 10,
  },
  staging: {
    rpcUrl: 'https://api.testnet.solana.com',
    network: 'testnet',
    maxTip: 50,
  },
  production: {
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    network: 'mainnet',
    maxTip: 1000,
  },
};

export const getConfig = () => CONFIG[process.env.NODE_ENV];
```

## Testing Configuration

### Mock Wallet for Testing

```typescript
// For unit tests
export const mockWallet = {
  publicKey: new PublicKey('11111111111111111111111111111111'),
  signTransaction: jest.fn(),
  connected: true,
};
```

### Devnet Testing Setup

```typescript
// Use devnet for testing
const SOLANA_RPC_URL = process.env.NODE_ENV === 'test' 
  ? 'https://api.devnet.solana.com'
  : 'https://api.mainnet-beta.solana.com';
```

## Performance Optimization

### Connection Pooling

```typescript
// Reuse connection instance
export const connection = new Connection(SOLANA_RPC_URL, {
  commitment: 'confirmed',
  wsEndpoint: 'wss://api.mainnet-beta.solana.com',
});
```

### Caching Balance

```typescript
const balanceCache = new Map<string, { balance: number; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

export const getWalletBalance = async (publicKey: PublicKey): Promise<number> => {
  const cached = balanceCache.get(publicKey.toString());
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.balance;
  }
  
  const balance = await connection.getBalance(publicKey);
  balanceCache.set(publicKey.toString(), { balance, timestamp: Date.now() });
  return balance / LAMPORTS_PER_SOL;
};
```

## Deployment Checklist

- [ ] Update RPC endpoint for production
- [ ] Configure rate limiting
- [ ] Set up error tracking
- [ ] Enable analytics
- [ ] Test all wallet providers
- [ ] Verify HTTPS is enabled
- [ ] Set up monitoring
- [ ] Configure backup RPC endpoints
- [ ] Test transaction confirmation
- [ ] Document custom configurations
