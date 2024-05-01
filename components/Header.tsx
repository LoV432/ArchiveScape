'use client';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
				<NavLogo />
				<NavigationMenuList>
					<NavMenuItem link="/users" currentPath={currentPath} name="Users" />
					<NavMenuItem
						link="/all-messages"
						currentPath={currentPath}
						name="Messages"
					/>
					<NavDropDownItem
						link="/clouds/words-cloud"
						currentPath={currentPath}
						name="Most Used Words"
					/>
					<NavDropDown name="Stats">
						<NavDropDownItem
							link="/stats/rickroll"
							currentPath={currentPath}
							name="Rickroll"
						/>
					</NavDropDown>
				</NavigationMenuList>
				<SearchButton />
			</NavigationMenu>
			<NavigationMenu className="w-full max-w-full justify-start gap-3 py-1 text-left sm:hidden">
				<NavLogo className="mr-auto" />
				<SearchButton isMobile />
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
						<NavLogo className="pb-8 pt-2" onClick={() => setIsOpen(false)} />
						<NavigationMenuList className="float-left flex-col gap-5 space-x-0">
							<NavMenuItem
								link="/users"
								currentPath={currentPath}
								name="Users"
								isMobile
								onClick={() => setIsOpen(false)}
							/>
							<NavMenuItem
								link="/all-messages"
								currentPath={currentPath}
								name="All Messages"
								isMobile
								onClick={() => setIsOpen(false)}
							/>
							<NavDropDownItem
								link="/clouds/words-cloud"
								currentPath={currentPath}
								name="Most Used Words"
								onClick={() => setIsOpen(false)}
							/>
							<NavDropDown isMobile name="Stats">
								<NavDropDownItem
									link="/stats/rickroll"
									currentPath={currentPath}
									name="Rickroll"
									onClick={() => setIsOpen(false)}
								/>
							</NavDropDown>
						</NavigationMenuList>
					</SheetContent>
				</Sheet>
			</NavigationMenu>
		</header>
	);
}

function NavMenuItem({
	link,
	currentPath,
	name,
	isMobile = false,
	onClick
}: {
	link: string;
	currentPath: string;
	name: string;
	isMobile?: boolean;
	onClick?: () => void;
}) {
	return (
		<NavigationMenuItem
			{...{ onClick }}
			className={`${isMobile ? 'w-full' : ''}`}
		>
			<Link href={link} legacyBehavior passHref>
				<NavigationMenuLink
					className={`${isMobile ? '' : navigationMenuTriggerStyle()} text-lg font-semibold ${currentPath === link ? 'text-primary' : 'text-zinc-400'}`}
				>
					{name}
				</NavigationMenuLink>
			</Link>
		</NavigationMenuItem>
	);
}

function NavDropDownItem({
	link,
	currentPath,
	name,
	onClick
}: {
	link: string;
	currentPath: string;
	name: string;
	onClick?: () => void;
}) {
	return (
		<Link href={link} legacyBehavior passHref>
			<NavigationMenuLink
				{...{ onClick }}
				className={`${navigationMenuTriggerStyle()} w-full min-w-max text-lg font-semibold ${currentPath === link ? 'text-primary' : 'text-zinc-400'}`}
			>
				{name}
			</NavigationMenuLink>
		</Link>
	);
}

function NavDropDownItemAnimatedSwear({
	link,
	currentPath,
	onClick
}: {
	link: string;
	currentPath: string;
	onClick?: () => void;
}) {
	return (
		<Link href={link} legacyBehavior passHref>
			<NavigationMenuLink
				{...{ onClick }}
				className={`${navigationMenuTriggerStyle()} w-full min-w-max text-lg font-semibold ${currentPath === link ? 'text-primary' : 'text-zinc-400'}`}
			>
				Most used&nbsp;
				<div className="inline-block after:animate-[animatedSwearText_4s_infinite]"></div>
			</NavigationMenuLink>
		</Link>
	);
}

function NavLogo({
	onClick,
	className
}: {
	onClick?: () => void;
	className?: string;
}) {
	return (
		<div
			onClick={onClick}
			className={`${className} flex cursor-pointer items-center gap-3`}
		>
			<Image
				priority
				className="h-6 w-6"
				src="/logo.png"
				alt="logo"
				width={24}
				height={24}
			/>
			<Link href="/" className="text-xl font-bold tracking-widest text-white">
				ArchiveScape
			</Link>
		</div>
	);
}

function NavDropDown({
	children,
	name,
	isMobile = false
}: {
	children: React.ReactNode;
	name: string;
	isMobile?: boolean;
}) {
	return (
		<NavigationMenuItem className={`${isMobile ? 'w-full' : ''}`}>
			<NavigationMenuTrigger
				className={`${isMobile ? 'flex flex-row place-items-center' : navigationMenuTriggerStyle()} text-lg font-semibold text-zinc-400`}
			>
				{name}
			</NavigationMenuTrigger>
			<NavigationMenuContent className="flex flex-col border border-muted bg-background">
				{children}
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
}

function SearchButton({ isMobile = false }: { isMobile?: boolean }) {
	return (
		<Link href="/search" legacyBehavior passHref>
			<NavigationMenuLink
				className={`${isMobile ? 'mr-2.5' : `${navigationMenuTriggerStyle()} ml-auto`} text-center text-xl font-bold`}
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
	);
}
