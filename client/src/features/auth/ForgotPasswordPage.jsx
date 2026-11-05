import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { authApi } from '../../api/authApi';
import { getErrorMessage } from '../../api/axios';
import { Mail, KeyRound, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { success, error: toastError, info } = useToast();

  const [step, setStep] = useState(1); // 1 = request reset code, 2 = enter code and new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Submit email to receive OTP
  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    setErrorMsg('');

    try {
      setSubmitting(true);
      const res = await authApi.forgotPassword({ email: email.trim().toLowerCase() });
      if (res?.success) {
        info('If an account exists, a 6-digit reset code has been sent to your inbox.');
        setStep(2);
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to request reset code.');
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Submit OTP and new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length < 6) {
      setErrorMsg('Please enter the 6-digit reset code');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    setErrorMsg('');

    try {
      setSubmitting(true);
      const res = await authApi.resetPassword({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
        confirmPassword,
      });

      if (res?.success) {
        success('Password successfully reset! You can now sign in.');
        navigate('/login', { state: { verifiedEmail: email.trim().toLowerCase() } });
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Password reset failed. Please check the code.');
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={step === 1 ? 'Reset your password' : 'Set new password'}
      subtitle={
        step === 1
          ? 'Enter your registered email address to receive a verification code.'
          : `Enter the code sent to ${email} and set your new password.`
      }
    >
      {step === 1 ? (
        <form onSubmit={handleRequestCode} className="space-y-4">
          <Input
            label="Registered Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="student@college.edu"
            icon={Mail}
            error={errorMsg}
            required
            autoFocus
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={submitting}
              icon={KeyRound}
            >
              Send Reset Code
            </Button>
          </div>

          <div className="text-center pt-2">
            <Link to="/login" className="text-xs text-[#687386] dark:text-[#A0AEC0] hover:text-[#172033] dark:hover:text-[#F1F5F9]">
              Back to Sign In
            </Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label htmlFor="reset-otp" className="block text-xs font-semibold text-[#172033] dark:text-[#F1F5F9]">
              6-Digit Reset Code <span className="text-[#D64B4B] dark:text-rose-400">*</span>
            </label>
            <input
              id="reset-otp"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setOtp(val);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="123456"
              className="w-full text-center tracking-[0.4em] font-mono font-bold text-xl rounded-lg border border-[#E6E9F0] dark:border-[#30394A] bg-white dark:bg-[#151923] py-2.5 text-[#172033] dark:text-[#F1F5F9] placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-[#3157D5] dark:focus:border-[#6B8CFF] focus:outline-none focus:ring-2 focus:ring-[#3157D5]/20 dark:focus:ring-[#6B8CFF]/20 transition-colors"
              autoFocus
            />
          </div>

          <PasswordInput
            label="New Password"
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            required
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            required
          />

          {errorMsg && <p className="text-xs text-[#D64B4B] dark:text-rose-400 font-medium">{errorMsg}</p>}

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={submitting}
              icon={CheckCircle2}
            >
              Reset Password
            </Button>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[#687386] dark:text-[#A0AEC0] hover:text-[#172033] dark:hover:text-[#F1F5F9] cursor-pointer"
            >
              Change Email
            </button>
            <Link to="/login" className="text-[#3157D5] dark:text-[#6B8CFF] font-semibold hover:underline">
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

