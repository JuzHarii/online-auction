// import { PrismaClient, UserRole, ProductStatus, OrderStatus } from '@prisma/client'
// import bcrypt from 'bcryptjs';

// const prisma = new PrismaClient()

// // --- HELPER FUNCTIONS ---
// const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
// const randomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
// const randomBoolean = () => Math.random() < 0.5;

// // Rich Sample Data
// const SAMPLE_DESCRIPTIONS = [
//   "The product is almost new, comes with a 12-month official warranty. Full box with all accessories.",
//   "Imported from the US, excellent quality, not a single scratch.",
//   "Need quick cash, selling urgently, great price for serious buyers.",
//   "Collectible item, high rarity, for professionals only.",
//   "Original machine, never repaired, feel free to have a technician inspect it."
// ];

// async function main() {
//   console.log('🗑️  CLEANING DATABASE (Deleting old data)...')
  
//   // Clean sequentially to avoid FK constraints
//   const deleteOrder = [
//     prisma.orderChat.deleteMany(),
//     prisma.order.deleteMany(),
//     prisma.reviews.deleteMany(),
//     prisma.productQandA.deleteMany(),
//     prisma.watchlist.deleteMany(),
//     prisma.bidHistory.deleteMany(),
//     prisma.productImages.deleteMany(),
//     prisma.productDescriptionHistory.deleteMany(),
//     prisma.deniedBidders.deleteMany(),
//     prisma.product.deleteMany(),
//     prisma.category.deleteMany(),
//     prisma.sellerUpgradeRequest.deleteMany(),
//     prisma.user.deleteMany(),
//     prisma.auctionConfig.deleteMany(),
//   ];

//   // Execute deletes sequentially to be safe, or Promise.all if cascade is perfect. 
//   // Keeping sequential here prevents "Foreign key constraint failed" during cleanup.
//   for (const action of deleteOrder) {
//     await action;
//   }

//   console.log('🌱  SEEDING STARTED...')

//   // -------------------------------------------------------
//   // 0. CREATE AUCTION CONFIG
//   // -------------------------------------------------------
//   await prisma.auctionConfig.create({
//     data: {
//       id: 1,
//       extend_window_minutes: 5,
//       extend_duration_minutes: 10
//     }
//   });

//   // -------------------------------------------------------
//   // 1. CREATE USERS (Parallel)
//   // -------------------------------------------------------
//   const password = bcrypt.hashSync('Demo1234!', 12); 
  
//   // Prepare Admin
//   const adminPromise = prisma.user.create({
//     data: { email: 'admin@system.com', password, name: 'System Admin', role: UserRole.admin, is_email_verified: true }
//   });

//   // Prepare Sellers
//   const sellerPromises = Array.from({ length: 5 }).map((_, i) => 
//     prisma.user.create({
//       data: { 
//         email: `seller${i + 1}@shop.com`, password, name: `Trusted Shop ${i + 1}`, 
//         address: `${i + 1} Market Street, HCM`, role: UserRole.seller, is_email_verified: true,
//         plus_review: randomInt(10, 100)
//       }
//     })
//   );

//   // Prepare Bidders
//   const bidderPromises = Array.from({ length: 15 }).map((_, i) => 
//     prisma.user.create({
//       data: { 
//         email: `bidder${i + 1}@user.com`, password, name: `John Doe Bidder ${i + 1}`, 
//         address: `${i + 1} Buyer Lane, Hanoi`, role: UserRole.bidder, is_email_verified: true,
//         plus_review: randomInt(0, 20)
//       }
//     })
//   );

//   // Execute User Creation in Parallel
//   const [admin, ...restUsers] = await Promise.all([adminPromise, ...sellerPromises, ...bidderPromises]);
  
//   // Split back into groups
//   const sellers = restUsers.slice(0, 5);
//   const bidders = restUsers.slice(5);

//   // Create Upgrade Requests (Parallel)
//   const upgradePromises = bidders.slice(0, 3).map(bidder => 
//     prisma.sellerUpgradeRequest.create({
//       data: {
//         user_id: bidder.user_id,
//         message: "I want to open a shop to sell handmade goods, please approve, admin.",
//         is_approved: false
//       }
//     })
//   );
//   await Promise.all(upgradePromises);

