import { HTTPException } from 'hono/http-exception';

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

	if (!user) {
		throw new Error('User not found')
	}

	const passwordMatches = await verifyPassword(pass, user.password, user.password_salt, user.password_iterations);
	if (!passwordMatches) {
		throw new Error('Passwords do not match')
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

function fromBase64(str: string) {
	return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

async function verifyPassword(password: string, storedHash: string, storedSalt: string, iterations: number) {
	const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), { name: 'PBKDF2' }, false, ['deriveBits']);

	const bits = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: fromBase64(storedSalt),
			iterations,
			hash: 'SHA-256',
		},
		key,
		256
	);

	const computed = new Uint8Array(bits);
	const expected = fromBase64(storedHash);

	return timingSafeEqual(computed, expected);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
	if (a.length !== b.length) return false;

	let diff = 0;
	for (let i = 0; i < a.length; i++) {
		diff |= a[i] ^ b[i];
	}
	return diff === 0;
}
