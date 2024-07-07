'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
	Card,
	CardContent,
	CardDescription,
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

export default function Component({
	chartConfig,
	chartData
}: {
	chartConfig: ChartConfig;
	chartData: { [key: string]: any }[];
}) {
	const allRadius = [
		[0, 0, 4, 4],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[4, 4, 0, 0]
	] as [number, number, number, number][];
	return (
		<Card className="flex h-[70%] flex-col items-center justify-center border-0 sm:h-full">
			<CardHeader>
				<CardTitle>Bar Chart - Top Emojis</CardTitle>
				<CardDescription>Last {chartData.length} days</CardDescription>
			</CardHeader>
			<CardContent className="w-full p-0">
				<ChartContainer
					className="h-full w-[90%] max-w-[1200px] sm:mx-auto sm:w-[80%] md:w-[70%] lg:w-[60%]"
					config={chartConfig}
				>
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							angle={-25}
							tickLine={true}
							tickMargin={10}
							axisLine={false}
							className="text-xs sm:text-sm"
							interval={0}
						/>
						<YAxis />
						<ChartTooltip content={<ChartTooltipContent hideLabel />} />
						<ChartLegend
							className="text-base sm:text-xl"
							content={<ChartLegendContent />}
							verticalAlign="top"
						/>
						{Object.entries(chartConfig).map(
							([emoji, { label, color }], index) => (
								<Bar
									dataKey={emoji}
									stackId="a"
									fill={color}
									radius={allRadius[index]}
									key={emoji}
								/>
							)
						)}
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
