import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const calculateTimeRemainingForPosted = (endTimeStr: string | null | undefined): string => {
  if (!endTimeStr) return 'N/A';

  const endDate = new Date(endTimeStr);

  return endDate.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatCurrency = (priceStr: string | null | undefined): string => {
  if (!priceStr) return '';
  const price = Number(priceStr);
  return new Intl.NumberFormat('de-DE').format(price) + ' USD';
};

export const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const calculateTimeRemaining = (endTimeStr: string | null | undefined): string => {
  if (!endTimeStr) return 'N/A';

  const endDate = new Date(endTimeStr);
  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();

  if (diffMs <= 0) return 'Auction ended';

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days >= 3) {
    return endDate.toLocaleDateString('vi-VN', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  }

  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} left`;

  return 'Ending soon';
};

export type Product = {
  id?: string | number;
  name: string;
  bid_count: number;
  current_price: string;
  buy_now_price: string | null;
  end_time: string;
  created_at: string;
  highest_bidder_name: string | null;
  image_url: string | null;
  isWatchlisted: boolean;
  isSeller: boolean;
};

export const MemoProductCard = memo(({ product }: { product: Product }) => {
  const {
    id,
    name,
    bid_count,
    current_price,
    buy_now_price,
    end_time,
    created_at,
    highest_bidder_name,
    image_url,
    isSeller,
  } = product;

  // 1. Thêm logic kiểm tra xem đã hết giờ chưa
  // Sử dụng Date.now() để so sánh thời gian thực
  const isEnded = new Date(end_time).getTime() < Date.now();

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(end_time));
  const [inWatchList, setInWatchList] = useState(!!product.isWatchlisted);
  const [isWatchLoading, setIsWatchLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const buyNowPriceValue = Number(buy_now_price);
  const canBuyNow = buyNowPriceValue > 0;

  useEffect(() => {
    setInWatchList(!!product.isWatchlisted);
  }, [product.isWatchlisted]);

  useEffect(() => {
    const updateTimer = () => {
      const newTimeLeft = calculateTimeRemaining(end_time);
      setTimeLeft(newTimeLeft);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [end_time]);

  const handleToggleWatchList = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWatchLoading || isSeller || isEnded) return; // Chặn thêm nếu đã end
    setIsWatchLoading(true);

    const endpoint = inWatchList ? `/api/watch-list/${id}` : '/api/watch-list/add';
    const method = inWatchList ? 'DELETE' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id }),
      });

      if (!response.ok) throw new Error('Failed to update watch list');
      setInWatchList(!inWatchList);
    } catch (error: any) {
      console.error(error);
      alert('Signin and try again.');
    } finally {
      setIsWatchLoading(false);
    }
  };

  const handleBuyNowClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canBuyNow || isEnded) return; // Chặn mua nếu đã end

    if (confirm(`Buy now for ${formatCurrency(buy_now_price)}?`)) {
      setIsSubmitting(true);
      try {
        const response = await fetch(`/api/products/${id}/buy-now`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Purchase failed');

        alert('Buy successfully!');
        window.location.reload();
      } catch (error: any) {
        alert(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Logic useDiffTimer giữ nguyên
  function useDiffTimer(created_at: string) {
    const [diff, setDiff] = useState(() => {
      return (Date.now() - new Date(created_at).getTime()) / 1000 / 60;
    });

    useEffect(() => {
      if (diff > 10) return;
      const msLeft = (10 - diff) * 60 * 1000;
      const timeout = setTimeout(() => {
        setDiff((Date.now() - new Date(created_at).getTime()) / 1000 / 60);
      }, msLeft);
      return () => clearTimeout(timeout);
    }, [created_at, diff]);

    return diff;
  }

  const diff = useDiffTimer(created_at);

  return (
    <Link to={`/product/${id}`}>
      <div
        className={`${
          diff <= 10
            ? 'border border-[#8D0000] shadow-[0_0_10px_rgba(141,0,0,0.6)]'
            : 'border border-gray-200 shadow-sm'
        } p-2 rounded-md overflow-hidden flex flex-col transition-shadow h-full bg-white group hover:shadow-md`}
      >
        {/* Phần ảnh giữ nguyên */}
        <div className="relative w-full aspect-4/3 bg-gray-100 shrink-0">
          <img
            src={
              image_url ? `/api/assets/${image_url}` : 'https://placehold.co/600x400?text=No+Image'
            }
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <p className="text-gray-500 text-[10px] absolute bottom-2 left-2 bg-white/90 rounded-md px-2 py-1 shadow-sm font-medium z-10">
            Bids: {bid_count}
          </p>
        </div>

        <div className="p-3 flex flex-col grow">
          <div className="h-10 mb-2">
            <h3 className="font-semibold text-gray-800 text-sm leading-5 line-clamp-2" title={name}>
              {name}
            </h3>
          </div>

          <div className="h-13 mb-3 flex flex-col justify-between">
            <div className="flex justify-between items-end">
              <span className="text-gray-600 text-xs">Current Price</span>
              <p className="font-bold text-[#8D0000] text-lg leading-none">
                {formatCurrency(current_price)}
              </p>
            </div>
            <p className="text-gray-400 text-xs">Posted: {formatDate(created_at)}</p>
          </div>

          <div className="h-auto bg-gray-50 p-2 rounded-md mb-2 flex flex-col justify-center">
            <span className="text-gray-500 text-xs block mb-1">Highest Bidder</span>
            <p className="font-medium text-gray-800 text-sm truncate leading-snug">
              {highest_bidder_name || 'No bids yet'}
            </p>
          </div>

          <div className="mt-auto">
            <p className="text-red-600 font-semibold text-xs text-end mb-2 h-4">{timeLeft}</p>

            {/* 2. Logic hiển thị các nút */}
            {isSeller ? (
              <div className="w-full h-[84px] bg-amber-50 text-amber-800 border border-amber-200 rounded flex flex-col items-center justify-center gap-1 cursor-default shadow-sm transition-colors hover:bg-amber-100">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-[11px] opacity-80">You are the seller</span>
                </div>
              </div>
            ) : isEnded ? (
              // UI KHI AUCTION KẾT THÚC: Ẩn các nút chức năng, hiện thông báo
              <div className="w-full h-[84px] bg-gray-100 text-gray-500 border border-gray-200 rounded flex flex-col items-center justify-center gap-1 cursor-default">
                <span className="font-bold text-sm">Auction Ended</span>
                <span className="text-[10px]">No longer accepting bids</span>
              </div>
            ) : (
              // UI KHI AUCTION CÒN HOẠT ĐỘNG
              <>
                <button
                  onClick={handleToggleWatchList}
                  disabled={isWatchLoading}
                  className={`w-full flex items-center justify-center gap-1.5 font-medium py-2 mb-2 rounded border transition-colors duration-200 text-sm
                    ${
                      inWatchList
                        ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  {isWatchLoading ? (
                    <span className="text-xs">Updating...</span>
                  ) : inWatchList ? (
                    <>
                      {/* SVG Remove */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs">Remove from Watchlist</span>
                    </>
                  ) : (
                    <>
                      {/* SVG Add */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="text-xs">Add to Watchlist</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNowClick}
                  disabled={!canBuyNow || isSubmitting}
                  className={`w-full font-bold py-2 rounded text-sm transition-colors shadow-sm 
                    ${
                      canBuyNow
                        ? 'bg-[#8D0000] hover:bg-red-900 text-white cursor-pointer'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {isSubmitting
                    ? 'Processing...'
                    : canBuyNow
                      ? `Buy Now: ${formatCurrency(buy_now_price)}`
                      : 'Auction Only'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});
