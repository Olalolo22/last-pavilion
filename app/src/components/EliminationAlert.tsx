'use client';

import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Skull, AlertTriangle, X } from 'lucide-react';

export function EliminationAlert() {
  const { lastEliminatedNation, dismissEliminationAlert, round } = useGame();

  useEffect(() => {
    if (!lastEliminatedNation) return;
    const timer = setTimeout(() => {
      dismissEliminationAlert();
    }, 4500);
    return () => clearTimeout(timer);
  }, [lastEliminatedNation, dismissEliminationAlert]);

  if (!lastEliminatedNation) return null;

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-lg animate-in fade-in slide-in-from-top-6 duration-300">
      <div className="glass-panel p-4 bg-red-950/95 border border-red-500/80 shadow-[0_0_40px_rgba(239,68,68,0.6)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-2xl flex-shrink-0 animate-bounce">
            <Skull className="text-red-400" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                <AlertTriangle size={12} />
                PAVILION ELIMINATED
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-red-300">
                DRAIN ACCELERATED
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-black text-white font-['Cinzel'] tracking-wide">
              {lastEliminatedNation.emoji} {lastEliminatedNation.name.toUpperCase()} HAS FALLEN!
            </h4>
            <p className="text-xs text-red-200/80 font-mono mt-0.5">
              Surviving pavilions now drain at{' '}
              <strong className="text-white">−{round.currentDrainRate}/sec</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={dismissEliminationAlert}
          className="p-1 rounded-lg hover:bg-white/10 text-red-300 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
