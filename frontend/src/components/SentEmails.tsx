import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, Clock, User, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SentEmail {
	id: string;
	to: string;
	subject: string;
	preview: string;
	timestamp: string;
	status: 'sent' | 'delivered' | 'read';
}

interface SentEmailsProps {
	emails?: SentEmail[];
	selectedEmailId?: string;
	onEmailSelect?: (email: SentEmail) => void;
}

// Mock sent email data
const mockSentEmails: SentEmail[] = [
	{
		id: 's1',
		to: 'client@business.com',
		subject: 'Project Proposal Follow-up',
		preview:
			'Thank you for reviewing our proposal. I wanted to follow up on the timeline and next steps...',
		timestamp: '1 hour ago',
		status: 'read',
	},
	{
		id: 's2',
		to: 'team@company.com',
		subject: 'Weekly Status Update',
		preview:
			"Here is this week's progress report. We have completed the design phase and are moving into development...",
		timestamp: '3 hours ago',
		status: 'delivered',
	},
	{
		id: 's3',
		to: 'support@vendor.com',
		subject: 'Technical Support Request',
		preview:
			'I am experiencing an issue with the API integration. The authentication seems to be failing...',
		timestamp: 'Yesterday',
		status: 'sent',
	},
];

export const SentEmails = ({
	emails = mockSentEmails,
	selectedEmailId,
	onEmailSelect,
}: SentEmailsProps) => {
	const [focusedIndex, setFocusedIndex] = useState(0);

	const handleEmailClick = (email: SentEmail, index: number) => {
		setFocusedIndex(index);
		onEmailSelect?.(email);
	};

	const handleKeyDown = (
		event: React.KeyboardEvent,
		email: SentEmail,
		index: number
	) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleEmailClick(email, index);
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			const nextIndex = Math.min(index + 1, emails.length - 1);
			setFocusedIndex(nextIndex);
			const nextButton = document.querySelector(
				`[data-sent-email-index="${nextIndex}"]`
			) as HTMLButtonElement;
			nextButton?.focus();
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			const prevIndex = Math.max(index - 1, 0);
			setFocusedIndex(prevIndex);
			const prevButton = document.querySelector(
				`[data-sent-email-index="${prevIndex}"]`
			) as HTMLButtonElement;
			prevButton?.focus();
		}
	};

	const getStatusBadge = (status: SentEmail['status']) => {
		switch (status) {
			case 'read':
				return (
					<Badge className="text-xs font-bold bg-success text-success-foreground">
						Read
					</Badge>
				);
			case 'delivered':
				return (
					<Badge className="text-xs font-bold bg-info text-info-foreground">
						Delivered
					</Badge>
				);
			case 'sent':
				return (
					<Badge className="text-xs font-bold bg-warning text-warning-foreground">
						Sent
					</Badge>
				);
			default:
				return null;
		}
	};

	const getStatusIcon = (status: SentEmail['status']) => {
		switch (status) {
			case 'read':
				return <CheckCircle className="h-5 w-5 text-success" />;
			case 'delivered':
				return <Send className="h-5 w-5 text-info" />;
			case 'sent':
				return <Send className="h-5 w-5 text-warning" />;
			default:
				return <Send className="h-5 w-5 text-muted-foreground" />;
		}
	};

	return (
		<Card className="p-6 border-2 border-secondary bg-gradient-card rainbow-border">
			<div className="mb-6">
				<div className="flex items-center space-x-3 mb-2">
					<Send className="h-6 w-6 text-secondary" />
					<h2 className="text-2xl-bold text-secondary">Sent Emails</h2>
				</div>
				<p className="text-bold text-muted-foreground">
					{emails.length} messages sent
				</p>
			</div>

			<div className="space-y-3">
				{emails.map((email, index) => (
					<Button
						key={email.id}
						variant="ghost"
						data-sent-email-index={index}
						onClick={() => handleEmailClick(email, index)}
						onKeyDown={(e) => handleKeyDown(e, email, index)}
						className={cn(
							'w-full p-4 h-auto text-left border-2 transition-all duration-200 btn-glow',
							'hover:bg-secondary/20 hover:border-secondary',
							'focus:bg-focus-bg focus:border-focus-ring',
							selectedEmailId === email.id && 'bg-secondary/20 border-secondary'
						)}
						aria-label={`Sent email to ${email.to}, subject: ${email.subject}, status: ${email.status}`}
					>
						<div className="flex items-start space-x-4 w-full">
							<div className="flex-shrink-0 mt-1">
								{getStatusIcon(email.status)}
							</div>

							<div className="flex-1 min-w-0">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center space-x-2">
										<User className="h-4 w-4 text-muted-foreground" />
										<span className="text-bold truncate text-secondary">
											To: {email.to}
										</span>
									</div>
									<div className="flex items-center space-x-2">
										{getStatusBadge(email.status)}
										<div className="flex items-center text-sm text-muted-foreground">
											<Clock className="h-4 w-4 mr-1" />
											<span className="text-bold">{email.timestamp}</span>
										</div>
									</div>
								</div>

								<h3 className="text-lg text-xl-bold mb-2 truncate">
									{email.subject}
								</h3>

								<p className="text-muted-foreground text-sm line-clamp-2 text-bold">
									{email.preview}
								</p>
							</div>
						</div>
					</Button>
				))}
			</div>

			{emails.length === 0 && (
				<div className="text-center py-12">
					<Send className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-xl-bold mb-2">No sent emails</h3>
					<p className="text-muted-foreground text-bold">
						Emails you send will appear here.
					</p>
				</div>
			)}
		</Card>
	);
};
