# The Last Pavilion

**Your nation is dying. Save it.**

Eight nations. One finite budget. An arena that gets more unforgiving with every elimination.

The Last Pavilion is a multiplayer survival game built on Solana around scarce resources and escalating consequences. Spend Influence to keep your chosen nation alive, recover salvaged capital through a death refund when an alliance collapses, and watch the arena's remaining nations race toward extinction.

Built for **MagicBlock Blitz 9 / Colosseum Crypto's World Fair**.

---

[![Solana Devnet](https://img.shields.io/badge/Solana-Devnet-14F195?style=flat-square&logo=solana&logoColor=white)](https://explorer.solana.com/address/38iyWaZXa4nAZZxGYEGA6GqXhWE5g1dPt9ht9iFcxo63?cluster=devnet)
[![Anchor 0.29](https://img.shields.io/badge/Anchor-0.29.0-black?style=flat-square)](https://coral-xyz.github.io/anchor/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## The 20-Second Hook

Eight competing crypto ideals enter the World's Fair arena:

```text
⚡ Velocity    63%  [████████████░░░░░░░░]  00:42 TO EXTINCTION
🔒 Shadow      51%  [██████████░░░░░░░░░░]  00:31 TO EXTINCTION
🏛️ Vault       44%  [████████░░░░░░░░░░░░]  00:26 TO EXTINCTION
💧 Flow        38%  [███████░░░░░░░░░░░░░]  00:19 TO EXTINCTION
🌐 Commons     29%  [█████░░░░░░░░░░░░░░░]  00:14 TO EXTINCTION
🔥 Forge       22%  [████░░░░░░░░░░░░░░░░]  00:09 TO EXTINCTION
⚖️ Council     14%  [██░░░░░░░░░░░░░░░░░░]  00:05 TO EXTINCTION [CRITICAL]
🪨 Genesis     00%  [░░░░░░░░░░░░░░░░░░░░]  FALLEN (REFUND POOL ACTIVE)
```

Each nation has an energy meter that continuously drains toward zero. Players begin with a finite allocation of **100 Influence** to intervene.

Supporting a nation restores its energy, but no intervention permanently halts the decay. When a nation depletes, it is eliminated forever. Each elimination accelerates the drain on all survivors. Players face an escalating dilemma: double down on their dying faction, or let it collapse to reclaim salvaged Influence for the grand finale.

**The goal: Be the last nation standing.**

---

## How to Play

1. **Watch the Arena:** Eight pavilions drain simultaneously in real time.
2. **Choose Your Faction:** Pick the philosophy you want to preserve.
3. **Intervene:** Spend 10 Influence to inject +50 energy into your nation's meter (1-second cooldown).
4. **Survive the Accelerating Drain:** As competing pavilions fall, surviving meters drain progressively faster.
5. **Claim Death Refunds:** If your supported nation collapses, claim your proportional share of the 30-Influence refund pool to pivot support.
6. **Victory:** The sole surviving pavilion wins the round.

---

## Core Game Mechanics

| Mechanic | Rule | Value / Progression |
|---|---|---|
| **Competing Nations** | 8 foundational crypto ideals | Velocity, Shadow, Vault, Flow, Commons, Forge, Council, Genesis |
| **Starting Influence** | Finite per-player budget | **100 Influence** |
| **Intervention Cost** | Cost to support a nation | **10 Influence** |
| **Energy Restored** | Meter boost per intervention | **+50 units** (capped at 1,000) |
| **Support Cooldown** | Prevents macro spamming | **1 second (1,000 ms)** |
| **Baseline Drain Rate** | Starting passive decay | **−6 units/second** |
| **Acceleration per Death** | Permanent penalty on elimination | **+4 units/second** per fallen nation |
| **Death Refund Pool** | Capital recovery for fallen factions | **30 Influence**, split proportionally (minimum 1) |
| **Victory Condition** | Last nation standing | Surviving pavilion when 7 nations deplete |

### The Escalation Curve

The arena starts calm and compounds into rapid-fire chaos:

$$\text{Drain Rate} = 6 + (4 \times \text{Eliminations}) \quad \text{units/sec}$$

$$\mathbf{6 \to 10 \to 14 \to 18 \to 22 \to 26 \to 30\text{ units/sec}}$$

By the time two finalists remain, meters drain at **−30 units/second**, requiring rapid coordination and split-second decisions.

### Strategic Death Refunds

When a nation collapses, a **30 Influence refund pool** unlocks exclusively for its contributors. 

$$\text{Refund} = \min\left(30, \max\left(1, \left\lfloor \frac{\text{Player Spent on Nation} \times 30}{\text{Total Influence Spent on Nation}} \right\rfloor \right)\right)$$

The contract enforces a bitmask (`refunds_claimed_mask`) to guarantee each player claims their refund exactly once per fallen nation. This allows players whose first-choice faction perished early to recover political capital and influence the endgame.

---

## Architecture & Engineering Trade-Off

```mermaid
flowchart TD
    subgraph Client["Next.js Web Client (Sub-50ms Loop)"]
        UI["World's Fair Stage"]
        LocalLoop["60 FPS Reactive Drain Loop"]
        Audio["Web Audio Synthesizer (640Hz)"]
        Refund["Death Refund Claim UI"]
    end

    subgraph Solana["Solana Devnet (Settlement & Custody)"]
        Program["last_pavilion Anchor Program"]
        RoundPDA["RoundState PDA (278 bytes)"]
        PlayerPDA["PlayerState PDA (86 bytes)"]
        SettlePDA["SettlementRecord PDA (66 bytes)"]
    end

    UI -->|Instant Click (0ms)| LocalLoop
    LocalLoop --> Audio
    LocalLoop --> Refund

    Program -->|1. initialize_round| RoundPDA
    Program -->|2. join_round| PlayerPDA
    Program -->|3. support_nation| RoundPDA
    RoundPDA -->|4. Final Settle| SettlePDA
```

### Engineering Trade-Off: Responsive Gameplay vs. Live Execution

During the Blitz 9 build, integrating MagicBlock's Ephemeral Rollup SDK (`ephemeral-rollups-sdk = "0.16.2"`) into our Solana CLI 1.18 / Anchor 0.29 toolchain encountered transitive Rust dependency compatibility failures involving crates published with `edition = "2024"` (which require `rustc >= 1.85`, whereas Solana 1.18 embeds `rustc 1.75`).

**To preserve a reliable, working submission, I made an explicit architectural decision:**
1. The **game loop and visual tug-of-war** were implemented as an optimistic client-side simulation in Next.js to deliver instant 60 FPS feedback without transaction lag or wallet popup fatigue.
2. The **Anchor smart contract** was decoupled from the heavy SDK proc-macros, compiled into clean SBF bytecode, and deployed directly to **Solana Devnet**.
3. **On-chain operations** (`init`, `join`, `support`) were verified directly on Devnet using Anchor PDAs and a standalone controller script.

#### Why Phantom / Wallet Adapter Isn't Wrapped in the UI Right Now

`@solana/wallet-adapter-react` and Phantom dependencies are already installed in `package.json`, but they weren't wrapped into the live UI for two specific reasons:

1. **The Phantom Popup Trap:** If a real Phantom wallet is connected directly to Solana Devnet, Phantom will pop up a confirmation window and ask you to sign a transaction on every single click. In a fast tug-of-war game where you click every second, having Phantom pop up 30 times completely destroys the game loop and makes the demo unrecordable.
2. **The Session Key Blocker:** The real Web3 solution to this is **Session Keys** (you connect Phantom once, approve a temporary in-browser keypair, and the session signs in the background without popups). But Session Keys in MagicBlock require the live Ephemeral Rollup sequencer, which was blocked by the Rust 2024 compiler issue.

**Current status:** The playable prototype delivers the sub-50ms arcade feel in the browser with an auto-provisioned demo citizen keypair (`Demo...7x9Q` with 100 Influence), backed by a deployed on-chain Anchor contract on Devnet. Gameplay clicks currently route through optimistic client state rather than an active MagicBlock Ephemeral Rollup sequencer.

**Next milestone:** Upgrade the toolchain to complete the live delegation CPI lifecycle, route sub-second player interventions through MagicBlock session keys on the TEE sequencer, and verify automated state commitment back to Solana L1.

---

## On-Chain Verification (Solana Devnet)

The Anchor program is deployed and active on Solana Devnet:

* **Program ID:** [`38iyWaZXa4nAZZxGYEGA6GqXhWE5g1dPt9ht9iFcxo63`](https://explorer.solana.com/address/38iyWaZXa4nAZZxGYEGA6GqXhWE5g1dPt9ht9iFcxo63?cluster=devnet)
* **Program Authority:** `542cSPaohJExS8mkeHMsgMTJg2gr4GcQWRGUPRpYKsfn`
* **Round 42 PDA:** `9cosnFngYW1bYVPwWEmPYefEnBWdFtrG2U227mNAsj7d`

### Verified Transactions on Solana Explorer

* **Initialize Round 42:** [`ZZUrcDGDwuPJky5c...`](https://explorer.solana.com/tx/ZZUrcDGDwuPJky5cZvMvvrJrx2Qsh3FopmSY8AR85DuhjcVKsSHoQ6AqPcaPB2z5xbAAMv19cTqfM7AbBHrKTP4?cluster=devnet)
* **Join Round 42:** [`65waTiZLyRVDyVNh...`](https://explorer.solana.com/tx/65waTiZLyRVDyVNhqo6b8VJwhjvsmwJVhTRKVtxksSBNiANmj3qNDa74MmKbpLF96sbKyEijhxzSTLuVQnaEHTS4?cluster=devnet)
* **Support Nation 0 (Velocity):** [`5dNeqesXp3ycXUag...`](https://explorer.solana.com/tx/5dNeqesXp3ycXUag6skc341f9HYk4K2MGaRir7bfAw3ujBkeereVd2uUTQSPqEocCyNmn8GkdCrB8mjtNk9GGHKs?cluster=devnet)
* **Support Nation 1 (Shadow):** [`64FuJMp7oWhsKPX4...`](https://explorer.solana.com/tx/64FuJMp7oWhsKPX4geUe9pQBkEsPe5tsqcyCEYXbb4NLrkdRP3SpZZd66NHFc6QKhBLk8bppzJw8DZsCjSGVEuUx?cluster=devnet)

---

## Getting Started

### Prerequisites

* **Node.js:** v18.0.0+ (Tested on Node 24)
* **Solana CLI:** 1.18.18+
* **Anchor CLI:** 0.29.0+
* **Rust:** 1.75.0+

### 1. Run the Web Application

```bash
# Clone the repository
git clone https://github.com/Olalolo22/last-pavilion.git
cd last-pavilion

# Install web app dependencies
cd app
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

* **Accelerated Demo Mode:** Open [http://localhost:3000/?speed=fast](http://localhost:3000/?speed=fast) or click **FAST DEMO MODE** in the top dock to accelerate drain speed and complete a full match in ~60–80 seconds.
* **Streamlined Arena:** Visit [http://localhost:3000/fair](http://localhost:3000/fair) for the minimalist cards-only stage.

### 2. Build the Solana Program

```bash
# From repository root
cargo build-sbf \
  --manifest-path programs/last-pavilion/Cargo.toml \
  --sbf-out-dir target/deploy
```

### 3. Interact with the Program via CLI Script

The repository includes a standalone Node.js controller script that communicates directly with Solana Devnet:

```bash
# Install root CLI dependencies
npm install

# Check on-chain Round 42 status
node scripts/manage_round.mjs status 42

# Initialize a new round
node scripts/manage_round.mjs init 43

# Register your wallet as a citizen
node scripts/manage_round.mjs join 43

# Support Nation 0 (Velocity)
node scripts/manage_round.mjs support 0 43
```

---

## Repository Structure

```text
last-pavilion/
├── Anchor.toml                                # Anchor 0.29 configuration & devnet program address
├── Cargo.toml                                 # Root workspace manifest
├── package.json                               # Root package configuration for CLI scripts
├── README.md                                  # Project overview and technical documentation
├── programs/
│   └── last-pavilion/
│       ├── Cargo.toml                         # Program dependencies (anchor-lang 0.29)
│       └── src/
│           ├── lib.rs                         # Anchor program entrypoint & instruction routing
│           ├── errors.rs                      # Custom error codes (PavilionError)
│           ├── state.rs                       # Account structs: RoundState, PlayerState, SettlementRecord
│           └── instructions/
│               ├── open_round.rs              # initialize_round & delegate_round handlers
│               ├── join_round.rs              # join_round handler (player registration)
│               ├── support_nation.rs          # support_nation handler (influence spending & cooldown)
│               ├── drain_tick.rs              # drain_tick handler (elimination & acceleration)
│               ├── claim_death_refund.rs      # claim_death_refund handler (pool distribution)
│               └── settle_round.rs            # settle_round handler (settlement record creation)
├── scripts/
│   └── manage_round.mjs                       # Standalone CLI script for Devnet execution & testing
└── app/
    ├── package.json                           # Next.js 14 and Solana Web3 dependencies
    └── src/
        ├── app/
        │   ├── page.tsx                       # Primary interactive arena route (/)
        │   └── fair/page.tsx                  # Minimalist arena stage route (/fair)
        ├── context/
        │   └── GameContext.tsx                # Central reactive game loop, drain tick, & crowd sim
        ├── lib/
        │   ├── constants.ts                   # Game invariants (capacity, drain rate, costs)
        │   ├── nations.ts                     # The 8 pavilions (Velocity, Shadow, Vault, etc.)
        │   ├── types.ts                       # TypeScript interfaces for rounds, players, events
        │   └── solanaService.ts               # Instruction encoders, discriminators, & PDA decoders
        └── components/
            ├── Navbar.tsx                     # Top bar, player influence gauge, citizen address
            ├── WorldFairHeader.tsx            # Hero hook & 4-metric status bar
            ├── NationGrid.tsx                 # 8-card responsive nation grid
            ├── NationCard.tsx                 # Dynamic meter, countdown, sound, support/refund CTA
            ├── EliminationAlert.tsx           # Floating banner triggered upon pavilion death
            ├── ActivityFeed.tsx               # Real-time event telemetry log
            ├── SettlementModal.tsx            # Endgame champion popover with confetti
            └── DemoControls.tsx               # Fast mode toggle, crowd sim toggle, architecture modal
```

---

## Roadmap

- [x] SBF Anchor program deployed to Solana Devnet (`38iyWaZX...`)
- [x] Verified on-chain Round PDA initialization and player interaction transactions
- [x] 60 FPS sub-50ms reactive web game client with audio synthesis and death refund mechanics
- [ ] Upgrade Solana toolchain to resolve upstream Rust 2024 edition crates
- [ ] Connect the frontend directly to MagicBlock's live TEE Ephemeral Rollup sequencer
- [ ] Implement session keys for gasless in-browser ER signing
- [ ] Add automated Anchor integration test suite

---

**The Last Pavilion**  
*Your nation is dying. Save it.*
