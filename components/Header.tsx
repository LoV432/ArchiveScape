'use client';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
	return (
		<header className="sticky top-0 z-10 mb-2 w-full border-b border-muted bg-background px-5 py-2">
			<NavigationMenu className="w-full max-w-[initial] gap-2">
				<Link href="/" legacyBehavior passHref>
					<NavigationMenuLink>
						<Image
							priority
							className="h-6 w-6"
							src="/logo.png"
							alt="logo"
							width={24}
							height={24}
						/>
					</NavigationMenuLink>
				</Link>
				<NavigationMenuList>
					<NavigationMenuItem>
						<Link href="/" legacyBehavior passHref>
							<NavigationMenuLink
								className={`${navigationMenuTriggerStyle()} text-center text-xl font-bold tracking-widest`}
							>
								ArchiveScape
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
				<Link href="/search" legacyBehavior passHref>
					<NavigationMenuLink
						className={`${navigationMenuTriggerStyle()} ml-auto text-center text-xl font-bold`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="ionicon h-6 w-6 fill-white"
							viewBox="0 0 512 512"
						>
							<path d="M464 428L339.92 303.9a160.48 160.48 0 0030.72-94.58C370.64 120.37 298.27 48 209.32 48S48 120.37 48 209.32s72.37 161.32 161.32 161.32a160.48 160.48 0 0094.58-30.72L428 464zM209.32 319.69a110.38 110.38 0 11110.37-110.37 110.5 110.5 0 01-110.37 110.37z" />
						</svg>
					</NavigationMenuLink>
				</Link>
			</NavigationMenu>
		</header>
	);
}
