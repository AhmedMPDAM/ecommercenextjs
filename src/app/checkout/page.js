'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clearCart } from '../../store/slices/cartSlice';
import { useForm } from 'react-hook-form';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import {
    CreditCard,
    Truck,
    MapPin,
    CheckCircle,
    AlertCircle,
    Lock,
    ArrowRight,
    ArrowLeft,
    Loader2,
} from 'lucide-react';

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const { items, totalAmount } = useSelector((state) => state.cart);

    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            firstName: user?.name?.firstname || '',
            lastName: user?.name?.lastname || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            cardNumber: '',
            cardName: '',
            expiryDate: '',
            cvv: '',
        },
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/checkout');
        }

        if (items.length === 0 && !orderComplete) {
            router.push('/cart');
        }
    }, [isAuthenticated, items, router, orderComplete]);

    const shippingCost = totalAmount > 50 ? 0 : 5.99;
    const taxRate = 0.08;
    const taxAmount = totalAmount * taxRate;
    const finalTotal = totalAmount + shippingCost + taxAmount;

    const handleNextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onSubmit = async (data) => {
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            const generatedOrderNumber = 'ORD-' + Date.now();
            setOrderNumber(generatedOrderNumber);
            setOrderComplete(true);
            dispatch(clearCart());
            setIsProcessing(false);
        }, 3000);
    };

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="pt-20 pb-16">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="py-16">
                            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                                {/* Success Icon */}
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-16 h-16 text-green-600" />
                                </div>
                                {/* Success Message */}
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                    Order Confirmed!
                                </h1>
                                <p className="text-xl text-gray-600 mb-8">
                                    Thank you for your purchase. Your order has been successfully placed.
                                </p>

                                {/* Order Details */}
                                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                                    <div className="text-left space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Order Number:</span>
                                            <span className="font-bold text-gray-900">{orderNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Order Date:</span>
                                            <span className="font-semibold text-gray-900">
                                                {new Date().toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Amount:</span>
                                            <span className="font-bold text-2xl text-primary-600">
                                                ${finalTotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Confirmation Message */}
                                <p className="text-gray-600 mb-8">
                                    We've sent a confirmation email with your order details to{' '}
                                    <span className="font-semibold">{user?.email}</span>
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => router.push('/profile')}
                                        className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        View Order Status
                                    </button>
                                    <button
                                        onClick={() => router.push('/catalog')}
                                        className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
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
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
                        <p className="text-gray-600">Complete your purchase securely</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center space-x-4">
                            {/* Step 1 */}
                            <div className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all duration-300 ${currentStep >= 1
                                            ? 'bg-primary-600 text-white shadow-lg'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {currentStep > 1 ? <CheckCircle className="w-6 h-6" /> : '1'}
                                </div>
                                <span
                                    className={`ml-2 font-semibold hidden sm:inline ${currentStep >= 1 ? 'text-primary-600' : 'text-gray-500'
                                        }`}
                                >
                                    Shipping
                                </span>
                            </div>

                            <div
                                className={`w-16 h-1 rounded ${currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-200'
                                    }`}
                            ></div>

                            {/* Step 2 */}
                            <div className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all duration-300 ${currentStep >= 2
                                            ? 'bg-primary-600 text-white shadow-lg'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {currentStep > 2 ? <CheckCircle className="w-6 h-6" /> : '2'}
                                </div>
                                <span
                                    className={`ml-2 font-semibold hidden sm:inline ${currentStep >= 2 ? 'text-primary-600' : 'text-gray-500'
                                        }`}
                                >
                                    Payment
                                </span>
                            </div>

                            <div
                                className={`w-16 h-1 rounded ${currentStep >= 3 ? 'bg-primary-600' : 'bg-gray-200'
                                    }`}
                            ></div>

                            {/* Step 3 */}
                            <div className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all duration-300 ${currentStep >= 3
                                            ? 'bg-primary-600 text-white shadow-lg'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    3
                                </div>
                                <span
                                    className={`ml-2 font-semibold hidden sm:inline ${currentStep >= 3 ? 'text-primary-600' : 'text-gray-500'
                                        }`}
                                >
                                    Review
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Step 1: Shipping Information */}
                                {currentStep === 1 && (
                                    <div className="bg-white rounded-2xl shadow-lg p-8">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="p-2 bg-primary-100 rounded-lg">
                                                <Truck className="w-6 h-6 text-primary-600" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                Shipping Information
                                            </h2>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Name Fields */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('firstName', {
                                                            required: 'First name is required',
                                                        })}
                                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.firstName
                                                                ? 'border-red-500'
                                                                : 'border-gray-300'
                                                            }`}
                                                        placeholder="John"
                                                    />
                                                    {errors.firstName && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors.firstName.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('lastName', {
                                                            required: 'Last name is required',
                                                        })}
                                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.lastName
                                                                ? 'border-red-500'
                                                                : 'border-gray-300'
                                                            }`}
                                                        placeholder="Doe"
                                                    />
                                                    {errors.lastName && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors.lastName.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Contact Fields */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        {...register('email', {
                                                            required: 'Email is required',
                                                        })}
                                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="john@example.com"
                                                    />
                                                    {errors.email && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors.email.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                        Phone
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        {...register('phone', {
                                                            required: 'Phone is required',
                                                        })}
                                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="1234567890"
                                                    />
                                                    {errors.phone && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors.phone.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Address */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                    Street Address
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register('address', {
                                                        required: 'Address is required',
                                                    })}
                                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    placeholder="123 Main Street"
                                                />
                                                {errors.address && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.address.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* City, State, ZIP */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('city', { required: 'City is required' })}
                                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.city ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="New York"
                                                    />
                                                    {errors.city && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors.city.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                        State
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('state', { required: 'State is required' })}
                                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.state ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="NY"
                                                    />
                                                    {errors.state && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors.state.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                        ZIP Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('zipCode', {
                                                            required: 'ZIP code is required',
                                                        })}
                                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.zipCode ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="10001"
                                                    />
                                                    {errors.zipCode && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors.zipCode.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Navigation */}
                                        <div className="mt-8 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={handleNextStep}
                                                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg"
                                            >
                                                <span>Continue to Payment</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Payment Information */}
                                {currentStep === 2 && (
                                    <div className="bg-white rounded-2xl shadow-lg p-8">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="p-2 bg-primary-100 rounded-lg">
                                                <CreditCard className="w-6 h-6 text-primary-600" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                Payment Information
                                            </h2>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Card Number */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                    Card Number
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register('cardNumber', {
                                                        required: 'Card number is required',
                                                        pattern: {
                                                            value: /^[0-9]{16}$/,
                                                            message: 'Invalid card number (16 digits)',
                                                        },
                                                    })}
                                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.cardNumber
                                                            ? 'border-red-500'
                                                            : 'border-gray-300'
                                                        }`}
                                                    placeholder="1234 5678 9012 3456"
                                                    maxLength={16}
                                                />
                                                {errors.cardNumber && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.cardNumber.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Cardholder Name */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                    Cardholder Name
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register('cardName', {
                                                        required: 'Cardholder name is required',
                                                    })}
                                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.cardName ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    placeholder="JOHN DOE"
                                                />
                                                {errors.cardName && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.cardName.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Expiry and CVV */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                        Expiry Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('expiryDate', {
                                                            required: 'Expiry date is required',
                                                            pattern: {
                                                                value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                                                                message: 'Format: MM/YY',
                                                            },
                                                        })}
                                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.expiryDate
                                                                ? 'border-red-500'
                                                                : 'border-gray-300'
                                                            }`}
                                                        placeholder="MM/YY"
                                                        maxLength={5}
                                                    />
                                                    {errors.expiryDate && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors.expiryDate.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                        CVV
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('cvv', {
                                                            required: 'CVV is required',
                                                            pattern: {
                                                                value: /^[0-9]{3,4}$/,
                                                                message: 'Invalid CVV',
                                                            },
                                                        })}
                                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.cvv ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="123"
                                                        maxLength={4}
                                                    />
                                                    {errors.cvv && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors.cvv.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Security Notice */}
                                            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
                                                <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-semibold text-green-800">
                                                        Your payment is secure
                                                    </p>
                                                    <p className="text-xs text-green-700 mt-1">
                                                        We use 256-bit SSL encryption to protect your payment
                                                        information
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Navigation */}
                                        <div className="mt-8 flex justify-between">
                                            <button
                                                type="button"
                                                onClick={handlePrevStep}
                                                className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                                            >
                                                <ArrowLeft className="w-5 h-5" />
                                                <span>Back</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleNextStep}
                                                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg"
                                            >
                                                <span>Review Order</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Review Order */}
                                {currentStep === 3 && (
                                    <div className="bg-white rounded-2xl shadow-lg p-8">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="p-2 bg-primary-100 rounded-lg">
                                                <CheckCircle className="w-6 h-6 text-primary-600" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                Review Your Order
                                            </h2>
                                        </div>

                                        {/* Shipping Info Review */}
                                        <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                                <MapPin className="w-5 h-5" />
                                                <span>Shipping Address</span>
                                            </h3>
                                            <p className="text-gray-700">
                                                {watch('firstName')} {watch('lastName')}
                                                <br />
                                                {watch('address')}
                                                <br />
                                                {watch('city')}, {watch('state')} {watch('zipCode')}
                                                <br />
                                                {watch('phone')}
                                            </p>
                                        </div>

                                        {/* Payment Info Review */}
                                        <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                                <CreditCard className="w-5 h-5" />
                                                <span>Payment Method</span>
                                            </h3>
                                            <p className="text-gray-700">
                                                Card ending in ****{' '}
                                                {watch('cardNumber')?.slice(-4) || '****'}
                                                <br />
                                                {watch('cardName')}
                                            </p>
                                        </div>

                                        {/* Order Items */}
                                        <div className="mb-6">
                                            <h3 className="font-semibold text-gray-900 mb-4">
                                                Order Items ({items.length})
                                            </h3>
                                            <div className="space-y-3">
                                                {items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                                                    >
                                                        <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={item.image}
                                                                alt={item.title}
                                                                fill
                                                                className="object-contain p-2"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-gray-900 truncate">
                                                                {item.title}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                Qty: {item.quantity}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-gray-900">
                                                                ${item.totalPrice.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Navigation */}
                                        <div className="mt-8 flex justify-between">
                                            <button
                                                type="button"
                                                onClick={handlePrevStep}
                                                className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                                            >
                                                <ArrowLeft className="w-5 h-5" />
                                                <span>Back</span>
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isProcessing}
                                                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span>Processing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="w-5 h-5" />
                                                        <span>Place Order</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    Order Summary
                                </h2>

                                {/* Items List */}
                                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-3">
                                            <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                ${item.totalPrice.toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3 py-4 border-t border-gray-200">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">${totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="font-semibold">
                                            {shippingCost === 0 ? (
                                                <span className="text-green-600">FREE</span>
                                            ) : (
                                                `$${shippingCost.toFixed(2)}`
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span className="font-semibold">${taxAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-primary-600">
                                        ${finalTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
