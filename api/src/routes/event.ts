import { Context, Hono } from 'hono';
import prismaClients from '@/db/prisma';
import { z } from 'zod';
import { createEvent, deleteEvent, getEvents, getPublicEvents, updateEvent, updateEventPublicState } from '@/services/eventHandler';
import { eventFilterSchema } from '@/schemas/event-filter';
import { tryJwt, requireJwt } from '@/middlewares/auth';

const eventRouter = new Hono();

eventRouter.get('/', tryJwt, async (c: Context) => {
	let query;
	try {
		query = eventFilterSchema.parse(c.req.query());
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

	let events;

	if (c.get('jwtPayload')) {
		events = await getEvents(prisma, query);
	} else {
		events = await getPublicEvents(prisma, query);
	}
	return c.json(events);
});

eventRouter.use('*', requireJwt);
//
// Everything below this line requires the client to be authenticated
//

eventRouter.put('/', async (c: Context) => {
	const body = await c.req.json();
	const event = body;

	const db = c.env.bloom_calendar_database;
	const prisma = await prismaClients.fetch(db);

	if (!prisma) {
		return c.json({ error: 'Database not found' }, 500);
	}

	const createdEvent = await createEvent(prisma, event);

	return c.json(createdEvent);
});

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

eventRouter.delete('/:id', async (c: Context) => {
	const id = parseInt(c.req.param('id'));

	const db = c.env.bloom_calendar_database;
	const prisma = await prismaClients.fetch(db);

	if (!prisma) {
		return c.json({ error: 'Database not found' }, 500);
	}

	const updatedEvent = await deleteEvent(prisma, id);

	return c.json(updatedEvent);
});

eventRouter.post('/:id', async (c: Context) => {
	const id = parseInt(c.req.param('id'));
	const body = await c.req.json();
	const event = body;

	const db = c.env.bloom_calendar_database;
	const prisma = await prismaClients.fetch(db);

	if (!prisma) {
		return c.json({ error: 'Database not found' }, 500);
	}

	const updatedEvent = await updateEvent(prisma, id, event);

	return c.json(updatedEvent);
});

export default eventRouter;
