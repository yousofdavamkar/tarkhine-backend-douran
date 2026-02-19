const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (optional - remove if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  await prisma.subMenuItem.deleteMany();
  await prisma.menuItem.deleteMany();
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

  // Seed Menu with MenuItems and SubMenuItems
  console.log('📋 Seeding menus...');

  // Main Navigation Menu
  const mainMenu = await prisma.menu.create({
    data: {
      name: 'Main Navigation',
      logo: '/images/logo.png',
      logoAlt: 'Company Logo',
      isActive: true,
      position: 1,
      items: {
        create: [
          {
            name: 'Home',
            link: '/',
            isActive: true,
            position: 1,
            subitems: {
              create: [
                {
                  name: 'Dashboard',
                  link: '/dashboard',
                  isActive: true,
                  position: 1,
                },
                {
                  name: 'Analytics',
                  link: '/analytics',
                  isActive: true,
                  position: 2,
                },
              ],
            },
          },
          {
            name: 'Products',
            link: '/products',
            isActive: true,
            position: 2,
            subitems: {
              create: [
                {
                  name: 'All Products',
                  link: '/products/all',
                  isActive: true,
                  position: 1,
                },
                {
                  name: 'Categories',
                  link: '/products/categories',
                  isActive: true,
                  position: 2,
                },
                {
                  name: 'Featured',
                  link: '/products/featured',
                  isActive: true,
                  position: 3,
                },
              ],
            },
          },
          {
            name: 'Users',
            link: '/users',
            isActive: true,
            position: 3,
            subitems: {
              create: [
                {
                  name: 'User List',
                  link: '/users/list',
                  isActive: true,
                  position: 1,
                },
                {
                  name: 'User Roles',
                  link: '/users/roles',
                  isActive: true,
                  position: 2,
                },
                {
                  name: 'Permissions',
                  link: '/users/permissions',
                  isActive: true,
                  position: 3,
                },
              ],
            },
          },
          {
            name: 'Settings',
            link: '/settings',
            isActive: true,
            position: 4,
            subitems: {
              create: [
                {
                  name: 'Profile',
                  link: '/settings/profile',
                  isActive: true,
                  position: 1,
                },
                {
                  name: 'Security',
                  link: '/settings/security',
                  isActive: true,
                  position: 2,
                },
                {
                  name: 'Notifications',
                  link: '/settings/notifications',
                  isActive: true,
                  position: 3,
                },
              ],
            },
          },
          {
            name: 'Documentation',
            link: '/docs',
            isActive: true,
            position: 5,
            subitems: {
              create: [
                {
                  name: 'Getting Started',
                  link: '/docs/getting-started',
                  isActive: true,
                  position: 1,
                },
                {
                  name: 'API Reference',
                  link: '/docs/api',
                  isActive: true,
                  position: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Footer Menu
  const footerMenu = await prisma.menu.create({
    data: {
      name: 'Footer Navigation',
      isActive: true,
      position: 2,
      items: {
        create: [
          {
            name: 'About',
            link: '/about',
            isActive: true,
            position: 1,
            subitems: {
              create: [],
            },
          },
          {
            name: 'Contact',
            link: '/contact',
            isActive: true,
            position: 2,
            subitems: {
              create: [],
            },
          },
          {
            name: 'Privacy Policy',
            link: '/privacy',
            isActive: true,
            position: 3,
            subitems: {
              create: [],
            },
          },
          {
            name: 'Terms of Service',
            link: '/terms',
            isActive: true,
            position: 4,
            subitems: {
              create: [],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Created 2 menus with nested items`);

  console.log('\n✨ Database seeding completed successfully!');
  console.log('\n📝 Seeded Data Summary:');
  console.log(`   - ${users.length} users (all with password: password123)`);
  console.log(`   - ${resources.length} resources`);
  console.log(`   - 2 menus (Main Navigation & Footer)`);
  console.log(`   - Multiple menu items with sub-items`);
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
