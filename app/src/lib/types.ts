export interface Nation {
  id: number;
  name: string;
  emoji: string;
  icon?: string;
  tagline: string;
  color: string;
  meter: number; // 0 - 1000
  isEliminated: boolean;
  eliminatedAt?: number;
  totalInfluenceSpent: number;
  totalSupporters: number;
}

export type RoundStatus = 'WAITING' | 'ACTIVE' | 'SETTLED';

export interface RoundState {
  roundId: number;
  status: RoundStatus;
  startTimestamp: number;
  lastDrainTimestamp: number;
  currentDrainRate: number; // units per second (6, 10, 14, ...)
  aliveNationsCount: number;
  winnerNationId: number | null;
  totalActions: number;
  totalParticipants: number;
  settledAtTimestamp: number | null;
  nations: Nation[];
}

export interface PlayerState {
  address: string;
  influenceRemaining: number; // starts at 100
  lastSupportTimestamp: number;
  influenceSpentPerNation: number[];
  refundsClaimed: boolean[];
  totalSpent: number;
  selectedNationId: number | null;
}

export interface ActivityEvent {
  id: string;
  type: 'SUPPORT' | 'ELIMINATION' | 'REFUND' | 'SETTLEMENT';
  nationId?: number;
  nationName?: string;
  emoji?: string;
  player: string;
  amount?: number;
  message: string;
  timestamp: number;
}
