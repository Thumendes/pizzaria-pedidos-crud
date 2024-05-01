import { Prisma, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/pt_BR";

const prisma = new PrismaClient();

async function main() {
  faker.seed(123);
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

  const customers = Array.from({ length: 10 }, (_, index) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const email = faker.internet.email({ firstName, lastName });
    const phone = faker.phone.number();

    return {
      name: `${firstName} ${lastName}`,
      email,
      phone,
    } satisfies Prisma.CustomerCreateInput;
  });

  await Promise.all(
    customers.map(async (customer, index) => {
      console.log(`Salvando ${index + 1}/${customers.length} - ${customer.name}`);
      await prisma.customer.upsert({ where: { phone: customer.phone }, create: customer, update: customer });
    })
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
