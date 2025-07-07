import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Users, BookOpen, Calendar, Home, CheckCircle, ArrowLeft } from 'lucide-react';

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
const FloatingLabelInput = ({ field, placeholder, icon: Icon, type = "text", error, rows, onKeyPress }) => (
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
        className={`w-full px-3 py-3 ${Icon ? 'pl-10' : ''} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
        placeholder={placeholder}
      />
    ) : (
      <input
        {...field}
        type={type}
        className={`w-full px-3 py-3 ${Icon ? 'pl-10' : ''} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
        placeholder={placeholder}
        onKeyPress={onKeyPress}
      />
    )}
  </div>
);

// Floating Label Select Component
const FloatingLabelSelect = ({ field, placeholder, icon: Icon, error, children }) => (
  <div className="relative">
    {Icon && (
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Icon className="w-5 h-5" />
      </div>
    )}
    <select
      {...field}
      className={`w-full px-3 py-3 ${Icon ? 'pl-10' : ''} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        error ? 'border-red-500' : 'border-gray-300'
      } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  </div>
);

// Floating Label TextArea Component
const FloatingLabelTextArea = ({ field, placeholder, rows = 4, error }) => (
  <textarea
    {...field}
    rows={rows}
    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      error ? 'border-red-500' : 'border-gray-300'
    } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
    placeholder={placeholder}
  />
);

// Error Message Component
const ErrorMessage = ({ error }) => (
  error && (
    <p className="text-red-500 text-sm mt-1">{error.message}</p>
  )
);

const EnrolUserForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode] = useState(false);
  const [agentList] = useState([
    { name: "John Doe", empId: "EMP001" },
    { name: "Jane Smith", empId: "EMP002" },
    { name: "Mike Johnson", empId: "EMP003" }
  ]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      agentName: '',
      category: '',
      course: '',
      othersCourseName: '',
      joiningDate: '',
      fatherName: '',
      fatherPhone: '',
      motherName: '',
      motherPhone: '',
      spouseName: '',
      spousePhone: '',
      currentAddress: '',
      permanentAddress: ''
    }
  });

  const selectedCourse = watch('course');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
    // Handle form submission logic here
      console.log('Form data:', data);
      alert('Candidate enrolled successfully!');
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {isEditMode ? 'Edit Candidate' : 'Enroll New Candidate'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Fill in the details below to enroll a new candidate in our program.
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

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }} 
          className="space-y-8"
          style={{ scrollBehavior: 'auto' }}
        >
          {/* Basic Details */}
          <FormSection title="Basic Information" icon={User}>
            <div>
              <Controller
                name="fullName"
                control={control}
                rules={{ required: 'Full name is required' }}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={{
                      ...field,
                      onChange: (e) => {
                        // Only allow letters, spaces, dots, and hyphens for names
                        const value = e.target.value.replace(/[^a-zA-Z\s.-]/g, '');
                        field.onChange(value);
                      }
                    }}
                    placeholder="Full Name *"
                    icon={User}
                    error={errors.fullName}
                    onKeyPress={(e) => {
                      // Prevent numbers and special characters from being typed
                      if (!/[a-zA-Z\s.-]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              />
              <ErrorMessage error={errors.fullName} />
            </div>

            <div>
              <Controller
                name="email"
                control={control}
                rules={{ 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={{
                      ...field,
                      onChange: (e) => field.onChange(e.target.value.toLowerCase())
                    }}
                    type="email"
                    placeholder="Email Address *"
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
                rules={{ required: 'Phone number is required' }}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    type="tel"
                    placeholder="Phone Number *"
                    icon={Phone}
                    error={errors.phone}
                  />
                )}
              />
              <ErrorMessage error={errors.phone} />
            </div>

            <div>
              <Controller
                name="agentName"
                control={control}
                rules={{ required: 'Agent selection is required' }}
                render={({ field }) => (
                  <FloatingLabelSelect
                    field={field}
                    placeholder="Select Agent *"
                    icon={Users}
                    error={errors.agentName}
                  >
                    {agentList.map((agent, i) => (
                      <option key={i} value={agent.name}>
                        {agent.name} ({agent.empId})
                      </option>
                    ))}
                  </FloatingLabelSelect>
                )}
              />
              <ErrorMessage error={errors.agentName} />
            </div>
          </FormSection>

          {/* Course Details */}
          <FormSection title="Course & Category" icon={BookOpen}>
            <div>
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Category selection is required' }}
                render={({ field }) => (
                  <FloatingLabelSelect
                    field={field}
                    placeholder="Select Category *"
                    error={errors.category}
                  >
                    <option value="placement">Placement</option>
                    <option value="interview_support">Interview Support</option>
                    <option value="document_services">Document Services</option>
                    <option value="course_only">Course Only</option>
                  </FloatingLabelSelect>
                )}
              />
              <ErrorMessage error={errors.category} />
            </div>

            <div>
              <Controller
                name="course"
                control={control}
                rules={{ required: 'Course selection is required' }}
                render={({ field }) => (
                  <FloatingLabelSelect
                    field={field}
                    placeholder="Select Course *"
                    error={errors.course}
                  >
                    <option value="software_development">Software Development (6 months)</option>
                    <option value="software_testing">Software Testing (4 months)</option>
                    <option value="othersCourse">Others</option>
                  </FloatingLabelSelect>
                )}
              />
              <ErrorMessage error={errors.course} />
            </div>

            {selectedCourse === "othersCourse" && (
              <div className="lg:col-span-2">
                <Controller
                  name="othersCourseName"
                  control={control}
                  rules={{ required: 'Please specify the course name' }}
                  render={({ field }) => (
                    <FloatingLabelInput
                      field={field}
                      placeholder="Specify Other Course *"
                      error={errors.othersCourseName}
                    />
                  )}
                />
                <ErrorMessage error={errors.othersCourseName} />
              </div>
            )}

            <div>
              <Controller
                name="joiningDate"
                control={control}
                rules={{ required: 'Joining date is required' }}
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
                    placeholder="Joining Date *"
                    icon={Calendar}
                    error={errors.joiningDate}
                  />
                )}
              />
              <ErrorMessage error={errors.joiningDate} />
            </div>
          </FormSection>

          {/* Family Details */}
          <FormSection title="Family Information" icon={Users}>
            <div>
              <Controller
                name="fatherName"
                control={control}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={{
                      ...field,
                      onChange: (e) => {
                        // Only allow letters, spaces, dots, and hyphens for names
                        const value = e.target.value.replace(/[^a-zA-Z\s.-]/g, '');
                        field.onChange(value);
                      }
                    }}
                    placeholder="Father's Name"
                    icon={User}
                    onKeyPress={(e) => {
                      // Prevent numbers and special characters from being typed
                      if (!/[a-zA-Z\s.-]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="fatherPhone"
                control={control}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    type="tel"
                    placeholder="Father's Phone"
                    icon={Phone}
                    error={errors.fatherPhone}
                  />
                )}
              />
              <ErrorMessage error={errors.fatherPhone} />
            </div>

            <div>
              <Controller
                name="motherName"
                control={control}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={{
                      ...field,
                      onChange: (e) => {
                        // Only allow letters, spaces, dots, and hyphens for names
                        const value = e.target.value.replace(/[^a-zA-Z\s.-]/g, '');
                        field.onChange(value);
                      }
                    }}
                    placeholder="Mother's Name"
                    icon={User}
                    onKeyPress={(e) => {
                      // Prevent numbers and special characters from being typed
                      if (!/[a-zA-Z\s.-]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="motherPhone"
                control={control}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    type="tel"
                    placeholder="Mother's Phone"
                    icon={Phone}
                    error={errors.motherPhone}
                  />
                )}
              />
              <ErrorMessage error={errors.motherPhone} />
            </div>

            <div>
              <Controller
                name="spouseName"
                control={control}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={{
                      ...field,
                      onChange: (e) => {
                        // Only allow letters, spaces, dots, and hyphens for names
                        const value = e.target.value.replace(/[^a-zA-Z\s.-]/g, '');
                        field.onChange(value);
                      }
                    }}
                    placeholder="Spouse's Name"
                    icon={User}
                    onKeyPress={(e) => {
                      // Prevent numbers and special characters from being typed
                      if (!/[a-zA-Z\s.-]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="spousePhone"
                control={control}
                render={({ field }) => (
                  <FloatingLabelInput
                    field={field}
                    type="tel"
                    placeholder="Spouse's Phone"
                    icon={Phone}
                    error={errors.spousePhone}
                  />
                )}
              />
              <ErrorMessage error={errors.spousePhone} />
            </div>
          </FormSection>

          {/* Address Details */}
          <FormSection title="Address Information" icon={Home}>
      <div>
              <Controller
                name="currentAddress"
                control={control}
                render={({ field }) => (
                  <FloatingLabelTextArea
                    field={field}
                    placeholder="Current Address"
                    rows={4}
                  />
                )}
              />
      </div>

      <div>
              <Controller
                name="permanentAddress"
                control={control}
                render={({ field }) => (
                  <FloatingLabelTextArea
                    field={field}
                    placeholder="Permanent Address"
                    rows={4}
                  />
                )}
              />
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
              disabled={isSubmitting}
              className="px-10 py-5 bg-[#6366F1] text-white font-semibold rounded-2xl shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-4 text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {isEditMode ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  {isEditMode ? 'Update Candidate' : 'Enroll Candidate'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrolUserForm; 