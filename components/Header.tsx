'use client';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTrigger
} from '@/components/ui/sheet';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
	const currentPath = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	return (
		<header className="sticky top-0 z-10 mb-2 w-full border-b border-muted bg-background px-2 py-2 sm:px-5">
			<NavigationMenu className="hidden w-full max-w-[initial] gap-4 sm:flex">
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
								className={`mr-5 text-xl font-bold tracking-widest`}
							>
								ArchiveScape
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/users" legacyBehavior passHref>
							<NavigationMenuLink
								className={`${navigationMenuTriggerStyle()} text-lg font-semibold ${currentPath === '/users' ? 'text-primary' : 'text-zinc-400'}`}
							>
								Users
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/all-messages" legacyBehavior passHref>
							<NavigationMenuLink
								className={`${navigationMenuTriggerStyle()} text-lg font-semibold ${currentPath === '/all-messages' ? 'text-primary' : 'text-zinc-400'}`}
							>
								Messages
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
			<NavigationMenu className="w-full max-w-full justify-start gap-3 py-1 sm:hidden">
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
				<Link href="/" legacyBehavior passHref>
					<NavigationMenuLink
						className={`mr-auto text-center text-xl font-bold tracking-widest`}
					>
						ArchiveScape
					</NavigationMenuLink>
				</Link>
				<Link href="/search" legacyBehavior passHref>
					<NavigationMenuLink
						className={`mr-2.5 text-center text-xl font-bold`}
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
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger>
						<Image
							priority
							className="h-7 w-7"
							src="/list-outline.svg"
							alt="logo"
							width={24}
							height={24}
						/>
					</SheetTrigger>
					<SheetContent className="w-fit min-w-[300px]" side="right">
						<SheetHeader>
							<SheetDescription className="pt-2">
								<NavigationMenuList className="float-left flex-col gap-5 space-x-0">
									<NavigationMenuItem
										className="pb-3"
										onClick={() => setIsOpen(false)}
									>
										<Link href="/" legacyBehavior passHref>
											<div className="flex items-center gap-3">
												<Image
													priority
													className="h-6 w-6"
													src="/logo.png"
													alt="logo"
													width={24}
													height={24}
												/>
												<NavigationMenuLink
													className={`text-xl font-bold tracking-widest text-white`}
												>
													ArchiveScape
												</NavigationMenuLink>
											</div>
										</Link>
									</NavigationMenuItem>
									<NavigationMenuItem className="w-full text-left">
										<Link
											onClick={() => setIsOpen(false)}
											href="/users"
											className={`text-lg font-semibold ${currentPath === '/users' ? 'text-primary' : 'text-zinc-400'}`}
										>
											Users
										</Link>
									</NavigationMenuItem>
									<NavigationMenuItem className="w-full text-left">
										<Link
											onClick={() => setIsOpen(false)}
											href="/all-messages"
											className={`text-lg font-semibold ${currentPath === '/all-messages' ? 'text-primary' : 'text-zinc-400'}`}
										>
											Messages
										</Link>
									</NavigationMenuItem>
								</NavigationMenuList>
							</SheetDescription>
						</SheetHeader>
					</SheetContent>
				</Sheet>
			</NavigationMenu>
		</header>
	);
}
