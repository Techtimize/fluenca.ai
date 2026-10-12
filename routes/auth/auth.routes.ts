import { AUTHENDPOINT } from "./Auth-Endpoint";
import api from "../apiClient";
import { LoginRequestProps, LoginResponseProps } from "@/types/Auth/login-type";
import { SignUpRequestProps, SignUpResponseProps } from "@/types/Auth/signup-type";


export const LoginApi = async (data: LoginRequestProps): Promise<LoginResponseProps> => {
    const response = await api.post(AUTHENDPOINT.LOGIN, data);
    return response.data;
}

export const SignupApi = async (data: SignUpRequestProps): Promise<SignUpResponseProps> => {
    const response = await api.post(AUTHENDPOINT.SIGNUP, data);
    return response.data;
}

export const MeApi = async (accessToken?: string) => {
    const response = await api.get(
        AUTHENDPOINT.ME,
        accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
    );
    return response.data;
}

export const googleLoginUrl = () => `${process.env.NEXT_PUBLIC_BACKEND_URL}${AUTHENDPOINT.GOOGLE_LOGIN}`;
