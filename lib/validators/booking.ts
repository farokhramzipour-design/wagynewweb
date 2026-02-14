import { z } from "zod";

export const bookingRequestSchema = z.object({
  booking_reference: z.string().min(4),
  owner_user_id: z.coerce.number(),
  provider_id: z.coerce.number(),
  service_type_id: z.coerce.number(),
  start_datetime: z.string(),
  end_datetime: z.string(),
  pets: z
    .array(
      z.object({
        pet_id: z.coerce.number(),
        per_pet_notes: z.string().optional().nullable()
      })
    )
    .min(1)
});

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;
