import React, { useEffect } from 'react';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidateById, updateCandidateById, selectSelectedCandidate, selectCandidatesLoading, selectCandidatesError } from '../../store/slices/candidateSlice';
import { useToast } from '../../components/common';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  BookOpen, 
  FileText, 
  Briefcase, 
  Award, 
  Upload,
  Check,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Home,
  Users,
  GraduationCap,
  Video,
  Plus,
  Trash,
  Building,
  Clock,
  CheckCircle
} from 'lucide-react';
import { selectParticipants, selectParticipantsLoading, fetchParticipants } from '../../store/slices/participantsSlice';

// Form Section Component
const FormSection = ({ title, icon: Icon, children, action }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-6 h-6 text-blue-600" />}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

// Floating Label Input Component
const FloatingLabelInput = ({ field, placeholder, icon: Icon, type = "text", error, rows, onKeyPress, disabled, ...props }) => (
  <div className="relative">
    {Icon && (
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Icon className="w-5 h-5" />
      </div>
    )}
    {type === "textarea" ? (
      <textarea
        {...field}
        rows={rows}
        disabled={disabled}
        className={`w-full px-3 py-3 ${Icon ? 'pl-10' : ''} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } dark:bg-gray-700 dark:border-gray-600 dark:text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        placeholder={placeholder}
        {...props}
      />
    ) : (
      <input
        {...field}
        type={type}
        disabled={disabled}
        className={`w-full px-3 py-3 ${Icon ? 'pl-10' : ''} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } dark:bg-gray-700 dark:border-gray-600 dark:text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        placeholder={placeholder}
        onKeyPress={onKeyPress}
        {...props}
      />
    )}
  </div>
);

// Floating Label Select Component
const FloatingLabelSelect = ({ field, placeholder, icon: Icon, error, children, disabled }) => (
  <div className="relative">
    {Icon && (
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Icon className="w-5 h-5" />
      </div>
    )}
    <select
      {...field}
      disabled={disabled}
      className={`w-full px-3 py-3 ${Icon ? 'pl-10' : ''} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        error ? 'border-red-500' : 'border-gray-300'
      } dark:bg-gray-700 dark:border-gray-600 dark:text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  </div>
);

// Floating Label TextArea Component
const FloatingLabelTextArea = ({ field, placeholder, rows = 4, error, disabled }) => (
  <textarea
    {...field}
    rows={rows}
    disabled={disabled}
    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      error ? 'border-red-500' : 'border-gray-300'
    } dark:bg-gray-700 dark:border-gray-600 dark:text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    placeholder={placeholder}
  />
);

// Error Message Component
const ErrorMessage = ({ error }) => (
  error && (
    <p className="text-red-500 text-sm mt-1">{error.message}</p>
  )
);

// Status Block Component (for Profile Status)
const StatusBlock = ({
  label,
  control,
  watch,
  errors,
  checkboxName,
  dateName,
  dateLabel,
  validateDate,
  disabled,
  getMinDate,
}) => {
  const isChecked = watch(checkboxName);

  return (
    <div className="space-y-4">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <label className="text-lg font-semibold text-gray-800 dark:text-white">{label}</label>
            </div>
          </div>
          <Controller
            name={checkboxName}
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completed</span>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-600 focus:ring-2"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  disabled={disabled}
                />
              </div>
            )}
          />
        </div>
      </div>

      {isChecked && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                {dateLabel}
              </label>
              <Controller
                name={dateName}
                control={control}
                rules={{ validate: validateDate }}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={{
                      ...field,
                      value: field.value && new Date(field.value).toString() !== "Invalid Date"
                        ? new Date(field.value).toISOString().split("T")[0]
                        : "",
                      onChange: (e) => field.onChange(new Date(e.target.value))
                    }}
                    type="date"
                    placeholder="Select Date"
                    icon={User}
                    error={errors?.[dateName]}
                    disabled={disabled}
                    min={getMinDate ? (getMinDate() ? new Date(getMinDate()).toISOString().split('T')[0] : undefined) : undefined}
                  />
                )}
              />
              <ErrorMessage error={errors?.[dateName]} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const defaultValues = {
  fullName: '',
  email: '',
  phone: '',
  referredBy: '',
  trainerName: '',
  slotTime: '',
  classStartDate: '',
  courseEndDate: '',
  stage: '',
  trainingStageDate: '',
  pocStageDate: '',
  projectsStageDate: '',
  profileCreatedDate: '',
  showPersonalDocs: false,
  eAadhar: '',
  panCard: '',
  photo: '',
  passport: '',
  showEducationalDocs: false,
  sslc: '',
  hsc: '',
  ugDegreeCertificate: '',
  ugConsolidatedMarksheet: '',
  ugProvisionalCertificate: '',
  pgDegreeCertificate: '',
  showDocumentTracking: false,
  showProfileStatus: false,
  showInterviewDetails: false,
  showOfferDetails: false,
  status: 'active',
  inActiveDate: '',
  inActiveReason: '',
  inActiveNotes: '',
  
  // Agreement fields
  entryAgreementSigned: false,
  entryAgreementSignedDate: '',
  entryAgreementDoc: '',
  entryReceiptCreated: false,
  entryReceiptCreatedDate: '',
  entryReceiptDoc: '',
  
  jobOfferAgreementSigned: false,
  jobOfferAgreementSignedDate: '',
  jobOfferAgreementDoc: '',
  jobOfferReceiptCreated: false,
  jobOfferReceiptCreatedDate: '',
  jobOfferReceiptDoc: '',
  
  exitAgreementSigned: false,
  exitAgreementSignedDate: '',
  exitAgreementDoc: '',
  exitReceiptCreated: false,
  exitReceiptCreatedDate: '',
  exitReceiptDoc: '',
  
  // Profiles array for dynamic profile management
  profiles: [],
  
  // Interview fields
  interviewDomain: '',
  interviewDateTime: '',
  interviewCompanyName: '',
  interviewLevel: '',
  interviewerName: '',
  proxyName: '',
  hrName: '',
  hrEmail: '',
  hrPhone: '',
  interviewStatus: '',
  interviewResult: '',
  interviewResultRemarks: '',
  
  // Offer fields
  offerLetterReceived: false,
  offerLetterReceivedDate: '',
  offerCompanyName: '',
  offerHrName: '',
  offerHrEmail: '',
  offerHrPhone: '',
  onboarded: false,
  onboardedDate: '',
};

// Utility to recursively remove empty string fields from an object
function removeEmptyStrings(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeEmptyStrings);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v !== '' && v !== null && v !== undefined)
        .map(([k, v]) => [k, removeEmptyStrings(v)])
    );
  }
  return obj;
}

// Utility to format date fields as ISO strings or omit if invalid
function toISOStringOrNull(date) {
  if (!date) return undefined;
  const d = new Date(date);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

// Transform flat form data to nested structure for backend
function transformCandidateFormData(data) {
  return {
    // Top-level fields
    fullName: data.fullName || '',
    email: data.email || '',
    phone: data.phone || '',
    status: data.status,
    paymentStatus: data.paymentStatus,
    category: data.category,
    course: data.course,
    othersCourseName: data.othersCourseName,
    inactiveReason: data.inactiveReason,
    inactiveDate: toISOStringOrNull(data.inactiveDate),
    comments: data.comments,
    documentsNonSubmissionReason: data.documentsNonSubmissionReason,
    agentName: data.agentName,
    joiningDate: toISOStringOrNull(data.joiningDate),
    referredBy: data.referredBy,
    // Nested objects
    addresses: {
      permanent: data.permanentAddress,
      current: data.currentAddress,
    },
    contacts: {
      father: { name: data.fatherName, phone: data.fatherPhone },
      mother: { name: data.motherName, phone: data.motherPhone },
      spouse: { name: data.spouseName, phone: data.spousePhone },
    },
    training: {
      trainerName: data.trainerName,
      slotTime: data.slotTime,
      classStartDate: toISOStringOrNull(data.classStartDate),
      courseEndDate: toISOStringOrNull(data.courseEndDate),
      stage: data.stage,
      stageUpdateDate: toISOStringOrNull(data.stageUpdateDate),
      trainingStageDate: toISOStringOrNull(data.trainingStageDate),
      projectsStageDate: toISOStringOrNull(data.projectsStageDate),
      pocStageDate: toISOStringOrNull(data.pocStageDate),
      profileCreatedStageDate: toISOStringOrNull(data.profileCreatedStageDate),
    },
    education: {
      sslc: data.sslc,
      hsc: data.hsc,
      ugDegree: data.ugDegreeCertificate,
      ugMarksheet: data.ugConsolidatedMarksheet,
      ugProvisional: data.ugProvisionalCertificate,
      pgDegree: data.pgDegreeCertificate,
    },
    documents: {
      eAadhar: data.eAadhar,
      panCard: data.panCard,
      photo: data.photo,
      passport: data.passport,
    },
    profile: data.profiles && data.profiles.length > 0
      ? (() => {
          const { _id, ...rest } = data.profiles[0] || {};
          return {
            ...rest,
            videoShootedDate: toISOStringOrNull(rest.videoShootedDate),
            modelCreatedDate: toISOStringOrNull(rest.modelCreatedDate),
            resumeCreatedDate: toISOStringOrNull(rest.resumeCreatedDate),
            profileCreatedDate: toISOStringOrNull(rest.profileCreatedDate),
          };
        })()
      : {
          videoShooted: false,
          modelCreated: false,
          resumeCreated: false,
          profileCreated: false,
        },
    agreements: {
      entry: {
        signed: data.entryAgreementSigned,
        signedDate: toISOStringOrNull(data.entryAgreementSignedDate),
        document: data.entryAgreementDoc,
      },
      jobOffer: {
        signed: data.jobOfferAgreementSigned,
        signedDate: toISOStringOrNull(data.jobOfferAgreementSignedDate),
        document: data.jobOfferAgreementDoc,
      },
      exit: {
        signed: data.exitAgreementSigned,
        signedDate: toISOStringOrNull(data.exitAgreementSignedDate),
        document: data.exitAgreementDoc,
      },
    },
    receipts: {
      entry: {
        created: data.entryReceiptCreated,
        createdDate: toISOStringOrNull(data.entryReceiptCreatedDate),
        document: data.entryReceiptDoc,
      },
      jobOffer: {
        created: data.jobOfferReceiptCreated,
        createdDate: toISOStringOrNull(data.jobOfferReceiptCreatedDate),
        document: data.jobOfferReceiptDoc,
      },
      exit: {
        created: data.exitReceiptCreated,
        createdDate: toISOStringOrNull(data.exitReceiptCreatedDate),
        document: data.exitReceiptDoc,
      },
    },
    // Nested arrays
    interviews: Array.isArray(data.interviews) ? data.interviews.map(interview => ({
      ...interview,
      interviewDateTime: toISOStringOrNull(interview.interviewDateTime),
      rescheduledDateTime: toISOStringOrNull(interview.rescheduledDateTime),
    })) : [],
    offers: Array.isArray(data.offers) ? data.offers.map(offer => ({
      ...offer,
      offerLetterReceivedDate: toISOStringOrNull(offer.offerLetterReceivedDate),
      onboardedDate: toISOStringOrNull(offer.onboardedDate),
    })) : [],
    // Add similar mapping for financial, loans if needed
  };
}

// Utility to flatten nested candidate data for form reset
function flattenCandidateData(candidate) {
  if (!candidate) return {};
  return {
    ...candidate,
    // Training
    trainerName: candidate.training?.trainerName || '',
    slotTime: candidate.training?.slotTime || '',
    classStartDate: candidate.training?.classStartDate || '',
    courseEndDate: candidate.training?.courseEndDate || '',
    stage: candidate.training?.stage || '',
    trainingStageDate: candidate.training?.trainingStageDate || '',
    projectsStageDate: candidate.training?.projectsStageDate || '',
    pocStageDate: candidate.training?.pocStageDate || '',
    profileCreatedStageDate: candidate.training?.profileCreatedStageDate || '',
    // Education
    sslc: candidate.education?.sslc || '',
    hsc: candidate.education?.hsc || '',
    ugDegreeCertificate: candidate.education?.ugDegree || '',
    ugConsolidatedMarksheet: candidate.education?.ugMarksheet || '',
    ugProvisionalCertificate: candidate.education?.ugProvisional || '',
    pgDegreeCertificate: candidate.education?.pgDegree || '',
    // Documents
    eAadhar: candidate.documents?.eAadhar || '',
    panCard: candidate.documents?.panCard || '',
    photo: candidate.documents?.photo || '',
    passport: candidate.documents?.passport || '',
    // Contacts
    fatherName: candidate.contacts?.father?.name || '',
    fatherPhone: candidate.contacts?.father?.phone || '',
    motherName: candidate.contacts?.mother?.name || '',
    motherPhone: candidate.contacts?.mother?.phone || '',
    spouseName: candidate.contacts?.spouse?.name || '',
    spousePhone: candidate.contacts?.spouse?.phone || '',
    // Addresses
    permanentAddress: candidate.addresses?.permanent || '',
    currentAddress: candidate.addresses?.current || '',
    // Agreement fields
    entryAgreementSigned: candidate.agreements?.entry?.signed || false,
    entryAgreementSignedDate: candidate.agreements?.entry?.signedDate || '',
    entryAgreementDoc: candidate.agreements?.entry?.document || '',
    jobOfferAgreementSigned: candidate.agreements?.jobOffer?.signed || false,
    jobOfferAgreementSignedDate: candidate.agreements?.jobOffer?.signedDate || '',
    jobOfferAgreementDoc: candidate.agreements?.jobOffer?.document || '',
    exitAgreementSigned: candidate.agreements?.exit?.signed || false,
    exitAgreementSignedDate: candidate.agreements?.exit?.signedDate || '',
    exitAgreementDoc: candidate.agreements?.exit?.document || '',
    // Receipt fields
    entryReceiptCreated: candidate.receipts?.entry?.created || false,
    entryReceiptCreatedDate: candidate.receipts?.entry?.createdDate || '',
    entryReceiptDoc: candidate.receipts?.entry?.document || '',
    jobOfferReceiptCreated: candidate.receipts?.jobOffer?.created || false,
    jobOfferReceiptCreatedDate: candidate.receipts?.jobOffer?.createdDate || '',
    jobOfferReceiptDoc: candidate.receipts?.jobOffer?.document || '',
    exitReceiptCreated: candidate.receipts?.exit?.created || false,
    exitReceiptCreatedDate: candidate.receipts?.exit?.createdDate || '',
    exitReceiptDoc: candidate.receipts?.exit?.document || '',
    // Nested arrays
    profiles: Array.isArray(candidate.profiles) ? candidate.profiles : [],
    interviews: Array.isArray(candidate.interviews) ? candidate.interviews : [],
    offers: Array.isArray(candidate.offers) ? candidate.offers : [],
    // Add more as needed for your form fields
  };
}

const DetailUserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { success: showSuccessToast } = useToast();

  const candidate = useSelector(selectSelectedCandidate);
  const loading = useSelector(selectCandidatesLoading);
  const error = useSelector(selectCandidatesError);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues,
    mode: 'onSubmit',
  });

  // Profile Status Field Array
  const {
    fields: profileStatusFields,
    append: appendProfile,
    remove: removeProfile,
  } = useFieldArray({
    control,
    name: "profiles",
  });

  // Interview Details Field Array
  const {
    fields: interviewDetailsFields,
    append: appendInterviewDetails,
    remove: removeInterviewDetails,
  } = useFieldArray({
    control,
    name: "interviews",
  });

  // Offer Details Field Array
  const {
    fields: offerFields,
    append: appendOffer,
    remove: removeOffer,
  } = useFieldArray({
    control,
    name: "offers",
  });

  // Watch interviews for dynamic updates
  const watchInterviews = useWatch({
    control,
    name: "interviews",
  });

  // Fetch all participants from Redux
  const participants = useSelector(selectParticipants);
  const participantsLoading = useSelector(selectParticipantsLoading);

  // Fetch participants on mount if not already loaded
  useEffect(() => {
    if (!participants || participants.length === 0) {
      dispatch(fetchParticipants());
    }
  }, [dispatch, participants]);

  // Filter proxies
  const proxyList = (participants || []).filter(
    (p) => (p.role === 'proxy' || p.role === 'Proxy') && p.status === 'active'
  );

  // Fetch candidate on mount
  useEffect(() => {
    if (id) dispatch(fetchCandidateById(id));
  }, [id, dispatch]);

  // Reset form when candidate data is loaded
  useEffect(() => {
    if (candidate) {
      const flat = flattenCandidateData(candidate);
      console.log('Flattened candidate for form:', flat);
      reset({ ...defaultValues, ...flat });
    }
  }, [candidate, reset]);

  // Watch for successful update and navigate
  const prevLoadingRef = React.useRef();
  useEffect(() => {
    prevLoadingRef.current = loading;
  }, [loading]);
  useEffect(() => {
    if (prevLoadingRef.current && !loading && !error) {
      showSuccessToast('Candidate updated successfully!');
      navigate('/dashboard');
    }
  }, [loading, error, navigate, showSuccessToast]);

  const onSubmit = (data) => {
    if (id) {
      const transformedData = transformCandidateFormData(data);
      // Always include candidateId
      transformedData.candidateId = id;
      // Remove empty strings recursively
      const cleanedData = removeEmptyStrings(transformedData);
      dispatch(updateCandidateById({ candidateId: id, candidateData: cleanedData }));
    }
  };

  const handleReset = () => {
    reset(candidate ? { ...defaultValues, ...candidate } : defaultValues);
    showSuccessToast('Form has been reset');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const status = watch("status");

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Candidate Details
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage candidate information and progress
              </p>
            </div>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <FormSection title="Basic Information" icon={User}>
            <div>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    placeholder="Full Name"
                    icon={User}
                    error={errors.fullName}
                  />
                )}
              />
              <ErrorMessage error={errors.fullName} />
            </div>
            <div>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    type="email"
                    placeholder="Email Address"
                    icon={Mail}
                    error={errors.email}
                  />
                )}
              />
              <ErrorMessage error={errors.email} />
            </div>
            <div>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    type="tel"
                    placeholder="Phone Number"
                    icon={Phone}
                    error={errors.phone}
                  />
                )}
              />
              <ErrorMessage error={errors.phone} />
            </div>
            <div>
              <Controller
                name="referredBy"
                control={control}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    placeholder="Referred By"
                    icon={Users}
                    error={errors.referredBy}
                  />
                )}
              />
              <ErrorMessage error={errors.referredBy} />
            </div>
          </FormSection>

          {/* Training Details */}
          <FormSection title="Training Details" icon={BookOpen}>
            <div>
              <Controller
                name="trainerName"
                control={control}
                render={({ field }) => (
                  <FloatingLabelSelect
                    field={field}
                    placeholder="Select Trainer"
                    icon={User}
                    error={errors.trainerName}
                  >
                    {[
                      { name: "Trainer 1", empId: "T001" },
                      { name: "Trainer 2", empId: "T002" },
                      { name: "Trainer 3", empId: "T003" },
                    ].map((trainer, i) => (
                      <option key={i} value={trainer.name}>
                        {trainer.name} ({trainer.empId})
                      </option>
                    ))}
                  </FloatingLabelSelect>
                )}
              />
              <ErrorMessage error={errors.trainerName} />
            </div>

            <div>
              <Controller
                name="slotTime"
                control={control}
                render={({ field }) => (
                  <FloatingLabelSelect
                    field={field}
                    placeholder="Select Time Slot"
                    icon={Calendar}
                    error={errors.slotTime}
                  >
                    {Array.from({ length: 13 }, (_, i) => {
                      const hour = i + 9;
                      const time = hour <= 12 ? `${hour}AM` : `${hour - 12}PM`;
                      const display = hour === 12 ? '12PM' : time;
                      return (
                        <option key={hour} value={display}>
                          {display}
                        </option>
                      );
                    })}
                  </FloatingLabelSelect>
                )}
              />
              <ErrorMessage error={errors.slotTime} />
            </div>

            <div>
              <Controller
                name="classStartDate"
                control={control}
                rules={{
                  required: "Class start date is required",
                }}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={{
                      ...field,
                      value: field.value ? new Date(field.value).toISOString().split("T")[0] : "",
                      onChange: (e) => {
                        const startDate = new Date(e.target.value);
                        field.onChange(startDate);
                        
                        // Auto-calculate course end date based on course type from candidate data
                        const courseType = candidate?.course;
                        if (courseType && startDate && !isNaN(startDate.getTime())) {
                          let endDate;
                          if (courseType === "software_development") {
                            endDate = new Date(startDate);
                            endDate.setMonth(endDate.getMonth() + 6);
                          } else if (courseType === "software_testing") {
                            endDate = new Date(startDate);
                            endDate.setMonth(endDate.getMonth() + 4);
                          }
                          // Update course end date field if we have a valid end date
                          if (endDate && !isNaN(endDate.getTime())) {
                            setValue("courseEndDate", endDate);
                          }
                        }
                      }
                    }}
                    type="date"
                    placeholder="Class Start Date"
                    icon={Calendar}
                    error={errors.classStartDate}
                  />
                )}
              />
              <ErrorMessage error={errors.classStartDate} />
            </div>

            <div>
              <Controller
                name="courseEndDate"
                control={control}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={{
                      ...field,
                      value: field.value ? new Date(field.value).toISOString().split("T")[0] : "",
                      onChange: (e) => field.onChange(new Date(e.target.value))
                    }}
                    type="date"
                    placeholder="Course End Date"
                    icon={Calendar}
                    error={errors.courseEndDate}
                  />
                )}
              />
              <ErrorMessage error={errors.courseEndDate} />
            </div>
          </FormSection>

          {/* Candidate Status */}
          <FormSection title="Candidate Status" icon={User}>
            <div>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FloatingLabelSelect
                    field={field}
                    placeholder="Account Status"
                    icon={Award}
                    error={errors.status}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="closed">Closed</option>
                    <option value="completed">Completed</option>
                  </FloatingLabelSelect>
                )}
              />
              <ErrorMessage error={errors.status} />
            </div>

            {status === 'inactive' && (
              <>
              <div>
                <Controller
                  name="inActiveDate"
                  control={control}
                    rules={{
                      required: "Inactive date is required",
                    }}
                  render={({ field }) => (
                      <FloatingLabelInput
                        field={{
                          ...field,
                          value: field.value ? new Date(field.value).toISOString().split("T")[0] : "",
                          onChange: (e) => field.onChange(new Date(e.target.value))
                        }}
                        type="date"
                        placeholder="Inactive Date"
                        icon={Calendar}
                        error={errors.inActiveDate}
                      />
                    )}
                  />
                  <ErrorMessage error={errors.inActiveDate} />
                </div>

                <div>
                <Controller
                  name="inActiveReason"
                  control={control}
                  render={({ field }) => (
                      <FloatingLabelSelect
                        field={field}
                        placeholder="Select Reason"
                        icon={AlertCircle}
                        error={errors.inActiveReason}
                      >
                      <option value="left_training">Left Training</option>
                      <option value="health_issues">Health Issues</option>
                      <option value="financial_issues">Financial Issues</option>
                      <option value="got_other_job">Got Another Job</option>
                      <option value="personal_reasons">Personal Reasons</option>
                      <option value="other">Other</option>
                      </FloatingLabelSelect>
                    )}
                  />
                  <ErrorMessage error={errors.inActiveReason} />
                </div>

                {watch("inActiveReason") === "other" && (
                  <div className="lg:col-span-2">
                  <Controller
                    name="inActiveNotes"
                    control={control}
                    render={({ field }) => (
                        <FloatingLabelTextArea
                          field={field}
                          placeholder="Additional Notes"
                          error={errors.inActiveNotes}
                        />
                      )}
                    />
                    <ErrorMessage error={errors.inActiveNotes} />
              </div>
            )}
              </>
            )}
          </FormSection>

          {/* Personal Documents */}
          <FormSection title="Personal Documents" icon={User}>
            <div>
          <Controller
            name="eAadhar"
            control={control}
            render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    placeholder="Aadhaar Card Link"
                    icon={FileText}
                    error={errors.eAadhar}
                  />
                )}
              />
              <ErrorMessage error={errors.eAadhar} />
            </div>

            <div>
          <Controller
            name="panCard"
            control={control}
            render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    placeholder="PAN Card Link"
                    icon={FileText}
                    error={errors.panCard}
                  />
                )}
              />
              <ErrorMessage error={errors.panCard} />
            </div>

            <div>
          <Controller
            name="photo"
            control={control}
            render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    placeholder="Passport Photo Link"
                    icon={FileText}
                    error={errors.photo}
                  />
                )}
              />
              <ErrorMessage error={errors.photo} />
            </div>
          </FormSection>

          {/* Educational Documents */}
          <FormSection title="Educational Documents" icon={GraduationCap}>
            <div>
          <Controller
            name="sslc"
            control={control}
            render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    placeholder="SSLC Certificate Link"
                    icon={FileText}
                    error={errors.sslc}
                  />
                )}
              />
              <ErrorMessage error={errors.sslc} />
            </div>

            <div>
          <Controller
            name="hsc"
            control={control}
            render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    placeholder="HSC Certificate Link"
                    icon={FileText}
                    error={errors.hsc}
                  />
                )}
              />
              <ErrorMessage error={errors.hsc} />
            </div>

            <div>
          <Controller
            name="ugDegreeCertificate"
            control={control}
            render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    placeholder="UG Degree Certificate Link"
                    icon={FileText}
                    error={errors.ugDegreeCertificate}
                  />
                )}
              />
              <ErrorMessage error={errors.ugDegreeCertificate} />
            </div>

            <div>
          <Controller
            name="ugConsolidatedMarksheet"
            control={control}
            render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    placeholder="UG Consolidated Marksheet Link"
                    icon={FileText}
                    error={errors.ugConsolidatedMarksheet}
                  />
                )}
              />
              <ErrorMessage error={errors.ugConsolidatedMarksheet} />
            </div>

            <div>
          <Controller
            name="ugProvisionalCertificate"
            control={control}
            render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    placeholder="UG Provisional Certificate Link"
                    icon={FileText}
                    error={errors.ugProvisionalCertificate}
                  />
                )}
              />
              <ErrorMessage error={errors.ugProvisionalCertificate} />
            </div>

            <div>
          <Controller
            name="pgDegreeCertificate"
            control={control}
            render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    placeholder="PG Degree Certificate Link"
                    icon={FileText}
                    error={errors.pgDegreeCertificate}
                  />
                )}
              />
              <ErrorMessage error={errors.pgDegreeCertificate} />
            </div>
          </FormSection>

          {/* Referral Information */}
          <FormSection title="Referral Information" icon={Users}>
            <div className="lg:col-span-2">
          <Controller
                name="referredBy"
            control={control}
            render={({ field }) => (
                  <FloatingLabelSelect
                    field={field}
                    placeholder="Select Referrer"
                    icon={Users}
                    error={errors.referredBy}
                  >
                    {[
                      { name: "Referrer 1", empId: "R001" },
                      { name: "Referrer 2", empId: "R002" },
                      { name: "Referrer 3", empId: "R003" },
                      { name: "Referrer 4", empId: "R004" },
                      { name: "Referrer 5", empId: "R005" },
                    ].map((referrer, i) => (
                      <option key={i} value={referrer.name}>
                        {referrer.name} ({referrer.empId})
                      </option>
                    ))}
                  </FloatingLabelSelect>
                )}
              />
              <ErrorMessage error={errors.referredBy} />
            </div>
          </FormSection>

          {/* Stage Management */}
          <FormSection title="Stage Management" icon={Award}>
            <div className="lg:col-span-2">
                      <Controller
                name="stage"
                        control={control}
                        render={({ field }) => (
                  <FloatingLabelSelect
                    field={field}
                    placeholder="Current Stage"
                    icon={Award}
                    error={errors.stage}
                  >
                    <option value="training">Training (Ongoing Classes)</option>
                    <option value="poc">POC (Proof of Concept)</option>
                    <option value="projects">Projects (Ongoing Projects)</option>
                    <option value="profileCreated">Profile Created (Ready for Placement)</option>
                  </FloatingLabelSelect>
                )}
              />
              <ErrorMessage error={errors.stage} />
                    </div>

            <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {['training', 'poc', 'projects', 'profileCreated'].includes(watch("stage")) && (
                <div>
                        <Controller
                    name="trainingStageDate"
                          control={control}
                    rules={{
                      validate: (value) => {
                        const classStart = new Date(watch("classStartDate"));
                        const trainingStage = new Date(value);
                        if (!value) return "Training Stage Date is required";
                        if (isNaN(trainingStage.getTime()) || isNaN(classStart.getTime())) return true;
                        return trainingStage >= classStart || "Training Stage Date must be on or after Class Start Date";
                      },
                    }}
                    render={({ field }) => {
                      return (
                        <FloatingLabelInput
                          field={{
                            ...field,
                            value: field.value && new Date(field.value).toString() !== "Invalid Date"
                              ? new Date(field.value).toISOString().split("T")[0]
                              : "",
                            onChange: (e) => field.onChange(new Date(e.target.value))
                          }}
                          type="date"
                          placeholder="Training Stage Date"
                          icon={Calendar}
                          error={errors.trainingStageDate}
                        />
                      );
                    }}
                  />
                  <ErrorMessage error={errors.trainingStageDate} />
                          </div>
                        )}

              {['poc', 'projects', 'profileCreated'].includes(watch("stage")) && (
                <div>
                        <Controller
                    name="pocStageDate"
                          control={control}
                    rules={{
                      validate: (value) => {
                        const trainingStageDate = new Date(watch("trainingStageDate"));
                        const pocStage = new Date(value);
                        if (!value) return "POC Stage Date is required";
                        if (isNaN(pocStage.getTime()) || isNaN(trainingStageDate.getTime())) return true;
                        return pocStage >= trainingStageDate || "POC Stage Date must be on or after Training Stage Date";
                      },
                    }}
                    render={({ field }) => {
                      return (
                        <FloatingLabelInput
                          field={{
                            ...field,
                            value: field.value && new Date(field.value).toString() !== "Invalid Date"
                              ? new Date(field.value).toISOString().split("T")[0]
                              : "",
                            onChange: (e) => field.onChange(new Date(e.target.value))
                          }}
                          type="date"
                          placeholder="POC Stage Date"
                          icon={Calendar}
                          error={errors.pocStageDate}
                        />
                      );
                    }}
                  />
                  <ErrorMessage error={errors.pocStageDate} />
                    </div>
                    )}

              {['projects', 'profileCreated'].includes(watch("stage")) && (
                <div>
                        <Controller
                    name="projectsStageDate"
                        control={control}
                    rules={{
                      validate: (value) => {
                        const pocStageDate = new Date(watch("pocStageDate"));
                        const projectsStage = new Date(value);
                        if (!value) return "Projects Stage Date is required";
                        if (isNaN(projectsStage.getTime()) || isNaN(pocStageDate.getTime())) return true;
                        return projectsStage >= pocStageDate || "Projects Stage Date must be on or after POC Stage Date";
                      },
                    }}
                    render={({ field }) => {
                      return (
                        <FloatingLabelInput
                          field={{
                            ...field,
                            value: field.value && new Date(field.value).toString() !== "Invalid Date"
                              ? new Date(field.value).toISOString().split("T")[0]
                              : "",
                            onChange: (e) => field.onChange(new Date(e.target.value))
                          }}
                          type="date"
                          placeholder="Projects Stage Date"
                          icon={Calendar}
                          error={errors.projectsStageDate}
                        />
                      );
                    }}
                  />
                  <ErrorMessage error={errors.projectsStageDate} />
                          </div>
                        )}

              {watch("stage") === "profileCreated" && (
                <div>
                  <Controller
                    name="profileCreatedDate"
                    control={control}
                    rules={{
                      validate: (value) => {
                        const projectsStageDate = new Date(watch("projectsStageDate"));
                        const profileCreated = new Date(value);
                        if (!value) return "Profile Created Date is required";
                        if (isNaN(profileCreated.getTime()) || isNaN(projectsStageDate.getTime())) return true;
                        return profileCreated >= projectsStageDate || "Profile Created Date must be on or after Projects Stage Date";
                      },
                    }}
                    render={({ field }) => {
                      return (
                        <FloatingLabelInput
                          field={{
                            ...field,
                            value: field.value && new Date(field.value).toString() !== "Invalid Date"
                              ? new Date(field.value).toISOString().split("T")[0]
                              : "",
                            onChange: (e) => field.onChange(new Date(e.target.value))
                          }}
                          type="date"
                          placeholder="Profile Created Date"
                          icon={Calendar}
                          error={errors.stageUpdateDate}
                        />
                      );
                    }}
                  />
                  <ErrorMessage error={errors.stageUpdateDate} />
                    </div>
              )}
            </div>
          </FormSection>

          {/* Agreement Documents */}
          <FormSection title="Agreement Documents" icon={FileText}>
            <div className="lg:col-span-2 space-y-8">
              {[
                { label: "Entry Agreement", key: "entry" },
                { label: "Job Offer Agreement", key: "jobOffer" },
                { label: "Exit Agreement", key: "exit" },
              ].map((section) => {
                // Get Agreement Signed Date for previous sections
                const entryAgreementDate = watch('entryAgreementSignedDate');
                const jobOfferAgreementDate = watch('jobOfferAgreementSignedDate');
                
                // Get Receipt Created Date for previous sections
                const entryReceiptDate = watch('entryReceiptCreatedDate');
                const jobOfferReceiptDate = watch('jobOfferReceiptCreatedDate');

                // Calculate min date for Agreement Signed Date input
                let minAgreementDate = null;
                
                // For Job Offer, min date is Entry Agreement date
                if (section.key === 'jobOffer' && entryAgreementDate) {
                  minAgreementDate = new Date(entryAgreementDate);
                }

                // For Exit, min date is max of Entry and Job Offer dates
                if (section.key === 'exit') {
                  const entryDate = entryAgreementDate ? new Date(entryAgreementDate) : null;
                  const jobOfferDate = jobOfferAgreementDate ? new Date(jobOfferAgreementDate) : null;
                  
                  if (entryDate && (!minAgreementDate || entryDate > minAgreementDate)) {
                    minAgreementDate = entryDate;
                  }
                  if (jobOfferDate && (!minAgreementDate || jobOfferDate > minAgreementDate)) {
                    minAgreementDate = jobOfferDate;
                  }
                }

                // Calculate min date for Receipt Created Date input
                let minReceiptDate = null;

                // For Job Offer Receipt, min date is Entry Receipt date
                if (section.key === 'jobOffer' && entryReceiptDate) {
                  minReceiptDate = new Date(entryReceiptDate);
                }

                // For Exit Receipt, min date is max of Entry and Job Offer Receipt dates
                if (section.key === 'exit') {
                  const entryDate = entryReceiptDate ? new Date(entryReceiptDate) : null;
                  const jobOfferDate = jobOfferReceiptDate ? new Date(jobOfferReceiptDate) : null;
                  
                  if (entryDate && (!minReceiptDate || entryDate > minReceiptDate)) {
                    minReceiptDate = entryDate;
                  }
                  if (jobOfferDate && (!minReceiptDate || jobOfferDate > minReceiptDate)) {
                    minReceiptDate = jobOfferDate;
                  }
                }

                return (
                  <div key={section.key} className="space-y-6">
                    {/* Agreement Card Header */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-800 dark:text-white">{section.label}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Track agreement signing and document upload</p>
                        </div>
                      </div>
                      <Controller
                        name={`${section.key}AgreementSigned`}
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Signed</span>
                            <input
                              type="checkbox"
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-600 focus:ring-2"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          </div>
                        )}
                      />
                    </div>

                    {/* Agreement Details */}
                    {watch(`${section.key}AgreementSigned`) && (
                      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-lg">
                        <div className="mb-6">
                          <h5 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            {section.label} Details
                          </h5>
                          <div className="h-px bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <Controller
                              name={`${section.key}AgreementSignedDate`}
                              control={control}
                              rules={{
                                required: "Date is required",
                                validate: (value) => {
                                  if (!value) return "Date is required";
                                  const signedDate = new Date(value);
                                  if (isNaN(signedDate.getTime())) return "Invalid date";
                                  
                                  // For Job Offer, must be after Entry
                                  if (section.key === 'jobOffer' && entryAgreementDate) {
                                    const entryDate = new Date(entryAgreementDate);
                                    if (signedDate < entryDate) {
                                      return "Job Offer Agreement date must be on or after Entry Agreement date";
                                    }
                                  }
                                  
                                  // For Exit, must be after both Entry and Job Offer
                                  if (section.key === 'exit') {
                                    if (entryAgreementDate) {
                                      const entryDate = new Date(entryAgreementDate);
                                      if (signedDate < entryDate) {
                                        return "Exit Agreement date must be on or after Entry Agreement date";
                                      }
                                    }
                                    if (jobOfferAgreementDate) {
                                      const jobOfferDate = new Date(jobOfferAgreementDate);
                                      if (signedDate < jobOfferDate) {
                                        return "Exit Agreement date must be on or after Job Offer Agreement date";
                                      }
                                    }
                                  }
                                  
                                  return true;
                                },
                              }}
                              render={({ field }) => (
                                <FloatingLabelInput
                                  field={{
                                    ...field,
                                    value: field.value && new Date(field.value).toString() !== "Invalid Date"
                                      ? new Date(field.value).toISOString().split("T")[0]
                                      : "",
                                    onChange: (e) => field.onChange(new Date(e.target.value))
                                  }}
                                  type="date"
                                  placeholder="Agreement Date"
                                  icon={Calendar}
                                  error={errors[`${section.key}AgreementSignedDate`]}
                                  min={minAgreementDate ? minAgreementDate.toISOString().split('T')[0] : undefined}
                                />
                              )}
                            />
                            <ErrorMessage error={errors[`${section.key}AgreementSignedDate`]} />
                          </div>

                          <div>
                            <Controller
                              name={`${section.key}AgreementDoc`}
                              control={control}
                              render={({ field }) => (
                                <FloatingLabelInput
                                  field={field}
                                  placeholder="Agreement Document Link"
                                  icon={FileText}
                                  error={errors[`${section.key}AgreementDoc`]}
                                />
                              )}
                            />
                            <ErrorMessage error={errors[`${section.key}AgreementDoc`]} />
                          </div>
                        </div>

                        {/* Receipt Section */}
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                          <div className="mb-6">
                            <h6 className="text-md font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-blue-600" />
                              Receipt Information
                            </h6>
                            <div className="h-px bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <Controller
                                name={`${section.key}ReceiptCreatedDate`}
                                control={control}
                                rules={{
                                  validate: (value) => {
                                    if (!value) return true; // Optional field
                                    const receiptDate = new Date(value);
                                    if (isNaN(receiptDate.getTime())) return "Invalid date";
                                    
                                    // For Job Offer, must be after Entry
                                    if (section.key === 'jobOffer' && entryReceiptDate) {
                                      const entryDate = new Date(entryReceiptDate);
                                      if (receiptDate < entryDate) {
                                        return "Job Offer Receipt date must be on or after Entry Receipt date";
                                      }
                                    }
                                    
                                    // For Exit, must be after both Entry and Job Offer
                                    if (section.key === 'exit') {
                                      if (entryReceiptDate) {
                                        const entryDate = new Date(entryReceiptDate);
                                        if (receiptDate < entryDate) {
                                          return "Exit Receipt date must be on or after Entry Receipt date";
                                        }
                                      }
                                      if (jobOfferReceiptDate) {
                                        const jobOfferDate = new Date(jobOfferReceiptDate);
                                        if (receiptDate < jobOfferDate) {
                                          return "Exit Receipt date must be on or after Job Offer Receipt date";
                                        }
                                      }
                                    }
                                    
                                    return true;
                                  },
                                }}
                                render={({ field }) => (
                                  <FloatingLabelInput
                                    field={{
                                      ...field,
                                      value: field.value && new Date(field.value).toString() !== "Invalid Date"
                                        ? new Date(field.value).toISOString().split("T")[0]
                                        : "",
                                      onChange: (e) => field.onChange(new Date(e.target.value))
                                    }}
                                    type="date"
                                    placeholder="Receipt Date"
                                    icon={Calendar}
                                    error={errors[`${section.key}ReceiptCreatedDate`]}
                                    min={minReceiptDate ? minReceiptDate.toISOString().split('T')[0] : undefined}
                                  />
                                )}
                              />
                              <ErrorMessage error={errors[`${section.key}ReceiptCreatedDate`]} />
                            </div>

                            <div>
                              <Controller
                                name={`${section.key}ReceiptDoc`}
                                control={control}
                                render={({ field }) => (
                                  <FloatingLabelInput
                                    field={field}
                                    placeholder="Receipt Document Link"
                                    icon={FileText}
                                    error={errors[`${section.key}ReceiptDoc`]}
                                  />
                                )}
                              />
                              <ErrorMessage error={errors[`${section.key}ReceiptDoc`]} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </FormSection>

          {/* Profile Status */}
          <FormSection 
            title="Profile Status" 
            icon={Award}
            action={
              <button
                type="button"
                onClick={() => {
                  if (!(status === "closed" || status === "completed")) {
                    appendProfile({
                      videoShooted: false,
                      videoShootedDate: null,
                      modelCreated: false,
                      modelCreatedDate: null,
                      resumeCreated: false,
                      resumeCreatedDate: null,
                      profileCreated: false,
                      profileCreatedDate: null,
                    });
                  }
                }}
                disabled={status === "closed" || status === "completed"}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  status === "closed" || status === "completed"
                    ? "bg-gray-400 cursor-not-allowed text-gray-600"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Profile
              </button>
            }
          >
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Status Cards */}
              {profileStatusFields.map((item, index) => {
                const profilePath = `profiles[${index}]`;
                const currentWatch = watch(profilePath);

                return (
                  <div key={item.id} className="space-y-6">
                    {/* Profile Card Header */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-800 dark:text-white">Profile #{index + 1}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Development progress tracking</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProfile(index)}
                        disabled={status === "closed" || status === "completed"}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                          status === "closed" || status === "completed"
                            ? "bg-gray-400 cursor-not-allowed text-gray-600"
                            : "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 shadow-md hover:shadow-lg"
                        }`}
                      >
                        <Trash className="w-4 h-4" />
                        Remove
                      </button>
                    </div>

                    {/* Status Blocks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <StatusBlock
                        label="Video"
                        control={control}
                        watch={watch}
                        errors={errors}
                        checkboxName={`${profilePath}.videoShooted`}
                        dateName={`${profilePath}.videoShootedDate`}
                        dateLabel="Date Created"
                        // Video date should be on or after POC Stage Date
                        validateDate={(value) => {
                          const pocDate = new Date(watch("pocStageDate"));
                          const videoDate = new Date(value);
                          if (!value) return "Video shoot date is required";
                          if (isNaN(videoDate.getTime()) || isNaN(pocDate.getTime())) return true;
                          return (
                            videoDate >= pocDate ||
                            "Video shoot date must be on or after POC Stage Date"
                          );
                        }}
                        disabled={status === "closed" || status === "completed"}
                        getMinDate={() => watch("pocStageDate")}
                      />

                      <StatusBlock
                        label="Model"
                        control={control}
                        watch={watch}
                        errors={errors}
                        checkboxName={`${profilePath}.modelCreated`}
                        dateName={`${profilePath}.modelCreatedDate`}
                        dateLabel="Date Created"
                        // Model date should be on or after Video date
                        validateDate={(value) => {
                          const videoDate = new Date(currentWatch?.videoShootedDate);
                          const modelDate = new Date(value);
                          if (!value) return "Model Created Date is required";
                          if (isNaN(modelDate.getTime()) || isNaN(videoDate.getTime())) return true;
                          return (
                            modelDate >= videoDate ||
                            "Model Created Date must be on or after Video Shooted Date"
                          );
                        }}
                        disabled={status === "closed" || status === "completed"}
                        getMinDate={() => currentWatch?.videoShootedDate}
                      />

                      <StatusBlock
                        label="Resume"
                        control={control}
                        watch={watch}
                        errors={errors}
                        checkboxName={`${profilePath}.resumeCreated`}
                        dateName={`${profilePath}.resumeCreatedDate`}
                        dateLabel="Date Created"
                        // Resume date should be on or after Model date
                        validateDate={(value) => {
                          const modelDate = new Date(currentWatch?.modelCreatedDate);
                          const resumeDate = new Date(value);
                          if (!value) return "Resume Created Date is required";
                          if (isNaN(resumeDate.getTime()) || isNaN(modelDate.getTime())) return true;
                          return (
                            resumeDate >= modelDate ||
                            "Resume Created Date must be on or after Model Created Date"
                          );
                        }}
                        disabled={status === "closed" || status === "completed"}
                        getMinDate={() => currentWatch?.modelCreatedDate}
                      />

                      <StatusBlock
                        label="Profile"
                        control={control}
                        watch={watch}
                        errors={errors}
                        checkboxName={`${profilePath}.profileCreated`}
                        dateName={`${profilePath}.profileCreatedDate`}
                        dateLabel="Date Created"
                        // Profile date should be on or after Resume date
                        validateDate={(value) => {
                          const resumeDate = new Date(currentWatch?.resumeCreatedDate);
                          const profileDate = new Date(value);
                          if (!value) return "Profile Created Date is required";
                          if (isNaN(profileDate.getTime()) || isNaN(resumeDate.getTime())) return true;
                          return (
                            profileDate >= resumeDate ||
                            "Profile Created Date must be on or after Resume Created Date"
                          );
                        }}
                        disabled={status === "closed" || status === "completed"}
                        getMinDate={() => currentWatch?.resumeCreatedDate}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </FormSection>

          {/* Interview Details */}
          <FormSection 
            title="Interview Details" 
            icon={Briefcase}
            action={
              <button
                type="button"
                onClick={() => {
                  if (!(status === "closed" || status === "completed")) {
                    appendInterviewDetails({
                      domain: '',
                      interviewDateTime: null,
                      companyName: '',
                      interviewLevel: '',
                      proxyName: '',
                      hrName: '',
                      hrEmail: '',
                      hrPhone: '',
                      interviewerName: '',
                      status: '',
                      rescheduledDateTime: null,
                      statusRemarks: '',
                      result: '',
                      resultRemarks: ''
                    });
                  }
                }}
                disabled={status === "closed" || status === "completed"}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  status === "closed" || status === "completed"
                    ? "bg-gray-400 cursor-not-allowed text-gray-600"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Interview
              </button>
            }
          >
            <div className="lg:col-span-2 space-y-8">
              {/* Interview Cards */}
              <div className="space-y-8">
                {interviewDetailsFields.map((item, index) => (
                  <div key={item.id} className="space-y-6">
                    {/* Interview Card Header */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl">
                          <Building className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-800 dark:text-white">Interview #{index + 1}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {watchInterviews?.[index]?.companyName ? 
                              `${watchInterviews[index].companyName} - ${watchInterviews[index].interviewLevel || 'Level TBD'}` : 
                              'Interview details pending'
                            }
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeInterviewDetails(index)}
                        disabled={status === "closed" || status === "completed"}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                          status === "closed" || status === "completed"
                            ? "bg-gray-400 cursor-not-allowed text-gray-600"
                            : "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 shadow-md hover:shadow-lg"
                        }`}
                      >
                        <Trash className="w-4 h-4" />
                        Remove
                      </button>
                    </div>

                    {/* Interview Details */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-lg space-y-8">
                      {/* Basic Information */}
                      <div>
                        <div className="mb-6">
                          <h5 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                            <Building className="w-5 h-5 text-blue-600" />
                            Basic Information
                          </h5>
                          <div className="h-px bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div>
                            <Controller
                              name={`interviews.${index}.domain`}
                              control={control}
                              rules={{ required: "Domain is required" }}
                              render={({ field }) => (
                                <FloatingLabelInput
                                  field={field}
                                  placeholder="Enter Domain"
                                  icon={Building}
                                  error={errors?.interviews?.[index]?.domain}
                                  disabled={status === "closed" || status === "completed"}
                                />
                              )}
                            />
                            <ErrorMessage error={errors?.interviews?.[index]?.domain} />
        </div>

                          <div>
                      <Controller
                              name={`interviews.${index}.interviewDateTime`}
                        control={control}
                              rules={{
                                required: "Interview Date & Time is required",
                                validate: (value) => {
                                  if (!value) return "Interview Date & Time is required";

                                  const currentDate = new Date(value);
                                  const interviews = watch("interviews");

                                  if (!Array.isArray(interviews)) return true;

                                  // Level order priority list (from lowest to highest)
                                  const levelOrder = ["L1", "L2", "L3", "L4", "L5", "client"];

                                  const currentLevel = interviews[index]?.interviewLevel;
                                  const currentLevelIndex = levelOrder.indexOf(currentLevel);

                                  // Validate against all lower levels (they must be earlier)
                                  for (let i = 0; i < interviews.length; i++) {
                                    if (i === index) continue;
                                    const other = interviews[i];
                                    const otherLevelIndex = levelOrder.indexOf(other.interviewLevel);

                                    if (
                                      otherLevelIndex !== -1 &&
                                      currentLevelIndex !== -1 &&
                                      otherLevelIndex < currentLevelIndex &&
                                      other.interviewDateTime
                                    ) {
                                      const otherDate = new Date(other.interviewDateTime);
                                      if (currentDate <= otherDate) {
                                        return `Interview for ${currentLevel} must be after ${other.interviewLevel}`;
                                      }
                                    }
                                  }

                                  return true;
                                },
                              }}
                              render={({ field }) => {
                                const formatDateTimeLocal = (date) => {
                                  if (!date) return "";
                                  const d = new Date(date);
                                  const year = d.getFullYear();
                                  const month = String(d.getMonth() + 1).padStart(2, "0");
                                  const day = String(d.getDate()).padStart(2, "0");
                                  const hours = String(d.getHours()).padStart(2, "0");
                                  const minutes = String(d.getMinutes()).padStart(2, "0");
                                  return `${year}-${month}-${day}T${hours}:${minutes}`;
                                };

                                return (
                                  <FloatingLabelInput
                                    field={{
                                      ...field,
                                      value: formatDateTimeLocal(field.value),
                                      onChange: (e) => field.onChange(e.target.value)
                                    }}
                                    type="datetime-local"
                                    placeholder="Select Date & Time"
                                    icon={Calendar}
                                    error={errors?.interviews?.[index]?.interviewDateTime}
                                    disabled={status === "closed" || status === "completed"}
                                    min={formatDateTimeLocal(new Date())}
                                  />
                                );
                              }}
                            />
                            <ErrorMessage error={errors?.interviews?.[index]?.interviewDateTime} />
                          </div>

                          <div>
                            <Controller
                              name={`interviews.${index}.companyName`}
                              control={control}
                              rules={{ required: "Company Name is required" }}
                        render={({ field }) => (
                                <FloatingLabelInput
                                  field={field}
                                  placeholder="Enter Company Name"
                                  icon={Building}
                                  error={errors?.interviews?.[index]?.companyName}
                                  disabled={status === "closed" || status === "completed"}
                                />
                              )}
                            />
                            <ErrorMessage error={errors?.interviews?.[index]?.companyName} />
                          </div>
                        </div>
                      </div>

                      {/* Interview Level and Participants */}
                      <div>
                        <div className="mb-6">
                          <h5 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                            <Award className="w-5 h-5 text-blue-600" />
                            Interview Level & Participants
                          </h5>
                          <div className="h-px bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div>
                            <Controller
                              name={`interviews.${index}.interviewLevel`}
                              control={control}
                              rules={{ required: "Interview level required" }}
                              render={({ field }) => (
                                <FloatingLabelSelect
                                  field={field}
                                  placeholder="Select Level"
                                  icon={Award}
                                  error={errors?.interviews?.[index]?.interviewLevel}
                                  disabled={status === "closed" || status === "completed"}
                                >
                                  <option value="L1">L1</option>
                                  <option value="L2">L2</option>
                                  <option value="L3">L3</option>
                                  <option value="L4">L4</option>
                                  <option value="L5">L5</option>
                                  <option value="client">Client</option>
                                </FloatingLabelSelect>
                              )}
                            />
                            <ErrorMessage error={errors?.interviews?.[index]?.interviewLevel} />
                    </div>

                          <div>
                        <Controller
                              name={`interviews.${index}.proxyName`}
                          control={control}
                              rules={{ required: "Proxy Name required" }}
                          render={({ field }) => (
                                <FloatingLabelSelect
                                  field={field}
                                  placeholder="Select Proxy"
                                  icon={Users}
                                  error={errors?.interviews?.[index]?.proxyName}
                                  disabled={status === "closed" || status === "completed"}
                                >
                                  {proxyList.map((proxy, i) => (
                                    <option key={i} value={proxy.name}>
                                      {proxy.name} ({proxy.empId})
                                    </option>
                                  ))}
                                </FloatingLabelSelect>
                              )}
                            />
                            <ErrorMessage error={errors?.interviews?.[index]?.proxyName} />
                          </div>

                          <div>
                        <Controller
                              name={`interviews.${index}.interviewerName`}
                          control={control}
                              rules={{ required: "Interviewer Name required" }}
                          render={({ field }) => (
                                <FloatingLabelInput
                                  field={field}
                                  placeholder="Enter Interviewer Name"
                                  icon={User}
                                  error={errors?.interviews?.[index]?.interviewerName}
                                  disabled={status === "closed" || status === "completed"}
                                />
                              )}
                            />
                            <ErrorMessage error={errors?.interviews?.[index]?.interviewerName} />
                      </div>
                        </div>
                      </div>

                      {/* HR Contact Information */}
                      <div>
                        <div className="mb-6">
                          <h5 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                            <User className="w-5 h-5 text-blue-600" />
                            HR Contact Information
                          </h5>
                          <div className="h-px bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div>
                            <Controller
                              name={`interviews.${index}.hrName`}
                              control={control}
                              rules={{
                                required: "HR Name required",
                                pattern: {
                                  value: /^[A-Za-z\s]+$/,
                                  message: "Name should contain letters only"
                                }
                              }}
                              render={({ field }) => (
                                <FloatingLabelInput
                                  field={field}
                                  placeholder="Enter HR Name"
                                  icon={User}
                                  error={errors?.interviews?.[index]?.hrName}
                                  disabled={status === "closed" || status === "completed"}
                                />
                              )}
                            />
                            <ErrorMessage error={errors?.interviews?.[index]?.hrName} />
                  </div>

                          <div>
                      <Controller
                              name={`interviews.${index}.hrEmail`}
                        control={control}
                              rules={{
                                required: "HR Email required",
                                pattern: {
                                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                  message: "Enter a valid email address",
                                },
                              }}
                        render={({ field }) => (
                                <FloatingLabelInput
                                  field={field}
                                  type="email"
                                  placeholder="Enter HR Email"
                                  icon={Mail}
                                  error={errors?.interviews?.[index]?.hrEmail}
                                  disabled={status === "closed" || status === "completed"}
                                />
                              )}
                            />
                            <ErrorMessage error={errors?.interviews?.[index]?.hrEmail} />
                          </div>

                          <div>
                            <Controller
                              name={`interviews.${index}.hrPhone`}
                              control={control}
                              rules={{
                                required: "HR Phone required",
                                pattern: {
                                  value: /^[6-9]\d{9}$/,
                                  message: "Enter a valid 10-digit phone number starting with 6-9",
                                },
                              }}
                              render={({ field }) => (
                                <FloatingLabelInput
                                  field={field}
                                  type="tel"
                                  placeholder="Enter HR Phone"
                                  icon={Phone}
                                  error={errors?.interviews?.[index]?.hrPhone}
                                  disabled={status === "closed" || status === "completed"}
                                />
                              )}
                            />
                            <ErrorMessage error={errors?.interviews?.[index]?.hrPhone} />
                    </div>
                        </div>
                      </div>

                      {/* Interview Status */}
                      <div>
                        <div className="mb-6">
                          <h5 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            Interview Status
                          </h5>
                          <div className="h-px bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                        <Controller
                              name={`interviews.${index}.status`}
                          control={control}
                              rules={{ required: "Status required" }}
                          render={({ field }) => (
                                <FloatingLabelSelect
                                  field={field}
                                  placeholder="Select Status"
                                  icon={Clock}
                                  error={errors?.interviews?.[index]?.status}
                                  disabled={status === "closed" || status === "completed"}
                                >
                                  <option value="scheduled">Scheduled</option>
                                  <option value="rescheduled">Rescheduled</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </FloatingLabelSelect>
                              )}
                            />
                            <ErrorMessage error={errors?.interviews?.[index]?.status} />
                          </div>

                          <div>
                        <Controller
                              name={`interviews.${index}.statusRemarks`}
                          control={control}
                              rules={{ required: "Status Remarks required" }}
                          render={({ field }) => (
                                <FloatingLabelTextArea
                                  field={field}
                                  placeholder="Enter Status Remarks"
                                  error={errors?.interviews?.[index]?.statusRemarks}
                                  disabled={status === "closed" || status === "completed"}
                                  rows={2}
                                />
                              )}
                            />
                            <ErrorMessage error={errors?.interviews?.[index]?.statusRemarks} />
                      </div>
                        </div>
                      </div>

                      {/* Rescheduled Date (if status is rescheduled) */}
                      {watchInterviews[index]?.status === 'rescheduled' && (
                        <div>
                          <div className="mb-6">
                            <h5 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                              <Calendar className="w-5 h-5 text-blue-600" />
                              Rescheduled Information
                            </h5>
                            <div className="h-px bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                          </div>
                          <div>
                            <Controller
                              name={`interviews.${index}.rescheduledDateTime`}
                              control={control}
                              rules={{ required: "Reschedule date&time required" }}
                              render={({ field }) => (
                                <FloatingLabelInput
                                  field={{
                                    ...field,
                                    value: field.value ? new Date(field.value).toISOString().slice(0, 16) : '',
                                    onChange: (e) => field.onChange(new Date(e.target.value))
                                  }}
                                  type="datetime-local"
                                  placeholder="Select Rescheduled Date & Time"
                                  icon={Calendar}
                                  error={errors?.interviews?.[index]?.rescheduledDateTime}
                                  disabled={status === "closed" || status === "completed"}
                                />
                              )}
                            />
                            <ErrorMessage error={errors?.interviews?.[index]?.rescheduledDateTime} />
                  </div>
                </div>
                      )}

                      {/* Interview Results (only if not L1) */}
                      {watchInterviews?.[index]?.interviewLevel !== 'L1' && (
                        <div>
                          <div className="mb-6">
                            <h5 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                              <Award className="w-5 h-5 text-blue-600" />
                              Interview Results
                            </h5>
                            <div className="h-px bg-gradient-to-r from-blue-600/20 to-transparent"></div>
              </div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <Controller
                                name={`interviews.${index}.result`}
                                control={control}
                                rules={{ required: 'Result is required' }}
                                render={({ field }) => (
                                  <FloatingLabelSelect
                                    field={field}
                                    placeholder="Select Result"
                                    icon={Award}
                                    error={errors?.interviews?.[index]?.result}
                                    disabled={status === "closed" || status === "completed"}
                                  >
                                    <option value="moveToNext">Move to Next</option>
                                    <option value="positionHold">Position Hold</option>
                                    <option value="rejected">Rejected</option>
                                  </FloatingLabelSelect>
                                )}
                              />
                              <ErrorMessage error={errors?.interviews?.[index]?.result} />
                            </div>

                            <div>
          <Controller
                                name={`interviews.${index}.resultRemarks`}
            control={control}
                                rules={{ required: 'Result Remarks are required' }}
            render={({ field }) => (
                                  <FloatingLabelTextArea
                                    field={field}
                                    placeholder="Enter Result Remarks"
                                    error={errors?.interviews?.[index]?.resultRemarks}
                                    disabled={status === "closed" || status === "completed"}
                                    rows={2}
                                  />
                                )}
                              />
                              <ErrorMessage error={errors?.interviews?.[index]?.resultRemarks} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormSection>

          {/* Offer Details */}
          <FormSection 
            title="Offer Details" 
            icon={Award}
            action={
              <button
                type="button"
                onClick={() => {
                  if (!(status === "closed" || status === "completed")) {
                    appendOffer({
                      offerLetterReceived: true,
                      offerLetterDoc: '',
                      offerLetterReceivedDate: '',
                      companyName: '',
                      companyAddress: '',
                      hrName: '',
                      hrPhone: '',
                      hrEmail: '',
                      onboarded: false,
                      onboardedDate: '',
                    });
                  }
                }}
                disabled={status === "closed" || status === "completed"}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  status === "closed" || status === "completed"
                    ? "bg-gray-400 cursor-not-allowed text-gray-600"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Offer
              </button>
            }
          >
            <div className="lg:col-span-2 space-y-8">
              {/* Offer Cards */}
              <div className="space-y-8">
                {offerFields.map((item, index) => {
                  const offerReceivedDate = watch(`offers.${index}.offerLetterReceivedDate`);
                  const onboarded = watch(`offers.${index}.onboarded`);
                  const profileDate = watch('profileCreatedDate');

                  // Format dates to YYYY-MM-DD for min attribute
                  const minOfferDate = profileDate
                    ? new Date(profileDate).toISOString().split('T')[0]
                    : undefined;
                  const minOnboardDate = offerReceivedDate
                    ? new Date(offerReceivedDate).toISOString().split('T')[0]
                    : undefined;

                  return (
                    <div key={item.id} className="space-y-6">
                      {/* Offer Card Header */}
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-xl">
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-800 dark:text-white">Offer #{index + 1}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {watch(`offers.${index}.companyName`) ? 
                                `${watch(`offers.${index}.companyName`)} - ${onboarded ? 'Onboarded' : 'Pending Onboarding'}` : 
                                'Offer details pending'
                              }
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeOffer(index)}
                          disabled={status === "closed" || status === "completed"}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                            status === "closed" || status === "completed"
                              ? "bg-gray-400 cursor-not-allowed text-gray-600"
                              : "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 shadow-md hover:shadow-lg"
                          }`}
                        >
                          <Trash className="w-4 h-4" />
                          Remove
                        </button>
                      </div>

                      {/* Offer Details */}
                      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-lg space-y-8">
                        {/* Offer Letter Information */}
                        <div>
                          <div className="mb-6">
                            <h5 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                              <FileText className="w-5 h-5 text-blue-600" />
                              Offer Letter Information
                            </h5>
                            <div className="h-px bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                          </div>
                          <div className="space-y-6">
                            {/* Offer Letter Received Checkbox */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                              <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                                <span className="text-base font-medium text-gray-700 dark:text-gray-300">Offer Letter Received</span>
                              </div>
                              <Controller
                                name={`offers.${index}.offerLetterReceived`}
                                control={control}
                                render={({ field }) => (
                                  <input
                                    type="checkbox"
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-600 focus:ring-2"
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                    disabled={status === "closed" || status === "completed"}
                                  />
                                )}
                              />
        </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div>
                                <Controller
                                  name={`offers.${index}.offerLetterDoc`}
                                  control={control}
                                  render={({ field }) => (
                                    <FloatingLabelInput
                                      field={field}
                                      placeholder="Enter Offer Letter Document Link"
                                      icon={FileText}
                                      error={errors?.offers?.[index]?.offerLetterDoc}
                                      disabled={status === "closed" || status === "completed"}
                                    />
                                  )}
                                />
                                <ErrorMessage error={errors?.offers?.[index]?.offerLetterDoc} />
                </div>

                              <div>
                                <Controller
                                  name={`offers.${index}.offerLetterReceivedDate`}
                                  control={control}
                                  rules={{
                                    required: "Offer Letter Received Date is required",
                                    validate: (value) => {
                                      if (!value) return "Offer Letter Received Date is required";
                                      if (!profileDate) return true;
                                      const offerDate = new Date(value);
                                      const profDate = new Date(profileDate);
                                      if (isNaN(offerDate.getTime()) || isNaN(profDate.getTime())) return true;
                                      return (
                                        offerDate >= profDate ||
                                        "Offer Letter Received Date must be on or after Profile Created Date"
                                      );
                                    },
                                  }}
                                  render={({ field }) => (
                                    <FloatingLabelInput
                                      field={{
                                        ...field,
                                        value: field.value ? new Date(field.value).toISOString().split('T')[0] : '',
                                        onChange: (e) => field.onChange(new Date(e.target.value))
                                      }}
                                      type="date"
                                      placeholder="Select Offer Received Date"
                                      icon={Calendar}
                                      error={errors?.offers?.[index]?.offerLetterReceivedDate}
                                      disabled={status === "closed" || status === "completed"}
                                      min={minOfferDate}
                                    />
                                  )}
                                />
                                <ErrorMessage error={errors?.offers?.[index]?.offerLetterReceivedDate} />
                </div>
                </div>
                </div>
            </div>

                        {/* HR Contact Information */}
                        <div>
                          <div className="mb-6">
                                                      <h5 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                            <User className="w-5 h-5 text-blue-600" />
                            HR Contact Information
                          </h5>
                          <div className="h-px bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <Controller
                                name={`offers.${index}.companyName`}
                                control={control}
                                render={({ field }) => (
                                  <FloatingLabelInput
                                    field={field}
                                    placeholder="Enter Company Name"
                                    icon={Building}
                                    error={errors?.offers?.[index]?.companyName}
                                    disabled={status === "closed" || status === "completed"}
                                  />
                                )}
                              />
                              <ErrorMessage error={errors?.offers?.[index]?.companyName} />
                            </div>

                            <div>
          <Controller
                                name={`offers.${index}.companyAddress`}
            control={control}
            render={({ field }) => (
                                  <FloatingLabelInput
                                    field={field}
                                    placeholder="Enter Company Address"
                                    icon={Building}
                                    error={errors?.offers?.[index]?.companyAddress}
                                    disabled={status === "closed" || status === "completed"}
                                  />
                                )}
                              />
                              <ErrorMessage error={errors?.offers?.[index]?.companyAddress} />
        </div>

                            <div>
                              <Controller
                                name={`offers.${index}.hrName`}
                                control={control}
                                render={({ field }) => (
                                  <FloatingLabelInput
                                    field={field}
                                    placeholder="Enter HR Name"
                                    icon={User}
                                    error={errors?.offers?.[index]?.hrName}
                                    disabled={status === "closed" || status === "completed"}
                                  />
                                )}
                              />
                              <ErrorMessage error={errors?.offers?.[index]?.hrName} />
            </div>

                            <div>
                              <Controller
                                name={`offers.${index}.hrPhone`}
                                control={control}
                                render={({ field }) => (
                                  <FloatingLabelInput
                                    field={field}
                                    placeholder="Enter HR Phone"
                                    icon={Phone}
                                    error={errors?.offers?.[index]?.hrPhone}
                                    disabled={status === "closed" || status === "completed"}
                                  />
                                )}
                              />
                              <ErrorMessage error={errors?.offers?.[index]?.hrPhone} />
                            </div>

                            <div>
          <Controller
                                name={`offers.${index}.hrEmail`}
            control={control}
            render={({ field }) => (
                                  <FloatingLabelInput
                                    field={field}
                                    type="email"
                                    placeholder="Enter HR Email"
                                    icon={Mail}
                                    error={errors?.offers?.[index]?.hrEmail}
                                    disabled={status === "closed" || status === "completed"}
                                  />
                                )}
                              />
                              <ErrorMessage error={errors?.offers?.[index]?.hrEmail} />
        </div>
                </div>
                </div>

                        {/* Onboarding Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-blue-100 rounded-2xl">
                                <CheckCircle className="w-7 h-7 text-blue-600" />
            </div>
                              <h5 className="text-2xl font-bold text-gray-800 dark:text-white">Onboarding Details</h5>
                            </div>
                            <Controller
                              name={`offers.${index}.onboarded`}
                              control={control}
                              render={({ field }) => (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                  <span className="text-base font-medium text-gray-700">Onboarded</span>
                                  <input
                                    type="checkbox"
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-600 focus:ring-2"
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                    disabled={status === "closed" || status === "completed"}
                                  />
                                </div>
                              )}
                            />
                          </div>
                          <div className="h-px bg-gradient-to-r from-blue-600/20 to-transparent mb-8"></div>

                          {onboarded && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div>
                                <Controller
                                  name={`offers.${index}.onboardedDate`}
                                  control={control}
                                  rules={{
                                    required: "Onboarding date is required",
                                    validate: (value) => {
                                      if (!value) return "Onboarding date is required";
                                      if (!offerReceivedDate) return true;
                                      const onboardDate = new Date(value);
                                      const offerDate = new Date(offerReceivedDate);
                                      if (isNaN(onboardDate.getTime()) || isNaN(offerDate.getTime())) return true;
                                      return (
                                        onboardDate >= offerDate ||
                                        "Onboarding date must be on or after Offer Letter Received Date"
                                      );
                                    },
                                  }}
                                  render={({ field }) => (
                                    <FloatingLabelInput
                                      field={{
                                        ...field,
                                        value: field.value ? new Date(field.value).toISOString().split('T')[0] : '',
                                        onChange: (e) => field.onChange(new Date(e.target.value))
                                      }}
                                      type="date"
                                      placeholder="Select Onboarding Date"
                                      icon={Calendar}
                                      error={errors?.offers?.[index]?.onboardedDate}
                                      disabled={status === "closed" || status === "completed"}
                                      min={minOnboardDate}
                                    />
                                  )}
                                />
                                <ErrorMessage error={errors?.offers?.[index]?.onboardedDate} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FormSection>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="px-10 py-5 bg-gray-500 text-white font-semibold rounded-2xl shadow-lg text-lg"
            >
              Reset Form
            </button>
            
            <button
              type="submit"
              className="px-10 py-5 bg-[#6366F1] text-white font-semibold rounded-2xl shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-4 text-lg"
            >
              <CheckCircle className="w-6 h-6" />
              Submit Form
            </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default DetailUserForm; 