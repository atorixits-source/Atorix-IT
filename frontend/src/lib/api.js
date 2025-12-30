/**
 * API utilities for interacting with the backend
 */

/**
 * Get the authorization header with the JWT token
 * @returns {Object} - Authorization header object
 */
export function getAuthHeader() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('atorix_auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Get API configuration from environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atorix-backend-server.onrender.com';

// Alternative API base URL configuration (from integrated file)
// Uses NEXT_PUBLIC_API_URL with fallback to render.com for production
const isDevelopment = process.env.NODE_ENV === 'development';
export const API_BASE_URL_ALT = process.env.NEXT_PUBLIC_API_URL ||
                                 (isDevelopment ? 'https://atorix-backend-server.onrender.com' : 'https://atorix-it.onrender.com');

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/admin/login',
  
  // Business Leads
  BUSINESS_LEADS: '/api/business-leads',
  
  // Job Applications
  JOB_APPLICATIONS: '/api/job-applications',
  
  // Contact & Demo Requests
  CONTACT: '/api/submit',
  DEMO_REQUESTS: '/api/demo-requests',
  
  // System
  PING: '/api/ping',
};

/**
 * Get the full API URL for an endpoint
 * @param {string} endpoint - The API endpoint (can be a full URL or path)
 * @returns {string} - Full URL
 */
export const getApiUrl = (endpoint) => {
  // If endpoint is already a full URL, return it as is
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  
  // Remove any leading slashes from the endpoint
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  
  // Remove trailing slash from base URL if it exists
  const cleanBaseUrl = API_BASE_URL.endsWith('/') 
    ? API_BASE_URL.slice(0, -1) 
    : API_BASE_URL;
    
  return `${cleanBaseUrl}/${cleanEndpoint}`;
};

// Log the API base URL for debugging
if (typeof window !== 'undefined') {
  console.log('API Base URL:', API_BASE_URL);
}

/**
 * Helper function for making API requests
 * @param {string} endpoint - API endpoint (e.g., API_ENDPOINTS.BUSINESS_LEADS)
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<Object>} - Response data
 */
/**
 * Make an API request with retry logic
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - Fetch options
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<Object>} - Response data
 */
