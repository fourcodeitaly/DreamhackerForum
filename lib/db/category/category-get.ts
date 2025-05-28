import { queryOne } from "../postgres";

export async function getCategory(
  categoryId: string
): Promise<{ name: { en: string } } | null> {
  try {
    return await queryOne("SELECT name FROM categories WHERE id = $1", [
      categoryId,
    ]);
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}
