import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Particles from '@/components/particles';
import { API_URL } from '@/utils/Rutes';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [touched, setTouched] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate email function
  const validateEmail = (value: string): string => {
    if (!value.trim()) {
      return 'Email address is required';
    }
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    if (value.length > 254) {
      return 'Email address is too long';
    }
    return '';
  };

  // Handle email change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Clear server error when user starts typing
    if (error) {
      setError('');
    }

    // Validate only if field has been touched
    if (touched) {
      setValidationError(validateEmail(newEmail));
    }
  };

  // Handle blur event
  const handleEmailBlur = () => {
    setTouched(true);
    setValidationError(validateEmail(email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark field as touched to show validation errors
    setTouched(true);

    // Validate before submission
    const validationMessage = validateEmail(email);
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    setError('');
    setValidationError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}auth/forgot-password`, { email });
      if (response.status !== 204) {
        throw new Error('Unexpected response from server');
      }
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Combined error message (prioritize validation errors)
  const displayError = validationError || error;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 dark:bg-slate-100">
      <Particles className="pointer-events-none absolute inset-0" quantity={100} />

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img className="mx-auto h-16 w-auto dark:hidden" src="/images/logo.png" alt="Block Lotto" />
            <img className="mx-auto hidden h-16 w-auto dark:block" src="/images/logo-light.png" alt="Block Lotto" />
          </Link>

          {isSubmitted && (
            <>
              <h2 className="mt-6 text-3xl font-bold text-white dark:text-gray-900">Check your email</h2>
              <p className="mt-2 text-sm text-gray-400 dark:text-gray-600">
                We&apos;ve sent a password reset link to {email}
              </p>
            </>
          )}
          {!isSubmitted && (
            <>
              <h2 className="mt-6 text-3xl font-bold text-white dark:text-gray-900">Reset your password</h2>
              <p className="mt-2 text-sm text-gray-400 dark:text-gray-600">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </>
          )}
        </div>

        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            {displayError && (
              <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-400">{displayError}</p>
              </div>
            )}

            <div>
              <h3 className="block text-sm font-medium text-gray-300 dark:text-gray-700">Email Address</h3>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className={`mt-1 block w-full rounded-lg border ${
                  touched && validationError
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-gray-600 dark:border-gray-300'
                } bg-slate-800 px-4 py-3 text-white focus:outline-none focus:ring-2 dark:bg-white dark:text-gray-900 ${
                  touched && validationError ? 'focus:ring-red-500' : 'focus:ring-red-500'
                } transition-colors focus:border-transparent`}
                disabled={isLoading}
                aria-invalid={touched && !!validationError}
                aria-describedby={touched && validationError ? 'email-error' : undefined}
              />
              {touched && validationError && (
                <p id="email-error" className="mt-2 text-sm text-red-500 dark:text-red-400">
                  {validationError}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || (touched && !!validationError)}
                className="flex w-full transform justify-center rounded-lg border border-transparent bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:scale-[1.02] hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send reset email'}
              </button>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center text-sm font-medium text-red-500 hover:text-red-400"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to login
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
              <p className="text-sm text-green-800 dark:text-green-400">
                If an account exists for {email}, you will receive a password reset email shortly.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/')}
                className="flex w-full transform justify-center rounded-lg border border-transparent bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:scale-[1.02] hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Return to home
              </button>

              <p className="text-center text-sm text-gray-400 dark:text-gray-600">
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                    setTouched(false);
                    setValidationError('');
                    setError('');
                  }}
                  className="font-medium text-red-500 hover:text-red-400"
                >
                  try again
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
