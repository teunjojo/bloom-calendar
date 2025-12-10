import { FindManyOptions, FindOptionsOrder } from 'typeorm';

import { FilterDto } from '@app/common/dto/filter-dto';

export function buildFindOptions<T>(filter: FilterDto): FindManyOptions<T> {
  const options: FindManyOptions<T> = {};

  if (filter.limit) {
    options.take = filter.limit;
  }
  if (filter.offset) {
    options.skip = filter.offset;
  }

  if (filter.sortBy) {
    options.order = {
      [filter.sortBy]: filter.sortOrder ?? 'ASC',
    } as FindOptionsOrder<T>;
  }

  return options;
}
