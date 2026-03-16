import { db } from '../../config/db.js';

export async function getClientByIdForSoftwareProject(clientId) {
  const query = `
    SELECT id, is_active
    FROM clients
    WHERE id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [clientId]);
  return result.rows[0] ?? null;
}

export async function getQuoteByIdForSoftwareProject(quoteId) {
  const query = `
    SELECT id, client_id, status
    FROM quotes
    WHERE id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [quoteId]);
  return result.rows[0] ?? null;
}

export async function createSoftwareProject(data) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const projectResult = await client.query(
      `
        INSERT INTO software_projects (
          client_id,
          quote_id,
          name,
          project_type,
          stack,
          description,
          scope,
          start_date,
          estimated_delivery_date,
          total_cost,
          status,
          notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'quotation', $11)
        RETURNING *
      `,
      [
        data.client_id,
        data.quote_id ?? null,
        data.name,
        data.project_type,
        data.stack,
        data.description ?? null,
        data.scope ?? null,
        data.start_date ?? null,
        data.estimated_delivery_date ?? null,
        data.total_cost,
        data.notes ?? null
      ]
    );

    const project = projectResult.rows[0];

    await client.query(
      `
        INSERT INTO client_history (
          client_id,
          event_type,
          reference_type,
          reference_id,
          description
        )
        VALUES ($1, $2, $3, $4, $5)
      `,
      [
        data.client_id,
        'software_project_created',
        'software_project',
        project.id,
        `Software project ${project.name} was created`
      ]
    );

    await client.query('COMMIT');
    return project;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getAllSoftwareProjects() {
  const query = `
    SELECT
      sp.*,
      c.client_type,
      c.first_name,
      c.last_name,
      c.company_name,
      c.email AS client_email
    FROM software_projects sp
    INNER JOIN clients c ON c.id = sp.client_id
    ORDER BY sp.created_at DESC
  `;

  const result = await db.query(query);
  return result.rows;
}

export async function getSoftwareProjectById(id) {
  const query = `
    SELECT
      sp.*,
      c.client_type,
      c.first_name,
      c.last_name,
      c.company_name,
      c.email AS client_email
    FROM software_projects sp
    INNER JOIN clients c ON c.id = sp.client_id
    WHERE sp.id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] ?? null;
}

export async function updateSoftwareProjectStatus({ projectId, status, changedByUserId }) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const currentProjectResult = await client.query(
      `
        SELECT id, client_id, name, status
        FROM software_projects
        WHERE id = $1
        LIMIT 1
      `,
      [projectId]
    );

    const currentProject = currentProjectResult.rows[0] ?? null;

    if (!currentProject) {
      await client.query('ROLLBACK');
      return null;
    }

    const updateResult = await client.query(
      `
        UPDATE software_projects
        SET
          status = $2,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [projectId, status]
    );

    const updatedProject = updateResult.rows[0];

    await client.query(
      `
        INSERT INTO client_history (
          client_id,
          event_type,
          reference_type,
          reference_id,
          description
        )
        VALUES ($1, $2, $3, $4, $5)
      `,
      [
        currentProject.client_id,
        'software_project_status_changed',
        'software_project',
        currentProject.id,
        `Software project ${currentProject.name} status changed from ${currentProject.status} to ${status} by user ${changedByUserId}`
      ]
    );

    await client.query('COMMIT');

    return {
      previousStatus: currentProject.status,
      project: updatedProject
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}