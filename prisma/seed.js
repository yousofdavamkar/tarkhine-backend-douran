const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (optional - remove if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  await prisma.subMenu.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.slider.deleteMany();
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



  // Seed Menus and SubMenus
  console.log('📋 Seeding flat menus...');

  // Home Menu (No submenus)
  const homeMenu = await prisma.menu.create({
    data: {
      name: 'صفحه اصلی',
      link: '/',
      hasSubmenu: false,
      position: 1,
    }
  });

  // Products Menu (Has submenus)
  const productsMenu = await prisma.menu.create({
    data: {
      name: 'منو',
      link: '/menu',
      hasSubmenu: true,
      position: 2,
      submenus: {
        create: [
          { name: 'غذای اصلی', link: '/menu/main-course', position: 1 },
          { name: 'پیش غذا', link: '/menu/appetizers', position: 2 },
          { name: 'دسر', link: '/menu/desserts', position: 3 },
          { name: 'نوشیدنی', link: '/menu/beverages', position: 4 },
        ]
      }
    }
  });

  // Users Menu (Admin Only - has submenus)
  const usersMenu = await prisma.menu.create({
    data: {
      name: 'کاربران',
      link: '/users',
      hasSubmenu: true,
      position: 3,
      submenus: {
        create: [
          { name: 'لیست کاربران', link: '/users/list', position: 1 },
          { name: 'نقش‌های کاربری', link: '/users/roles', position: 2 },
          { name: 'دسترسی‌ها', link: '/users/permissions', position: 3 },
        ]
      }
    }
  });

  // Documentation Menu (No submenus)
  const docsMenu = await prisma.menu.create({
    data: {
      name: 'شعبه‌ها',
      link: '/branches',
      hasSubmenu: true,
      position: 4,
      submenus: {
        create: [
          { name: 'اکباتان', link: '/branches/ekbatan', position: 1 },
          { name: 'چالوس', link: '/branches/chaloos', position: 2 },
          { name: 'اقدسیه', link: '/branches/aghdasieh', position: 3 },
          { name: 'ونک', link: '/branches/vanak', position: 4 },
        ]
      }
    }
  });

  console.log(`✅ Created 4 flat menus with submenus`);

  // Seed Sliders
  console.log('🖼️ Seeding sliders...');
  const slidersCreated = await prisma.slider.createMany({
    data: [
      {
        title: 'تجربه غذای سالم و گیاهی به سبک ترخینه1',
        btnTitle: 'سفارش غذا',
        link: '#',
        image: null,
        position: 1,
        isActive: true,
      },
      {
        title: 'تجربه غذای سالم و گیاهی به سبک ترخینه2',
        btnTitle: 'سفارش غذا',
        link: '#',
        image: null,
        position: 2,
        isActive: true,
      },
      {
        title: 'تجربه غذای سالم و گیاهی به سبک ترخینه3',
        btnTitle: 'سفارش غذا',
        link: '#',
        image: null,
        position: 3,
        isActive: true,
      }
    ]
  });
  console.log(`✅ Created ${slidersCreated.count} sliders`);

  console.log('\n✨ Database seeding completed successfully!');
  console.log('\n📝 Seeded Data Summary:');
  console.log(`   - ${users.length} users (all with password: password123)`);
  console.log(`   - 4 root Menus (صفحه اصلی، منو، کاربران، شعبه‌ها)`);
  console.log(`   - Multiple SubMenus attached`);
  console.log(`   - ${slidersCreated.count} sliders`);
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
