import { Context, Hono } from 'hono';
import prismaClients from '@/db/prisma';
import { z } from 'zod';
import {
	createForecast,
	deleteForecast,
	getForecasts,
	getPublicForecasts,
	updateForecast,
	updateForecastPublicState,
} from '@/services/forecastHandler';
import { forecastFilterSchema } from '@/schemas/forecast-filter';
import { tryJwt, requireJwt } from '@/middlewares/auth';

const forecastRouter = new Hono();

forecastRouter.get('/', tryJwt, async (c: Context) => {
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

	let forecasts;

	if (c.get('jwtPayload')) {
		forecasts = await getForecasts(prisma, query);
	} else {
		forecasts = await getPublicForecasts(prisma, query);
	}
	return c.json(forecasts);
});

forecastRouter.use('*', requireJwt);
//
// Everything below this line requires the client to be authenticated
//

forecastRouter.put('/', async (c: Context) => {
	const body = await c.req.json();
	const forecast = body;

	const db = c.env.bloom_calendar_database;
	const prisma = await prismaClients.fetch(db);

	if (!prisma) {
		return c.json({ error: 'Database not found' }, 500);
	}

	const createdForecast = await createForecast(prisma, forecast);

	return c.json(createdForecast);
});

forecastRouter.post('/:id/public', async (c: Context) => {
	const id = parseInt(c.req.param('id'));
	const body = await c.req.json();
	const state = body.state;

	const db = c.env.bloom_calendar_database;
	const prisma = await prismaClients.fetch(db);

	if (!prisma) {
		return c.json({ error: 'Database not found' }, 500);
	}

	const updatedForecast = await updateForecastPublicState(prisma, id, state);

	return c.json(updatedForecast);
});

forecastRouter.post('/:id', async (c: Context) => {
	const id = parseInt(c.req.param('id'));
	const body = await c.req.json();
	const forecast = body;

	const db = c.env.bloom_calendar_database;
	const prisma = await prismaClients.fetch(db);

	if (!prisma) {
		return c.json({ error: 'Database not found' }, 500);
	}

	const updatedForecast = await updateForecast(prisma, id, forecast);

	return c.json(updatedForecast);
});

forecastRouter.delete('/:id', async (c: Context) => {
	const id = parseInt(c.req.param('id'));

	const db = c.env.bloom_calendar_database;
	const prisma = await prismaClients.fetch(db);

	if (!prisma) {
		return c.json({ error: 'Database not found' }, 500);
	}

	const forecast = await prisma.forecast.findFirst({
		where: {
			id,
		},
	});

	if (!forecast) {
		return c.json({ error: `Forecast with id:'${id}' not found` }, 400)
	}

	const deletedForecast = await deleteForecast(prisma, id);

	return c.json(deletedForecast);
});

export default forecastRouter;
