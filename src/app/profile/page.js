'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchUserProfile, logout } from '../../store/slices/userSlice';
import { profilesAPI, wishlistAPI, ordersAPI } from '../../lib/api';
import Navbar from '../../components/Navbar';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Package,
  Heart, 
  LogOut,
  Loader2,
  ShoppingBag,
  TrendingUp,
  Calendar,
} from 'lucide-react';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [profileId, setProfileId] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (userId) {
      dispatch(fetchUserProfile(userId));
      // Load wishlist and orders from protected resources
      wishlistAPI
        .listMine(userId)
        .then((res) => setWishlist(Array.isArray(res.data) ? res.data : []))
        .catch(() => setWishlist([]));
      ordersAPI
        .listMine(userId)
        .then((res) => setOrderHistory(Array.isArray(res.data) ? res.data : []))
        .catch(() => setOrderHistory([]));
    }
  }, [isAuthenticated, dispatch, router]);

  useEffect(() => {
    if (user) {
      if (user.id) setProfileId(user.id);
      setFormData({
        firstName: user.firstName || user.first_name || '',
        lastName: user.lastName || user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      // find profile row
      let id = profileId;
      if (!id) {
        const res = await profilesAPI.getMine(userId);
        const row = Array.isArray(res.data) ? res.data[0] : null;
        id = row?.id;
      }
      if (id) {
        await profilesAPI.update(id, { ...formData, userId: Number(userId) });
      }
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch {
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  // wishlist and orderHistory are loaded from API

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-xl text-gray-600 font-medium">
              Loading profile...
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
              My Account
            </h1>
            <p className="text-gray-600">
              Manage your profile and view your activity
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <ShoppingBag className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{cartItems.length}</span>
              </div>
              <p className="text-blue-100">Items in Cart</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{orderHistory.length}</span>
              </div>
              <p className="text-green-100">Total Orders</p>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Heart className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{wishlist.length}</span>
              </div>
              <p className="text-pink-100">Wishlist Items</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">${totalAmount.toFixed(0)}</span>
              </div>
              <p className="text-purple-100">Cart Total</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                {/* User Avatar */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {formData.firstName?.charAt(0) || 'U'}
                      {formData.lastName?.charAt(0) || ''}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {formData.firstName} {formData.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{formData.email}</p>
                </div>

                {/* Navigation Tabs */}
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      activeTab === 'profile'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile Info</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      activeTab === 'orders'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    <span>Order History</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      activeTab === 'wishlist'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                    <span>Wishlist</span>
                  </button>

                
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
            <div className="lg:col-span-3">
              {/* Profile Info Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Profile Information
                    </h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* First Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                          />
                        </div>
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Last Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          rows={3}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order History Tab */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Order History
                  </h2>

                  <div className="space-y-4">
                    {orderHistory.map((order) => (
                      <div
                        key={order.id}
                        className="border-2 border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <span className="text-lg font-bold text-gray-900">
                                Order #{order.id}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  order.status === 'Delivered'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{order.date}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Package className="w-4 h-4" />
                                <span>{order.items} items</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Total</p>
                              <p className="text-2xl font-bold text-gray-900">
                                ${order.total.toFixed(2)}
                              </p>
                            </div>
                            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    My Wishlist
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="border-2 border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="relative w-full h-48 bg-gray-50 rounded-lg mb-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain p-4"
                          />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">
                            ${item.price.toFixed(2)}
                          </span>
                          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm font-medium">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
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