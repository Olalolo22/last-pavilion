'use client';

import React from 'react';
import { Clock, Zap, RotateCcw } from 'lucide-react';
import { Nation } from '../lib/types';
import { useGame } from '../context/GameContext';
import { METER_CAPACITY, DEATH_REFUND_POOL } from '../lib/constants';
import { playChirp } from '../lib/audio';

export function NationCard({ nation }: { nation: Nation }) {
  const {
    round,
    player,
    cooldownRemaining,
    supportNation,
    claimRefund,
    grantStipend,
    selectNation,
    isFastMode,
  } = useGame();

  const eliminated = nation.isEliminated;
  const drainPerSec = round.currentDrainRate * (isFastMode ? 2.5 : 1);
  const seconds = drainPerSec ? Math.ceil(nation.meter / drainPerSec) : 0;
  const critical = !eliminated && (nation.meter <= 300 || seconds <= 20);
  const selected = player.selectedNationId === nation.id;
  const percent = Math.max(0, Math.min(100, (nation.meter / METER_CAPACITY) * 100));

  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
    seconds % 60
  ).padStart(2, '0')}`;

  const playerSpentOnThis = player.influenceSpentPerNation[nation.id];
  const hasClaimedRefund = player.refundsClaimed[nation.id];
  const canClaimRefund = eliminated && !hasClaimedRefund;

  const potentialRefund =
    playerSpentOnThis > 0
      ? Math.min(
          DEATH_REFUND_POOL,
          Math.max(
            15,
            Math.round(
              (playerSpentOnThis * DEATH_REFUND_POOL) /
                Math.max(1, nation.totalInfluenceSpent)
            )
          )
        )
      : 15;

  const disabled =
    eliminated ||
    round.status !== 'ACTIVE' ||
    cooldownRemaining > 0;

  const handleSupport = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (eliminated) return;
    playChirp(640, 0.12, 0.1);
    supportNation(nation.id);
  };

  const handleClaimRefund = (e: React.MouseEvent) => {
    e.stopPropagation();
    playChirp(780, 0.16, 0.12);
    claimRefund(nation.id);
  };

  return (
    <article
      className={`pavilion ${selected && !eliminated ? 'is-selected' : ''} ${
        critical ? 'is-critical' : ''
      } ${eliminated ? 'is-fallen' : ''}`}
      style={{ '--nation-color': nation.color } as React.CSSProperties}
      onClick={() => selectNation(nation.id)}
    >
      <div className="pavilion-top">
        <span className="pavilion-icon">{nation.emoji}</span>
        <span className="pavilion-status">
          {eliminated ? 'FALLEN' : critical ? 'CRITICAL' : 'ALIVE'}
        </span>
      </div>

      <h2>{nation.name}</h2>

      <div className="meter-line">
        <span style={{ width: `${percent}%` }} />
      </div>

      <div className="pavilion-meta">
        <span>
          {eliminated ? (
            'EXTINCT'
          ) : (
            <>
              <Clock size={11} aria-hidden="true" /> {time}
            </>
          )}
        </span>
        <strong>{Math.round(percent)}%</strong>
      </div>

      {/* Action: SUPPORT, RELOAD, or CLAIM REFUND */}
      {eliminated ? (
        canClaimRefund ? (
          <button
            className="support-button"
            style={{
              borderColor: 'var(--brass)',
              color: 'var(--paper)',
              background: 'rgba(177,138,74,0.18)',
            }}
            onClick={handleClaimRefund}
          >
            <RotateCcw size={12} aria-hidden="true" /> CLAIM +{potentialRefund}{' '}
            {playerSpentOnThis > 0 ? 'REFUND' : 'SALVAGE'}
          </button>
        ) : (
          <button className="support-button" disabled>
            {hasClaimedRefund ? 'REFUND CREDITED' : 'PAVILION EXTINCT'}
          </button>
        )
      ) : player.influenceRemaining < 10 ? (
        <button
          className="support-button"
          style={{
            borderColor: 'var(--brass)',
            color: 'var(--brass)',
            background: 'rgba(177,138,74,0.1)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            playChirp(880, 0.14, 0.1);
            grantStipend(50);
          }}
        >
          <Zap size={12} aria-hidden="true" /> RELOAD +50 INFLUENCE
        </button>
      ) : (
        <button
          className="support-button"
          disabled={disabled}
          onClick={handleSupport}
        >
          <Zap size={12} aria-hidden="true" />{' '}
          {cooldownRemaining > 0
            ? 'COOLDOWN'
            : '+50 ENERGY (−10 INF)'}
        </button>
      )}
    </article>
  );
}
