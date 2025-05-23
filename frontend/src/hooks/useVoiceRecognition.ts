import { useState, useEffect, useRef } from 'react';

interface UseSpeechRecognitionProps {
	onResult?: (transcript: string) => void;
	onEnd?: () => void;
	language?: string;
}

interface SpeechRecognitionEvent extends Event {
	resultIndex: number;
	results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
	[index: number]: SpeechRecognitionResult;
	length: number;
}

interface SpeechRecognitionResult {
	[index: number]: SpeechRecognitionAlternative;
	isFinal: boolean;
	length: number;
}

interface SpeechRecognitionAlternative {
	confidence: number;
	transcript: string;
}

interface ISpeechRecognition extends EventTarget {
	continuous: boolean;
	interimResults: boolean;
	lang: string;
	maxAlternatives: number;
	onstart: (event: Event) => void;
	onend: (event: Event) => void;
	onerror: (event: ErrorEvent) => void;
	onresult: (event: SpeechRecognitionEvent) => void;
	start: () => void;
	stop: () => void;
	abort: () => void;
}

declare global {
	interface Window {
		SpeechRecognition?: new () => ISpeechRecognition;
		webkitSpeechRecognition?: new () => ISpeechRecognition;
	}
}

const useVoiceRecognition = ({
	onResult = () => {},
	onEnd = () => {},
	language = 'en-US',
}: UseSpeechRecognitionProps = {}) => {
	const [isListening, setIsListening] = useState(false);
	const [text, setText] = useState('');
	const recognitionRef = useRef<ISpeechRecognition | null>(null);

	const SpeechRecognitionClass =
		window.SpeechRecognition || window.webkitSpeechRecognition;

	const startListening = () => {
		if (!SpeechRecognitionClass) {
			console.error('Speech recognition is not supported in this browser');
			return;
		}

		recognitionRef.current = new SpeechRecognitionClass();
		const recognition = recognitionRef.current;

		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = language;

		recognition.onresult = (event: SpeechRecognitionEvent) => {
			const transcript = Array.from(event.results)
				.map((result) => result[0].transcript)
				.join('');
			setText(transcript);
			onResult(transcript);
		};

		recognition.onend = () => {
			setIsListening(false);
			onEnd();
		};

		recognition.start();
		setIsListening(true);
	};

	const stopListening = () => {
		if (recognitionRef.current) {
			recognitionRef.current.stop();
			recognitionRef.current = null;
		}
		setIsListening(false);
	};

	const resetText = () => {
		setText('');
	};

	useEffect(() => {
		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.stop();
			}
		};
	}, []);

	return {
		text,
		isListening,
		startListening,
		stopListening,
		resetText,
	};
};

export default useVoiceRecognition;
