'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../store/slices/productsSlice';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(setSearchQuery(query));
      router.push(`/catalog?search=${encodeURIComponent(query)}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    dispatch(setSearchQuery(''));
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div
          className={`relative flex items-center bg-white rounded-2xl transition-all duration-300 ${
            isFocused
              ? 'shadow-xl ring-2 ring-primary-500/50'
              : 'shadow-lg hover:shadow-xl'
          }`}
        >
          {/* Search Icon */}
          <div className="absolute left-4 flex items-center pointer-events-none">
            <Search
              className={`w-5 h-5 transition-colors duration-300 ${
                isFocused ? 'text-primary-600' : 'text-gray-400'
              }`}
            />
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search for products, brands, or categories..."
            className="w-full py-4 pl-12 pr-24 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none rounded-2xl"
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-20 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Search Button */}
        
        </div>

        {/* Search Suggestions Hint */}
        {isFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100">
            <p className="text-sm text-gray-600">
              Try searching: <span className="font-medium text-primary-600">electronics</span>,{' '}
              <span className="font-medium text-primary-600">jewelry</span>,{' '}
              <span className="font-medium text-primary-600">clothing</span>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}