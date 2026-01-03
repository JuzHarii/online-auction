import { useEffect, useState } from 'react';
import { ProductHeaderInfo, UserCard } from './product-header';
import { Product } from '../lib/type';
import { formatCurrency } from './product';
import BidderBidHistory from './bid-history';

export const BidderSidebar = ({
  product,
  onBidSuccess,
}: {
  // Assuming Product type in ../lib/type has been updated with:
  // allow_unrated_bidder: boolean;
  // review_needed: boolean;
  product: Product;
  onBidSuccess: () => void;
}) => {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [inWatchList, setInWatchList] = useState(!!product.isWatchlisted);
  const [isWatchLoading, setIsWatchLoading] = useState(false);

  useEffect(() => {
    setInWatchList(!!product.isWatchlisted);
  }, [product.isWatchlisted]);

  const isAuctionEnded = new Date(product.endsIn).getTime() < new Date().getTime();

  const currentBid = Number(product.currentBid);
  const minBidStep = Number(product.minBidStep);
  const minNextBid = currentBid + minBidStep;
  const buyNowPrice = Number(product.buyNowPrice);
  const canBuyNow = buyNowPrice > 0;

  const handleBid = async () => {
    if (isAuctionEnded) return alert('Auction has ended.');

    const bidValue = parseFloat(bidAmount);

    if (isNaN(bidValue)) return alert('Please enter a valid number.');
    if (bidValue < minNextBid)
      return alert(`Bid too low! Min: ${formatCurrency(minNextBid.toString())}`);

    if (confirm(`Place bid of ${formatCurrency(bidValue.toString())}?`)) {
      setIsSubmitting(true);
      try {
        const response = await fetch(`/api/bid/${product.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: bidValue }),
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        const data = await response.json();
        await onBidSuccess();
        alert('Bid placed successfully!');
        setBidAmount('');
      } catch (error: any) {
        alert(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBuyNow = async () => {
    if (isAuctionEnded) return;

    if (confirm(`Buy now for ${formatCurrency(buyNowPrice.toString())}?`)) {
      setIsSubmitting(true);
      try {
        const response = await fetch(`/api/products/${product.id}/buy-now`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Purchase failed');
        onBidSuccess();
        window.location.reload();
      } catch (error: any) {
        alert(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleToggleWatchList = async () => {
    if (isWatchLoading) return;
    setIsWatchLoading(true);

    const endpoint = inWatchList ? `/api/watch-list/${product.id}` : '/api/watch-list/add';
    const method = inWatchList ? 'DELETE' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!response.ok) throw new Error('Failed to update watch list');
      setInWatchList(!inWatchList);
    } catch (error: any) {
      console.error(error);
      alert('Could not update watchlist. Please try again.');
    } finally {
      setIsWatchLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <ProductHeaderInfo product={product} />

        <div className="space-y-3">
          {/* --- NEW SECTION: REVIEW & RATING INFO --- */}
          {product.review_needed && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-900">
              <div className="flex items-center gap-2 mb-2 font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Bid Restrictions
              </div>
              <div className="space-y-1 pl-1">
                <div className="flex justify-between">
                  <span className="text-amber-800">Review Needed:</span>
                  <span className="font-medium">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-800">Allow Unrated Bidder:</span>
                  <span
                    className={`font-medium ${
                      product.allow_unrated_bidder ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {product.allow_unrated_bidder ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          )}
          {/* --- END NEW SECTION --- */}

          {!isAuctionEnded ? (
            <>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Your Bid amount</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    disabled={isSubmitting}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:border-red-500 outline-none"
                    placeholder={`Min ${formatCurrency(minNextBid.toString())}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                  <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded text-sm flex items-center">
                    USD
                  </div>
                </div>
              </div>

              <button
                onClick={handleBid}
                disabled={isSubmitting}
                className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-3 rounded shadow transition disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Place Bid'}
              </button>

              {canBuyNow && (
                <button
                  onClick={handleBuyNow}
                  disabled={isSubmitting}
                  className="w-full bg-white border border-red-800 text-red-800 font-bold py-3 rounded hover:bg-red-50 transition"
                >
                  Buy Now ({formatCurrency(buyNowPrice.toString())})
                </button>
              )}

              <button
                onClick={handleToggleWatchList}
                disabled={isWatchLoading}
                className={`w-full flex items-center justify-center gap-2 font-medium py-3 rounded border transition-colors duration-200
                  ${
                    inWatchList
                      ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
              >
                {isWatchLoading ? (
                  <span className="text-sm">Updating...</span>
                ) : (
                  <>
                    {inWatchList ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Remove from Watchlist</span>
                      </>
                    ) : (
                      <>
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
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span>Add to Watchlist</span>
                      </>
                    )}
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="w-full bg-gray-100 text-gray-500 font-bold py-4 rounded text-center border border-gray-200">
              Auction Ended
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
        <div className="pb-4">
          <UserCard title="Seller" user={product.seller} />
        </div>
        <div className="pt-4">
          <UserCard title="Top Bidder" user={product.topBidder} />
        </div>
      </div>

      <BidderBidHistory id={product.id} />
    </div>
  );
};