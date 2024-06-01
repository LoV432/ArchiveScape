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
			<NavigationMenu className="hidden w-full max-w-[initial] gap-4 sm:flex">
				<NavLogo />
				<NavigationMenuList>
					<NavMenuItem link="/users" currentPath={currentPath} name="Users" />
					<NavMenuItem
						link="/all-messages"
						currentPath={currentPath}
						name="Messages"
					/>
					<NavMenuItem
						link="/random-message"
						currentPath={currentPath}
						name="Random Message"
					/>
					<NavMenuItem link="/replay" currentPath={currentPath} name="Replay" />
					<NavDropDown name="Stats">
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
			<NavigationMenu className="w-full max-w-full justify-start gap-3 py-1 text-left sm:hidden">
				<NavLogo className="mr-auto" />
				<SearchButton isMobile />
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger>
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
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1000 1000"
				shapeRendering="geometricPrecision"
				textRendering="geometricPrecision"
				width={24}
				height={24}
			>
				<path
					d="M63,582c0-13.831665.503162-27.187683-.139-40.488342-.665794-13.790283,2.56575-26.875916,5.380074-40.097016c4.227356-19.859161,8.566352-39.694763,12.743164-59.564483c4.013954-19.095032,7.85897-38.225586,11.820167-57.331818c4.713135-22.733063,9.332169-45.486938,14.2491-68.176086c4.774452-22.031678,10.017082-43.962036,14.771423-65.997879c2.382866-11.044342,3.383156-22.429261,6.337975-33.298798c5.471817-20.12854,14.107025-38.697006,29.077545-53.944824c10.622665-10.819428,21.811417-20.615891,35.871002-26.695587c14.206742-6.143311,28.775452-10.453904,44.494965-10.447884c176.478271.067566,352.956634-.007324,529.434784.115639c18.842651.013122,36.233642,6.220672,52.157409,15.883789c7.995728,4.852066,15.577393,10.760315,22.291809,17.277359c17.881653,17.356033,28.703614,38.690552,33.545655,63.147659c4.007629,20.242615,8.233459,40.442978,12.491272,60.634903c5.086853,24.123657,10.273864,48.226441,15.487427,72.323151c3.815185,17.633728,7.876159,35.215149,11.575988,52.872558c2.682434,12.801728,4.852967,25.70987,7.434571,38.533753c2.703735,13.430755,5.498352,26.845947,8.481628,40.21701c4.757568,21.3237,9.019287,42.479035,8.774231,64.708222-.766113,69.482971-.046082,138.98114-.437195,208.470398-.105224,18.687988-6.748962,35.910583-15.672058,52.284729-6.320801,11.598755-13.965637,22.044677-23.886536,30.778564-12.933899,11.386414-26.890686,21.0495-43.350463,26.838135-12.286805,4.320984-24.763428,6.070007-37.808472,6.061157-214.973511-.146789-429.947174.005737-644.920258-.312561-17.269378-.025513-33.203857-6.664551-48.002952-15.914062-10.607079-6.629578-20.21727-14.236878-29.041764-23.084778C84.573868,825.174622,77.403,810.90918,71.13707,796.17865c-6.792473-15.96814-8.378071-32.871338-8.266362-50.20398C63.221886,691.485107,63,636.991821,63,582M810.038635,231.307617c-.68103-2.29718-1.225281-4.645706-2.065429-6.883133-5.015748-13.357391-13.720826-23.589187-26.851868-29.294296-10.997376-4.778061-22.949341-6.028595-34.784912-6.038559-161.470459-.136108-322.941162-.123627-484.411682-.006378-8.9935.006531-18.070893.684128-26.962464,2.023727-22.375824,3.371125-37.283127,17.843323-42.840561,39.439118-5.252777,20.411941-9.681381,41.046081-14.056869,61.670654-3.984329,18.780762-7.253037,37.71228-11.122574,56.518616-4.839569,23.520721-9.896408,46.997558-14.995712,70.463745-5.9039,27.168854-11.955887,54.305511-18.019165,81.798889c2.254638,0,4.074035,0,5.893432,0c80.485352,0,160.970703.010132,241.456055-.016693c7.505981-.002503,13.589233,3.582336,18.403229,8.546783c6.91922,7.135315,9.355346,16.556946,9.210968,26.26648-.208191,14.004761,4.199432,26.869263,9.817749,39.13977c6.615692,14.448853,18.285339,24.979493,30.992065,34.26709c15.115357,11.047974,32.5047,16.200745,50.749573,16.318115c16.133881.103882,32.037323-3.530395,45.999542-12.62561c17.061035-11.113831,31.633362-24.242676,39.358521-44.014282c5.167175-13.224732,7.259338-26.788635,8.163086-40.703186.866027-13.334534,13.255005-27.263336,27.623291-27.240326C701.913391,501.066772,782.232178,501,862.550903,501c1.763794,0,3.527588,0,5.394287,0-3.389404-15.617889-6.689025-30.715088-9.938293-45.82309-3.693176-17.171783-7.338562-34.35382-11.010071-51.530273-2.661255-12.44989-5.408935-24.881928-7.977051-37.350952-2.993103-14.532501-5.790222-29.105286-8.751098-43.644562-2.70221-13.269318-5.40033-26.541138-8.297852-39.768585-3.720032-16.982483-7.637512-33.921677-11.93219-51.574921M125.999992,708.5c.333306,15.250244.419289,30.510986,1.067139,45.747864.694832,16.342163,7.323387,29.842163,19.52935,41.057922c13.307831,12.228272,29.011032,17.624024,46.51204,17.607361c207.901153-.198486,415.802124-.573425,623.703125-.924805c17.801147-.03009,31.845275-8.967895,43.341735-21.080078c11.385132-11.994873,15.734681-27.689575,15.780762-44.140686.167114-59.661194.067749-119.323181.052918-178.984863-.000306-1.252381-.193909-2.5047-.28711-3.633484-73.739075,0-147.046814,0-220.318054,0-19.55603,80.707703-80.582764,119.656311-141.766113,124.616272-46.682099,3.784363-88.110718-10.893433-122.077515-43.198425-23.258057-22.120179-37.886719-49.900696-44.711975-81.27826-73.79187,0-147.201599,0-220.826294,0c0,47.929322,0,95.570252-.000008,144.211182Z"
					fill="#fff"
				/>
				<path
					d="M604.789917,248.398132c29.032593,29.309906,43.602722,64.116791,43.489197,105.379151-10.363892,0-20.102173,0-30.028504,0-1.347839-32.135376-12.285339-60.089997-35.419738-82.795563-25.339722-24.86998-56.156189-36.712158-91.131745-33.677734-59.380859,5.151825-111.169647,54.558349-107.388702,124.212097c3.09021,56.927612,49.860962,107.672821,116.355408,109.57843c0,9.725525,0,19.473358,0,30.303253-8.627472-.534058-17.596711-.188537-26.174073-1.857269-9.840851-1.914643-19.528473-5.10138-28.93457-8.656403-15.232452-5.757019-29.047119-14.10556-41.232605-25.035187-4.166504-3.73706-9.09259-6.786651-12.644531-11.013458-5.924561-7.050201-11.839051-14.344482-16.264527-22.360412-5.772827-10.45633-10.646972-21.503754-14.911621-32.677094-7.715881-20.215668-7.752472-41.587005-6.206299-62.645508c1.290924-17.581848,6.184784-34.663238,15.247712-50.174102c4.284515-7.332795,7.877166-15.228882,13.121521-21.802063c6.762085-8.475464,14.629394-16.124558,22.444946-23.691391c12.600525-12.199479,27.991608-20.290604,44.169403-26.206955c13.582886-4.967362,27.765747-8.853974,42.629425-8.295502c11.241577.422378,22.56955-.019516,33.707428,1.251968c8.194763.935517,16.251038,3.684937,24.180664,6.216095c15.695984,5.010163,29.786499,13.233551,42.966248,22.976807c4.250122,3.141937,7.91101,7.080795,12.024963,10.97084Z"
					fill="#fff"
				/>
				<path
					d="M605.699219,409.201782c-11.135803-10.123626-21.801575-20.24234-32.942749-29.807342-8.749573-7.511811-18.277588-14.11496-27.059449-21.59198-3.095397-2.635468-4.929138-6.72229-7.471435-10.045075-3.67981-4.809601-7.372192-9.617767-11.266663-14.252228-2.642578-3.144714-2.190857-5.804077.493775-8.485595c4.504822-4.499512,8.957275-9.05304,13.533508-13.478638c2.72168-2.63208,6.654785-2.140015,9.161926.907257c6.556885,7.969666,12.741272,16.29364,19.819886,23.770264c5.119567,5.407409,11.528747,9.574341,17.189636,14.493744c6.798828,5.908203,13.429748,12.010345,20.10437,18.060455c8.512756,7.71637,17.222534,15.234772,25.412414,23.281158c5.322388,5.229065,10.218323,10.999726,14.532532,17.076325c1.163758,1.639191.448426,6.049957-1.031189,7.855011-4.201111,5.125153-9.212158,9.59256-13.965515,14.256561-2.701904,2.651154-4.727112,2.80542-7.513672-.670776-5.879089-7.334381-12.447021-14.116669-18.997375-21.369141Z"
					fill="#fff"
				/>
				<path
					d="M566.274963,439.66861c-6.204162-5.867707-12.075805-11.559449-18.161316-17.012604-7.652709-6.857483-15.370361-13.652313-23.276367-20.21344-4.304504-3.572144-9.787719-5.950592-13.439148-10.030914-5.720367-6.392304-10.508941-13.653931-15.38031-20.761109-5.502563-8.028015-5.433746-8.201477,1.003571-15.593719c3.42218-3.929871,6.888031-7.928925,10.909515-11.186463c2.140442-1.733856,4.883728-1.795898,7.377564,1.522736c6.41217,8.532837,12.965149,17.099579,20.501281,24.609741c7.951539,7.924103,17.149964,14.58963,25.719239,21.903839c5.422058,4.62796,10.881591,9.239685,15.986267,14.206146c10.36145,10.080842,20.516662,20.374451,30.697449,30.639374c1.712524,1.726685,3.796142,3.533112,4.494201,5.694763.727112,2.251526.982605,5.811615-.29779,7.344727-4.353028,5.212402-9.394837,9.867035-14.335327,14.564606-2.739502,2.604889-5.234498,2.684967-8.054932-.641388-6.439087-7.594025-13.277893-14.850983-20.024109-22.180664-.961487-1.044678-2.311829-1.731354-3.719788-2.865631Z"
					fill="#fff"
				/>
				<path
					d="M530.194458,471.697754c-5.030029-4.380341-9.841736-8.465363-14.59375-12.618775-8.379852-7.324249-16.30127-15.253814-25.182709-21.904144-12.73648-9.536896-22.26242-21.830169-31.845459-34.162872-2.519256-3.242127-2.234894-6.733948.653565-9.714264c4.314483-4.451721,8.706451-8.831574,13.161895-13.142303c3.015778-2.917786,5.879487-2.801667,8.610962.638c6.429322,8.096252,12.305848,16.777893,19.627716,23.980774c8.596405,8.456695,18.582245,15.486298,27.778107,23.353882c5.546082,4.745025,10.683899,9.963836,16.099671,14.865387c5.596374,5.064941,11.660339,9.663574,16.87738,15.084381c6.373596,6.622558,12.221252,13.775909,17.919189,20.997375.858155,1.087616.380494,4.431-.700012,5.638336-4.654358,5.20047-9.48999,10.328797-14.876404,14.728241-1.586609,1.295838-6.333435,1.243409-7.701049-.123321-8.826233-8.820282-17.117249-18.176025-25.829102-27.620697Z"
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
