import { ZodError } from 'zod';
import { handleDatabaseError } from '../../shared/utils/db-error.js';
import {
  createServiceSchema,
  updateServiceSchema
} from './service.schema.js';
import {
  createService,
  deactivateService,
  getAllServices,
  getServiceById,
  updateService
} from './service.repository.js';

export async function createServiceHandler(req, res) {
  try {
    const payload = createServiceSchema.parse(req.body);
    const service = await createService(payload);

    return res.status(201).json({
      ok: true,
      data: service
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

export async function getAllServicesHandler(req, res) {
  try {
    const search = req.query.search ?? '';
    const services = await getAllServices(search);

    return res.status(200).json({
      ok: true,
      data: services
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function getServiceByIdHandler(req, res) {
  try {
    const service = await getServiceById(req.params.id);

    if (!service) {
      return res.status(404).json({
        ok: false,
        message: 'Service not found'
      });
    }

    return res.status(200).json({
      ok: true,
      data: service
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function updateServiceHandler(req, res) {
  try {
    const payload = updateServiceSchema.parse(req.body);
    const service = await updateService(req.params.id, payload);

    if (!service) {
      return res.status(404).json({
        ok: false,
        message: 'Service not found'
      });
    }

    return res.status(200).json({
      ok: true,
      data: service
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

export async function deactivateServiceHandler(req, res) {
  try {
    const service = await deactivateService(req.params.id);

    if (!service) {
      return res.status(404).json({
        ok: false,
        message: 'Service not found'
      });
    }

    return res.status(200).json({
      ok: true,
      data: service
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}