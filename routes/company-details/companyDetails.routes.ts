import { BUSSINESSENDPOINT } from "../bussiness/Bussiness-Endpoint";
import api from "../apiClient";
import { AnswerQuestionRequestProps, IntakeQuestion, IntakeResponseProps } from "@/types/company-details-type";


export const IntakeApi = async (): Promise<IntakeResponseProps> => {
    const response = await api.get(BUSSINESSENDPOINT.INTAKE);
    return response.data;
}

export const CompleteIntakeApi = async (): Promise<IntakeResponseProps> => {
    const response = await api.post(BUSSINESSENDPOINT.INTAKE_COMPLETE);
    return response.data;
}

export const AnswerQuestionApi = async ({ question_id, answer }: AnswerQuestionRequestProps): Promise<IntakeQuestion> => {
    const response = await api.patch(BUSSINESSENDPOINT.INTAKE_QUESTION(question_id), { answer });
    return response.data;
}
