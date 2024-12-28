import { z } from 'zod';

export const Filters = z.object({
	page: z
		.string()
		.transform((val) => Number(val))
		.optional()
		.default('1'),
	order: z.enum(['asc', 'desc']).optional(),
	dateStart: z
		.string()
		.transform((val) => new Date(val))
		.optional(),
	dateEnd: z
		.string()
		.transform((val) => new Date(val))
		.optional(),
	highlightedUser: z
		.string()
		.transform((val) => Number(val))
		.optional()
});
