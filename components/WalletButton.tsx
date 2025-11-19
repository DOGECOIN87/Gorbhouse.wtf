import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { getWalletBalance } from '../services/solanaService';
import Spinner from './Spinner';

interface Props {
  onConnected?: () => void;
  onDisconnected?: () => void;
}

const WalletButton: React.FC<Props> = ({ onConnected, onDisconnected }) => {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      setLoading(true);
      getWalletBalance(publicKey)
        .then(setBalance)
        .catch(err => console.error('Failed to fetch balance:', err))
        .finally(() => setLoading(false));
      
      onConnected?.();
    } else {
      setBalance(null);
      onDisconnected?.();
    }
  }, [connected, publicKey, onConnected, onDisconnected]);

  const handleDisconnect = async () => {
    await disconnect();
  };

  if (connected && publicKey) {
    const displayAddress = `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`;
    
    return (
      <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold">
        <div className="flex flex-col gap-1">
          <span>{displayAddress}</span>
          {loading ? (
            <span className="text-xs text-purple-200 flex items-center gap-1">
              <Spinner /> Loading balance...
            </span>
          ) : balance !== null ? (
            <span className="text-xs text-purple-200">{balance.toFixed(4)} SOL</span>
          ) : null}
        </div>
        <button
          onClick={handleDisconnect}
          className="ml-2 px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors text-xs"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition-all duration-200 text-sm"
    >
      Connect Wallet
    </button>
  );
};

export default WalletButton;
