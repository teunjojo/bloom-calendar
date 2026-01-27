import { Prisma, PrismaClient } from '@/generated/prisma';
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
	const options: Prisma.EventFindManyArgs = applyFilter(filter);

	options.include = {
		images: true,
		eventDecor: {
			include: {
				decor: true,
			},
		},
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
			eventDecor: {
				include: { decor: true },
			},
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
			eventDecor: {
				include: { decor: true },
			},
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
			eventDecor: {
				create: event.eventDecor.map((i) => ({
					decor: {
						connectOrCreate: {
							where: {
								id: i.id,
							},
							create: {
								name: i.decor.name,
								type: i.decor.type,
							},
						},
					},
					overview: i.overview,
					status: i.status,
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
			eventDecor: {
				include: { decor: true },
			},
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
			eventDecor: {
				include: { decor: true },
			},
		},
	});

	// Remove image not in the provided event
	const existingImageIds = existingEvent?.images.map((img) => img.id) || [];
	const newImageIds = event.images.map((img) => img.id).filter(Boolean);
	const imagesToDelete = existingImageIds.filter((id) => !newImageIds.includes(id));
	await prisma.image.deleteMany({
		where: { id: { in: imagesToDelete } },
	});

	// Remove eventDecor not in the provided event
	const existingEventDecorIds = existingEvent?.eventDecor.map((decor) => decor.id) || [];
	const newEventDecorIds = event.eventDecor.map((decor) => decor.id).filter(Boolean);
	const eventDecorToDelete = existingEventDecorIds.filter((id) => !newEventDecorIds.includes(id));
	await prisma.eventDecor.deleteMany({
		where: { id: { in: eventDecorToDelete } },
	});

	const updatedEvent = prisma.event.update({
		include: {
			images: true,
			eventDecor: {
				include: { decor: true },
			},
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
			eventDecor: {
				upsert: event.eventDecor.map((i) => ({
					where: {
						id: i.id,
					},
					update: {
						decor: {
							upsert: {
								where: {
									id: i.decor.id,
								},
								update: {
									name: i.decor.name,
									type: i.decor.type,
								},
								create: {
									name: i.decor.name,
									type: i.decor.type,
								},
							},
						},
						overview: i.overview,
						status: i.status,
					},
					create: {
						decor: {
							connectOrCreate: {
								where: {
									id: i.decor.id,
								},
								create: {
									name: i.decor.name,
									type: i.decor.type,
								},
							},
						},
						overview: i.overview,
						status: i.status,
					},
				})),
			},
		},
	});

	return updatedEvent;
}
