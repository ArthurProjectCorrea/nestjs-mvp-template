import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
    },
  });

  // Create test users
  const testUsers = [
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: await bcrypt.hash('password123', 10),
    },
    {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: await bcrypt.hash('password123', 10),
    },
    {
      name: 'Carol Brown',
      email: 'carol@example.com',
      password: await bcrypt.hash('password123', 10),
    },
  ];

  for (const userData of testUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin user: admin@example.com / admin123');
  console.log('👥 Test users: alice@example.com, bob@example.com, carol@example.com (all with password: password123)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });