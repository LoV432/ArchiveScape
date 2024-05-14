import { Dispatch, SetStateAction } from 'react';
import { useTimescape } from 'timescape/react';

export default function DateTimePicker({
	setTime,
	time
}: {
	setTime: Dispatch<SetStateAction<Date>>;
	time: Date;
}) {
	const { getRootProps, getInputProps, options, update } = useTimescape({
		date: time,
		onChangeDate: (nextDate) => {
			if (typeof nextDate !== 'undefined') {
				setTime(nextDate);
			}
		},
		maxDate: '$NOW'
	});

	return (
		<>
			{/* @ts-expect-error */}
			<div className="timescape mx-auto" {...getRootProps()}>
				<input
					className="min-h-8 min-w-8 max-w-8 rounded border text-center"
					{...getInputProps('days')}
				/>
				<span>/</span>
				<input
					className="min-h-8 min-w-8 max-w-8 rounded border text-center"
					{...getInputProps('months')}
				/>
				<span>/</span>
				<input
					className="min-h-8 min-w-14 max-w-14 rounded border text-center"
					{...getInputProps('years')}
				/>
				<span> </span>
				<input
					className="min-h-8 min-w-8 max-w-8 rounded border text-center"
					{...getInputProps('hours')}
				/>
				<span>:</span>
				<input
					className="min-h-8 min-w-8 max-w-8 rounded border text-center"
					{...getInputProps('minutes')}
				/>
				<span>:</span>
				<input
					className="min-h-8 min-w-8 max-w-8 rounded border text-center"
					{...getInputProps('seconds')}
				/>
			</div>
		</>
	);
}
