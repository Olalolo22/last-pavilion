'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_NATIONS } from '../lib/nations';

export default function LandingPage() {
  return (
    <main className="landing-shell">
      {/* Background Animated Beacons of 8 Competing Nations */}
      <div className="landing-grid" aria-hidden="true">
        {INITIAL_NATIONS.map((nation, index) => (
          <div
            key={nation.id}
            className="landing-beacon"
            style={
              {
                '--nation-color': nation.color,
                '--delay': `${index * 0.45}s`,
              } as React.CSSProperties
            }
          >
            <span>
              {nation.emoji}
            </span>
            <i />
          </div>
        ))}
      </div>

      <header className="landing-nav">
        <span className="brand-mark">THE LAST PAVILION</span>
        <span className="nav-note">CRYPTO&apos;S WORLD FAIR / ROUND 42</span>
      </header>

      <section className="landing-hero">
        <p className="eyebrow">A LIVE SURVIVAL ATTRACTION</p>
        <h1>
          Eight nations enter.
          <br />
          <em>One survives.</em>
        </h1>
        <p className="landing-copy">
          A multiplayer survival attraction where everyone decides which ideals survive
          Crypto&apos;s World Fair.
        </p>
        <div className="landing-briefing" aria-label="How the arena works">
          <div><b>01</b><span><strong>PLEDGE</strong>Choose 1 of 8 crypto philosophies to defend at the World&apos;s Fair.</span></div>
          <div><b>02</b><span><strong>DEFEND</strong>Pavilions continuously bleed light. Spend 10 Influence to inject +50 meter before the extinction clock hits zero.</span></div>
          <div><b>03</b><span><strong>ADAPT</strong>Every fallen nation accelerates drain on the survivors (+4/sec). Backers of extinct nations receive a 30 Influence refund to pivot their allegiance.</span></div>
          <div><b>04</b><span><strong>SETTLE</strong>The sole surviving pavilion commits permanently into Solana history.</span></div>
        </div>
        <Link className="enter-button" href="/fair">
          ENTER THE FAIR ARENA <span aria-hidden="true">→</span>
        </Link>
        <p className="landing-footnote">
          Built on Solana <span>·</span> Powered by MagicBlock
        </p>
      </section>
    </main>
  );
}
