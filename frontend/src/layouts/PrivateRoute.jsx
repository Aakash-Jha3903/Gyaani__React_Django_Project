import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

const PrivateRoute = ({ children }) => {
    // const loggedIn = useAuthStore((state) => state.isLoggedIn);
    const loggedIn = useAuthStore((state) => state.isLoggedIn());

    // return loggedIn ? children : <Navigate to="/login" />;
    if (!loggedIn) {
        return <Navigate to="/login/" replace />;
    }

    return children;
};

export default PrivateRoute;