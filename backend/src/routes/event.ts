import { Context, Hono } from 'hono';
import prismaClients from '@/db/prisma';
import { z } from 'zod';
import { getEvents, updateEventPublicState } from '@/services/eventHandler';
import { eventFilterSchema } from '@/schemas/event-filter';
import { jwt } from 'hono/jwt';

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

	const db = c.env.bloom_calendar_database;
	const prisma = await prismaClients.fetch(db);

	if (!prisma) {
		return c.json({ error: 'Database not found' }, 500);
	}

	const events = await getEvents(prisma, query);
	return c.json(events);
});

eventRouter.use('*', (c, next) => {
	const jwtMiddleware = jwt({
		secret: (c.env as { JWT_SECRET: string }).JWT_SECRET,
	});
	return jwtMiddleware(c, next);
});
//
// Everything below this line requires the client to be authenticated
//

eventRouter.post('/:id/public', async (c: Context) => {
	const id = parseInt(c.req.param('id'));
	const body = await c.req.json();
	const state = body.state;

	const db = c.env.bloom_calendar_database;
	const prisma = await prismaClients.fetch(db);

	if (!prisma) {
		return c.json({ error: 'Database not found' }, 500);
	}

	const updatedEvent = await updateEventPublicState(prisma, id, state);

	return c.json(updatedEvent);
});
export default eventRouter;
