import {
  PublicKey,
  TransactionInstruction,
  SystemProgram,
  Connection,
} from '@solana/web3.js';
import { PROGRAM_ID, SOLANA_RPC, ER_RPC } from './constants';
import { Nation, RoundState, PlayerState } from './types';

// Helper to convert uint64 to 8-byte LE buffer
export function toLeBytes64(num: number | bigint): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(BigInt(num));
  return buf;
}

// Discriminators computed via sha256("global:<name>")[0..8]
export const IX_DISCRIMINATORS = {
  initialize_round: Buffer.from([43, 135, 19, 93, 14, 225, 131, 188]),
  delegate_round: Buffer.from([4, 60, 37, 224, 19, 130, 106, 111]),
  join_round: Buffer.from([191, 222, 86, 25, 234, 174, 157, 249]),
  support_nation: Buffer.from([219, 181, 95, 26, 94, 160, 159, 93]),
  drain_tick: Buffer.from([248, 126, 178, 211, 69, 184, 35, 229]),
  claim_death_refund: Buffer.from([81, 92, 130, 250, 18, 249, 171, 205]),
  settle_round: Buffer.from([40, 101, 18, 1, 31, 129, 52, 77]),
};

// PDAs
export function getRoundPda(roundId: number | bigint, programId = PROGRAM_ID): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('round'), toLeBytes64(roundId)],
    programId
  );
}

export function getPlayerPda(
  roundId: number | bigint,
  player: PublicKey,
  programId = PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('player'), toLeBytes64(roundId), player.toBuffer()],
    programId
  );
}

export function getSettlementPda(
  roundId: number | bigint,
  programId = PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('settlement'), toLeBytes64(roundId)],
    programId
  );
}

// Instruction Builders
export function createInitializeRoundInstruction(
  authority: PublicKey,
  roundId: number | bigint,
  programId = PROGRAM_ID
): TransactionInstruction {
  const [roundPda] = getRoundPda(roundId, programId);
  const data = Buffer.concat([
    IX_DISCRIMINATORS.initialize_round,
    toLeBytes64(roundId),
  ]);

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: authority, isSigner: true, isWritable: true },
      { pubkey: roundPda, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data,
  });
}

export function createJoinRoundInstruction(
  player: PublicKey,
  roundId: number | bigint,
  programId = PROGRAM_ID
): TransactionInstruction {
  const [roundPda] = getRoundPda(roundId, programId);
  const [playerPda] = getPlayerPda(roundId, player, programId);
  const data = Buffer.concat([
    IX_DISCRIMINATORS.join_round,
    toLeBytes64(roundId),
  ]);

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: player, isSigner: true, isWritable: true },
      { pubkey: roundPda, isSigner: false, isWritable: true },
      { pubkey: playerPda, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data,
  });
}

export function createSupportNationInstruction(
  player: PublicKey,
  roundId: number | bigint,
  nationId: number,
  programId = PROGRAM_ID
): TransactionInstruction {
  const [roundPda] = getRoundPda(roundId, programId);
  const [playerPda] = getPlayerPda(roundId, player, programId);

  const nationBuf = Buffer.alloc(1);
  nationBuf.writeUInt8(nationId);

  const data = Buffer.concat([
    IX_DISCRIMINATORS.support_nation,
    toLeBytes64(roundId),
    nationBuf,
  ]);

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: player, isSigner: true, isWritable: true },
      { pubkey: roundPda, isSigner: false, isWritable: true },
      { pubkey: playerPda, isSigner: false, isWritable: true },
    ],
    data,
  });
}

export function createDrainTickInstruction(
  roundId: number | bigint,
  programId = PROGRAM_ID
): TransactionInstruction {
  const [roundPda] = getRoundPda(roundId, programId);
  const data = Buffer.concat([
    IX_DISCRIMINATORS.drain_tick,
    toLeBytes64(roundId),
  ]);

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: roundPda, isSigner: false, isWritable: true },
    ],
    data,
  });
}

