import { useState } from 'react';
import Layout from '../components/Layout';
import EmailItem from '../components/EmailItem';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
	const location = useLocation();
	const navigate = useNavigate();
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const accessToken = params.get('access_token');
		const refreshToken = params.get('refresh_token');

		if (accessToken && refreshToken) {
			localStorage.setItem('accessToken', accessToken);
			localStorage.setItem('refreshToken', refreshToken);

			console.log('✅ Tokens stored in localStorage');
		}
	}, [location.search, navigate]);

	const [emails, setEmails] = useState([]);
	const [activeTab, setActiveTab] = useState('inbox');
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		const fetchEmails = async () => {
			const token = localStorage.getItem('accessToken');
			if (!token) return;

			const endpoint = activeTab === 'sent' ? '/gmail/sent' : '/gmail/inbox';

			try {
				const res = await fetch(`http://localhost:5000${endpoint}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const data = await res.json();
				setEmails(data);
			} catch (err) {
				console.error('Error loading emails:', err);
			}
		};

		fetchEmails();
	}, [activeTab]);

	const filteredEmails = emails.filter(
		(email) =>
			email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
			email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
			email.body.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleEmailClick = (email: any) => {
		navigate(`/email/${email.id}`, { state: { email } });
	};

	const unreadCount = emails.filter((email) => !email.read).length;

	return (
		<Layout>
			<div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<h1 className="text-2xl font-bold">Inbox</h1>
				<div className="flex gap-2">
					<div className="relative flex-grow">
						<Input
							type="search"
							placeholder="Search emails..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pr-10"
						/>
					</div>
					<Button
						className="gradient-btn whitespace-nowrap"
						onClick={() => navigate('/compose')}
					>
						Compose
					</Button>
				</div>
			</div>

			<Tabs
				defaultValue="inbox"
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full"
			>
				<TabsList className="mb-6">
					<TabsTrigger value="inbox" className="relative">
						Inbox
						{unreadCount > 0 && (
							<span className="absolute -top-1 -right-1 bg-email-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
								{unreadCount}
							</span>
						)}
					</TabsTrigger>
					<TabsTrigger value="sent">Sent</TabsTrigger>
				</TabsList>

				<TabsContent value="inbox" className="space-y-4">
					{filteredEmails.length > 0 ? (
						<div className="grid gap-2">
							{filteredEmails.map((email) => (
								<EmailItem
									key={email.id}
									email={email}
									onClick={() => handleEmailClick(email)}
								/>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-gray-500">No emails found.</p>
							{searchTerm && (
								<p className="text-sm text-gray-400 mt-2">
									Try adjusting your search terms.
								</p>
							)}
						</div>
					)}
				</TabsContent>

				<TabsContent value="sent" className="space-y-4">
					{filteredEmails.length > 0 ? (
						<div className="grid gap-2">
							{filteredEmails.map((email) => (
								<EmailItem
									key={email.id}
									email={email}
									onClick={() => handleEmailClick(email)}
								/>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-gray-500">No sent emails found.</p>
							{searchTerm && (
								<p className="text-sm text-gray-400 mt-2">
									Try adjusting your search terms.
								</p>
							)}
						</div>
					)}
				</TabsContent>
			</Tabs>

			<div className="mt-8 p-4 bg-email-light rounded-lg border border-email-primary/20">
				<h2 className="font-semibold text-email-primary mb-2">
					Voice Commands
				</h2>
				<p className="text-sm text-gray-600">Try saying:</p>
				<ul className="text-sm text-gray-600 mt-1 space-y-1">
					<li>"Go to compose" - Opens email composition</li>
					<li>"Read email 1" - Reads the first email</li>
					<li>"Refresh inbox" - Refreshes your emails</li>
				</ul>
			</div>
		</Layout>
	);
};

export default Dashboard;