export async function apiRequest(endpoint, options = {}, retries = 2) {
  const url = getApiUrl(endpoint);
  
  try {
    // Add default headers if not provided
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {})
    };

    // Add auth token if available (from sessionStorage)
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('atorix_auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Log request details for debugging
    console.log(`API Request: ${options.method || 'GET'} ${url}`, {
      headers,
      body: options.body ? JSON.parse(options.body) : null
    });

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Important for cookies if using sessions
    });

    // Clone the response so we can read it multiple times
    const responseClone = response.clone();
    
    // Handle 401 Unauthorized (token expired)
    if (response.status === 401) {
      // Clear auth data and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/admin/login';
      }
      throw new Error('Your session has expired. Please log in again.');
    }

    // Parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If we can't parse JSON but the response is ok, return empty object
      if (response.ok) {
        return {}; // Return empty object for successful responses with no content
      }
      
      // For non-OK responses, try to get the response text for better error messages
      try {
        const text = await responseClone.text();
        console.error('Failed to parse JSON response. Response text:', text);
        throw new Error(`Server returned invalid JSON: ${text.substring(0, 200)}`);
      } catch (textError) {
        console.error('Failed to read response text:', textError);
        throw new Error('Invalid response from server');
      }
    }

    // Log response for debugging
    console.log(`API Response (${response.status}): ${options.method || 'GET'} ${url}`, {
      status: response.status,
      statusText: response.statusText,
      data
    });

    // If response is not ok, throw an error with the message from the server
    if (!response.ok) {
      const errorMessage = data?.message || 
                         data?.error || 
                         `Request failed with status ${response.status}`;
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      
      // For 500 errors, include more context
      if (response.status >= 500) {
        console.error('Server Error Details:', {
          url,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          data
        });
      }
      
      throw error;
    }

    return data;
  } catch (error) {
    // Log the full error for debugging
    console.error('API Request Error:', {
      endpoint,
      url,
      method: options.method || 'GET',
      error: {
        name: error.name,
        message: error.message,
        status: error.status,
        stack: error.stack
      },
      retriesLeft: retries
    });

    // Determine if we should retry
    const isNetworkError = !error.status; // No status means network error
    const isServerError = error.status >= 500;
    const isRateLimit = error.status === 429;
    const shouldRetry = (isNetworkError || isServerError || isRateLimit) && retries > 0;

    if (shouldRetry) {
      const delay = isRateLimit 
        ? 5000 // Longer delay for rate limiting
        : 1000 * (3 - retries); // Exponential backoff for other errors
      
      console.warn(`Retrying request to ${endpoint} in ${delay}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiRequest(endpoint, options, retries - 1);
    }
    
    // Enhance the error with more context before rethrowing
    error.endpoint = endpoint;
    error.originalMessage = error.message;
    
    if (isNetworkError) {
      error.message = 'Unable to connect to the server. Please check your internet connection.';
    } else if (error.status >= 500) {
      error.message = 'The server encountered an error. Please try again later.';
    } else if (error.status === 404) {
      error.message = 'The requested resource was not found.';
    } else if (error.status === 403) {
      error.message = 'You do not have permission to access this resource.';
    }
    
    throw error;
  }
}

// Web3Forms API endpoint
const WEB3FORMS_API_URL = 'https://api.web3forms.com/submit';
// Your Web3Forms access key - should be stored in env variables for production
const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY_HERE';

/**
 * Submit demo request to backend
 * @param {Object} formData - The demo request data
 * @returns {Promise<Object>} - Response from the API
 */
export const submitDemoRequest = async (formData) => {
  try {
    const response = await apiRequest(API_ENDPOINTS.DEMO_REQUESTS, {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    
    return response;
  } catch (error) {
    console.error('Demo request submission error:', error);
    throw error;
  }
};

/**
 * Submit form data to Web3Forms to receive emails
 * @param {Object} formData - The form data to submit
 * @returns {Promise} - Response from the Web3Forms API
 */
export async function submitWeb3FormData(formData) {
  try {
    // Convert nested objects to strings and handle special cases
    const flattenedData = {};
    for (const [key, value] of Object.entries(formData)) {
      if (value === null || value === undefined) continue;
      
      if (typeof value === 'object' && !Array.isArray(value)) {
        // Handle nested objects by stringifying them
        flattenedData[key] = JSON.stringify(value);
      } else if (Array.isArray(value)) {
        // Handle arrays by joining with commas
        flattenedData[key] = value.join(', ');
      } else {
        flattenedData[key] = value;
      }
    }

    const response = await fetch(WEB3FORMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        ...flattenedData,
        botcheck: '',
        from_name: 'Atorix Website',
        subject: `New form submission from ${flattenedData.name || 'website'}`,
        reply_to: flattenedData.email || 'noreply@atorix.com'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Form submission failed');
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error submitting form to Web3Forms:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}

/**
 * Alternative implementation: Submit form data to Web3Forms using FormData
 * (from integrated file - uses FormData instead of JSON)
 * @param {Object} formData - The form data to submit
 * @returns {Promise} - Response from the Web3Forms API
 */
export async function submitWeb3FormDataFormData(formData) {
  try {
    // Create a new FormData instance
    const web3FormData = new FormData();

    // Add the access key
    web3FormData.append('access_key', WEB3FORMS_ACCESS_KEY);

    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      web3FormData.append(key, value);
    });

    // Optionally set subject
    if (!formData.subject) {
      web3FormData.append('subject', `New Form Submission from ${formData.name || 'Website Visitor'}`);
    }

    // You can add a hidden honeypot field to prevent spam
    web3FormData.append('botcheck', '');

    const response = await fetch(WEB3FORMS_API_URL, {
      method: 'POST',
      body: web3FormData
    });

    const data = await response.json();

    if (data.success) {
      return { success: true, data };
    } else {
      throw new Error(data.message || 'Form submission failed');
    }
  } catch (error) {
    console.error('Error submitting form to Web3Forms:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}

/**
 * Submit form data to the backend API with retry capability for cold starts
 * @param {Object} formData - The form data to submit
 * @param {Number} retries - Number of retry attempts (default: 2)
 * @param {Number} timeout - Timeout in milliseconds (default: 8000)
 * @returns {Promise} - Response from the API
 */
export async function submitFormData(formData, retries = 2, timeout = 8000) {
  // Map form data to match the backend Submission model
  const leadData = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    company: formData.company || '',
    role: formData.role || '',
    interests: formData.interests || formData.interestedIn || [],
    message: formData.message || '',
    source: 'demo', // Indicates this came from the demo form
    status: 'new',
    metadata: {
      // Add any additional metadata you want to track
      source: 'demo-form',
      ...(formData.metadata || {}) // Preserve any existing metadata
    }
  };

  // Start with retry count
  let attempts = 0;
  let lastError = null;

  // Create AbortController for the timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  while (attempts <= retries) {
    attempts++;

    try {
      // Clear any previous timeout just in case
      clearTimeout(timeoutId);

      // Set a new timeout for this attempt
      const newTimeoutId = setTimeout(() => controller.abort(), timeout);

      console.log('Submitting form data to:', `${API_BASE_URL}${API_ENDPOINTS.BUSINESS_LEADS}`);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BUSINESS_LEADS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
        signal: controller.signal
      });

      // Clear the timeout since we got a response
      clearTimeout(newTimeoutId);

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error('Received non-JSON response from server');
      }

      // Parse the JSON response
      const data = await response.json();

      // If the response is not ok, throw an error with the message from the API
      if (!response.ok) {
        throw new Error(data.message || `Server responded with status ${response.status}`);
      }

      return { success: true, data };
    } catch (error) {
      // Store the last error
      lastError = error;

      // If it's an abort error (timeout) or we've reached max retries, break
      if (error.name === 'AbortError') {
        console.warn(`Request timed out after ${timeout}ms, attempt ${attempts} of ${retries + 1}`);
      } else {
        console.warn(`Error submitting form, attempt ${attempts} of ${retries + 1}:`, error);
      }

      // If we have retries left, wait before trying again (exponential backoff)
      if (attempts <= retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts - 1)));
      } else {
        // No more retries
        break;
      }
    }
  }

  // If we've exhausted all retries, return the error
  console.error('Error submitting form after all retries:', lastError);
  return {
    success: false,
    error: (lastError && lastError.message) || 'An unexpected error occurred'
  };
}

/**
 * Alternative implementation: Submit form data to /api/submit endpoint
 * (from integrated file - uses /api/submit instead of /api/business-leads)
 * @param {Object} formData - The form data to submit
 * @param {Number} retries - Number of retry attempts (default: 2)
 * @param {Number} timeout - Timeout in milliseconds (default: 8000)
 * @returns {Promise} - Response from the API
 */
export async function submitFormDataToContact(formData, retries = 2, timeout = 8000) {
  // Start with retry count
  let attempts = 0;
  let lastError = null;

  // Create AbortController for the timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  while (attempts <= retries) {
    attempts++;

    try {
      // Clear any previous timeout just in case
      clearTimeout(timeoutId);

      // Set a new timeout for this attempt
      const newTimeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${API_BASE_URL_ALT}/api/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });

      // Clear the timeout since we got a response
      clearTimeout(newTimeoutId);

      // Parse the JSON response
      const data = await response.json();

      // If the response is not ok, throw an error with the message from the API
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred while submitting the form');
      }

      return { success: true, data };
    } catch (error) {
      // Store the last error
      lastError = error;

      // If it's an abort error (timeout) or we've reached max retries, break
      if (error.name === 'AbortError') {
        console.warn(`Request timed out after ${timeout}ms, attempt ${attempts} of ${retries + 1}`);
      } else {
        console.warn(`Error submitting form, attempt ${attempts} of ${retries + 1}:`, error);
      }

      // If we have retries left, wait before trying again (exponential backoff)
      if (attempts <= retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts - 1)));
      } else {
        // No more retries
        break;
      }
    }
  }

  // If we've exhausted all retries, return the error
  console.error('Error submitting form after all retries:', lastError);
  return {
    success: false,
    error: (lastError && lastError.message) || 'An unexpected error occurred'
  };
}

/**
 * Normalize form data to match the backend API's expected structure
 *
 * Backend Schema:
 * - name: String (required)
 * - email: String (required)
 * - phone: String (required) - Phone number
 * - company: String (optional)
 * - role: String (optional)
 * - interestedIn: Array of String (optional)
 * - message: String (optional)
 *
 * @param {Object} formData - Raw form data from components
 * @returns {Object} - Normalized form data
 */
export function normalizeFormData(formData) {
  // Create the normalized structure to match backend schema
  const normalizedData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    interestedIn: [],
    message: '',
  };

  // Process name field
  if (formData.firstName && formData.lastName) {
    // If we have first name and last name separate, combine them
    normalizedData.name = `${formData.firstName} ${formData.lastName}`.trim();
  } else if (formData.name) {
    // Otherwise use the name field directly
    normalizedData.name = formData.name.trim();
  }

  // Email field (same name in both frontend and backend)
  normalizedData.email = formData.email ? formData.email.trim() : '';

  // Map phone field (frontend might use 'phone' or legacy 'contact')
  normalizedData.phone = formData.phone ? formData.phone.trim() :
                        (formData.contact ? formData.contact.trim() : '');

  // Company field (same name in backend)
  normalizedData.company = formData.company ? formData.company.trim() : '';

  // Role field (same name in backend)
  normalizedData.role = formData.role ? formData.role.trim() : '';

  // Interested in fields (from checkbox group in demo form)
  if (formData.interests && Array.isArray(formData.interests)) {
    normalizedData.interestedIn = formData.interests.map(interest => interest.trim());
  }

  // Message field (same name in backend)
  normalizedData.message = formData.message ? formData.message.trim() : '';

  return normalizedData;
}

/**
 * Fetch all form submissions from the backend
 * @returns {Promise} - Response from the API with form submissions
 */
export async function fetchFormSubmissions() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/submissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch form submissions');
    }

    return { success: true, data: data.submissions || [] };
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      data: []
    };
  }
}

/**
 * Delete a single form submission
 * @param {string} id - The ID of the submission to delete
 * @returns {Promise} - Response from the API
 */
export async function deleteFormSubmission(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/submissions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete submission');
    }

    return { success: true, message: 'Submission deleted successfully' };
  } catch (error) {
    console.error('Error deleting form submission:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}

/**
 * Delete multiple form submissions
 * @param {Array<string>} ids - The IDs of the submissions to delete
 * @returns {Promise} - Response from the API
 */
export async function deleteBulkFormSubmissions(ids) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/submissions/bulk-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete submissions');
    }

    return {
      success: true,
      message: `${ids.length} submissions deleted successfully`
    };
  } catch (error) {
    console.error('Error deleting form submissions:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}

/**
 * Export form submissions to Excel format
 * @param {Array} submissions - The submissions to export
 * @returns {Blob} - Excel file as a Blob
 */
export function exportToExcel(submissions) {
  // We'll use client-side approach to create an Excel file
  // This is a simple implementation - in production, consider using a library like XLSX or ExcelJS

  // Create CSV content
  let csvContent = "ID,Name,Email,Phone,Company,Role,Message,Date\n";

  submissions.forEach(sub => {
    // Format date
    const date = sub.createdAt ? new Date(sub.createdAt).toLocaleString() : 'N/A';

    // Escape fields to handle commas within fields
    const escapeCsv = (field) => {
      const value = field || '';
      return `"${value.replace(/"/g, '""')}"`;
    };

    // Add row to CSV
    csvContent += [
      escapeCsv(sub._id || sub.id),
      escapeCsv(sub.name),
      escapeCsv(sub.email),
      escapeCsv(sub.phone),
      escapeCsv(sub.company),
      escapeCsv(sub.role),
      escapeCsv(sub.message),
      escapeCsv(date)
    ].join(',') + '\n';
  });

  // Create Blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  return blob;
}

