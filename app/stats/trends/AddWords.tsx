import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AddWords({
	selectedWords,
	setSelectedWords,
	isLoading
}: {
	selectedWords: string[];
	setSelectedWords: React.Dispatch<React.SetStateAction<string[]>>;
	isLoading: boolean;
}) {
	const placeHolders = ['they', 'are', 'always', 'watching', 'YOU'];
	function handleSubmit(formData: FormData) {
		const words = Array.from(formData.entries()).map(
			([key, value]) => value
		) as string[];
		const wordsWithoutEmpty = words.filter((word) => word.length > 0);
		setSelectedWords([...wordsWithoutEmpty]);
	}
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Add Words</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Words</DialogTitle>
					<DialogDescription>
						Add or remove words to be tracked in the Trends Chart.
					</DialogDescription>
				</DialogHeader>
				<form action={handleSubmit}>
					<div className="grid gap-4 py-4">
						{placeHolders.map((word, index) => (
							<div className="grid grid-cols-4 items-center gap-4" key={index}>
								<Label htmlFor={`word-${index + 1}`} className="text-right">
									Word {index + 1}
								</Label>
								<Input
									id={`word-${index + 1}`}
									name={`word-${index + 1}`}
									placeholder={word}
									defaultValue={selectedWords[index]}
									className="col-span-3"
								/>
							</div>
						))}
					</div>
					<DialogFooter>
						<Button disabled={isLoading} type="submit">
							Save changes
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
