import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
	const { isAuthenticated, isOAuthComplete } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (!isAuthenticated) {
		return <Navigate to="/oauth" replace />;
	}

	return children;
};

export default RequireAuth;
