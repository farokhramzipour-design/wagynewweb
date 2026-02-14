export type UserOut = {
  user_id: number;
  phone_e164: string;
  email?: string | null;
  status: string;
  locale: string;
  timezone: string;
  last_login_at?: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type OtpStatusOut = {
  status: string;
  verified_at?: string | null;
};

export type ServiceTypeOut = {
  service_type_id: number;
  code: string;
  default_unit: string;
  is_active: boolean;
  deactivated_at?: string | null;
};

export type ProviderOut = {
  provider_id: number;
  user_id: number;
  status: string;
  headline?: string | null;
  bio?: string | null;
  years_of_experience?: number | null;
  service_radius_km?: number | null;
  is_star_sitter?: boolean | null;
  response_rate_percent?: number | null;
  avg_response_time_minutes?: number | null;
  total_completed_bookings?: number | null;
  repeat_clients_count?: number | null;
  average_rating?: number | null;
  featured?: boolean | null;
};

export type ProviderServiceStepProgressOut = {
  progress_id: number;
  provider_service_id: number;
  step_id: number;
  status: "not_started" | "in_progress" | "completed" | "rejected" | string;
  data_json?: Record<string, unknown> | null;
  completed_at?: string | null;
  review_note?: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type ServiceOnboardingStepOut = {
  step_id: number;
  flow_id: number;
  code: string;
  title_fa?: string | null;
  title_en?: string | null;
  sort_order: number;
  is_required: boolean;
  review_required: boolean;
  schema_json?: Record<string, unknown> | null;
  completion_rule_json?: Record<string, unknown> | null;
  created_at: string;
};

export type ServiceOnboardingFlowOut = {
  flow_id: number;
  service_type_id: number;
  version: number;
  name: string;
  is_active: boolean;
  created_at: string;
};

export type BookingEventOut = {
  event_id: number;
  booking_id: number;
  event_type: string;
  actor_type: string;
  actor_user_id?: number | null;
  payload_json?: Record<string, unknown> | null;
  created_at: string;
};

export type ConversationOut = {
  conversation_id: number;
  participant1_user_id: number;
  participant2_user_id: number;
  booking_id?: number | null;
  last_message_at?: string | null;
};

export type MessageOut = {
  message_id: number;
  conversation_id: number;
  sender_user_id: number;
  message_type: string;
  body?: string | null;
  is_read: boolean;
  read_at?: string | null;
  is_flagged: boolean;
  flag_reason?: string | null;
  created_at: string;
};

export type CharityCaseOut = {
  charity_case_id: number;
  creator_user_id: number;
  status: string;
  title: string;
  description?: string | null;
  province_id?: number | null;
  city_id?: number | null;
  lat?: number | null;
  lng?: number | null;
  currency_code: string;
  target_amount_minor: number;
  collected_amount_minor: number;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  approved_at?: string | null;
  closed_at?: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type ReviewOut = {
  review_id: number;
  booking_id: number;
  reviewer_user_id: number;
  reviewee_user_id: number;
  rating: number;
  review_text?: string | null;
  moderation_status: string;
  response_text?: string | null;
  helpful_count: number;
};
