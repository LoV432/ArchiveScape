'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent
} from '@/components/ui/chart';
import { useEffect, useMemo, useRef, useState } from 'react';

import { TrendsData } from './trends-data';
import { AddWords } from './AddWords';
import { DateTime } from 'luxon';

type Data = {
	day: string;
	[key: string]: any;
}[];

export function TrendsChart() {
	const lastSixMonths: Data = useMemo(() => {
		let sixMonthsAgo = DateTime.now().minus({ months: 6 });
		const data: Data = [];
		while (sixMonthsAgo <= DateTime.now()) {
			data.push({
				day: sixMonthsAgo.toFormat('yyyy-MM-dd')
			});
			sixMonthsAgo = sixMonthsAgo.plus({ days: 1 });
		}
		return data;
	}, []);
	const [chartData, setChartData] = useState(lastSixMonths);
	const chartDataRef = useRef(lastSixMonths);
	const [chartConfig, setChartConfig] = useState<ChartConfig>({});
	const chartConfigRef = useRef<ChartConfig>({});
	const [selectedWords, setSelectedWords] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	async function getTrendsData(words: string[]) {
		if (words.length === 0) return [];
		setIsLoading(true);
		try {
			const queryData = await fetch(`/api/trends?words=${words.join(',')}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const { data } = (await queryData.json()) as { data: TrendsData };
			for (const wordObject of data) {
				chartConfigRef.current[wordObject.word] = {
					label: wordObject.word,
					color: `hsl(var(--chart-${words.indexOf(wordObject.word) + 1}))`
				};
			}
			chartDataRef.current.map((datesData, index) => {
				data.map((word) => {
					const findIndex = word.word_data.findIndex(
						(item) => item.day.slice(0, 10) === datesData.day
					);
					chartDataRef.current[index][word.word] = Number(
						word.word_data[findIndex]?.message_count || 0
					);
				});
			});
			setChartData(chartDataRef.current);
			setChartConfig(chartConfigRef.current);
		} catch (error) {
			console.error(error);
			return [];
		} finally {
			setIsLoading(false);
		}
	}
	useEffect(() => {
		if (selectedWords.length === 0) return;
		chartDataRef.current = lastSixMonths;
		chartConfigRef.current = {};
		getTrendsData(selectedWords);
	}, [selectedWords]);
	return (
		<Card className="flex h-full flex-col items-center justify-center border-0 text-center">
			<CardHeader>
				<CardTitle className="leading-10">
					Word Trends on VentScape <br /> (Last 6 Months)
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<ChartContainer
					className="h-[20vh] w-[93vw] sm:mx-auto sm:h-[40vh]"
					config={chartConfig}
				>
					<LineChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: -12,
							right: 12
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="day"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							fontSize={15}
							interval={29}
							tickFormatter={(value) => DateTime.fromISO(value).toFormat('MMM')}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={12}
							fontSize={15}
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						{Object.keys(chartConfig).map((key) => (
							<Line
								key={key}
								dataKey={key}
								type="bump"
								stroke={chartConfig[key].color}
								strokeWidth={2}
								dot={false}
							/>
						))}
					</LineChart>
				</ChartContainer>
			</CardContent>
			<CardFooter>
				<div className="flex w-full items-start pt-5 text-sm">
					<AddWords
						isLoading={isLoading}
						selectedWords={selectedWords}
						setSelectedWords={setSelectedWords}
					/>
				</div>
			</CardFooter>
		</Card>
	);
}
