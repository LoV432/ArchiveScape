export default function cursorUpdate(searchQuery: string) {
	if (searchQuery.length < 1) return null;
	const searchQueryBase64 = btoa(searchQuery.toLowerCase());
	if (cursors.includes(searchQueryBase64)) {
		document
			.querySelector<HTMLElement>(':root')
			?.style.setProperty(
				'--cursor',
				`url(/cursor-${searchQueryBase64}.cur), auto`
			);
		document
			.querySelector<HTMLElement>(':root')
			?.style.setProperty(
				'--cursor-pointer',
				`url(/cursor-${searchQueryBase64}-pointer.cur), pointer`
			);
	}
}

const cursors = ['Y2F0'];
