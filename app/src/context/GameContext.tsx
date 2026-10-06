'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Nation, RoundState, RoundStatus, PlayerState, ActivityEvent } from '../lib/types';
import { INITIAL_NATIONS } from '../lib/nations';
import {
  METER_CAPACITY,
  STARTING_DRAIN_RATE,
  ACCELERATION_PER_DEATH,
  SUPPORT_COST,
  SUPPORT_GAIN,
  STARTING_INFLUENCE,
  DEATH_REFUND_POOL,
  COOLDOWN_MS,
} from '../lib/constants';

interface GameContextType {
  round: RoundState;
  player: PlayerState;
  activityFeed: ActivityEvent[];
  lastEliminatedNation: Nation | null;
  cooldownRemaining: number; // 0 to 1000 ms
  isFastMode: boolean;
  crowdSimulationActive: boolean;
  supportNation: (nationId: number) => boolean;
  claimRefund: (nationId: number) => void;
  selectNation: (nationId: number) => void;
  toggleFastMode: () => void;
  toggleCrowdSimulation: () => void;
  resetRound: () => void;
  dismissEliminationAlert: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [round, setRound] = useState<RoundState>(() => ({
    roundId: 42,
    status: 'ACTIVE',
    startTimestamp: Date.now(),
    lastDrainTimestamp: Date.now(),
    currentDrainRate: STARTING_DRAIN_RATE,
    aliveNationsCount: 8,
    winnerNationId: null,
    totalActions: 184,
    totalParticipants: 47,
    settledAtTimestamp: null,
    nations: INITIAL_NATIONS.map((n) => ({ ...n })),
  }));

  const [player, setPlayer] = useState<PlayerState>(() => ({
    address: 'Demo...7x9Q',
    influenceRemaining: STARTING_INFLUENCE,
    lastSupportTimestamp: 0,
    influenceSpentPerNation: [0, 0, 0, 0, 0, 0, 0, 0],
    refundsClaimed: [false, false, false, false, false, false, false, false],
    totalSpent: 0,
    selectedNationId: 0, // defaults to Velocity
  }));

  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([
    {
      id: 'init-1',
      type: 'SUPPORT',
      nationId: 0,
      nationName: 'Velocity',
      icon: 'Zap',
      player: 'Sol...9a2K',
      amount: 10,
      message: 'Supported Velocity (+50)',
      timestamp: Date.now() - 4000,
    },
    {
      id: 'init-2',
      type: 'SUPPORT',
      nationId: 1,
      nationName: 'Shadow',
      icon: 'Lock',
      player: 'Anon...3f81',
      amount: 10,
      message: 'Supported Shadow (+50)',
      timestamp: Date.now() - 2500,
    },
  ]);

  const [lastEliminatedNation, setLastEliminatedNation] = useState<Nation | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [isFastMode, setIsFastMode] = useState<boolean>(false);
  const [crowdSimulationActive, setCrowdSimulationActive] = useState<boolean>(true);

