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
	eventDecor: z.array(
		z.object({
			id: z.number().optional(),
			decor: z.object({
				id: z.number().optional(),
				name: z.string(),
				type: z.string(),
			}),
			overview: z.string(),
			status: z.union([z.literal('NEW'), z.literal('RETURNING')]),
		}),
	),
});

export type EventInput = z.infer<typeof EventInputSchema>;
