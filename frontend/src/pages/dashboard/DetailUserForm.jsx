import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidateById, updateCandidateById, selectSelectedCandidate, selectCandidatesLoading, selectCandidatesError } from '../../store/slices/candidateSlice';
import { useToast } from '../../components/common';
// import { useDispatch, useSelector } from 'react-redux';
// import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
// import { getCandidateById, updateCandidateById } from '../../redux/actions/candidateActions';
// import { resetCandidateState } from '../../redux/slices/candidateSlice';
// import { getAllParticipants } from '../../redux/actions/participantActions';
// import { ErrorMessage } from '@hookform/error-message';
// import ProfileStatusForm from '../../components/candidates/ProfileStatusForm';
// import InterviewDetails from '../../components/candidates/InterviewDetails';
// import OfferLetterSection from '../../components/candidates/OfferLetterSection';

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
  profileCreatedStageDate: '',
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
  // Add all other fields as needed
};

const Section = ({ title, children }) => (
  <div className="mb-10 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-blue-200 dark:border-blue-800 px-6 py-5 relative">
    <h3 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100 border-b-2 border-blue-300 dark:border-blue-700 sticky top-0 z-10 bg-white dark:bg-gray-900 rounded-t-xl px-2 py-2 shadow-sm">
      {title}
    </h3>
    <div className="space-y-3 pl-1">{children}</div>
  </div>
);

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
    inactiveDate: data.inactiveDate,
    comments: data.comments,
    documentsNonSubmissionReason: data.documentsNonSubmissionReason,
    agentName: data.agentName,
    joiningDate: data.joiningDate,
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
      classStartDate: data.classStartDate,
      courseEndDate: data.courseEndDate,
      stage: data.stage,
      stageUpdateDate: data.stageUpdateDate,
      trainingStageDate: data.trainingStageDate,
      projectsStageDate: data.projectsStageDate,
      pocStageDate: data.pocStageDate,
      profileCreatedStageDate: data.profileCreatedStageDate,
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
    profile: {
      videoShooted: data.videoShooted,
      videoShootedDate: data.videoShootedDate,
      modelCreated: data.modelCreated,
      modelCreatedDate: data.modelCreatedDate,
      resumeCreated: data.resumeCreated,
      resumeCreatedDate: data.resumeCreatedDate,
      profileCreated: data.profileCreated,
      profileCreatedDate: data.profileCreatedDate,
    },
    agreements: {
      entry: {
        signed: data.entryAgreementSigned,
        signedDate: data.entryAgreementSignedDate,
        document: data.entryAgreementDoc,
      },
      jobOffer: {
        signed: data.jobOfferAgreementSigned,
        signedDate: data.jobOfferAgreementSignedDate,
        document: data.jobOfferAgreementDoc,
      },
      exit: {
        signed: data.exitAgreementSigned,
        signedDate: data.exitAgreementSignedDate,
        document: data.exitAgreementDoc,
      },
    },
    receipts: {
      entry: {
        created: data.entryReceiptCreated,
        createdDate: data.entryReceiptCreatedDate,
        document: data.entryReceiptDoc,
      },
      jobOffer: {
        created: data.jobOfferReceiptCreated,
        createdDate: data.jobOfferReceiptCreatedDate,
        document: data.jobOfferReceiptDoc,
      },
      exit: {
        created: data.exitReceiptCreated,
        createdDate: data.exitReceiptCreatedDate,
        document: data.exitReceiptDoc,
      },
    },
    // Add similar mapping for financial, interviews, offers, loans if needed
  };
}

