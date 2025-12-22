import { ProductStatus, OrderStatus } from '@prisma/client';

export interface TabContent {
  /* ===== PRODUCT CORE ===== */
  product_id: number;
  name: string;
  status?: ProductStatus;

  current_price?: number;
  buy_now_price?: number;

  bid_count?: number;
  end_time?: string;

  auto_extend?: boolean;
  review_needed?: boolean;

  seller?: {
    user_id: string;
    name: string;
  }

  category: {
    category_id: number;
    category_name_level_1: string;
    category_name_level_2?: string | null;
  }

  current_highest_bidder?: {
    user_id: string;
    name: string;
  }

  image_url: string;
  bid_time?: string;
  q_and_a_count?: number;
  reviews_count?: number;

  order?: {
    order_id: number;
    final_price?: number;
    status: OrderStatus;

    created_at: string;
    updated_at: string;

    buyer?: {
      user_id: string;
      name: string;
    },
  }

  buyer_review?: {
    review_id: number;

    reviewer_id: string;
    reviewer_name: string;

    is_positive: boolean;
    comment?: string | null;
    created_at: string;
  };

  seller_review?: {
    review_id: number;

    reviewer_id: string;
    reviewer_name: string;

    is_positive: boolean;
    comment?: string | null;
    created_at: string;
  }
};


// export type ProductItem = {

//   highest_bidder_name?: string;
// };

// type BiddingProduct = {
//   product_id: number;
//   name: string;
//   image_url: string;
//   status: ProductStatus;
//   max_bid: number;
//   buy_now_price?: number;
//   current_price: number;
//   bid_count: number;
//   end_time: string;

//   seller_name: string;
//   category_name: string;
//   current_highest_bidder_name?: string;
// };

// type WonProduct = {
//   product_id: number;
//   name: string;
//   image_url: string;
//   final_price: number;
//   won_at: string;
//   order_status: OrderStatus;
//   seller_name: string;
//   category_name: string;
//   can_review: boolean;
//   order_id: number;
// };

// type WatchlistItem = {
//   product_id: number;
//   name: string;
//   image_url: string;
//   current_highest_bidder_name: string | null;
//   current_price: number;
//   buy_now_price?: number;
//   bid_count: number;
//   end_time: string;
//   seller_name: string;
//   category_name: string;
// };

// type ReviewReceived = {
//   review_id: number;
//   reviewer_name: string;
//   is_positive: boolean;
//   comment: string | null;
//   created_at: string;
//   product_name: string;
//   product_id: number;
// };


export type Profile = {
  name: string;
  email: string;
  address: string;
  birthdate: string;
  role: string;
  created_at: string;
  total_bids: number;
  bids_this_week: number;
  total_wins: number;
  win_rate: number;
  watchlist_count: number;
  rating: number;
  rating_label: string;
  bidding_products: Array<TabContent>;
  won_products: Array<TabContent>;
  watchlist: Array<TabContent>;
  ratings: Array<TabContent>;
};

export type SetTab = (tab: 'bidding' | 'won-products' | 'watchlist' | 'ratings') => void;
export type SetAction = (action: 'view-tabs' | 'edit-profile' | 'change-password') => void;
