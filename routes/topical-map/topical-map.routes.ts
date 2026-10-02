import { TOPICALMAPENDPOINT } from "./Topical-Map-Endpoint";
import api from "../apiClient";
import type {
  AddTopicRequest,
  TopicalMapResponseProps,
  UpdateTopicRequest,
} from "@/types/bussiness/topical-map-type";

export const TopicalMapApi = async (): Promise<TopicalMapResponseProps> => {
  const response = await api.get(TOPICALMAPENDPOINT.TOPICAL_MAP);
  return response.data;
};

export const AddTopicApi = async (data: AddTopicRequest): Promise<TopicalMapResponseProps> => {
  const response = await api.post(TOPICALMAPENDPOINT.TOPICS, data);
  return response.data;
};

export const UpdateTopicApi = async (
  topicId: string,
  data: UpdateTopicRequest,
): Promise<TopicalMapResponseProps> => {
  const response = await api.patch(TOPICALMAPENDPOINT.TOPIC(topicId), data);
  return response.data;
};

export const DeleteTopicApi = async (topicId: string): Promise<TopicalMapResponseProps> => {
  const response = await api.delete(TOPICALMAPENDPOINT.TOPIC(topicId));
  return response.data;
};

export const ApproveTopicalMapApi = async (): Promise<TopicalMapResponseProps> => {
  const response = await api.post(TOPICALMAPENDPOINT.APPROVE);
  return response.data;
};

export const RetryTopicalMapApi = async (): Promise<TopicalMapResponseProps> => {
  const response = await api.post(TOPICALMAPENDPOINT.RETRY);
  return response.data;
};
