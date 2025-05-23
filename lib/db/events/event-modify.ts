"use server";

import { queryOne, transaction } from "../postgres";
import { getServerUser } from "@/lib/supabase/server";

export interface Event {
  id: string;
  schoolcode?: string;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  location: string;
  type: string;
  capacity?: number;
  registered_count: number;
  is_virtual: boolean;
  virtual_meeting_link?: string;
  image_url?: string;
  is_published: boolean;
  created_user_id: string;
  organizer_name?: string;
  organizer_email?: string;
  organizer_phone?: string;
  organizer_website?: string;
  organizer_logo?: string;
  organizer_description?: string;
  organizer_location?: string;
  registration_url?: string;
  registration_deadline: Date;
  registration_fee: number;
  registration_currency: string;
  registration_type: string;
  images: {
    id: string;
    image_url: string;
    display_order: number;
  }[];
  registration_status: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export async function createEvent(
  eventData: Omit<
    Event,
    "id" | "created_at" | "updated_at" | "registered_count" | "status"
  >
): Promise<Event | null> {
  try {
    return await transaction(async (client) => {
      const now = new Date().toISOString();

      const sql = `
        INSERT INTO events (
          schoolcode, title, description, start_date, end_date,
          location, type, capacity, is_virtual, virtual_meeting_link,
          image_url, is_published, created_user_id, organizer_name,
          organizer_email, organizer_phone, organizer_website,
          organizer_logo, organizer_description, organizer_location,
          registration_url, registration_deadline, registration_fee,
          registration_currency, registration_type, registration_status,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26, $27, $28
        )
        RETURNING *
      `;

      const values = [
        eventData.schoolcode || null,
        eventData.title,
        eventData.description,
        eventData.start_date,
        eventData.end_date,
        eventData.location,
        eventData.type,
        eventData.capacity || null,
        eventData.is_virtual,
        eventData.virtual_meeting_link || null,
        eventData.image_url || null,
        eventData.is_published,
        eventData.created_user_id,
        eventData.organizer_name,
        eventData.organizer_email,
        eventData.organizer_phone,
        eventData.organizer_website,
        eventData.organizer_logo,
        eventData.organizer_description,
        eventData.organizer_location,
        eventData.registration_url,
        eventData.registration_deadline,
        eventData.registration_fee,
        eventData.registration_currency,
        eventData.registration_type,
        eventData.registration_status,
        now,
        now,
      ];

      const event = await queryOne<Event>(sql, values);

      //   if (event) {
      //     await createActivity(
      //       eventData.created_user_id,
      //       "event_created",
      //       event.id.toString(),
      //       "event",
      //       undefined,
      //       {
      //         content: `New event created: ${event.title}`,
      //       }
      //     );
      //   }

      return event;
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return null;
  }
}

export async function updateEvent(
  eventId: string,
  eventData: Partial<
    Omit<
      Event,
      "id" | "created_at" | "updated_at" | "registered_count" | "status"
    >
  >
): Promise<Event | null> {
  try {
    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Add each field to the update query if it exists
    Object.entries(eventData).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    // Add updated_at timestamp
    updates.push(`updated_at = $${paramIndex}`);
    values.push(new Date().toISOString());
    paramIndex++;

    // Add the event ID as the last parameter
    values.push(eventId);

    // Construct the final query
    const sql = `
      UPDATE events 
      SET ${updates.join(", ")} 
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const event = await queryOne<Event>(sql, values);

    // if (event) {
    //   await createActivity(
    //     event.created_user_id,
    //     "event_updated",
    //     event.id.toString(),
    //     "event",
    //     undefined,
    //     {
    //       content: `Event updated: ${event.title}`,
    //     }
    //   );
    // }

    return event;
  } catch (error) {
    console.error("Error updating event:", error);
    return null;
  }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    return await transaction(async (client) => {
      const user = await getServerUser();

      if (!user) {
        throw new Error("User not found");
      }

      if (user.role !== "admin" && user.id !== eventId) {
        throw new Error("User is not an admin or the owner of the event");
      }

      const sql = `
      DELETE FROM events
      WHERE id = $1
      RETURNING id
    `;
      const result = await queryOne<{ id: string }>(sql, [eventId]);
      return !!result;
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
}
