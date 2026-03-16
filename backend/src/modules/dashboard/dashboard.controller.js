import { handleDatabaseError } from '../../shared/utils/db-error.js';
import { getDashboardMetrics } from './dashboard.repository.js';

export async function getDashboardMetricsHandler(_req, res) {
  try {
    const metrics = await getDashboardMetrics();

    return res.status(200).json({
      ok: true,
      data: metrics
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}