import { createBrowserRouter } from "react-router";
import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation } from 'react-router';
import Layout from "@/components/layout/Layout";
import Home from "@/app/pages/Home";
import Login from "@/app/pages/Login";
import Register from "@/app/pages/Register";
import Protected from "@/app/pages/Protected";

const RequireAuth: React.FC = () => {
    const auth = useAuth();
    const location = useLocation();

    if (auth.loading) {
        return <div>Loading...</div>;
    }

    if (!auth.user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <></>;
};


export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            // NOTE(miha): Public routes
            { path: '/', element: <Home /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },

            // NOTE(miha): Protected routes
            {
                element: <RequireAuth />,
                children: [
                    { path: "/protected", element: <Protected /> },
                ],
            },
        ],
    },
]);
