import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from 'zod'
import { ClipLoader } from "react-spinners"
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/;
  
  const schema = z.object({
    name: z.string().min(3, {message: "Name must be 3–8 characters."}).max(8, {message: "Name must be 3–8 characters."}),
    email: z.string().email({message: "Invalid email format"}),
    password: z.string().regex(strongPasswordRegex, {message: "Password must contain uppercase, lowercase, number, and special character (!@#$%^&*)"}),
    confirmpassword: z.string(),
  }).refine((data) => data.password === data.confirmpassword, {
    message: "Confirmation password does not match",
    path: ["confirmpassword"]
  })


  const [loading, setLoading] = useState(false)

  type Inputs = {
    name: string
    email: string
    password: string
    confirmpassword: string
  }

  const {
    register,
    watch,
    handleSubmit,
    formState: {errors},
    setError
  
  } = useForm<Inputs>({
    resolver: zodResolver(schema)
  })

  const navigate = useNavigate()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (!result.success) {
          if (result.message.email) {
            setError('email', {
              message: result.message.email,
            })
          }
          
          if (result.message.password) {
            setError('password', {
              message: result.password.email,
            })
          }
        }
      }

      navigate('/signin');
    } catch (err) {
      console.error('[v0] Registration error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='p-8 border border-gray-200 shadow-lg rounded-lg bg-white'>
      <form action="" onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>  
        <div className='flex flex-col gap-2'>
          <label htmlFor="name" className="font-semibold text-gray-900">Full Name</label>
          <input type="text" id="name" placeholder='John Doe' {...register("name", {required: true})} className='w-full px-3 py-2 border rounded-md focus:outline-2 focus:outline-[#8D0000]'/>
          {errors.name && <span className='text-[#8D0000]'>{errors.name.message}</span>}
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor="email" className="font-semibold text-gray-900">Email</label>
          <input type="text" id="email" placeholder='your@example.com' {...register("email", {required: true})} className='w-full px-3 py-2 border rounded-md focus:outline-2 focus:outline-[#8D0000]'/>
          {errors.email && <span className='text-[#8D0000]'>{errors.email.message}</span>}
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor="password" className="font-semibold text-gray-900">Password</label>
          <input type="password" id="password" placeholder='********' {...register("password", {required: true})}  className='w-full px-3 py-2 border rounded-md focus:outline-2 focus:outline-[#8D0000]'/>
          {!errors.password && <p className="text-xs text-gray-500">
            At least 8 characters with uppercase, lowercase, number, and special character
          </p>}
          {errors.password && <span className='text-[#8D0000]'>{errors.password.message}</span>}
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor="confirmpassword" className="font-semibold text-gray-900">Confirm Password</label>
          <input type="password" id="`confirmpassword" placeholder='********' {...register("confirmpassword", {required: true})}  className='w-full px-3 py-2 border rounded-md focus:outline-2 focus:outline-[#8D0000]' />
          {errors.confirmpassword && <span className='text-[#8D0000]'>{errors.confirmpassword.message}</span>}
        </div>
      

        <button type="submit" className={`w-full bg-[#8D0000] font-bold text-white py-2.5 rounded-md transition-color hover:cursor-pointer flex flex-col justify-center items-center`}>
          {loading ? <ClipLoader loading={loading} size={20} color='white'/> : <p>Create Account</p> }
        </button>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign in
          </Link>
        </p>

      </form>
    </div>
  );
}