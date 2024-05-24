import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // seed books
  const books = JSON.parse(
    fs.readFileSync('./prisma/seed-data/books.json', 'utf-8'),
  );
  await prisma.book.createMany({
    data: books,
  });

  console.log('Books Seeding completed, created books: ', books.length);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
