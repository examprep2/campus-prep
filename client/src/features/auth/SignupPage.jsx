import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { authApi } from '../../api/authApi';
import { branchApi } from '../../api/branchApi';
import { getErrorMessage } from '../../api/axios';
import { User, Mail, Calendar, UserCheck } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    password: '',
    confirmPassword: '',
    branch: '',
    year: '1',
    semester: '1',
  });

  const [errors, setErrors] = useState({});

  // Fetch branches on mount
  useEffect(() => {
    let isMounted = true;
    const fetchBranches = async () => {
      try {
        setLoadingBranches(true);
        const res = await branchApi.getBranches();
        if (isMounted && res?.success && Array.isArray(res.data?.branches)) {
          setBranches(res.data.branches);
          if (res.data.branches.length > 0) {
            setFormData((prev) => ({ ...prev, branch: res.data.branches[0]._id }));
          }
        }
      } catch (err) {
        console.error('Error fetching branches:', err);
        toastError('Failed to load branches list. Please refresh.');
      } finally {
        if (isMounted) setLoadingBranches(false);
      }
    };
    fetchBranches();
    return () => {
      isMounted = false;
    };
  }, [toastError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum < 15 || ageNum > 80) {
      newErrors.age = 'Age must be between 15 and 80';
    }
    if (!formData.branch) newErrors.branch = 'Please choose your engineering branch';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        age: Number(formData.age),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        branch: formData.branch,
        year: Number(formData.year),
        semester: Number(formData.semester),
      };

      const res = await authApi.register(payload);
      if (res?.success) {
        success(res.message || 'Account created! Please verify your email.');
        navigate('/verify-otp', { state: { email: formData.email.trim().toLowerCase() } });
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Registration failed. Please check your details.');
      toastError(msg);
      if (err?.response?.data?.message?.includes('already exists')) {
        setErrors((prev) => ({ ...prev, email: 'An account with this email already exists' }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Branch options
  const branchOptions = branches.map((b) => ({
    value: b._id,
    label: `${b.name} (${b.code})`,
  }));

  // Year options
  const yearOptions = [
    { value: '1', label: 'First Year (FE)' },
    { value: '2', label: 'Second Year (SE)' },
    { value: '3', label: 'Third Year (TE)' },
    { value: '4', label: 'Final Year (BE)' },
  ];

  // Semester options
  const semesterOptions = Array.from({ length: 8 }, (_, i) => ({
    value: String(i + 1),
    label: `Semester ${i + 1}`,
  }));

  return (
    <AuthLayout
      title="Create student account"
      subtitle="Access notes, previous year question papers, and study resources."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <Input
          label="Full Name"
          name="name"
          placeholder="e.g. Rahul Sharma"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          icon={User}
          required
        />

        {/* Email & Age row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              label="College or Personal Email"
              name="email"
              type="email"
              placeholder="student@college.edu"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              required
            />
          </div>
          <div>
            <Input
              label="Age"
              name="age"
              type="number"
              min="15"
              max="80"
              placeholder="20"
              value={formData.age}
              onChange={handleChange}
              error={errors.age}
              icon={Calendar}
              required
            />
          </div>
        </div>

        {/* Engineering Branch Dropdown */}
        <Select
          label="Engineering Branch"
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          options={branchOptions}
          error={errors.branch}
          disabled={loadingBranches}
          placeholder={loadingBranches ? 'Loading branches...' : 'Select your branch'}
          required
        />

        {/* Year and Semester */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Academic Year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            options={yearOptions}
            required
          />
          <Select
            label="Semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            options={semesterOptions}
            required
          />
        </div>

        {/* Passwords */}
        <div className="space-y-3">
          <PasswordInput
            label="Password"
            name="password"
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={submitting}
            icon={UserCheck}
          >
            Create Account & Verify
          </Button>
        </div>

        <p className="text-center text-xs text-[#687386] dark:text-[#A0AEC0] pt-2">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#3157D5] dark:text-[#6B8CFF] hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

