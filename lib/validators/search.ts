import { z } from "zod";

export const searchFiltersSchema = z.object({
  province_id: z.coerce.number().optional(),
  city_id: z.coerce.number().optional(),
  service_type_id: z.coerce.number().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  pets_count: z.coerce.number().min(1).optional(),
  price_min: z.coerce.number().optional(),
  price_max: z.coerce.number().optional(),
  radius_km: z.coerce.number().optional(),
  rating_min: z.coerce.number().optional(),
  has_fenced_yard: z.coerce.boolean().optional(),
  smoking_household: z.coerce.boolean().optional(),
  has_children: z.coerce.boolean().optional(),
  has_pets: z.coerce.boolean().optional(),
  work_from_home: z.coerce.boolean().optional()
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;
