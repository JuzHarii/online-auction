// import { PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcryptjs';

// const prisma = new PrismaClient();

// // Helper để băm mật khẩu
// async function hashPassword(password: string) {
//   return bcrypt.hash(password, 10);
// }

// async function main() {
//   console.log(`Start seeding ...`);

//   // --- 1. Tạo Categories ---
//   console.log('Seeding categories...');
//   const cat1 = await prisma.category.upsert({
//     where: { name_level_1_name_level_2: { name_level_1: 'Electronics', name_level_2: 'Phones' } },
//     update: {},
//     create: { name_level_1: 'Electronics', name_level_2: 'Phones' },
//   });

//   const cat2 = await prisma.category.upsert({
//     where: { name_level_1_name_level_2: { name_level_1: 'Electronics', name_level_2: 'Laptops' } },
//     update: {},
//     create: { name_level_1: 'Electronics', name_level_2: 'Laptops' },
//   });

//   const cat3 = await prisma.category.upsert({
//     where: { name_level_1_name_level_2: { name_level_1: 'Fashion', name_level_2: 'Watches' } },
//     update: {},
//     create: { name_level_1: 'Fashion', name_level_2: 'Watches' },
//   });

//   // --- 2. Tạo Users (Sellers) ---
//   console.log('Seeding users...');
//   const hashedPassword = await hashPassword('password123'); // Mật khẩu chung cho tất cả user mẫu

//   const seller1 = await prisma.user.upsert({
//     where: { email: 'seller1@example.com' },
//     update: {},
//     create: {
//       email: 'seller1@example.com',
//       name: 'John Doe',
//       password: hashedPassword,
//       role: 'seller', // Đặt làm seller luôn
//       is_email_verified: true,
//     },
//   });

//   const seller2 = await prisma.user.upsert({
//     where: { email: 'seller2@example.com' },
//     update: {},
//     create: {
//       email: 'seller2@example.com',
//       name: 'Jane Smith',
//       password: hashedPassword,
//       role: 'seller',
//       is_email_verified: true,
//     },
//   });

//   // --- 3. Tạo 5 Products (cùng với Images và Description) ---
//   console.log('Seeding 5 products...');

//   // Product 1
//   await prisma.product.create({
//     data: {
//       name: 'Vintage Rolex Watch',
//       seller_id: seller1.user_id,
//       category_id: cat3.category_id,
//       start_price: 1500.00,
//       buy_now_price: 3000.00,
//       step_price: 50.00,
//       current_price: 1500.00,
//       end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 ngày nữa
//       description_history: {
//         create: {
//           description: 'A beautiful vintage Rolex from the 1980s. Good condition.',
//         },
//       },
//       images: {
//         create: { image_url: 'thinkpad.webp' }, // <-- ĐÃ THAY ĐỔI
//       },
//     },
//   });

//   // Product 2
//   await prisma.product.create({
//     data: {
//       name: 'Used MacBook Pro 14"',
//       seller_id: seller2.user_id,
//       category_id: cat2.category_id,
//       start_price: 800.00,
//       buy_now_price: 1200.00,
//       step_price: 25.00,
//       current_price: 800.00,
//       end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 ngày nữa
//       description_history: {
//         create: {
//           description: 'MacBook Pro 14-inch, M1 Pro chip. Minor scratches on the bottom.',
//         },
//       },
//       images: {
//         create: { image_url: 'thinkpad.webp' }, // <-- ĐÃ THAY ĐỔI
//       },
//     },
//   });

//   // Product 3
//   await prisma.product.create({
//     data: {
//       name: 'iPhone 13 Pro - 256GB',
//       seller_id: seller1.user_id,
//       category_id: cat1.category_id,
//       start_price: 450.00,
//       step_price: 10.00,
//       current_price: 450.00,
//       end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 ngày nữa
//       description_history: {
//         create: {
//           description: 'iPhone 13 Pro, 256GB, Sierra Blue. Battery health 90%.',
//         },
//       },
//       images: {
//         create: { image_url: 'thinkpad.webp' }, // <-- ĐÃ THAY ĐỔI
//       },
//     },
//   });

