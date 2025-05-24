export interface Scholarship {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: "full" | "partial";
  deadline: Date;
  country: string;
  imageUrl: string;
}

export async function getMockScholarships(): Promise<Scholarship[]> {
  return [
    {
      id: "1",
      title: "Merit Scholarship Program",
      description:
        "Full scholarship for outstanding academic achievements and leadership potential.",
      amount: 25000,
      type: "full",
      deadline: new Date("2024-12-31"),
      country: "United States",
      imageUrl:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: "2",
      title: "International Student Grant",
      description:
        "Partial scholarship for international students pursuing undergraduate studies.",
      amount: 15000,
      type: "partial",
      deadline: new Date("2024-10-15"),
      country: "United Kingdom",
      imageUrl:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: "3",
      title: "STEM Excellence Award",
      description:
        "Full scholarship for students pursuing degrees in Science, Technology, Engineering, or Mathematics.",
      amount: 30000,
      type: "full",
      deadline: new Date("2024-11-30"),
      country: "Australia",
      imageUrl:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: "4",
      title: "Arts and Humanities Fellowship",
      description:
        "Partial scholarship for students in Arts and Humanities programs.",
      amount: 10000,
      type: "partial",
      deadline: new Date("2024-09-30"),
      country: "Canada",
      imageUrl:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60",
    },
  ];
}
