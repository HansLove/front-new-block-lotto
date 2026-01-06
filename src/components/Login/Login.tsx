// components/LoginModal.tsx
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import clsx from 'clsx';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// import { jwtDecode } from "jwt-decode";
import GoogleButton from '@/components/GoogleButton';
import { useAuth } from '@/hooks/useLogInHook';
import { API_URL } from '@/utils/Rutes';

type FormData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export default function LoginModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { isLoginModalOpen, closeLoginModal, setUser, setIsSessionActive } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const clearError = () => {
    setError('');
    clearErrors();
  };

  const handleEmailLogin = async (data: FormData) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}auth/login`, {
        email: data.email,
        password: data.password,
      });

      // Store token in localStorage
      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
      }

      const user = response.data.user;
      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
      });
      setIsSessionActive(true);
      closeLoginModal();
      reset();
      setError('');
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = (result: {
    user: any;
    token: string;
    credentialResponse: CredentialResponse;
    decoded: any;
  }) => {
    setIsLoading(true);
    setError('');
    setUser({
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
    });
    setIsSessionActive(true);
    localStorage.setItem('token', result.token as string);
    closeLoginModal();
    setIsLoading(false);
  };

  return (
    <Transition appear show={isLoginModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={closeLoginModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-10 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-md transform rounded-2xl border border-gray-200 bg-white p-8 text-left align-middle shadow-2xl transition-all">
                <div className="absolute -right-4 -top-4 rounded-full bg-white border border-gray-200 p-1 shadow-lg">
                  <button onClick={closeLoginModal} className="p-1 text-gray-600 transition-colors hover:text-gray-900">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <Dialog.Title as="h3" className="mb-2 text-center text-2xl font-bold text-gray-900">
                  Welcome Back
                </Dialog.Title>
                <p className="mb-6 text-center text-gray-600">Sign in to access your account</p>

                {/* General error message */}
                {error && (
                  <div className="mb-4 flex items-start rounded-lg border border-red-200 bg-red-50 p-3">
                    <ExclamationCircleIcon className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(handleEmailLogin)} className="space-y-5">
                  <div>
                    <h3 className="block text-sm font-medium text-gray-700">Email address</h3>
                    <input
                      type="email"
                      id="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address',
                        },
                        onChange: clearError,
                      })}
                      className={clsx(
                        'mt-1 block w-full rounded-lg border px-4 py-3 shadow-sm transition-colors focus:ring-2 focus:ring-opacity-50 sm:text-sm',
                        'bg-white text-gray-900',
                        errors.email
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-lotto-green-500 focus:ring-lotto-green-500'
                      )}
                      disabled={isLoading}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600" id="email-error">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="block text-sm font-medium text-gray-700">Password</h3>
                    <input
                      type="password"
                      id="password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                        onChange: clearError,
                      })}
                      className={clsx(
                        'mt-1 block w-full rounded-lg border px-4 py-3 shadow-sm transition-colors focus:ring-2 focus:ring-opacity-50 sm:text-sm',
                        'bg-white text-gray-900',
                        errors.password
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-lotto-green-500 focus:ring-lotto-green-500'
                      )}
                      disabled={isLoading}
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600" id="password-error">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        {...register('rememberMe')}
                        className="h-4 w-4 rounded border-gray-300 text-lotto-green-600 focus:ring-lotto-green-500"
                        disabled={isLoading}
                      />
                      <h3 className="ml-2 block text-sm text-gray-700">Remember me</h3>
                    </div>

                    <div className="text-sm">
                      <button
                        type="button"
                        onClick={e => {
                          e.preventDefault();
                          closeLoginModal();
                          navigate('/forgot-password');
                        }}
                        className="font-medium text-lotto-green-600 hover:text-lotto-green-700"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full transform justify-center rounded-lg border border-transparent bg-lotto-green-500 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-lotto-green-600 focus:outline-none focus:ring-2 focus:ring-lotto-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <GoogleButton
                      onSuccess={handleGoogleLogin}
                      onError={err => {
                        setError(err || 'Google authentication failed. Please try again.');
                        setIsLoading(false);
                      }}
                      disabled={isLoading}
                      text="signin_with"
                      theme="outline"
                      size="medium"
                      shape="rectangular"
                    />
                  </div>
                </div>

                <p className="mt-6 text-center text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      closeLoginModal();
                      navigate('/signup');
                    }}
                    className="font-semibold text-lotto-green-600 transition-colors hover:text-lotto-green-700"
                  >
                    Sign up for free
                  </button>
                </p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
