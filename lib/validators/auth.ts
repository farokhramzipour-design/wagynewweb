import { z } from "zod";

export const otpRequestSchema = z.object({
  phone_e164: z.string().min(7).max(32),
  provider: z.string().default("sms")
});

export const otpVerifySchema = z.object({
  phone_e164: z.string().min(7).max(32),
  provider: z.string().default("sms"),
  reference_id: z.string().optional().nullable()
});
