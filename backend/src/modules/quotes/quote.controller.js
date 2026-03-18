import { ZodError } from 'zod';
import { handleDatabaseError } from '../../shared/utils/db-error.js';
import { generateQuotePdf } from './quote-pdf.service.js';
import {
  createQuoteSchema,
  updateQuoteStatusSchema
} from './quote.schema.js';
import { isValidQuoteStatusTransition } from './quote-status.rules.js';
import { calculateQuoteTotals } from './quote.utils.js';
import {
  createQuoteWithItems,
  getActiveProductById,
  getActiveServiceById,
  getAllQuotes,
  getClientByIdForQuote,
  getQuoteById,
  updateQuoteStatus
} from './quote.repository.js';

export async function createQuoteHandler(req, res) {
  try {
    const payload = createQuoteSchema.parse(req.body);

    const client = await getClientByIdForQuote(payload.client_id);

    if (!client) {
      return res.status(404).json({
        ok: false,
        message: 'Client not found'
      });
    }

    if (!client.is_active) {
      return res.status(400).json({
        ok: false,
        message: 'Cannot create quote for an inactive client'
      });
    }

    for (const item of payload.items) {
      if (item.item_type === 'product') {
        const product = await getActiveProductById(item.reference_id);

        if (!product) {
          return res.status(404).json({
            ok: false,
            message: `Referenced product not found: ${item.reference_id}`
          });
        }

        if (!product.is_active) {
          return res.status(400).json({
            ok: false,
            message: `Referenced product is inactive: ${item.reference_id}`
          });
        }
      }

      if (item.item_type === 'service') {
        const service = await getActiveServiceById(item.reference_id);

        if (!service) {
          return res.status(404).json({
            ok: false,
            message: `Referenced service not found: ${item.reference_id}`
          });
        }

        if (!service.is_active) {
          return res.status(400).json({
            ok: false,
            message: `Referenced service is inactive: ${item.reference_id}`
          });
        }
      }
    }

    const totals = calculateQuoteTotals(
      payload.items,
      payload.discount,
      payload.tax
    );

    const quote = await createQuoteWithItems({
      client_id: payload.client_id,
      user_id: req.user.id,
      expiration_date: payload.expiration_date ?? null,
      notes: payload.notes ?? null,
      ...totals
    });

    return res.status(201).json({
      ok: true,
      data: quote
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

export async function getAllQuotesHandler(_req, res) {
  try {
    const quotes = await getAllQuotes();

    return res.status(200).json({
      ok: true,
      data: quotes
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function getQuoteByIdHandler(req, res) {
  try {
    const quote = await getQuoteById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        ok: false,
        message: 'Quote not found'
      });
    }

    return res.status(200).json({
      ok: true,
      data: quote
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function updateQuoteStatusHandler(req, res) {
  try {
    const { id } = req.params;
    const payload = updateQuoteStatusSchema.parse(req.body);

    const existingQuote = await getQuoteById(id);

    if (!existingQuote) {
      return res.status(404).json({
        ok: false,
        message: 'Quote not found'
      });
    }

    if (existingQuote.status === payload.status) {
      return res.status(400).json({
        ok: false,
        message: 'Quote already has that status'
      });
    }

    const isAllowed = isValidQuoteStatusTransition(
      existingQuote.status,
      payload.status
    );

    if (!isAllowed) {
      return res.status(400).json({
        ok: false,
        message: `Invalid status transition from ${existingQuote.status} to ${payload.status}`
      });
    }

    const result = await updateQuoteStatus({
      quoteId: id,
      status: payload.status,
      changedByUserId: req.user.id
    });

    return res.status(200).json({
      ok: true,
      data: result
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

export async function getQuotePdfHandler(req, res) {
  try {
    const quote = await getQuoteById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        ok: false,
        message: 'Quote not found'
      });
    }

    return generateQuotePdf(quote, res);
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}