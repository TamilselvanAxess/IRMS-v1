import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchCandidateById, selectSelectedCandidate, selectCandidatesLoading, selectCandidatesError } from '../../store/slices/candidateSlice';
import { User, Mail, Phone, Book, Layers, Calendar, FileText, DollarSign, FileCheck2, FileSignature, Award, Briefcase, Users, File, CheckCircle, XCircle, FileSearch, FileInput, FileOutput, Pencil } from 'lucide-react';
import ErrorBoundary from '../../components/common/ErrorBoundary';

const Section = ({ title, icon, children }) => (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-3 border-b pb-1 border-blue-100 dark:border-blue-900">
      {icon && <span className="text-blue-500 dark:text-blue-300"><>{icon}</></span>}
      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 tracking-wide">{title}</h3>
    </div>
    <div className="space-y-2 pl-2">{children}</div>
  </div>
);

const renderKeyValue = (label, value, icon) => (
  <div className="flex items-center gap-2 text-sm">
    {icon && <span className="text-gray-400">{icon}</span>}
    <span className="font-medium text-gray-700 dark:text-gray-200 w-44 inline-block">{label}:</span>
    <span className="text-gray-900 dark:text-gray-100">{value ?? <span className="text-gray-400">N/A</span>}</span>
  </div>
);

