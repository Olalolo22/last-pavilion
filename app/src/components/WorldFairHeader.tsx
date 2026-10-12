'use client';

import React from 'react';
import { useGame } from '../context/GameContext';
import { ShieldAlert, Zap, Hourglass, Activity } from 'lucide-react';

export function WorldFairHeader() {
  const { round, isFastMode } = useGame();

  const drainRate = round.currentDrainRate * (isFastMode ? 3 : 1);

  return (
    <div className="w-full text-center py-6 px-4">
      {/* Kicker */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold tracking-wider uppercase mb-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        CRYPTO WORLD'S FAIR • SURVIVAL ATTRACTION
      </div>

      {/* Main Punchy Hook */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-3 font-['Cinzel'] uppercase">
        Your Nation Is Dying.{' '}
        <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
          Save It.
        </span>
      </h1>

      <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
        Eight competing crypto ideals entered the fair. Their energy is draining continuously in a{' '}
        <strong className="text-cyan-400 font-semibold">MagicBlock Ephemeral Rollup</strong>.
        Commit your finite Influence to preserve your philosophy. Last nation standing commits to Solana L1.
      </p>

      {/* Dynamic World Status Bar */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Drain Velocity */}
        <div className="glass-panel p-3.5 flex flex-col items-center justify-center border-red-500/30 bg-red-950/20">
          <div className="flex items-center gap-1.5 text-xs text-red-400/90 font-mono uppercase mb-1">
            <Activity size={13} className="text-red-400 animate-pulse" />
            <span>PASSIVE DRAIN</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-red-400 tracking-tight">
            −{drainRate}
            <span className="text-xs text-red-400/70 font-normal">/sec</span>
          </div>
          <div className="text-[10px] text-red-300/60 font-mono mt-0.5">
            +4/s on each elimination
          </div>
        </div>

        {/* Survivors */}
        <div className="glass-panel p-3.5 flex flex-col items-center justify-center border-amber-500/30 bg-amber-950/20">
          <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-mono uppercase mb-1">
            <ShieldAlert size={13} className="text-amber-400" />
            <span>PAVILIONS ALIVE</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300 tracking-tight">
            {round.aliveNationsCount}{' '}
            <span className="text-xs text-amber-400/60 font-normal">/ 8</span>
          </div>
          <div className="text-[10px] text-amber-300/60 font-mono mt-0.5">
            {8 - round.aliveNationsCount} fallen so far
          </div>
        </div>

        {/* Intervention Rule */}
        <div className="glass-panel p-3.5 flex flex-col items-center justify-center border-cyan-500/30 bg-cyan-950/20">
          <div className="flex items-center gap-1.5 text-xs text-cyan-400/90 font-mono uppercase mb-1">
            <Zap size={13} className="text-cyan-400" />
            <span>SUPPORT ACTION</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-300 tracking-tight">
            +50{' '}
            <span className="text-xs text-cyan-400/70 font-normal">METER</span>
          </div>
          <div className="text-[10px] text-cyan-300/60 font-mono mt-0.5">
            Costs 10 Influence • 1s CD
          </div>
        </div>

        {/* Strategic Death Refund */}
        <div className="glass-panel p-3.5 flex flex-col items-center justify-center border-purple-500/30 bg-purple-950/20">
          <div className="flex items-center gap-1.5 text-xs text-purple-400/90 font-mono uppercase mb-1">
            <Hourglass size={13} className="text-purple-400" />
            <span>FALLEN REFUND</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-purple-300 tracking-tight">
            30{' '}
            <span className="text-xs text-purple-400/70 font-normal">POOL</span>
          </div>
          <div className="text-[10px] text-purple-300/60 font-mono mt-0.5">
            Recover political capital
          </div>
        </div>
      </div>
    </div>
  );
}
