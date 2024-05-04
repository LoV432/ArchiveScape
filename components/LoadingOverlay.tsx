export default function LoadingOverlay() {
	return (
		<div className="fixed left-0 top-0 z-50 h-full w-full bg-neutral-800 bg-opacity-60">
			<div className="grid h-full place-items-center">
				<div className="lds-ripple">
					<div></div>
					<div></div>
				</div>
			</div>
		</div>
	);
}
