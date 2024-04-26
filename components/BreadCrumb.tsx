'use client';

// TODO: This works but holy shit this is an awful way to do this. I need to find a better solution

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
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

import { usePathname } from 'next/navigation';

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
				{pathList?.map((path, index) => (
					<>
						{index == pathList.length - 1 ? (
							<BreadcrumbItem>
								<BreadcrumbPage>{path.replace('-', ' ')}</BreadcrumbPage>
							</BreadcrumbItem>
						) : (
							<>
								{isNaN(Number(path)) ? (
									<BreadcrumbItem>
										<BreadcrumbLink
											href={`/${pathList.slice(0, index + 1).join('/')}`}
										>
											{path.replace('-', ' ')}
										</BreadcrumbLink>
									</BreadcrumbItem>
								) : (
									path.replace('-', ' ')
								)}

								<BreadcrumbSeparator />
							</>
						)}
					</>
				))}
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
				{pathList.length > 0 && (
					<>
						{pathList.length > 2 && (
							<>
								<BreadcrumbItem>
									<BreadcrumbLink href={`/${pathList.slice(0, 2).join('/')}`}>
										{pathList[0].replace('-', ' ')}
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbItem>
									<DropdownMenu>
										<DropdownMenuTrigger>
											<BreadcrumbEllipsis />
										</DropdownMenuTrigger>
										<DropdownMenuContent className="capitalize" align="start">
											{pathList?.map((path, index) => (
												<>
													{index !== pathList.length - 1 && index !== 0 && (
														<>
															{isNaN(Number(path)) ? (
																<Link
																	href={`/${pathList.slice(0, index + 1).join('/')}`}
																>
																	<DropdownMenuItem>
																		{path.replace('-', ' ')}
																	</DropdownMenuItem>
																</Link>
															) : (
																<DropdownMenuItem>
																	{path.replace('-', ' ')}
																</DropdownMenuItem>
															)}
														</>
													)}
												</>
											))}
										</DropdownMenuContent>
										<BreadcrumbSeparator />
									</DropdownMenu>
								</BreadcrumbItem>
							</>
						)}
						<BreadcrumbItem>
							<BreadcrumbPage>
								{pathList[pathList.length - 1].replace('-', ' ')}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
