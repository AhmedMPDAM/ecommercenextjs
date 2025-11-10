'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { Smartphone, Gem, ShirtIcon, Users, Package } from 'lucide-react';
import { fetchCategories } from '../store/slices/productsSlice';

const CATEGORY_META = {
  electronics: {
    name: 'Electronics',
    icon: Smartphone,
    description: 'Latest gadgets and tech',
    gradient: 'from-blue-500 to-cyan-500',
    bgPattern: 'bg-blue-50',
  },
  jewelery: {
    name: 'Jewelry',
    icon: Gem,
    description: 'Elegant accessories',
    gradient: 'from-amber-500 to-yellow-500',
    bgPattern: 'bg-amber-50',
  },
  "men's clothing": {
    name: "Men's Clothing",
    icon: ShirtIcon,
    description: 'Stylish men fashion',
    gradient: 'from-gray-600 to-gray-800',
    bgPattern: 'bg-gray-50',
  },
  "women's clothing": {
    name: "Women's Clothing",
    icon: Users,
    description: 'Trendy women fashion',
    gradient: 'from-pink-500 to-rose-500',
    bgPattern: 'bg-pink-50',
  },
};

export default function CategoryCards() {
  const dispatch = useDispatch();
  const { categories = [], loading } = useSelector((state) => state.products);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch]);

  const dynamicCategories = Array.isArray(categories)
    ? categories.map((slug, index) => {
        const meta = CATEGORY_META[slug] || {
          name: slug,
          icon: Package,
          description: 'Explore products',
          gradient: 'from-slate-500 to-slate-700',
          bgPattern: 'bg-slate-50',
        };
        return {
          id: index + 1,
          name: meta.name,
          slug,
          icon: meta.icon,
          description: meta.description,
          gradient: meta.gradient,
          bgPattern: meta.bgPattern,
        };
      })
    : [];

  const categoriesToRender = [
    {
      id: 'all',
      name: 'All Products',
      slug: 'all',
      icon: Package,
      description: 'Browse everything',
      gradient: 'from-purple-500 to-indigo-500',
      bgPattern: 'bg-purple-50',
    },
    ...dynamicCategories,
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated collections and find exactly what you're looking for
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categoriesToRender.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={
                  category.slug === 'all'
                    ? '/catalog'
                    : `/catalog?category=${encodeURIComponent(category.slug)}`
                }
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Background with Pattern */}
                <div
                  className={`${category.bgPattern} p-8 h-full flex flex-col items-center justify-center relative overflow-hidden`}
                >
                  {/* Animated Background Circle */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  {/* Icon Container */}
                  <div
                    className={`relative z-10 w-20 h-20 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Category Name */}
                  <h3 className="relative z-10 text-xl font-bold text-gray-900 mb-2 text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 group-hover:bg-clip-text transition-all duration-300">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="relative z-10 text-sm text-gray-600 text-center">
                    {category.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className="relative z-10 mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span
                      className={`text-sm font-semibold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}
                    >
                      Explore →
                    </span>
                  </div>
                </div>

                {/* Shimmer Effect on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}