const renderArray = (arr, renderItem) => (
  <div className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-800 mb-2 divide-y divide-blue-100 dark:divide-blue-900">
    {arr.length === 0 ? <div className="text-gray-400">None</div> : arr.map(renderItem)}
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

  // Role logic
  const role = (user?.role || '').toLowerCase();
  const canViewDetail = ["detail", "admin", "superadmin", "finance"].includes(role);
  const canViewFinance = ["admin", "superadmin", "finance"].includes(role);
  const canViewAll = ["admin", "superadmin", "finance"].includes(role);

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
    return <div className="flex justify-center items-center h-64">Loading candidate details...</div>;
  }
  if (error) {
    return <div className="text-red-600 dark:text-red-400">Error: {error}</div>;
  }
  if (!candidate) {
    return <div className="text-gray-500 dark:text-gray-400">No candidate found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl mt-8 border border-blue-100 dark:border-blue-900">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 text-white rounded-full p-4 shadow-lg">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-200 mb-1">{candidate.fullName}</h2>
            <div className="flex gap-4 text-gray-600 dark:text-gray-300 text-sm">
              <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {candidate.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {candidate.phone}</span>
              <span className="flex items-center gap-1"><Layers className="w-4 h-4" /> {candidate.category}</span>
              <span className="flex items-center gap-1"><Book className="w-4 h-4" /> {candidate.course}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined: {candidate.joiningDate && new Date(candidate.joiningDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        {editPath && (
          <button
            onClick={() => navigate(editPath)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition font-semibold text-sm"
            title="Edit Candidate"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          {/* Enroll details: always visible */}
          <Section title="Basic Information" icon={<FileText className="w-5 h-5" />}>
            {renderKeyValue('Candidate ID', candidate.candidateId, <File className="w-4 h-4" />)}
            {renderKeyValue('Status', candidate.status, candidate.status === 'active' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />)}
            {renderKeyValue('Other Course', candidate.othersCourseName, <Book className="w-4 h-4" />)}
            {renderKeyValue('Agent Name', candidate.agentName, <Users className="w-4 h-4" />)}
          </Section>
          <Section title="Addresses" icon={<FileInput className="w-5 h-5" />}>
            {renderKeyValue('Permanent', candidate.addresses?.permanent)}
            {renderKeyValue('Current', candidate.addresses?.current)}
          </Section>
          <Section title="Contacts" icon={<Phone className="w-5 h-5" />}>
            {renderKeyValue('Father', candidate.contacts?.father?.name)}
            {renderKeyValue('Father Phone', candidate.contacts?.father?.phone)}
            {renderKeyValue('Mother', candidate.contacts?.mother?.name)}
            {renderKeyValue('Mother Phone', candidate.contacts?.mother?.phone)}
            {renderKeyValue('Spouse', candidate.contacts?.spouse?.name)}
            {renderKeyValue('Spouse Phone', candidate.contacts?.spouse?.phone)}
          </Section>
          {/* Training Details section */}
          {candidate.training && (
            <Section title="Training Details" icon={<Book className="w-5 h-5" />}>
              {renderKeyValue('Trainer Name', candidate.training.trainerName)}
              {renderKeyValue('Slot Time', candidate.training.slotTime)}
              {renderKeyValue('Class Start Date', candidate.training.classStartDate ? new Date(candidate.training.classStartDate).toLocaleDateString() : undefined)}
              {renderKeyValue('Course End Date', candidate.training.courseEndDate ? new Date(candidate.training.courseEndDate).toLocaleDateString() : undefined)}
              {renderKeyValue('Stage', candidate.training.stage)}
            </Section>
          )}
          {/* Detail user and above */}
          {canViewDetail && (
            <>
              <Section title="Education" icon={<Award className="w-5 h-5" />}>
                {renderKeyValue('SSLC', candidate.education?.sslc)}
                {renderKeyValue('HSC', candidate.education?.hsc)}
                {renderKeyValue('UG Degree', candidate.education?.ugDegree)}
                {renderKeyValue('UG Marksheet', candidate.education?.ugMarksheet)}
                {renderKeyValue('UG Provisional', candidate.education?.ugProvisional)}
                {renderKeyValue('PG Degree', candidate.education?.pgDegree)}
              </Section>
              <Section title="Profile Status" icon={<FileSearch className="w-5 h-5" />}>
                {renderKeyValue('Video Shooted', candidate.profile?.videoShooted ? 'Yes' : 'No')}
                {renderKeyValue('Video Shooted Date', candidate.profile?.videoShootedDate && new Date(candidate.profile?.videoShootedDate).toLocaleDateString())}
                {renderKeyValue('Model Created', candidate.profile?.modelCreated ? 'Yes' : 'No')}
                {renderKeyValue('Model Created Date', candidate.profile?.modelCreatedDate && new Date(candidate.profile?.modelCreatedDate).toLocaleDateString())}
                {renderKeyValue('Resume Created', candidate.profile?.resumeCreated ? 'Yes' : 'No')}
                {renderKeyValue('Resume Created Date', candidate.profile?.resumeCreatedDate && new Date(candidate.profile?.resumeCreatedDate).toLocaleDateString())}
                {renderKeyValue('Profile Created', candidate.profile?.profileCreated ? 'Yes' : 'No')}
                {renderKeyValue('Profile Created Date', candidate.profile?.profileCreatedDate && new Date(candidate.profile?.profileCreatedDate).toLocaleDateString())}
              </Section>
            </>
          )}
        </div>
        <div>
          {/* Finance/admin/superadmin only */}
          {canViewFinance && (
            <>
              <Section title="Financial Information" icon={<DollarSign className="w-5 h-5" />}>
                {renderKeyValue('Total Amount', candidate.financial?.totalAmount)}
                {renderKeyValue('Total Amount Received', candidate.financial?.totalAmountReceived)}
                {renderKeyValue('Balance Amount', candidate.financial?.balanceAmount)}
                {renderKeyValue('Initial Amount Paid', candidate.financial?.initialAmount ? 'Yes' : 'No')}
                {renderKeyValue('Payment for Interview', candidate.financial?.paymentForInterview)}
                {renderKeyValue('Payment for Interview Date', candidate.financial?.paymentForInterviewDate && new Date(candidate.financial?.paymentForInterviewDate).toLocaleDateString())}
                {renderKeyValue('Payment for Documents', candidate.financial?.paymentForDocuments)}
                {renderKeyValue('Payment for Documents Date', candidate.financial?.paymentForDocumentsDate && new Date(candidate.financial?.paymentForDocumentsDate).toLocaleDateString())}
                {renderKeyValue('Payment for Offer', candidate.financial?.paymentForOffer)}
                {renderKeyValue('Payment for Offer Date', candidate.financial?.paymentForOfferDate && new Date(candidate.financial?.paymentForOfferDate).toLocaleDateString())}
              </Section>
              <Section title="Agreements" icon={<FileSignature className="w-5 h-5" />}>
                {renderKeyValue('Entry Signed', candidate.agreements?.entry?.signed ? 'Yes' : 'No')}
                {renderKeyValue('Entry Signed Date', candidate.agreements?.entry?.signedDate && new Date(candidate.agreements?.entry?.signedDate).toLocaleDateString())}
                {renderKeyValue('Job Offer Signed', candidate.agreements?.jobOffer?.signed ? 'Yes' : 'No')}
                {renderKeyValue('Job Offer Signed Date', candidate.agreements?.jobOffer?.signedDate && new Date(candidate.agreements?.jobOffer?.signedDate).toLocaleDateString())}
                {renderKeyValue('Exit Signed', candidate.agreements?.exit?.signed ? 'Yes' : 'No')}
                {renderKeyValue('Exit Signed Date', candidate.agreements?.exit?.signedDate && new Date(candidate.agreements?.exit?.signedDate).toLocaleDateString())}
              </Section>
              <Section title="Receipts" icon={<FileCheck2 className="w-5 h-5" />}>
                {renderKeyValue('Entry Receipt', candidate.receipts?.entry?.created ? 'Yes' : 'No')}
                {renderKeyValue('Entry Receipt Date', candidate.receipts?.entry?.createdDate && new Date(candidate.receipts?.entry?.createdDate).toLocaleDateString())}
                {renderKeyValue('Job Offer Receipt', candidate.receipts?.jobOffer?.created ? 'Yes' : 'No')}
                {renderKeyValue('Job Offer Receipt Date', candidate.receipts?.jobOffer?.createdDate && new Date(candidate.receipts?.jobOffer?.createdDate).toLocaleDateString())}
                {renderKeyValue('Exit Receipt', candidate.receipts?.exit?.created ? 'Yes' : 'No')}
                {renderKeyValue('Exit Receipt Date', candidate.receipts?.exit?.createdDate && new Date(candidate.receipts?.exit?.createdDate).toLocaleDateString())}
              </Section>
              <Section title="Loans" icon={<DollarSign className="w-5 h-5" />}>
                {candidate.loans && candidate.loans.length > 0 ? renderArray(candidate.loans, (loan, idx) => (
                  <div key={idx} className="mb-1">
                    {renderKeyValue('Loan', loan.loan ? 'Yes' : 'No')}
                    {renderKeyValue('Distributed Amount', loan.distributedAmount)}
                    {renderKeyValue('Distributed Date', loan.distributedDate && new Date(loan.distributedDate).toLocaleDateString())}
                  </div>
                )) : <div className="text-gray-400">No loans</div>}
              </Section>
              <Section title="Interviews" icon={<Briefcase className="w-5 h-5" />}>
                {candidate.interviews && candidate.interviews.length > 0 ? renderArray(candidate.interviews, (interview, idx) => (
                  <div key={idx} className="mb-1">
                    {renderKeyValue('Domain', interview.domain)}
                    {renderKeyValue('Date/Time', interview.interviewDateTime && new Date(interview.interviewDateTime).toLocaleString())}
                    {renderKeyValue('Company', interview.companyName)}
                    {renderKeyValue('Level', interview.interviewLevel)}
                    {renderKeyValue('Interviewer', interview.interviewerName)}
                    {renderKeyValue('Proxy', interview.proxyName)}
                    {renderKeyValue('HR Name', interview.hrName)}
                    {renderKeyValue('HR Email', interview.hrEmail)}
                    {renderKeyValue('HR Phone', interview.hrPhone)}
                    {renderKeyValue('Status', interview.status)}
                    {renderKeyValue('Result', interview.result)}
                    {renderKeyValue('Remarks', interview.resultRemarks)}
                  </div>
                )) : <div className="text-gray-400">No interviews</div>}
              </Section>
              <Section title="Offers" icon={<FileOutput className="w-5 h-5" />}>
                {candidate.offers && candidate.offers.length > 0 ? renderArray(candidate.offers, (offer, idx) => (
                  <div key={idx} className="mb-1">
                    {renderKeyValue('Offer Letter Received', offer.offerLetterReceived ? 'Yes' : 'No')}
                    {renderKeyValue('Offer Letter Date', offer.offerLetterReceivedDate && new Date(offer.offerLetterReceivedDate).toLocaleDateString())}
                    {renderKeyValue('Company', offer.companyName)}
                    {renderKeyValue('HR Name', offer.hrName)}
                    {renderKeyValue('HR Email', offer.hrEmail)}
                    {renderKeyValue('HR Phone', offer.hrPhone)}
                    {renderKeyValue('Onboarded', offer.onboarded ? 'Yes' : 'No')}
                    {renderKeyValue('Onboarded Date', offer.onboardedDate && new Date(offer.onboardedDate).toLocaleDateString())}
                  </div>
                )) : <div className="text-gray-400">No offers</div>}
              </Section>
            </>
          )}
        </div>
      </div>
      <div className="mt-8 text-xs text-gray-400 text-right">Created: {candidate.createdAt && new Date(candidate.createdAt).toLocaleString()} | Updated: {candidate.updatedAt && new Date(candidate.updatedAt).toLocaleString()}</div>
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