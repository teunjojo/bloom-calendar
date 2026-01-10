import { z } from 'zod';

export const EventInputSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(1),
	blogLink: z.url().optional().nullable(),
	startDate: z.string().refine((val) => !isNaN(Date.parse(val))),
	endDate: z.string().refine((val) => !isNaN(Date.parse(val))),
	public: z.boolean(),
	images: z.array(
		z.object({
			id: z.number().optional(),
			imageUrl: z.url(),
		}),
	),
	newDecor: z.array(
		z.object({
			id: z.number().optional(),
			name: z.string(),
			type: z.string(),
		}),
	),
	returningDecor: z.array(
		z.object({
			id: z.number().optional(),
			name: z.string(),
			type: z.string(),
		}),
	),
});

export type EventInput = z.infer<typeof EventInputSchema>;
