import { Dispatch, useEffect, useReducer } from 'react';
import type { FiltersType } from './Filters.z';
import { Filters } from './Filters.z';
import { useSearchParams } from 'next/navigation';

export type Action = {
	[key in keyof FiltersType]?: FiltersType[key];
} & { isUseEffect?: boolean };

function reducer(state: FiltersType, action: Action) {
	const isUseEffect = action.isUseEffect;
	delete action.isUseEffect;
	state = { ...state, ...action };
	if (!isUseEffect) {
		const newUrl = new URL(window.location.href);
		Object.entries(state).forEach(([key, value]) => {
			if (value) {
				newUrl.searchParams.set(key, value.toString());
			} else if (value === '') {
				newUrl.searchParams.delete(key);
			}
		});
		if (new URL(window.location.href).href !== newUrl.href) {
			window.history.pushState(
				{ ...window.history.state },
				'',
				newUrl.toString()
			);
		}
	}
	return state;
}

export type FiltersState = FiltersType;
export type FiltersReducer = Dispatch<Action>;

export function useFilters() {
	const searchParams = useSearchParams();
	const initialState = Object.fromEntries(searchParams.entries());
	const parsedFilters = Filters.safeParse(initialState);
	if (!parsedFilters.success) {
		throw new Error('There was an error parsing the filters.');
	}
	const [filters, setFilers] = useReducer(reducer, parsedFilters.data);
	useEffect(() => {
		const params = Object.fromEntries(searchParams.entries());
		const parsedParams = Filters.safeParse(params);
		if (!parsedParams.success) {
			return;
		}
		// TODO: This is stupid, i shouldn't need to do this comparison
		// but i need this to update the filters when browser back or forward buttons are pressed
		// I have no way to detect why the URL was changed. If i could detect it, i wouldn't need to do this comparison
		if (JSON.stringify(filters) !== JSON.stringify(parsedParams.data)) {
			setFilers(parsedParams.data);
		}
	}, [searchParams]);
	return [filters, setFilers] as const;
}
