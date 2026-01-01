import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { z } from 'zod';

interface PasswordVerificationProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
  onFinish: () => void;
}

type VerificationMode = 'Verify' | 'SendCode' | 'EnterCode' | 'EnterNewPassword';

export default function PasswordVerification({
  email,
  onSuccess,
  onCancel,
  onFinish
}: PasswordVerificationProps) {
  const [mode, setMode] = useState<VerificationMode>('Verify');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const onSubmitVerify = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/profile/verifyuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: currentPassword,
        }),
      });

      const result = await res.json();
      setLoading(false);

      if (!res.ok) {
        let errorMsg = 'Errors occurred';
        if (typeof result.message === 'string') {
          errorMsg = result.message;
        } else if (result.message && typeof result.message === 'object') {
          errorMsg = Object.values(result.message)[0] as string;
        }
        setError(errorMsg);
      } else {
        setError(null);
        onSuccess();
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
      setError('Something went wrong. Please try again.');
    }
  };

  const onSendCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sendmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, register: false }),
      });
      const result = await res.json();
      setLoading(false);

      if (!res.ok || !result.isSuccess) {
        setError(result.message || 'Failed to send code');
      } else {
        setMode('EnterCode');
      }
    } catch (e) {
      setLoading(false);
      setError('Network error');
    }
  };

  const onVerifyCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, code: code }),
      });
      const result = await res.json();
      setLoading(false);

      if (!res.ok || !result.isSuccess) {
        setError(result.message || 'Invalid code');
      } else {
        setMode('EnterNewPassword');
      }
    } catch (e) {
      setLoading(false);
      setError('Network error');
    }
  };

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/;

  const schema = z
    .object({
      password: z.string().regex(strongPasswordRegex, {
        message:
          'Password must contain uppercase, lowercase, number, and special character (!@#$%^&*)',
      }),
      confirmpassword: z.string(),
    })
    .refine((data) => data.password === data.confirmpassword, {
      message: 'Confirmation password does not match',
      path: ['confirmpassword'],
    });

  type Inputs = {
    password: string;
    confirmpassword: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmitNewPassword = async (data: Inputs) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('api/changepassword', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: data.password,
        }),
      });
      const result = await res.json();
      setLoading(false);

      if (!result.isSuccess) {
        setError(result.message);
      } else {
        alert('Your password has been reset successfully!');
        onFinish()
      }
    } catch (e) {
      setLoading(false);
      console.error(e);
      setError('Network error');
    }
  };

  const renderVerify = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitVerify();
      }}
      className="flex flex-col gap-6 w-full"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="verify-password" className="text-muted-foreground">
          Enter your current password for <strong>{email}</strong>
        </label>

        <input
          id="verify-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="********"
          className="w-full px-3 py-2 border rounded-md focus:outline-2 focus:outline-[#8D0000]"
        />
        
        <div 
          onClick={() => {
            setError(null);
            setSuccessMsg(null);
            setMode('SendCode');
          }}
          className="text-sm text-[#8D0000] font-semibold hover:underline cursor-pointer self-end"
        >
          Forgot password?
        </div>
      </div>

      <div className="mt-2 flex flex-col md:flex-row md:mx-auto gap-3">
        <button
          type="submit"
          disabled={loading}
          className="md:order-2 rounded-sm ring ring-gray-200 shadow-sm shadow-black-300 py-1 px-10 cursor-pointer bg-[#8D0000] text-white hover:scale-101 hover:bg-[#760000] hover:shadow-md transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <ClipLoader loading={loading} size={15} color="white" /> : 'Continue'}
        </button>

        <button
          onClick={onCancel}
          type="button"
          disabled={loading}
          className="md:order-1 rounded-sm ring ring-gray-200 shadow-sm shadow-black-300 py-1 px-10 cursor-pointer bg-white hover:scale-101 hover:bg-gray-100 hover:shadow-md transition-all duration-200 active:scale-95"
        >
          Back
        </button>
      </div>
    </form>
  );

  const renderSendCode = () => (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground">
        We will send a verification code to <strong>{email}</strong> to reset your password.
      </p>
      <div className="flex flex-row gap-4 w-full justify-end mt-4">
        <button
          onClick={() => setMode('Verify')}
          className="w-fit bg-black text-white py-1 px-10 rounded hover:cursor-pointer hover:bg-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSendCode}
          className="w-fit bg-[#8D0000] text-white py-1 px-10 rounded hover:cursor-pointer hover:bg-[#760000] transition-colors"
        >
          {loading ? <ClipLoader loading={loading} size={20} color="white" /> : 'Send Code'}
        </button>
      </div>
    </div>
  );

  const renderEnterCode = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onVerifyCode();
      }}
      className="flex flex-col gap-2"
    >
      <label htmlFor="code" className="text-muted-foreground">
        Please check your email. Enter the 6-digit code.
      </label>
      <input
        type="number"
        id="code"
        placeholder="123456"
        className="w-full px-3 py-2 border rounded-md focus:outline-2 focus:outline-[#8D0000]"
        onChange={(e) => setCode(e.target.value)}
      />
      
      <div
        onClick={onSendCode}
        className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors self-start hover:cursor-pointer mt-2"
      >
        Resend code?
      </div>

      <div className="flex flex-row gap-4 w-full justify-end mt-4">
        <button
          type="button"
          onClick={() => setMode('SendCode')}
          className="w-fit bg-black text-white py-1 px-10 rounded hover:cursor-pointer"
        >
          Back
        </button>
        <button
          type="submit"
          className="w-fit bg-[#8D0000] text-white py-1 px-10 rounded hover:cursor-pointer"
        >
          {loading ? <ClipLoader loading={loading} size={20} color="white" /> : 'Verify'}
        </button>
      </div>
    </form>
  );

  const renderNewPassword = () => (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmitNewPassword)}>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-semibold text-gray-900">
          New password
        </label>
        <input
          type="password"
          id="password"
          placeholder="********"
          className="w-full px-3 py-2 border rounded-md focus:outline-2 focus:outline-[#8D0000]"
          {...register('password')}
        />
        {formErrors.password && <span className="text-[#8D0000] text-sm">{formErrors.password.message}</span>}
        <p className="text-xs text-gray-500">
          At least 8 characters with uppercase, lowercase, number, and special character
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="confirmpassword" className="font-semibold text-gray-900">
          Retype new password
        </label>
        <input
          type="password"
          id="confirmpassword"
          placeholder="********"
          className="w-full px-3 py-2 border rounded-md focus:outline-2 focus:outline-[#8D0000]"
          {...register('confirmpassword')}
        />
        {formErrors.confirmpassword && <span className="text-[#8D0000] text-sm">{formErrors.confirmpassword.message}</span>}
      </div>

      <div className="flex flex-row gap-4 w-full justify-end mt-4">
        <button
          type="button"
          onClick={() => setMode('Verify')}
          className="w-fit bg-black text-white py-1 px-10 rounded hover:cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-fit bg-[#8D0000] text-white p1-2 px-10 rounded hover:cursor-pointer"
        >
          {loading ? <ClipLoader loading={loading} size={20} color="white" /> : 'Change Password'}
        </button>
      </div>
    </form>
  );

  let title = 'Verify yourself!';
  if (mode === 'SendCode') title = 'Reset Password';
  if (mode === 'EnterCode') title = 'Enter Code';
  if (mode === 'EnterNewPassword') title = 'Create New Password';

  return (
    <div className="p-8 border border-gray-200 shadow-lg rounded-lg bg-white flex flex-col gap-4 w-full">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <hr />

      {error && <div className="p-3 bg-red-100 border border-red-200 rounded text-[#8D0000]">{error}</div>}
      {successMsg && <div className="p-3 bg-green-100 border border-green-200 rounded text-green-800">{successMsg}</div>}

      {mode === 'Verify' && renderVerify()}
      {mode === 'SendCode' && renderSendCode()}
      {mode === 'EnterCode' && renderEnterCode()}
      {mode === 'EnterNewPassword' && renderNewPassword()}
    </div>
  );
}