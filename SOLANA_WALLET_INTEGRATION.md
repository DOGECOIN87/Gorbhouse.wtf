# Solana Wallet Integration Guide

This document describes the Solana wallet integration for tipping musicians in the Gorbhouse application.

## Overview

Users can now connect their Solana wallets to tip musicians directly through the Audius player embed. The integration supports all major Solana wallet providers.

## Supported Wallet Providers

The following wallet providers are supported:

1. **Phantom** - Most popular Solana wallet
2. **Solflare** - Web and mobile wallet
3. **Torus** - Social login wallet
4. **Ledger** - Hardware wallet support
5. **Slope** - Mobile-first wallet
6. **Coinbase Wallet** - Coinbase's wallet solution
7. **Math Wallet** - Multi-chain wallet
8. **OKX Wallet** - OKX exchange wallet

## Architecture

### Components

#### `WalletConnector.tsx`
- Wraps the application with Solana wallet adapter providers
- Configures all supported wallet adapters
- Provides wallet context to child components
- Includes wallet modal UI styling

#### `WalletButton.tsx`
- Displays wallet connection status
- Shows connected wallet address and SOL balance
- Provides disconnect functionality
- Can be used independently in any component

#### `AudiusPlayer.tsx` (Updated)
- Integrated with Solana wallet context
- Handles tip transactions
- Validates artist wallet addresses
- Displays transaction signatures on success

### Services

#### `services/solanaService.ts`
Provides core Solana functionality:

- **`sendTip(wallet, recipientAddress, amountInSol)`**
  - Sends SOL to artist's wallet
  - Validates addresses and amounts
  - Returns transaction signature and details
  - Throws errors with descriptive messages

- **`getWalletBalance(publicKey)`**
  - Fetches wallet balance in SOL
  - Used to display user's available balance

- **`isValidSolanaAddress(address)`**
  - Validates Solana wallet addresses
  - Returns boolean

- **`connection`**
  - Solana RPC connection to mainnet
  - Used for all blockchain interactions

## Usage

### Basic Setup

1. Install dependencies:
```bash
npm install
```

2. The app automatically wraps the MainSite with WalletConnector when users enter the site.

### Connecting a Wallet

Users can connect their wallet by:
1. Clicking "Connect Wallet to Tip" button in the Audius player
2. Selecting their preferred wallet provider from the modal
3. Approving the connection in their wallet

### Sending a Tip

1. User enters tip amount in SOL
2. Clicks "Tip X SOL" button
3. Wallet prompts for transaction approval
4. Transaction is sent to the blockchain
5. Success message displays with transaction signature

### Wallet Requirements

For artists to receive tips:
- Must have a Solana wallet address linked to their Audius profile
- Address is stored in the `spl_wallet` field of the AudiusUser object

## Error Handling

The integration includes comprehensive error handling:

- **Invalid wallet address**: Validates recipient address format
- **Insufficient balance**: User's wallet will reject transaction
- **Network errors**: Displays user-friendly error messages
- **Transaction failures**: Shows error details for debugging

## Configuration

### RPC Endpoint

Currently configured to use Solana mainnet:
```
https://api.mainnet-beta.solana.com
```

To change to devnet or testnet, update `SOLANA_RPC_URL` in `services/solanaService.ts`:

```typescript
// For devnet
const SOLANA_RPC_URL = 'https://api.devnet.solana.com';

// For testnet
const SOLANA_RPC_URL = 'https://api.testnet.solana.com';
```

### Wallet Adapters

To add or remove wallet providers, modify `components/WalletConnector.tsx`:

```typescript
const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    // Add or remove adapters here
  ],
  []
);
```

## Transaction Flow

```
User clicks "Tip" button
    ↓
Check wallet connection
    ↓
Validate artist wallet address
    ↓
Validate tip amount
    ↓
Create transfer instruction
    ↓
Get latest blockhash
    ↓
Sign transaction with wallet
    ↓
Send transaction to blockchain
    ↓
Wait for confirmation
    ↓
Display success with tx signature
```

## Security Considerations

1. **No Private Keys**: The app never handles private keys - all signing is done by the wallet
2. **Address Validation**: All Solana addresses are validated before use
3. **Amount Validation**: Tip amounts are validated to prevent errors
4. **Mainnet Only**: Currently configured for mainnet (production)
5. **HTTPS Only**: Wallet connections require HTTPS in production

## Testing

### Local Development

For testing with devnet:

1. Update `SOLANA_RPC_URL` to devnet endpoint
2. Use devnet SOL from the faucet
3. Ensure artist has devnet wallet address

### Wallet Testing

Each wallet provider has different testing requirements:
- **Phantom**: Supports devnet/testnet switching
- **Solflare**: Supports network selection
- **Ledger**: Requires hardware device or Ledger Live simulator

## Troubleshooting

### Wallet Not Connecting
- Ensure wallet extension is installed and enabled
- Check browser console for errors
- Try refreshing the page

### Transaction Fails
- Verify sufficient SOL balance
- Check artist wallet address is valid
- Ensure network is correct (mainnet)

### Balance Not Showing
- Wait a moment for balance to load
- Check wallet has SOL
- Verify RPC endpoint is responsive

## Future Enhancements

Potential improvements:
- Support for SPL tokens (USDC, etc.)
- Batch tipping to multiple artists
- Tip history and analytics
- Custom tip presets
- Tip notifications for artists
- Integration with Audius payment system

## Dependencies

```json
{
  "@solana/web3.js": "^1.95.0",
  "@solana/wallet-adapter-base": "^0.9.23",
  "@solana/wallet-adapter-react": "^0.15.35",
  "@solana/wallet-adapter-react-ui": "^0.9.42",
  "@solana/wallet-adapter-wallets": "^0.19.32"
}
```

## Resources

- [Solana Documentation](https://docs.solana.com/)
- [Wallet Adapter Documentation](https://github.com/solana-labs/wallet-adapter)
- [Phantom Wallet](https://phantom.app/)
- [Solflare Wallet](https://solflare.com/)
