import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Verificando usuários no banco...');
    
    const totalUsers = await prisma.user.count();
    console.log(`📊 Total de usuários: ${totalUsers}`);
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    console.log('\n👥 Usuários encontrados:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role} - ${user.isActive ? 'Ativo' : 'Inativo'} - ${user.createdAt.toISOString()}`);
    });
    
    // Verificar usuários de teste (com timestamp no email)
    const testUsers = await prisma.user.findMany({
      where: {
        email: {
          contains: 'test-',
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    
    console.log(`\n🧪 Usuários de teste encontrados: ${testUsers.length}`);
    testUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.createdAt.toISOString()}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();