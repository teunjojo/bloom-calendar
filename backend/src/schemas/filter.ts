import { z } from 'zod';

export const filterSchema = z.object({
	offset: z.coerce.number().min(0).optional().default(0),
	limit: z.coerce.number().min(1).optional().default(10),
	sortBy: z.string().optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional().default('ASC'),
});

export type Filter = z.infer<typeof filterSchema>;
