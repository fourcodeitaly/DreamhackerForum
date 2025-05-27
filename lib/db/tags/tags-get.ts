"use server";

import { query, queryOne } from "../postgres";
import { School } from "../schools/school-get";

export interface Tag {
  id: string;
  name: string;
}

export async function getTagById(id: string): Promise<Tag | null> {
  try {
    const tag = await queryOne<Tag>("SELECT * FROM tags WHERE id = $1", [id]);
    return tag;
  } catch (error) {
    console.error("Error fetching tag by id:", error);
    return null;
  }
}

export async function getTags(): Promise<Tag[]> {
  try {
    const tags = await query<Tag>("SELECT * FROM tags");
    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

// export async function getSchools(): Promise<School[]> {
//   try {
//     const schools = await query<School>("SELECT * FROM schools");
//     return schools;
//   } catch (error) {
//     console.error("Error fetching schools:", error);
//     return [];
//   }
// }

// export async function getSchoolsGroupByNationCode(): Promise<
//   Record<string, School[]>
// > {
//   try {
//     const schools = await getSchools();
//     const schoolsGroupByNationCode = schools.reduce((acc, school) => {
//       const nationCode = school.nation;
//       if (!acc[nationCode]) {
//         acc[nationCode] = [];
//       }
//       acc[nationCode].push(school);
//       return acc;
//     }, {} as Record<string, School[]>);

//     return schoolsGroupByNationCode;
//   } catch (error) {
//     console.error("Error fetching schools group by nation code:", error);
//     return {};
//   }
// }
