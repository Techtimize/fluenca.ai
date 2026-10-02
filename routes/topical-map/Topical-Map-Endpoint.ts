export const TOPICALMAPENDPOINT = {
  TOPICAL_MAP: '/topical-map',
  TOPICS: '/topical-map/topics',
  TOPIC: (topicId: string) => `/topical-map/topics/${topicId}`,
  APPROVE: '/topical-map/approve',
  RETRY: '/topical-map/retry',
};
