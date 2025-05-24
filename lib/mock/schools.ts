export interface School {
  id: string;
  name: string;
  code: string;
  description: string;
  location: string;
  website: string;
  logo_url: string;
  type: "university" | "college" | "high_school";
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  founded_year: number;
  student_count: number;
  faculty_count: number;
  programs: string[];
  facilities: string[];
  achievements: string[];
  social_media: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  images: {
    id: string;
    url: string;
    type: "campus" | "building" | "event" | "other";
  }[];
  created_at: Date;
  updated_at: Date;
}

export const mockSchools: School[] = [
  {
    id: "1",
    name: "Harvard University",
    code: "HARV",
    description:
      "Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Established in 1636, it is the oldest institution of higher learning in the United States.",
    location: "Cambridge, Massachusetts",
    website: "https://www.harvard.edu",
    logo_url: "/images/schools/harvard-logo.png",
    type: "university",
    country: "United States",
    city: "Cambridge",
    address: "Massachusetts Hall, Cambridge, MA 02138",
    phone: "+1 (617) 495-1000",
    email: "info@harvard.edu",
    founded_year: 1636,
    student_count: 21648,
    faculty_count: 2400,
    programs: [
      "Computer Science",
      "Business Administration",
      "Law",
      "Medicine",
      "Engineering",
    ],
    facilities: [
      "Research Laboratories",
      "Sports Complex",
      "Library System",
      "Student Center",
      "Medical Center",
    ],
    achievements: [
      "Nobel Prize Winners",
      "Pulitzer Prize Winners",
      "Rhodes Scholars",
      "Olympic Medalists",
    ],
    social_media: {
      facebook: "https://facebook.com/harvard",
      twitter: "https://twitter.com/harvard",
      instagram: "https://instagram.com/harvard",
      linkedin: "https://linkedin.com/school/harvard",
    },
    images: [
      {
        id: "1",
        url: "/images/schools/harvard-campus.jpg",
        type: "campus",
      },
      {
        id: "2",
        url: "/images/schools/harvard-library.jpg",
        type: "building",
      },
    ],
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Stanford University",
    code: "STAN",
    description:
      "Stanford University is a private research university in Stanford, California. Known for its entrepreneurial character and relationship with Silicon Valley.",
    location: "Stanford, California",
    website: "https://www.stanford.edu",
    logo_url: "/images/schools/stanford-logo.png",
    type: "university",
    country: "United States",
    city: "Stanford",
    address: "450 Serra Mall, Stanford, CA 94305",
    phone: "+1 (650) 723-2300",
    email: "info@stanford.edu",
    founded_year: 1885,
    student_count: 17249,
    faculty_count: 2100,
    programs: [
      "Computer Science",
      "Engineering",
      "Business",
      "Medicine",
      "Law",
    ],
    facilities: [
      "Research Centers",
      "Athletic Facilities",
      "Libraries",
      "Arts Center",
      "Medical Center",
    ],
    achievements: [
      "Nobel Laureates",
      "Turing Award Winners",
      "Olympic Champions",
      "Entrepreneurs",
    ],
    social_media: {
      facebook: "https://facebook.com/stanford",
      twitter: "https://twitter.com/stanford",
      instagram: "https://instagram.com/stanford",
      linkedin: "https://linkedin.com/school/stanford",
    },
    images: [
      {
        id: "3",
        url: "/images/schools/stanford-campus.jpg",
        type: "campus",
      },
      {
        id: "4",
        url: "/images/schools/stanford-quad.jpg",
        type: "building",
      },
    ],
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "MIT",
    code: "MIT",
    description:
      "The Massachusetts Institute of Technology is a private research university in Cambridge, Massachusetts. Known for its research and education in physical sciences and engineering.",
    location: "Cambridge, Massachusetts",
    website: "https://www.mit.edu",
    logo_url: "/images/schools/mit-logo.png",
    type: "university",
    country: "United States",
    city: "Cambridge",
    address: "77 Massachusetts Ave, Cambridge, MA 02139",
    phone: "+1 (617) 253-1000",
    email: "info@mit.edu",
    founded_year: 1861,
    student_count: 11520,
    faculty_count: 1100,
    programs: [
      "Engineering",
      "Computer Science",
      "Physics",
      "Mathematics",
      "Architecture",
    ],
    facilities: [
      "Research Laboratories",
      "Innovation Hub",
      "Media Lab",
      "Sports Center",
      "Museum",
    ],
    achievements: [
      "Nobel Prize Winners",
      "National Medal of Science",
      "Turing Award Winners",
      "Space Missions",
    ],
    social_media: {
      facebook: "https://facebook.com/mit",
      twitter: "https://twitter.com/mit",
      instagram: "https://instagram.com/mit",
      linkedin: "https://linkedin.com/school/mit",
    },
    images: [
      {
        id: "5",
        url: "/images/schools/mit-campus.jpg",
        type: "campus",
      },
      {
        id: "6",
        url: "/images/schools/mit-dome.jpg",
        type: "building",
      },
    ],
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
];
