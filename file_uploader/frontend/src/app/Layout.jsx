import { useState, useEffect } from "react";
import { HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';
import { Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onToggleSidebar, user, onLogoutClick }) => {
    return (
        <nav className="
            flex border-b w-full shadow-md bg-primary text-background p-2
            flex-col items-start
            sm:flex-row sm:justify-between sm:items-center sm:h-16"
            aria-label="Header navigation"
        >
            {/* Left */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={onToggleSidebar}
                    id="sidebar-toggle"
                    className="sm:hidden"
                    aria-label="Toggle sidebar"
                    aria-controls="mobile-sidebar"
                    aria-expanded="false"
                >
                    <HamburgerMenuIcon className="w-5 h-5" />
                </button>
                <h1 className="font-bold text-2xl">File uploader</h1>
            </div>

            {/* Middle */}
            <div className="flex flex-col sm:flex-row">
                <p>Search</p>
            </div>

            {/* Right */}
            <div className="flex flex-col sm:flex-row sm:gap-2">
                <p>{user.user.username}</p>
                <p className="underline" onClick={onLogoutClick}>Logout</p>
            </div>
        </nav>
    );
};

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <>
            {/* What is not in the sidbar opacity (site gets "darkened") */}
            <div
                className={`fixed inset-0 bg-text 
                    z-30 transition-opacity sm:hidden 
                    ${isOpen ? 'opacity-70 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-surface
                    shadow-lg z-40 
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                    sm:translate-x-0 sm:static sm:block`}
            >
                {/* Close button */}
                <div className="flex justify-end p-4 sm:hidden">
                    <button onClick={onClose} aria-label="Close sidebar">
                        <Cross1Icon className="w-5 h-5 text-text" />
                    </button>
                </div>

                {/* Content */}
                <nav className="flex flex-col h-[calc(100vh-4rem)] justify-between space-y-4 p-4 text-text font-semibold">
                    <div className="flex flex-col">
                        <a href="/" className="hover:underline">Add new</a>
                        <a href="/upload" className="hover:underline">My drive</a>
                        <a href="/account" className="hover:underline">Recent</a>
                        <a href="/account" className="hover:underline">Shared with me</a>
                    </div>
                    <div className="">
                        <p>ligh/dark theme</p>
                    </div>
                </nav>
            </aside>
        </>
    );
};

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    // NOTE(miha): Need to have navigate in useEffect, otherwise we are
    // calling state update in render phase
    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [loading, user, navigate]);

    if (loading) return <p>Loading...</p>;
    if (!user) return null;

    return (
        <div className="">
            <Navbar
                user={user}
                onLogoutClick={logout}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className="flex flex-row">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="container mx-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
