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
import { useEffect, useRef, useState } from 'react';

import { TrendsData } from './trends-data';
import { AddWords } from './AddWords';

export function TrendsChart() {
	const sevenMonthsAgo = new Date();
	sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 6);
	let lastSixMonths = [];
	for (let i = 0; i < 6; i++) {
		lastSixMonths.push({
			month: new Date(sevenMonthsAgo).toLocaleDateString('en-US', {
				month: 'short',
				year: '2-digit'
			})
		});
		sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() + 1);
	}
	const [chartData, setChartData] = useState<any[]>(lastSixMonths);
	const chartDataRef = useRef<any[]>(lastSixMonths);
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
			const data = (await queryData.json()) as { data: TrendsData };
			for (const wordObject of data.data) {
				chartConfigRef.current[wordObject.word] = {
					label: wordObject.word,
					color: `hsl(var(--chart-${words.indexOf(wordObject.word) + 1}))`
				};
				for (const dataItem of wordObject.word_data) {
					const month = new Date(dataItem.month).toLocaleDateString('en-US', {
						month: 'short',
						year: '2-digit'
					});
					const dataItemIndex = chartDataRef.current.findIndex(
						(item) => item.month === month
					);
					if (dataItemIndex !== -1) {
						chartDataRef.current[dataItemIndex][wordObject.word] = Number(
							dataItem.message_count
						);
					}
				}
			}
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
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							fontSize={15}
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
								type="monotone"
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
