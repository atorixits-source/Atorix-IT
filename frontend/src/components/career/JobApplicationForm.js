

import React, { useState } from 'react';
import { submitJobApplication } from '@/lib/api';
import Head from 'next/head';
 
export default function JobApplicationForm() {
  // State to handle form fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: 'Frontend developer',
    experience: '',
    currentCompany: '',
    expectedSalary: '',
    noticePeriod: '',
    coverLetter: '',
    source: 'Career Portal',
    consent: false,
  });
 
  // State to handle file and submission status
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'submitting' | 'success' | 'error'
  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
 
  // Handle text and checkbox changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
 
  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };
 
  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');
 
    if (!formData.consent) {
      setError('You must agree to the data processing terms.');
      setStatus('idle');
      return;
    }

    // Basic validation
    const requiredFields = ['fullName', 'email', 'phone', 'position'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ').replace('fullName', 'Full Name')}`);
      setStatus('idle');
      return;
    }

    try {
      setStatus('submitting');

      // Log form data for debugging
      console.log('Form data being submitted:', {
        ...formData,
        resume: resume ? `${resume.name} (${(resume.size / 1024 / 1024).toFixed(2)} MB)` : 'No resume'
      });
     
      // Submit the form
      const result = await submitJobApplication(formData, resume);
     
      if (result.success) {
        setStatus('success');
        // Reset form after successful submission
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          position: 'Frontend developer',
          experience: '',
          currentCompany: '',
          expectedSalary: '',
          noticePeriod: '',
          coverLetter: '',
          source: 'Career Portal',
          consent: false,
        });
        setResume(null);
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
 
  return (
    <>
      <Head>
        <title>Job Application</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
 
      <div className="page-wrapper">
        <div className="form-container">
          <div className="form-header">
            <h2>Job Application</h2>
            <button className="close-btn">&times;</button>
          </div>
 
          {status === 'success' ? (
            <div className="success-message">
              <h3>Application Submitted!</h3>
              <p>Thank you for applying. We will be in touch shortly.</p>
              <button onClick={() => window.location.reload()} className="submit-btn" style={{marginTop: '20px', width: 'auto', padding: '10px 30px'}}>
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Row 1 */}
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name <span className="required">*</span></label>
                  <input
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Email <span className="required">*</span></label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
 
              {/* Row 2 */}
              <div className="form-row">
                <div className="form-group">
                  <label>Phone <span className="required">*</span></label>
                  <input
                    name="phone"
                    type="text"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                  />
                </div>
                <div className="form-group">
                  <label>Position <span className="required">*</span></label>
                  <input
                    name="position"
                    type="text"
                    required
                    value={formData.position}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
 
              {/* Row 3 */}
              <div className="form-row">
                <div className="form-group">
                  <label>Years of Experience</label>
                  <div className="select-wrapper">
                    <select name="experience" value={formData.experience} onChange={handleInputChange}>
                      <option value="" disabled>Select experience</option>
                      <option value="0-1">0-1 Years</option>
                      <option value="2-5">2-5 Years</option>
                      <option value="5+">5+ Years</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Current Company</label>
                  <input
                    name="currentCompany"
                    type="text"
                    value={formData.currentCompany}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
 
              {/* Row 4 */}
              <div className="form-row">
                <div className="form-group">
                  <label>Expected Salary</label>
                  <input
                    name="expectedSalary"
                    type="number"
                    value={formData.expectedSalary}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Notice Period</label>
                  <div className="select-wrapper">
                    <select name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange}>
                      <option value="" disabled>Select notice period</option>
                      <option value="Immediate">Immediate</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days">30 Days</option>
                    </select>
                  </div>
                </div>
              </div>
 
              {/* Row 5: Resume Upload */}
              <div className="form-group full-width mb-15">
                <label>Resume</label>
                <div className="file-upload">
                  <span className="upload-text">
                    {resume ? resume.name : "Upload a file or drag and drop"}
                  </span>
                  <span className="upload-subtext">PDF, DOC, DOCX up to 5MB</span>
                  <input type="file" className="hidden-input" onChange={handleFileChange} />
                </div>
              </div>
 
              {/* Row 6: Cover Letter */}
              <div className="form-group full-width mb-15">
                <label>Cover Letter</label>
                <textarea
                  name="coverLetter"
                  rows="4"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  placeholder="Introduce yourself..."
                />
              </div>
 
              {/* Row 7: Source */}
              <div className="form-group full-width mb-10">
                <label>How did you hear about this position?</label>
                <div className="select-wrapper">
                  <select name="source" value={formData.source} onChange={handleInputChange}>
                    <option value="Career Portal">Career Portal</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
              </div>
 
              {/* Row 8: Consent */}
              <div className="checkbox-group">
                <input
                  name="consent"
                  type="checkbox"
                  id="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                />
                <label htmlFor="consent">
                  I agree to the processing of my personal data for recruitment purposes <span className="required">*</span>
                </label>
              </div>
 
              {/* Row 9: Submit */}
              <button
                type="submit"
                className="submit-btn"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
              </button>
             
              {status === 'error' && (
                <p className="error-text">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
 
      <style jsx>{`
        /* DARK THEME VARIABLES */
        :root {
          --bg-page: #0d1117;
          --bg-card: #161b22;
          --border-color: #30363d;
          --text-primary: #c9d1d9;
          --text-secondary: #8b949e;
          --input-bg: #0d1117;
          --primary-blue: #1f6feb;
          --danger: #f85149;
        }
 
        .page-wrapper {
          background-color: #0d1117;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
 
        .form-container {
          background: #161b22;
          width: 100%;
          max-width: 700px;
          border-radius: 8px;
          padding: 30px;
          position: relative;
          border: 1px solid #30363d;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }
 
        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          border-bottom: 1px solid #30363d;
          padding-bottom: 15px;
        }
 
        .form-header h2 {
          font-size: 24px;
          color: #c9d1d9;
          font-weight: 600;
          margin: 0;
        }
 
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #8b949e;
          cursor: pointer;
        }
       
        .close-btn:hover {
          color: #c9d1d9;
        }
 
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 15px;
        }
 
        .form-group {
          display: flex;
          flex-direction: column;
        }
 
        .full-width {
          grid-column: 1 / -1;
        }
 
        .mb-15 { margin-bottom: 15px; }
        .mb-10 { margin-bottom: 10px; }
 
        label {
          font-size: 14px;
          color: #8b949e;
          margin-bottom: 8px;
          font-weight: 500;
        }
 
        .required {
          color: #f85149;
          margin-left: 2px;
        }
 
        input[type="text"],
        input[type="email"],
        input[type="number"],
        select,
        textarea {
          padding: 10px 12px;
          border: 1px solid #30363d;
          background-color: #0d1117;
          border-radius: 6px;
          font-size: 15px;
          color: #c9d1d9;
          width: 100%;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
 
        input:focus, select:focus, textarea:focus {
          border-color: #1f6feb;
          box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.3);
        }
       
        input::placeholder, textarea::placeholder {
          color: #484f58;
        }
 
        .file-upload {
          border: 2px dashed #30363d;
          border-radius: 6px;
          padding: 30px;
          text-align: center;
          background-color: #0d1117;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
 
        .file-upload:hover {
          border-color: #8b949e;
          background-color: #13171f;
        }
 
        .upload-text {
          color: #58a6ff;
          font-weight: 500;
          margin-bottom: 5px;
          display: block;
        }
 
        .upload-subtext {
          color: #8b949e;
          font-size: 12px;
        }
 
        .hidden-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
 
        .checkbox-group {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 20px 0;
        }
 
        .checkbox-group input {
          margin-top: 4px;
          accent-color: #1f6feb;
        }
 
        .checkbox-group label {
          font-size: 13px;
          color: #8b949e;
          line-height: 1.4;
        }
 
        .submit-btn {
          background-color: #238636;
          color: white;
          border: 1px solid rgba(240, 246, 252, 0.1);
          width: 100%;
          padding: 12px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
 
        .submit-btn:hover {
          background-color: #2ea043;
        }
       
        .submit-btn:disabled {
          background-color: #21262d;
          color: #8b949e;
          cursor: not-allowed;
        }
       
        .success-message {
          text-align: center;
          color: #3fb950;
          padding: 40px 0;
        }
       
        .error-text {
          color: #f85149;
          text-align: center;
          margin-top: 10px;
        }
 
        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
     
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          background-color: #0d1117;
        }
      `}</style>
    </>
  );
}