'use client';

import { GameProvider } from '../../context/GameContext';
import { NationGrid } from '../../components/NationGrid';
import { EliminationAlert } from '../../components/EliminationAlert';
import { SettlementModal } from '../../components/SettlementModal';
export default function FairPage() {
  return (
    <GameProvider>
      <main className="game-shell">
        <header className="game-nav"><strong>THE LAST PAVILION</strong><span>ROUND 42 · LIVE WORLD</span></header>
        <EliminationAlert />
        <NationGrid />
        <SettlementModal />
      </main>
    </GameProvider>
  );
}
