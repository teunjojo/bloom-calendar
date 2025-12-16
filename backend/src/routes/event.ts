import { Context, Hono } from 'hono';
import prismaClients from '@/db/prisma';
import { Prisma } from '@/generated/prisma';
import { z } from 'zod';
import { filterSchema } from '@/schemas/filter';
import { getEvents } from '@/services/eventHandler';
import { eventFilterSchema } from '@/schemas/event-filter';

const eventRouter = new Hono();

eventRouter.get('/', async (c: Context) => {
	let query;
	try {
		query = eventFilterSchema.parse(c.req.query());
	} catch (e: any) {
		if (e instanceof z.ZodError) {
			return c.json({ error: e.issues }, 400);
		}
		return c.json({ error: 'Invalid request' }, 400);
	}
	const { currentDate, afterDate } = query;

	const db = c.env.bloom_calendar_database;
	const prisma = await prismaClients.fetch(db);

	if (!prisma) {
		return c.json({ error: 'Database not found' }, 500);
	}

	const events = await getEvents(prisma, query);
	return c.json(events);
});
export default eventRouter;
