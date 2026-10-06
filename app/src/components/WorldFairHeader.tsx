'use client';

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import {
  Activity,
  Shield,
  Zap,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export function WorldFairHeader() {
  const { round, isFastMode, player } = useGame();
  const [showGuide, setShowGuide] = useState(false);

  const drainRate = round.currentDrainRate * (isFastMode ? 3 : 1);

  return (
    <div className="w-full text-center pt-8 pb-6 px-4 max-w-7xl mx-auto">
      {/* Fair Attraction Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold tracking-wider uppercase mb-4 shadow-[0_0_15px_rgba(245,158,11,0.12)]">
        <Sparkles size={13} className="text-amber-400 animate-pulse" />
        <span>CRYPTO'S WORLD FAIR • SURVIVAL ATTRACTION</span>
      </div>

      {/* Main Punchy Hook */}
      <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-3 font-['Cinzel'] uppercase">
        Eight Ideals Entered.{' '}
        <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
          One Survives.
        </span>
      </h1>

      <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
        Every pavilion's life meter drains continuously in real-time. Spend your finite Influence to defend your philosophy. When a pavilion falls, survivors drain faster — and its supporters are refunded to choose a new allegiance.
      </p>

      {/* 20-Second "How It Works" 3-Card Strip */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 text-left">
        {/* Step 1 */}
        <div className="glass-panel p-4 border-white/10 bg-slate-900/60 hover:border-amber-500/30 transition-all">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-amber-400 text-xs">
              01
            </div>
            <h4 className="text-sm font-bold text-white font-['Cinzel'] tracking-wide">
              Pick Your Pavilion
            </h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Eight crypto philosophies (Speed, Privacy, Custody, Liquidity, etc.) compete. Select which vision deserves to endure.
          </p>
        </div>

        {/* Step 2 */}
        <div className="glass-panel p-4 border-white/10 bg-slate-900/60 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-cyan-400 text-xs">
              02
            </div>
            <h4 className="text-sm font-bold text-white font-['Cinzel'] tracking-wide">
              Intervene with Influence
            </h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            You start with 100 Influence. Each Support action adds <strong className="text-cyan-300">+50 meter</strong> (costs 10 Influence, 1s cooldown) with zero gas in MagicBlock ER.
          </p>
        </div>

        {/* Step 3 */}
        <div className="glass-panel p-4 border-white/10 bg-slate-900/60 hover:border-purple-500/30 transition-all">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-purple-400 text-xs">
              03
            </div>
            <h4 className="text-sm font-bold text-white font-['Cinzel'] tracking-wide">
              Death Refunds & Settlement
            </h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            When a pavilion dies, survivors drain +4/s faster. Supporters recover Influence from a <strong className="text-purple-300">30 refund pool</strong>. Sole survivor commits permanently on Solana.
          </p>
        </div>
      </div>

      {/* Live Status Telemetry Bar */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Drain Velocity */}
        <div className="glass-panel p-3 flex flex-col items-center justify-center border-red-500/20 bg-red-950/10">
          <div className="flex items-center gap-1.5 text-[11px] text-red-400 font-mono uppercase mb-0.5">
            <Activity size={12} className="text-red-400 animate-pulse" />
            <span>DRAIN VELOCITY</span>
          </div>
          <div className="text-2xl font-black font-mono text-red-400 tracking-tight">
            −{drainRate}
            <span className="text-xs text-red-400/70 font-normal">/sec</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            +4/s on each death
          </div>
        </div>

        {/* Survivors */}
        <div className="glass-panel p-3 flex flex-col items-center justify-center border-amber-500/20 bg-amber-950/10">
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-mono uppercase mb-0.5">
            <Shield size={12} className="text-amber-400" />
            <span>PAVILIONS ALIVE</span>
          </div>
          <div className="text-2xl font-black font-mono text-amber-300 tracking-tight">
            {round.aliveNationsCount}{' '}
            <span className="text-xs text-amber-400/60 font-normal">/ 8</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {8 - round.aliveNationsCount} fallen so far
          </div>
        </div>

        {/* Support Rule */}
        <div className="glass-panel p-3 flex flex-col items-center justify-center border-cyan-500/20 bg-cyan-950/10">
          <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-mono uppercase mb-0.5">
            <Zap size={12} className="text-cyan-400" />
            <span>SUPPORT ACTION</span>
          </div>
          <div className="text-2xl font-black font-mono text-cyan-300 tracking-tight">
            +50{' '}
            <span className="text-xs text-cyan-400/70 font-normal">METER</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Costs 10 Influence • 1s CD
          </div>
        </div>

        {/* Death Refund Pool */}
        <div className="glass-panel p-3 flex flex-col items-center justify-center border-purple-500/20 bg-purple-950/10">
          <div className="flex items-center gap-1.5 text-[11px] text-purple-400 font-mono uppercase mb-0.5">
            <RotateCcw size={12} className="text-purple-400" />
            <span>DEATH REFUND</span>
          </div>
          <div className="text-2xl font-black font-mono text-purple-300 tracking-tight">
            30{' '}
            <span className="text-xs text-purple-400/70 font-normal">POOL</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Returned to fallen backers
          </div>
        </div>
      </div>
    </div>
  );
}
