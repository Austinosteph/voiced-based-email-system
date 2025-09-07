import { useState, useEffect } from 'react';
import { LoginCard } from '@/components/LoginCard';
import { VoiceControl } from '@/components/VoiceControl';
import { EmailList } from '@/components/EmailList';
import { SentEmails } from '@/components/SentEmails';
import { ComposeEmail } from '@/components/ComposeEmail';
import { Header } from '@/components/Header';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [selectedEmailId, setSelectedEmailId] = useState<string>();
	const [isComposing, setIsComposing] = useState(false);
	const [activeTab, setActiveTab] = useState('inbox');

	const { speak } = useSpeechSynthesis();

	// Load user from localStorage OR from redirect query params
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const accessToken = params.get('access_token');
		const refreshToken = params.get('refresh_token');

		if (accessToken) {
			const userData = {
				accessToken,
				refreshToken,
			};

			localStorage.setItem('echomail_user', JSON.stringify(userData));
			setIsLoggedIn(true);

			speak(`Welcome to EchoMail. You are now logged in.`);

			// Clean up URL
			window.history.replaceState({}, document.title, '/');
		} else {
			const savedUser = localStorage.getItem('echomail_user');
			if (savedUser) {
				setIsLoggedIn(true);
			}
		}
	}, [speak]);

	const handleLogout = () => {
		setIsLoggedIn(false);
		setSelectedEmailId(undefined);
		setIsComposing(false);
		setActiveTab('inbox');
		localStorage.removeItem('echomail_user');
		speak('You have been logged out. Goodbye!');
	};

	const handleCompose = () => {
		setIsComposing(true);
		speak('Opening compose email window');
	};

	const handleVoiceCommand = (command: string) => {
		console.log('Voice command received:', command);

		if (
			command.includes('read emails') ||
			command.includes('show emails') ||
			command.includes('inbox')
		) {
			setActiveTab('inbox');
			speak(
				'Displaying your email inbox. Use arrow keys to navigate or say next email.'
			);
		} else if (command.includes('sent emails') || command.includes('sent')) {
			setActiveTab('sent');
			speak('Displaying your sent emails.');
		} else if (command.includes('compose') || command.includes('write email')) {
			handleCompose();
		} else if (command.includes('help')) {
			const helpText = `Available commands: Say "read emails" for inbox, "sent emails" for sent items, 
      "compose email" to write a new message, or "logout" to sign out.`;
			speak(helpText);
		} else if (command.includes('logout') || command.includes('sign out')) {
			handleLogout();
		} else {
			speak(
				'I did not understand that command. Say "help" to hear available options.'
			);
		}
	};

	const handleEmailSelect = (email: any) => {
		setSelectedEmailId(email.id);
		const emailText = `Email from ${email.from}. Subject: ${email.subject}. Content: ${email.preview}`;
		speak(emailText);
	};

	const handleSentEmailSelect = (email: any) => {
		setSelectedEmailId(email.id);
		const emailText = `Sent email to ${email.to}. Subject: ${email.subject}. Status: ${email.status}`;
		speak(emailText);
	};

	const handleSendEmail = (emailData: {
		to: string;
		subject: string;
		body: string;
	}) => {
		console.log('Sending email:', emailData);
		setIsComposing(false);
	};

	if (!isLoggedIn) {
		return <LoginCard />;
	}

	return (
		<div className="min-h-screen bg-gradient-primary">
			<div className="sm:max-w-7xl max-w-5xl mx-auto p-4 space-y-6">
				<Header
					userEmail="Austine"
					userName="User"
					onLogout={handleLogout}
					onCompose={handleCompose}
				/>

				{isComposing && (
					<ComposeEmail
						isOpen={isComposing}
						onSend={handleSendEmail}
						onClose={() => setIsComposing(false)}
					/>
				)}

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
					<div className="xl:col-span-1">
						<VoiceControl
							onVoiceCommand={handleVoiceCommand}
							onStartListening={() => console.log('Started listening')}
							onStopListening={() => console.log('Stopped listening')}
						/>
					</div>

					<div className="xl:col-span-2">
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="w-full"
						>
							<TabsList className="grid w-full grid-cols-2 bg-white/20 border-2 border-white/30">
								<TabsTrigger
									value="inbox"
									className="font-bold data-[state=active]:bg-white data-[state=active]:text-primary"
								>
									Inbox
								</TabsTrigger>
								<TabsTrigger
									value="sent"
									className="font-bold data-[state=active]:bg-white data-[state=active]:text-primary"
								>
									Sent
								</TabsTrigger>
							</TabsList>

							<TabsContent value="inbox" className="mt-4">
								<EmailList
									selectedEmailId={selectedEmailId}
									onEmailSelect={handleEmailSelect}
									onEmailRead={(emailId) => console.log('Email read:', emailId)}
								/>
							</TabsContent>

							<TabsContent value="sent" className="mt-4">
								<SentEmails
									selectedEmailId={selectedEmailId}
									onEmailSelect={handleSentEmailSelect}
								/>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Index;
