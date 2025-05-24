export interface Scholarship {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  type: "merit" | "need" | "athletic" | "research" | "other";
  deadline: Date;
  requirements: string[];
  eligibility: string[];
  application_process: string[];
  documents_required: string[];
  school_id: string;
  program: string;
  duration: string;
  renewable: boolean;
  international_students: boolean;
  created_at: Date;
  updated_at: Date;
}

export const mockScholarships: Scholarship[] = [
  {
    id: "1",
    title: "Harvard Presidential Scholarship",
    description:
      "The Harvard Presidential Scholarship is awarded to exceptional students who demonstrate outstanding academic achievement and leadership potential.",
    amount: 50000,
    currency: "USD",
    type: "merit",
    deadline: new Date("2024-12-31"),
    requirements: [
      "Minimum GPA of 3.8",
      "SAT score above 1500",
      "Strong leadership experience",
      "Extracurricular activities",
    ],
    eligibility: [
      "Open to all nationalities",
      "Must be applying for undergraduate studies",
      "Must demonstrate financial need",
      "Must have excellent academic record",
    ],
    application_process: [
      "Submit online application",
      "Provide academic transcripts",
      "Submit letters of recommendation",
      "Complete interview process",
    ],
    documents_required: [
      "Academic transcripts",
      "SAT/ACT scores",
      "Letters of recommendation",
      "Personal statement",
      "Financial documents",
    ],
    school_id: "1",
    program: "Undergraduate",
    duration: "4 years",
    renewable: true,
    international_students: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "Stanford Graduate Fellowship",
    description:
      "The Stanford Graduate Fellowship provides full funding for outstanding graduate students in engineering and computer science.",
    amount: 75000,
    currency: "USD",
    type: "merit",
    deadline: new Date("2024-11-30"),
    requirements: [
      "Bachelor's degree in related field",
      "Research experience",
      "Strong academic record",
      "Publication record preferred",
    ],
    eligibility: [
      "Open to all nationalities",
      "Must be applying for graduate studies",
      "Must be in engineering or computer science",
      "Must demonstrate research potential",
    ],
    application_process: [
      "Submit online application",
      "Provide research statement",
      "Submit letters of recommendation",
      "Complete interview process",
    ],
    documents_required: [
      "Academic transcripts",
      "GRE scores",
      "Research statement",
      "Letters of recommendation",
      "Publication list",
    ],
    school_id: "2",
    program: "Graduate",
    duration: "2 years",
    renewable: true,
    international_students: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: "3",
    title: "MIT Research Grant",
    description:
      "The MIT Research Grant supports innovative research projects in science and engineering fields.",
    amount: 100000,
    currency: "USD",
    type: "research",
    deadline: new Date("2024-10-15"),
    requirements: [
      "PhD in related field",
      "Research proposal",
      "Previous research experience",
      "Publication record",
    ],
    eligibility: [
      "Open to all nationalities",
      "Must be a current MIT faculty or researcher",
      "Must be in science or engineering field",
      "Must have innovative research proposal",
    ],
    application_process: [
      "Submit research proposal",
      "Provide CV",
      "Submit letters of recommendation",
      "Complete interview process",
    ],
    documents_required: [
      "Research proposal",
      "CV",
      "Publication list",
      "Letters of recommendation",
      "Budget proposal",
    ],
    school_id: "3",
    program: "Research",
    duration: "3 years",
    renewable: false,
    international_students: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
];
