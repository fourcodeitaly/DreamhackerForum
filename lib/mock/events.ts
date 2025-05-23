import { addDays, addMonths } from "date-fns";
import { Event } from "../db/events/event-modify";

// export interface Event {
//   id: string;
//   title: string;
//   description: string;
//   startDate: Date;
//   endDate: Date;
//   location: string;
//   type: "workshop" | "seminar" | "conference" | "meetup";
//   capacity: number | null;
//   isVirtual: boolean;
//   virtualMeetingLink?: string;
//   imageUrl?: string;
//   isPublished: boolean;
//   organizerName: string;
//   organizerEmail: string;
//   organizerPhone: string;
//   organizerWebsite: string;
//   organizerLogo?: string;
//   organizerDescription: string;
//   organizerLocation: string;
//   registrationUrl: string;
//   registrationDeadline: Date;
//   registrationFee: number;
//   registrationCurrency: string;
//   registrationType: "free" | "paid" | "invitation";
//   registrationStatus: "open" | "closed" | "waitlist";
// }

export function getMockEvents(): Event[] {
  const now = new Date();

  return [
    {
      id: "2",
      title: "AI in Education Seminar",
      description:
        "Explore how artificial intelligence is transforming education. Join us for an insightful discussion with industry experts.",
      start_date: addDays(now, 14),
      end_date: addDays(now, 14),
      location: "Conference Hall",
      type: "seminar",
      capacity: 100,
      is_virtual: false,
      image_url:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
      is_published: true,
      organizer_name: "AI Research Center",
      organizer_email: "contact@airesearch.org",
      organizer_phone: "+1 (555) 123-4567",
      organizer_website: "https://airesearch.org",
      organizer_logo: "https://airesearch.org/logo.png",
      organizer_description:
        "Leading research center focused on AI applications in education",
      organizer_location: "San Francisco, CA",
      registration_url: "https://airesearch.org/events/ai-edu-seminar",
      registration_deadline: addDays(now, 12),
      registration_fee: 0,
      registration_currency: "USD",
      registration_type: "free",
      registration_status: "open",
      registered_count: 0,
      created_user_id: "1",
      status: "upcoming",
      created_at: now,
      updated_at: now,
    },
    {
      id: "3",
      title: "Annual Tech Conference",
      description:
        "Join us for our biggest tech event of the year! Featuring keynote speakers, workshops, and networking opportunities.",
      start_date: addMonths(now, 1),
      end_date: addDays(addMonths(now, 1), 2),
      location: "Grand Convention Center",
      type: "conference",
      capacity: 500,
      is_virtual: false,
      image_url:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
      is_published: true,
      organizer_name: "Tech Department",
      organizer_email: "events@techdept.com",
      organizer_phone: "+1 (555) 987-6543",
      organizer_website: "https://techdept.com",
      organizer_logo: "https://techdept.com/logo.png",
      organizer_description: "Leading technology conference organizer",
      organizer_location: "New York, NY",
      registration_url: "https://techdept.com/annual-conference",
      registration_deadline: addDays(now, 20),
      registration_fee: 299,
      registration_currency: "USD",
      registration_type: "paid",
      registration_status: "open",
      registered_count: 0,
      created_user_id: "1",
      status: "upcoming",
      created_at: now,
      updated_at: now,
    },
    {
      id: "5",
      title: "Cybersecurity Workshop",
      description:
        "Learn about the latest cybersecurity threats and best practices to protect yourself and your organization.",
      start_date: addDays(now, 28),
      end_date: addDays(now, 28),
      location: "Room 305, Main Building",
      type: "workshop",
      capacity: 50,
      is_virtual: true,
      virtual_meeting_link: "https://meet.cybersec.org/workshop",
      image_url:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
      is_published: true,
      organizer_name: "IT Security Department",
      organizer_email: "security@itdept.org",
      organizer_phone: "+1 (555) 456-7890",
      organizer_website: "https://itdept.org/security",
      organizer_logo: "https://itdept.org/security/logo.png",
      organizer_description:
        "Dedicated to improving cybersecurity awareness and practices",
      organizer_location: "Boston, MA",
      registration_url: "https://itdept.org/security/workshop",
      registration_deadline: addDays(now, 26),
      registration_fee: 49,
      registration_currency: "USD",
      registration_type: "paid",
      registration_status: "waitlist",
      registered_count: 0,
      created_user_id: "1",
      status: "upcoming",
      created_at: now,
      updated_at: now,
    },
  ];
}
