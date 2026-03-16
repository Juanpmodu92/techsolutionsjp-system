export const SOFTWARE_PROJECT_STATUS_TRANSITIONS = {
  quotation: ['in_development', 'cancelled'],
  in_development: ['testing', 'cancelled'],
  testing: ['delivered', 'in_development', 'cancelled'],
  delivered: ['finished'],
  finished: [],
  cancelled: []
};

export function isValidSoftwareProjectStatusTransition(currentStatus, nextStatus) {
  const allowedTransitions =
    SOFTWARE_PROJECT_STATUS_TRANSITIONS[currentStatus] ?? [];

  return allowedTransitions.includes(nextStatus);
}