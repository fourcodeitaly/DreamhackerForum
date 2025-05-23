import { createClient } from "@/lib/supabase/server";

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: "online" | "offline";
  link: string;
}

export async function getUpcomingEvents(limit: number = 3): Promise<Event[]> {
  const supabase = createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .gte("date", new Date().toISOString())
    .order("date", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return events.map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    location: event.location,
    type: event.type,
    link: `/events/${event.id}`,
  }));
}
