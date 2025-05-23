import {
	createContext,
	useState,
	useContext,
	ReactNode,
	useCallback,
	useEffect,
} from 'react';
import useVoiceRecognition from '../hooks/useVoiceRecognition';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface VoiceCommandContextType {
	isListening: boolean;
	startListening: () => void;
	stopListening: () => void;
	speakMessage: (text: string) => void;
	stopSpeaking: () => void;
	recognizedText: string;
	isSpeaking: boolean;
}

const VoiceCommandContext = createContext<VoiceCommandContextType | null>(null);

export const useVoiceCommand = () => {
	const context = useContext(VoiceCommandContext);
	if (!context) {
		throw new Error(
			'useVoiceCommand must be used within a VoiceCommandProvider'
		);
	}
	return context;
};

export const VoiceCommandProvider = ({ children }: { children: ReactNode }) => {
	const navigate = useNavigate();
	const { text, isListening, startListening, stopListening, resetText } =
		useVoiceRecognition();
	const { speak, stop, isPlaying } = useSpeechSynthesis();
	const [processingCommand, setProcessingCommand] = useState(false);

	// Process voice commands
	useEffect(() => {
		if (!isListening || processingCommand || !text) return;

		const processCommand = async () => {
			setProcessingCommand(true);

			const lowerText = text.toLowerCase();

			// Give the system time to finish recognizing the full command
			await new Promise((resolve) => setTimeout(resolve, 800));

			console.log('Processing command:', lowerText);

			// Navigation commands
			if (
				lowerText.includes('go to inbox') ||
				lowerText.includes('show inbox')
			) {
				speak('Opening inbox');
				navigate('/dashboard');
			} else if (
				lowerText.includes('go to compose') ||
				lowerText.includes('new email') ||
				lowerText.includes('compose email')
			) {
				speak('Opening compose email');
				navigate('/compose');
			} else if (lowerText.includes('go to settings')) {
				speak('Opening settings');
				navigate('/settings');
			} else if (
				lowerText.includes('log out') ||
				lowerText.includes('sign out')
			) {
				speak('Logging you out');
				// The actual logout will be handled by the auth context
			}
			// Email actions
			else if (
				lowerText.includes('read email') ||
				lowerText.includes('read message')
			) {
				const emailId = extractEmailId(lowerText);
				if (emailId) {
					speak(`Reading email ${emailId}`);
					navigate(`/email/${emailId}`);
				} else {
					speak('Please specify which email to read');
				}
			} else if (
				lowerText.includes('delete email') ||
				lowerText.includes('delete message')
			) {
				const emailId = extractEmailId(lowerText);
				if (emailId) {
					speak(`Deleting email ${emailId}`);
					toast.success(`Email ${emailId} deleted`);
				} else {
					speak('Please specify which email to delete');
				}
			} else if (
				lowerText.includes('refresh') ||
				lowerText.includes('update inbox')
			) {
				speak('Refreshing your inbox');
				toast.success('Inbox refreshed');
			}
			// Command not recognized
			else if (lowerText.length > 10) {
				speak("I didn't recognize that command. Please try again.");
			}

			resetText();
			setProcessingCommand(false);
		};

		processCommand();
	}, [text, isListening, navigate, speak, resetText]);

	const extractEmailId = (text: string): string | null => {
		// Simple regex to find something that looks like "email 1" or "message 2"
		const match = text.match(/(email|message)\s+(\d+)/i);
		return match ? match[2] : null;
	};

	const speakMessage = useCallback(
		(text: string) => {
			stop();
			speak(text);
		},
		[speak, stop]
	);

	return (
		<VoiceCommandContext.Provider
			value={{
				isListening,
				startListening,
				stopListening,
				speakMessage,
				stopSpeaking: stop,
				recognizedText: text,
				isSpeaking: isPlaying,
			}}
		>
			{children}
		</VoiceCommandContext.Provider>
	);
};
