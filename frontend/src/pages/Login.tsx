import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { login, isLoading } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !password) {
			toast.error('Please fill in all fields');
			return;
		}

		try {
			await login(email, password);
		} catch (error) {
			console.error('Login error:', error);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
			<div className="w-full max-w-md">
				<div className="flex justify-center mb-6">
					<div className="bg-gradient-to-r from-email-primary to-email-secondary p-3 rounded-lg">
						<MessageSquare size={32} className="text-white" />
					</div>
				</div>
				<h1 className="text-2xl font-bold text-center mb-2">VoiceMail</h1>
				<p className="text-gray-500 text-center mb-6">
					Control your emails with your voice
				</p>

				<Card>
					<CardHeader>
						<CardTitle>Sign In</CardTitle>
						<CardDescription>
							Enter your credentials to access your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="you@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									autoComplete="email"
								/>
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="password">Password</Label>
									<Link
										to="/forgot-password"
										className="text-xs text-email-primary hover:underline"
									>
										Forgot password?
									</Link>
								</div>
								<Input
									id="password"
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
							<Button
								type="submit"
								className="w-full gradient-btn"
								disabled={isLoading}
							>
								{isLoading ? 'Signing in...' : 'Sign In'}
							</Button>
						</form>
					</CardContent>
					<CardFooter>
						<p className="text-center text-sm text-gray-500 w-full">
							Don't have an account?{' '}
							<Link to="/signup" className="text-email-primary hover:underline">
								Sign up
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default Login;
