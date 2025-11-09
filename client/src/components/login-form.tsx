import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext.tsx';
import { Link } from 'react-router-dom';

const ACCENT_COLOR = '#8D0000';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (values: { email: string; password: string }) => {
  const errors: { email?: string; password?: string } = {};

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export default function SignInForm() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched({
      ...touched,
      [e.target.name]: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTouched({ email: true, password: true });

    if (!isValid) {
      setError('Please fill in all required fields and check email format.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:8000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        const serverMessage = data.message || 'Sign in failed. Please check your credentials.';
        throw new Error(serverMessage);
      }

      setSuccess(true);
      setUser({
        name: data.data.name || data.data.email,
        email: data.data.email,
      });

      console.log('[v0] Sign in successful:', data);
      navigate('/');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred during sign in.';
      setError(errorMessage);
      console.error('[v0] Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 border border-gray-200 shadow-lg rounded-lg bg-white w-full max-w-md mx-auto">
      {error && (
        <div
          className={`mb-4 p-3 bg-red-100 border border-[${ACCENT_COLOR}] text-[${ACCENT_COLOR}] rounded-md text-sm`}
        >
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
          Sign in successful! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2.5">
          <label htmlFor="email" className="text-sm font-semibold text-gray-900">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[${ACCENT_COLOR}] transition-colors ${
              touched.email && errors.email
                ? `border-[${ACCENT_COLOR}] focus:ring-[${ACCENT_COLOR}]`
                : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {touched.email && errors.email && (
            <p className={`text-xs font-medium text-[${ACCENT_COLOR}]`}>{errors.email}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <label htmlFor="password" className="text-sm font-semibold text-gray-900">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[${ACCENT_COLOR}] transition-colors ${
              touched.password && errors.password
                ? `border-[${ACCENT_COLOR}] focus:ring-[${ACCENT_COLOR}]`
                : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {touched.password && errors.password && (
            <p className={`text-xs font-medium text-[${ACCENT_COLOR}]`}>{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full bg-[#8D0000] hover:bg-[#A80000] font-bold text-white py-2.5 mt-8 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={isLoading || !isValid}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
}
