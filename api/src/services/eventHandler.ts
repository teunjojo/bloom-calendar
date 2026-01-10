import { PrismaClient } from '@/generated/prisma';
import { EventInput } from '@/schemas/even-input';
import { EventFilter } from '@/schemas/event-filter';
import { applyFilter } from '@/services/filterHandler';

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
		newDecor: true,
		returningDecor: true,
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
		include: {
			images: true,
			newDecor: true,
			returningDecor: true,
		},
		where: {
			id: _id,
		},
		data: {
			public: _state,
		},
	});

	return updatedEvent;
}

export async function createEvent(prisma: PrismaClient, event: EventInput) {
	const createdEvent = prisma.event.create({
		include: {
			images: true,
			newDecor: true,
			returningDecor: true,
		},
		data: {
			name: event.name,
			blogLink: event.blogLink || '',
			startDate: event.startDate,
			endDate: event.endDate,
			public: event.public,
			images: {
				create: event.images.map((i) => ({
					imageUrl: i.imageUrl,
				})),
			},
			newDecor: {
				create: event.newDecor.map((i) => ({
					name: i.name,
					type: i.type,
					newDecorEventId: event.id,
				})),
			},
			returningDecor: {
				connect: event.returningDecor.map((i) => ({
					id: i.id,
				})),
			},
		},
	});

	return createdEvent;
}

export async function deleteEvent(prisma: PrismaClient, id: number) {
	const deletedEvent = prisma.event.delete({
		include: {
			images: true,
			newDecor: true,
			returningDecor: true,
		},
		where: { id },
	});
	return deletedEvent;
}

export async function updateEvent(prisma: PrismaClient, id: number, event: EventInput) {
	const existingEvent = await prisma.event.findUnique({
		where: { id },
		include: {
			images: true,
			newDecor: true,
			returningDecor: true,
		},
	});

	// Remove image not in the provided event
	const existingImageIds = existingEvent?.images.map((img) => img.id) || [];
	const newImageIds = event.images.map((img) => img.id).filter(Boolean);
	const imagesToDelete = existingImageIds.filter((id) => !newImageIds.includes(id));
	await prisma.image.deleteMany({
		where: { id: { in: imagesToDelete } },
	});

	// Remove newDecor not in the provided event
	const existingNewDecorIds = existingEvent?.newDecor.map((decor) => decor.id) || [];
	const newNewDecorIds = event.newDecor.map((decor) => decor.id).filter(Boolean);
	const newDecorToDelete = existingNewDecorIds.filter((id) => !newNewDecorIds.includes(id));
	await prisma.decor.deleteMany({
		where: { id: { in: newDecorToDelete } },
	});

	const updatedEvent = prisma.event.update({
		include: {
			images: true,
			newDecor: true,
			returningDecor: true,
		},
		where: { id: id },
		data: {
			name: event.name,
			blogLink: event.blogLink || '',
			startDate: event.startDate,
			endDate: event.endDate,
			public: event.public,
			images: {
				upsert: event.images.map((i) => ({
					where: {
						id: i.id,
					},
					update: {
						imageUrl: i.imageUrl,
					},
					create: {
						imageUrl: i.imageUrl,
					},
				})),
			},
			newDecor: {
				upsert: event.newDecor.map((i) => ({
					where: {
						id: i.id,
					},
					update: {
						name: i.name,
						type: i.type,
					},
					create: {
						name: i.name,
						type: i.type,
					},
				})),
			},
			returningDecor: {
				set: event.returningDecor.map((i) => ({
					id: i.id,
				})),
			},
		},
	});

	return updatedEvent;
}