  // Check URL query parameters on mount (?speed=fast)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('speed') === 'fast' || params.get('mode') === 'fast') {
        setIsFastMode(true);
      }
    }
  }, []);

  // Cooldown countdown tick (100ms interval)
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      setCooldownRemaining((prev) => Math.max(0, prev - 100));
    }, 100);
    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const addActivity = useCallback((event: Omit<ActivityEvent, 'id' | 'timestamp'>) => {
    setActivityFeed((prev) => [
      {
        ...event,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
      },
      ...prev.slice(0, 24),
    ]);
  }, []);

  // 1-Second Drain Loop (Running inside simulated/connected ER engine)
  useEffect(() => {
    if (round.status !== 'ACTIVE') return;

    const intervalMs = isFastMode ? 333 : 1000;
    const drainMultiplier = isFastMode ? 3 : 1;

    const interval = setInterval(() => {
      setRound((prevRound) => {
        if (prevRound.status !== 'ACTIVE') return prevRound;

        const effectiveDrain = prevRound.currentDrainRate * drainMultiplier;
        let newAliveCount = prevRound.aliveNationsCount;
        let newDrainRate = prevRound.currentDrainRate;
        let newlyEliminated: Nation | null = null;

        const updatedNations = prevRound.nations.map((nation) => {
          if (nation.isEliminated) return nation;

          const newMeter = Math.max(0, nation.meter - effectiveDrain);
          if (newMeter === 0 && !nation.isEliminated) {
            newAliveCount -= 1;
            newDrainRate += ACCELERATION_PER_DEATH;
            newlyEliminated = {
              ...nation,
              meter: 0,
              isEliminated: true,
              eliminatedAt: Date.now(),
            };
            return newlyEliminated;
          }
          return { ...nation, meter: newMeter };
        });

        if (newlyEliminated) {
          setLastEliminatedNation(newlyEliminated);
          addActivity({
            type: 'ELIMINATION',
            nationId: (newlyEliminated as Nation).id,
            nationName: (newlyEliminated as Nation).name,
            icon: (newlyEliminated as Nation).icon,
            player: 'WORLD FAIR',
            message: `${(newlyEliminated as Nation).name.toUpperCase()} HAS FALLEN. Drain accelerated to −${newDrainRate}/sec`,
          });
        }

        // Check if only 1 nation remains standing
        let winnerId: number | null = null;
        let finalStatus: RoundStatus = prevRound.status;
        if (newAliveCount <= 1) {
          finalStatus = 'SETTLED';
          const survivor = updatedNations.find((n) => !n.isEliminated);
          winnerId = survivor ? survivor.id : updatedNations[0].id;

          addActivity({
            type: 'SETTLEMENT',
            nationId: winnerId,
            nationName: updatedNations[winnerId].name,
            icon: updatedNations[winnerId].icon,
            player: 'SOLANA',
            message: `${updatedNations[winnerId].name.toUpperCase()} IS THE LAST PAVILION! Round ${prevRound.roundId} settled on Solana.`,
          });
        }

        return {
          ...prevRound,
          status: finalStatus,
          currentDrainRate: newDrainRate,
          aliveNationsCount: newAliveCount,
          winnerNationId: winnerId ?? prevRound.winnerNationId,
          settledAtTimestamp: finalStatus === 'SETTLED' ? Date.now() : null,
          nations: updatedNations,
        };
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [round.status, isFastMode, addActivity]);

  // Ambient crowd simulation to mimic 100+ active participants in the ER loop
  useEffect(() => {
    if (!crowdSimulationActive || round.status !== 'ACTIVE') return;

    const simInterval = setInterval(() => {
      const aliveNations = round.nations.filter((n) => !n.isEliminated);
      if (aliveNations.length === 0) return;

      const randomNation = aliveNations[Math.floor(Math.random() * aliveNations.length)];
      const randomPlayerSuffix = Math.floor(1000 + Math.random() * 9000);

      setRound((prev) => {
        const nextNations = prev.nations.map((n) => {
          if (n.id === randomNation.id && !n.isEliminated) {
            return {
              ...n,
              meter: Math.min(METER_CAPACITY, n.meter + SUPPORT_GAIN),
              totalInfluenceSpent: n.totalInfluenceSpent + SUPPORT_COST,
              totalSupporters: n.totalSupporters + 1,
            };
          }
          return n;
        });

        return {
          ...prev,
          totalActions: prev.totalActions + 1,
          nations: nextNations,
        };
      });

      addActivity({
        type: 'SUPPORT',
        nationId: randomNation.id,
        nationName: randomNation.name,
        icon: randomNation.icon,
        player: `Citizen...${randomPlayerSuffix}`,
        amount: SUPPORT_COST,
        message: `Supported ${randomNation.name} (+50)`,
      });
    }, isFastMode ? 700 : 2200);

    return () => clearInterval(simInterval);
  }, [crowdSimulationActive, round.status, round.nations, isFastMode, addActivity]);

  // Core Action: SUPPORT
  const supportNation = useCallback(
    (nationId: number): boolean => {
      if (round.status !== 'ACTIVE') return false;
      if (cooldownRemaining > 0) return false;
      if (player.influenceRemaining < SUPPORT_COST) return false;

      const targetNation = round.nations[nationId];
      if (!targetNation || targetNation.isEliminated) return false;

      // Enforce 1s cooldown
      setCooldownRemaining(COOLDOWN_MS);

      // Deduct influence & record
      setPlayer((prev) => {
        const spent = [...prev.influenceSpentPerNation];
        spent[nationId] += SUPPORT_COST;
        return {
          ...prev,
          influenceRemaining: prev.influenceRemaining - SUPPORT_COST,
          lastSupportTimestamp: Date.now(),
          influenceSpentPerNation: spent,
          totalSpent: prev.totalSpent + SUPPORT_COST,
          selectedNationId: nationId,
        };
      });

      // Update round state
      setRound((prev) => {
        const nextNations = prev.nations.map((n) => {
          if (n.id === nationId && !n.isEliminated) {
            return {
              ...n,
              meter: Math.min(METER_CAPACITY, n.meter + SUPPORT_GAIN),
              totalInfluenceSpent: n.totalInfluenceSpent + SUPPORT_COST,
              totalSupporters: n.totalSupporters + 1,
            };
          }
          return n;
        });

        return {
          ...prev,
          totalActions: prev.totalActions + 1,
          nations: nextNations,
        };
      });

      addActivity({
        type: 'SUPPORT',
        nationId,
        nationName: targetNation.name,
        icon: targetNation.icon,
        player: 'YOU (Citizen)',
        amount: SUPPORT_COST,
        message: `Intervened for ${targetNation.name} (+50)`,
      });

      return true;
    },
    [round.status, round.nations, cooldownRemaining, player.influenceRemaining, addActivity]
  );

  // Claim Refund for Eliminated Nation
  const claimRefund = useCallback(
    (nationId: number) => {
      const nation = round.nations[nationId];
      if (!nation || !nation.isEliminated) return;
      if (player.refundsClaimed[nationId]) return;

      const playerSpent = player.influenceSpentPerNation[nationId];
      if (playerSpent <= 0) return;

      const nationTotal = Math.max(1, nation.totalInfluenceSpent);
      const refund = Math.min(
        DEATH_REFUND_POOL,
        Math.max(1, Math.round((playerSpent * DEATH_REFUND_POOL) / nationTotal))
      );

      setPlayer((prev) => {
        const claimed = [...prev.refundsClaimed];
        claimed[nationId] = true;
        return {
          ...prev,
          influenceRemaining: prev.influenceRemaining + refund,
          refundsClaimed: claimed,
        };
      });

      addActivity({
        type: 'REFUND',
        nationId,
        nationName: nation.name,
        icon: nation.icon,
        player: 'YOU (Citizen)',
        amount: refund,
        message: `Claimed +${refund} Influence death refund from fallen ${nation.name}`,
      });
    },
    [round.nations, player.refundsClaimed, player.influenceSpentPerNation, addActivity]
  );

  const selectNation = useCallback((nationId: number) => {
    setPlayer((prev) => ({ ...prev, selectedNationId: nationId }));
  }, []);

  const toggleFastMode = useCallback(() => {
    setIsFastMode((prev) => !prev);
  }, []);

  const toggleCrowdSimulation = useCallback(() => {
    setCrowdSimulationActive((prev) => !prev);
  }, []);

  const resetRound = useCallback(() => {
    setRound((prev) => ({
      roundId: prev.roundId + 1,
      status: 'ACTIVE',
      startTimestamp: Date.now(),
      lastDrainTimestamp: Date.now(),
      currentDrainRate: STARTING_DRAIN_RATE,
      aliveNationsCount: 8,
      winnerNationId: null,
      totalActions: 0,
      totalParticipants: Math.floor(30 + Math.random() * 50),
      settledAtTimestamp: null,
      nations: INITIAL_NATIONS.map((n) => ({ ...n })),
    }));

    setPlayer({
      address: 'Demo...7x9Q',
      influenceRemaining: STARTING_INFLUENCE,
      lastSupportTimestamp: 0,
      influenceSpentPerNation: [0, 0, 0, 0, 0, 0, 0, 0],
      refundsClaimed: [false, false, false, false, false, false, false, false],
      totalSpent: 0,
      selectedNationId: 0,
    });

    setLastEliminatedNation(null);
    setCooldownRemaining(0);

    addActivity({
      type: 'SETTLEMENT',
      player: 'WORLD FAIR',
      message: `⚔️ ROUND ${round.roundId + 1} COMMENCED! 8 Pavilions entered. Meters draining at −6/sec.`,
    });
  }, [round.roundId, addActivity]);

  const dismissEliminationAlert = useCallback(() => {
    setLastEliminatedNation(null);
  }, []);

  return (
    <GameContext.Provider
      value={{
        round,
        player,
        activityFeed,
        lastEliminatedNation,
        cooldownRemaining,
        isFastMode,
        crowdSimulationActive,
        supportNation,
        claimRefund,
        selectNation,
        toggleFastMode,
        toggleCrowdSimulation,
        resetRound,
        dismissEliminationAlert,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
