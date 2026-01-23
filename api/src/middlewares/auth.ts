import { Context, Next } from 'hono';
import { jwt } from 'hono/jwt';

export async function tryJwt(c: Context, next: Next) {
	try {
		const jwtMiddleware = jwt({
			secret: (c.env as { JWT_SECRET: string }).JWT_SECRET,
			alg: 'HS256',
		});
		await jwtMiddleware(c, next);
	} catch {
		await next();
	}
}

export async function requireJwt(c: Context, next: Next) {
	const jwtMiddleware = jwt({
		secret: (c.env as { JWT_SECRET: string }).JWT_SECRET,
		alg: 'HS256',
	});
	return jwtMiddleware(c, next);
}
