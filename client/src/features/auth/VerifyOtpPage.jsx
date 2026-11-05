import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { authApi } from '../../api/authApi';
import { getErrorMessage } from '../../api/axios';
import { Mail, CheckCircle2, RotateCcw } from 'lucide-react';

export default function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { success, error: toastError, info } = useToast();

  const initialEmail = location.state?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [errorMsg, setErrorMsg] = useState('');

  // 60-second cooldown timer for resend code
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    if (!otp.trim() || otp.trim().length < 6) {
      setErrorMsg('Please enter the 6-digit verification code');
      return;
    }
    setErrorMsg('');

    try {
      setVerifying(true);
      const res = await authApi.verifyOtp({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });
      if (res?.success) {
        success('Email verified successfully! You can now log in.');
        navigate('/login', { state: { verifiedEmail: email.trim().toLowerCase() } });
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Verification failed. Please check the code.');
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim() || cooldown > 0 || resending) return;

    try {
      setResending(true);
      const res = await authApi.resendOtp({ email: email.trim().toLowerCase() });
      if (res?.success) {
        info('A fresh verification code has been dispatched to your email.');
        setCooldown(60);
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to resend code.');
      toastError(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the 6-digit confirmation code sent to your registered inbox."
    >
      <form onSubmit={handleVerify} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          icon={Mail}
          required
        />

        <div className="space-y-1.5 text-left">
          <label htmlFor="otp-input" className="block text-xs font-semibold text-[#172033] dark:text-[#F1F5F9]">
            6-Digit Verification Code <span className="text-[#D64B4B] dark:text-rose-400">*</span>
          </label>
          <input
            id="otp-input"
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setOtp(val);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="123456"
            className="w-full text-center tracking-[0.4em] font-mono font-bold text-xl rounded-lg border border-[#E6E9F0] dark:border-[#30394A] bg-white dark:bg-[#151923] py-3 text-[#172033] dark:text-[#F1F5F9] placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-[#3157D5] dark:focus:border-[#6B8CFF] focus:outline-none focus:ring-2 focus:ring-[#3157D5]/20 dark:focus:ring-[#6B8CFF]/20 transition-colors"
            autoFocus
          />
          {errorMsg && <p className="text-xs text-[#D64B4B] dark:text-rose-400 font-medium">{errorMsg}</p>}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={verifying}
            disabled={otp.length !== 6}
            icon={CheckCircle2}
          >
            Verify & Continue
          </Button>
        </div>

        {/* Resend section with countdown */}
        <div className="pt-2 text-center text-xs text-[#687386] dark:text-[#A0AEC0]">
          {cooldown > 0 ? (
            <p>
              Resend code in <span className="font-semibold text-slate-800 dark:text-[#F1F5F9]">{cooldown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-1 font-semibold text-[#3157D5] dark:text-[#6B8CFF] hover:underline cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resend Verification Code</span>
            </button>
          )}
        </div>

        <div className="border-t border-[#E6E9F0] dark:border-[#30394A] pt-4 text-center">
          <Link to="/login" className="text-xs text-[#687386] dark:text-[#A0AEC0] hover:text-[#172033] dark:hover:text-[#F1F5F9]">
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

