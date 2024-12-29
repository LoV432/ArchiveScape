import { z } from 'zod';

export const Filters = z.object({
	page: z
		.string()
		.transform((val) => Number(val))
		.default('1'),
	order: z.enum(['asc', 'desc']).optional(),
	dateStart: z.string().optional(),
	dateEnd: z.string().optional(),
	user_id: z
		.string()
		.transform((val) => Number(val))
		.optional()
});

export type FiltersType = z.infer<typeof Filters>;
