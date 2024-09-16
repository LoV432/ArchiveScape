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
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
	const currentPath = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const [autoFocus, setAutoFocus] = useState(true);
	useEffect(() => {
		if (window.matchMedia('(pointer: coarse)').matches) {
			setAutoFocus(false);
		}
	}, []);
	return (
		<header className="sticky top-0 z-10 mb-2 w-full border-b border-muted bg-background px-2 py-2 sm:px-5">
			<NavigationMenu className="flex w-full max-w-[initial] gap-4 max-[1125px]:hidden">
				<NavLogo />
				<NavigationMenuList>
					<NavMenuItem link="/users" currentPath={currentPath} name="Users" />
					<NavMenuItem
						link="/all-messages"
						currentPath={currentPath}
						name="Messages"
					/>
					<NavMenuItem
						link="/conversation-tracker"
						currentPath={currentPath}
						name="Conversation Tracker"
					/>
					<NavMenuItem
						link="/random-message"
						currentPath={currentPath}
						name="Random Message"
					/>
					<NavMenuItem link="/replay" currentPath={currentPath} name="Replay" />
					<NavDropDown name="Stats">
						<NavDropDownItem
							link="/stats/daily-usage"
							currentPath={currentPath}
							name="Daily Usage"
						/>
						<NavDropDownItem
							link="/stats/trends"
							currentPath={currentPath}
							name="Word Trends"
						/>
						<NavDropDownItem
							link="/stats/top-10-users"
							currentPath={currentPath}
							name="Top 10 Users"
						/>
						<NavDropDownItem
							link="/stats/words-cloud"
							currentPath={currentPath}
							name="Most Used Words"
						/>
						<NavDropDownItem
							link="/stats/rickroll"
							currentPath={currentPath}
							name="Rickroll"
						/>
						<NavDropDownItem
							link="/stats/links"
							currentPath={currentPath}
							name="Links"
						/>
						<NavDropDownItem
							link="/stats/emojis"
							currentPath={currentPath}
							name="Emojis"
						/>
					</NavDropDown>
				</NavigationMenuList>
				<SearchButton />
			</NavigationMenu>
			<NavigationMenu className="w-full max-w-full justify-start gap-3 py-1 text-left min-[1126px]:hidden">
				<NavLogo className="mr-auto" />
				<SearchButton isMobile />
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger aria-label="Open menu">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							width={24}
							height={24}
						>
							<path
								fill="none"
								stroke="white"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="32"
								d="M160 144h288M160 256h288M160 368h288"
							/>
							<circle
								cx="80"
								cy="144"
								r="16"
								fill="none"
								stroke="white"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="32"
							/>
							<circle
								cx="80"
								cy="256"
								r="16"
								fill="none"
								stroke="white"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="32"
							/>
							<circle
								cx="80"
								cy="368"
								r="16"
								fill="none"
								stroke="white"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="32"
							/>
						</svg>
					</SheetTrigger>
					<SheetContent
						className="w-fit min-w-[300px]"
						side="right"
						onCloseAutoFocus={(e) => {
							if (!autoFocus) e.preventDefault();
						}}
					>
						<DialogTitle hidden>
							<DialogDescription>Mobile Navbar</DialogDescription>
						</DialogTitle>
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
							<NavMenuItem
								link="/conversation-tracker"
								currentPath={currentPath}
								name="Conversation Tracker"
								isMobile
								onClick={() => setIsOpen(false)}
							/>
							<NavMenuItem
								link="/random-message"
								currentPath={currentPath}
								name="Random Message"
								isMobile
								onClick={() => setIsOpen(false)}
							/>
							<NavMenuItem
								link="/replay"
								currentPath={currentPath}
								name="Replay"
								isMobile
								onClick={() => setIsOpen(false)}
							/>
							<NavDropDown isMobile name="Stats">
								<NavDropDownItem
									link="/stats/daily-usage"
									currentPath={currentPath}
									name="Daily Usage"
									onClick={() => setIsOpen(false)}
								/>
								<NavDropDownItem
									link="/stats/trends"
									currentPath={currentPath}
									name="Word Trends"
									onClick={() => setIsOpen(false)}
								/>
								<NavDropDownItem
									link="/stats/top-10-users"
									currentPath={currentPath}
									name="Top 10 Users"
									onClick={() => setIsOpen(false)}
								/>
								<NavDropDownItem
									link="/stats/words-cloud"
									currentPath={currentPath}
									name="Most Used Words"
									onClick={() => setIsOpen(false)}
								/>
								<NavDropDownItem
									link="/stats/rickroll"
									currentPath={currentPath}
									name="Rickroll"
									onClick={() => setIsOpen(false)}
								/>
								<NavDropDownItem
									link="/stats/links"
									currentPath={currentPath}
									name="Links"
									onClick={() => setIsOpen(false)}
								/>
								<NavDropDownItem
									link="/stats/emojis"
									currentPath={currentPath}
									name="Emojis"
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
					className={`${isMobile ? '' : navigationMenuTriggerStyle()} text-center text-lg font-semibold ${currentPath === link ? 'text-primary' : 'text-zinc-400'}`}
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
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1000 1000"
				shapeRendering="geometricPrecision"
				textRendering="geometricPrecision"
				width={24}
				height={24}
			>
				<path
					d="M63 582v-40q0-20 5-41l13-59 12-57 14-69 15-66 6-33q8-31 29-54 16-17 36-27 21-9 45-10h529q28 1 52 16 12 8 22 17 27 27 34 63l28 133 12 53 7 39 9 40q8 31 8 65v208q-1 28-16 52-9 18-24 31-19 18-43 27-18 6-38 6H173q-25-1-48-16-15-10-29-23a124 124 0 0 1-33-91zm747-351-2-7q-8-20-27-29-17-7-35-6l-511 2q-33 6-43 40l-14 61-11 57-15 70-18 82h247q12 1 19 9 10 11 9 26 1 21 10 39 10 21 31 34 23 16 50 17 25 0 46-13 28-15 40-44 7-20 8-41c1-13 13-27 28-27h246l-10-46-11-51-8-38-9-43-8-40zM126 709l1 45q1 25 20 41 20 19 46 18l624-1q27-2 43-21 17-19 16-44V564H655c-19 81-80 120-141 125q-71 6-122-43-35-34-45-82H126z"
					fill="#fff"
				/>
				<path
					d="M605 248q43 45 43 106h-30q-1-48-35-83-39-38-91-34a117 117 0 0 0 9 234v30l-27-1-28-9q-23-9-42-25l-12-11-17-23-14-32q-10-31-7-63 2-26 16-50 5-11 13-22l22-24q20-17 44-26 21-8 43-8l34 1 24 6q23 9 43 23z"
					fill="#fff"
				/>
				<path
					d="m606 409-33-30-27-21-8-10-11-14q-4-5 0-9l14-13q5-4 9 0l20 24 17 15 20 18 26 23 14 17q2 4-1 8l-14 14q-3 5-7 0zm-40 31-18-17-23-21-14-10-15-20c-5-8-5-9 1-16l11-11q4-3 7 1l21 25 26 22 16 14 30 31 5 5q1 5-1 8l-14 14q-4 4-8 0l-20-22zm-36 32-14-13-26-22q-18-15-31-34-5-5 0-10l13-13q4-5 9 1 9 13 20 24l27 23 17 15 16 15 18 21v6l-15 14q-5 3-8 0z"
					fill="#fff"
				/>
			</svg>
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
				aria-label="Search"
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
