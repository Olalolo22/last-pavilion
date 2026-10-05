'use client';

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Gauge, Users, RefreshCw, Info, Check, Shield } from 'lucide-react';

export function DemoControls() {
  const {
    isFastMode,
    toggleFastMode,
    crowdSimulationActive,
    toggleCrowdSimulation,
    resetRound,
  } = useGame();

  const [showArchModal, setShowArchModal] = useState(false);

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>BLITZ 9 DEMO CONTROLS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Fast Mode Toggle */}
          <button
            onClick={toggleFastMode}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
              isFastMode
                ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : 'bg-white/[0.03] text-slate-300 border-white/10 hover:border-white/20'
            }`}
          >
            <Gauge size={13} />
            <span>FAST DEMO MODE ({isFastMode ? 'ON 3x' : 'OFF 1x'})</span>
          </button>

          {/* Crowd Simulation Toggle */}
          <button
            onClick={toggleCrowdSimulation}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
              crowdSimulationActive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/[0.03] text-slate-400 border-white/10'
            }`}
          >
            <Users size={13} />
            <span>CROWD SIMULATION ({crowdSimulationActive ? 'ACTIVE' : 'PAUSED'})</span>
          </button>

          {/* Reset Round */}
          <button
            onClick={resetRound}
            className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 border border-white/10 hover:border-white/20 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw size={13} />
            <span>RESET ROUND</span>
          </button>

          {/* Architecture Modal Button */}
          <button
            onClick={() => setShowArchModal(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all"
          >
            <Info size={13} />
            <span>ARCHITECTURE</span>
          </button>
        </div>
      </div>

      {/* Architecture Explainer Modal */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl p-6 sm:p-8 bg-slate-950/95 border border-white/20 shadow-2xl relative text-left font-mono">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="text-cyan-400" size={20} />
                <h3 className="text-base sm:text-lg font-bold text-white font-['Cinzel']">
                  THE LAST PAVILION ARCHITECTURE
                </h3>
              </div>
              <button
                onClick={() => setShowArchModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 text-sm rounded bg-white/5"
              >
                CLOSE [ESC]
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <strong className="text-cyan-400 block mb-1">
                  1. Ephemeral Execution Layer (MagicBlock ER)
                </strong>
                The shared World Fair round state is delegated to a MagicBlock TEE validator.
                Meters drain every second and player Support interventions execute with sub-50ms latency
                and zero gas fees.
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <strong className="text-amber-400 block mb-1">
                  2. Dynamic Coordination Mechanics
                </strong>
                Every player receives 100 Influence. Interventions cost 10 Influence and add +50 meter.
                When a nation depletes, a 30 Influence refund pool is credited proportionally to its supporters,
                creating emergent alliances and endgame consolidation.
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <strong className="text-emerald-400 block mb-1">
                  3. Verifiable Solana L1 Finality
                </strong>
                When only one nation remains, the ER commits a verifiable cryptographic proof back to Solana L1,
                writing the permanent SettlementRecord into base layer storage.
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowArchModal(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
