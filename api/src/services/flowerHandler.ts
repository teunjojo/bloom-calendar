import { PrismaClient } from '@/generated/prisma';

export async function getFlowers(prisma: PrismaClient) {
	return await prisma.flower.findMany();
}
