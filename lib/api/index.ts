import api from "@/lib/api/client";
import {
  CharityCaseOut,
  ConversationOut,
  MessageOut,
  OtpStatusOut,
  ProviderOut,
  ProviderServiceStepProgressOut,
  ReviewOut,
  ServiceOnboardingFlowOut,
  ServiceOnboardingStepOut,
  ServiceTypeOut,
  UserOut
} from "@/lib/api/types";

export const auth = {
  otpRequest: (payload: { phone_e164: string; provider: string; reference_id?: string | null }) =>
    api.post<OtpStatusOut>("/auth/otp/request", payload).then((r) => r.data),
  otpVerify: (payload: { phone_e164: string; provider: string; reference_id?: string | null }) =>
    api.post<OtpStatusOut>("/auth/otp/verify", payload).then((r) => r.data),
  login: (payload: { phone_e164: string; password: string }) =>
    api.post<UserOut>("/auth/login", payload).then((r) => r.data),
  register: (payload: { phone_e164: string; password: string; email?: string | null }) =>
    api.post<UserOut>("/auth/register", payload).then((r) => r.data)
};

export const geo = {
  serviceTypes: () => api.get<ServiceTypeOut[]>("/geo/service-types").then((r) => r.data),
  provinces: (country_code?: string | null) =>
    api.get("/geo/provinces", { params: { country_code } }).then((r) => r.data),
  cities: (province_id?: number | null) =>
    api.get("/geo/cities", { params: { province_id } }).then((r) => r.data)
};

export const search = {
  providers: (payload: Record<string, unknown>) =>
    api.post("/search/providers", payload).then((r) => r.data),
  history: (user_id: number) => api.get("/search/history", { params: { user_id } }).then((r) => r.data)
};

export const favorites = {
  list: (user_id: number) => api.get("/favorites", { params: { user_id } }).then((r) => r.data),
  add: (payload: { user_id: number; provider_id: number }) =>
    api.post("/favorites", payload).then((r) => r.data),
  remove: (user_id: number, provider_id: number) =>
    api.delete("/favorites", { params: { user_id, provider_id } }).then((r) => r.data)
};

export const provider = {
  createDraft: (payload: { user_id: number }) =>
    api.post<ProviderOut>("/providers/onboard/draft", payload).then((r) => r.data),
  getProfile: (provider_id: number) =>
    api.get(`/providers/${provider_id}/profile`).then((r) => r.data),
  updateProfile: (provider_id: number, payload: Record<string, unknown>) =>
    api.patch<ProviderOut>(`/providers/${provider_id}/profile`, payload).then((r) => r.data),
  upsertHome: (provider_id: number, payload: Record<string, unknown>) =>
    api.put(`/providers/${provider_id}/home`, payload).then((r) => r.data),
  addVerification: (provider_id: number, payload: Record<string, unknown>) =>
    api.post(`/providers/${provider_id}/verifications`, payload).then((r) => r.data),
  upsertService: (provider_id: number, payload: { service_type_id: number; is_active: boolean; max_pets?: number | null }) =>
    api.put(`/providers/${provider_id}/services`, payload).then((r) => r.data)
};

export const onboarding = {
  createFlow: (payload: Record<string, unknown>) =>
    api.post<ServiceOnboardingFlowOut>("/onboarding/flows", payload).then((r) => r.data),
  createStep: (payload: Record<string, unknown>) =>
    api.post<ServiceOnboardingStepOut>("/onboarding/steps", payload).then((r) => r.data),
  getFlow: (service_type_id: number) =>
    api.get<ServiceOnboardingFlowOut>(`/onboarding/flows/${service_type_id}`).then((r) => r.data),
  listSteps: (flow_id: number) =>
    api.get<ServiceOnboardingStepOut[]>(`/onboarding/flows/${flow_id}/steps`).then((r) => r.data),
  listProgress: (provider_service_id: number) =>
    api.get<ProviderServiceStepProgressOut[]>(`/onboarding/services/${provider_service_id}/steps`).then((r) => r.data),
  providerSummary: (provider_id: number) =>
    api.get(`/onboarding/providers/${provider_id}/summary`).then((r) => r.data),
  serviceReview: (provider_service_id: number) =>
    api.get(`/onboarding/services/${provider_service_id}/admin/review`).then((r) => r.data),
  saveStep: (provider_service_id: number, step_id: number, payload: { data_json?: Record<string, unknown> | null }) =>
    api.put<ProviderServiceStepProgressOut>(`/onboarding/services/${provider_service_id}/steps/${step_id}`, payload).then((r) => r.data),
  completeStep: (provider_service_id: number, step_id: number, payload: { data_json?: Record<string, unknown> | null }) =>
    api.post<ProviderServiceStepProgressOut>(`/onboarding/services/${provider_service_id}/steps/${step_id}/complete`, payload).then((r) => r.data),
  submitService: (payload: { provider_service_id: number }) =>
    api.post("/onboarding/services/submit", payload).then((r) => r.data),
  enableService: (payload: { provider_id: number; service_type_id: number }) =>
    api.post("/onboarding/services/enable", payload).then((r) => r.data)
};

