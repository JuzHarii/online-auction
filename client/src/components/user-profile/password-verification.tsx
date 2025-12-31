import { useState } from 'react';

interface PasswordVerificationProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PasswordVerification({
  email,
  onSuccess,
  onCancel,
}: PasswordVerificationProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmitVerify = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/profile/verifyuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
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

  return (
    <div className="p-8 border border-gray-200 shadow-lg rounded-lg bg-white flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-foreground">Verify yourself!</h1>

      <hr />

      {error && <div className="text-[#8D0000]">{error}</div>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitVerify();
        }}
        className="flex flex-col gap-6"
      >
        <label htmlFor="verify-password" className="text-muted-foreground">
          Enter your current password
        </label>

        <input
          id="verify-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          className="w-full px-3 py-2 border rounded-md focus:outline-2 focus:outline-[#8D0000]"
        />

        <div className="mt-5 flex flex-col md:flex-row md:mx-auto gap-3">
          <button
            type="submit"
            disabled={loading}
            className="
                  md:order-2
                  rounded-sm ring ring-gray-200 shadow-sm shadow-black-300 py-1 px-10
                  cursor-pointer bg-[#8D0000] text-white
                  hover:scale-101 hover:bg-[#760000] hover:shadow-md
                  transition-all duration-200 active:scale-95
                  disabled:opacity-70 disabled:cursor-not-allowed
                "
          >
            {loading ? 'Verifying...' : 'Continue'}
          </button>

          <button
            onClick={onCancel}
            type="button"
            disabled={loading}
            className="
              md:order-1
              rounded-sm ring ring-gray-200 shadow-sm shadow-black-300 py-1 px-10
              cursor-pointer bg-white
              hover:scale-101 hover:bg-gray-100 hover:shadow-md
              transition-all duration-200 active:scale-95
            "
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
