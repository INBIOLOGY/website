import { z } from 'zod';

export const courseSchema = z.object({
  id: z.string(), slug: z.string(), title: z.string(), description: z.string().nullable().optional(),
  price: z.number(), originalPrice: z.number().nullable().optional(), level: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(), status: z.enum(['draft', 'published', 'archived']),
});
export const courseListSchema = z.array(courseSchema);
export type Course = z.infer<typeof courseSchema>;
