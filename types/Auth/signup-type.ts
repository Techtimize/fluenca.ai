export type SignUpRequestProps = {
    email: string;
    password: string;
    confirm_password: string;
}

export interface User {
    user_id: string;
    company_name: string;
    email: string;
    contact_person: string;
    phone: string;
    industry: string;
    company_size: string;
    role: string;
    status: string;
    created_at: string;
    updated_at: string;
}
export type SignUpResponseProps = {
  message: string;
  email: string;
  status: string;
};

export type VerifyOtpRequestProps = {
  email: string;
  code: string;
};

export type ResendOtpRequestProps = {
  email: string;
};

export type ResendOtpResponseProps = {
  message: string;
};
