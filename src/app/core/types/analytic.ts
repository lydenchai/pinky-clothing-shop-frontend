export interface AnalyticsEvent {
  id?: number;
  type: string;
  userId?: number;
  data?: any;
  createdAt?: string;
}
