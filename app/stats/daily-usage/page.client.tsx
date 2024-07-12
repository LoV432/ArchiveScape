'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
	ChartTooltip,
	ChartTooltipContent
} from '@/components/ui/chart';

const chartConfig = {
	messages: {
		label: 'Messages',
		color: 'hsl(var(--chart-5))'
	}
} satisfies ChartConfig;

export default function DailyUsageChart({
	chartData
}: {
	chartData: { date: string; messages: number }[];
}) {
	return (
		<Card className="flex h-full flex-col items-center justify-center border-0 text-center">
			<CardHeader>
				<CardTitle>Area Chart - Daily Usage</CardTitle>
				<CardDescription>
					Showing total messages sent in the last 20 days
				</CardDescription>
			</CardHeader>
			<CardContent className="p-0">
				<ChartContainer
					className="h-[20vh] w-[93vw] sm:mx-auto sm:h-[40vh]"
					config={chartConfig}
				>
					<AreaChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: -10,
							right: 12
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis dataKey="date" tickMargin={8} />
						<YAxis tickMargin={8} />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Area
							dataKey="messages"
							type="natural"
							fill="var(--color-messages)"
							fillOpacity={0.3}
							stroke="var(--color-messages)"
							stackId="a"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
