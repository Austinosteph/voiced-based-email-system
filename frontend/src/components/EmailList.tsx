import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, MailOpen, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface Email {
	id: string;
	from: string;
	subject: string;
	snipet: string;
	timestamp: string;
	isRead: boolean;
	isImportant: boolean;
}

interface EmailListProps {
	selectedEmailId?: string;
	onEmailSelect?: (email: Email) => void;
	onEmailRead?: (emailId: string) => void;
}

export const EmailList = ({
	selectedEmailId,
	onEmailSelect,
	onEmailRead,
}: EmailListProps) => {
	const [emails, setEmails] = useState<Email[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { transcript, startListening } = useSpeechRecognition({
		continuous: true,
	});

	const fetchEmails = async () => {
		setLoading(true);
		setError(null);
		try {
			const savedUser = localStorage.getItem('echomail_user');
			if (!savedUser) return;
			const accessToken = JSON.parse(savedUser).accessToken;

			const res = await fetch('http://localhost:5000/gmail/inbox', {
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			if (!res.ok) throw new Error('Failed to fetch emails');

			const data: any[] = await res.json();

			setEmails(
				data.slice(0, 3).map((email) => ({
					id: email.id || '',
					from: email.sender || 'Unknown sender',
					subject: email.subject || 'No subject',
					snipet: email.snippet || 'No content available',
					timestamp: email.date
						? new Date(Number(email.date)).toLocaleString()
						: 'Unknown time',
					isRead: typeof email.read === 'boolean' ? email.read : true,
					isImportant: email.isImportant || false,
				}))
			);
		} catch (err: any) {
			console.error('Error fetching emails:', err);
			setError(err.message || 'Failed to fetch emails');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchEmails();
		const interval = setInterval(fetchEmails, 60000);
		return () => clearInterval(interval);
	}, []);

	const handleEmailClick = (email: Email) => {
		onEmailSelect?.(email);
		if (!email.isRead) {
			setEmails((prev) =>
				prev.map((e) => (e.id === email.id ? { ...e, isRead: true } : e))
			);
			onEmailRead?.(email.id);
		}
	};

	// ✅ Voice command: select email by sender or content
	useEffect(() => {
		if (!transcript) return;
		const match = emails.find(
			(e) =>
				e.from.toLowerCase().includes(transcript.toLowerCase()) ||
				e.snipet.toLowerCase().includes(transcript.toLowerCase())
		);

		if (match) {
			const utterance = new SpeechSynthesisUtterance(match.snipet);
			window.speechSynthesis.speak(utterance);

			handleEmailClick(match);
		}
	}, [transcript, emails]);

	return (
		<Card className="p-6 border-2 border-primary bg-gradient-card rainbow-border">
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<Mail className="h-6 w-6 text-primary" />
					<h2 className="text-2xl font-bold text-primary">Inbox</h2>
				</div>
				<div className="flex items-center space-x-2">
					<p className="font-bold text-muted-foreground">
						{emails.filter((e) => !e.isRead).length} unread
					</p>
				</div>
			</div>

			{loading && (
				<p className="text-center text-muted-foreground">Loading emails...</p>
			)}
			{error && <p className="text-center text-red-500">{error}</p>}

			{!loading && !error && emails.length === 0 && (
				<div className="text-center py-12">
					<Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-xl font-bold mb-2">No emails</h3>
					<p className="text-muted-foreground font-bold">
						Your inbox is empty.
					</p>
				</div>
			)}

			{!loading && !error && emails.length > 0 && (
				<div className="space-y-3">
					{emails.map((email) => (
						<Button
							key={email.id}
							variant="ghost"
							onClick={() => handleEmailClick(email)}
							className={cn(
								'w-full p-4 h-auto text-left border-2 transition-all duration-200 btn-glow',
								selectedEmailId === email.id && 'bg-primary/20 border-primary',
								!email.isRead && 'border-accent bg-accent/10'
							)}
						>
							<div className="flex items-start space-x-4 w-full">
								<div className="flex-shrink-0 mt-1">
									{email.isRead ? (
										<MailOpen className="h-6 w-6 text-muted-foreground" />
									) : (
										<Mail className="h-6 w-6 text-primary" />
									)}
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center space-x-2">
											<User className="h-4 w-4 text-muted-foreground" />
											<span className="font-bold truncate">{email.from}</span>
										</div>
										<div className="flex items-center space-x-2">
											{email.isImportant && (
												<Badge
													variant="destructive"
													className="text-xs font-bold"
												>
													Important
												</Badge>
											)}
											<div className="flex items-center text-sm text-muted-foreground">
												<Clock className="h-4 w-4 mr-1" />
												<span className="font-semibold">{email.timestamp}</span>
											</div>
										</div>
									</div>
									<h3 className="text-lg mb-2 truncate">{email.subject}</h3>
									<p className="text-muted-foreground text-sm line-clamp-2 font-bold">
										{email.snipet}
									</p>
								</div>
							</div>
						</Button>
					))}
				</div>
			)}
		</Card>
	);
};
