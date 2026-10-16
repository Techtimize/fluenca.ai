/** POST /contact-us — stored in contact_requests */
export interface ContactUsRequest {
  work_email: string;
  /** ISO date-time with timezone, e.g. "2026-10-20T13:00:00Z"; required */
  date: string;
  company_name?: string;
  message?: string;
  phone_number?: string;
  plan?: string;
}

export interface ContactUsResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}
