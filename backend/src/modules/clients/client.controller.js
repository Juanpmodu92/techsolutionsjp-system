import { ZodError } from 'zod';
import {
  createClient,
  deactivateClient,
  getAllClients,
  getClientById,
  updateClient
} from './client.repository.js';
import {
  createClientSchema,
  updateClientSchema
} from './client.schema.js';
import { handleDatabaseError } from '../../shared/utils/db-error.js';

export async function createClientHandler(req, res) {
  try {
    const payload = createClientSchema.parse(req.body);
    const client = await createClient(payload);

    return res.status(201).json({
      ok: true,
      data: client
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

export async function getAllClientsHandler(req, res) {
  try {
    const search = req.query.search ?? '';
    const clients = await getAllClients(search);

    return res.status(200).json({
      ok: true,
      data: clients
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function getClientByIdHandler(req, res) {
  try {
    const { id } = req.params;
    const client = await getClientById(id);

    if (!client) {
      return res.status(404).json({
        ok: false,
        message: 'Client not found'
      });
    }

    return res.status(200).json({
      ok: true,
      data: client
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function updateClientHandler(req, res) {
  try {
    const { id } = req.params;
    const payload = updateClientSchema.parse(req.body);
    const client = await updateClient(id, payload);

    if (!client) {
      return res.status(404).json({
        ok: false,
        message: 'Client not found'
      });
    }

    return res.status(200).json({
      ok: true,
      data: client
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

export async function deactivateClientHandler(req, res) {
  try {
    const { id } = req.params;
    const client = await deactivateClient(id);

    if (!client) {
      return res.status(404).json({
        ok: false,
        message: 'Client not found'
      });
    }

    return res.status(200).json({
      ok: true,
      data: client
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}