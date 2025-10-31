'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { logout } from '../store/slices/userSlice';
import { useRouter } from 'next/navigation';
import SearchBar from './Searchbar';  

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Jewelry', slug: 'jewelery' },
  { name: "Men's Clothing", slug: "men's clothing" },
  { name: "Women's Clothing", slug: "women's clothing" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const catalogTimeoutRef = useRef(null);

  const cartItems = useSelector((state) => state.cart.totalQuantity);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  // Desktop hover delay for smooth UX
  const handleMouseEnter = () => {
    if (catalogTimeoutRef.current) clearTimeout(catalogTimeoutRef.current);
    setIsCatalogOpen(true);
  };

  const handleMouseLeave = () => {
    catalogTimeoutRef.current = setTimeout(() => {
      setIsCatalogOpen(false);
    }, 150);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-lg'
          : 'bg-white/95 backdrop-blur-sm'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              ModernShop
            </span>
          </Link>

          {/* Desktop Navigation - Now on the left */}
          <div className="hidden md:flex items-center space-x-8 ml-8">
 

            {/* Catalog Dropdown */}
            <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 relative group">
                <span>Catalog</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCatalogOpen ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
              </button>


              {isCatalogOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/catalog?category=${encodeURIComponent(category.slug)}`}
                      className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                      onClick={() => setIsCatalogOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
              <div className="hidden md:block flex-1 max-w-xl mx-8">
    <SearchBar />
  </div>
          {/* Right Side Icons - Pushed to the right */}
          <div className="ml-auto flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 group">
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile" className="p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 group">
                  <User className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                </Link>
                <button onClick={handleLogout} className="p-2 text-gray-700 hover:text-red-600 transition-colors duration-200 group" title="Logout">
                  <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 btn-brand">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {/* Mobile Catalog Accordion */}
            <div>
              <button
                className="w-full flex items-center justify-between py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              >
                Catalog
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isCatalogOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>
              {isCatalogOpen && (
                <div className="pl-4 space-y-1 mt-2 border-l-2 border-primary-200">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/catalog?category=${encodeURIComponent(category.slug)}`}
                      className="block py-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                      onClick={() => {
                        setIsCatalogOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {!isAuthenticated && (
              <Link
                href="/login"
                className="block py-2 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}