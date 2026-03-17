import { ZodError } from 'zod';
import { handleDatabaseError } from '../../shared/utils/db-error.js';
import {
  createTechnicalServiceSchema,
  updateTechnicalServiceStatusSchema
} from './technical-service.schema.js';
import { isValidTechnicalServiceStatusTransition } from './technical-service-status.rules.js';
import {
  createTechnicalService,
  getAllTechnicalServices,
  getClientByIdForTechnicalService,
  getProductByIdForTechnicalService,
  getTechnicalServiceById,
  getUserByIdForTechnicalService,
  updateTechnicalServiceStatus
} from './technical-service.repository.js';

export async function createTechnicalServiceHandler(req, res) {
  try {
    const payload = createTechnicalServiceSchema.parse(req.body);

    const client = await getClientByIdForTechnicalService(payload.client_id);

    if (!client) {
      return res.status(404).json({
        ok: false,
        message: 'Client not found'
      });
    }

    if (!client.is_active) {
      return res.status(400).json({
        ok: false,
        message: 'Cannot create technical service for an inactive client'
      });
    }

    if (payload.related_product_id) {
      const product = await getProductByIdForTechnicalService(
        payload.related_product_id
      );

      if (!product) {
        return res.status(404).json({
          ok: false,
          message: 'Related product not found'
        });
      }
    }

    if (payload.assigned_user_id) {
      const assignedUser = await getUserByIdForTechnicalService(
        payload.assigned_user_id
      );

      if (!assignedUser) {
        return res.status(404).json({
          ok: false,
          message: 'Assigned user not found'
        });
      }

      if (!assignedUser.is_active) {
        return res.status(400).json({
          ok: false,
          message: 'Assigned user is inactive'
        });
      }
    }

    const technicalService = await createTechnicalService({
      ...payload,
      received_by_user_id: req.user.id
    });

    return res.status(201).json({
      ok: true,
      data: technicalService
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

export async function getAllTechnicalServicesHandler(_req, res) {
  try {
    const technicalServices = await getAllTechnicalServices();

    return res.status(200).json({
      ok: true,
      data: technicalServices
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function getTechnicalServiceByIdHandler(req, res) {
  try {
    const technicalService = await getTechnicalServiceById(req.params.id);

    if (!technicalService) {
      return res.status(404).json({
        ok: false,
        message: 'Technical service not found'
      });
    }

    return res.status(200).json({
      ok: true,
      data: technicalService
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function updateTechnicalServiceStatusHandler(req, res) {
  try {
    const { id } = req.params;
    const payload = updateTechnicalServiceStatusSchema.parse(req.body);

    const existingTechnicalService = await getTechnicalServiceById(id);

    if (!existingTechnicalService) {
      return res.status(404).json({
        ok: false,
        message: 'Technical service not found'
      });
    }

    if (existingTechnicalService.status === payload.status) {
      return res.status(400).json({
        ok: false,
        message: 'Technical service already has that status'
      });
    }

    const isAllowed = isValidTechnicalServiceStatusTransition(
      existingTechnicalService.status,
      payload.status
    );

    if (!isAllowed) {
      return res.status(400).json({
        ok: false,
        message: `Invalid status transition from ${existingTechnicalService.status} to ${payload.status}`
      });
    }

    const result = await updateTechnicalServiceStatus({
      technicalServiceId: id,
      status: payload.status,
      changedByUserId: req.user.id
    });

    return res.status(200).json({
      ok: true,
      data: result
    });
  } catch (error) {
    console.error('updateTechnicalServiceStatusHandler error:', error);
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