//   // -------------------------------------------------------
//   // 2. CREATE CATEGORIES (Parallel)
//   // -------------------------------------------------------
//   const categoriesData = [
//     { l1: 'Electronics', l2: 'Smartphones' },
//     { l1: 'Electronics', l2: 'Laptops' },
//     { l1: 'Fashion', l2: 'Watches' },
//     { l1: 'Furniture', l2: 'Tables & Chairs' },
//     { l1: 'Collectibles', l2: 'Antique Coins' }
//   ];
  
//   const categories = await Promise.all(
//     categoriesData.map(cat => prisma.category.create({
//       data: { name_level_1: cat.l1, name_level_2: cat.l2 }
//     }))
//   );

//   // -------------------------------------------------------
//   // 3. CREATE PRODUCTS (Parallel)
//   // -------------------------------------------------------
//   const productTemplates = [
//     { name: 'iPhone 15 Pro Max Titanium', catIdx: 0, basePrice: 1000 },
//     { name: 'Samsung Galaxy S24 Ultra', catIdx: 0, basePrice: 900 },
//     { name: 'Google Pixel 8 Pro', catIdx: 0, basePrice: 800 },
//     { name: 'Xiaomi 14 Ultra', catIdx: 0, basePrice: 700 },
//     { name: 'MacBook Pro M3 Max', catIdx: 1, basePrice: 2000 },
//     { name: 'Dell XPS 15 2024', catIdx: 1, basePrice: 1500 },
//     { name: 'ThinkPad X1 Carbon', catIdx: 1, basePrice: 1400 },
//     { name: 'Asus ROG Zephyrus', catIdx: 1, basePrice: 1600 },
//     { name: 'Rolex Submariner Date', catIdx: 2, basePrice: 8000 },
//     { name: 'Omega Speedmaster', catIdx: 2, basePrice: 5000 },
//     { name: 'Seiko 5 Sport', catIdx: 2, basePrice: 200 },
//     { name: 'Casio G-Shock Limited', catIdx: 2, basePrice: 150 },
//     { name: 'Italian Leather Sofa', catIdx: 3, basePrice: 1000 },
//     { name: 'Oak Wood Desk', catIdx: 3, basePrice: 300 },
//     { name: 'Smart Night Lamp', catIdx: 3, basePrice: 50 },
//     { name: 'Herman Miller Ergonomic Chair', catIdx: 3, basePrice: 1200 },
//     { name: 'Indochina Coin 1900', catIdx: 4, basePrice: 100 },
//     { name: 'D.R. Vietnam Antique Stamp', catIdx: 4, basePrice: 50 },
//     { name: 'Chu Dau Ceramic Vase', catIdx: 4, basePrice: 500 },
//     { name: 'Old Quarter Oil Painting', catIdx: 4, basePrice: 300 }
//   ];

//   // Duplicate to get 30+ items
//   const allProductsData = [...productTemplates, ...productTemplates.slice(0, 10)];

//   // Define the logic for a SINGLE product creation flow
//   const createProductFlow = async (template: any, i: number) => {
//     const seller = randomElement(sellers);
//     const category = categories[template.catIdx];
    
//     const isSold = i < 10;
//     const status = isSold ? ProductStatus.sold : ProductStatus.open;
    
//     let createdTime = new Date();
//     let endTime = new Date();

//     if (isSold) {
//         createdTime.setDate(createdTime.getDate() - 20);
//         endTime = new Date(createdTime);
//         endTime.setDate(endTime.getDate() + 7);
//     } else {
//         createdTime.setDate(createdTime.getDate() - 1); 
//         endTime = new Date(); 
//         endTime.setDate(endTime.getDate() + randomInt(3, 10)); 
//     }

//     const startPrice = template.basePrice;
//     const stepPrice = template.basePrice * 0.05;

