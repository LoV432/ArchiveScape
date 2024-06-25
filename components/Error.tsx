export default function Error({ error }: { error: string }) {
	return (
		<div className="grid">
			<h1 className="place-self-center py-5 text-center text-xl font-bold text-rose-900 sm:text-5xl">
				<p className="pb-7">Error</p>
				<p>{error}</p>
			</h1>
		</div>
	);
}
