import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchCandidateById, selectSelectedCandidate, selectCandidatesLoading, selectCandidatesError } from '../../store/slices/candidateSlice';
import { 
  User, Mail, Phone, Book, Layers, Calendar, FileText, DollarSign, FileCheck2, 
  FileSignature, Award, Briefcase, Users, File, CheckCircle, XCircle, FileSearch, 
  FileInput, FileOutput, Pencil, MapPin, GraduationCap, Building, Clock, 
  TrendingUp, AlertCircle, ArrowLeft, Eye, EyeOff, Download, Share2
} from 'lucide-react';
import ErrorBoundary from '../../components/common/ErrorBoundary';

// Modern Card Component
const ModernCard = ({ title, icon, children, className = "", gradient = "from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700" }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-600 ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      {icon && <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

// Modern Info Row Component
const InfoRow = ({ label, value, icon, status, className = "" }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 dark:text-green-400';
      case 'inactive': return 'text-red-600 dark:text-red-400';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className={`flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 ${className}`}>
      <div className="flex items-center gap-3">
    {icon && <span className="text-gray-400">{icon}</span>}
        <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <span className={`font-semibold ${getStatusColor(status)}`}>
        {value ?? <span className="text-gray-400 italic">Not provided</span>}
      </span>
    </div>
  );
};

// Modern Array Display Component
const ArrayDisplay = ({ items, renderItem, emptyMessage = "No items found" }) => (
  <div className="space-y-3">
    {items && items.length > 0 ? (
      items.map((item, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-600">
          {renderItem(item, idx)}
        </div>
      ))
    ) : (
      <div className="text-center py-6 text-gray-400">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>{emptyMessage}</p>
      </div>
    )}
  </div>
);

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="max-w-6xl mx-auto p-8 space-y-8">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      <div className="space-y-2">
        <div className="w-48 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="w-64 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl p-6 animate-pulse">
          <div className="w-32 h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="flex justify-between">
                <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="w-32 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ViewCandidate = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const candidate = useAppSelector(selectSelectedCandidate);
  const loading = useAppSelector(selectCandidatesLoading);
  const error = useAppSelector(selectCandidatesError);
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  // Role logic
  const role = (user?.role || '').toLowerCase();
  const canViewDetail = ["detail", "admin", "superadmin", "finance"].includes(role);
  const canViewFinance = ["admin", "superadmin", "finance"].includes(role);

  useEffect(() => {
    if (id) {
      dispatch(fetchCandidateById(id));
    }
  }, [dispatch, id]);

  // Determine edit path based on role
  let editPath = '';
  let editId = '';
  if (candidate) {
    editId = candidate.candidateId || candidate._id || '';
    if (role === 'enroll') {
      editPath = `/dashboard/edit/${editId}`;
    } else if (role === 'finance') {
      editPath = `/dashboard/edit-finance/${editId}`;
    } else if (["detail", "admin", "superadmin"].includes(role)) {
      editPath = `/dashboard/edit-detail/${editId}`;
    }
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Candidate</h3>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">Candidate Not Found</h3>
          <p className="text-gray-500 dark:text-gray-400">The candidate you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 ${
                    candidate.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
          </div>
          <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {candidate.fullName}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {candidate.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {candidate.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-4 h-4" />
                      {candidate.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Book className="w-4 h-4" />
                      {candidate.course}
                    </span>
            </div>
          </div>
        </div>
              
              <div className="flex items-center gap-3">
                {canViewFinance && (
                  <button
                    onClick={() => setShowSensitiveData(!showSensitiveData)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition"
                  >
                    {showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showSensitiveData ? 'Hide' : 'Show'} Sensitive Data
                  </button>
                )}
        {editPath && (
          <button
            onClick={() => navigate(editPath)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-lg transition transform hover:scale-105"
          >
                    <Pencil className="w-4 h-4" />
                    Edit Candidate
          </button>
        )}
      </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8 gap-y-4">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Basic Information */}
            {/* <ModernCard 
              title="Basic Information" 
              icon={<FileText className="w-5 h-5 text-blue-600" />}
              gradient="from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700"
            >
              <InfoRow 
                label="Candidate ID" 
                value={candidate.candidateId} 
                icon={<File className="w-4 h-4" />}
              />
              <InfoRow 
                label="Status" 
                value={candidate.status} 
                status={candidate.status}
                icon={candidate.status === 'active' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              />
              <InfoRow 
                label="Other Course" 
                value={candidate.othersCourseName} 
                icon={<Book className="w-4 h-4" />}
              />
              <InfoRow 
                label="Agent Name" 
                value={candidate.agentName} 
                icon={<Users className="w-4 h-4" />}
              />
              <InfoRow 
                label="Joining Date" 
                value={candidate.joiningDate ? new Date(candidate.joiningDate).toLocaleDateString() : undefined}
                icon={<Calendar className="w-4 h-4" />}
              />
              <InfoRow 
                label="Payment Status" 
                value={candidate.paymentStatus} 
                status={candidate.paymentStatus}
                icon={<DollarSign className="w-4 h-4" />}
              />
              <InfoRow 
                label="Inactive Reason" 
                value={candidate.inactiveReason} 
                icon={<AlertCircle className="w-4 h-4" />}
              />
              <InfoRow 
                label="Inactive Date" 
                value={candidate.inactiveDate ? new Date(candidate.inactiveDate).toLocaleDateString() : undefined}
                icon={<Calendar className="w-4 h-4" />}
              />
              <InfoRow 
                label="Comments" 
                value={candidate.comments} 
                icon={<FileText className="w-4 h-4" />}
              />
              <InfoRow 
                label="Documents Non-Submission Reason" 
                value={candidate.documentsNonSubmissionReason} 
                icon={<FileText className="w-4 h-4" />}
              />
              <InfoRow 
                label="Referred By" 
                value={candidate.referredBy} 
                icon={<Users className="w-4 h-4" />}
              />
            </ModernCard> */}
            <ModernCard 
  title="Basic Information" 
  icon={<FileText className="w-5 h-5 text-blue-600" />}
  gradient="from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700"
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
    <InfoRow label="Candidate ID" value={candidate.candidateId || '-'} icon={<File className="w-4 h-4 text-gray-500" />} />
    <InfoRow
      label="Status"
      value={candidate.status}
      status={candidate.status}
      icon={candidate.status === 'active'
        ? <CheckCircle className="w-4 h-4 text-green-600" />
        : <XCircle className="w-4 h-4 text-red-500" />}
    />
    <InfoRow label="Other Course" value={candidate.othersCourseName || '-'} icon={<Book className="w-4 h-4 text-gray-500" />} />
    <InfoRow label="Agent Name" value={candidate.agentName || '-'} icon={<Users className="w-4 h-4 text-blue-500" />} />
    <InfoRow
      label="Joining Date"
      value={candidate.joiningDate ? new Date(candidate.joiningDate).toLocaleDateString() : '-'}
      icon={<Calendar className="w-4 h-4 text-gray-500" />}
    />
    <InfoRow
      label="Payment Status"
      value={candidate.paymentStatus}
      status={candidate.paymentStatus}
      icon={<DollarSign className="w-4 h-4 text-amber-600" />}
    />
    <InfoRow label="Inactive Reason" value={candidate.inactiveReason || '-'} icon={<AlertCircle className="w-4 h-4 text-red-500" />} />
    <InfoRow
      label="Inactive Date"
      value={candidate.inactiveDate ? new Date(candidate.inactiveDate).toLocaleDateString() : '-'}
      icon={<Calendar className="w-4 h-4 text-gray-500" />}
    />
    <InfoRow label="Comments" value={candidate.comments || '-'} icon={<FileText className="w-4 h-4 text-gray-500" />} />
    <InfoRow label="Documents Non-Submission Reason" value={candidate.documentsNonSubmissionReason || '-'} icon={<FileText className="w-4 h-4 text-red-400" />} />
    <InfoRow label="Referred By" value={candidate.referredBy || '-'} icon={<Users className="w-4 h-4 text-indigo-500" />} />
  </div>
</ModernCard>


            {/* Addresses */}
            {/* <ModernCard 
              title="Addresses" 
              icon={<MapPin className="w-5 h-5 text-green-600" />}
              gradient="from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700"
            >
              <InfoRow 
                label="Permanent Address" 
                value={candidate.addresses?.permanent} 
                icon={<MapPin className="w-4 h-4" />}
              />
              <InfoRow 
                label="Current Address" 
                value={candidate.addresses?.current} 
                icon={<MapPin className="w-4 h-4" />}
              />
            </ModernCard> */}
            <ModernCard 
  title="Addresses" 
  icon={<MapPin className="w-5 h-5 text-green-600" />}
  gradient="from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700"
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
    <InfoRow 
      label="Permanent Address" 
      value={candidate.addresses?.permanent || '-'} 
      icon={<MapPin className="w-4 h-4 text-green-600" />}
    />
    <InfoRow 
      label="Current Address" 
      value={candidate.addresses?.current || '-'} 
      icon={<MapPin className="w-4 h-4 text-emerald-600" />}
    />
  </div>
</ModernCard>


            {/* Contacts */}
            {/* <ModernCard 
              title="Emergency Contacts" 
              icon={<Phone className="w-5 h-5 text-purple-600" />}
              gradient="from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700"
            >
              <InfoRow 
                label="Father's Name" 
                value={candidate.contacts?.father?.name} 
                icon={<User className="w-4 h-4" />}
              />
              <InfoRow 
                label="Father's Phone" 
                value={candidate.contacts?.father?.phone} 
                icon={<Phone className="w-4 h-4" />}
              />
              <InfoRow 
                label="Mother's Name" 
                value={candidate.contacts?.mother?.name} 
                icon={<User className="w-4 h-4" />}
              />
              <InfoRow 
                label="Mother's Phone" 
                value={candidate.contacts?.mother?.phone} 
                icon={<Phone className="w-4 h-4" />}
              />
              <InfoRow 
                label="Spouse's Name" 
                value={candidate.contacts?.spouse?.name} 
                icon={<User className="w-4 h-4" />}
              />
              <InfoRow 
                label="Spouse's Phone" 
                value={candidate.contacts?.spouse?.phone} 
                icon={<Phone className="w-4 h-4" />}
              />
            </ModernCard> */}
            <ModernCard 
  title="Emergency Contacts" 
  icon={<Phone className="w-5 h-5 text-purple-600" />}
  gradient="from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700"
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
    <InfoRow 
      label="Father's Name" 
      value={candidate.contacts?.father?.name || '-'} 
      icon={<User className="w-4 h-4 text-purple-600" />}
    />
    <InfoRow 
      label="Father's Phone" 
      value={candidate.contacts?.father?.phone || '-'} 
      icon={<Phone className="w-4 h-4 text-purple-600" />}
    />
    <InfoRow 
      label="Mother's Name" 
      value={candidate.contacts?.mother?.name || '-'} 
      icon={<User className="w-4 h-4 text-pink-600" />}
    />
    <InfoRow 
      label="Mother's Phone" 
      value={candidate.contacts?.mother?.phone || '-'} 
      icon={<Phone className="w-4 h-4 text-pink-600" />}
    />
    <InfoRow 
      label="Spouse's Name" 
      value={candidate.contacts?.spouse?.name || '-'} 
      icon={<User className="w-4 h-4 text-indigo-500" />}
    />
    <InfoRow 
      label="Spouse's Phone" 
      value={candidate.contacts?.spouse?.phone || '-'} 
      icon={<Phone className="w-4 h-4 text-indigo-500" />}
    />
  </div>
</ModernCard>


            {/* Training Details */}
          {/* {candidate.training && (
              <ModernCard 
                title="Training Details" 
                icon={<GraduationCap className="w-5 h-5 text-orange-600" />}
                gradient="from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700"
              >
                <InfoRow 
                  label="Trainer Name" 
                  value={candidate.training.trainerName} 
                  icon={<User className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Slot Time" 
                  value={candidate.training.slotTime} 
                  icon={<Clock className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Class Start Date" 
                  value={candidate.training.classStartDate ? new Date(candidate.training.classStartDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Course End Date" 
                  value={candidate.training.courseEndDate ? new Date(candidate.training.courseEndDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Stage" 
                  value={candidate.training.stage} 
                  icon={<TrendingUp className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Trainer Phone" 
                  value={candidate.training.trainerPhone} 
                  icon={<Phone className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Stage Update Date" 
                  value={candidate.training.stageUpdateDate ? new Date(candidate.training.stageUpdateDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Training Stage Date" 
                  value={candidate.training.trainingStageDate ? new Date(candidate.training.trainingStageDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Projects Stage Date" 
                  value={candidate.training.projectsStageDate ? new Date(candidate.training.projectsStageDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="POC Stage Date" 
                  value={candidate.training.pocStageDate ? new Date(candidate.training.pocStageDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Profile Created Stage Date" 
                  value={candidate.training.profileCreatedStageDate ? new Date(candidate.training.profileCreatedStageDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
              </ModernCard>
            )} */}
            {candidate.training && (
  <ModernCard 
    title="Training Details" 
    icon={<GraduationCap className="w-5 h-5 text-orange-600" />}
    gradient="from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <InfoRow 
        label="Trainer Name" 
        value={candidate.training.trainerName || '-'} 
        icon={<User className="w-4 h-4 text-orange-600" />}
      />
      <InfoRow 
        label="Slot Time" 
        value={candidate.training.slotTime || '-'} 
        icon={<Clock className="w-4 h-4 text-amber-600" />}
      />
      <InfoRow 
        label="Class Start Date" 
        value={candidate.training.classStartDate 
          ? new Date(candidate.training.classStartDate).toLocaleDateString() 
          : '-'} 
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
      <InfoRow 
        label="Course End Date" 
        value={candidate.training.courseEndDate 
          ? new Date(candidate.training.courseEndDate).toLocaleDateString() 
          : '-'} 
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
      <InfoRow 
        label="Stage" 
        value={candidate.training.stage || '-'} 
        icon={<TrendingUp className="w-4 h-4 text-green-600" />}
      />
      <InfoRow 
        label="Trainer Phone" 
        value={candidate.training.trainerPhone || '-'} 
        icon={<Phone className="w-4 h-4 text-orange-600" />}
      />
      <InfoRow 
        label="Stage Update Date" 
        value={candidate.training.stageUpdateDate 
          ? new Date(candidate.training.stageUpdateDate).toLocaleDateString() 
          : '-'} 
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
      <InfoRow 
        label="Training Stage Date" 
        value={candidate.training.trainingStageDate 
          ? new Date(candidate.training.trainingStageDate).toLocaleDateString() 
          : '-'} 
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
      <InfoRow 
        label="Projects Stage Date" 
        value={candidate.training.projectsStageDate 
          ? new Date(candidate.training.projectsStageDate).toLocaleDateString() 
          : '-'} 
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
      <InfoRow 
        label="POC Stage Date" 
        value={candidate.training.pocStageDate 
          ? new Date(candidate.training.pocStageDate).toLocaleDateString() 
          : '-'} 
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
      <InfoRow 
        label="Profile Created Stage Date" 
        value={candidate.training.profileCreatedStageDate 
          ? new Date(candidate.training.profileCreatedStageDate).toLocaleDateString() 
          : '-'} 
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
    </div>
  </ModernCard>
)}


            {/* Documents - Detail user and above */}
            {/* {canViewDetail && candidate.documents && (
              <ModernCard 
                title="Documents" 
                icon={<File className="w-5 h-5 text-teal-600" />}
                gradient="from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700"
              >
                <InfoRow 
                  label="E-Aadhar" 
                  value={candidate.documents.eAadhar} 
                  icon={<File className="w-4 h-4" />}
                />
                <InfoRow 
                  label="PAN Card" 
                  value={candidate.documents.panCard} 
                  icon={<File className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Photo" 
                  value={candidate.documents.photo} 
                  icon={<File className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Passport" 
                  value={candidate.documents.passport} 
                  icon={<File className="w-4 h-4" />}
                />
              </ModernCard>
            )} */}
            {canViewDetail && candidate.documents && (
  <ModernCard 
    title="Documents" 
    icon={<File className="w-5 h-5 text-teal-600" />}
    gradient="from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <InfoRow 
        label="E-Aadhar" 
        value={candidate.documents.eAadhar || '-'} 
        icon={<File className="w-4 h-4 text-teal-600" />}
      />
      <InfoRow 
        label="PAN Card" 
        value={candidate.documents.panCard || '-'} 
        icon={<File className="w-4 h-4 text-teal-600" />}
      />
      <InfoRow 
        label="Photo" 
        value={candidate.documents.photo || '-'} 
        icon={<File className="w-4 h-4 text-teal-600" />}
      />
      <InfoRow 
        label="Passport" 
        value={candidate.documents.passport || '-'} 
        icon={<File className="w-4 h-4 text-teal-600" />}
      />
    </div>
  </ModernCard>
)}


            {/* Education - Detail user and above */}
            {/* {canViewDetail && candidate.education && (
              <ModernCard 
                title="Education" 
                icon={<Award className="w-5 h-5 text-indigo-600" />}
                gradient="from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-700"
              >
                <InfoRow 
                  label="SSLC" 
                  value={candidate.education.sslc} 
                  icon={<Award className="w-4 h-4" />}
                />
                <InfoRow 
                  label="HSC" 
                  value={candidate.education.hsc} 
                  icon={<Award className="w-4 h-4" />}
                />
                <InfoRow 
                  label="UG Degree" 
                  value={candidate.education.ugDegree} 
                  icon={<Award className="w-4 h-4" />}
                />
                <InfoRow 
                  label="UG Marksheet" 
                  value={candidate.education.ugMarksheet} 
                  icon={<File className="w-4 h-4" />}
                />
                <InfoRow 
                  label="UG Provisional" 
                  value={candidate.education.ugProvisional} 
                  icon={<File className="w-4 h-4" />}
                />
                <InfoRow 
                  label="PG Degree" 
                  value={candidate.education.pgDegree} 
                  icon={<Award className="w-4 h-4" />}
                />
              </ModernCard>
            )} */}
            {canViewDetail && candidate.education && (
  <ModernCard 
    title="Education" 
    icon={<Award className="w-5 h-5 text-indigo-600" />}
    gradient="from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-700"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <InfoRow 
        label="SSLC" 
        value={candidate.education.sslc || '-'} 
        icon={<Award className="w-4 h-4 text-indigo-600" />}
      />
      <InfoRow 
        label="HSC" 
        value={candidate.education.hsc || '-'} 
        icon={<Award className="w-4 h-4 text-indigo-600" />}
      />
      <InfoRow 
        label="UG Degree" 
        value={candidate.education.ugDegree || '-'} 
        icon={<Award className="w-4 h-4 text-blue-600" />}
      />
      <InfoRow 
        label="UG Marksheet" 
        value={candidate.education.ugMarksheet || '-'} 
        icon={<File className="w-4 h-4 text-blue-500" />}
      />
      <InfoRow 
        label="UG Provisional" 
        value={candidate.education.ugProvisional || '-'} 
        icon={<File className="w-4 h-4 text-blue-500" />}
      />
      <InfoRow 
        label="PG Degree" 
        value={candidate.education.pgDegree || '-'} 
        icon={<Award className="w-4 h-4 text-indigo-600" />}
      />
    </div>
  </ModernCard>
)}


            {/* Profile Status - Detail user and above */}
            {/* {canViewDetail && candidate.profile && (
              <ModernCard 
                title="Profile Status" 
                icon={<FileSearch className="w-5 h-5 text-teal-600" />}
                gradient="from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700"
              >
                <InfoRow 
                  label="Video Shooted" 
                  value={candidate.profile.videoShooted ? 'Yes' : 'No'} 
                  status={candidate.profile.videoShooted ? 'active' : 'inactive'}
                  icon={<File className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Video Shooted Date" 
                  value={candidate.profile.videoShootedDate ? new Date(candidate.profile.videoShootedDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Model Created" 
                  value={candidate.profile.modelCreated ? 'Yes' : 'No'} 
                  status={candidate.profile.modelCreated ? 'active' : 'inactive'}
                  icon={<File className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Model Created Date" 
                  value={candidate.profile.modelCreatedDate ? new Date(candidate.profile.modelCreatedDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Resume Created" 
                  value={candidate.profile.resumeCreated ? 'Yes' : 'No'} 
                  status={candidate.profile.resumeCreated ? 'active' : 'inactive'}
                  icon={<File className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Resume Created Date" 
                  value={candidate.profile.resumeCreatedDate ? new Date(candidate.profile.resumeCreatedDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Profile Created" 
                  value={candidate.profile.profileCreated ? 'Yes' : 'No'} 
                  status={candidate.profile.profileCreated ? 'active' : 'inactive'}
                  icon={<File className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Profile Created Date" 
                  value={candidate.profile.profileCreatedDate ? new Date(candidate.profile.profileCreatedDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
              </ModernCard>
          )} */}
          {canViewDetail && candidate.profile && (
  <ModernCard 
    title="Profile Status" 
    icon={<FileSearch className="w-5 h-5 text-teal-600" />}
    gradient="from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <InfoRow 
        label="Video Shooted" 
        value={candidate.profile.videoShooted ? 'Yes' : 'No'} 
        status={candidate.profile.videoShooted ? 'active' : 'inactive'}
        icon={<File className="w-4 h-4 text-teal-600" />}
      />
      <InfoRow 
        label="Video Shooted Date" 
        value={candidate.profile.videoShootedDate 
          ? new Date(candidate.profile.videoShootedDate).toLocaleDateString() 
          : '-'} 
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
      <InfoRow 
        label="Model Created" 
        value={candidate.profile.modelCreated ? 'Yes' : 'No'} 
        status={candidate.profile.modelCreated ? 'active' : 'inactive'}
        icon={<File className="w-4 h-4 text-teal-600" />}
      />
      <InfoRow 
        label="Model Created Date" 
        value={candidate.profile.modelCreatedDate 
          ? new Date(candidate.profile.modelCreatedDate).toLocaleDateString() 
          : '-'} 
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
      <InfoRow 
        label="Resume Created" 
        value={candidate.profile.resumeCreated ? 'Yes' : 'No'} 
        status={candidate.profile.resumeCreated ? 'active' : 'inactive'}
        icon={<File className="w-4 h-4 text-teal-600" />}
      />
      <InfoRow 
        label="Resume Created Date" 
        value={candidate.profile.resumeCreatedDate 
          ? new Date(candidate.profile.resumeCreatedDate).toLocaleDateString() 
          : '-'} 
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
      <InfoRow 
        label="Profile Created" 
        value={candidate.profile.profileCreated ? 'Yes' : 'No'} 
        status={candidate.profile.profileCreated ? 'active' : 'inactive'}
        icon={<File className="w-4 h-4 text-teal-600" />}
      />
      <InfoRow 
        label="Profile Created Date" 
        value={candidate.profile.profileCreatedDate 
          ? new Date(candidate.profile.profileCreatedDate).toLocaleDateString() 
          : '-'} 
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
    </div>
  </ModernCard>
)}


        </div>

          {/* Right Column - Finance/Admin Only */}
          {canViewFinance && (
            <div className="space-y-8">
              {/* Financial Information */}
              {/* <ModernCard 
                title="Financial Information" 
                icon={<DollarSign className="w-5 h-5 text-green-600" />}
                gradient="from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700"
              >
                <InfoRow 
                  label="Total Amount" 
                  value={candidate.financial?.totalAmount ? `₹${candidate.financial.totalAmount}` : undefined}
                  icon={<DollarSign className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Amount Received" 
                  value={candidate.financial?.totalAmountReceived ? `₹${candidate.financial.totalAmountReceived}` : undefined}
                  icon={<DollarSign className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Balance Amount" 
                  value={candidate.financial?.balanceAmount ? `₹${candidate.financial.balanceAmount}` : undefined}
                  icon={<DollarSign className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Initial Amount Paid" 
                  value={candidate.financial?.initialAmount ? 'Yes' : 'No'} 
                  status={candidate.financial?.initialAmount ? 'active' : 'inactive'}
                  icon={<CheckCircle className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Payment for Interview" 
                  value={candidate.financial?.paymentForInterview ? `₹${candidate.financial.paymentForInterview}` : undefined}
                  icon={<DollarSign className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Interview Payment Date" 
                  value={candidate.financial?.paymentForInterviewDate ? new Date(candidate.financial.paymentForInterviewDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Payment for Documents" 
                  value={candidate.financial?.paymentForDocuments ? `₹${candidate.financial.paymentForDocuments}` : undefined}
                  icon={<DollarSign className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Documents Payment Date" 
                  value={candidate.financial?.paymentForDocumentsDate ? new Date(candidate.financial.paymentForDocumentsDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Payment for Offer" 
                  value={candidate.financial?.paymentForOffer ? `₹${candidate.financial.paymentForOffer}` : undefined}
                  icon={<DollarSign className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Offer Payment Date" 
                  value={candidate.financial?.paymentForOfferDate ? new Date(candidate.financial.paymentForOfferDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
              </ModernCard> */}
              <ModernCard 
  title="Financial Information" 
  icon={<DollarSign className="w-5 h-5 text-green-600" />}
  gradient="from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700"
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
    <InfoRow 
      label="Total Amount" 
      value={candidate.financial?.totalAmount != null ? `₹${candidate.financial.totalAmount}` : '-'} 
      icon={<DollarSign className="w-4 h-4 text-green-600" />}
    />
    <InfoRow 
      label="Amount Received" 
      value={candidate.financial?.totalAmountReceived != null ? `₹${candidate.financial.totalAmountReceived}` : '-'} 
      icon={<DollarSign className="w-4 h-4 text-green-600" />}
    />
    <InfoRow 
      label="Balance Amount" 
      value={candidate.financial?.balanceAmount != null ? `₹${candidate.financial.balanceAmount}` : '-'} 
      icon={<DollarSign className="w-4 h-4 text-green-600" />}
    />
    <InfoRow 
      label="Initial Amount Paid" 
      value={candidate.financial?.initialAmount ? 'Yes' : 'No'} 
      status={candidate.financial?.initialAmount ? 'active' : 'inactive'}
      icon={<CheckCircle className={`w-4 h-4 ${candidate.financial?.initialAmount ? 'text-green-600' : 'text-gray-400'}`} />}
    />
    <InfoRow 
      label="Payment for Interview" 
      value={candidate.financial?.paymentForInterview != null ? `₹${candidate.financial.paymentForInterview}` : '-'} 
      icon={<DollarSign className="w-4 h-4 text-green-600" />}
    />
    <InfoRow 
      label="Interview Payment Date" 
      value={candidate.financial?.paymentForInterviewDate 
        ? new Date(candidate.financial.paymentForInterviewDate).toLocaleDateString() 
        : '-'} 
      icon={<Calendar className="w-4 h-4 text-gray-600" />}
    />
    <InfoRow 
      label="Payment for Documents" 
      value={candidate.financial?.paymentForDocuments != null ? `₹${candidate.financial.paymentForDocuments}` : '-'} 
      icon={<DollarSign className="w-4 h-4 text-green-600" />}
    />
    <InfoRow 
      label="Documents Payment Date" 
      value={candidate.financial?.paymentForDocumentsDate 
        ? new Date(candidate.financial.paymentForDocumentsDate).toLocaleDateString() 
        : '-'} 
      icon={<Calendar className="w-4 h-4 text-gray-600" />}
    />
    <InfoRow 
      label="Payment for Offer" 
      value={candidate.financial?.paymentForOffer != null ? `₹${candidate.financial.paymentForOffer}` : '-'} 
      icon={<DollarSign className="w-4 h-4 text-green-600" />}
    />
    <InfoRow 
      label="Offer Payment Date" 
      value={candidate.financial?.paymentForOfferDate 
        ? new Date(candidate.financial.paymentForOfferDate).toLocaleDateString() 
        : '-'} 
      icon={<Calendar className="w-4 h-4 text-gray-600" />}
    />
  </div>
</ModernCard>


              {/* Payment Splits */}
              <ModernCard 
                title="Payment Splits" 
                icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
                gradient="from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-700"
              >
                {/* Initial Amount Splits */}
                {/* <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Initial Amount Splits</h4>
                  <ArrayDisplay 
                    items={candidate.financial?.initialAmountSplits}
                    emptyMessage="No initial amount splits"
                    renderItem={(split) => (
                      <div className="space-y-2">
                        <InfoRow 
                          label="Amount" 
                          value={split.amount ? `₹${split.amount}` : undefined}
                          icon={<DollarSign className="w-4 h-4" />}
                        />
                        <InfoRow 
                          label="Date" 
                          value={split.date ? new Date(split.date).toLocaleDateString() : undefined}
                          icon={<Calendar className="w-4 h-4" />}
                        />
                        <InfoRow 
                          label="Comment" 
                          value={split.comment} 
                          icon={<FileText className="w-4 h-4" />}
                        />
                      </div>
                    )}
                  />
                </div> */}
                {candidate.financial?.initialAmountSplits && (
  <div className="mb-6">
    <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-3">
      Initial Amount Splits
    </h4>
    <ArrayDisplay
      items={candidate.financial.initialAmountSplits}
      emptyMessage="No initial amount splits"
      renderItem={(split, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 p-4 mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
        >
          <InfoRow
            label="Amount"
            value={split.amount != null ? `₹${split.amount}` : '-'}
            icon={<DollarSign className="w-4 h-4 text-green-600" />}
          />
          <InfoRow
            label="Date"
            value={split.date ? new Date(split.date).toLocaleDateString() : '-'}
            icon={<Calendar className="w-4 h-4 text-gray-600" />}
          />
          <InfoRow
            label="Comment"
            value={split.comment || '-'}
            icon={<FileText className="w-4 h-4 text-gray-600" />}
          />
        </div>
      )}
    />
  </div>
)}


                {/* Balance Amount Splits */}
                {/* <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Balance Amount Splits</h4>
                  <ArrayDisplay 
                    items={candidate.financial?.balanceAmountSplits}
                    emptyMessage="No balance amount splits"
                    renderItem={(split) => (
                      <div className="space-y-2">
                        <InfoRow 
                          label="Amount" 
                          value={split.amount ? `₹${split.amount}` : undefined}
                          icon={<DollarSign className="w-4 h-4" />}
                        />
                        <InfoRow 
                          label="Date" 
                          value={split.date ? new Date(split.date).toLocaleDateString() : undefined}
                          icon={<Calendar className="w-4 h-4" />}
                        />
                        <InfoRow 
                          label="Comment" 
                          value={split.comment} 
                          icon={<FileText className="w-4 h-4" />}
                        />
                      </div>
                    )}
                  />
                </div> */}
                {candidate.financial?.balanceAmountSplits && (
  <div className="mb-6">
    <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-3">
      Balance Amount Splits
    </h4>
    <ArrayDisplay 
      items={candidate.financial.balanceAmountSplits}
      emptyMessage="No balance amount splits"
      renderItem={(split, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 p-4 mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
        >
          <InfoRow 
            label="Amount" 
            value={split.amount != null ? `₹${split.amount}` : '-'} 
            icon={<DollarSign className="w-4 h-4 text-green-600" />}
          />
          <InfoRow 
            label="Date" 
            value={split.date ? new Date(split.date).toLocaleDateString() : '-'} 
            icon={<Calendar className="w-4 h-4 text-gray-600" />}
          />
          <InfoRow 
            label="Comment" 
            value={split.comment || '-'} 
            icon={<FileText className="w-4 h-4 text-gray-600" />}
          />
        </div>
      )}
    />
  </div>
)}


                {/* Balance Amount Splits Paid */}
                {/* <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Balance Amount Splits Paid</h4>
                  <ArrayDisplay 
                    items={candidate.financial?.balanceAmountSplitsPaid}
                    emptyMessage="No balance amount splits paid"
                    renderItem={(split) => (
                      <div className="space-y-2">
                        <InfoRow 
                          label="Amount" 
                          value={split.amount ? `₹${split.amount}` : undefined}
                          icon={<DollarSign className="w-4 h-4" />}
                        />
                        <InfoRow 
                          label="Date" 
                          value={split.date ? new Date(split.date).toLocaleDateString() : undefined}
                          icon={<Calendar className="w-4 h-4" />}
                        />
                        <InfoRow 
                          label="Comment" 
                          value={split.comment} 
                          icon={<FileText className="w-4 h-4" />}
                        />
                      </div>
                    )}
                  />
                </div> */}
                {candidate.financial?.balanceAmountSplitsPaid && (
  <div className="mb-6">
    <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-3">
      Balance Amount Splits Paid
    </h4>
    <ArrayDisplay
      items={candidate.financial.balanceAmountSplitsPaid}
      emptyMessage="No balance amount splits paid"
      renderItem={(split, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 p-4 mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
        >
          <InfoRow 
            label="Amount" 
            value={split.amount != null ? `₹${split.amount}` : '-'} 
            icon={<DollarSign className="w-4 h-4 text-green-600" />}
          />
          <InfoRow 
            label="Date" 
            value={split.date ? new Date(split.date).toLocaleDateString() : '-'} 
            icon={<Calendar className="w-4 h-4 text-gray-600" />}
          />
          <InfoRow 
            label="Comment" 
            value={split.comment || '-'} 
            icon={<FileText className="w-4 h-4 text-gray-600" />}
          />
        </div>
      )}
    />
  </div>
)}

              </ModernCard>

              {/* Agreements */}
              {/* <ModernCard 
                title="Agreements" 
                icon={<FileSignature className="w-5 h-5 text-purple-600" />}
                gradient="from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700"
              >
                <InfoRow 
                  label="Entry Agreement" 
                  value={candidate.agreements?.entry?.signed ? 'Signed' : 'Not Signed'} 
                  status={candidate.agreements?.entry?.signed ? 'active' : 'inactive'}
                  icon={<FileSignature className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Entry Signed Date" 
                  value={candidate.agreements?.entry?.signedDate ? new Date(candidate.agreements.entry.signedDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Entry Document" 
                  value={candidate.agreements?.entry?.document} 
                  icon={<File className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Job Offer Agreement" 
                  value={candidate.agreements?.jobOffer?.signed ? 'Signed' : 'Not Signed'} 
                  status={candidate.agreements?.jobOffer?.signed ? 'active' : 'inactive'}
                  icon={<FileSignature className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Job Offer Signed Date" 
                  value={candidate.agreements?.jobOffer?.signedDate ? new Date(candidate.agreements.jobOffer.signedDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Job Offer Document" 
                  value={candidate.agreements?.jobOffer?.document} 
                  icon={<File className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Exit Agreement" 
                  value={candidate.agreements?.exit?.signed ? 'Signed' : 'Not Signed'} 
                  status={candidate.agreements?.exit?.signed ? 'active' : 'inactive'}
                  icon={<FileSignature className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Exit Signed Date" 
                  value={candidate.agreements?.exit?.signedDate ? new Date(candidate.agreements.exit.signedDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Exit Document" 
                  value={candidate.agreements?.exit?.document} 
                  icon={<File className="w-4 h-4" />}
                />
              </ModernCard> */}
              <ModernCard 
  title="Agreements" 
  icon={<FileSignature className="w-5 h-5 text-purple-600" />}
  gradient="from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700"
>
  {/* Entry Agreement */}
  <div className="mb-6">
    <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Entry Agreement</h5>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
      <InfoRow 
        label="Status" 
        value={candidate.agreements?.entry?.signed ? 'Signed' : 'Not Signed'} 
        status={candidate.agreements?.entry?.signed ? 'active' : 'inactive'}
        icon={<FileSignature className="w-4 h-4 text-purple-600" />}
      />
      <InfoRow 
        label="Signed Date" 
        value={candidate.agreements?.entry?.signedDate ? new Date(candidate.agreements.entry.signedDate).toLocaleDateString() : '-'}
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
      <InfoRow 
        label="Document" 
        value={candidate.agreements?.entry?.document || '-'} 
        icon={<File className="w-4 h-4 text-gray-600" />}
      />
    </div>
  </div>

  {/* Job Offer Agreement */}
  <div className="mb-6">
    <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Job Offer Agreement</h5>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
      <InfoRow 
        label="Status" 
        value={candidate.agreements?.jobOffer?.signed ? 'Signed' : 'Not Signed'} 
        status={candidate.agreements?.jobOffer?.signed ? 'active' : 'inactive'}
        icon={<FileSignature className="w-4 h-4 text-purple-600" />}
      />
      <InfoRow 
        label="Signed Date" 
        value={candidate.agreements?.jobOffer?.signedDate ? new Date(candidate.agreements.jobOffer.signedDate).toLocaleDateString() : '-'}
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
      <InfoRow 
        label="Document" 
        value={candidate.agreements?.jobOffer?.document || '-'} 
        icon={<File className="w-4 h-4 text-gray-600" />}
      />
    </div>
  </div>

  {/* Exit Agreement */}
  <div>
    <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Exit Agreement</h5>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
      <InfoRow 
        label="Status" 
        value={candidate.agreements?.exit?.signed ? 'Signed' : 'Not Signed'} 
        status={candidate.agreements?.exit?.signed ? 'active' : 'inactive'}
        icon={<FileSignature className="w-4 h-4 text-purple-600" />}
      />
      <InfoRow 
        label="Signed Date" 
        value={candidate.agreements?.exit?.signedDate ? new Date(candidate.agreements.exit.signedDate).toLocaleDateString() : '-'}
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
      <InfoRow 
        label="Document" 
        value={candidate.agreements?.exit?.document || '-'} 
        icon={<File className="w-4 h-4 text-gray-600" />}
      />
    </div>
  </div>
</ModernCard>


              {/* Receipts */}
              {/* <ModernCard 
                title="Receipts" 
                icon={<FileCheck2 className="w-5 h-5 text-blue-600" />}
                gradient="from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700"
              >
                <InfoRow 
                  label="Entry Receipt" 
                  value={candidate.receipts?.entry?.created ? 'Created' : 'Not Created'} 
                  status={candidate.receipts?.entry?.created ? 'active' : 'inactive'}
                  icon={<FileCheck2 className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Entry Receipt Date" 
                  value={candidate.receipts?.entry?.createdDate ? new Date(candidate.receipts.entry.createdDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Entry Receipt Document" 
                  value={candidate.receipts?.entry?.document} 
                  icon={<File className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Job Offer Receipt" 
                  value={candidate.receipts?.jobOffer?.created ? 'Created' : 'Not Created'} 
                  status={candidate.receipts?.jobOffer?.created ? 'active' : 'inactive'}
                  icon={<FileCheck2 className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Job Offer Receipt Date" 
                  value={candidate.receipts?.jobOffer?.createdDate ? new Date(candidate.receipts.jobOffer.createdDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Job Offer Receipt Document" 
                  value={candidate.receipts?.jobOffer?.document} 
                  icon={<File className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Exit Receipt" 
                  value={candidate.receipts?.exit?.created ? 'Created' : 'Not Created'} 
                  status={candidate.receipts?.exit?.created ? 'active' : 'inactive'}
                  icon={<FileCheck2 className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Exit Receipt Date" 
                  value={candidate.receipts?.exit?.createdDate ? new Date(candidate.receipts.exit.createdDate).toLocaleDateString() : undefined}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoRow 
                  label="Exit Receipt Document" 
                  value={candidate.receipts?.exit?.document} 
                  icon={<File className="w-4 h-4" />}
                />
              </ModernCard> */}
              <ModernCard 
  title="Receipts" 
  icon={<FileCheck2 className="w-5 h-5 text-blue-600" />}
  gradient="from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700"
>
  {/* Entry Receipt */}
  <div className="mb-6">
    <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Entry Receipt</h5>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
      <InfoRow 
        label="Status" 
        value={candidate.receipts?.entry?.created ? 'Created' : 'Not Created'} 
        status={candidate.receipts?.entry?.created ? 'active' : 'inactive'}
        icon={<FileCheck2 className="w-4 h-4 text-blue-600" />}
      />
      <InfoRow 
        label="Created Date" 
        value={candidate.receipts?.entry?.createdDate ? new Date(candidate.receipts.entry.createdDate).toLocaleDateString() : '-'}
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
      <InfoRow 
        label="Document" 
        value={candidate.receipts?.entry?.document || '-'} 
        icon={<File className="w-4 h-4 text-gray-600" />}
      />
    </div>
  </div>

  {/* Job Offer Receipt */}
  <div className="mb-6">
    <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Job Offer Receipt</h5>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
      <InfoRow 
        label="Status" 
        value={candidate.receipts?.jobOffer?.created ? 'Created' : 'Not Created'} 
        status={candidate.receipts?.jobOffer?.created ? 'active' : 'inactive'}
        icon={<FileCheck2 className="w-4 h-4 text-blue-600" />}
      />
      <InfoRow 
        label="Created Date" 
        value={candidate.receipts?.jobOffer?.createdDate ? new Date(candidate.receipts.jobOffer.createdDate).toLocaleDateString() : '-'}
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
      <InfoRow 
        label="Document" 
        value={candidate.receipts?.jobOffer?.document || '-'} 
        icon={<File className="w-4 h-4 text-gray-600" />}
      />
    </div>
  </div>

  {/* Exit Receipt */}
  <div>
    <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Exit Receipt</h5>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
      <InfoRow 
        label="Status" 
        value={candidate.receipts?.exit?.created ? 'Created' : 'Not Created'} 
        status={candidate.receipts?.exit?.created ? 'active' : 'inactive'}
        icon={<FileCheck2 className="w-4 h-4 text-blue-600" />}
      />
      <InfoRow 
        label="Created Date" 
        value={candidate.receipts?.exit?.createdDate ? new Date(candidate.receipts.exit.createdDate).toLocaleDateString() : '-'}
        icon={<Calendar className="w-4 h-4 text-gray-600" />}
      />
      <InfoRow 
        label="Document" 
        value={candidate.receipts?.exit?.document || '-'} 
        icon={<File className="w-4 h-4 text-gray-600" />}
      />
    </div>
  </div>
</ModernCard>


              {/* Loans */}
              {/* <ModernCard 
                title="Loans" 
                icon={<DollarSign className="w-5 h-5 text-orange-600" />}
                gradient="from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700"
              >
                <ArrayDisplay 
                  items={candidate.loans}
                  emptyMessage="No loans recorded"
                  renderItem={(loan) => (
                    <div className="space-y-2">
                      <InfoRow 
                        label="Loan Approved" 
                        value={loan.loan ? 'Yes' : 'No'} 
                        status={loan.loan ? 'active' : 'inactive'}
                        icon={<DollarSign className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Distributed Amount" 
                        value={loan.distributedAmount ? `₹${loan.distributedAmount}` : undefined}
                        icon={<DollarSign className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Distributed Date" 
                        value={loan.distributedDate ? new Date(loan.distributedDate).toLocaleDateString() : undefined}
                        icon={<Calendar className="w-4 h-4" />}
                      />
                    </div>
                  )}
                />
              </ModernCard> */}
              <ModernCard 
  title="Loans" 
  icon={<DollarSign className="w-5 h-5 text-orange-600" />}
  gradient="from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700"
>
  <ArrayDisplay 
    items={candidate.loans}
    emptyMessage="No loans recorded"
    renderItem={(loan, index) => (
      <div key={index} className="space-y-2 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-none last:pb-0 last:mb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
          <InfoRow 
            label="Loan Approved" 
            value={loan.loan ? 'Yes' : 'No'} 
            status={loan.loan ? 'active' : 'inactive'}
            icon={<DollarSign className="w-4 h-4 text-orange-600" />}
          />
          <InfoRow 
            label="Distributed Amount" 
            value={loan.distributedAmount ? `₹${loan.distributedAmount}` : '-'}
            icon={<DollarSign className="w-4 h-4 text-gray-600" />}
          />
          <InfoRow 
            label="Distributed Date" 
            value={loan.distributedDate ? new Date(loan.distributedDate).toLocaleDateString() : '-'}
            icon={<Calendar className="w-4 h-4 text-gray-600" />}
          />
        </div>
      </div>
    )}
  />
</ModernCard>


              {/* Interviews */}
              {/* <ModernCard 
                title="Interviews" 
                icon={<Briefcase className="w-5 h-5 text-indigo-600" />}
                gradient="from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-700"
              >
                <ArrayDisplay 
                  items={candidate.interviews}
                  emptyMessage="No interviews scheduled"
                  renderItem={(interview) => (
                    <div className="space-y-2">
                      <InfoRow 
                        label="Domain" 
                        value={interview.domain} 
                        icon={<Building className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Date/Time" 
                        value={interview.interviewDateTime ? new Date(interview.interviewDateTime).toLocaleString() : undefined}
                        icon={<Calendar className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Company" 
                        value={interview.companyName} 
                        icon={<Building className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Level" 
                        value={interview.interviewLevel} 
                        icon={<TrendingUp className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Interviewer" 
                        value={interview.interviewerName} 
                        icon={<User className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Proxy" 
                        value={interview.proxyName} 
                        icon={<User className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="HR Name" 
                        value={interview.hrName} 
                        icon={<User className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="HR Email" 
                        value={interview.hrEmail} 
                        icon={<Mail className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="HR Phone" 
                        value={interview.hrPhone} 
                        icon={<Phone className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Status" 
                        value={interview.status} 
                        status={interview.status}
                        icon={<CheckCircle className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Result" 
                        value={interview.result} 
                        icon={<TrendingUp className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Remarks" 
                        value={interview.resultRemarks} 
                        icon={<FileText className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Rescheduled Date/Time" 
                        value={interview.rescheduledDateTime ? new Date(interview.rescheduledDateTime).toLocaleString() : undefined}
                        icon={<Calendar className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Status Remarks" 
                        value={interview.statusRemarks} 
                        icon={<FileText className="w-4 h-4" />}
                      />
                  </div>
                  )}
                />
              </ModernCard> */}
              <ModernCard 
  title="Interviews" 
  icon={<Briefcase className="w-5 h-5 text-indigo-600" />}
  gradient="from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-700"
>
  <ArrayDisplay 
    items={candidate.interviews}
    emptyMessage="No interviews scheduled"
    renderItem={(interview, index) => (
      <div
        key={index}
        className="space-y-2 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:pb-0 last:mb-0 last:border-none"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
          <InfoRow label="Domain" value={interview.domain} icon={<Building className="w-4 h-4" />} />
          <InfoRow label="Date/Time" value={interview.interviewDateTime ? new Date(interview.interviewDateTime).toLocaleString() : '-'} icon={<Calendar className="w-4 h-4" />} />
          <InfoRow label="Company" value={interview.companyName} icon={<Building className="w-4 h-4" />} />
          <InfoRow label="Level" value={interview.interviewLevel} icon={<TrendingUp className="w-4 h-4" />} />
          <InfoRow label="Interviewer" value={interview.interviewerName} icon={<User className="w-4 h-4" />} />
          <InfoRow label="Proxy" value={interview.proxyName} icon={<User className="w-4 h-4" />} />
          <InfoRow label="HR Name" value={interview.hrName} icon={<User className="w-4 h-4" />} />
          <InfoRow label="HR Email" value={interview.hrEmail} icon={<Mail className="w-4 h-4" />} />
          <InfoRow label="HR Phone" value={interview.hrPhone} icon={<Phone className="w-4 h-4" />} />
          <InfoRow label="Status" value={interview.status} status={interview.status} icon={<CheckCircle className="w-4 h-4" />} />
          <InfoRow label="Result" value={interview.result} icon={<TrendingUp className="w-4 h-4" />} />
          <InfoRow label="Remarks" value={interview.resultRemarks} icon={<FileText className="w-4 h-4" />} />
          <InfoRow label="Rescheduled Date/Time" value={interview.rescheduledDateTime ? new Date(interview.rescheduledDateTime).toLocaleString() : '-'} icon={<Calendar className="w-4 h-4" />} />
          <InfoRow label="Status Remarks" value={interview.statusRemarks} icon={<FileText className="w-4 h-4" />} />
        </div>
      </div>
    )}
  />
</ModernCard>


              {/* Offers */}
              {/* <ModernCard 
                title="Job Offers" 
                icon={<FileOutput className="w-5 h-5 text-green-600" />}
                gradient="from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700"
              >
                <ArrayDisplay 
                  items={candidate.offers}
                  emptyMessage="No job offers received"
                  renderItem={(offer) => (
                    <div className="space-y-2">
                      <InfoRow 
                        label="Offer Letter Received" 
                        value={offer.offerLetterReceived ? 'Yes' : 'No'} 
                        status={offer.offerLetterReceived ? 'active' : 'inactive'}
                        icon={<FileOutput className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Offer Letter Date" 
                        value={offer.offerLetterReceivedDate ? new Date(offer.offerLetterReceivedDate).toLocaleDateString() : undefined}
                        icon={<Calendar className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Offer Letter Document" 
                        value={offer.offerLetterDoc} 
                        icon={<File className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Company" 
                        value={offer.companyName} 
                        icon={<Building className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Company Address" 
                        value={offer.companyAddress} 
                        icon={<MapPin className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="HR Name" 
                        value={offer.hrName} 
                        icon={<User className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="HR Email" 
                        value={offer.hrEmail} 
                        icon={<Mail className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="HR Phone" 
                        value={offer.hrPhone} 
                        icon={<Phone className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Onboarded" 
                        value={offer.onboarded ? 'Yes' : 'No'} 
                        status={offer.onboarded ? 'active' : 'inactive'}
                        icon={<CheckCircle className="w-4 h-4" />}
                      />
                      <InfoRow 
                        label="Onboarded Date" 
                        value={offer.onboardedDate ? new Date(offer.onboardedDate).toLocaleDateString() : undefined}
                        icon={<Calendar className="w-4 h-4" />}
                      />
                  </div>
                  )}
                />
              </ModernCard> */}
              <ModernCard 
  title="Job Offers" 
  icon={<FileOutput className="w-5 h-5 text-green-600" />}
  gradient="from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700"
>
  <ArrayDisplay 
    items={candidate.offers}
    emptyMessage="No job offers received"
    renderItem={(offer, index) => (
      <div
        key={index}
        className="space-y-2 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:pb-0 last:mb-0 last:border-none"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
          <InfoRow 
            label="Offer Letter Received" 
            value={offer.offerLetterReceived ? 'Yes' : 'No'} 
            status={offer.offerLetterReceived ? 'active' : 'inactive'}
            icon={<FileOutput className="w-4 h-4" />}
          />
          <InfoRow 
            label="Offer Letter Date" 
            value={offer.offerLetterReceivedDate ? new Date(offer.offerLetterReceivedDate).toLocaleDateString() : '-'}
            icon={<Calendar className="w-4 h-4" />}
          />
          <InfoRow 
            label="Offer Letter Document" 
            value={offer.offerLetterDoc || '-'} 
            icon={<File className="w-4 h-4" />}
          />
          <InfoRow 
            label="Company" 
            value={offer.companyName || '-'} 
            icon={<Building className="w-4 h-4" />}
          />
          <InfoRow 
            label="Company Address" 
            value={offer.companyAddress || '-'} 
            icon={<MapPin className="w-4 h-4" />}
          />
          <InfoRow 
            label="HR Name" 
            value={offer.hrName || '-'} 
            icon={<User className="w-4 h-4" />}
          />
          <InfoRow 
            label="HR Email" 
            value={offer.hrEmail || '-'} 
            icon={<Mail className="w-4 h-4" />}
          />
          <InfoRow 
            label="HR Phone" 
            value={offer.hrPhone || '-'} 
            icon={<Phone className="w-4 h-4" />}
          />
          <InfoRow 
            label="Onboarded" 
            value={offer.onboarded ? 'Yes' : 'No'} 
            status={offer.onboarded ? 'active' : 'inactive'}
            icon={<CheckCircle className="w-4 h-4" />}
          />
          <InfoRow 
            label="Onboarded Date" 
            value={offer.onboardedDate ? new Date(offer.onboardedDate).toLocaleDateString() : '-'}
            icon={<Calendar className="w-4 h-4" />}
          />
        </div>
      </div>
    )}
  />
</ModernCard>

                  </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-center gap-4">
            <span>Created: {candidate.createdAt && new Date(candidate.createdAt).toLocaleString()}</span>
            <span>•</span>
            <span>Updated: {candidate.updatedAt && new Date(candidate.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedViewCandidate(props) {
  return (
    <ErrorBoundary>
      <ViewCandidate {...props} />
    </ErrorBoundary>
  );
} 