// Utility to recursively remove empty string fields from an object
function removeEmptyStrings(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeEmptyStrings);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== '')
        .map(([k, v]) => [k, removeEmptyStrings(v)])
    );
  }
  return obj;
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
  } = useForm({
    defaultValues,
    mode: 'onSubmit',
  });

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
  };

  // Add mock interview and offer details for demonstration
  const mockInterviews = [
    { domain: '', interviewDateTime: '', companyName: '', interviewLevel: '', interviewerName: '', proxyName: '', hrName: '', hrEmail: '', hrPhone: '', status: '', result: '', resultRemarks: '' }
  ];
  const mockOffers = [
    { offerLetterReceived: false, offerLetterReceivedDate: '', companyName: '', hrName: '', hrEmail: '', hrPhone: '', onboarded: false, onboardedDate: '' }
  ];

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-10 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 rounded-3xl shadow-2xl mt-10 border border-blue-200 dark:border-blue-800">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-900 dark:text-blue-100 tracking-tight flex items-center justify-between">
        Detail User Form
        <span className="ml-4 inline-block bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 px-3 py-1 rounded-full text-sm font-semibold shadow">Edit Mode</span>
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Section title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Full Name</label>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <input {...field} className="w-full p-2 border rounded" placeholder="Full Name" />
                )}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input {...field} className="w-full p-2 border rounded" placeholder="Email" />
                )}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Phone</label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input {...field} className="w-full p-2 border rounded" placeholder="Phone" />
                )}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Referred By</label>
              <Controller
                name="referredBy"
                control={control}
                render={({ field }) => (
                  <input {...field} className="w-full p-2 border rounded" placeholder="Referred By" />
                )}
              />
            </div>
          </div>
        </Section>
        <Section title="Training Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Trainer Name</label>
              <Controller
                name="trainerName"
                control={control}
                render={({ field }) => (
                  <input {...field} className="w-full p-2 border rounded" placeholder="Trainer Name" />
                )}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Class Time Slot</label>
              <Controller
                name="slotTime"
                control={control}
                render={({ field }) => (
                  <select {...field} className="w-full p-2 border rounded-md bg-gray-100">
                    <option value="">Select Time Slot</option>
                    <option value="9AM">9 AM</option>
                    <option value="10AM">10 AM</option>
                    <option value="11AM">11 AM</option>
                    <option value="12PM">12 PM</option>
                    <option value="1PM">1 PM</option>
                    <option value="2PM">2 PM</option>
                    <option value="3PM">3 PM</option>
                    <option value="4PM">4 PM</option>
                    <option value="5PM">5 PM</option>
                    <option value="6PM">6 PM</option>
                    <option value="7PM">7 PM</option>
                    <option value="8PM">8 PM</option>
                    <option value="9PM">9 PM</option>
                  </select>
                )}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Class Start Date</label>
              <Controller
                name="classStartDate"
                control={control}
                render={({ field }) => (
                  <input type="date" {...field} className="w-full p-2 border rounded" />
                )}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Course End Date</label>
              <Controller
                name="courseEndDate"
                control={control}
                render={({ field }) => (
                  <input type="date" {...field} className="w-full p-2 border rounded" />
                )}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Stage</label>
              <Controller
                name="stage"
                control={control}
                render={({ field }) => (
                  <select {...field} className="w-full p-2 border rounded">
                    <option value="training">Training (Ongoing Classes)</option>
                    <option value="poc">POC (Proof of Concept)</option>
                    <option value="projects">Projects (Ongoing Projects)</option>
                    <option value="profileCreated">Profile Created (Ready for Placement)</option>
                  </select>
                )}
              />
            </div>
          </div>
        </Section>
        <Section title="Candidate Status">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Account Status</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <select {...field} className="w-full p-2 border rounded">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="closed">Closed</option>
                    <option value="completed">Completed</option>
                  </select>
                )}
              />
            </div>
            {watch('status') === 'inactive' && (
              <div>
                <label className="block text-gray-700 mb-2">Inactive Date</label>
                <Controller
                  name="inActiveDate"
                  control={control}
                  render={({ field }) => (
                    <input type="date" {...field} className="w-full p-2 border rounded" />
                  )}
                />
                <label className="block text-gray-700 mb-2 mt-2">Inactive Reason</label>
                <Controller
                  name="inActiveReason"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="w-full p-2 border rounded">
                      <option value="">Select Reason</option>
                      <option value="left_training">Left Training</option>
                      <option value="health_issues">Health Issues</option>
                      <option value="financial_issues">Financial Issues</option>
                      <option value="got_other_job">Got Another Job</option>
                      <option value="personal_reasons">Personal Reasons</option>
                      <option value="other">Other</option>
                    </select>
                  )}
                />
                {watch('inActiveReason') === 'other' && (
                  <Controller
                    name="inActiveNotes"
                    control={control}
                    render={({ field }) => (
                      <textarea {...field} className="w-full p-2 border rounded mt-2" placeholder="Please specify the reason" rows="3" />
                    )}
                  />
                )}
              </div>
            )}
          </div>
        </Section>
        <Section title="Personal Documents">
          <Controller
            name="eAadhar"
            control={control}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border rounded" placeholder="Aadhaar Card Link" />
            )}
          />
          <Controller
            name="panCard"
            control={control}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border rounded" placeholder="PAN Card Link" />
            )}
          />
          <Controller
            name="photo"
            control={control}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border rounded" placeholder="Passport Size Photo Link" />
            )}
          />
          <Controller
            name="passport"
            control={control}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border rounded" placeholder="Passport Link" />
            )}
          />
        </Section>
        <Section title="Educational Documents">
          <Controller
            name="sslc"
            control={control}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border rounded" placeholder="SSLC Certificate Link" />
            )}
          />
          <Controller
            name="hsc"
            control={control}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border rounded" placeholder="HSC Certificate Link" />
            )}
          />
          <Controller
            name="ugDegreeCertificate"
            control={control}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border rounded" placeholder="UG Degree Certificate Link" />
            )}
          />
          <Controller
            name="ugConsolidatedMarksheet"
            control={control}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border rounded" placeholder="UG Consolidated Marksheet Link" />
            )}
          />
          <Controller
            name="ugProvisionalCertificate"
            control={control}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border rounded" placeholder="UG Provisional Certificate Link" />
            )}
          />
          <Controller
            name="pgDegreeCertificate"
            control={control}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border rounded" placeholder="PG Degree Certificate Link" />
            )}
          />
        </Section>
        {/* Document Tracking Section Toggle */}
        <div className="mb-6 flex items-center gap-3">
          <Controller
            name="showDocumentTracking"
            control={control}
            render={({ field }) => (
              <button type="button" onClick={() => field.onChange(!field.value)} className={`transition-colors duration-200 w-10 h-6 flex items-center rounded-full p-1 ${field.value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                aria-pressed={field.value} aria-label="Toggle Document Tracking">
                <span className={`inline-block w-4 h-4 rounded-full bg-white dark:bg-gray-200 shadow transform transition-transform duration-200 ${field.value ? 'translate-x-4' : ''}`}></span>
              </button>
            )}
          />
          <label className="text-lg font-semibold text-blue-900 dark:text-blue-100 select-none cursor-pointer">Show Document Tracking (Agreements & Receipts)</label>
        </div>
        {watch('showDocumentTracking') && (
          <Section title="Document Tracking (Agreements & Receipts)">
            {["entry", "jobOffer", "exit"].map((section) => (
              <div key={section} className="mb-6">
                <h4 className="text-md font-semibold text-gray-800 mb-2 capitalize">{section.replace(/([A-Z])/g, ' $1')}</h4>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/2 p-3 rounded">
                    <div className="flex items-center justify-between mb-2 border-b pb-2">
                      <label className="text-gray-700 font-medium">Agreement</label>
                      <Controller
                        name={`${section}AgreementSigned`}
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center">
                            <input type="checkbox" className="mr-2" checked={field.value || false} onChange={e => field.onChange(e.target.checked)} />
                            <span className="text-sm">Signed</span>
                          </div>
                        )}
                      />
                    </div>
                    {watch(`${section}AgreementSigned`) && (
                      <div className="space-y-2">
                        <Controller
                          name={`${section}AgreementSignedDate`}
                          control={control}
                          render={({ field }) => (
                            <input type="date" {...field} className="w-full p-2 border rounded" />
                          )}
                        />
                        <Controller
                          name={`${section}AgreementDoc`}
                          control={control}
                          render={({ field }) => (
                            <input {...field} type="text" className="w-full p-1 border rounded text-sm" placeholder="Agreement Document Link" />
                          )}
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-full md:w-1/2 p-3 rounded">
                    <div className="flex items-center justify-between mb-2 border-b pb-2">
                      <label className="text-gray-700 font-medium">Receipt</label>
                      <Controller
                        name={`${section}ReceiptCreated`}
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center">
                            <input type="checkbox" className="mr-2" checked={field.value || false} onChange={e => field.onChange(e.target.checked)} />
                            <span className="text-sm">Created</span>
                          </div>
                        )}
                      />
                    </div>
                    {watch(`${section}ReceiptCreated`) && (
                      <div className="space-y-2">
                        <Controller
                          name={`${section}ReceiptCreatedDate`}
                          control={control}
                          render={({ field }) => (
                            <input type="date" {...field} className="w-full p-2 border rounded" />
                          )}
                        />
                        <Controller
                          name={`${section}ReceiptDoc`}
                          control={control}
                          render={({ field }) => (
                            <input {...field} type="text" className="w-full p-1 border rounded text-sm" placeholder="Receipt Document Link" />
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Section>
        )}
        {/* Profile Status Section Toggle */}
        <div className="mb-6 flex items-center gap-3">
          <Controller
            name="showProfileStatus"
            control={control}
            render={({ field }) => (
              <button type="button" onClick={() => field.onChange(!field.value)} className={`transition-colors duration-200 w-10 h-6 flex items-center rounded-full p-1 ${field.value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                aria-pressed={field.value} aria-label="Toggle Profile Status">
                <span className={`inline-block w-4 h-4 rounded-full bg-white dark:bg-gray-200 shadow transform transition-transform duration-200 ${field.value ? 'translate-x-4' : ''}`}></span>
              </button>
            )}
          />
          <label className="text-lg font-semibold text-blue-900 dark:text-blue-100 select-none cursor-pointer">Show Profile Status</label>
        </div>
        {watch('showProfileStatus') && (
          <Section title="Profile Status">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller name="videoShooted" control={control} render={({ field }) => (
                <div className="flex items-center mb-2">
                  <input type="checkbox" className="mr-2" checked={field.value || false} onChange={e => field.onChange(e.target.checked)} />
                  <label className="text-gray-700">Video Shooted</label>
                </div>
              )} />
              <Controller name="videoShootedDate" control={control} render={({ field }) => (
                <input type="date" {...field} className="w-full p-2 border rounded" placeholder="Video Shooted Date" />
              )} />
              <Controller name="modelCreated" control={control} render={({ field }) => (
                <div className="flex items-center mb-2">
                  <input type="checkbox" className="mr-2" checked={field.value || false} onChange={e => field.onChange(e.target.checked)} />
                  <label className="text-gray-700">Model Created</label>
                </div>
              )} />
              <Controller name="modelCreatedDate" control={control} render={({ field }) => (
                <input type="date" {...field} className="w-full p-2 border rounded" placeholder="Model Created Date" />
              )} />
              <Controller name="resumeCreated" control={control} render={({ field }) => (
                <div className="flex items-center mb-2">
                  <input type="checkbox" className="mr-2" checked={field.value || false} onChange={e => field.onChange(e.target.checked)} />
                  <label className="text-gray-700">Resume Created</label>
                </div>
              )} />
              <Controller name="resumeCreatedDate" control={control} render={({ field }) => (
                <input type="date" {...field} className="w-full p-2 border rounded" placeholder="Resume Created Date" />
              )} />
              <Controller name="profileCreated" control={control} render={({ field }) => (
                <div className="flex items-center mb-2">
                  <input type="checkbox" className="mr-2" checked={field.value || false} onChange={e => field.onChange(e.target.checked)} />
                  <label className="text-gray-700">Profile Created</label>
                </div>
              )} />
              <Controller name="profileCreatedDate" control={control} render={({ field }) => (
                <input type="date" {...field} className="w-full p-2 border rounded" placeholder="Profile Created Date" />
              )} />
            </div>
          </Section>
        )}
        {/* Interview Details Section Toggle */}
        <div className="mb-6 flex items-center gap-3">
          <Controller
            name="showInterviewDetails"
            control={control}
            render={({ field }) => (
              <button type="button" onClick={() => field.onChange(!field.value)} className={`transition-colors duration-200 w-10 h-6 flex items-center rounded-full p-1 ${field.value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                aria-pressed={field.value} aria-label="Toggle Interview Details">
                <span className={`inline-block w-4 h-4 rounded-full bg-white dark:bg-gray-200 shadow transform transition-transform duration-200 ${field.value ? 'translate-x-4' : ''}`}></span>
              </button>
            )}
          />
          <label className="text-lg font-semibold text-blue-900 dark:text-blue-100 select-none cursor-pointer">Show Interview Details</label>
        </div>
        {watch('showInterviewDetails') && (
          <Section title="Interview Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller name="interviewDomain" control={control} render={({ field }) => (
                <input {...field} className="w-full p-2 border rounded" placeholder="Domain" />
              )} />
              <Controller name="interviewDateTime" control={control} render={({ field }) => (
                <input type="datetime-local" {...field} className="w-full p-2 border rounded" placeholder="Interview Date/Time" />
              )} />
              <Controller name="interviewCompanyName" control={control} render={({ field }) => (
                <input {...field} className="w-full p-2 border rounded" placeholder="Company Name" />
              )} />
              <Controller name="interviewLevel" control={control} render={({ field }) => (
                <input {...field} className="w-full p-2 border rounded" placeholder="Interview Level" />
              )} />
              <Controller name="interviewerName" control={control} render={({ field }) => (
                <input {...field} className="w-full p-2 border rounded" placeholder="Interviewer Name" />
              )} />
              <Controller name="proxyName" control={control} render={({ field }) => (
                <input {...field} className="w-full p-2 border rounded" placeholder="Proxy Name" />
              )} />
              <Controller name="hrName" control={control} render={({ field }) => (
                <input {...field} className="w-full p-2 border rounded" placeholder="HR Name" />
              )} />
              <Controller name="hrEmail" control={control} render={({ field }) => (
                <input {...field} className="w-full p-2 border rounded" placeholder="HR Email" />
              )} />
              <Controller name="hrPhone" control={control} render={({ field }) => (
                <input {...field} className="w-full p-2 border rounded" placeholder="HR Phone" />
              )} />
              <Controller name="interviewStatus" control={control} render={({ field }) => (
                <input {...field} className="w-full p-2 border rounded" placeholder="Status" />
              )} />
              <Controller name="interviewResult" control={control} render={({ field }) => (
                <input {...field} className="w-full p-2 border rounded" placeholder="Result" />
              )} />
              <Controller name="interviewResultRemarks" control={control} render={({ field }) => (
                <input {...field} className="w-full p-2 border rounded" placeholder="Result Remarks" />
              )} />
            </div>
          </Section>
        )}
        {/* Offer Details Section Toggle */}
        <div className="mb-6 flex items-center gap-3">
          <Controller
            name="showOfferDetails"
            control={control}
            render={({ field }) => (
              <button type="button" onClick={() => field.onChange(!field.value)} className={`transition-colors duration-200 w-10 h-6 flex items-center rounded-full p-1 ${field.value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                aria-pressed={field.value} aria-label="Toggle Offer Details">
                <span className={`inline-block w-4 h-4 rounded-full bg-white dark:bg-gray-200 shadow transform transition-transform duration-200 ${field.value ? 'translate-x-4' : ''}`}></span>
              </button>
            )}
          />
          <label className="text-lg font-semibold text-blue-900 dark:text-blue-100 select-none cursor-pointer">Show Offer Details</label>
        </div>
        {watch('showOfferDetails') && (
          <Section title="Offer Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller name="offerLetterReceived" control={control} render={({ field }) => (
                <div className="flex items-center mb-2">
                  <input type="checkbox" className="mr-2" checked={field.value || false} onChange={e => field.onChange(e.target.checked)} />
                  <label className="text-gray-700">Offer Letter Received</label>
                </div>
              )} />
              <Controller name="offerLetterReceivedDate" control={control} render={({ field }) => (
                <input type="date" {...field} className="w-full p-2 border rounded" placeholder="Offer Letter Date" />
              )} />
              <Controller name="offerCompanyName" control={control} render={({ field }) => (
                <input {...field} className="w-full p-2 border rounded" placeholder="Company Name" />
              )} />
              <Controller name="offerHrName" control={control} render={({ field }) => (
                <input {...field} className="w-full p-2 border rounded" placeholder="HR Name" />
              )} />
              <Controller name="offerHrEmail" control={control} render={({ field }) => (
                <input {...field} className="w-full p-2 border rounded" placeholder="HR Email" />
              )} />
              <Controller name="offerHrPhone" control={control} render={({ field }) => (
                <input {...field} className="w-full p-2 border rounded" placeholder="HR Phone" />
              )} />
              <Controller name="onboarded" control={control} render={({ field }) => (
                <div className="flex items-center mb-2">
                  <input type="checkbox" className="mr-2" checked={field.value || false} onChange={e => field.onChange(e.target.checked)} />
                  <label className="text-gray-700">Onboarded</label>
                </div>
              )} />
              <Controller name="onboardedDate" control={control} render={({ field }) => (
                <input type="date" {...field} className="w-full p-2 border rounded" placeholder="Onboarded Date" />
              )} />
            </div>
          </Section>
        )}
        <div className="flex gap-4 mt-10 justify-end">
          <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-3 rounded-lg shadow-lg font-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">Submit</button>
          <button type="button" onClick={handleReset} className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-8 py-3 rounded-lg shadow-lg font-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400">Reset</button>
        </div>
      </form>
    </div>
  );
};

export default DetailUserForm; 