export const admin = {
  providerDecision: (provider_id: number, payload: { status: string; admin_user_id: number; reason?: string | null }) =>
    api.post<ProviderOut>(`/providers/${provider_id}/admin/decision`, payload).then((r) => r.data),
  serviceDecision: (provider_service_id: number, payload: { status: string; review_note?: string | null }) =>
    api.post(`/onboarding/services/${provider_service_id}/admin/status`, payload).then((r) => r.data),
  rejectStep: (provider_service_id: number, step_id: number, payload: { status: string; review_note?: string | null }) =>
    api.post(`/onboarding/services/${provider_service_id}/steps/${step_id}/admin/reject`, payload).then((r) => r.data)
};

export const adminStatus = {
  updateUserStatus: (user_id: number, payload: { status: string }) =>
    api.post(`/admin/users/${user_id}/status`, payload).then((r) => r.data),
  updateProviderStatus: (provider_id: number, payload: { status: string }) =>
    api.post(`/admin/providers/${provider_id}/status`, payload).then((r) => r.data)
};

export const bookings = {
  request: (payload: Record<string, unknown>) => api.post("/bookings/request", payload).then((r) => r.data),
  events: (booking_id: number) => api.get(`/bookings/${booking_id}/events`).then((r) => r.data)
};

export const payments = {
  createBookingPayment: (payload: { booking_id: number; kind: string; gateway_id?: number | null; gateway_transaction_id?: string | null; raw_response_json?: Record<string, unknown> | null }) =>
    api.post("/payments/booking", payload).then((r) => r.data),
  createRefund: (payload: Record<string, unknown>) => api.post("/payments/refunds", payload).then((r) => r.data),
  createPayout: (payload: Record<string, unknown>) => api.post("/payments/payouts", payload).then((r) => r.data),
  createAdjustment: (payload: Record<string, unknown>) => api.post("/payments/adjustments", payload).then((r) => r.data),
  listBookingPayments: (booking_id: number) => api.get(`/payments/booking/${booking_id}`).then((r) => r.data),
  bookingLedger: (booking_id: number) => api.get(`/payments/booking/${booking_id}/ledger`).then((r) => r.data)
};

export const messaging = {
  createConversation: (payload: { participant1_user_id: number; participant2_user_id: number; booking_id?: number | null }) =>
    api.post<ConversationOut>("/messages/conversations", payload).then((r) => r.data),
  listConversations: (user_id: number) =>
    api.get<ConversationOut[]>("/messages/conversations", { params: { user_id } }).then((r) => r.data),
  getConversation: (conversation_id: number) =>
    api.get<ConversationOut>(`/messages/conversations/${conversation_id}`).then((r) => r.data),
  listMessages: (conversation_id: number, limit?: number, cursor_created_at?: string | null, cursor_message_id?: number | null) =>
    api.get<MessageOut[]>("/messages/list", { params: { conversation_id, limit, cursor_created_at, cursor_message_id } }).then((r) => r.data),
  sendMessage: (payload: { conversation_id: number; sender_user_id: number; message_type: string; body?: string | null }) =>
    api.post<MessageOut>("/messages/send", payload).then((r) => r.data),
  attachMedia: (payload: { message_id: number; media_id: number }) =>
    api.post("/messages/attachments", payload).then((r) => r.data),
  flagMessage: (message_id: number, payload: { is_flagged: boolean; flag_reason?: string | null }) =>
    api.patch(`/messages/messages/${message_id}/flag`, payload).then((r) => r.data)
};

export const media = {
  uploadUrl: (payload: { owner_user_id?: number | null; media_type: string; storage_key: string; url: string; mime_type?: string | null; size_bytes?: number | null }) =>
    api.post("/media/upload-url", payload).then((r) => r.data)
};