//   // Product 4
//   await prisma.product.create({
//     data: {
//       name: 'Dell XPS 15 Laptop',
//       seller_id: seller2.user_id,
//       category_id: cat2.category_id,
//       start_price: 700.00,
//       buy_now_price: 1000.00,
//       step_price: 20.00,
//       current_price: 700.00,
//       end_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 ngày nữa
//       description_history: {
//         create: {
//           description: 'Dell XPS 15 (9510), Core i7, 16GB RAM, 1TB SSD. Excellent condition.',
//         },
//       },
//       images: {
//         create: { image_url: 'thinkpad.webp' }, // <-- ĐÃ THAY ĐỔI
//       },
//     },
//   });

//   // Product 5
//   await prisma.product.create({
//     data: {
//       name: 'Samsung Galaxy S22',
//       seller_id: seller1.user_id,
//       category_id: cat1.category_id,
//       start_price: 300.00,
//       buy_now_price: 500.00,
//       step_price: 10.00,
//       current_price: 300.00,
//       end_time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 ngày nữa
//       description_history: {
//         create: {
//           description: 'Samsung S22, 128GB, Phantom Black. Unlocked.',
//         },
//       },
//       images: {
//         create: { image_url: 'thinkpad.webp' }, // <-- ĐÃ THAY ĐỔI
//       },
//     },
//   });

//   console.log('Finished seeding products.');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     console.log(`Seeding finished.`);
//     await prisma.$disconnect();
//   });

