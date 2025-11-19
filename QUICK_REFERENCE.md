# Solana Wallet Integration - Quick Reference

## Installation

```bash
npm install
npm run dev
```

## File Locations

| File | Purpose |
|------|---------|
| `services/solanaService.ts` | Core Solana blockchain logic |
| `components/WalletConnector.tsx` | Wallet provider setup |
| `components/WalletButton.tsx` | Reusable wallet button |
| `components/AudiusPlayer.tsx` | Updated with wallet integration |
| `App.tsx` | Wraps app with WalletConnector |

## Supported Wallets

1. Phantom
2. Solflare
3. Torus
4. Ledger
5. Slope
6. Coinbase Wallet
7. Math Wallet
8. OKX Wallet

## Key Functions

### sendTip()
```typescript
const result = await sendTip(wallet, recipientAddress, amountInSol);
// Returns: { signature, amount, recipient, timestamp }
```

### getWalletBalance()
```typescript
const balance = await getWalletBalance(publicKey);
// Returns: balance in SOL
```

### isValidSolanaAddress()
```typescript
const valid = isValidSolanaAddress(address);
// Returns: boolean
```

## Configuration

### Change Network
Edit `services/solanaService.ts`:
```typescript
// Mainnet (default)
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';

// Devnet
const SOLANA_RPC_URL = 'https://api.devnet.solana.com';
```

### Add/Remove Wallets
Edit `components/WalletConnector.tsx`:
```typescript
const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    // Add or remove here
  ],
  []
);
```

### Change Default Tip Amount
Edit `components/AudiusPlayer.tsx`:
```typescript
const [tipAmount, setTipAmount] = useState('0.1'); // Change here
```

## Common Tasks

### Use WalletButton in a Component
```typescript
import WalletButton from './components/WalletButton';

export const MyComponent = () => {
  return <WalletButton />;
};
```

### Access Wallet in a Component
```typescript
import { useWallet } from '@solana/wallet-adapter-react';

export const MyComponent = () => {
  const wallet = useWallet();
  
  if (wallet.connected) {
    console.log('Connected:', wallet.publicKey.toString());
  }
};
```

### Send a Tip Programmatically
```typescript
import { sendTip } from './services/solanaService';
import { useWallet } from '@solana/wallet-adapter-react';

export const MyComponent = () => {
  const wallet = useWallet();
  
  const handleTip = async () => {
    try {
      const result = await sendTip(
        wallet,
        'artist_wallet_address',
        0.5 // 0.5 SOL
      );
      console.log('Tip sent:', result.signature);
    } catch (error) {
      console.error('Tip failed:', error);
    }
  };
  
  return <button onClick={handleTip}>Send Tip</button>;
};
```

### Check Wallet Balance
```typescript
import { getWalletBalance } from './services/solanaService';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

export const BalanceDisplay = () => {
  const wallet = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  
  useEffect(() => {
    if (wallet.publicKey) {
      getWalletBalance(wallet.publicKey).then(setBalance);
    }
  }, [wallet.publicKey]);
  
  return <div>Balance: {balance?.toFixed(4)} SOL</div>;
};
```

## Error Handling

```typescript
try {
  await sendTip(wallet, address, amount);
} catch (error) {
  if (error.message.includes('Invalid')) {
    // Handle invalid address/amount
  } else if (error.message.includes('insufficient')) {
    // Handle insufficient balance
  } else {
    // Handle other errors
  }
}
```

## Testing Checklist

- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Install wallet extension (Phantom recommended)
- [ ] Create/import wallet
- [ ] Connect wallet to app
- [ ] View balance
- [ ] Send test tip
- [ ] Verify transaction signature
- [ ] Disconnect wallet

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Wallet not connecting | Ensure extension installed, refresh page |
| Transaction fails | Check balance, verify address, check network |
| Balance not showing | Wait for load, check RPC endpoint |
| TypeScript errors | Run `npm install`, restart IDE |
| Dependencies missing | Run `npm cache clean --force && npm install` |

## Documentation Files

| File | Content |
|------|---------|
| `SOLANA_WALLET_INTEGRATION.md` | Complete integration guide |
| `SETUP_INSTRUCTIONS.md` | Installation & setup |
| `WALLET_CONFIGURATION.md` | Configuration options |
| `IMPLEMENTATION_SUMMARY.md` | What was implemented |
| `QUICK_REFERENCE.md` | This file |

## Network URLs

| Network | URL |
|---------|-----|
| Mainnet | https://api.mainnet-beta.solana.com |
| Devnet | https://api.devnet.solana.com |
| Testnet | https://api.testnet.solana.com |

## Useful Links

- [Solana Docs](https://docs.solana.com/)
- [Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Phantom Wallet](https://phantom.app/)
- [Solflare Wallet](https://solflare.com/)
- [Solana Faucet](https://faucet.solana.com/) (devnet SOL)

## Environment Variables (Optional)

```bash
# .env
REACT_APP_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
REACT_APP_SOLANA_NETWORK=mainnet
```

## Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Key Concepts

**Wallet Adapter** - Standardized interface for Solana wallets
**RPC Endpoint** - Connection point to Solana blockchain
**Transaction** - Blockchain operation (e.g., sending SOL)
**Signature** - Proof of transaction completion
**Lamports** - Smallest unit of SOL (1 SOL = 1 billion lamports)
**Public Key** - Wallet address
**Private Key** - Secret key (never shared, handled by wallet)

## Performance Tips

- Cache wallet balance for 30 seconds
- Use connection pooling for RPC calls
- Implement rate limiting for tips
- Use 'confirmed' commitment level for balance of speed/reliability

## Security Reminders

✅ Never ask for private keys
✅ Always validate addresses
✅ Always validate amounts
✅ Use HTTPS in production
✅ Never log sensitive data
✅ Keep dependencies updated

## Support

For issues:
1. Check browser console for errors
2. Review documentation files
3. Check wallet extension logs
4. Verify network connectivity
5. Try with different wallet provider
