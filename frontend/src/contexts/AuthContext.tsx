import { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

interface User {
	id: string;
	email: string;
	name: string;
	isOAuthComplete?: boolean;
}

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	signup: (name: string, email: string, password: string) => Promise<void>;
	logout: () => void;
	completeOAuth: (method: string) => Promise<void>;
	isAuthenticated: boolean;
	isOAuthComplete: boolean;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(() => {
		const savedUser = localStorage.getItem('voicemail_user');
		return savedUser ? JSON.parse(savedUser) : null;
	});
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	//login
	const login = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			const response = await axios.post(
				'http://localhost:5000/api/login',
				{
					email,
					password,
				},
				{
					withCredentials: true, // ✅ Send cookie with login request
				}
			);
			const user = response.data.user;

			setUser(user);
			localStorage.setItem('voicemail_user', JSON.stringify(user));
			toast.success('Login successful!');
			navigate('/oauth');
		} catch (error: any) {
			const message = error.response?.data?.error || 'Login failed!';
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};

	//signup
	const signup = async (name: string, email: string, password: string) => {
		setIsLoading(true);
		try {
			await axios.post('/api/register', { name, email, password });
			toast.success('Account created successfully!');
			navigate('/login');
		} catch (error: any) {
			const message = error.response?.data?.error || 'Signup failed!';
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem('voicemail_user');
		toast.success('Logged out successfully!');
		navigate('/login');
	};

	//oauth
	const completeOAuth = async (method: string) => {
		setIsLoading(true);

		window.location.href = 'http://localhost:5000/auth/google';

		if (user) {
			const updatedUser = {
				...user,
				isOAuthComplete: true,
				authMethod: method,
			};

			setUser(updatedUser);
			localStorage.setItem('voicemail_user', JSON.stringify(updatedUser));
			setIsLoading(false);
			return;
		}

		setIsLoading(false);
		throw new Error('No user found');
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				signup,
				logout,
				completeOAuth,
				isAuthenticated: !!user,
				isOAuthComplete: !!user?.isOAuthComplete,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
