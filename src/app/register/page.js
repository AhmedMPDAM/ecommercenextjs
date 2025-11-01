'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { registerUser } from '../../store/slices/userSlice';
import { useForm } from 'react-hook-form';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    MapPin,
    Phone,
    Loader2,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isAuthenticated, loading } = useSelector((state) => state.user);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password');

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const onSubmit = async (data) => {
        const payload = {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            address: data.address,
        };
        const result = await dispatch(registerUser(payload));
        if (registerUser.fulfilled.match(result)) {
            toast.success('Account created successfully! Welcome!');
            router.push('/');
        } else if (registerUser.rejected.match(result)) {
            const errorMessage = result.payload || 'Registration failed';
            if (typeof errorMessage === 'string') {
                if (errorMessage.toLowerCase().includes('email') && (errorMessage.toLowerCase().includes('exist') || errorMessage.toLowerCase().includes('already'))) {
                    toast.error('Email already exists. Please use a different email.');
                } else if (errorMessage.toLowerCase().includes('email')) {
                    toast.error('Invalid email format.');
                } else {
                    toast.error('Registration failed. Please try again.');
                }
            } else {
                toast.error('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
            <Navbar />

            <main className="pt-20 pb-16">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-12">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl mb-4 shadow-lg">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Create Account
                            </h1>
                            <p className="text-gray-600">
                                Join us today and start shopping with exclusive deals
                            </p>
                        </div>

                        {/* Register Form Card */}
                        <div className="bg-white rounded-3xl shadow-xl p-8">
                            <form onSubmit={handleSubmit((data) => {
                                // Form validation errors are handled by react-hook-form
                                onSubmit(data);
                            }, (errors) => {
                                // Handle form validation errors
                                if (Object.keys(errors).length > 0) {
                                    toast.error('Invalid form. Please check all fields.');
                                }
                            })} className="space-y-6">
                                {/* Name Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                {...register('firstName', {
                                                    required: 'First name is required',
                                                    minLength: {
                                                        value: 2,
                                                        message: 'Must be at least 2 characters',
                                                    },
                                                })}
                                                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${errors.firstName
                                                        ? 'border-red-500'
                                                        : 'border-gray-300'
                                                    }`}
                                                placeholder="John"
                                            />
                                        </div>
                                        {errors.firstName && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>{errors.firstName.message}</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                {...register('lastName', {
                                                    required: 'Last name is required',
                                                    minLength: {
                                                        value: 2,
                                                        message: 'Must be at least 2 characters',
                                                    },
                                                })}
                                                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="Doe"
                                            />
                                        </div>
                                        {errors.lastName && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>{errors.lastName.message}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Invalid email address',
                                                },
                                            })}
                                            className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="john.doe@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.email.message}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            {...register('phone', {
                                                required: 'Phone number is required',
                                                pattern: {
                                                    value: /^[0-9]{10}$/,
                                                    message: 'Invalid phone number (10 digits)',
                                                },
                                            })}
                                            className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="1234567890"
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.phone.message}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Address Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                                            <MapPin className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <textarea
                                            {...register('address', {
                                                required: 'Address is required',
                                                minLength: {
                                                    value: 10,
                                                    message: 'Address must be at least 10 characters',
                                                },
                                            })}
                                            rows={3}
                                            className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none ${errors.address ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="123 Main St, City, State, ZIP"
                                        />
                                    </div>
                                    {errors.address && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.address.message}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            {...register('password', {
                                                required: 'Password is required',
                                                minLength: {
                                                    value: 8,
                                                    message: 'Password must be at least 8 characters',
                                                },
                                                pattern: {
                                                    value:
                                                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                    message:
                                                        'Password must include uppercase, lowercase, number, and special character',
                                                },
                                            })}
                                            className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Create a strong password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.password.message}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            {...register('confirmPassword', {
                                                required: 'Please confirm your password',
                                                validate: (value) =>
                                                    value === password || 'Passwords do not match',
                                            })}
                                            className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${errors.confirmPassword
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                                }`}
                                            placeholder="Confirm your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.confirmPassword.message}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Terms and Conditions */}
                                <div>
                                    <label className="flex items-start space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            {...register('terms', {
                                                required: 'You must accept the terms and conditions',
                                            })}
                                            className="w-5 h-5 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                            I agree to the{' '}
                                            <a
                                                href="#"
                                                className="font-semibold text-primary-600 hover:text-primary-700"
                                            >
                                                Terms and Conditions
                                            </a>{' '}
                                            and{' '}
                                            <a
                                                href="#"
                                                className="font-semibold text-primary-600 hover:text-primary-700"
                                            >
                                                Privacy Policy
                                            </a>
                                        </span>
                                    </label>
                                    {errors.terms && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.terms.message}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            <span>Create Account</span>
                                        </>
                                    )}
                                </button>
                            </form>
                            {/* Sign In Link */}
                            <div className="mt-6 text-center">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <Link
                                        href="/login"
                                        className="font-semibold text-primary-600 hover:text-primary-700"
                                    >
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}