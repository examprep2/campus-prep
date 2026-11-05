import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { materialApi } from '../../api/materialApi';
import { subjectApi } from '../../api/subjectApi';
import { getErrorMessage } from '../../api/axios';
import {
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  Info,
  CheckCircle2,
} from 'lucide-react';

export default function UploadMaterialPage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const fileInputRef = useRef(null);

  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'notes',
    subject: '',
    examYear: '',
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const res = await subjectApi.getSubjects();
        if (isMounted && res?.success && Array.isArray(res.data?.subjects)) {
          setSubjects(res.data.subjects);
          if (res.data.subjects.length > 0) {
            setFormData((prev) => ({ ...prev, subject: res.data.subjects[0]._id }));
          }
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
      } finally {
        if (isMounted) setLoadingSubjects(false);
      }
    };
    fetchSubjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileValidation = (selectedFile) => {
    if (!selectedFile) return;

    if (
      selectedFile.type !== 'application/pdf' &&
      !selectedFile.name.toLowerCase().endsWith('.pdf')
    ) {
      setFileError('Only PDF files (.pdf) are permitted.');
      setFile(null);
      return false;
    }

    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSizeInBytes) {
      setFileError('File size exceeds the 10 MB limit.');
      setFile(null);
      return false;
    }

    setFileError('');
    setFile(selectedFile);

    // Auto-fill title from filename if title is blank
    if (!formData.title) {
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setFormData((prev) => ({ ...prev, title: cleanName.slice(0, 100) }));
    }
    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileValidation(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileValidation(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 150) {
      newErrors.title = 'Title must be 150 characters or less';
    }
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.type) newErrors.type = 'Please select material type';
    if (!file) newErrors.file = 'Please upload a PDF document';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setUploading(true);

      const data = new FormData();
      data.append('file', file);
      data.append('title', formData.title.trim());
      if (formData.description.trim()) {
        data.append('description', formData.description.trim());
      }
      data.append('type', formData.type);
      data.append('subject', formData.subject);
      if (formData.examYear) {
        data.append('examYear', formData.examYear);
      }

      const res = await materialApi.uploadMaterial(data);
      if (res?.success) {
        success('Document uploaded successfully! It is now pending moderation review.');
        navigate('/my-uploads');
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to upload document. Please check the details.');
      toastError(msg);
    } finally {
      setUploading(false);
    }
  };

  const materialTypeOptions = [
    { value: 'notes', label: 'Lecture Notes / Module Handouts' },
    { value: 'book', label: 'Reference Textbook / Monograph' },
    { value: 'qp', label: 'Previous Year Question Paper (PYQ)' },
    { value: 'syllabus', label: 'Curriculum Scheme & Syllabus' },
  ];

  const subjectOptions = subjects.map((s) => ({
    value: s._id,
    label: `${s.code} - ${s.name} (Sem ${s.semester})`,
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Upload Study Material"
        description="Share verified handwritten notes, solved papers, and reference documents with Mumbai University peers."
      />

      {/* Moderation Policy Notice */}
      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#3157D5] shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <p className="font-semibold text-[#172033]">Moderation Guarantee</p>
          <p className="text-slate-600">
            All student contributions are queued for administrative review to ensure syllabus accuracy and
            clean scanning quality before becoming visible to all students in the library.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E6E9F0] shadow-2xs space-y-6">
        {/* Drag and Drop Zone */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#172033]">
            PDF Document <span className="text-[#D64B4B]">*</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {!file ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-[#3157D5] bg-blue-50/50'
                  : 'border-[#E6E9F0] hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E6E9F0] text-[#3157D5] flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#172033]">
                Click to browse or drag and drop your PDF
              </p>
              <p className="text-xs text-[#687386] mt-1">
                Only PDF files are supported • Maximum file size 10 MB
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#16845B] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#172033] truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-1 rounded-md text-slate-400 hover:text-[#D64B4B] hover:bg-white transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {fileError && <p className="text-xs text-[#D64B4B] font-medium">{fileError}</p>}
          {errors.file && !fileError && (
            <p className="text-xs text-[#D64B4B] font-medium">{errors.file}</p>
          )}
        </div>

        {/* Title */}
        <Input
          label="Document Title"
          name="title"
          placeholder="e.g. Distributed Systems Paxos & Raft Consensus Complete Notes"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          hint="Clear, descriptive title matching the syllabus topic (max 150 chars)"
          required
        />

        {/* Subject and Material Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            options={subjectOptions}
            error={errors.subject}
            disabled={loadingSubjects}
            placeholder={loadingSubjects ? 'Loading subjects...' : 'Choose subject'}
            required
          />

          <Select
            label="Resource Category"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={materialTypeOptions}
            error={errors.type}
            required
          />
        </div>

        {/* Exam Year (Optional, useful for Question Papers) */}
        {formData.type === 'qp' && (
          <Input
            label="Exam Year"
            name="examYear"
            type="number"
            min="2015"
            max="2030"
            placeholder="e.g. 2024"
            value={formData.examYear}
            onChange={handleChange}
            hint="The year this Mumbai University question paper was conducted"
          />
        )}

        {/* Optional Description */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="description" className="block text-xs font-semibold text-[#172033]">
            Notes Description or Module Coverage (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Briefly state modules covered, whether it contains solved derivations or formula sheets..."
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#E6E9F0] bg-white p-3 text-sm text-[#172033] placeholder:text-slate-400 focus:border-[#3157D5] focus:outline-none focus:ring-2 focus:ring-[#3157D5]/20 transition-colors"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#E6E9F0] flex items-center justify-end gap-3">
          <Button variant="outline" size="md" onClick={() => navigate(-1)} disabled={uploading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={uploading}
            icon={UploadCloud}
          >
            Submit for Review
          </Button>
        </div>
      </form>
    </div>
  );
}

