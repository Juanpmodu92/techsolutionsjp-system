import { ZodError } from 'zod';
import { handleDatabaseError } from '../../shared/utils/db-error.js';
import {
  createSoftwareProjectSchema,
  updateSoftwareProjectStatusSchema
} from './software-project.schema.js';
import { isValidSoftwareProjectStatusTransition } from './software-project-status.rules.js';
import {
  createSoftwareProject,
  getAllSoftwareProjects,
  getClientByIdForSoftwareProject,
  getQuoteByIdForSoftwareProject,
  getSoftwareProjectById,
  updateSoftwareProjectStatus
} from './software-project.repository.js';

export async function createSoftwareProjectHandler(req, res) {
  try {
    const payload = createSoftwareProjectSchema.parse(req.body);

    const client = await getClientByIdForSoftwareProject(payload.client_id);

    if (!client) {
      return res.status(404).json({
        ok: false,
        message: 'Client not found'
      });
    }

    if (!client.is_active) {
      return res.status(400).json({
        ok: false,
        message: 'Cannot create project for an inactive client'
      });
    }

    if (payload.quote_id) {
      const quote = await getQuoteByIdForSoftwareProject(payload.quote_id);

      if (!quote) {
        return res.status(404).json({
          ok: false,
          message: 'Quote not found'
        });
      }

      if (quote.client_id !== payload.client_id) {
        return res.status(400).json({
          ok: false,
          message: 'Quote does not belong to the provided client'
        });
      }
    }

    const project = await createSoftwareProject(payload);

    return res.status(201).json({
      ok: true,
      data: project
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

export async function getAllSoftwareProjectsHandler(_req, res) {
  try {
    const projects = await getAllSoftwareProjects();

    return res.status(200).json({
      ok: true,
      data: projects
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function getSoftwareProjectByIdHandler(req, res) {
  try {
    const project = await getSoftwareProjectById(req.params.id);

    if (!project) {
      return res.status(404).json({
        ok: false,
        message: 'Software project not found'
      });
    }

    return res.status(200).json({
      ok: true,
      data: project
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function updateSoftwareProjectStatusHandler(req, res) {
  try {
    const { id } = req.params;
    const payload = updateSoftwareProjectStatusSchema.parse(req.body);

    const existingProject = await getSoftwareProjectById(id);

    if (!existingProject) {
      return res.status(404).json({
        ok: false,
        message: 'Software project not found'
      });
    }

    if (existingProject.status === payload.status) {
      return res.status(400).json({
        ok: false,
        message: 'Software project already has that status'
      });
    }

    const isAllowed = isValidSoftwareProjectStatusTransition(
      existingProject.status,
      payload.status
    );

    if (!isAllowed) {
      return res.status(400).json({
        ok: false,
        message: `Invalid status transition from ${existingProject.status} to ${payload.status}`
      });
    }

    const result = await updateSoftwareProjectStatus({
      projectId: id,
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