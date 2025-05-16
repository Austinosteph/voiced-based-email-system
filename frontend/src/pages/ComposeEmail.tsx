import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Mic, MicOff } from 'lucide-react';
import useVoiceRecognition from '../hooks/useVoiceRecognition';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';

const ComposeEmail = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [to, setTo] = useState('');
	const [subject, setSubject] = useState('');
	const [body, setBody] = useState('');
	const [activeField, setActiveField] = useState<
		'to' | 'subject' | 'body' | null
	>(null);

	const {
		text: dictatedText,
		isListening,
		startListening,
		stopListening,
		resetText,
	} = useVoiceRecognition();

	// Check if we're replying to an email
	useEffect(() => {
		if (location.state?.replyTo) {
			const email = location.state.replyTo;
			setTo(email.email);
			setSubject(`Re: ${email.subject}`);
			setBody(
				`\n\n-------- Original Message --------\nFrom: ${
					email.sender
				}\nDate: ${new Date(email.date).toLocaleString()}\nSubject: ${
					email.subject
				}\n\n${email.body}`
			);
		}
	}, [location.state]);

	// Update active field with dictated text
	useEffect(() => {
		if (dictatedText && activeField) {
			switch (activeField) {
				case 'to':
					setTo(dictatedText);
					break;
				case 'subject':
					setSubject(dictatedText);
					break;
				case 'body':
					setBody(dictatedText);
					break;
			}
		}
	}, [dictatedText, activeField]);

	const handleStartDictation = (field: 'to' | 'subject' | 'body') => {
		setActiveField(field);
		resetText();
		startListening();
	};

	const handleStopDictation = () => {
		stopListening();
		setActiveField(null);
	};

	const handleSendEmail = async () => {
		const accessToken = localStorage.getItem('accessToken');
		if (!accessToken) {
			toast.error('No access token found. Please log in.');
			return;
		}
		if (!to) {
			toast.error('Please specify a recipient');
			return;
		}
		if (!subject) {
			toast.error('Please add a subject');
			return;
		}
		if (!body) {
			toast.error('Email body cannot be empty');
			return;
		}

		const emailData = {
			to,
			subject,
			body,
		};

		try {
			await axios.post('http://localhost:5000/gmail/send', emailData, {
				headers: {
					Authorization: `Bearer ${accessToken}`, // Send access token for Gmail API authentication
				},
			});
			toast.success('Email sent successfully!');
			navigate('/dashboard');
		} catch (error) {
			toast.error('Failed to send email');
		}
	};

	return (
		<Layout>
			<div className="mb-6 flex items-center">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate('/dashboard')}
					className="mr-2"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<h1 className="text-2xl font-bold flex-grow">Compose Email</h1>
			</div>

			<Card>
				<CardContent className="p-6">
					<div className="space-y-4">
						<div>
							<Label htmlFor="to" className="mb-2 block">
								To:
							</Label>
							<div className="flex gap-2">
								<Input
									id="to"
									value={to}
									onChange={(e) => setTo(e.target.value)}
									placeholder="recipient@example.com"
									className="flex-grow"
								/>
								<Button
									type="button"
									variant={
										activeField === 'to' && isListening
											? 'destructive'
											: 'secondary'
									}
									onClick={() =>
										activeField === 'to' && isListening
											? handleStopDictation()
											: handleStartDictation('to')
									}
									className="whitespace-nowrap"
								>
									{activeField === 'to' && isListening ? (
										<>
											<MicOff size={16} className="mr-1" /> Stop
										</>
									) : (
										<>
											<Mic size={16} className="mr-1" /> Dictate
										</>
									)}
								</Button>
							</div>
						</div>

						<div>
							<Label htmlFor="subject" className="mb-2 block">
								Subject:
							</Label>
							<div className="flex gap-2">
								<Input
									id="subject"
									value={subject}
									onChange={(e) => setSubject(e.target.value)}
									placeholder="Email subject"
									className="flex-grow"
								/>
								<Button
									type="button"
									variant={
										activeField === 'subject' && isListening
											? 'destructive'
											: 'secondary'
									}
									onClick={() =>
										activeField === 'subject' && isListening
											? handleStopDictation()
											: handleStartDictation('subject')
									}
									className="whitespace-nowrap"
								>
									{activeField === 'subject' && isListening ? (
										<>
											<MicOff size={16} className="mr-1" /> Stop
										</>
									) : (
										<>
											<Mic size={16} className="mr-1" /> Dictate
										</>
									)}
								</Button>
							</div>
						</div>

						<div>
							<Label htmlFor="body" className="mb-2 block">
								Message:
							</Label>
							<div className="flex flex-col gap-2">
								<Textarea
									id="body"
									value={body}
									onChange={(e) => setBody(e.target.value)}
									placeholder="Compose your message..."
									rows={10}
									className="resize-none"
								/>
								<div className="flex justify-end">
									<Button
										type="button"
										variant={
											activeField === 'body' && isListening
												? 'destructive'
												: 'secondary'
										}
										onClick={() =>
											activeField === 'body' && isListening
												? handleStopDictation()
												: handleStartDictation('body')
										}
										className="whitespace-nowrap"
									>
										{activeField === 'body' && isListening ? (
											<>
												<MicOff size={16} className="mr-1" /> Stop Dictation
											</>
										) : (
											<>
												<Mic size={16} className="mr-1" /> Dictate Message
											</>
										)}
									</Button>
								</div>
							</div>
						</div>

						{activeField && isListening && (
							<div className="bg-email-light border border-email-primary/30 p-3 rounded-md">
								<p className="text-sm font-medium text-email-primary">
									Listening...
								</p>
								<p className="text-sm text-gray-600 italic mt-1">
									{dictatedText || 'Speak now...'}
								</p>
							</div>
						)}

						<div className="pt-4 flex justify-end">
							<Button
								type="button"
								className="gradient-btn"
								onClick={handleSendEmail}
							>
								<Send size={16} className="mr-2" />
								Send Email
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="mt-8 p-4 bg-email-light rounded-lg border border-email-primary/20">
				<h2 className="font-semibold text-email-primary mb-2">
					Voice Dictation Tips
				</h2>
				<ul className="text-sm text-gray-600 mt-1 space-y-1">
					<li>
						Click the "Dictate" button next to each field to start voice input
					</li>
					<li>Speak clearly and pause between sentences</li>
					<li>Say "period", "comma", or "question mark" for punctuation</li>
					<li>Say "new line" to start a new paragraph</li>
				</ul>
			</div>
		</Layout>
	);
};

export default ComposeEmail;
