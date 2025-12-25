import { HTTPException } from 'hono/http-exception';
import bcrypt from 'bcryptjs';

import { getUser } from './userService';
import { sign, verify } from 'hono/jwt';
import { PrismaClient } from '@/generated/prisma';

export async function signIn(
	prisma: PrismaClient,
	username: string,
	pass: string,
	jwtSecret: string
): Promise<{ accessToken: string; refreshToken: string }> {
	const users = await getUser(prisma, username);
	const user = users[0];

	const passwordMatches = await bcrypt.compare(pass, user.password);
	if (!passwordMatches) {
		throw new HTTPException(401);
	}
	const accessPayload = { sub: user.id, username: user.username, exp: Math.floor(Date.now() / 1000) + 15 * 60 }; // 15 minutes
	const refreshPayload = { sub: user.id, username: user.username, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 };

	const accessToken = await sign(accessPayload, jwtSecret);
	const refreshToken = await sign(refreshPayload, jwtSecret);

	return { accessToken: accessToken, refreshToken: refreshToken };
}

export async function newToken(refreshToken: string, jwtSecret: string): Promise<{ accessToken: string; refreshToken: string }> {
	if (refreshToken.length == 0) throw new HTTPException(401);

	const payload = await verify(refreshToken, jwtSecret);

	const accessPayload = payload;
	const refreshPayload = payload;

	accessPayload.exp = Date.now() / 1000 + 60 * 15; // 15m
	refreshPayload.exp = Date.now() / 1000 + 60 * 60 * 24 * 7; // 7d

	const accessToken = await sign(accessPayload, jwtSecret);
	const newRefreshToken = await sign(refreshPayload, jwtSecret);

	return { accessToken, refreshToken: newRefreshToken };
}
