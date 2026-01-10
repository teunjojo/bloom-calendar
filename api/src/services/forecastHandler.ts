import { Prisma, PrismaClient } from '@/generated/prisma';
import { ForecastFilter } from '@/schemas/forecast-filter';
import { applyFilter } from '@/services/filterHandler';

export async function getForecasts(prisma: PrismaClient, filter: ForecastFilter) {
	const options = applyForecastFilter(filter);
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
