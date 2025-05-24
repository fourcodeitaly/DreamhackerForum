export interface School {
  id: string;
  name: string;
  logo: string;
  location: string;
  founded: number;
  type: "public" | "private";
  ranking: number;
  totalStudents: number;
  acceptanceRate: number;
  averageGPA: number;
  averageSAT: number;
  averageACT: number;
  tuition: {
    inState: number;
    outState: number;
    international: number;
  };
  popularMajors: string[];
  campusLife: {
    studentClubs: number;
    sportsTeams: number;
    housingOptions: string[];
  };
  description: string;
  website: string;
  images: string[];
}

export async function getMockSchools(): Promise<School[]> {
  return [
    {
      id: "1",
      name: "Stanford University",
      logo: "https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/block-s-right.png",
      location: "Stanford, California",
      founded: 1891,
      type: "private",
      ranking: 2,
      totalStudents: 17249,
      acceptanceRate: 4.3,
      averageGPA: 3.96,
      averageSAT: 1505,
      averageACT: 34,
      tuition: {
        inState: 56169,
        outState: 56169,
        international: 56169,
      },
      popularMajors: [
        "Computer Science",
        "Engineering",
        "Biology",
        "Economics",
        "Psychology",
      ],
      campusLife: {
        studentClubs: 650,
        sportsTeams: 36,
        housingOptions: ["Residential Colleges", "Apartments", "Greek Housing"],
      },
      description:
        "Stanford University is one of the world's leading research and teaching institutions. It is known for its entrepreneurial character, drawn from the legacy of its founders, Jane and Leland Stanford, and its relationship to Silicon Valley.",
      website: "https://www.stanford.edu",
      images: [
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60",
      ],
    },
    {
      id: "2",
      name: "Massachusetts Institute of Technology",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png",
      location: "Cambridge, Massachusetts",
      founded: 1861,
      type: "private",
      ranking: 1,
      totalStudents: 11574,
      acceptanceRate: 4.1,
      averageGPA: 3.97,
      averageSAT: 1540,
      averageACT: 35,
      tuition: {
        inState: 53790,
        outState: 53790,
        international: 53790,
      },
      popularMajors: [
        "Computer Science",
        "Engineering",
        "Mathematics",
        "Physics",
        "Economics",
      ],
      campusLife: {
        studentClubs: 450,
        sportsTeams: 33,
        housingOptions: [
          "Residential Halls",
          "Greek Housing",
          "Independent Living",
        ],
      },
      description:
        "MIT is a world-renowned institute of technology and research, known for its cutting-edge research and innovation in science, engineering, and technology.",
      website: "https://www.mit.edu",
      images: [
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60",
      ],
    },
    {
      id: "3",
      name: "University of California, Berkeley",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Seal_of_University_of_California%2C_Berkeley.svg/1200px-Seal_of_University_of_California%2C_Berkeley.svg.png",
      location: "Berkeley, California",
      founded: 1868,
      type: "public",
      ranking: 22,
      totalStudents: 42347,
      acceptanceRate: 14.5,
      averageGPA: 3.89,
      averageSAT: 1415,
      averageACT: 31,
      tuition: {
        inState: 14431,
        outState: 44207,
        international: 44207,
      },
      popularMajors: [
        "Computer Science",
        "Engineering",
        "Business",
        "Biology",
        "Political Science",
      ],
      campusLife: {
        studentClubs: 1000,
        sportsTeams: 30,
        housingOptions: ["Residence Halls", "Apartments", "Greek Housing"],
      },
      description:
        "UC Berkeley is a public research university and the flagship campus of the University of California system. It is known for its academic excellence and social activism.",
      website: "https://www.berkeley.edu",
      images: [
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60",
      ],
    },
  ];
}
