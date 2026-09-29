import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LogIn, ArrowRight, ShieldCheck, UserCheck, Utensils } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addNotification } = useUIStore();
  const [role, setRole] = useState<'customer' | 'partner' | 'admin'>('customer');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'arjun.mehta@email.com',
      password: 'password123',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(role);
    addNotification({
      type: 'success',
      title: `Welcome back! Logged in as ${role}`,
    });

    if (role === 'partner') {
      navigate('/partner/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleQuickLogin = (selectedRole: 'customer' | 'partner' | 'admin') => {
    login(selectedRole);
    addNotification({
      type: 'success',
      title: `Demo Login: Switched to ${selectedRole.toUpperCase()}`,
    });
    if (selectedRole === 'partner') navigate('/partner/dashboard');
    else if (selectedRole === 'admin') navigate('/admin/dashboard');
    else navigate('/');
  };

  return (
    <div className="container-app py-12 max-w-md">
      <div className="card p-6 sm:p-8 shadow-card">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="text-white font-bold text-base">FC</span>
          </div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Log in to FoodCart</h1>
          <p className="text-xs text-ink-muted mt-1">
            Order food with delivery or queue-free QuickPick
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-btn mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-1.5 rounded transition-all ${
              role === 'customer' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('partner')}
            className={`flex-1 py-1.5 rounded transition-all ${
              role === 'partner' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Restaurant
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-1.5 rounded transition-all ${
              role === 'admin' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Email Address</label>
            <input
              type="email"
              {...register('email')}
              className="input-field text-xs"
              placeholder="name@example.com"
            />
            {errors.email && (
              <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-ink">Password</label>
              <a href="#" className="text-[11px] text-brand-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              {...register('password')}
              className="input-field text-xs"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-[11px] text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </form>

        {/* Quick Demo Switcher Buttons */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider text-center mb-2.5">
            Quick 1-Click Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              className="px-2 py-1.5 text-[11px] font-medium border border-gray-200 rounded-btn hover:border-brand-400 bg-gray-50 flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3 h-3 text-brand-500" />
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('partner')}
              className="px-2 py-1.5 text-[11px] font-medium border border-gray-200 rounded-btn hover:border-brand-400 bg-gray-50 flex items-center justify-center gap-1"
            >
              <Utensils className="w-3 h-3 text-amber-500" />
              Partner
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="px-2 py-1.5 text-[11px] font-medium border border-gray-200 rounded-btn hover:border-brand-400 bg-gray-50 flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-blue-500" />
              Admin
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-ink-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
