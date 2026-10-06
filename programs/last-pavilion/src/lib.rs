use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("38iyWaZXa4nAZZxGYEGA6GqXhWE5g1dPt9ht9iFcxo63");

#[program]
pub mod last_pavilion {
    use super::*;

    /// Initialize a new World's Fair round on Solana.
    pub fn initialize_round(ctx: Context<InitializeRound>, round_id: u64) -> Result<()> {
        instructions::open_round::handle_initialize(ctx, round_id)
    }

    /// Delegate the round account to the MagicBlock TEE Ephemeral Rollup validator.
    pub fn delegate_round(ctx: Context<DelegateRound>, round_id: u64) -> Result<()> {
        instructions::open_round::handle_delegate(ctx, round_id)
    }

    /// Player joins the round and receives their 100 Influence allocation.
    /// Call on Ephemeral Rollup (gasless, sub-second).
    pub fn join_round(ctx: Context<JoinRound>, round_id: u64) -> Result<()> {
        instructions::join_round::handler(ctx, round_id)
    }

    /// Player spends 10 Influence to support an active nation (+50 meter).
    /// Enforces a 1-second server-side cooldown.
    /// Call on Ephemeral Rollup.
    pub fn support_nation(ctx: Context<SupportNation>, round_id: u64, nation_id: u8) -> Result<()> {
        instructions::support_nation::handler(ctx, round_id, nation_id)
    }

    /// Global drain tick: drains alive nations by current drain rate, eliminates depleted nations,
    /// accelerates drain speed (+4/sec per death), and checks for round finale.
    /// Call continuously on Ephemeral Rollup crank.
    pub fn drain_tick(ctx: Context<DrainTick>, round_id: u64) -> Result<()> {
        instructions::drain_tick::handler(ctx, round_id)
    }

    /// Claim proportional share of the 30 Influence refund pool when a supported nation falls.
    /// Call on Ephemeral Rollup.
    pub fn claim_death_refund(ctx: Context<ClaimDeathRefund>, round_id: u64, nation_id: u8) -> Result<()> {
        instructions::claim_death_refund::handler(ctx, round_id, nation_id)
    }

    /// Settle the round when 1 nation remains, write permanent record on Solana,
    /// and commit / undelegate state back from the MagicBlock ER.
    pub fn settle_round(ctx: Context<SettleRound>, round_id: u64) -> Result<()> {
        instructions::settle_round::handler(ctx, round_id)
    }
}
