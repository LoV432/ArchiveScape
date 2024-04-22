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
			<NavigationMenu className="gap-2">
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
								className={`${navigationMenuTriggerStyle()} text-center text-xl font-bold`}
							>
								Ventscape Archive
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</header>
	);
}
