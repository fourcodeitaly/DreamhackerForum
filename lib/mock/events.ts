import { addDays, addMonths } from "date-fns";

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  type: "workshop" | "seminar" | "conference" | "other";
  organizer: string;
  capacity: number;
  registrationDeadline: Date;
  imageUrl?: string;
}

export function getMockEvents(): Event[] {
  const now = new Date();

  return [
    {
      id: "2",
      title: "AI in Education Seminar",
      description:
        "Explore how artificial intelligence is transforming education. Join us for an insightful discussion with industry experts.",
      startDate: addDays(now, 14),
      endDate: addDays(now, 14),
      location: "Conference Hall",
      type: "seminar",
      organizer: "AI Research Center",
      capacity: 100,
      registrationDeadline: addDays(now, 12),
      imageUrl:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: "3",
      title: "Annual Tech Conference",
      description:
        "Join us for our biggest tech event of the year! Featuring keynote speakers, workshops, and networking opportunities.",
      startDate: addMonths(now, 1),
      endDate: addDays(addMonths(now, 1), 2),
      location: "Grand Convention Center",
      type: "conference",
      organizer: "Tech Department",
      capacity: 500,
      registrationDeadline: addDays(now, 20),
      imageUrl:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: "5",
      title: "Cybersecurity Awareness Seminar",
      description:
        "Learn about the latest cybersecurity threats and best practices to protect yourself and your organization.",
      startDate: addDays(now, 28),
      endDate: addDays(now, 28),
      location: "Room 305, Main Building",
      type: "seminar",
      organizer: "IT Security Department",
      capacity: 50,
      registrationDeadline: addDays(now, 26),
      imageUrl:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    },
  ];
}
