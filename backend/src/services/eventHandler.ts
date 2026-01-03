import { Event, PrismaClient } from '@/generated/prisma';
import { EventFilter } from '@/schemas/event-filter';
import { applyFilter } from '@/services/filterHandler';
import { equal } from 'hono/utils/buffer';

export async function getEvents(prisma: PrismaClient, filter: EventFilter) {
	const options = applyEventFilter(filter);
	return await prisma.event.findMany(options);
}

export async function getPublicEvents(prisma: PrismaClient, filter: EventFilter) {
	const options = applyEventFilter(filter);
	options.where = {
		...options.where,
		public: true,
	};
	return await prisma.event.findMany(options);
}

export function applyEventFilter(filter: EventFilter) {
	const options = applyFilter(filter);

	options.include = {
		images: true,
	};

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

export async function updateEventPublicState(prisma: PrismaClient, _id: number, _state: boolean) {
	const updatedEvent = await prisma.event.update({
		where: {
			id: _id,
		},
		data: {
			public: _state,
		},
	});

	console.log('updated state');
	console.log(updatedEvent);

	return updatedEvent;
}
