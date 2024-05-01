import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(`Criando seed`);

  const categories: Prisma.MenuItemCategoryCreateInput[] = [
    { name: "Long Neck" },
    { name: "Drinks" },
    { name: "Drinks sem álcool" },
    { name: "Soft drinks" },
    { name: "Entradas" },
    { name: "Parrilla" },
    { name: "Sobremesas" },
    { name: "Guarnições" },
  ];

  await Promise.all(
    categories.map(async (category, index) => {
      console.log(`Salvando ${index + 1}/${categories.length} - ${category.name}`);
      await prisma.menuItemCategory.upsert({
        where: { name: category.name },
        create: category,
        update: category,
      });
    })
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