//     // 1. Create Product
//     const product = await prisma.product.create({
//       data: {
//         seller_id: seller.user_id,
//         category_id: category.category_id,
//         name: `${template.name} #${i + 1}`,
//         status: status,
//         start_price: startPrice,
//         step_price: stepPrice,
//         current_price: startPrice,
//         buy_now_price: startPrice * 2.5,
//         created_at: createdTime,
//         end_time: endTime,
//         auto_extend: true,
//         review_needed: randomBoolean(),
//         allow_unrated_bidder: randomInt(1, 10) > 2, // 80% chance to allow unrated
//         images: {
//           create: [
//             { image_url: `https://placehold.co/600x400?text=${encodeURIComponent(template.name)}` },
//             { image_url: `https://placehold.co/600x400/333/fff?text=Detail+View` }
//           ]
//         },
//         description_history: {
//           create: {
//             description: randomElement(SAMPLE_DESCRIPTIONS),
//             added_at: createdTime
//           }
//         },
//         q_and_a: {
//             create: Array.from({ length: randomInt(0, 2) }).map(() => ({
//                 questioner_id: randomElement(bidders).user_id,
//                 question_text: "Can the price of this product be negotiated?",
//                 question_time: new Date(createdTime.getTime() + 100000),
//                 answer_text: "No, the price is publicly auctioned.",
//                 answer_time: new Date(createdTime.getTime() + 200000),
//             }))
//         }
//       }
//     });

//     // 2. Generate Bids (Sequential per product, but parallel across products)
//     let currentPrice = startPrice;
//     let highestBidderId = null;
//     const bidCount = randomInt(6, 15);
//     const shuffledBidders = [...bidders].sort(() => 0.5 - Math.random());

//     for (let k = 0; k < bidCount; k++) {
//       const bidder = shuffledBidders[k % shuffledBidders.length];
//       const increment = stepPrice + randomInt(1, 50);
//       const bidAmount = Number(currentPrice) + increment; // Ensure number addition
      
//       let bidTime = new Date(createdTime.getTime() + (k * 3600000) + randomInt(0, 300000));
//       if (bidTime > new Date()) bidTime = new Date(); 

//       await prisma.bidHistory.create({
//         data: {
//             product_id: product.product_id,
//             bidder_id: bidder.user_id,
//             bid_amount: bidAmount,
//             bid_time: bidTime
//         }
//       });

//       currentPrice = bidAmount;
//       highestBidderId = bidder.user_id;
//     }

//     // 3. Update Product with final state
//     const updatedProduct = await prisma.product.update({
//         where: { product_id: product.product_id },
//         data: {
//             current_price: currentPrice,
//             current_highest_bidder_id: highestBidderId,
//             bid_count: bidCount
//         }
//     });

//     // 4. Create Watchlist & Denied (Parallel internal)
//     const watchlistPromises = shuffledBidders.slice(0, randomInt(3, 5)).map(watcher => 
//         prisma.watchlist.create({
//             data: { user_id: watcher.user_id, product_id: product.product_id }
//         })
//     );
//     await Promise.all(watchlistPromises);

//     if (randomInt(1, 10) > 8) {
//         await prisma.deniedBidders.create({
//             data: { product_id: product.product_id, bidder_id: shuffledBidders[shuffledBidders.length - 1].user_id }
//         });
//     }

//     return updatedProduct;
//   };

//   // EXECUTE ALL PRODUCT CREATIONS IN PARALLEL
//   const products = await Promise.all(
//     allProductsData.map((template, i) => createProductFlow(template, i))
//   );

//   // -------------------------------------------------------
//   // 4. CREATE ORDERS (Parallel)
//   // -------------------------------------------------------
//   const soldProducts = products.filter(p => p.status === ProductStatus.sold);
//   console.log(`Creating Orders for ${soldProducts.length} sold items...`);

//   const orderPromises = soldProducts.map(async (p) => {
//     if (!p.current_highest_bidder_id) return;

