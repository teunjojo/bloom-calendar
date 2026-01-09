import { z } from 'zod';
import { filterSchema } from '@/schemas/filter';

export const eventFilterSchema = filterSchema.extend({
	currentDate: z
		.string()
		.refine((val) => !isNaN(Date.parse(val)))
		.optional(),
	afterDate: z
		.string()
		.refine((val) => !isNaN(Date.parse(val)))
		.optional(),
});

export type EventFilter = z.infer<typeof eventFilterSchema>;
