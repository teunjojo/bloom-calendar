import { Hono } from 'hono';
import { PrismaClient } from './generated/prisma';
import { PrismaD1 } from '@prisma/adapter-d1';
import { cors } from 'hono/cors';

type Bindings = {
	bloom_calendar_database: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

function getPrisma(db: D1Database) {
	const adapter = new PrismaD1(db);
	return new PrismaClient({ adapter });
}

app.use(
	cors({
		credentials: true,
		origin: ['http://localhost:5173', 'http://localhost:8787'],

	})
);

app.get('/health', (c) => {
	return c.json({ ok: true });
});

app.get('/events', async (c) => {
	const prisma = getPrisma(c.env.bloom_calendar_database);
	const events = await prisma.event.findMany();
	return c.json(events);
});

export default app;