export function createClaimDeathRefundInstruction(
  player: PublicKey,
  roundId: number | bigint,
  nationId: number,
  programId = PROGRAM_ID
): TransactionInstruction {
  const [roundPda] = getRoundPda(roundId, programId);
  const [playerPda] = getPlayerPda(roundId, player, programId);

  const nationBuf = Buffer.alloc(1);
  nationBuf.writeUInt8(nationId);

  const data = Buffer.concat([
    IX_DISCRIMINATORS.claim_death_refund,
    toLeBytes64(roundId),
    nationBuf,
  ]);

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: player, isSigner: true, isWritable: true },
      { pubkey: roundPda, isSigner: false, isWritable: false },
      { pubkey: playerPda, isSigner: false, isWritable: true },
    ],
    data,
  });
}

// Account Parsers
export function decodeRoundState(buffer: Buffer): Partial<RoundState> | null {
  try {
    if (buffer.length < 200) return null;
    let offset = 8; // skip 8-byte discriminator
    const roundId = Number(buffer.readBigUInt64LE(offset)); offset += 8;
    const statusNum = buffer.readUInt8(offset); offset += 1;
    const status = statusNum === 1 ? 'ACTIVE' : statusNum === 2 ? 'SETTLED' : 'WAITING';
    const startTimestamp = Number(buffer.readBigInt64LE(offset)) * 1000; offset += 8;
    const lastDrainTimestamp = Number(buffer.readBigInt64LE(offset)) * 1000; offset += 8;
    const currentDrainRate = buffer.readUInt16LE(offset); offset += 2;
    const aliveNationsCount = buffer.readUInt8(offset); offset += 1;
    const winnerNationId = buffer.readUInt8(offset); offset += 1;
    const totalActions = buffer.readUInt32LE(offset); offset += 4;
    const totalParticipants = buffer.readUInt32LE(offset); offset += 4;
    const settledAtTimestamp = Number(buffer.readBigInt64LE(offset)) * 1000; offset += 8;

    const nations: Nation[] = [];
    for (let i = 0; i < 8; i++) {
      const nationId = buffer.readUInt8(offset); offset += 1;
      const meter = buffer.readUInt16LE(offset); offset += 2;
      const isEliminated = buffer.readUInt8(offset) !== 0; offset += 1;
      const eliminatedAt = Number(buffer.readBigInt64LE(offset)) * 1000; offset += 8;
      const totalInfluenceSpent = buffer.readUInt32LE(offset); offset += 4;
      const totalSupporters = buffer.readUInt32LE(offset); offset += 4;

      nations.push({
        id: nationId,
        name: ['Velocity', 'Shadow', 'Vault', 'Flow', 'Commons', 'Forge', 'Council', 'Genesis'][nationId] || `Nation ${nationId}`,
        emoji: ['⚡', '🔒', '🏛️', '💧', '🌐', '🔥', '⚖️', '🪨'][nationId] || '🏳️',
        tagline: '',
        color: ['#00f0ff', '#a855f7', '#f59e0b', '#0ea5e9', '#10b981', '#f97316', '#f43f5e', '#94a3b8'][nationId] || '#ffffff',
        meter,
        isEliminated,
        eliminatedAt: isEliminated ? eliminatedAt : undefined,
        totalInfluenceSpent,
        totalSupporters,
      });
    }

    return {
      roundId,
      status,
      startTimestamp,
      lastDrainTimestamp,
      currentDrainRate,
      aliveNationsCount,
      winnerNationId: winnerNationId === 255 ? null : winnerNationId,
      totalActions,
      totalParticipants,
      settledAtTimestamp: settledAtTimestamp > 0 ? settledAtTimestamp : null,
      nations,
    };
  } catch (err) {
    console.error('Failed to decode RoundState:', err);
    return null;
  }
}
