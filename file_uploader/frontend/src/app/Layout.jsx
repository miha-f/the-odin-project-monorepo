import { Outlet } from "react-router-dom";
import Theme from "./Theme";

const Navbar = () => {
    return (
        <div className="
            flex flex-col items-center
            sm:flex-row sm:justify-between"
        >
            {/* Left */}
            <div className="">
                Logo
            </div>

            {/* Middle */}
            <div className="">
                serch
            </div>

            {/* Right */}
            <div className="flex flex-row gap-2">
                <p>User</p>
                <p>ligh/dark theme</p>
            </div>
        </div>
    );
};

const Layout = () => {
    return (
        <Theme>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow container mx-auto p-4">
                    <Outlet />
                </main>
            </div>
        </Theme>
    );
};

export default Layout;
