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
		<header className="sticky mb-2 flex w-full border-b border-muted bg-background px-5 pt-2">
			<NavigationMenu>
				<NavigationMenuList className="gap-2">
					<NavigationMenuItem>
						<Link href="/" legacyBehavior passHref>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								<Image src="/logo.png" alt="logo" width={40} height={40} />
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</header>
	);
}
