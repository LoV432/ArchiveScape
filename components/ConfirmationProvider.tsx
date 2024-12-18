'use client';

import {
	createContext,
	SetStateAction,
	Dispatch,
	useContext,
	RefAttributes
} from 'react';
import { useState } from 'react';
import cl from 'clsx';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Button, ButtonProps } from './ui/button';

// This is overly complex for no real reason. I just wanted to check if i could make this.
// It's a confirmation dialog that can be used anywhere in the app.
// It creates a context which is basically a useState hook which can then be used to set the confirmation state.

type ConfirmationStyles = {
	confirmButton?: ButtonProps & RefAttributes<HTMLButtonElement>;
	cancelButton?: ButtonProps & RefAttributes<HTMLButtonElement>;
};

type defaultConfirmation = {
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => Promise<void>;
	onCancel?: () => Promise<void>;
	isOpen: boolean;
	styles?: ConfirmationStyles;
};

const ConfirmationContext = createContext<{
	confirmation: defaultConfirmation;
	setConfirmation: Dispatch<SetStateAction<defaultConfirmation>>;
}>({
	confirmation: {
		isOpen: false,
		onConfirm: async () => {}
	},
	setConfirmation: () => {}
});

function Confirmation({
	confirmation,
	setConfirmation
}: {
	confirmation: defaultConfirmation;
	setConfirmation: Dispatch<SetStateAction<defaultConfirmation>>;
}) {
	function closeConfirmation() {
		setConfirmation({ ...confirmation, isOpen: false });
	}
	return (
		<Dialog open={confirmation.isOpen} onOpenChange={() => closeConfirmation()}>
			<DialogContent className="w-[90%] sm:w-fit">
				<DialogHeader className="gap-3 pb-1">
					<DialogTitle>{confirmation.title || 'Are you sure?'}</DialogTitle>
					<DialogDescription>
						{confirmation.description || ''}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-3">
					<Button
						{...confirmation.styles?.cancelButton}
						className={cl(
							'min-w-20',
							confirmation.styles?.cancelButton?.className
						)}
						onClick={() => {
							confirmation.onCancel?.();
							closeConfirmation();
						}}
					>
						{confirmation.cancelText || 'Cancel'}
					</Button>
					<Button
						{...confirmation.styles?.confirmButton}
						className={cl(
							'min-w-20',
							confirmation.styles?.confirmButton?.className
						)}
						onClick={() => {
							confirmation.onConfirm();
							closeConfirmation();
						}}
					>
						{confirmation.confirmText || 'Confirm'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default function ConfirmationProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const [confirmation, setConfirmation] = useState({
		isOpen: false,
		onConfirm: async () => {}
	});
	return (
		<ConfirmationContext.Provider
			value={{
				confirmation,
				setConfirmation
			}}
		>
			<Confirmation
				confirmation={confirmation}
				setConfirmation={setConfirmation}
			/>
			{children}
		</ConfirmationContext.Provider>
	);
}

export function useConfirmation() {
	const context = useContext(ConfirmationContext);
	if (!context) {
		throw new Error(
			'useConfirmation must be used within a ConfirmationProvider'
		);
	}
	function setConfirmationState(newState: Omit<defaultConfirmation, 'isOpen'>) {
		context.setConfirmation({ ...newState, isOpen: true });
	}
	return setConfirmationState;
}
