import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, ArrowRight } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Please enter a valid 10-digit phone number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addNotification } = useUIStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    login('customer');
    addNotification({
      type: 'success',
      title: 'Account created successfully!',
      message: `Welcome to FoodCart, ${data.name}!`,
    });
    navigate('/');
  };

  return (
    <div className="container-app py-12 max-w-md">
      <div className="card p-6 sm:p-8 shadow-card">
        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="text-white font-bold text-base">FC</span>
          </div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Create your account</h1>
          <p className="text-xs text-ink-muted mt-1">
            Join FoodCart for faster deliveries and QuickPick pickup
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Full Name</label>
            <input
              type="text"
              {...register('name')}
              placeholder="e.g. Rahul Sharma"
              className="input-field text-xs"
            />
            {errors.name && (
              <p className="text-[11px] text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Email Address</label>
            <input
              type="email"
              {...register('email')}
              placeholder="rahul@example.com"
              className="input-field text-xs"
            />
            {errors.email && (
              <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Phone Number</label>
            <input
              type="tel"
              {...register('phone')}
              placeholder="9876543210"
              className="input-field text-xs"
            />
            {errors.phone && (
              <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="input-field text-xs"
            />
            {errors.password && (
              <p className="text-[11px] text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              placeholder="••••••••"
              className="input-field text-xs"
            />
            {errors.confirmPassword && (
              <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 mt-4"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </form>

        <p className="text-center text-xs text-ink-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
