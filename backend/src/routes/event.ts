import { Context, Hono } from 'hono';
import prismaClients from '@/lib/prisma';

const eventRouter = new Hono();

eventRouter.get('/', async (c: Context) => {
	const db = c.env.bloom_calendar_database;
	const prisma = await prismaClients.fetch(db);
	const events = await prisma.event.findMany({
		include: {
			images: true
		}
	});
	return c.json(events);
});
export default eventRouter;
