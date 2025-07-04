import { Outlet } from "react-router";
import { useAuth } from '@/context/AuthContext';

export default function Layout() {
    const { logout } = useAuth();

    return (
        <>
            <p onClick={logout}>logout</p>

            <Outlet />

        </>
    )
}
