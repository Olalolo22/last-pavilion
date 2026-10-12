'use client';

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Gauge, Users, RefreshCw, Info, Shield } from 'lucide-react';

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
      <div
        className="w-full py-4 px-4 sm:px-8 mt-12 flex flex-wrap items-center justify-between gap-4"
        style={{
          background: '#11110f',
          borderTop: '1px solid var(--line)',
          fontFamily: "'DM Mono', monospace",
          fontSize: '11px',
          letterSpacing: '.1em',
        }}
      >
        <div className="flex items-center gap-2" style={{ color: '#817d73' }}>
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--brass)',
            }}
          />
          <span>BLITZ 9 DEMO CONTROLS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Fast Mode Toggle */}
          <button
            onClick={toggleFastMode}
            className="support-button"
            style={{
              padding: '8px 14px',
              margin: 0,
              borderColor: isFastMode ? 'var(--brass)' : 'var(--line)',
              background: isFastMode ? 'rgba(177, 138, 74, 0.18)' : '#1a1916',
              color: isFastMode ? 'var(--brass)' : 'var(--paper)',
            }}
          >
            <Gauge size={12} className="inline mr-1.5" />
            <span>FAST MODE ({isFastMode ? '3x SPEED' : '1x NORMAL'})</span>
          </button>

          {/* Crowd Simulation Toggle */}
          <button
            onClick={toggleCrowdSimulation}
            className="support-button"
            style={{
              padding: '8px 14px',
              margin: 0,
              borderColor: crowdSimulationActive ? '#9cbd73' : 'var(--line)',
              background: crowdSimulationActive ? 'rgba(156, 189, 115, 0.12)' : '#1a1916',
              color: crowdSimulationActive ? '#9cbd73' : '#817d73',
            }}
          >
            <Users size={12} className="inline mr-1.5" />
            <span>CROWD SIM ({crowdSimulationActive ? 'ACTIVE' : 'PAUSED'})</span>
          </button>

          {/* Reset Round */}
          <button
            onClick={resetRound}
            className="support-button"
            style={{
              padding: '8px 14px',
              margin: 0,
              borderColor: 'var(--line)',
              background: '#1a1916',
              color: 'var(--paper)',
            }}
          >
            <RefreshCw size={12} className="inline mr-1.5" />
            <span>RESET ROUND</span>
          </button>

          {/* Architecture Modal Button */}
          <button
            onClick={() => setShowArchModal(true)}
            className="support-button"
            style={{
              padding: '8px 14px',
              margin: 0,
              borderColor: 'var(--brass)',
              background: 'transparent',
              color: 'var(--brass)',
            }}
          >
            <Info size={12} className="inline mr-1.5" />
            <span>ARCHITECTURE</span>
          </button>
        </div>
      </div>

      {/* Architecture Explainer Modal */}
      {showArchModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(17, 17, 15, 0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="w-full max-w-2xl p-6 sm:p-8 relative text-left"
            style={{
              background: '#1a1916',
              border: '1px solid var(--line)',
              borderTop: '3px solid var(--brass)',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.85)',
              color: 'var(--paper)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <div
              className="flex items-center justify-between pb-4 mb-6"
              style={{ borderBottom: '1px solid var(--line)' }}
            >
              <div className="flex items-center gap-2.5">
                <Shield size={18} style={{ color: 'var(--brass)' }} />
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    letterSpacing: '-.02em',
                    color: 'var(--paper)',
                  }}
                >
                  THE LAST PAVILION ARCHITECTURE
                </h3>
              </div>
              <button
                onClick={() => setShowArchModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#817d73',
                  cursor: 'pointer',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '12px',
                  letterSpacing: '.1em',
                }}
              >
                [CLOSE]
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <div
                style={{
                  padding: '14px',
                  background: '#24221d',
                  border: '1px solid var(--line)',
                }}
              >
                <strong
                  style={{
                    display: 'block',
                    color: 'var(--brass)',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  1. Native State Delegation (Not an L2)
                </strong>
                <p style={{ color: '#bcb8af', fontSize: '13px', lineHeight: '1.5' }}>
                  MagicBlock Ephemeral Rollups are not an L2. The round state is a native Solana account delegated to a MagicBlock TEE validator via CPI to the Delegation Program. There are no bridges, no wrapped tokens, and zero liquidity fragmentation.
                </p>
              </div>

              <div
                style={{
                  padding: '14px',
                  background: '#24221d',
                  border: '1px solid var(--line)',
                }}
              >
                <strong
                  style={{
                    display: 'block',
                    color: 'var(--brass)',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  2. Sub-50ms Real-Time Gasless Loops
                </strong>
                <p style={{ color: '#bcb8af', fontSize: '13px', lineHeight: '1.5' }}>
                  While delegated, meters drain continuously and player Support interventions execute with sub-50ms latency and zero gas fees, making high-frequency coordination possible entirely within the Solana SVM.
                </p>
              </div>

              <div
                style={{
                  padding: '14px',
                  background: '#24221d',
                  border: '1px solid var(--line)',
                }}
              >
                <strong
                  style={{
                    display: 'block',
                    color: 'var(--brass)',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  3. Atomic Undelegation & Solana Settlement
                </strong>
                <p style={{ color: '#bcb8af', fontSize: '13px', lineHeight: '1.5' }}>
                  When only one nation remains, the account atomically commits its final state and undelegates back to the Solana base layer, permanently storing the verifiable SettlementRecord on-chain.
                </p>
              </div>
            </div>

            <div
              className="mt-6 pt-4 flex justify-end"
              style={{ borderTop: '1px solid var(--line)' }}
            >
              <button
                onClick={() => setShowArchModal(false)}
                className="enter-button"
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  margin: 0,
                  fontSize: '11px',
                }}
              >
                GOT IT →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
