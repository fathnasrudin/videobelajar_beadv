export default async function seedCoursesCategories(db) {
  const [courses] = await db.query("SELECT id FROM courses");
  const [categories] = await db.query("SELECT id FROM categories");

  // contoh: untuk setiap course, ambil 1–2 kategori random
  for (const course of courses) {
    const total = Math.floor(Math.random() * 2) + 1; // 1–2 kategori

    const picked = new Set();
    while (picked.size < total) {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      picked.add(cat.id);
    }

    for (const categoryId of picked) {
      await db.query(
        "INSERT INTO courses_categories (course_id, category_id) VALUES (?, ?)",
        [course.id, categoryId]
      );
    }
  }

  console.log("Success seeding courses_categories");
}
