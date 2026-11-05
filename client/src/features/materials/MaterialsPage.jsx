import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { materialApi } from '../../api/materialApi';
import { subjectApi } from '../../api/subjectApi';
import PageHeader from '../../components/ui/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import {
  ExternalLink,
  BookOpen,
  Upload,
} from 'lucide-react';

const CATEGORIES = [
  { id: '', label: 'All Resources' },
  { id: 'notes', label: 'Notes' },
  { id: 'book', label: 'Books' },
  { id: 'qp', label: 'Question Papers' },
  { id: 'syllabus', label: 'Syllabus' },
];

export default function MaterialsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSubject = searchParams.get('subject') || '';
  const currentType = searchParams.get('type') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search input local state
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Fetch all subjects for the filter dropdown
  useEffect(() => {
    let isMounted = true;
    const fetchSubjects = async () => {
      try {
        const res = await subjectApi.getSubjects();
        if (isMounted && res?.success && Array.isArray(res.data?.subjects)) {
          setSubjects(res.data.subjects);
        }
      } catch (err) {
        console.error('Error fetching subjects filter:', err);
      }
    };
    fetchSubjects();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch materials whenever filters change
  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await materialApi.getMaterials({
        subject: currentSubject,
        type: currentType,
        search: currentSearch,
        page: currentPage,
        limit: 12,
      });

      if (res?.success) {
        setMaterials(res.data?.materials || []);
        setPagination({
          page: res.data?.page || 1,
          totalPages: res.data?.totalPages || 1,
          total: res.data?.total || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError('Failed to load study materials. Please check your connection and retry.');
    } finally {
      setLoading(false);
    }
  }, [currentSubject, currentType, currentSearch, currentPage]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // Update query params helper
  const updateQuery = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === '' || v === null || v === undefined) {
        next.delete(k);
      } else {
        next.set(k, String(v));
      }
    });
    setSearchParams(next);
  };

  const handleSearchSubmit = (value) => {
    updateQuery({ search: value, page: 1 });
  };

  const handleTypeSelect = (typeId) => {
    updateQuery({ type: typeId, page: 1 });
  };

  const handleSubjectSelect = (subId) => {
    updateQuery({ subject: subId, page: 1 });
  };

  const handlePageChange = (p) => {
    updateQuery({ page: p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Study Materials Library"
        description="Browse, preview, and download semester lecture notes, reference books, past question papers, and syllabus schemes."
        actions={
          <Link to="/upload">
            <Button variant="primary" size="sm" icon={Upload}>
              Upload Material
            </Button>
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs space-y-4 transition-colors">
        {/* Top bar: Search + Subject dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <SearchBar
              value={searchInput}
              onChange={(val) => {
                setSearchInput(val);
                // quick debounce update
                const timer = setTimeout(() => {
                  handleSearchSubmit(val);
                }, 400);
                return () => clearTimeout(timer);
              }}
              onClear={() => {
                setSearchInput('');
                handleSearchSubmit('');
              }}
              placeholder="Search by title, subject code, or topic..."
              showShortcut
            />
          </div>

          <div>
            <Select
              value={currentSubject}
              onChange={(e) => handleSubjectSelect(e.target.value)}
              placeholder="All Subjects"
              options={[
                { value: '', label: 'All Subjects' },
                ...subjects.map((s) => ({
                  value: s._id,
                  label: `${s.code} - ${s.name}`,
                })),
              ]}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 dark:border-[#30394A] pt-3">
          {CATEGORIES.map((cat) => {
            const isActive = currentType === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleTypeSelect(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#3157D5] dark:bg-[#6B8CFF] text-white dark:text-slate-950 shadow-2xs'
                    : 'bg-slate-100 dark:bg-[#222B3A] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#222B3A]/80 hover:text-slate-900 dark:hover:text-[#F1F5F9]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Materials Content */}
      {loading ? (
        <SkeletonLoader type="card" count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchMaterials} />
      ) : materials.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No study materials match your search"
          description="Try adjusting your search terms, choosing a different category, or selecting another subject."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchInput('');
            setSearchParams(new URLSearchParams());
          }}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((item) => (
              <div
                key={item._id}
                className="p-5 rounded-2xl bg-white dark:bg-[#1B2230] border border-[#E6E9F0] dark:border-[#30394A] shadow-2xs hover:border-[#3157D5]/40 dark:hover:border-[#6B8CFF]/40 hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Subject Tag & Type */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-semibold text-[#3157D5] dark:text-[#6B8CFF] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/40">
                      {item.subject?.code || 'GEN'}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-[#222B3A] px-2 py-0.5 rounded">
                      {item.type}
                    </span>
                  </div>

                  {/* Title & Subject */}
                  <div>
                    <h3
                      className="font-semibold text-sm text-[#172033] dark:text-[#F1F5F9] line-clamp-2 leading-snug group-hover:text-[#3157D5] dark:group-hover:text-[#6B8CFF] transition-colors"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#687386] dark:text-[#A0AEC0] mt-1 truncate">
                      {item.subject?.name}
                    </p>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Footer specs & Action */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#30394A] flex items-center justify-between text-xs text-[#687386] dark:text-[#A0AEC0]">
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <p className="text-[11px] truncate">
                      By <span className="font-medium text-slate-700 dark:text-slate-300">{item.uploadedBy?.name || 'Contributor'}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                      {item.examYear ? ` • Exam Year ${item.examYear}` : ''}
                    </p>
                  </div>

                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3157D5] dark:bg-[#6B8CFF] text-white dark:text-slate-950 hover:bg-[#2648B8] dark:hover:bg-[#829DFF] text-xs font-semibold shadow-2xs transition-colors shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={12}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
