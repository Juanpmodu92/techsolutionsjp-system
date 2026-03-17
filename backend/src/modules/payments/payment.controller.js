import { ZodError } from 'zod';
import { handleDatabaseError } from '../../shared/utils/db-error.js';
import { createPaymentSchema } from './payment.schema.js';
import {
  createPayment,
  getAllPayments,
  getClientByIdForPayment,
  getPaidAmountForSale,
  getPaidAmountForTechnicalService,
  getSaleByIdForPayment,
  getTechnicalServiceByIdForPayment
} from './payment.repository.js';

export async function createPaymentHandler(req, res) {
  try {
    const payload = createPaymentSchema.parse(req.body);

    const client = await getClientByIdForPayment(payload.client_id);

    if (!client) {
      return res.status(404).json({
        ok: false,
        message: 'Client not found'
      });
    }

    if (!client.is_active) {
      return res.status(400).json({
        ok: false,
        message: 'Cannot register payment for an inactive client'
      });
    }

    if (payload.sale_id) {
      const sale = await getSaleByIdForPayment(payload.sale_id);

      if (!sale) {
        return res.status(404).json({
          ok: false,
          message: 'Sale not found'
        });
      }

      if (sale.client_id !== payload.client_id) {
        return res.status(400).json({
          ok: false,
          message: 'Sale does not belong to the provided client'
        });
      }

      const paidAmount = await getPaidAmountForSale(payload.sale_id);
      const remainingAmount = Number(sale.total) - paidAmount;

      if (payload.amount > remainingAmount) {
        return res.status(400).json({
          ok: false,
          message: 'Payment amount exceeds remaining sale balance'
        });
      }
    }

    if (payload.technical_service_id) {
      const technicalService = await getTechnicalServiceByIdForPayment(
        payload.technical_service_id
      );

      if (!technicalService) {
        return res.status(404).json({
          ok: false,
          message: 'Technical service not found'
        });
      }

      if (technicalService.client_id !== payload.client_id) {
        return res.status(400).json({
          ok: false,
          message: 'Technical service does not belong to the provided client'
        });
      }

      const paidAmount = await getPaidAmountForTechnicalService(
        payload.technical_service_id
      );
      const remainingAmount = Number(technicalService.service_cost) - paidAmount;

      if (payload.amount > remainingAmount) {
        return res.status(400).json({
          ok: false,
          message: 'Payment amount exceeds remaining technical service balance'
        });
      }
    }

    const payment = await createPayment({
      ...payload,
      received_by_user_id: req.user.id
    });

    return res.status(201).json({
      ok: true,
      data: payment
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        message: 'Validation error',
        errors: error.flatten()
      });
    }

    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function getAllPaymentsHandler(req, res) {
  try {
    const payments = await getAllPayments({
      saleId: req.query.sale_id ?? '',
      technicalServiceId: req.query.technical_service_id ?? '',
      clientId: req.query.client_id ?? ''
    });

    return res.status(200).json({
      ok: true,
      data: payments
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}