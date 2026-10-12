import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROGRAM_ID = new PublicKey(
  process.env.PROGRAM_ID || '38iyWaZXa4nAZZxGYEGA6GqXhWE5g1dPt9ht9iFcxo63'
);
const SOLANA_RPC = process.env.SOLANA_RPC || 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_RPC, 'confirmed');

function loadWallet() {
  const keyPath =
    process.env.WALLET_PATH ||
    path.join(process.env.HOME || '/home/lala_02', '.config/solana/id.json');
  const secretKey = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  return Keypair.fromSecretKey(Uint8Array.from(secretKey));
}

function toLeBytes64(num) {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(BigInt(num));
  return buf;
}

const IX_DISCRIMINATORS = {
  initialize_round: Buffer.from([43, 135, 19, 93, 14, 225, 131, 188]),
  delegate_round: Buffer.from([4, 60, 37, 224, 19, 130, 106, 111]),
  join_round: Buffer.from([191, 222, 86, 25, 234, 174, 157, 249]),
  support_nation: Buffer.from([219, 181, 95, 26, 94, 160, 159, 93]),
  drain_tick: Buffer.from([248, 126, 178, 211, 69, 184, 35, 229]),
  claim_death_refund: Buffer.from([81, 92, 130, 250, 18, 249, 171, 205]),
  settle_round: Buffer.from([40, 101, 18, 1, 31, 129, 52, 77]),
};

export function getRoundPda(roundId) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('round'), toLeBytes64(roundId)],
    PROGRAM_ID
  );
}

export function getPlayerPda(roundId, player) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('player'), toLeBytes64(roundId), player.toBuffer()],
    PROGRAM_ID
  );
}

export function getSettlementPda(roundId) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('settlement'), toLeBytes64(roundId)],
    PROGRAM_ID
  );
}

export async function initRound(roundId = 42) {
  const payer = loadWallet();
  const [roundPda] = getRoundPda(roundId);
  console.log(`Payer: ${payer.publicKey.toBase58()}`);
  console.log(`Round PDA: ${roundPda.toBase58()} (Round ${roundId})`);

  const accountInfo = await connection.getAccountInfo(roundPda);
  if (accountInfo) {
    console.log(`Round ${roundId} is already initialized on-chain!`);
    return;
  }

  const ix = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: payer.publicKey, isSigner: true, isWritable: true },
      { pubkey: roundPda, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: Buffer.concat([
      IX_DISCRIMINATORS.initialize_round,
      toLeBytes64(roundId),
    ]),
  });

  const tx = new Transaction().add(ix);
  const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
  console.log(`Initialized Round ${roundId}! Tx: https://explorer.solana.com/tx/${sig}?cluster=devnet`);
}

export async function joinRound(roundId = 42) {
  const payer = loadWallet();
  const [roundPda] = getRoundPda(roundId);
  const [playerPda] = getPlayerPda(roundId, payer.publicKey);

  const accountInfo = await connection.getAccountInfo(playerPda);
  if (accountInfo) {
    console.log(`Player ${payer.publicKey.toBase58()} already joined round ${roundId}!`);
    return;
  }

  const ix = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: payer.publicKey, isSigner: true, isWritable: true },
      { pubkey: roundPda, isSigner: false, isWritable: true },
      { pubkey: playerPda, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: Buffer.concat([
      IX_DISCRIMINATORS.join_round,
      toLeBytes64(roundId),
    ]),
  });

  const tx = new Transaction().add(ix);
  const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
  console.log(`Joined Round ${roundId}! Tx: https://explorer.solana.com/tx/${sig}?cluster=devnet`);
}

export async function supportNation(nationId = 0, roundId = 42) {
  const payer = loadWallet();
  const [roundPda] = getRoundPda(roundId);
  const [playerPda] = getPlayerPda(roundId, payer.publicKey);

  const nationBuf = Buffer.alloc(1);
  nationBuf.writeUInt8(nationId);

  const ix = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: payer.publicKey, isSigner: true, isWritable: true },
      { pubkey: roundPda, isSigner: false, isWritable: true },
      { pubkey: playerPda, isSigner: false, isWritable: true },
    ],
    data: Buffer.concat([
      IX_DISCRIMINATORS.support_nation,
      toLeBytes64(roundId),
      nationBuf,
    ]),
  });

  const tx = new Transaction().add(ix);
  const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
  console.log(`Supported Nation ${nationId} in Round ${roundId}! Tx: https://explorer.solana.com/tx/${sig}?cluster=devnet`);
}

// CLI entrypoint
const cmd = process.argv[2];
const arg = process.argv[3];

if (cmd === 'init') {
  initRound(arg ? parseInt(arg) : 42);
} else if (cmd === 'join') {
  joinRound(arg ? parseInt(arg) : 42);
} else if (cmd === 'support') {
  supportNation(arg ? parseInt(arg) : 0, process.argv[4] ? parseInt(process.argv[4]) : 42);
} else if (cmd === 'status') {
  const roundId = arg ? parseInt(arg) : 42;
  const [roundPda] = getRoundPda(roundId);
  connection.getAccountInfo(roundPda).then(info => {
    console.log(`Round ${roundId} PDA: ${roundPda.toBase58()}`);
    console.log(`Account exists: ${!!info}, Data length: ${info ? info.data.length : 0}`);
  });
} else {
  console.log('Usage: node scripts/manage_round.mjs [init|join|support|status] [args...]');
}
