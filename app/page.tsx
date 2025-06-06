import Link from 'next/link';
export const dynamic = 'force-dynamic';
import { getCount } from '@/lib/get-count';
import { WebSite } from 'schema-dts';
import Script from 'next/script';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { memCache, min } from '@/lib/memCache';
import { Suspense, use } from 'react';

const richText: WebSite = {
	'@type': 'WebSite',
	'@id': 'https://archivescape.monib.xyz',
	url: 'https://archivescape.monib.xyz',
	name: 'ArchiveScape',
	description: 'An open source archive of VentScape.'
};

async function getCountWithCache() {
	return await memCache.get('count', min(5), async () => {
		return await getCount();
	});
}

export default function Home() {
	const promiseData = getCountWithCache();
	return (
		<div className="prose lg:prose-xl mx-4 flex w-fit max-w-[800px] flex-col gap-5 pb-8 text-slate-200 sm:mx-auto sm:w-1/2 sm:pt-5">
			<Script
				id="rich-text"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(richText) }}
			/>
			<h1 className="mb-5 w-full text-4xl font-bold sm:text-6xl">
				Welcome to ArchiveScape
			</h1>
			<section>
				<h2 className="mb-5 w-fit text-xl font-bold sm:text-3xl">
					<span className="relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-b-white after:border-opacity-30">
						What is ArchiveScape?
					</span>
				</h2>
				<div className="text-base sm:text-xl">
					ArchiveScape is a public archive of{' '}
					<a
						className="text-lg font-bold underline underline-offset-4 sm:text-2xl"
						href="https://ventscape.life"
						target="_blank"
					>
						VentScape
					</a>
					. So far, I have archived{' '}
					<Link
						className="text-lg font-bold underline underline-offset-4 sm:text-2xl"
						href="/all-messages"
					>
						<Suspense
							fallback={<span className="animate-pulse">{'0,000,000'}</span>}
						>
							<Count type="messagesCount" dataPromise={promiseData} />
						</Suspense>
					</Link>{' '}
					messages from{' '}
					<Link
						className="text-lg font-bold underline underline-offset-4 sm:text-2xl"
						href="/users"
					>
						<Suspense
							fallback={<span className="animate-pulse">{'00,000'}</span>}
						>
							<Count type="usersCount" dataPromise={promiseData} />
						</Suspense>
					</Link>{' '}
					unique{' '}
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant={'link'}
								className="m-0 h-fit w-fit p-0 text-base underline underline-offset-4 sm:text-xl"
							>
								users
							</Button>
						</DialogTrigger>
						<DialogContent className="w-[600px] max-w-[85vw] rounded-lg">
							<DialogTitle hidden>What is a user?</DialogTitle>
							<p className="text-base sm:text-xl">
								A &quot;user&quot; is just a random{' '}
								<Link
									className="underline underline-offset-4"
									href="https://en.wikipedia.org/wiki/Universally_unique_identifier"
									target="_blank"
								>
									UUID
								</Link>{' '}
								that is generated when you first visit VentScape. This UUID can
								be reset by deleting your browser&apos;s cookies or temporarily
								bypassed by using &quot;incognito/private&quot; mode of your
								browser.
							</p>
						</DialogContent>
					</Dialog>
					*. This archive was started on April 12, 2024 at 17:00 UTC and it is
					currently being updated every 5 minutes.
				</div>
			</section>

			<section>
				<h2 className="mb-5 w-fit text-xl font-bold sm:text-3xl">
					<span className="relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-b-white after:border-opacity-30">
						Why Create ArchiveScape?
					</span>
				</h2>
				<p className="text-base sm:text-xl">
					You might be wondering, &quot;Doesn&apos;t this website defeat the
					whole purpose of VentScape?&quot; The answer is yes
					<span className="text-nowrap">&nbsp;(╥﹏╥)</span>, but it&apos;s very
					unlikely that I am the only person recording messages from VentScape.
					Does that justify me also doing it? The answer is no
					<span className="text-nowrap">&nbsp;(ง ͠ಥ_ಥ)ง</span>, but at least I am
					making a semi-useful website out of it.
				</p>
			</section>

			<section>
				<h2 className="mb-5 w-fit text-xl font-bold sm:text-3xl">
					<span className="relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-b-white after:border-opacity-30">
						Project Structure
					</span>
				</h2>
				<p className="text-base sm:text-xl">
					The code of this project is split into two parts: the frontend (this
					website) and the collection script. The frontend is a Next.js app that
					you can find{' '}
					<a
						className="text-lg font-bold underline underline-offset-4 sm:text-2xl"
						href="https://github.com/LoV432/archivescape"
						target="_blank"
					>
						here
					</a>
					. The collection script is a JS/TS script that runs a Puppeteer
					instance to record messages from{' '}
					<a
						className="text-lg font-bold underline underline-offset-4 sm:text-2xl"
						href="https://ventscape.life"
						target="_blank"
					>
						VentScape
					</a>
					. You can find the code{' '}
					<a
						className="text-lg font-bold underline underline-offset-4 sm:text-2xl"
						href="https://github.com/LoV432/ventscape-archive"
						target="_blank"
					>
						here
					</a>
					.
				</p>
			</section>
			<section>
				<h2 className="mb-5 w-fit text-xl font-bold sm:text-3xl">
					<span className="relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-b-white after:border-opacity-30">
						Disclaimer
					</span>
				</h2>
				<p className="text-base sm:text-xl">
					ArchiveScape is run by a completely separate person and has no
					connection to the original developer of{' '}
					<a
						className="text-lg font-bold underline underline-offset-4 sm:text-2xl"
						href="https://ventscape.life"
						target="_blank"
					>
						VentScape
					</a>
					.
				</p>
			</section>
		</div>
	);
}

function Count({
	type,
	dataPromise
}: {
	type: 'usersCount' | 'messagesCount';
	dataPromise: Promise<{ usersCount: string; messagesCount: string }>;
}) {
	const data = use(dataPromise);
	return parseInt(data[type]).toLocaleString();
}