/**
 * Submit a job application
 * @param {Object} formData - The job application data
 * @param {File} [resume=null] - Optional resume file
 * @returns {Promise<{success: boolean, data?: any, message?: string}>} - Response from the API
 */
export async function submitJobApplication(formData, resume = null) {
  const url = `${API_BASE_URL}${API_ENDPOINTS.JOB_APPLICATIONS}`;
  console.log('Sending request to:', url);
  
  // Create a clean copy of formData to avoid mutating the original
  const cleanFormData = { ...formData };
  
  // Ensure required fields are present and have values
  if (!cleanFormData.fullName) {
    // If fullName is not provided but firstName and lastName are, combine them
    if (cleanFormData.firstName || cleanFormData.lastName) {
      cleanFormData.fullName = `${cleanFormData.firstName || ''} ${cleanFormData.lastName || ''}`.trim();
    }
  }
  
  // Remove any undefined or null values
  Object.keys(cleanFormData).forEach(key => {
    if (cleanFormData[key] === undefined || cleanFormData[key] === null) {
      delete cleanFormData[key];
    }
  });
  
  // Log the data being sent for debugging
  console.log('Submitting form data:', cleanFormData);
  
  // Always use FormData when there's a file
  const useFormData = resume !== null;
  const payload = useFormData ? new FormData() : {};
  
  // Prepare the payload
  if (useFormData) {
    // For FormData, append all fields
    Object.entries(cleanFormData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          payload.append(key, value.join(','));
        } else if (value instanceof Date) {
          payload.append(key, value.toISOString());
        } else if (typeof value === 'object') {
          payload.append(key, JSON.stringify(value));
        } else {
          payload.append(key, value);
        }
      }
    });
    
    if (resume) {
      console.log('Including resume file:', {
        name: resume.name,
        size: `${(resume.size / 1024).toFixed(2)} KB`,
        type: resume.type
      });
      payload.append('resume', resume);
    }
  } else {
    // For JSON, clean up the data
    Object.assign(payload, cleanFormData);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.JOB_APPLICATIONS}`, {
      method: 'POST',
      // Let browser set the correct Content-Type with boundary for FormData
      headers: useFormData ? {} : { 'Content-Type': 'application/json' },
      body: useFormData ? payload : JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      return { 
        success: false, 
        message: 'Server returned invalid response',
        error: e.message,
        responseText
      };
    }

    if (!response.ok) {
      console.error('Job application submission failed:', {
        status: response.status,
        statusText: response.statusText,
        responseData,
        requestData: useFormData ? Object.fromEntries(payload) : formData
      });
      
      return { 
        success: false, 
        message: responseData.message || `Server error: ${response.status}`,
        status: response.status,
        data: responseData
      };
    }

    console.log('Job application submitted successfully:', responseData);
    return { success: true, data: responseData };
  } catch (error) {
    console.error('Network error:', {
      error: error.message,
      formData: useFormData ? Object.fromEntries(payload) : formData,
      hasResume: !!resume
    });
    
    return { 
      success: false, 
      message: `Network error: ${error.message}`,
      error: error.message
    };
  }
}

/**
 * Ping the backend to wake it up from render.com
 * @returns {Promise<void>}
 */
export async function pingBackend() {
  if (typeof window !== 'undefined') {
    setTimeout(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await fetch(`${API_BASE_URL}${API_ENDPOINTS.PING}`, {
          method: 'GET',
          signal: controller.signal
        });

        clearTimeout(timeoutId);
      } catch (error) {
        // Silent fail for ping
      }
    }, 100);
  }
}
