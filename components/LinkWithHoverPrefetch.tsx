'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LinkWithHoverPrefetch({
	href,
	children,
	className
}: {
	href: string;
	children: React.ReactNode;
	className?: string;
}) {
	const router = useRouter();
	return (
		<Link
			prefetch={false}
			className={className}
			href={href}
			onMouseOver={() => {
				router.prefetch(href);
			}}
		>
			{children}
		</Link>
	);
}
