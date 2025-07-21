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

const RequireAuth: React.FC = () => {
    const auth = useAuth();
    const location = useLocation();

    console.log("require auth A: ", auth.user);

    if (auth.loading) {
        return <div>Loading...</div>;
    }

    console.log("require auth: B", auth.user);

    if (!auth.user) {
        console.log("not authed");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    console.log("authed");

    return <><Outlet /></>;
};

const RequireAnon: React.FC = () => {
    const auth = useAuth();
    const location = useLocation();
    console.log("require anon A: ", auth.user);

    if (auth.loading) {
        return <div>Loading...</div>;
    }

    if (auth.user) {
        return <Navigate to="/protected" state={{ from: location }} replace />;
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
                    { path: "/protected", element: <Protected /> },

                    { path: "/search", element: <Protected /> },

                    { path: "/rooms", element: <RoomList /> },
                    { path: "/rooms/:roomId", element: <Room /> },

                    { path: "/friends", element: <FriendList /> },

                    { path: "/friends/:friendId", element: <Protected /> },

                    { path: "/settings", element: <Protected /> },
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
