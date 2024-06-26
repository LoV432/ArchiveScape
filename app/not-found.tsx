'use client';
import { useEffect, useState, useRef } from 'react';

export default function NotFound() {
	const [errorText, setErrorText] = useState('');
	const errorTextRef = useRef(
		'This page does not exist. Please check the URL and try again.'
	);
	useEffect(() => {
		const errorList = errorTextRef.current.split('');
		for (let i = 0; i < errorList.length; i++) {
			setTimeout(() => {
				setErrorText(errorList.slice(0, i + 1).join(''));
			}, i * 60);
		}
	}, []);
	return (
		<div className="flex h-full flex-col items-center justify-start px-5 pt-28">
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="50 50 200 200"
					shapeRendering="geometricPrecision"
					textRendering="geometricPrecision"
					className="h-32 w-32 sm:h-64 sm:w-64"
				>
					<ellipse
						rx="29.087648"
						ry="29.087648"
						transform="matrix(.613887 0 0 0.613887 95.668131 113.659662)"
						fill="#fff"
						strokeWidth="0"
					/>
					<ellipse
						rx="29.087648"
						ry="29.087648"
						transform="matrix(.613889 0 0 0.613889 202.061891 113.659633)"
						fill="#fff"
						strokeWidth="0"
					/>
					<line
						x1="-24.09021"
						y1="23.923629"
						x2="24.09021"
						y2="-23.923629"
						transform="matrix(.953981 0.201303-.19409 0.919796 124.422348 177.923629)"
						fill="none"
						stroke="#fff"
						strokeWidth="10"
					/>
					<line
						x1="-24.09021"
						y1="23.923629"
						x2="24.09021"
						y2="-23.923629"
						transform="matrix(.248296 0.942843-.909057 0.239399 174.422348 177.923629)"
						fill="none"
						stroke="#fff"
						strokeWidth="10"
					/>
				</svg>
			</div>
			<h1 className="justify-start pb-10 text-7xl font-bold sm:text-9xl">
				404
			</h1>
			<div className="text-center text-2xl sm:text-4xl">
				{errorText}
				<noscript>{errorTextRef.current}</noscript>
				<span className="caret-box">&nbsp;</span>
			</div>
		</div>
	);
}
