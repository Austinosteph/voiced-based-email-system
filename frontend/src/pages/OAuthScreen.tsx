import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

<FcGoogle size={24} />;

const OAuthScreen = () => {
	const [loading, setLoading] = useState(false);
	const { user, completeOAuth } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		// If no user, redirect to login
		if (!user) {
			navigate('/login');
		}
	}, [user, navigate]);

	const handleOAuthMethod = async (method: string) => {
		setLoading(true);
		try {
			await completeOAuth(method);
			toast.success(`Successfully authenticated with ${method}`);
			navigate('/dashboard');
			console.log(method);
		} catch (error) {
			toast.error('Authentication failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle>Connect with a Provider</CardTitle>
					<CardDescription>
						Choose an authentication method to access your emails
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Button
						variant="outline"
						className="w-full flex items-center justify-center gap-2 py-6"
						onClick={() => handleOAuthMethod('google')}
						disabled={loading}
					>
						<FcGoogle size={24} />
						<span>Continue with Google</span>
					</Button>

					<Button
						className="w-full gradient-btn flex items-center justify-center gap-2 py-6"
						onClick={() => handleOAuthMethod('google')}
						disabled={loading}
					>
						<Mail size={20} />
						<span>Continue with Email</span>
					</Button>
				</CardContent>
				<CardFooter className="flex justify-center">
					<p className="text-sm text-gray-500">
						We'll never post anything without your permission
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default OAuthScreen;
