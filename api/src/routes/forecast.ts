import { Context, Hono } from 'hono';
import prismaClients from '@/db/prisma';
import { z } from 'zod';
import { getForecasts } from '@/services/forecastHandler';
import { forecastFilterSchema } from '@/schemas/forecast-filter';

const forecastRouter = new Hono();

forecastRouter.get('/', async (c: Context) => {
	let query;
	try {
		query = forecastFilterSchema.parse(c.req.query());
	} catch (e) {
		if (e instanceof z.ZodError) {
			return c.json({ error: e.issues }, 400);
		}
		return c.json({ error: 'Invalid request' }, 400);
	}

	const db = c.env.bloom_calendar_database;
	const prisma = await prismaClients.fetch(db);

	if (!prisma) {
		return c.json({ error: 'Database not found' }, 500);
	}

	const forecasts = await getForecasts(prisma, query);
	return c.json(forecasts);
});
export default forecastRouter;