//     const order = await prisma.order.create({
//         data: {
//             product_id: p.product_id,
//             buyer_id: p.current_highest_bidder_id,
//             seller_id: p.seller_id,
//             final_price: p.current_price,
//             status: OrderStatus.pending_payment, 
//             shipping_address: null,             
//             buyer_confirmed_receipt: false,     
//             seller_review_id: null,             
//             buyer_review_id: null,              
//             created_at: new Date(),             
//         }
//     });

//     // Create Chat messages in parallel
//     await prisma.orderChat.createMany({
//         data: [
//             { order_id: order.order_id, sender_id: p.current_highest_bidder_id, message_text: "When will the item be shipped?", sent_at: new Date(p.end_time.getTime() + 100000) },
//             { order_id: order.order_id, sender_id: p.seller_id, message_text: "Handed over to shipping!", sent_at: new Date(p.end_time.getTime() + 200000) },
//             { order_id: order.order_id, sender_id: p.current_highest_bidder_id, message_text: "Thanks!", sent_at: new Date(p.end_time.getTime() + 300000) },
//         ]
//     });
//   });

//   await Promise.all(orderPromises);

//   console.log('✅  SEEDING COMPLETED!');
//   console.log(`   - Users created: ${admin ? 21 : 0}`);
//   console.log(`   - Products created: ${products.length}`);
// }

// main()
//   .catch((e) => {
//     console.error(e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })


