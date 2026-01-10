import { Filter } from '@/schemas/filter';

export function applyFilter(filter: Filter) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const options: any = {};
	if (filter.sortBy) {
		options.orderBy = {
			[filter.sortBy]: filter.sortOrder?.toLowerCase(),
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
