import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Database seeding started...')

  /* =====================================================
     1. CATEGORIES (5 categories, 2 levels)
  ====================================================== */
  await prisma.category.createMany({
    data: [
      { name_level_1: 'Electronics', name_level_2: 'Mobile Phones' },
      { name_level_1: 'Electronics', name_level_2: 'Laptops' },
      { name_level_1: 'Electronics', name_level_2: 'Tablets' },
      { name_level_1: 'Fashion', name_level_2: 'Watches' },
      { name_level_1: 'Fashion', name_level_2: 'Shoes' },
    ],
    skipDuplicates: true,
  })

  const categories = await prisma.category.findMany()

  const password = await bcrypt.hash('Demo1234!', 12);

  /* =====================================================
     2. USERS (1 seller + 6 bidders)
  ====================================================== */
  const seller = await prisma.user.create({
    data: {
      email: 'seller@test.com',
      password: password,
      name: 'Main Seller',
      role: 'seller',
      is_email_verified: true,
    },
  })

  const bidders = await Promise.all(
    Array.from({ length: 6 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `bidder${i + 1}@test.com`,
          password: password,
          name: `Bidder ${i + 1}`,
          role: 'bidder',
          is_email_verified: true,
        },
      })
    )
  )

  /* =====================================================
     3. PRODUCTS (20 PRODUCTS TOTAL)
  ====================================================== */
  const PRODUCT_COUNT = 20

  for (let i = 0; i < PRODUCT_COUNT; i++) {
    const category = categories[i % categories.length]

    const basePrice = 3_000_000 + i * 200_000

    const product = await prisma.product.create({
      data: {
        seller_id: seller.user_id,
        category_id: category.category_id,
        name: `Auction Product #${i + 1}`,
        status: 'open',
        start_price: new Prisma.Decimal(basePrice),
        step_price: new Prisma.Decimal(100_000),
        buy_now_price: new Prisma.Decimal(basePrice + 2_000_000),
        current_price: new Prisma.Decimal(basePrice),
        bid_count: 0,
        end_time: new Date(Date.now() + (3 + (i % 5)) * 24 * 60 * 60 * 1000),
        auto_extend: true,
        allow_unrated_bidder: true,

        /* ---------- PRODUCT IMAGES (≥3 VALID IMAGES) ---------- */
        images: {
          create: [
            {
              image_url:
                'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
            },
            {
              image_url:
                'https://images.unsplash.com/photo-1603898037225-8b15b56c6d65',
            },
            {
              image_url:
                'https://images.unsplash.com/photo-1580910051074-7c0d9c9d0b0e',
            },
            {
              image_url: `https://picsum.photos/seed/product${i}/800/600`,
            },
          ],
        },

        /* ---------- DESCRIPTION HISTORY ---------- */
        description_history: {
          create: {
            description:
              'This product is in good condition. All technical details, accessories, and cosmetic condition are clearly shown in the attached images. Please review carefully before bidding.',
          },
        },
      },
    })

    /* =====================================================
       4. BID HISTORY (MINIMUM 5 BIDS PER PRODUCT)
    ====================================================== */
    let currentPrice = basePrice

    for (let j = 0; j < 5; j++) {
      currentPrice += 100_000

      await prisma.bidHistory.create({
        data: {
          product_id: product.product_id,
          bidder_id: bidders[j % bidders.length].user_id,
          bid_amount: new Prisma.Decimal(currentPrice),
        },
      })
    }

    await prisma.product.update({
      where: { product_id: product.product_id },
      data: {
        current_price: new Prisma.Decimal(currentPrice),
        bid_count: 5,
        current_highest_bidder_id:
          bidders[4 % bidders.length].user_id,
      },
    })
  }

  console.log('✅ Seeding completed: 20 products, 5 categories, full bid history.')
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
