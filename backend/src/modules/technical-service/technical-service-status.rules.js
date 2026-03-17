export const TECHNICAL_SERVICE_STATUS_TRANSITIONS = {
  received: ['diagnosis', 'cancelled'],
  diagnosis: ['in_progress', 'waiting_parts', 'cancelled'],
  in_progress: ['waiting_parts', 'completed', 'cancelled'],
  waiting_parts: ['in_progress', 'cancelled'],
  completed: ['delivered'],
  delivered: [],
  cancelled: []
};

export function isValidTechnicalServiceStatusTransition(currentStatus, nextStatus) {
  const allowedTransitions =
    TECHNICAL_SERVICE_STATUS_TRANSITIONS[currentStatus] ?? [];

  return allowedTransitions.includes(nextStatus);
}