export const charity = {
  listCases: (status?: string | null) => api.get<CharityCaseOut[]>("/charity/cases", { params: { status } }).then((r) => r.data),
  getCase: (case_id: number) => api.get<CharityCaseOut>(`/charity/cases/${case_id}`).then((r) => r.data),
  updateCase: (case_id: number, payload: Record<string, unknown>) => api.patch(`/charity/cases/${case_id}`, payload).then((r) => r.data),
  donate: (payload: { charity_case_id: number; donor_user_id?: number | null; payment_id?: number | null; status: string; currency_code: string; amount_minor: number; donation_reference: string }) =>
    api.post("/charity/donations", payload).then((r) => r.data),
  listUpdates: (case_id: number) => api.get(`/charity/cases/${case_id}/updates`).then((r) => r.data),
  listProof: (case_id: number) => api.get(`/charity/cases/${case_id}/proof`).then((r) => r.data),
  addUpdate: (payload: { charity_case_id: number; author_user_id?: number | null; body: string; spent_amount_minor?: number | null; currency_code?: string | null }) =>
    api.post("/charity/updates", payload).then((r) => r.data),
  addUpdateMedia: (payload: { charity_update_id: number; media_id: number; sort_order?: number | null }) =>
    api.post("/charity/updates/media", payload).then((r) => r.data)
};

export const reviews = {
  create: (payload: { booking_id: number; reviewer_user_id: number; reviewee_user_id: number; rating: number; review_text?: string | null; is_public?: boolean | null }) =>
    api.post<ReviewOut>("/reviews/", payload).then((r) => r.data),
  respond: (review_id: number, payload: { response_text?: string | null }) =>
    api.post<ReviewOut>(`/reviews/${review_id}/response`, payload).then((r) => r.data),
  moderate: (review_id: number, payload: { moderation_status: string }) =>
    api.post<ReviewOut>(`/reviews/${review_id}/moderate`, payload).then((r) => r.data),
  list: (provider_id: number, service_type_id?: number | null) =>
    api.get("/reviews/", { params: { provider_id, service_type_id } }).then((r) => r.data),
  visibility: (review_id: number, payload: { is_public: boolean }) =>
    api.post<ReviewOut>(`/reviews/${review_id}/visibility`, payload).then((r) => r.data),
  addMedia: (review_id: number, payload: { media_id: number }) =>
    api.post(`/reviews/${review_id}/media`, payload).then((r) => r.data),
  listMedia: (review_id: number) => api.get(`/reviews/${review_id}/media`).then((r) => r.data)
};

export const wallet = {
  get: (user_id: number, currency_code: string) =>
    api.get("/wallets/", { params: { user_id, currency_code } }).then((r) => r.data),
  transactions: (wallet_id: number, limit?: number, cursor_created_at?: string | null, cursor_tx_id?: number | null) =>
    api.get("/wallets/transactions", { params: { wallet_id, limit, cursor_created_at, cursor_tx_id } }).then((r) => r.data)
};

export const users = {
  getMe: (user_id: number) => api.get("/users/me", { params: { user_id } }).then((r) => r.data),
  updateMe: (user_id: number, payload: { email?: string | null; locale?: string | null; timezone?: string | null }) =>
    api.put("/users/me", payload, { params: { user_id } }).then((r) => r.data),
  getProfile: (user_id: number) => api.get("/users/me/profile", { params: { user_id } }).then((r) => r.data),
  updateProfile: (user_id: number, payload: Record<string, unknown>) =>
    api.put("/users/me/profile", payload, { params: { user_id } }).then((r) => r.data),
  listAddresses: (user_id: number) => api.get("/users/me/addresses", { params: { user_id } }).then((r) => r.data),
  createAddress: (user_id: number, payload: Record<string, unknown>) =>
    api.post("/users/me/addresses", payload, { params: { user_id } }).then((r) => r.data)
};

export const petsApi = {
  list: (owner_user_id: number) => api.get("/pets/", { params: { owner_user_id } }).then((r) => r.data),
  create: (payload: Record<string, unknown>) => api.post("/pets/", payload).then((r) => r.data),
  update: (pet_id: number, payload: Record<string, unknown>) => api.put(`/pets/${pet_id}`, payload).then((r) => r.data),
  listVaccinations: (pet_id: number) => api.get(`/pets/${pet_id}/vaccinations`).then((r) => r.data),
  createVaccination: (pet_id: number, payload: Record<string, unknown>) =>
    api.post(`/pets/${pet_id}/vaccinations`, payload).then((r) => r.data)
};

