use anchor_lang::prelude::*;
use ephemeral_rollups_sdk::anchor::commit;
use ephemeral_rollups_sdk::ephem::{FoldableIntentBuilder, MagicIntentBundleBuilder};
use crate::state::{RoundState, RoundStatus, SettlementRecord};
use crate::errors::PavilionError;

#[commit]
#[derive(Accounts)]
#[instruction(round_id: u64)]
pub struct SettleRound<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"round", round_id.to_le_bytes().as_ref()],
        bump = round_state.bump,
    )]
    pub round_state: Account<'info, RoundState>,

    #[account(
        init_if_needed,
        payer = authority,
        space = SettlementRecord::SPACE,
        seeds = [b"settlement", round_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub settlement_record: Account<'info, SettlementRecord>,

    /// CHECK: MagicBlock context account required for ER commit & undelegate CPI
    #[account(mut)]
    pub magic_context: UncheckedAccount<'info>,

    /// CHECK: MagicBlock magic program
    pub magic_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<SettleRound>, round_id: u64) -> Result<()> {
    let round = &mut ctx.accounts.round_state;
    require!(
        round.status == RoundStatus::Settled || round.alive_nations_count <= 1,
        PavilionError::RoundNotReadyForSettlement
    );

    let clock = Clock::get()?;
    let now = clock.unix_timestamp;

    let record = &mut ctx.accounts.settlement_record;
    record.round_id = round_id;
    record.winner_nation_id = round.winner_nation_id;
    record.total_actions = round.total_actions;
    record.total_participants = round.total_participants;
    record.duration_seconds = (now.saturating_sub(round.start_timestamp)).max(0) as u32;
    record.settled_at_timestamp = now;
    record.authority = ctx.accounts.authority.key();
    record.bump = ctx.bumps.settlement_record;

    msg!(
        "Committing Round {} state to Solana L1. Winner: Nation {}, Actions: {}, Duration: {}s",
        round_id,
        round.winner_nation_id,
        round.total_actions,
        record.duration_seconds
    );

    // Commit state and undelegate round account back to base Solana
    MagicIntentBundleBuilder::new(
        ctx.accounts.authority.to_account_info(),
        ctx.accounts.magic_context.to_account_info(),
        ctx.accounts.magic_program.to_account_info(),
    )
    .commit_and_undelegate(&[ctx.accounts.round_state.to_account_info()])
    .build_and_invoke()?;

    msg!("Round {} successfully committed and settled on Solana L1!", round_id);
    Ok(())
}
