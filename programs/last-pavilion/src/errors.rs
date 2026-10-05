use anchor_lang::prelude::*;

#[error_code]
pub enum PavilionError {
    #[msg("The round is not currently active.")]
    RoundNotActive,

    #[msg("This nation has already been eliminated from the World's Fair.")]
    NationEliminated,

    #[msg("Insufficient influence remaining. (10 influence required per support).")]
    InsufficientInfluence,

    #[msg("Cooldown active: 1 second required between support interventions.")]
    CooldownActive,

    #[msg("The round is already settled.")]
    RoundAlreadySettled,

    #[msg("Invalid nation index (must be 0..7).")]
    InvalidNationId,

    #[msg("Round cannot be settled yet: more than one nation remains standing.")]
    RoundNotReadyForSettlement,

    #[msg("Refund has already been claimed for this eliminated nation.")]
    RefundAlreadyClaimed,

    #[msg("Player did not contribute to this eliminated nation.")]
    NoContributionForRefund,
}
