import { Prisma, PrismaClient } from '@/generated/prisma';
import { ForecastFilter } from '@/schemas/forecast-filter';
import { ForecastInput } from '@/schemas/forecast-input';
import { applyFilter } from '@/services/filterHandler';

export async function getForecasts(prisma: PrismaClient, filter: ForecastFilter) {
	const options = applyForecastFilter(filter);
	return await prisma.forecast.findMany(options);
}

export async function getPublicForecasts(prisma: PrismaClient, filter: ForecastFilter) {
	const options = applyForecastFilter(filter);
	options.where = {
		...options.where,
		public: true,
	};
	return await prisma.forecast.findMany(options);
}

export function applyForecastFilter(filter: ForecastFilter) {
	const options: Prisma.ForecastFindManyArgs = applyFilter(filter);

	options.include = {
		bigFlowers: true,
		flowerOfTheMonth: true,
	};

	if (filter.currentDate) {
		const yearMonth = filter.currentDate.slice(0, 7);
		options.where = {
			...options.where,
			date: yearMonth,
		};
	}

	return options;
}

export async function updateForecastPublicState(prisma: PrismaClient, _id: number, _state: boolean) {
	const updatedEvent = await prisma.forecast.update({
		include: {
			bigFlowers: true,
			flowerOfTheMonth: true,
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

export async function createForecast(prisma: PrismaClient, forecast: ForecastInput) {
	const createdEvent = prisma.forecast.create({
		include: {
			bigFlowers: true,
			flowerOfTheMonth: true,
		},
		data: {
			name: forecast.name,
			blogLink: forecast.blogLink || '',
			date: forecast.date.slice(0, 7),
			bigFlowers: {
				connect: forecast.bigFlowers.map((i) => ({
					id: i.id,
				})),
			},
			flowerOfTheMonth: {
				connectOrCreate: {
					where: {
						slug: forecast.flowerOfTheMonth.slug,
					},
					create: {
						name: forecast.flowerOfTheMonth.name,
						slug: forecast.flowerOfTheMonth.slug,
					},
				},
			},
		},
	});

	return createdEvent;
}

export async function updateForecast(prisma: PrismaClient, id: number, forecast: ForecastInput) {
	const updatedForecast = prisma.forecast.update({
		include: {
			bigFlowers: true,
			flowerOfTheMonth: true,
		},
		where: { id: id },
		data: {
			name: forecast.name,
			blogLink: forecast.blogLink || '',
			date: forecast.date,
			public: forecast.public,
			bigFlowers: {
				set: forecast.bigFlowers.map((i) => ({
					id: i.id,
				})),
			},
			flowerOfTheMonth: {
				connectOrCreate: {
					where: {
						id: forecast.flowerOfTheMonth.id,
					},
					create: {
						name: forecast.flowerOfTheMonth.name,
						slug: forecast.flowerOfTheMonth.slug,
					},
				},
			},
		},
	});

	return updatedForecast;
}

export async function deleteForecast(prisma: PrismaClient, id: number) {
	const deletedForecast = prisma.forecast.delete({
		include: {
			bigFlowers: true,
			flowerOfTheMonth: true,
		},
		where: { id },
	});
	return deletedForecast;
}
