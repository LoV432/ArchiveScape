import { Button } from '@/components/ui/button';

export default function Loading() {
	return (
		<div className="grid">
			<div className="relative mx-auto my-10 flex h-14 w-full max-w-[800px] px-4 sm:w-2/3 sm:px-0">
				<div className="flex w-full gap-5">
					<div className="ml-2 block h-full w-10 py-2 sm:absolute sm:left-0">
						<div
							className={`grid h-full w-[45px] place-items-center rounded hover:bg-accent active:bg-accent`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="ionicon h-full w-6"
								viewBox="0 0 512 512"
							>
								<path
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="32"
									d="M32 144h448M112 256h288M208 368h96"
								/>
							</svg>
						</div>
					</div>
					<input
						disabled
						type="text"
						placeholder="Loading..."
						className="h-full w-full rounded border border-gray-300 border-opacity-35 text-center text-2xl font-bold focus-visible:border-opacity-70 focus-visible:outline-none"
					/>
				</div>
				<div className="absolute right-0 top-0 hidden h-full w-16 p-2 sm:block">
					<Button className="h-full w-full rounded bg-transparent text-3xl text-white hover:bg-zinc-800">
						⏎
					</Button>
				</div>
			</div>
			<div className="flex flex-col place-items-center gap-4">
				<img
					src="/cat.gif"
					alt="cat waiting patiently"
					width={400}
					height={400}
				/>
			</div>
		</div>
	);
}
