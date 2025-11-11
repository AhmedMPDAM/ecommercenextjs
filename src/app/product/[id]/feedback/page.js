'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../../../store/slices/productsSlice';
import Navbar from '../../../../components/Navbar';
import { Star, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const categoryReviewTemplates = {
  electronics: [
    {
      name: 'Tech Enthusiast',
      initials: 'TE',
      rating: 5,
      timeAgo: '3 days ago',
      text:
        'Crystal-clear display and fast performance. Perfect for daily work and streaming.',
    },
    {
      name: 'Gadget Lover',
      initials: 'GL',
      rating: 4,
      timeAgo: '1 week ago',
      text:
        'Great value for the price. Battery life could be better but overall very solid.',
    },
  ],
  jewelery: [
    {
      name: 'Style Maven',
      initials: 'SM',
      rating: 5,
      timeAgo: '5 days ago',
      text:
        'Absolutely stunning craftsmanship. The detailing is exquisite and elegant.',
    },
    {
      name: 'Gift Giver',
      initials: 'GG',
      rating: 5,
      timeAgo: '2 weeks ago',
      text:
        'Bought as a gift and it was a hit. Sparkles beautifully in natural light.',
    },
  ],
  "men's clothing": [
    {
      name: 'Daily Wearer',
      initials: 'DW',
      rating: 4,
      timeAgo: '4 days ago',
      text:
        'Comfortable fit and breathable fabric. Works great for casual outings.',
    },
    {
      name: 'Fit Focused',
      initials: 'FF',
      rating: 5,
      timeAgo: '1 week ago',
      text:
        'True to size with premium feel. Washes well without shrinking.',
    },
  ],
  "women's clothing": [
    {
      name: 'Trendy Buyer',
      initials: 'TB',
      rating: 5,
      timeAgo: '6 days ago',
      text:
        'Beautiful cut and very flattering. Fabric feels soft on the skin.',
    },
    {
      name: 'Comfort First',
      initials: 'CF',
      rating: 4,
      timeAgo: '2 weeks ago',
      text:
        'Great everyday piece. Colors match the photos and stitching is neat.',
    },
  ],
  default: [
    {
      name: 'Happy Customer',
      initials: 'HC',
      rating: 5,
      timeAgo: '3 days ago',
      text: 'Exceeded expectations. Would recommend to friends and family.',
    },
    {
      name: 'Verified Buyer',
      initials: 'VB',
      rating: 4,
      timeAgo: '1 week ago',
      text: 'Good quality and fast shipping. Packaging was secure.',
    },
  ],
};

const getCategoryReviews = (category) => {
  const reviews = categoryReviewTemplates[category?.toLowerCase?.() || ''] || categoryReviewTemplates.default;
  return reviews.slice(0, 2);
};

export default function ProductFeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductById(params.id));
    }
  }, [dispatch, params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-xl text-gray-600 font-medium">
              Loading feedback...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => router.push('/catalog')}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-300"
            >
              Back to Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  const reviews = getCategoryReviews(selectedProduct.category);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="py-4 flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link
              href="/"
              className="hover:text-primary-600 transition-colors duration-200"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/catalog"
              className="hover:text-primary-600 transition-colors duration-200"
            >
              Catalog
            </Link>
            <span>/</span>
            <Link
              href={`/product/${selectedProduct.id}`}
              className="hover:text-primary-600 transition-colors duration-200"
            >
              {selectedProduct.title.slice(0, 30)}...
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Customer Reviews</span>
          </nav>

          {/* Back Button */}
          <Link
            href={`/product/${selectedProduct.id}`}
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Product</span>
          </Link>

          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex items-start space-x-6">
              <div className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  width={96}
                  height={96}
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold mb-2">
                  {selectedProduct.category}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedProduct.title}
                </h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(selectedProduct.rating?.rate || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {selectedProduct.rating?.rate?.toFixed(1) || 'N/A'}
                  </span>
                  <span className="text-gray-600">
                    ({selectedProduct.rating?.count || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="border-b border-gray-200 mb-6 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Customer Reviews
              </h2>
              <p className="text-gray-600 mt-1">
                {reviews.length} verified customer feedback
              </p>
            </div>

            <div className="space-y-6">
              {reviews.map((review, idx) => (
                <div key={idx} className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {review.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">
                          {review.name}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {review.rating}.0
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.timeAgo}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {review.text}
                  </p>
                </div>
              ))}
            </div> 
            
            {reviews.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg">
                  No reviews yet for this product.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Be the first to share your experience!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
