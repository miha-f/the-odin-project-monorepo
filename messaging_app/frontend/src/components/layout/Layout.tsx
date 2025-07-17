import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
    MessageCircle,
    Users,
    Settings,
    LogOut,
    Search,
    Menu,
} from "lucide-react";

function Layout() {
    const { logout } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuOnClick = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => setSidebarOpen(false);


    const sidebarIcons = [
        { icon: Search, href: "/search" },
        { icon: MessageCircle, href: "/rooms" },
        { icon: Users, href: "/friends" },
        { icon: Settings, href: "/settings" },
    ];

    return (
        <div className="flex h-screen bg-gray-50 text-gray-800">
            {/* Sidebar for desktop*/}
            <aside className="w-20 bg-white border-r border-gray-200 hidden sm:flex flex-col items-center py-6 shadow-sm">
                {/* Logo */}
                <div className="mb-10 -mt-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow">
                        C
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-6 flex-1 items-center">
                    {sidebarIcons.map(({ icon: Icon, href }, idx) => (
                        <Link
                            key={idx}
                            to={href}
                            className="group relative flex items-center justify-center"
                        >
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg transition bg-gray-100 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                                <Icon className="w-5 h-5" />
                            </div>
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <button onClick={logout} className="mt-auto mb-4 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 transition">
                    <LogOut className="w-5 h-5" />
                </button>
            </aside>

            {/* Sidebar for mobile */}
            <div
                className={`fixed inset-y-0 left-0 z-50
                        w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 shadow-sm
                        transform transition-transform duration-300
                        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                        sm:hidden`}
            >
                <div className="mb-10 -mt-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow">
                        C
                    </div>
                </div>

                {/* Nav items */}
                <nav className="flex flex-col gap-6 flex-1 items-start">
                    {sidebarIcons.map(({ icon: Icon, href }, idx) => (
                        <Link
                            key={idx}
                            to={href}
                            className="group relative flex items-center justify-center"
                        >
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg transition bg-gray-100 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                                <Icon className="w-5 h-5" />
                            </div>
                        </Link>
                    ))}
                </nav>

                <button onClick={logout} className="mt-auto mb-4 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 transition">
                    <LogOut className="w-5 h-5" />
                </button>
            </div>

            {/* Backdrop when sidebar is open */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-30 sm:hidden"
                    onClick={closeSidebar}
                ></div>
            )}


            {/* Main Content */}
            <div className="flex flex-col flex-1">
                {/* Header */}
                <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
                    <Menu onClick={menuOnClick} className="flex sm:hidden w-5 h-5" />
                    <h1 className="text-lg font-semibold">OurChat Admin</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                            M
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main className="flex-1 overflow-y-auto p-2 flex justify-center">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default React.memo(Layout);
