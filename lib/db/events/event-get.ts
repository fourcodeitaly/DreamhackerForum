"use server";

import { query, queryOne } from "../postgres";
import { Event } from "./event-modify";

export interface PaginatedEvents {
  events: Event[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getEventById(id: string): Promise<Event | null> {
  const sql = `
    SELECT 
      e.*,
      (
        SELECT json_agg(
          json_build_object(
            'id', ei.id,
            'image_url', ei.image_url,
            'display_order', ei.display_order
          ) ORDER BY ei.display_order
        )
        FROM event_images ei
        WHERE ei.event_id = e.id
      ) as images
    FROM events e
    LEFT JOIN users u ON e.created_user_id = u.id
    WHERE e.id = $1
  `;
  return await queryOne<Event>(sql, [id]);
}

export async function getEvents(
  options: {
    page?: number;
    limit?: number;
    type?: string;
    isVirtual?: boolean;
    isPublished?: boolean;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
    schoolcode?: string;
    isPinned?: boolean;
  } = {}
): Promise<PaginatedEvents> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT 
      e.*,
      (
        SELECT json_agg(
          json_build_object(
            'id', ei.id,
            'image_url', ei.image_url,
            'display_order', ei.display_order
          ) ORDER BY ei.display_order
        )
        FROM event_images ei
        WHERE ei.event_id = e.id
      ) as images
    FROM events e
    WHERE e.is_published = true
  `;
  const params: any[] = [];

  if (options.type) {
    sql += ` AND e.type = $${params.length + 1}`;
    params.push(options.type);
  }

  if (options.isVirtual !== undefined) {
    sql += ` AND e.is_virtual = $${params.length + 1}`;
    params.push(options.isVirtual);
  }

  if (options.isPublished !== undefined) {
    sql += ` AND e.is_published = $${params.length + 1}`;
    params.push(options.isPublished);
  }

  if (options.status) {
    sql += ` AND e.status = $${params.length + 1}`;
    params.push(options.status);
  }

  if (options.startDate) {
    sql += ` AND e.start_date >= $${params.length + 1}`;
    params.push(options.startDate);
  }

  if (options.endDate) {
    sql += ` AND e.end_date <= $${params.length + 1}`;
    params.push(options.endDate);
  }

  if (options.search) {
    sql += ` AND (
      e.title ILIKE $${params.length + 1} OR
      e.description ILIKE $${params.length + 1} OR
      e.organizer_name ILIKE $${params.length + 1}
    )`;
    params.push(`%${options.search}%`);
  }

  if (options.schoolcode) {
    sql += ` AND e.schoolcode = $${params.length + 1}`;
    params.push(options.schoolcode);
  }

  if (options.isPinned !== undefined) {
    sql += ` AND e.is_pinned = $${params.length + 1}`;
    params.push(options.isPinned);
  }

  // Get total count for pagination
  const countSql = sql.replace(/SELECT.*FROM/, "SELECT COUNT(*) as total FROM");
  const result = await query<{ total: number }>(countSql, params);

  if (result.length === 0) {
    return {
      events: [],
      pagination: { total: 0, page, limit, totalPages: 0 },
    };
  }

  // Add ordering and pagination
  sql += `
    ORDER BY e.start_date ASC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;
  params.push(limit, offset);

  const events = await query<Event>(sql, params);

  return {
    events,
    pagination: {
      total: result[0].total,
      page,
      limit,
      totalPages: Math.ceil(result[0].total / limit),
    },
  };
}

export async function getUpcomingEvents(limit: number = 5): Promise<Event[]> {
  const sql = `
    SELECT 
      e.*,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'username', u.username,
        'image_url', u.image_url
      ) as organizer
    FROM events e
    LEFT JOIN users u ON e.created_user_id = u.id
    WHERE e.start_date > CURRENT_TIMESTAMP
      AND e.is_published = true
    ORDER BY e.start_date ASC
    LIMIT $1
  `;
  return await query<Event>(sql, [limit]);
}

export async function getEventsByOrganizer(
  organizerId: string,
  options: {
    page?: number;
    limit?: number;
    isPublished?: boolean;
  } = {}
): Promise<PaginatedEvents> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT 
      e.*,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'username', u.username,
        'image_url', u.image_url
      ) as organizer
    FROM events e
    LEFT JOIN users u ON e.created_user_id = u.id
    WHERE e.created_user_id = $1
  `;
  const params: any[] = [organizerId];

  if (options.isPublished !== undefined) {
    sql += ` AND e.is_published = $${params.length + 1}`;
    params.push(options.isPublished);
  }

  // Get total count for pagination
  const countSql = sql.replace(/SELECT.*FROM/, "SELECT COUNT(*) as total FROM");
  const [{ total }] = await query<{ total: string }>(countSql, params);

  // Add ordering and pagination
  sql += `
    ORDER BY e.start_date DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;
  params.push(limit, offset);

  const events = await query<Event>(sql, params);

  return {
    events,
    pagination: {
      total: parseInt(total),
      page,
      limit,
      totalPages: Math.ceil(parseInt(total) / limit),
    },
  };
}

export async function getEventsBySchool(
  schoolcode: string,
  options: {
    page?: number;
    limit?: number;
    isPublished?: boolean;
  } = {}
): Promise<PaginatedEvents> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT 
      e.*,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'username', u.username,
        'image_url', u.image_url
      ) as organizer
    FROM events e
    LEFT JOIN users u ON e.created_user_id = u.id
    WHERE e.schoolcode = $1
  `;
  const params: any[] = [schoolcode];

  if (options.isPublished !== undefined) {
    sql += ` AND e.is_published = $${params.length + 1}`;
    params.push(options.isPublished);
  }

  // Get total count for pagination
  const countSql = sql.replace(/SELECT.*FROM/, "SELECT COUNT(*) as total FROM");
  const [{ total }] = await query<{ total: string }>(countSql, params);

  // Add ordering and pagination
  sql += `
    ORDER BY e.start_date DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;
  params.push(limit, offset);

  const events = await query<Event>(sql, params);

  return {
    events,
    pagination: {
      total: parseInt(total),
      page,
      limit,
      totalPages: Math.ceil(parseInt(total) / limit),
    },
  };
}
