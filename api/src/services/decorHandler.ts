import { PrismaClient } from '@/generated/prisma';

export async function getDecors(prisma: PrismaClient) {
	return await prisma.decor.findMany();
}
