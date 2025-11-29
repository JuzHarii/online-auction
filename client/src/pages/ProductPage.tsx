import { useState } from 'react';
import { Star, User, ShieldCheck, MapPin, Heart, Share2 } from 'lucide-react';

// --- MOCK DATA ---
const PRODUCT_DATA = {
  id: 'kawasaki-z1000-2021',
  title: 'Kawasaki Z1000 2021',
  postedDate: 'Nov 10, 2024',
  endsIn: '2 days 4 hours',
  currentBid: 2900,
  bidsPlaced: 15,
  buyNowPrice: 3100,
  minBidStep: 50,
  images: [
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop', // Ảnh lớn demo
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?q=80&w=200&auto=format&fit=crop',
  ],
  details: {
    brand: 'Kawasaki',
    year: '2021',
    condition: 'Used – 20,000 km',
    engine: 'Automatic Mechanical',
    frameMaterial: 'Stainless Steel',
    color: 'Jet Black',
    performance: 'High Power Street Naked',
    exhaust: 'Custom Performance Exhaust - Akrapovic',
  },
  description: [
    "Experience raw power and refined design with this 2021 Kawasaki Z1000 — a motorcycle that perfectly blends muscle, precision, and attitude. Finished in glossy jet black, it commands attention on every road, while its aggressive naked styling highlights the Z lineage's signature boldness.",
    "Powered by a liquid-cooled inline-four engine, this machine delivers thrilling acceleration and a smooth ride, whether on urban streets or open highways. The 20,000 km on the odometer reflect careful use and regular maintenance, ensuring performance and reliability that live up to the Kawasaki name.",
    "The bike comes fitted with a custom exhaust system for a deeper, sportier tone and improved throttle response — a true pleasure for riders who crave both sound and speed."
  ],
  conditionText: "This Kawasaki is in excellent running condition, with all components inspected and functioning perfectly. The bodywork remains clean with only minimal wear consistent with normal use. It's a ready-to-ride street beast for anyone who values performance, craftsmanship, and iconic design.",
  seller: {
    name: 'Ryan Gosling',
    rating: 4.8,
    reviews: 727,
  },
  topBidder: {
    name: 'Emma Stone',
    rating: 4.7,
    reviews: 69,
  },
  qa: [
    {
      question: "Does this bike come with a warranty?",
      asker: "Sarah M.",
      answer: "Yes, the bike comes with a 6-month seller warranty covering mechanical defects.",
      responder: "John Davidson (Seller)",
      time: "2 days ago"
    },
    {
      question: "Are the original papers included?",
      asker: "David K.",
      answer: "The sale includes the original manual, papers, and service records.",
      responder: "John Davidson (Seller)",
      time: "3 days ago"
    },
    {
        question: "Is the exhaust legal for street use?",
        asker: "Mike T.",
        answer: "Yes, the Akrapovic exhaust installed is street legal and passes noise regulations.",
        responder: "John Davidson (Seller)",
        time: "5 days ago"
      }
  ]
};

