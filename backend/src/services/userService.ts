import { User } from "@/generated/prisma";
import { PrismaClient } from "@prisma/client/extension";

export async function getUser(prisma: PrismaClient, username: string): Promise<User[]> {
	return prisma.user.findMany({ where: { username } });
}
