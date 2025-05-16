import { useState, useEffect, useRef } from 'react';

// This is a custom hook for voice recognition
// It uses the Web Speech API to recognize speech

interface UseSpeechRecognitionProps {
	onResult?: (transcript: string) => void;
	onEnd?: () => void;
	language?: string;
}

// Define the types for Speech Recognition
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

interface SpeechRecognition extends EventTarget {
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

// Access the global SpeechRecognition object with proper type checks
declare global {
	interface Window {
		SpeechRecognition?: typeof SpeechRecognition;
		webkitSpeechRecognition?: typeof SpeechRecognition;
	}
}

const useVoiceRecognition = ({
	onResult = () => {},
	onEnd = () => {},
	language = 'en-US',
}: UseSpeechRecognitionProps = {}) => {
	const [isListening, setIsListening] = useState(false);
	const recognitionRef = useRef<SpeechRecognition | null>(null);

	const SpeechRecognition =
		window.SpeechRecognition || window.webkitSpeechRecognition;

	const startListening = () => {
		if (!SpeechRecognition) {
			console.error('Speech recognition is not supported in this browser');
			return;
		}

		recognitionRef.current = new SpeechRecognition();
		const recognition = recognitionRef.current;

		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = language;

		recognition.onresult = (event: SpeechRecognitionEvent) => {
			const transcript = Array.from(event.results)
				.map((result) => result[0].transcript)
				.join('');

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

	useEffect(() => {
		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.stop();
			}
		};
	}, []);

	return {
		isListening,
		startListening,
		stopListening,
	};
};

export default useVoiceRecognition;
