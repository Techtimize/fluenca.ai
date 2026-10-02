import { AUTHENDPOINT } from "./Auth-Endpoint";
import api from "../apiClient";
import { LoginRequestProps, LoginResponseProps } from "@/types/Auth/login-type";
import {
    SignUpRequestProps,
    SignUpResponseProps,
    VerifyOtpRequestProps,
    ResendOtpRequestProps,
    ResendOtpResponseProps,
} from "@/types/Auth/signup-type";


export const LoginApi = async (data: LoginRequestProps): Promise<LoginResponseProps> => {
    const response = await api.post(AUTHENDPOINT.LOGIN, data);
    return response.data;
}

export const SignupApi = async (data: SignUpRequestProps): Promise<SignUpResponseProps> => {
    const response = await api.post(AUTHENDPOINT.SIGNUP, data);
    return response.data;
}

export const VerifyOtpApi = async (data: VerifyOtpRequestProps): Promise<LoginResponseProps> => {
    const response = await api.post(AUTHENDPOINT.VERIFY_OTP, data);
    return response.data;
}

export const ResendOtpApi = async (data: ResendOtpRequestProps): Promise<ResendOtpResponseProps> => {
    const response = await api.post(AUTHENDPOINT.RESEND_OTP, data);
    return response.data;
}

export const MeApi = async () => {
    const response = await api.get(AUTHENDPOINT.ME);
    return response.data;
}
