import { ZodError } from 'zod';
import {
  createClient,
  getAllClients,
  getClientById
} from './client.repository.js';
import { createClientSchema } from './client.schema.js';

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

    return res.status(500).json({
      ok: false,
      message: 'Internal server error'
    });
  }
}

export async function getAllClientsHandler(_req, res) {
  try {
    const clients = await getAllClients();

    return res.status(200).json({
      ok: true,
      data: clients
    });
  } catch (_error) {
    return res.status(500).json({
      ok: false,
      message: 'Internal server error'
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
  } catch (_error) {
    return res.status(500).json({
      ok: false,
      message: 'Internal server error'
    });
  }
}