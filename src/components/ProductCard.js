'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { useState } from 'react';
import { wishlistAPI } from '../lib/api';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    dispatch(addToCart(product));
    setTimeout(() => setIsAdding(false), 1000);
  };

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (!userId) {
        // silently ignore if not logged in; could also redirect to login
        return;
      }
      if (!isFavorite) {
        await wishlistAPI.add({
          userId: Number(userId),
          productId: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
        });
      }
      setIsFavorite(!isFavorite);
    } catch {
      // ignore errors for now
    }
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            } transition-colors duration-200`}
          />
        </button>

        {/* Product Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-md">
            {product.category}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-5">
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(product.rating?.rate || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              ({product.rating?.count || 0})
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-gray-900 font-semibold mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200 min-h-[3rem]">
            {product.title}
          </h3>

          {/* Price and Cart Button */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`p-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md ${
                isAdding
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800'
              }`}
            >
              {isAdding ? (
                <span className="flex items-center space-x-1">
                  <span className="text-sm">✓</span>
                </span>
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Quick View Hint */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </Link>
  );
}