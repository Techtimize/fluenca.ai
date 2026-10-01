export interface User {
    user_id: string;
    company_id: string | null;
    email: string;
    contact_person: string | null;
    phone: string | null;
    company_name: string | null;
    industry: string | null;
    role: string;
    status: string;
    onboarded_complete?: boolean;
    onboarding_completed?: boolean;
    created_at: string;
    updated_at: string;
}

export interface LoginRequestProps {
    email: string;
    password: string;
}

export interface LoginResponseProps {
    message: string;
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User;
}