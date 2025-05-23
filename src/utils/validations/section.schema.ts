import { z } from 'zod';

export const sectionSchema = z.object({
  name: z.string().min(1, 'Section name is required'),
  yearId: z.string().uuid('Invalid year ID format'),
});
