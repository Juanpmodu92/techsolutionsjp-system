import { handleDatabaseError } from '../../shared/utils/db-error.js';
import {
  getInventorySummary,
  getPaymentsSummary,
  getSalesSummary,
  getTechnicalServicesSummary
} from './report.repository.js';

export async function getSalesSummaryHandler(req, res) {
  try {
    const data = await getSalesSummary({
      dateFrom: req.query.date_from ?? '',
      dateTo: req.query.date_to ?? ''
    });

    return res.status(200).json({
      ok: true,
      data
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function getPaymentsSummaryHandler(req, res) {
  try {
    const data = await getPaymentsSummary({
      dateFrom: req.query.date_from ?? '',
      dateTo: req.query.date_to ?? ''
    });

    return res.status(200).json({
      ok: true,
      data
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function getInventorySummaryHandler(_req, res) {
  try {
    const data = await getInventorySummary();

    return res.status(200).json({
      ok: true,
      data
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function getTechnicalServicesSummaryHandler(req, res) {
  try {
    const data = await getTechnicalServicesSummary({
      dateFrom: req.query.date_from ?? '',
      dateTo: req.query.date_to ?? ''
    });

    return res.status(200).json({
      ok: true,
      data
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}