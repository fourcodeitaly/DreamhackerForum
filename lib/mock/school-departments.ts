export interface SchoolDepartment {
  id: string;
  school_id: string;
  name: string;
  qs_world_rank: number | null;
  us_news_rank_world: number | null;
  us_rank: number | null;
  law_school_rank_us: number | null;
  business_school_rank_us: number | null;
  medicine_school_rank_us: number | null;
  admission_requirements: {
    gpa: {
      minimum: number;
      recommended: number;
    };
    gre: {
      verbal: {
        minimum: number;
        recommended: number;
      };
      quantitative: {
        minimum: number;
        recommended: number;
      };
      analytical_writing: {
        minimum: number;
        recommended: number;
      };
    };
    toefl: {
      minimum: number;
      recommended: number;
    };
    ielts: {
      minimum: number;
      recommended: number;
    };
    gmat: {
      minimum: number;
      recommended: number;
    };
  };
  country_code: string;
  number_of_applications: number;
  number_of_admissions: number;
  created_at: string;
  updated_at: string;
}

export const mockSchoolDepartments: SchoolDepartment[] = [
  {
    id: "1",
    school_id: "1", // Harvard University
    name: "Harvard Law School",
    qs_world_rank: 1,
    us_news_rank_world: 1,
    us_rank: 1,
    law_school_rank_us: 1,
    business_school_rank_us: null,
    medicine_school_rank_us: null,
    admission_requirements: {
      gpa: {
        minimum: 3.7,
        recommended: 3.9,
      },
      gre: {
        verbal: {
          minimum: 160,
          recommended: 165,
        },
        quantitative: {
          minimum: 155,
          recommended: 160,
        },
        analytical_writing: {
          minimum: 4.5,
          recommended: 5.0,
        },
      },
      toefl: {
        minimum: 100,
        recommended: 110,
      },
      ielts: {
        minimum: 7.0,
        recommended: 7.5,
      },
      gmat: {
        minimum: 720,
        recommended: 750,
      },
    },
    country_code: "US",
    number_of_applications: 8000,
    number_of_admissions: 800,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    school_id: "1", // Harvard University
    name: "Harvard Business School",
    qs_world_rank: 1,
    us_news_rank_world: 1,
    us_rank: 1,
    law_school_rank_us: null,
    business_school_rank_us: 1,
    medicine_school_rank_us: null,
    admission_requirements: {
      gpa: {
        minimum: 3.6,
        recommended: 3.8,
      },
      gre: {
        verbal: {
          minimum: 155,
          recommended: 160,
        },
        quantitative: {
          minimum: 160,
          recommended: 165,
        },
        analytical_writing: {
          minimum: 4.0,
          recommended: 4.5,
        },
      },
      toefl: {
        minimum: 100,
        recommended: 110,
      },
      ielts: {
        minimum: 7.0,
        recommended: 7.5,
      },
      gmat: {
        minimum: 730,
        recommended: 760,
      },
    },
    country_code: "US",
    number_of_applications: 10000,
    number_of_admissions: 1000,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    school_id: "1", // Harvard University
    name: "Harvard Medical School",
    qs_world_rank: 1,
    us_news_rank_world: 1,
    us_rank: 1,
    law_school_rank_us: null,
    business_school_rank_us: null,
    medicine_school_rank_us: 1,
    admission_requirements: {
      gpa: {
        minimum: 3.8,
        recommended: 3.9,
      },
      gre: {
        verbal: {
          minimum: 158,
          recommended: 162,
        },
        quantitative: {
          minimum: 158,
          recommended: 162,
        },
        analytical_writing: {
          minimum: 4.5,
          recommended: 5.0,
        },
      },
      toefl: {
        minimum: 100,
        recommended: 110,
      },
      ielts: {
        minimum: 7.0,
        recommended: 7.5,
      },
      gmat: {
        minimum: 720,
        recommended: 750,
      },
    },
    country_code: "US",
    number_of_applications: 7000,
    number_of_admissions: 700,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    school_id: "2", // Stanford University
    name: "Stanford Law School",
    qs_world_rank: 2,
    us_news_rank_world: 2,
    us_rank: 2,
    law_school_rank_us: 2,
    business_school_rank_us: null,
    medicine_school_rank_us: null,
    admission_requirements: {
      gpa: {
        minimum: 3.7,
        recommended: 3.9,
      },
      gre: {
        verbal: {
          minimum: 160,
          recommended: 165,
        },
        quantitative: {
          minimum: 155,
          recommended: 160,
        },
        analytical_writing: {
          minimum: 4.5,
          recommended: 5.0,
        },
      },
      toefl: {
        minimum: 100,
        recommended: 110,
      },
      ielts: {
        minimum: 7.0,
        recommended: 7.5,
      },
      gmat: {
        minimum: 720,
        recommended: 750,
      },
    },
    country_code: "US",
    number_of_applications: 7500,
    number_of_admissions: 750,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    school_id: "2", // Stanford University
    name: "Stanford Graduate School of Business",
    qs_world_rank: 2,
    us_news_rank_world: 2,
    us_rank: 2,
    law_school_rank_us: null,
    business_school_rank_us: 2,
    medicine_school_rank_us: null,
    admission_requirements: {
      gpa: {
        minimum: 3.6,
        recommended: 3.8,
      },
      gre: {
        verbal: {
          minimum: 155,
          recommended: 160,
        },
        quantitative: {
          minimum: 160,
          recommended: 165,
        },
        analytical_writing: {
          minimum: 4.0,
          recommended: 4.5,
        },
      },
      toefl: {
        minimum: 100,
        recommended: 110,
      },
      ielts: {
        minimum: 7.0,
        recommended: 7.5,
      },
      gmat: {
        minimum: 730,
        recommended: 760,
      },
    },
    country_code: "US",
    number_of_applications: 9500,
    number_of_admissions: 950,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "6",
    school_id: "2", // Stanford University
    name: "Stanford School of Medicine",
    qs_world_rank: 2,
    us_news_rank_world: 2,
    us_rank: 2,
    law_school_rank_us: null,
    business_school_rank_us: null,
    medicine_school_rank_us: 2,
    admission_requirements: {
      gpa: {
        minimum: 3.8,
        recommended: 3.9,
      },
      gre: {
        verbal: {
          minimum: 158,
          recommended: 162,
        },
        quantitative: {
          minimum: 158,
          recommended: 162,
        },
        analytical_writing: {
          minimum: 4.5,
          recommended: 5.0,
        },
      },
      toefl: {
        minimum: 100,
        recommended: 110,
      },
      ielts: {
        minimum: 7.0,
        recommended: 7.5,
      },
      gmat: {
        minimum: 720,
        recommended: 750,
      },
    },
    country_code: "US",
    number_of_applications: 6500,
    number_of_admissions: 650,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];
