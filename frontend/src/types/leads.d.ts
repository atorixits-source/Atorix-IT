export interface BusinessLeadMetadata {
  location: string;
  priority: 'low' | 'medium' | 'high';
  value: string;
}

export interface BusinessLead {
  _id?: string; // Optional for new records
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  interests: string[];
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed' | 'lost';
  createdAt: string;
  updatedAt?: string;
  metadata: BusinessLeadMetadata;
}

// For form submission
export interface BusinessLeadFormData extends Omit<BusinessLead, '_id' | 'createdAt' | 'updatedAt' | 'status'> {
  // You can add any form-specific fields or overrides here
}
