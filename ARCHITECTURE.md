# Solana Wallet Integration - Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                              │
│                   (Entry Point)                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  WalletConnector                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ConnectionProvider (RPC Connection)                 │  │
│  │  WalletProvider (Wallet Adapters)                    │  │
│  │  WalletModalProvider (UI Modal)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    MainSite                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Meme Ranker                                         │  │
│  │  Leaderboard                                         │  │
│  │  Hall of Fame                                        │  │
│  │  Music Player Button                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  AudiusPlayer Modal                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Track Display                                       │  │
│  │  Audio Controls                                      │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Tip Section                                   │  │  │
│  │  │  ┌──────────────────────────────────────────┐  │  │  │
│  │  │  │  WalletButton / Connect Wallet           │  │  │  │
│  │  │  │  Tip Amount Input                        │  │  │  │
│  │  │  │  Send Tip Button                         │  │  │  │
│  │  │  │  Transaction Status                      │  │  │  │
│  │  │  └──────────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── WalletConnector
│   ├── ConnectionProvider
│   ├── WalletProvider
│   │   ├── PhantomWalletAdapter
│   │   ├── SolflareWalletAdapter
│   │   ├── TorusWalletAdapter
│   │   ├── LedgerWalletAdapter
│   │   ├── SlopeWalletAdapter
│   │   ├── CoinbaseWalletAdapter
│   │   ├── MathWalletAdapter
│   │   └── OKXWalletAdapter
│   ├── WalletModalProvider
│   └── MainSite
│       ├── MemeCard
│       ├── Leaderboard
│       ├── HallOfFame
│       └── AudiusPlayer
│           ├── WalletButton (optional)
│           └── Tip Section
```

## Data Flow - Wallet Connection

```
User clicks "Connect Wallet"
        │
        ▼
WalletButton opens modal
        │
        ▼
User selects wallet provider
        │
        ▼
Wallet extension opens
        │
        ▼
User approves connection
        │
        ▼
Wallet signs connection message
        │
        ▼
WalletProvider updates context
        │
        ▼
useWallet() hook returns connected state
        │
        ▼
UI updates to show connected address & balance
```

## Data Flow - Sending a Tip

```
User enters tip amount
        │
        ▼
User clicks "Tip X SOL"
        │
        ▼
handleTip() validates:
├── Wallet connected?
├── Artist wallet valid?
├── Amount valid?
└── Sufficient balance?
        │
        ▼
sendTip() creates transaction:
├── Create transfer instruction
├── Get latest blockhash
├── Add to transaction
└── Set fee payer
        │
        ▼
wallet.signTransaction() called
        │
        ▼
Wallet extension prompts user
        │
        ▼
User approves transaction
        │
        ▼
Wallet signs transaction
        │
        ▼
connection.sendRawTransaction()
        │
        ▼
Transaction sent to blockchain
        │
        ▼
connection.confirmTransaction()
        │
        ▼
Wait for confirmation
        │
        ▼
Display success with signature
```

## Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   solanaService.ts                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Connection Management                              │   │
│  │  ├── connection (RPC connection)                    │   │
│  │  └── SOLANA_RPC_URL                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Transaction Functions                              │   │
│  │  ├── sendTip()                                      │   │
│  │  │   ├── Validate wallet connection                │   │
│  │  │   ├── Validate recipient address                │   │
│  │  │   ├── Create transfer instruction               │   │
│  │  │   ├── Get blockhash                             │   │
│  │  │   ├── Sign transaction                          │   │
│  │  │   ├── Send transaction                          │   │
│  │  │   └── Confirm transaction                       │   │
│  │  └── getWalletBalance()                            │   │
│  │      ├── Fetch balance from blockchain             │   │
│  │      └── Convert lamports to SOL                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Validation Functions                               │   │
│  │  └── isValidSolanaAddress()                         │   │
│  │      └── Validate address format                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│              Wallet Context (from adapter)                  │
├─────────────────────────────────────────────────────────────┤
│  ├── connected: boolean                                     │
│  ├── publicKey: PublicKey | null                            │
│  ├── wallet: Wallet | null                                  │
│  ├── signTransaction: (tx) => Promise<Transaction>          │
│  ├── connect: () => Promise<void>                           │
│  └── disconnect: () => Promise<void>                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│           AudiusPlayer Component State                      │
├─────────────────────────────────────────────────────────────┤
│  ├── host: string | null                                    │
│  ├── user: AudiusUser | null                                │
│  ├── tracks: AudiusTrack[]                                  │
│  ├── currentIndex: number                                   │
│  ├── loading: boolean                                       │
│  ├── error: string | null                                   │
│  ├── tipping: boolean                                       │
│  ├── tipAmount: string                                      │
│  └── txSig: string | null                                   │
└─────────────────────────────────────────────────────────────┘
```

