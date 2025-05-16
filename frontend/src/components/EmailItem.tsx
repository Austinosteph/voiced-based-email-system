import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useVoiceCommand } from '../contexts/VoiceCommandContext';
import { Mail, MailOpen } from 'lucide-react';

interface EmailItemProps {
	email: {
		id: string;
		sender: string;
		subject: string;
		body: string;
		date: string;
		read: boolean;
	};
	onClick: () => void;
}

const EmailItem = ({ email, onClick }: EmailItemProps) => {
	const { speakMessage } = useVoiceCommand();
	const [hovered, setHovered] = useState(false);

	const handleReadAloud = (e: React.MouseEvent) => {
		e.stopPropagation();
		speakMessage(
			`Email from ${email.sender}. Subject: ${email.subject}. ${email.body}`
		);
	};

	const rawDate = new Date(Number(email.date));
	const formattedDate = isNaN(rawDate.getTime())
		? ''
		: rawDate.toLocaleString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				hour12: true,
		  });

	return (
		<Card
			className={`p-4 mb-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
				email.read ? 'bg-gray-50' : 'bg-white border-l-4 border-l-email-primary'
			}`}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onClick={onClick}
		>
			<div className="flex items-center">
				<div className="flex-shrink-0 mr-3">
					{email.read ? (
						<MailOpen size={18} className="text-gray-400" />
					) : (
						<Mail size={18} className="text-email-primary" />
					)}
				</div>
				<div className="flex-grow min-w-0">
					<div className="flex justify-between items-baseline mb-1">
						<p
							className={`font-medium truncate ${
								email.read ? 'text-gray-600' : 'text-black'
							}`}
						>
							{email.sender}
						</p>
						<span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
							{formattedDate}
						</span>
					</div>
					<p
						className={`text-sm ${
							email.read ? 'text-gray-500' : 'font-medium text-gray-800'
						} truncate`}
					>
						{email.subject}
					</p>
					<p className="text-xs text-gray-500 truncate mt-1">
						{email.body.substring(0, 60)}...
					</p>
				</div>
			</div>
			{hovered && (
				<div className="mt-2 flex justify-end">
					<button
						onClick={handleReadAloud}
						className="text-xs text-email-secondary hover:underline"
						aria-label="Read email aloud"
					>
						Read Aloud
					</button>
				</div>
			)}
		</Card>
	);
};

export default EmailItem;
