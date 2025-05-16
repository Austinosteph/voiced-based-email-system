import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useVoiceCommand } from '../contexts/VoiceCommandContext';
import { toast } from 'sonner';

const EmailView = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const { speakMessage, stopSpeaking } = useVoiceCommand();

	// Try to get email from router state first (passed from dashboard)
	const emailFromState = location.state?.email;

	const [email, setEmail] = useState<any | null>(emailFromState || null);

	useEffect(() => {
		// If email already from state, no need to fetch
		if (emailFromState) return;

		// If no id param, redirect back
		if (!id) {
			navigate('/dashboard');
			return;
		}

		const fetchEmail = async () => {
			const token = localStorage.getItem('accessToken');
			if (!token) {
				navigate('/dashboard');
				return;
			}

			try {
				const res = await fetch(`http://localhost:5000/gmail/email/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (!res.ok) throw new Error('Failed to fetch email');

				const data = await res.json();
				setEmail(data);
			} catch (err) {
				console.error(err);
				navigate('/dashboard');
			}
		};

		fetchEmail();

		return () => {
			stopSpeaking();
		};
	}, [id, navigate, stopSpeaking, emailFromState]);

	const handleReadEmail = () => {
		if (email) {
			speakMessage(
				`Email from ${email.sender}. Subject: ${email.subject}. ${email.body}`
			);
		}
	};

	const handleDelete = () => {
		toast.success('Email deleted');
		navigate('/dashboard');
	};

	const handleReply = () => {
		navigate('/compose', { state: { replyTo: email } });
	};

	if (!email) {
		return (
			<Layout>
				<div className="text-center py-12">
					<p>Loading email...</p>
				</div>
			</Layout>
		);
	}

	const formattedDate = new Date(Number(email.date)).toLocaleString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	});

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
				<h1 className="text-2xl font-bold flex-grow">View Email</h1>
			</div>

			<Card className="mb-6">
				<CardContent className="p-6">
					<div className="mb-6">
						<h2 className="text-xl font-bold mb-4">{email.subject}</h2>
						<div className="flex justify-between items-start mb-4">
							<div>
								<p className="font-semibold">{email.sender}</p>
								<p className="text-sm text-gray-500">{email.email}</p>
							</div>
							<p className="text-sm text-gray-500">{formattedDate}</p>
						</div>
						<hr className="my-4" />
						<div className="prose max-w-none">
							<p className="whitespace-pre-line">{email.body}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="flex flex-wrap gap-3">
				<Button onClick={handleReadEmail} className="gradient-btn">
					Read Aloud
				</Button>
				<Button onClick={handleReply} variant="outline">
					Reply
				</Button>
				<Button
					onClick={handleDelete}
					variant="outline"
					className="text-destructive hover:text-destructive"
				>
					<Trash2 className="h-4 w-4 mr-1" />
					Delete
				</Button>
			</div>

			<div className="mt-8 p-4 bg-email-light rounded-lg border border-email-primary/20">
				<h2 className="font-semibold text-email-primary mb-2">
					Voice Commands
				</h2>
				<p className="text-sm text-gray-600">Try saying:</p>
				<ul className="text-sm text-gray-600 mt-1 space-y-1">
					<li>"Go back to inbox" - Returns to inbox</li>
					<li>"Delete email" - Deletes this email</li>
					<li>"Reply to this email" - Composes a reply</li>
				</ul>
			</div>
		</Layout>
	);
};

export default EmailView;
