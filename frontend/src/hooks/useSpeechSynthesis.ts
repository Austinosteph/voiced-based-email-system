import { useState, useCallback, useRef } from 'react';

interface UseSpeechSynthesisOptions {
	onStart?: () => void;
	onEnd?: () => void;
	onError?: (error: SpeechSynthesisErrorEvent) => void;
}

export const useSpeechSynthesis = (options: UseSpeechSynthesisOptions = {}) => {
	const [speaking, setSpeaking] = useState(false);
	const [supported, setSupported] = useState(false);
	const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

	const speak = useCallback(
		(
			text: string,
			voiceOptions?: { rate?: number; pitch?: number; volume?: number }
		) => {
			if (!window.speechSynthesis) {
				console.warn('Speech synthesis not supported');
				return;
			}

			// Cancel any ongoing speech
			window.speechSynthesis.cancel();

			const utterance = new SpeechSynthesisUtterance(text);
			utteranceRef.current = utterance;

			// Configure voice options
			utterance.rate = voiceOptions?.rate || 0.9;
			utterance.pitch = voiceOptions?.pitch || 1;
			utterance.volume = voiceOptions?.volume || 1;

			utterance.onstart = () => {
				setSpeaking(true);
				options.onStart?.();
			};

			utterance.onend = () => {
				setSpeaking(false);
				options.onEnd?.();
			};

			utterance.onerror = (error) => {
				setSpeaking(false);
				options.onError?.(error);
			};

			window.speechSynthesis.speak(utterance);
		},
		[options]
	);

	const cancel = useCallback(() => {
		window.speechSynthesis.cancel();
		setSpeaking(false);
	}, []);

	// Check for speech synthesis support
	useState(() => {
		setSupported('speechSynthesis' in window);
	});

	return {
		speak,
		cancel,
		speaking,
		supported,
	};
};
