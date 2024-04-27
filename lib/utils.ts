import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const mapToHex = {
	'#b3001b': '179,0,27,0.1',
	'#c073de': '199,115,222,0.15',
	'#edd892': '237,216,146,0.15',
	'#3685b5': '54,133,181,0.15',
	'#7bf1a8': '127,241,168,0.1',
	'#FE938C': '254,147,140,0.1',
	'#3BF4FB': '59,244,251,0.15'
};