const ProductDetail = () => {
  const [activeImage, setActiveImage] = useState(PRODUCT_DATA.images[0]);
  const [bidAmount, setBidAmount] = useState('');

  return (
    <div className="bg-gray-50 flex-1 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Images & Info (Chiếm 8 phần) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Image Gallery */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="aspect-4/3 w-full bg-gray-200 rounded-lg overflow-hidden mb-4 relative">
                <img 
                  src={activeImage} 
                  alt="Product Main" 
                  className="w-full h-full object-cover"
                />
                {/* Overlay actions (optional) */}
                <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="p-2 bg-white/80 rounded-full hover:bg-white text-gray-700">
                        <Share2 size={20} />
                    </button>
                    <button className="p-2 bg-white/80 rounded-full hover:bg-white text-gray-700">
                        <Heart size={20} />
                    </button>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {PRODUCT_DATA.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`cursor-pointer rounded-md overflow-hidden border-2 aspect-4/3 ${activeImage === img ? 'border-red-600' : 'border-transparent'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover hover:opacity-80 transition" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Description Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Product description</h2>
              
              {/* Detail List */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Detail</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><span className="font-semibold text-gray-900">Brand:</span> {PRODUCT_DATA.details.brand}</li>
                  <li><span className="font-semibold text-gray-900">Year:</span> {PRODUCT_DATA.details.year}</li>
                  <li><span className="font-semibold text-gray-900">Condition:</span> {PRODUCT_DATA.details.condition}</li>
                  <li><span className="font-semibold text-gray-900">Engine:</span> {PRODUCT_DATA.details.engine}</li>
                  <li><span className="font-semibold text-gray-900">Frame Material:</span> {PRODUCT_DATA.details.frameMaterial}</li>
                  <li><span className="font-semibold text-gray-900">Color:</span> {PRODUCT_DATA.details.color}</li>
                  <li><span className="font-semibold text-gray-900">Performance:</span> {PRODUCT_DATA.details.performance}</li>
                  <li><span className="font-semibold text-gray-900">Exhaust:</span> {PRODUCT_DATA.details.exhaust}</li>
                </ul>
              </div>

              <hr className="my-6 border-gray-200" />

              {/* Description Text */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  {PRODUCT_DATA.description.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

               <hr className="my-6 border-gray-200" />

              {/* Condition Text */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Condition</h3>
                <p className="text-gray-600 leading-relaxed">
                  {PRODUCT_DATA.conditionText}
                </p>
              </div>
            </div>

            {/* Q&A Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Questions & Answers</h2>
                    <button className="bg-red-700 text-white px-4 py-2 rounded font-medium hover:bg-red-800 transition">
                        Ask a question
                    </button>
                </div>

                <div className="space-y-6">
                    {PRODUCT_DATA.qa.map((item, idx) => (
                        <div key={idx} className="space-y-3">
                            <div>
                                <h4 className="font-bold text-gray-900">{item.question}</h4>
                                <p className="text-xs text-gray-400 mt-1">Asked by {item.asker} • Rating: 4.7</p>
                            </div>
                            
                            {/* Answer Box */}
                            <div className="bg-blue-50 border-l-4 border-blue-200 p-4 rounded-r-md">
                                <p className="text-sm font-semibold text-gray-800 mb-1">
                                    {item.responder} <span className="font-normal text-gray-500 text-xs ml-2">{item.time}</span>
                                </p>
                                <p className="text-gray-700 text-sm">
                                    {item.answer}
                                </p>
                                <div className="mt-2 flex items-center text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                                    <span className="mr-1">👍</span> Helpful (12)
                                </div>
                            </div>
                            {idx !== PRODUCT_DATA.qa.length - 1 && <hr className="border-gray-100 mt-4" />}
                        </div>
                    ))}
                </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar (Chiếm 4 phần) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Bidding Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h1 className="text-xl font-bold text-gray-900 mb-1">{PRODUCT_DATA.title}</h1>
              <p className="text-sm text-gray-500 mb-4">Condition: Used | Category: Vehicles</p>
              
              <div className="flex justify-between text-xs text-gray-500 mb-6">
                <div>Posted: <br/><span className="text-gray-900 font-medium">{PRODUCT_DATA.postedDate}</span></div>
                <div className="text-right">Ends in: <br/><span className="text-gray-900 font-medium">{PRODUCT_DATA.endsIn}</span></div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500">Current bid:</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">${PRODUCT_DATA.currentBid.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">{PRODUCT_DATA.bidsPlaced} bids placed</span>
                </div>
              </div>

              {/* Buy It Now Box */}
              <div className="bg-red-50 border border-red-100 p-3 rounded mb-6 flex justify-between items-center">
                 <span className="text-sm font-medium text-red-800">Buy it now!</span>
                 <span className="text-xl font-bold text-gray-900">${PRODUCT_DATA.buyNowPrice.toLocaleString()}</span>
              </div>

              {/* Action Form */}
              <div className="space-y-3">
                <div className="space-y-1">
                    <label className="text-xs text-gray-500">Your Bid amount</label>
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            className="flex-1 border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-red-500"
                            placeholder={`Min ${PRODUCT_DATA.currentBid + PRODUCT_DATA.minBidStep}`}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                        />
                        <div className="bg-gray-200 text-gray-600 px-3 py-2 rounded font-medium text-sm flex items-center">USD</div>
                    </div>
                    <p className="text-[10px] text-gray-400">Minimum bid: +${PRODUCT_DATA.minBidStep}</p>
                </div>

                <button className="w-full bg-red-800 text-white font-bold py-3 rounded shadow hover:bg-red-900 transition duration-200">
                    Place bid
                </button>
                <button className="w-full bg-white border border-red-800 text-red-800 font-bold py-3 rounded shadow-sm hover:bg-red-50 transition duration-200">
                    Buy now for ${PRODUCT_DATA.buyNowPrice.toLocaleString()}$
                </button>

                <p className="text-[10px] text-center text-gray-400 mt-2">By bidding, you agree to our terms and conditions</p>
              </div>
            </div>

            {/* Seller Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Seller</h3>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                            {PRODUCT_DATA.seller.name}
                        </p>
                        <div className="flex items-center text-xs text-yellow-500">
                            <Star size={12} fill="currentColor" className="mr-1"/> 
                            <span className="font-medium text-gray-700 mr-1">{PRODUCT_DATA.seller.rating}</span>
                            <span className="text-gray-400">({PRODUCT_DATA.seller.reviews} reviews)</span>
                        </div>
                    </div>
                </div>
                <button className="w-full border border-gray-400 text-gray-700 font-medium py-2 rounded hover:bg-gray-50 text-sm transition">
                    Contact seller
                </button>
            </div>

            {/* Top Bidder Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Top bid</h3>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                         <User size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">
                            {PRODUCT_DATA.topBidder.name}
                        </p>
                        <div className="flex items-center text-xs text-yellow-500">
                            <Star size={12} fill="currentColor" className="mr-1"/> 
                            <span className="font-medium text-gray-700 mr-1">{PRODUCT_DATA.topBidder.rating}</span>
                            <span className="text-gray-400">({PRODUCT_DATA.topBidder.reviews} reviews)</span>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;