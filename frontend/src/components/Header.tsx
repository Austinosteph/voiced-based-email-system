import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogOut, Mail, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
	userEmail: string;
	onLogout?: () => void;
	onCompose?: () => void;
	userName?: string;
}

export const Header = ({ userEmail, onLogout, onCompose }: HeaderProps) => {
	const handleLogout = () => {
		onLogout?.();
	};

	const handleCompose = () => {
		onCompose?.();
	};

	return (
		<Card className="sm:p-4 p-2  border-2 border-primary bg-gradient-primary text-white mb-6">
			<div className="flex flex-col sm:flex-row  items-center justify-between space-y-2 sm:space-y-0">
				<div className="flex items-center space-x-4">
					<div className="p-2 bg-white/20 rounded-full">
						<Mail className="h-6 w-6" />
					</div>
					<div>
						<h1 className="text-2xl-bold">EchoMail</h1>
						<p className="text-white/90 text-bold">
							Welcome, {userEmail.split('@')[0]}
						</p>
					</div>
				</div>

				<div className="flex sm:flex-row flex-col space-y-2 sm:space-y-0 items-center space-x-3">
					<Button
						onClick={handleCompose}
						size="lg"
						className="bg-accent hover:bg-accent/90 text-accent-foreground text-bold btn-glow"
						aria-label="Compose new email"
					>
						<Mail className="h-5 w-5 mr-2" />
						Compose
					</Button>

					<div className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg border border-white/30">
						<User className="h-4 w-4" />
						<span className="text-bold text-sm">{userEmail}</span>
					</div>

					<Button
						onClick={handleLogout}
						size="lg"
						className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-bold btn-glow border-2 border-white/30"
						aria-label="Logout from EchoMail"
					>
						<LogOut className="h-5 w-5 mr-2" />
						Logout
					</Button>
				</div>
			</div>
		</Card>
	);
};
