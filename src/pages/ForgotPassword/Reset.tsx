import { CheckCircleIcon, ExclamationCircleIcon, EyeIcon, EyeSlashIcon, KeyIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@/hooks/useLogInHook';
import { API_URL } from '@/utils/Rutes';

interface FormData {
  password: string;
  confirmPassword: string;
}

interface TokenValidationState {
  isValidating: boolean;
  isValid: boolean;
  error: string | null;
}

const Reset: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { openLoginModal } = useAuth();

  const [tokenValidation, setTokenValidation] = useState<TokenValidationState>({
    isValidating: true,
    isValid: false,
    error: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    clearErrors,
  } = useForm<FormData>({
    mode: 'onTouched',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const watchPassword = watch('password');

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValidation({
          isValidating: false,
          isValid: false,
          error: 'No reset token provided',
        });
        return;
      }

      try {
        const response = await axios.post(`${API_URL}auth/forgot-password/verify`, { token });

        if (response.status === 204) {
          setTokenValidation({
            isValidating: false,
            isValid: true,
            error: null,
          });
        }
      } catch (error: any) {
        let errorMessage = 'Invalid or expired reset token';

        if (error.response?.status === 404) {
          errorMessage = 'Reset token not found';
        } else if (error.response?.status === 410) {
          errorMessage = 'Reset token has expired';
        }

        setTokenValidation({
          isValidating: false,
          isValid: false,
          error: errorMessage,
        });
      }
    };

    validateToken();
  }, [token]);

  const clearError = () => {
    setSubmitError('');
    clearErrors();
  };

  const onSubmit = async (data: FormData) => {
    setSubmitError('');
    setIsSubmitting(true);

    try {
      await axios.post(`${API_URL}auth/reset-password`, {
        token,
        password: data.password,
      });

      setIsSuccess(true);

      // Redirect to login after successful reset
      setTimeout(() => {
        navigate('/', {
          state: { message: 'Password reset successfully! Please log in with your new password.' },
        });
        openLoginModal();
      }, 3000);
    } catch (error: any) {
      let errorMessage = 'Failed to reset password. Please try again.';

      if (error.response?.status === 400) {
        errorMessage = 'Invalid password format';
      } else if (error.response?.status === 410) {
        errorMessage = 'Reset token has expired';
      }

      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (tokenValidation.isValidating) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-slate-950 to-red-800/20" />

        <div className="relative z-10 w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-red-600"></div>
            <h2 className="mt-6 text-2xl font-bold text-white">Validating Reset Token...</h2>
            <p className="mt-2 text-gray-400">Please wait while we verify your reset link.</p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValidation.isValid) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-slate-950 to-red-800/20" />

        <div className="relative z-10 w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-900/20">
              <ExclamationCircleIcon className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">Invalid Reset Link</h2>
            <p className="mt-2 text-gray-400">{tokenValidation.error}</p>

            <button
              onClick={() => navigate('/')}
              className="mt-6 transform rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-semibold text-white transition hover:scale-105 hover:from-red-700 hover:to-red-800"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-slate-950 to-red-800/20" />

        <div className="relative z-10 w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-900/20">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">Password Reset Successfully!</h2>
            <p className="mt-2 text-gray-400">Your password has been updated. Redirecting you to login...</p>

            <div className="mt-6 h-2 w-full rounded-full bg-slate-800">
              <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-green-600 to-green-700"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-slate-950 to-red-800/20" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="rounded-2xl border border-orange-500/30 bg-slate-900/50 p-8 backdrop-blur-sm">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-900/20">
              <KeyIcon className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-white">Reset Your Password</h2>
            <p className="mt-2 text-gray-400">Enter your new password below to complete the reset process.</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {submitError && (
              <div className="rounded-lg border border-red-800 bg-red-900/20 p-4">
                <div className="flex items-start">
                  <ExclamationCircleIcon className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                  <p className="text-sm text-red-300">{submitError}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300" htmlFor="password">
                  New Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
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
                        hasSpecial: value =>
                          /(?=.*[!@#$%^&*_])/.test(value) ||
                          'Password must contain at least one special character (!@#$%^&*_)',
                      },
                      onChange: clearError,
                    })}
                    className={clsx(
                      'block w-full rounded-lg border px-4 py-3 pr-12 transition-colors focus:border-transparent focus:outline-none focus:ring-2',
                      'bg-slate-800 text-white',
                      errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-red-500'
                    )}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-300"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-2 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === watchPassword || 'Passwords do not match',
                      onChange: clearError,
                    })}
                    className={clsx(
                      'block w-full rounded-lg border px-4 py-3 pr-12 transition-colors focus:border-transparent focus:outline-none focus:ring-2',
                      'bg-slate-800 text-white',
                      errors.confirmPassword
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-600 focus:ring-red-500'
                    )}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-300"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirm-password-error" className="mt-2 text-sm text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full transform justify-center rounded-lg border border-transparent bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:scale-[1.02] hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-400 transition-colors hover:text-gray-300"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Background Animation Elements */}
      <div className="absolute -left-24 top-1/4 h-48 w-48 animate-pulse rounded-full bg-red-600/10 blur-3xl" />
      <div className="absolute -right-24 bottom-1/4 h-48 w-48 animate-pulse rounded-full bg-red-700/10 blur-3xl delay-1000" />
    </div>
  );
};

export default Reset;
