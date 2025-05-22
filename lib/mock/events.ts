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
      id: "1",
      title: "Web Development Workshop",
      description:
        "Learn the fundamentals of web development including HTML, CSS, and JavaScript. This hands-on workshop will cover modern web development practices and tools.",
      startDate: addDays(now, 7),
      endDate: addDays(now, 7),
      location: "Room 101, Main Building",
      type: "workshop",
      organizer: "Tech Department",
      capacity: 30,
      registrationDeadline: addDays(now, 5),
      imageUrl:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
    },
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
      id: "4",
      title: "Mobile App Development Workshop",
      description:
        "Learn to build cross-platform mobile applications using React Native. Perfect for beginners and intermediate developers.",
      startDate: addDays(now, 21),
      endDate: addDays(now, 21),
      location: "Room 203, Engineering Building",
      type: "workshop",
      organizer: "Mobile Development Team",
      capacity: 25,
      registrationDeadline: addDays(now, 19),
      imageUrl:
        "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=2070&auto=format&fit=crop",
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
