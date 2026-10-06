'use client';

import React from 'react';
import { useGame } from '../context/GameContext';
import { NationCard } from './NationCard';

export function NationGrid() {
  const { round, player } = useGame();
  return <section className="game-stage" aria-label="The eight nations">
    <div className="stage-heading"><div><p className="eyebrow">THE LAST PAVILION</p><h1>Eight nations. <em>One survives.</em></h1></div><div className="influence"><span>YOUR INFLUENCE</span><strong>{player.influenceRemaining}</strong><i><b style={{ width: `${player.influenceRemaining}%` }} /></i></div></div>
    <div className="alive-count"><span className="live-dot" /> {round.aliveNationsCount} PAVILIONS ALIVE <span>·</span> CHOOSE ONE TO SUPPORT</div>
    <div className="nation-grid">{round.nations.map((nation) => <NationCard key={nation.id} nation={nation} />)}</div>
  </section>;
}
