'use client';

import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';
import { playChirp } from '../lib/audio';

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
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b18a4a', '#f1eee7', winner.color || '#00f0ff'],
      });
      playChirp(880, 0.25, 0.12);
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(17, 17, 15, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        className="w-full max-w-lg p-6 sm:p-10 relative overflow-hidden flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300"
        style={{
          background: '#1a1916',
          border: '1px solid var(--line)',
          borderTop: `3px solid ${winner.color}`,
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.85)',
          color: 'var(--paper)',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Eyebrow */}
        <p
          className="eyebrow"
          style={{
            color: 'var(--brass)',
            font: "500 10px 'DM Mono', monospace",
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          CRYPTO&apos;S WORLD FAIR · ROUND {round.roundId} SETTLEMENT
        </p>

        {/* Champion Emblem */}
        <div
          style={{
            width: '74px',
            height: '74px',
            fontSize: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px',
            background: '#24221d',
            border: `1px solid ${winner.color}60`,
            boxShadow: `0 0 28px ${winner.color}35`,
          }}
        >
          {winner.emoji}
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            lineHeight: '1.0',
            letterSpacing: '-.06em',
            margin: '0 0 10px',
            color: 'var(--paper)',
          }}
        >
          {winner.name}{' '}
          <em
            style={{
              color: 'var(--brass)',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
            }}
          >
            Wins.
          </em>
        </h2>

        <p
          style={{
            color: '#817d73',
            font: "11px 'DM Mono', monospace",
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            marginBottom: '26px',
          }}
        >
          {winner.tagline} · SOLE SURVIVOR
        </p>

        {/* Settlement Metrics Box */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            padding: '16px',
            background: '#24221d',
            border: '1px solid var(--line)',
            marginBottom: '20px',
            fontFamily: "'DM Mono', monospace",
            textAlign: 'left',
          }}
        >
          <div>
            <div style={{ color: '#817d73', fontSize: '10px', letterSpacing: '.12em' }}>
              ACTIONS
            </div>
            <div
              style={{
                color: 'var(--paper)',
                fontSize: '20px',
                fontWeight: 700,
                marginTop: '3px',
              }}
            >
              {round.totalActions}
            </div>
          </div>
          <div>
            <div style={{ color: '#817d73', fontSize: '10px', letterSpacing: '.12em' }}>
              CITIZENS
            </div>
            <div
              style={{
                color: 'var(--brass)',
                fontSize: '20px',
                fontWeight: 700,
                marginTop: '3px',
              }}
            >
              {round.totalParticipants}
            </div>
          </div>
          <div>
            <div style={{ color: '#817d73', fontSize: '10px', letterSpacing: '.12em' }}>
              SETTLED ON
            </div>
            <div
              style={{
                color: '#9cbd73',
                fontSize: '18px',
                fontWeight: 700,
                marginTop: '3px',
              }}
            >
              SOLANA
            </div>
          </div>
        </div>

        {/* Commitment Architecture Note */}
        <div
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#11110f',
            border: '1px solid var(--line)',
            borderLeft: '3px solid var(--brass)',
            marginBottom: '24px',
            textAlign: 'left',
            fontFamily: "'DM Mono', monospace",
          }}
        >
          <div
            style={{
              color: 'var(--brass)',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
            }}
          >
            State Commitment · MagicBlock TEE → Solana L1
          </div>
          <div
            style={{
              color: '#817d73',
              fontSize: '11px',
              marginTop: '4px',
              lineHeight: '1.4',
            }}
          >
            Native SVM account committed atomically upon final nation extinction.
          </div>
        </div>

        {/* Action Button: Auto-Countdown */}
        <button
          onClick={() => {
            playChirp(640, 0.1);
            resetRound();
          }}
          className="enter-button"
          style={{
            width: '100%',
            justifyContent: 'center',
            cursor: 'pointer',
            margin: 0,
            padding: '16px 24px',
            background: 'var(--paper)',
            color: 'var(--ink)',
            font: "700 12px 'DM Mono', monospace",
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            transition: '.2s',
          }}
        >
          START NEXT ROUND ({countdown}s) →
        </button>
      </div>
    </div>
  );
}
