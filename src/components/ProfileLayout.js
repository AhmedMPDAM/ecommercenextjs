'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { fetchUserProfile, logout } from '../store/slices/userSlice';
import Navbar from './Navbar';
import { User, Package, Heart, ShoppingCart, LogOut } from 'lucide-react';

export default function ProfileLayout({ children, activeTab }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (userId) {
      dispatch(fetchUserProfile(userId));
    }
  }, [isAuthenticated, dispatch, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const getFirstName = () => {
    if (!user) return 'U';
    return user.firstName || user.first_name || 'U';
  };

  const getLastName = () => {
    if (!user) return '';
    return user.lastName || user.last_name || '';
  };

  const getEmail = () => {
    if (!user) return '';
    return user.email || '';
  };

  const navigation = [
    { name: 'Profile', href: '/profile', icon: User, tab: 'profile' },
    { name: 'Cart', href: '/profile/cart', icon: ShoppingCart, tab: 'cart' },
    { name: 'Orders', href: '/profile/orders', icon: Package, tab: 'orders' },
    { name: 'Wishlist', href: '/profile/wishlist', icon: Heart, tab: 'wishlist' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[600px]">
          <p className="text-xl text-gray-600 font-medium">Loading profile...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-600">Manage your profile and view your activity</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                {/* User Avatar */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {getFirstName()?.charAt(0)}
                      {getLastName()?.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {getFirstName()} {getLastName()}
                  </h3>
                  <p className="text-sm text-gray-600">{getEmail()}</p>
                </div>

                {/* Navigation Tabs */}
                <nav className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.tab;
                    return (
                      <button
                        key={item.name}
                        onClick={() => router.push(item.href)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

