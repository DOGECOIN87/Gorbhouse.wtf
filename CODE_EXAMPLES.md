# Solana Wallet Integration - Code Examples

## Basic Usage Examples

### Example 1: Using WalletButton in a Component

```typescript
import React from 'react';
import WalletButton from './components/WalletButton';

export const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>My App</h1>
      <WalletButton />
    </header>
  );
};
```

### Example 2: Accessing Wallet Context

```typescript
import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export const WalletInfo: React.FC = () => {
  const wallet = useWallet();

  if (!wallet.connected) {
    return <p>Wallet not connected</p>;
  }

  return (
    <div>
      <p>Connected: {wallet.publicKey?.toString()}</p>
      <button onClick={() => wallet.disconnect()}>Disconnect</button>
    </div>
  );
};
```

### Example 3: Sending a Tip

```typescript
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { sendTip } from './services/solanaService';

export const TipButton: React.FC<{ artistAddress: string }> = ({ artistAddress }) => {
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTip = async () => {
    if (!wallet.connected) {
      setError('Wallet not connected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await sendTip(wallet, artistAddress, 0.5);
      console.log('Tip sent:', result.signature);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send tip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleTip} disabled={loading}>
        {loading ? 'Sending...' : 'Tip 0.5 SOL'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
```

### Example 4: Displaying Wallet Balance

```typescript
import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getWalletBalance } from './services/solanaService';

export const BalanceDisplay: React.FC = () => {
  const wallet = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!wallet.publicKey) {
      setBalance(null);
      return;
    }

    setLoading(true);
    getWalletBalance(wallet.publicKey)
      .then(setBalance)
      .catch(err => console.error('Failed to fetch balance:', err))
      .finally(() => setLoading(false));
  }, [wallet.publicKey]);

  if (!wallet.connected) {
    return <p>Connect wallet to see balance</p>;
  }

  if (loading) {
    return <p>Loading balance...</p>;
  }

  return <p>Balance: {balance?.toFixed(4)} SOL</p>;
};
```

## Advanced Examples

### Example 5: Custom Tip Component with Presets

```typescript
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { sendTip } from './services/solanaService';

interface TipPreset {
  label: string;
  amount: number;
}

const PRESETS: TipPreset[] = [
  { label: 'Small', amount: 0.1 },
  { label: 'Medium', amount: 0.5 },
  { label: 'Large', amount: 1.0 },
  { label: 'Huge', amount: 5.0 },
];

export const CustomTipComponent: React.FC<{ artistAddress: string }> = ({ artistAddress }) => {
  const wallet = useWallet();
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTip = async (amount: number) => {
    if (!wallet.connected) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await sendTip(wallet, artistAddress, amount);
      setSuccess(`Tip sent! Tx: ${result.signature.slice(0, 8)}...`);
      setCustomAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send tip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tip-component">
      <h3>Support the Artist</h3>
      
      <div className="presets">
        {PRESETS.map(preset => (
          <button
            key={preset.label}
            onClick={() => handleTip(preset.amount)}
            disabled={loading || !wallet.connected}
          >
            {preset.label} ({preset.amount} SOL)
          </button>
        ))}
      </div>

      <div className="custom">
        <input
          type="number"
          value={customAmount}
          onChange={e => setCustomAmount(e.target.value)}
          placeholder="Custom amount in SOL"
          min="0"
          step="0.01"
        />
        <button
          onClick={() => handleTip(parseFloat(customAmount))}
          disabled={loading || !wallet.connected || !customAmount}
        >
          Send Custom Tip
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};
```

### Example 6: Tip History Tracker

```typescript
import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { sendTip, TipTransaction } from './services/solanaService';

export const TipHistoryTracker: React.FC<{ artistAddress: string }> = ({ artistAddress }) => {
  const wallet = useWallet();
  const [history, setHistory] = useState<TipTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTip = useCallback(async (amount: number) => {
    if (!wallet.connected) return;

    setLoading(true);
    try {
      const result = await sendTip(wallet, artistAddress, amount);
      setHistory(prev => [result, ...prev]);
    } catch (err) {
      console.error('Tip failed:', err);
    } finally {
      setLoading(false);
    }
  }, [wallet, artistAddress]);

  return (
    <div>
      <button onClick={() => handleTip(0.5)} disabled={loading}>
        Send 0.5 SOL
      </button>

      <h3>Tip History</h3>
      <ul>
        {history.map(tip => (
          <li key={tip.signature}>
            {tip.amount} SOL - {new Date(tip.timestamp).toLocaleString()}
            <a href={`https://solscan.io/tx/${tip.signature}`} target="_blank" rel="noopener noreferrer">
              View on Solscan
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### Example 7: Wallet Connection Modal

```typescript
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export const WalletModal: React.FC = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDetails, setShowDetails] = useState(false);

  if (!connected) {
    return (
      <button onClick={() => setVisible(true)}>
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="wallet-modal">
      <div className="wallet-info">
        <p>Connected Wallet</p>
        <p className="address">{publicKey?.toString()}</p>
      </div>

      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Hide' : 'Show'} Details
      </button>

      {showDetails && (
        <div className="details">
          <p>Address: {publicKey?.toString()}</p>
          <p>Network: Mainnet</p>
        </div>
      )}

      <button onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  );
};
```

### Example 8: Error Handling with Retry

