'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductById,
  fetchProductsByCategory,
} from '../../../store/slices/productsSlice';
import { addToCart } from '../../../store/slices/cartSlice';
import Navbar from '../../../components/Navbar';
import ProductCard from '../../../components/ProductCard';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Minus, Plus, Loader2, Check, ChevronLeft, ChevronRight, MessageSquare,} from 'lucide-react';
import toast from 'react-hot-toast';
import { wishlistAPI } from '../../../lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );
  const { items } = useSelector((state) => state.products);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductById(params.id));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (selectedProduct?.category) {
      dispatch(fetchProductsByCategory(selectedProduct.category));
    }
  }, [dispatch, selectedProduct?.category]);
 
  const productImages = selectedProduct
    ? [
        selectedProduct.image,
        selectedProduct.image,
        selectedProduct.image,
        selectedProduct.image,
      ]
    : [];

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    setIsAdding(true);

    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(selectedProduct));
    }

    setTimeout(() => {
      setIsAdding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 500);
  };

  const handleQuantityChange = (action) => {
    if (action === 'increment') {
      setQuantity((prev) => Math.min(prev + 1, 10));
    } else if (action === 'decrement') {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (!userId) {
        toast.error('Please login to add items to wishlist');
        return;
      }
      if (!isFavorite) {
        await wishlistAPI.add({
          userId: Number(userId),
          productId: selectedProduct.id,
          title: selectedProduct.title,
          image: selectedProduct.image,
          price: selectedProduct.price,
        });
        toast.success('Added to wishlist!');
        setIsFavorite(true);
      } else { 
        toast.success('Removed from wishlist');
        setIsFavorite(false);
      }
    } catch (error) {
      toast.error('Failed to update wishlist. Please try again.');
    }
  };

  const relatedProducts = items
    .filter(
      (product) =>
        product.category === selectedProduct?.category &&
        product.id !== selectedProduct?.id
    )
    .slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-xl text-gray-600 font-medium">
              Loading product...
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="py-4 flex items-center space-x-2 text-sm text-gray-600">
            <a
              href="/"
              className="hover:text-primary-600 transition-colors duration-200"
            >
              Home
            </a>
            <span>/</span>
            
              <a href="/catalog" className="hover:text-primary-600 transition-colors duration-200"  >
              Catalog
            </a>
            <span>/</span>
            
              <a href={`/catalog?category=${selectedProduct.category}`} className="hover:text-primary-600 transition-colors duration-200">
              {selectedProduct.category}
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {selectedProduct.title.slice(0, 30)}...
            </span>
          </nav>

          {/* Main Product Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden group">
                  <Image
                    src={productImages[selectedImage]}
                    alt={selectedProduct.title}
                    fill
                    className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                    priority
                  />

                  {/* Image Navigation Arrows */}
                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev === 0 ? productImages.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                      </button>
                      <button
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev === productImages.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-900" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Images */}
                <div className="grid grid-cols-4 gap-4">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square bg-gray-50 rounded-lg overflow-hidden transition-all duration-200 ${
                        selectedImage === index
                          ? 'ring-2 ring-primary-600 shadow-lg'
                          : 'hover:ring-2 hover:ring-gray-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${selectedProduct.title} - ${index + 1}`}
                        fill
                        className="object-contain p-2"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Category Badge */}
                <div className="inline-block px-4 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold">
                  {selectedProduct.category}
                </div>

                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {selectedProduct.title}
                </h1>

                {/* Rating */}
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

                {/* Price */}
                <div className="py-4 border-y border-gray-200">
                  <div className="flex items-baseline space-x-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${(selectedProduct.price * 1.3).toFixed(2)}
                    </span>
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                      Save 23%
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Quantity
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange('decrement')}
                        disabled={quantity === 1}
                        className="px-4 py-3 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <Minus className="w-5 h-5 text-gray-600" />
                      </button>
                      <span className="px-8 py-3 font-semibold text-lg text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange('increment')}
                        disabled={quantity === 10}
                        className="px-4 py-3 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <Plus className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-600">
                      (Max 10 per order)
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      isAdding || showSuccess
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800'
                    }`}
                  >
                    {showSuccess ? (
                      <>
                        <Check className="w-6 h-6" />
                        <span>Added to Cart!</span>
                      </>
                    ) : isAdding ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-6 h-6" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleToggleFavorite}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      isFavorite
                        ? 'border-red-500 bg-red-50 text-red-500'
                        : 'border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-500'
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`}
                    />
                  </button>

                  <button className="p-4 rounded-xl border-2 border-gray-300 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Truck className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        Free Delivery
                      </p>
                      <p className="text-xs text-gray-600">On orders over $50</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        Secure Payment
                      </p>
                      <p className="text-xs text-gray-600">100% protected</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <RotateCcw className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        Easy Returns
                      </p>
                      <p className="text-xs text-gray-600">30-day guarantee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
            <div className="border-b border-gray-200 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 pb-4">
                Product Details
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedProduct.category}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-semibold text-gray-900">
                      #{selectedProduct.id}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Availability:</span>
                    <span className="font-semibold text-green-600">
                      In Stock
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedProduct.rating?.rate?.toFixed(1)} / 5.0
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Customer Reviews ({selectedProduct.rating?.count || 0})
                  </h3>
                  <Link
                    href={`/product/${selectedProduct.id}/feedback`}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>View All Reviews</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div> 
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Similar Products
                </h2>
                <a
                  href={`/catalog?category=${selectedProduct.category}`}
                  className="text-primary-600 hover:text-primary-700 font-semibold flex items-center space-x-2 group"
                >
                  <span>View All</span>
                  <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}