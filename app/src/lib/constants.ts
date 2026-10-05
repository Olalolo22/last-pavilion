import { PublicKey } from '@solana/web3.js';

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || '38iyWaZXa4nAZZxGYEGA6GqXhWE5g1dPt9ht9iFcxo63'
);

export const TEE_VALIDATOR = new PublicKey(
  'MTEWGuqxUpYZGFJQcp8tLN7x5v9BSeoFHYWQQ3n3xzo'
);

export const ER_RPC =
  process.env.NEXT_PUBLIC_ER_RPC || 'https://devnet-tee.magicblock.app';

export const SOLANA_RPC =
  process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';

// Spec Parameters
export const METER_CAPACITY = 1000;
export const STARTING_DRAIN_RATE = 6; // -6/sec
export const ACCELERATION_PER_DEATH = 4; // +4/sec per death
export const SUPPORT_COST = 10; // 10 Influence
export const SUPPORT_GAIN = 50; // +50 units
export const STARTING_INFLUENCE = 100;
export const DEATH_REFUND_POOL = 30;
export const COOLDOWN_MS = 1000; // 1-second cooldown
