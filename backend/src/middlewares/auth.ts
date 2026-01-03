import { Context } from 'hono';
import { jwt } from 'hono/jwt';

export async function tryJwt(c: Context, next: () => Promise<any>) {
	try {
		const jwtMiddleware = jwt({
			secret: (c.env as { JWT_SECRET: string }).JWT_SECRET,
		});
		await jwtMiddleware(c, next);
	} catch {
		await next();
	}
}

export async function requireJwt(c: Context, next: () => Promise<any>) {
	const jwtMiddleware = jwt({
		secret: (c.env as { JWT_SECRET: string }).JWT_SECRET,
	});
	return jwtMiddleware(c, next);
}
