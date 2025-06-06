"use server";

import { InternalServerError } from "@/handler/error";
import { SchoolDepartment } from "../departments/department-get";
import { query } from "../postgres";

export interface School {
  id: number;
  name: string;
  cd_name: string;
  logo: string;
  location: string;
  founded: number;
  nation: string;
  nationcode: string;
  type: "public" | "private";
  qs_world_rank: number;
  us_news_rank_world: number;
  us_rank: number;
  total_students: number | null;
  acceptance_rate: number;
  average_gpa: number;
  average_gre: number;
  average_toefl: number;
  number_of_applications: number;
  number_of_admissions: number;
  tuition: {
    in_state: number | null;
    out_state: number | null;
    international: number | null;
  };
  popular_majors?: string[];
  campus_life?: {
    student_clubs: number;
    sports_teams: number;
    housing_options: string[];
  };
  description: string;
  website: string;
  admission_requirements?: {
    gpa: number;
    gre: number;
    toefl: number;
  };
  departments?: SchoolDepartment[];
  tag_id?: string;
}

export const getSchoolsIdAndName = async (): Promise<
  { id: string; name: string }[]
> => {
  try {
    const schools = await query<{ id: string; name: string }>(
      "SELECT id, name FROM schools"
    );
    return schools;
  } catch (error) {
    throw new InternalServerError("Error fetching schools");
  }
};

export const getSchools = async ({
  limit,
  offset,
  nationCode,
  orderBy,
}: {
  limit?: number | null;
  offset?: number | null;
  nationCode?: string | null;
  orderBy?: string | null;
}): Promise<School[]> => {
  try {
    const params: (string | number)[] = [];

    let sqlQuery = `SELECT s.*, 
        cl.student_clubs, cl.sports_teams,
        json_build_object(
            'student_clubs', cl.student_clubs,
            'sports_teams', cl.sports_teams,
            'housing_options', ARRAY(SELECT housing_option FROM housing_options WHERE school_id = s.id)
        ) as campus_life,
        json_build_object(
            'in_state', s.tuition_in_state,
            'out_state', s.tuition_out_state,
            'international', s.tuition_international
        ) as tuition
      FROM schools s
      LEFT JOIN campus_life cl ON s.id = cl.school_id
      `;

    if (nationCode && nationCode !== "all") {
      params.push(nationCode);
      sqlQuery += `WHERE s.nationcode = $${params.length} `;
    }

    sqlQuery += `GROUP BY s.id, cl.student_clubs, cl.sports_teams`;

    if (orderBy === "qs_world_rank") {
      sqlQuery += `
      ORDER BY 
      CAST(
        CASE 
          WHEN s.qs_world_rank ~ '-' THEN SPLIT_PART(s.qs_world_rank, '-', 1)::integer
          WHEN s.qs_world_rank ~ '\\+$' THEN REPLACE(s.qs_world_rank, '+', '')::integer
          ELSE s.qs_world_rank::integer
        END AS INTEGER
      ) ASC
       `;
    } else if (orderBy) {
      sqlQuery += `ORDER BY s.${orderBy} ASC`;
    }

    if (limit) {
      params.push(limit);
      sqlQuery += `LIMIT $${params.length} `;
    }

    if (offset) {
      params.push(offset);
      sqlQuery += `OFFSET $${params.length} `;
    }

    const schools = await query<School>(sqlQuery, params);

    return schools;
  } catch (error) {
    console.error("Error fetching schools:", error);
    return [];
  }
};

export const getSchoolById = async (id: string): Promise<School | null> => {
  try {
    const school = await query<School>(
      `SELECT s.*, 
          cl.student_clubs, cl.sports_teams,
          json_build_object(
              'student_clubs', cl.student_clubs,
              'sports_teams', cl.sports_teams,
              'housing_options', ARRAY(SELECT housing_option FROM housing_options WHERE school_id = s.id)
          ) as campus_life,
          json_build_object(
              'in_state', s.tuition_in_state,
              'out_state', s.tuition_out_state,
              'international', s.tuition_international
          ) as tuition
        FROM schools s
        LEFT JOIN campus_life cl ON s.id = cl.school_id
        WHERE s.id = $1
        GROUP BY s.id, cl.student_clubs, cl.sports_teams
        ORDER BY s.qs_world_rank ASC`,
      [id]
    );

    return school[0];
  } catch (error) {
    console.error("Error fetching school:", error);
    return null;
  }
};