import { PrismaClient, UserRole, ProductStatus, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// --- HELPER FUNCTIONS ---
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const randomBoolean = () => Math.random() < 0.5;

// --- STRICT ADDRESS GENERATOR ---
// Dữ liệu mẫu đảm bảo không chứa dấu phẩy bên trong để tránh lỗi split
const CITIES = ["Ho Chi Minh City", "Ha Noi", "Da Nang", "Can Tho", "Hai Phong"];
const DISTRICTS = ["District 1", "Cau Giay District", "Hai Chau District", "Ninh Kieu District", "Le Chan District"];
const WARDS = ["Ben Nghe Ward", "Yen Hoa Ward", "Thach Thang Ward", "An Cu Ward", "Cat Dai Ward"];
const STREETS = ["Nguyen Hue", "Xuan Thuy", "Bach Dang", "CMT8", "To Hieu", "Le Loi", "Tran Hung Dao"];

// Hàm này đảm bảo trả về chuỗi có đúng 3 dấu phẩy
// Format: "123 Nguyen Hue, Ben Nghe Ward, District 1, Ho Chi Minh City"
const generateAddress = () => {
  const houseNum = randomInt(1, 999);
  const street = randomElement(STREETS);
  const ward = randomElement(WARDS);
  const district = randomElement(DISTRICTS);
  const city = randomElement(CITIES);
  
  // QUAN TRỌNG: Format chuẩn 4 phần ngăn cách bởi dấu phẩy
  // parts[0]: Address line (Số nhà + đường)
  // parts[1]: Ward
  // parts[2]: District
  // parts[3]: City
  return `${houseNum} ${street}, ${ward}, ${district}, ${city}`;
};

const SAMPLE_DESCRIPTIONS = [
  "New 100% full box international warranty available.",
  "Used but in mint condition no scratches battery life at 95%.",
  "Vintage item rare find for collectors slight wear and tear.",
  "Unwanted gift selling cheap for quick cash meet up in HCMC.",
  "Imported directly from Japan high quality materials."
];

async function main() {
  console.log('🗑️  CLEANING DATABASE...');
  
  const deleteOrder = [
    prisma.sellerUpgradeRequest.deleteMany(),
    prisma.orderChat.deleteMany(),
    prisma.order.deleteMany(),
    prisma.reviews.deleteMany(),
    prisma.productQandA.deleteMany(),
    prisma.watchlist.deleteMany(),
    prisma.bidHistory.deleteMany(),
    prisma.productImages.deleteMany(),
    prisma.productDescriptionHistory.deleteMany(),
    prisma.deniedBidders.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
    prisma.auctionConfig.deleteMany(),
  ];

  for (const action of deleteOrder) {
    await action;
  }

  console.log('🌱  SEEDING STARTED...');

  // 1. CONFIG
  await prisma.auctionConfig.create({
    data: { extend_window_minutes: 5, extend_duration_minutes: 10 }
  });

  // 2. USERS
  const password = bcrypt.hashSync('Demo1234!', 10);
  
  // Create Admin
  await prisma.user.create({
    data: { 
      email: 'admin@gmail.com', password, name: 'Super Admin', 
      role: UserRole.admin, is_email_verified: true,
      address: generateAddress() // "123 Le Loi, Ben Nghe Ward, District 1, Ho Chi Minh City"
    }
  });

  // Create Sellers
  const sellers = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: { 
        email: `seller${i}@gmail.com`, password, name: `Shop Seller ${i}`, 
        address: generateAddress(), role: UserRole.seller, is_email_verified: true,
      }
    });
    sellers.push(user);
  }

  // Create Bidders
  const bidders = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: { 
        email: `bidder${i}@gmail.com`, password, name: `Nguyen Van Bidder ${i}`, 
        address: generateAddress(), role: UserRole.bidder, is_email_verified: true,
      }
    });
    bidders.push(user);
  }

  // Upgrade Requests
  await prisma.sellerUpgradeRequest.create({
    data: { user_id: bidders[0].user_id, message: "I want to sell my old laptop." }
  });

  // 3. CATEGORIES
  const categoriesData = [
    { l1: 'Electronics', l2: 'Laptop' },
    { l1: 'Electronics', l2: 'Mobile Phone' },
    { l1: 'Fashion', l2: 'Watches' },
    { l1: 'Fashion', l2: 'Sneakers' },
    { l1: 'Collectibles', l2: 'Antiques' }
  ];
  
  const categories = await Promise.all(
    categoriesData.map(cat => prisma.category.create({
      data: { name_level_1: cat.l1, name_level_2: cat.l2 }
    }))
  );

  // 4. PRODUCTS & BIDDING SIMULATION
  const productTemplates = [
    { name: 'iPhone 15 Pro Max', catIdx: 1, price: 20000000 },
    { name: 'MacBook Pro M3', catIdx: 0, price: 40000000 },
    { name: 'Rolex Submariner', catIdx: 2, price: 150000000 },
    { name: 'Nike Air Jordan 1', catIdx: 3, price: 5000000 },
    { name: 'Ming Dynasty Vase', catIdx: 4, price: 10000000 },
    { name: 'Sony PlayStation 5', catIdx: 0, price: 12000000 },
    { name: 'Samsung S24 Ultra', catIdx: 1, price: 25000000 },
    { name: 'Vintage Kodak Camera', catIdx: 4, price: 2000000 }
  ];

  const allProductsToCreate = [...productTemplates, ...productTemplates, ...productTemplates];
  const createdProducts = [];

  for (let i = 0; i < allProductsToCreate.length; i++) {
    const tmpl = allProductsToCreate[i];
    const seller = randomElement(sellers);
    const category = categories[tmpl.catIdx];
    
    const isSold = i % 2 === 0; 
    const status = isSold ? ProductStatus.sold : ProductStatus.open;
    
    let createdTime = new Date();
    let endTime = new Date();

    if (isSold) {
      createdTime.setDate(createdTime.getDate() - 7);
      endTime = new Date(createdTime);
      endTime.setDate(endTime.getDate() + 3);
    } else {
      createdTime.setDate(createdTime.getDate() - 1);
      endTime = new Date();
      endTime.setDate(endTime.getDate() + 3);
    }

    const startPrice = tmpl.price;
    const stepPrice = 50000;

    const product = await prisma.product.create({
      data: {
        seller_id: seller.user_id,
        category_id: category.category_id,
        name: `${tmpl.name} #${i + 1}`,
        status: status,
        start_price: startPrice,
        step_price: stepPrice,
        current_price: startPrice,
        buy_now_price: startPrice * 3,
        created_at: createdTime,
        end_time: endTime,
        auto_extend: true,
        images: {
          create: [
            { image_url: `https://placehold.co/600x400/2563eb/FFF?text=${encodeURIComponent(tmpl.name)}` },
            { image_url: `https://placehold.co/600x400/1e293b/FFF?text=Detail+View` }
          ]
        },
        description_history: {
          create: { description: randomElement(SAMPLE_DESCRIPTIONS), added_at: createdTime }
        }
      }
    });

    let currentPrice = startPrice;
    let highestBidderId = null;
    
    const shouldHaveBids = isSold || randomBoolean();
    
    if (shouldHaveBids) {
      const bidCount = randomInt(3, 10);
      const shuffledBidders = [...bidders].sort(() => 0.5 - Math.random());

      for (let k = 0; k < bidCount; k++) {
        const bidder = shuffledBidders[k % shuffledBidders.length];
        const bidAmount = currentPrice + stepPrice + (randomInt(1, 5) * 10000);
        
        const bidTime = new Date(createdTime.getTime() + (k * 1000 * 60 * 60));

        await prisma.bidHistory.create({
          data: {
            product_id: product.product_id,
            bidder_id: bidder.user_id,
            bid_amount: bidAmount,
            bid_time: bidTime > endTime ? endTime : bidTime
          }
        });

        currentPrice = bidAmount;
        highestBidderId = bidder.user_id;
      }

      await prisma.product.update({
        where: { product_id: product.product_id },
        data: {
          current_price: currentPrice,
          current_highest_bidder_id: highestBidderId,
          bid_count: bidCount
        }
      });
      
      createdProducts.push({ ...product, current_price: currentPrice, current_highest_bidder_id: highestBidderId });
    }
  }

  // 5. ORDERS & REVIEWS
  const soldProducts = createdProducts.filter(p => p.status === ProductStatus.sold && p.current_highest_bidder_id);

  console.log(`📦 Creating Orders for ${soldProducts.length} items...`);

  for (const p of soldProducts) {
    const rand = Math.random();
    let orderStatus = OrderStatus.pending_payment;
    if (rand > 0.4) orderStatus = OrderStatus.completed;
    else if (rand > 0.3) orderStatus = OrderStatus.shipped;
    else if (rand > 0.2) orderStatus = OrderStatus.payment_confirmed;
    else if (rand > 0.1) orderStatus = OrderStatus.cancelled;

    // Lấy buyer để lấy địa chỉ ship (đảm bảo cũng đúng format vì đã gen ở trên)
    const buyer = bidders.find(b => b.user_id === p.current_highest_bidder_id);

    const order = await prisma.order.create({
      data: {
        product_id: p.product_id,
        buyer_id: p.current_highest_bidder_id!,
        seller_id: p.seller_id,
        final_price: p.current_price,
        status: orderStatus,
        shipping_address: buyer?.address, // Sử dụng lại địa chỉ chuẩn format của user
        created_at: p.end_time,
      }
    });

    if (orderStatus === OrderStatus.completed) {
      await prisma.reviews.create({
        data: {
          product_id: p.product_id,
          reviewer_id: p.current_highest_bidder_id!,
          reviewee_id: p.seller_id,
          is_positive: true,
          comment: "Great seller, fast shipping! Product as described.",
          order_as_buyer_review: { connect: { order_id: order.order_id } }
        }
      });

      await prisma.reviews.create({
        data: {
          product_id: p.product_id,
          reviewer_id: p.seller_id,
          reviewee_id: p.current_highest_bidder_id!,
          is_positive: true,
          comment: "Fast payment, recommended buyer +++",
          order_as_seller_review: { connect: { order_id: order.order_id } }
        }
      });

      await prisma.user.update({ where: { user_id: p.seller_id }, data: { plus_review: { increment: 1 } } });
      await prisma.user.update({ where: { user_id: p.current_highest_bidder_id! }, data: { plus_review: { increment: 1 } } });
    }

    await prisma.orderChat.create({
      data: {
        order_id: order.order_id,
        sender_id: p.current_highest_bidder_id!,
        message_text: "Hello, when can you ship this?",
        sent_at: new Date(p.end_time.getTime() + 60000)
      }
    });
  }

  console.log('✅ SEEDING COMPLETED!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });