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

const Signup = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const { signup, isLoading } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name || !email || !password || !confirmPassword) {
			toast.error('Please fill in all fields');
			return;
		}

		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}

		try {
			await signup(name, email, password);
		} catch (error) {
			console.error('Signup error:', error);
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
						<CardTitle>Create Account</CardTitle>
						<CardDescription>
							Sign up for a new VoiceMail account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Full Name</Label>
								<Input
									id="name"
									type="text"
									placeholder="John Doe"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</div>
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
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="••••••••"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
								/>
							</div>
							<Button
								type="submit"
								className="w-full gradient-btn"
								disabled={isLoading}
							>
								{isLoading ? 'Creating Account...' : 'Create Account'}
							</Button>
						</form>
					</CardContent>
					<CardFooter>
						<p className="text-center text-sm text-gray-500 w-full">
							Already have an account?{' '}
							<Link to="/login" className="text-email-primary hover:underline">
								Sign in
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default Signup;
