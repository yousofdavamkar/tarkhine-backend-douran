const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (optional - remove if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  await prisma.subMenu.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Data cleaned successfully');

  // Hash password for users
  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash('password123', SALT_ROUNDS);

  // Seed Users
  console.log('👤 Seeding users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: 'admin',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        username: 'user1',
        passwordHash: hashedPassword,
        role: 'USER',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        username: 'user2',
        passwordHash: hashedPassword,
        role: 'USER',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        username: 'inactive_user',
        passwordHash: hashedPassword,
        role: 'USER',
        isActive: false,
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // Seed Resources
  console.log('📦 Seeding resources...');
  const resources = await Promise.all([
    prisma.resource.create({
      data: {
        name: 'User Authentication API',
        description: 'Endpoints for user authentication and authorization',
        status: 'active',
        category: 'Authentication',
        userId: users[0].id,
      },
    }),
    prisma.resource.create({
      data: {
        name: 'Database Connection Pool',
        description: 'PostgreSQL connection pool configuration',
        status: 'active',
        category: 'Infrastructure',
        userId: users[0].id,
      },
    }),
    prisma.resource.create({
      data: {
        name: 'Rate Limiter Service',
        description: 'API rate limiting and DDoS protection',
        status: 'active',
        category: 'Security',
        userId: users[1].id,
      },
    }),
    prisma.resource.create({
      data: {
        name: 'File Upload Handler',
        description: 'Multer-based file upload system',
        status: 'active',
        category: 'Utilities',
        userId: users[1].id,
      },
    }),
    prisma.resource.create({
      data: {
        name: 'API Documentation',
        description: 'Scalar-powered OpenAPI documentation',
        status: 'active',
        category: 'Documentation',
        userId: users[2].id,
      },
    }),
    prisma.resource.create({
      data: {
        name: 'Logging System',
        description: 'Morgan HTTP request logger',
        status: 'active',
        category: 'Monitoring',
        userId: users[2].id,
      },
    }),
    prisma.resource.create({
      data: {
        name: 'Email Service',
        description: 'Notification and email service (pending)',
        status: 'inactive',
        category: 'Communication',
      },
    }),
    prisma.resource.create({
      data: {
        name: 'Cache Layer',
        description: 'Redis caching implementation (planned)',
        status: 'inactive',
        category: 'Performance',
      },
    }),
  ]);
  console.log(`✅ Created ${resources.length} resources`);

  // Seed Menus and SubMenus
  console.log('📋 Seeding flat menus...');

  // Home Menu (No submenus)
  const homeMenu = await prisma.menu.create({
    data: {
      name: 'Home',
      link: '/',
      hasSubmenu: false,
      position: 1,
    }
  });

  // Products Menu (Has submenus)
  const productsMenu = await prisma.menu.create({
    data: {
      name: 'Products',
      link: '/products',
      hasSubmenu: true,
      position: 2,
      submenus: {
        create: [
          { name: 'All Products', link: '/products/all', position: 1 },
          { name: 'Categories', link: '/products/categories', position: 2 },
          { name: 'Featured', link: '/products/featured', position: 3 },
        ]
      }
    }
  });

  // Users Menu (Admin Only - has submenus)
  const usersMenu = await prisma.menu.create({
    data: {
      name: 'Users',
      link: '/users',
      hasSubmenu: true,
      position: 3,
      submenus: {
        create: [
          { name: 'User List', link: '/users/list', position: 1 },
          { name: 'User Roles', link: '/users/roles', position: 2 },
          { name: 'Permissions', link: '/users/permissions', position: 3 },
        ]
      }
    }
  });

  // Documentation Menu (No submenus)
  const docsMenu = await prisma.menu.create({
    data: {
      name: 'Documentation',
      link: '/docs',
      hasSubmenu: true,
      position: 4,
      submenus: {
        create: [
          { name: 'Getting Started', link: '/docs/getting-started', position: 1 },
          { name: 'API Reference', link: '/docs/api', position: 2 },
        ]
      }
    }
  });

  console.log(`✅ Created 4 flat menus with submenus`);

  console.log('\n✨ Database seeding completed successfully!');
  console.log('\n📝 Seeded Data Summary:');
  console.log(`   - ${users.length} users (all with password: password123)`);
  console.log(`   - ${resources.length} resources`);
  console.log(`   - 4 root Menus (Home, Products, Users, Docs)`);
  console.log(`   - Multiple SubMenus attached`);
  console.log('\n🔐 Test Accounts:');
  console.log('   - admin / password123');
  console.log('   - user1 / password123');
  console.log('   - user2 / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
