export default function StopHammering() {
	return (
		<div className="flex h-full items-center justify-center p-8 text-white">
			<div className="max-w-2xl text-center">
				<h1 className="mb-8 text-4xl font-bold">Stop hammering the server</h1>
				<p className="mb-8 text-xl">
					Email me what you want at{' '}
					<a href="mailto:archivescape@monib.xyz">archivescape@monib.xyz</a> and
					I might just give you the whole DB dump
				</p>
			</div>
		</div>
	);
}
