import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React from 'react';

import { API_URL } from '@/utils/Rutes';

interface GoogleButtonProps {
  onSuccess?: (result: { user: any; token: string; credentialResponse: CredentialResponse; decoded: any }) => void;
  onError?: (error?: string) => void;
  disabled?: boolean;
  text?: 'signin' | 'signin_with' | 'signup_with' | 'continue_with';
  width?: string;
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
}

const GoogleButton: React.FC<GoogleButtonProps> = ({
  onSuccess,
  onError,
  disabled = false,
  text = 'signin_with',
  width = '100%',
  theme = 'outline',
  size = 'large',
  shape = 'rectangular',
}) => {
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse?.credential as string) as any;
      const payload: Record<string, any> = {
        name: decoded.given_name,
        email: decoded.email?.toLowerCase(),
        exp: decoded.exp,
      };

      const response = await axios.post(`${API_URL}auth/register/google`, payload);
      const user = response.data.user || response.data;
      const token = response.data.access_token;

      if (onSuccess) {
        onSuccess({ user, token, credentialResponse, decoded });
      }
    } catch (err: any) {
      if (!onError) {
        return;
      }

      if (err.response && err.response.data && err.response.data.message) {
        onError(err.response.data.message);
      } else {
        onError('Google authentication failed. Please try again.');
      }
    }
  };

  const handleError = () => {
    if (onError) {
      onError('Google authentication failed. Please try again.');
    }
  };

  if (disabled) {
    return (
      <div className="flex w-full cursor-not-allowed items-center justify-center rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-sm font-medium text-gray-400 shadow-sm dark:border-gray-600 dark:bg-slate-700">
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#9CA3AF"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#9CA3AF"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#9CA3AF"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#9CA3AF"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {text === 'signin_with' || text === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
      </div>
    );
  }

  return (
    <div style={{ width }} className="google-login-wrapper flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text={text}
        theme={theme}
        size={size}
        shape={shape}
        width={width}
      />
    </div>
  );
};

export default GoogleButton;
