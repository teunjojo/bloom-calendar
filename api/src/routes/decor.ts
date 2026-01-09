import { Context, Hono } from 'hono';
import prismaClients from '@/db/prisma';
import { getDecors } from '@/services/decorHandler';

const decorRouter = new Hono();

decorRouter.get('/', async (c: Context) => {
	const db = c.env.bloom_calendar_database;
	const prisma = await prismaClients.fetch(db);

	if (!prisma) {
		return c.json({ error: 'Database not found' }, 500);
	}

	const decors = await getDecors(prisma);
	return c.json(decors);
});
export default decorRouter;