## Transaction Structure

```
Transaction
├── Instructions
│   └── SystemProgram.transfer()
│       ├── fromPubkey: wallet.publicKey
│       ├── toPubkey: artist wallet
│       └── lamports: amount * LAMPORTS_PER_SOL
├── feePayer: wallet.publicKey
├── recentBlockhash: latest blockhash
└── signatures: [signed by wallet]
```

## Error Handling Flow

```
User Action
    │
    ▼
Try Block
    │
    ├─ Validation Errors
    │  ├── Wallet not connected
    │  ├── Invalid address
    │  └── Invalid amount
    │
    ├─ Transaction Errors
    │  ├── Insufficient balance
    │  ├── Network error
    │  └── Signature error
    │
    └─ Confirmation Errors
       └── Transaction timeout
    │
    ▼
Catch Block
    │
    ▼
Set Error State
    │
    ▼
Display Error Message
```

## Wallet Provider Integration

```
┌─────────────────────────────────────────────────────────────┐
│                  WalletConnector                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Wallet Adapters:                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PhantomWalletAdapter                              │   │
│  │  ├── Detects Phantom extension                     │   │
│  │  ├── Handles connection                            │   │
│  │  └── Signs transactions                            │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SolflareWalletAdapter                             │   │
│  │  ├── Detects Solflare extension                    │   │
│  │  ├── Handles connection                            │   │
│  │  └── Signs transactions                            │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Other Wallet Adapters...]                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Modal Provider:                                            │
│  ├── Displays available wallets                            │
│  ├── Handles wallet selection                              │
│  └── Manages connection flow                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Blockchain Interaction

```
┌─────────────────────────────────────────────────────────────┐
│                    Solana Blockchain                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  RPC Endpoint (Connection)                                  │
│  ├── getLatestBlockhash()                                   │
│  ├── sendRawTransaction()                                   │
│  ├── confirmTransaction()                                   │
│  └── getBalance()                                           │
│                                                             │
│  Validators                                                 │
│  ├── Process transactions                                   │
│  ├── Confirm blocks                                         │
│  └── Maintain ledger                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## File Dependencies

```
App.tsx
├── WalletConnector.tsx
│   ├── @solana/wallet-adapter-react
│   ├── @solana/wallet-adapter-base
│   ├── @solana/wallet-adapter-wallets
│   └── @solana/wallet-adapter-react-ui
│
├── MainSite.tsx
│   └── AudiusPlayer.tsx
│       ├── WalletButton.tsx
│       │   ├── @solana/wallet-adapter-react
│       │   ├── @solana/wallet-adapter-react-ui
│       │   └── services/solanaService.ts
│       │
│       ├── @solana/wallet-adapter-react
│       ├── @solana/wallet-adapter-react-ui
│       ├── services/audius.ts
│       ├── services/solanaService.ts
│       └── types.ts
│
└── services/solanaService.ts
    ├── @solana/web3.js
    └── @solana/wallet-adapter-react
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Environment                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Frontend (React App)                               │   │
│  │  ├── HTTPS Required                                 │   │
│  │  ├── Wallet Adapter UI                              │   │
│  │  └── Audius Player                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                   │
│                         ▼                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Solana RPC Endpoint                                │   │
│  │  ├── Mainnet (Production)                           │   │
│  │  ├── Private RPC (Recommended)                      │   │
│  │  └── Backup RPC (Optional)                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                   │
│                         ▼                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Solana Blockchain                                  │   │
│  │  ├── Validators                                     │   │
│  │  ├── Ledger                                         │   │
│  │  └── Transaction Pool                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  User Wallets (External)                            │   │
│  │  ├── Phantom                                        │   │
│  │  ├── Solflare                                       │   │
│  │  └── [Other Wallets]                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: HTTPS                                             │
│  └── Encrypts all communication                             │
│                                                             │
│  Layer 2: Wallet Signing                                    │
│  └── Private keys never leave wallet                        │
│                                                             │
│  Layer 3: Address Validation                                │
│  └── Validates all Solana addresses                         │
│                                                             │
│  Layer 4: Amount Validation                                 │
│  └── Prevents invalid transactions                          │
│                                                             │
│  Layer 5: Transaction Confirmation                          │
│  └── Verifies blockchain confirmation                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                  Optimization Strategies                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Connection Pooling                                         │
│  └── Reuse RPC connection                                   │
│                                                             │
│  Balance Caching                                            │
│  └── Cache for 30 seconds                                   │
│                                                             │
│  Lazy Loading                                               │
│  └── Load wallet adapters on demand                         │
│                                                             │
│  Rate Limiting                                              │
│  └── Prevent spam transactions                              │
│                                                             │
│  Error Recovery                                             │
│  └── Retry failed transactions                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
