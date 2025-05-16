import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { VoiceCommandProvider } from './contexts/VoiceCommandContext';
import RequireAuth from './components/RequireAuth';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import OAuthScreen from './pages/OAuthScreen';
import Dashboard from './pages/Dashboard';
import EmailView from './pages/EmailView';
import ComposeEmail from './pages/ComposeEmail';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<Sonner />
			<BrowserRouter>
				<AuthProvider>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/oauth" element={<OAuthScreen />} />
						<Route
							path="/"
							element={
								<RequireAuth>
									<VoiceCommandProvider>
										<Dashboard />
									</VoiceCommandProvider>
								</RequireAuth>
							}
						/>
						<Route
							path="/dashboard"
							element={
								<RequireAuth>
									<VoiceCommandProvider>
										<Dashboard />
									</VoiceCommandProvider>
								</RequireAuth>
							}
						/>
						<Route
							path="/email/:id"
							element={
								<RequireAuth>
									<VoiceCommandProvider>
										<EmailView />
									</VoiceCommandProvider>
								</RequireAuth>
							}
						/>
						<Route
							path="/compose"
							element={
								<RequireAuth>
									<VoiceCommandProvider>
										<ComposeEmail />
									</VoiceCommandProvider>
								</RequireAuth>
							}
						/>
						<Route path="*" element={<NotFound />} />
					</Routes>
				</AuthProvider>
			</BrowserRouter>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
