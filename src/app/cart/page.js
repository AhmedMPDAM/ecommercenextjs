'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import { removeFromCart, increaseQuantity, decreaseQuantity, clearCart,} from '../../store/slices/cartSlice';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, Shield, AlertCircle,} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, totalQuantity, totalAmount } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  const shippingCost = totalAmount > 50 ? 0 : 5.99;
  const taxRate = 0.08; 
  const taxAmount = totalAmount * taxRate;
  const finalTotal = totalAmount + shippingCost + taxAmount - discount;

  const handleApplyPromo = () => {
    setPromoError('');
    const validPromoCodes = {
      SAVE10: 10,
      SAVE20: 20,
      WELCOME15: 15,
    };

    if (validPromoCodes[promoCode.toUpperCase()]) {
      setDiscount(validPromoCodes[promoCode.toUpperCase()]);
      setPromoError('');
    } else if (promoCode) {
      setPromoError('Invalid promo code');
      setDiscount(0);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="text-center max-w-md">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <ShoppingBag className="w-16 h-16 text-gray-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Your Cart is Empty
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Looks like you haven't added any items to your cart yet.
                  Start shopping to fill it up!
                </p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full font-bold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <span>Start Shopping</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </main>
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
              Shopping Cart
            </h1>
            <p className="text-gray-600">
              You have {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}{' '}
              in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={handleClearCart}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="font-medium">Clear Cart</span>
                </button>
              </div>

              {/* Cart Item Cards */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <Link
                        href={`/product/${item.id}`}
                        className="relative w-full sm:w-32 h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 group"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.id}`}
                          className="block group"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                            {item.title}
                          </h3>
                        </Link>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600 font-medium">
                              Quantity:
                            </span>
                            <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() => dispatch(decreaseQuantity(item.id))}
                                className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                              >
                                <Minus className="w-4 h-4 text-gray-600" />
                              </button>
                              <span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => dispatch(increaseQuantity(item.id))}
                                className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                              >
                                <Plus className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                            <div>
                              <p className="text-sm text-gray-500">
                                ${item.price.toFixed(2)} each
                              </p>
                              <p className="text-xl font-bold text-gray-900">
                                ${item.totalPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
 
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="self-start p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
 
              <div className="pt-4">
                <Link
                  href="/catalog"
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold group"
                >
                  <ArrowRight className="w-5 h-5 transform rotate-180 group-hover:-translate-x-1 transition-transform" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
 
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 space-y-6">
                 <h2 className="text-2xl font-bold text-gray-900 pb-4 border-b border-gray-200">
                  Order Summary
                </h2>
 
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Promo Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{promoError}</span>
                    </p>
                  )}
                  {discount > 0 && (
                    <p className="mt-2 text-sm text-green-600 flex items-center space-x-1">
                      <Tag className="w-4 h-4" />
                      <span>Promo code applied! -${discount.toFixed(2)}</span>
                    </p>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    Try: SAVE10, SAVE20, WELCOME15
                  </div>
                </div>
 
                <div className="space-y-3 py-4 border-y border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalQuantity} items)</span>
                    <span className="font-semibold">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Truck className="w-4 h-4" />
                      <span>Shipping</span>
                    </span>
                    <span className="font-semibold">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span className="font-semibold">
                      ${taxAmount.toFixed(2)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
 
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-2xl">${finalTotal.toFixed(2)}</span>
                </div>
 
                {shippingCost > 0 && (
                  <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                    <p className="text-sm text-primary-800">
                      Add{' '}
                      <span className="font-bold">
                        ${(50 - totalAmount).toFixed(2)}
                      </span>{' '}
                      more to get <span className="font-bold">FREE shipping</span>
                      !
                    </p>
                    <div className="mt-2 w-full bg-primary-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((totalAmount / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
 
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
 
                <div className="pt-4 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>Secure 256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span>Free returns within 30 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}