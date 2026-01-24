import { Context, Hono } from 'hono';
import prismaClients from '@/db/prisma';
import { getFlowers } from '@/services/flowerHandler';

const flowerRouter = new Hono();

flowerRouter.get('/', async (c: Context) => {
	const db = c.env.bloom_calendar_database;
	const prisma = await prismaClients.fetch(db);

	if (!prisma) {
		return c.json({ error: 'Database not found' }, 500);
	}

	const decors = await getFlowers(prisma);
	return c.json(decors);
});
export default flowerRouter;
