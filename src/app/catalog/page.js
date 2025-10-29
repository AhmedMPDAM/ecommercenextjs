'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import {
  fetchAllProducts,
  fetchProductsByCategory,
  setSearchQuery,
} from '../../store/slices/productsSlice';
import Navbar from '../../components/Navbar';
import ProductCard from '../../components/ProductCard';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Loader2,
  Grid3x3,
  List,
} from 'lucide-react';

function CatalogContent() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { items, filteredProducts, loading, error, categories } = useSelector(
    (state) => state.products
  );

  // Filter and Sort States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Get search and category from URL
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  useEffect(() => {
    if (categoryParam && categoryParam !== 'all') {
      dispatch(fetchProductsByCategory(categoryParam));
      setSelectedCategory(categoryParam);
    } else {
      dispatch(fetchAllProducts());
      setSelectedCategory('all');
    }
  }, [dispatch, categoryParam]);

  useEffect(() => {
    if (searchQuery) {
      dispatch(setSearchQuery(searchQuery));
    }
  }, [dispatch, searchQuery]);

  // Get products to display
  const productsToDisplay = searchQuery ? filteredProducts : items;

  // Apply filters
  const getFilteredProducts = () => {
    let filtered = [...productsToDisplay];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Rating filter
    filtered = filtered.filter(
      (product) => (product.rating?.rate || 0) >= minRating
    );

    return filtered;
  };

  // Apply sorting
  const getSortedProducts = (products) => {
    let sorted = [...products];

    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        sorted.sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0));
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      case 'newest':
        sorted.reverse();
        break;
      default:
        break;
    }

    return sorted;
  };

  const filteredAndSorted = getSortedProducts(getFilteredProducts());

  // Pagination
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredAndSorted.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, minRating, sortBy, searchQuery]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      dispatch(fetchAllProducts());
    } else {
      dispatch(fetchProductsByCategory(category));
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSortBy('default');
    dispatch(setSearchQuery(''));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-xl text-gray-600 font-medium">
              Loading products...
            </p>
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
          {/* Page Header */}
          <div className="py-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : categoryParam && categoryParam !== 'all'
                ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}`
                : 'All Products'}
            </h1>
            <p className="text-gray-600">
              Showing {currentProducts.length} of {filteredAndSorted.length}{' '}
              products
            </p>
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-2xl shadow-md p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 lg:hidden"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-medium">Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-4 flex-1 justify-between lg:justify-end">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popularity">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-md text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white shadow-md text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside
              className={`lg:w-64 space-y-6 ${
                showFilters ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Category
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value="all"
                        checked={selectedCategory === 'all'}
                        onChange={() => handleCategoryChange('all')}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700 group-hover:text-primary-600 transition-colors">
                        All Products
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value="electronics"
                        checked={selectedCategory === 'electronics'}
                        onChange={() => handleCategoryChange('electronics')}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700 group-hover:text-primary-600 transition-colors">
                        Electronics
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value="jewelery"
                        checked={selectedCategory === 'jewelery'}
                        onChange={() => handleCategoryChange('jewelery')}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700 group-hover:text-primary-600 transition-colors">
                        Jewelry
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value="men's clothing"
                        checked={selectedCategory === "men's clothing"}
                        onChange={() => handleCategoryChange("men's clothing")}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700 group-hover:text-primary-600 transition-colors">
                        Men's Clothing
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value="women's clothing"
                        checked={selectedCategory === "women's clothing"}
                        onChange={() =>
                          handleCategoryChange("women's clothing")
                        }
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700 group-hover:text-primary-600 transition-colors">
                        Women's Clothing
                      </span>
                    </label>
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], parseInt(e.target.value)])
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">$0</span>
                      <span className="font-semibold text-primary-600">
                        ${priceRange[1]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Minimum Rating
                  </h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1, 0].map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center space-x-2 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                          <span className="text-gray-700 ml-2 group-hover:text-primary-600 transition-colors">
                            {rating === 0 ? 'All' : `${rating}+`}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {currentProducts.length > 0 ? (
                <>
                  <div
                    className={`grid gap-6 ${
                      viewMode === 'grid'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-1'
                    }`}
                  >
                    {currentProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center space-x-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Previous
                      </button>

                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                currentPage === page
                                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <X className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      No Products Found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your filters or search criteria
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}