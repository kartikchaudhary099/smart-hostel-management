import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Author User
  await prisma.user.upsert({
    where: { email: 'kartik@author.com' },
    update: { name: 'Kartik Chaudhary', password: '12345678' },
    create: {
      name: 'Kartik Chaudhary',
      email: 'kartik@author.com',
      password: '12345678',
      role: 'author',
    },
  });
  console.log('Created author: Kartik Chaudhary');

  // Create default menu
  const defaultMenu = [
    { day: "Monday", meal: "Breakfast", description: "Poha, Tea, Fruits" },
    { day: "Monday", meal: "Lunch", description: "Dal Makhani, Roti, Rice" },
    { day: "Monday", meal: "Dinner", description: "Paneer Butter Masala, Naan" },
  ];

  for (const item of defaultMenu) {
    await prisma.menuItem.upsert({
      where: { day_meal: { day: item.day, meal: item.meal } },
      update: {},
      create: item,
    });
  }
  console.log('Created default menu items');

  // Check if rooms already exist
  const roomCount = await prisma.room.count();
  if (roomCount === 0) {
    console.log('Generating 225 rooms (500 beds)...');
    let acBedsLeft = 250;
    const roomData: { roomNumber: string; capacity: number; isAc: boolean }[] = [];

    for (let i = 1; i <= 50; i++) {
      const isAc = acBedsLeft >= 1;
      if (isAc) acBedsLeft -= 1;
      roomData.push({ roomNumber: `1S-${i}`, capacity: 1, isAc });
    }
    for (let i = 1; i <= 75; i++) {
      const isAc = acBedsLeft >= 2;
      if (isAc) acBedsLeft -= 2;
      roomData.push({ roomNumber: `2S-${i}`, capacity: 2, isAc });
    }
    for (let i = 1; i <= 100; i++) {
      const isAc = acBedsLeft >= 3;
      if (isAc) acBedsLeft -= 3;
      roomData.push({ roomNumber: `3S-${i}`, capacity: 3, isAc });
    }

    await prisma.room.createMany({ data: roomData });
    console.log('Created 225 rooms (500 beds total)');
  } else {
    console.log('Rooms already exist, skipping generation.');
  }

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
