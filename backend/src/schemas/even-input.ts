import { z } from 'zod'

export const EventInputSchema = z.object({
  name: z.string().min(1),
  blogLink: z.url().optional().nullable(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val))),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val))),
  public: z.boolean(),
  images: z.array(
    z.object({
			id: z.number().optional(),
      imageUrl: z.url(),
    })
  ),
})

export type EventInput = z.infer<typeof EventInputSchema>
