'use client';

import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Award, CheckCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NationIcon } from './NationIcon';

export function SettlementModal() {
  const { round, resetRound } = useGame();
  const [countdown, setCountdown] = useState(10);

  const isSettled = round.status === 'SETTLED';
  const winner =
    round.winnerNationId !== null ? round.nations[round.winnerNationId] : null;

  // Trigger celebratory confetti on round conclusion
  useEffect(() => {
    if (isSettled && winner) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#00f0ff', '#a855f7', '#10b981'],
      });
      setCountdown(10);
    }
  }, [isSettled, winner]);

  // Auto-countdown to Next Round (10 seconds)
  useEffect(() => {
    if (!isSettled) return;
    if (countdown <= 0) {
      resetRound();
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isSettled, countdown, resetRound]);

  if (!isSettled || !winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-xl p-5 sm:p-8 bg-slate-950/95 border border-amber-500/50 shadow-[0_0_60px_rgba(245,158,11,0.3)] relative overflow-hidden flex flex-col items-center text-center max-h-[90vh] overflow-y-auto">
        {/* Decorative Top Accent */}
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full mb-6" />

        {/* Champion Badge */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-pulse border-2"
          style={{
            backgroundColor: `${winner.color}20`,
            borderColor: `${winner.color}60`,
            color: winner.color,
          }}
        >
          <NationIcon name={winner.icon} size={40} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold tracking-wider uppercase mb-2">
          <Award size={13} />
          CRYPTO WORLD'S FAIR • SOLE SURVIVOR
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-white font-['Cinzel'] tracking-wide mb-1 uppercase">
          {winner.name} Wins!
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-mono mb-6">
          {winner.tagline} is the Last Pavilion standing.
        </p>

        {/* Settlement Metrics Box */}
        <div className="w-full grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-6 font-mono text-left">
          <div>
            <div className="text-[10px] text-slate-500 uppercase">INTERVENTIONS</div>
            <div className="text-lg sm:text-xl font-bold text-white">
              {round.totalActions}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase">CITIZENS</div>
            <div className="text-lg sm:text-xl font-bold text-amber-300">
              {round.totalParticipants}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase">SETTLEMENT</div>
            <div className="text-lg sm:text-xl font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle size={15} />
              SOLANA
            </div>
          </div>
        </div>

        {/* MagicBlock Technology Reveal */}
        <div className="w-full p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between gap-3 mb-6 text-left">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-cyan-300">
                MagicBlock Ephemeral Rollup
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Native Solana state delegation · Sub-second TEE execution · Settled on Solana
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
            VERIFIED
          </span>
        </div>

        {/* Action Button: Auto-Countdown */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={resetRound}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-mono font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all"
          >
            <RefreshCw size={16} />
            START NEXT ROUND ({countdown}s)
          </button>
        </div>
      </div>
    </div>
  );
}
