import { Context, Hono } from 'hono';
import prismaClients from '@/db/prisma';
import { z } from 'zod';

import type { JwtVariables } from 'hono/jwt';
import { newToken, signIn } from '@/services/authService';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { requireJwt } from '@/middlewares/auth';

type Variables = JwtVariables;

const authRouter = new Hono<{ Variables: Variables }>();

authRouter.post('/login', async (c: Context) => {
	let json;
	try {
		json = await c.req.json();
	} catch {
		return c.json({ error: 'Invalid JSON body' }, 400);
	}

	const username = z.string().min(1).parse(json.username);
	const password = z.string().min(1).parse(json.password);

	const db = c.env.bloom_calendar_database;
	const prisma = await prismaClients.fetch(db);

	try {
		const { accessToken, refreshToken } = await signIn(prisma, username, password, c.env.JWT_SECRET);

		setCookie(c, 'refresh_token', refreshToken, {
			domain: c.env.COOKIE_DOMAIN,
			httpOnly: true,
			secure: c.env.COOKIE_SECURE,
			sameSite: 'Strict',
			maxAge: 7 * 24 * 60 * 60, // 7 days
		});

		return c.json({ accessToken });
	} catch (e) {
		switch ((e as Error).message) {
			case 'Passwords do not match':
				return c.json({ error: 'Invalid credentials' }, 401);
			case 'User not found':
				return c.json({ error: 'Invalid credentials' }, 401);
			default:
				throw e;
		}
	}
});

authRouter.post('/refresh', async (c: Context) => {
	const cookie = getCookie(c, 'refresh_token');

	if (!cookie) return c.json({ error: 'Cookie not set' }, 400);

	try {
		const { accessToken, refreshToken } = await newToken(cookie!, c.env.JWT_SECRET);

		return c.json({ accessToken, refreshToken });
	} catch (e) {
		return c.json({ error: 'Failed to refresh token' }, 401);
	}
});

authRouter.post('/logout', (c: Context) => {
	deleteCookie(c, 'refresh_token', {
		domain: c.env.COOKIE_DOMAIN,
		path: '/',
		httpOnly: true,
		secure: c.env.COOKIE_SECURE,
		sameSite: 'Strict',
	});

	return c.json({ success: true });
});

authRouter.use('*', requireJwt);
//
// Everything below this line requires the client to be authenticated
//

authRouter.post('/check', async (c: Context) => {
	return c.json({ success: true });
});
export default authRouter;
