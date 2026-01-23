import { z } from 'zod';

export const ForecastInputSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(1),
	blogLink: z.url().optional().nullable(),
	date: z.string().refine((val) => !isNaN(Date.parse(val))),
	bigFlowers: z.array(
		z.object({
			id: z.number().optional(),
			name: z.string(),
			slug: z.string(),
		}),
	),
	flowerOfTheMonth: z.object({
		id: z.number().optional(),
		name: z.string(),
		slug: z.string(),
	}),
});

export type ForecastInput = z.infer<typeof ForecastInputSchema>;
