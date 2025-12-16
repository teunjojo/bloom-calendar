import { Filter } from '@/schemas/filter';

export function applyFilter(filter: Filter) {
	const options: any = {};
	if (filter.sortBy) {
		options.orderBy = {
			[filter.sortBy]: filter.sortOrder,
		};
	}

	if (filter.offset !== undefined) {
		options.skip = filter.offset;
	}

	if (filter.limit !== undefined) {
		options.take = filter.limit;
	}

	return options;
}
