import { PrismaClient } from '@/generated/prisma';
import { EventFilter } from '@/schemas/event-filter';
import { applyFilter } from '@/services/filterHandler';

export async function getEvents(prisma: PrismaClient, filter: EventFilter) {
	const options = applyEventFilter(filter);
	return await prisma.event.findMany(options);
}

export function applyEventFilter(filter: EventFilter) {
	const options = applyFilter(filter);

	console.log(filter.currentDate);

	if (filter.currentDate) {
		options.where = {
			...options.where,
			startDate: {
				lte: filter.currentDate,
			},
			endDate: {
				gte: filter.currentDate,
			},
		};
	}

	if (filter.afterDate) {
		options.where = {
			...options.where,
			startDate: {
				gt: filter.afterDate,
			},
		};
	}

	return options;
}
