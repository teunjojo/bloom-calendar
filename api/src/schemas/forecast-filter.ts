import { z } from 'zod';
import { filterSchema } from '@/schemas/filter';

export const forecastFilterSchema = filterSchema.extend({
	currentDate: z
		.string()
		.refine((val) => !isNaN(Date.parse(val)))
		.optional(),
});

export type ForecastFilter = z.infer<typeof forecastFilterSchema>;
