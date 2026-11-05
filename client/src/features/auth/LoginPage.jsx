import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authApi } from '../../api/authApi';
import { getErrorMessage } from '../../api/axios';
import { Mail, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const { success, error: toastError, warning } = useToast();

  const [email, setEmail] = useState(location.state?.verifiedEmail || '');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorAlert, setErrorAlert] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorAlert('Please enter both your email and password');
      return;
    }
    setErrorAlert('');

    try {
      setSubmitting(true);
      const res = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
      });

      if (res?.success && res?.data?.user) {
        setUser(res.data.user);
        success(`Welcome back, ${res.data.user.name}!`);

        // Check if there was an intended route before redirect to login
        const fromPath = location.state?.from?.pathname;
        if (fromPath) {
          navigate(fromPath, { replace: true });
        } else if (res.data.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      // Check if backend responded with needsVerification (HTTP 403)
      const data = err?.response?.data?.data;
      if (err?.response?.status === 403 && data?.needsVerification) {
        warning('Please verify your email before logging in.');
        navigate('/verify-otp', {
          state: { email: data.email || email.trim().toLowerCase() },
        });
        return;
      }

      const msg = getErrorMessage(err, 'Invalid credentials. Please try again.');
      setErrorAlert(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to Campus-Prep"
      subtitle="Enter your credentials to access study materials and resources."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorAlert && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-[#D64B4B] font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorAlert}</span>
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errorAlert) setErrorAlert('');
          }}
          icon={Mail}
          required
          autoFocus
        />

        <div className="space-y-1">
          <PasswordInput
            label="Password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorAlert) setErrorAlert('');
            }}
            required
          />
          <div className="text-right pt-0.5">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-[#3157D5] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={submitting}
            icon={LogIn}
          >
            Sign In
          </Button>
        </div>

        <p className="text-center text-xs text-[#687386] pt-2">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-semibold text-[#3157D5] hover:underline">
            Register as a Student
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

