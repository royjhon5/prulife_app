import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "../modules/authentication/AuthContext.jsx";


export default function GuestLayout() {
    const { user } = useAuth();
    if (user) return <Navigate to="/dashboard" />;
    return (
        <>
            <Outlet />
        </>
    );
}