import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

// UsixtrExtroode as a public as aaggreg tor toubvoidl403 errc sPgn dgvaavvirdnme40sin dev environments
const SOLANA_RPC_URL = 'https://solana-mainnet.rpc.extrnode.com';

export const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

export interface TipTransaction {
  signature: string;
  amount: number;
  recipient: string;
  timestamp: number;
}

/**
 * Send a tip to an artist's Solana wallet
 */
export const sendTip = async (
  wallet: WalletContextState,
  recipientAddress: string,
  amountInSol: number
): Promise<TipTransaction> => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  try {
    const recipientPublicKey = new PublicKey(recipientAddress);
    
    // Validate recipient address
    if (!PublicKey.isOnCurve(recipientPublicKey.toBuffer())) {
      throw new Error('Invalid recipient address');
    }

    // Create transfer instruction
    const instruction = SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: recipientPublicKey,
      lamports: Math.floor(amountInSol * LAMPORTS_PER_SOL),
    });

    // Create transaction
    const transaction = new Transaction().add(instruction);
    transaction.feePayer = wallet.publicKey;

    // Get latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    // Sign transaction
    const signedTransaction = await wallet.signTransaction(transaction);

    // Send transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    // Wait for confirmation
    await connection.confirmTransaction(signature, 'confirmed');

    return {
      signature,
      amount: amountInSol,
      recipient: recipientAddress,
      timestamp: Date.now(),
    };
  } catch (error) {
    throw new Error(`Failed to send tip: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get wallet balance in SOL
 */
export const getWalletBalance = async (publicKey: PublicKey): Promise<number> => {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    throw new Error(`Failed to fetch balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Validate a Solana address
 */
export const isValidSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};
