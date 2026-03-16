export const QUOTE_STATUS_TRANSITIONS = {
  draft: ['sent', 'approved', 'rejected', 'expired'],
  sent: ['approved', 'rejected', 'expired'],
  approved: [],
  rejected: [],
  expired: []
};

export function isValidQuoteStatusTransition(currentStatus, nextStatus) {
  const allowedTransitions = QUOTE_STATUS_TRANSITIONS[currentStatus] ?? [];
  return allowedTransitions.includes(nextStatus);
}