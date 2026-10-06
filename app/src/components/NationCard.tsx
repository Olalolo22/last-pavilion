'use client';

import React from 'react';
import { Nation } from '../lib/types';
import { useGame } from '../context/GameContext';
import { Zap, Skull, ShieldAlert, Award, Clock } from 'lucide-react';
import { METER_CAPACITY, DEATH_REFUND_POOL } from '../lib/constants';

interface NationCardProps {
  nation: Nation;
}

export function NationCard({ nation }: NationCardProps) {
  const {
    round,
    player,
    cooldownRemaining,
    supportNation,
    claimRefund,
    selectNation,
    isFastMode,
  } = useGame();

  const isSelected = player.selectedNationId === nation.id;
  const isEliminated = nation.isEliminated;
  const meterPercent = Math.min(100, Math.max(0, (nation.meter / METER_CAPACITY) * 100));
  const isCritical = !isEliminated && nation.meter <= 250;

  const playerSpentOnThis = player.influenceSpentPerNation[nation.id];
  const hasClaimedRefund = player.refundsClaimed[nation.id];
  const canClaimRefund =
    isEliminated && playerSpentOnThis > 0 && !hasClaimedRefund;

  const potentialRefund = Math.min(
    DEATH_REFUND_POOL,
    Math.max(
      1,
      Math.round(
        (playerSpentOnThis * DEATH_REFUND_POOL) /
          Math.max(1, nation.totalInfluenceSpent)
      )
    )
  );

  // Time to extinction estimate based on current drain
  const effectiveDrain = round.currentDrainRate * (isFastMode ? 3 : 1);
  const secondsLeft =
    effectiveDrain > 0 ? Math.ceil(nation.meter / effectiveDrain) : 0;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`;

  const handleSupport = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEliminated) return;
    supportNation(nation.id);
  };

  const handleClaimRefund = (e: React.MouseEvent) => {
    e.stopPropagation();
    claimRefund(nation.id);
  };

  return (
    <div
      onClick={() => selectNation(nation.id)}
      className={`glass-panel group relative flex flex-col justify-between p-5 transition-all duration-300 cursor-pointer overflow-hidden border ${
        isEliminated
          ? 'opacity-40 grayscale border-white/5 bg-slate-950/90'
          : isCritical
          ? 'pulse-alarm border-red-500/60 shadow-[0_0_25px_rgba(239,68,68,0.3)]'
          : isSelected
          ? 'border-amber-500/70 shadow-[0_0_25px_rgba(245,158,11,0.25)] bg-slate-900/90'
          : 'border-white/10 hover:border-white/30 hover:bg-slate-900/80'
      }`}
      style={{
        boxShadow:
          isSelected && !isEliminated
            ? `0 0 25px ${nation.color}33, inset 0 0 15px ${nation.color}11`
            : undefined,
      }}
    >
      {/* Top Banner: Icon, Name, Status Pill */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0 transition-transform group-hover:scale-105 text-2xl"
              style={{
                backgroundColor: isEliminated ? 'rgba(255,255,255,0.03)' : `${nation.color}18`,
                borderColor: isEliminated ? 'rgba(255,255,255,0.08)' : `${nation.color}45`,
                boxShadow: !isEliminated ? `0 0 15px ${nation.color}25` : undefined,
              }}
            >
              {nation.emoji}
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-['Cinzel'] tracking-wide flex items-center gap-2">
                {nation.name}
                {round.winnerNationId === nation.id && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-mono">
                    <Award size={11} />
                    CHAMPION
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight">
                {nation.tagline}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          {isEliminated ? (
            <span className="px-2 py-1 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold flex items-center gap-1">
              <Skull size={11} />
              FALLEN
            </span>
          ) : isCritical ? (
            <span className="px-2 py-1 rounded-md bg-red-500/20 border border-red-500/60 text-red-300 text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse">
              <ShieldAlert size={11} />
              CRITICAL
            </span>
          ) : (
            <span className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SURVIVING
            </span>
          )}
        </div>

        {/* Dynamic Meter Gauge */}
        <div className="mt-4 mb-3">
          <div className="flex items-baseline justify-between font-mono mb-1.5">
            <div className="flex items-baseline gap-1">
              <span
                className="text-2xl font-black tracking-tight"
                style={{ color: isEliminated ? '#64748b' : isCritical ? '#ef4444' : nation.color }}
              >
                {nation.meter}
              </span>
              <span className="text-xs text-slate-500">/ 1000</span>
            </div>

            {/* Extinction Timer */}
            {!isEliminated && (
              <div
                className={`text-[11px] flex items-center gap-1 font-semibold ${
                  isCritical ? 'text-red-400 animate-pulse' : 'text-slate-400'
                }`}
              >
                <Clock size={11} />
                <span>{timeFormatted} TO EXTINCTION</span>
              </div>
            )}
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
            <div
              className="h-full rounded-full transition-all duration-300 relative"
              style={{
                width: `${meterPercent}%`,
                backgroundColor: isEliminated
                  ? '#334155'
                  : isCritical
                  ? '#ef4444'
                  : nation.color,
                boxShadow: !isEliminated
                  ? `0 0 12px ${isCritical ? '#ef4444' : nation.color}`
                  : undefined,
              }}
            >
              {!isEliminated && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Contribution Telemetry & Action Button */}
      <div className="mt-2 pt-3 border-t border-white/5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>
            CITIZENS: <strong className="text-white">{nation.totalSupporters}</strong>
          </span>
          {playerSpentOnThis > 0 && (
            <span className="text-amber-300 font-semibold">
              YOU SPENT: {playerSpentOnThis}
            </span>
          )}
        </div>

        {/* Action Button: SUPPORT vs REFUND */}
        {isEliminated ? (
          canClaimRefund ? (
            <button
              onClick={handleClaimRefund}
              className="w-full min-h-[42px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all transform active:scale-95"
            >
              <Zap size={14} className="fill-white" />
              CLAIM +{potentialRefund} REFUND
            </button>
          ) : (
            <div className="w-full min-h-[42px] py-2 px-3 text-center text-xs font-mono text-slate-500 bg-white/[0.02] rounded-xl border border-white/5 flex items-center justify-center">
              {hasClaimedRefund ? 'REFUND CREDITED' : 'PAVILION EXTINCT'}
            </div>
          )
        ) : (
          <button
            onClick={handleSupport}
            disabled={
              round.status !== 'ACTIVE' ||
              player.influenceRemaining < 10 ||
              cooldownRemaining > 0
            }
            className={`w-full min-h-[42px] py-2.5 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all relative overflow-hidden transform active:scale-95 ${
              player.influenceRemaining < 10
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : cooldownRemaining > 0
                ? 'bg-amber-500/20 text-amber-300/60 border border-amber-500/30 cursor-wait'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)]'
            }`}
          >
            {cooldownRemaining > 0 && (
              <div
                className="absolute inset-0 bg-white/20 transition-all duration-100 ease-linear pointer-events-none"
                style={{ width: `${(cooldownRemaining / 1000) * 100}%` }}
              />
            )}
            <Zap size={14} className={cooldownRemaining > 0 ? '' : 'fill-slate-950'} />
            <span>
              {cooldownRemaining > 0
                ? `COOLDOWN ${(cooldownRemaining / 1000).toFixed(1)}s`
                : player.influenceRemaining < 10
                ? 'OUT OF INFLUENCE'
                : 'SUPPORT (+50 METER)'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
