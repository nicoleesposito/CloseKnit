import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected Routers: https://www.youtube.com/watch?v=pyfwQUc5Ssk
// React Router auth: https://www.youtube.com/watch?v=oUZjO00NkhY
// auth check which uses react router to navigate the user onto the right page depending on the information submit through POST

// wrap any page that requires login with this component
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return null; // wait while checking if the user is logged in

    if (!user) return <Navigate to="/login" replace />;

    return children;
}

export default ProtectedRoute;
