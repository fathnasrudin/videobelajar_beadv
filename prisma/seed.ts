import { prisma } from "../src/lib/prisma";
import * as bcrypt from "bcrypt";

async function main() {
  // ======================
  // USERS
  // ======================
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      username: "admin",
      fullname: "Admin User",
      email: "admin@example.com",
      password: passwordHash,
      isVerified: true,
      verifiedAt: new Date(),
    },
  });

  // ======================
  // CATEGORIES
  // ======================
  const categories = await prisma.categories.createMany({
    data: [{ name: "Programming" }, { name: "Finance" }, { name: "Design" }],
  });

  const allCategories = await prisma.categories.findMany();

  // ======================
  // COURSES
  // ======================
  const course1 = await prisma.courses.create({
    data: {
      title: "Fullstack JavaScript",
      description: "Belajar frontend dan backend JS",
      price: 500000,
    },
  });

  const course2 = await prisma.courses.create({
    data: {
      title: "Personal Finance 101",
      description: "Dasar mengatur keuangan pribadi",
      price: 300000,
    },
  });

  // ======================
  // COURSES ↔ CATEGORIES (pivot)
  // ======================
  await prisma.courses_categories.createMany({
    data: [
      {
        course_id: course1.id,
        category_id: allCategories.find((c) => c.name === "Programming")!.id,
      },
      {
        course_id: course1.id,
        category_id: allCategories.find((c) => c.name === "Design")!.id,
      },
      {
        course_id: course2.id,
        category_id: allCategories.find((c) => c.name === "Finance")!.id,
      },
    ],
  });

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