import { PrismaClient, ProductStatus, OrderStatus, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper để băm mật khẩu
async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log(`Start seeding ...`);

  // --- 1. Tạo Categories ---
  console.log('Seeding categories...');
  const catElectronics = await prisma.category.upsert({
    where: { name_level_1_name_level_2: { name_level_1: 'Electronics', name_level_2: 'Phones' } },
    update: {},
    create: { name_level_1: 'Electronics', name_level_2: 'Phones' },
  });

  const catLaptops = await prisma.category.upsert({
    where: { name_level_1_name_level_2: { name_level_1: 'Electronics', name_level_2: 'Laptops' } },
    update: {},
    create: { name_level_1: 'Electronics', name_level_2: 'Laptops' },
  });

  const catFashion = await prisma.category.upsert({
    where: { name_level_1_name_level_2: { name_level_1: 'Fashion', name_level_2: 'Watches' } },
    update: {},
    create: { name_level_1: 'Fashion', name_level_2: 'Watches' },
  });

  const catCameras = await prisma.category.upsert({
    where: { name_level_1_name_level_2: { name_level_1: 'Electronics', name_level_2: 'Cameras' } },
    update: {},
    create: { name_level_1: 'Electronics', name_level_2: 'Cameras' },
  });

  // --- 2. Tạo Users (Sellers & Bidders) ---
  console.log('Seeding users...');
  const hashedPassword = await hashPassword('password123');

  // Sellers
  const seller1 = await prisma.user.upsert({
    where: { email: 'seller1@example.com' },
    update: {},
    create: { email: 'seller1@example.com', name: 'John Seller', password: hashedPassword, role: UserRole.seller, is_email_verified: true, address: '123 Seller St, NY' },
  });

  const seller2 = await prisma.user.upsert({
    where: { email: 'seller2@example.com' },
    update: {},
    create: { email: 'seller2@example.com', name: 'Jane Seller', password: hashedPassword, role: UserRole.seller, is_email_verified: true, address: '456 Market Ave, CA' },
  });

  // Bidders
  const bidder1 = await prisma.user.upsert({
    where: { email: 'bidder1@example.com' },
    update: {},
    create: { email: 'bidder1@example.com', name: 'Alice Bidder', password: hashedPassword, role: UserRole.bidder, is_email_verified: true, address: '789 Buyer Ln, TX' },
  });

  const bidder2 = await prisma.user.upsert({
    where: { email: 'bidder2@example.com' },
    update: {},
    create: { email: 'bidder2@example.com', name: 'Bob Bidder', password: hashedPassword, role: UserRole.bidder, is_email_verified: true, address: '321 Ocean Dr, FL' },
  });

  const bidder3 = await prisma.user.upsert({
    where: { email: 'bidder3@example.com' },
    update: {},
    create: { email: 'bidder3@example.com', name: 'Charlie Bidder', password: hashedPassword, role: UserRole.bidder, is_email_verified: true, address: '654 Mountain Rd, CO' },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', name: 'Super Admin', password: hashedPassword, role: UserRole.admin, is_email_verified: true },
  });

  // --- 3. Tạo Products & Bid History ---
  console.log('Seeding products & bids...');

  // PRODUCT 1: Đang đấu giá sôi nổi (Rolex Watch)
  // Seller: seller1
  // Bidders: bidder1, bidder2, bidder3
  const product1 = await prisma.product.create({
    data: {
      name: 'Vintage Rolex Watch',
      seller_id: seller1.user_id,
      category_id: catFashion.category_id,
      start_price: 1500.00,
      buy_now_price: 3000.00,
      step_price: 50.00,
      // Giá hiện tại là giá cao nhất
      current_price: 1650.00,
      // Người giữ giá cao nhất hiện tại là bidder3
      current_highest_bidder_id: bidder3.user_id,
      bid_count: 3,
      status: ProductStatus.open,
      end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 ngày nữa
      description_history: { create: { description: 'A beautiful vintage Rolex from the 1980s. Good condition.' } },
      images: { create: { image_url: 'thinkpad.webp' } },
      // Tạo luôn Bid History
      bids: {
        create: [
          { bidder_id: bidder1.user_id, bid_amount: 1550.00, bid_time: new Date(Date.now() - 2 * 60 * 60 * 1000) }, // 2 tiếng trước
          { bidder_id: bidder2.user_id, bid_amount: 1600.00, bid_time: new Date(Date.now() - 1 * 60 * 60 * 1000) }, // 1 tiếng trước
          { bidder_id: bidder3.user_id, bid_amount: 1650.00, bid_time: new Date(Date.now() - 30 * 60 * 1000) },    // 30 phút trước
        ]
      }
    },
  });

  // PRODUCT 2: Chưa ai bid (MacBook Pro)
  await prisma.product.create({
    data: {
      name: 'Used MacBook Pro 14"',
      seller_id: seller2.user_id,
      category_id: catLaptops.category_id,
      start_price: 800.00,
      buy_now_price: 1200.00,
      step_price: 25.00,
      current_price: 800.00,
      end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      description_history: { create: { description: 'MacBook Pro 14-inch, M1 Pro chip. Minor scratches on the bottom.' } },
      images: { create: { image_url: 'thinkpad.webp' } },
    },
  });

  // PRODUCT 3: Sắp hết hạn (iPhone 13)
  await prisma.product.create({
    data: {
      name: 'iPhone 13 Pro - 256GB',
      seller_id: seller1.user_id,
      category_id: catElectronics.category_id,
      start_price: 450.00,
      step_price: 10.00,
      current_price: 450.00,
      end_time: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 tiếng nữa hết hạn
      description_history: { create: { description: 'iPhone 13 Pro, 256GB, Sierra Blue. Battery health 90%.' } },
      images: { create: { image_url: 'thinkpad.webp' } },
    },
  });

  // PRODUCT 4: Có Watchlist và Q&A (Dell XPS)
  const product4 = await prisma.product.create({
    data: {
      name: 'Dell XPS 15 Laptop',
      seller_id: seller2.user_id,
      category_id: catLaptops.category_id,
      start_price: 700.00,
      buy_now_price: 1000.00,
      step_price: 20.00,
      current_price: 700.00,
      end_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      description_history: { create: { description: 'Dell XPS 15 (9510), Core i7, 16GB RAM, 1TB SSD. Excellent condition.' } },
      images: { create: { image_url: 'thinkpad.webp' } },
      // Tạo Q&A
      q_and_a: {
        create: [
          {
            questioner_id: bidder1.user_id,
            question_text: 'Does it come with original charger?',
            question_time: new Date(Date.now() - 24 * 60 * 60 * 1000),
            answer_text: 'Yes, original 130W charger included.',
            answer_time: new Date(Date.now() - 20 * 60 * 60 * 1000),
          },
          {
            questioner_id: bidder2.user_id,
            question_text: 'Is the battery replaceable?',
            question_time: new Date(Date.now() - 5 * 60 * 60 * 1000),
            // Chưa trả lời
          }
        ]
      }
    },
  });

  // --- 4. Tạo Watchlist ---
  console.log('Seeding watchlist...');
  await prisma.watchlist.createMany({
    data: [
      { user_id: bidder1.user_id, product_id: product1.product_id }, // Bidder 1 thích Rolex
      { user_id: bidder2.user_id, product_id: product4.product_id }, // Bidder 2 thích Dell
      { user_id: bidder3.user_id, product_id: product4.product_id }, // Bidder 3 thích Dell
    ],
    skipDuplicates: true
  });

  // --- 5. Tạo Order & Reviews (Đã bán thành công) ---
  console.log('Seeding completed orders & reviews...');

  // Tạo một sản phẩm đã bán (Sony Camera)
  // Seller: seller1
  // Winner: bidder2
  const productSold = await prisma.product.create({
    data: {
      name: 'Sony A7III Camera Body',
      seller_id: seller1.user_id,
      category_id: catCameras.category_id,
      start_price: 1000.00,
      step_price: 50.00,
      current_price: 1200.00, // Giá thắng
      current_highest_bidder_id: bidder2.user_id,
      bid_count: 1,
      status: ProductStatus.sold, // Trạng thái đã bán
      end_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Đã kết thúc 2 ngày trước
      description_history: { create: { description: 'Sony Alpha A7III mirrorless camera body only. Low shutter count.' } },
      images: { create: { image_url: 'thinkpad.webp' } },
      bids: {
        create: { bidder_id: bidder2.user_id, bid_amount: 1200.00, bid_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
      }
    },
  });

  // Tạo Order cho sản phẩm trên
  const order = await prisma.order.create({
    data: {
      product_id: productSold.product_id,
      seller_id: seller1.user_id,
      buyer_id: bidder2.user_id,
      final_price: 1200.00,
      status: OrderStatus.shipped, // Đã vận chuyển
      shipping_address: '321 Ocean Dr, Miami, FL',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      // Tạo tin nhắn chat trong đơn hàng
      chat_messages: {
        create: [
          { sender_id: bidder2.user_id, message_text: 'Hi, when will you ship this?', sent_at: new Date(Date.now() - 20 * 60 * 60 * 1000) },
          { sender_id: seller1.user_id, message_text: 'I shipped it this morning. Tracking number is XYZ123.', sent_at: new Date(Date.now() - 10 * 60 * 60 * 1000) },
        ]
      }
    }
  });

  // Tạo Reviews cho Order này
  // 1. Buyer (bidder2) review Seller (seller1)
  await prisma.reviews.create({
    data: {
      product_id: productSold.product_id,
      reviewer_id: bidder2.user_id,
      reviewee_id: seller1.user_id,
      is_positive: true,
      comment: 'Great camera, fast shipping!',
      // Link review này vào Order
      order_as_buyer_review: {
        connect: { order_id: order.order_id }
      }
    }
  });
  
  // Cập nhật điểm review cho Seller
  await prisma.user.update({
    where: { user_id: seller1.user_id },
    data: { plus_review: { increment: 1 } }
  });

  console.log('Finished seeding.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log(`Seeding finished.`);
    await prisma.$disconnect();
  });