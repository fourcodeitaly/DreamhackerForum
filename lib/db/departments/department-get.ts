"use server";

import { query } from "../postgres";

export interface SchoolDepartment {
  id: string;
  school_id: string;
  school_name: string;
  name: string;
  law_school_rank_us: number | null;
  business_school_rank_us: number | null;
  medicine_school_rank_us: number | null;
  engineer_school_rank_us: number | null;
  admission_requirements: {
    gpa: number;
    gre: number;
    toefl: number;
  };
  number_of_applications: number;
  number_of_admissions: number;
  description: string;
}

export const getDepartmentBySchoolId = async (schoolId: string) => {
  try {
    const departments = await query<SchoolDepartment>(
      `SELECT d.*,
        json_build_object(
          'gpa', ar.gpa,
          'gre', ar.gre,
          'toefl', ar.toefl
        ) as admission_requirements
      FROM departments d 
      LEFT JOIN department_admission_requirements ar 
      ON d.id = ar.department_id 
      WHERE d.school_id = $1`,
      [schoolId]
    );
    return departments;
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
};
