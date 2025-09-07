import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Accessibility } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginCardProps {
	onLogin?: (email: string) => void;
}

export const LoginCard = ({ onLogin }: LoginCardProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleGoogleLogin = async () => {
		window.location.href = 'http://localhost:5000/auth/google';

		setIsLoading(true);
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-background">
			<Card className="w-full max-w-md p-8 border-2 border-accent">
				<div className="text-center mb-8">
					<div className="flex items-center justify-center mb-4">
						<div className="p-3 bg-accent rounded-full">
							<Accessibility className="h-8 w-8 text-accent-foreground" />
						</div>
					</div>
					<h1 className="text-2xl-bold mb-2">VoicedMail</h1>
					<p className="text-bold text-muted-foreground">
						Voice-Controlled Email for Everyone
					</p>
				</div>

				<div className="space-y-6">
					<div className="text-center">
						<h2 className="text-xl-bold mb-2">Welcome</h2>
						<p className="text-bold text-muted-foreground">
							Sign in to access your voice-controlled email experience
						</p>
					</div>

					<Button
						onClick={handleGoogleLogin}
						disabled={isLoading}
						size="lg"
						className={cn(
							'w-full text-bold border-2',
							'hover:bg-accent hover:text-accent-foreground'
						)}
						aria-label="Sign in with Google OAuth"
					>
						<Mail className="h-5 w-5 mr-2" />
						{isLoading ? 'Connecting...' : 'Sign in with Google'}
					</Button>

					<div className="text-center space-y-2">
						<p className="text-sm text-muted-foreground text-bold">
							Designed for accessibility and ease of use
						</p>
						<div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
							<Accessibility className="h-4 w-4" />
							<span className="text-bold">Screen reader compatible</span>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};
