import { createBrowserRouter } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import Home from "@/app/pages/Home";
import Login from "@/app/pages/Login";
import Register from "@/app/pages/Register";
import Protected from "@/app/pages/Protected";
import RoomList from "@/app/pages/protected/RoomList";
import Room from "@/app/pages/protected/Room";
import FriendList from "./pages/protected/FriendList";
import Search from "./pages/protected/Search";
import Settings from "./pages/protected/Settings";

const RequireAuth: React.FC = () => {
    const auth = useAuth();
    const location = useLocation();

    if (auth.loading) {
        return <div>Loading...</div>;
    }

    if (!auth.user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <><Outlet /></>;
};

const RequireAnon: React.FC = () => {
    const auth = useAuth();
    const location = useLocation();

    if (auth.loading) {
        return <div>Loading...</div>;
    }

    if (auth.user) {
        return <Navigate to="/rooms" state={{ from: location }} replace />;
    }

    return <><Outlet /></>;
}



export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            // NOTE(miha): Public routes

            // NOTE(miha): Protected routes
            {
                element: <RequireAuth />,
                children: [
                    // { path: "/protected", element: <Protected /> },

                    { path: "/search", element: <Search /> },

                    { path: "/rooms", element: <RoomList /> },
                    { path: "/rooms/:roomId", element: <Room /> },

                    { path: "/friends", element: <FriendList /> },

                    { path: "/friends/:friendId", element: <Protected /> },

                    { path: "/settings", element: <Settings /> },
                ],
            },
        ],
    },
    {
        element: <RequireAnon />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
        ],
    },
]);
