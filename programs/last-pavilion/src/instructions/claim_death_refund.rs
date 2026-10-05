use anchor_lang::prelude::*;
use crate::state::{RoundState, PlayerState, DEATH_REFUND_POOL};
use crate::errors::PavilionError;

#[derive(Accounts)]
#[instruction(round_id: u64, nation_id: u8)]
pub struct ClaimDeathRefund<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        seeds = [b"round", round_id.to_le_bytes().as_ref()],
        bump = round_state.bump,
    )]
    pub round_state: Account<'info, RoundState>,

    #[account(
        mut,
        seeds = [b"player", round_id.to_le_bytes().as_ref(), player.key().as_ref()],
        bump = player_state.bump,
    )]
    pub player_state: Account<'info, PlayerState>,
}

pub fn handler(ctx: Context<ClaimDeathRefund>, round_id: u64, nation_id: u8) -> Result<()> {
    require!(nation_id < 8, PavilionError::InvalidNationId);

    let round = &ctx.accounts.round_state;
    let nation = &round.nations[nation_id as usize];
    require!(nation.is_eliminated, PavilionError::NationEliminated);

    let player_state = &mut ctx.accounts.player_state;
    let mask = 1u8 << nation_id;
    require!((player_state.refunds_claimed_mask & mask) == 0, PavilionError::RefundAlreadyClaimed);

    let player_spent = player_state.influence_spent_per_nation[nation_id as usize];
    require!(player_spent > 0, PavilionError::NoContributionForRefund);

    let nation_total = nation.total_influence_spent.max(1);
    let refund = ((player_spent as u32).saturating_mul(DEATH_REFUND_POOL) / nation_total)
        .max(1)
        .min(DEATH_REFUND_POOL) as u16;

    player_state.influence_remaining = player_state.influence_remaining.saturating_add(refund);
    player_state.refunds_claimed_mask |= mask;

    emit!(DeathRefundClaimed {
        round_id,
        nation_id,
        player: player_state.player,
        refund_amount: refund,
        new_influence: player_state.influence_remaining,
    });

    msg!(
        "Refund: Player {} received +{} Influence for fallen Nation {}",
        player_state.player,
        refund,
        nation_id
    );

    Ok(())
}

#[event]
pub struct DeathRefundClaimed {
    pub round_id: u64,
    pub nation_id: u8,
    pub player: Pubkey,
    pub refund_amount: u16,
    pub new_influence: u16,
}
