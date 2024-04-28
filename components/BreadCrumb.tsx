'use client';

// TODO: This is a bit better, but it's not great.

import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

export default function BreadcrumbComponent() {
	const currentPath = usePathname();
	const pathList = currentPath?.split('/');
	pathList?.shift();
	return (
		<Breadcrumb className="mx-4 my-2 font-sans">
			<BreadcrumbList className="hidden text-base capitalize sm:flex">
				{currentPath !== '/' && (
					<>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
					</>
				)}
				{pathList?.slice(0, -1).map((path, index) => (
					<Fragment key={path}>
						<BreadcrumbItem>
							{isNaN(Number(path)) ? (
								<BreadcrumbLink
									href={`/${pathList.slice(0, index + 1).join('/')}`}
								>
									{path.replace('-', ' ')}
								</BreadcrumbLink>
							) : (
								<>{path}</>
							)}
						</BreadcrumbItem>
						<BreadcrumbSeparator />
					</Fragment>
				))}
				<BreadcrumbItem>
					<BreadcrumbPage>
						{pathList[pathList.length - 1].replace('-', ' ')}
					</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
			<BreadcrumbList className="flex text-base capitalize sm:hidden">
				{currentPath !== '/' && (
					<>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
					</>
				)}
				{pathList.length > 1 && (
					<>
						<BreadcrumbItem>
							<BreadcrumbLink href={`/${pathList.slice(0, 1).join('/')}`}>
								{pathList[0].replace('-', ' ')}
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
					</>
				)}
				{pathList.length > 2 && (
					<>
						<BreadcrumbItem>
							<BreadcrumbDropDown>
								{pathList
									?.slice(1, -1)
									.map((path, index) => (
										<BreadcrumbItem key={path}>
											{isNaN(Number(path)) ? (
												<BreadcrumbLink
													href={`/${pathList.slice(0, index + 2).join('/')}`}
												>
													{path.replace('-', ' ')}
												</BreadcrumbLink>
											) : (
												<>{path}</>
											)}
										</BreadcrumbItem>
									))}
							</BreadcrumbDropDown>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
					</>
				)}
				<BreadcrumbItem>
					<BreadcrumbPage>
						{pathList[pathList.length - 1].replace('-', ' ')}
					</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}

function BreadcrumbDropDown({ children }: { children: React.ReactNode }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<BreadcrumbEllipsis />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="flex flex-col gap-2 pl-4 capitalize"
				align="start"
			>
				{children}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
