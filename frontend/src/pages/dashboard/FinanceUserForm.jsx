import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../components/common';
import { 
  IndianRupee, 
  CreditCard, 
  Calendar, 
  Split, 
  MessageCircle, 
  Check, 
  CheckCircle, 
  Plus,
  ArrowLeft
} from 'lucide-react';
import {
  fetchCandidateById,
  updateCandidateById,
  selectSelectedCandidate,
  selectCandidatesLoading,
  selectCandidatesError
} from '../../store/slices/candidateSlice';

// Form Section Component
// eslint-disable-next-line no-unused-vars
const FormSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
    <div className="flex items-center gap-3 mb-6">
      <Icon className="w-6 h-6 text-blue-600" />
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

// Floating Label Input Component
const FloatingLabelInput = ({ field, placeholder, icon: Icon, type = "text", error, disabled = false, className = "", min, max, onWheel, ...props }) => (
  <div className="relative">
    {Icon && (
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Icon className="w-5 h-5" />
      </div>
    )}
    <input
      {...field}
      {...props}
      type={type}
      min={min}
      max={max}
      onWheel={onWheel}
      className={`w-full px-3 py-3 ${Icon ? 'pl-10' : ''} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''} bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`}
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);

// Radio Button Component
const RadioButton = ({ label, value, checked, onChange, icon: Icon, disabled = false }) => (
  <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
    checked 
      ? 'border-[#6366F1] bg-[#6366F1]/5' 
      : 'border-gray-200 hover:border-gray-300'
  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <input
      type="radio"
      value={value}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="sr-only"
    />
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
      checked ? 'border-[#6366F1] bg-[#6366F1]' : 'border-gray-300'
    }`}>
      {checked && <div className="w-2 h-2 bg-white rounded-full"></div>}
    </div>
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-5 h-5 text-white" />}
      <span className="font-medium text-white">{label}</span>
    </div>
  </label>
);

// Error Message Component
const ErrorMessage = ({ error }) => (
  error && (
    <p className="text-red-500 text-sm mt-1">{error.message}</p>
  )
);

// Permission hook (simple version, you can expand as needed)
const useEditPermissions = () => {
  const user = useSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === 'superadmin';
  const isFinance = user?.role === 'finance';
  return { canEdit: isSuperAdmin || isFinance };
};

const defaultFinanceFormValues = {
  totalAmount: 0,
  balanceAmount: 0,
  paymentOption: 'singleShot',
  initialAmount: false,
  initialAmountSplited: [],
  loanEnabled: false,
  loan: [],
  balanceAmountSplits: [],
  balanceAmountSplitsPaid: [],
  numberOfSplits: 0,
};

const FinanceUserForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { canEdit } = useEditPermissions();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const candidate = useSelector(selectSelectedCandidate);
  const loading = useSelector(selectCandidatesLoading);
  const error = useSelector(selectCandidatesError);
  const isEditMode = !!id;

  const [numberOfSplits, setNumberOfSplits] = useState(0);
  const [hasLoanFields, setHasLoanFields] = useState(false);
  const [hasDirectPaymentFields, setHasDirectPaymentFields] = useState(false);
  const [hasBalanceSplits, setHasBalanceSplits] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue
  } = useForm({
    defaultValues: defaultFinanceFormValues
  });

  const { fields: balanceAmountFields, remove: removeBalanceSplit } = useFieldArray({
    control,
    name: "balanceAmountSplits"
  });
  const { fields: balanceAmountSplitsPaidFields, append: appendBalanceSplitPaid } = useFieldArray({
    control,
    name: "balanceAmountSplitsPaid"
  });
  const { fields, append } = useFieldArray({
    control,
    name: "loan"
  });

  // Calculate balance amount
  const calculateBalance = () => {
    const totalAmount = Number(watch("totalAmount")) || 0;
    const initialAmountTotal = watch("initialAmountSplited")?.reduce((sum, item) => sum + (Number(item?.amount) || 0), 0) || 0;
    const loanTotal = watch("loan")?.reduce((sum, item) => sum + (Number(item?.loanDistrubutedAmount) || 0), 0) || 0;
    const balanceSplitsPaidTotal = watch("balanceAmountSplitsPaid")?.reduce((sum, item) => sum + (Number(item?.amount) || 0), 0) || 0;
    return Math.max(0, totalAmount - initialAmountTotal - loanTotal - balanceSplitsPaidTotal);
  };

  // Show error toast
  // (replaces alert)
  // Usage: showErrorToast('message')

  // Handle split checkbox
  const handleSplitCheckbox = (index) => {
    const split = watch(`balanceAmountSplits.${index}`);
    if (split?.amount && split?.date) {
      appendBalanceSplitPaid({
        amount: split.amount,
        date: split.date,
        comment: split.comment || ""
      });
      removeBalanceSplit(index);
      setTimeout(() => {
        const newBalance = calculateBalance();
        setValue("balanceAmount", newBalance);
      }, 0);
    } else {
      showErrorToast('Please fill both amount and date before marking as paid');
    }
  };

  // Render initial amount section: only a single field, no add button
  const renderInitialAmountSection = () => {
    return (
      <div className="space-y-4">
        <div className="w-full p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full">
              <Controller
                name={`initialAmountSplited.0.amount`}
                control={control}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    type="number"
                    placeholder="Enter Initial Amount (₹)"
                    icon={IndianRupee}
                    error={errors?.initialAmountSplited?.[0]?.amount}
                    disabled={!canEdit || !!watch("initialAmountSplited.0.date")}
                    min="0"
                    value={field.value === 0 ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      const totalAmount = Number(watch("totalAmount")) || 0;
                      if (Number(value) > totalAmount) {
                        showErrorToast('Initial amount cannot exceed total amount');
                        return;
                      }
                      field.onChange(value === "" ? 0 : Number(value));
                      setTimeout(() => {
                        const newBalance = calculateBalance();
                        setValue("balanceAmount", newBalance);
                      }, 0);
                    }}
                    onWheel={(e) => e.target.blur()}
                  />
                )}
              />
              <ErrorMessage error={errors?.initialAmountSplited?.[0]?.amount} />
            </div>
            <div className="w-full">
              <Controller
                name={`initialAmountSplited.0.date`}
                control={control}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    type="date"
                    placeholder="Select Date"
                    icon={Calendar}
                    error={errors?.initialAmountSplited?.[0]?.date}
                    disabled={!canEdit || !watch("initialAmountSplited.0.amount") || !!watch("initialAmountSplited.0.date")}
                    value={
                      field.value &&
                      new Date(field.value).toString() !== "Invalid Date"
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                )}
              />
              <ErrorMessage error={errors?.initialAmountSplited?.[0]?.date} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Load candidate data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchCandidateById(id));
    }
  }, [isEditMode, id, dispatch]);

  // Reset form when candidate data is loaded
  useEffect(() => {
    if (isEditMode && candidate) {
      reset({ ...defaultFinanceFormValues, ...candidate });
      setTimeout(() => {
        setValue('balanceAmount', calculateBalance());
      }, 0);
    }
  }, [isEditMode, candidate, reset, setValue]);

  // Update balance when relevant fields change
  useEffect(() => {
    setValue('balanceAmount', calculateBalance());
  }, [watch('totalAmount'), watch('initialAmountSplited'), watch('loan'), watch('balanceAmountSplitsPaid')]);

  // Initialize initial amount field if empty
  useEffect(() => {
    if (!watch("initialAmountSplited") || watch("initialAmountSplited").length === 0) {
      setValue("initialAmountSplited", [{ amount: 0, date: null }]);
    }
  }, []);

  // Form submission
  const onSubmit = async (data) => {
    if (!canEdit) {
      showErrorToast('You do not have permission to edit this form.');
      return;
    }
    try {
      // Validation: total paid cannot exceed total amount
      const totalAmount = Number(data.totalAmount) || 0;
      const initialAmountTotal = data.initialAmountSplited?.reduce((sum, item) => sum + (Number(item?.amount) || 0), 0) || 0;
      const loanTotal = data.loan?.reduce((sum, item) => sum + (Number(item?.loanDistrubutedAmount) || 0), 0) || 0;
      const balanceSplitsPaidTotal = data.balanceAmountSplitsPaid?.reduce((sum, item) => sum + (Number(item?.amount) || 0), 0) || 0;
      const totalPaid = initialAmountTotal + loanTotal + balanceSplitsPaidTotal;
      if (totalPaid > totalAmount) {
        showErrorToast('Total paid amount cannot exceed total amount');
        return;
      }
      if (totalAmount - totalPaid < 0) {
        showErrorToast('Balance cannot be negative');
        return;
      }
      // Submit
      if (isEditMode && id) {
        await dispatch(updateCandidateById({ candidateId: id, candidateData: data }));
        showSuccessToast('Finance data updated successfully!');
        navigate(-1);
      } else {
        showSuccessToast('Finance data submitted successfully!');
        reset();
      }
    } catch {
      showErrorToast('Error submitting form. Please try again.');
    }
  };

  const handleReset = () => {
    reset(defaultFinanceFormValues);
    setNumberOfSplits(0);
    setHasLoanFields(false);
    setHasDirectPaymentFields(false);
    setHasBalanceSplits(false);
    
    // Reset initial amount field to empty state
    setValue("initialAmountSplited", [{ amount: 0, date: null }]);
    
    showSuccessToast('Form has been reset');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Finance Management Form
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage financial details, payment methods, and balance splits for candidates.
              </p>
            </div>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
        {loading && <div className="text-blue-600">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Total Amount and Balance Section */}
          <FormSection title="Financial Overview" icon={IndianRupee}>
            <div>
              <Controller
                name="totalAmount"
                control={control}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={{
                      ...field,
                      value: field.value === 0 ? '' : field.value
                    }}
                    type="number"
                    placeholder="Enter Total Amount (₹)"
                    icon={IndianRupee}
                    error={errors?.totalAmount}
                    disabled={!canEdit}
                    min="0"
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? 0 : Number(value));
                    }}
                    onWheel={(e) => e.target.blur()}
                  />
                )}
              />
              <ErrorMessage error={errors?.totalAmount} />
            </div>
            <div>
              <Controller
                name="balanceAmount"
                control={control}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={{
                      ...field,
                      value: field.value === 0 ? '' : field.value
                    }}
                    type="number"
                    placeholder="Balance Amount (₹)"
                    icon={IndianRupee}
                    disabled={true}
                    className="bg-gray-50"
                  />
                )}
              />
            </div>
          </FormSection>
          {/* Payment Options Section */}
          <FormSection title="Payment Method" icon={CreditCard}>
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="paymentOption"
                  control={control}
                  render={({ field }) => {
                    // Disable switching if any initialAmountSplited or loan data exists
                    const hasInitialAmountData = (watch("initialAmountSplited") || []).some(split => split.amount || split.date);
                    const hasLoanData = (watch("loan") || []).some(loan => loan.loanDistrubutedAmount || loan.loanDistrubutedDate);
                    const paymentLocked = hasInitialAmountData || hasLoanData;
                    return (
                      <>
                        <RadioButton
                          label="Direct Payment"
                          value="singleShot"
                          checked={field.value === "singleShot"}
                          onChange={() => {
                            if (!paymentLocked) field.onChange("singleShot");
                          }}
                          icon={IndianRupee}
                          disabled={
                            !canEdit || paymentLocked ||
                            (hasLoanFields && field.value !== "singleShot") ||
                            (hasBalanceSplits && field.value !== "singleShot") ||
                            (field.value === "split" && hasInitialAmountData)
                          }
                        />
                        <RadioButton
                          label="Loan"
                          value="split"
                          checked={field.value === "split"}
                          onChange={() => {
                            if (!paymentLocked) field.onChange("split");
                          }}
                          icon={CreditCard}
                          disabled={
                            !canEdit || paymentLocked ||
                            (hasDirectPaymentFields && field.value !== "split") ||
                            (hasBalanceSplits && field.value !== "split") ||
                            (field.value === "singleShot" && hasInitialAmountData)
                          }
                        />
                      </>
                    );
                  }}
                />
              </div>
            </div>
          </FormSection>
          {/* Initial Amount Section */}
          <FormSection title="Initial Amount" icon={IndianRupee}>
            <div className="lg:col-span-2">
              {renderInitialAmountSection()}
            </div>
          </FormSection>
          {/* Loan Section - Only show when payment option is 'split' */}
          {watch("paymentOption") === "split" && (
            <FormSection title="Loan Details" icon={CreditCard}>
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {/* Remove automatic field creation */}
                  {fields.map((item, index) => (
                    <div key={item.id} className="w-full p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="w-full">
                          <Controller
                            name={`loan.${index}.loanDistrubutedAmount`}
                            control={control}
                            render={({ field }) => (
                              <FloatingLabelInput
                                field={field}
                                type="number"
                                placeholder="Enter Amount Disbursed (₹)"
                                icon={IndianRupee}
                                error={errors?.loan?.[index]?.loanDistrubutedAmount}
                                disabled={!canEdit || !!watch(`loan.${index}.loanDistrubutedDate`)}
                                min="0"
                                value={field.value ?? ""}
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  const clean = raw.replace(/^0+(?=\d)/, "");
                                  const newValue = raw === "" ? "" : Number(clean);
                                  const totalAmount = Number(watch("totalAmount")) || 0;
                                  const currentTotal = watch("loan")?.reduce((sum, item, idx) => {
                                    if (idx === index) return sum;
                                    return sum + (Number(item?.loanDistrubutedAmount) || 0);
                                  }, 0) || 0;
                                  const potentialTotal = currentTotal + Number(newValue);
                                  if (potentialTotal > totalAmount) {
                                    showErrorToast("Loan amount cannot exceed total amount");
                                    return;
                                  }
                                  field.onChange(newValue);
                                  setTimeout(() => {
                                    const newBalance = calculateBalance();
                                    setValue("balanceAmount", newBalance);
                                  }, 0);
                                }}
                                onWheel={(e) => e.target.blur()}
                              />
                            )}
                          />
                          <ErrorMessage error={errors?.loan?.[index]?.loanDistrubutedAmount} />
                        </div>
                        <div className="w-full">
                          <Controller
                            name={`loan.${index}.loanDistrubutedDate`}
                            control={control}
                            render={({ field }) => (
                              <FloatingLabelInput
                                field={field}
                                type="date"
                                placeholder="Select Disbursed Date"
                                icon={Calendar}
                                error={errors?.loan?.[index]?.loanDistrubutedDate}
                                disabled={!canEdit || !watch(`loan.${index}.loanDistrubutedAmount`) || !!watch(`loan.${index}.loanDistrubutedDate`)}
                                value={
                                  field.value &&
                                  new Date(field.value).toString() !== "Invalid Date"
                                    ? new Date(field.value).toISOString().split("T")[0]
                                    : ""
                                }
                                onChange={(e) => field.onChange(new Date(e.target.value))}
                              />
                            )}
                          />
                          <ErrorMessage error={errors?.loan?.[index]?.loanDistrubutedDate} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Add Split button - show when no fields exist or when there are existing fields */}
                  <button
                    type="button"
                    onClick={() => {
                      append({
                        loan: true,
                        loanDistrubutedAmount: '',
                        loanDistrubutedDate: '',
                      });
                    }}
                    disabled={!canEdit}
                    className="w-full flex items-center gap-2 px-4 py-2 text-[#6366F1] hover:text-[#5B5FEF] hover:bg-[#6366F1]/10 rounded-xl font-medium transition-all duration-200 justify-center"
                  >
                    <Plus className="w-4 h-4" />
                    Add Loan
                  </button>
                </div>
              </div>
            </FormSection>
          )}
          {/* Balance Splits Section */}
          <FormSection title="Balance Splits" icon={Split}>
      <div>
              <Controller
                name="numberOfSplits"
                control={control}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={{
                      ...field,
                      value: numberOfSplits === 0 ? "" : numberOfSplits
                    }}
                    type="number"
                    placeholder="Number of Splits"
                    icon={Split}
                    error={errors?.numberOfSplits}
                    disabled={!canEdit}
                    min="0"
                    max="10"
                    onChange={e => {
                      const value = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                      setNumberOfSplits(value);
                      field.onChange(value);
                      if (value === 0) {
                        setValue("balanceAmountSplits", []);
                        return;
                      }
                      const currentBalance = calculateBalance();
                      const equalSplit = parseFloat((currentBalance / value).toFixed(2));
                      const newSplits = Array.from({ length: value }, () => ({
                        amount: equalSplit, 
                        date: null,
                        comment: ""
                      }));
                      setValue("balanceAmountSplits", newSplits);
                    }}
                    onWheel={(e) => e.target.blur()}
                  />
                )}
              />
              <ErrorMessage error={errors?.numberOfSplits} />
            </div>
            <div className="lg:col-span-2">
              {/* Balance Amount Splits */}
              {numberOfSplits > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-indigo-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#6366F1]/10 dark:bg-[#6366F1]/20 rounded-xl">
                        <Split className="w-6 h-6 text-[#6366F1]" />
      </div>
      <div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white">Balance Amount Splits</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Pending payment splits</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {balanceAmountFields.map((item, index) => (
                      <div key={item.id} className="w-full p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="w-full">
                            <Controller
                              name={`balanceAmountSplits.${index}.amount`}
                              control={control}
                              render={({ field }) => (
                                <FloatingLabelInput
                                  field={field}
                                  type="number"
                                  placeholder="Enter Amount (₹)"
                                  icon={IndianRupee}
                                  error={errors?.balanceAmountSplits?.[index]?.amount}
                                  disabled={!canEdit || !!watch(`balanceAmountSplits.${index}.comment`)}
                                  min="0"
                                  value={field.value === 0 ? "" : field.value}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const newValue = value === "" ? 0 : Number(value);
                                    const currentTotal = watch("balanceAmountSplits")?.reduce((sum, item, idx) => {
                                      if (idx === index) return sum;
                                      return sum + (Number(item?.amount) || 0);
                                    }, 0) || 0;
                                    const potentialTotal = currentTotal + Number(newValue);
                                    const remainingBalance = calculateBalance();
                                    if (potentialTotal > remainingBalance) {
                                      showErrorToast("Split amount cannot exceed remaining balance");
                                      return;
                                    }
                                    field.onChange(newValue);
                                  }}
                                  onWheel={(e) => e.target.blur()}
                                />
                              )}
                            />
                            <ErrorMessage error={errors?.balanceAmountSplits?.[index]?.amount} />
                          </div>
                          <div className="w-full">
                            <Controller
                              name={`balanceAmountSplits.${index}.date`}
                              control={control}
                              rules={{ required: "Date is required" }}
                              render={({ field }) => (
                                <FloatingLabelInput
                                  field={field}
                                  type="date"
                                  placeholder="Select Date"
                                  icon={Calendar}
                                  error={errors?.balanceAmountSplits?.[index]?.date}
                                  disabled={!canEdit || !watch(`balanceAmountSplits.${index}.amount`) || !!watch(`balanceAmountSplits.${index}.comment`)}
                                  required={watch(`balanceAmountSplits.${index}.amount`)}
                                  value={
                                    field.value &&
                                    new Date(field.value).toString() !== "Invalid Date"
                                      ? new Date(field.value).toISOString().split("T")[0]
                                      : ""
                                  }
                                  onChange={(e) => field.onChange(new Date(e.target.value))}
                                />
                              )}
                            />
                            <ErrorMessage error={errors?.balanceAmountSplits?.[index]?.date} />
                          </div>
                          <div className="w-full">
                            <Controller
                              name={`balanceAmountSplits.${index}.comment`}
                              control={control}
                              render={({ field }) => (
                                <FloatingLabelInput
                                  field={field}
                                  type="text"
                                  placeholder="Add a comment..."
                                  icon={MessageCircle}
                                  disabled={!canEdit || !watch(`balanceAmountSplits.${index}.amount`) || !watch(`balanceAmountSplits.${index}.date`)}
                                />
                              )}
                            />
                          </div>
                        </div>
                        {/* Mark as Paid Button */}
                        {watch(`balanceAmountSplits.${index}.amount`) &&
                          watch(`balanceAmountSplits.${index}.date`) &&
                          watch(`balanceAmountSplits.${index}.comment`) && (
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleSplitCheckbox(index)}
                                disabled={!canEdit}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                              >
                                <Check className="w-4 h-4" />
                                Mark as Paid
                              </button>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Balance Amount Splits Paid */}
              {balanceAmountSplitsPaidFields.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-green-600" />
      </div>
      <div>
                        <h4 className="text-lg font-bold text-gray-800">Balance Amount Splits Paid</h4>
                        <p className="text-sm text-gray-600">Completed payment splits</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {balanceAmountSplitsPaidFields.map((item, index) => (
                      <div key={item.id} className="w-full p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="w-full">
                            <Controller
                              name={`balanceAmountSplitsPaid.${index}.amount`}
                              control={control}
                              render={({ field }) => (
                                <FloatingLabelInput
                                  field={field}
                                  type="number"
                                  placeholder="Paid Amount (₹)"
                                  icon={IndianRupee}
                                  error={errors?.balanceAmountSplitsPaid?.[index]?.amount}
                                  disabled={true}
                                  value={field.value === 0 ? "" : field.value}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value === "" ? "" : Number(value));
                                    setTimeout(() => {
                                      const newBalance = calculateBalance();
                                      setValue("balanceAmount", newBalance);
                                    }, 0);
                                  }}
                                  onWheel={(e) => e.target.blur()}
                                />
                              )}
                            />
                            <ErrorMessage error={errors?.balanceAmountSplitsPaid?.[index]?.amount} />
                          </div>
                          <div className="w-full">
                            <Controller
                              name={`balanceAmountSplitsPaid.${index}.date`}
                              control={control}
                              render={({ field }) => (
                                <FloatingLabelInput
                                  field={field}
                                  type="date"
                                  placeholder="Payment Date"
                                  icon={Calendar}
                                  error={errors?.balanceAmountSplitsPaid?.[index]?.date}
                                  disabled={true}
                                  value={
                                    field.value &&
                                    new Date(field.value).toString() !== "Invalid Date"
                                      ? new Date(field.value).toISOString().split("T")[0]
                                      : ""
                                  }
                                  onChange={(e) => {
                                    field.onChange(new Date(e.target.value));
                                    setTimeout(() => {
                                      const newBalance = calculateBalance();
                                      setValue("balanceAmount", newBalance);
                                    }, 0);
                                  }}
                                />
                              )}
                            />
                            <ErrorMessage error={errors?.balanceAmountSplitsPaid?.[index]?.date} />
                          </div>
                          <div className="w-full">
                            <Controller
                              name={`balanceAmountSplitsPaid.${index}.comment`}
                              control={control}
                              render={({ field }) => (
                                <FloatingLabelInput
                                  field={field}
                                  type="text"
                                  placeholder="Payment comment..."
                                  icon={MessageCircle}
                                  disabled={true}
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FormSection>
          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-6 justify-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={!canEdit}
              className="px-10 py-5 bg-gray-500 text-white font-semibold rounded-2xl shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={!canEdit}
              className="px-10 py-5 bg-[#6366F1] text-white font-semibold rounded-2xl shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-4 text-lg"
            >
              <Check className="w-6 h-6" />
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinanceUserForm; 