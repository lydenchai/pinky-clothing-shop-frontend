export interface AnalyticsEvent {
  _id?: string;
  type: string;
  user_id?: string;
  data?: any;
  created_at?: string;
}
