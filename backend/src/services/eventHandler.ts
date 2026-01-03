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

	return updatedEvent;
}

export async function createEvent(prisma: PrismaClient, event: Event) {
	const createdEvent = prisma.event.create({
		data: {
			name: event.name,
			blogLink: event.blogLink,
			startDate: event.startDate,
			endDate: event.endDate,
			public: event.public,
		},
	});

	return createdEvent;
}

export async function deleteEvent(prisma: PrismaClient, id: number) {
	const deletedEvent = prisma.event.delete({ where: { id } });
	return deletedEvent;
}

export async function updateEvent(prisma: PrismaClient, event: Event) {
	const updatedEvent = prisma.event.update({
		where: { id: event.id },
		data: {
			name: event.name,
			blogLink: event.blogLink,
			startDate: event.startDate,
			endDate: event.endDate,
			public: event.public,
		},
	});

	return updatedEvent
}