```typescript
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { sendTip } from './services/solanaService';

const MAX_RETRIES = 3;

export const RobustTipComponent: React.FC<{ artistAddress: string }> = ({ artistAddress }) => {
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleTipWithRetry = async (amount: number, attempt = 1) => {
    if (!wallet.connected) {
      setError('Wallet not connected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await sendTip(wallet, artistAddress, amount);
      setRetryCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      if (attempt < MAX_RETRIES && errorMessage.includes('timeout')) {
        setError(`Retrying... (Attempt ${attempt}/${MAX_RETRIES})`);
        setRetryCount(attempt);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        
        setLoading(false);
        await handleTipWithRetry(amount, attempt + 1);
        return;
      }

      setError(errorMessage);
      setRetryCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={() => handleTipWithRetry(0.5)} 
        disabled={loading}
      >
        {loading ? `Sending... (Attempt ${retryCount})` : 'Send Tip'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
```

### Example 9: Conditional Rendering Based on Wallet State

```typescript
import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export const ConditionalContent: React.FC = () => {
  const { connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  if (connecting) {
    return <p>Connecting wallet...</p>;
  }

  if (!connected) {
    return (
      <div>
        <p>Connect your wallet to tip artists</p>
        <button onClick={() => setVisible(true)}>
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>Wallet connected! You can now send tips.</p>
      {/* Tip component here */}
    </div>
  );
};
```

### Example 10: Multi-Artist Tipping

```typescript
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { sendTip } from './services/solanaService';

interface Artist {
  name: string;
  address: string;
}

export const MultiArtistTipper: React.FC<{ artists: Artist[] }> = ({ artists }) => {
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});

  const handleTipAll = async (amount: number) => {
    if (!wallet.connected) return;

    setLoading(true);
    const newResults: Record<string, string> = {};

    for (const artist of artists) {
      try {
        const result = await sendTip(wallet, artist.address, amount);
        newResults[artist.name] = `Success: ${result.signature.slice(0, 8)}...`;
      } catch (err) {
        newResults[artist.name] = `Failed: ${err instanceof Error ? err.message : 'Unknown error'}`;
      }
    }

    setResults(newResults);
    setLoading(false);
  };

  return (
    <div>
      <h3>Tip Multiple Artists</h3>
      <button 
        onClick={() => handleTipAll(0.1)} 
        disabled={loading || !wallet.connected}
      >
        {loading ? 'Sending...' : 'Tip All Artists 0.1 SOL'}
      </button>

      {Object.entries(results).length > 0 && (
        <div className="results">
          {Object.entries(results).map(([name, result]) => (
            <p key={name}>
              {name}: {result}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Configuration Examples

### Example 11: Custom RPC Configuration

```typescript
// services/solanaService.ts
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Use environment variable or default
const SOLANA_RPC_URL = process.env.REACT_APP_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

export const connection = new Connection(SOLANA_RPC_URL, {
  commitment: 'confirmed',
  wsEndpoint: SOLANA_RPC_URL.replace('https', 'wss'),
});
```

### Example 12: Custom Wallet Configuration

```typescript
// components/WalletConnector.tsx
import { useMemo } from 'react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

export const getWallets = () => {
  return useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      // Add more wallets as needed
    ],
    []
  );
};
```

### Example 13: Environment-Specific Configuration

```typescript
// config.ts
export const getConfig = () => {
  const env = process.env.NODE_ENV;

  const configs = {
    development: {
      rpcUrl: 'https://api.devnet.solana.com',
      network: 'devnet',
    },
    production: {
      rpcUrl: 'https://api.mainnet-beta.solana.com',
      network: 'mainnet',
    },
  };

  return configs[env as keyof typeof configs] || configs.production;
};
```

## Testing Examples

### Example 14: Unit Test for sendTip

```typescript
// services/solanaService.test.ts
import { sendTip } from './solanaService';
import { PublicKey } from '@solana/web3.js';

describe('sendTip', () => {
  it('should send a tip successfully', async () => {
    const mockWallet = {
      publicKey: new PublicKey('11111111111111111111111111111111'),
      signTransaction: jest.fn(),
      connected: true,
    };

    const result = await sendTip(
      mockWallet as any,
      'artist_address',
      0.5
    );

    expect(result.amount).toBe(0.5);
    expect(result.signature).toBeDefined();
  });

  it('should throw error for invalid address', async () => {
    const mockWallet = {
      publicKey: new PublicKey('11111111111111111111111111111111'),
      signTransaction: jest.fn(),
      connected: true,
    };

    await expect(
      sendTip(mockWallet as any, 'invalid_address', 0.5)
    ).rejects.toThrow();
  });
});
```

### Example 15: Component Test

```typescript
// components/WalletButton.test.tsx
import { render, screen } from '@testing-library/react';
import WalletButton from './WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';

jest.mock('@solana/wallet-adapter-react');

describe('WalletButton', () => {
  it('should show connect button when not connected', () => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: false,
      publicKey: null,
    });

    render(<WalletButton />);
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('should show address when connected', () => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
      publicKey: { toString: () => '11111111111111111111111111111111' },
    });

    render(<WalletButton />);
    expect(screen.getByText(/1111.../)).toBeInTheDocument();
  });
});
```

These examples cover common use cases and patterns for integrating Solana wallet functionality into your application.
