import { CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';

import GoogleButton from '@/components/GoogleButton';
import { useAuth } from '@/hooks/useLogInHook';
import { API_URL } from '@/utils/Rutes';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setIsSessionActive } = useAuth();

  const handleSignInLink = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem('shouldTriggerLogin', '1');
    navigate('/');
  };
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    watch,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchPassword = watch('password');

  const clearError = () => {
    setError('');
    clearErrors();
  };

  const onSubmit = async (data: FormData) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}auth/register`, {
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password,
      });

      const user = response.data.user;
      const token = response.data.access_token;

      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
      });
      setIsSessionActive(true);
      localStorage.setItem('token', token);

      localStorage.setItem('shouldTriggerLogin', 'true');
      navigate('/');
    } catch (err: any) {
      const status = err.response ? err.response.status : 500;
      if (status === 400) {
        setError('All fields are required.');
        return;
      }

      if (status) {
        setError('Email already exists. Please use a different email address.');
        return;
      }

      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = (result: {
    user?: any;
    token?: string;
    credentialResponse?: CredentialResponse;
    decoded?: any;
  }) => {
    setIsLoading(true);
    setError('');

    if (!result.user || !result.token) {
      setError('Google authentication failed. Please try again.');
      setIsLoading(false);
      return;
    }

    const user = result.user;
    setUser({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    setIsSessionActive(true);
    navigate('/');
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lotto-blue-500 text-xl font-bold text-white">
              B
            </div>
            <span className="text-xl font-bold text-gray-900">Block-Lotto</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/" onClick={handleSignInLink} className="font-medium text-lotto-green-600 hover:text-lotto-green-700">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register('name', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters long',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Name must be less than 50 characters',
                  },
                  pattern: {
                    value: /^[\p{L}\s'-]{2,50}$/u,
                    message: 'Name can only contain letters (including accents), spaces, hyphens, and apostrophes',
                  },
                  onChange: clearError,
                })}
                className={clsx(
                  'mt-1 block w-full rounded-lg border bg-white px-4 py-3 text-gray-900 transition-colors focus:outline-none focus:ring-2',
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-lotto-green-500 focus:ring-lotto-green-500/20'
                )}
                disabled={isLoading}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address',
                  },
                  maxLength: {
                    value: 254,
                    message: 'Email address is too long',
                  },
                  onChange: clearError,
                })}
                className={clsx(
                  'mt-1 block w-full rounded-lg border bg-white px-4 py-3 text-gray-900 transition-colors focus:outline-none focus:ring-2',
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-lotto-green-500 focus:ring-lotto-green-500/20'
                )}
                disabled={isLoading}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                      maxLength: {
                        value: 128,
                        message: 'Password is too long',
                      },
                      validate: {
                        hasLower: value =>
                          /(?=.*[a-z])/.test(value) || 'Password must contain at least one lowercase letter',
                        hasUpper: value =>
                          /(?=.*[A-Z])/.test(value) || 'Password must contain at least one uppercase letter',
                        hasNumber: value => /(?=.*\d)/.test(value) || 'Password must contain at least one number',
                      },
                      onChange: clearError,
                    })}
                    className={clsx(
                      'mt-1 block w-full rounded-lg border bg-white px-4 py-3 pr-10 text-gray-900 transition-colors focus:outline-none focus:ring-2',
                      errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-lotto-green-500 focus:ring-lotto-green-500/20'
                    )}
                    disabled={isLoading}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <AiOutlineEyeInvisible className="h-5 w-5" /> : <AiOutlineEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === watchPassword || 'Passwords do not match',
                      onChange: clearError,
                    })}
                    className={clsx(
                      'block mt-1 w-full rounded-lg border bg-white px-4 py-3 pr-10 text-gray-900 transition-colors focus:outline-none focus:ring-2',
                      errors.confirmPassword
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-lotto-green-500 focus:ring-lotto-green-500/20'
                    )}
                    disabled={isLoading}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <AiOutlineEyeInvisible className="h-5 w-5" /> : <AiOutlineEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-lotto-green-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-lotto-green-600 focus:outline-none focus:ring-2 focus:ring-lotto-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div>
            <GoogleButton
              onSuccess={handleGoogleLogin}
              onError={err => {
                setError(err || 'Google authentication failed. Please try again.');
                setIsLoading(false);
              }}
              disabled={isLoading}
              text="signup_with"
              theme="outline"
              size="large"
              shape="rectangular"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