export const availability = {
  check: (payload: Record<string, unknown>) => api.post("/availability/check", payload).then((r) => r.data),
  calendar: (provider_id: number, start_date: string, end_date: string) =>
    api.get("/availability/calendar", { params: { provider_id, start_date, end_date } }).then((r) => r.data),
  createRule: (payload: Record<string, unknown>) => api.post("/availability/rules", payload).then((r) => r.data),
  listRules: (provider_id: number) => api.get("/availability/rules", { params: { provider_id } }).then((r) => r.data),
  updateRule: (rule_id: number, payload: Record<string, unknown>) => api.patch(`/availability/rules/${rule_id}`, payload).then((r) => r.data),
  deleteRule: (rule_id: number) => api.delete(`/availability/rules/${rule_id}`).then((r) => r.data),
  createOverride: (payload: Record<string, unknown>) => api.post("/availability/overrides", payload).then((r) => r.data),
  listOverrides: (provider_id: number) => api.get("/availability/overrides", { params: { provider_id } }).then((r) => r.data),
  updateOverride: (override_id: number, payload: Record<string, unknown>) => api.patch(`/availability/overrides/${override_id}`, payload).then((r) => r.data),
  deleteOverride: (override_id: number) => api.delete(`/availability/overrides/${override_id}`).then((r) => r.data),
  createTimeOff: (payload: Record<string, unknown>) => api.post("/availability/time-off", payload).then((r) => r.data),
  listTimeOff: (provider_id: number) => api.get("/availability/time-off", { params: { provider_id } }).then((r) => r.data),
  updateTimeOff: (time_off_id: number, payload: Record<string, unknown>) => api.patch(`/availability/time-off/${time_off_id}`, payload).then((r) => r.data),
  deleteTimeOff: (time_off_id: number) => api.delete(`/availability/time-off/${time_off_id}`).then((r) => r.data)
};

export const providerRates = {
  addRate: (provider_service_id: number, payload: Record<string, unknown>) =>
    api.post(`/providers/services/${provider_service_id}/rates`, payload).then((r) => r.data),
  estimate: (provider_service_id: number, payload: Record<string, unknown>) =>
    api.post(`/providers/services/${provider_service_id}/estimate`, payload).then((r) => r.data)
};

export const bookingOps = {
  accept: (booking_id: number, payload: Record<string, unknown>) => api.post(`/bookings/${booking_id}/accept`, payload).then((r) => r.data),
  decline: (booking_id: number, payload: Record<string, unknown>) => api.post(`/bookings/${booking_id}/decline`, payload).then((r) => r.data),
  confirm: (booking_id: number, payload: Record<string, unknown>) => api.post(`/bookings/${booking_id}/confirm`, payload).then((r) => r.data),
  start: (booking_id: number, payload: Record<string, unknown>) => api.post(`/bookings/${booking_id}/start`, payload).then((r) => r.data),
  complete: (booking_id: number, payload: Record<string, unknown>) => api.post(`/bookings/${booking_id}/complete`, payload).then((r) => r.data),
  cancel: (booking_id: number, payload: Record<string, unknown>) => api.post(`/bookings/${booking_id}/cancel`, payload).then((r) => r.data),
  dispute: (booking_id: number, payload: Record<string, unknown>) => api.post(`/bookings/${booking_id}/dispute`, payload).then((r) => r.data)
};

export const adminOps = {
  disputeBooking: (booking_id: number, payload: Record<string, unknown>) =>
    api.post(`/admin/bookings/${booking_id}/dispute`, payload).then((r) => r.data),
  updateCharityStatus: (charity_case_id: number, payload: Record<string, unknown>) =>
    api.post(`/admin/charity/${charity_case_id}/status`, payload).then((r) => r.data),
  reviewModeration: (review_id: number, payload: { status: string }) =>
    api.post(`/admin/reviews/${review_id}/moderation`, payload).then((r) => r.data),
  reviewVisibility: (review_id: number, payload: { is_public: boolean }) =>
    api.post(`/admin/reviews/${review_id}/visibility`, payload).then((r) => r.data),
  charityReview: (case_id: number, payload: { status: string; admin_user_id: number }) =>
    api.post(`/charity/cases/${case_id}/admin/review`, payload).then((r) => r.data),
  charityActivate: (case_id: number) => api.post(`/charity/cases/${case_id}/activate`).then((r) => r.data),
  charityClose: (case_id: number, payload: { status: string; admin_user_id: number }) =>
    api.post(`/charity/cases/${case_id}/close`, payload).then((r) => r.data),
  charityDonations: (case_id: number) => api.get(`/admin/charity/${case_id}/donations`).then((r) => r.data),
  charityPayments: (case_id: number) => api.get(`/admin/charity/${case_id}/payments`).then((r) => r.data),
  listFlaggedMessages: (limit = 200) => api.get("/admin/messages/flagged", { params: { limit } }).then((r) => r.data),
  resolveMessageFlag: (message_id: number, payload: { is_flagged: boolean; flag_reason?: string | null }) =>
    api.post(`/admin/messages/${message_id}/resolve`, payload).then((r) => r.data)
};
