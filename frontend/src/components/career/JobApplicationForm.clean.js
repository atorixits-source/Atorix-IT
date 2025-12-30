import { useState } from 'react';
import Head from 'next/head';
import { submitJobApplication } from '@/lib/api';

export default function JobApplicationForm() {
  // State to handle form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: 'Frontend developer',
    experience: '',
    currentCompany: '',
    expectedSalary: '0',
    noticePeriod: '',
    coverLetter: '',
    source: 'Career Portal',
    education: '',
    address: '',
    city: '',
    dob: '',
    startDate: new Date().toISOString().split('T')[0],
    consent: false,
  });
  
  // State to handle submission status
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  // Handle text and checkbox changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    setSubmitting(true);

    if (!formData.consent) {
      setError('You must agree to the data processing terms.');
      setStatus('idle');
      setSubmitting(false);
      return;
    }

    // Basic validation
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'position',
      'education', 'address', 'city', 'dob', 'startDate'
    ];
    const missingFields = requiredFields.filter(field => !formData[field]?.trim());
    
    if (missingFields.length > 0) {
      const fieldNames = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        position: 'Position',
        education: 'Education',
        address: 'Address',
        city: 'City',
        dob: 'Date of Birth',
        startDate: 'Available Start Date'
      };
      
      setError(`Please fill in all required fields: ${missingFields.map(f => fieldNames[f] || f).join(', ')}`);
      setStatus('idle');
      setSubmitting(false);
      return;
    }

    try {
      // Submit the form
      const result = await submitJobApplication(formData);
      
      if (result.success) {
        setStatus('success');
        // Reset form after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          position: 'Frontend developer',
          experience: '',
          currentCompany: '',
          expectedSalary: '0',
          noticePeriod: '',
          coverLetter: '',
          source: 'Career Portal',
          education: '',
          address: '',
          city: '',
          dob: '',
          startDate: new Date().toISOString().split('T')[0],
          consent: false,
        });
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setStatus('error');
      
      // Provide more user-friendly error messages
      let errorMessage = 'An error occurred while submitting the application. Please try again.';
      
      if (error.message.includes('NetworkError')) {
        errorMessage = 'Cannot connect to the server. Please check your internet connection.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later or contact support if the problem persists.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Application Submitted!</strong>
          <span className="block sm:inline"> Thank you for your application. We'll review your information and get back to you soon.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Head>
        <title>Job Application - Atorix</title>
        <meta name="description" content="Apply for a position at Atorix" />
      </Head>
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Job Application</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John"
              required
            />
          </div>
          
          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Doe"
              required
            />
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@example.com"
              required
            />
          </div>
          
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
          
          {/* Date of Birth */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Available Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Available Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Address */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="123 Main St"
              required
            />
          </div>
          
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="New York"
              required
            />
          </div>
          
          {/* Education */}
          <div>
            <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
              Education <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="education"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Bachelor's in Computer Science"
              required
            />
          </div>
          
          {/* Position */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Years of Experience */}
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <select 
              id="experience"
              name="experience" 
              value={formData.experience} 
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select experience</option>
              <option value="0-1">0-1 Years</option>
              <option value="2-5">2-5 Years</option>
              <option value="5+">5+ Years</option>
            </select>
          </div>
          
          {/* Current Company */}
          <div>
            <label htmlFor="currentCompany" className="block text-sm font-medium text-gray-700 mb-1">
              Current Company
            </label>
            <input
              type="text"
              id="currentCompany"
              name="currentCompany"
              value={formData.currentCompany}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ABC Corp"
            />
          </div>
          
          {/* Expected Salary */}
          <div>
            <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700 mb-1">
              Expected Salary
            </label>
            <input
              type="number"
              id="expectedSalary"
              name="expectedSalary"
              value={formData.expectedSalary}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 50000"
            />
          </div>
          
          {/* Notice Period */}
          <div>
            <label htmlFor="noticePeriod" className="block text-sm font-medium text-gray-700 mb-1">
              Notice Period
            </label>
            <select 
              id="noticePeriod"
              name="noticePeriod" 
              value={formData.noticePeriod} 
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select notice period</option>
              <option value="Immediate">Immediate</option>
              <option value="15 Days">15 Days</option>
              <option value="30 Days">30 Days</option>
              <option value="60 Days">60 Days</option>
            </select>
          </div>
          
          {/* Cover Letter */}
          <div className="md:col-span-2">
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us about yourself and why you're a good fit..."
            ></textarea>
          </div>
          
          {/* How did you hear about us? */}
          <div className="md:col-span-2">
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
              How did you hear about this position?
            </label>
            <select 
              id="source"
              name="source" 
              value={formData.source} 
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Career Portal">Career Portal</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Referral">Referral</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          {/* Consent Checkbox */}
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={formData.consent}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="consent" className="ml-2 block text-sm text-gray-900">
              I agree to the processing of my personal data for recruitment purposes <span className="text-red-500">*</span>
            </label>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}
